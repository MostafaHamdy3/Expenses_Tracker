import { useContext } from "react";
import ExpensesOutput from "../components/ExpensesOutput/ExpensesOutput";
import { ExpenseContext } from "../store/expenses-context";

function AllExpenses() {
  const expensesCtx = useContext(ExpenseContext);

  return (
    <ExpensesOutput 
      expenses={expensesCtx.expenses} 
      expensesName="Total" 
      fallBackText="No registered expenses found!"
    />
  )
}

export default AllExpenses;