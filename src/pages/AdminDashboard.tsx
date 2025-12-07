import { useAuth } from "@/hooks/useAuth";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { BarChart3, Zap, Users, Settings } from "lucide-react";
import { AdminSidebar } from "@/components/admin/AdminSidebar";
import { AllStakesTable } from "@/components/admin/AllStakesTable";
import { AllTasksTable } from "@/components/admin/AllTasksTable";
import { ComputePools } from "@/components/admin/ComputePools";
import { ParameterAdjustment } from "@/components/admin/ParameterAdjustment";
import { useGetAllStakes, useGetAllTasks, useGetVaultStats } from "@/hooks/useAdminUsers";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function AdminDashboard() {
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  // Fetch data
  const { data: stakesData, isLoading: stakesLoading } = useGetAllStakes(1, 50);
  const { data: tasksData, isLoading: tasksLoading } = useGetAllTasks(1, 50);
  const { data: vaultStats, isLoading: vaultLoading } = useGetVaultStats();

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
            <div className="absolute inset-0 bg-gradient-to-r from-red-500 to-red-600 rounded-lg blur animate-pulse"></div>
            <div className="absolute inset-0 bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 rounded-lg flex items-center justify-center">
              <svg className="w-8 h-8 animate-spin text-red-400" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            </div>
          </div>
          <p className="text-slate-300 font-semibold">Loading Protocol Dashboard</p>
        </div>
      </div>
    );
  }

  if (!user || user.role !== "admin") {
    return null;
  }

  const stakes = (stakesData as any)?.stakes || [];
  const tasks = (tasksData as any)?.tasks || [];

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      <AdminSidebar />

      <main className="flex-1 overflow-auto">
        {/* Top Bar */}
        <div className="border-b border-red-500/10 bg-gradient-to-r from-slate-900/50 to-slate-950/50 backdrop-blur-sm sticky top-0 z-30">
          <div className="px-6 py-4 flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-white flex items-center gap-2">
                <div className="p-2 bg-red-500/20 border border-red-500/30 rounded-lg">
                  <BarChart3 className="w-5 h-5 text-red-400" />
                </div>
                Protocol Admin
              </h1>
            </div>
            <div className="text-sm text-slate-400">
              Logged in as: <span className="text-slate-200 font-semibold">{user?.email}</span>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="px-6 py-8 space-y-8 pb-16">
          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-gradient-to-br from-red-500/10 to-red-600/5 border border-red-500/20 rounded-lg p-4 hover:border-red-500/40 transition-all">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-slate-400 text-sm">Total Stakes</p>
                  <p className="text-2xl font-bold text-red-300 mt-2">{stakes.length}</p>
                </div>
                <div className="p-3 bg-red-500/20 rounded-lg">
                  <Users className="w-5 h-5 text-red-400" />
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-blue-500/10 to-blue-600/5 border border-blue-500/20 rounded-lg p-4 hover:border-blue-500/40 transition-all">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-slate-400 text-sm">Active Tasks</p>
                  <p className="text-2xl font-bold text-blue-300 mt-2">
                    {tasks.filter((t) => t.status === "running").length}
                  </p>
                </div>
                <div className="p-3 bg-blue-500/20 rounded-lg">
                  <Zap className="w-5 h-5 text-blue-400" />
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-emerald-500/10 to-emerald-600/5 border border-emerald-500/20 rounded-lg p-4 hover:border-emerald-500/40 transition-all">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-slate-400 text-sm">Completed</p>
                  <p className="text-2xl font-bold text-emerald-300 mt-2">
                    {tasks.filter((t) => t.status === "completed").length}
                  </p>
                </div>
                <div className="p-3 bg-emerald-500/20 rounded-lg">
                  <BarChart3 className="w-5 h-5 text-emerald-400" />
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-purple-500/10 to-purple-600/5 border border-purple-500/20 rounded-lg p-4 hover:border-purple-500/40 transition-all">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-slate-400 text-sm">Parameters</p>
                  <p className="text-2xl font-bold text-purple-300 mt-2">9</p>
                </div>
                <div className="p-3 bg-purple-500/20 rounded-lg">
                  <Settings className="w-5 h-5 text-purple-400" />
                </div>
              </div>
            </div>
          </div>

          {/* Tabs Navigation */}
          <Tabs defaultValue="stakes" className="w-full">
            <TabsList className="grid w-full grid-cols-4 gap-2 bg-transparent p-0 mb-6 border-b border-slate-700/50">
              <TabsTrigger
                value="stakes"
                className="relative px-4 py-3 text-sm font-semibold rounded-none border-b-2 border-transparent data-[state=active]:border-red-500 data-[state=active]:bg-red-500/5 data-[state=active]:text-red-300 text-slate-400 hover:text-slate-300 transition-all"
              >
                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4" />
                  All Stakes
                </div>
              </TabsTrigger>

              <TabsTrigger
                value="tasks"
                className="relative px-4 py-3 text-sm font-semibold rounded-none border-b-2 border-transparent data-[state=active]:border-blue-500 data-[state=active]:bg-blue-500/5 data-[state=active]:text-blue-300 text-slate-400 hover:text-slate-300 transition-all"
              >
                <div className="flex items-center gap-2">
                  <Zap className="w-4 h-4" />
                  All Tasks
                </div>
              </TabsTrigger>

              <TabsTrigger
                value="pools"
                className="relative px-4 py-3 text-sm font-semibold rounded-none border-b-2 border-transparent data-[state=active]:border-emerald-500 data-[state=active]:bg-emerald-500/5 data-[state=active]:text-emerald-300 text-slate-400 hover:text-slate-300 transition-all"
              >
                <div className="flex items-center gap-2">
                  <BarChart3 className="w-4 h-4" />
                  Compute Pools
                </div>
              </TabsTrigger>

              <TabsTrigger
                value="parameters"
                className="relative px-4 py-3 text-sm font-semibold rounded-none border-b-2 border-transparent data-[state=active]:border-purple-500 data-[state=active]:bg-purple-500/5 data-[state=active]:text-purple-300 text-slate-400 hover:text-slate-300 transition-all"
              >
                <div className="flex items-center gap-2">
                  <Settings className="w-4 h-4" />
                  Parameters
                </div>
              </TabsTrigger>
            </TabsList>

            {/* Tab Content */}
            <TabsContent value="stakes" className="mt-8 animate-in fade-in duration-300">
              <AllStakesTable stakes={stakes} isLoading={stakesLoading} />
            </TabsContent>

            <TabsContent value="tasks" className="mt-8 animate-in fade-in duration-300">
              <AllTasksTable tasks={tasks} isLoading={tasksLoading} />
            </TabsContent>

            <TabsContent value="pools" className="mt-8 animate-in fade-in duration-300">
              <ComputePools vaultStats={vaultStats as any} isLoading={vaultLoading} />
            </TabsContent>

            <TabsContent value="parameters" className="mt-8 animate-in fade-in duration-300">
              <ParameterAdjustment />
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  );
}
