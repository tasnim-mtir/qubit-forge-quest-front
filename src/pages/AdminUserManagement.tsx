import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { useQueryClient } from "@tanstack/react-query";
import { AdminSidebar } from "@/components/admin/AdminSidebar";
import { UserManagementHeader } from "@/components/admin/UserManagementHeader";
import { UserTable } from "@/components/admin/UserTable";
import { UserFilters } from "@/components/admin/UserFilters";
import { AddUserDialog } from "@/components/admin/AddUserDialog";
import { StatsCards } from "@/components/admin/StatsCards";
import { useGetUsers, useGetUserStats } from "@/hooks/useAdminUsers";
import type { User } from "@/services/adminAPI";

export default function AdminUserManagement() {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  // Redirect if not admin
  useEffect(() => {
    if (!authLoading && (!user || user.role !== "admin")) {
      navigate("/admin/login");
    }
  }, [user, authLoading, navigate]);

  const [searchQuery, setSearchQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState<string>("all");
  const [dateFilter, setDateFilter] = useState<string>("all");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Fetch users from MongoDB with filters - all filtering is server-side
  const { data: dbUsers = [], isLoading, error } = useGetUsers({
    search: searchQuery,
    role: roleFilter,
    dateFilter: dateFilter,
    page: currentPage,
    limit: itemsPerPage,
  });

  // Fetch user statistics from MongoDB
  const { data: stats, isLoading: statsLoading } = useGetUserStats();

  // Normalize users data from MongoDB
  const users: User[] = dbUsers.map((u: any) => ({
    id: u._id || u.id,
    _id: u._id,
    email: u.email || "",
    role: u.role || "user",
    createdAt: u.createdAt,
  }));

  if (authLoading || isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-slate-950 flex items-center justify-center">
        <div className="text-blue-400">
          <svg className="w-8 h-8 animate-spin" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
        </div>
      </div>
    );
  }

  if (!user || user.role !== "admin") {
    return null;
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-slate-950 flex items-center justify-center">
        <div className="text-red-400 text-center">
          <p className="text-xl font-bold mb-2">Error loading users</p>
          <p className="text-sm">{error instanceof Error ? error.message : "Unknown error"}</p>
        </div>
      </div>
    );
  }

  // Filter users based on search and filters
  let filteredUsers = users;

  // Pagination
  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);
  const paginatedUsers = filteredUsers.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleAddUser = (newUser: Omit<User, "id" | "_id">) => {
    // Call mutation to add user to MongoDB
    // This will be handled in the AddUserDialog component
    // Refetch users after creation
    queryClient.invalidateQueries({ queryKey: ["users"] });
  };

  const handleUpdateUser = (updatedUser: User) => {
    // Refetch users after update
    queryClient.invalidateQueries({ queryKey: ["users"] });
  };

  const handleDeleteUser = (userId: string) => {
    // Refetch users after delete
    queryClient.invalidateQueries({ queryKey: ["users"] });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-slate-950">
      {/* Grid background effect */}
      <div className="fixed inset-0 opacity-5 pointer-events-none">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage:
              "linear-gradient(0deg, transparent 24%, rgba(59, 130, 246, 0.5) 25%, rgba(59, 130, 246, 0.5) 26%, transparent 27%, transparent 74%, rgba(59, 130, 246, 0.5) 75%, rgba(59, 130, 246, 0.5) 76%, transparent 77%, transparent), linear-gradient(90deg, transparent 24%, rgba(59, 130, 246, 0.5) 25%, rgba(59, 130, 246, 0.5) 26%, transparent 27%, transparent 74%, rgba(59, 130, 246, 0.5) 75%, rgba(59, 130, 246, 0.5) 76%, transparent 77%, transparent)",
            backgroundSize: "50px 50px",
          } as React.CSSProperties}
        />
      </div>

      <div className="relative z-10 flex">
        {/* Sidebar */}
        <AdminSidebar />

        {/* Main Content */}
        <div className="flex-1 overflow-auto">
          <div className="container mx-auto max-w-7xl py-8 px-4 md:px-8">
            {/* Header */}
            <UserManagementHeader />

            {/* Stats Cards */}
            <StatsCards stats={stats || null} isLoading={statsLoading} />

            {/* Search and Add Button */}
            <div className="flex flex-col md:flex-row gap-4 mb-8 mt-8">
              <div className="flex-1 relative">
                <input
                  type="text"
                  placeholder="Search users by ID, email, or name…"
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="w-full px-4 py-3 bg-slate-900/50 border border-blue-500/30 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/50 transition-all"
                />
                <svg
                  className="absolute right-3 top-3.5 w-5 h-5 text-slate-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
              </div>
              <AddUserDialog onAddUser={handleAddUser} />
            </div>

            {/* Filters */}
            <UserFilters
              roleFilter={roleFilter}
              setRoleFilter={setRoleFilter}
              dateFilter={dateFilter}
              setDateFilter={setDateFilter}
              searchEmail={searchQuery}
              setSearchEmail={setSearchQuery}
            />

            {/* User Table */}
            <UserTable
              users={paginatedUsers}
              onUpdateUser={handleUpdateUser}
              onDeleteUser={handleDeleteUser}
            />

            {/* Pagination */}
            <div className="flex items-center justify-between mt-8 px-4 py-4 bg-slate-900/30 border border-blue-500/20 rounded-lg backdrop-blur-sm">
              <div className="text-sm text-slate-400">
                Showing {paginatedUsers.length > 0 ? (currentPage - 1) * itemsPerPage + 1 : 0} to{" "}
                {Math.min(currentPage * itemsPerPage, filteredUsers.length)} of{" "}
                {filteredUsers.length} users
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                  disabled={currentPage === 1}
                  className="px-3 py-2 bg-blue-600/20 border border-blue-500/30 text-blue-400 rounded hover:bg-blue-600/40 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                >
                  ← Previous
                </button>
                <div className="flex items-center gap-1">
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                    <button
                      key={page}
                      onClick={() => setCurrentPage(page)}
                      className={`px-3 py-2 rounded transition-all ${
                        currentPage === page
                          ? "bg-blue-600 text-white"
                          : "bg-slate-800/50 text-slate-400 hover:bg-slate-700/50"
                      }`}
                    >
                      {page}
                    </button>
                  ))}
                </div>
                <button
                  onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                  disabled={currentPage === totalPages}
                  className="px-3 py-2 bg-blue-600/20 border border-blue-500/30 text-blue-400 rounded hover:bg-blue-600/40 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                >
                  Next →
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
