import { TextInput, View, Text, StyleSheet } from "react-native";
import { Colors } from "../../constants/Styles";

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
    color: Colors.textColor1,
  },
  input: {
    fontSize: 18,
    color: Colors.darkBg,
    backgroundColor: Colors.textColor1,
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 6,
  },
  invalidLabel: {
    color: Colors.error500,
  },
  invalidInput: {
    backgroundColor: Colors.error50
  },
})

export default Input;