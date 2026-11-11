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

export interface ExpenseItemWithId extends ExpenseItemProps {
  id: string;
}

export type ExpensesPage = {
  expenses: ExpenseItemWithId[];
  lastVisible: QueryDocumentSnapshot | null;
  hasMore: boolean;
};

const PAGE_SIZE = 10;
const expensesCollection = collection(db, "expenses");

const buildExpensesQuery = (userId: string, period: ExpensesPeriod) => {
  const constraints: QueryConstraint[] = [where("userId", "==", userId)];
  const periodStart = getPeriodStartSeconds(period);
  if (periodStart !== null) {
    constraints.push(where("date.seconds", ">=", periodStart));
  }
  constraints.push(orderBy("date.seconds", "desc"));
  return query(expensesCollection, ...constraints);
};

const mapExpenses = (docs: QueryDocumentSnapshot[]) =>
  docs.map((doc) => ({ ...doc.data(), id: doc.id })) as ExpenseItemWithId[];

export const fetchExpensesPage = async (
  period: ExpensesPeriod,
  cursor: QueryDocumentSnapshot | null,
): Promise<ExpensesPage> => {
  const userId = await AsyncStorage.getItem("userId");
  if (!userId) return { expenses: [], lastVisible: null, hasMore: false };

  const constraints: QueryConstraint[] = cursor
    ? [startAfter(cursor), limit(PAGE_SIZE)]
    : [limit(PAGE_SIZE)];
  const data = await getDocs(
    query(buildExpensesQuery(userId, period), ...constraints),
  );
  return {
    expenses: mapExpenses(data.docs),
    lastVisible: data.docs[data.docs.length - 1] ?? null,
    hasMore: data.docs.length === PAGE_SIZE,
  };
};

export const fetchExpensesTotal = async (
  period: ExpensesPeriod,
): Promise<number> => {
  const userId = await AsyncStorage.getItem("userId");
  if (!userId) return 0;
  const snapshot = await getAggregateFromServer(
    buildExpensesQuery(userId, period),
    { total: sum("amount") },
  );
  return snapshot.data().total ?? 0;
};

export const addExpense = async (expenseData: ExpenseItemProps) => {
  const userId = await AsyncStorage.getItem("userId");
  if (!userId) throw new Error("No user logged in");
  await addDoc(expensesCollection, {
    userId,
    title: expenseData.title,
    amount: expenseData.amount,
    date: expenseData.date,
  });
};

export const updateExpense = async ({
  id,
  data,
}: {
  id: string;
  data: ExpenseItemProps;
}) => {
  await updateDoc(doc(db, "expenses", id), {
    title: data.title,
    amount: data.amount,
    date: data.date,
  });
};

export const deleteExpense = async (id: string) => {
  await deleteDoc(doc(db, "expenses", id));
};
