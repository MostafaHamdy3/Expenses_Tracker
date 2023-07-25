import { TouchableOpacity, View, Text, StyleSheet } from "react-native"
import { GlobalStyles } from "../../constants/Styles"

function Button({children, onPress, mode, style}) {
  return (
    <View style={style}>
      <TouchableOpacity onPress={onPress}>
        <View style={[styles.button, mode === 'flat' && styles.flat]}>
          <Text style={[styles.buttonText, mode === 'flat' && styles.textFlat]}>
            {children}
          </Text>
        </View>
      </TouchableOpacity>
    </View>
  )
}

const styles = StyleSheet.create({
  button: {
    padding: 8,
    borderRadius: 4,
    backgroundColor: GlobalStyles.colors.primary500,
  },
  flat: {
    backgroundColor: "transparent",
  },
  buttonText: {
    color: "white",
    textAlign: "center",
  },
  textFlat: {
    color: GlobalStyles.colors.primary200
  }
})

export default Button