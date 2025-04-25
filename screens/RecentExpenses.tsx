import React, { useEffect, useState } from "react";
import { StyleSheet, View, ViewStyle } from "react-native";

import { getDateMinusDays } from "../util/Date";
import { useExpenseStore } from "../store/expense_store";
import { Colors } from "../constants/Styles";
import { Indicator } from "../components/UI/Indicator";
import { ExpenseItemProps } from "../components/ExpenseItem";
import { ExpensesOutput } from "../components/ExpensesOutput";
import { ExpenseCount } from "../components/ExpenseCount";

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
    const date7DaysAgo = getDateMinusDays(today, 7);
    const expenseDate = expense.date.seconds;

    const date7DaysAgoInSeconds = Math.floor(date7DaysAgo.getTime() / 1000);
    const todayInSeconds = Math.floor(today.getTime() / 1000);

    return (expenseDate >= date7DaysAgoInSeconds) && (expenseDate <= todayInSeconds);
  });

  const expensesSum = recentExpenses?.reduce((sum, expense) => {
    return sum + Number(expense.amount);
  }, 0);

  return (
    <View style={styles.container}>
      <ExpenseCount
        expensesName="Last 7 Days"
        expensesSum={expensesSum}
      />
      {isLoading ? (
        <Indicator indicatorStyle={styles.indicator} />
      ) : (
        <ExpensesOutput
          expenses={recentExpenses}
          fallBackText="No expenses registered for the last 7 days."
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
