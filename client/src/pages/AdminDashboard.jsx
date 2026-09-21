import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/client';
import StatusBadge from '../components/StatusBadge';
import PriorityBadge from '../components/PriorityBadge';
import StatsCard from '../components/StatsCard';
import FilterBar from '../components/FilterBar';
import {
  FileText,
  Clock,
  AlertTriangle,
  CheckCircle2,
  Building,
  User,
  ExternalLink,
  Search,
  Filter,
  BarChart3,
  ShieldCheck,
  UserPlus,
  X,
  Check,
} from 'lucide-react';

export default function AdminDashboard() {
  const [complaints, setComplaints] = useState([]);
  const [categories, setCategories] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);

  // Add Student Modal State
  const [addUserModalOpen, setAddUserModalOpen] = useState(false);
  const [newUser, setNewUser] = useState({
    name: '',
    email: '',
    password: '',
    studentId: '',
    department: 'Computer Science',
  });
  const [addUserLoading, setAddUserLoading] = useState(false);
  const [addUserError, setAddUserError] = useState('');
  const [addUserSuccess, setAddUserSuccess] = useState('');

  const [filters, setFilters] = useState({
    search: '',
    status: 'all',
    category: 'all',
    priority: 'all',
    department: 'all',
  });

  const fetchData = async () => {
    setLoading(true);
    try {
      const [categoriesRes, departmentsRes, complaintsRes] = await Promise.all([
        api.get('/categories'),
        api.get('/departments'),
        api.get('/complaints', {
          params: {
            search: filters.search || undefined,
            status: filters.status !== 'all' ? filters.status : undefined,
            category: filters.category !== 'all' ? filters.category : undefined,
            priority: filters.priority !== 'all' ? filters.priority : undefined,
            department: filters.department !== 'all' ? filters.department : undefined,
          },
        }),
      ]);

      setCategories(categoriesRes.data.categories || []);
      setDepartments(departmentsRes.data.departments || []);
      setComplaints(complaintsRes.data.complaints || []);
    } catch (err) {
      console.error('Error fetching admin data', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
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
      department: 'all',
    });
  };

  const handleCreateUser = async (e) => {
    e.preventDefault();
    setAddUserError('');
    setAddUserSuccess('');
    setAddUserLoading(true);
    try {
      const res = await api.post('/auth/admin/create-user', {
        ...newUser,
        role: 'student',
      });
      setAddUserSuccess(`Student account created for "${res.data.user.name}" (${res.data.user.email})!`);
      setNewUser({
        name: '',
        email: '',
        password: '',
        studentId: '',
        department: 'Computer Science',
      });
    } catch (err) {
      setAddUserError(err.response?.data?.message || 'Failed to create student account');
    } finally {
      setAddUserLoading(false);
    }
  };

  // Metrics
  const totalCount = complaints.length;
  const pendingCount = complaints.filter((c) =>
    ['Submitted', 'Under Review', 'Assigned', 'In Progress'].includes(c.status)
  ).length;
  const criticalCount = complaints.filter(
    (c) => c.priority === 'Critical' && c.status !== 'Closed'
  ).length;
  const resolvedCount = complaints.filter((c) =>
    ['Resolved', 'Closed'].includes(c.status)
  ).length;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 rounded-3xl p-6 sm:p-8 text-white shadow-xl">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-300 text-xs font-bold uppercase tracking-wider mb-1">
            <ShieldCheck className="w-3.5 h-3.5 text-indigo-400" />
            Central Administrator Panel
          </div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight">
            Campus Complaint Management
          </h1>
          <p className="text-slate-400 text-sm max-w-xl">
            Review incoming student grievances, assign responsible departments, monitor resolution timelines, and log maintenance notes.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button
            type="button"
            onClick={() => {
              setAddUserError('');
              setAddUserSuccess('');
              setAddUserModalOpen(true);
            }}
            className="inline-flex items-center gap-2 px-5 py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm shadow-lg shadow-emerald-600/30 transition-all cursor-pointer"
          >
            <UserPlus className="w-4 h-4" />
            + Add Student
          </button>
          <Link
            to="/analytics"
            className="inline-flex items-center gap-2 px-5 py-3 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-sm shadow-lg shadow-indigo-600/30 transition-all"
          >
            <BarChart3 className="w-4 h-4" />
            Analytics & Reports
          </Link>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard
          title="Total In System"
          value={totalCount}
          icon={FileText}
          color="indigo"
          subtext="All campus tickets"
        />
        <StatsCard
          title="Action Required"
          value={pendingCount}
          icon={Clock}
          color="amber"
          subtext="Pending resolution"
        />
        <StatsCard
          title="Critical Urgency"
          value={criticalCount}
          icon={AlertTriangle}
          color="rose"
          subtext="Safety & urgent tickets"
        />
        <StatsCard
          title="Resolved / Closed"
          value={resolvedCount}
          icon={CheckCircle2}
          color="emerald"
          subtext="Completed tickets"
        />
      </div>

      {/* Filter and Table Section */}
      <div className="space-y-4">
        <FilterBar
          filters={filters}
          onChange={handleFilterChange}
          onReset={handleResetFilters}
          categories={categories}
          departments={departments}
          showDepartment={true}
        />

        {loading ? (
          <div className="py-20 text-center space-y-3">
            <div className="w-10 h-10 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto" />
            <p className="text-sm font-medium text-slate-500">Loading complaints registry...</p>
          </div>
        ) : complaints.length === 0 ? (
          <div className="bg-white rounded-3xl p-12 text-center border border-slate-200 shadow-sm space-y-3">
            <div className="w-14 h-14 bg-slate-100 text-slate-400 rounded-2xl flex items-center justify-center mx-auto">
              <FileText className="w-8 h-8" />
            </div>
            <h3 className="text-lg font-bold text-slate-800">No complaints matching filter</h3>
            <p className="text-sm text-slate-500">
              Try adjusting your search keywords, status filter, or category selection.
            </p>
            <button
              onClick={handleResetFilters}
              className="px-4 py-2 rounded-xl text-xs font-bold text-indigo-600 bg-indigo-50 hover:bg-indigo-100 transition-colors"
            >
              Clear All Filters
            </button>
          </div>
        ) : (
          <div className="bg-white rounded-3xl border border-slate-200/80 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50/80 border-b border-slate-200 text-[11px] font-extrabold uppercase tracking-wider text-slate-500">
                    <th className="py-4 px-6">Complaint & Student</th>
                    <th className="py-4 px-6">Category & Location</th>
                    <th className="py-4 px-6">Priority</th>
                    <th className="py-4 px-6">Status</th>
                    <th className="py-4 px-6">Assigned Department</th>
                    <th className="py-4 px-6">Date</th>
                    <th className="py-4 px-6 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-sm">
                  {complaints.map((item) => (
                    <tr
                      key={item._id}
                      className="hover:bg-slate-50/60 transition-colors group"
                    >
                      {/* Title & Student */}
                      <td className="py-4 px-6">
                        <div className="space-y-0.5">
                          <Link
                            to={`/complaints/${item._id}`}
                            className="font-bold text-slate-900 group-hover:text-indigo-600 transition-colors line-clamp-1 max-w-xs"
                          >
                            {item.title}
                          </Link>
                          <p className="text-xs text-slate-500">
                            By {item.student?.name || 'Unknown Student'}
                            {item.student?.studentId ? ` (${item.student.studentId})` : ''}
                          </p>
                        </div>
                      </td>

                      {/* Category & Location */}
                      <td className="py-4 px-6">
                        <span className="inline-block text-xs font-semibold text-slate-700 bg-slate-100 px-2 py-0.5 rounded-md mb-1">
                          {item.category}
                        </span>
                        <p className="text-xs text-slate-500 line-clamp-1 max-w-[180px]">
                          {item.location}
                        </p>
                      </td>

                      {/* Priority */}
                      <td className="py-4 px-6">
                        <PriorityBadge priority={item.priority} />
                      </td>

                      {/* Status */}
                      <td className="py-4 px-6">
                        <StatusBadge status={item.status} />
                      </td>

                      {/* Assigned Department */}
                      <td className="py-4 px-6">
                        {item.assignedDepartment ? (
                          <div className="space-y-0.5">
                            <span className="font-semibold text-slate-800 text-xs">
                              {item.assignedDepartment}
                            </span>
                            {item.assignedStaff && (
                              <p className="text-[11px] text-slate-500">
                                {item.assignedStaff}
                              </p>
                            )}
                          </div>
                        ) : (
                          <span className="text-xs font-medium text-amber-600 bg-amber-50 px-2 py-1 rounded-md border border-amber-200">
                            Unassigned
                          </span>
                        )}
                      </td>

                      {/* Date */}
                      <td className="py-4 px-6 text-xs text-slate-500 whitespace-nowrap">
                        {new Date(item.createdAt).toLocaleDateString()}
                      </td>

                      {/* Action */}
                      <td className="py-4 px-6 text-right whitespace-nowrap">
                        <Link
                          to={`/complaints/${item._id}`}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold text-indigo-700 bg-indigo-50 hover:bg-indigo-100 border border-indigo-200/80 transition-colors"
                        >
                          Manage
                          <ExternalLink className="w-3.5 h-3.5" />
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* Add Student Modal */}
      {addUserModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-slate-100 p-6 sm:p-8 space-y-6">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center">
                  <UserPlus className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-black text-slate-800">Add Student Credentials</h3>
                  <p className="text-xs text-slate-500">Provision a new student account to access the portal</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setAddUserModalOpen(false)}
                className="p-2 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {addUserError && (
              <div className="p-3 text-xs font-medium text-rose-700 bg-rose-50 border border-rose-200 rounded-xl">
                {addUserError}
              </div>
            )}

            {addUserSuccess && (
              <div className="p-3 text-xs font-medium text-emerald-800 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center gap-2">
                <Check className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                <span>{addUserSuccess}</span>
              </div>
            )}

            <form onSubmit={handleCreateUser} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Student Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={newUser.name}
                    onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
                    placeholder="e.g. Rahul Sharma"
                    className="w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 font-medium"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Roll No / Student ID
                  </label>
                  <input
                    type="text"
                    value={newUser.studentId}
                    onChange={(e) => setNewUser({ ...newUser, studentId: e.target.value })}
                    placeholder="e.g. CS-2024-055"
                    className="w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 font-medium"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Department
                </label>
                <input
                  type="text"
                  value={newUser.department}
                  onChange={(e) => setNewUser({ ...newUser, department: e.target.value })}
                  placeholder="e.g. Computer Science & Engineering"
                  className="w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 font-medium"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Email Address (Login Username) *
                </label>
                <input
                  type="email"
                  required
                  value={newUser.email}
                  onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                  placeholder="e.g. rahul@college.edu"
                  className="w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 font-medium"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Initial Password *
                </label>
                <input
                  type="text"
                  required
                  value={newUser.password}
                  onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
                  placeholder="e.g. Student@123"
                  className="w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 font-medium"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setAddUserModalOpen(false)}
                  className="px-4 py-2.5 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer"
                >
                  Close
                </button>
                <button
                  type="submit"
                  disabled={addUserLoading}
                  className="px-6 py-2.5 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl shadow-md shadow-emerald-600/20 transition-all disabled:opacity-50 cursor-pointer"
                >
                  {addUserLoading ? 'Saving...' : 'Create Student'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
