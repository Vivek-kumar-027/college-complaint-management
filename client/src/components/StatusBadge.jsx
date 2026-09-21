import React from 'react';

const statusStyles = {
  Submitted: 'bg-blue-50 text-blue-700 border-blue-200 ring-blue-500/20',
  'Under Review': 'bg-amber-50 text-amber-700 border-amber-200 ring-amber-500/20',
  Assigned: 'bg-purple-50 text-purple-700 border-purple-200 ring-purple-500/20',
  'In Progress': 'bg-indigo-50 text-indigo-700 border-indigo-200 ring-indigo-500/20',
  Resolved: 'bg-emerald-50 text-emerald-700 border-emerald-200 ring-emerald-500/20',
  Closed: 'bg-slate-100 text-slate-700 border-slate-300 ring-slate-400/20',
};

const dotColors = {
  Submitted: 'bg-blue-500',
  'Under Review': 'bg-amber-500',
  Assigned: 'bg-purple-500',
  'In Progress': 'bg-indigo-500 animate-pulse',
  Resolved: 'bg-emerald-500',
  Closed: 'bg-slate-500',
};

export default function StatusBadge({ status, size = 'sm' }) {
  const currentStyle = statusStyles[status] || 'bg-slate-50 text-slate-700 border-slate-200';
  const dotColor = dotColors[status] || 'bg-slate-400';

  const sizeClasses =
    size === 'lg'
      ? 'px-3 py-1.5 text-sm font-semibold'
      : 'px-2.5 py-1 text-xs font-medium';

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border shadow-sm ${currentStyle} ${sizeClasses}`}
    >
      <span className={`w-2 h-2 rounded-full ${dotColor}`} />
      <span>{status || 'Unknown'}</span>
    </span>
  );
}
