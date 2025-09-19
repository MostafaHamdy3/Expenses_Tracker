import React from "react";
import { StatusBar } from "expo-status-bar";

import { BottomSheetModalProvider } from "@gorhom/bottom-sheet";
import AppNavigation from "./app/AppNavigation";
import { FontLoader } from "./app/constants/FontLoader";
import { GestureHandlerRootView } from "react-native-gesture-handler";

export default function App() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <StatusBar style="auto" />
      <FontLoader>
        <BottomSheetModalProvider>
          <AppNavigation />
        </BottomSheetModalProvider>
      </FontLoader>
    </GestureHandlerRootView>
  );
}
