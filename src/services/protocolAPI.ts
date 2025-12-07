const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

const getAuthToken = () => {
  const token = localStorage.getItem("token");
  return token || "";
};

// ============================================
// TYPES
// ============================================

export interface ComputeTask {
  _id: string;
  creatorId: string;
  taskName: string;
  computeCostCC: number;
  status: "queued" | "running" | "completed" | "failed";
  result: any | null;
  timestamp: string;
  createdAt: string;
}

export interface UserCCStatus {
  totalCC: number;
  usedCC: number;
  availableCC: number;
}

export interface CreateTaskResponse {
  success: boolean;
  message: string;
  task: ComputeTask;
  userCCStatus: UserCCStatus;
}

export interface TasksResponse {
  success: boolean;
  tasks: ComputeTask[];
  statusCount: {
    queued: number;
    running: number;
    completed: number;
    failed: number;
  };
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

export interface Stake {
  _id: string;
  userId: {
    email: string;
    role: string;
  };
  amountQX: number;
  computeCreditsReceived: number;
  lockPeriod: number;
  status: "active" | "released" | "claimed";
  timestamp: string;
  createdAt: string;
}

export interface StakeResponse {
  success: boolean;
  stakes: Stake[];
  summary: {
    totalStaked: number;
    totalCC: number;
    activeStakes: number;
  };
}

export interface VaultStats {
  success: boolean;
  vault: {
    totalLockedQX: number;
    totalComputeCredits: number;
    totalTasksExecuted: number;
    rewardPool: number;
  };
  stats: {
    totalStakers: number;
    activeStakes: number;
    totalTasksQueued: number;
    totalTasksCompleted: number;
    totalTasksFailed?: number;
    ccPerQX: number;
    successRate?: number;
    totalCCSpent?: number;
    ccUtilization?: number;
    poolHealth?: string;
  };
}

export interface MarketplacePackage {
  id: string;
  computeAmount: number;
  costCC: number;
  costPerDay: string;
  duration: number;
  provider: string;
  reputation: string;
  available: number;
  description: string;
}

export interface MarketplaceFilters {
  minComputeAvailable: number;
  maxComputeAvailable: number;
  minDurationAvailable: number;
  maxDurationAvailable: number;
  applied: {
    minCompute: number | null;
    maxCompute: number | null;
    minCost: number | null;
    maxCost: number | null;
    minDuration: number | null;
    maxDuration: number | null;
  };
}

export interface MarketplaceResponse {
  success: boolean;
  packages: MarketplacePackage[];
  filters: MarketplaceFilters;
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

export interface Lease {
  _id: string;
  investorId: string;
  computeAmount: number;
  costCC: number;
  duration: number;
  status: "active" | "expired" | "cancelled";
  createdAt: string;
  updatedAt: string;
}

export interface LeaseResponse {
  success: boolean;
  leases: Lease[];
  summary: {
    totalComputeLeased: number;
    totalCostCC: number;
    activeLeases: number;
  };
}

// ============================================
// ROLE REQUEST TYPES
// ============================================

export interface RoleRequest {
  _id: string;
  userId: {
    _id: string;
    email: string;
    name?: string;
    role: string;
  };
  requestedRole: "creator" | "investor";
  message?: string;
  status: "pending" | "approved" | "rejected";
  reviewedBy?: string;
  reviewedAt?: string;
  rejectionReason?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateRoleRequestResponse {
  success: boolean;
  message: string;
  request: RoleRequest;
}

export interface RoleRequestsResponse {
  success: boolean;
  requests: RoleRequest[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

export interface RoleRequestCountResponse {
  success: boolean;
  pendingRequests: number;
}

// ============================================
// PROCESSOR API TYPES
// ============================================

export interface ProcessorStatus {
  success: boolean;
  processor: {
    isRunning: boolean;
    isHealthy: boolean;
    uptime: number;
    interval: number;
  };
  queue: {
    queuedCount: number;
    runningCount: number;
    completedCount: number;
    failedCount: number;
  };
  stats: {
    totalProcessed: number;
    totalFailed: number;
    successRate: number;
    avgProcessingTime: number;
  };
  nextTaskETA?: number;
}

export interface QueuedTask {
  _id: string;
  taskName: string;
  creatorId: string;
  computeCostCC: number;
  createdAt: string;
  queuePosition: number;
  estimatedWaitTime: number;
}

export interface DetailedQueueResponse {
  success: boolean;
  queueLength: number;
  tasks: QueuedTask[];
  totalQueued: number;
  avgWaitTime: number;
}

export interface ExecutionEvent {
  timestamp: string;
  eventType: "STARTED" | "PROCESSING" | "RECOVERED" | "COMPLETED" | "FAILED" | "QUEUED";
  message: string;
  attemptNumber?: number;
  duration?: number;
  error?: string;
}

export interface ExecutionHistoryResponse {
  success: boolean;
  taskId: string;
  taskName: string;
  events: ExecutionEvent[];
  executionAttempts: number;
  totalDuration?: number;
  failureReason?: string;
  completionData?: any;
  status: "queued" | "running" | "completed" | "failed";
}

// ============================================
// COMPUTE TASKS API
// ============================================

export const computeTaskAPI = {
  async createTask(
    taskName: string,
    computeCostCC: number,
    taskDescription?: string,
    priority?: "Low" | "Medium" | "High",
    taskType?: "DataAnalysis" | "Training" | "Processing" | "General" | "Other",
    estimatedDuration?: number
  ): Promise<CreateTaskResponse> {
    try {
      const response = await fetch(`${API_URL}/api/protocol/compute-task/create`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${getAuthToken()}`,
        },
        body: JSON.stringify({
          taskName,
          computeCostCC,
          taskDescription: taskDescription || "",
          priority: priority || "Medium",
          taskType: taskType || "General",
          estimatedDuration: estimatedDuration || 3600,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Failed to create task");
      }

      return await response.json();
    } catch (error) {
      console.error("Error creating task:", error);
      throw error;
    }
  },

  async getMyTasks(page: number = 1, limit: number = 10): Promise<TasksResponse> {
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
      });

      const response = await fetch(`${API_URL}/api/protocol/compute-task/my-tasks?${params}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${getAuthToken()}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch tasks");
      }

      return await response.json();
    } catch (error) {
      console.error("Error fetching tasks:", error);
      throw error;
    }
  },

  async getAvailableTasks(page: number = 1, limit: number = 10): Promise<MarketplaceResponse> {
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
      });

      const response = await fetch(`${API_URL}/api/protocol/marketplace/compute?${params}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${getAuthToken()}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch available tasks");
      }

      return await response.json();
    } catch (error) {
      console.error("Error fetching available tasks:", error);
      throw error;
    }
  },

  async getAllTasks(
    page: number = 1,
    limit: number = 20,
    status?: string
  ): Promise<TasksResponse> {
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
      });

      if (status) {
        params.append("status", status);
      }

      const response = await fetch(`${API_URL}/api/protocol/compute-task/all?${params}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${getAuthToken()}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch tasks");
      }

      return await response.json();
    } catch (error) {
      console.error("Error fetching tasks:", error);
      throw error;
    }
  },

