import ExpoModulesCore

// iOS stores the per-app language (the one picked in the Settings app) as
// `AppleLanguages` in the app's own defaults domain, and applies it on next launch.
// The direction is set right away, so a JS reload already shows the new language.
public class AppLanguageModule: Module {
  private let languagesKey = "AppleLanguages"

  public func definition() -> ModuleDefinition {
    Name("AppLanguage")

    Function("getLanguage") { () -> String? in
      guard let bundleId = Bundle.main.bundleIdentifier,
            let languages = UserDefaults.standard.persistentDomain(forName: bundleId)?[self.languagesKey] as? [String],
            let language = languages.first else {
        return nil
      }
      return Locale(identifier: language).language.languageCode?.identifier ?? language
    }

    AsyncFunction("setLanguage") { (language: String?) in
      if let language {
        UserDefaults.standard.set([language], forKey: self.languagesKey)
      } else {
        UserDefaults.standard.removeObject(forKey: self.languagesKey)
      }
      // Without a per-app language this falls back to the device languages.
      let preferences = UserDefaults.standard.stringArray(forKey: self.languagesKey) ?? []
      let resolved = Bundle.preferredLocalizations(from: Bundle.main.localizations, forPreferences: preferences).first
      AppLanguage.applyDirection(language: resolved ?? "en")
    }
  }
}
