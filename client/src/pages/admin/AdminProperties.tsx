import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Property } from '../../types';
import { api } from '../../services/api';
import {
  Building,
  PlusCircle,
  Search,
  ExternalLink,
  Edit,
  Trash2,
  Share2,
  Phone,
  Lock,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';

export const AdminProperties: React.FC = () => {
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const fetchProperties = () => {
    setLoading(true);
    api.getAdminProperties()
      .then(res => setProperties(res.properties || []))
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchProperties();
  }, []);

  const handleStatusChange = async (id: string, newStatus: string) => {
    try {
      await api.updatePropertyStatus(id, newStatus);
      fetchProperties();
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id: string, code: string) => {
    if (window.confirm(`Are you sure you want to delete property ${code}?`)) {
      try {
        await api.deleteProperty(id);
        fetchProperties();
      } catch (err) {
        console.error(err);
      }
    }
  };

  const filteredProperties = properties.filter(p => {
    const matchesSearch =
      p.title.toLowerCase().includes(search.toLowerCase()) ||
      p.locality.toLowerCase().includes(search.toLowerCase()) ||
      p.prop_code.toLowerCase().includes(search.toLowerCase()) ||
      (p.owner_name && p.owner_name.toLowerCase().includes(search.toLowerCase()));

    const matchesStatus = statusFilter === 'all' || p.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            Manage Rental Properties
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Complete inventory catalog with private owner contact records & commission terms.
          </p>
        </div>

        <Link
          to="/admin/properties/add"
          className="px-4 py-2.5 bg-purple-600 hover:bg-purple-700 text-white font-bold rounded-xl text-xs transition flex items-center gap-2 shadow-lg shadow-purple-600/30 w-fit"
        >
          <PlusCircle className="w-4 h-4" /> Add New Property
        </Link>
      </div>

      {/* Filter & Search Bar */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
          <input
            type="text"
            placeholder="Search by code, title, locality, or owner name..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs font-medium text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
        </div>

        <select
          value={statusFilter}
          onChange={e => setStatusFilter(e.target.value)}
          className="px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs font-semibold text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
        >
          <option value="all">All Statuses</option>
          <option value="available">Available Only</option>
          <option value="under_discussion">Under Discussion</option>
          <option value="occupied">Occupied / Deal Closed</option>
        </select>
      </div>

      {/* Properties Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden">
        {loading ? (
          <div className="p-12 text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-500 mx-auto"></div>
          </div>
        ) : filteredProperties.length === 0 ? (
          <div className="p-12 text-center space-y-3">
            <Building className="w-10 h-10 text-slate-600 mx-auto" />
            <p className="text-sm font-semibold text-slate-400">No properties match your filter</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="bg-slate-950/80 text-slate-400 font-bold uppercase tracking-wider border-b border-slate-800 text-[10px]">
                <tr>
                  <th className="p-4">Property</th>
                  <th className="p-4">Rental & Deposit</th>
                  <th className="p-4">Specs & Locality</th>
                  <th className="p-4">
                    <span className="flex items-center gap-1 text-amber-400">
                      <Lock className="w-3 h-3" /> Private Owner Contact
                    </span>
                  </th>
                  <th className="p-4">Status</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/80">
                {filteredProperties.map(prop => (
                  <tr key={prop.id} className="hover:bg-slate-800/40 transition">
                    {/* Property info */}
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={prop.images && prop.images[0] ? prop.images[0] : 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=100'}
                          alt={prop.title}
                          className="w-14 h-14 rounded-xl object-cover border border-slate-700"
                        />
                        <div className="space-y-0.5">
                          <span className="px-2 py-0.5 bg-purple-950 text-purple-300 border border-purple-800 rounded font-bold text-[10px]">
                            {prop.prop_code}
                          </span>
                          <h4 className="font-bold text-white text-xs line-clamp-1 max-w-[200px]">
                            {prop.title}
                          </h4>
                          <span className="text-[11px] text-slate-400">{prop.property_type}</span>
                        </div>
                      </div>
                    </td>

                    {/* Rent & Deposit */}
                    <td className="p-4">
                      <div className="space-y-0.5">
                        <span className="font-extrabold text-emerald-400 text-sm">
                          ₹{prop.rent.toLocaleString('en-IN')}/mo
                        </span>
                        <p className="text-[11px] text-slate-400">
                          Dep: ₹{prop.deposit.toLocaleString('en-IN')}
                        </p>
                      </div>
                    </td>

                    {/* Specs & Locality */}
                    <td className="p-4">
                      <div className="space-y-0.5">
                        <span className="font-bold text-white">{prop.bhk} BHK • {prop.locality}</span>
                        <p className="text-[11px] text-slate-400">
                          {prop.parking} • {prop.furnishing}
                        </p>
                        <p className="text-[10px] text-slate-500">{prop.travel_time_mins} mins to City</p>
                      </div>
                    </td>

                    {/* Private Owner Details */}
                    <td className="p-4 bg-slate-950/40 border-l border-r border-slate-800/80">
                      {prop.owner_name ? (
                        <div className="space-y-1">
                          <span className="font-bold text-white block">{prop.owner_name}</span>
                          <a
                            href={`tel:${prop.owner_phone}`}
                            className="text-emerald-400 hover:underline flex items-center gap-1 font-semibold text-[11px]"
                          >
                            <Phone className="w-3 h-3" /> {prop.owner_phone}
                          </a>
                          <span className="text-[10px] text-amber-400/90 block">
                            Terms: {prop.owner_commission_terms || '15 Days Rent'}
                          </span>
                        </div>
                      ) : (
                        <span className="text-slate-500 italic text-[11px]">No owner linked</span>
                      )}
                    </td>

                    {/* Status Toggle */}
                    <td className="p-4">
                      <select
                        value={prop.status}
                        onChange={e => handleStatusChange(prop.id, e.target.value)}
                        className={`px-2.5 py-1.5 rounded-xl font-bold text-xs border focus:outline-none ${
                          prop.status === 'available'
                            ? 'bg-emerald-950/80 border-emerald-800 text-emerald-300'
                            : prop.status === 'under_discussion'
                            ? 'bg-amber-950/80 border-amber-800 text-amber-300'
                            : 'bg-slate-950 border-slate-800 text-slate-500'
                        }`}
                      >
                        <option value="available">Available</option>
                        <option value="under_discussion">Under Discussion</option>
                        <option value="occupied">Occupied</option>
                      </select>
                    </td>

                    {/* Actions */}
                    <td className="p-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <Link
                          to={`/properties/${prop.id}`}
                          target="_blank"
                          className="p-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg transition"
                          title="View Public Page"
                        >
                          <ExternalLink className="w-3.5 h-3.5" />
                        </Link>
                        <Link
                          to={`/admin/social-studio?propertyId=${prop.id}`}
                          className="p-1.5 bg-pink-950 hover:bg-pink-900 text-pink-300 rounded-lg transition"
                          title="Generate Instagram Post"
                        >
                          <Share2 className="w-3.5 h-3.5" />
                        </Link>
                        <Link
                          to={`/admin/properties/edit/${prop.id}`}
                          className="p-1.5 bg-purple-950 hover:bg-purple-900 text-purple-300 rounded-lg transition"
                          title="Edit Property & Owner"
                        >
                          <Edit className="w-3.5 h-3.5" />
                        </Link>
                        <button
                          onClick={() => handleDelete(prop.id, prop.prop_code)}
                          className="p-1.5 bg-rose-950 hover:bg-rose-900 text-rose-400 rounded-lg transition"
                          title="Delete"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
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
