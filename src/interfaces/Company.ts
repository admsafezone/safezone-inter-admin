export interface Company {
  _id: string;
  name: string;
  identifier: string;
  active: boolean;
  domains: string[];
  origins: string[];
  theme?: any;
  options?: any;
  createdAt?: Date;
  updatedAt?: Date;
}
