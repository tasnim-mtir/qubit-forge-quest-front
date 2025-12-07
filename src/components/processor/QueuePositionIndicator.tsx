import { QueuedTask } from "@/services/protocolAPI";
import { AlertCircle, Clock, Users } from "lucide-react";
import { formatDuration } from "@/lib/formatters";
import { cn } from "@/lib/utils";

interface QueuePositionIndicatorProps {
  queuedTasks: QueuedTask[];
  totalQueueLength: number;
  avgWaitTime: number;
  className?: string;
}

export function QueuePositionIndicator({
  queuedTasks,
  totalQueueLength,
  avgWaitTime,
  className,
}: QueuePositionIndicatorProps) {
  if (queuedTasks.length === 0) {
    return (
      <div className={cn("bg-slate-800/30 border border-slate-700/50 rounded-lg p-6", className)}>
        <div className="text-center">
          <p className="text-slate-400 mb-2">No queued tasks</p>
          <p className="text-sm text-slate-600">Your tasks will appear here when queued</p>
        </div>
      </div>
    );
  }

  return (
    <div className={cn("bg-slate-800/30 border border-slate-700/50 rounded-lg p-6", className)}>
      {/* Header */}
      <div className="mb-6">
        <h3 className="font-semibold text-white mb-2">Queue Position</h3>
        <div className="grid grid-cols-3 gap-4">
          <div className="bg-slate-900/50 rounded-lg p-3">
            <p className="text-xs text-slate-400 mb-1 flex items-center gap-1">
              <Users className="w-3 h-3" />
              Global Queue
            </p>
            <p className="text-2xl font-bold text-white">{totalQueueLength}</p>
          </div>
          <div className="bg-slate-900/50 rounded-lg p-3">
            <p className="text-xs text-slate-400 mb-1 flex items-center gap-1">
              <Clock className="w-3 h-3" />
              Avg Wait Time
            </p>
            <p className="text-lg font-bold text-yellow-400">
              {formatDuration(avgWaitTime)}
            </p>
          </div>
          <div className="bg-slate-900/50 rounded-lg p-3">
            <p className="text-xs text-slate-400 mb-1">Your Tasks</p>
            <p className="text-2xl font-bold text-blue-400">{queuedTasks.length}</p>
          </div>
        </div>
      </div>

      {/* Task List */}
      <div className="space-y-3">
        {queuedTasks.map((task, index) => (
          <div
            key={task._id}
            className="bg-gradient-to-r from-yellow-500/10 to-yellow-500/5 border border-yellow-500/30 rounded-lg p-4"
          >
            <div className="flex items-start justify-between mb-2">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-sm font-bold text-yellow-400">#{task.queuePosition}</span>
                  <p className="text-sm font-medium text-white truncate">{task.taskName}</p>
                </div>
                <p className="text-xs text-slate-400">Created: {new Date(task.createdAt).toLocaleTimeString()}</p>
              </div>
              <div className="text-right">
                <p className="text-xs text-slate-400 mb-1">Est. Wait Time</p>
                <p className="text-sm font-semibold text-yellow-400">
                  {formatDuration(task.estimatedWaitTime)}
                </p>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="w-full bg-slate-800/50 rounded-full h-2 overflow-hidden border border-yellow-500/20">
              <div
                className="h-full bg-gradient-to-r from-yellow-400 to-yellow-500 transition-all duration-500"
                style={{
                  width: `${Math.min((task.queuePosition / totalQueueLength) * 100, 100)}%`,
                } as React.CSSProperties}
              />
            </div>

            {/* Cost Info */}
            <div className="flex items-center justify-between mt-2 pt-2 border-t border-yellow-500/20">
              <span className="text-xs text-slate-400">Cost</span>
              <span className="text-sm font-medium text-slate-300">{task.computeCostCC} CC</span>
            </div>
          </div>
        ))}
      </div>

      {/* Info Box */}
      <div className="mt-6 pt-4 border-t border-slate-700/50">
        <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-3 flex gap-2">
          <AlertCircle className="w-4 h-4 text-blue-400 flex-shrink-0 mt-0.5" />
          <p className="text-xs text-blue-300">
            Tasks are automatically processed in order. Your queue position updates every 5 seconds.
          </p>
        </div>
      </div>
    </div>
  );
}
