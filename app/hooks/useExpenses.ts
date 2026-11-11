import { QueryDocumentSnapshot } from "firebase/firestore";
import {
  useInfiniteQuery,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";

import {
  addExpense,
  deleteExpense,
  fetchExpensesPage,
  fetchExpensesTotal,
  updateExpense,
} from "../api/expenses";
import { ExpensesPeriod } from "../utility/utility";

export const expenseKeys = {
  all: ["expenses"] as const,
  list: (period: ExpensesPeriod) => ["expenses", "list", period] as const,
  total: (period: ExpensesPeriod) => ["expenses", "total", period] as const,
};

export const useExpenses = (period: ExpensesPeriod) => {
  const result = useInfiniteQuery({
    queryKey: expenseKeys.list(period),
    queryFn: ({ pageParam }) => fetchExpensesPage(period, pageParam),
    initialPageParam: null as QueryDocumentSnapshot | null,
    getNextPageParam: (lastPage) =>
      lastPage.hasMore ? lastPage.lastVisible : undefined,
    structuralSharing: false,
  });
  const expenses = result.data?.pages.flatMap((page) => page.expenses) ?? [];
  return { ...result, expenses };
};

export const useExpensesTotal = (period: ExpensesPeriod) =>
  useQuery({
    queryKey: expenseKeys.total(period),
    queryFn: () => fetchExpensesTotal(period),
  });

const useInvalidateExpenses = () => {
  const queryClient = useQueryClient();
  return () => queryClient.invalidateQueries({ queryKey: expenseKeys.all });
};

export const useAddExpense = () => {
  const invalidate = useInvalidateExpenses();
  return useMutation({ mutationFn: addExpense, onSuccess: invalidate });
};

export const useUpdateExpense = () => {
  const invalidate = useInvalidateExpenses();
  return useMutation({ mutationFn: updateExpense, onSuccess: invalidate });
};

export const useDeleteExpense = () => {
  const invalidate = useInvalidateExpenses();
  return useMutation({ mutationFn: deleteExpense, onSuccess: invalidate });
};
