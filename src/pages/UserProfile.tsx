import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useGetMyRoleRequest } from "@/hooks/useRoleRequest";
import { RoleRequestDialog } from "@/components/RoleRequestDialog";
import { Mail, User, Shield, Clock, CheckCircle, XCircle } from "lucide-react";

export function UserProfile() {
  const { user } = useAuth();
  const [openRoleDialog, setOpenRoleDialog] = useState(false);
  const { data: roleRequest, refetch } = useGetMyRoleRequest();

  if (!user) {
    return (
      <div className="text-center py-12">
        <p className="text-slate-400">Loading profile...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 to-slate-900 p-6">
      <div className="max-w-2xl mx-auto space-y-6">
        {/* Profile Header */}
        <div className="bg-gradient-to-br from-slate-900/50 to-slate-950/50 border border-blue-500/20 rounded-lg p-8">
          <div className="flex items-start justify-between mb-6">
            <div className="flex items-start gap-4">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                <User className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-slate-100">{user.email}</h1>
                <p className="text-slate-400 mt-1">
                  Role: <span className="text-blue-300 font-semibold capitalize">{user.role}</span>
                </p>
              </div>
            </div>
          </div>

          {/* Profile Details */}
          <div className="space-y-3">
            <div className="flex items-center gap-3 text-slate-300">
              <Mail className="w-5 h-5 text-slate-400" />
              <span>{user.email}</span>
            </div>
            <div className="flex items-center gap-3 text-slate-300">
              <Shield className="w-5 h-5 text-slate-400" />
              <span className="capitalize">{user.role}</span>
            </div>
            {user.createdAt && (
              <div className="flex items-center gap-3 text-slate-300">
                <Clock className="w-5 h-5 text-slate-400" />
                <span>Member since {new Date(user.createdAt).toLocaleDateString()}</span>
              </div>
            )}
          </div>
        </div>

        {/* Current Role Status */}
        <div className="bg-gradient-to-br from-slate-900/50 to-slate-950/50 border border-blue-500/20 rounded-lg p-6">
          <h2 className="text-xl font-bold text-slate-100 mb-4">Current Status</h2>
          <div className="space-y-4">
            {user.role === "user" ? (
              <div>
                <p className="text-slate-300 mb-4">
                  You are currently a <span className="font-semibold">User</span>. Request access to become a Creator or Investor.
                </p>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <CheckCircle className="w-5 h-5 text-emerald-400" />
                <p className="text-slate-300">
                  You have access to <span className="font-semibold capitalize">{user.role}</span> features
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Role Request Status */}
        {roleRequest && (
          <div
            className={`border rounded-lg p-6 ${
              roleRequest.status === "pending"
                ? "bg-yellow-500/10 border-yellow-500/20"
                : roleRequest.status === "approved"
                  ? "bg-emerald-500/10 border-emerald-500/20"
                  : "bg-red-500/10 border-red-500/20"
            }`}
          >
            <div className="flex items-start gap-4">
              {roleRequest.status === "pending" && (
                <Clock className="w-5 h-5 text-yellow-400 mt-1" />
              )}
              {roleRequest.status === "approved" && (
                <CheckCircle className="w-5 h-5 text-emerald-400 mt-1" />
              )}
              {roleRequest.status === "rejected" && (
                <XCircle className="w-5 h-5 text-red-400 mt-1" />
              )}
              <div className="flex-1">
                <h3 className="font-semibold text-slate-100 mb-1">
                  Role Request - {roleRequest.requestedRole.charAt(0).toUpperCase() + roleRequest.requestedRole.slice(1)}
                </h3>
                <p className="text-sm text-slate-400 mb-2">
                  Status: <span className="capitalize font-semibold">{roleRequest.status}</span>
                </p>
                {roleRequest.message && (
                  <p className="text-sm text-slate-400 mb-2">Your message: {roleRequest.message}</p>
                )}
                {roleRequest.status === "rejected" && roleRequest.rejectionReason && (
                  <p className="text-sm text-red-300 mb-2">Reason: {roleRequest.rejectionReason}</p>
                )}
                {roleRequest.reviewedAt && (
                  <p className="text-xs text-slate-500">
                    {roleRequest.status === "approved" ? "Approved" : "Reviewed"} on{" "}
                    {new Date(roleRequest.reviewedAt).toLocaleDateString()}
                  </p>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Request Role Section */}
        {user.role === "user" && !roleRequest && (
          <div className="bg-gradient-to-br from-blue-600/10 to-purple-600/10 border border-blue-500/20 rounded-lg p-6">
            <h2 className="text-xl font-bold text-slate-100 mb-4">Ready to Expand?</h2>
            <p className="text-slate-300 mb-6">
              Request access to Creator or Investor roles to unlock new features and opportunities.
            </p>
            <button
              onClick={() => setOpenRoleDialog(true)}
              className="px-6 py-2 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-500 hover:to-blue-600 text-white rounded-lg font-semibold transition-all"
            >
              Request Role Access
            </button>
          </div>
        )}

        {/* Role-Specific Information */}
        {user.role === "creator" && (
          <div className="bg-gradient-to-br from-purple-600/10 to-pink-600/10 border border-purple-500/20 rounded-lg p-6">
            <h2 className="text-xl font-bold text-slate-100 mb-4">Creator Features</h2>
            <ul className="space-y-2 text-slate-300">
              <li className="flex items-center gap-2">
                <span className="w-2 h-2 bg-purple-400 rounded-full"></span>
                Create and manage compute tasks
              </li>
              <li className="flex items-center gap-2">
                <span className="w-2 h-2 bg-purple-400 rounded-full"></span>
                Monitor task execution and results
              </li>
              <li className="flex items-center gap-2">
                <span className="w-2 h-2 bg-purple-400 rounded-full"></span>
                Earn rewards from completed tasks
              </li>
              <li className="flex items-center gap-2">
                <span className="w-2 h-2 bg-purple-400 rounded-full"></span>
                Access Creator Dashboard
              </li>
            </ul>
          </div>
        )}

        {user.role === "investor" && (
          <div className="bg-gradient-to-br from-emerald-600/10 to-teal-600/10 border border-emerald-500/20 rounded-lg p-6">
            <h2 className="text-xl font-bold text-slate-100 mb-4">Investor Features</h2>
            <ul className="space-y-2 text-slate-300">
              <li className="flex items-center gap-2">
                <span className="w-2 h-2 bg-emerald-400 rounded-full"></span>
                Access compute marketplace
              </li>
              <li className="flex items-center gap-2">
                <span className="w-2 h-2 bg-emerald-400 rounded-full"></span>
                Lease compute resources
              </li>
              <li className="flex items-center gap-2">
                <span className="w-2 h-2 bg-emerald-400 rounded-full"></span>
                Manage active leases
              </li>
              <li className="flex items-center gap-2">
                <span className="w-2 h-2 bg-emerald-400 rounded-full"></span>
                Access Investor Dashboard
              </li>
            </ul>
          </div>
        )}

        {user.role === "user" && (
          <div className="bg-gradient-to-br from-slate-600/10 to-slate-700/10 border border-slate-500/20 rounded-lg p-6">
            <h2 className="text-xl font-bold text-slate-100 mb-4">User Features</h2>
            <ul className="space-y-2 text-slate-300">
              <li className="flex items-center gap-2">
                <span className="w-2 h-2 bg-slate-400 rounded-full"></span>
                View platform overview
              </li>
              <li className="flex items-center gap-2">
                <span className="w-2 h-2 bg-slate-400 rounded-full"></span>
                Browse marketplace (read-only)
              </li>
              <li className="flex items-center gap-2">
                <span className="w-2 h-2 bg-slate-400 rounded-full"></span>
                Request role upgrade
              </li>
              <li className="flex items-center gap-2">
                <span className="w-2 h-2 bg-slate-400 rounded-full"></span>
                Access documentation
              </li>
            </ul>
          </div>
        )}
      </div>

      {/* Role Request Dialog */}
      <RoleRequestDialog
        open={openRoleDialog}
        onOpenChange={setOpenRoleDialog}
        onSuccess={() => refetch()}
      />
    </div>
  );
}
