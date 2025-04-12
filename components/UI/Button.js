import { TouchableOpacity, Text, StyleSheet } from "react-native"
import { Colors } from "../../constants/Styles"
import Indicator from "./Indicator";

const Button = ({children, onPress, isLoading, disabled, btnStyle, textStyle}) => {
  return (
    <TouchableOpacity
      style={[styles.button, btnStyle]}
      onPress={onPress}
      disabled={disabled}
      activeOpacity={0.7}
    >
      {isLoading
        ? <Indicator size="small" color={btnStyle && Colors.darkBg} /> 
        : <Text style={[styles.buttonText, textStyle]}>{children}</Text>
      }
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    width: '45%',
    height: 40,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 12,
    margin: 10,
    backgroundColor: Colors.backgroundScreen,
  },
  buttonText: {
    color: "white",
    textAlign: "center",
    fontSize: 15,
    fontWeight: '500',
  },
})

export default Button