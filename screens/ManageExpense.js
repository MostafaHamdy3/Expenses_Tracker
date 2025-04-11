import { useContext, useLayoutEffect, useState } from "react";
import { View, StyleSheet } from "react-native";

import IconButton from './../components/UI/IconButton';
import { GlobalStyles } from './../constants/Styles';
import { ExpenseContext } from "../store/expenses-context";
import ExpenseForm from "../components/ManageExpense/ExpenseForm";
import { deleteExpense, storeExpense, updateExpense } from "../util/http";
import LoadingOverlay from "../components/UI/LoadingOverlay";
import ErrorOverlay from "../components/UI/ErrorOverlay";
import ConfirmModal from "../components/Modals/ConfirmModal";

const ManageExpense = ({ route, navigation }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState();
  const [showDeleteConf, setShowDeleteConf] = useState(false);

  const expenseCtx = useContext(ExpenseContext);

  const editedExpenseId = route.params?.expenseId;
  const isEditing = !!editedExpenseId;

  const selectedExpense = expenseCtx.expenses.find(
    expense => expense.id === editedExpenseId
  )

  useLayoutEffect(() => {
    navigation.setOptions({
      title: isEditing ? "Edit Expense" : "Add Expense",
    })
  }, [isEditing, navigation])

  const onShowConfirmDelete = () => {
    setShowDeleteConf(true);
  };

  const closeConfirmDelete = () => {
    setShowDeleteConf(false);
  };

  const deleteExpenseHandler = async () => {
    setIsLoading(true)
    try {
      expenseCtx.removeExpense(editedExpenseId);
      await deleteExpense(editedExpenseId)
      navigation.goBack()
    }catch(err) {
      setError("Couldn't deleting expense! - please try again later!")
      setIsLoading(false)
    }
  }

  const cancelHandler = () => {
    navigation.goBack()
  }

  const confirmHandler = async (expenseData) => {
    setIsLoading(true)
    try{
      if (isEditing) {
        expenseCtx.updateExpense(editedExpenseId, expenseData) 
        await updateExpense(editedExpenseId, expenseData)
      } else {
        const id = await storeExpense(expenseData)
        expenseCtx.addExpense({...expenseData, id: id})
      } 
      navigation.goBack()
    } catch(err) {
      setError("Couldn't save data - please try again later!")
      setIsLoading(false)
    }
  }

  if (error && !isLoading) 
    return <ErrorOverlay message={error} />

  if (isLoading) return <LoadingOverlay />

  return (
    <View style={styles.container}>
      <ConfirmModal
        showModal={showDeleteConf}
        closeModal={closeConfirmDelete}
        title="Are you sure you want to delete this expense?"
        confirm={deleteExpenseHandler}
      />
      <ExpenseForm 
        submitButtonLabel={isEditing ? "Update" : "Add"} 
        onCancel={cancelHandler}
        onSubmit={confirmHandler}
        defaultValue={selectedExpense}
      />
      {isEditing && (
        <View style={styles.deleteContainer}>
          <IconButton 
            icon="trash"
            size={32}
            color={GlobalStyles.colors.error500}
            onPress={onShowConfirmDelete}
          />
        </View>
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: GlobalStyles.colors.primary800,
    padding: 16,
  },
  deleteContainer: {
    marginTop: 16,
    paddingTop: 8,
    borderTopWidth: 2,
    borderTopColor: GlobalStyles.colors.primary200,
    alignItems: 'center'
  },
})

export default ManageExpense;