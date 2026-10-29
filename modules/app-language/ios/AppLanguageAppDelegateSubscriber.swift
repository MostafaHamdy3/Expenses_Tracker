import ExpoModulesCore

// Sets the layout direction before React starts, from the language the app actually
// runs in (the per-app language if set, otherwise the device language).
public class AppLanguageAppDelegateSubscriber: ExpoAppDelegateSubscriber {
  public func application(
    _ application: UIApplication,
    willFinishLaunchingWithOptions launchOptions: [UIApplication.LaunchOptionsKey: Any]? = nil
  ) -> Bool {
    AppLanguage.applyDirection(language: Bundle.main.preferredLocalizations.first ?? "en")
    return true
  }
}
