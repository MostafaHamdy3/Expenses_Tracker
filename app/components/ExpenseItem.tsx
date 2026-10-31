import React from "react";
import { Text, View, TouchableOpacity } from "react-native";
import { useNavigation } from "@react-navigation/native";

import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { getFormattedDate, nFormatter } from "../utility/utility";
import { RootStackParamList } from "../AppNavigation";
import { fonts } from "../../src/theme/fonts";

export interface ExpenseItemProps {
  id?: string;
  title: string;
  amount: number;
  date: { seconds: number };
}

const textBase = `self-start text-mainColor ${fonts.medium}`;

export const ExpenseItem = ({ id, title, amount, date }: ExpenseItemProps) => {
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  const expensePressHandler = ({
    id,
    title,
    amount,
    date,
  }: ExpenseItemProps) => {
    navigation.navigate("ManageExpense", { data: { id, title, amount, date } });
  };

  return (
    <TouchableOpacity
      onPress={() => expensePressHandler({ id, title, amount, date })}
      activeOpacity={0.9}
      className="px-4 py-3 my-1 mx-4 bg-bgContainer rounded-md flex-row justify-between items-center shadow-xs"
    >
      <View>
        <Text className={`${textBase} text-[16px] ${fonts.bold} mb-1`}>
          {title}
        </Text>
        <Text className={textBase}>{getFormattedDate(date.seconds)}</Text>
      </View>
      <View className="px-3 py-2 bg-bgContainer justify-center items-center border border-borderColor rounded-xl">
        <Text className="text-primaryColor font-num-bold">
          {nFormatter(+amount)}
        </Text>
      </View>
    </TouchableOpacity>
  );
};
