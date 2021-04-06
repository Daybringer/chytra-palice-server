export interface Post {
  id: number;
  title: string;
  author: string;
  dateAdded: number;
  content: string;
  pictures: string[];
  deleted: boolean;
}
