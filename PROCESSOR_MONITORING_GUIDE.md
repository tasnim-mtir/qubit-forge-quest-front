# 🚀 Processor Monitoring System - Integration Guide

## Overview

This document provides complete integration instructions for the **Real-Time Task Processor Monitoring System** for your Qubitium Protocol frontend.

## Components Created

### 1. **API Service Layer** (`src/services/protocolAPI.ts`)

**New Types & Interfaces:**
- `ProcessorStatus` - Processor health, queue counts, stats
- `QueuedTask` - Task in queue with position and ETA
- `DetailedQueueResponse` - Full queue state with all tasks
- `ExecutionEvent` - Timeline event (STARTED, COMPLETED, FAILED, etc.)
- `ExecutionHistoryResponse` - Complete execution history for a task

**New API Module:**
```typescript
export const processorAPI = {
  getProcessorStatus(): Promise<ProcessorStatus>
  getDetailedQueue(): Promise<DetailedQueueResponse>
  getExecutionHistory(taskId: string): Promise<ExecutionHistoryResponse>
}
```

---

### 2. **Custom Hooks** (`src/hooks/useProcessorMonitoring.ts`)

#### `useProcessorStatus(options?)`
Auto-fetches and refreshes processor health every 5 seconds.

```typescript
const { data, loading, error, refetch } = useProcessorStatus({
  refreshInterval: 5000,  // milliseconds
  enabled: true           // enable/disable auto-refresh
});
```

**Returns:**
- `data: ProcessorStatus` - Processor health info
- `loading: boolean` - Fetch in progress
- `error: Error | null` - Any error
- `refetch: () => void` - Manual refresh

#### `useDetailedQueue(options?)`
Auto-fetches queue with all queued tasks every 5 seconds.

```typescript
const { data, loading, error, refetch } = useDetailedQueue({
  refreshInterval: 5000,
  enabled: true
});
```

**Returns:**
- `data: DetailedQueueResponse` - Queue state with all tasks
- `loading: boolean` - Fetch in progress
- `error: Error | null` - Any error
- `refetch: () => void` - Manual refresh

#### `useExecutionHistory(taskId: string | null)`
Fetches execution timeline for a specific task.

```typescript
const { data, loading, error, refetch } = useExecutionHistory(taskId);
```

**Returns:**
- `data: ExecutionHistoryResponse` - Full execution history
- `loading: boolean` - Fetch in progress
- `error: Error | null` - Any error
- `refetch: () => void` - Manual refresh

---

### 3. **UI Components**

#### **ProcessorStatusWidget**
Displays processor health and queue statistics.

```typescript
import { ProcessorStatusWidget } from "@/components/processor/ProcessorStatusWidget";

<ProcessorStatusWidget
  refreshInterval={5000}
  className="mb-8"
/>
```

**Shows:**
- ✓/✗ Processor running status
- 🔋 Processor health
- ▶️ Running task count
- ⏳ Queued task count
- ✓ Completed task count
- ✗ Failed task count
- Success rate %
- Avg processing time
- Execution engine info

#### **LiveTaskStatusTable**
Real-time updating table of all tasks with status badges.

```typescript
import { LiveTaskStatusTable } from "@/components/processor/LiveTaskStatusTable";

<LiveTaskStatusTable
  tasks={tasks}
  loading={loading}
  onViewHistory={(taskId) => showModal(taskId)}
  onRetryTask={(taskId) => retryTask(taskId)}
  isAutoRefreshing={true}
/>
```

**Columns:**
- Task Name
- Status badge (queued/running/completed/failed)
- Cost (CC)
- Created timestamp
- Runtime (for running tasks)
- Actions (View History, Retry)

**Features:**
- Color-coded status badges
- Auto-updates every 5 seconds
- Hover actions
- Loading state

#### **QueuePositionIndicator**
Shows creator's tasks in queue with position and ETA.

```typescript
import { QueuePositionIndicator } from "@/components/processor/QueuePositionIndicator";

<QueuePositionIndicator
  queuedTasks={creatorQueuedTasks}
  totalQueueLength={queueData.queueLength}
  avgWaitTime={queueData.avgWaitTime}
/>
```

