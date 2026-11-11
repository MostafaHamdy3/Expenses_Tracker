import React, { useRef, useState } from "react";
import {
  View,
  Text,
  TextInput,
  Pressable,
  ScrollView,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { RouteProp, useNavigation, useRoute } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import DateTimePickerModal from "react-native-modal-datetime-picker";

import { ExpenseItemProps } from "../components/ExpenseItem";
import i18n from "../assets/translation/config";
import { appLanguage, isRTL } from "../assets/translation/resources";
import { cn } from "../../src/utils/cn";
import { fonts } from "../../src/theme/fonts";
import { useTheme } from "../../src/theme/useTheme";
import { getFormattedDate } from "../utility/utility";
import { ExpenseItemWithId } from "../api/expenses";
import {
  useAddExpense,
  useDeleteExpense,
  useUpdateExpense,
} from "../hooks/useExpenses";
import { ExpensesOverviewParamList, RootStackParamList } from "../AppNavigation";
import { NavigationHeader } from "../components/common/NavigationHeader";
import { ConfirmModal } from "../components/modals/ConfirmModal";
import { Button } from "../components/common/Button";
import Trash from "../assets/svgs/trash-2.svg";
import Pen from "../assets/svgs/square-pen.svg";
import CalendarDays from "../assets/svgs/calendar-days.svg";
import ChevronRight from "../assets/svgs/chevron-right.svg";

type ManageExpenseRouteProp =
  | RouteProp<RootStackParamList, "ManageExpense">
  | RouteProp<ExpensesOverviewParamList, "AddExpenses">;

const DAY_SECONDS = 24 * 60 * 60;
const TITLE_MAX_LENGTH = 30;

// Dates are kept as local "YYYY-MM-DD" strings, like getFormattedDate returns.
const todayString = () => getFormattedDate(Date.now() / 1000);
const yesterdayString = () => getFormattedDate(Date.now() / 1000 - DAY_SECONDS);

const toLocalDate = (value: string) => {
  const [year, month, day] = value.split("-").map(Number);
  return new Date(year, month - 1, day);
};

const formatDisplayDate = (value: string) => {
  try {
    return toLocalDate(value).toLocaleDateString(
      appLanguage === "ar" ? "ar-u-nu-latn" : "en-US",
      { weekday: "short", day: "numeric", month: "short", year: "numeric" },
    );
  } catch {
    return value;
  }
};

const card = "bg-bgContainer border border-borderColor rounded-2xl";
const errorText = `text-[13px] text-error500 ${fonts.medium} mt-2 mx-1`;
const chevronStyle = { transform: [{ rotate: isRTL() ? "180deg" : "0deg" }] };

export const ManageExpense = () => {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const route = useRoute<ManageExpenseRouteProp>();
  const params = route.params as { data?: ExpenseItemWithId } | undefined;
  const data = params?.data;
  const isEdit = !!data;

  const addExpense = useAddExpense();
  const updateExpense = useUpdateExpense();
  const deleteExpense = useDeleteExpense();
  const { getThemeColor } = useTheme();
  const insets = useSafeAreaInsets();
  const amountInputRef = useRef<TextInput>(null);

  const [isDatePickerVisible, setDatePickerVisibility] = useState<boolean>(false);
  const [titleIsValid, setTitleIsValid] = useState<boolean>(true);
  const [amountIsValid, setAmountIsValid] = useState<boolean>(true);
  const [amountFocused, setAmountFocused] = useState<boolean>(false);
  const [showDeleteConf, setShowDeleteConf] = useState<boolean>(false);
  const [expenseTitle, setExpenseTitle] = useState<string>(data?.title || "");
  const [expenseDate, setExpenseDate] = useState<string>(
    data?.date ? getFormattedDate(data.date.seconds) : todayString(),
  );
  const [expenseAmount, setExpenseAmount] = useState<string>(data?.amount ? String(data.amount) : "");

  const isLoading = addExpense.isPending || updateExpense.isPending;
  const deleteLoading = deleteExpense.isPending;

  const isChanged = data
    ? expenseTitle !== data.title ||
      Number(expenseAmount) !== data.amount ||
      expenseDate !== getFormattedDate(data.date.seconds)
    : true;

  const quickDates = [
    { label: i18n.t("today"), value: todayString() },
    { label: i18n.t("yesterday"), value: yesterdayString() },
  ];

  const resetForm = () => {
    setExpenseTitle("");
    setExpenseAmount("");
    setExpenseDate(todayString());
  };

  const deleteExpenseHandler = async () => {
    if (!data) return;
    try {
      await deleteExpense.mutateAsync(data.id);
      setShowDeleteConf(false);
      navigation.goBack();
    } catch (err) {
      console.log("deleteExpense ERROR ==>", err);
    }
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
    const expenseData: ExpenseItemProps = {
      title: expenseTitle.trim(),
      amount: parseFloat(expenseAmount),
      date: { seconds: new Date(expenseDate).getTime() / 1000 },
    };

    const isValidTitle = expenseData.title.length > 0;
    const isValidAmount = !isNaN(expenseData.amount) && expenseData.amount > 0;
    setTitleIsValid(isValidTitle);
    setAmountIsValid(isValidAmount);
    if (!isValidTitle || !isValidAmount) return;

    try {
      data
        ? await updateExpense.mutateAsync({ id: data.id, data: expenseData })
        : await addExpense.mutateAsync(expenseData);
      resetForm();
      navigation.navigate("ExpensesOverview", { screen: "Expenses" });
    } catch (err) {
      console.log(data ? "updateExpense ERROR ==>" : "addExpense ERROR ==>", err);
    }
  };

  const onDatePicked = (date: Date) => {
    setExpenseDate(getFormattedDate(date.getTime() / 1000));
    setDatePickerVisibility(false);
  };

  return (
    <View className="flex-1 bg-bgScreen">
      <NavigationHeader
        title={isEdit ? i18n.t("editExpense") : i18n.t("addExpense")}
        showArrow={isEdit}
      />
      <ConfirmModal
        showModal={showDeleteConf}
        closeModal={() => setShowDeleteConf(false)}
        title={i18n.t("confirmDelete")}
        isLoading={deleteLoading}
        confirm={deleteExpenseHandler}
      />
      <DateTimePickerModal
        isVisible={isDatePickerVisible}
        mode="date"
        date={toLocalDate(expenseDate)}
        onConfirm={onDatePicked}
        onCancel={() => setDatePickerVisibility(false)}
        maximumDate={new Date()}
      />

      <KeyboardAvoidingView
        className="flex-1"
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <ScrollView
          className="flex-1"
          contentContainerClassName="px-4 pt-5 pb-6"
          keyboardShouldPersistTaps="handled"
          keyboardDismissMode="on-drag"
        >
          {/* Amount: the hero of the form */}
          <Pressable
            onPress={() => amountInputRef.current?.focus()}
            className={cn(
              `${card} items-center py-7 px-4`,
              amountFocused && "border-primaryColor",
              !amountIsValid && "border-error500",
            )}
          >
            <Text className={`text-[13px] text-placeholderColor ${fonts.medium} mb-2`}>
              {i18n.t("amount")}
            </Text>
            <View className="flex-row items-center justify-center" style={{ direction: "ltr" }}>
              <Text
                className={cn(
                  "text-[30px] font-num-bold me-1",
                  expenseAmount ? "text-primaryColor" : "text-placeholderColor",
                )}
              >
                $
              </Text>
              <TextInput
                ref={amountInputRef}
                value={expenseAmount}
                onChangeText={onChangeAmount}
                onFocus={() => setAmountFocused(true)}
                onBlur={() => setAmountFocused(false)}
                placeholder="0.00"
                placeholderTextColorClassName="accent-placeholderColor"
                selectionColorClassName="accent-primaryColor"
                keyboardType="decimal-pad"
                maxLength={9}
                className="min-w-20 p-0 text-[44px] font-num-bold text-mainColor text-center"
                style={{ includeFontPadding: false }}
              />
            </View>
          </Pressable>
          {!amountIsValid && <Text className={errorText}>{i18n.t("amountError")}</Text>}

          {/* Details */}
          <View className={cn(`${card} mt-4 overflow-hidden`, !titleIsValid && "border-error500")}>
            <View className="flex-row items-center gap-3 px-4">
              <Pen
                width={20}
                height={20}
                color={getThemeColor(titleIsValid ? "placeholderColor" : "error500")}
              />
              <TextInput
                value={expenseTitle}
                onChangeText={onChangeTitle}
                placeholder={i18n.t("titlePlaceholder")}
                placeholderTextColorClassName="accent-placeholderColor"
                selectionColorClassName="accent-primaryColor"
                maxLength={TITLE_MAX_LENGTH}
                returnKeyType="done"
                className={`flex-1 py-4 text-[16px] text-mainColor text-start ${fonts.medium}`}
              />
              {expenseTitle.length > 0 && (
                <Text className="text-[12px] text-placeholderColor font-num-medium">
                  {expenseTitle.length}/{TITLE_MAX_LENGTH}
                </Text>
              )}
            </View>

            <View className="h-px bg-borderColor mx-4" />

            <TouchableOpacity
              className="flex-row items-center gap-3 px-4 py-4"
              activeOpacity={0.7}
              onPress={() => setDatePickerVisibility(true)}
            >
              <CalendarDays width={20} height={20} color={getThemeColor("placeholderColor")} />
              <Text className={`flex-1 text-[16px] text-mainColor text-start ${fonts.medium}`}>
                {formatDisplayDate(expenseDate)}
              </Text>
              <ChevronRight
                width={18}
                height={18}
                color={getThemeColor("placeholderColor")}
                style={chevronStyle}
              />
            </TouchableOpacity>
          </View>
          {!titleIsValid && <Text className={errorText}>{i18n.t("titleError")}</Text>}

          {/* Quick date shortcuts */}
          <View className="flex-row flex-wrap gap-2 mt-3">
            {quickDates.map(({ label, value }) => {
              const selected = expenseDate === value;
              return (
                <TouchableOpacity
                  key={label}
                  activeOpacity={0.7}
                  onPress={() => setExpenseDate(value)}
                  className={cn(
                    "px-4 py-2 rounded-full border",
                    selected ? "bg-primaryColor border-primaryColor" : "bg-bgContainer border-borderColor",
                  )}
                >
                  <Text className={cn(`text-[14px] ${fonts.medium}`, selected ? "text-white" : "text-mainColor")}>
                    {label}
                  </Text>
                </TouchableOpacity>
              );
            })}
            <TouchableOpacity
              activeOpacity={0.7}
              onPress={() => setDatePickerVisibility(true)}
              className={cn(
                "px-4 py-2 rounded-full border",
                quickDates.some(({ value }) => value === expenseDate)
                  ? "bg-bgContainer border-borderColor"
                  : "bg-primaryColor border-primaryColor",
              )}
            >
              <Text
                className={cn(
                  `text-[14px] ${fonts.medium}`,
                  quickDates.some(({ value }) => value === expenseDate) ? "text-mainColor" : "text-white",
                )}
              >
                {i18n.t("pickDate")}
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>

        {/* Actions pinned above the keyboard / tab bar */}
        <View className="px-4 pt-3 pb-4" style={isEdit ? { paddingBottom: insets.bottom + 16 } : undefined}>
          <Button
            btnText={isEdit ? i18n.t("update") : i18n.t("add")}
            onPress={onConfirm}
            disabled={!isChanged || isLoading}
            isLoading={isLoading}
            customStyle={cn("w-full h-13 m-0 rounded-2xl", !isChanged && "opacity-50")}
            textStyle={`text-[16px] ${fonts.bold}`}
          />
          {isEdit && (
            <TouchableOpacity
              className="flex-row items-center justify-center gap-2 mt-2 py-3"
              activeOpacity={0.7}
              onPress={() => setShowDeleteConf(true)}
            >
              <Trash width={18} height={18} color={getThemeColor("error500")} />
              <Text className={`text-[15px] text-error500 ${fonts.medium}`}>
                {i18n.t("deleteExpense")}
              </Text>
            </TouchableOpacity>
          )}
        </View>
      </KeyboardAvoidingView>
    </View>
  );
};
