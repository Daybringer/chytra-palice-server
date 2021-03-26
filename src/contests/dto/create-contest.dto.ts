import { Category } from '../types';

export class CreateContestDto {
  readonly name: string;
  readonly dateEnding: number;
  readonly category: Category;
  readonly description: string;
}
