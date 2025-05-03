import React from 'react'
import { StyleSheet, Text, TextStyle, View, ViewStyle } from 'react-native'

import { Colors } from '../constants/Styles';
import { isRTL } from '../assets/translation/resources';
import { fontsAR, fontsEN, fontsNUM } from '../constants/config';
import { nFormatter } from '../utility/utility';

interface ExpenseCountProps {
  expensesName: string;
  expensesSum: number;
}

export const ExpenseCount = ({expensesName, expensesSum}: ExpenseCountProps) => {
  return (
    <View style={styles.countContent}>
      <Text style={styles.periodTitle}>{expensesName}</Text>
      <View style={styles.priceContent}>
        <Text style={styles.sumTitle}>$</Text>
        <Text style={styles.sumTitle}>{nFormatter(+expensesSum)}</Text>
      </View>
    </View>
  )
}

interface Styles {
  countContent: ViewStyle;
  priceContent: ViewStyle;
  periodTitle: TextStyle;
  sumTitle: TextStyle;
}

const styles = StyleSheet.create<Styles>({
  countContent: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    margin: 16,
    backgroundColor: Colors.bgContainer,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.borderColor,
    flexDirection: isRTL() ? 'row-reverse' : "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  priceContent: {
    flexDirection: isRTL() ? 'row' : 'row-reverse',
    gap: 4,
  },
  periodTitle: {
    fontSize: 14,
    fontFamily: isRTL() ? fontsAR.medium : fontsEN.medium,
    color: Colors.mainColor,
  },
  sumTitle: {
    fontSize: 16,
    fontFamily: fontsNUM.medium,
    color: Colors.primaryColor,
  },
});