import Animated, {
  interpolate,
  useAnimatedStyle,
} from "react-native-reanimated";

import { ExpenseItem, ExpenseItemProps } from "./ExpenseItem";

interface AnimatedExpenseItemProps {
  item: ExpenseItemProps;
  itemPosition: number;
  scrollY: Animated.SharedValue<number>;
}

const ANIMATION_THRESHOLD = 60;
const SCALE_RANGE = [1, 0.85];

export const AnimatedExpenseItem = ({ item, itemPosition, scrollY }: AnimatedExpenseItemProps) => {
  const animatedStyle = useAnimatedStyle(() => {
    const scrollProgress = (scrollY.value - itemPosition + ANIMATION_THRESHOLD) / ANIMATION_THRESHOLD;
    const scale = interpolate(scrollProgress, [0, 1], SCALE_RANGE, "clamp");
    return { transform: [{ scale }] };
  });

  return (
    <Animated.View style={animatedStyle}>
      <ExpenseItem
        id={item.id}
        title={item.title}
        amount={item.amount}
        date={item.date}
      />
    </Animated.View>
  );
};
