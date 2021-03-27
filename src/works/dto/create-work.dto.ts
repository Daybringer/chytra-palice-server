import { Subject } from '../types';

export class CreateWorkDto {
  readonly name: string;
  // FIXME change to proper type
  readonly file: string;
  // TODO  Check google domain for email and fill authorName
  authorName: string;
  authorEmail: string;
  contestID: number;
  keywords: string[];
  isMaturitaProject: boolean;
  subject: Subject;
}
