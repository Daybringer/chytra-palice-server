import { Category } from '../types';
export interface Contest {
  id: number;
  name: string;
  dateEnding: number;
  dateAdded: number;
  running: boolean;
  deleted: boolean;
  category: Category;
  description: string;
  nominated: number[];
  first: number[];
  second: number[];
  third: number[];
}
