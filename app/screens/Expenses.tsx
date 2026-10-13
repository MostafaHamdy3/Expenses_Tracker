import React, { useEffect, useState } from "react";
import { Pressable, StyleSheet, Text, TextStyle, View, ViewStyle } from "react-native";

import { Colors } from "../constants/Styles";
import { ExpensesOutput } from "../components/ExpensesOutput";
import i18n from "../assets/translation/config";
import { useExpenseStore } from "../store/ExpenseStore";
import { NavigationHeader } from "../components/common/NavigationHeader";
import { Indicator } from "../components/common/Indicator";
import { isRTL } from "../assets/translation/resources";
import { fontsAR, fontsEN, fontsNUM } from "../constants/config";
import { ExpensesPeriod, nFormatter } from "../utility/utility";

const FILTERS: { period: ExpensesPeriod; label: string; fallBackText: string }[] = [
  { period: "all", label: "all", fallBackText: "noExpenses" },
  { period: "year", label: "thisYear", fallBackText: "noExpensesThisYear" },
  { period: "month", label: "thisMonth", fallBackText: "noExpensesThisMonth" },
];

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
    <View style={styles.container}>
      <NavigationHeader
        title={i18n.t("Expenses")}
        showLogoutIcon={true}
      />
      <View style={styles.filterRow}>
        <View style={styles.filters}>
          {FILTERS.map((filter) => {
            const isActive = filter.period === period;
            return (
              <Pressable
                key={filter.period}
                onPress={() => setPeriod(filter.period)}
                style={[styles.filterChip, isActive && styles.filterChipActive]}
              >
                <Text style={[styles.filterText, isActive && styles.filterTextActive]}>
                  {i18n.t(filter.label)}
                </Text>
              </Pressable>
            );
          })}
        </View>
        <View style={styles.totalContent}>
          <Text style={styles.totalText}>$</Text>
          <Text style={styles.totalText}>{nFormatter(+total)}</Text>
        </View>
      </View>
      {isLoading ? (
        <Indicator indicatorStyle={styles.indicator} />
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

interface Styles {
  container: ViewStyle;
  indicator: ViewStyle;
  filterRow: ViewStyle;
  filters: ViewStyle;
  filterChip: ViewStyle;
  filterChipActive: ViewStyle;
  filterText: TextStyle;
  filterTextActive: TextStyle;
  totalContent: ViewStyle;
  totalText: TextStyle;
}

const styles = StyleSheet.create<Styles>({
  container: {
    flex: 1,
    backgroundColor: Colors.bgScreen,
  },
  indicator: {
    marginBottom: "20%",
  },
  filterRow: {
    flexDirection: isRTL() ? "row-reverse" : "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginHorizontal: 16,
    marginTop: 16,
    marginBottom: 8,
    gap: 8,
  },
  filters: {
    flexDirection: isRTL() ? "row-reverse" : "row",
    gap: 6,
  },
  filterChip: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: Colors.borderColor,
    backgroundColor: Colors.bgContainer,
  },
  filterChipActive: {
    backgroundColor: Colors.primaryColor,
    borderColor: Colors.primaryColor,
  },
  filterText: {
    fontSize: 13,
    fontFamily: isRTL() ? fontsAR.medium : fontsEN.medium,
    color: Colors.mainColor,
  },
  filterTextActive: {
    color: Colors.white,
  },
  totalContent: {
    flexDirection: isRTL() ? "row" : "row-reverse",
    gap: 4,
  },
  totalText: {
    fontSize: 18,
    fontFamily: fontsNUM.bold,
    color: Colors.primaryColor,
  },
});
