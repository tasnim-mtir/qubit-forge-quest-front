import { ChevronDown, Zap } from "lucide-react";
import { useState } from "react";
import type { ComputeTask } from "@/services/protocolAPI";
import { Button } from "@/components/ui/button";

interface AllTasksTableProps {
  tasks: ComputeTask[];
  isLoading: boolean;
}

export function AllTasksTable({ tasks, isLoading }: AllTasksTableProps) {
  const [expandedTask, setExpandedTask] = useState<string | null>(null);
  const [sortConfig, setSortConfig] = useState<{
    key: keyof ComputeTask;
    direction: "asc" | "desc";
  } | null>(null);
  const [statusFilter, setStatusFilter] = useState<"all" | "queued" | "running" | "completed" | "failed">("all");

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "queued":
        return (
          <span className="inline-flex items-center gap-2 px-3 py-1.5 bg-gradient-to-r from-amber-500/20 to-amber-600/10 border border-amber-500/30 text-amber-300 text-xs font-semibold rounded-full hover:border-amber-500/50 transition-all">
            <span className="w-2 h-2 bg-amber-400 rounded-full animate-pulse"></span>
            Queued
          </span>
        );
      case "running":
        return (
          <span className="inline-flex items-center gap-2 px-3 py-1.5 bg-gradient-to-r from-blue-500/20 to-blue-600/10 border border-blue-500/30 text-blue-300 text-xs font-semibold rounded-full hover:border-blue-500/50 transition-all">
            <span className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"></span>
            Running
          </span>
        );
      case "completed":
        return (
          <span className="inline-flex items-center gap-2 px-3 py-1.5 bg-gradient-to-r from-emerald-500/20 to-emerald-600/10 border border-emerald-500/30 text-emerald-300 text-xs font-semibold rounded-full hover:border-emerald-500/50 transition-all">
            <span className="w-2 h-2 bg-emerald-400 rounded-full"></span>
            Completed
          </span>
        );
      case "failed":
        return (
          <span className="inline-flex items-center gap-2 px-3 py-1.5 bg-gradient-to-r from-red-500/20 to-red-600/10 border border-red-500/30 text-red-300 text-xs font-semibold rounded-full hover:border-red-500/50 transition-all">
            <span className="w-2 h-2 bg-red-400 rounded-full"></span>
            Failed
          </span>
        );
      default:
        return null;
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const getExecutionTime = (createdAt: string, updatedAt?: string) => {
    const start = new Date(createdAt).getTime();
    const end = updatedAt ? new Date(updatedAt).getTime() : Date.now();
    const ms = end - start;
    const seconds = Math.floor(ms / 1000);
    if (seconds < 60) return `${seconds}s`;
    return `${Math.floor(seconds / 60)}m`;
  };

  const handleSort = (key: keyof ComputeTask) => {
    setSortConfig(
      sortConfig?.key === key && sortConfig?.direction === "asc"
        ? { key, direction: "desc" }
        : { key, direction: "asc" }
    );
  };

  let filteredTasks = tasks;
  if (statusFilter !== "all") {
    filteredTasks = tasks.filter((t) => t.status === statusFilter);
  }

  const sortedTasks = [...filteredTasks].sort((a, b) => {
    if (!sortConfig) return 0;

    const aValue = a[sortConfig.key];
    const bValue = b[sortConfig.key];

    if (typeof aValue === "string" && typeof bValue === "string") {
      return sortConfig.direction === "asc"
        ? aValue.localeCompare(bValue)
        : bValue.localeCompare(aValue);
    }

    if (typeof aValue === "number" && typeof bValue === "number") {
      return sortConfig.direction === "asc" ? aValue - bValue : bValue - aValue;
    }

    return 0;
  });

  const SortIcon = ({ column }: { column: keyof ComputeTask }) => {
    if (sortConfig?.key !== column) {
      return <span className="text-slate-500">⇅</span>;
    }
    return <span className="text-blue-400">{sortConfig.direction === "asc" ? "↑" : "↓"}</span>;
  };

  // Calculate summary from all tasks
  const statusCount = {
    queued: tasks.filter((t) => t.status === "queued").length,
    running: tasks.filter((t) => t.status === "running").length,
    completed: tasks.filter((t) => t.status === "completed").length,
    failed: tasks.filter((t) => t.status === "failed").length,
  };

  const avgExecutionTime =
    tasks.filter((t) => t.status === "completed").length > 0
      ? (
          tasks
            .filter((t) => t.status === "completed")
            .reduce((sum, t) => {
              const ms = new Date(t.timestamp).getTime() - new Date(t.createdAt).getTime();
              return sum + ms;
            }, 0) / tasks.filter((t) => t.status === "completed").length
        ).toFixed(0)
      : "0";

  const totalCCSpent = tasks.reduce((sum, t) => sum + t.computeCostCC, 0);

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <div className="bg-gradient-to-br from-amber-500/10 to-amber-600/5 border border-amber-500/20 rounded-lg p-4 hover:border-amber-500/40 transition-all">
          <p className="text-slate-400 text-sm font-medium">Queued</p>
          <p className="text-2xl font-bold text-amber-300 mt-2">{statusCount.queued}</p>
        </div>
        <div className="bg-gradient-to-br from-blue-500/10 to-blue-600/5 border border-blue-500/20 rounded-lg p-4 hover:border-blue-500/40 transition-all">
          <p className="text-slate-400 text-sm font-medium">Running</p>
          <p className="text-2xl font-bold text-blue-300 mt-2">{statusCount.running}</p>
        </div>
        <div className="bg-gradient-to-br from-emerald-500/10 to-emerald-600/5 border border-emerald-500/20 rounded-lg p-4 hover:border-emerald-500/40 transition-all">
          <p className="text-slate-400 text-sm font-medium">Completed</p>
          <p className="text-2xl font-bold text-emerald-300 mt-2">{statusCount.completed}</p>
        </div>
        <div className="bg-gradient-to-br from-red-500/10 to-red-600/5 border border-red-500/20 rounded-lg p-4 hover:border-red-500/40 transition-all">
          <p className="text-slate-400 text-sm font-medium">Failed</p>
          <p className="text-2xl font-bold text-red-300 mt-2">{statusCount.failed}</p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-gradient-to-br from-blue-500/10 to-blue-600/5 border border-blue-500/20 rounded-lg p-5 hover:border-blue-500/40 transition-all">
          <p className="text-slate-400 text-sm font-medium">Total CC Spent</p>
          <p className="text-3xl font-bold text-blue-300 mt-3">{totalCCSpent.toLocaleString()}</p>
          <p className="text-xs text-slate-500 mt-2">across {tasks.length} tasks</p>
        </div>
        <div className="bg-gradient-to-br from-emerald-500/10 to-emerald-600/5 border border-emerald-500/20 rounded-lg p-5 hover:border-emerald-500/40 transition-all">
          <p className="text-slate-400 text-sm font-medium">Avg Execution Time</p>
          <p className="text-3xl font-bold text-emerald-300 mt-3">{avgExecutionTime}s</p>
          <p className="text-xs text-slate-500 mt-2">for completed tasks</p>
        </div>
        <div className="bg-gradient-to-br from-purple-500/10 to-purple-600/5 border border-purple-500/20 rounded-lg p-5 hover:border-purple-500/40 transition-all">
          <p className="text-slate-400 text-sm font-medium">Success Rate</p>
          <p className="text-3xl font-bold text-purple-300 mt-3">
            {tasks.length > 0
              ? (
                  ((statusCount.completed / tasks.length) * 100).toFixed(1)
                )
              : "0"}
            %
          </p>
          <p className="text-xs text-slate-500 mt-2">completed tasks</p>
        </div>
      </div>

      {/* Status Filter */}
      <div className="flex gap-2 flex-wrap p-4 bg-gradient-to-r from-slate-900/50 to-slate-800/30 rounded-lg border border-slate-700/50">
        {(["all", "queued", "running", "completed", "failed"] as const).map((status) => {
          const colorMap = {
            all: "blue",
            queued: "amber",
            running: "blue",
            completed: "emerald",
            failed: "red",
          };
          const color = colorMap[status as keyof typeof colorMap];
          
          return (
            <button
              key={status}
              onClick={() => setStatusFilter(status)}
              className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
                statusFilter === status
                  ? `bg-${color}-600/40 border border-${color}-500/50 text-${color}-300`
                  : "bg-slate-800/50 hover:bg-slate-700/50 border border-slate-600 text-slate-400 hover:text-slate-200"
              }`}
            >
              {status.charAt(0).toUpperCase() + status.slice(1)}
            </button>
          );
        })}
      </div>

      {/* Table */}
      <div className="bg-gradient-to-b from-slate-900/50 to-slate-950/30 border border-slate-700/50 rounded-lg overflow-hidden backdrop-blur-sm">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gradient-to-r from-slate-900/80 to-slate-800/50 border-b border-slate-700/50">
              <tr>
                <th className="px-6 py-4 text-left">
                  <button
                    onClick={() => handleSort("taskName")}
                    className="flex items-center gap-2 text-slate-300 hover:text-blue-300 transition-colors font-semibold text-sm uppercase tracking-wide"
                  >
                    Task Name <SortIcon column="taskName" />
                  </button>
                </th>
                <th className="px-6 py-4 text-left">
                  <button
                    onClick={() => handleSort("creatorId")}
                    className="flex items-center gap-2 text-slate-300 hover:text-blue-300 transition-colors font-semibold text-sm uppercase tracking-wide"
                  >
                    Creator <SortIcon column="creatorId" />
                  </button>
                </th>
                <th className="px-6 py-4 text-left">
                  <button
                    onClick={() => handleSort("computeCostCC")}
                    className="flex items-center gap-2 text-slate-300 hover:text-blue-300 transition-colors font-semibold text-sm"
                  >
                    CC Cost <SortIcon column="computeCostCC" />
                  </button>
                </th>
                <th className="px-6 py-4 text-left">
                  <button
                    onClick={() => handleSort("status")}
                    className="flex items-center gap-2 text-slate-300 hover:text-blue-300 transition-colors font-semibold text-sm"
                  >
                    Status <SortIcon column="status" />
                  </button>
                </th>
                <th className="px-6 py-4 text-left">
                  <button
                    onClick={() => handleSort("createdAt")}
                    className="flex items-center gap-2 text-slate-300 hover:text-blue-300 transition-colors font-semibold text-sm"
                  >
                    Created <SortIcon column="createdAt" />
                  </button>
                </th>
                <th className="px-6 py-4 text-center text-slate-300 font-semibold text-sm">
                  Details
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-700/30">
              {isLoading ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center">
                    <div className="flex items-center justify-center gap-2">
                      <svg className="w-5 h-5 animate-spin text-blue-400" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      <span className="text-slate-400">Loading tasks...</span>
                    </div>
                  </td>
                </tr>
              ) : sortedTasks.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center">
                    <p className="text-slate-400">No tasks found</p>
                  </td>
                </tr>
              ) : (
                sortedTasks.map((task) => (
                  <tbody key={task._id}>
                    <tr className="hover:bg-blue-500/5 transition-colors group border-t border-slate-700/20">
                      <td className="px-6 py-5">
                        <span className="text-slate-200 font-semibold">{task.taskName}</span>
                      </td>
                      <td className="px-6 py-5">
                        <span className="text-slate-300 text-sm">
                          {task.creatorId ? (typeof task.creatorId === "object" ? (task.creatorId as any).email : "Unknown") : "Unknown"}
                        </span>
                      </td>
                      <td className="px-6 py-5">
                        <div className="flex items-center gap-2">
                          <Zap className="w-4 h-4 text-blue-500" />
                          <span className="text-blue-300 font-semibold">{task.computeCostCC} CC</span>
                        </div>
                      </td>
                      <td className="px-6 py-5">{getStatusBadge(task.status)}</td>
                      <td className="px-6 py-5">
                        <p className="text-slate-400 text-sm">{formatDate(task.createdAt)}</p>
                      </td>
                      <td className="px-6 py-5 text-center">
                        <button
                          onClick={() =>
                            setExpandedTask(expandedTask === task._id ? null : task._id)
                          }
                          className="p-2 hover:bg-slate-700/50 rounded transition-all"
                        >
                          <ChevronDown
                            className={`w-5 h-5 text-slate-400 transition-transform ${
                              expandedTask === task._id ? "rotate-180" : ""
                            }`}
                          />
                        </button>
                      </td>
                    </tr>

                    {/* Expanded Row */}
                    {expandedTask === task._id && (
                      <tr className="bg-slate-800/20">
                        <td colSpan={6} className="px-6 py-6">
                          <div className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div>
                                <p className="text-slate-500 text-sm mb-1">Task ID</p>
                                <p className="text-slate-200 font-mono text-sm break-all">{task._id}</p>
                              </div>
                              <div>
                                <p className="text-slate-500 text-sm mb-1">Creator ID</p>
                                <p className="text-slate-200 font-mono text-sm break-all">{task.creatorId}</p>
                              </div>
                              <div>
                                <p className="text-slate-500 text-sm mb-1">Created</p>
                                <p className="text-slate-200">{formatDate(task.createdAt)}</p>
                              </div>
                              <div>
                                <p className="text-slate-500 text-sm mb-1">Execution Time</p>
                                <p className="text-slate-200">{getExecutionTime(task.createdAt, task.timestamp)}</p>
                              </div>
                            </div>

                            {/* Result */}
                            {task.result && (
                              <div className="bg-slate-800/30 rounded p-4 border border-slate-700">
                                <p className="text-slate-400 text-sm mb-2">Result</p>
                                <pre className="text-xs text-slate-300 overflow-auto max-h-32 bg-slate-900/50 p-2 rounded">
                                  {JSON.stringify(task.result, null, 2)}
                                </pre>
                              </div>
                            )}

                            {/* Action Buttons */}
                            <div className="flex gap-2 pt-4 border-t border-slate-700">
                              {task.status === "queued" && (
                                <Button className="bg-blue-600/20 hover:bg-blue-600/40 border border-blue-500/30 text-blue-300">
                                  Force Complete
                                </Button>
                              )}
                              <Button className="bg-slate-700/20 hover:bg-slate-600/40 border border-slate-600/30 text-slate-300">
                                View Full Details
                              </Button>
                            </div>
                          </div>
                        </td>
                      </tr>
                    )}
                  </tbody>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
