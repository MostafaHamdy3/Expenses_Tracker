import { useCallback, useState } from "react";

import ExpensesOutput from "../components/ExpensesOutput";
import { getDateMinusDays } from "../util/Date";
import { fetchExpenses } from "../store/expense_store";
import { useFocusEffect } from "@react-navigation/native";
import Indicator from "../components/UI/Indicator";
import { StyleSheet, View } from "react-native";
import { Colors } from "../constants/Styles";

function RecentExpenses() {
  const [isLoading, setIsLoading] = useState(true);
  const [expenses, setExpenses] = useState();

  useFocusEffect(useCallback(() => {
    const fetchData = async () => {
      setIsLoading(true);
      const data = await fetchExpenses();
      setExpenses(data);
      setIsLoading(false)
    }
    fetchData();
  }, []));

  const recentExpenses = expenses?.filter((expense) => {
    const today = new Date();
    const date7DaysAgo = getDateMinusDays(today, 7);
    const expenseDate = expense.date.seconds;

    const date7DaysAgoInSeconds = Math.floor(date7DaysAgo.getTime() / 1000);
    const todayInSeconds = Math.floor(today.getTime() / 1000);

    return (expenseDate >= date7DaysAgoInSeconds) && (expenseDate <= todayInSeconds);
  });

  return (
    <View style={styles.container}>
      {isLoading ? (
        <Indicator />
      ) : (
        <ExpensesOutput
          expenses={recentExpenses}
          expensesName="Last 7 Days"
          fallBackText="No expenses registered for the last 7 days."
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.darkBg,
  },
});

export default RecentExpenses;