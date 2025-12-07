import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { useQueryClient } from "@tanstack/react-query";
import { useGetMyTasks, useGetUserStakes } from "@/hooks/useProtocol";
import { CreatorNavbar } from "@/components/creator/CreatorNavbar";
import { CCBalanceWidget } from "@/components/creator/CCBalanceWidget";
import { CreateComputeTaskForm } from "@/components/creator/CreateComputeTaskForm";
import { TaskHistoryTable } from "@/components/creator/TaskHistoryTable";
import { QueueStatusMonitor } from "@/components/creator/QueueStatusMonitor";
import type { UserCCStatus } from "@/services/protocolAPI";

export default function CreatorDashboard() {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Redirect if not creator
  useEffect(() => {
    if (!authLoading && (!user || user.role !== "creator")) {
      navigate("/");
    }
  }, [user, authLoading, navigate]);

  // Fetch tasks
  const { data: tasksData, isLoading: tasksLoading } = useGetMyTasks(currentPage, itemsPerPage);

  // Fetch stakes to calculate CC balance
  const userId = user?.id || user?._id || "";
  const { data: stakesData, isLoading: stakesLoading } = useGetUserStakes(userId);

  // Calculate CC status
  const calculateCCStatus = (): UserCCStatus => {
    if (!stakesData) {
      return { totalCC: 0, usedCC: 0, availableCC: 0 };
    }

    const totalCC = stakesData.summary?.totalCC || 0;
    const usedCC = tasksData?.tasks.reduce((sum, task) => {
      if (task.status === "completed" || task.status === "running" || task.status === "queued") {
        return sum + task.computeCostCC;
      }
      return sum;
    }, 0) || 0;

    return {
      totalCC,
      usedCC,
      availableCC: Math.max(0, totalCC - usedCC),
    };
  };

  const ccStatus = calculateCCStatus();

  if (authLoading) {
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

  if (!user || user.role !== "creator") {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-slate-950">
      {/* Navbar */}
      <CreatorNavbar />

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

      <div className="relative z-10 pt-20">
        {/* Header */}
        <div className="container mx-auto max-w-7xl py-8 px-4 md:px-8">
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-white mb-2">Creator Dashboard</h1>
            <p className="text-slate-400">Manage your compute tasks and monitor Compute Credits</p>
          </div>

          {/* Top Section: CC Balance and Create Task */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
            <div className="lg:col-span-2">
              <CCBalanceWidget
                ccStatus={ccStatus}
                isLoading={stakesLoading || tasksLoading}
              />
            </div>
            <div className="flex flex-col justify-center">
              <CreateComputeTaskForm
                availableCC={ccStatus.availableCC}
                onSuccess={() => {
                  queryClient.invalidateQueries({ queryKey: ["myTasks"] });
                  setCurrentPage(1);
                }}
              />
            </div>
          </div>

          {/* Queue Status Monitor */}
          <div className="mb-8">
            <QueueStatusMonitor
              statusCount={tasksData?.statusCount || null}
              isLoading={tasksLoading}
            />
          </div>

          {/* Task History Section */}
          <div>
            <h2 className="text-2xl font-bold text-white mb-6">Task History</h2>
            <TaskHistoryTable
              tasks={tasksData?.tasks || []}
              isLoading={tasksLoading}
              currentPage={currentPage}
              totalPages={tasksData?.pagination.pages || 1}
              onPageChange={setCurrentPage}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
