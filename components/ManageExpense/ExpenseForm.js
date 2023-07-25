import { useState } from "react";
import { Text, View, StyleSheet } from "react-native";

import Input from "./Input";
import Button from "../UI/Button";
import { getFormattedDate } from "../../util/Date";

function ExpenseForm({ submitButtonLabel, onCancel, onSubmit, defaultValue }) {
  const [inputs, setInputs] = useState({
    title: { 
      value: defaultValue? defaultValue.title : "",
      isValid: true
    },
    amount: {
      value: defaultValue ? defaultValue.amount.toString() : "",
      isValid: true
    },
    date: {
      value: defaultValue ? getFormattedDate(defaultValue.date) : "",
      isValid: true
    }
  })

  const inputChangeHandler = (inputIdentifier, enteredValue) => {
    setInputs((curInputs) => {
      return {
        ...curInputs,
        [inputIdentifier]: { value: enteredValue, isValid: true },
      }
    })
  }

  function confirmHandler() {
    const expenseData = {
      title: inputs.title.value,
      amount: +inputs.amount.value,
      date: new Date(inputs.date.value)
    }

    // trim to remove the spaces.
    const titleIsValid = expenseData.title.trim().length > 0;
    const amountIsValid = !isNaN(expenseData.amount) && expenseData.amount > 0;
    const dateIsValid = expenseData.date.toString() !== "Invalid Date";

    if (!titleIsValid || !dateIsValid || !amountIsValid) {
      setInputs((curInputs) => {
        return {
          title: { value: curInputs.title.value, isValid: titleIsValid },
          amount: { value: curInputs.amount.value, isValid: amountIsValid },
          date: { value: curInputs.date.value, isValid: dateIsValid }
        }
      })
      return;
    }

    onSubmit(expenseData)
  }

  return (
    <View>
      <View>
        <Input 
          label="Title" 
          isInvalid={!inputs.title.isValid}
          textInputConfig={{
            onChangeText: inputChangeHandler.bind(this, "title"),
            value: inputs.title.value
          }} 
        />
        {!inputs.title.isValid && <Text style={[styles.errorText, {marginTop: 0}]}>Invalid title!</Text>}
      </View>
      <View style={styles.inputsRow}>
        <View style={{height: 60, width: "45%"}}>
          <Input
            label="Amount" 
            isInvalid={!inputs.amount.isValid}
            textInputConfig={{
              KeyboardType: "decimal-pad",
              onChangeText: inputChangeHandler.bind(this, "amount"),
              value: inputs.amount.value
            }}
          />
          {!inputs.amount.isValid && <Text style={styles.errorText}>Invalid amount!, must be greater than 0</Text>}
        </View>
        <View style={{ height: 60, width: "48%" }}>
          <Input
            label="Date" 
            isInvalid={!inputs.date.isValid}
            textInputConfig={{
              placeholder: "YYYY-MM-DD",
              maxLength: 10,
              onChangeText: inputChangeHandler.bind(this, "date"),
              value: inputs.date.value
            }}
          />
          {!inputs.date.isValid && <Text style={styles.errorText}>Invalid date!, must like this (YYYY-MM-DD)</Text>}
        </View>
      </View>
      <View style={styles.buttons}>
        <Button 
          style={styles.button} 
          mode="flat" 
          onPress={onCancel}
        >Cancel</Button>
        <Button 
          style={styles.button} 
          onPress={confirmHandler}
        >{submitButtonLabel}</Button>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  inputsRow: {
    flexDirection: "row",
    justifyContent: "space-between"
  },
  // inputStyle: {
  //   flex: 1,
  // },
  buttons: {
    flexDirection: 'row',
    justifyContent:'center',
    alignItems: 'center',
    marginTop: 60,
  },
  button: {
    minWidth: 120,
    marginHorizontal: 8
  },
  errorText: {
    color: "red",
    textAlign: "center",
  }
})

export default ExpenseForm;