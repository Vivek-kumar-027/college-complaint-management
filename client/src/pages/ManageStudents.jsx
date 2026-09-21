import React, { useState, useEffect } from 'react';
import api from '../api/client';
import {
  Users,
  UserPlus,
  Search,
  Trash2,
  Check,
  X,
  ShieldCheck,
  Mail,
  Key,
  GraduationCap,
  Copy,
  Building,
  Hash,
  AlertCircle,
} from 'lucide-react';

export default function ManageStudents() {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  // Modal State
  const [modalOpen, setModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    studentId: '',
    department: 'Computer Science',
  });
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState('');
  const [formSuccess, setFormSuccess] = useState(null);
  const [copied, setCopied] = useState(false);

  const departmentsList = [
    'Computer Science',
    'Electronics & Communication',
    'Mechanical Engineering',
    'Civil Engineering',
    'Electrical & Electronics',
    'Information Technology',
    'Biotechnology',
    'Management Studies',
  ];

  const fetchStudents = async () => {
    setLoading(true);
    try {
      const res = await api.get('/auth/admin/students');
      setStudents(res.data.students || []);
    } catch (err) {
      console.error('Failed to fetch students', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  const handleCreateStudent = async (e) => {
    e.preventDefault();
    setFormError('');
    setFormSuccess(null);
    setSubmitting(true);

    try {
      const res = await api.post('/auth/admin/create-user', {
        ...formData,
        role: 'student',
      });

      setFormSuccess({
        name: res.data.user.name,
        email: res.data.user.email,
        password: formData.password,
        studentId: res.data.user.studentId,
        department: res.data.user.department,
      });

      setFormData({
        name: '',
        email: '',
        password: '',
        studentId: '',
        department: 'Computer Science',
      });

      // Refresh roster
      fetchStudents();
    } catch (err) {
      setFormError(err.response?.data?.message || 'Failed to create student account');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteStudent = async (id, name) => {
    if (!window.confirm(`Are you sure you want to remove the account for "${name}"? This cannot be undone.`)) {
      return;
    }

    try {
      await api.delete(`/auth/admin/students/${id}`);
      setStudents(students.filter((s) => s._id !== id));
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to delete student account');
    }
  };

  const generateRandomPassword = () => {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz23456789@#$';
    let pass = 'Std@';
    for (let i = 0; i < 6; i++) {
      pass += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setFormData((prev) => ({ ...prev, password: pass }));
  };

  const handleCopyCredentials = () => {
    if (!formSuccess) return;
    const text = `CampusResolve Login Credentials:\nName: ${formSuccess.name}\nEmail: ${formSuccess.email}\nPassword: ${formSuccess.password}\nStudent ID: ${formSuccess.studentId || 'N/A'}`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const filteredStudents = students.filter((s) => {
    const q = searchQuery.toLowerCase();
    return (
      s.name?.toLowerCase().includes(q) ||
      s.email?.toLowerCase().includes(q) ||
      s.studentId?.toLowerCase().includes(q) ||
      s.department?.toLowerCase().includes(q)
    );
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 rounded-3xl p-6 sm:p-8 text-white shadow-xl">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-bold uppercase tracking-wider mb-1">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            Access Provisioning
          </div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight">
            Student Account Management
          </h1>
          <p className="text-slate-400 text-sm max-w-xl">
            Add, review, and manage authorized student login credentials. Only students provisioned here can sign in to report campus grievances.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => {
              setFormError('');
              setFormSuccess(null);
              setModalOpen(true);
            }}
            className="inline-flex items-center gap-2 px-5 py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm shadow-lg shadow-emerald-600/30 transition-all cursor-pointer"
          >
            <UserPlus className="w-4 h-4" />
            + Add New Student
          </button>
        </div>
      </div>

      {/* Roster Controls */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        {/* Search Input */}
        <div className="relative w-full sm:w-96">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by student name, roll no, email..."
            className="w-full pl-10 pr-4 py-2.5 text-sm bg-white border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 shadow-sm"
          />
        </div>

        {/* Counter Badge */}
        <div className="text-xs font-semibold text-slate-500 flex items-center gap-2">
          <span>Total Authorized Students:</span>
          <span className="px-2.5 py-1 bg-indigo-100 text-indigo-800 rounded-full font-bold">
            {students.length}
          </span>
        </div>
      </div>

      {/* Students Table */}
      <div className="bg-white rounded-3xl border border-slate-200/80 shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-slate-400 text-sm">
            <div className="w-8 h-8 mx-auto border-3 border-indigo-600 border-t-transparent rounded-full animate-spin mb-3" />
            Loading student roster...
          </div>
        ) : filteredStudents.length === 0 ? (
          <div className="p-12 text-center text-slate-400 text-sm">
            <GraduationCap className="w-10 h-10 mx-auto text-slate-300 mb-2" />
            No students found matching your criteria.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50/50 text-[11px] font-bold uppercase tracking-wider text-slate-500">
                  <th className="py-4 px-6">Student</th>
                  <th className="py-4 px-6">Student / Roll ID</th>
                  <th className="py-4 px-6">Email Address</th>
                  <th className="py-4 px-6">Department</th>
                  <th className="py-4 px-6">Date Added</th>
                  <th className="py-4 px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-sm">
                {filteredStudents.map((student) => (
                  <tr key={student._id} className="hover:bg-slate-50/70 transition-colors">
                    {/* Student Name */}
                    <td className="py-4 px-6 whitespace-nowrap">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-sky-500 to-indigo-600 text-white font-bold text-xs flex items-center justify-center shadow-sm">
                          {student.name?.charAt(0).toUpperCase() || 'S'}
                        </div>
                        <div>
                          <p className="font-bold text-slate-800">{student.name}</p>
                          <span className="text-[11px] text-emerald-600 font-semibold uppercase tracking-wider">
                            Active Student
                          </span>
                        </div>
                      </div>
                    </td>

                    {/* Roll ID */}
                    <td className="py-4 px-6 whitespace-nowrap">
                      <span className="font-mono text-xs font-semibold px-2.5 py-1 bg-slate-100 text-slate-700 rounded-lg border border-slate-200">
                        {student.studentId || 'N/A'}
                      </span>
                    </td>

                    {/* Email */}
                    <td className="py-4 px-6 text-slate-600 font-medium whitespace-nowrap">
                      {student.email}
                    </td>

                    {/* Department */}
                    <td className="py-4 px-6 whitespace-nowrap">
                      <span className="text-xs font-semibold px-2.5 py-1 bg-indigo-50 text-indigo-700 rounded-lg">
                        {student.department || 'General'}
                      </span>
                    </td>

                    {/* Date */}
                    <td className="py-4 px-6 text-xs text-slate-500 whitespace-nowrap">
                      {student.createdAt ? new Date(student.createdAt).toLocaleDateString() : 'N/A'}
                    </td>

                    {/* Delete */}
                    <td className="py-4 px-6 text-right whitespace-nowrap">
                      <button
                        type="button"
                        onClick={() => handleDeleteStudent(student._id, student.name)}
                        title="Remove student account"
                        className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-colors cursor-pointer"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Add Student Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fadeIn">
          <div className="w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-slate-100 p-6 sm:p-8 space-y-6 max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center">
                  <UserPlus className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-black text-slate-800">Add Student Credentials</h3>
                  <p className="text-xs text-slate-500">Provide sign-in access to a specific student</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setModalOpen(false)}
                className="p-2 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Error Message */}
            {formError && (
              <div className="p-3 text-xs font-medium text-rose-700 bg-rose-50 border border-rose-200 rounded-xl flex items-center gap-2">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                <span>{formError}</span>
              </div>
            )}

            {/* Success Card with Credentials Copy Button */}
            {formSuccess && (
              <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-emerald-800 font-bold text-xs uppercase tracking-wider">
                    <Check className="w-4 h-4 text-emerald-600" />
                    Student Account Created!
                  </div>
                  <button
                    type="button"
                    onClick={handleCopyCredentials}
                    className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-bold bg-white text-emerald-700 border border-emerald-300 hover:bg-emerald-100 transition-colors cursor-pointer"
                  >
                    {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                    {copied ? 'Copied!' : 'Copy Credentials'}
                  </button>
                </div>
                <div className="text-xs text-slate-700 space-y-1 font-mono bg-white/70 p-3 rounded-xl border border-emerald-200/60">
                  <p><span className="font-bold text-slate-900">Name:</span> {formSuccess.name}</p>
                  <p><span className="font-bold text-slate-900">Email:</span> {formSuccess.email}</p>
                  <p><span className="font-bold text-slate-900">Password:</span> {formSuccess.password}</p>
                  <p><span className="font-bold text-slate-900">Student ID:</span> {formSuccess.studentId || 'N/A'}</p>
                </div>
              </div>
            )}

            {/* Add Student Form */}
            <form onSubmit={handleCreateStudent} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Student Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
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
                    value={formData.studentId}
                    onChange={(e) => setFormData({ ...formData, studentId: e.target.value })}
                    placeholder="e.g. CS-2024-055"
                    className="w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 font-medium"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Department *
                </label>
                <select
                  value={formData.department}
                  onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                  className="w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 font-medium"
                >
                  {departmentsList.map((dept) => (
                    <option key={dept} value={dept}>
                      {dept}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Email Address (Login Username) *
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="e.g. rahul@college.edu"
                    className="w-full pl-10 pr-4 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 font-medium"
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                    Password *
                  </label>
                  <button
                    type="button"
                    onClick={generateRandomPassword}
                    className="text-[11px] font-bold text-indigo-600 hover:text-indigo-800 underline underline-offset-2 cursor-pointer"
                  >
                    🎲 Generate Password
                  </button>
                </div>
                <div className="relative">
                  <Key className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="text"
                    required
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    placeholder="e.g. Student@123"
                    className="w-full pl-10 pr-4 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 font-medium"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2.5 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer"
                >
                  Close
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-6 py-2.5 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl shadow-md shadow-emerald-600/20 transition-all disabled:opacity-50 cursor-pointer"
                >
                  {submitting ? 'Saving to Database...' : 'Save & Authorize Student'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
