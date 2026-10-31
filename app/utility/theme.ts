import AsyncStorage from "@react-native-async-storage/async-storage";
import { Uniwind } from "uniwind";

export type ThemePreference = "system" | "light" | "dark";

const THEME_KEY = "themePreference";

const isThemePreference = (value: unknown): value is ThemePreference => (
  value === "system" || value === "light" || value === "dark"
);

export const getThemePreference = (): ThemePreference => (
  Uniwind.hasAdaptiveThemes ? "system" : (Uniwind.currentTheme as ThemePreference)
);

// Restores the saved theme; call before the first screen is shown to avoid a flash.
export const loadThemePreference = async () => {
  try {
    const preference = await AsyncStorage.getItem(THEME_KEY);
    if (isThemePreference(preference) && preference !== "system") {
      Uniwind.setTheme(preference);
    }
  } catch (err) {
    console.log("loadThemePreference ERROR ==>", err);
  }
};

export const applyThemePreference = async (preference: ThemePreference) => {
  Uniwind.setTheme(preference);
  try {
    await AsyncStorage.setItem(THEME_KEY, preference);
  } catch (err) {
    console.log("applyThemePreference ERROR ==>", err);
  }
};
