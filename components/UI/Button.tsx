import React from "react";
import { TouchableOpacity, Text, StyleSheet, ViewStyle, TextStyle } from "react-native"
import { Colors } from "../../constants/Styles"
import { Indicator } from "./Indicator";
import { isRTL } from "../../assets/translation/resources";
import { fontsAR, fontsEN } from "../../constants/config";

interface ButtonProps {
  btnText: string;
  onPress: () => void;
  isLoading?: boolean;
  disabled?: boolean;
  btnStyle?: ViewStyle;
  textStyle?: TextStyle;
  loadingColor?: string;
}

export const Button = ({
  btnText,
  onPress,
  isLoading,
  disabled,
  btnStyle,
  textStyle,
  loadingColor,
}: ButtonProps) => {
  return (
    <TouchableOpacity
      style={[styles.button, btnStyle]}
      onPress={onPress}
      disabled={disabled}
      activeOpacity={0.7}
    >
      {isLoading
        ? <Indicator size="small" color={loadingColor || Colors.white} /> 
        : <Text style={[styles.buttonText, textStyle]}>{btnText}</Text>
      }
    </TouchableOpacity>
  );
};

interface Styles {
  button: ViewStyle;
  buttonText: TextStyle;
}

const styles = StyleSheet.create<Styles>({
  button: {
    width: '45%',
    height: 46,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 12,
    margin: 10,
    backgroundColor: Colors.primaryColor,
  },
  buttonText: {
    color: Colors.white,
    textAlign: "center",
    fontSize: 15,
    fontFamily: isRTL() ? fontsAR.medium : fontsEN.medium,
  },
});
