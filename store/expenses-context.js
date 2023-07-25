import { createContext, useReducer } from "react";

export const ExpenseContext = createContext({
  expenses: [],
  addExpense: ({title, amount, date}) => {},
  setExpense: (expenses) => {},
  removeExpense: (id) => {},
  updateExpense: (id, {title, amount, date}) => {},
})

function ExpenseReducer(state, action) {
  switch (action.type) {
    case "ADD":
      return [action.payload, ...state]
    case "SET":
      const inverted = action.payload.reverse()
      return inverted;
    case "REMOVE":
      return state.filter((expense) => expense.id !== action.payload)
    case "UPDATE":
      const updatableExpenseIndex = state.findIndex(
        (expense) => expense.id === action.payload.id
      );
      const updatableExpense = state[updatableExpenseIndex];
      const updatedItem = { ...updatableExpense, ...action.payload.data };
      const updatedExpenses = [ ...state ];
      updatedExpenses[updatableExpenseIndex] = updatedItem;
      return updatedExpenses
    default:
      return state;
  }
}

function ExpenseContextProvider({children}) {
  const [expenseState, dispatch] = useReducer(ExpenseReducer, []);

  function addExpense(expenseData) { 
    dispatch({ type: "ADD", payload: expenseData })
  }

  function setExpense(expenses) {
    dispatch({ type: "SET", payload: expenses })
  }

  function deleteExpense(id) {
    dispatch({ type: "REMOVE", payload: id})
  }

  function updateExpense(id, expenseData) {
    dispatch({ type: "UPDATE", payload: {id: id, data: expenseData } })
  }

  const value = {
    expenses: expenseState,
    addExpense: addExpense,
    setExpense: setExpense,
    removeExpense: deleteExpense,
    updateExpense: updateExpense,
  }

  return <ExpenseContext.Provider value={value}>{children}</ExpenseContext.Provider>
}

export default ExpenseContextProvider;