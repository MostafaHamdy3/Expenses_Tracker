package expo.modules.applanguage

import android.app.LocaleManager
import android.content.Context
import android.os.Build
import android.view.View
import androidx.core.app.LocaleManagerCompat
import androidx.core.text.TextUtilsCompat
import com.facebook.react.modules.i18nmanager.I18nUtil
import java.util.Locale

// React Native decides RTL from the device locales and ignores the per-app language,
// so the direction is set natively from the language the app actually runs in.
object AppLanguage {
  private const val PREFS_NAME = "expo.modules.applanguage"
  private const val LANGUAGE_KEY = "language"

  // Android 13+ keeps the per-app language in the system (also set from system settings);
  // older versions have no system setting, so it is kept in the app's preferences.
  fun getLanguage(context: Context): String? =
    if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.TIRAMISU) {
      context.getSystemService(LocaleManager::class.java).applicationLocales.get(0)?.language
    } else {
      context.getSharedPreferences(PREFS_NAME, Context.MODE_PRIVATE).getString(LANGUAGE_KEY, null)
    }

  fun saveLanguage(context: Context, language: String?) {
    if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.TIRAMISU) return
    context.getSharedPreferences(PREFS_NAME, Context.MODE_PRIVATE).edit().apply {
      if (language == null) remove(LANGUAGE_KEY) else putString(LANGUAGE_KEY, language)
    }.apply()
  }

  fun applyDirection(context: Context) {
    val locale = getLanguage(context)?.let { Locale.forLanguageTag(it) }
      ?: LocaleManagerCompat.getSystemLocales(context).get(0)
      ?: Locale.getDefault()
    val isRTL = TextUtilsCompat.getLayoutDirectionFromLocale(locale) == View.LAYOUT_DIRECTION_RTL
    I18nUtil.instance.allowRTL(context, isRTL)
    I18nUtil.instance.forceRTL(context, isRTL)
  }
}