  async simulateCompleteTask(taskId: string): Promise<ComputeTask> {
    try {
      const response = await fetch(`${API_URL}/api/protocol/compute-task/simulate-complete`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${getAuthToken()}`,
        },
        body: JSON.stringify({ taskId }),
      });

      if (!response.ok) {
        throw new Error("Failed to complete task");
      }

      return await response.json();
    } catch (error) {
      console.error("Error completing task:", error);
      throw error;
    }
  },
};

// ============================================
// STAKES API
// ============================================

export const stakeAPI = {
  async createStake(amountQX: number): Promise<Stake> {
    try {
      const response = await fetch(`${API_URL}/api/protocol/stake`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${getAuthToken()}`,
        },
        body: JSON.stringify({ amountQX }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Failed to create stake");
      }

      return await response.json();
    } catch (error) {
      console.error("Error creating stake:", error);
      throw error;
    }
  },

  async getUserStakes(userId: string): Promise<StakeResponse> {
    try {
      const response = await fetch(`${API_URL}/api/protocol/stake/user/${userId}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${getAuthToken()}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch stakes");
      }

      return await response.json();
    } catch (error) {
      console.error("Error fetching stakes:", error);
      throw error;
    }
  },

  async getAllStakes(page: number = 1, limit: number = 20): Promise<StakeResponse> {
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
      });

      const response = await fetch(`${API_URL}/api/protocol/stake/all?${params}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${getAuthToken()}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch stakes");
      }

      return await response.json();
    } catch (error) {
      console.error("Error fetching stakes:", error);
      throw error;
    }
  },
};

// ============================================
// VAULT API
// ============================================

export const vaultAPI = {
  async getVaultStats(): Promise<VaultStats> {
    try {
      const response = await fetch(`${API_URL}/api/protocol/vault/stats`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${getAuthToken()}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch vault stats");
      }

      return await response.json();
    } catch (error) {
      console.error("Error fetching vault stats:", error);
      throw error;
    }
  },
};

// ============================================
// LEASE API
// ============================================

export const leaseAPI = {
  async createLease(
    computeAmount: number,
    costCC: number,
    duration: number
  ): Promise<Lease> {
    try {
      const response = await fetch(`${API_URL}/api/protocol/lease`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${getAuthToken()}`,
        },
        body: JSON.stringify({
          computeAmount,
          costCC,
          duration,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Failed to create lease");
      }

      return await response.json();
    } catch (error) {
      console.error("Error creating lease:", error);
      throw error;
    }
  },

  async getUserLeases(userId: string, page: number = 1, limit: number = 10): Promise<LeaseResponse> {
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
      });

      const response = await fetch(`${API_URL}/api/protocol/lease/user/${userId}?${params}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${getAuthToken()}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch leases");
      }

      return await response.json();
    } catch (error) {
      console.error("Error fetching leases:", error);
      throw error;
    }
  },

  async getAllLeases(page: number = 1, limit: number = 20): Promise<LeaseResponse> {
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
      });

