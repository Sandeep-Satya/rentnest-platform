import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Property } from '../types';
import { api } from '../services/api';
import { EnquiryModal } from '../components/common/EnquiryModal';
import { useAuth } from '../context/AuthContext';
import {
  MapPin,
  Clock,
  Car,
  Armchair,
  Droplet,
  Zap,
  ShieldCheck,
  Building,
  Heart,
  Share2,
  Calendar,
  Layers,
  Sparkles,
  ArrowLeft,
  CheckCircle2,
  Lock,
  PhoneCall,
  Send,
  Instagram,
  Copy,
  Check
} from 'lucide-react';

export const PropertyDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const [property, setProperty] = useState<Property | null>(null);
  const [similarProperties, setSimilarProperties] = useState<any[]>([]);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [enquiryModalOpen, setEnquiryModalOpen] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);
  const [copiedCaption, setCopiedCaption] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    api.getPropertyById(id)
      .then(res => {
        setProperty(res.property);
        setSimilarProperties(res.similarProperties || []);
        setIsFavorite(res.property.is_favorite || false);
        setActiveImageIndex(0);
      })
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, [id]);

  const handleFavoriteToggle = async () => {
    if (!property) return;
    if (!user) {
      alert('Please sign in to save this property.');
      return;
    }
    try {
      const res = await api.toggleFavorite(property.id);
      setIsFavorite(res.isFavorite);
    } catch (err) {
      console.error(err);
    }
  };

  const copyInstagramCaption = () => {
    if (!property) return;
    const text = `🏠 ${property.bhk} BHK ${property.property_type} For Rent in ${property.locality}!\n💰 Rent: ₹${property.rent.toLocaleString('en-IN')}/mo\n🚗 Parking: ${property.parking}\n⏱️ ${property.travel_time_mins} mins from City\n\nContact RentNest: +91 98765 43210\nRef ID: ${property.prop_code}`;
    navigator.clipboard.writeText(text);
    setCopiedCaption(true);
    setTimeout(() => setCopiedCaption(false), 2000);
  };

  const copyShareLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const handleWhatsAppShare = () => {
    if (!property) return;
    const msg = encodeURIComponent(
      `Check out this ${property.bhk} BHK rental house in ${property.locality} (₹${property.rent.toLocaleString('en-IN')}/mo): ${window.location.href}`
    );
    window.open(`https://wa.me/?text=${msg}`, '_blank');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-600"></div>
      </div>
    );
  }

  if (!property) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-3xl p-8 max-w-md w-full text-center space-y-4 border border-slate-200">
          <Building className="w-12 h-12 text-slate-400 mx-auto" />
          <h2 className="text-xl font-bold text-slate-900">Property Not Found</h2>
          <p className="text-xs text-slate-500">The property you are looking for might have been occupied or removed.</p>
          <Link to="/properties" className="inline-block px-4 py-2 bg-brand-600 text-white text-xs font-semibold rounded-xl">
            Browse Other Houses
          </Link>
        </div>
      </div>
    );
  }

  const images = property.images && property.images.length > 0 ? property.images : [
    'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=1200&q=80'
  ];

  return (
    <div className="min-h-screen bg-slate-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Back Link & Breadcrumb */}
        <div className="flex items-center justify-between mb-6">
          <Link
            to="/properties"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-600 hover:text-brand-600 transition"
          >
            <ArrowLeft className="w-4 h-4" /> Back to All Properties
          </Link>

          <div className="flex items-center gap-2">
            <button
              onClick={handleFavoriteToggle}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-semibold transition ${
                isFavorite
                  ? 'bg-rose-50 border-rose-200 text-rose-600'
                  : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
              }`}
            >
              <Heart className={`w-3.5 h-3.5 ${isFavorite ? 'fill-current text-rose-500' : ''}`} />
              {isFavorite ? 'Saved' : 'Save Property'}
            </button>
            <button
              onClick={copyShareLink}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition"
            >
              {copiedLink ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
              {copiedLink ? 'Link Copied' : 'Copy Link'}
            </button>
          </div>
        </div>

        {/* Top Header Information */}
        <div className="mb-6">
          <div className="flex flex-wrap items-center gap-2 mb-2">
            <span className="px-3 py-1 bg-slate-900 text-white rounded-full text-xs font-bold">
              {property.prop_code}
            </span>
            <span className="px-3 py-1 bg-brand-100 text-brand-800 rounded-full text-xs font-bold">
              {property.property_type}
            </span>
            <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-bold">
              {property.furnishing}
            </span>
            {property.matchScore !== undefined && (
              <span className="px-3 py-1 bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-full text-xs font-bold flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-amber-300" /> {property.matchScore}% Match to Your Requirements
              </span>
            )}
          </div>

          <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight">
            {property.title}
          </h1>

          <p className="flex items-center gap-1.5 text-sm text-slate-600 mt-2 font-medium">
            <MapPin className="w-4 h-4 text-emerald-600 flex-shrink-0" />
            <span>{property.address}</span>, <span className="font-bold text-slate-800">{property.locality}</span>, {property.city}
          </p>
        </div>

        {/* Main Grid: Gallery & Details (Left) + Floating Enquiry Card (Right) */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* LEFT 2 COLUMNS: Visuals & Specifications */}
          <div className="lg:col-span-2 space-y-8">
            {/* Photo Gallery */}
            <div className="bg-white rounded-3xl p-4 border border-slate-200/90 shadow-sm space-y-3">
              <div className="relative aspect-[16/10] rounded-2xl overflow-hidden bg-slate-900">
                <img
                  src={images[activeImageIndex]}
                  alt={property.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute bottom-4 right-4 px-3 py-1 bg-black/70 text-white text-xs font-medium rounded-full backdrop-blur-md">
                  Photo {activeImageIndex + 1} of {images.length}
                </div>
              </div>

              {/* Thumbnail Strip */}
              {images.length > 1 && (
                <div className="flex gap-2 overflow-x-auto pb-1">
                  {images.map((img, idx) => (
                    <button
                      key={idx}
                      onClick={() => setActiveImageIndex(idx)}
                      className={`relative w-20 h-16 rounded-xl overflow-hidden flex-shrink-0 border-2 transition ${
                        activeImageIndex === idx ? 'border-brand-600 scale-95 shadow-md' : 'border-transparent opacity-70 hover:opacity-100'
                      }`}
                    >
                      <img src={img} alt={`Thumb ${idx}`} className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Quick Specs Overview Grid */}
            <div className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-sm">
              <h3 className="text-base font-bold text-slate-900 mb-4 flex items-center gap-2">
                <Layers className="w-4 h-4 text-brand-600" /> Property Overview
              </h3>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-100">
                  <span className="block text-[11px] font-bold uppercase text-slate-400 mb-1">Configuration</span>
                  <span className="text-base font-bold text-slate-900">{property.bhk} BHK ({property.bedrooms} Beds)</span>
                </div>
                <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-100">
                  <span className="block text-[11px] font-bold uppercase text-slate-400 mb-1">Bathrooms</span>
                  <span className="text-base font-bold text-slate-900">{property.bathrooms} Baths</span>
                </div>
                <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-100">
                  <span className="block text-[11px] font-bold uppercase text-slate-400 mb-1">Parking</span>
                  <span className="text-base font-bold text-slate-900">{property.parking}</span>
                </div>
                <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-100">
                  <span className="block text-[11px] font-bold uppercase text-slate-400 mb-1">Available From</span>
                  <span className="text-base font-bold text-emerald-700">{property.available_from}</span>
                </div>
                <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-100">
                  <span className="block text-[11px] font-bold uppercase text-slate-400 mb-1">Furnishing</span>
                  <span className="text-base font-bold text-slate-900">{property.furnishing}</span>
                </div>
                <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-100">
                  <span className="block text-[11px] font-bold uppercase text-slate-400 mb-1">Commute to City</span>
                  <span className="text-base font-bold text-slate-900">{property.travel_time_mins} mins ({property.distance_km} km)</span>
                </div>
                <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-100">
                  <span className="block text-[11px] font-bold uppercase text-slate-400 mb-1">Water Supply</span>
                  <span className="text-base font-bold text-slate-900">{property.water_availability}</span>
                </div>
                <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-100">
                  <span className="block text-[11px] font-bold uppercase text-slate-400 mb-1">Preferred Tenants</span>
                  <span className="text-base font-bold text-slate-900">{property.preferred_tenants}</span>
                </div>
              </div>
            </div>

            {/* Description */}
            <div className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-sm space-y-3">
              <h3 className="text-base font-bold text-slate-900">About This House</h3>
              <p className="text-sm text-slate-700 leading-relaxed whitespace-pre-line">
                {property.description}
              </p>
            </div>

            {/* Features & Amenities Checklist */}
            <div className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-sm">
              <h3 className="text-base font-bold text-slate-900 mb-4">Amenities & Building Features</h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
                <div className={`p-3 rounded-xl border flex items-center gap-2 ${property.power_backup ? 'bg-emerald-50/50 border-emerald-200 text-slate-800' : 'bg-slate-50 border-slate-100 text-slate-400'}`}>
                  <Zap className={`w-4 h-4 ${property.power_backup ? 'text-amber-500' : 'text-slate-300'}`} />
                  <span className="font-semibold">Power Backup ({property.power_backup ? 'Available' : 'No'})</span>
                </div>

                <div className={`p-3 rounded-xl border flex items-center gap-2 ${property.lift ? 'bg-emerald-50/50 border-emerald-200 text-slate-800' : 'bg-slate-50 border-slate-100 text-slate-400'}`}>
                  <Building className={`w-4 h-4 ${property.lift ? 'text-brand-600' : 'text-slate-300'}`} />
                  <span className="font-semibold">Lift / Elevator ({property.lift ? 'Available' : 'No'})</span>
                </div>

                <div className={`p-3 rounded-xl border flex items-center gap-2 ${property.security ? 'bg-emerald-50/50 border-emerald-200 text-slate-800' : 'bg-slate-50 border-slate-100 text-slate-400'}`}>
                  <ShieldCheck className={`w-4 h-4 ${property.security ? 'text-emerald-600' : 'text-slate-300'}`} />
                  <span className="font-semibold">24/7 Security & CCTV</span>
                </div>

                <div className={`p-3 rounded-xl border flex items-center gap-2 ${property.balcony ? 'bg-emerald-50/50 border-emerald-200 text-slate-800' : 'bg-slate-50 border-slate-100 text-slate-400'}`}>
                  <CheckCircle2 className={`w-4 h-4 ${property.balcony ? 'text-emerald-600' : 'text-slate-300'}`} />
                  <span className="font-semibold">Balcony / Sit-out</span>
                </div>

                <div className={`p-3 rounded-xl border flex items-center gap-2 ${property.pet_friendly ? 'bg-emerald-50/50 border-emerald-200 text-slate-800' : 'bg-slate-50 border-slate-100 text-slate-400'}`}>
                  <CheckCircle2 className={`w-4 h-4 ${property.pet_friendly ? 'text-emerald-600' : 'text-slate-300'}`} />
                  <span className="font-semibold">Pet Friendly ({property.pet_friendly ? 'Yes' : 'Not Allowed'})</span>
                </div>

                <div className={`p-3 rounded-xl border flex items-center gap-2 ${property.gated_community ? 'bg-emerald-50/50 border-emerald-200 text-slate-800' : 'bg-slate-50 border-slate-100 text-slate-400'}`}>
                  <ShieldCheck className={`w-4 h-4 ${property.gated_community ? 'text-brand-600' : 'text-slate-300'}`} />
                  <span className="font-semibold">Gated Society</span>
                </div>
              </div>
            </div>

            {/* Social Share Box */}
            <div className="bg-gradient-to-r from-slate-900 to-slate-800 text-white rounded-3xl p-6 shadow-xl flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="space-y-1">
                <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-1.5">
                  <Share2 className="w-3.5 h-3.5" /> Share Property
                </span>
                <h4 className="text-base font-bold text-white">Promote or Send to Flatmates</h4>
                <p className="text-xs text-slate-400">Instantly share via WhatsApp or copy formatted Instagram caption.</p>
              </div>

              <div className="flex flex-wrap gap-2">
                <button
                  onClick={handleWhatsAppShare}
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition flex items-center gap-1.5"
                >
                  <Send className="w-3.5 h-3.5" /> Share on WhatsApp
                </button>
                <button
                  onClick={copyInstagramCaption}
                  className="px-4 py-2 bg-pink-600 hover:bg-pink-700 text-white rounded-xl text-xs font-bold transition flex items-center gap-1.5"
                >
                  <Instagram className="w-3.5 h-3.5" /> {copiedCaption ? 'Caption Copied!' : 'Instagram Caption'}
                </button>
              </div>
            </div>
          </div>

          {/* RIGHT 1 COLUMN: Sticky Enquiry & Consultancy Card */}
          <div className="space-y-6">
            <div className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-xl sticky top-24 space-y-6">
              {/* Rent & Deposit Display */}
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Monthly Rental</span>
                <div className="flex items-baseline gap-2 mt-1">
                  <span className="text-3xl sm:text-4xl font-black text-slate-900">
                    ₹{property.rent.toLocaleString('en-IN')}
                  </span>
                  <span className="text-xs text-slate-500 font-semibold">/ month</span>
                </div>
                <div className="mt-2 py-2 px-3 bg-slate-50 rounded-xl border border-slate-100 flex items-center justify-between text-xs">
                  <span className="text-slate-500 font-medium">Security Deposit:</span>
                  <span className="font-bold text-slate-800">₹{property.deposit.toLocaleString('en-IN')}</span>
                </div>
              </div>

              {/* Privacy Notice Banner */}
              <div className="p-4 bg-amber-50/80 rounded-2xl border border-amber-200 text-xs text-amber-900 space-y-1.5">
                <div className="flex items-center gap-1.5 font-bold text-amber-950">
                  <Lock className="w-4 h-4 text-amber-600 flex-shrink-0" />
                  Owner Privacy Guarantee
                </div>
                <p className="text-[11px] leading-relaxed text-amber-800">
                  To protect owners from broker spam, direct phone numbers are provided by our consultant after visit scheduling and requirement confirmation.
                </p>
              </div>

              {/* Main Action CTAs */}
              <div className="space-y-3">
                <button
                  onClick={() => setEnquiryModalOpen(true)}
                  className="w-full py-4 bg-brand-600 hover:bg-brand-700 text-white font-extrabold rounded-2xl shadow-lg shadow-brand-600/30 text-sm transition flex items-center justify-center gap-2 group"
                >
                  <ShieldCheck className="w-5 h-5 text-white" />
                  I'm Interested • Request Owner Details
                </button>

                <a
                  href="tel:+919876543210"
                  className="w-full py-3 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold rounded-2xl text-xs transition flex items-center justify-center gap-2"
                >
                  <PhoneCall className="w-4 h-4 text-slate-600" />
                  Call Consultant Desk (+91 98765 43210)
                </a>
              </div>

              {/* Consultant Trust Checklist */}
              <div className="pt-4 border-t border-slate-100 space-y-2 text-xs text-slate-600">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                  <span>100% Genuine Owner-listed Property</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                  <span>Physical / Video Site Visit Arranged</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                  <span>Rental Agreement & Lease Assistance</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Similar Houses Section */}
        {similarProperties.length > 0 && (
          <div className="mt-16 pt-12 border-t border-slate-200">
            <h3 className="text-xl font-bold text-slate-900 mb-6">
              Similar Rental Houses in {property.locality}
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {similarProperties.map(sim => (
                <Link
                  key={sim.id}
                  to={`/properties/${sim.id}`}
                  className="bg-white rounded-2xl border border-slate-200 p-4 hover:shadow-lg transition flex gap-4 items-center group"
                >
                  <img
                    src={sim.images && sim.images[0] ? sim.images[0] : 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=300&q=80'}
                    alt={sim.title}
                    className="w-20 h-20 rounded-xl object-cover group-hover:scale-105 transition"
                  />
                  <div>
                    <span className="text-[11px] font-bold text-brand-600">{sim.prop_code} • {sim.bhk} BHK</span>
                    <h4 className="text-xs font-bold text-slate-900 line-clamp-1 group-hover:text-brand-600 transition">{sim.title}</h4>
                    <p className="text-xs font-extrabold text-slate-900 mt-1">₹{sim.rent.toLocaleString('en-IN')}/mo</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Enquiry Modal */}
      <EnquiryModal
        property={property}
        isOpen={enquiryModalOpen}
        onClose={() => setEnquiryModalOpen(false)}
      />
    </div>
  );
};
