export interface Graphic {
  _id: string;
  title: string;
  code: string;
  type: Graphictype;
  description?: string;
  active: boolean;
  model: string;
  queryType: 'find' | 'aggregate';
  query: string;
  select?: string;
  configs?: any;
  result?: any;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface Graphictype {
  _id: string;
  name: string;
}
