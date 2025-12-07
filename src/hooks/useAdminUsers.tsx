import { useMutation, useQuery } from "@tanstack/react-query";
import { usersAPI, User, statsAPI, UserStats } from "@/services/adminAPI";
import { stakeAPI, computeTaskAPI, vaultAPI } from "@/services/protocolAPI";
import { useToast } from "@/hooks/use-toast";

// ============================================
// FETCH ALL USERS
// ============================================
export const useGetUsers = (filters?: {
  search?: string;
  role?: string;
  dateFilter?: string;
  page?: number;
  limit?: number;
}) => {
  return useQuery({
    queryKey: ["users", filters],
    queryFn: () => usersAPI.getAllUsers(filters),
    retry: 1,
    staleTime: 30000, // 30 seconds
    enabled: true,
  });
};

// ============================================
// CREATE USER
// ============================================
export const useCreateUser = () => {
  const { toast } = useToast();
  return useMutation({
    mutationFn: (userData: Omit<User, "_id" | "id">) =>
      usersAPI.createUser(userData),
    onSuccess: () => {
      toast({
        title: "Success",
        description: "User created successfully",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to create user",
        variant: "destructive",
      });
    },
  });
};

// ============================================
// UPDATE USER
// ============================================
export const useUpdateUser = () => {
  const { toast } = useToast();
  return useMutation({
    mutationFn: ({ userId, data }: { userId: string; data: Partial<User> }) =>
      usersAPI.updateUser(userId, data),
    onSuccess: () => {
      toast({
        title: "Success",
        description: "User updated successfully",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to update user",
        variant: "destructive",
      });
    },
  });
};

// ============================================
// DELETE USER
// ============================================
export const useDeleteUser = () => {
  const { toast } = useToast();
  return useMutation({
    mutationFn: (userId: string) => usersAPI.deleteUser(userId),
    onSuccess: () => {
      toast({
        title: "Success",
        description: "User deleted successfully",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to delete user",
        variant: "destructive",
      });
    },
  });
};

// ============================================
// PROMOTE TO CREATOR
// ============================================
export const usePromoteToCreator = () => {
  const { toast } = useToast();
  return useMutation({
    mutationFn: (userId: string) => usersAPI.promoteToCreator(userId),
    onSuccess: () => {
      toast({
        title: "Success",
        description: "User promoted to Creator",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to promote user",
        variant: "destructive",
      });
    },
  });
};

// ============================================
// PROMOTE TO INVESTOR
// ============================================
export const usePromoteToInvestor = () => {
  const { toast } = useToast();
  return useMutation({
    mutationFn: (userId: string) => usersAPI.promoteToInvestor(userId),
    onSuccess: () => {
      toast({
        title: "Success",
        description: "User promoted to Investor",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to promote user",
        variant: "destructive",
      });
    },
  });
};

// ============================================
// PROMOTE TO ADMIN
// ============================================
export const usePromoteToAdmin = () => {
  const { toast } = useToast();
  return useMutation({
    mutationFn: (userId: string) => usersAPI.promoteToAdmin(userId),
    onSuccess: () => {
      toast({
        title: "Success",
        description: "User promoted to Admin",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to promote user",
        variant: "destructive",
      });
    },
  });
};

// ============================================
// REVOKE CREATOR ACCESS
// ============================================
export const useRevokeCreatorAccess = () => {
  const { toast } = useToast();
  return useMutation({
    mutationFn: (userId: string) => usersAPI.revokeCreatorAccess(userId),
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Creator access revoked",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to revoke access",
        variant: "destructive",
      });
    },
  });
};

// ============================================
// REVOKE INVESTOR ACCESS
// ============================================
export const useRevokeInvestorAccess = () => {
  const { toast } = useToast();
  return useMutation({
    mutationFn: (userId: string) => usersAPI.revokeInvestorAccess(userId),
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Investor access revoked",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to revoke access",
        variant: "destructive",
      });
    },
  });
};

// ============================================
// BAN USER
// ============================================
export const useBanUser = () => {
  const { toast } = useToast();
  return useMutation({
    mutationFn: (userId: string) => usersAPI.banUser(userId),
    onSuccess: () => {
      toast({
        title: "Success",
        description: "User banned successfully",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to ban user",
        variant: "destructive",
      });
    },
  });
};

// ============================================
// UNBAN USER
// ============================================
export const useUnbanUser = () => {
  const { toast } = useToast();
  return useMutation({
    mutationFn: (userId: string) => usersAPI.unbanUser(userId),
    onSuccess: () => {
      toast({
        title: "Success",
        description: "User unbanned successfully",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to unban user",
        variant: "destructive",
      });
    },
  });
};

// ============================================
// FETCH USER STATS
// ============================================
export const useGetUserStats = () => {
  return useQuery({
    queryKey: ["userStats"],
    queryFn: () => statsAPI.getUserStats(),
    retry: 1,
    staleTime: 60000, // 60 seconds
  });
};

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
