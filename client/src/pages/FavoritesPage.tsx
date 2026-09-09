import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Property } from '../types';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { PropertyCard } from '../components/common/PropertyCard';
import { EnquiryModal } from '../components/common/EnquiryModal';
import {
  Heart,
  Scale,
  Building,
  ArrowRight,
  X,
  Check,
  MapPin,
  Clock,
  Car
} from 'lucide-react';

export const FavoritesPage: React.FC = () => {
  const { user } = useAuth();
  const [favorites, setFavorites] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);
  const [enquiryModalOpen, setEnquiryModalOpen] = useState(false);
  const [compareModalOpen, setCompareModalOpen] = useState(false);

  const fetchFavorites = () => {
    if (!user) {
      setLoading(false);
      return;
    }
    api.getMyFavorites()
      .then(res => setFavorites(res.favorites || []))
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchFavorites();
  }, [user]);

  if (!user) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-3xl p-8 max-w-md w-full text-center space-y-4 border border-slate-200 shadow-xl">
          <Heart className="w-12 h-12 text-rose-500 mx-auto" />
          <h2 className="text-xl font-bold text-slate-900">Sign in to View Saved Houses</h2>
          <p className="text-xs text-slate-500">Save houses while browsing to easily compare specifications and prices.</p>
          <Link to="/login" className="inline-block px-6 py-2.5 bg-brand-600 hover:bg-brand-700 text-white font-bold text-xs rounded-xl shadow-md transition">
            Sign In
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold text-rose-600 uppercase tracking-wider mb-1">
              <Heart className="w-4 h-4 fill-current" /> Shortlisted Houses
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
              Saved Properties ({favorites.length})
            </h1>
            <p className="text-xs text-slate-500 mt-1">
              Houses you have bookmarked for comparison and site visits.
            </p>
          </div>

          {favorites.length >= 2 && (
            <button
              onClick={() => setCompareModalOpen(true)}
              className="px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl shadow-md transition flex items-center gap-2"
            >
              <Scale className="w-4 h-4 text-amber-400" />
              Compare Saved Houses Side-by-Side
            </button>
          )}
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map(n => (
              <div key={n} className="bg-white rounded-2xl border border-slate-200 h-80 animate-pulse" />
            ))}
          </div>
        ) : favorites.length === 0 ? (
          <div className="bg-white rounded-3xl p-12 text-center border border-slate-200 shadow-sm space-y-4">
            <Heart className="w-12 h-12 text-slate-300 mx-auto" />
            <h3 className="text-lg font-bold text-slate-900">No saved properties yet</h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              Click the heart icon on any rental house to save it here for quick access.
            </p>
            <Link
              to="/properties"
              className="inline-flex items-center gap-1.5 px-6 py-3 bg-brand-600 hover:bg-brand-700 text-white font-bold text-xs rounded-xl shadow-md transition"
            >
              Discover Houses <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {favorites.map(fav => (
              <PropertyCard
                key={fav.id}
                property={{ ...fav, is_favorite: true }}
                onFavoriteToggle={() => fetchFavorites()}
                onEnquireClick={p => {
                  setSelectedProperty(p);
                  setEnquiryModalOpen(true);
                }}
              />
            ))}
          </div>
        )}
      </div>

      {/* Side-by-Side Comparison Modal */}
      {compareModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-5xl w-full shadow-2xl border border-slate-100 overflow-hidden">
            <div className="p-6 bg-slate-900 text-white flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Scale className="w-5 h-5 text-amber-400" />
                <h3 className="text-lg font-bold">Side-by-Side House Comparison</h3>
              </div>
              <button onClick={() => setCompareModalOpen(false)} className="text-slate-400 hover:text-white">
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="p-6 overflow-x-auto">
              <table className="w-full text-xs text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-200">
                    <th className="p-3 bg-slate-50 font-bold text-slate-700">Feature</th>
                    {favorites.slice(0, 3).map(f => (
                      <th key={f.id} className="p-3 font-bold text-slate-900">
                        {f.prop_code} - {f.title}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  <tr>
                    <td className="p-3 bg-slate-50 font-semibold text-slate-600">Monthly Rent</td>
                    {favorites.slice(0, 3).map(f => (
                      <td key={f.id} className="p-3 font-extrabold text-brand-600 text-sm">
                        ₹{f.rent.toLocaleString('en-IN')}/mo
                      </td>
                    ))}
                  </tr>
                  <tr>
                    <td className="p-3 bg-slate-50 font-semibold text-slate-600">Security Deposit</td>
                    {favorites.slice(0, 3).map(f => (
                      <td key={f.id} className="p-3 font-bold text-slate-800">
                        ₹{f.deposit.toLocaleString('en-IN')}
                      </td>
                    ))}
                  </tr>
                  <tr>
                    <td className="p-3 bg-slate-50 font-semibold text-slate-600">BHK / Configuration</td>
                    {favorites.slice(0, 3).map(f => (
                      <td key={f.id} className="p-3 font-bold text-slate-800">{f.bhk} BHK ({f.bedrooms} Beds, {f.bathrooms} Baths)</td>
                    ))}
                  </tr>
                  <tr>
                    <td className="p-3 bg-slate-50 font-semibold text-slate-600">Locality</td>
                    {favorites.slice(0, 3).map(f => (
                      <td key={f.id} className="p-3 font-medium text-slate-700">{f.locality}, {f.city}</td>
                    ))}
                  </tr>
                  <tr>
                    <td className="p-3 bg-slate-50 font-semibold text-slate-600">Furnishing</td>
                    {favorites.slice(0, 3).map(f => (
                      <td key={f.id} className="p-3 font-medium text-slate-700">{f.furnishing}</td>
                    ))}
                  </tr>
                  <tr>
                    <td className="p-3 bg-slate-50 font-semibold text-slate-600">Parking</td>
                    {favorites.slice(0, 3).map(f => (
                      <td key={f.id} className="p-3 font-medium text-slate-700">{f.parking}</td>
                    ))}
                  </tr>
                  <tr>
                    <td className="p-3 bg-slate-50 font-semibold text-slate-600">Travel Time to City</td>
                    {favorites.slice(0, 3).map(f => (
                      <td key={f.id} className="p-3 font-medium text-slate-700">{f.travel_time_mins} mins</td>
                    ))}
                  </tr>
                </tbody>
              </table>
            </div>

            <div className="p-4 bg-slate-50 border-t border-slate-100 text-right">
              <button
                onClick={() => setCompareModalOpen(false)}
                className="px-6 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition"
              >
                Close Comparison
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Enquiry Modal */}
      <EnquiryModal
        property={selectedProperty}
        isOpen={enquiryModalOpen}
        onClose={() => setEnquiryModalOpen(false)}
      />
    </div>
  );
};
