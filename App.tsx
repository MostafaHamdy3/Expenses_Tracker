import React from "react";
import { StatusBar } from "expo-status-bar";
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';

import { BottomSheetModalProvider } from "@gorhom/bottom-sheet";
import AppNavigation from "./app/AppNavigation";
import { FontLoader } from "./app/constants/FontLoader";
import { GestureHandlerRootView } from "react-native-gesture-handler";

export default function App() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <SafeAreaView style={{ flex: 1 }}>
          <FontLoader>
            <StatusBar style="dark" />
            <BottomSheetModalProvider>
              <AppNavigation />
            </BottomSheetModalProvider>
          </FontLoader>
        </SafeAreaView>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
