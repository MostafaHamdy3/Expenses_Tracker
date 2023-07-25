import { TextInput, View, Text, StyleSheet } from "react-native";
import { GlobalStyles } from "../../constants/Styles";

function Input({label, textInputConfig, isInvalid}) {
  return (
    <View style={styles.inputContainer}>
      <Text style={[styles.label, isInvalid && styles.invalidLabel]}>{label}</Text>
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
    color: GlobalStyles.colors.primary100,
  },
  input: {
    fontSize: 18,
    color: GlobalStyles.colors.primary700,
    backgroundColor: GlobalStyles.colors.primary100,
    padding: 6,
    borderRadius: 6,
  },
  invalidLabel: {
    color: GlobalStyles.colors.error500,
  },
  invalidInput: {
    backgroundColor: GlobalStyles.colors.error50
  },
})

export default Input;