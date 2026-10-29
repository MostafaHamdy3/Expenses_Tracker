import { useCSSVariable } from "uniwind";

import { themeColors, type ThemeColor } from "./colors";

const colorVariables = themeColors.map((color) => `--color-${color}`);

// For props that take a color value instead of a className (navigator tint, SVG `color`, ...).
export const useTheme = () => {
  const values = useCSSVariable(colorVariables);

  const getThemeColor = (color: ThemeColor): string =>
    String(values[themeColors.indexOf(color)] ?? "");

  return { getThemeColor };
};
