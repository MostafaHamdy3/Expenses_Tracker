import React from "react";
import { TextInput, View, Text, StyleSheet, TextInputProps } from "react-native";
import { Colors } from "../../constants/Styles";
import { isRTL } from "../../assets/translation/resources";
import { fontsAR, fontsEN } from "../../constants/config";

interface InputProps {
  label?: string;
  textInputConfig: TextInputProps;
  customStyle?: TextInputProps['style'];
  isInvalid: boolean;
}

export const Input = ({ label, textInputConfig, isInvalid, customStyle }: InputProps) => {
  return (
    <View style={styles.inputContainer}>
      <Text style={styles.label}>{label}</Text>
      <TextInput 
        {...textInputConfig}
        style={[styles.input, isInvalid && styles.invalidInput, customStyle]} 
      />
    </View>
  )
}

const styles = StyleSheet.create({
  inputContainer: {
    marginVertical: 8,
  },
  label: {
    fontSize: 12,
    fontFamily: isRTL() ? fontsAR.medium : fontsEN.medium,
    color: Colors.mainColor,
    marginBottom: 4,
    marginHorizontal: 4,
  },
  input: {
    textAlign: isRTL() ? 'right' : 'left',
    fontSize: 17,
    fontFamily: isRTL() ? fontsAR.medium : fontsEN.medium,
    color: Colors.mainColor,
    backgroundColor: Colors.bgContainer,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: Colors.borderColor,
  },
  invalidInput: {
    borderColor: Colors.error500,
    borderWidth: 1,
  },
});
