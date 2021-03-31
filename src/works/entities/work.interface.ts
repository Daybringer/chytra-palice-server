import { ApprovedState, Class, Subject } from '../types';

export interface Work {
  id: number;
  deleted: boolean;
  name: string;
  dateAdded: number;
  authorName: string;
  authorEmail: string;
  contestID: number;
  timesRead: number;
  class: Class;
  subject: Subject;
  isMaturitaProject: boolean;
  keywords: string[];
  approvedState: ApprovedState;
  guarantorEmail: string;
  guarantorMessage: string;
}
