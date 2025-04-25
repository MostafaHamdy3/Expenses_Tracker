import { create } from "zustand";
import { immer } from "zustand/middleware/immer";
import { getDocs, query, collection, addDoc, doc, updateDoc, where, deleteDoc } from "firebase/firestore";
import { db } from "../FirebaseConfig";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { ExpenseItemProps } from "../components/ExpenseItem";

const expensesCollection = collection(db, "expenses");

export interface ExpenseItemWithId extends ExpenseItemProps {
  id: string;
}
interface ExpenseStore {
  expenses: ExpenseItemWithId[];
  fetchExpenses: () => Promise<void>;
  addExpense: (expenseData: ExpenseItemProps) => Promise<void>;
  updateExpense: (id: string, expenseData: ExpenseItemProps) => Promise<void>;
  deleteExpense: (id: string) => Promise<void>;
};

export const useExpenseStore = create<ExpenseStore>()(
  immer((set) => ({
    expenses: [],

    fetchExpenses: async () => {
      try {
        const token = await AsyncStorage.getItem("authToken");
        const id = await AsyncStorage.getItem("userId");
        if (token) {
          const expensesQuery = query(expensesCollection, where("userId", "==", id));
          const data = await getDocs(expensesQuery);
          const expenses = data.docs.map((doc) => ({ 
            ...doc.data(), 
            id: doc.id
          })) as ExpenseItemWithId[];
          set({ expenses });
        }
      } catch (err) {
        console.log("fetchExpenses ERROR ==>", err);
      }
    },

    addExpense: async (expenseData: ExpenseItemProps) => {
      try {
        const token = await AsyncStorage.getItem("authToken");
        const userId = await AsyncStorage.getItem("userId");
        if (token) {
          const docRef = await addDoc(expensesCollection, {
            userId,
            title: expenseData.title,
            amount: expenseData.amount,
            date: expenseData.date,
          });
          set((state) => ({ 
            expenses: [...state.expenses, { ...expenseData, id: docRef.id }]
          }));
        } else {
          console.log("No user logged in");
        }
      } catch (err) {
        console.log("addExpense ERROR ==>", err);
      }
    },

    updateExpense: async (id: string, expenseData: ExpenseItemProps) => {
      try {
        const expenseDoc = doc(db, "expenses", id);
        await updateDoc(expenseDoc, {
          title: expenseData.title,
          amount: expenseData.amount,
          date: expenseData.date,
        });
        set((state) => {
          const index = state.expenses.findIndex((exp) => exp.id === id);
          if (index !== -1) {
            state.expenses[index] = { ...expenseData, id };
          }
        });
      } catch (err) {
        console.log("updateExpense ERROR ==>", err);
      }
    },

    deleteExpense: async (id: string) => {
      try {
        const expenseDoc = doc(db, "expenses", id);
        await deleteDoc(expenseDoc);
        set((state) => ({
          expenses: state.expenses.filter((exp) => exp.id !== id)
        }));
      } catch (err) {
        console.log("deleteExpense ERROR ==>", err);
      }
    }
  }))
);