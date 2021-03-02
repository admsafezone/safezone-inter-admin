import { createContext, useContext, useEffect, useState } from 'react';
import { Company, ThemeOptions, User } from 'interfaces';
import defaultService from 'services/defaultService';
import { sls } from 'utils/StorageUtils';
import Constants from 'utils/Constants';
import { useTranslation } from 'react-i18next';
import i18n, { setLanguages } from 'i18n';

export interface Theme {
  company?: Company;
  user?: User;
  options: ThemeOptions;
  t(key: string, options?: any): string;
  changeOptions(options: ThemeOptions): void;
  changeLogged(user?: User): void;
  toggleConfigTheme(): void;
  configThemeVisible?: boolean;
}

const userCompany = sls.getItem(Constants.storage.COMPANY) || null;
const loggedUser = sls.getItem(Constants.storage.USER) || null;
const userOptions = sls.getItem(Constants.storage.OPTIONS) || {
  theme: 'light',
  componentSize: 'middle',
  lang: 'pt_br',
  pagerLimit: 50,
  layout: 'sider-bar',
};

export const AppContext = createContext<Theme>({
  company: userCompany,
  user: loggedUser,
  options: userOptions,
  t: () => '',
  changeOptions: () => {},
  changeLogged: () => {},
  toggleConfigTheme: () => {},
  configThemeVisible: false,
});

export const AppProvider = ({ children }: any) => {
  const [company, setCompany] = useState<Company>(userCompany);
  const [user, setUser] = useState<User | undefined>(loggedUser);
  const [options, setOptions] = useState<ThemeOptions>(userOptions);
  const [configThemeVisible, setConfigThemeVisible] = useState(false);
  const { t } = useTranslation();

  const changeOptions = async (_options: ThemeOptions) => {
    setOptions(_options || options);
    sls.setItem(Constants.storage.OPTIONS, _options);

    if (_options.lang) {
      console.log(_options);
      sls.setItem(Constants.storage.LANG);
      await i18n.changeLanguage(_options.lang);
    }

    if (user?._id) {
      defaultService.put(`${Constants.api.USERS}/${user._id}`, { options: _options });
    }
  };

  const changeLogged = (_user?: User) => {
    setUser(_user);
    if (_user) {
      changeOptions(_user?.options || options);
    }
  };

  const toggleConfigTheme = () => {
    setConfigThemeVisible(!configThemeVisible);
  };

  const getCompany = async () => {
    const response = await defaultService.get(
      `${Constants.api.COMPANIES}/${user?.company?._id}?select=name theme identifier`,
    );
    sls.setItem(Constants.storage.COMPANY, response);
    setCompany(response);
  };

  const getLanguages = async () => {
    let languages = sls.getItem(Constants.storage.LANGUAGES) || [];

    if (!languages.length) {
      const response = await defaultService.get(`${Constants.api.LANGUAGES}/start/?origin=admin`);

      if (Object.keys(response).length) {
        sls.setItem(Constants.storage.LANGUAGES, response);
        languages = response || [];
      }
    }

    const resources: any = {};
    languages.forEach((language) => (resources[language.lang] = language.translation[language.lang]));

    if (Object.keys(resources).length) {
      setLanguages(resources, options.lang);
    }
  };

  useEffect(() => {
    if (user) {
      getCompany();
    }

    getLanguages();
  }, [, user]);

  return (
    <AppContext.Provider
      value={{ user, company, options, t, changeOptions, changeLogged, toggleConfigTheme, configThemeVisible }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => useContext(AppContext);
