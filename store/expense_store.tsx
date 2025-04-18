import { getDocs, query, collection, addDoc, doc, updateDoc, where, deleteDoc } from "firebase/firestore";
import { db } from "../FirebaseConfig";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { ExpenseItemProps } from "../components/ExpenseItem";

const expensesCollection = collection(db, "expenses");

export const fetchExpenses = async () => {
  try {
    const token = await AsyncStorage.getItem("authToken");
    const id = await AsyncStorage.getItem("userId");
    if (token) {
      const expenses = query(expensesCollection, where("userId", "==", id));
      const data = await getDocs(expenses);
      return data.docs.map((doc) => ({ ...doc.data(), id: doc.id }));
    } else {
      console.log("No user logged in");
      return [];
    };
  } catch (err) {
    console.log("fetchExpenses ERROR ==>", err);
  }
};

export const addExpense = async (expenseData: ExpenseItemProps) => {
  try {
    const token = await AsyncStorage.getItem("authToken");
    const id = await AsyncStorage.getItem("userId");
    if (token) {
      await addDoc(expensesCollection, {
        userId: id,
        title: expenseData.title,
        amount: expenseData.amount,
        date: expenseData.date,
      });
    } else {
      console.log("No user logged in");
    }
  } catch (err) {
    console.log("addExpense ERROR ==>", err)
  }
};

export const updateExpense = async (id: string, expenseData: ExpenseItemProps) => {
  try {
    const expenseDoc = doc(db, "expenses", id);
    await updateDoc(expenseDoc, {
      title: expenseData.title,
      amount: expenseData.amount,
      date: expenseData.date,
    });
  } catch (err) {
    console.log("updateExpense ERROR ==>", err);
  };
};

export const deleteExpense = async (id: string) => {
  try {
    const expenseDoc = doc(db, "expenses", id);
    await deleteDoc(expenseDoc);
  } catch (err) {
    console.log("deleteExpense ERROR ==>", err);
  };
};