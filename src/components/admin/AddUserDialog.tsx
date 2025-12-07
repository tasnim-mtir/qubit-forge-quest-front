import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useCreateUser } from "@/hooks/useAdminUsers";
import { Loader2 } from "lucide-react";
import type { User } from "@/services/adminAPI";

interface AddUserDialogProps {
  onAddUser: (user: Omit<User, "id" | "_id">) => void;
}

export function AddUserDialog({ onAddUser }: AddUserDialogProps) {
  const [isOpen, setIsOpen] = useState(false);
  const queryClient = useQueryClient();
  const createUserMutation = useCreateUser();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    role: "user" as const,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.email && formData.password) {
      try {
        await createUserMutation.mutateAsync(formData);
        queryClient.invalidateQueries({ queryKey: ["users"] });
        onAddUser(formData);
        setFormData({
          email: "",
          password: "",
          role: "user",
        });
        setIsOpen(false);
      } catch (error) {
        console.error("Error creating user:", error);
      }
    }
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all font-medium flex items-center gap-2 shadow-lg shadow-blue-500/30"
      >
        <span>➕</span> Add New User
      </button>

      {isOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-slate-900 border border-blue-500/30 rounded-lg w-full max-w-md mx-4 p-6">
            <h2 className="text-2xl font-display font-bold text-blue-300 mb-4">Add New User</h2>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm text-slate-400 mb-2">Email Address</label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-4 py-2 bg-slate-800/50 border border-blue-500/30 rounded text-slate-200 focus:outline-none focus:border-blue-500"
                  placeholder="user@example.com"
                />
              </div>

              <div>
                <label className="block text-sm text-slate-400 mb-2">Password</label>
                <input
                  type="password"
                  required
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className="w-full px-4 py-2 bg-slate-800/50 border border-blue-500/30 rounded text-slate-200 focus:outline-none focus:border-blue-500"
                  placeholder="••••••••"
                />
              </div>

              <div>
                <label className="block text-sm text-slate-400 mb-2">Role</label>
                <select
                  value={formData.role}
                  onChange={(e) => setFormData({ ...formData, role: e.target.value as any })}
                  className="w-full px-4 py-2 bg-slate-800/50 border border-blue-500/30 rounded text-slate-200 focus:outline-none focus:border-blue-500"
                >
                  <option value="user">User</option>
                  <option value="creator">Creator</option>
                  <option value="admin">Admin</option>
                </select>
              </div>

              <div className="flex gap-3 mt-6">
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  className="flex-1 px-4 py-2 bg-slate-800 border border-slate-600 text-slate-300 rounded hover:bg-slate-700 transition-all"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={createUserMutation.isPending}
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-all font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {createUserMutation.isPending ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Creating...
                    </>
                  ) : (
                    "Create User"
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
