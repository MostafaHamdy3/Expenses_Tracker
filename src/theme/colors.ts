// Mirrors the --color-* tokens in global.css; add a token in both places.
export const themeColors = [
  "bgScreen",
  "bgContainer",
  "borderColor",
  "mainColor",
  "white",
  "primaryColor",
  "lightBg",
  "darkBg",
  "shadowColor",
  "error500",
  "secondaryColor",
  "placeholderColor",
  "overlay",
] as const;

export type ThemeColor = (typeof themeColors)[number];
