import { useLayoutEffect, useState } from "react";
import { View, StyleSheet, TouchableOpacity, Image, Text } from "react-native";

import IconButton from './../components/UI/IconButton';
import { Colors } from './../constants/Styles';
import ConfirmModal from "../components/Modals/ConfirmModal";
import { addExpense, deleteExpense, updateExpense } from "../store/expense_store";
import { getFormattedDate } from "../util/Date";
import Input from "../components/UI/Input";
import Button from "../components/UI/Button";

import DateTimePickerModal from "react-native-modal-datetime-picker";

const ManageExpense = ({ route, navigation }) => {
  const data = route.params?.data;

  const [isLoading, setIsLoading] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  const [error, setError] = useState(false);
  const [showDeleteConf, setShowDeleteConf] = useState(false);
  const [expenseTitle, setExpenseTitle] = useState(data?.title || "");
  const [expenseAmount, setExpenseAmount] = useState(data?.amount || 0);
  const [expenseDate, setExpenseDate] = useState(data?.date ? getFormattedDate(data.date.seconds) : "");
  const [titleIsValid, setTitleIsValid] = useState(true);
  const [amountIsValid, setAmountIsValid] = useState(true);
  const [dateIsValid, setDateIsValid] = useState(true);

  const isChanged = (
    data ?
      expenseTitle !== data.title ||
      expenseAmount !== data.amount ||
      expenseDate !== getFormattedDate(data.date.seconds)
    : !data
  );

  useLayoutEffect(() => {
    navigation.setOptions({
      title: data ? "Edit Expense" : "Add Expense",
    })
  }, [navigation])

  const onShowConfirmDelete = () => {
    setShowDeleteConf(true);
  };

  const closeConfirmDelete = () => {
    setShowDeleteConf(false);
  };

  const deleteExpenseHandler = async () => {
    setDeleteLoading(true)
    try {
      await deleteExpense(data.id);
      closeConfirmDelete();
      navigation.goBack();
    }catch (err) {
      setError(true)
    } finally {
      setDeleteLoading(false);
    }
  }

  const cancelHandler = () => {
    navigation.goBack()
  }

  const onChangeTitle = (text) => {
    setExpenseTitle(text);
    !titleIsValid && setTitleIsValid(true);
  };

  const onChangeAmount = (value) => {
    setExpenseAmount(Number(value));
    !amountIsValid && setAmountIsValid(true);
  };

  const onConfirm = async () => {
    setIsLoading(true)
    const expenseData = {
      title: expenseTitle,
      amount: expenseAmount,
      date: new Date(expenseDate)
    }

    const isValidTitle = expenseData.title.trim().length > 0;
    const isValidAmount = !isNaN(expenseData.amount) && expenseData.amount > 0;
    const isValidDate = expenseData.date.toString() !== "Invalid Date";
    setTitleIsValid(isValidTitle);
    setAmountIsValid(isValidAmount);
    setDateIsValid(isValidDate);

    if (isValidTitle && isValidAmount && isValidDate) {
      data ? await updateExpense(data.id, expenseData) : await addExpense(expenseData);
      navigation.goBack()
    }
    setIsLoading(false);
  };

  const startTimeConfirm = (date) => {
    const dateOnly = date.toISOString().split('T')[0];
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
    <View style={styles.container}>
      <ConfirmModal
        showModal={showDeleteConf}
        closeModal={closeConfirmDelete}
        title="Are you sure you want to delete this expense?"
        isLoading={deleteLoading}
        confirm={deleteExpenseHandler}
      />
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
          <View style={styles.field}>
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
          <View style={styles.field}>
            <View style={styles.dateContent}>
              <Text style={[styles.label, !dateIsValid && styles.invalidLabel]}>
                Date
              </Text>
              <View style={[styles.datePicker, {
                backgroundColor: dateIsValid ? Colors.textColor1 : Colors.error50,
              }]}>
                <Text style={styles.dateText}>
                  {expenseDate || "YYYY-MMM-DD"}
                </Text>
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
            {!dateIsValid && (
              <Text style={styles.errorText}>
                Invalid date!, must like this (YYYY-MM-DD)
              </Text>
            )}
          </View>
          <DateTimePickerModal
            isVisible={isDatePickerVisible}
            mode="date"
            onConfirm={startTimeConfirm}
            onCancel={hideDatePicker}
            accentColor={Colors.fieldBg}
          />
        </View>
        <View style={styles.buttons}>
          <Button
            btnStyle={styles.cancelBtnStyle}
            textStyle={styles.cancelTextStyle}
            onPress={cancelHandler}
          >
            Cancel
          </Button>
          <Button
            onPress={onConfirm}
            disabled={!isChanged}
            isLoading={isLoading}
          >
            {data ? "Update" : "Add"}
          </Button>
        </View>
      </View>
      {data && (
        <View style={styles.deleteContainer}>
          <IconButton
            icon="trash"
            size={32}
            color={Colors.error500}
            onPress={onShowConfirmDelete}
          />
        </View>
      )}
      {error && (
        <Text style={styles.errorText}>Delete failed, please try again.</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.darkerBg,
    padding: 16,
  },
  inputsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  field: {
    height: 60,
    width: "48%",
  },
  dateContent: {
    marginHorizontal: 4,
    marginVertical: 8,
  },
  label: {
    fontSize: 12,
    color: Colors.textColor1,
  },
  invalidLabel: {
    color: Colors.error500,
  },
  datePicker: {
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 6,
  },
  iconContainer: {
    borderRadius: 24,
    position: "absolute",
    right: 4,
    top: 8,
  },
  icon: {
    width: 24,
    height: 24,
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
    textAlign: "left",
  },
  deleteContainer: {
    marginTop: 16,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: Colors.textColor1,
    alignItems: 'center'
  },
})

export default ManageExpense;