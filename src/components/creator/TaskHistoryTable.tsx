import { useState } from "react";
import type { ComputeTask } from "@/services/protocolAPI";
import { ChevronDown } from "lucide-react";

interface TaskHistoryTableProps {
  tasks: ComputeTask[];
  isLoading: boolean;
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export function TaskHistoryTable({
  tasks,
  isLoading,
  currentPage,
  totalPages,
  onPageChange,
}: TaskHistoryTableProps) {
  const [expandedTask, setExpandedTask] = useState<string | null>(null);
  const [sortConfig, setSortConfig] = useState<{
    key: keyof ComputeTask;
    direction: "asc" | "desc";
  } | null>(null);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "queued":
        return (
          <span className="inline-flex items-center gap-1 px-3 py-1 bg-yellow-500/20 border border-yellow-500/30 text-yellow-300 text-xs font-medium rounded-full">
            <span className="w-2 h-2 bg-yellow-500 rounded-full animate-pulse"></span>
            Queued
          </span>
        );
      case "running":
        return (
          <span className="inline-flex items-center gap-1 px-3 py-1 bg-blue-500/20 border border-blue-500/30 text-blue-300 text-xs font-medium rounded-full">
            <span className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></span>
            Running
          </span>
        );
      case "completed":
        return (
          <span className="inline-flex items-center gap-1 px-3 py-1 bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 text-xs font-medium rounded-full">
            <span className="w-2 h-2 bg-emerald-500 rounded-full"></span>
            Completed
          </span>
        );
      case "failed":
        return (
          <span className="inline-flex items-center gap-1 px-3 py-1 bg-red-500/20 border border-red-500/30 text-red-300 text-xs font-medium rounded-full">
            <span className="w-2 h-2 bg-red-500 rounded-full"></span>
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
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const handleSort = (key: keyof ComputeTask) => {
    setSortConfig(
      sortConfig?.key === key && sortConfig?.direction === "asc"
        ? { key, direction: "desc" }
        : { key, direction: "asc" }
    );
  };

  const sortedTasks = [...tasks].sort((a, b) => {
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

  return (
    <div className="space-y-6">
      {/* Table */}
      <div className="bg-gradient-to-b from-slate-900/50 to-slate-950/50 border border-blue-500/20 rounded-lg overflow-hidden backdrop-blur-sm">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-900/80 border-b border-blue-500/20">
              <tr>
                <th className="px-6 py-4 text-left">
                  <button
                    onClick={() => handleSort("taskName")}
                    className="flex items-center gap-2 text-slate-300 hover:text-blue-300 transition-colors font-semibold text-sm"
                  >
                    Task Name <SortIcon column="taskName" />
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
                    Created Date <SortIcon column="createdAt" />
                  </button>
                </th>
                <th className="px-6 py-4 text-center text-slate-300 font-semibold text-sm">
                  Details
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-blue-500/10">
              {isLoading ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center">
                    <div className="flex items-center justify-center gap-2">
                      <svg className="w-5 h-5 animate-spin text-blue-400" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      <span className="text-slate-400">Loading tasks...</span>
                    </div>
                  </td>
                </tr>
              ) : tasks.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center">
                    <p className="text-slate-400">No tasks found. Create your first task!</p>
                  </td>
                </tr>
              ) : (
                sortedTasks.map((task) => (
                  <tbody key={task._id}>
                    <tr className="hover:bg-slate-800/30 transition-colors group">
                      <td className="px-6 py-4">
                        <p className="text-slate-200 font-medium">{task.taskName}</p>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-blue-300 font-semibold">{task.computeCostCC} CC</span>
                      </td>
                      <td className="px-6 py-4">{getStatusBadge(task.status)}</td>
                      <td className="px-6 py-4">
                        <p className="text-slate-400 text-sm">{formatDate(task.createdAt)}</p>
                      </td>
                      <td className="px-6 py-4 text-center">
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
                        <td colSpan={5} className="px-6 py-6">
                          <div className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div>
                                <p className="text-slate-500 text-sm mb-1">Task ID</p>
                                <p className="text-slate-200 font-mono text-sm break-all">
                                  {task._id}
                                </p>
                              </div>
                              <div>
                                <p className="text-slate-500 text-sm mb-1">Status</p>
                                <p className="text-slate-200">{getStatusBadge(task.status)}</p>
                              </div>
                            </div>

                            {task.result && (
                              <div className="bg-slate-900/50 border border-blue-500/20 rounded-lg p-4">
                                <p className="text-slate-500 text-sm mb-2">Task Result</p>
                                <pre className="text-slate-300 text-xs overflow-auto max-h-48 bg-slate-950/50 p-3 rounded border border-slate-700">
                                  {JSON.stringify(task.result, null, 2)}
                                </pre>
                              </div>
                            )}

                            <div className="text-xs text-slate-500 space-y-1">
                              <p>Created: {formatDate(task.createdAt)}</p>
                              <p>Updated: {formatDate(task.timestamp)}</p>
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

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between px-4 py-4 bg-slate-900/30 border border-blue-500/20 rounded-lg backdrop-blur-sm">
          <div className="text-sm text-slate-400">
            Page {currentPage} of {totalPages}
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => onPageChange(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
              className="px-3 py-2 bg-blue-600/20 border border-blue-500/30 text-blue-400 rounded hover:bg-blue-600/40 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
              ← Previous
            </button>
            <div className="flex items-center gap-1">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <button
                  key={page}
                  onClick={() => onPageChange(page)}
                  className={`px-3 py-2 rounded transition-all ${
                    currentPage === page
                      ? "bg-blue-600 text-white"
                      : "bg-slate-800/50 text-slate-400 hover:bg-slate-700/50"
                  }`}
                >
                  {page}
                </button>
              ))}
            </div>
            <button
              onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
              disabled={currentPage === totalPages}
              className="px-3 py-2 bg-blue-600/20 border border-blue-500/30 text-blue-400 rounded hover:bg-blue-600/40 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
              Next →
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
