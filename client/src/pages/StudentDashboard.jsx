import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../api/client';
import StatusBadge from '../components/StatusBadge';
import PriorityBadge from '../components/PriorityBadge';
import StatsCard from '../components/StatsCard';
import FilterBar from '../components/FilterBar';
import {
  PlusCircle,
  FileText,
  Clock,
  CheckCircle2,
  MapPin,
  Calendar,
  ChevronRight,
  MessageSquare,
  AlertCircle,
  Sparkles,
} from 'lucide-react';

export default function StudentDashboard() {
  const { user } = useAuth();
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState([]);

  const [filters, setFilters] = useState({
    search: '',
    status: 'all',
    category: 'all',
    priority: 'all',
  });

  const fetchCategories = async () => {
    try {
      const res = await api.get('/categories');
      setCategories(res.data.categories || []);
    } catch (err) {
      console.error('Failed to load categories', err);
    }
  };

  const fetchComplaints = async () => {
    setLoading(true);
    try {
      const params = {};
      if (filters.status && filters.status !== 'all') params.status = filters.status;
      if (filters.category && filters.category !== 'all') params.category = filters.category;
      if (filters.priority && filters.priority !== 'all') params.priority = filters.priority;
      if (filters.search) params.search = filters.search;

      const res = await api.get('/complaints', { params });
      setComplaints(res.data.complaints || []);
    } catch (err) {
      console.error('Failed to fetch complaints', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    fetchComplaints();
  }, [filters]);

  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const handleResetFilters = () => {
    setFilters({
      search: '',
      status: 'all',
      category: 'all',
      priority: 'all',
    });
  };

  // Compute summary metrics
  const totalCount = complaints.length;
  const pendingCount = complaints.filter((c) =>
    ['Submitted', 'Under Review', 'Assigned', 'In Progress'].includes(c.status)
  ).length;
  const resolvedCount = complaints.filter((c) => c.status === 'Resolved').length;
  const closedCount = complaints.filter((c) => c.status === 'Closed').length;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Welcome Banner */}
      <div className="relative overflow-hidden bg-gradient-to-r from-sky-600 via-sky-700 to-indigo-700 rounded-3xl p-6 sm:p-8 text-white shadow-xl shadow-sky-500/10">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-xs font-semibold text-sky-100 mb-3">
              <Sparkles className="w-3.5 h-3.5" />
              Student Portal Active
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Welcome back, {user?.name}!
            </h1>
            <p className="text-sky-100 text-sm mt-1 max-w-xl">
              Report campus facilities issues, follow up with administrators, and view status changes in real time.
            </p>
            {user?.studentId && (
              <p className="text-xs text-sky-200 mt-2 font-mono">
                Student ID: <span className="font-semibold text-white">{user.studentId}</span> • Department: <span className="font-semibold text-white">{user.department || 'General'}</span>
              </p>
            )}
          </div>

          <div>
            <Link
              to="/submit"
              className="inline-flex items-center gap-2 px-5 py-3 rounded-2xl bg-white text-sky-800 hover:bg-sky-50 font-bold text-sm shadow-lg shadow-black/10 transition-all hover:scale-105 active:scale-95"
            >
              <PlusCircle className="w-5 h-5 text-sky-600" />
              Submit New Complaint
            </Link>
          </div>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard
          title="Total Complaints"
          value={totalCount}
          icon={FileText}
          color="sky"
          subtext="Submitted by you"
        />
        <StatsCard
          title="In Progress / Pending"
          value={pendingCount}
          icon={Clock}
          color="amber"
          subtext="Under active review"
        />
        <StatsCard
          title="Resolved"
          value={resolvedCount}
          icon={CheckCircle2}
          color="emerald"
          subtext="Awaiting your feedback"
        />
        <StatsCard
          title="Closed"
          value={closedCount}
          icon={CheckCircle2}
          color="slate"
          subtext="Successfully finalized"
        />
      </div>

      {/* Filter and Complaints Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-slate-800">Your Complaints History</h2>
            <p className="text-xs text-slate-500">Track current status and admin comments</p>
          </div>
        </div>

        <FilterBar
          filters={filters}
          onChange={handleFilterChange}
          onReset={handleResetFilters}
          categories={categories}
        />

        {loading ? (
          <div className="py-16 text-center space-y-3">
            <div className="w-10 h-10 border-4 border-sky-600 border-t-transparent rounded-full animate-spin mx-auto" />
            <p className="text-sm font-medium text-slate-500">Loading complaints...</p>
          </div>
        ) : complaints.length === 0 ? (
          <div className="bg-white rounded-3xl p-12 text-center border border-slate-200 shadow-sm space-y-4">
            <div className="w-16 h-16 rounded-2xl bg-sky-50 text-sky-500 flex items-center justify-center mx-auto">
              <FileText className="w-8 h-8" />
            </div>
            <h3 className="text-lg font-bold text-slate-800">No complaints found</h3>
            <p className="text-sm text-slate-500 max-w-md mx-auto">
              {filters.search || filters.status !== 'all' || filters.category !== 'all'
                ? 'Try resetting the filters above to see more complaints.'
                : "You haven't submitted any complaints yet. Encountered an issue on campus? Let us know!"}
            </p>
            <Link
              to="/submit"
              className="inline-flex items-center gap-2 px-4 py-2 text-sm font-semibold rounded-xl bg-sky-600 text-white hover:bg-sky-700 shadow-sm transition-colors"
            >
              <PlusCircle className="w-4 h-4" />
              Submit Your First Complaint
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {complaints.map((item) => (
              <div
                key={item._id}
                className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-sm hover:shadow-md transition-all hover:-translate-y-0.5 flex flex-col justify-between"
              >
                <div className="space-y-3">
                  {/* Category & Status */}
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-[11px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-lg bg-slate-100 text-slate-600 border border-slate-200">
                      {item.category}
                    </span>
                    <StatusBadge status={item.status} />
                  </div>

                  {/* Title & Priority */}
                  <div>
                    <h3 className="text-base font-bold text-slate-800 line-clamp-1 hover:text-sky-600 transition-colors">
                      {item.title}
                    </h3>
                    <p className="text-xs text-slate-500 line-clamp-2 mt-1 leading-relaxed">
                      {item.description}
                    </p>
                  </div>

                  {/* Location & Priority Badge */}
                  <div className="flex items-center justify-between text-xs pt-1 border-t border-slate-100">
                    <div className="flex items-center gap-1 text-slate-500">
                      <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span className="truncate max-w-[140px]">{item.location}</span>
                    </div>
                    <PriorityBadge priority={item.priority} />
                  </div>
                </div>

                {/* Card Footer */}
                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-400">
                  <div className="flex items-center gap-1 font-medium">
                    <Calendar className="w-3.5 h-3.5" />
                    <span>{new Date(item.createdAt).toLocaleDateString()}</span>
                  </div>

                  <Link
                    to={`/complaints/${item._id}`}
                    className="inline-flex items-center gap-1 font-bold text-sky-600 hover:text-sky-700 hover:underline"
                  >
                    View Details
                    <ChevronRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
