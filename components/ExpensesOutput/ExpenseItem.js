import { TouchableOpacity, View, Text, StyleSheet } from "react-native";
import { useNavigation } from "@react-navigation/native"

import { Colors } from "../../constants/Styles";
import { getFormattedDate } from "../../util/Date";

function ExpenseItem({ title, date, amount, id }) {
  const navigation = useNavigation();

  function expensePressHandler() {
    navigation.navigate("ManageExpense", {
      expenseId: id,
    })
  }

  return (
    <TouchableOpacity onPress={expensePressHandler} activeOpacity={0.7}>
      <View style={styles.expense}>
        <View>
          <Text style={[styles.textBase, styles.title]}>{title}</Text>
          <Text style={styles.textBase}>{getFormattedDate(date)}</Text>
        </View>
        <View style={styles.amountContainer}>
          <Text style={styles.amount}>{amount.toFixed(2)}</Text>
        </View>
      </View>
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  expense: {
    padding: 12,
    marginVertical: 4,
    marginHorizontal: 16,
    backgroundColor: Colors.primary500,
    borderRadius: 6,
    flexDirection: "row",
    justifyContent: "space-between",
    elevation: 4,
    shadowColor: Colors.gray500,
    shadowOffset: { width: 1, height: 1 },
    shadowRadius: 4,
    shadowOpacity: 0.4
  },
  textBase: {
    color: Colors.primary50
  },
  title: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 4,
  },
  amountContainer: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    backgroundColor: "white",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 4,
  },
  amount: {
    color: Colors.primary500,
    fontWeight: "bold",
  }
})

export default ExpenseItem;