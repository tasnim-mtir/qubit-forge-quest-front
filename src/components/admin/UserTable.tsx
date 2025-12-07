import { useState } from "react";
import type { User } from "@/services/adminAPI";
import { UserActionsMenu } from "./UserActionsMenu";
import { EditUserDialog } from "./EditUserDialog";

interface UserTableProps {
  users: User[];
  onUpdateUser: (user: User) => void;
  onDeleteUser: (userId: string) => void;
}

export function UserTable({ users, onUpdateUser, onDeleteUser }: UserTableProps) {
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [sortConfig, setSortConfig] = useState<{
    key: keyof User;
    direction: "asc" | "desc";
  } | null>(null);

  const getRoleBadge = (role: string) => {
    switch (role) {
      case "admin":
        return (
          <span className="inline-flex items-center gap-1 px-3 py-1 bg-red-500/20 border border-red-500/30 text-red-300 text-xs font-medium rounded-full">
            <span className="w-2 h-2 bg-red-500 rounded-full"></span>
            Admin
          </span>
        );
      case "creator":
        return (
          <span className="inline-flex items-center gap-1 px-3 py-1 bg-orange-500/20 border border-orange-500/30 text-orange-300 text-xs font-medium rounded-full">
            <span className="w-2 h-2 bg-orange-500 rounded-full"></span>
            Creator
          </span>
        );
      case "investor":
        return (
          <span className="inline-flex items-center gap-1 px-3 py-1 bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 text-xs font-medium rounded-full">
            <span className="w-2 h-2 bg-emerald-500 rounded-full"></span>
            Investor
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 px-3 py-1 bg-blue-500/20 border border-blue-500/30 text-blue-300 text-xs font-medium rounded-full">
            <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
            User
          </span>
        );
    }
  };

  const getStatusBadge = (status: string) => {
    if (status === "active") {
      return (
        <span className="inline-flex items-center gap-1 px-3 py-1 bg-green-500/20 border border-green-500/30 text-green-300 text-xs font-medium rounded-full">
          <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
          Active
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1 px-3 py-1 bg-red-500/20 border border-red-500/30 text-red-300 text-xs font-medium rounded-full">
        <span className="w-2 h-2 bg-red-500 rounded-full"></span>
        Banned
      </span>
    );
  };

  const handleSort = (key: keyof User) => {
    setSortConfig(
      sortConfig?.key === key && sortConfig?.direction === "asc"
        ? { key, direction: "desc" }
        : { key, direction: "asc" }
    );
  };

  const sortedUsers = [...users].sort((a, b) => {
    if (!sortConfig) return 0;

    const aValue = a[sortConfig.key];
    const bValue = b[sortConfig.key];

    if (typeof aValue === "string" && typeof bValue === "string") {
      return sortConfig.direction === "asc"
        ? aValue.localeCompare(bValue)
        : bValue.localeCompare(aValue);
    }

    return 0;
  });

  const SortIcon = ({ column }: { column: keyof User }) => {
    if (sortConfig?.key !== column) {
      return <span className="text-slate-500">⇅</span>;
    }
    return <span className="text-blue-400">{sortConfig.direction === "asc" ? "↑" : "↓"}</span>;
  };

  return (
    <>
      <div className="bg-gradient-to-b from-slate-900/50 to-slate-950/50 border border-blue-500/20 rounded-lg overflow-hidden backdrop-blur-sm">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-900/80 border-b border-blue-500/20">
              <tr>
                <th className="px-6 py-4 text-left">
                  <button
                    onClick={() => handleSort("id")}
                    className="flex items-center gap-2 text-slate-300 hover:text-blue-300 transition-colors font-semibold text-sm"
                  >
                    User ID <SortIcon column="id" />
                  </button>
                </th>
                <th className="px-6 py-4 text-left">
                  <button
                    onClick={() => handleSort("email")}
                    className="flex items-center gap-2 text-slate-300 hover:text-blue-300 transition-colors font-semibold text-sm"
                  >
                    Email <SortIcon column="email" />
                  </button>
                </th>
                <th className="px-6 py-4 text-left">
                  <button
                    onClick={() => handleSort("role")}
                    className="flex items-center gap-2 text-slate-300 hover:text-blue-300 transition-colors font-semibold text-sm"
                  >
                    Role <SortIcon column="role" />
                  </button>
                </th>
                <th className="px-6 py-4 text-right text-slate-300 font-semibold text-sm">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-blue-500/10">
              {sortedUsers.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-6 py-12 text-center">
                    <p className="text-slate-400">No users found</p>
                  </td>
                </tr>
              ) : (
                sortedUsers.map((user) => (
                  <tr
                    key={user.id}
                    className="hover:bg-slate-800/30 transition-colors group"
                  >
                    <td className="px-6 py-4">
                      <span className="text-blue-300 font-mono font-semibold">{user.id}</span>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-slate-200 font-medium">{user.email}</p>
                    </td>
                    <td className="px-6 py-4">{getRoleBadge(user.role)}</td>
                    <td className="px-6 py-4 text-right">
                      <UserActionsMenu
                        user={user}
                        onEdit={() => setEditingUser(user)}
                        onUpdateUser={onUpdateUser}
                        onDeleteUser={onDeleteUser}
                      />
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {editingUser && (
        <EditUserDialog
          user={editingUser}
          onClose={() => setEditingUser(null)}
          onSave={(updatedUser) => {
            onUpdateUser(updatedUser);
            setEditingUser(null);
          }}
        />
      )}
    </>
  );
}
