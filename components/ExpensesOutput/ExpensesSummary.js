import { View, Text, StyleSheet } from "react-native";
import { GlobalStyles } from './../../constants/Styles';

function ExpensesSummary({ expenses, periodName }) {
  const expensesSum = expenses.reduce((sum, expense) => {
    return sum + Number(expense.amount);
  }, 0);

  return (
    <View style={styles.container}>
      <Text style={styles.periodTitle}>{periodName}</Text>
      <Text style={styles.sumTitle}>${expensesSum.toFixed(2)}</Text>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: 10,
    paddingHorizontal: 16,
    margin: 16,
    backgroundColor: GlobalStyles.colors.primary50,
    borderRadius: 8,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  periodTitle: {
    fontSize: 12,
    color: GlobalStyles.colors.primary400,
  },
  sumTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: GlobalStyles.colors.primary500,
  },
});

export default ExpensesSummary;