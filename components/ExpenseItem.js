import { StyleSheet, Text, View , TouchableOpacity} from 'react-native'
import React from 'react'
import { getFormattedDate } from '../util/Date'
import { useNavigation } from '@react-navigation/native'
import { Colors } from '../constants/Styles'

const ExpenseItem = ({item}) => {
  const navigation = useNavigation();

  const expensePressHandler = (item) => {
    navigation.navigate("ManageExpense", { data: item })
  };

  return (
    <TouchableOpacity
      onPress={() => expensePressHandler(item)}
      activeOpacity={0.7}
    >
      <View style={styles.expense}>
        <View>
          <Text style={[styles.textBase, styles.title]}>{item.title}</Text>
          <Text style={styles.textBase}>{getFormattedDate(item.date.seconds)}</Text>
        </View>
        <View style={styles.amountContainer}>
          <Text style={styles.amount}>{item.amount.toFixed(2)}</Text>
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
    backgroundColor: Colors.backgroundScreen,
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
    color: Colors.fieldBg
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
    color: Colors.backgroundScreen,
    fontWeight: "bold",
  },
});

export default ExpenseItem
