// file conversion and upload
import * as fs from 'fs';
import * as path from 'path';
import * as libre from 'libreoffice-convert';
//  Generic
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, MoreThan } from 'typeorm';
// DTOs
import { CreateWorkDto } from './dto/create-work.dto';
import { UpdateWorkDto } from './dto/update-work.dto';
// Entities & interfaces
import { WorkEntity } from './entities/work.entity';
import { Work } from './entities/work.interface';
import { KeywordEntity } from './entities/keyword.entity';
import { Keyword } from './entities/keyword.interface';
import { ContestEntity } from 'src/contests/entities/contest.entity';

@Injectable()
export class WorksService {
  constructor(
    @InjectRepository(WorkEntity)
    private readonly workRepository: Repository<WorkEntity>,
    @InjectRepository(KeywordEntity)
    private readonly keywordRepository: Repository<KeywordEntity>,
    @InjectRepository(ContestEntity)
    private readonly contestRepository: Repository<ContestEntity>,
  ) {}

  /**
   *
   */
  async create(createWorkDto: CreateWorkDto) {
    const contest = await this.contestRepository.findOne({
      id: createWorkDto.contestID,
    });
    if (contest) {
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
    } else {
      throw new Error("Contest doesn't exist");
    }
  }

  async addReadCount(id: number) {
    const timesRead = (await this.workRepository.findOne({ id })).timesRead;
    return this.workRepository.update({ id }, { timesRead: timesRead + 1 });
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
   * creates dir with given `id` and moves files there
   */
  async uploadDocument(file: Express.Multer.File, id: number) {
    if (this.hasDocument(id)) throw new Error('Files already exist');

    const fileExtension = path.extname(file.originalname);

    // creating empty folder
    fs.mkdirSync(path.join(`files/documents/${id}`));

    // converting
    if (fileExtension !== '.pdf') {
      this.convertFile(file.path, id, 'pdf');
      this.convertFile(file.path, id, 'epub');
    }

    // moving original file
    fs.renameSync(
      file.path,
      path.join(`files/documents/${id}/${id}${fileExtension}`),
    );
    return 'done';
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
    });
  }

  /**
   * Checks wether the work with given `id` already has assigned document.
   */
  hasDocument(id: number): boolean {
    return fs.existsSync(`files/documents/${id}`);
  }

  /**
   * returns all works with given parameters that are not disabled
   */
  async findAll(filterOptions): Promise<Work[]> {
    filterOptions.deleted = false;
    const works = await this.workRepository.find({ where: filterOptions });
    return works.map((work) => {
      work.dateAdded = Number(work.dateAdded);
      return work;
    });
  }

  /**
   * finds single work by `id` and returns it
   */
  async findOneByID(id: number): Promise<Work> {
    const work = await this.workRepository.findOne({
      where: { id, deleted: false },
    });
    work.dateAdded = Number(work.dateAdded);
    return work;
  }
  /**
   * Sets approveState to `rejected` and sets guarantor message
   */
  async rejectWork(
    id: number,
    guarantorEmail: string,
    guarantorMessage: string,
  ) {
    return await this.workRepository.update(
      { id: id },
      { approvedState: 'rejected', guarantorMessage, guarantorEmail },
    );
  }

  /**
   * Sets approveState to `approved` and adds work to to the nominated list of a contest
   */
  async approveWork(id: number) {
    this.workRepository
      .update({ id: id }, { approvedState: 'approved' })
      .then(async (updateResult) => {
        // Updating keywords
        const keywords = (await this.workRepository.findOne({ where: { id } }))
          .keywords;
        keywords.forEach((keyword) => {
          this.addKeyword(this.formatKeyword(keyword));
        });
        // Add workID to a contest nominated array
        const contestID = (await this.workRepository.findOne({ id })).contestID;
        const nominated = (
          await this.contestRepository.findOne({ id: contestID })
        ).nominated;
        nominated.push(id);

        this.contestRepository.update({ id: contestID }, { nominated });
        return updateResult;
      });
  }

  /**
   * If keyword doesn't exist add it, otherwise just `usedCount` + 1
   */
  async addKeyword(keyword: string) {
    const oldKeyword = await this.keywordRepository.findOne({
      where: { keyword },
    });
    if (oldKeyword) {
      return await this.keywordRepository.update(
        { keyword },
        { usedCount: oldKeyword.usedCount + 1 },
      );
    } else {
      const newKeyword = new KeywordEntity();
      newKeyword.keyword = keyword;
      return this.keywordRepository.save(newKeyword);
    }
  }

  /**
   * => `usedCount` - 1; if it is 0 then remove the keyword
   */
  async removeKeyword(keyword: string) {
    const oldKeyword = await this.keywordRepository.findOne({
      where: { keyword },
    });
    if (oldKeyword.usedCount === 1)
      return await this.keywordRepository.delete({ keyword });
    else
      return await this.keywordRepository.update(
        { keyword },
        { usedCount: oldKeyword.usedCount - 1 },
      );
  }

  /**
   * returns all keywords in descending order of uses
   */
  async getAllKeywords() {
    return (
      await this.keywordRepository.find({ order: { usedCount: 'DESC' } })
    ).map((keyword) => keyword.keyword);
  }

  /**
   *
   */
  formatKeyword(keyword: string): string {
    return (
      keyword.trim().charAt(0).toUpperCase() +
      keyword.trim().slice(1).toLowerCase()
    );
  }

  // update(id: number, updateWorkDto: UpdateWorkDto) {
  //   return `This action updates a #${id} work`;
  // }

  // remove(id: number) {
  //   return `This action removes a #${id} work`;
  // }
}
