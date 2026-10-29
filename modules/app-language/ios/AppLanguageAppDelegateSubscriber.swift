import ExpoModulesCore
import React

// Sets the layout direction before React starts, from the language the app actually
// runs in (the per-app language if set, otherwise the device language).
public class AppLanguageAppDelegateSubscriber: ExpoAppDelegateSubscriber {
  public func application(
    _ application: UIApplication,
    willFinishLaunchingWithOptions launchOptions: [UIApplication.LaunchOptionsKey: Any]? = nil
  ) -> Bool {
    let language = Bundle.main.preferredLocalizations.first ?? "en"
    let isRTL = Locale.characterDirection(forLanguage: language) == .rightToLeft
    RCTI18nUtil.sharedInstance().allowRTL(isRTL)
    RCTI18nUtil.sharedInstance().forceRTL(isRTL)
    return true
  }
}
