import React, { useEffect, useState } from "react";
import { Pressable, Text, View } from "react-native";

import { ExpensesOutput } from "../components/ExpensesOutput";
import i18n from "../assets/translation/config";
import { useExpenseStore } from "../store/ExpenseStore";
import { NavigationHeader } from "../components/common/NavigationHeader";
import { Indicator } from "../components/common/Indicator";
import { ExpensesPeriod, nFormatter } from "../utility/utility";
import { cn } from "../../src/utils/cn";
import { fonts } from "../../src/theme/fonts";

const FILTERS: { period: ExpensesPeriod; label: string; fallBackText: string }[] = [
  { period: "all", label: "all", fallBackText: "noExpenses" },
  { period: "year", label: "thisYear", fallBackText: "noExpensesThisYear" },
  { period: "month", label: "thisMonth", fallBackText: "noExpensesThisMonth" },
];

const totalText = "text-[18px] font-num-bold text-primaryColor";

export const Expenses = () => {
  const {
    expenses,
    total,
    isLoadingMore,
    fetchExpenses,
    fetchMoreExpenses,
  } = useExpenseStore();

  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [period, setPeriod] = useState<ExpensesPeriod>("all");

  useEffect(() => {
    let isActive = true;
    const fetchData = async () => {
      setIsLoading(true);
      await fetchExpenses(period);
      isActive && setIsLoading(false);
    }
    fetchData();
    return () => { isActive = false };
  }, [period]);

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchExpenses(period);
    setRefreshing(false);
  };

  const activeFilter = FILTERS.find((filter) => filter.period === period);

  return (
    <View className="flex-1 bg-bgScreen">
      <NavigationHeader
        title={i18n.t("Expenses")}
        showLogoutIcon={true}
      />
      <View className="flex-row justify-between items-center mx-4 mt-4 mb-2 gap-2">
        <View className="flex-row gap-1.5">
          {FILTERS.map((filter) => {
            const isActive = filter.period === period;
            return (
              <Pressable
                key={filter.period}
                onPress={() => setPeriod(filter.period)}
                className={cn(
                  "px-3 py-1.5 rounded-2xl border border-borderColor bg-bgContainer",
                  isActive && "bg-primaryColor border-primaryColor",
                )}
              >
                <Text className={cn(`text-[13px] ${fonts.medium} text-mainColor`, isActive && "text-white")}>
                  {i18n.t(filter.label)}
                </Text>
              </Pressable>
            );
          })}
        </View>
        <View className="flex-row-reverse gap-1">
          <Text className={totalText}>$</Text>
          <Text className={totalText}>{nFormatter(+total)}</Text>
        </View>
      </View>
      {isLoading ? (
        <Indicator customStyle="mb-[20%]" />
      ) : (
        <ExpensesOutput
          expenses={expenses}
          fallBackText={i18n.t(activeFilter.fallBackText)}
          refreshing={refreshing}
          onRefresh={onRefresh}
          onEndReached={fetchMoreExpenses}
          isLoadingMore={isLoadingMore}
        />
      )}
    </View>
  );
}
