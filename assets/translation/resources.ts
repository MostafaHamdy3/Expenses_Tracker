import * as Localization from 'expo-localization';

import ar from "./ar.json"
import en from "./en.json"

const deviceLanguage = Localization.getLocales()[0]?.languageCode.split('-')[0] as keyof typeof resources;
const defaultLanguage: keyof typeof resources = ['ar', 'en'].includes(deviceLanguage) 
  ? deviceLanguage 
  : 'en';

export const resources = {
  ar: {
    translation: ar,
    default: ar,
  },
  en: {
    translation: en,
    default: en,
  }
} as const;

type Language = keyof typeof resources;

const RTL_LANGUAGES: Record<Language, boolean> = {
  en: false,
  ar: true,
}

export const isLanguageRTL = (language: Language): boolean => {
  return RTL_LANGUAGES[language];
};

export const isRTL = (): boolean => {
  return isLanguageRTL(defaultLanguage);
};