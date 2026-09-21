import React from 'react';
import { AlertCircle, AlertTriangle, ArrowDown, ArrowUp } from 'lucide-react';

const priorityConfig = {
  Low: {
    classes: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    icon: ArrowDown,
  },
  Medium: {
    classes: 'bg-sky-50 text-sky-700 border-sky-200',
    icon: ArrowUp,
  },
  High: {
    classes: 'bg-amber-50 text-amber-800 border-amber-300',
    icon: AlertTriangle,
  },
  Critical: {
    classes: 'bg-rose-50 text-rose-700 border-rose-300 animate-pulse',
    icon: AlertCircle,
  },
};

export default function PriorityBadge({ priority, showIcon = true }) {
  const config = priorityConfig[priority] || priorityConfig.Medium;
  const Icon = config.icon;

  return (
    <span
      className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold border ${config.classes}`}
    >
      {showIcon && <Icon className="w-3.5 h-3.5" />}
      {priority}
    </span>
  );
}
