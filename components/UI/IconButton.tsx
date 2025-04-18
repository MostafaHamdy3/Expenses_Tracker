import { TouchableOpacity, View, StyleSheet, StyleProp, ViewStyle } from "react-native";
import { Ionicons } from "@expo/vector-icons"

interface IconButtonProps {
  icon: string;
  color: string;
  size: number;
  onPress: () => void;
}

export const IconButton = ({ icon, color, size , onPress}: IconButtonProps) => {
  return (
    <TouchableOpacity onPress={onPress}>
      <View style={styles.buttonContainer}>
        <Ionicons name={icon} color={color} size={size} />
      </View>
    </TouchableOpacity>
  )
}

interface Styles {
  buttonContainer: StyleProp<ViewStyle>;
}

const styles = StyleSheet.create<Styles>({
  buttonContainer: {
    padding: 6,
    marginHorizontal: 8,
    marginVertical: 2,
    borderRadius: 24,
  }
})
