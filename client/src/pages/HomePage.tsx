import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Property } from '../types';
import { api } from '../services/api';
import { PropertyCard } from '../components/common/PropertyCard';
import { EnquiryModal } from '../components/common/EnquiryModal';
import {
  Search,
  Building2,
  ShieldCheck,
  Sparkles,
  Users,
  Clock,
  CheckCircle2,
  ArrowRight,
  Instagram,
  MapPin,
  Car,
  Home,
  Check
} from 'lucide-react';

export const HomePage: React.FC = () => {
  const navigate = useNavigate();
  const [featuredProperties, setFeaturedProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);
  const [enquiryModalOpen, setEnquiryModalOpen] = useState(false);

  // Quick Search Form State
  const [city, setCity] = useState('Hyderabad');
  const [locality, setLocality] = useState('');
  const [bhk, setBhk] = useState('');
  const [maxRent, setMaxRent] = useState('');
  const [maxTravelTime, setMaxTravelTime] = useState('');

  useEffect(() => {
    api.getFeaturedProperties()
      .then(res => setFeaturedProperties(res.properties))
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  const handleQuickSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (city) params.set('city', city);
    if (locality) params.set('locality', locality);
    if (bhk) params.set('bhk', bhk);
    if (maxRent) params.set('maxRent', maxRent);
    if (maxTravelTime) params.set('maxTravelTime', maxTravelTime);
    navigate(`/properties?${params.toString()}`);
  };

  const handleEnquireClick = (property: Property) => {
    setSelectedProperty(property);
    setEnquiryModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-slate-50">
      {/* 1. HERO SECTION */}
      <section className="relative hero-gradient text-white pt-20 pb-28 px-4 sm:px-6 lg:px-8 overflow-hidden">
        {/* Background decorative glowing circles */}
        <div className="absolute top-10 right-10 w-96 h-96 bg-brand-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-10 left-10 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-6xl mx-auto relative z-10 text-center">
          {/* Tagline Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-slate-800/90 border border-emerald-500/30 text-xs font-semibold text-emerald-400 mb-6 backdrop-blur-md shadow-lg">
            <Sparkles className="w-3.5 h-3.5" />
            Verified Rental House Consultancy in Hyderabad
          </div>

          {/* Main Headline */}
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight leading-tight max-w-4xl mx-auto mb-6">
            Find Your Perfect <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-200">Rental Home</span> Without the Broker Chaos
          </h1>

          <p className="text-base sm:text-lg text-slate-300 max-w-2xl mx-auto mb-10 leading-relaxed font-normal">
            Tell us what you are looking for. Our certified rental consultants match you with verified property owners, organize seamless visits, and help you finalize your lease.
          </p>

          {/* Quick Search Widget */}
          <div className="max-w-4xl mx-auto bg-white/95 backdrop-blur-md p-4 sm:p-6 rounded-3xl shadow-2xl text-slate-800 border border-white/20">
            <form onSubmit={handleQuickSearch} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 text-left">
              {/* City */}
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1">
                  City
                </label>
                <div className="relative">
                  <MapPin className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <select
                    value={city}
                    onChange={e => setCity(e.target.value)}
                    className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:ring-2 focus:ring-brand-500 focus:outline-none"
                  >
                    <option value="Hyderabad">Hyderabad</option>
                    <option value="Bangalore">Bangalore</option>
                  </select>
                </div>
              </div>

              {/* Locality */}
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1">
                  Locality
                </label>
                <input
                  type="text"
                  placeholder="e.g. Madhapur, Gachibowli"
                  value={locality}
                  onChange={e => setLocality(e.target.value)}
                  className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:ring-2 focus:ring-brand-500 focus:outline-none"
                />
              </div>

              {/* BHK */}
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1">
                  BHK
                </label>
                <select
                  value={bhk}
                  onChange={e => setBhk(e.target.value)}
                  className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:ring-2 focus:ring-brand-500 focus:outline-none"
                >
                  <option value="">Any BHK</option>
                  <option value="1">1 BHK</option>
                  <option value="2">2 BHK</option>
                  <option value="3">3 BHK</option>
                  <option value="4">4+ BHK Villa</option>
                </select>
              </div>

              {/* Max Rent */}
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1">
                  Max Budget
                </label>
                <select
                  value={maxRent}
                  onChange={e => setMaxRent(e.target.value)}
                  className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:ring-2 focus:ring-brand-500 focus:outline-none"
                >
                  <option value="">No Limit</option>
                  <option value="20000">Under ₹20,000</option>
                  <option value="30000">Under ₹30,000</option>
                  <option value="45000">Under ₹45,000</option>
                  <option value="70000">Under ₹70,000</option>
                </select>
              </div>

              {/* Search Button */}
              <div className="flex items-end">
                <button
                  type="submit"
                  className="w-full py-3 bg-brand-600 hover:bg-brand-700 text-white font-bold text-xs uppercase tracking-wider rounded-xl shadow-lg shadow-brand-600/30 transition flex items-center justify-center gap-2 h-[42px]"
                >
                  <Search className="w-4 h-4" />
                  Search Houses
                </button>
              </div>
            </form>

            <div className="mt-4 pt-4 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2 text-xs text-slate-500">
              <span className="font-medium text-slate-700">Popular Localities:</span>
              <div className="flex flex-wrap gap-1.5">
                {['Madhapur', 'Gachibowli', 'Kondapur', 'Financial District', 'Jubilee Hills'].map(loc => (
                  <button
                    key={loc}
                    onClick={() => navigate(`/properties?locality=${encodeURIComponent(loc)}`)}
                    className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 rounded-lg text-slate-700 font-medium transition"
                  >
                    {loc}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. HOW THE CONSULTANCY WORKS */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto -mt-10 relative z-20">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Step 1 */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-lg hover:shadow-xl transition-all group">
            <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-600 flex items-center justify-center font-bold text-lg mb-4 group-hover:scale-110 transition-transform">
              1
            </div>
            <h3 className="text-lg font-bold text-slate-900 mb-2">Share Your Requirements</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Tell us your preferred locality, BHK, budget, travel time, and family or bachelor needs through our smart requirement matcher.
            </p>
          </div>

          {/* Step 2 */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-lg hover:shadow-xl transition-all group">
            <div className="w-12 h-12 rounded-2xl bg-blue-100 text-blue-600 flex items-center justify-center font-bold text-lg mb-4 group-hover:scale-110 transition-transform">
              2
            </div>
            <h3 className="text-lg font-bold text-slate-900 mb-2">Consultant Screening & Tour</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Our consultant verifies availability with property owners, filters genuine listings, and coordinates physical/video visits for you.
            </p>
          </div>

          {/* Step 3 */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-lg hover:shadow-xl transition-all group">
            <div className="w-12 h-12 rounded-2xl bg-purple-100 text-purple-600 flex items-center justify-center font-bold text-lg mb-4 group-hover:scale-110 transition-transform">
              3
            </div>
            <h3 className="text-lg font-bold text-slate-900 mb-2">Connect with Owner & Move In</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              We connect you directly with the property owner for negotiation and rental agreement. Transparent service fee upon successful deal.
            </p>
          </div>
        </div>
      </section>

      {/* 3. FEATURED PROPERTIES */}
      <section className="py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
          <div>
            <div className="flex items-center gap-2 text-emerald-600 text-xs font-bold uppercase tracking-wider mb-1">
              <ShieldCheck className="w-4 h-4" /> Verified Listings
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
              Featured Rental Properties
            </h2>
            <p className="text-sm text-slate-500 mt-1">
              Curated by our rental consultants • Direct owner coordination
            </p>
          </div>

          <Link
            to="/properties"
            className="inline-flex items-center gap-2 text-sm font-bold text-brand-600 hover:text-brand-700 transition"
          >
            Explore All 10+ Properties <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map(n => (
              <div key={n} className="bg-white rounded-2xl border border-slate-200 h-80 animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredProperties.map(prop => (
              <PropertyCard
                key={prop.id}
                property={prop}
                onEnquireClick={handleEnquireClick}
              />
            ))}
          </div>
        )}
      </section>

      {/* 4. SMART REQUIREMENT MATCHER PROMO */}
      <section className="py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-emerald-950 rounded-3xl p-8 sm:p-12 text-white relative overflow-hidden shadow-2xl">
          <div className="max-w-2xl relative z-10 space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-500/20 text-emerald-300 rounded-full text-xs font-semibold">
              <Sparkles className="w-4 h-4" /> Smart Property Matcher Engine
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
              Cannot find what you need? Let our system match properties to your requirements.
            </h2>
            <p className="text-sm text-slate-300 leading-relaxed">
              Fill in our comprehensive questionnaire (preferred travel time to office, parking type, pet policy, budget limit). Our system ranks houses and gives you an instant match percentage!
            </p>

            <div className="flex flex-wrap gap-4 pt-2">
              <Link
                to="/my-requirements"
                className="px-6 py-3.5 bg-brand-500 hover:bg-brand-600 text-white font-bold rounded-2xl text-sm shadow-lg shadow-brand-500/30 transition flex items-center gap-2"
              >
                <Sparkles className="w-4 h-4 text-amber-300" />
                Fill House Requirement Form
              </Link>
              <Link
                to="/properties"
                className="px-6 py-3.5 bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold rounded-2xl text-sm transition"
              >
                Browse All Properties
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 5. WHY CHOOSE CONSULTANT VS BROKERS */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
            Why Rent Through RentNest Consultancy?
          </h2>
          <p className="text-sm text-slate-500 mt-2">
            The modern alternative to endless broker calls and outdated marketplace listings.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm space-y-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-slate-900 text-base">Verified Owners</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              All properties are directly vetted by our team. Zero fake listings or duplicate broker reposts.
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm space-y-3">
            <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center">
              <Clock className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-slate-900 text-base">Save 20+ Hours</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              No need to call 50 different brokers. Your dedicated consultant arranges all visits in one organized schedule.
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm space-y-3">
            <div className="w-10 h-10 rounded-xl bg-purple-100 text-purple-600 flex items-center justify-center">
              <Users className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-slate-900 text-base">Privacy Protected</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Owner and tenant contact info is safeguarded. No spam calls or unsolicited real estate sales pitches.
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm space-y-3">
            <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-600 flex items-center justify-center">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-slate-900 text-base">Transparent Fee</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Clear consultancy fee structure only when you decide to take the house. Zero advance registration charges.
            </p>
          </div>
        </div>
      </section>

      {/* 6. INSTAGRAM SOCIAL PROOF */}
      <section className="py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="bg-gradient-to-r from-pink-50 via-rose-50 to-amber-50 rounded-3xl p-8 border border-pink-100/80 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-pink-600 text-xs font-bold uppercase">
              <Instagram className="w-4 h-4" /> Daily House Walkthroughs On Instagram
            </div>
            <h3 className="text-2xl font-bold text-slate-900">
              Follow @RentNestConsultancy
            </h3>
            <p className="text-xs text-slate-600 max-w-md">
              Watch reels of freshly listed apartments in Madhapur & Gachibowli before they get occupied. Direct DM support!
            </p>
          </div>

          <a
            href="https://instagram.com"
            target="_blank"
            rel="noreferrer"
            className="px-6 py-3 bg-gradient-to-r from-pink-600 to-rose-600 hover:from-pink-700 hover:to-rose-700 text-white font-bold rounded-2xl text-xs uppercase tracking-wider shadow-md shadow-pink-500/20 transition flex items-center gap-2 flex-shrink-0"
          >
            <Instagram className="w-4 h-4" />
            Visit Instagram Page
          </a>
        </div>
      </section>

      {/* Enquiry Modal */}
      <EnquiryModal
        property={selectedProperty}
        isOpen={enquiryModalOpen}
        onClose={() => {
          setEnquiryModalOpen(false);
          setSelectedProperty(null);
        }}
      />
    </div>
  );
};
