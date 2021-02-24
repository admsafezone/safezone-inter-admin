import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

import en_us from './en';

import pt_BR from 'antd/es/locale/pt_BR';
import en_US from 'antd/es/locale/en_US';

export const setLanguages = (langs = { en_us }, defaultLang = 'en_us', fallbackLng = 'en_us') => {
  i18n.use(initReactI18next).init({
    resources: langs,
    lng: defaultLang,
    fallbackLng,
    interpolation: {
      escapeValue: false,
    },
  });

  return i18n;
};

export const getCurrentLang = (type = 'web'): string => {
  if (i18n.language && type === 'api') {
    return i18n.language.replace('_', '-');
  }
  return i18n.language;
};

export const antLang = {
  pt_br: pt_BR,
  en_us: en_US,
};

setLanguages();

export default i18n;
