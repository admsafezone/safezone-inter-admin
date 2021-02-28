export interface Language {
  _id: string;
  name: string;
  idoCode: string;
  lang: string;
  translation: any;
  base: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}