      const response = await fetch(`${API_URL}/api/protocol/lease/all?${params}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${getAuthToken()}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch leases");
      }

      return await response.json();
    } catch (error) {
      console.error("Error fetching leases:", error);
      throw error;
    }
  },
};

// ============================================
// PROCESSOR API
// ============================================

export const processorAPI = {
  // Get processor health and queue status
  async getProcessorStatus(): Promise<ProcessorStatus> {
    try {
      const response = await fetch(`${API_URL}/api/protocol/processor/status`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${getAuthToken()}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch processor status");
      }

      return await response.json();
    } catch (error) {
      console.error("Error fetching processor status:", error);
      throw error;
    }
  },

  // Get detailed queue with all queued tasks
  async getDetailedQueue(): Promise<DetailedQueueResponse> {
    try {
      const response = await fetch(`${API_URL}/api/protocol/processor/detailed-queue`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${getAuthToken()}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch queue details");
      }

      return await response.json();
    } catch (error) {
      console.error("Error fetching queue details:", error);
      throw error;
    }
  },

  // Get execution history for a specific task
  async getExecutionHistory(taskId: string): Promise<ExecutionHistoryResponse> {
    try {
      const response = await fetch(
        `${API_URL}/api/protocol/processor/execution-history/${taskId}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${getAuthToken()}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to fetch execution history");
      }

      return await response.json();
    } catch (error) {
      console.error("Error fetching execution history:", error);
      throw error;
    }
  },
};

// ============================================
// ROLE REQUEST API
// ============================================

export const roleRequestAPI = {
  async createRequest(
    requestedRole: "creator" | "investor",
    message?: string
  ): Promise<CreateRoleRequestResponse> {
    try {
      const response = await fetch(`${API_URL}/api/role-request/create`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${getAuthToken()}`,
        },
        body: JSON.stringify({
          requestedRole,
          message,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Failed to create role request");
      }

      return await response.json();
    } catch (error) {
      console.error("Error creating role request:", error);
      throw error;
    }
  },

  async getMyRequest(): Promise<RoleRequest | null> {
    try {
      const response = await fetch(`${API_URL}/api/role-request/my-request`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${getAuthToken()}`,
        },
      });

      if (!response.ok) {
        if (response.status === 404) return null;
        throw new Error("Failed to fetch request");
      }

      const data = await response.json();
      return data.request || null;
    } catch (error) {
      console.error("Error fetching role request:", error);
      throw error;
    }
  },

  async getPendingRequests(
    page: number = 1,
    limit: number = 10
  ): Promise<RoleRequestsResponse> {
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
      });

      const response = await fetch(
        `${API_URL}/api/role-request/pending?${params}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${getAuthToken()}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to fetch pending requests");
      }

      return await response.json();
    } catch (error) {
      console.error("Error fetching pending requests:", error);
      throw error;
    }
  },

  async getPendingCount(): Promise<RoleRequestCountResponse> {
    try {
      const response = await fetch(`${API_URL}/api/role-request/count`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${getAuthToken()}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch count");
      }

      return await response.json();
    } catch (error) {
      console.error("Error fetching pending count:", error);
      return { success: false, pendingRequests: 0 };
    }
  },

  async approveRequest(requestId: string): Promise<CreateRoleRequestResponse> {
    try {
      const response = await fetch(
        `${API_URL}/api/role-request/${requestId}/approve`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${getAuthToken()}`,
          },
        }
      );

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Failed to approve request");
      }

      return await response.json();
    } catch (error) {
      console.error("Error approving request:", error);
      throw error;
    }
  },

  async rejectRequest(
    requestId: string,
    rejectionReason?: string
  ): Promise<CreateRoleRequestResponse> {
    try {
      const response = await fetch(
        `${API_URL}/api/role-request/${requestId}/reject`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${getAuthToken()}`,
          },
          body: JSON.stringify({
            rejectionReason,
          }),
        }
      );

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Failed to reject request");
      }

      return await response.json();
    } catch (error) {
      console.error("Error rejecting request:", error);
      throw error;
    }
  },
};
