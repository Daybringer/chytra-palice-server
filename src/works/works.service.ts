// file conversion and upload
import * as fs from 'fs';
import * as path from 'path';
import * as libre from 'libreoffice-convert';
//  Generic
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
// DTOs
import { CreateWorkDto } from './dto/create-work.dto';
import { UpdateWorkDto } from './dto/update-work.dto';
// Entities & interfaces
import { WorkEntity } from './entities/work.entity';
import { Work } from './entities/work.interface';

@Injectable()
export class WorksService {
  constructor(
    @InjectRepository(WorkEntity)
    private readonly workRepository: Repository<WorkEntity>,
  ) {}

  /**
   *
   */
  async create(createWorkDto: CreateWorkDto) {
    const newWork = new WorkEntity();
    // TODO may exist some better way like spread syntax to assign props
    newWork.contestID = createWorkDto.contestID;
    newWork.name = createWorkDto.name;
    newWork.authorName = createWorkDto.authorName;
    newWork.authorEmail = createWorkDto.authorEmail;
    newWork.keywords = createWorkDto.keywords;
    newWork.isMaturitaProject = createWorkDto.isMaturitaProject;
    newWork.subject = createWorkDto.subject;
    newWork.fileType = createWorkDto.fileType;
    newWork.class = createWorkDto.class;
    newWork.dateAdded = Date.now();
    return await this.workRepository.save(newWork);
  }

  /**
   * assigns user information from jwt payload
   */
  inferUserInfoFromJWT(
    createWorkDto: CreateWorkDto,
    jwt: { email: string; name: string; isAdmin: boolean; sub: number },
  ): CreateWorkDto {
    const newCreateWorkDto = { ...createWorkDto };
    newCreateWorkDto.authorName = jwt.name;
    newCreateWorkDto.authorEmail = jwt.email;
    return newCreateWorkDto;
  }

  /**
   * creates dir with given ID and moves files there
   */
  async uploadDocument(file: Express.Multer.File, id: number) {
    if (this.hasDocument(id)) throw new Error('Files already exist');

    const fileExtension = path.extname(file.originalname);

    // creating empty folder
    fs.mkdirSync(path.join(`files/documents/${id}`));

    // converting
    if (fileExtension !== 'pdf') {
      this.convertFile(file.path, id, 'pdf');
      this.convertFile(file.path, id, 'epub');
    }

    // moving original file
    fs.renameSync(file.path, `files/documents/${id}/${id}.${fileExtension}`);
  }

  /**
   * converting files with libreoffice
   */
  convertFile(filePath: string, workID: number, fileType: 'pdf' | 'epub') {
    const file = fs.readFileSync(filePath);

    libre.convert(file, fileType, undefined, (err, done) => {
      if (err) {
        console.log(`Error converting file: ${err}`);
      }

      fs.writeFileSync(`files/documents/${workID}/${workID}.${fileType}`, done);
      return;
    });
  }

  /**
   * Checks wether the work with given ID already has assigned document.
   */
  hasDocument(id: number): boolean {
    return fs.existsSync(`files/documents/${id}`);
  }

  /**
   * returns all works with given parameters that are not disabled
   */
  async findAll(filterOptions = {}): Promise<Work[]> {
    console.log('hit: ', filterOptions);
    return await this.workRepository.find({ where: filterOptions });
  }

  /**
   * finds single work by ID and returns it
   */
  async findOneByID(id: number): Promise<Work> {
    const work = await this.workRepository.findOne({ where: { id } });

    return this.filterDeleted([work])[0];
  }

  filterDeleted(works: Work[]): Work[] {
    return works.filter((work) => {
      return !work.deleted;
    });
  }

  update(id: number, updateWorkDto: UpdateWorkDto) {
    return `This action updates a #${id} work`;
  }

  remove(id: number) {
    return `This action removes a #${id} work`;
  }
}
