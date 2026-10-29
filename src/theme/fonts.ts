import { isRTL } from "../../app/assets/translation/resources";

// Arabic text uses Tajawal and English text Source Sans 3. Direction is set natively
// before React starts, so the choice is made once. Numbers use font-num-medium / font-num-bold.
export const fonts = isRTL()
  ? { regular: "font-ar-regular", medium: "font-ar-medium", bold: "font-ar-bold" }
  : { regular: "font-en-regular", medium: "font-en-medium", bold: "font-en-bold" };
