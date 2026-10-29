import { reloadAppAsync } from "expo";

import AppLanguage from "../../modules/app-language";
import { Language } from "../assets/translation/resources";

export type LanguagePreference = Language | "system";

// Language names are shown in their own language, not translated.
export const languageNames: Record<Language, string> = {
  ar: "العربية",
  en: "English",
};

export const isLanguagePreference = (value: unknown): value is LanguagePreference => (
  value === "system" || value === "ar" || value === "en"
);

export const getLanguagePreference = (): LanguagePreference => {
  const language = AppLanguage.getLanguage();
  return isLanguagePreference(language) ? language : "system";
};

// Sets the per-app language natively so text and direction always come from native,
// then reloads so React starts again with the new direction.
export const applyLanguagePreference = async (preference: LanguagePreference) => {
  if (preference === getLanguagePreference()) return;

  await AppLanguage.setLanguage(preference === "system" ? null : preference);
  await reloadAppAsync();
};
