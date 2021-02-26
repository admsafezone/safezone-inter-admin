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
  createdAt?: Date;
  updatedAt?: Date;
}

export interface Media {
  id: string;
  url: string;
  type: string;
}