**Shows:**
- #1, #5, #12 - Queue position for each task
- Estimated wait time per task
- Global queue length
- Progress bar showing position in queue
- Task cost and creation time

#### **ExecutionHistoryModal**
Modal showing detailed execution timeline.

```typescript
import { ExecutionHistoryModal } from "@/components/processor/ExecutionHistoryModal";

<ExecutionHistoryModal
  taskId={selectedTaskId}
  taskName="My Task"
  isOpen={isOpen}
  onClose={() => setIsOpen(false)}
/>
```

**Shows:**
- Timeline of events (QUEUED, STARTED, PROCESSING, RECOVERED, COMPLETED, FAILED)
- Execution attempts count
- Total duration
- Failure reason (if failed)
- Error messages
- Completion data (JSON)
- Event timestamps and metadata

---

## 🎯 Integration into Creator Dashboard

### Updated Page Component

```typescript
// src/pages/UpdatedCreatorDashboard.tsx

import { useProcessorStatus, useDetailedQueue } from "@/hooks/useProcessorMonitoring";
import { ProcessorStatusWidget } from "@/components/processor/ProcessorStatusWidget";
import { LiveTaskStatusTable } from "@/components/processor/LiveTaskStatusTable";
import { QueuePositionIndicator } from "@/components/processor/QueuePositionIndicator";
import { ExecutionHistoryModal } from "@/components/processor/ExecutionHistoryModal";

export default function UpdatedCreatorDashboard() {
  const [selectedTaskId, setSelectedTaskId] = useState<string | null>(null);
  const [showHistoryModal, setShowHistoryModal] = useState(false);

  // Auto-refresh processor status every 5 seconds
  const { data: processorData } = useProcessorStatus({ refreshInterval: 5000 });

  // Auto-refresh queue every 5 seconds
  const { data: queueData } = useDetailedQueue({ refreshInterval: 5000 });

  // Fetch creator's tasks
  const { data: tasksData } = useGetMyTasks(1, 50);

  // Get only creator's queued tasks
  const creatorQueuedTasks = queueData?.tasks.filter(
    (task) => task.creatorId === user?.id
  ) || [];

  return (
    <div>
      {/* Processor Monitor Widget */}
      <ProcessorStatusWidget />

      {/* Live Task Table */}
      <LiveTaskStatusTable
        tasks={tasksData?.tasks || []}
        onViewHistory={setSelectedTaskId}
      />

      {/* Queue Position Indicator */}
      {creatorQueuedTasks.length > 0 && (
        <QueuePositionIndicator
          queuedTasks={creatorQueuedTasks}
          totalQueueLength={queueData?.queueLength || 0}
          avgWaitTime={queueData?.avgWaitTime || 0}
        />
      )}

      {/* Execution History Modal */}
      <ExecutionHistoryModal
        taskId={selectedTaskId}
        isOpen={showHistoryModal}
        onClose={() => setShowHistoryModal(false)}
      />
    </div>
  );
}
```

---

## 🔄 Auto-Refresh Implementation

All components use **AbortController** to prevent duplicate requests:

```typescript
// Inside useProcessorStatus hook
const abortControllerRef = useRef<AbortController | null>(null);

const fetchStatus = useCallback(async () => {
  // Cancel any previous request
  if (abortControllerRef.current) {
    abortControllerRef.current.abort();
  }

  abortControllerRef.current = new AbortController();

  try {
    const result = await processorAPI.getProcessorStatus();
    setData(result);
  } catch (err) {
    if (err instanceof Error && err.name !== "AbortError") {
      // Only handle non-abort errors
      setError(err);
    }
  }
}, []);

// Setup auto-refresh interval
useEffect(() => {
  if (!enabled) return;

  const interval = setInterval(fetchStatus, refreshInterval);

  return () => {
    clearInterval(interval);
    abortControllerRef.current?.abort();
  };
}, [enabled, refreshInterval, fetchStatus]);
```

---

