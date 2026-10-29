import { Alert, Platform } from "react-native";
import { reloadAppAsync } from "expo";

import AppLanguage from "../../modules/app-language";
import i18n from "../assets/translation/config";
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

// Sets the per-app language natively so text and direction always come from native.
// Android applies it on reload; iOS applies it on the next launch.
export const applyLanguagePreference = async (preference: LanguagePreference) => {
  if (preference === getLanguagePreference()) return;

  await AppLanguage.setLanguage(preference === "system" ? null : preference);

  if (Platform.OS === "android") {
    await reloadAppAsync();
  } else {
    Alert.alert(i18n.t("language"), i18n.t("restartToApply"));
  }
};
