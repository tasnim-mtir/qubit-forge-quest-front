import { useState } from "react";
import { ComputeTask } from "@/services/protocolAPI";
import { formatCurrency, formatDate, formatRelativeTime, formatStatus } from "@/lib/formatters";
import { Eye, Trash2, Play, RotateCcw } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface LiveTaskStatusTableProps {
  tasks: ComputeTask[];
  loading?: boolean;
  onViewHistory?: (taskId: string) => void;
  onRetryTask?: (taskId: string) => void;
  isAutoRefreshing?: boolean;
}

const getStatusColor = (status: string) => {
  switch (status) {
    case "queued":
      return "bg-yellow-500/20 text-yellow-300 border-yellow-500/30";
    case "running":
      return "bg-blue-500/20 text-blue-300 border-blue-500/30";
    case "completed":
      return "bg-green-500/20 text-green-300 border-green-500/30";
    case "failed":
      return "bg-red-500/20 text-red-300 border-red-500/30";
    default:
      return "bg-slate-500/20 text-slate-300 border-slate-500/30";
  }
};

const getStatusIcon = (status: string) => {
  switch (status) {
    case "queued":
      return "⏳";
    case "running":
      return "▶️";
    case "completed":
      return "✓";
    case "failed":
      return "✗";
    default:
      return "—";
  }
};

export function LiveTaskStatusTable({
  tasks,
  loading = false,
  onViewHistory,
  onRetryTask,
  isAutoRefreshing = true,
}: LiveTaskStatusTableProps) {
  const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set());

  const toggleRowExpand = (taskId: string) => {
    const newExpanded = new Set(expandedRows);
    if (newExpanded.has(taskId)) {
      newExpanded.delete(taskId);
    } else {
      newExpanded.add(taskId);
    }
    setExpandedRows(newExpanded);
  };

  const calculateDuration = (task: ComputeTask) => {
    if (task.timestamp && typeof task.timestamp === "string") {
      const startTime = new Date(task.timestamp).getTime();
      const endTime = new Date().getTime();
      const durationMs = endTime - startTime;
      const seconds = Math.floor(durationMs / 1000);
      const minutes = Math.floor(seconds / 60);

      if (minutes > 0) return `${minutes}m ${seconds % 60}s`;
      return `${seconds}s`;
    }
    return "—";
  };

  if (tasks.length === 0 && !loading) {
    return (
      <div className="text-center py-12 px-4">
        <p className="text-slate-400 mb-2">No tasks found</p>
        <p className="text-xs text-slate-600">Create a new task to get started</p>
      </div>
    );
  }

  return (
    <div className="bg-slate-800/30 border border-slate-700/50 rounded-lg overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-slate-700/50 bg-slate-900/50">
        <h3 className="font-semibold text-white flex items-center gap-2">
          Live Tasks
          {isAutoRefreshing && (
            <span className="text-xs bg-blue-500/20 text-blue-300 px-2 py-0.5 rounded">
              Auto-refresh 5s
            </span>
          )}
        </h3>
        <span className="text-xs text-slate-400">{tasks.length} tasks</span>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="border-b border-slate-700/30 hover:bg-transparent">
              <TableHead className="text-slate-400 font-medium">Task Name</TableHead>
              <TableHead className="text-slate-400 font-medium">Status</TableHead>
              <TableHead className="text-slate-400 font-medium">Cost (CC)</TableHead>
              <TableHead className="text-slate-400 font-medium">Created</TableHead>
              <TableHead className="text-slate-400 font-medium">Runtime</TableHead>
              <TableHead className="text-slate-400 font-medium text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {tasks.map((task) => (
              <TableRow
                key={task._id}
                className="border-b border-slate-700/30 hover:bg-slate-800/30 transition-colors group"
              >
                <TableCell className="font-medium text-white py-3">
                  <div className="flex items-center gap-2">
                    <span className="text-lg">{getStatusIcon(task.status)}</span>
                    <span className="truncate max-w-xs">{task.taskName}</span>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge
                    variant="outline"
                    className={cn(
                      "border text-xs font-medium cursor-default",
                      getStatusColor(task.status)
                    )}
                  >
                    {task.status.charAt(0).toUpperCase() + task.status.slice(1)}
                  </Badge>
                </TableCell>
                <TableCell className="text-slate-300">
                  {formatCurrency(task.computeCostCC, "CC")}
                </TableCell>
                <TableCell className="text-slate-400 text-sm">
                  {formatRelativeTime(new Date(task.createdAt))}
                </TableCell>
                <TableCell className="text-slate-400 text-sm">
                  {task.status === "running" || task.status === "queued"
                    ? calculateDuration(task)
                    : "—"}
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    {task.status === "failed" && onRetryTask && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onRetryTask(task._id)}
                        className="h-8 w-8 p-0 hover:bg-green-500/20 hover:text-green-400"
                        title="Retry task"
                      >
                        <RotateCcw className="w-4 h-4" />
                      </Button>
                    )}
                    {onViewHistory && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onViewHistory(task._id)}
                        className="h-8 w-8 p-0 hover:bg-blue-500/20 hover:text-blue-400"
                        title="View execution history"
                      >
                        <Eye className="w-4 h-4" />
                      </Button>
                    )}
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="flex items-center justify-center py-8">
          <div className="animate-spin">
            <div className="w-6 h-6 border-2 border-slate-600 border-t-blue-400 rounded-full" />
          </div>
          <span className="ml-2 text-slate-400">Loading tasks...</span>
        </div>
      )}
    </div>
  );
}
