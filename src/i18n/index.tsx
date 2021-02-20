import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

import pt_BR from 'antd/es/locale/pt_BR';
import en_US from 'antd/es/locale/en_US';

import pt_br from './pt_br';
import en from './en';

export type Lang = 'en' | 'pt_br';

i18n.use(initReactI18next).init({
  resources: { en, pt_br },
  lng: 'pt_br',
  fallbackLng: 'en',
  interpolation: {
    escapeValue: false,
  },
});

export const getCurrentLang = (type = 'web'): string => {
  if (type === 'api') {
    return i18n.language.replace('_', '-');
  }
  return i18n.language;
};

export const antLang = {
  pt_br: pt_BR,
  en: en_US,
};

export default i18n;
