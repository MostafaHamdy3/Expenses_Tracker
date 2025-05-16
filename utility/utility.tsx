import { ExpenseItemWithId } from "../store/expense_store";

export const nFormatter = (num: number) => {
  const lookup = [
    { value: 1, symbol: "" },
    { value: 1e3, symbol: "k" },
    { value: 1e6, symbol: "M" },
    { value: 1e9, symbol: "G" },
    { value: 1e12, symbol: "T" },
    { value: 1e15, symbol: "P" },
    { value: 1e18, symbol: "E" }
  ];
  var item = lookup.slice().reverse().find(function(item) {
    return num >= item.value;
  });
  return item ? (num / item.value).toFixed(2) + item.symbol : "0.00";
}

export const getFormattedDate = (date: number) => {  
  const newDate = new Date(date * 1000);

  const year = newDate.getFullYear();
  const month = String(newDate.getMonth() + 1).padStart(2, '0');
  const day = String(newDate.getDate()).padStart(2, '0');

  return `${year}-${month}-${day}`;
}

export const ThisMonthExpenses = (expenses: ExpenseItemWithId[]) => {
  if (!expenses) return [];

  const today = new Date();
  const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
  const lastDayOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0);

  const firstDayInSeconds = Math.floor(firstDayOfMonth.getTime() / 1000);
  const lastDayInSeconds = Math.floor(lastDayOfMonth.getTime() / 1000);

  return expenses.filter((expense) => {
    const expenseDate = expense.date.seconds;
    return expenseDate >= firstDayInSeconds && expenseDate <= lastDayInSeconds;
  });
};

export const expensesSum = (recentExpenses: ExpenseItemWithId[]) => (
  recentExpenses?.reduce((sum, expense) => sum + Number(expense.amount), 0)
);