import React, { useEffect, useState } from 'react';
import { api } from '../../services/api';
import {
  Users,
  Search,
  MapPin,
  Clock,
  Sparkles,
  Phone,
  Mail,
  Building,
  Heart,
  FileText
} from 'lucide-react';

export const AdminCustomers: React.FC = () => {
  const [customers, setCustomers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    api.getAdminCustomers()
      .then(res => setCustomers(res.customers || []))
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  const filteredCustomers = customers.filter(c =>
    c.name.toLowerCase().includes(search.toLowerCase()) ||
    c.email.toLowerCase().includes(search.toLowerCase()) ||
    (c.phone && c.phone.includes(search)) ||
    (c.preferred_areas && c.preferred_areas.some((a: string) => a.toLowerCase().includes(search.toLowerCase())))
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
          Customer & Tenant CRM
        </h1>
        <p className="text-xs text-slate-400 mt-1">
          Registered tenants and their saved house requirement profiles.
        </p>
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4">
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
          <input
            type="text"
            placeholder="Search customers by name, phone, email or locality preference..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs font-medium text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
        </div>
      </div>

      {loading ? (
        <div className="p-12 text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-500 mx-auto"></div>
        </div>
      ) : filteredCustomers.length === 0 ? (
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-12 text-center text-slate-400">
          No registered customer records found.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredCustomers.map(cust => (
            <div
              key={cust.id}
              className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-4 shadow-lg flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="flex items-start justify-between">
                  <div className="space-y-0.5">
                    <h3 className="font-bold text-white text-base">{cust.name}</h3>
                    <p className="text-xs text-slate-400">{cust.email}</p>
                    {cust.phone && (
                      <a href={`tel:${cust.phone}`} className="text-xs text-emerald-400 font-semibold hover:underline block">
                        {cust.phone}
                      </a>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-1 bg-blue-950 text-blue-300 border border-blue-800 rounded-lg text-xs font-bold flex items-center gap-1">
                      <FileText className="w-3 h-3" /> {cust.total_enquiries} Leads
                    </span>
                    <span className="px-2.5 py-1 bg-rose-950 text-rose-300 border border-rose-800 rounded-lg text-xs font-bold flex items-center gap-1">
                      <Heart className="w-3 h-3" /> {cust.total_favorites} Saved
                    </span>
                  </div>
                </div>

                {/* Submitted Requirements Profile */}
                {cust.preferred_city ? (
                  <div className="p-3.5 bg-slate-950 rounded-2xl border border-slate-800 space-y-2 text-xs">
                    <div className="flex items-center justify-between text-[11px] font-bold text-purple-400 pb-1 border-b border-slate-900">
                      <span className="flex items-center gap-1">
                        <Sparkles className="w-3 h-3 text-amber-400" /> House Requirement Profile
                      </span>
                      <span className="text-slate-400">{cust.tenant_type}</span>
                    </div>

                    <div className="grid grid-cols-2 gap-2 text-[11px]">
                      <div>
                        <span className="text-slate-500 block">Preferred BHK:</span>
                        <span className="font-bold text-white">
                          {cust.bhk_list && cust.bhk_list.length > 0 ? cust.bhk_list.join(', ') + ' BHK' : 'Any'}
                        </span>
                      </div>
                      <div>
                        <span className="text-slate-500 block">Budget:</span>
                        <span className="font-bold text-emerald-400">
                          ₹{cust.min_rent?.toLocaleString('en-IN')} - ₹{cust.max_rent?.toLocaleString('en-IN')}
                        </span>
                      </div>
                      <div>
                        <span className="text-slate-500 block">Areas:</span>
                        <span className="font-medium text-slate-300">
                          {cust.preferred_areas && cust.preferred_areas.length > 0 ? cust.preferred_areas.join(', ') : 'Any'}
                        </span>
                      </div>
                      <div>
                        <span className="text-slate-500 block">Parking:</span>
                        <span className="font-medium text-slate-300">{cust.parking_needed || 'Bike'}</span>
                      </div>
                    </div>

                    {cust.other_notes && (
                      <p className="text-[11px] text-slate-400 italic pt-1 border-t border-slate-900">
                        "{cust.other_notes}"
                      </p>
                    )}
                  </div>
                ) : (
                  <div className="p-3 bg-slate-950/60 rounded-xl text-center text-xs text-slate-500 italic">
                    Has not submitted detailed house requirements questionnaire yet.
                  </div>
                )}
              </div>

              <div className="pt-3 border-t border-slate-800 flex items-center justify-between text-xs">
                <span className="text-slate-500 text-[11px]">
                  Joined: {new Date(cust.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                </span>
                {cust.phone && (
                  <a
                    href={`https://wa.me/${cust.phone.replace(/[^0-9]/g, '')}`}
                    target="_blank"
                    rel="noreferrer"
                    className="px-3 py-1.5 bg-emerald-600/20 text-emerald-400 hover:bg-emerald-600/30 rounded-xl font-bold transition flex items-center gap-1 text-[11px]"
                  >
                    <Phone className="w-3 h-3" /> WhatsApp Tenant
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
