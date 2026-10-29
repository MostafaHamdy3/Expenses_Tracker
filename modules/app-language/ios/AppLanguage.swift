import React

// React Native reads the layout direction from RCTI18nUtil when it starts, so it is
// set natively before React starts and again before a reload after a language change.
enum AppLanguage {
  static func applyDirection(language: String) {
    let isRTL = Locale.characterDirection(forLanguage: language) == .rightToLeft
    RCTI18nUtil.sharedInstance().allowRTL(isRTL)
    RCTI18nUtil.sharedInstance().forceRTL(isRTL)
  }
}
