import React from 'react';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  LayoutDashboard,
  Building,
  PlusCircle,
  Users,
  UserCheck,
  FileSpreadsheet,
  Share2,
  DollarSign,
  ArrowLeft,
  LogOut,
  ShieldCheck,
  Sparkles,
  PhoneCall
} from 'lucide-react';

export const AdminLayout: React.FC = () => {
  const { user, logout, demoLogin } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  // Redirect if not admin
  if (!user || user.role !== 'admin') {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4">
        <div className="bg-slate-800 border border-slate-700 rounded-3xl p-8 max-w-md w-full text-center space-y-4 text-white shadow-2xl">
          <div className="w-14 h-14 rounded-2xl bg-amber-500/20 text-amber-400 flex items-center justify-center mx-auto">
            <ShieldCheck className="w-8 h-8" />
          </div>
          <h2 className="text-xl font-bold">Admin Privileges Required</h2>
          <p className="text-sm text-slate-400">
            You must be logged in as an authorized rental consultant to access the admin management portal.
          </p>
          <div className="space-y-2 pt-2">
            <button
              onClick={() => demoLogin('admin')}
              className="w-full py-3 bg-purple-600 hover:bg-purple-700 text-white font-bold rounded-xl transition text-sm flex items-center justify-center gap-2"
            >
              <Sparkles className="w-4 h-4" /> 1-Click Login as Admin Consultant
            </button>
            <Link
              to="/"
              className="block w-full py-2.5 bg-slate-700 hover:bg-slate-600 text-slate-300 font-medium rounded-xl transition text-xs"
            >
              Return to Customer Website
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const navItems = [
    { label: 'Overview Dashboard', path: '/admin', icon: LayoutDashboard },
    { label: 'Manage Properties', path: '/admin/properties', icon: Building },
    { label: 'Add New Property', path: '/admin/properties/add', icon: PlusCircle },
    { label: 'Enquiry Leads & Pipeline', path: '/admin/enquiries', icon: FileSpreadsheet },
    { label: 'Property Owners CRM', path: '/admin/owners', icon: UserCheck },
    { label: 'Customer Requirements', path: '/admin/customers', icon: Users },
    { label: 'Instagram & Social Studio', path: '/admin/social-studio', icon: Share2 },
    { label: 'Commission & Revenue', path: '/admin/commissions', icon: DollarSign },
  ];

  const isActive = (path: string) => {
    if (path === '/admin') return location.pathname === '/admin';
    return location.pathname.startsWith(path);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col md:flex-row">
      {/* Sidebar */}
      <aside className="w-full md:w-64 bg-slate-900 border-r border-slate-800 flex flex-col justify-between p-4 flex-shrink-0">
        <div>
          {/* Logo & Role Badge */}
          <div className="p-3 mb-6 bg-slate-950/60 rounded-2xl border border-slate-800/80">
            <div className="flex items-center gap-2.5 mb-2">
              <div className="w-9 h-9 rounded-xl bg-purple-600 text-white flex items-center justify-center font-bold shadow-lg shadow-purple-600/30">
                RN
              </div>
              <div>
                <span className="font-bold text-white tracking-tight text-base">RentNest</span>
                <span className="block text-[10px] uppercase font-bold text-purple-400 tracking-wider">
                  Consultant Portal
                </span>
              </div>
            </div>
            <div className="flex items-center gap-1.5 text-xs text-slate-400 bg-slate-900 px-2.5 py-1 rounded-lg">
              <ShieldCheck className="w-3.5 h-3.5 text-purple-400" />
              <span className="truncate">{user.name}</span>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="space-y-1">
            {navItems.map(item => {
              const Icon = item.icon;
              const active = isActive(item.path);
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition ${
                    active
                      ? 'bg-purple-600 text-white shadow-lg shadow-purple-600/25'
                      : 'text-slate-400 hover:text-white hover:bg-slate-800/80'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Bottom Actions */}
        <div className="pt-6 border-t border-slate-800/80 space-y-2">
          <Link
            to="/"
            className="flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-medium text-slate-400 hover:text-white hover:bg-slate-800 transition"
          >
            <ArrowLeft className="w-4 h-4 text-emerald-400" />
            Switch to Public Website
          </Link>
          <button
            onClick={() => {
              logout();
              navigate('/');
            }}
            className="w-full flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-medium text-rose-400 hover:text-rose-300 hover:bg-rose-950/40 transition text-left"
          >
            <LogOut className="w-4 h-4" />
            Sign Out Admin
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 bg-slate-950 min-h-screen overflow-x-hidden">
        <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto">
          <Outlet />
        </div>
      </main>
    </div>
  );
};
