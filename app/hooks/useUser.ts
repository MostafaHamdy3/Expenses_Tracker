import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { fetchUserBudget, saveUserBudget } from "../api/user";

export const userKeys = {
  budget: ["user", "budget"] as const,
};

export const useUserBudget = () =>
  useQuery({
    queryKey: userKeys.budget,
    queryFn: fetchUserBudget,
  });

export const useSaveUserBudget = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: saveUserBudget,
    onSuccess: (budget) => queryClient.setQueryData(userKeys.budget, budget),
  });
};
