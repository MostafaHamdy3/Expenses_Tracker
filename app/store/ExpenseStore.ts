import { create } from "zustand";
import { immer } from "zustand/middleware/immer";
import {
  getDocs,
  query,
  collection,
  addDoc,
  doc,
  updateDoc,
  where,
  deleteDoc,
  orderBy,
  limit,
  startAfter,
  getAggregateFromServer,
  sum,
  QueryConstraint,
  QueryDocumentSnapshot,
} from "firebase/firestore";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { ExpenseItemProps } from "../components/ExpenseItem";
import { db } from "../../FirebaseConfig";
import { ExpensesPeriod, getPeriodStartSeconds } from "../utility/utility";

const expensesCollection = collection(db, "expenses");

const PAGE_SIZE = 10;

// Kept outside the store so immer doesn't freeze the Firestore snapshot.
let lastVisible: QueryDocumentSnapshot | null = null;
// Ignores responses of older requests when the period changes quickly.
let requestId = 0;

const buildExpensesQuery = (userId: string, period: ExpensesPeriod) => {
  const constraints: QueryConstraint[] = [where("userId", "==", userId)];
  const periodStart = getPeriodStartSeconds(period);
  if (periodStart !== null) {
    constraints.push(where("date.seconds", ">=", periodStart));
  }
  constraints.push(orderBy("date.seconds", "desc"));
  return query(expensesCollection, ...constraints);
};

const getTotal = async (userId: string, period: ExpensesPeriod) => {
  const snapshot = await getAggregateFromServer(
    buildExpensesQuery(userId, period),
    { total: sum("amount") }
  );
  return snapshot.data().total ?? 0;
};

const mapExpenses = (docs: QueryDocumentSnapshot[]) => (
  docs.map((doc) => ({ ...doc.data(), id: doc.id })) as ExpenseItemWithId[]
);

export interface ExpenseItemWithId extends ExpenseItemProps {
  id: string;
}
interface ExpenseStore {
  expenses: ExpenseItemWithId[];
  period: ExpensesPeriod;
  total: number;
  hasMore: boolean;
  isLoadingMore: boolean;
  fetchExpenses: (period?: ExpensesPeriod) => Promise<void>;
  fetchMoreExpenses: () => Promise<void>;
  getExpensesTotal: (period: ExpensesPeriod) => Promise<number>;
  addExpense: (expenseData: ExpenseItemProps) => Promise<void>;
  updateExpense: (id: string, expenseData: ExpenseItemProps) => Promise<void>;
  deleteExpense: (id: string) => Promise<void>;
};

export const useExpenseStore = create<ExpenseStore>()(
  immer((set, get) => ({
    expenses: [],
    period: "all",
    total: 0,
    hasMore: false,
    isLoadingMore: false,

    fetchExpenses: async (period = get().period) => {
      const currentRequest = ++requestId;
      set({ period });
      try {
        const token = await AsyncStorage.getItem("authToken");
        const id = await AsyncStorage.getItem("userId");
        if (token && id) {
          const [data, total] = await Promise.all([
            getDocs(query(buildExpensesQuery(id, period), limit(PAGE_SIZE))),
            getTotal(id, period),
          ]);
          if (currentRequest !== requestId) return;
          lastVisible = data.docs[data.docs.length - 1] ?? null;
          set({
            expenses: mapExpenses(data.docs),
            total,
            hasMore: data.docs.length === PAGE_SIZE,
            isLoadingMore: false,
          });
        }
      } catch (err) {
        console.log("fetchExpenses ERROR ==>", err);
      }
    },

    fetchMoreExpenses: async () => {
      const { hasMore, isLoadingMore, period } = get();
      if (!hasMore || isLoadingMore || !lastVisible) return;

      const currentRequest = requestId;
      set({ isLoadingMore: true });
      try {
        const id = await AsyncStorage.getItem("userId");
        if (id) {
          const data = await getDocs(query(
            buildExpensesQuery(id, period),
            startAfter(lastVisible),
            limit(PAGE_SIZE)
          ));
          if (currentRequest !== requestId) return;
          lastVisible = data.docs[data.docs.length - 1] ?? lastVisible;
          set((state) => ({
            expenses: [...state.expenses, ...mapExpenses(data.docs)],
            hasMore: data.docs.length === PAGE_SIZE,
          }));
        }
      } catch (err) {
        console.log("fetchMoreExpenses ERROR ==>", err);
      } finally {
        if (currentRequest === requestId) {
          set({ isLoadingMore: false });
        }
      }
    },

    getExpensesTotal: async (period: ExpensesPeriod) => {
      try {
        const id = await AsyncStorage.getItem("userId");
        return id ? await getTotal(id, period) : 0;
      } catch (err) {
        console.log("getExpensesTotal ERROR ==>", err);
        return 0;
      }
    },

    addExpense: async (expenseData: ExpenseItemProps) => {
      try {
        const token = await AsyncStorage.getItem("authToken");
        const userId = await AsyncStorage.getItem("userId");
        if (token) {
          await addDoc(expensesCollection, {
            userId,
            title: expenseData.title,
            amount: expenseData.amount,
            date: expenseData.date,
          });
          await get().fetchExpenses();
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
        await get().fetchExpenses();
      } catch (err) {
        console.log("updateExpense ERROR ==>", err);
      }
    },

    deleteExpense: async (id: string) => {
      try {
        const expenseDoc = doc(db, "expenses", id);
        await deleteDoc(expenseDoc);
        set((state) => {
          const deleted = state.expenses.find((exp) => exp.id === id);
          state.expenses = state.expenses.filter((exp) => exp.id !== id);
          if (deleted) {
            state.total -= Number(deleted.amount);
          }
        });
      } catch (err) {
        console.log("deleteExpense ERROR ==>", err);
      }
    }
  }))
);