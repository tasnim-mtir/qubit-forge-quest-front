import { useState } from "react";
import { ExecutionHistoryResponse } from "@/services/protocolAPI";
import { useExecutionHistory } from "@/hooks/useProcessorMonitoring";
import { formatDate, formatRelativeTime, formatDuration } from "@/lib/formatters";
import { AlertCircle, CheckCircle2, XCircle, Clock, Zap } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

interface ExecutionHistoryModalProps {
  taskId: string | null;
  taskName?: string;
  isOpen: boolean;
  onClose: () => void;
}

const getEventIcon = (
  eventType: "STARTED" | "PROCESSING" | "RECOVERED" | "COMPLETED" | "FAILED" | "QUEUED"
) => {
  switch (eventType) {
    case "STARTED":
      return <Zap className="w-4 h-4 text-blue-400" />;
    case "PROCESSING":
      return <Clock className="w-4 h-4 text-blue-400" />;
    case "RECOVERED":
      return <AlertCircle className="w-4 h-4 text-yellow-400" />;
    case "COMPLETED":
      return <CheckCircle2 className="w-4 h-4 text-green-400" />;
    case "FAILED":
      return <XCircle className="w-4 h-4 text-red-400" />;
    case "QUEUED":
      return <Clock className="w-4 h-4 text-yellow-400" />;
    default:
      return <AlertCircle className="w-4 h-4 text-slate-400" />;
  }
};

const getEventColor = (eventType: string) => {
  switch (eventType) {
    case "STARTED":
    case "PROCESSING":
      return "bg-blue-500/10 border-blue-500/30";
    case "RECOVERED":
      return "bg-yellow-500/10 border-yellow-500/30";
    case "COMPLETED":
      return "bg-green-500/10 border-green-500/30";
    case "FAILED":
      return "bg-red-500/10 border-red-500/30";
    case "QUEUED":
      return "bg-yellow-500/10 border-yellow-500/30";
    default:
      return "bg-slate-500/10 border-slate-500/30";
  }
};

export function ExecutionHistoryModal({
  taskId,
  taskName,
  isOpen,
  onClose,
}: ExecutionHistoryModalProps) {
  const { data, loading, error } = useExecutionHistory(isOpen && taskId ? taskId : null);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-500/20 text-green-300 border-green-500/30";
      case "failed":
        return "bg-red-500/20 text-red-300 border-red-500/30";
      case "running":
        return "bg-blue-500/20 text-blue-300 border-blue-500/30";
      case "queued":
        return "bg-yellow-500/20 text-yellow-300 border-yellow-500/30";
      default:
        return "bg-slate-500/20 text-slate-300 border-slate-500/30";
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto bg-slate-900 border-slate-700">
        <DialogHeader>
          <DialogTitle className="text-white">
            Execution History
            {taskName && <span className="text-slate-400 font-normal ml-2">— {taskName}</span>}
          </DialogTitle>
        </DialogHeader>

        {/* Loading State */}
        {loading && (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} className="h-20 bg-slate-800" />
            ))}
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4 flex gap-2">
            <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0" />
            <div>
              <p className="text-red-300 font-medium">Failed to load history</p>
              <p className="text-red-400/70 text-sm">{error.message}</p>
            </div>
          </div>
        )}

        {/* Content */}
        {data && (
          <div className="space-y-6">
            {/* Summary */}
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-slate-800/50 rounded-lg p-4">
                <p className="text-xs text-slate-400 mb-2">Status</p>
                <Badge className={cn("border", getStatusColor(data.status))}>
                  {data.status.charAt(0).toUpperCase() + data.status.slice(1)}
                </Badge>
              </div>
              <div className="bg-slate-800/50 rounded-lg p-4">
                <p className="text-xs text-slate-400 mb-2">Execution Attempts</p>
                <p className="text-xl font-bold text-white">{data.executionAttempts}</p>
              </div>
              {data.totalDuration && (
                <div className="bg-slate-800/50 rounded-lg p-4">
                  <p className="text-xs text-slate-400 mb-2">Total Duration</p>
                  <p className="text-lg font-bold text-blue-400">
                    {formatDuration(data.totalDuration / 1000)}
                  </p>
                </div>
              )}
              {data.failureReason && (
                <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4">
                  <p className="text-xs text-red-400 mb-2">Failure Reason</p>
                  <p className="text-sm text-red-300">{data.failureReason}</p>
                </div>
              )}
            </div>

            {/* Timeline */}
            <div className="space-y-4">
              <h4 className="text-sm font-semibold text-white">Event Timeline</h4>

              {data.events.length === 0 ? (
                <p className="text-slate-400 text-sm">No events recorded</p>
              ) : (
                <div className="space-y-3">
                  {data.events.map((event, index) => (
                    <div
                      key={index}
                      className={cn(
                        "border rounded-lg p-4 flex gap-4",
                        getEventColor(event.eventType)
                      )}
                    >
                      {/* Timeline Dot */}
                      <div className="flex flex-col items-center">
                        {getEventIcon(event.eventType)}
                        {index < data.events.length - 1 && (
                          <div className="w-0.5 h-8 bg-slate-700 mt-2" />
                        )}
                      </div>

                      {/* Event Details */}
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-2">
                          <h5 className="font-semibold text-white capitalize">
                            {event.eventType.replace(/_/g, " ")}
                          </h5>
                          <span className="text-xs text-slate-400">
                            {formatDate(new Date(event.timestamp))}
                          </span>
                        </div>

                        <p className="text-sm text-slate-300 mb-2">{event.message}</p>

                        {/* Event Metadata */}
                        <div className="grid grid-cols-2 gap-2 text-xs">
                          {event.attemptNumber && (
                            <div>
                              <span className="text-slate-400">Attempt:</span>
                              <span className="text-slate-200 ml-1">#{event.attemptNumber}</span>
                            </div>
                          )}
                          {event.duration && (
                            <div>
                              <span className="text-slate-400">Duration:</span>
                              <span className="text-slate-200 ml-1">
                                {formatDuration(event.duration / 1000)}
                              </span>
                            </div>
                          )}
                          {event.error && (
                            <div className="col-span-2">
                              <span className="text-red-400">Error:</span>
                              <span className="text-red-300 ml-1">{event.error}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Completion Data */}
            {data.completionData && (
              <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-4">
                <p className="text-sm font-semibold text-green-300 mb-2">Completion Data</p>
                <pre className="text-xs text-slate-300 overflow-x-auto max-h-40 bg-slate-900/50 rounded p-2">
                  {JSON.stringify(data.completionData, null, 2)}
                </pre>
              </div>
            )}
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
