import React, { useCallback, useState } from "react";

import { fetchExpenses } from "../store/expense_store";
import { useFocusEffect } from "@react-navigation/native";
import { Colors } from "../constants/Styles";
import { StyleSheet, View, ViewStyle } from "react-native";
import { Indicator } from "../components/UI/Indicator";
import { ExpenseItemProps } from "../components/ExpenseItem";
import { ExpensesOutput } from "../components/ExpensesOutput";
import { ExpenseCount } from "../components/ExpenseCount";

export const AllExpenses = () => {
  const [expenses, setExpenses] = useState<ExpenseItemProps[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useFocusEffect(useCallback(() => {
    const fetchData = async () => {
      setIsLoading(true);
      const data = await fetchExpenses();
      setExpenses(data as ExpenseItemProps[]);
      setIsLoading(false);
    }
    fetchData();
  }, []));

  const expensesSum = expenses?.reduce((sum, expense) => {
    return sum + Number(expense.amount);
  }, 0);

  return (
    <View style={styles.container}>
      <ExpenseCount
        expensesName="Total"
        expensesSum={expensesSum}
      />
      {isLoading ? <Indicator indicatorStyle={styles.indicator} /> : (
        <ExpensesOutput
          expenses={expenses}
          fallBackText="No registered expenses found!"
        />
      )}
    </View>
  )
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
