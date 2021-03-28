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
   * @param createWorkDto
   * @returns
   */
  async create(createWorkDto: CreateWorkDto, file) {
    const newWork = new WorkEntity();
    newWork.contestID = createWorkDto.contestID;
    newWork.name = createWorkDto.name;
    newWork.authorName = createWorkDto.authorName;
    newWork.authorEmail = createWorkDto.authorEmail;
    newWork.keywords = createWorkDto.keywords;
    newWork.isMaturitaProject = createWorkDto.isMaturitaProject;
    newWork.subject = createWorkDto.subject;
    return await this.workRepository.save(newWork);
  }

  /**
   *
   * @returns
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
