import { AlertCircle, Check, ChevronDown, History } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

interface ParameterHistoryItem {
  timestamp: string;
  admin: string;
  parameter: string;
  oldValue: string | number;
  newValue: string | number;
  reason: string;
}

export function ParameterAdjustment() {
  const { toast } = useToast();
  const [expandedSection, setExpandedSection] = useState<string | null>("cc-rate");
  const [showHistory, setShowHistory] = useState(false);

  // Current parameters
  const [parameters, setParameters] = useState({
    ccToQxRate: 100,
    rewardPercentage: 5.5,
    minTaskCost: 10,
    maxTaskCost: 1000,
    defaultTaskTimeout: 3600,
    minLeaseDuration: 7,
    maxLeaseDuration: 365,
    minComputeAmount: 100,
    leaseRenewalIncentive: 3,
  });

  const [tempParameters, setTempParameters] = useState({ ...parameters });
  const [pendingChanges, setPendingChanges] = useState<string[]>([]);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [confirmingParameter, setConfirmingParameter] = useState<string | null>(null);
  const [changeReason, setChangeReason] = useState("");

  // Mock parameter history
  const parameterHistory: ParameterHistoryItem[] = [
    {
      timestamp: "2024-12-05 14:30",
      admin: "admin@example.com",
      parameter: "CC to QX Rate",
      oldValue: 95,
      newValue: 100,
      reason: "Adjust for market dynamics",
    },
    {
      timestamp: "2024-12-03 10:15",
      admin: "admin@example.com",
      parameter: "Reward Percentage",
      oldValue: 5.0,
      newValue: 5.5,
      reason: "Increase staker incentives",
    },
    {
      timestamp: "2024-11-28 16:45",
      admin: "admin@example.com",
      parameter: "Max Task Cost",
      oldValue: 800,
      newValue: 1000,
      reason: "Allow larger compute tasks",
    },
  ];

  const handleParameterChange = (key: string, value: number | string) => {
    setTempParameters({
      ...tempParameters,
      [key]: value,
    });

    if (!pendingChanges.includes(key)) {
      setPendingChanges([...pendingChanges, key]);
    }
  };

  const handleApplyChanges = (parameter: string) => {
    setConfirmingParameter(parameter);
    setShowConfirmDialog(true);
  };

  const confirmApplyChange = () => {
    if (!confirmingParameter || !changeReason.trim()) {
      toast({
        title: "Please provide a reason",
        description: "A reason is required before applying parameter changes",
        variant: "destructive",
      });
      return;
    }

    // Apply the change
    setParameters({
      ...tempParameters,
    });

    toast({
      title: "Parameter updated successfully",
      description: `${confirmingParameter} has been updated and will take effect immediately.`,
    });

    // Reset
    setShowConfirmDialog(false);
    setConfirmingParameter(null);
    setChangeReason("");
    setPendingChanges(pendingChanges.filter((p) => p !== confirmingParameter));
  };

  const resetChanges = () => {
    setTempParameters({ ...parameters });
    setPendingChanges([]);
  };

  const SectionHeader = ({
    title,
    section,
    description,
  }: {
    title: string;
    section: string;
    description: string;
  }) => (
    <button
      onClick={() => setExpandedSection(expandedSection === section ? null : section)}
      className="w-full flex items-center justify-between p-5 hover:bg-purple-500/5 transition-all rounded-lg border border-purple-500/20 hover:border-purple-500/40 mb-4 bg-gradient-to-r from-purple-500/5 to-transparent"
    >
      <div className="text-left">
        <h3 className="font-semibold text-slate-100">{title}</h3>
        <p className="text-sm text-slate-400 mt-2">{description}</p>
      </div>
      <ChevronDown
        className={`w-5 h-5 text-slate-400 transition-transform ${
          expandedSection === section ? "rotate-180" : ""
        }`}
      />
    </button>
  );

  const ParameterField = ({
    label,
    key,
    value,
    type = "number",
    unit = "",
    hint = "",
  }: {
    label: string;
    key: string;
    value: number | string;
    type?: string;
    unit?: string;
    hint?: string;
  }) => {
    const isDifferent = parameters[key as keyof typeof parameters] !== tempParameters[key as keyof typeof tempParameters];

    return (
      <div className={`space-y-2 p-5 rounded-lg border transition-all ${isDifferent ? "border-purple-500/50 bg-purple-500/10" : "border-slate-700/50 bg-slate-900/30"}`}>
        <div className="flex justify-between items-start">
          <label className="text-sm font-semibold text-slate-200">{label}</label>
          {isDifferent && <span className="text-xs bg-purple-500/30 text-purple-200 px-2 py-1 rounded-full font-medium">Modified</span>}
        </div>
        <input
          type={type}
          value={tempParameters[key as keyof typeof tempParameters]}
          onChange={(e) => handleParameterChange(key, type === "number" ? Number(e.target.value) : e.target.value)}
          className="w-full bg-slate-900/70 border border-slate-600/50 rounded-lg px-3 py-2.5 text-slate-200 focus:border-purple-500 focus:ring-1 focus:ring-purple-500/20 focus:outline-none transition-all"
        />
        <div className="flex justify-between items-center">
          <p className="text-xs text-slate-500">{hint}</p>
          {unit && <span className="text-xs text-slate-400 font-medium">{unit}</span>}
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Alert */}
      <div className="bg-gradient-to-r from-purple-500/10 to-purple-600/5 border border-purple-500/20 rounded-lg p-4 flex gap-3 backdrop-blur-sm">
        <AlertCircle className="w-5 h-5 text-purple-400 flex-shrink-0 mt-0.5" />
        <div>
          <p className="text-sm text-purple-300 font-semibold">Protocol Parameters Control</p>
          <p className="text-xs text-slate-400 mt-1">
            Changes to parameters affect all future transactions. Modified values are highlighted in purple. Provide a reason for audit trail.
          </p>
        </div>
      </div>

      {/* CC to QX Rate */}
      <div>
        <SectionHeader
          title="CC to QX Conversion Rate"
          section="cc-rate"
          description="Controls how many Compute Credits are awarded per staked QX token"
        />
        {expandedSection === "cc-rate" && (
          <div className="space-y-4 p-5 bg-gradient-to-br from-purple-500/5 to-transparent rounded-lg border border-purple-500/10">
            <ParameterField
              label="Current Conversion Rate"
              key="ccToQxRate"
              value={tempParameters.ccToQxRate}
              unit="CC per QX"
              hint="Current: 1 QX = 100 CC"
            />
            <div className="bg-slate-800/30 rounded p-3 border border-slate-700 text-sm space-y-2">
              <p className="text-slate-400">
                <span className="font-semibold text-slate-300">Impact Preview:</span>
              </p>
              <ul className="text-xs text-slate-500 space-y-1 ml-2">
                <li>• New staker with 10 QX will receive {(10 * (tempParameters.ccToQxRate as number)).toLocaleString()} CC</li>
                <li>• Previous staker rate remains unchanged (retroactivity)</li>
                <li>• Effective immediately upon confirmation</li>
              </ul>
            </div>
            <Button
              onClick={() => handleApplyChanges("CC to QX Rate")}
              className="w-full bg-blue-600/20 hover:bg-blue-600/40 border border-blue-500/30 text-blue-300"
            >
              Apply Change
            </Button>
          </div>
        )}
      </div>

      {/* Reward Rate */}
      <div>
        <SectionHeader
          title="Reward Rate"
          section="reward-rate"
          description="Percentage rewards earned per epoch on staked amounts"
        />
        {expandedSection === "reward-rate" && (
          <div className="space-y-4 p-5 bg-gradient-to-br from-purple-500/5 to-transparent rounded-lg border border-purple-500/10">
            <ParameterField
              label="Annual Reward Percentage"
              key="rewardPercentage"
              value={tempParameters.rewardPercentage}
              type="number"
              unit="%"
              hint="Reward percentage per year"
            />
            <div className="bg-slate-800/30 rounded p-3 border border-slate-700 text-sm space-y-2">
              <p className="text-slate-400">
                <span className="font-semibold text-slate-300">Annual Rewards at Current Locked QX:</span>
              </p>
              <p className="text-blue-300 font-semibold">
                {((10000 * (tempParameters.rewardPercentage as number)) / 100).toLocaleString("en-US", { maximumFractionDigits: 0 })} CC/year
              </p>
            </div>
            <Button
              onClick={() => handleApplyChanges("Reward Rate")}
              className="w-full bg-blue-600/20 hover:bg-blue-600/40 border border-blue-500/30 text-blue-300"
            >
              Apply Change
            </Button>
          </div>
        )}
      </div>

      {/* Task Parameters */}
      <div>
        <SectionHeader
          title="Task Parameters"
          section="task-params"
          description="Configure compute task limits and constraints"
        />
        {expandedSection === "task-params" && (
          <div className="space-y-4 p-5 bg-gradient-to-br from-purple-500/5 to-transparent rounded-lg border border-purple-500/10">
            <ParameterField
              label="Minimum Task Cost"
              key="minTaskCost"
              value={tempParameters.minTaskCost}
              unit="CC"
              hint="Lowest CC cost allowed per task"
            />
            <ParameterField
              label="Maximum Task Cost"
              key="maxTaskCost"
              value={tempParameters.maxTaskCost}
              unit="CC"
              hint="Highest CC cost allowed per task"
            />
            <ParameterField
              label="Default Task Timeout"
              key="defaultTaskTimeout"
              value={tempParameters.defaultTaskTimeout}
              unit="seconds"
              hint="How long tasks wait before timeout"
            />
            <Button
              onClick={() => handleApplyChanges("Task Parameters")}
              className="w-full bg-blue-600/20 hover:bg-blue-600/40 border border-blue-500/30 text-blue-300"
            >
              Apply Changes
            </Button>
          </div>
        )}
      </div>

      {/* Lease Parameters */}
      <div>
        <SectionHeader
          title="Lease Parameters"
          section="lease-params"
          description="Configure compute lease terms and constraints"
        />
        {expandedSection === "lease-params" && (
          <div className="space-y-4 p-5 bg-gradient-to-br from-purple-500/5 to-transparent rounded-lg border border-purple-500/10">
            <ParameterField
              label="Minimum Lease Duration"
              key="minLeaseDuration"
              value={tempParameters.minLeaseDuration}
              unit="days"
              hint="Shortest lease period allowed"
            />
            <ParameterField
              label="Maximum Lease Duration"
              key="maxLeaseDuration"
              value={tempParameters.maxLeaseDuration}
              unit="days"
              hint="Longest lease period allowed"
            />
            <ParameterField
              label="Minimum Compute Amount"
              key="minComputeAmount"
              value={tempParameters.minComputeAmount}
              unit="units"
              hint="Minimum compute units per lease"
            />
            <ParameterField
              label="Lease Renewal Incentive"
              key="leaseRenewalIncentive"
              value={tempParameters.leaseRenewalIncentive}
              unit="%"
              hint="Discount for lease renewals"
            />
            <Button
              onClick={() => handleApplyChanges("Lease Parameters")}
              className="w-full bg-blue-600/20 hover:bg-blue-600/40 border border-blue-500/30 text-blue-300"
            >
              Apply Changes
            </Button>
          </div>
        )}
      </div>

      {/* Parameter History */}
      <div>
        <button
          onClick={() => setShowHistory(!showHistory)}
          className="w-full flex items-center justify-between p-4 hover:bg-slate-800/30 transition-colors rounded-lg border border-slate-700"
        >
          <div className="text-left flex items-center gap-2">
            <History className="w-5 h-5 text-slate-400" />
            <div>
              <h3 className="font-semibold text-white">Parameter Change History</h3>
              <p className="text-sm text-slate-400 mt-1">Audit log of all parameter modifications</p>
            </div>
          </div>
          <ChevronDown
            className={`w-5 h-5 text-slate-400 transition-transform ${showHistory ? "rotate-180" : ""}`}
          />
        </button>

        {showHistory && (
          <div className="p-4 bg-slate-800/20 rounded-lg border border-slate-700 space-y-3">
            {parameterHistory.map((item, idx) => (
              <div key={idx} className="flex items-start gap-3 p-3 bg-slate-900/50 rounded border border-slate-700">
                <div className="text-blue-400 mt-1">
                  <Check className="w-4 h-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-start gap-2">
                    <div>
                      <p className="text-sm font-semibold text-slate-300">{item.parameter}</p>
                      <p className="text-xs text-slate-500 mt-1">
                        {item.oldValue} → {item.newValue}
                      </p>
                    </div>
                    <span className="text-xs text-slate-500 flex-shrink-0">{item.timestamp}</span>
                  </div>
                  <p className="text-xs text-slate-400 mt-2">
                    <span className="text-slate-500">By:</span> {item.admin}
                  </p>
                  <p className="text-xs text-slate-400">
                    <span className="text-slate-500">Reason:</span> {item.reason}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Confirmation Dialog */}
      {showConfirmDialog && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm">
          <div className="bg-gradient-to-b from-slate-900 to-slate-950 border border-blue-500/20 rounded-lg max-w-md w-full mx-4 p-6 shadow-2xl space-y-4">
            <h3 className="text-lg font-bold text-white">Confirm Parameter Change</h3>
            <p className="text-sm text-slate-400">
              You're about to apply changes to <span className="text-blue-300">{confirmingParameter}</span>. This action is permanent and will affect
              the protocol immediately.
            </p>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Reason for change (required)</label>
              <textarea
                value={changeReason}
                onChange={(e) => setChangeReason(e.target.value)}
                placeholder="Explain why this parameter is being adjusted..."
                className="w-full bg-slate-900/50 border border-slate-600 rounded px-3 py-2 text-slate-200 focus:border-blue-500 focus:outline-none transition-colors text-sm h-24"
              />
            </div>

            <div className="flex gap-3">
              <Button
                onClick={() => {
                  setShowConfirmDialog(false);
                  setConfirmingParameter(null);
                  setChangeReason("");
                }}
                className="flex-1 bg-slate-700/20 hover:bg-slate-600/40 border border-slate-600 text-slate-300"
              >
                Cancel
              </Button>
              <Button
                onClick={confirmApplyChange}
                disabled={!changeReason.trim()}
                className="flex-1 bg-blue-600/20 hover:bg-blue-600/40 border border-blue-500/30 text-blue-300 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Apply Change
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Reset Button */}
      {pendingChanges.length > 0 && (
        <Button
          onClick={resetChanges}
          className="w-full bg-red-600/20 hover:bg-red-600/40 border border-red-500/30 text-red-300"
        >
          Reset All Changes ({pendingChanges.length})
        </Button>
      )}
    </div>
  );
}
