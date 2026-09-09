import React, { useEffect, useState } from 'react';
import { CustomerRequirement, Property } from '../types';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { PropertyCard } from '../components/common/PropertyCard';
import { EnquiryModal } from '../components/common/EnquiryModal';
import confetti from 'canvas-confetti';
import {
  Sparkles,
  Building,
  CheckCircle2,
  Car,
  Clock,
  Send,
  Save,
  MapPin,
  HelpCircle,
  ShieldCheck,
  Zap,
  Check
} from 'lucide-react';

const HYD_LOCALITIES = [
  'Madhapur',
  'Gachibowli',
  'Kondapur',
  'Financial District',
  'Jubilee Hills',
  'Banjara Hills',
  'Kukatpally',
  'Manikonda',
  'Hitec City',
  'Nanakramguda'
];

export const RequirementFormPage: React.FC = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [matchedProperties, setMatchedProperties] = useState<Property[]>([]);
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);
  const [enquiryModalOpen, setEnquiryModalOpen] = useState(false);

  // Form State
  const [preferredCity, setPreferredCity] = useState('Hyderabad');
  const [preferredAreas, setPreferredAreas] = useState<string[]>(['Madhapur', 'Gachibowli']);
  const [houseTypes, setHouseTypes] = useState<string[]>(['Apartment', 'Gated Community']);
  const [bhkList, setBhkList] = useState<number[]>([2, 3]);
  const [minRent, setMinRent] = useState<number>(15000);
  const [maxRent, setMaxRent] = useState<number>(35000);
  const [totalPeople, setTotalPeople] = useState<number>(3);
  const [tenantType, setTenantType] = useState<'Family' | 'Bachelors' | 'Working Professionals' | 'Any'>('Family');
  const [parkingNeeded, setParkingNeeded] = useState<'No Parking' | 'Bike Only' | 'Car Only' | 'Car + Bike'>('Car + Bike');
  const [maxTravelTime, setMaxTravelTime] = useState<number>(30);
  const [preferredDistance, setPreferredDistance] = useState<number>(10);
  const [furnishingPref, setFurnishingPref] = useState<string[]>(['Semi-Furnished', 'Fully Furnished']);
  const [petFriendly, setPetFriendly] = useState<boolean>(false);
  const [bathroomsNeeded, setBathroomsNeeded] = useState<number>(2);
  const [waterReq, setWaterReq] = useState<string>('24/7');
  const [powerBackupNeeded, setPowerBackupNeeded] = useState<boolean>(true);
  const [liftNeeded, setLiftNeeded] = useState<boolean>(true);
  const [securityNeeded, setSecurityNeeded] = useState<boolean>(true);
  const [balconyNeeded, setBalconyNeeded] = useState<boolean>(true);
  const [gatedCommunityNeeded, setGatedCommunityNeeded] = useState<boolean>(false);
  const [groundFloorPref, setGroundFloorPref] = useState<boolean>(false);
  const [otherNotes, setOtherNotes] = useState<string>('');

  useEffect(() => {
    if (user) {
      setLoading(true);
      api.getMyRequirement()
        .then(res => {
          if (res.requirement) {
            const req = res.requirement;
            setPreferredCity(req.preferred_city || 'Hyderabad');
            setPreferredAreas(req.preferred_areas || []);
            setHouseTypes(req.house_types || []);
            setBhkList(req.bhk_list || []);
            setMinRent(req.min_rent || 15000);
            setMaxRent(req.max_rent || 35000);
            setTotalPeople(req.total_people || 2);
            setTenantType(req.tenant_type || 'Family');
            setParkingNeeded(req.parking_needed || 'Car + Bike');
            setMaxTravelTime(req.max_travel_time || 30);
            setPreferredDistance(req.preferred_distance || 10);
            setFurnishingPref(req.furnishing_pref || []);
            setPetFriendly(!!req.pet_friendly);
            setBathroomsNeeded(req.bathrooms_needed || 2);
            setWaterReq(req.water_req || '24/7');
            setPowerBackupNeeded(!!req.power_backup_needed);
            setLiftNeeded(!!req.lift_needed);
            setSecurityNeeded(!!req.security_needed);
            setBalconyNeeded(!!req.balcony_needed);
            setGatedCommunityNeeded(!!req.gated_community_needed);
            setGroundFloorPref(!!req.ground_floor_pref);
            setOtherNotes(req.other_notes || '');
          }
        })
        .catch(err => console.error(err))
        .finally(() => setLoading(false));
    }
  }, [user]);

  const toggleArea = (area: string) => {
    setPreferredAreas(prev =>
      prev.includes(area) ? prev.filter(a => a !== area) : [...prev, area]
    );
  };

  const toggleHouseType = (type: string) => {
    setHouseTypes(prev =>
      prev.includes(type) ? prev.filter(t => t !== type) : [...prev, type]
    );
  };

  const toggleBhk = (b: number) => {
    setBhkList(prev =>
      prev.includes(b) ? prev.filter(item => item !== b) : [...prev, b]
    );
  };

  const toggleFurnishing = (f: string) => {
    setFurnishingPref(prev =>
      prev.includes(f) ? prev.filter(item => item !== f) : [...prev, f]
    );
  };

  const handleSaveAndMatch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      alert('Please sign in to save your requirements and view customized matches.');
      return;
    }

    setSaving(true);
    setSavedSuccess(false);

    try {
      const payload: CustomerRequirement = {
        preferred_city: preferredCity,
        preferred_areas: preferredAreas,
        house_types: houseTypes,
        bhk_list: bhkList,
        min_rent: minRent,
        max_rent: maxRent,
        total_people: totalPeople,
        tenant_type: tenantType,
        parking_needed: parkingNeeded,
        max_travel_time: maxTravelTime,
        preferred_distance: preferredDistance,
        furnishing_pref: furnishingPref,
        pet_friendly: petFriendly,
        bathrooms_needed: bathroomsNeeded,
        water_req: waterReq,
        power_backup_needed: powerBackupNeeded,
        lift_needed: liftNeeded,
        security_needed: securityNeeded,
        balcony_needed: balconyNeeded,
        gated_community_needed: gatedCommunityNeeded,
        ground_floor_pref: groundFloorPref,
        other_notes: otherNotes
      };

      const res = await api.saveMyRequirement(payload);
      setMatchedProperties(res.matchedProperties || []);
      setSavedSuccess(true);

      confetti({
        particleCount: 60,
        spread: 70,
        origin: { y: 0.7 }
      });
    } catch (err: any) {
      alert(err.message || 'Failed to save requirements.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto space-y-10">
        {/* Header Title */}
        <div className="text-center max-w-3xl mx-auto space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-100 text-emerald-800 rounded-full text-xs font-bold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5 text-emerald-600" /> Smart House Requirement Form
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Tell Us What You Are Looking For
          </h1>
          <p className="text-sm text-slate-600">
            Fill out your detailed preferences below. Our algorithm calculates instant matching scores for available houses and notifies our consultant team.
          </p>
        </div>

        {/* The Form */}
        <form onSubmit={handleSaveAndMatch} className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-200/90 shadow-xl space-y-8">
          {/* SECTION 1: BASIC REQUIREMENTS */}
          <div>
            <h3 className="text-base font-bold text-slate-900 mb-4 pb-2 border-b border-slate-100 flex items-center gap-2">
              <MapPin className="w-4 h-4 text-brand-600" /> 1. Location & House Type
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {/* City */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
                  Preferred City
                </label>
                <select
                  value={preferredCity}
                  onChange={e => setPreferredCity(e.target.value)}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold text-slate-800 focus:ring-2 focus:ring-brand-500 focus:outline-none"
                >
                  <option value="Hyderabad">Hyderabad</option>
                  <option value="Bangalore">Bangalore</option>
                </select>
              </div>

              {/* Preferred Localities Chips */}
              <div className="sm:col-span-2">
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-2">
                  Select Preferred Localities / Areas
                </label>
                <div className="flex flex-wrap gap-2">
                  {HYD_LOCALITIES.map(loc => {
                    const selected = preferredAreas.includes(loc);
                    return (
                      <button
                        type="button"
                        key={loc}
                        onClick={() => toggleArea(loc)}
                        className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition ${
                          selected
                            ? 'bg-brand-600 text-white shadow-sm'
                            : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                        }`}
                      >
                        {selected ? '✓ ' : '+ '}{loc}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* BHK */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-2">
                  Preferred BHK
                </label>
                <div className="grid grid-cols-4 gap-2">
                  {[1, 2, 3, 4].map(b => {
                    const selected = bhkList.includes(b);
                    return (
                      <button
                        type="button"
                        key={b}
                        onClick={() => toggleBhk(b)}
                        className={`py-2 rounded-xl text-xs font-bold transition ${
                          selected
                            ? 'bg-brand-600 text-white shadow-sm'
                            : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                        }`}
                      >
                        {b} BHK
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* House Types */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-2">
                  House Type Preference
                </label>
                <div className="flex flex-wrap gap-2">
                  {['Apartment', 'Gated Community', 'Villa', 'Independent House'].map(t => {
                    const selected = houseTypes.includes(t);
                    return (
                      <button
                        type="button"
                        key={t}
                        onClick={() => toggleHouseType(t)}
                        className={`px-3 py-2 rounded-xl text-xs font-semibold transition ${
                          selected
                            ? 'bg-brand-600 text-white shadow-sm'
                            : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                        }`}
                      >
                        {t}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>

          {/* SECTION 2: BUDGET & OCCUPANCY */}
          <div>
            <h3 className="text-base font-bold text-slate-900 mb-4 pb-2 border-b border-slate-100 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-brand-600" /> 2. Budget & People
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              {/* Min Rent */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
                  Min Rent: ₹{minRent.toLocaleString('en-IN')}
                </label>
                <input
                  type="number"
                  step="1000"
                  value={minRent}
                  onChange={e => setMinRent(Number(e.target.value))}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold text-slate-800 focus:ring-2 focus:ring-brand-500 focus:outline-none"
                />
              </div>

              {/* Max Rent */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
                  Max Rent: ₹{maxRent.toLocaleString('en-IN')}
                </label>
                <input
                  type="number"
                  step="1000"
                  value={maxRent}
                  onChange={e => setMaxRent(Number(e.target.value))}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold text-slate-800 focus:ring-2 focus:ring-brand-500 focus:outline-none"
                />
              </div>

              {/* Occupancy Type */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
                  Tenant Type
                </label>
                <select
                  value={tenantType}
                  onChange={e => setTenantType(e.target.value as any)}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold text-slate-800 focus:ring-2 focus:ring-brand-500 focus:outline-none"
                >
                  <option value="Family">Family</option>
                  <option value="Bachelors">Bachelors</option>
                  <option value="Working Professionals">Working Professionals</option>
                  <option value="Any">Any</option>
                </select>
              </div>
            </div>
          </div>

          {/* SECTION 3: COMMUTE & PARKING */}
          <div>
            <h3 className="text-base font-bold text-slate-900 mb-4 pb-2 border-b border-slate-100 flex items-center gap-2">
              <Clock className="w-4 h-4 text-brand-600" /> 3. Travel Time & Parking Requirement
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {/* Parking */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
                  Parking Space Needed
                </label>
                <select
                  value={parkingNeeded}
                  onChange={e => setParkingNeeded(e.target.value as any)}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold text-slate-800 focus:ring-2 focus:ring-brand-500 focus:outline-none"
                >
                  <option value="No Parking">No Parking</option>
                  <option value="Bike Only">Bike Only</option>
                  <option value="Car Only">Car Only</option>
                  <option value="Car + Bike">Car + Bike (Both)</option>
                </select>
              </div>

              {/* Max Travel Time */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
                  Max Travel Time to Cyber Towers / Workplace ({maxTravelTime} mins)
                </label>
                <input
                  type="range"
                  min="10"
                  max="60"
                  step="5"
                  value={maxTravelTime}
                  onChange={e => setMaxTravelTime(Number(e.target.value))}
                  className="w-full accent-brand-600 cursor-pointer mt-2"
                />
                <div className="flex justify-between text-[10px] text-slate-400 font-semibold mt-1">
                  <span>10 mins</span>
                  <span>30 mins</span>
                  <span>60 mins</span>
                </div>
              </div>
            </div>
          </div>

          {/* SECTION 4: FURNISHING & AMENITIES */}
          <div>
            <h3 className="text-base font-bold text-slate-900 mb-4 pb-2 border-b border-slate-100 flex items-center gap-2">
              <Building className="w-4 h-4 text-brand-600" /> 4. Furnishing & Amenities
            </h3>

            {/* Furnishing */}
            <div className="mb-4">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-2">
                Furnishing Requirement
              </label>
              <div className="flex flex-wrap gap-2">
                {['Unfurnished', 'Semi-Furnished', 'Fully Furnished'].map(f => {
                  const selected = furnishingPref.includes(f);
                  return (
                    <button
                      type="button"
                      key={f}
                      onClick={() => toggleFurnishing(f)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition ${
                        selected
                          ? 'bg-brand-600 text-white shadow-sm'
                          : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                      }`}
                    >
                      {f}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Checkboxes Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs pt-2">
              <label className="flex items-center gap-2 text-slate-700 cursor-pointer">
                <input
                  type="checkbox"
                  checked={powerBackupNeeded}
                  onChange={e => setPowerBackupNeeded(e.target.checked)}
                  className="rounded border-slate-300 text-brand-600 focus:ring-brand-500"
                />
                <span>⚡ Power Backup</span>
              </label>

              <label className="flex items-center gap-2 text-slate-700 cursor-pointer">
                <input
                  type="checkbox"
                  checked={liftNeeded}
                  onChange={e => setLiftNeeded(e.target.checked)}
                  className="rounded border-slate-300 text-brand-600 focus:ring-brand-500"
                />
                <span>🛗 Lift / Elevator</span>
              </label>

              <label className="flex items-center gap-2 text-slate-700 cursor-pointer">
                <input
                  type="checkbox"
                  checked={securityNeeded}
                  onChange={e => setSecurityNeeded(e.target.checked)}
                  className="rounded border-slate-300 text-brand-600 focus:ring-brand-500"
                />
                <span>🛡️ 24/7 Security</span>
              </label>

              <label className="flex items-center gap-2 text-slate-700 cursor-pointer">
                <input
                  type="checkbox"
                  checked={balconyNeeded}
                  onChange={e => setBalconyNeeded(e.target.checked)}
                  className="rounded border-slate-300 text-brand-600 focus:ring-brand-500"
                />
                <span>🌿 Balcony</span>
              </label>

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
                  checked={gatedCommunityNeeded}
                  onChange={e => setGatedCommunityNeeded(e.target.checked)}
                  className="rounded border-slate-300 text-brand-600 focus:ring-brand-500"
                />
                <span>🏰 Gated Community</span>
              </label>
            </div>
          </div>

          {/* SECTION 5: NOTES */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
              Other Specific Requests or Shifting Timelines
            </label>
            <textarea
              rows={3}
              placeholder="e.g. Planning to shift by 1st of next month. Prefer high floor with good cross ventilation..."
              value={otherNotes}
              onChange={e => setOtherNotes(e.target.value)}
              className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium text-slate-800 focus:ring-2 focus:ring-brand-500 focus:outline-none"
            />
          </div>

          {/* SAVE BUTTON */}
          <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="text-xs text-slate-500 flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>We never sell or share your requirements with third-party brokers.</span>
            </div>

            <button
              type="submit"
              disabled={saving}
              className="w-full sm:w-auto px-8 py-3.5 bg-brand-600 hover:bg-brand-700 text-white font-extrabold rounded-2xl shadow-lg shadow-brand-600/30 text-sm transition flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {saving ? (
                'Calculating Matches...'
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  Save & Find Matching Houses
                </>
              )}
            </button>
          </div>
        </form>

        {/* MATCH RESULTS DISPLAY */}
        {savedSuccess && (
          <div className="space-y-6 pt-6 animate-in fade-in slide-in-from-bottom-4">
            <div className="bg-emerald-50 border border-emerald-200 rounded-3xl p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="space-y-1 text-center sm:text-left">
                <span className="text-xs font-bold text-emerald-800 uppercase tracking-wider flex items-center justify-center sm:justify-start gap-1">
                  <Check className="w-4 h-4 text-emerald-600" /> Requirements Saved Successfully!
                </span>
                <h3 className="text-xl font-bold text-emerald-950">
                  We found {matchedProperties.length} matching houses ranked by fit
                </h3>
                <p className="text-xs text-emerald-800">
                  Review the match breakdown below and click "I'm Interested" on any house to schedule a visit.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {matchedProperties.map(prop => (
                <PropertyCard
                  key={prop.id}
                  property={prop}
                  onEnquireClick={p => {
                    setSelectedProperty(p);
                    setEnquiryModalOpen(true);
                  }}
                />
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Enquiry Modal */}
      <EnquiryModal
        property={selectedProperty}
        isOpen={enquiryModalOpen}
        onClose={() => setEnquiryModalOpen(false)}
      />
    </div>
  );
};
