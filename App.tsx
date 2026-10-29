import "./global.css";

import React from "react";
import { StatusBar } from "expo-status-bar";
import { withUniwind } from "uniwind";

import { BottomSheetModalProvider } from "@gorhom/bottom-sheet";
import AppNavigation from "./app/AppNavigation";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { SafeAreaView } from "react-native-safe-area-context";

const StyledGestureHandlerRootView = withUniwind(GestureHandlerRootView);
const StyledSafeAreaView = withUniwind(SafeAreaView);

export default function App() {
  return (
    <StyledGestureHandlerRootView className="flex-1">
      <StatusBar style="auto" />
      <StyledSafeAreaView edges={["bottom"]} className="flex-1">
        <BottomSheetModalProvider>
          <AppNavigation />
        </BottomSheetModalProvider>
      </StyledSafeAreaView>
    </StyledGestureHandlerRootView>
  );
}
