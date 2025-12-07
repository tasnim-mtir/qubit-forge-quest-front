import { useQuery } from "@tanstack/react-query";
import { stakeAPI, computeTaskAPI, vaultAPI } from "@/services/protocolAPI";

// ============================================
// GET ALL STAKES (ADMIN)
// ============================================
export const useGetAllStakes = (page: number = 1, limit: number = 50) => {
  return useQuery({
    queryKey: ["allStakes", page, limit],
    queryFn: () => stakeAPI.getAllStakes(page, limit),
    retry: 1,
    staleTime: 30000, // 30 seconds
  });
};

// ============================================
// GET ALL TASKS (ADMIN)
// ============================================
export const useGetAllTasks = (page: number = 1, limit: number = 50, status?: string) => {
  return useQuery({
    queryKey: ["allTasks", page, limit, status],
    queryFn: () => computeTaskAPI.getAllTasks(page, limit, status),
    retry: 1,
    staleTime: 30000, // 30 seconds
  });
};

// ============================================
// GET VAULT STATS (ADMIN)
// ============================================
export const useGetVaultStats = () => {
  return useQuery({
    queryKey: ["vaultStats"],
    queryFn: () => vaultAPI.getVaultStats(),
    retry: 1,
    staleTime: 60000, // 60 seconds
  });
};
