import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import * as Localization from 'expo-localization';

import { resources } from './resources';

export const defaultNS = 'common'

i18n.use(initReactI18next).init({
  resources,
  // lng: 'en',
  lng: Localization.getLocales()[0]?.languageCode === 'ar' ? 'ar' : 'en',
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