import React, { useCallback } from "react";
import {
  Text,
  StyleSheet,
  FlatList,
  TextStyle,
  View,
  ListRenderItem,
  RefreshControl,
  ActivityIndicator,
  ViewStyle,
} from "react-native";

import { Colors } from "../constants/Styles";
import { ExpenseItemProps } from "./ExpenseItem";
import { isRTL } from "../assets/translation/resources";
import { fontsAR, fontsEN } from "../constants/config";
import { AnimatedExpenseItem } from "./AnimatedExpenseItem";

import Animated, {
  useAnimatedScrollHandler,
  useSharedValue,
} from "react-native-reanimated";

interface ExpensesOutputProps {
  expenses: ExpenseItemProps[];
  fallBackText: string;
  refreshing: boolean;
  onRefresh: () => void;
  onEndReached: () => void;
  isLoadingMore: boolean;
}

const AnimatedFlatList = Animated.createAnimatedComponent(FlatList<ExpenseItemProps>);
const ITEM_HEIGHT = 70;

export const ExpensesOutput = ({
  expenses,
  fallBackText,
  refreshing,
  onRefresh,
  onEndReached,
  isLoadingMore,
}: ExpensesOutputProps) => {
  const scrollY = useSharedValue(0);

  const scrollHandler = useAnimatedScrollHandler({onScroll: (event) => {
    scrollY.value = event.contentOffset.y;
  }});

  const renderItem: ListRenderItem<ExpenseItemProps> = useCallback(({ item, index }) => {
    const itemPosition = index * ITEM_HEIGHT + 60;

    return (
      <AnimatedExpenseItem
        item={item}
        itemPosition={itemPosition}
        scrollY={scrollY}
      />
    );
  }, []);

  return (
    <AnimatedFlatList
      data={expenses}
      keyExtractor={(item: ExpenseItemProps) => item.id}
      renderItem={renderItem}
      onScroll={scrollHandler}
      scrollEventThrottle={16}
      onEndReached={onEndReached}
      onEndReachedThreshold={0.5}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={onRefresh}
          colors={[Colors.primaryColor]}
          tintColor={Colors.primaryColor}
        />
      }
      ListEmptyComponent={<Text style={styles.infoText}>{fallBackText}</Text>}
      ListFooterComponent={
        isLoadingMore
          ? <ActivityIndicator style={styles.footerIndicator} color={Colors.primaryColor} />
          : <View style={{ height: 12 }} />
      }
    />
  );
};

interface Styles {
  infoText: TextStyle;
  footerIndicator: ViewStyle;
}

const styles = StyleSheet.create<Styles>({
  infoText: {
    color: Colors.mainColor,
    fontSize: 20,
    fontFamily: isRTL() ? fontsAR.medium : fontsEN.medium,
    marginHorizontal: 42,
    textAlign: "center",
    marginTop: "50%",
    lineHeight: 30,
  },
  footerIndicator: {
    marginVertical: 16,
  },
});
