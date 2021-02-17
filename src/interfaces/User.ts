import { Lang } from 'i18n';

export type AppTheme = 'light' | 'dark' | undefined;
export type ComponentSize = 'large' | 'middle' | 'small' | undefined;

export interface ThemeOptions {
  theme: AppTheme;
  componentSize: ComponentSize;
  lang: Lang;
  pagerLimit?: number;
}

export interface Resource {
  _id: number;
  defaultPermission: string;
  name: string;
  aclResource: string;
}
export interface Profile {
  _id: number;
  name: string;
  acl: any;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface Company {
  _id: string;
  id: string;
  name: string;
  identifier: string;
  active: boolean;
  domains: string[];
  origins: string[];
  theme?: any;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface User {
  _id: string;
  name: string;
  email: string;
  active: boolean;
  profiles: any[];
  options?: ThemeOptions;
  company?: Company;
  createdAt?: Date;
  updatedAt?: Date;
}
