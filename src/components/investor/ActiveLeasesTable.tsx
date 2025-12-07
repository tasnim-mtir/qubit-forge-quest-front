import { ChevronDown } from "lucide-react";
import type { Lease } from "@/services/protocolAPI";
import { useState } from "react";

interface ActiveLeasesTableProps {
  leases: Lease[];
  isLoading: boolean;
}

export function ActiveLeasesTable({ leases, isLoading }: ActiveLeasesTableProps) {
  const [expandedLease, setExpandedLease] = useState<string | null>(null);
  const [sortConfig, setSortConfig] = useState<{
    key: keyof Lease;
    direction: "asc" | "desc";
  } | null>(null);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return (
          <span className="inline-flex items-center gap-1 px-3 py-1 bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 text-xs font-medium rounded-full">
            <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></span>
            Active
          </span>
        );
      case "expired":
        return (
          <span className="inline-flex items-center gap-1 px-3 py-1 bg-slate-500/20 border border-slate-500/30 text-slate-300 text-xs font-medium rounded-full">
            <span className="w-2 h-2 bg-slate-500 rounded-full"></span>
            Expired
          </span>
        );
      case "cancelled":
        return (
          <span className="inline-flex items-center gap-1 px-3 py-1 bg-red-500/20 border border-red-500/30 text-red-300 text-xs font-medium rounded-full">
            <span className="w-2 h-2 bg-red-500 rounded-full"></span>
            Cancelled
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

  const calculateEndDate = (createdAt: string, duration: number) => {
    const startDate = new Date(createdAt);
    const endDate = new Date(startDate.getTime() + duration * 24 * 60 * 60 * 1000);
    return endDate.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const handleSort = (key: keyof Lease) => {
    setSortConfig(
      sortConfig?.key === key && sortConfig?.direction === "asc"
        ? { key, direction: "desc" }
        : { key, direction: "asc" }
    );
  };

  const sortedLeases = [...leases].sort((a, b) => {
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

  const SortIcon = ({ column }: { column: keyof Lease }) => {
    if (sortConfig?.key !== column) {
      return <span className="text-slate-500">⇅</span>;
    }
    return <span className="text-blue-400">{sortConfig.direction === "asc" ? "↑" : "↓"}</span>;
  };

  return (
    <div className="bg-gradient-to-b from-slate-900/50 to-slate-950/50 border border-blue-500/20 rounded-lg overflow-hidden backdrop-blur-sm">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-slate-900/80 border-b border-blue-500/20">
            <tr>
              <th className="px-6 py-4 text-left">
                <button
                  onClick={() => handleSort("computeAmount")}
                  className="flex items-center gap-2 text-slate-300 hover:text-blue-300 transition-colors font-semibold text-sm"
                >
                  Compute Amount <SortIcon column="computeAmount" />
                </button>
              </th>
              <th className="px-6 py-4 text-left">
                <button
                  onClick={() => handleSort("costCC")}
                  className="flex items-center gap-2 text-slate-300 hover:text-blue-300 transition-colors font-semibold text-sm"
                >
                  Cost (CC) <SortIcon column="costCC" />
                </button>
              </th>
              <th className="px-6 py-4 text-left">
                <button
                  onClick={() => handleSort("duration")}
                  className="flex items-center gap-2 text-slate-300 hover:text-blue-300 transition-colors font-semibold text-sm"
                >
                  Duration <SortIcon column="duration" />
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
              <th className="px-6 py-4 text-left">End Date</th>
              <th className="px-6 py-4 text-center text-slate-300 font-semibold text-sm">
                Details
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-blue-500/10">
            {isLoading ? (
              <tr>
                <td colSpan={6} className="px-6 py-12 text-center">
                  <div className="flex items-center justify-center gap-2">
                    <svg className="w-5 h-5 animate-spin text-blue-400" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <span className="text-slate-400">Loading leases...</span>
                  </div>
                </td>
              </tr>
            ) : leases.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-6 py-12 text-center">
                  <p className="text-slate-400">No leases found. Browse the marketplace to create your first lease!</p>
                </td>
              </tr>
            ) : (
              sortedLeases.map((lease) => (
                <tbody key={lease._id}>
                  <tr className="hover:bg-slate-800/30 transition-colors group">
                    <td className="px-6 py-4">
                      <span className="text-blue-300 font-semibold">{lease.computeAmount.toLocaleString()}</span>
                      <p className="text-xs text-slate-500">units</p>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-emerald-300 font-semibold">{lease.costCC} CC</span>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-slate-200">{lease.duration} days</p>
                    </td>
                    <td className="px-6 py-4">{getStatusBadge(lease.status)}</td>
                    <td className="px-6 py-4">
                      <p className="text-slate-400 text-sm">
                        {calculateEndDate(lease.createdAt, lease.duration)}
                      </p>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <button
                        onClick={() =>
                          setExpandedLease(expandedLease === lease._id ? null : lease._id)
                        }
                        className="p-2 hover:bg-slate-700/50 rounded transition-all"
                      >
                        <ChevronDown
                          className={`w-5 h-5 text-slate-400 transition-transform ${
                            expandedLease === lease._id ? "rotate-180" : ""
                          }`}
                        />
                      </button>
                    </td>
                  </tr>

                  {/* Expanded Row */}
                  {expandedLease === lease._id && (
                    <tr className="bg-slate-800/20">
                      <td colSpan={6} className="px-6 py-6">
                        <div className="space-y-4">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                              <p className="text-slate-500 text-sm mb-1">Lease ID</p>
                              <p className="text-slate-200 font-mono text-sm break-all">
                                {lease._id}
                              </p>
                            </div>
                            <div>
                              <p className="text-slate-500 text-sm mb-1">Status</p>
                              <p className="text-slate-200">{getStatusBadge(lease.status)}</p>
                            </div>
                            <div>
                              <p className="text-slate-500 text-sm mb-1">Created</p>
                              <p className="text-slate-200">{formatDate(lease.createdAt)}</p>
                            </div>
                            <div>
                              <p className="text-slate-500 text-sm mb-1">End Date</p>
                              <p className="text-slate-200">
                                {calculateEndDate(lease.createdAt, lease.duration)}
                              </p>
                            </div>
                          </div>

                          {/* Action Buttons */}
                          <div className="flex gap-2 pt-4 border-t border-slate-700">
                            {lease.status === "active" && (
                              <>
                                <button className="px-4 py-2 bg-blue-600/20 hover:bg-blue-600/40 border border-blue-500/30 text-blue-300 rounded text-sm transition-all">
                                  Renew
                                </button>
                                <button className="px-4 py-2 bg-emerald-600/20 hover:bg-emerald-600/40 border border-emerald-500/30 text-emerald-300 rounded text-sm transition-all">
                                  Extend
                                </button>
                                <button className="px-4 py-2 bg-red-600/20 hover:bg-red-600/40 border border-red-500/30 text-red-300 rounded text-sm transition-all">
                                  Cancel
                                </button>
                              </>
                            )}
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
  );
}
