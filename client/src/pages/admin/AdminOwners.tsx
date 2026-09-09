import React, { useEffect, useState } from 'react';
import { PropertyOwner } from '../../types';
import { api } from '../../services/api';
import {
  UserCheck,
  PlusCircle,
  Phone,
  Mail,
  Building,
  DollarSign,
  Lock,
  Search,
  CheckCircle2
} from 'lucide-react';

export const AdminOwners: React.FC = () => {
  const [owners, setOwners] = useState<PropertyOwner[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [addModalOpen, setAddModalOpen] = useState(false);

  // Form State
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [notes, setNotes] = useState('');
  const [commissionTerms, setCommissionTerms] = useState('15 Days Rent upon agreement');
  const [saving, setSaving] = useState(false);

  const fetchOwners = () => {
    setLoading(true);
    api.getAdminOwners()
      .then(res => setOwners(res.owners || []))
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchOwners();
  }, []);

  const handleAddOwner = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !phone.trim()) return;
    setSaving(true);
    try {
      await api.createOwner({ name, phone, email, notes, commission_terms: commissionTerms });
      setAddModalOpen(false);
      setName('');
      setPhone('');
      setEmail('');
      setNotes('');
      fetchOwners();
    } catch (err) {
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  const filteredOwners = owners.filter(o =>
    o.name.toLowerCase().includes(search.toLowerCase()) ||
    o.phone.includes(search) ||
    (o.notes && o.notes.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            Property Owners CRM
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Private registry of property owners, contact details, commission agreements, and notes.
          </p>
        </div>

        <button
          onClick={() => setAddModalOpen(true)}
          className="px-4 py-2.5 bg-purple-600 hover:bg-purple-700 text-white font-bold rounded-xl text-xs transition flex items-center gap-2 shadow-lg shadow-purple-600/30 w-fit"
        >
          <PlusCircle className="w-4 h-4" /> Add Property Owner
        </button>
      </div>

      {/* Search */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4">
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
          <input
            type="text"
            placeholder="Search owners by name, phone, notes..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs font-medium text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
        </div>
      </div>

      {/* Owners Directory Grid */}
      {loading ? (
        <div className="p-12 text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-500 mx-auto"></div>
        </div>
      ) : filteredOwners.length === 0 ? (
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-12 text-center text-slate-400">
          No owners found matching your search.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredOwners.map(owner => (
            <div
              key={owner.id}
              className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-4 shadow-lg hover:border-purple-500/50 transition flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h3 className="font-bold text-white text-base">{owner.name}</h3>
                    <span className="text-[10px] text-purple-400 font-bold uppercase tracking-wider">
                      Verified Owner
                    </span>
                  </div>
                  <span className="px-2.5 py-1 bg-purple-950 text-purple-300 border border-purple-800 rounded-lg text-xs font-bold">
                    {owner.property_count || 0} Listed Properties
                  </span>
                </div>

                <div className="space-y-1.5 text-xs text-slate-300">
                  <div className="flex items-center gap-2">
                    <Phone className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />
                    <a href={`tel:${owner.phone}`} className="text-emerald-400 font-semibold hover:underline">
                      {owner.phone}
                    </a>
                  </div>
                  {owner.email && (
                    <div className="flex items-center gap-2">
                      <Mail className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
                      <span>{owner.email}</span>
                    </div>
                  )}
                </div>

                <div className="p-3 bg-slate-950 rounded-2xl border border-slate-800 space-y-1 text-xs">
                  <span className="text-[11px] font-bold text-amber-400 flex items-center gap-1">
                    <DollarSign className="w-3.5 h-3.5" /> Commission Agreement:
                  </span>
                  <p className="text-white font-medium">
                    {owner.commission_terms || '15 Days Rent upon agreement'}
                  </p>
                </div>

                {owner.notes && (
                  <p className="text-xs text-slate-400 italic bg-slate-950/60 p-2.5 rounded-xl border border-slate-800/80">
                    "{owner.notes}"
                  </p>
                )}
              </div>

              <div className="pt-3 border-t border-slate-800 flex items-center justify-between text-xs">
                <span className="text-slate-500 text-[11px]">
                  Registered: {new Date(owner.created_at).toLocaleDateString('en-IN', { month: 'short', year: 'numeric' })}
                </span>
                <a
                  href={`https://wa.me/${owner.phone.replace(/[^0-9]/g, '')}`}
                  target="_blank"
                  rel="noreferrer"
                  className="px-3 py-1.5 bg-emerald-600/20 text-emerald-400 hover:bg-emerald-600/30 rounded-xl font-bold transition flex items-center gap-1 text-[11px]"
                >
                  <Phone className="w-3 h-3" /> WhatsApp Owner
                </a>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add Owner Modal */}
      {addModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-md w-full p-6 sm:p-8 space-y-6 text-white shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="text-lg font-bold">Add New Property Owner</h3>
              <button onClick={() => setAddModalOpen(false)} className="text-slate-400 hover:text-white">✕</button>
            </div>

            <form onSubmit={handleAddOwner} className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase text-slate-300 mb-1">Owner Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. S. K. Venkatesh"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-slate-300 mb-1">Phone / WhatsApp *</label>
                <input
                  type="tel"
                  required
                  placeholder="e.g. +91 98490 99887"
                  value={phone}
                  onChange={e => setPhone(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs font-semibold text-emerald-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-slate-300 mb-1">Email (Optional)</label>
                <input
                  type="email"
                  placeholder="e.g. venkatesh@gmail.com"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-slate-300 mb-1">Commission Terms</label>
                <input
                  type="text"
                  placeholder="e.g. 15 Days Rent upon token advance"
                  value={commissionTerms}
                  onChange={e => setCommissionTerms(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs font-semibold text-amber-300 focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-slate-300 mb-1">Internal Notes</label>
                <textarea
                  rows={2}
                  placeholder="Owner preferences, background notes..."
                  value={notes}
                  onChange={e => setNotes(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>

              <div className="pt-3 flex items-center justify-end gap-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setAddModalOpen(false)}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-6 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-xl text-xs font-bold shadow-md disabled:opacity-50"
                >
                  {saving ? 'Saving...' : 'Add Owner'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
