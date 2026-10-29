import React from "react";
import { TouchableOpacity, Text } from "react-native"
import { Indicator } from "./Indicator";
import { cn } from "../../../src/utils/cn";
import { fonts } from "../../../src/theme/fonts";

type ButtonProps = {
  btnText: string;
  onPress: () => void;
  isLoading?: boolean;
  disabled?: boolean;
  customStyle?: string;
  textStyle?: string;
  loadingColorClassName?: string;
};

export const Button = ({
  btnText,
  onPress,
  isLoading,
  disabled,
  customStyle,
  textStyle,
  loadingColorClassName = "accent-white",
}: ButtonProps) => {
  return (
    <TouchableOpacity
      className={cn("w-[45%] h-11.5 justify-center items-center rounded-xl m-2.5 bg-primaryColor", customStyle)}
      onPress={onPress}
      disabled={disabled}
      activeOpacity={0.7}
    >
      {isLoading
        ? <Indicator size="small" colorClassName={loadingColorClassName} />
        : <Text className={cn(`text-white text-center text-[15px] ${fonts.medium}`, textStyle)}>{btnText}</Text>
      }
    </TouchableOpacity>
  );
};
