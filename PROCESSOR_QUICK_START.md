# ⚡ Quick Start - Processor Monitoring System

## 1️⃣ Add Route to Your App

Update `src/App.tsx` or your routing configuration:

```typescript
import { BrowserRouter, Routes, Route } from "react-router-dom";
import UpdatedCreatorDashboard from "@/pages/UpdatedCreatorDashboard";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* ... other routes ... */}
        <Route path="/creator" element={<UpdatedCreatorDashboard />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
```

## 2️⃣ Verify Backend Endpoints

Your backend must have these endpoints:

```
GET  /api/protocol/processor/status
GET  /api/protocol/processor/detailed-queue
GET  /api/protocol/processor/execution-history/:taskId
```

Each should return the responses documented in `PROCESSOR_MONITORING_GUIDE.md`.

## 3️⃣ Import & Use Components

### Simple: Just add ProcessorStatusWidget

```typescript
import { ProcessorStatusWidget } from "@/components/processor/ProcessorStatusWidget";

// In any component
<ProcessorStatusWidget refreshInterval={5000} />
```

### Complete: Full Dashboard

```typescript
import { UpdatedCreatorDashboard } from "@/pages/UpdatedCreatorDashboard";

// Already includes everything:
// - ProcessorStatusWidget
// - LiveTaskStatusTable
// - QueuePositionIndicator
// - ExecutionHistoryModal
```

## 4️⃣ Use Hooks Directly

```typescript
import { useProcessorStatus, useDetailedQueue } from "@/hooks/useProcessorMonitoring";

function MyComponent() {
  const { data: processor, loading } = useProcessorStatus({ refreshInterval: 5000 });
  const { data: queue } = useDetailedQueue({ refreshInterval: 5000 });

  return (
    <div>
      <p>Processor: {processor?.processor?.isRunning ? "Running" : "Offline"}</p>
      <p>Queued: {processor?.queue?.queuedCount}</p>
    </div>
  );
}
```

## 5️⃣ Test It

1. Navigate to `/creator`
2. You should see:
   - ✅ Processor Status Widget at top
   - ✅ Live Task Table with your tasks
   - ✅ Queue Position Indicator (if tasks are queued)
   - ✅ Auto-refresh every 5 seconds

## 6️⃣ Customize Colors (Optional)

Edit component files to change colors:

**Yellow (Queued):** `from-yellow-500` → `from-purple-500`
**Blue (Running):** `from-blue-500` → `from-cyan-500`
**Green (Completed):** `from-green-500` → `from-emerald-500`
**Red (Failed):** `from-red-500` → `from-pink-500`

## 7️⃣ Troubleshoot

**Components don't update?**
```typescript
// Check token is being sent
console.log("Token:", localStorage.getItem("token"));

// Check API is reachable
fetch("http://localhost:3000/api/protocol/processor/status", {
  headers: { Authorization: `Bearer ${token}` }
})
```

**Modal doesn't show?**
```typescript
// Verify backend returns data
curl -H "Authorization: Bearer YOUR_TOKEN" \
  http://localhost:3000/api/protocol/processor/execution-history/task-id
```

**Styles not applied?**
```
✓ Tailwind CSS configured in tailwind.config.ts
✓ CSS file imported in src/main.tsx
✓ Using correct className names
```

## 📦 What's Included

```
src/
├── hooks/
│   └── useProcessorMonitoring.ts      (3 hooks: status, queue, history)
├── components/processor/
│   ├── ProcessorStatusWidget.tsx      (Health monitor)
│   ├── LiveTaskStatusTable.tsx        (Task table)
│   ├── QueuePositionIndicator.tsx     (Queue positions)
│   └── ExecutionHistoryModal.tsx      (Timeline modal)
├── pages/
│   └── UpdatedCreatorDashboard.tsx    (Integrated page)
├── services/
│   └── protocolAPI.ts                 (+ processorAPI module)
└── guides/
    └── PROCESSOR_MONITORING_GUIDE.md  (Full documentation)
```

## 🎯 Key Features

- ✅ **Auto-refresh every 5 seconds** with AbortController
- ✅ **Real-time status updates** for all tasks
- ✅ **Queue position tracking** for queued tasks
- ✅ **Execution timeline** with detailed events
- ✅ **Error handling** for failed tasks
- ✅ **Mobile responsive** design
- ✅ **Loading & error states** handled
- ✅ **No manual status changes** (backend-driven)

## 🚀 Next Steps

1. **Test with real backend** - Run your processor service
2. **Add notifications** - Use Toast for status changes
3. **Add task creation** - Implement CreateComputeTaskForm
4. **Add charts** - Show performance over time
5. **Add filters** - Filter by status, creator, date range

## 📞 Support

For issues or questions, check:
- `PROCESSOR_MONITORING_GUIDE.md` - Full documentation
- `src/components/processor/` - Component source code
- `src/hooks/useProcessorMonitoring.ts` - Hook implementations
- `src/services/protocolAPI.ts` - API integration

---

**Ready to monitor your compute tasks in real-time! 🎉**
