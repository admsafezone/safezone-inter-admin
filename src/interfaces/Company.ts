export interface ThemeModePart {
  backgroundColor?: string;
  fontColor?: string;
  fontHoverColor?: string;
}

export interface ThemeMode {
  logo?: string;
  backgroundTop?: string;
  background?: string;
  primaryColor?: string;
  secondaryColor?: string;
  header?: ThemeModePart;
  ranking?: ThemeModePart;
  activity?: ThemeModePart;
}

export interface Theme {
  mode: 'light' | 'dark' | string;
  light?: ThemeMode;
  dark?: ThemeMode;
}

export interface Company {
  _id: string;
  name: string;
  identifier: string;
  active: boolean;
  domains: string[];
  origins: string[];
  theme?: Theme;
  options?: any;
  createdAt?: Date;
  updatedAt?: Date;
}
