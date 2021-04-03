import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
// DTOs
import { CreateContestDto } from './dto/create-contest.dto';
import { UpdateContestDto } from './dto/update-contest.dto';
// Entities & interfaces
import { ContestEntity } from './entities/contest.entity';
import { Contest } from './entities/contest.interface';

@Injectable()
export class ContestsService {
  constructor(
    @InjectRepository(ContestEntity)
    private readonly contestRepository: Repository<ContestEntity>,
  ) {}
  /**
   *
   * @param createContestDto
   * @returns Contest
   */
  async create(createContestDto: CreateContestDto): Promise<Contest> {
    const newContest = new ContestEntity();
    newContest.name = createContestDto.name;
    newContest.description = createContestDto.description;
    newContest.category = createContestDto.category;
    newContest.dateEnding = createContestDto.dateEnding;
    newContest.dateAdded = Date.now();
    return await this.contestRepository.save(newContest);
  }

  findAll() {
    return `This action returns all contests`;
  }

  async findOneByID(id: number): Promise<Contest> {
    return await this.contestRepository.findOne({ where: { id } });
  }

  update(id: number, updateContestDto: UpdateContestDto) {
    return `This action updates a #${id} contest`;
  }

  remove(id: number) {
    return `This action removes a #${id} contest`;
  }
}
