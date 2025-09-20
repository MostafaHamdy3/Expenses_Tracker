import React from "react";
import { StatusBar } from "expo-status-bar";

import { BottomSheetModalProvider } from "@gorhom/bottom-sheet";
import AppNavigation from "./app/AppNavigation";
import { FontLoader } from "./app/constants/FontLoader";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { SafeAreaView } from "react-native-safe-area-context";

export default function App() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <StatusBar style="auto" />
      <SafeAreaView edges={["bottom"]} style={{ flex: 1 }}>
        <FontLoader>
          <BottomSheetModalProvider>
            <AppNavigation />
          </BottomSheetModalProvider>
        </FontLoader>
      </SafeAreaView>
    </GestureHandlerRootView>
  );
}
