import React from "react";
import { View, Text, StyleSheet, FlatList, ViewStyle, TextStyle } from "react-native";

import { Colors } from "../constants/Styles";
import { ExpenseItem, ExpenseItemProps } from "./ExpenseItem";
import { ExpenseCount } from "./ExpenseCount";

interface ExpensesOutputProps {
  expenses: ExpenseItemProps[];
  fallBackText: string;
}

export const ExpensesOutput = ({ expenses, fallBackText }: ExpensesOutputProps) => {

  return (
    <>
      {expenses?.length > 0 ? (
        <FlatList
          data={expenses} 
          keyExtractor={(item) => item.id}
          renderItem={({item}) => (
            <ExpenseItem
              id={item.id}
              title={item.title}
              amount={item.amount}
              date={item.date}
            />)
          }
        />
      ) : (
        <Text style={styles.infoText}>{fallBackText}</Text>
      )}
    </>
  )
}

interface Styles {
  infoText: TextStyle;
}

const styles = StyleSheet.create<Styles>({
  infoText: {
    color: Colors.mainColor,
    fontSize: 20,
    marginHorizontal: 42,
    textAlign: "center",
    marginTop: "50%",
    lineHeight: 30,
  }
})
