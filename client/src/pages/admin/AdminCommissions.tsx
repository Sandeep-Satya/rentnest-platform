import React, { useEffect, useState } from 'react';
import { api } from '../../services/api';
import { DollarSign, Building } from 'lucide-react';

export const AdminCommissions: React.FC = () => {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.getCommissions()
      .then(res => setData(res))
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  if (loading || !data) {
    return (
      <div className="py-12 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
          Commission & Revenue Tracker
        </h1>
        <p className="text-xs text-slate-400 mt-1">
          Financial ledger of successfully closed deals and consultancy service fees collected.
        </p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 space-y-2">
          <span className="text-xs font-bold uppercase text-slate-400">Total Revenue Earned</span>
          <div className="text-3xl font-black text-emerald-400">
            ₹{data.totalEarned.toLocaleString('en-IN')}
          </div>
          <span className="text-[11px] text-slate-500">From finalized tenancy agreements</span>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 space-y-2">
          <span className="text-xs font-bold uppercase text-slate-400">Closed Rental Deals</span>
          <div className="text-3xl font-black text-purple-400">
            {data.closedDealsCount} Deals
          </div>
          <span className="text-[11px] text-slate-500">Successful tenant-owner connections</span>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 space-y-2">
          <span className="text-xs font-bold uppercase text-slate-400">Deals in Pipeline</span>
          <div className="text-3xl font-black text-amber-400">
            {data.pendingDeals} Active
          </div>
          <span className="text-[11px] text-slate-500">In negotiation or visit stage</span>
        </div>
      </div>

      {/* Deals Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden">
        <div className="p-4 border-b border-slate-800 flex items-center justify-between">
          <h3 className="font-bold text-white text-sm">Closed Deals Ledger</h3>
          <span className="text-xs text-purple-400 font-semibold">{data.deals.length} Recorded Closures</span>
        </div>

        {data.deals.length === 0 ? (
          <div className="p-12 text-center text-slate-500 text-xs">
            No closed commission deals recorded yet. Close leads in the Leads Pipeline to record revenue.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="bg-slate-950/80 text-slate-400 font-bold uppercase tracking-wider border-b border-slate-800 text-[10px]">
                <tr>
                  <th className="p-4">Lead Ref</th>
                  <th className="p-4">Tenant</th>
                  <th className="p-4">Property</th>
                  <th className="p-4">Owner & Terms</th>
                  <th className="p-4">Commission Fee</th>
                  <th className="p-4">Closing Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/80">
                {data.deals.map((deal: any) => (
                  <tr key={deal.id} className="hover:bg-slate-800/40 transition">
                    <td className="p-4">
                      <span className="px-2 py-1 bg-purple-950 text-purple-300 rounded font-bold text-xs">
                        {deal.enquiry_code}
                      </span>
                    </td>
                    <td className="p-4">
                      <span className="font-bold text-white block">{deal.customer_name}</span>
                      <span className="text-[11px] text-slate-400">{deal.customer_phone}</span>
                    </td>
                    <td className="p-4">
                      <span className="font-bold text-white block">{deal.prop_code} - {deal.property_title}</span>
                      <span className="text-[11px] text-slate-400">Rent: ₹{deal.rent?.toLocaleString('en-IN')}/mo in {deal.locality}</span>
                    </td>
                    <td className="p-4">
                      <span className="font-bold text-amber-300 block">{deal.owner_name}</span>
                      <span className="text-[10px] text-slate-400">{deal.commission_terms}</span>
                    </td>
                    <td className="p-4">
                      <span className="font-extrabold text-emerald-400 text-sm">
                        ₹{deal.commission_amount.toLocaleString('en-IN')}
                      </span>
                    </td>
                    <td className="p-4 text-slate-400">
                      {deal.deal_closed_at ? new Date(deal.deal_closed_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) : 'N/A'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
