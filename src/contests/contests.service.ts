import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { WorkEntity } from 'src/works/entities/work.entity';
import { Work } from 'src/works/entities/work.interface';
import { Repository } from 'typeorm';
// DTOs
import { CreateContestDto } from './dto/create-contest.dto';
import { SetWinnersDto } from './dto/set-winners.dto';
import { UpdateContestDto } from './dto/update-contest.dto';
// Entities & interfaces
import { ContestEntity } from './entities/contest.entity';
import { Contest } from './entities/contest.interface';

@Injectable()
export class ContestsService {
  constructor(
    @InjectRepository(ContestEntity)
    private readonly contestRepository: Repository<ContestEntity>,
    @InjectRepository(WorkEntity)
    private readonly workRepository: Repository<WorkEntity>,
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

  async findAll(filtered = true): Promise<Contest[]> {
    const contests = filtered
      ? await this.contestRepository.find({ deleted: false })
      : await this.contestRepository.find();
    return contests.map((contest) => {
      contest.dateAdded = Number(contest.dateAdded);
      contest.dateEnding = Number(contest.dateEnding);
      return contest;
    });
  }

  async findOneByID(id: number, filtered = true): Promise<Contest> {
    const contest = filtered
      ? await this.contestRepository.findOne({
          where: { id, deleted: false },
        })
      : await this.contestRepository.findOne({
          where: { id },
        });
    if (contest) {
      contest.dateAdded = Number(contest.dateAdded);
      contest.dateEnding = Number(contest.dateEnding);
    }

    return contest;
  }

  async setWinners(setWinnersDto: SetWinnersDto) {
    const id = setWinnersDto.id;
    const first = setWinnersDto.winners[0];
    const second = setWinnersDto.winners[1];
    const third = setWinnersDto.winners[2];

    return await this.contestRepository.update(
      { id },
      { first, second, third, running: false },
    );
  }

  async update(id: number, updateContestDto: UpdateContestDto) {
    const oldContest = await this.contestRepository.findOne({ id });
    if (updateContestDto.dateEnding != oldContest.dateEnding) {
      return await this.contestRepository.update(
        { id },
        {
          running: true,
          first: [],
          second: [],
          third: [],
          name: updateContestDto.name,
          description: updateContestDto.description,
          dateEnding: updateContestDto.dateEnding,
          category: updateContestDto.category,
        },
      );
    } else {
      return await this.contestRepository.update(
        { id },
        {
          name: updateContestDto.name,
          description: updateContestDto.description,
          category: updateContestDto.category,
        },
      );
    }
  }

  async remove(id: number) {
    const works = await this.workRepository.find({ contestID: id });
    works.forEach(async (work) => {
      await this.workRepository.update({ id: work.id }, { deleted: true });
    });
    return this.contestRepository.update({ id }, { deleted: true });
  }
}
