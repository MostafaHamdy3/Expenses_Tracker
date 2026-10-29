import React, { useCallback } from "react";
import {
  Text,
  FlatList,
  View,
  ListRenderItem,
  RefreshControl,
  ActivityIndicator,
} from "react-native";

import { ExpenseItemProps } from "./ExpenseItem";
import { fonts } from "../../src/theme/fonts";
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
          colorsClassName="accent-primaryColor"
          tintColorClassName="accent-primaryColor"
        />
      }
      ListEmptyComponent={
        <Text className={`text-mainColor text-[20px] ${fonts.medium} mx-10.5 text-center mt-[50%] leading-7.5`}>
          {fallBackText}
        </Text>
      }
      ListFooterComponent={
        isLoadingMore
          ? <ActivityIndicator className="my-4" colorClassName="accent-primaryColor" />
          : <View className="h-3" />
      }
    />
  );
};
