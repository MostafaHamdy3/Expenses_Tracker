import React, { useEffect, useState } from 'react';
import { View, ActivityIndicator } from 'react-native';
import * as Font from 'expo-font';

export const FontLoader: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [fontsLoaded, setFontsLoaded] = useState(false);

  useEffect(() => {
    async function loadFonts() {
      await Font.loadAsync({
        'Tajawal-Regular': require('../assets/fonts/Tajawal-Regular.ttf'),
        'Tajawal-Medium': require('../assets/fonts/Tajawal-Medium.ttf'),
        'Tajawal-Bold': require('../assets/fonts/Tajawal-Bold.ttf'),
        'SourceSans3-Regular': require('../assets/fonts/SourceSans3-Regular.ttf'),
        'SourceSans3-Medium': require('../assets/fonts/SourceSans3-Medium.ttf'),
        'SourceSans3-Bold': require('../assets/fonts/SourceSans3-Bold.ttf'),
        'Quicksand-Medium': require('../assets/fonts/Quicksand-Medium.ttf'),
        'Quicksand-Bold': require('../assets/fonts/Quicksand-Bold.ttf'),
      });
      setFontsLoaded(true);
    }

    loadFonts();
  }, []);

  if (!fontsLoaded) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return <>{children}</>;
};