import { JSX } from "react";
import { TouchableOpacity, View } from "react-native";

type IconButtonProps = {
  onPress: () => void;
  svgIcon?: JSX.Element;
};

export const IconButton = ({ svgIcon, onPress}: IconButtonProps) => {
  return (
    <TouchableOpacity onPress={onPress}>
      <View className="mx-1.5 rounded-3xl">
        {svgIcon}
      </View>
    </TouchableOpacity>
  )
}
