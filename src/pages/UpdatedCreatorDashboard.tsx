import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { useGetMyTasks } from "@/hooks/useProtocol";
import { useDetailedQueue, useProcessorStatus } from "@/hooks/useProcessorMonitoring";
import { ProcessorStatusWidget } from "@/components/processor/ProcessorStatusWidget";
import { LiveTaskStatusTable } from "@/components/processor/LiveTaskStatusTable";
import { QueuePositionIndicator } from "@/components/processor/QueuePositionIndicator";
import { ExecutionHistoryModal } from "@/components/processor/ExecutionHistoryModal";
import { useToast } from "@/hooks/use-toast";

export default function UpdatedCreatorDashboard() {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [selectedTaskId, setSelectedTaskId] = useState<string | null>(null);
  const [showHistoryModal, setShowHistoryModal] = useState(false);

  // Redirect if not creator
  useEffect(() => {
    if (!authLoading && (!user || user.role !== "creator")) {
      navigate("/");
    }
  }, [user, authLoading, navigate]);

  // Fetch tasks (auto-refresh every 5s)
  const { data: tasksData, isLoading: tasksLoading, refetch: refetchTasks } = useGetMyTasks(1, 50);

  // Fetch processor status (auto-refresh every 5s)
  const { data: processorData, loading: processorLoading } = useProcessorStatus({
    refreshInterval: 5000,
    enabled: true,
  });

  // Fetch detailed queue (auto-refresh every 5s)
  const { data: queueData, loading: queueLoading } = useDetailedQueue({
    refreshInterval: 5000,
    enabled: true,
  });

  const handleViewHistory = (taskId: string) => {
    setSelectedTaskId(taskId);
    setShowHistoryModal(true);
  };

  const handleRetryTask = async (taskId: string) => {
    try {
      // TODO: Implement retry logic with backend
      toast({
        title: "Retry Initiated",
        description: `Task will be requeued for processing`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to retry task",
        variant: "destructive",
      });
    }
  };

  // Get creator's queued tasks
  const creatorQueuedTasks = queueData?.tasks.filter(
    (task) => task.creatorId === (user?.id || user?._id)
  ) || [];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 to-slate-900 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Creator Dashboard</h1>
          <p className="text-slate-400">Monitor and manage your compute tasks in real-time</p>
        </div>

        {/* Processor Status Widget */}
        <div className="mb-8">
          <ProcessorStatusWidget refreshInterval={5000} />
        </div>

        {/* Main Grid */}
        <div className="grid lg:grid-cols-3 gap-8 mb-8">
          {/* Left Column - Tasks & Queue (2/3 width) */}
          <div className="lg:col-span-2 space-y-8">
            {/* Live Task Status Table */}
            <div>
              <LiveTaskStatusTable
                tasks={tasksData?.tasks || []}
                loading={tasksLoading}
                onViewHistory={handleViewHistory}
                onRetryTask={handleRetryTask}
                isAutoRefreshing={true}
              />
            </div>

            {/* Queue Position Indicator */}
            {creatorQueuedTasks.length > 0 && (
              <div>
                <QueuePositionIndicator
                  queuedTasks={creatorQueuedTasks}
                  totalQueueLength={queueData?.queueLength || 0}
                  avgWaitTime={queueData?.avgWaitTime || 0}
                />
              </div>
            )}
          </div>

          {/* Right Column - Statistics (1/3 width) */}
          <div className="space-y-6">
            {/* Task Statistics */}
            <div className="bg-slate-800/30 border border-slate-700/50 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-white mb-6">Task Statistics</h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center pb-3 border-b border-slate-700/30">
                  <span className="text-slate-400">Total Tasks</span>
                  <span className="text-lg font-bold text-white">
                    {tasksData?.statusCount?.completed ||
                      tasksData?.statusCount?.queued ||
                      tasksData?.statusCount?.running ||
                      0}
                  </span>
                </div>
                <div className="flex justify-between items-center pb-3 border-b border-slate-700/30">
                  <span className="text-yellow-400">⏳ Queued</span>
                  <span className="text-xl font-bold text-yellow-400">
                    {tasksData?.statusCount?.queued || 0}
                  </span>
                </div>
                <div className="flex justify-between items-center pb-3 border-b border-slate-700/30">
                  <span className="text-blue-400">▶️ Running</span>
                  <span className="text-xl font-bold text-blue-400">
                    {tasksData?.statusCount?.running || 0}
                  </span>
                </div>
                <div className="flex justify-between items-center pb-3 border-b border-slate-700/30">
                  <span className="text-green-400">✓ Completed</span>
                  <span className="text-xl font-bold text-green-400">
                    {tasksData?.statusCount?.completed || 0}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-red-400">✗ Failed</span>
                  <span className="text-xl font-bold text-red-400">
                    {tasksData?.statusCount?.failed || 0}
                  </span>
                </div>
              </div>
            </div>

            {/* System Health */}
            <div className="bg-slate-800/30 border border-slate-700/50 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-white mb-4">System Health</h3>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm text-slate-400">Processor Status</span>
                    <span
                      className={`text-xs font-bold px-2 py-1 rounded ${
                        processorData?.processor?.isRunning
                          ? "bg-green-500/20 text-green-400"
                          : "bg-red-500/20 text-red-400"
                      }`}
                    >
                      {processorData?.processor?.isRunning ? "✓ Running" : "✗ Offline"}
                    </span>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm text-slate-400">Queue Health</span>
                    <span className="text-sm text-blue-400 font-medium">
                      {processorData?.queue?.queuedCount || 0} queued
                    </span>
                  </div>
                  <div className="w-full bg-slate-900/50 rounded-full h-2 overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-yellow-400 to-orange-400 transition-all duration-500"
                      style={{
                        width: `${Math.min(
                          ((processorData?.queue?.queuedCount || 0) / 100) * 100,
                          100
                        )}%`,
                      } as React.CSSProperties}
                    />
                  </div>
                </div>

                {processorData?.stats && (
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm text-slate-400">Success Rate</span>
                      <span className="text-sm font-bold text-green-400">
                        {(processorData.stats.successRate * 100).toFixed(1)}%
                      </span>
                    </div>
                    <div className="w-full bg-slate-900/50 rounded-full h-2 overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-green-400 to-emerald-400 transition-all duration-500"
                        style={{
                          width: `${Math.min(processorData.stats.successRate * 100, 100)}%`,
                        } as React.CSSProperties}
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-slate-800/30 border border-slate-700/50 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-white mb-4">Quick Actions</h3>
              <div className="space-y-2">
                <button className="w-full px-4 py-2 bg-blue-500/20 hover:bg-blue-500/30 border border-blue-500/30 rounded-lg text-blue-300 text-sm font-medium transition-colors">
                  Create New Task
                </button>
                <button className="w-full px-4 py-2 bg-slate-700/20 hover:bg-slate-700/30 border border-slate-700/30 rounded-lg text-slate-300 text-sm font-medium transition-colors">
                  View Reports
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Info Banner */}
        <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4 flex gap-2">
          <span className="text-blue-300 text-sm">
            ℹ️ All data updates automatically every 5 seconds. Task statuses are determined by the
            backend processor.
          </span>
        </div>
      </div>

      {/* Execution History Modal */}
      <ExecutionHistoryModal
        taskId={selectedTaskId}
        taskName={tasksData?.tasks.find((t) => t._id === selectedTaskId)?.taskName}
        isOpen={showHistoryModal}
        onClose={() => setShowHistoryModal(false)}
      />
    </div>
  );
}
