import { Subject, FileType } from '../types';

export class CreateWorkDto {
  readonly name: string;
  readonly fileType: FileType;
  readonly authorName: string;
  readonly authorEmail: string;
  readonly contestID: number;
  readonly keywords: string[];
  readonly isMaturitaProject: boolean;
  readonly subject: Subject;
}