## 📊 Color Scheme

**Status Badges:**
- 🟡 `queued` - Yellow (amber-500)
- 🔵 `running` - Blue
- 🟢 `completed` - Green
- 🔴 `failed` - Red

**Event Timeline:**
- 🔵 STARTED - Blue
- 🔵 PROCESSING - Blue
- 🟡 RECOVERED - Yellow
- 🟢 COMPLETED - Green
- 🔴 FAILED - Red
- 🟡 QUEUED - Yellow

---

## 🪝 Using the Hooks

### Example: Create a Custom Monitor Component

```typescript
import { useProcessorStatus } from "@/hooks/useProcessorMonitoring";

function CustomMonitor() {
  const { data, loading, error, refetch } = useProcessorStatus({
    refreshInterval: 5000,
    enabled: true
  });

  if (error) return <div>Error: {error.message}</div>;
  if (loading) return <div>Loading...</div>;

  return (
    <div>
      <p>Processor Running: {data?.processor.isRunning ? "Yes" : "No"}</p>
      <p>Queued: {data?.queue.queuedCount}</p>
      <p>Running: {data?.queue.runningCount}</p>
      <button onClick={refetch}>Refresh Now</button>
    </div>
  );
}
```

### Example: Real-Time Notifications

```typescript
import { useDetailedQueue } from "@/hooks/useProcessorMonitoring";
import { useToast } from "@/hooks/use-toast";

function TaskNotifier() {
  const { toast } = useToast();
  const { data: queueData } = useDetailedQueue();
  const previousTasksRef = useRef(new Map());

  useEffect(() => {
    if (!queueData) return;

    queueData.tasks.forEach((task) => {
      const prevStatus = previousTasksRef.current.get(task._id);
      
      if (prevStatus && prevStatus !== task.queuePosition) {
        // Position changed
        toast({
          title: "Queue Position Updated",
          description: `Task moved to position #${task.queuePosition}`,
        });
      }
    });

    // Store current state
    queueData.tasks.forEach((task) => {
      previousTasksRef.current.set(task._id, task.queuePosition);
    });
  }, [queueData, toast]);

  return null;
}
```

---

## 🛠️ API Endpoints Expected from Backend

### GET `/api/protocol/processor/status`
Returns current processor health and queue statistics.

**Response:**
```json
{
  "success": true,
  "processor": {
    "isRunning": true,
    "isHealthy": true,
    "uptime": 3600000,
    "interval": 5000
  },
  "queue": {
    "queuedCount": 5,
    "runningCount": 1,
    "completedCount": 42,
    "failedCount": 2
  },
  "stats": {
    "totalProcessed": 45,
    "totalFailed": 2,
    "successRate": 0.9556,
    "avgProcessingTime": 2500
  },
  "nextTaskETA": 15000
}
```

### GET `/api/protocol/processor/detailed-queue`
Returns all queued tasks with position and ETA.

**Response:**
```json
{
  "success": true,
  "queueLength": 12,
  "tasks": [
    {
      "_id": "task-123",
      "taskName": "ML Training",
      "creatorId": "creator-456",
      "computeCostCC": 500,
      "createdAt": "2024-12-06T10:30:00Z",
      "queuePosition": 1,
      "estimatedWaitTime": 5000
    }
  ],
  "totalQueued": 12,
  "avgWaitTime": 8500
}
```

### GET `/api/protocol/processor/execution-history/:taskId`
Returns detailed execution timeline for a task.

**Response:**
```json
{
  "success": true,
  "taskId": "task-123",
  "taskName": "ML Training",
  "events": [
    {
      "timestamp": "2024-12-06T10:30:00Z",
      "eventType": "QUEUED",
      "message": "Task queued for processing",
      "attemptNumber": 1
    },
    {
      "timestamp": "2024-12-06T10:35:00Z",
      "eventType": "STARTED",
      "message": "Task started on processor node-1",
      "attemptNumber": 1
    },
    {
      "timestamp": "2024-12-06T10:40:00Z",
      "eventType": "COMPLETED",
      "message": "Task completed successfully",
      "duration": 300000
    }
  ],
  "executionAttempts": 1,
  "totalDuration": 600000,
  "status": "completed",
  "completionData": { "result": "..." }
}
```

---

## ✅ Integration Checklist

- [ ] Update routing to include `UpdatedCreatorDashboard` page
- [ ] Verify backend endpoints are implemented:
  - [ ] `GET /api/protocol/processor/status`
  - [ ] `GET /api/protocol/processor/detailed-queue`
  - [ ] `GET /api/protocol/processor/execution-history/:taskId`
- [ ] Test auto-refresh every 5 seconds
- [ ] Test status badge colors match design
- [ ] Verify AbortController prevents duplicate requests
- [ ] Test modal opens with correct task data
- [ ] Test error states display properly
- [ ] Verify loading states show while fetching
- [ ] Test on mobile responsiveness
- [ ] Verify timestamps format correctly
- [ ] Test zero-state (no tasks) displays properly

---

## 📱 Mobile Responsiveness

All components use Tailwind's responsive breakpoints:

```
sm: 640px   - Single column on phone
md: 768px   - 2 columns
lg: 1024px  - 3 columns (full layout)
```

The dashboard automatically stacks on mobile and expands on desktop.

---

## 🎨 Customization

### Change Refresh Interval

```typescript
// 10 seconds instead of 5
<ProcessorStatusWidget refreshInterval={10000} />

