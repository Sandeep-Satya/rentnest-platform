import React, { useEffect, useState } from 'react';
import { Enquiry } from '../../types';
import { api } from '../../services/api';
import {
  FileSpreadsheet,
  Search,
  Phone,
  Send,
  Calendar,
  CheckCircle2,
  Lock,
  DollarSign,
  Building,
  User,
  LayoutGrid,
  List,
  Edit,
  Clock,
  Sparkles
} from 'lucide-react';

const PIPELINE_STAGES = [
  { key: 'new', label: 'New Leads', color: 'border-rose-500 bg-rose-950/20 text-rose-300' },
  { key: 'contacted', label: 'Contacted', color: 'border-amber-500 bg-amber-950/20 text-amber-300' },
  { key: 'property_shared', label: 'Property Shared', color: 'border-blue-500 bg-blue-950/20 text-blue-300' },
  { key: 'visit_scheduled', label: 'Visit Scheduled', color: 'border-purple-500 bg-purple-950/20 text-purple-300' },
  { key: 'negotiation', label: 'Negotiation', color: 'border-indigo-500 bg-indigo-950/20 text-indigo-300' },
  { key: 'completed', label: 'Closed Deal', color: 'border-emerald-500 bg-emerald-950/20 text-emerald-300' },
];

export const AdminEnquiries: React.FC = () => {
  const [enquiries, setEnquiries] = useState<Enquiry[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [viewMode, setViewMode] = useState<'table' | 'kanban'>('kanban');

  // Modal for editing consultant notes & closing deal
  const [selectedEnquiry, setSelectedEnquiry] = useState<Enquiry | null>(null);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editStatus, setEditStatus] = useState('new');
  const [editNotes, setEditNotes] = useState('');
  const [editCommission, setEditCommission] = useState<number>(0);
  const [editOwnerShared, setEditOwnerShared] = useState<boolean>(false);
  const [updating, setUpdating] = useState(false);

  const fetchEnquiries = () => {
    setLoading(true);
    api.getAdminEnquiries()
      .then(res => setEnquiries(res.enquiries || []))
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchEnquiries();
  }, []);

  const openEditModal = (enq: Enquiry) => {
    setSelectedEnquiry(enq);
    setEditStatus(enq.status);
    setEditNotes(enq.consultant_notes || '');
    setEditCommission(enq.commission_amount || 0);
    setEditOwnerShared(!!enq.owner_details_shared);
    setEditModalOpen(true);
  };

  const handleSaveEnquiry = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedEnquiry) return;
    setUpdating(true);
    try {
      await api.updateEnquiryStatus(selectedEnquiry.id, {
        status: editStatus,
        consultant_notes: editNotes,
        commission_amount: editCommission,
        owner_details_shared: editOwnerShared
      });
      setEditModalOpen(false);
      fetchEnquiries();
    } catch (err) {
      console.error(err);
    } finally {
      setUpdating(false);
    }
  };

  const handleWhatsAppCustomer = (enq: Enquiry) => {
    const text = encodeURIComponent(
      `Hello ${enq.customer_name}, this is Vikram from RentNest Consultancy regarding your interest in property ${enq.prop_code} (${enq.bhk} BHK in ${enq.locality}). When would be a good time to speak?`
    );
    window.open(`https://wa.me/${enq.customer_phone.replace(/[^0-9]/g, '')}?text=${text}`, '_blank');
  };

  const filteredEnquiries = enquiries.filter(e =>
    e.customer_name.toLowerCase().includes(search.toLowerCase()) ||
    e.customer_phone.includes(search) ||
    e.enquiry_code.toLowerCase().includes(search.toLowerCase()) ||
    (e.property_title && e.property_title.toLowerCase().includes(search.toLowerCase())) ||
    (e.locality && e.locality.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            Tenant Leads & Enquiry Pipeline
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Manage stage progressions, schedule owner visits, and log closed commissions.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex items-center bg-slate-900 p-1 rounded-xl border border-slate-800">
            <button
              onClick={() => setViewMode('kanban')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 ${
                viewMode === 'kanban' ? 'bg-purple-600 text-white' : 'text-slate-400 hover:text-white'
              }`}
            >
              <LayoutGrid className="w-3.5 h-3.5" /> Kanban Pipeline
            </button>
            <button
              onClick={() => setViewMode('table')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 ${
                viewMode === 'table' ? 'bg-purple-600 text-white' : 'text-slate-400 hover:text-white'
              }`}
            >
              <List className="w-3.5 h-3.5" /> Table View
            </button>
          </div>
        </div>
      </div>

      {/* Search Bar */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4">
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
          <input
            type="text"
            placeholder="Search leads by customer name, phone, enquiry code or property..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs font-medium text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
        </div>
      </div>

      {/* KANBAN BOARD VIEW */}
      {viewMode === 'kanban' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 overflow-x-auto pb-4">
          {PIPELINE_STAGES.map(stage => {
            const stageLeads = filteredEnquiries.filter(e => e.status === stage.key);
            return (
              <div
                key={stage.key}
                className="bg-slate-900 border border-slate-800 rounded-3xl p-4 flex flex-col min-w-[240px]"
              >
                {/* Column Header */}
                <div className={`p-2.5 rounded-2xl border mb-3 flex items-center justify-between ${stage.color}`}>
                  <span className="text-xs font-bold">{stage.label}</span>
                  <span className="w-5 h-5 rounded-full bg-slate-900/80 text-[11px] font-black flex items-center justify-center">
                    {stageLeads.length}
                  </span>
                </div>

                {/* Lead Cards */}
                <div className="space-y-3 flex-1 overflow-y-auto max-h-[70vh]">
                  {stageLeads.map(enq => (
                    <div
                      key={enq.id}
                      onClick={() => openEditModal(enq)}
                      className="p-3.5 bg-slate-950 rounded-2xl border border-slate-800/90 hover:border-purple-500/80 transition-all cursor-pointer space-y-2 shadow-sm group"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-bold text-purple-400">
                          {enq.enquiry_code}
                        </span>
                        <span className="text-[10px] text-slate-500">
                          {new Date(enq.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
                        </span>
                      </div>

                      <div>
                        <h4 className="font-bold text-white text-xs group-hover:text-purple-300 transition">
                          {enq.customer_name}
                        </h4>
                        <p className="text-[11px] text-emerald-400 font-semibold">
                          {enq.customer_phone}
                        </p>
                      </div>

                      <div className="p-2 bg-slate-900 rounded-xl text-[10px] text-slate-300 space-y-0.5 border border-slate-800/80">
                        <span className="font-bold text-white block truncate">
                          {enq.prop_code} • {enq.bhk} BHK ({enq.locality})
                        </span>
                        <span className="text-emerald-400 font-bold block">
                          ₹{enq.rent?.toLocaleString('en-IN')}/mo
                        </span>
                      </div>

                      {enq.consultant_notes && (
                        <p className="text-[10px] text-slate-400 line-clamp-2 italic bg-slate-900/50 p-1.5 rounded-lg">
                          "{enq.consultant_notes}"
                        </p>
                      )}

                      {/* Quick WhatsApp Action */}
                      <div className="pt-1 flex items-center justify-between border-t border-slate-900 text-[10px]">
                        <button
                          type="button"
                          onClick={e => {
                            e.stopPropagation();
                            handleWhatsAppCustomer(enq);
                          }}
                          className="text-emerald-400 hover:underline flex items-center gap-1 font-semibold"
                        >
                          <Send className="w-3 h-3" /> WhatsApp
                        </button>

                        {enq.owner_details_shared ? (
                          <span className="text-emerald-400 font-bold">✓ Owner Sent</span>
                        ) : (
                          <span className="text-amber-500">🔒 Private</span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* TABLE VIEW */
        <div className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="bg-slate-950/80 text-slate-400 font-bold uppercase tracking-wider border-b border-slate-800 text-[10px]">
                <tr>
                  <th className="p-4">Lead Ref</th>
                  <th className="p-4">Customer Details</th>
                  <th className="p-4">Interested Property</th>
                  <th className="p-4">Visit Preference</th>
                  <th className="p-4">Owner Info Status</th>
                  <th className="p-4">Stage</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/80">
                {filteredEnquiries.map(enq => (
                  <tr key={enq.id} className="hover:bg-slate-800/40 transition">
                    <td className="p-4">
                      <span className="px-2 py-1 bg-purple-950 text-purple-300 rounded font-bold text-xs">
                        {enq.enquiry_code}
                      </span>
                    </td>
                    <td className="p-4 space-y-0.5">
                      <span className="font-bold text-white block">{enq.customer_name}</span>
                      <a href={`tel:${enq.customer_phone}`} className="text-emerald-400 font-semibold hover:underline block">
                        {enq.customer_phone}
                      </a>
                    </td>
                    <td className="p-4 space-y-0.5">
                      <span className="font-bold text-white block">{enq.prop_code} - {enq.property_title}</span>
                      <span className="text-slate-400">{enq.bhk} BHK • ₹{enq.rent?.toLocaleString('en-IN')}/mo in {enq.locality}</span>
                    </td>
                    <td className="p-4 text-slate-300">
                      <p>{enq.preferred_visit_date || 'Flexible'}</p>
                      <span className="text-[10px] text-slate-500">{enq.preferred_contact_time}</span>
                    </td>
                    <td className="p-4">
                      {enq.owner_details_shared ? (
                        <span className="px-2 py-0.5 bg-emerald-950 text-emerald-300 rounded font-bold text-[11px]">
                          ✓ Shared with Tenant
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 bg-amber-950 text-amber-400 rounded font-medium text-[11px]">
                          🔒 Owner Protected
                        </span>
                      )}
                    </td>
                    <td className="p-4">
                      <span className="capitalize font-semibold text-purple-400">{enq.status.replace('_', ' ')}</span>
                    </td>
                    <td className="p-4 text-right">
                      <button
                        onClick={() => openEditModal(enq)}
                        className="px-3 py-1.5 bg-purple-600 hover:bg-purple-700 text-white rounded-lg text-xs font-bold transition"
                      >
                        Manage Lead
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* LEAD MANAGEMENT & COMMISSION MODAL */}
      {editModalOpen && selectedEnquiry && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-lg w-full p-6 sm:p-8 space-y-6 text-white shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div>
                <span className="text-xs font-bold text-purple-400">{selectedEnquiry.enquiry_code}</span>
                <h3 className="text-lg font-bold">Manage Lead: {selectedEnquiry.customer_name}</h3>
              </div>
              <button onClick={() => setEditModalOpen(false)} className="text-slate-400 hover:text-white">
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveEnquiry} className="space-y-4">
              {/* Pipeline Stage Selector */}
              <div>
                <label className="block text-xs font-bold uppercase text-slate-300 mb-1">
                  Pipeline Stage
                </label>
                <select
                  value={editStatus}
                  onChange={e => setEditStatus(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs font-bold text-white focus:ring-2 focus:ring-purple-500 focus:outline-none"
                >
                  <option value="new">🔴 New Lead</option>
                  <option value="contacted">🟡 Contacted & Requirements Verified</option>
                  <option value="property_shared">🔵 Property Details & Video Walkthrough Shared</option>
                  <option value="visit_scheduled">🟠 Physical Site Visit Scheduled</option>
                  <option value="negotiation">🟣 Deal Negotiation & Agreement Draft</option>
                  <option value="completed">🟢 Completed (Closed Deal & Service Fee Received)</option>
                  <option value="cancelled">⚫ Cancelled / Inactive</option>
                </select>
              </div>

              {/* Private Owner Info Quick View */}
              <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 space-y-1 text-xs">
                <span className="text-amber-400 font-bold flex items-center gap-1">
                  <Lock className="w-3.5 h-3.5" /> Confidential Owner Details:
                </span>
                <p className="text-slate-300">
                  Owner: <strong>{selectedEnquiry.owner_name || 'Mr. Ramana Rao'}</strong> • Phone: <strong className="text-emerald-400">{selectedEnquiry.owner_phone || '+91 94401 23456'}</strong>
                </p>
              </div>

              {/* Toggle Share Owner Contact */}
              <label className="flex items-center gap-2 text-xs text-slate-300 p-3 bg-slate-950 rounded-xl border border-slate-800 cursor-pointer">
                <input
                  type="checkbox"
                  checked={editOwnerShared}
                  onChange={e => setEditOwnerShared(e.target.checked)}
                  className="rounded bg-slate-900 border-slate-700 text-purple-600 focus:ring-purple-500"
                />
                <span>Mark Owner Contact Details as Shared with Tenant</span>
              </label>

              {/* Consultant Notes */}
              <div>
                <label className="block text-xs font-bold uppercase text-slate-300 mb-1">
                  Consultant Notes & Visit Updates
                </label>
                <textarea
                  rows={3}
                  placeholder="e.g. Spoke with tenant. Visit arranged for Saturday 4 PM. Owner informed."
                  value={editNotes}
                  onChange={e => setEditNotes(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:ring-2 focus:ring-purple-500 focus:outline-none"
                />
              </div>

              {/* Commission Amount if Closing Deal */}
              {editStatus === 'completed' && (
                <div className="p-4 bg-emerald-950/50 border border-emerald-800 rounded-2xl space-y-2">
                  <span className="text-xs font-bold text-emerald-300 flex items-center gap-1.5">
                    <DollarSign className="w-4 h-4" /> Service Fee / Commission Earned (₹)
                  </span>
                  <input
                    type="number"
                    step="500"
                    placeholder="e.g. 12500"
                    value={editCommission}
                    onChange={e => setEditCommission(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-sm font-bold text-emerald-400 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  />
                  <p className="text-[10px] text-emerald-400/80">
                    Marking as completed will also set property status to "Occupied".
                  </p>
                </div>
              )}

              <div className="pt-3 flex items-center justify-end gap-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setEditModalOpen(false)}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs font-bold transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={updating}
                  className="px-6 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-xl text-xs font-bold shadow-md transition disabled:opacity-50"
                >
                  {updating ? 'Saving...' : 'Update Lead'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
