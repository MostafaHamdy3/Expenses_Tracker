import { TouchableOpacity, View, StyleSheet, ViewStyle } from "react-native";
import { Ionicons } from "@expo/vector-icons"
import { isRTL } from "../../assets/translation/resources";

interface IconButtonProps {
  icon: keyof typeof Ionicons.glyphMap;
  color: string;
  size: number;
  onPress: () => void;
  style?: ViewStyle;
}

export const IconButton = ({ icon, color, size , onPress, style}: IconButtonProps) => {
  return (
    <TouchableOpacity onPress={onPress}>
      <View style={styles.buttonContainer}>
        <Ionicons
          name={icon}
          color={color}
          size={size}
          style={[{transform: [{scaleX: isRTL() ? -1 : 1}]}, style]}
        />
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
