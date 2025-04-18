import React from 'react'
import { StyleSheet, Text, TextStyle, View, ViewStyle } from 'react-native'

import { Colors } from '../constants/Styles';

interface ExpenseCountProps {
  expensesName: string;
  expensesSum: number;
}

export const ExpenseCount = ({expensesName, expensesSum}: ExpenseCountProps) => {
  return (
    <View style={styles.countContent}>
      <Text style={styles.periodTitle}>{expensesName}</Text>
      <Text style={styles.sumTitle}>${expensesSum.toFixed(2)}</Text>
    </View>
  )
}

interface Styles {
  countContent: ViewStyle;
  periodTitle: TextStyle;
  sumTitle: TextStyle;
}

const styles = StyleSheet.create<Styles>({
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
});