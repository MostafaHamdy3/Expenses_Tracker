import { twMerge, type ClassNameValue } from "tailwind-merge";

// Joins classNames and lets later classes override conflicting earlier ones
// (e.g. a component's `customStyle` over its defaults).
export const cn = (...classNames: ClassNameValue[]) => twMerge(...classNames);
