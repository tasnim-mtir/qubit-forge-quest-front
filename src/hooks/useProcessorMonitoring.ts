import { useEffect, useState, useCallback, useRef } from "react";
import {
  processorAPI,
  ProcessorStatus,
  DetailedQueueResponse,
  ExecutionHistoryResponse,
} from "@/services/protocolAPI";
import { useToast } from "@/hooks/use-toast";

export interface UseProcessorMonitoringOptions {
  refreshInterval?: number; // milliseconds, default 5000
  enabled?: boolean;
}

export function useProcessorStatus(options: UseProcessorMonitoringOptions = {}) {
  const { refreshInterval = 5000, enabled = true } = options;
  const [data, setData] = useState<ProcessorStatus | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const abortControllerRef = useRef<AbortController | null>(null);

  const fetchStatus = useCallback(async () => {
    // Cancel previous request if still pending
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    abortControllerRef.current = new AbortController();

    try {
      setLoading(true);
      setError(null);
      const result = await processorAPI.getProcessorStatus();
      setData(result);
    } catch (err) {
      if (err instanceof Error && err.name !== "AbortError") {
        setError(err);
        console.error("Error fetching processor status:", err);
      }
    } finally {
      setLoading(false);
    }
  }, []);

  // Initial fetch
  useEffect(() => {
    if (enabled) {
      fetchStatus();
    }
  }, [enabled, fetchStatus]);

  // Auto-refresh
  useEffect(() => {
    if (!enabled) return;

    const interval = setInterval(fetchStatus, refreshInterval);

    return () => {
      clearInterval(interval);
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, [enabled, refreshInterval, fetchStatus]);

  const refetch = useCallback(() => {
    fetchStatus();
  }, [fetchStatus]);

  return { data, loading, error, refetch };
}

export function useDetailedQueue(options: UseProcessorMonitoringOptions = {}) {
  const { refreshInterval = 5000, enabled = true } = options;
  const [data, setData] = useState<DetailedQueueResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const abortControllerRef = useRef<AbortController | null>(null);

  const fetchQueue = useCallback(async () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    abortControllerRef.current = new AbortController();

    try {
      setLoading(true);
      setError(null);
      const result = await processorAPI.getDetailedQueue();
      setData(result);
    } catch (err) {
      if (err instanceof Error && err.name !== "AbortError") {
        setError(err);
        console.error("Error fetching queue:", err);
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (enabled) {
      fetchQueue();
    }
  }, [enabled, fetchQueue]);

  useEffect(() => {
    if (!enabled) return;

    const interval = setInterval(fetchQueue, refreshInterval);

    return () => {
      clearInterval(interval);
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, [enabled, refreshInterval, fetchQueue]);

  const refetch = useCallback(() => {
    fetchQueue();
  }, [fetchQueue]);

  return { data, loading, error, refetch };
}

export function useExecutionHistory(taskId: string | null) {
  const [data, setData] = useState<ExecutionHistoryResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const abortControllerRef = useRef<AbortController | null>(null);

  const fetchHistory = useCallback(
    async (id: string) => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }

      abortControllerRef.current = new AbortController();

      try {
        setLoading(true);
        setError(null);
        const result = await processorAPI.getExecutionHistory(id);
        setData(result);
      } catch (err) {
        if (err instanceof Error && err.name !== "AbortError") {
          setError(err);
          console.error("Error fetching execution history:", err);
        }
      } finally {
        setLoading(false);
      }
    },
    []
  );

  useEffect(() => {
    if (taskId) {
      fetchHistory(taskId);
    }
  }, [taskId, fetchHistory]);

  const refetch = useCallback(() => {
    if (taskId) {
      fetchHistory(taskId);
    }
  }, [taskId, fetchHistory]);

  return { data, loading, error, refetch };
}

// Hook for monitoring task notifications
export function useTaskNotifications(
  creatorId: string,
  options: UseProcessorMonitoringOptions = {}
) {
  const { refreshInterval = 5000, enabled = true } = options;
  const { toast } = useToast();
  const previousTasksRef = useRef<Map<string, string>>(new Map());

  const { data: tasksData } = useDetailedQueue(options);

  useEffect(() => {
    if (!enabled || !tasksData) return;

    // Check for status changes
    tasksData.tasks.forEach((task) => {
      const previousStatus = previousTasksRef.current.get(task._id);

      if (previousStatus && previousStatus !== task.queuePosition.toString()) {
        // Task status updated in queue
      }
    });

    // Store current state
    tasksData.tasks.forEach((task) => {
      previousTasksRef.current.set(task._id, task.queuePosition.toString());
    });
  }, [tasksData, enabled]);
}
