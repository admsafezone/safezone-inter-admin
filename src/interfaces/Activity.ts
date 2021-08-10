import { User } from './User';

export interface Activity {
  _id: string;
  title: string;
  description?: string;
  content: string;
  active: boolean;
  type: string;
  lang?: string;
  image?: string;
  company?: any;
  data?: any;
  unique?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface Comment {
  _id: string;
  text: string;
  activity: string;
  company: string;
  user: User;
  active: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface Media {
  id: string;
  url: string;
  type: string;
}
