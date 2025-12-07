import { useMutation, useQuery } from "@tanstack/react-query";
import { computeTaskAPI, stakeAPI, leaseAPI, vaultAPI } from "@/services/protocolAPI";
import { useToast } from "@/hooks/use-toast";

// ============================================
// CREATE COMPUTE TASK
// ============================================
export const useCreateComputeTask = () => {
  const { toast } = useToast();
  return useMutation({
    mutationFn: (data: {
      taskName: string;
      computeCostCC: number;
      taskDescription?: string;
      priority?: "Low" | "Medium" | "High";
      taskType?: "DataAnalysis" | "Training" | "Processing" | "General" | "Other";
      estimatedDuration?: number;
    }) =>
      computeTaskAPI.createTask(
        data.taskName,
        data.computeCostCC,
        data.taskDescription,
        data.priority,
        data.taskType,
        data.estimatedDuration
      ),
    onSuccess: (data) => {
      toast({
        title: "Success",
        description: `Task "${data.task.taskName}" created successfully`,
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to create task",
        variant: "destructive",
      });
    },
  });
};

// ============================================
// GET MY TASKS
// ============================================
export const useGetMyTasks = (page: number = 1, limit: number = 10) => {
  return useQuery({
    queryKey: ["myTasks", page, limit],
    queryFn: () => computeTaskAPI.getMyTasks(page, limit),
    retry: 1,
    staleTime: 30000, // 30 seconds
  });
};

// ============================================
// GET AVAILABLE TASKS FOR MARKETPLACE
// ============================================
export const useGetAvailableTasks = (page: number = 1, limit: number = 10) => {
  return useQuery({
    queryKey: ["availableTasks", page, limit],
    queryFn: () => computeTaskAPI.getAvailableTasks(page, limit),
    retry: 1,
    staleTime: 30000, // 30 seconds
  });
};

// ============================================
// GET USER STAKES
// ============================================
export const useGetUserStakes = (userId: string) => {
  return useQuery({
    queryKey: ["userStakes", userId],
    queryFn: () => stakeAPI.getUserStakes(userId),
    retry: 1,
    staleTime: 60000, // 60 seconds
    enabled: !!userId,
  });
};

// ============================================
// CREATE STAKE
// ============================================
export const useCreateStake = () => {
  const { toast } = useToast();
  return useMutation({
    mutationFn: (amountQX: number) => stakeAPI.createStake(amountQX),
    onSuccess: (data) => {
      toast({
        title: "Success",
        description: `Staked ${data.amountQX} QX successfully`,
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to create stake",
        variant: "destructive",
      });
    },
  });
};

// ============================================
// GET USER LEASES
// ============================================
export const useGetUserLeases = (userId: string, page: number = 1, limit: number = 10) => {
  return useQuery({
    queryKey: ["userLeases", userId, page, limit],
    queryFn: () => leaseAPI.getUserLeases(userId, page, limit),
    retry: 1,
    staleTime: 30000,
    enabled: !!userId,
  });
};

// ============================================
// CREATE LEASE
// ============================================
export const useCreateLease = () => {
  const { toast } = useToast();
  return useMutation({
    mutationFn: (data: { computeAmount: number; costCC: number; duration: number }) =>
      leaseAPI.createLease(data.computeAmount, data.costCC, data.duration),
    onSuccess: (data) => {
      toast({
        title: "Success",
        description: `Lease created successfully for ${data.computeAmount} compute units`,
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to create lease",
        variant: "destructive",
      });
    },
  });
};

// ============================================
// GET VAULT STATS
// ============================================
export const useGetVaultStats = () => {
  return useQuery({
    queryKey: ["vaultStats"],
    queryFn: () => vaultAPI.getVaultStats(),
    retry: 1,
    staleTime: 60000,
  });
};
