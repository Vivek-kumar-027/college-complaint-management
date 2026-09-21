import React from 'react';
import { Search, Filter, RotateCcw } from 'lucide-react';

export default function FilterBar({
  filters,
  onChange,
  onReset,
  categories = [],
  departments = [],
  showDepartment = false,
}) {
  return (
    <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-sm space-y-3 mb-6">
      <div className="flex flex-col md:flex-row gap-3">
        {/* Search input */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search by title, description, or location..."
            value={filters.search || ''}
            onChange={(e) => onChange('search', e.target.value)}
            className="w-full pl-10 pr-4 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 transition-all placeholder:text-slate-400"
          />
        </div>

        {/* Status Filter */}
        <div className="w-full md:w-44">
          <select
            value={filters.status || 'all'}
            onChange={(e) => onChange('status', e.target.value)}
            className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 text-slate-700 font-medium"
          >
            <option value="all">All Statuses</option>
            <option value="Submitted">Submitted</option>
            <option value="Under Review">Under Review</option>
            <option value="Assigned">Assigned</option>
            <option value="In Progress">In Progress</option>
            <option value="Resolved">Resolved</option>
            <option value="Closed">Closed</option>
          </select>
        </div>

        {/* Category Filter */}
        <div className="w-full md:w-44">
          <select
            value={filters.category || 'all'}
            onChange={(e) => onChange('category', e.target.value)}
            className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 text-slate-700 font-medium"
          >
            <option value="all">All Categories</option>
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>

        {/* Priority Filter */}
        <div className="w-full md:w-36">
          <select
            value={filters.priority || 'all'}
            onChange={(e) => onChange('priority', e.target.value)}
            className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 text-slate-700 font-medium"
          >
            <option value="all">All Priorities</option>
            <option value="Low">Low</option>
            <option value="Medium">Medium</option>
            <option value="High">High</option>
            <option value="Critical">Critical</option>
          </select>
        </div>

        {/* Department Filter (Admin) */}
        {showDepartment && departments.length > 0 && (
          <div className="w-full md:w-48">
            <select
              value={filters.department || 'all'}
              onChange={(e) => onChange('department', e.target.value)}
              className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 text-slate-700 font-medium"
            >
              <option value="all">All Departments</option>
              {departments.map((dept) => (
                <option key={dept._id || dept.name} value={dept.name}>
                  {dept.name}
                </option>
              ))}
            </select>
          </div>
        )}

        {/* Reset */}
        <button
          onClick={onReset}
          title="Reset Filters"
          className="flex items-center justify-center gap-1.5 px-3 py-2 text-xs font-semibold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Reset</span>
        </button>
      </div>
    </div>
  );
}
