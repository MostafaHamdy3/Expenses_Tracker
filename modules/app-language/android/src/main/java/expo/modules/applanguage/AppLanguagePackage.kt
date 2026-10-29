package expo.modules.applanguage

import android.app.Application
import android.content.Context
import android.content.res.Configuration
import expo.modules.core.interfaces.ApplicationLifecycleListener
import expo.modules.core.interfaces.Package

class AppLanguagePackage : Package {
  override fun createApplicationLifecycleListeners(context: Context): List<ApplicationLifecycleListener> {
    return listOf(object : ApplicationLifecycleListener {
      // Runs before React loads, so the first render already has the right direction.
      override fun onCreate(application: Application) {
        AppLanguage.applyDirection(application)
      }

      // The language changed from system settings while the app is running; JS reloads after this.
      override fun onConfigurationChanged(newConfig: Configuration) {
        AppLanguage.applyDirection(context.applicationContext)
      }
    })
  }
}
