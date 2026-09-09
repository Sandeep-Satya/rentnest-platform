import React from 'react';
import { Link } from 'react-router-dom';
import { Property } from '../../types';
import { useAuth } from '../../context/AuthContext';
import { api } from '../../services/api';
import {
  MapPin,
  Clock,
  Car,
  Armchair,
  Heart,
  Sparkles,
  ShieldCheck,
  Building,
  CheckCircle2
} from 'lucide-react';

interface PropertyCardProps {
  property: Property;
  onEnquireClick?: (property: Property) => void;
  onFavoriteToggle?: (propertyId: string, isFav: boolean) => void;
}

export const PropertyCard: React.FC<PropertyCardProps> = ({
  property,
  onEnquireClick,
  onFavoriteToggle
}) => {
  const { user } = useAuth();
  const [isFavorite, setIsFavorite] = React.useState(property.is_favorite || false);
  const [loadingFav, setLoadingFav] = React.useState(false);

  const handleFavoriteClick = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!user) {
      alert('Please sign in to save properties to your favorites list.');
      return;
    }
    setLoadingFav(true);
    try {
      const res = await api.toggleFavorite(property.id);
      setIsFavorite(res.isFavorite);
      if (onFavoriteToggle) {
        onFavoriteToggle(property.id, res.isFavorite);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingFav(false);
    }
  };

  const imageSrc =
    property.images && property.images.length > 0
      ? property.images[0]
      : 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=800&q=80';

  return (
    <div className="group bg-white rounded-2xl border border-slate-200/90 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col overflow-hidden">
      {/* Image & Badges */}
      <div className="relative aspect-[16/10] overflow-hidden bg-slate-100">
        <img
          src={imageSrc}
          alt={property.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />

        {/* Gradient Overlay for badges */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/30 pointer-events-none" />

        {/* Top Badges */}
        <div className="absolute top-3 left-3 flex flex-wrap items-center gap-1.5 z-10">
          <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-slate-900/80 text-white backdrop-blur-md">
            {property.prop_code}
          </span>
          <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-600/90 text-white backdrop-blur-md">
            {property.property_type}
          </span>
          {property.status === 'under_discussion' && (
            <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-500/90 text-white backdrop-blur-md">
              Under Discussion
            </span>
          )}
        </div>

        {/* Favorite Button */}
        <button
          onClick={handleFavoriteClick}
          disabled={loadingFav}
          className={`absolute top-3 right-3 w-9 h-9 rounded-full flex items-center justify-center backdrop-blur-md transition-all z-10 ${
            isFavorite
              ? 'bg-rose-500 text-white shadow-lg'
              : 'bg-white/80 hover:bg-white text-slate-700 hover:text-rose-500'
          }`}
          title={isFavorite ? 'Remove from Saved' : 'Save to Favorites'}
        >
          <Heart className={`w-4 h-4 ${isFavorite ? 'fill-current' : ''}`} />
        </button>

        {/* Match percentage pill (if available) */}
        {property.matchScore !== undefined && property.matchScore > 0 && (
          <div className="absolute bottom-3 left-3 z-10">
            <span
              className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold text-white shadow-md backdrop-blur-md ${
                property.matchScore >= 80
                  ? 'bg-gradient-to-r from-emerald-600 to-teal-500'
                  : property.matchScore >= 50
                  ? 'bg-gradient-to-r from-blue-600 to-cyan-500'
                  : 'bg-slate-700'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              {property.matchScore}% Match
            </span>
          </div>
        )}

        {/* Commute Time Pill */}
        <div className="absolute bottom-3 right-3 z-10">
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-slate-900/80 text-slate-100 backdrop-blur-md">
            <Clock className="w-3 h-3 text-amber-400" />
            {property.travel_time_mins} mins
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-5 flex-1 flex flex-col justify-between">
        <div>
          {/* Price & Deposit */}
          <div className="flex items-baseline justify-between mb-2">
            <div>
              <span className="text-2xl font-extrabold text-slate-900">
                ₹{property.rent.toLocaleString('en-IN')}
              </span>
              <span className="text-xs font-medium text-slate-500 ml-1">/ month</span>
            </div>
            <span className="text-xs text-slate-500 font-medium">
              Deposit: ₹{property.deposit.toLocaleString('en-IN')}
            </span>
          </div>

          {/* Title */}
          <h3 className="font-bold text-slate-900 text-base line-clamp-1 group-hover:text-brand-600 transition mb-1">
            <Link to={`/properties/${property.id}`}>{property.title}</Link>
          </h3>

          {/* Location */}
          <p className="flex items-center gap-1 text-xs text-slate-500 mb-3">
            <MapPin className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0" />
            <span className="font-medium text-slate-700">{property.locality}</span>, {property.city}
          </p>

          {/* Key Specs Pills */}
          <div className="grid grid-cols-3 gap-2 py-2.5 px-3 bg-slate-50 rounded-xl text-xs text-slate-600 mb-3 border border-slate-100">
            <div className="flex items-center gap-1.5">
              <Building className="w-3.5 h-3.5 text-slate-400" />
              <span className="font-semibold text-slate-800">{property.bhk} BHK</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Car className="w-3.5 h-3.5 text-slate-400" />
              <span className="truncate">{property.parking.replace('Car + Bike', 'Both')}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Armchair className="w-3.5 h-3.5 text-slate-400" />
              <span className="truncate">{property.furnishing.replace('-Furnished', '')}</span>
            </div>
          </div>

          {/* Match reasons snippet if present */}
          {property.matchReasons && property.matchReasons.length > 0 && (
            <div className="mb-3 space-y-1">
              {property.matchReasons.slice(0, 2).map((reason, idx) => (
                <div key={idx} className="flex items-center gap-1.5 text-[11px] text-emerald-700">
                  <CheckCircle2 className="w-3 h-3 text-emerald-500 flex-shrink-0" />
                  <span className="truncate">{reason}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="pt-3 border-t border-slate-100 flex items-center gap-2">
          <Link
            to={`/properties/${property.id}`}
            className="flex-1 py-2 px-3 text-center text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition"
          >
            View Details
          </Link>
          <button
            onClick={() => onEnquireClick && onEnquireClick(property)}
            className="flex-1 py-2 px-3 text-center text-xs font-semibold text-white bg-brand-600 hover:bg-brand-700 rounded-xl shadow-sm shadow-brand-600/20 transition flex items-center justify-center gap-1"
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            I'm Interested
          </button>
        </div>
      </div>
    </div>
  );
};
