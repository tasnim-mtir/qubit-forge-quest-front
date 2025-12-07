import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useUpdateUser } from "@/hooks/useAdminUsers";
import { Loader2 } from "lucide-react";
import type { User } from "@/services/adminAPI";

interface EditUserDialogProps {
  user: User;
  onClose: () => void;
  onSave: (user: User) => void;
}

export function EditUserDialog({ user, onClose, onSave }: EditUserDialogProps) {
  const [formData, setFormData] = useState<User>(user);
  const queryClient = useQueryClient();
  const updateUserMutation = useUpdateUser();

  const handleSave = async () => {
    try {
      const userId = user._id || user.id;
      await updateUserMutation.mutateAsync({ userId, data: formData });
      queryClient.invalidateQueries({ queryKey: ["users"] });
      onSave(formData);
    } catch (error) {
      console.error("Error updating user:", error);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-slate-900 border border-blue-500/30 rounded-lg w-full max-w-md mx-4 p-6">
        <h2 className="text-2xl font-display font-bold text-blue-300 mb-4">Edit User</h2>

        <div className="space-y-4">
          <div>
            <label className="block text-sm text-slate-400 mb-2">User ID</label>
            <input
              type="text"
              value={formData.id}
              disabled
              className="w-full px-4 py-2 bg-slate-800/50 border border-slate-600/30 rounded text-slate-400 cursor-not-allowed"
            />
          </div>

          <div>
            <label className="block text-sm text-slate-400 mb-2">Email</label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="w-full px-4 py-2 bg-slate-800/50 border border-blue-500/30 rounded text-slate-200 focus:outline-none focus:border-blue-500"
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
        </div>

        <div className="flex gap-3 mt-6">
          <button
            onClick={onClose}
            disabled={updateUserMutation.isPending}
            className="flex-1 px-4 py-2 bg-slate-800 border border-slate-600 text-slate-300 rounded hover:bg-slate-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={updateUserMutation.isPending}
            className="flex-1 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-all font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {updateUserMutation.isPending ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Saving...
              </>
            ) : (
              "Save Changes"
            )}
            </button>
        </div>
      </div>
    </div>
  );
}
