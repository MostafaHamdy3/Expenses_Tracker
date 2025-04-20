import React from 'react'
import { StyleSheet, Text, View , TouchableOpacity, ViewStyle, TextStyle} from 'react-native'
import { useNavigation } from '@react-navigation/native'

import { getFormattedDate } from '../util/Date'
import { Colors } from '../constants/Styles'
import { RootStackParamList } from '../App'
import { NativeStackNavigationProp } from '@react-navigation/native-stack'

export interface ExpenseItemProps {
  id?: string;
  title: string;
  amount: number;
  date: { seconds: number };
}

export const ExpenseItem = ({id, title, amount, date}: ExpenseItemProps) => {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  const expensePressHandler = ({ id, title, amount, date }: ExpenseItemProps) => {
    navigation.navigate("ManageExpense", { data: { id, title, amount, date } })
  };

  return (
    <TouchableOpacity
      onPress={() => expensePressHandler({ id, title, amount, date })}
      activeOpacity={0.9}
      style={styles.expense}
    >
      <View>
        <Text style={[styles.textBase, styles.title]}>{title}</Text>
        <Text style={styles.textBase}>{getFormattedDate(date.seconds)}</Text>
      </View>
      <View style={styles.amountContainer}>
        <Text style={styles.amount}>{amount.toFixed(2)}</Text>
      </View>
    </TouchableOpacity>
  )
}

interface Styles {
  expense: ViewStyle;
  textBase: TextStyle;
  title: TextStyle;
  amountContainer: ViewStyle;
  amount: TextStyle;
}

const styles = StyleSheet.create<Styles>({
  expense: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginVertical: 4,
    marginHorizontal: 16,
    backgroundColor: Colors.bgContainer,
    borderRadius: 6,
    flexDirection: "row",
    justifyContent: "space-between",
    elevation: 1,
    shadowColor: Colors.shadowColor,
    shadowOffset: { width: 1, height: 1 },
    shadowRadius: 6,
    shadowOpacity: 0.2
  },
  textBase: {
    color: Colors.mainColor,
  },
  title: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 4,
  },
  amountContainer: {
    paddingHorizontal: 12,
    backgroundColor: Colors.bgContainer,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: Colors.borderColor,
    borderRadius: 12,
  },
  amount: {
    color: Colors.primaryColor,
    fontWeight: "bold",
  },
});
