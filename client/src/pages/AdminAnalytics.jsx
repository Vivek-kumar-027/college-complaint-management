import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/client';
import StatsCard from '../components/StatsCard';
import StatusBadge from '../components/StatusBadge';
import PriorityBadge from '../components/PriorityBadge';
import {
  ArrowLeft,
  BarChart3,
  PieChart,
  Clock,
  CheckCircle2,
  AlertCircle,
  TrendingUp,
  Layers,
  Activity,
} from 'lucide-react';

export default function AdminAnalytics() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await api.get('/stats');
        setData(res.data);
      } catch (err) {
        console.error('Failed to load stats', err);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="py-24 text-center space-y-3">
        <div className="w-10 h-10 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto" />
        <p className="text-sm font-medium text-slate-500">Generating analytics metrics...</p>
      </div>
    );
  }

  const stats = data?.stats || {};
  const total = stats.total || 0;
  const byStatus = stats.byStatus || {};
  const byCategory = stats.byCategory || {};
  const byPriority = stats.byPriority || {};
  const recent = data?.recent || [];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-xs font-bold text-slate-500 hover:text-slate-800 transition-colors uppercase tracking-wider mb-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Complaints Registry
          </Link>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            Campus Analytics & Resolution Trends
          </h1>
          <p className="text-sm text-slate-500">
            Insights on complaint volume, category distribution, and average turnaround times.
          </p>
        </div>
      </div>

      {/* Top Level Summary Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard
          title="Total Registered"
          value={total}
          icon={Layers}
          color="indigo"
          subtext="Across all facilities"
        />
        <StatsCard
          title="Pending Action"
          value={stats.pending || 0}
          icon={Clock}
          color="amber"
          subtext="Under active resolution"
        />
        <StatsCard
          title="Successfully Resolved"
          value={(stats.resolved || 0) + (stats.closed || 0)}
          icon={CheckCircle2}
          color="emerald"
          subtext="Completed tickets"
        />
        <StatsCard
          title="Avg. Resolution Time"
          value={
            stats.avgResolutionHours !== undefined
              ? `${stats.avgResolutionHours} hrs`
              : 'N/A'
          }
          icon={Activity}
          color="sky"
          subtext="Submission to resolution"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Status Lifecycle Breakdown */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-sm space-y-4">
          <div className="flex items-center gap-2">
            <PieChart className="w-5 h-5 text-indigo-600" />
            <h2 className="text-lg font-bold text-slate-900">
              Lifecycle Status Distribution
            </h2>
          </div>

          <div className="space-y-3 pt-2">
            {Object.entries(byStatus).map(([statusName, count]) => {
              const percentage = total > 0 ? Math.round((count / total) * 100) : 0;
              return (
                <div key={statusName} className="space-y-1">
                  <div className="flex justify-between text-xs font-bold text-slate-700">
                    <span className="flex items-center gap-2">
                      <StatusBadge status={statusName} />
                    </span>
                    <span>
                      {count} ({percentage}%)
                    </span>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                    <div
                      className="bg-indigo-600 h-2 rounded-full transition-all duration-500"
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Category Breakdown */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-sm space-y-4">
          <div className="flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-sky-600" />
            <h2 className="text-lg font-bold text-slate-900">
              Category Distribution
            </h2>
          </div>

          <div className="space-y-3 pt-2">
            {Object.entries(byCategory).map(([categoryName, count]) => {
              const percentage = total > 0 ? Math.round((count / total) * 100) : 0;
              return (
                <div key={categoryName} className="space-y-1">
                  <div className="flex justify-between text-xs font-semibold text-slate-700">
                    <span>{categoryName}</span>
                    <span className="font-bold text-slate-900">
                      {count} complaints ({percentage}%)
                    </span>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                    <div
                      className="bg-sky-500 h-2 rounded-full transition-all duration-500"
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Priority Urgency Distribution */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-sm space-y-4">
        <div className="flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-amber-600" />
          <h2 className="text-lg font-bold text-slate-900">
            Priority Urgency Breakdown
          </h2>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-2">
          {Object.entries(byPriority).map(([prio, count]) => (
            <div
              key={prio}
              className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 text-center space-y-2"
            >
              <PriorityBadge priority={prio} />
              <p className="text-2xl font-black text-slate-800">{count}</p>
              <p className="text-[11px] text-slate-500 font-medium">
                {total > 0 ? `${Math.round((count / total) * 100)}% of total` : '0%'}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Recent Activity Log */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-sm space-y-4">
        <h2 className="text-lg font-bold text-slate-900">
          Latest Registered Complaints
        </h2>

        <div className="divide-y divide-slate-100">
          {recent.map((c) => (
            <div
              key={c._id}
              className="py-3 flex items-center justify-between gap-4 text-xs"
            >
              <div className="space-y-0.5">
                <Link
                  to={`/complaints/${c._id}`}
                  className="font-bold text-slate-800 hover:text-indigo-600 text-sm line-clamp-1"
                >
                  {c.title}
                </Link>
                <p className="text-slate-500">
                  {c.student?.name} • {c.category} • {c.location}
                </p>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <PriorityBadge priority={c.priority} />
                <StatusBadge status={c.status} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
