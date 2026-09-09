import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Property } from '../../types';
import { api } from '../../services/api';
import {
  Share2,
  Instagram,
  Send,
  Copy,
  Check,
  Building,
  Sparkles,
  ExternalLink,
  MapPin,
  Clock,
  Car,
  ShieldCheck
} from 'lucide-react';

export const AdminSocialStudio: React.FC = () => {
  const [searchParams] = useSearchParams();
  const initialPropId = searchParams.get('propertyId') || '';

  const [properties, setProperties] = useState<Property[]>([]);
  const [selectedPropertyId, setSelectedPropertyId] = useState(initialPropId);
  const [studioData, setStudioData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [copiedInsta, setCopiedInsta] = useState(false);
  const [copiedWa, setCopiedWa] = useState(false);

  useEffect(() => {
    api.getAdminProperties()
      .then(res => {
        setProperties(res.properties || []);
        if (!selectedPropertyId && res.properties && res.properties.length > 0) {
          setSelectedPropertyId(res.properties[0].id);
        }
      })
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (selectedPropertyId) {
      api.getSocialStudioData(selectedPropertyId)
        .then(res => setStudioData(res))
        .catch(err => console.error(err));
    }
  }, [selectedPropertyId]);

  const copyToClipboard = (text: string, type: 'insta' | 'wa') => {
    navigator.clipboard.writeText(text);
    if (type === 'insta') {
      setCopiedInsta(true);
      setTimeout(() => setCopiedInsta(false), 2000);
    } else {
      setCopiedWa(true);
      setTimeout(() => setCopiedWa(false), 2000);
    }
  };

  const currentProp = studioData?.property;

  return (
    <div className="space-y-6">
      <div>
        <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-pink-950 border border-pink-800 text-pink-300 rounded-full text-xs font-bold uppercase tracking-wider mb-1">
          <Instagram className="w-3.5 h-3.5" /> Social Media & Lead Generator Studio
        </div>
        <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
          Instagram & WhatsApp Marketing Generator
        </h1>
        <p className="text-xs text-slate-400 mt-1">
          Select any property to instantly auto-generate ready-to-post Instagram captions, hashtags, WhatsApp broadcasts, and visual story cards.
        </p>
      </div>

      {/* Property Selector Bar */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center gap-4">
        <label className="text-xs font-bold text-slate-300 flex-shrink-0">
          Select Listing to Promote:
        </label>
        <select
          value={selectedPropertyId}
          onChange={e => setSelectedPropertyId(e.target.value)}
          className="flex-1 px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs font-semibold text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
        >
          {properties.map(p => (
            <option key={p.id} value={p.id}>
              {p.prop_code} - {p.bhk} BHK in {p.locality} (₹{p.rent.toLocaleString('en-IN')}/mo) - {p.title}
            </option>
          ))}
        </select>
      </div>

      {studioData && currentProp && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* LEFT: Instagram Post Mockup Card */}
          <div className="space-y-4">
            <h3 className="text-sm font-bold uppercase tracking-wider text-pink-400 flex items-center gap-2">
              <Instagram className="w-4 h-4" /> Instagram Story / Post Visual Preview
            </h3>

            <div className="bg-gradient-to-b from-slate-900 to-black p-4 rounded-3xl border border-slate-800 shadow-2xl max-w-sm mx-auto overflow-hidden text-white space-y-3">
              {/* Instagram Card Header */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-yellow-400 via-pink-500 to-purple-600 p-[2px]">
                    <div className="w-full h-full bg-black rounded-full flex items-center justify-center font-bold text-[9px]">
                      RN
                    </div>
                  </div>
                  <div>
                    <span className="font-bold text-xs">rentnest.consultancy</span>
                    <span className="block text-[9px] text-slate-400">{currentProp.locality}, Hyderabad</span>
                  </div>
                </div>
                <span className="px-2 py-0.5 bg-emerald-600 text-white rounded text-[10px] font-bold">
                  FOR RENT
                </span>
              </div>

              {/* Photo */}
              <div className="relative aspect-square rounded-2xl overflow-hidden bg-slate-800">
                <img
                  src={currentProp.images && currentProp.images[0] ? currentProp.images[0] : 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=600'}
                  alt={currentProp.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-3 left-3 px-2.5 py-1 bg-black/80 rounded-lg text-[10px] font-bold backdrop-blur-md">
                  {currentProp.prop_code}
                </div>
                <div className="absolute bottom-3 left-3 right-3 p-3 bg-black/85 backdrop-blur-md rounded-xl space-y-1">
                  <div className="flex items-baseline justify-between">
                    <span className="text-base font-extrabold text-emerald-400">
                      ₹{currentProp.rent.toLocaleString('en-IN')}/month
                    </span>
                    <span className="text-[10px] font-semibold text-slate-300">
                      {currentProp.bhk} BHK • {currentProp.property_type}
                    </span>
                  </div>
                  <p className="text-[10px] text-slate-300 flex items-center gap-1">
                    <MapPin className="w-3 h-3 text-emerald-400" /> {currentProp.locality} ({currentProp.travel_time_mins}m to Tech Hub)
                  </p>
                </div>
              </div>

              {/* Bottom Caption snippet */}
              <div className="text-[11px] text-slate-300 space-y-1 pt-1">
                <p>
                  <strong className="text-white">rentnest.consultancy</strong> 🏠 {currentProp.bhk} BHK available immediately in {currentProp.locality}! DM or WhatsApp +91 98765 43210 for video walkthrough & owner connect.
                </p>
                <p className="text-[10px] text-pink-400">
                  #HouseForRent #HyderabadHouses #RentNest #{currentProp.locality}
                </p>
              </div>
            </div>
          </div>

          {/* RIGHT: Formatted Captions and WhatsApp Broadcast */}
          <div className="space-y-6">
            {/* INSTAGRAM CAPTION */}
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-pink-400 flex items-center gap-1.5">
                  <Instagram className="w-4 h-4" /> Ready-to-Copy Instagram Caption
                </span>
                <button
                  onClick={() => copyToClipboard(studioData.instagramCaption, 'insta')}
                  className="px-3 py-1.5 bg-pink-600 hover:bg-pink-700 text-white rounded-xl text-xs font-bold transition flex items-center gap-1.5"
                >
                  {copiedInsta ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5 text-pink-200" />}
                  {copiedInsta ? 'Caption Copied!' : 'Copy Caption'}
                </button>
              </div>

              <textarea
                readOnly
                rows={8}
                value={studioData.instagramCaption}
                className="w-full p-3 bg-slate-950 border border-slate-800 rounded-xl text-xs font-mono text-slate-200 focus:outline-none"
              />
            </div>

            {/* WHATSAPP BROADCAST TEMPLATE */}
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-emerald-400 flex items-center gap-1.5">
                  <Send className="w-4 h-4" /> WhatsApp Broadcast Message
                </span>
                <button
                  onClick={() => copyToClipboard(studioData.whatsappBroadcast, 'wa')}
                  className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition flex items-center gap-1.5"
                >
                  {copiedWa ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5 text-emerald-200" />}
                  {copiedWa ? 'Broadcast Copied!' : 'Copy WhatsApp Text'}
                </button>
              </div>

              <textarea
                readOnly
                rows={6}
                value={studioData.whatsappBroadcast}
                className="w-full p-3 bg-slate-950 border border-slate-800 rounded-xl text-xs font-mono text-slate-200 focus:outline-none"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
