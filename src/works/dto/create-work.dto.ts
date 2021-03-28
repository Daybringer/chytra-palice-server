import { Subject } from '../types';

export class CreateWorkDto {
  readonly name: string;
  readonly file: string;
  readonly authorName: string;
  readonly authorEmail: string;
  readonly contestID: number;
  readonly keywords: string[];
  readonly isMaturitaProject: boolean;
  readonly subject: Subject;
}
