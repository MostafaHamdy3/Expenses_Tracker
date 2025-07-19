import React, { useEffect, useState } from "react";
import { StyleSheet, View, ViewStyle } from "react-native";

import { Colors } from "../constants/Styles";
import { ExpensesOutput } from "../components/ExpensesOutput";
import { ExpenseCount } from "../components/ExpenseCount";
import i18n from "../assets/translation/config"
import { useExpenseStore } from "../store/ExpenseStore";
import { NavigationHeader } from "../components/common/NavigationHeader";
import { Indicator } from "../components/common/Indicator";
import { expensesSum, ThisMonthExpenses } from "../utility/utility";

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

  const recentExpenses = ThisMonthExpenses(expenses);
  const expensesPrice = expensesSum(recentExpenses);

  return (
    <View style={styles.container}>
      <NavigationHeader
        title={i18n.t("recentExpenses")}
        showLogoutIcon={true}
      />
      <ExpenseCount
        expensesName={i18n.t("thisMonth")}
        expensesSum={expensesPrice}
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
