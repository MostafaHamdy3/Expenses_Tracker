import React

// React Native reads the layout direction from RCTI18nUtil when it starts, so it is
// set natively before React starts and again before a reload after a language change.
enum AppLanguage {
  // UIKit decides the natural text alignment from the language the app launched in,
  // which stays the same after a reload, so it is taken from here instead.
  static var writingDirection: NSWritingDirection = .natural

  static func applyDirection(language: String) {
    let isRTL = Locale.characterDirection(forLanguage: language) == .rightToLeft
    RCTI18nUtil.sharedInstance().allowRTL(isRTL)
    RCTI18nUtil.sharedInstance().forceRTL(isRTL)
    writingDirection = isRTL ? .rightToLeft : .leftToRight
    _ = swizzleDefaultWritingDirection
  }

  private static let swizzleDefaultWritingDirection: Void = {
    guard
      let original = class_getClassMethod(
        NSParagraphStyle.self, #selector(NSParagraphStyle.defaultWritingDirection(forLanguage:))),
      let replacement = class_getClassMethod(
        NSParagraphStyle.self, #selector(NSParagraphStyle.appLanguage_defaultWritingDirection(forLanguage:)))
    else { return }
    method_exchangeImplementations(original, replacement)
  }()
}

extension NSParagraphStyle {
  // A nil language means the app's language; other languages keep the system answer.
  @objc fileprivate class func appLanguage_defaultWritingDirection(forLanguage language: String?) -> NSWritingDirection {
    if language == nil && AppLanguage.writingDirection != .natural {
      return AppLanguage.writingDirection
    }
    return appLanguage_defaultWritingDirection(forLanguage: language)
  }
}
