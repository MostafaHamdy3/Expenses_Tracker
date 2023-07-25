import axios from "axios";

const BACKEND_URL = "https://expenses-tracker-6b4be-default-rtdb.firebaseio.com"

export async function storeExpense(expenseData) {
  const res = await axios.post(
    BACKEND_URL + "/expenses.json",
    expenseData
  )
  const id = res.data.name;
  return id;
}

export async function fetchExpense() {
  const res = await axios.get(
    BACKEND_URL + "/expenses.json"
  )

  const expenses = [];
  
  for (const key in res.data) {
    const expenseObj = {
      id: key,
      title: res.data[key].title,
      amount: res.data[key].amount,
      date: new Date(res.data[key].date)
    }
    expenses.push(expenseObj);
  }

  return expenses;
}

export function updateExpense(id, expenseData) {
  return axios.put(BACKEND_URL + `/expenses/${id}.json`, expenseData)
}

export function deleteExpense(id) {
  return axios.delete(BACKEND_URL + `/expenses/${id}.json`)
}