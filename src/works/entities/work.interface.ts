import { ApprovedState, Subject } from '../types';

export interface Work {
  id: number;
  deleted: boolean;
  name: string;
  dateAdded: number;
  authorName: string;
  authorEmail: string;
  contestID: number;
  subject: Subject;
  isMaturitaProject: boolean;
  keywords: string[];
  approvedState: ApprovedState;
  guarantorEmail: string;
  guarantorMessage: string;
}
