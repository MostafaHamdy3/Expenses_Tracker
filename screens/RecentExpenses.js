import { useContext, useEffect, useState } from "react";

import ExpensesOutput from "../components/ExpensesOutput/ExpensesOutput";
import { ExpenseContext } from "../store/expenses-context";
import { getDateMinusDays } from "../util/Date";
import { fetchExpense } from "../util/http";
import LoadingOverlay from './../components/UI/LoadingOverlay';
import ErrorOverlay from "../components/UI/ErrorOverlay";

function RecentExpenses() {
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState()

  const expensesCtx = useContext(ExpenseContext);

  useEffect(() => {
    async function getExpenses() {
      setIsLoading(true)
      try {
        const expenses = await fetchExpense();
        expensesCtx.setExpense(expenses)
      } catch (err) {
        setError("Felid fetch data!")
      }
      setIsLoading(false)
    }
    getExpenses()
  }, [])

  if (error && !isLoading) 
    return <ErrorOverlay message={error} />

  if (isLoading) return <LoadingOverlay />

  const recentExpenses = expensesCtx.expenses.filter((expense) => {
    const today = new Date();
    const date7DaysAgo = getDateMinusDays(today, 7)

    return (expense.date >= date7DaysAgo) && (expense.date <= today);
  })

  return (
    <ExpensesOutput 
      expenses={recentExpenses} 
      expensesName="Last 7 Days" 
      fallBackText="No expenses registered for the last 7 days."
    />
  )
}

export default RecentExpenses;