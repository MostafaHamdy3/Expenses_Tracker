package expo.modules.applanguage

import androidx.appcompat.app.AppCompatDelegate
import androidx.core.os.LocaleListCompat
import expo.modules.kotlin.exception.Exceptions
import expo.modules.kotlin.functions.Queues
import expo.modules.kotlin.modules.Module
import expo.modules.kotlin.modules.ModuleDefinition

// Uses the same per-app language API as the system settings, so the
// language and layout direction stay decided natively.
class AppLanguageModule : Module() {
  private val context
    get() = appContext.reactContext?.applicationContext ?: throw Exceptions.ReactContextLost()

  override fun definition() = ModuleDefinition {
    Name("AppLanguage")

    Function("getLanguage") {
      AppLanguage.getLanguage(context)
    }

    AsyncFunction("setLanguage") { language: String? ->
      AppCompatDelegate.setApplicationLocales(
        if (language == null) LocaleListCompat.getEmptyLocaleList()
        else LocaleListCompat.forLanguageTags(language)
      )
      AppLanguage.saveLanguage(context, language)
      AppLanguage.applyDirection(context)
    }.runOnQueue(Queues.MAIN)
  }
}
