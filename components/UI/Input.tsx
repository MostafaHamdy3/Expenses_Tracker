import React from "react";
import { TextInput, View, Text, StyleSheet, TextInputProps } from "react-native";
import { Colors } from "../../constants/Styles";

interface InputProps {
  label: string;
  textInputConfig: TextInputProps;
  isInvalid: boolean;
}

export const Input = ({ label, textInputConfig, isInvalid }: InputProps) => {
  return (
    <View style={styles.inputContainer}>
      <Text style={styles.label}>{label}</Text>
      <TextInput 
        {...textInputConfig}
        style={[styles.input, isInvalid && styles.invalidInput]} 
      />
    </View>
  )
}

const styles = StyleSheet.create({
  inputContainer: {
    marginHorizontal: 4,
    marginVertical: 8,
  },
  label: {
    fontSize: 12,
    color: Colors.mainColor,
    marginBottom: 4,
    marginLeft: 4,
  },
  input: {
    fontSize: 18,
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
