import { JSX } from "react";
import { TouchableOpacity, View, StyleSheet, ViewStyle } from "react-native";

interface IconButtonProps {
  onPress: () => void;
  svgIcon?: JSX.Element;
}

export const IconButton = ({ svgIcon, onPress}: IconButtonProps) => {
  return (
    <TouchableOpacity onPress={onPress}>
      <View style={styles.buttonContainer}>
        {svgIcon}
      </View>
    </TouchableOpacity>
  )
}

interface Styles {
  buttonContainer: ViewStyle;
}

const styles = StyleSheet.create<Styles>({
  buttonContainer: {
    marginHorizontal: 6,
    borderRadius: 24,
  }
})
