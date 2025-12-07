import { useState } from "react";
import { useCreateComputeTask } from "@/hooks/useProtocol";
import { Zap } from "lucide-react";

interface CreateComputeTaskFormProps {
  availableCC: number;
  onSuccess?: () => void;
}

export function CreateComputeTaskForm({
  availableCC,
  onSuccess,
}: CreateComputeTaskFormProps) {
  const [taskName, setTaskName] = useState("");
  const [taskDescription, setTaskDescription] = useState("");
  const [costCC, setCostCC] = useState(50);
  const [priority, setPriority] = useState<"Low" | "Medium" | "High">("Medium");
  const [taskType, setTaskType] = useState<"DataAnalysis" | "Training" | "Processing" | "General" | "Other">("General");
  const [estimatedDuration, setEstimatedDuration] = useState(3600);
  const [isOpen, setIsOpen] = useState(false);

  const createTaskMutation = useCreateComputeTask();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!taskName.trim()) {
      return;
    }

    if (costCC > availableCC) {
      return;
    }

    try {
      await createTaskMutation.mutateAsync({
        taskName: taskName.trim(),
        taskDescription: taskDescription.trim(),
        computeCostCC: costCC,
        priority,
        taskType,
        estimatedDuration,
      });

      setTaskName("");
      setTaskDescription("");
      setCostCC(50);
      setPriority("Medium");
      setTaskType("General");
      setEstimatedDuration(3600);
      setIsOpen(false);
      onSuccess?.();
    } catch (error) {
      console.error("Error creating task:", error);
    }
  };

  const hasError = costCC > availableCC;
  const durationMinutes = estimatedDuration / 60;
  const durationHours = estimatedDuration / 3600;

  return (
    <>
      {/* Button to open form */}
      <button
        onClick={() => setIsOpen(true)}
        className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-500 hover:to-blue-600 text-white font-semibold rounded-lg transition-all border border-blue-400/30"
      >
        <Zap className="w-5 h-5" />
        Create New Task
      </button>

      {/* Modal */}
      {isOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-slate-900 border border-blue-500/30 rounded-lg p-8 max-w-2xl w-full mx-4 shadow-2xl max-h-[90vh] overflow-y-auto">
            <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
              <Zap className="w-6 h-6 text-blue-400" />
              Create Compute Task
            </h2>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Task Name */}
              <div>
                <label className="block text-sm font-medium text-slate-400 mb-2">
                  Task Name <span className="text-red-400">*</span>
                </label>
                <input
                  type="text"
                  value={taskName}
                  onChange={(e) => setTaskName(e.target.value)}
                  placeholder="e.g., Data Analysis Task"
                  maxLength={100}
                  className="w-full px-4 py-2 bg-slate-800/50 border border-blue-500/30 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/50 transition-all"
                />
                <p className="text-xs text-slate-500 mt-1">{taskName.length}/100</p>
              </div>

              {/* Task Description */}
              <div>
                <label className="block text-sm font-medium text-slate-400 mb-2">
                  Description
                </label>
                <textarea
                  value={taskDescription}
                  onChange={(e) => setTaskDescription(e.target.value)}
                  placeholder="Describe what your task does..."
                  maxLength={500}
                  rows={3}
                  className="w-full px-4 py-2 bg-slate-800/50 border border-blue-500/30 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/50 transition-all resize-none"
                />
                <p className="text-xs text-slate-500 mt-1">{taskDescription.length}/500</p>
              </div>

              {/* Two Column Layout */}
              <div className="grid grid-cols-2 gap-4">
                {/* Priority */}
                <div>
                  <label className="block text-sm font-medium text-slate-400 mb-2">
                    Priority
                  </label>
                  <select
                    value={priority}
                    onChange={(e) => setPriority(e.target.value as "Low" | "Medium" | "High")}
                    className="w-full px-4 py-2 bg-slate-800/50 border border-blue-500/30 rounded-lg text-white focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/50 transition-all"
                  >
                    <option value="Low">Low</option>
                    <option value="Medium">Medium</option>
                    <option value="High">High</option>
                  </select>
                </div>

                {/* Task Type */}
                <div>
                  <label className="block text-sm font-medium text-slate-400 mb-2">
                    Task Type
                  </label>
                  <select
                    value={taskType}
                    onChange={(e) => setTaskType(e.target.value as "DataAnalysis" | "Training" | "Processing" | "General" | "Other")}
                    className="w-full px-4 py-2 bg-slate-800/50 border border-blue-500/30 rounded-lg text-white focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/50 transition-all"
                  >
                    <option value="General">General</option>
                    <option value="DataAnalysis">Data Analysis</option>
                    <option value="Training">Training</option>
                    <option value="Processing">Processing</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
              </div>

              {/* Estimated Duration */}
              <div>
                <label className="block text-sm font-medium text-slate-400 mb-2">
                  Estimated Duration
                </label>
                <div className="space-y-2">
                  <input
                    type="range"
                    min="300"
                    max="86400"
                    step="60"
                    value={estimatedDuration}
                    onChange={(e) => setEstimatedDuration(Number(e.target.value))}
                    className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-blue-500"
                  />
                  <div className="flex justify-between text-xs text-slate-500">
                    <span>5 min</span>
                    <span>
                      {durationHours >= 1
                        ? `${durationHours.toFixed(1)} hours`
                        : `${durationMinutes.toFixed(0)} minutes`}
                    </span>
                    <span>24 hours</span>
                  </div>
                </div>
              </div>

              {/* CC Cost Slider */}
              <div>
                <label className="block text-sm font-medium text-slate-400 mb-2">
                  Compute Cost (CC) <span className="text-red-400">*</span>
                </label>
                <div className="flex items-center gap-4">
                  <input
                    type="range"
                    min="10"
                    max={availableCC}
                    step="10"
                    value={costCC}
                    onChange={(e) => setCostCC(Number(e.target.value))}
                    className="flex-1 h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-blue-500"
                  />
                  <span className="text-lg font-bold text-blue-300 w-16 text-right">
                    {costCC} CC
                  </span>
                </div>
                <p className="text-xs text-slate-500 mt-2">
                  Min: 10 CC | Max: {availableCC.toLocaleString()} CC
                </p>
              </div>

              {/* Cost Display */}
              <div className="bg-slate-800/50 border border-blue-500/20 rounded-lg p-4 space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-slate-400">CC Cost:</span>
                  <span className="text-white font-semibold">{costCC} CC</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-400">Available CC:</span>
                  <span className={`font-semibold ${hasError ? "text-red-400" : "text-emerald-400"}`}>
                    {availableCC.toLocaleString()} CC
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-400">Est. Duration:</span>
                  <span className="text-white font-semibold">
                    {durationHours >= 1
                      ? `${durationHours.toFixed(1)} hrs`
                      : `${durationMinutes.toFixed(0)} min`}
                  </span>
                </div>
                {hasError && (
                  <div className="flex items-start gap-2 pt-2 border-t border-red-500/20">
                    <span className="text-red-400 text-sm">⚠️</span>
                    <span className="text-red-400 text-sm">
                      Insufficient CC. You need {costCC - availableCC} more CC.
                    </span>
                  </div>
                )}
              </div>

              {/* Buttons */}
              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  className="flex-1 px-4 py-2 bg-slate-800/50 hover:bg-slate-700/50 border border-slate-600/50 text-slate-300 font-medium rounded-lg transition-all"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={hasError || !taskName.trim() || createTaskMutation.isPending}
                  className="flex-1 px-4 py-2 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-500 hover:to-blue-600 disabled:from-slate-600 disabled:to-slate-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-medium rounded-lg transition-all"
                >
                  {createTaskMutation.isPending ? "Creating..." : "Create Task"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
