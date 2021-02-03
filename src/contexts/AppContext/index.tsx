import { ThemeOptions, User } from 'interfaces';
import React from 'react';

export interface Theme {
  options: ThemeOptions;
  t(key: string): string;
  changeOptions(options: ThemeOptions): void;
  changeLogged(user?: User): void;
}

const AppContext = React.createContext<Theme>({
  options: {
    theme: 'light',
    componentSize: 'middle',
    lang: 'pt_br',
  },
  t: () => '',
  changeOptions: () => {},
  changeLogged: () => {},
});

export default AppContext;
