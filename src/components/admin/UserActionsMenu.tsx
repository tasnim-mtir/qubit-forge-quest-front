import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { ConfirmDialog } from "./ConfirmDialog";
import {
  usePromoteToCreator,
  usePromoteToInvestor,
  usePromoteToAdmin,
  useRevokeCreatorAccess,
  useRevokeInvestorAccess,
  useBanUser,
  useUnbanUser,
  useDeleteUser,
} from "@/hooks/useAdminUsers";
import { useToast } from "@/hooks/use-toast";
import type { User } from "@/services/adminAPI";

interface UserActionsMenuProps {
  user: User;
  onEdit: () => void;
  onUpdateUser: (user: User) => void;
  onDeleteUser: (userId: string) => void;
}

export function UserActionsMenu({
  user,
  onEdit,
  onUpdateUser,
  onDeleteUser,
}: UserActionsMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [confirmDialog, setConfirmDialog] = useState<{
    action: string;
    title: string;
    description: string;
  } | null>(null);
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const userId = user._id || user.id;

  // API mutations
  const promoteToCreatorMutation = usePromoteToCreator();
  const promoteToInvestorMutation = usePromoteToInvestor();
  const promoteToAdminMutation = usePromoteToAdmin();
  const revokeCreatorMutation = useRevokeCreatorAccess();
  const revokeInvestorMutation = useRevokeInvestorAccess();
  const banUserMutation = useBanUser();
  const unbanUserMutation = useUnbanUser();
  const deleteUserMutation = useDeleteUser();

  const handlePromoteToCreator = async () => {
    try {
      await promoteToCreatorMutation.mutateAsync(userId);
      queryClient.invalidateQueries({ queryKey: ["users"] });
      setIsOpen(false);
    } catch (error) {
      console.error("Error promoting to creator:", error);
    }
  };

  const handlePromoteToInvestor = async () => {
    try {
      await promoteToInvestorMutation.mutateAsync(userId);
      queryClient.invalidateQueries({ queryKey: ["users"] });
      setIsOpen(false);
    } catch (error) {
      console.error("Error promoting to investor:", error);
    }
  };

  const handlePromoteToAdmin = async () => {
    try {
      await promoteToAdminMutation.mutateAsync(userId);
      queryClient.invalidateQueries({ queryKey: ["users"] });
      setIsOpen(false);
    } catch (error) {
      console.error("Error promoting to admin:", error);
    }
  };

  const handleRevokeCreatorAccess = async () => {
    try {
      await revokeCreatorMutation.mutateAsync(userId);
      queryClient.invalidateQueries({ queryKey: ["users"] });
      setIsOpen(false);
    } catch (error) {
      console.error("Error revoking creator access:", error);
    }
  };

  const handleRevokeInvestorAccess = async () => {
    try {
      await revokeInvestorMutation.mutateAsync(userId);
      queryClient.invalidateQueries({ queryKey: ["users"] });
      setIsOpen(false);
    } catch (error) {
      console.error("Error revoking investor access:", error);
    }
  };

  const handleBanUser = async () => {
    try {
      await banUserMutation.mutateAsync(userId);
      queryClient.invalidateQueries({ queryKey: ["users"] });
      setIsOpen(false);
    } catch (error) {
      console.error("Error banning user:", error);
    }
  };

  const handleUnbanUser = async () => {
    try {
      await unbanUserMutation.mutateAsync(userId);
      queryClient.invalidateQueries({ queryKey: ["users"] });
      setIsOpen(false);
    } catch (error) {
      console.error("Error unbanning user:", error);
    }
  };

  const handleDelete = async () => {
    try {
      await deleteUserMutation.mutateAsync(userId);
      queryClient.invalidateQueries({ queryKey: ["users"] });
      onDeleteUser(userId);
      setIsOpen(false);
    } catch (error) {
      console.error("Error deleting user:", error);
    }
  };

  const canPromoteToCreator = user.role !== "creator" && user.role !== "admin" && user.role !== "investor";
  const canPromoteToInvestor = user.role !== "investor" && user.role !== "admin" && user.role !== "creator";
  const canPromoteToAdmin = user.role === "creator" || user.role === "user" || user.role === "investor";
  const canRevokeCreator = user.role === "creator";
  const canRevokeInvestor = user.role === "investor";

  return (
    <>
      <div className="relative">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="p-2 hover:bg-slate-700/50 rounded transition-all"
        >
          <svg
            className="w-5 h-5 text-slate-400 hover:text-blue-400"
            fill="currentColor"
            viewBox="0 0 24 24"
          >
            <path d="M12 8c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm0 2c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z" />
          </svg>
        </button>

        {isOpen && (
          <div className="absolute right-0 mt-2 w-48 bg-slate-900/95 border border-blue-500/30 rounded-lg shadow-xl backdrop-blur-sm z-50">
            <div className="p-2 space-y-1">
              {canPromoteToCreator && (
                <button
                  onClick={() => {
                    setConfirmDialog({
                      action: "promote-creator",
                      title: "Promote to Creator",
                      description: `Are you sure you want to promote ${user.name} to Creator?`,
                    });
                  }}
                  className="w-full text-left px-3 py-2 text-sm text-slate-300 hover:bg-orange-500/20 hover:text-orange-300 rounded transition-all flex items-center gap-2"
                >
                  <span>🎨</span> Promote to Creator
                </button>
              )}

              {canPromoteToInvestor && (
                <button
                  onClick={() => {
                    setConfirmDialog({
                      action: "promote-investor",
                      title: "Promote to Investor",
                      description: `Are you sure you want to promote ${user.name} to Investor?`,
                    });
                  }}
                  className="w-full text-left px-3 py-2 text-sm text-slate-300 hover:bg-green-500/20 hover:text-green-300 rounded transition-all flex items-center gap-2"
                >
                  <span>💼</span> Promote to Investor
                </button>
              )}

              {canPromoteToAdmin && (
                <button
                  onClick={() => {
                    setConfirmDialog({
                      action: "promote-admin",
                      title: "Promote to Admin",
                      description: `Are you sure you want to promote ${user.name} to Admin?`,
                    });
                  }}
                  className="w-full text-left px-3 py-2 text-sm text-slate-300 hover:bg-red-500/20 hover:text-red-300 rounded transition-all flex items-center gap-2"
                >
                  <span>👑</span> Promote to Admin
                </button>
              )}

              {canRevokeCreator && (
                <button
                  onClick={() => {
                    setConfirmDialog({
                      action: "revoke-creator",
                      title: "Revoke Creator Access",
                      description: `Are you sure you want to revoke ${user.name}'s Creator access?`,
                    });
                  }}
                  className="w-full text-left px-3 py-2 text-sm text-slate-300 hover:bg-yellow-500/20 hover:text-yellow-300 rounded transition-all flex items-center gap-2"
                >
                  <span>⛔</span> Revoke Creator Access
                </button>
              )}

              {canRevokeInvestor && (
                <button
                  onClick={() => {
                    setConfirmDialog({
                      action: "revoke-investor",
                      title: "Revoke Investor Access",
                      description: `Are you sure you want to revoke ${user.name}'s Investor access?`,
                    });
                  }}
                  className="w-full text-left px-3 py-2 text-sm text-slate-300 hover:bg-yellow-500/20 hover:text-yellow-300 rounded transition-all flex items-center gap-2"
                >
                  <span>⛔</span> Revoke Investor Access
                </button>
              )}

              <button
                onClick={() => {
                  onEdit();
                  setIsOpen(false);
                }}
                className="w-full text-left px-3 py-2 text-sm text-slate-300 hover:bg-blue-500/20 hover:text-blue-300 rounded transition-all flex items-center gap-2"
              >
                <span>✏️</span> Edit User
              </button>

              {user.status === "active" ? (
                <button
                  onClick={() => {
                    setConfirmDialog({
                      action: "ban",
                      title: "Ban User",
                      description: `Are you sure you want to ban ${user.name}? They will lose access.`,
                    });
                  }}
                  className="w-full text-left px-3 py-2 text-sm text-slate-300 hover:bg-red-500/20 hover:text-red-300 rounded transition-all flex items-center gap-2"
                >
                  <span>🚫</span> Ban User
                </button>
              ) : (
                <button
                  onClick={() => {
                    setConfirmDialog({
                      action: "unban",
                      title: "Unban User",
                      description: `Are you sure you want to unban ${user.name}?`,
                    });
                  }}
                  className="w-full text-left px-3 py-2 text-sm text-slate-300 hover:bg-green-500/20 hover:text-green-300 rounded transition-all flex items-center gap-2"
                >
                  <span>✓</span> Unban User
                </button>
              )}

              <div className="border-t border-slate-700 my-1"></div>

              <button
                onClick={() => {
                  setConfirmDialog({
                    action: "delete",
                    title: "Delete User",
                    description: `Are you sure you want to permanently delete ${user.name}? This action cannot be undone.`,
                  });
                }}
                className="w-full text-left px-3 py-2 text-sm text-slate-300 hover:bg-red-600/20 hover:text-red-400 rounded transition-all flex items-center gap-2"
              >
                <span>🗑️</span> Delete User
              </button>
            </div>
          </div>
        )}
      </div>

      {confirmDialog && (
        <ConfirmDialog
          title={confirmDialog.title}
          description={confirmDialog.description}
          onConfirm={() => {
            switch (confirmDialog.action) {
              case "promote-creator":
                handlePromoteToCreator();
                break;
              case "promote-investor":
                handlePromoteToInvestor();
                break;
              case "promote-admin":
                handlePromoteToAdmin();
                break;
              case "revoke-creator":
                handleRevokeCreatorAccess();
                break;
              case "revoke-investor":
                handleRevokeInvestorAccess();
                break;
              case "ban":
                handleBanUser();
                break;
              case "unban":
                handleUnbanUser();
                break;
              case "delete":
                handleDelete();
                break;
            }
            setConfirmDialog(null);
            setIsOpen(false);
          }}
          onCancel={() => setConfirmDialog(null)}
        />
      )}
    </>
  );
}
