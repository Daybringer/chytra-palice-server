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
   *
   */
  async uploadDocument(file: Express.Multer.File, id: number) {
    console.log(file, id);
    const temp = file.originalname.split('.');
    const fileExtension = temp[temp.length - 1];

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
   *
   */
  convertFile(filePath: string, workID: number, fileType: 'pdf' | 'epub') {
    console.log(filePath);
    const file = fs.readFileSync(filePath);

    libre.convert(file, fileType, undefined, (err, done) => {
      if (err) {
        console.log(`Error converting file: ${err}`);
      }

      fs.writeFileSync(`files/documents/${workID}/${workID}.${fileType}`, done);
    });
  }

  /**
   * Checks wether the work with given ID already has assigned document.
   */
  async hasDocument(id: number): Promise<boolean> {
    return;
  }

  /**
   * returns all works with given parameters that are not disabled
   */
  findAll() {
    return `This action returns all works`;
  }

  findOne(id: number) {
    return `This action returns a #${id} work`;
  }

  update(id: number, updateWorkDto: UpdateWorkDto) {
    return `This action updates a #${id} work`;
  }

  remove(id: number) {
    return `This action removes a #${id} work`;
  }
}
