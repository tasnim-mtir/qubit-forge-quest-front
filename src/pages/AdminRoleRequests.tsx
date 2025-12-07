import { useAuth } from "@/hooks/useAuth";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { Clock } from "lucide-react";
import { AdminSidebar } from "@/components/admin/AdminSidebar";
import { PendingRoleRequests } from "@/components/admin/PendingRoleRequests";

export function AdminRoleRequests() {
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    // Redirect if not admin
    if (!loading && user && user.role !== "admin") {
      navigate("/");
    }
  }, [user, loading, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-16 h-16 relative">
            <div className="absolute inset-0 bg-gradient-to-r from-yellow-500 to-yellow-600 rounded-lg blur animate-pulse"></div>
            <div className="absolute inset-0 bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 rounded-lg flex items-center justify-center">
              <svg className="w-8 h-8 animate-spin text-yellow-400" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            </div>
          </div>
          <p className="text-slate-300 font-semibold">Loading Pending Requests</p>
        </div>
      </div>
    );
  }

  if (!user || user.role !== "admin") {
    return null;
  }

  return (
    <div className="flex h-screen bg-slate-950">
      <AdminSidebar />
      <div className="flex-1 overflow-auto">
        <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
          {/* Header Section */}
          <div className="border-b border-blue-500/20 bg-slate-900/50 sticky top-0 z-40">
            <div className="px-8 py-6">
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 bg-yellow-500/20 rounded-lg">
                  <Clock className="w-6 h-6 text-yellow-400" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-slate-100">Pending Role Requests</h1>
                  <p className="text-sm text-slate-400 mt-1">
                    Review and manage user requests to become creators or investors
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Content Section */}
          <div className="px-8 py-6">
            <div className="bg-gradient-to-br from-slate-900/50 to-slate-950/50 border border-blue-500/20 rounded-lg p-6">
              <PendingRoleRequests />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