// Or in hook
const { data } = useProcessorStatus({ refreshInterval: 10000 });
```

### Change Colors

Edit `getStatusColor()` functions in components:

```typescript
const getStatusColor = (status: string) => {
  switch (status) {
    case "queued":
      return "bg-purple-500/20 text-purple-300"; // Changed from yellow
    // ...
  }
};
```

### Add Custom Notifications

```typescript
import { useDetailedQueue } from "@/hooks/useProcessorMonitoring";
import { useToast } from "@/hooks/use-toast";

export function TaskCompletionNotifier() {
  const { toast } = useToast();
  const { data: queueData } = useDetailedQueue();
  
  // Add your notification logic here
}
```

---

## 🚀 Performance Considerations

1. **AbortController** - Prevents duplicate requests
2. **Ref-based state tracking** - Reduces re-renders
3. **Conditional rendering** - Only shows components with data
4. **Memoization** - useCallback for stable references
5. **Lazy loading** - Modal only fetches when opened

---

## 📚 File Structure

```
src/
├── hooks/
│   └── useProcessorMonitoring.ts      # Auto-refresh hooks
├── components/
│   └── processor/
│       ├── ProcessorStatusWidget.tsx   # Processor health
│       ├── LiveTaskStatusTable.tsx     # Task table
│       ├── QueuePositionIndicator.tsx  # Queue positions
│       └── ExecutionHistoryModal.tsx   # Timeline modal
├── pages/
│   └── UpdatedCreatorDashboard.tsx     # Integrated page
├── services/
│   └── protocolAPI.ts                  # API endpoints
└── lib/
    ├── formatters.ts                   # Date/number formatting
    └── utils.ts                        # Tailwind cn() utility
```

---

## 🐛 Troubleshooting

**Issue: Tasks not updating**
- Check browser console for errors
- Verify backend endpoints are running
- Check Authorization header has valid token

**Issue: Duplicate requests**
- AbortController should prevent this
- Check network tab in DevTools
- Verify hooks are not called multiple times

**Issue: Modal not showing data**
- Verify taskId is passed correctly
- Check ExecutionHistoryResponse in API
- Verify backend execution-history endpoint

**Issue: Styles not applying**
- Verify Tailwind CSS is configured
- Check component imports
- Verify className strings are correct

---

## 🎓 Learning Resources

- **React Hooks:** https://react.dev/reference/react
- **AbortController:** https://developer.mozilla.org/en-US/docs/Web/API/AbortController
- **Tailwind CSS:** https://tailwindcss.com/docs
- **React Query:** https://tanstack.com/query/latest

---

Generated for Qubitium Protocol | Task Processor Monitoring System v1.0
