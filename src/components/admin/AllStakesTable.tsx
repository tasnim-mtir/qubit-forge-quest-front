import { Eye, EyeOff } from "lucide-react";
import { useState } from "react";
import type { Stake } from "@/services/protocolAPI";
import { Button } from "@/components/ui/button";

interface AllStakesTableProps {
  stakes: Stake[];
  isLoading: boolean;
}

export function AllStakesTable({ stakes, isLoading }: AllStakesTableProps) {
  const [expandedStake, setExpandedStake] = useState<string | null>(null);
  const [sortConfig, setSortConfig] = useState<{
    key: keyof Stake;
    direction: "asc" | "desc";
  } | null>(null);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return (
          <span className="inline-flex items-center gap-2 px-3 py-1.5 bg-gradient-to-r from-emerald-500/20 to-emerald-600/10 border border-emerald-500/30 text-emerald-300 text-xs font-semibold rounded-full hover:border-emerald-500/50 transition-all">
            <span className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></span>
            Active
          </span>
        );
      case "released":
        return (
          <span className="inline-flex items-center gap-2 px-3 py-1.5 bg-gradient-to-r from-blue-500/20 to-blue-600/10 border border-blue-500/30 text-blue-300 text-xs font-semibold rounded-full hover:border-blue-500/50 transition-all">
            <span className="w-2 h-2 bg-blue-400 rounded-full"></span>
            Released
          </span>
        );
      case "claimed":
        return (
          <span className="inline-flex items-center gap-2 px-3 py-1.5 bg-gradient-to-r from-amber-500/20 to-amber-600/10 border border-amber-500/30 text-amber-300 text-xs font-semibold rounded-full hover:border-amber-500/50 transition-all">
            <span className="w-2 h-2 bg-amber-400 rounded-full"></span>
            Claimed
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

  const calculateUnlockDate = (createdAt: string, lockPeriod: number) => {
    const startDate = new Date(createdAt);
    const endDate = new Date(startDate.getTime() + lockPeriod * 24 * 60 * 60 * 1000);
    return endDate.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const handleSort = (key: keyof Stake) => {
    setSortConfig(
      sortConfig?.key === key && sortConfig?.direction === "asc"
        ? { key, direction: "desc" }
        : { key, direction: "asc" }
    );
  };

  const sortedStakes = [...stakes].sort((a, b) => {
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

  const SortIcon = ({ column }: { column: keyof Stake }) => {
    if (sortConfig?.key !== column) {
      return <span className="text-slate-500">⇅</span>;
    }
    return <span className="text-blue-400">{sortConfig.direction === "asc" ? "↑" : "↓"}</span>;
  };

  // Calculate summary
  const totalQXLocked = stakes.reduce((sum, s) => sum + s.amountQX, 0);
  const totalCCDistributed = stakes.reduce((sum, s) => sum + s.computeCreditsReceived, 0);
  const avgStake = stakes.length > 0 ? (totalQXLocked / stakes.length).toFixed(2) : "0";

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-gradient-to-br from-red-500/10 to-red-600/5 border border-red-500/20 rounded-lg p-5 hover:border-red-500/40 transition-all group">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-slate-400 text-sm font-medium">Total QX Locked</p>
              <p className="text-3xl font-bold text-red-300 mt-3">{totalQXLocked.toLocaleString()}</p>
              <p className="text-xs text-slate-500 mt-2">across {stakes.length} stakes</p>
            </div>
          </div>
        </div>
        <div className="bg-gradient-to-br from-emerald-500/10 to-emerald-600/5 border border-emerald-500/20 rounded-lg p-5 hover:border-emerald-500/40 transition-all group">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-slate-400 text-sm font-medium">Total CC Distributed</p>
              <p className="text-3xl font-bold text-emerald-300 mt-3">
                {totalCCDistributed.toLocaleString()}
              </p>
              <p className="text-xs text-slate-500 mt-2">compute credits</p>
            </div>
          </div>
        </div>
        <div className="bg-gradient-to-br from-purple-500/10 to-purple-600/5 border border-purple-500/20 rounded-lg p-5 hover:border-purple-500/40 transition-all group">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-slate-400 text-sm font-medium">Average Stake</p>
              <p className="text-3xl font-bold text-purple-300 mt-3">{avgStake} QX</p>
              <p className="text-xs text-slate-500 mt-2">per staker</p>
            </div>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="bg-gradient-to-b from-slate-900/50 to-slate-950/30 border border-slate-700/50 rounded-lg overflow-hidden backdrop-blur-sm">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gradient-to-r from-slate-900/80 to-slate-800/50 border-b border-slate-700/50">
              <tr>
                <th className="px-6 py-4 text-left">
                  <button
                    onClick={() => handleSort("userId")}
                    className="flex items-center gap-2 text-slate-300 hover:text-red-300 transition-colors font-semibold text-sm uppercase tracking-wide"
                  >
                    User Email <SortIcon column="userId" />
                  </button>
                </th>
                <th className="px-6 py-4 text-left">
                  <button
                    onClick={() => handleSort("amountQX")}
                    className="flex items-center gap-2 text-slate-300 hover:text-red-300 transition-colors font-semibold text-sm uppercase tracking-wide"
                  >
                    Amount QX <SortIcon column="amountQX" />
                  </button>
                </th>
                <th className="px-6 py-4 text-left">
                  <button
                    onClick={() => handleSort("computeCreditsReceived")}
                    className="flex items-center gap-2 text-slate-300 hover:text-blue-300 transition-colors font-semibold text-sm"
                  >
                    CC Received <SortIcon column="computeCreditsReceived" />
                  </button>
                </th>
                <th className="px-6 py-4 text-left">
                  <button
                    onClick={() => handleSort("lockPeriod")}
                    className="flex items-center gap-2 text-slate-300 hover:text-blue-300 transition-colors font-semibold text-sm"
                  >
                    Lock Period <SortIcon column="lockPeriod" />
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
                <th className="px-6 py-4 text-left">Created Date</th>
                <th className="px-6 py-4 text-center text-slate-300 font-semibold text-sm">
                  Details
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-700/30">
              {isLoading ? (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center">
                    <div className="flex items-center justify-center gap-2">
                      <svg className="w-5 h-5 animate-spin text-red-400" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      <span className="text-slate-400">Loading stakes...</span>
                    </div>
                  </td>
                </tr>
              ) : stakes.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center">
                    <p className="text-slate-400">No stakes found</p>
                  </td>
                </tr>
              ) : (
                sortedStakes.map((stake) => (
                  <tbody key={stake._id}>
                    <tr className="hover:bg-red-500/5 transition-colors group border-t border-slate-700/20">
                      <td className="px-6 py-5">
                        <span className="text-slate-200 font-semibold text-sm">
                          {typeof stake.userId === "object" ? stake.userId.email : "Unknown"}
                        </span>
                      </td>
                      <td className="px-6 py-5">
                        <span className="text-red-300 font-bold text-sm">{stake.amountQX} QX</span>
                      </td>
                      <td className="px-6 py-5">
                        <span className="text-emerald-300 font-semibold text-sm">{stake.computeCreditsReceived} CC</span>
                      </td>
                      <td className="px-6 py-5">
                        <p className="text-slate-300 text-sm">{stake.lockPeriod} days</p>
                      </td>
                      <td className="px-6 py-5">{getStatusBadge(stake.status)}</td>
                      <td className="px-6 py-5">
                        <p className="text-slate-400 text-sm">{formatDate(stake.createdAt)}</p>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <button
                          onClick={() =>
                            setExpandedStake(expandedStake === stake._id ? null : stake._id)
                          }
                          className="p-2 hover:bg-slate-700/50 rounded transition-all"
                        >
                          <Eye
                            className={`w-5 h-5 text-slate-400 transition-all ${
                              expandedStake === stake._id ? "opacity-100" : "opacity-60"
                            }`}
                          />
                        </button>
                      </td>
                    </tr>

                    {/* Expanded Row */}
                    {expandedStake === stake._id && (
                      <tr className="bg-slate-800/20">
                        <td colSpan={7} className="px-6 py-6">
                          <div className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div>
                                <p className="text-slate-500 text-sm mb-1">Stake ID</p>
                                <p className="text-slate-200 font-mono text-sm break-all">{stake._id}</p>
                              </div>
                              <div>
                                <p className="text-slate-500 text-sm mb-1">User Role</p>
                                <p className="text-slate-200">
                                  {typeof stake.userId === "object"
                                    ? stake.userId.role.charAt(0).toUpperCase() + stake.userId.role.slice(1)
                                    : "Unknown"}
                                </p>
                              </div>
                              <div>
                                <p className="text-slate-500 text-sm mb-1">Created</p>
                                <p className="text-slate-200">{formatDate(stake.createdAt)}</p>
                              </div>
                              <div>
                                <p className="text-slate-500 text-sm mb-1">Unlock Date</p>
                                <p className="text-slate-200">
                                  {calculateUnlockDate(stake.createdAt, stake.lockPeriod)}
                                </p>
                              </div>
                              <div>
                                <p className="text-slate-500 text-sm mb-1">Conversion Rate</p>
                                <p className="text-slate-200">
                                  1 QX = {(stake.computeCreditsReceived / stake.amountQX).toFixed(0)} CC
                                </p>
                              </div>
                              <div>
                                <p className="text-slate-500 text-sm mb-1">Time Remaining</p>
                                <p className="text-slate-200">
                                  {Math.max(
                                    0,
                                    Math.ceil(
                                      (new Date(stake.createdAt).getTime() +
                                        stake.lockPeriod * 24 * 60 * 60 * 1000 -
                                        Date.now()) /
                                        (24 * 60 * 60 * 1000)
                                    )
                                  )}{" "}
                                  days
                                </p>
                              </div>
                            </div>

                            {/* Action Buttons */}
                            <div className="flex gap-2 pt-4 border-t border-slate-700">
                              {stake.status === "active" && (
                                <>
                                  <Button className="bg-emerald-600/20 hover:bg-emerald-600/40 border border-emerald-500/30 text-emerald-300">
                                    Adjust Lock Period
                                  </Button>
                                  <Button className="bg-red-600/20 hover:bg-red-600/40 border border-red-500/30 text-red-300">
                                    Revoke Stake
                                  </Button>
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
    </div>
  );
}
