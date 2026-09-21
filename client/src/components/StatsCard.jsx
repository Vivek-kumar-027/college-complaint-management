import React from 'react';

export default function StatsCard({ title, value, icon: Icon, color = 'sky', subtext }) {
  const colorMap = {
    sky: 'bg-sky-50 text-sky-600 border-sky-100',
    amber: 'bg-amber-50 text-amber-600 border-amber-100',
    purple: 'bg-purple-50 text-purple-600 border-purple-100',
    emerald: 'bg-emerald-50 text-emerald-600 border-emerald-100',
    rose: 'bg-rose-50 text-rose-600 border-rose-100',
    slate: 'bg-slate-50 text-slate-600 border-slate-200',
  };

  return (
    <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
            {title}
          </p>
          <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-800 mt-1">
            {value}
          </h3>
          {subtext && (
            <p className="text-xs text-slate-500 mt-1 font-medium">{subtext}</p>
          )}
        </div>
        {Icon && (
          <div
            className={`w-12 h-12 rounded-xl flex items-center justify-center border ${
              colorMap[color] || colorMap.sky
            }`}
          >
            <Icon className="w-6 h-6" />
          </div>
        )}
      </div>
    </div>
  );
}
