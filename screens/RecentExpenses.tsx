import React, { useEffect, useMemo, useState } from "react";
import { StyleSheet, View, ViewStyle } from "react-native";

import { useExpenseStore } from "../store/expense_store";
import { Colors } from "../constants/Styles";
import { Indicator } from "../components/UI/Indicator";
import { ExpenseItemProps } from "../components/ExpenseItem";
import { ExpensesOutput } from "../components/ExpensesOutput";
import { ExpenseCount } from "../components/ExpenseCount";
import i18n from "../assets/translation/config"
import { NavigationHeader } from "../components/UI/NavigationHeader";

export const RecentExpenses = () => {
  const { expenses, fetchExpenses } = useExpenseStore();

  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      await fetchExpenses();
      setIsLoading(false)
    }
    fetchData();
  }, []);

  const recentExpenses = useMemo(() => {
    if (!expenses) return [];

    const today = new Date();
    const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
    const lastDayOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0);

    const firstDayInSeconds = Math.floor(firstDayOfMonth.getTime() / 1000);
    const lastDayInSeconds = Math.floor(lastDayOfMonth.getTime() / 1000);

    return expenses.filter((expense) => {
      const expenseDate = expense.date.seconds;
      return expenseDate >= firstDayInSeconds && expenseDate <= lastDayInSeconds;
    });
  }, [expenses, new Date().getMonth()]);

  const expensesSum = useMemo(() => (
    recentExpenses?.reduce((sum, expense) => sum + Number(expense.amount), 0)
  ), [recentExpenses]);

  return (
    <View style={styles.container}>
      <NavigationHeader
        title={i18n.t("recentExpenses")}
        showAction={true}
      />
      <ExpenseCount
        expensesName={i18n.t("thisMonth")}
        expensesSum={expensesSum}
      />
      {isLoading ? (
        <Indicator indicatorStyle={styles.indicator} />
      ) : (
        <ExpensesOutput
          expenses={recentExpenses}
          fallBackText={i18n.t("noExpensesThisMonth")}
        />
      )}
    </View>
  );
}

interface Styles {
  container: ViewStyle;
  indicator: ViewStyle;
}

const styles = StyleSheet.create<Styles>({
  container: {
    flex: 1,
    backgroundColor: Colors.bgScreen,
  },
  indicator: {
    marginBottom: "20%",
  },
});
