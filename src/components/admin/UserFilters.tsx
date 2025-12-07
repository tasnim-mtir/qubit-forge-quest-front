interface UserFiltersProps {
  roleFilter: string;
  setRoleFilter: (value: string) => void;
  dateFilter: string;
  setDateFilter: (value: string) => void;
  searchEmail?: string;
  setSearchEmail?: (value: string) => void;
}

export function UserFilters({
  roleFilter,
  setRoleFilter,
  dateFilter,
  setDateFilter,
  searchEmail = "",
  setSearchEmail = () => {},
}: UserFiltersProps) {
  return (
    <div className="space-y-4 mb-8 pb-4 border-b border-blue-500/20">
      {/* Search Email */}
      <div>
        <label className="block text-sm text-slate-400 mb-2">Search by Email</label>
        <input
          type="text"
          placeholder="Search email..."
          value={searchEmail}
          onChange={(e) => setSearchEmail(e.target.value)}
          className="w-full px-4 py-2 bg-slate-900/50 border border-blue-500/30 rounded text-slate-300 placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/50 transition-all"
        />
      </div>

      {/* Filters Row */}
      <div className="flex flex-col lg:flex-row gap-4">
        {/* Role Filter */}
        <div className="flex-1">
          <label className="block text-sm text-slate-400 mb-2">Filter by Role</label>
          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            className="w-full px-4 py-2 bg-slate-900/50 border border-blue-500/30 rounded text-slate-300 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/50 transition-all cursor-pointer"
          >
            <option value="all">All Roles</option>
            <option value="user">Regular User</option>
            <option value="creator">Creator</option>
            <option value="investor">Investor</option>
            <option value="admin">Admin</option>
          </select>
        </div>

        {/* Creation Date Filter */}
        <div className="flex-1">
          <label className="block text-sm text-slate-400 mb-2">Joined Period</label>
          <select
            value={dateFilter}
            onChange={(e) => setDateFilter(e.target.value)}
            className="w-full px-4 py-2 bg-slate-900/50 border border-blue-500/30 rounded text-slate-300 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/50 transition-all cursor-pointer"
          >
            <option value="all">All Time</option>
            <option value="today">Today</option>
            <option value="yesterday">Yesterday</option>
            <option value="7days">Last 7 Days</option>
            <option value="30days">Last 30 Days</option>
            <option value="90days">Last 90 Days</option>
          </select>
        </div>
      </div>
    </div>
  );
}
