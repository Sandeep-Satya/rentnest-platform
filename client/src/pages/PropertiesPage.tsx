import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Property } from '../types';
import { api } from '../services/api';
import { PropertyCard } from '../components/common/PropertyCard';
import { EnquiryModal } from '../components/common/EnquiryModal';
import {
  Filter,
  Search,
  RotateCcw,
  LayoutGrid,
  List,
  Sparkles,
  ShieldCheck,
  Building,
  Car,
  Clock,
  SlidersHorizontal,
  ChevronDown
} from 'lucide-react';

export const PropertiesPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [properties, setProperties] = useState<Property[]>([]);
  const [filterOptions, setFilterOptions] = useState<any>({
    cities: ['Hyderabad'],
    localities: [],
    propertyTypes: [],
    furnishings: [],
    parkingOptions: [],
    tenantTypes: []
  });
  const [loading, setLoading] = useState(true);
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);
  const [enquiryModalOpen, setEnquiryModalOpen] = useState(false);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  // Filters State
  const [search, setSearch] = useState(searchParams.get('search') || '');
  const [city, setCity] = useState(searchParams.get('city') || '');
  const [locality, setLocality] = useState(searchParams.get('locality') || '');
  const [bhk, setBhk] = useState(searchParams.get('bhk') || '');
  const [propertyType, setPropertyType] = useState(searchParams.get('propertyType') || '');
  const [minRent, setMinRent] = useState(searchParams.get('minRent') || '');
  const [maxRent, setMaxRent] = useState(searchParams.get('maxRent') || '');
  const [parking, setParking] = useState(searchParams.get('parking') || '');
  const [furnishing, setFurnishing] = useState(searchParams.get('furnishing') || '');
  const [tenantType, setTenantType] = useState(searchParams.get('tenantType') || '');
  const [maxTravelTime, setMaxTravelTime] = useState(searchParams.get('maxTravelTime') || '');
  const [petFriendly, setPetFriendly] = useState(searchParams.get('petFriendly') === 'true');
  const [powerBackup, setPowerBackup] = useState(searchParams.get('powerBackup') === 'true');
  const [lift, setLift] = useState(searchParams.get('lift') === 'true');
  const [security, setSecurity] = useState(searchParams.get('security') === 'true');
  const [balcony, setBalcony] = useState(searchParams.get('balcony') === 'true');
  const [gatedCommunity, setGatedCommunity] = useState(searchParams.get('gatedCommunity') === 'true');
  const [sortBy, setSortBy] = useState(searchParams.get('sortBy') || 'newest');

  const fetchProperties = () => {
    setLoading(true);
    const params: Record<string, string> = {};
    if (search) params.search = search;
    if (city) params.city = city;
    if (locality) params.locality = locality;
    if (bhk) params.bhk = bhk;
    if (propertyType) params.propertyType = propertyType;
    if (minRent) params.minRent = minRent;
    if (maxRent) params.maxRent = maxRent;
    if (parking) params.parking = parking;
    if (furnishing) params.furnishing = furnishing;
    if (tenantType) params.tenantType = tenantType;
    if (maxTravelTime) params.maxTravelTime = maxTravelTime;
    if (petFriendly) params.petFriendly = 'true';
    if (powerBackup) params.powerBackup = 'true';
    if (lift) params.lift = 'true';
    if (security) params.security = 'true';
    if (balcony) params.balcony = 'true';
    if (gatedCommunity) params.gatedCommunity = 'true';
    if (sortBy) params.sortBy = sortBy;

    api.getProperties(params)
      .then(res => {
        setProperties(res.properties);
        if (res.filterOptions) {
          setFilterOptions(res.filterOptions);
        }
      })
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchProperties();
  }, [
    search, city, locality, bhk, propertyType, minRent, maxRent,
    parking, furnishing, tenantType, maxTravelTime,
    petFriendly, powerBackup, lift, security, balcony, gatedCommunity, sortBy
  ]);

  const handleResetFilters = () => {
    setSearch('');
    setCity('');
    setLocality('');
    setBhk('');
    setPropertyType('');
    setMinRent('');
    setMaxRent('');
    setParking('');
    setFurnishing('');
    setTenantType('');
    setMaxTravelTime('');
    setPetFriendly(false);
    setPowerBackup(false);
    setLift(false);
    setSecurity(false);
    setBalcony(false);
    setGatedCommunity(false);
    setSortBy('newest');
    setSearchParams({});
  };

  const handleEnquireClick = (property: Property) => {
    setSelectedProperty(property);
    setEnquiryModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-slate-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header Title & Search Bar */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
            <div>
              <span className="text-xs font-bold text-brand-600 uppercase tracking-wider flex items-center gap-1">
                <ShieldCheck className="w-4 h-4" /> Verified Rental Discovery
              </span>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                Available Rental Properties
              </h1>
              <p className="text-xs text-slate-500 mt-1">
                Direct owner coordination • Verified listings • Zero brokerage confusion
              </p>
            </div>

            {/* Sort & View Toggle */}
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 bg-white px-3 py-2 rounded-xl border border-slate-200 shadow-sm text-xs">
                <span className="text-slate-500 font-medium">Sort By:</span>
                <select
                  value={sortBy}
                  onChange={e => setSortBy(e.target.value)}
                  className="bg-transparent font-semibold text-slate-800 focus:outline-none cursor-pointer"
                >
                  <option value="newest">Newest First</option>
                  <option value="match">Best Requirement Match</option>
                  <option value="rent_asc">Rent: Low to High</option>
                  <option value="rent_desc">Rent: High to Low</option>
                </select>
              </div>

              <div className="hidden sm:flex items-center bg-white p-1 rounded-xl border border-slate-200 shadow-sm">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-1.5 rounded-lg transition ${
                    viewMode === 'grid' ? 'bg-brand-600 text-white shadow-sm' : 'text-slate-500 hover:text-slate-800'
                  }`}
                  title="Grid View"
                >
                  <LayoutGrid className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-1.5 rounded-lg transition ${
                    viewMode === 'list' ? 'bg-brand-600 text-white shadow-sm' : 'text-slate-500 hover:text-slate-800'
                  }`}
                  title="List View"
                >
                  <List className="w-4 h-4" />
                </button>
              </div>

              {/* Mobile Filter Toggle */}
              <button
                onClick={() => setMobileFilterOpen(!mobileFilterOpen)}
                className="md:hidden flex items-center gap-1.5 px-3 py-2 bg-brand-600 text-white text-xs font-semibold rounded-xl"
              >
                <Filter className="w-3.5 h-3.5" /> Filters
              </button>
            </div>
          </div>

          {/* Quick Search Input */}
          <div className="relative">
            <Search className="w-5 h-5 text-slate-400 absolute left-4 top-3.5" />
            <input
              type="text"
              placeholder="Search by locality, apartment name, landmark or keywords (e.g. Madhapur 2 BHK, Gated Community)..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-white border border-slate-200 rounded-2xl text-sm font-medium text-slate-800 shadow-sm focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent"
            />
          </div>
        </div>

        {/* Main Grid: Sidebar Filters + Property Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* FILTER SIDEBAR (Desktop & Mobile Drawer) */}
          <aside className={`md:block ${mobileFilterOpen ? 'block' : 'hidden'} md:col-span-1`}>
            <div className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-sm space-y-6 sticky top-24">
              <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                <span className="text-sm font-bold text-slate-900 flex items-center gap-2">
                  <SlidersHorizontal className="w-4 h-4 text-brand-600" /> Filters
                </span>
                <button
                  onClick={handleResetFilters}
                  className="text-xs text-rose-600 hover:text-rose-700 font-semibold flex items-center gap-1 transition"
                >
                  <RotateCcw className="w-3 h-3" /> Reset
                </button>
              </div>

              {/* BHK Selection */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-2">
                  BHK Preference
                </label>
                <div className="grid grid-cols-4 gap-1.5">
                  {['', '1', '2', '3', '4'].map(b => (
                    <button
                      key={b}
                      onClick={() => setBhk(b)}
                      className={`py-1.5 text-xs font-bold rounded-xl transition ${
                        bhk === b
                          ? 'bg-brand-600 text-white shadow-sm'
                          : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                      }`}
                    >
                      {b ? `${b} BHK` : 'All'}
                    </button>
                  ))}
                </div>
              </div>

              {/* Locality Dropdown */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-2">
                  Locality / Area
                </label>
                <select
                  value={locality}
                  onChange={e => setLocality(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-brand-500"
                >
                  <option value="">All Localities</option>
                  {filterOptions.localities.map((loc: string) => (
                    <option key={loc} value={loc}>{loc}</option>
                  ))}
                </select>
              </div>

              {/* Monthly Budget Range */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-2">
                  Max Monthly Rent: {maxRent ? `₹${Number(maxRent).toLocaleString('en-IN')}` : 'Any'}
                </label>
                <input
                  type="range"
                  min="10000"
                  max="80000"
                  step="2500"
                  value={maxRent || 80000}
                  onChange={e => setMaxRent(e.target.value)}
                  className="w-full accent-brand-600 cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-slate-400 font-semibold mt-1">
                  <span>₹10,000</span>
                  <span>₹45,000</span>
                  <span>₹80,000+</span>
                </div>
              </div>

              {/* Property Type */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-2">
                  Property Type
                </label>
                <select
                  value={propertyType}
                  onChange={e => setPropertyType(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-brand-500"
                >
                  <option value="">All Types</option>
                  <option value="Apartment">Apartment</option>
                  <option value="Gated Community">Gated Community</option>
                  <option value="Villa">Villa</option>
                  <option value="Independent House">Independent House</option>
                </select>
              </div>

              {/* Parking */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-2">
                  Parking
                </label>
                <select
                  value={parking}
                  onChange={e => setParking(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-brand-500"
                >
                  <option value="">Any Parking</option>
                  <option value="Bike Only">Bike Only</option>
                  <option value="Car Only">Car Only</option>
                  <option value="Car + Bike">Car + Bike</option>
                </select>
              </div>

              {/* Furnishing */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-2">
                  Furnishing
                </label>
                <select
                  value={furnishing}
                  onChange={e => setFurnishing(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-brand-500"
                >
                  <option value="">Any Furnishing</option>
                  <option value="Unfurnished">Unfurnished</option>
                  <option value="Semi-Furnished">Semi-Furnished</option>
                  <option value="Fully Furnished">Fully Furnished</option>
                </select>
              </div>

              {/* Tenant Suitability */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-2">
                  Tenant Type
                </label>
                <select
                  value={tenantType}
                  onChange={e => setTenantType(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-brand-500"
                >
                  <option value="">Any Tenants</option>
                  <option value="Family">Family Only</option>
                  <option value="Bachelors">Bachelors Friendly</option>
                  <option value="Working Professionals">Working Professionals</option>
                </select>
              </div>

              {/* Amenities Checkboxes */}
              <div className="pt-2 border-t border-slate-100">
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-2">
                  Specific Features
                </label>
                <div className="space-y-2 text-xs">
                  <label className="flex items-center gap-2 text-slate-700 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={petFriendly}
                      onChange={e => setPetFriendly(e.target.checked)}
                      className="rounded border-slate-300 text-brand-600 focus:ring-brand-500"
                    />
                    <span>🐾 Pet Friendly</span>
                  </label>
                  <label className="flex items-center gap-2 text-slate-700 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={powerBackup}
                      onChange={e => setPowerBackup(e.target.checked)}
                      className="rounded border-slate-300 text-brand-600 focus:ring-brand-500"
                    />
                    <span>⚡ Power Backup</span>
                  </label>
                  <label className="flex items-center gap-2 text-slate-700 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={lift}
                      onChange={e => setLift(e.target.checked)}
                      className="rounded border-slate-300 text-brand-600 focus:ring-brand-500"
                    />
                    <span>🛗 Lift / Elevator</span>
                  </label>
                  <label className="flex items-center gap-2 text-slate-700 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={gatedCommunity}
                      onChange={e => setGatedCommunity(e.target.checked)}
                      className="rounded border-slate-300 text-brand-600 focus:ring-brand-500"
                    />
                    <span>🛡️ Gated Community</span>
                  </label>
                  <label className="flex items-center gap-2 text-slate-700 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={balcony}
                      onChange={e => setBalcony(e.target.checked)}
                      className="rounded border-slate-300 text-brand-600 focus:ring-brand-500"
                    />
                    <span>🌿 Balcony / Sitout</span>
                  </label>
                </div>
              </div>
            </div>
          </aside>

          {/* LISTINGS DISPLAY */}
          <main className="md:col-span-3">
            <div className="flex items-center justify-between mb-4">
              <p className="text-xs text-slate-500 font-semibold">
                Showing <span className="text-slate-900 font-bold">{properties.length}</span> verified properties
              </p>
            </div>

            {loading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {[1, 2, 3, 4, 5, 6].map(n => (
                  <div key={n} className="bg-white rounded-2xl border border-slate-200 h-80 animate-pulse" />
                ))}
              </div>
            ) : properties.length === 0 ? (
              <div className="bg-white rounded-3xl p-12 text-center border border-slate-200/90 shadow-sm space-y-4">
                <div className="w-16 h-16 rounded-2xl bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
                  <Building className="w-8 h-8" />
                </div>
                <h3 className="text-lg font-bold text-slate-900">No matching properties found</h3>
                <p className="text-xs text-slate-500 max-w-sm mx-auto">
                  Try clearing some filters or tell our consultants what you need through the house requirement form.
                </p>
                <div className="pt-2 flex justify-center gap-3">
                  <button
                    onClick={handleResetFilters}
                    className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl text-xs font-semibold transition"
                  >
                    Clear Filters
                  </button>
                  <a
                    href="/my-requirements"
                    className="px-4 py-2 bg-brand-600 hover:bg-brand-700 text-white rounded-xl text-xs font-semibold shadow-sm transition"
                  >
                    Submit Requirements
                  </a>
                </div>
              </div>
            ) : (
              <div className={`grid ${viewMode === 'grid' ? 'grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6' : 'grid-cols-1 gap-4'}`}>
                {properties.map(prop => (
                  <PropertyCard
                    key={prop.id}
                    property={prop}
                    onEnquireClick={handleEnquireClick}
                  />
                ))}
              </div>
            )}
          </main>
        </div>
      </div>

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
