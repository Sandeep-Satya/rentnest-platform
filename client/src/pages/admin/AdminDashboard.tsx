import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { DashboardMetrics } from '../../types';
import { api } from '../../services/api';
import {
  Building,
  Users,
  FileText,
  DollarSign,
  TrendingUp,
  PlusCircle,
  Share2,
  ArrowRight,
  ShieldCheck,
  PhoneCall,
  Clock,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';

export const AdminDashboard: React.FC = () => {
  const [metrics, setMetrics] = useState<DashboardMetrics | null>(null);
  const [recentEnquiries, setRecentEnquiries] = useState<any[]>([]);
  const [localityStats, setLocalityStats] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchDashboard = () => {
    api.getAdminDashboard()
      .then(res => {
        setMetrics(res.metrics);
        setRecentEnquiries(res.recentEnquiries || []);
        setLocalityStats(res.localityStats || []);
      })
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchDashboard();
  }, []);

  const handleQuickStatusChange = async (enqId: string, newStatus: string) => {
    try {
      await api.updateEnquiryStatus(enqId, { status: newStatus });
      fetchDashboard();
    } catch (err) {
      console.error(err);
    }
  };

  if (loading || !metrics) {
    return (
      <div className="py-12 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-purple-400 flex items-center gap-1.5 mb-1">
            <ShieldCheck className="w-4 h-4" /> Consultant Management System
          </span>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            Consultancy Overview Dashboard
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Real-time pipeline of property listings, tenant leads, and commissions.
          </p>
        </div>

        <div className="flex flex-wrap gap-2.5">
          <Link
            to="/admin/properties/add"
            className="px-4 py-2.5 bg-purple-600 hover:bg-purple-700 text-white font-bold rounded-xl text-xs transition flex items-center gap-2 shadow-lg shadow-purple-600/30"
          >
            <PlusCircle className="w-4 h-4" /> Add New Property
          </Link>
          <Link
            to="/admin/social-studio"
            className="px-4 py-2.5 bg-pink-600 hover:bg-pink-700 text-white font-bold rounded-xl text-xs transition flex items-center gap-2 shadow-lg shadow-pink-600/30"
          >
            <Share2 className="w-4 h-4" /> Instagram Studio
          </Link>
        </div>
      </div>

      {/* KPI METRIC CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {/* Total Properties */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400">Total Properties</span>
            <div className="w-9 h-9 rounded-xl bg-purple-500/10 text-purple-400 flex items-center justify-center">
              <Building className="w-5 h-5" />
            </div>
          </div>
          <div>
            <span className="text-3xl font-black text-white">{metrics.totalProperties}</span>
            <div className="flex items-center gap-2 text-[11px] text-slate-400 mt-1">
              <span className="text-emerald-400 font-bold">{metrics.availableProperties} Available</span>
              <span>•</span>
              <span className="text-amber-400 font-bold">{metrics.underDiscussionProperties} In Talk</span>
              <span>•</span>
              <span className="text-slate-500 font-bold">{metrics.occupiedProperties} Done</span>
            </div>
          </div>
        </div>

        {/* Active Enquiries / Leads */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400">Tenant Leads</span>
            <div className="w-9 h-9 rounded-xl bg-blue-500/10 text-blue-400 flex items-center justify-center">
              <FileText className="w-5 h-5" />
            </div>
          </div>
          <div>
            <span className="text-3xl font-black text-white">{metrics.totalEnquiries}</span>
            <div className="flex items-center gap-2 text-[11px] text-slate-400 mt-1">
              <span className="text-rose-400 font-bold">{metrics.newEnquiries} New</span>
              <span>•</span>
              <span className="text-blue-400 font-bold">{metrics.inProgressEnquiries} In Progress</span>
              <span>•</span>
              <span className="text-emerald-400 font-bold">{metrics.completedEnquiries} Closed</span>
            </div>
          </div>
        </div>

        {/* Customers & Owners CRM */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400">Network Directory</span>
            <div className="w-9 h-9 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
              <Users className="w-5 h-5" />
            </div>
          </div>
          <div>
            <span className="text-3xl font-black text-white">{metrics.totalCustomers + metrics.totalOwners}</span>
            <div className="flex items-center gap-2 text-[11px] text-slate-400 mt-1">
              <span className="text-slate-200 font-bold">{metrics.totalCustomers} Registered Tenants</span>
              <span>•</span>
              <span className="text-emerald-400 font-bold">{metrics.totalOwners} Owners</span>
            </div>
          </div>
        </div>

        {/* Total Commission Earned */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400">Total Commissions</span>
            <div className="w-9 h-9 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center">
              <DollarSign className="w-5 h-5" />
            </div>
          </div>
          <div>
            <span className="text-3xl font-black text-emerald-400">
              ₹{metrics.totalCommission.toLocaleString('en-IN')}
            </span>
            <p className="text-[11px] text-slate-400 mt-1">
              From {metrics.completedEnquiries} closed rental agreements
            </p>
          </div>
        </div>
      </div>

      {/* 2-COLUMN SECTION: Recent Leads & Locality Stats */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* RECENT LEADS PIPELINE (2 cols) */}
        <div className="lg:col-span-2 bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-white">Recent Customer Leads & Enquiries</h3>
              <p className="text-xs text-slate-400">Latest interest requests requiring consultant action</p>
            </div>
            <Link
              to="/admin/enquiries"
              className="text-xs font-bold text-purple-400 hover:text-purple-300 flex items-center gap-1"
            >
              All Leads <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="space-y-3">
            {recentEnquiries.map(enq => (
              <div
                key={enq.id}
                className="bg-slate-950/80 border border-slate-800/80 rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-purple-400">{enq.enquiry_code}</span>
                    <span className="text-xs text-slate-400">• {enq.customer_name}</span>
                    <a
                      href={`tel:${enq.customer_phone}`}
                      className="text-[11px] text-slate-400 hover:text-emerald-400 flex items-center gap-1"
                    >
                      <PhoneCall className="w-3 h-3" /> {enq.customer_phone}
                    </a>
                  </div>
                  <h4 className="text-sm font-semibold text-white">
                    {enq.bhk} BHK in {enq.locality} (₹{enq.rent?.toLocaleString('en-IN')}/mo)
                  </h4>
                  <p className="text-xs text-slate-400 truncate max-w-md">
                    Ref: {enq.prop_code} - {enq.property_title}
                  </p>
                </div>

                <div className="flex items-center gap-2 flex-shrink-0">
                  <select
                    value={enq.status}
                    onChange={e => handleQuickStatusChange(enq.id, e.target.value)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold border focus:outline-none cursor-pointer ${
                      enq.status === 'new'
                        ? 'bg-rose-950/60 border-rose-800 text-rose-300'
                        : enq.status === 'visit_scheduled'
                        ? 'bg-amber-950/60 border-amber-800 text-amber-300'
                        : enq.status === 'completed'
                        ? 'bg-emerald-950/60 border-emerald-800 text-emerald-300'
                        : 'bg-blue-950/60 border-blue-800 text-blue-300'
                    }`}
                  >
                    <option value="new">🔴 New Lead</option>
                    <option value="contacted">🟡 Contacted</option>
                    <option value="property_shared">🔵 Property Shared</option>
                    <option value="visit_scheduled">🟠 Visit Scheduled</option>
                    <option value="negotiation">🟣 Negotiation</option>
                    <option value="completed">🟢 Completed (Closed)</option>
                    <option value="cancelled">⚫ Cancelled</option>
                  </select>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* LOCALITY DEMAND STATS (1 col) */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-6">
          <div>
            <h3 className="text-base font-bold text-white">Top Rental Hubs</h3>
            <p className="text-xs text-slate-400">Inventory & Average Rentals</p>
          </div>

          <div className="space-y-4">
            {localityStats.map(loc => (
              <div key={loc.locality} className="p-3 bg-slate-950/80 rounded-2xl border border-slate-800 space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-white">{loc.locality}</span>
                  <span className="text-purple-400 font-semibold">{loc.count} Properties</span>
                </div>
                <div className="flex items-center justify-between text-[11px] text-slate-400">
                  <span>Avg Rent:</span>
                  <span className="font-bold text-emerald-400">₹{Math.round(loc.avg_rent).toLocaleString('en-IN')}/mo</span>
                </div>
              </div>
            ))}
          </div>

          <div className="p-4 bg-purple-950/40 rounded-2xl border border-purple-900/60 text-xs space-y-2">
            <span className="font-bold text-purple-300 flex items-center gap-1.5">
              <TrendingUp className="w-4 h-4" /> Marketing Tip:
            </span>
            <p className="text-slate-300 leading-relaxed">
              Madhapur & Gachibowli listings receive 4x faster tenant enquiries through Instagram reels. Use Social Studio to create daily posts.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
