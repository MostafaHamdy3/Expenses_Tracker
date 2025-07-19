import React, { useState } from "react";
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Image,
  Text,
  ViewStyle,
  TextStyle,
  ImageStyle,
} from "react-native";

import { Colors } from "../constants/Styles";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { ExpenseItemProps } from "../components/ExpenseItem";
import i18n from "../assets/translation/config";
import { isRTL } from "../assets/translation/resources";
import { fontsAR, fontsEN } from "../constants/config";

import DateTimePickerModal from "react-native-modal-datetime-picker";
import { getFormattedDate } from "../utility/utility";
import { ExpenseItemWithId, useExpenseStore } from "../store/ExpenseStore";
import { RootStackParamList } from "../AppNavigation";
import { NavigationHeader } from "../components/common/NavigationHeader";
import { ConfirmModal } from "../components/modals/ConfirmModal";
import { Input } from "../components/common/Input";
import { Button } from "../components/common/Button";
import { IconButton } from "../components/common/IconButton";

interface ManageExpenseProps {
  route: { params: { data: ExpenseItemWithId } };
  navigation: NativeStackNavigationProp<RootStackParamList>;
}

export const ManageExpense = ({ route, navigation }: ManageExpenseProps) => {
  const data = route.params?.data;

  const { addExpense, updateExpense, deleteExpense } = useExpenseStore();

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [deleteLoading, setDeleteLoading] = useState<boolean>(false);
  const [isDatePickerVisible, setDatePickerVisibility] = useState<boolean>(false);
  const [titleIsValid, setTitleIsValid] = useState<boolean>(true);
  const [amountIsValid, setAmountIsValid] = useState<boolean>(true);
  const [dateIsValid, setDateIsValid] = useState<boolean>(true);
  const [showDeleteConf, setShowDeleteConf] = useState<boolean>(false);
  const [expenseTitle, setExpenseTitle] = useState<string>(data?.title || "");
  const [expenseDate, setExpenseDate] = useState<string>(data?.date ? getFormattedDate(data.date.seconds) : "");
  const [expenseAmount, setExpenseAmount] = useState<number>(data?.amount || 0);

  const isChanged = data
    ? expenseTitle !== data.title ||
      expenseAmount !== data.amount ||
      expenseDate !== getFormattedDate(data.date.seconds)
    : !data;

  const onShowConfirmDelete = () => {
    setShowDeleteConf(true);
  };

  const closeConfirmDelete = () => {
    setShowDeleteConf(false);
  };

  const deleteExpenseHandler = async () => {
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
    setExpenseAmount(Number(value));
    !amountIsValid && setAmountIsValid(true);
  };

  const onConfirm = async () => {
    setIsLoading(true);
    const expenseData: ExpenseItemProps = {
      title: expenseTitle,
      amount: expenseAmount,
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
      navigation.navigate('ExpensesOverview', { screen: 'RecentExpenses' });
    }
    setIsLoading(false);
    setExpenseTitle("");
    setExpenseAmount(0);
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
      <View style={styles.container}>
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
            value: expenseAmount.toString(),
            maxLength: 9,
          }}
        />
        <View style={styles.dateContent}>
          <Text style={[styles.label, !dateIsValid && styles.invalidLabel]}>
            {i18n.t("date")}
          </Text>
          <View
            style={[
              styles.datePicker,
              {
                borderColor: dateIsValid ? Colors.borderColor : Colors.error500,
              },
            ]}
          >
            <Text>{expenseDate || "YYYY-MMM-DD"}</Text>
            <TouchableOpacity
              style={styles.iconContainer}
              activeOpacity={0.7}
              onPress={showDatePicker}
            >
              <Image
                source={require("../assets/icons/calendar.png")}
                style={styles.icon}
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
        <View style={styles.footer}>
          <View style={styles.buttons}>
            <Button
              btnText={i18n.t("cancel")}
              btnStyle={styles.cancelBtnStyle}
              textStyle={styles.cancelTextStyle}
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
            <View style={styles.deleteContainer}>
              <IconButton
                icon="trash"
                size={32}
                color={Colors.secondaryColor}
                onPress={onShowConfirmDelete}
              />
            </View>
          )}
        </View>
      </View>
    </>
  );
};

interface Styles {
  container: ViewStyle;
  dateContent: ViewStyle;
  label: TextStyle;
  invalidLabel: TextStyle;
  datePicker: ViewStyle;
  iconContainer: ViewStyle;
  icon: ImageStyle;
  footer: ViewStyle;
  buttons: ViewStyle;
  cancelBtnStyle: ViewStyle;
  cancelTextStyle: TextStyle;
  deleteContainer: ViewStyle;
}

const styles = StyleSheet.create<Styles>({
  container: {
    flex: 1,
    backgroundColor: Colors.bgScreen,
    paddingHorizontal: 16,
    paddingTop: 24,
  },
  dateContent: {
    marginVertical: 8,
  },
  label: {
    fontSize: 12,
    fontFamily: isRTL() ? fontsAR.medium : fontsEN.medium,
    color: Colors.mainColor,
    marginBottom: 4,
    marginHorizontal: 4,
  },
  invalidLabel: {
    color: Colors.error500,
  },
  datePicker: {
    flexDirection: isRTL() ? "row-reverse" : "row",
    paddingVertical: 12,
    paddingHorizontal: 12,
    borderRadius: 6,
    backgroundColor: Colors.bgContainer,
    borderWidth: 1,
  },
  iconContainer: {
    position: "absolute",
    right: 12,
    top: 10,
  },
  icon: {
    width: 24,
    height: 24,
  },
  footer: {
    alignSelf: 'center',
    position: 'absolute',
    bottom: 42,
  },
  buttons: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  cancelBtnStyle: {
    backgroundColor: Colors.bgContainer,
  },
  cancelTextStyle: {
    color: Colors.mainColor,
  },
  deleteContainer: {
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: Colors.borderColor,
    alignItems: "center",
  },
});
