import { Search, Filter, Grid3X3, List, ChevronLeft, ChevronRight, Loader, Star } from "lucide-react";
import { useState, useMemo } from "react";
import { Input } from "@/components/ui/input";
import { useGetAvailableTasks } from "@/hooks/useProtocol";
import type { MarketplacePackage } from "@/services/protocolAPI";

interface ComputeMarketplaceProps {
  onSelectPackage?: (pkg: MarketplacePackage) => void;
}

export function ComputeMarketplace({ onSelectPackage }: ComputeMarketplaceProps) {
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    minCost: 0,
    maxCost: 500,
    minCompute: 0,
    maxCompute: 10000,
    minDuration: 0,
    maxDuration: 365,
    minReputation: 0,
  });

  const itemsPerPage = viewMode === "grid" ? 6 : 5;

  // Fetch available packages from marketplace
  const { data: marketplaceData, isLoading, error } = useGetAvailableTasks(currentPage, itemsPerPage);

  const packages: MarketplacePackage[] = marketplaceData?.packages || [];

  const filteredPackages = useMemo(() => {
    return packages.filter((pkg) => {
      const matchesSearch =
        pkg.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        pkg.provider.toLowerCase().includes(searchQuery.toLowerCase()) ||
        pkg.id.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCost =
        pkg.costCC >= filters.minCost && pkg.costCC <= filters.maxCost;
      const matchesCompute =
        pkg.computeAmount >= filters.minCompute && pkg.computeAmount <= filters.maxCompute;
      const matchesDuration =
        pkg.duration >= filters.minDuration && pkg.duration <= filters.maxDuration;
      const matchesReputation =
        parseFloat(pkg.reputation) >= filters.minReputation;

      return (
        matchesSearch &&
        matchesCost &&
        matchesCompute &&
        matchesDuration &&
        matchesReputation
      );
    });
  }, [searchQuery, filters, packages]);

  const paginatedPackages = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredPackages.slice(start, start + itemsPerPage);
  }, [filteredPackages, currentPage, itemsPerPage]);

  const totalPages = Math.ceil(filteredPackages.length / itemsPerPage);

  const getReputationColor = (rep: number) => {
    if (rep >= 4.7) return "text-emerald-400";
    if (rep >= 4.3) return "text-blue-400";
    if (rep >= 4.0) return "text-yellow-400";
    return "text-orange-400";
  };

  return (
    <div className="space-y-6">
      {/* Search and View Controls */}
      <div className="flex flex-col gap-4">
        <div className="flex gap-2">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-500" />
            <Input
              placeholder="Search by package, provider, or ID..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentPage(1);
              }}
              className="pl-10 bg-slate-900/50 border-blue-500/20"
            />
          </div>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="px-4 py-2 bg-slate-900/50 hover:bg-slate-800/50 border border-blue-500/20 text-slate-300 rounded transition-all flex items-center gap-2"
          >
            <Filter className="w-4 h-4" />
            Filters
          </button>
          <div className="flex gap-1 bg-slate-900/50 border border-blue-500/20 rounded p-1">
            <button
              onClick={() => setViewMode("grid")}
              className={`p-2 rounded transition-all ${
                viewMode === "grid"
                  ? "bg-blue-600/30 text-blue-300"
                  : "text-slate-400 hover:text-slate-200"
              }`}
            >
              <Grid3X3 className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode("list")}
              className={`p-2 rounded transition-all ${
                viewMode === "list"
                  ? "bg-blue-600/30 text-blue-300"
                  : "text-slate-400 hover:text-slate-200"
              }`}
            >
              <List className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Filters Panel */}
        {showFilters && (
          <div className="bg-slate-900/50 border border-blue-500/20 rounded-lg p-4 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div>
                <label className="text-sm text-slate-400 block mb-2">Cost (CC)</label>
                <div className="flex gap-2">
                  <input
                    type="number"
                    placeholder="Min"
                    value={filters.minCost}
                    onChange={(e) =>
                      setFilters({ ...filters, minCost: Number(e.target.value) })
                    }
                    className="flex-1 bg-slate-800/50 border border-slate-700 rounded px-3 py-2 text-slate-200 text-sm"
                  />
                  <input
                    type="number"
                    placeholder="Max"
                    value={filters.maxCost}
                    onChange={(e) =>
                      setFilters({ ...filters, maxCost: Number(e.target.value) })
                    }
                    className="flex-1 bg-slate-800/50 border border-slate-700 rounded px-3 py-2 text-slate-200 text-sm"
                  />
                </div>
              </div>

              <div>
                <label className="text-sm text-slate-400 block mb-2">Compute Amount</label>
                <div className="flex gap-2">
                  <input
                    type="number"
                    placeholder="Min"
                    value={filters.minCompute}
                    onChange={(e) =>
                      setFilters({ ...filters, minCompute: Number(e.target.value) })
                    }
                    className="flex-1 bg-slate-800/50 border border-slate-700 rounded px-3 py-2 text-slate-200 text-sm"
                  />
                  <input
                    type="number"
                    placeholder="Max"
                    value={filters.maxCompute}
                    onChange={(e) =>
                      setFilters({ ...filters, maxCompute: Number(e.target.value) })
                    }
                    className="flex-1 bg-slate-800/50 border border-slate-700 rounded px-3 py-2 text-slate-200 text-sm"
                  />
                </div>
              </div>

              <div>
                <label className="text-sm text-slate-400 block mb-2">Duration (Days)</label>
                <div className="flex gap-2">
                  <input
                    type="number"
                    placeholder="Min"
                    value={filters.minDuration}
                    onChange={(e) =>
                      setFilters({ ...filters, minDuration: Number(e.target.value) })
                    }
                    className="flex-1 bg-slate-800/50 border border-slate-700 rounded px-3 py-2 text-slate-200 text-sm"
                  />
                  <input
                    type="number"
                    placeholder="Max"
                    value={filters.maxDuration}
                    onChange={(e) =>
                      setFilters({ ...filters, maxDuration: Number(e.target.value) })
                    }
                    className="flex-1 bg-slate-800/50 border border-slate-700 rounded px-3 py-2 text-slate-200 text-sm"
                  />
                </div>
              </div>

              <div>
                <label className="text-sm text-slate-400 block mb-2">Min Reputation</label>
                <input
                  type="number"
                  placeholder="0-5"
                  min="0"
                  max="5"
                  step="0.1"
                  value={filters.minReputation}
                  onChange={(e) =>
                    setFilters({ ...filters, minReputation: Number(e.target.value) })
                  }
                  className="w-full bg-slate-800/50 border border-slate-700 rounded px-3 py-2 text-slate-200 text-sm"
                />
              </div>

              <div className="flex items-end">
                <button
                  onClick={() => {
                    setFilters({
                      minCost: 0,
                      maxCost: 500,
                      minCompute: 0,
                      maxCompute: 10000,
                      minDuration: 0,
                      maxDuration: 365,
                      minReputation: 0,
                    });
                    setCurrentPage(1);
                  }}
                  className="w-full px-4 py-2 bg-slate-700/50 hover:bg-slate-600/50 border border-slate-600 text-slate-300 rounded transition-all text-sm"
                >
                  Reset Filters
                </button>
              </div>
            </div>
          </div>
        )}

        <p className="text-sm text-slate-400">
          Found {filteredPackages.length} package{filteredPackages.length !== 1 ? "s" : ""}
        </p>
      </div>

      {/* Loading State */}
      {isLoading && (
        <div className="flex items-center justify-center py-12">
          <div className="flex flex-col items-center gap-4">
            <Loader className="w-8 h-8 text-blue-400 animate-spin" />
            <p className="text-slate-400">Loading marketplace packages...</p>
          </div>
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="bg-red-900/20 border border-red-500/30 rounded-lg p-6 text-center">
          <p className="text-red-400">Failed to load packages. Please try again later.</p>
        </div>
      )}

      {/* Empty State */}
      {!isLoading && !error && paginatedPackages.length === 0 && (
        <div className="text-center py-12">
          <p className="text-slate-400">No packages match your filters</p>
        </div>
      )}

      {/* Grid View */}
      {!isLoading && !error && paginatedPackages.length > 0 && viewMode === "grid" && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {paginatedPackages.map((pkg) => (
            <div
              key={pkg.id}
              className="bg-gradient-to-br from-slate-900/50 to-slate-950/50 border border-blue-500/20 rounded-lg p-6 hover:border-blue-500/40 transition-all hover:shadow-lg hover:shadow-blue-500/10 cursor-pointer"
              onClick={() => onSelectPackage?.(pkg)}
            >
              <div className="space-y-4">
                <div>
                  <p className="text-slate-500 text-sm">Package</p>
                  <p className="text-blue-300 font-semibold text-lg">{pkg.id}</p>
                  <p className="text-slate-400 text-xs">{pkg.description}</p>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-slate-800/30 rounded p-3">
                    <p className="text-slate-500 text-xs">Compute</p>
                    <p className="text-emerald-300 font-semibold">
                      {pkg.computeAmount}
                    </p>
                  </div>
                  <div className="bg-slate-800/30 rounded p-3">
                    <p className="text-slate-500 text-xs">Cost (CC)</p>
                    <p className="text-yellow-300 font-semibold">
                      {pkg.costCC}
                    </p>
                  </div>
                  <div className="bg-slate-800/30 rounded p-3">
                    <p className="text-slate-500 text-xs">Duration</p>
                    <p className="text-purple-300 font-semibold">
                      {pkg.duration} days
                    </p>
                  </div>
                  <div className="bg-slate-800/30 rounded p-3">
                    <p className="text-slate-500 text-xs">Daily Cost</p>
                    <p className="text-cyan-300 font-semibold">
                      {pkg.costPerDay} CC
                    </p>
                  </div>
                </div>

                <div className="flex gap-2 items-center justify-between">
                  <div>
                    <p className="text-slate-500 text-xs mb-1">Provider</p>
                    <p className="text-slate-300 font-semibold text-sm">{pkg.provider}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-slate-500 text-xs mb-1">Reputation</p>
                    <div className="flex items-center gap-1">
                      <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                      <p className={`font-semibold text-sm ${getReputationColor(parseFloat(pkg.reputation))}`}>
                        {pkg.reputation}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-700">
                  <p className="text-slate-500 text-xs mb-2">Available</p>
                  <p className="text-blue-300 font-semibold">{pkg.available} units</p>
                </div>

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onSelectPackage?.(pkg);
                  }}
                  className="w-full px-4 py-2 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-500 hover:to-blue-600 text-white rounded font-semibold transition-all"
                >
                  Lease Now
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* List View */}
      {!isLoading && !error && paginatedPackages.length > 0 && viewMode === "list" && (
        <div className="space-y-2 overflow-x-auto">
          {paginatedPackages.map((pkg) => (
            <div
              key={pkg.id}
              className="bg-gradient-to-r from-slate-900/50 to-slate-950/50 border border-blue-500/20 rounded-lg p-4 hover:border-blue-500/40 transition-all flex items-center justify-between group cursor-pointer min-w-max"
              onClick={() => onSelectPackage?.(pkg)}
            >
              <div className="flex-1 grid grid-cols-5 gap-4 items-center">
                <div>
                  <p className="text-slate-500 text-xs">Package</p>
                  <p className="text-blue-300 font-semibold truncate">{pkg.id}</p>
                </div>
                <div>
                  <p className="text-slate-500 text-xs">Compute / Cost</p>
                  <p className="text-emerald-300 font-semibold">
                    {pkg.computeAmount} / {pkg.costCC} CC
                  </p>
                </div>
                <div>
                  <p className="text-slate-500 text-xs">Duration / Daily</p>
                  <p className="text-purple-300 font-semibold">
                    {pkg.duration}d / {pkg.costPerDay}
                  </p>
                </div>
                <div>
                  <p className="text-slate-500 text-xs">Provider</p>
                  <p className="text-slate-300 font-semibold text-sm">{pkg.provider}</p>
                </div>
                <div>
                  <p className="text-slate-500 text-xs">Reputation</p>
                  <div className="flex items-center gap-1">
                    <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                    <p className={`font-semibold text-sm ${getReputationColor(parseFloat(pkg.reputation))}`}>
                      {pkg.reputation}
                    </p>
                  </div>
                </div>
              </div>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onSelectPackage?.(pkg);
                }}
                className="ml-4 px-4 py-2 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-500 hover:to-blue-600 text-white rounded font-semibold transition-all opacity-0 group-hover:opacity-100"
              >
                Lease
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between">
          <button
            onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
            disabled={currentPage === 1}
            className="p-2 hover:bg-slate-800/50 rounded disabled:opacity-50 disabled:cursor-not-allowed transition-all"
          >
            <ChevronLeft className="w-5 h-5 text-slate-400" />
          </button>

          <div className="flex gap-2">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                onClick={() => setCurrentPage(page)}
                className={`px-3 py-1 rounded transition-all text-sm ${
                  currentPage === page
                    ? "bg-blue-600/40 border border-blue-500/50 text-blue-300"
                    : "text-slate-400 hover:text-slate-200"
                }`}
              >
                {page}
              </button>
            ))}
          </div>

          <button
            onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
            disabled={currentPage === totalPages}
            className="p-2 hover:bg-slate-800/50 rounded disabled:opacity-50 disabled:cursor-not-allowed transition-all"
          >
            <ChevronRight className="w-5 h-5 text-slate-400" />
          </button>
        </div>
      )}
    </div>
  );
}
