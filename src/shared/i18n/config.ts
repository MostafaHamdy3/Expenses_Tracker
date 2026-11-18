import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

import { appLanguage, resources } from './resources';

export const defaultNS = 'common'

i18n.use(initReactI18next).init({
  resources,
  lng: appLanguage,
  fallbackLng: 'en',
  compatibilityJSON: 'v4',
  fallbackNS: 'default',
  ns: [defaultNS],
  defaultNS,
  interpolation: {
    escapeValue: false,
  }
});

export default i18n;