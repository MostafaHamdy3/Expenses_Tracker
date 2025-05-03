import React from 'react'
import { StyleSheet, Text, View , TouchableOpacity, ViewStyle, TextStyle} from 'react-native'
import { useNavigation } from '@react-navigation/native'

import { Colors } from '../constants/Styles'
import { RootStackParamList } from '../App'
import { NativeStackNavigationProp } from '@react-navigation/native-stack'
import { isRTL } from '../assets/translation/resources'
import { fontsAR, fontsEN, fontsNUM } from '../constants/config'
import { getFormattedDate, nFormatter } from '../utility/utility'

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
        <Text style={styles.amount}>{nFormatter(+amount)}</Text>
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
    flexDirection: isRTL() ? 'row-reverse' : "row",
    justifyContent: "space-between",
    alignItems: 'center',
    elevation: 1,
    shadowColor: Colors.shadowColor,
    shadowOffset: { width: 1, height: 1 },
    shadowRadius: 6,
    shadowOpacity: 0.2
  },
  textBase: {
    alignSelf: isRTL() ? 'flex-end' : 'flex-start',
    color: Colors.mainColor,
    fontFamily: isRTL() ? fontsAR.medium : fontsEN.medium,
  },
  title: {
    fontSize: 16,
    fontFamily: isRTL() ? fontsAR.bold : fontsEN.bold,
    marginBottom: 4,
  },
  amountContainer: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: Colors.bgContainer,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: Colors.borderColor,
    borderRadius: 12,
  },
  amount: {
    color: Colors.primaryColor,
    fontFamily: fontsNUM.bold,
  },
});
