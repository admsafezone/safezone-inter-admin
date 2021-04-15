import { Company } from './Company';

export interface Graphic {
  _id: string;
  title: string;
  code: string;
  type: string;
  description?: string;
  active: boolean;
  model: string;
  queryType: 'find' | 'aggregate' | 'count';
  query: string;
  select?: string;
  configs?: any;
  excludedCompanies?: Company[] | string[];
  createdAt?: Date;
  updatedAt?: Date;
}
