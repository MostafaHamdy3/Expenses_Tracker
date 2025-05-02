import React, { useEffect, useState } from "react";
import { StyleSheet, View, ViewStyle } from "react-native";

import { useExpenseStore } from "../store/expense_store";
import { Colors } from "../constants/Styles";
import { Indicator } from "../components/UI/Indicator";
import { ExpenseItemProps } from "../components/ExpenseItem";
import { ExpensesOutput } from "../components/ExpensesOutput";
import { ExpenseCount } from "../components/ExpenseCount";
import i18n from "../assets/translation/config"

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

  const recentExpenses = expenses?.filter((expense: ExpenseItemProps) => {
    const today = new Date();
    const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
    const lastDayOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0);

    const expenseDate = expense.date.seconds;
    const firstDayInSeconds = Math.floor(firstDayOfMonth.getTime() / 1000);
    const lastDayInSeconds = Math.floor(lastDayOfMonth.getTime() / 1000);

    return (expenseDate >= firstDayInSeconds) && (expenseDate <= lastDayInSeconds);
  });

  const expensesSum = recentExpenses?.reduce((sum, expense) => {
    return sum + Number(expense.amount);
  }, 0);

  return (
    <View style={styles.container}>
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
