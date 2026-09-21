import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  GraduationCap,
  LayoutDashboard,
  PlusCircle,
  BarChart3,
  LogOut,
  User,
  Menu,
  X,
  ShieldCheck,
  Users,
} from 'lucide-react';

export default function Navbar() {
  const { user, logout, isAdmin, isStudent } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand Logo */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-sky-600 to-indigo-600 flex items-center justify-center text-white shadow-md shadow-sky-500/20 group-hover:scale-105 transition-transform">
              <GraduationCap className="w-6 h-6" />
            </div>
            <div>
              <span className="font-extrabold text-xl tracking-tight bg-gradient-to-r from-sky-700 to-indigo-800 bg-clip-text text-transparent">
                CampusResolve
              </span>
              <span className="hidden sm:block text-[10px] uppercase font-semibold text-slate-400 tracking-wider">
                College Management Portal
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <div className="hidden md:flex items-center gap-1">
            {isStudent && (
              <>
                <Link
                  to="/"
                  className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    isActive('/')
                      ? 'bg-sky-50 text-sky-700 font-semibold'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                  }`}
                >
                  <LayoutDashboard className="w-4 h-4" />
                  My Complaints
                </Link>
                <Link
                  to="/submit"
                  className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    isActive('/submit')
                      ? 'bg-sky-600 text-white font-semibold shadow-sm'
                      : 'bg-sky-50 text-sky-700 hover:bg-sky-100'
                  }`}
                >
                  <PlusCircle className="w-4 h-4" />
                  Submit Complaint
                </Link>
              </>
            )}

            {isAdmin && (
              <>
                <Link
                  to="/"
                  className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    isActive('/')
                      ? 'bg-indigo-50 text-indigo-700 font-semibold'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                  }`}
                >
                  <LayoutDashboard className="w-4 h-4" />
                  Admin Dashboard
                </Link>
                <Link
                  to="/admin/students"
                  className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    isActive('/admin/students')
                      ? 'bg-indigo-50 text-indigo-700 font-semibold'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                  }`}
                >
                  <Users className="w-4 h-4" />
                  Manage Students
                </Link>
                <Link
                  to="/analytics"
                  className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    isActive('/analytics')
                      ? 'bg-indigo-50 text-indigo-700 font-semibold'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                  }`}
                >
                  <BarChart3 className="w-4 h-4" />
                  Analytics & Reports
                </Link>
              </>
            )}
          </div>

          {/* User Profile & Actions */}
          <div className="hidden md:flex items-center gap-3">
            {user ? (
              <div className="flex items-center gap-3 pl-3 border-l border-slate-200">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-full bg-slate-100 border border-slate-300 flex items-center justify-center text-slate-600 font-bold text-xs">
                    {user.name?.charAt(0).toUpperCase() || 'U'}
                  </div>
                  <div className="flex flex-col text-left">
                    <span className="text-sm font-semibold text-slate-800 leading-tight">
                      {user.name}
                    </span>
                    <span className="flex items-center gap-1 text-[11px] font-bold uppercase tracking-wider text-slate-500">
                      {isAdmin ? (
                        <span className="text-indigo-600 flex items-center gap-0.5">
                          <ShieldCheck className="w-3 h-3 inline" /> Admin
                        </span>
                      ) : (
                        <span className="text-sky-600">Student</span>
                      )}
                    </span>
                  </div>
                </div>

                <button
                  onClick={handleLogout}
                  title="Logout"
                  className="p-2 text-slate-500 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <Link
                to="/login"
                className="px-4 py-2 text-sm font-medium text-white bg-sky-600 hover:bg-sky-700 rounded-lg shadow-sm"
              >
                Sign In
              </Link>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="flex md:hidden items-center gap-2">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-slate-600 hover:bg-slate-100"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-200 bg-white px-4 pt-2 pb-4 space-y-2">
          {user && (
            <div className="flex items-center gap-2 py-2 mb-2 border-b border-slate-100">
              <div className="w-8 h-8 rounded-full bg-sky-100 text-sky-700 font-bold flex items-center justify-center text-xs">
                {user.name?.charAt(0).toUpperCase()}
              </div>
              <div>
                <p className="text-sm font-bold text-slate-800">{user.name}</p>
                <p className="text-xs text-slate-500 capitalize">{user.role}</p>
              </div>
            </div>
          )}

          {isStudent && (
            <>
              <Link
                to="/"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 rounded-lg text-base font-medium text-slate-700 hover:bg-slate-100"
              >
                My Complaints
              </Link>
              <Link
                to="/submit"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 rounded-lg text-base font-medium bg-sky-600 text-white"
              >
                + Submit Complaint
              </Link>
            </>
          )}

          {isAdmin && (
            <>
              <Link
                to="/"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 rounded-lg text-base font-medium text-slate-700 hover:bg-slate-100"
              >
                Admin Complaints
              </Link>
              <Link
                to="/admin/students"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 rounded-lg text-base font-medium text-slate-700 hover:bg-slate-100"
              >
                Manage Students
              </Link>
              <Link
                to="/analytics"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 rounded-lg text-base font-medium text-slate-700 hover:bg-slate-100"
              >
                Analytics & Reports
              </Link>
            </>
          )}

          {user ? (
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                handleLogout();
              }}
              className="w-full text-left flex items-center gap-2 px-3 py-2 rounded-lg text-rose-600 font-medium hover:bg-rose-50"
            >
              <LogOut className="w-4 h-4" />
              Sign Out
            </button>
          ) : (
            <Link
              to="/login"
              onClick={() => setMobileMenuOpen(false)}
              className="block w-full text-center px-4 py-2 rounded-lg bg-sky-600 text-white font-medium"
            >
              Sign In
            </Link>
          )}
        </div>
      )}
    </nav>
  );
}
