import React from "react";
import { ActivityIndicator, View, StyleSheet, ViewStyle } from "react-native";
import { Colors } from "../../constants/Styles";

interface IndicatorProps {
  size?: "small" | "large";
  color?: string;
  indicatorStyle?: ViewStyle;
}

export const Indicator = ({ size = "large", color = Colors.white, indicatorStyle }: IndicatorProps) => {
  return (
    <View style={[styles.container, indicatorStyle]}>
      <ActivityIndicator size={size} color={color} />
    </View>
  );
};

interface Styles {
  container: ViewStyle;
}

const styles = StyleSheet.create<Styles>({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  }
})
