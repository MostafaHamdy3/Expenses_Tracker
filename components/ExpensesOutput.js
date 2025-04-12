import { View, Text, StyleSheet, FlatList } from "react-native";

import { Colors } from "../constants/Styles";
import Indicator from "./UI/Indicator";
import ExpenseItem from "./ExpenseItem";

function ExpensesOutput({ expenses, expensesName, fallBackText, isLoading }) {
  const expensesSum = expenses?.reduce((sum, expense) => {
    return sum + Number(expense.amount);
  }, 0);

  return (
    <>
      <View style={styles.countContent}>
        <Text style={styles.periodTitle}>{expensesName}</Text>
        <Text style={styles.sumTitle}>${expensesSum.toFixed(2)}</Text>
      </View>
      {expenses?.length > 0 ? (
        <FlatList
          data={expenses} 
          keyExtractor={(item) => item.id}
          renderItem={({item}) => <ExpenseItem item={item} />}
        />
      ) : (
        <Text style={styles.infoText}>{fallBackText}</Text>
      )}
    </>
  )
}

const styles = StyleSheet.create({
  countContent: {
    paddingVertical: 10,
    paddingHorizontal: 16,
    margin: 16,
    backgroundColor: Colors.fieldBg,
    borderRadius: 8,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  periodTitle: {
    fontSize: 12,
    color: Colors.lightBg,
  },
  sumTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: Colors.backgroundScreen,
  },
  infoText: {
    color: "white",
    fontSize: 16,
    textAlign: "center",
    marginTop: "50%",
  }
})

export default ExpensesOutput;