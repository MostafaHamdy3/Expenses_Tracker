import React, { useEffect, useMemo, useState } from "react";
import { StyleSheet, View, ViewStyle } from "react-native";

import { useExpenseStore } from "../store/expense_store";
import { Colors } from "../constants/Styles";
import { Indicator } from "../components/UI/Indicator";
import { ExpensesOutput } from "../components/ExpensesOutput";
import { ExpenseCount } from "../components/ExpenseCount";
import i18n from "../assets/translation/config";
import { NavigationHeader } from "../components/UI/NavigationHeader";

export const AllExpenses = () => {
  const { expenses, fetchExpenses } = useExpenseStore();

  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      await fetchExpenses();
      setIsLoading(false);
    }
    fetchData();
  }, []);

  const expensesSum = useMemo(() => (
    expenses?.reduce((sum, expense) => sum + Number(expense.amount), 0)
  ), [expenses]);

  return (
    <View style={styles.container}>
      <NavigationHeader
        title={i18n.t("allExpenses")}
        showLogoutIcon={true}
      />
      <ExpenseCount
        expensesName={i18n.t("total")}
        expensesSum={expensesSum}
      />
      {isLoading ? <Indicator indicatorStyle={styles.indicator} /> : (
        <ExpensesOutput
          expenses={expenses}
          fallBackText={i18n.t("noExpenses")}
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
