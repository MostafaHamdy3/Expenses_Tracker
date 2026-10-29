import React, { useState } from "react";
import {
  View,
  TouchableOpacity,
  Image,
  Text,
} from "react-native";
import { RouteProp, useNavigation, useRoute } from "@react-navigation/native";

import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { ExpenseItemProps } from "../components/ExpenseItem";
import i18n from "../assets/translation/config";
import { cn } from "../../src/utils/cn";
import { fonts } from "../../src/theme/fonts";
import { useTheme } from "../../src/theme/useTheme";

import DateTimePickerModal from "react-native-modal-datetime-picker";
import { getFormattedDate } from "../utility/utility";
import { ExpenseItemWithId, useExpenseStore } from "../store/ExpenseStore";
import { ExpensesOverviewParamList, RootStackParamList } from "../AppNavigation";
import { NavigationHeader } from "../components/common/NavigationHeader";
import { ConfirmModal } from "../components/modals/ConfirmModal";
import { Input } from "../components/common/Input";
import { Button } from "../components/common/Button";
import Trash from '../assets/svgs/trash-2.svg';

type ManageExpenseRouteProp =
  | RouteProp<RootStackParamList, "ManageExpense">
  | RouteProp<ExpensesOverviewParamList, "AddExpenses">;

export const ManageExpense = () => {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const route = useRoute<ManageExpenseRouteProp>();
  const params = route.params as { data?: ExpenseItemWithId } | undefined;
  const data = params?.data;

  const { addExpense, updateExpense, deleteExpense } = useExpenseStore();
  const { getThemeColor } = useTheme();

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [deleteLoading, setDeleteLoading] = useState<boolean>(false);
  const [isDatePickerVisible, setDatePickerVisibility] = useState<boolean>(false);
  const [titleIsValid, setTitleIsValid] = useState<boolean>(true);
  const [amountIsValid, setAmountIsValid] = useState<boolean>(true);
  const [dateIsValid, setDateIsValid] = useState<boolean>(true);
  const [showDeleteConf, setShowDeleteConf] = useState<boolean>(false);
  const [expenseTitle, setExpenseTitle] = useState<string>(data?.title || "");
  const [expenseDate, setExpenseDate] = useState<string>(data?.date ? getFormattedDate(data.date.seconds) : "");
  const [expenseAmount, setExpenseAmount] = useState<string>(data?.amount ? String(data.amount) : "");

  const isChanged = data
    ? expenseTitle !== data.title ||
      Number(expenseAmount) !== data.amount ||
      expenseDate !== getFormattedDate(data.date.seconds)
    : !data;

  const onShowConfirmDelete = () => {
    setShowDeleteConf(true);
  };

  const closeConfirmDelete = () => {
    setShowDeleteConf(false);
  };

  const deleteExpenseHandler = async () => {
    if (!data) {
      return;
    }
    setDeleteLoading(true);
    await deleteExpense(data.id);
    closeConfirmDelete();
    navigation.goBack();
    setDeleteLoading(false);
  };

  const cancelHandler = () => {
    navigation.goBack();
  };

  const onChangeTitle = (text: string) => {
    setExpenseTitle(text);
    !titleIsValid && setTitleIsValid(true);
  };

  const onChangeAmount = (value: string) => {
    // Accept "," or "٫" as decimal separator, keep a single dot and up to 2 decimals
    const normalized = value.replace(/[,٫]/g, ".").replace(/[^0-9.]/g, "");
    if (!/^\d*\.?\d{0,2}$/.test(normalized)) return;
    setExpenseAmount(normalized);
    !amountIsValid && setAmountIsValid(true);
  };

  const onConfirm = async () => {
    setIsLoading(true);
    const expenseData: ExpenseItemProps = {
      title: expenseTitle,
      amount: parseFloat(expenseAmount),
      date: { seconds: new Date(expenseDate).getTime() / 1000 },
    };

    const isValidTitle = expenseData.title.trim().length > 0;
    const isValidAmount = !isNaN(expenseData.amount) && expenseData.amount > 0;
    const isValidDate = expenseData.date.seconds.toString() !== 'NaN';
    setTitleIsValid(isValidTitle);
    setAmountIsValid(isValidAmount);
    setDateIsValid(isValidDate);

    if (isValidTitle && isValidAmount && isValidDate) {
      data
        ? await updateExpense(data.id, expenseData)
        : await addExpense(expenseData);
      navigation.navigate('ExpensesOverview', { screen: 'Expenses' });
    }
    setIsLoading(false);
    setExpenseTitle("");
    setExpenseAmount("");
    setExpenseDate("");
  };

  const startTimeConfirm = (date: Date) => {
    const dateOnly = date.toISOString().split("T")[0];
    setExpenseDate(dateOnly);
    !dateIsValid && setDateIsValid(true);
    hideDatePicker();
  };

  const showDatePicker = () => {
    setDatePickerVisibility(true);
  };

  const hideDatePicker = () => {
    setDatePickerVisibility(false);
  };

  return (
    <>
      <NavigationHeader
        title={data ? i18n.t("editExpense") : i18n.t("addExpense")}
        showArrow={!!data}
      />
      <ConfirmModal
        showModal={showDeleteConf}
        closeModal={closeConfirmDelete}
        title={i18n.t("confirmDelete")}
        isLoading={deleteLoading}
        confirm={deleteExpenseHandler}
      />
      <View className="flex-1 bg-bgScreen px-4 pt-6">
        <Input
          label={i18n.t("title")}
          isInvalid={!titleIsValid}
          textInputConfig={{
            onChangeText: onChangeTitle,
            value: expenseTitle,
            maxLength: 30,
          }}
        />
        <Input
          label={i18n.t("price")}
          isInvalid={!amountIsValid}
          textInputConfig={{
            keyboardType: "decimal-pad",
            onChangeText: onChangeAmount,
            value: expenseAmount,
            maxLength: 9,
          }}
        />
        <View className="my-2">
          <Text className={cn(`text-[12px] ${fonts.medium} text-mainColor mb-1 mx-1`, !dateIsValid && "text-error500")}>
            {i18n.t("date")}
          </Text>
          <View
            className={cn(
              "flex-row p-3 rounded-md bg-bgContainer border",
              dateIsValid ? "border-borderColor" : "border-error500",
            )}
          >
            <Text>{expenseDate || "YYYY-MMM-DD"}</Text>
            <TouchableOpacity
              className="absolute end-3 top-2.5"
              activeOpacity={0.7}
              onPress={showDatePicker}
            >
              <Image
                source={require("../assets/icons/calendar.png")}
                className="w-6 h-6"
              />
            </TouchableOpacity>
          </View>
        </View>
        <DateTimePickerModal
          isVisible={isDatePickerVisible}
          mode="date"
          onConfirm={startTimeConfirm}
          onCancel={hideDatePicker}
          maximumDate={new Date()}
        />
        <View className="self-center absolute bottom-10.5">
          <View className="flex-row justify-center items-center">
            <Button
              btnText={i18n.t("cancel")}
              customStyle="bg-bgContainer"
              textStyle="text-mainColor"
              onPress={cancelHandler}
            />
            <Button
              btnText={data ? i18n.t("update") : i18n.t("add")}
              onPress={onConfirm}
              disabled={!isChanged}
              isLoading={isLoading}
            />
          </View>
          {data && (
            <TouchableOpacity
              className="mt-4 pt-4 border-t border-t-borderColor items-center"
              onPress={onShowConfirmDelete}
            >
              <Trash width={32} height={32} color={getThemeColor("secondaryColor")} />
            </TouchableOpacity>
          )}
        </View>
      </View>
    </>
  );
};
