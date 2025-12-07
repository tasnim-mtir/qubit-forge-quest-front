const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

export interface User {
  _id?: string;
  id?: string;
  email: string;
  role: "user" | "creator" | "investor" | "admin";
  status?: string;
  name?: string;
  createdAt?: string;
  updatedAt?: string;
}

// Get auth token from localStorage
const getAuthToken = () => {
  const token = localStorage.getItem("token");
  return token || "";
};

// ============================================
// USERS API
// ============================================

export const usersAPI = {
  // Get all users with optional filters
  async getAllUsers(filters?: {
    search?: string;
    role?: string;
    dateFilter?: string;
    page?: number;
    limit?: number;
  }): Promise<User[]> {
    try {
      const params = new URLSearchParams();
      if (filters?.search) params.append("search", filters.search);
      if (filters?.role && filters.role !== "all") params.append("role", filters.role);
      if (filters?.dateFilter && filters.dateFilter !== "all") params.append("dateFilter", filters.dateFilter);
      if (filters?.page) params.append("page", filters.page.toString());
      if (filters?.limit) params.append("limit", filters.limit.toString());

      const queryString = params.toString();
      const url = queryString ? `${API_URL}/api/auth/admin/users?${queryString}` : `${API_URL}/api/auth/admin/users`;

      const response = await fetch(url, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${getAuthToken()}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch users");
      }

      const data = await response.json();
      return data.users || [];
    } catch (error) {
      console.error("Error fetching users:", error);
      throw error;
    }
  },

  // Get user by ID
  async getUserById(userId: string): Promise<User> {
    try {
      const response = await fetch(`${API_URL}/api/auth/admin/users/${userId}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${getAuthToken()}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch user");
      }

      return await response.json();
    } catch (error) {
      console.error("Error fetching user:", error);
      throw error;
    }
  },

  // Create new user
  async createUser(userData: Omit<User, "_id" | "id">): Promise<User> {
    try {
      const response = await fetch(`${API_URL}/api/auth/admin/users`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${getAuthToken()}`,
        },
        body: JSON.stringify(userData),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Failed to create user");
      }

      return await response.json();
    } catch (error) {
      console.error("Error creating user:", error);
      throw error;
    }
  },

  // Update user
  async updateUser(userId: string, userData: Partial<User>): Promise<User> {
    try {
      const response = await fetch(`${API_URL}/api/auth/admin/users/${userId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${getAuthToken()}`,
        },
        body: JSON.stringify(userData),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Failed to update user");
      }

      return await response.json();
    } catch (error) {
      console.error("Error updating user:", error);
      throw error;
    }
  },

  // Delete user
  async deleteUser(userId: string): Promise<{ success: boolean }> {
    try {
      const response = await fetch(`${API_URL}/api/auth/admin/users/${userId}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${getAuthToken()}`,
        },
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Failed to delete user");
      }

      return await response.json();
    } catch (error) {
      console.error("Error deleting user:", error);
      throw error;
    }
  },

  // Promote user to creator
  async promoteToCreator(userId: string): Promise<User> {
    return this.updateUser(userId, { role: "creator" });
  },

  // Promote user to investor
  async promoteToInvestor(userId: string): Promise<User> {
    return this.updateUser(userId, { role: "investor" });
  },

  // Promote user to admin
  async promoteToAdmin(userId: string): Promise<User> {
    return this.updateUser(userId, { role: "admin" });
  },

  // Revoke creator access
  async revokeCreatorAccess(userId: string): Promise<User> {
    return this.updateUser(userId, { role: "user" });
  },

  // Revoke investor access
  async revokeInvestorAccess(userId: string): Promise<User> {
    return this.updateUser(userId, { role: "user" });
  },

  // Ban user
  async banUser(userId: string): Promise<User> {
    return this.updateUser(userId, { status: "banned" });
  },

  // Unban user
  async unbanUser(userId: string): Promise<User> {
    return this.updateUser(userId, { status: "active" });
  },
};

// ============================================
// STATS API
// ============================================
export interface UserStats {
  totalUsers: number;
  creators: number;
  investors: number;
}

export const statsAPI = {
  // Get user statistics by fetching from users endpoint
  async getUserStats(): Promise<UserStats> {
    try {
      // Fetch all users
      const allUsersResponse = await fetch(`${API_URL}/api/auth/admin/users`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${getAuthToken()}`,
        },
      });

      if (!allUsersResponse.ok) {
        throw new Error("Failed to fetch users");
      }

      const allUsersData = await allUsersResponse.json();
      const allUsers = allUsersData.users || [];

      // Fetch creators only
      const creatorsResponse = await fetch(`${API_URL}/api/auth/admin/users?role=creator`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${getAuthToken()}`,
        },
      });

      if (!creatorsResponse.ok) {
        throw new Error("Failed to fetch creators");
      }

      const creatorsData = await creatorsResponse.json();
      const creators = creatorsData.users || [];

      // Fetch investors only
      const investorsResponse = await fetch(`${API_URL}/api/auth/admin/users?role=investor`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${getAuthToken()}`,
        },
      });

      if (!investorsResponse.ok) {
        throw new Error("Failed to fetch investors");
      }

      const investorsData = await investorsResponse.json();
      const investors = investorsData.users || [];

      return {
        totalUsers: allUsers.length,
        creators: creators.length,
        investors: investors.length,
      };
    } catch (error) {
      console.error("Error fetching stats:", error);
      throw error;
    }
  },
};
