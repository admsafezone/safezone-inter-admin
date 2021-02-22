import { createContext, useContext, useEffect, useState } from 'react';
import { ThemeOptions, User } from 'interfaces';
import defaultService from 'services/defaultService';
import { sls } from 'utils/StorageUtils';
import Constants from 'utils/Constants';
import { useTranslation } from 'react-i18next';
import i18n from 'i18n';

export interface Theme {
  company?: any;
  user?: User;
  options: ThemeOptions;
  t(key: string): string;
  changeOptions(options: ThemeOptions): void;
  changeLogged(user?: User): void;
}

const userCompany = sls.getItem(Constants.storage.COMPANY) || null;
const loggedUser = sls.getItem(Constants.storage.USER) || null;

export const AppContext = createContext<Theme>({
  company: userCompany,
  user: loggedUser,
  options: {
    theme: 'light',
    componentSize: 'middle',
    lang: 'pt_br',
  },
  t: () => '',
  changeOptions: () => {},
  changeLogged: () => {},
});

export const AppProvider = ({ children }: any) => {
  const [company, setCompany] = useState<any>(userCompany);
  const [user, setUser] = useState<User | undefined>(loggedUser);
  const [options, setOptions] = useState<ThemeOptions>(
    user?.options || { theme: 'light', componentSize: 'middle', lang: 'pt_br' },
  );
  const { t } = useTranslation();

  const changeOptions = async (_options: ThemeOptions) => {
    setOptions(_options || options);

    if (_options.lang) {
      sls.setItem(Constants.storage.LANG, _options.lang.replaceAll('_', '-'));
      await i18n.changeLanguage(_options.lang);
    }

    if (user?._id) {
      defaultService.put(`${Constants.api.USERS}/${user._id}`, { options: _options });
    }
  };

  function changeLogged(_user?: User) {
    setUser(_user);
    if (_user) {
      setOptions(_user?.options || options);
    }
  }

  const getCompany = async () => {
    const response = await defaultService.get(
      `${Constants.api.COMPANIES}/${user?.company?._id}?select=name theme identifier`,
    );
    sls.setItem(Constants.storage.COMPANY, response);
    setCompany(response);
  };

  useEffect(() => {
    if (user) {
      getCompany();
    }
  }, [user]);

  return (
    <AppContext.Provider value={{ user, company, options, t, changeOptions, changeLogged }}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => useContext(AppContext);
