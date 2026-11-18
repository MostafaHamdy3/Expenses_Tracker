import { I18nManager } from "react-native";

import ar from "./ar.json";
import en from "./en.json";

export const resources = {
  ar: {
    translation: ar,
    default: ar,
  },
  en: {
    translation: en,
    default: en,
  },
} as const;

export type Language = keyof typeof resources;

export const isRTL = (): boolean => I18nManager.isRTL;

export const appLanguage: Language = isRTL() ? "ar" : "en";
