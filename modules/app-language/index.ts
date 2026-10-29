import { requireNativeModule } from "expo";

interface AppLanguageModule {
  getLanguage(): string | null;
  setLanguage(language: string | null): Promise<void>;
}

export default requireNativeModule<AppLanguageModule>("AppLanguage");
