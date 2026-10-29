Pod::Spec.new do |s|
  s.name           = 'AppLanguage'
  s.version        = '0.1.0'
  s.summary        = 'Sets the per-app language natively'
  s.description    = s.summary
  s.author         = ''
  s.homepage       = 'https://docs.expo.dev/modules/'
  s.platforms      = {
    :ios => '16.4'
  }
  s.source         = { git: '' }
  s.static_framework = true

  s.dependency 'ExpoModulesCore'
  s.dependency 'React-Core'

  s.pod_target_xcconfig = {
    'DEFINES_MODULE' => 'YES',
  }

  s.source_files = "**/*.{h,m,swift}"
end
