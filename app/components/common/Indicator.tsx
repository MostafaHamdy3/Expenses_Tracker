import React from "react";
import { ActivityIndicator, View } from "react-native";
import { cn } from "../../../src/utils/cn";

type IndicatorProps = {
  size?: "small" | "large";
  colorClassName?: string;
  customStyle?: string;
};

export const Indicator = ({ size = "large", colorClassName = "accent-primaryColor", customStyle }: IndicatorProps) => {
  return (
    <View className={cn("flex-1 justify-center items-center p-6", customStyle)}>
      <ActivityIndicator size={size} colorClassName={colorClassName} />
    </View>
  );
};
