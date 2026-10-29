import React from "react";
import { TextInput, View, Text, TextInputProps } from "react-native";
import { cn } from "../../../src/utils/cn";
import { fonts } from "../../../src/theme/fonts";

type InputProps = {
  label?: string;
  textInputConfig: TextInputProps;
  customStyle?: string;
  isInvalid: boolean;
};

export const Input = ({ label, textInputConfig, isInvalid, customStyle }: InputProps) => {
  return (
    <View className="my-2">
      <Text className={`text-[12px] ${fonts.medium} text-mainColor mb-1 mx-1`}>{label}</Text>
      <TextInput 
        {...textInputConfig}
        className={cn(
          `text-left text-[17px] ${fonts.medium} text-mainColor bg-bgContainer py-2 px-3 rounded-lg border border-borderColor`,
          isInvalid && "border-error500",
          customStyle,
        )} 
      />
    </View>
  )
}
