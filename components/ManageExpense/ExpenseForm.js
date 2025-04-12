import { useState } from "react";
import { Text, View, StyleSheet } from "react-native";

import Input from "./Input";
import Button from "../UI/Button";
import { getFormattedDate } from "../../util/Date";
import { Colors } from "../../constants/Styles";

const ExpenseForm = ({ submitButtonLabel, onCancel, onSubmit, defaultValue }) => {
  const [expenseTitle, setExpenseTitle] = useState(defaultValue?.title || "");
  const [expenseAmount, setExpenseAmount] = useState(defaultValue?.amount || 0);
  const [expenseDate, setExpenseDate] = useState(defaultValue?.date ? getFormattedDate(defaultValue.date) : "");
  const [titleIsValid, setTitleIsValid] = useState(true);
  const [amountIsValid, setAmountIsValid] = useState(true);
  const [dateIsValid, setDateIsValid] = useState(true);

  const isChanged = (
    defaultValue ?
      expenseTitle !== defaultValue.title ||
      expenseAmount !== defaultValue.amount ||
      expenseDate !== getFormattedDate(defaultValue.date)
    : submitButtonLabel === "Add" ? true : false
  );

  const onChangeTitle = (text) => {
    setExpenseTitle(text);
    !titleIsValid && setTitleIsValid(true);
  };

  const onChangeAmount = (value) => {
    setExpenseAmount(Number(value));
    !amountIsValid && setAmountIsValid(true);
  };

  const onChangeDate = (date) => {
    setExpenseDate(date);
    !dateIsValid && setDateIsValid(true);
  };

  const confirmHandler = () => {
    const expenseData = {
      title: expenseTitle,
      amount: expenseAmount,
      date: new Date(expenseDate)
    }

    // trim to remove the spaces.
    const isValidTitle = expenseData.title.trim().length > 0;
    const isValidAmount = !isNaN(expenseData.amount) && expenseData.amount > 0;
    const isValidDate = expenseData.date.toString() !== "Invalid Date";
    setTitleIsValid(isValidTitle);
    setAmountIsValid(isValidAmount);
    setDateIsValid(isValidDate);

    if (isValidTitle && isValidAmount && isValidDate) {
      onSubmit(expenseData)
    };
  }

  return (
    <View>
      <View>
        <Input
          label="Title"
          isInvalid={!titleIsValid}
          textInputConfig={{
            onChangeText: onChangeTitle,
            value: expenseTitle,
          }}
        />
        {!titleIsValid && (
          <Text style={[styles.errorText, { marginTop: 0 }]}>
            Invalid title!
          </Text>
        )}
      </View>
      <View style={styles.inputsRow}>
        <View style={{ height: 60, width: "45%" }}>
          <Input
            label="Amount"
            isInvalid={!amountIsValid}
            textInputConfig={{
              keyboardType: "decimal-pad",
              onChangeText: onChangeAmount,
              value: expenseAmount.toString(),
            }}
          />
          {!amountIsValid && (
            <Text style={styles.errorText}>
              Invalid amount!, must be greater than 0
            </Text>
          )}
        </View>
        <View style={{ height: 60, width: "48%" }}>
          <Input
            label="Date"
            isInvalid={!dateIsValid}
            textInputConfig={{
              placeholder: "YYYY-MM-DD",
              maxLength: 10,
              onChangeText: onChangeDate,
              value: expenseDate,
            }}
          />
          {!dateIsValid && (
            <Text style={styles.errorText}>
              Invalid date!, must like this (YYYY-MM-DD)
            </Text>
          )}
        </View>
      </View>
      <View style={styles.buttons}>
        <Button
          btnStyle={styles.cancelBtnStyle}
          textStyle={styles.cancelTextStyle}
          onPress={onCancel}
        >
          Cancel
        </Button>
        <Button
          onPress={confirmHandler}
          disabled={!isChanged}
        >
          {submitButtonLabel}
        </Button>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  inputsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  buttons: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 60,
  },
  cancelBtnStyle: {
    backgroundColor: Colors.fieldBg,
  },
  cancelTextStyle: {
    color: Colors.gray700,
  },
  errorText: {
    color: "red",
    textAlign: "center",
  },
});

export default ExpenseForm;