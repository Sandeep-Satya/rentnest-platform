import React, { useEffect, useState } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { api } from '../../services/api';
import {
  Building,
  Save,
  ArrowLeft,
  Lock,
  Plus,
  Trash2,
  Image,
  DollarSign,
  MapPin,
  ShieldCheck
} from 'lucide-react';

export const AdminAddEditProperty: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const isEdit = Boolean(id);

  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Property State
  const [title, setTitle] = useState('');
  const [propertyType, setPropertyType] = useState('Apartment');
  const [bhk, setBhk] = useState<number>(2);
  const [bedrooms, setBedrooms] = useState<number>(2);
  const [bathrooms, setBathrooms] = useState<number>(2);
  const [rent, setRent] = useState<number>(25000);
  const [deposit, setDeposit] = useState<number>(50000);
  const [city, setCity] = useState('Hyderabad');
  const [locality, setLocality] = useState('Madhapur');
  const [address, setAddress] = useState('');
  const [availableFrom, setAvailableFrom] = useState('Immediate');
  const [travelTimeMins, setTravelTimeMins] = useState<number>(20);
  const [distanceKm, setDistanceKm] = useState<number>(3.0);
  const [parking, setParking] = useState<'No Parking' | 'Bike Only' | 'Car Only' | 'Car + Bike'>('Car + Bike');
  const [furnishing, setFurnishing] = useState<'Unfurnished' | 'Semi-Furnished' | 'Fully Furnished'>('Semi-Furnished');
  const [waterAvailability, setWaterAvailability] = useState('24/7');
  const [preferredTenants, setPreferredTenants] = useState<'Any' | 'Family' | 'Bachelors' | 'Working Professionals'>('Family');
  const [powerBackup, setPowerBackup] = useState(true);
  const [lift, setLift] = useState(true);
  const [security, setSecurity] = useState(true);
  const [balcony, setBalcony] = useState(true);
  const [petFriendly, setPetFriendly] = useState(false);
  const [gatedCommunity, setGatedCommunity] = useState(false);
  const [groundFloor, setGroundFloor] = useState(false);
  const [description, setDescription] = useState('');
  const [images, setImages] = useState<string[]>([
    'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80'
  ]);
  const [newImageUrl, setNewImageUrl] = useState('');
  const [status, setStatus] = useState<'available' | 'under_discussion' | 'occupied'>('available');

  // Private Owner State
  const [ownerId, setOwnerId] = useState('');
  const [ownerName, setOwnerName] = useState('');
  const [ownerPhone, setOwnerPhone] = useState('');
  const [ownerEmail, setOwnerEmail] = useState('');
  const [ownerNotes, setOwnerNotes] = useState('');
  const [commissionTerms, setCommissionTerms] = useState('15 Days Rent upon agreement');

  // Owners list for dropdown
  const [existingOwners, setExistingOwners] = useState<any[]>([]);

  useEffect(() => {
    api.getAdminOwners()
      .then(res => setExistingOwners(res.owners || []))
      .catch(err => console.error(err));

    if (isEdit && id) {
      setLoading(true);
      api.getAdminProperties()
        .then(res => {
          const prop = res.properties.find((p: any) => p.id === id);
          if (prop) {
            setTitle(prop.title);
            setPropertyType(prop.property_type);
            setBhk(prop.bhk);
            setBedrooms(prop.bedrooms);
            setBathrooms(prop.bathrooms);
            setRent(prop.rent);
            setDeposit(prop.deposit);
            setCity(prop.city);
            setLocality(prop.locality);
            setAddress(prop.address);
            setAvailableFrom(prop.available_from);
            setTravelTimeMins(prop.travel_time_mins);
            setDistanceKm(prop.distance_km);
            setParking(prop.parking);
            setFurnishing(prop.furnishing);
            setWaterAvailability(prop.water_availability);
            setPreferredTenants(prop.preferred_tenants);
            setPowerBackup(!!prop.power_backup);
            setLift(!!prop.lift);
            setSecurity(!!prop.security);
            setBalcony(!!prop.balcony);
            setPetFriendly(!!prop.pet_friendly);
            setGatedCommunity(!!prop.gated_community);
            setGroundFloor(!!prop.ground_floor);
            setDescription(prop.description);
            setImages(prop.images || []);
            setStatus(prop.status);
            setOwnerId(prop.owner_id || '');
            setOwnerName(prop.owner_name || '');
            setOwnerPhone(prop.owner_phone || '');
            setOwnerEmail(prop.owner_email || '');
            setOwnerNotes(prop.owner_notes || '');
            setCommissionTerms(prop.owner_commission_terms || '15 Days Rent');
          }
        })
        .catch(err => setError(err.message))
        .finally(() => setLoading(false));
    }
  }, [id, isEdit]);

  const handleAddImage = () => {
    if (newImageUrl.trim()) {
      setImages([...images, newImageUrl.trim()]);
      setNewImageUrl('');
    }
  };

  const handleRemoveImage = (index: number) => {
    setImages(images.filter((_, i) => i !== index));
  };

  const handleSelectExistingOwner = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selId = e.target.value;
    setOwnerId(selId);
    if (selId) {
      const o = existingOwners.find(owner => owner.id === selId);
      if (o) {
        setOwnerName(o.name);
        setOwnerPhone(o.phone);
        setOwnerEmail(o.email || '');
        setOwnerNotes(o.notes || '');
        setCommissionTerms(o.commission_terms || '15 Days Rent');
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !rent || !locality || !address) {
      setError('Please provide title, rent, locality and address.');
      return;
    }

    setSaving(true);
    setError(null);

    const payload = {
      title,
      property_type: propertyType,
      bhk: Number(bhk),
      bedrooms: Number(bedrooms),
      bathrooms: Number(bathrooms),
      rent: Number(rent),
      deposit: Number(deposit),
      city,
      locality,
      address,
      available_from: availableFrom,
      travel_time_mins: Number(travelTimeMins),
      distance_km: Number(distanceKm),
      parking,
      furnishing,
      water_availability: waterAvailability,
      preferred_tenants: preferredTenants,
      power_backup: powerBackup,
      lift,
      security,
      balcony,
      pet_friendly: petFriendly,
      gated_community: gatedCommunity,
      ground_floor: groundFloor,
      description,
      images,
      status,
      owner_id: ownerId || undefined,
      owner_name: ownerName,
      owner_phone: ownerPhone,
      owner_email: ownerEmail,
      owner_notes: ownerNotes,
      commission_terms: commissionTerms
    };

    try {
      if (isEdit && id) {
        await api.updateProperty(id, payload);
      } else {
        await api.createProperty(payload);
      }
      navigate('/admin/properties');
    } catch (err: any) {
      setError(err.message || 'Failed to save property.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Top Breadcrumb */}
      <div className="flex items-center justify-between">
        <Link
          to="/admin/properties"
          className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-400 hover:text-white transition"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Properties List
        </Link>
        <span className="text-xs text-slate-500 font-semibold">
          {isEdit ? 'Editing Existing Listing' : 'Creating New Listing'}
        </span>
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-8">
        <div>
          <h1 className="text-2xl font-black text-white">
            {isEdit ? 'Update Property & Owner Record' : 'Add New Rental Property'}
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Fill in public specifications and confidential owner contact details below.
          </p>
        </div>

        {error && (
          <div className="p-4 bg-rose-950/80 border border-rose-800 rounded-2xl text-xs text-rose-300 font-semibold">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* 1. PUBLIC PROPERTY SPECIFICATIONS */}
          <div className="space-y-4">
            <h3 className="text-sm font-bold uppercase tracking-wider text-purple-400 flex items-center gap-2 pb-2 border-b border-slate-800">
              <Building className="w-4 h-4" /> 1. Public Property Information
            </h3>

            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">Property Title *</label>
              <input
                type="text"
                required
                placeholder="e.g. Spacious 2 BHK High-Rise Apartment with Skyline View"
                value={title}
                onChange={e => setTitle(e.target.value)}
                className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-sm text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">Property Type</label>
                <select
                  value={propertyType}
                  onChange={e => setPropertyType(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs font-semibold text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                >
                  <option value="Apartment">Apartment</option>
                  <option value="Gated Community">Gated Community</option>
                  <option value="Villa">Villa</option>
                  <option value="Independent House">Independent House</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">BHK Configuration</label>
                <select
                  value={bhk}
                  onChange={e => {
                    const val = Number(e.target.value);
                    setBhk(val);
                    setBedrooms(val);
                  }}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs font-semibold text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                >
                  <option value="1">1 BHK</option>
                  <option value="2">2 BHK</option>
                  <option value="3">3 BHK</option>
                  <option value="4">4 BHK Villa</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">Bathrooms</label>
                <input
                  type="number"
                  value={bathrooms}
                  onChange={e => setBathrooms(Number(e.target.value))}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs font-semibold text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>
            </div>

            {/* Rent & Deposit */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">Monthly Rent (₹) *</label>
                <input
                  type="number"
                  required
                  step="500"
                  value={rent}
                  onChange={e => {
                    const r = Number(e.target.value);
                    setRent(r);
                    if (!deposit || deposit === rent * 2) setDeposit(r * 2);
                  }}
                  className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-sm font-bold text-emerald-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">Security Deposit (₹)</label>
                <input
                  type="number"
                  required
                  step="1000"
                  value={deposit}
                  onChange={e => setDeposit(Number(e.target.value))}
                  className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-sm font-bold text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>
            </div>

            {/* Location & Travel */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">Locality / Area *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Madhapur"
                  value={locality}
                  onChange={e => setLocality(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs font-semibold text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">Travel Time (Mins)</label>
                <input
                  type="number"
                  value={travelTimeMins}
                  onChange={e => setTravelTimeMins(Number(e.target.value))}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs font-semibold text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">Available Date</label>
                <input
                  type="text"
                  placeholder="e.g. Immediate or 1st Oct"
                  value={availableFrom}
                  onChange={e => setAvailableFrom(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs font-semibold text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">Full Address *</label>
              <input
                type="text"
                required
                placeholder="Flat 402, Cyber Heights, Near Metro Station, Madhapur"
                value={address}
                onChange={e => setAddress(e.target.value)}
                className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>

            {/* Parking, Furnishing, Water */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">Parking</label>
                <select
                  value={parking}
                  onChange={e => setParking(e.target.value as any)}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs font-semibold text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                >
                  <option value="No Parking">No Parking</option>
                  <option value="Bike Only">Bike Only</option>
                  <option value="Car Only">Car Only</option>
                  <option value="Car + Bike">Car + Bike</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">Furnishing</label>
                <select
                  value={furnishing}
                  onChange={e => setFurnishing(e.target.value as any)}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs font-semibold text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                >
                  <option value="Unfurnished">Unfurnished</option>
                  <option value="Semi-Furnished">Semi-Furnished</option>
                  <option value="Fully Furnished">Fully Furnished</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">Preferred Tenants</label>
                <select
                  value={preferredTenants}
                  onChange={e => setPreferredTenants(e.target.value as any)}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs font-semibold text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                >
                  <option value="Family">Family Only</option>
                  <option value="Bachelors">Bachelors Friendly</option>
                  <option value="Working Professionals">Working Professionals</option>
                  <option value="Any">Any</option>
                </select>
              </div>
            </div>

            {/* Checkbox features */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-2">
              <label className="flex items-center gap-2 text-xs text-slate-300 cursor-pointer">
                <input
                  type="checkbox"
                  checked={powerBackup}
                  onChange={e => setPowerBackup(e.target.checked)}
                  className="rounded bg-slate-950 border-slate-700 text-purple-600 focus:ring-purple-500"
                />
                <span>Power Backup</span>
              </label>

              <label className="flex items-center gap-2 text-xs text-slate-300 cursor-pointer">
                <input
                  type="checkbox"
                  checked={lift}
                  onChange={e => setLift(e.target.checked)}
                  className="rounded bg-slate-950 border-slate-700 text-purple-600 focus:ring-purple-500"
                />
                <span>Lift / Elevator</span>
              </label>

              <label className="flex items-center gap-2 text-xs text-slate-300 cursor-pointer">
                <input
                  type="checkbox"
                  checked={security}
                  onChange={e => setSecurity(e.target.checked)}
                  className="rounded bg-slate-950 border-slate-700 text-purple-600 focus:ring-purple-500"
                />
                <span>24/7 Security</span>
              </label>

              <label className="flex items-center gap-2 text-xs text-slate-300 cursor-pointer">
                <input
                  type="checkbox"
                  checked={balcony}
                  onChange={e => setBalcony(e.target.checked)}
                  className="rounded bg-slate-950 border-slate-700 text-purple-600 focus:ring-purple-500"
                />
                <span>Balcony</span>
              </label>

              <label className="flex items-center gap-2 text-xs text-slate-300 cursor-pointer">
                <input
                  type="checkbox"
                  checked={petFriendly}
                  onChange={e => setPetFriendly(e.target.checked)}
                  className="rounded bg-slate-950 border-slate-700 text-purple-600 focus:ring-purple-500"
                />
                <span>Pet Friendly</span>
              </label>

              <label className="flex items-center gap-2 text-xs text-slate-300 cursor-pointer">
                <input
                  type="checkbox"
                  checked={gatedCommunity}
                  onChange={e => setGatedCommunity(e.target.checked)}
                  className="rounded bg-slate-950 border-slate-700 text-purple-600 focus:ring-purple-500"
                />
                <span>Gated Society</span>
              </label>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">Public Description</label>
              <textarea
                rows={3}
                placeholder="Detailed property highlights..."
                value={description}
                onChange={e => setDescription(e.target.value)}
                className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>

            {/* Images Manager */}
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-2">Property Photos (Image URLs)</label>
              <div className="flex gap-2 mb-3">
                <input
                  type="url"
                  placeholder="Paste Unsplash / photo image URL..."
                  value={newImageUrl}
                  onChange={e => setNewImageUrl(e.target.value)}
                  className="flex-1 px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
                <button
                  type="button"
                  onClick={handleAddImage}
                  className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-xl text-xs font-bold transition flex items-center gap-1"
                >
                  <Plus className="w-3.5 h-3.5" /> Add URL
                </button>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {images.map((img, idx) => (
                  <div key={idx} className="relative aspect-video rounded-xl overflow-hidden border border-slate-700 group">
                    <img src={img} alt={`Preview ${idx}`} className="w-full h-full object-cover" />
                    <button
                      type="button"
                      onClick={() => handleRemoveImage(idx)}
                      className="absolute top-1.5 right-1.5 p-1 bg-rose-600 text-white rounded-lg opacity-80 group-hover:opacity-100 transition"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* 2. PRIVATE OWNER CRM DETAILS */}
          <div className="p-6 bg-slate-950 rounded-3xl border border-purple-900/60 space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-800">
              <h3 className="text-sm font-bold uppercase tracking-wider text-amber-400 flex items-center gap-2">
                <Lock className="w-4 h-4" /> 2. Private Owner Record (Protected from Public)
              </h3>
              <span className="text-[11px] text-slate-400">Never exposed to tenant website</span>
            </div>

            {/* Select Existing Owner */}
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">
                Link Existing Property Owner (Optional)
              </label>
              <select
                value={ownerId}
                onChange={handleSelectExistingOwner}
                className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs font-semibold text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
              >
                <option value="">-- Or enter new owner info below --</option>
                {existingOwners.map(o => (
                  <option key={o.id} value={o.id}>
                    {o.name} ({o.phone}) - {o.commission_terms || '15 Days'}
                  </option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">Owner Full Name</label>
                <input
                  type="text"
                  placeholder="e.g. K. V. Ramana Rao"
                  value={ownerName}
                  onChange={e => setOwnerName(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs font-semibold text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">Owner Phone / WhatsApp *</label>
                <input
                  type="tel"
                  placeholder="e.g. +91 94401 23456"
                  value={ownerPhone}
                  onChange={e => setOwnerPhone(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs font-semibold text-emerald-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">Owner Email</label>
                <input
                  type="email"
                  placeholder="e.g. ramana.rao@gmail.com"
                  value={ownerEmail}
                  onChange={e => setOwnerEmail(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">Commission Agreement Terms</label>
                <input
                  type="text"
                  placeholder="e.g. 15 Days Rent upon agreement or ₹15,000 flat"
                  value={commissionTerms}
                  onChange={e => setCommissionTerms(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs font-semibold text-amber-300 focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">Confidential Consultant Notes</label>
              <textarea
                rows={2}
                placeholder="e.g. Owner is strict about non-veg / prefers prompt rent payer on 1st of month..."
                value={ownerNotes}
                onChange={e => setOwnerNotes(e.target.value)}
                className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-800">
            <Link
              to="/admin/properties"
              className="px-5 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold rounded-xl text-xs transition"
            >
              Cancel
            </Link>
            <button
              type="submit"
              disabled={saving}
              className="px-8 py-3 bg-purple-600 hover:bg-purple-700 text-white font-extrabold rounded-xl text-xs shadow-lg shadow-purple-600/30 transition flex items-center gap-2 disabled:opacity-50"
            >
              {saving ? 'Saving...' : (
                <>
                  <Save className="w-4 h-4" />
                  {isEdit ? 'Save Property & Owner Changes' : 'Publish Property Listing'}
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
