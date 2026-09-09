import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Enquiry } from '../types';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';
import {
  FileText,
  Clock,
  CheckCircle2,
  Calendar,
  PhoneCall,
  ArrowRight,
  ShieldCheck,
  Building,
  AlertCircle
} from 'lucide-react';

const STATUS_STEPS = [
  { key: 'new', label: 'Enquiry Received' },
  { key: 'contacted', label: 'Consultant Contacted' },
  { key: 'property_shared', label: 'Property Brochure Shared' },
  { key: 'visit_scheduled', label: 'Site Visit Scheduled' },
  { key: 'negotiation', label: 'Owner Interaction' },
  { key: 'completed', label: 'Deal Finalized' }
];

export const CustomerEnquiriesPage: React.FC = () => {
  const { user } = useAuth();
  const [enquiries, setEnquiries] = useState<Enquiry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      api.getMyEnquiries()
        .then(res => setEnquiries(res.enquiries || []))
        .catch(err => console.error(err))
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, [user]);

  if (!user) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-3xl p-8 max-w-md w-full text-center space-y-4 border border-slate-200 shadow-xl">
          <FileText className="w-12 h-12 text-brand-600 mx-auto" />
          <h2 className="text-xl font-bold text-slate-900">Sign in to View Enquiries</h2>
          <p className="text-xs text-slate-500">Track the live progress of your house visit requests and owner contact sharing.</p>
          <Link to="/login" className="inline-block px-6 py-2.5 bg-brand-600 hover:bg-brand-700 text-white font-bold text-xs rounded-xl shadow-md transition">
            Sign In Now
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto space-y-8">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-brand-600 uppercase tracking-wider mb-1">
            <FileText className="w-4 h-4" /> Live Tracking
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
            My House Enquiries & Leads
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Track status updates from our rental consultants as we coordinate with property owners.
          </p>
        </div>

        {loading ? (
          <div className="space-y-4">
            {[1, 2].map(n => (
              <div key={n} className="bg-white rounded-3xl p-6 border border-slate-200 h-44 animate-pulse" />
            ))}
          </div>
        ) : enquiries.length === 0 ? (
          <div className="bg-white rounded-3xl p-12 text-center border border-slate-200 shadow-sm space-y-4">
            <Building className="w-12 h-12 text-slate-400 mx-auto" />
            <h3 className="text-lg font-bold text-slate-900">No active enquiries yet</h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              Browse available houses or submit your requirement to get started with our consultancy team.
            </p>
            <Link
              to="/properties"
              className="inline-flex items-center gap-1.5 px-6 py-3 bg-brand-600 hover:bg-brand-700 text-white font-bold text-xs rounded-xl shadow-md transition"
            >
              Browse Houses <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        ) : (
          <div className="space-y-6">
            {enquiries.map(enq => {
              const currentStepIndex = STATUS_STEPS.findIndex(s => s.key === enq.status);
              return (
                <div
                  key={enq.id}
                  className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-lg space-y-6"
                >
                  {/* Top Enq Info */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="px-2.5 py-0.5 bg-slate-900 text-white font-bold rounded-lg text-xs">
                          {enq.enquiry_code}
                        </span>
                        <span className="text-xs text-slate-500">
                          Submitted on {new Date(enq.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                        </span>
                      </div>
                      <h3 className="text-lg font-bold text-slate-900">
                        {enq.property_title || 'Rental Property'}
                      </h3>
                      <p className="text-xs text-slate-600">
                        {enq.bhk} BHK in <strong className="text-slate-800">{enq.locality}</strong> • Rent: <strong className="text-slate-900">₹{enq.rent?.toLocaleString('en-IN')}/mo</strong>
                      </p>
                    </div>

                    <div className="flex items-center gap-3">
                      <Link
                        to={`/properties/${enq.property_id}`}
                        className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-semibold rounded-xl transition"
                      >
                        View Listing
                      </Link>
                      <a
                        href="tel:+919876543210"
                        className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold rounded-xl transition flex items-center gap-1"
                      >
                        <PhoneCall className="w-3.5 h-3.5" /> Call Desk
                      </a>
                    </div>
                  </div>

                  {/* Status Progress Bar */}
                  <div>
                    <span className="block text-[11px] font-bold uppercase text-slate-400 tracking-wider mb-3">
                      Enquiry Progress:
                    </span>
                    <div className="grid grid-cols-2 sm:grid-cols-6 gap-2">
                      {STATUS_STEPS.map((step, idx) => {
                        const isDone = currentStepIndex >= idx;
                        const isCurrent = currentStepIndex === idx;
                        return (
                          <div
                            key={step.key}
                            className={`p-3 rounded-2xl border text-center transition ${
                              isCurrent
                                ? 'bg-brand-50 border-brand-500 text-brand-900 font-bold shadow-sm'
                                : isDone
                                ? 'bg-emerald-50/50 border-emerald-200 text-emerald-800'
                                : 'bg-slate-50 border-slate-100 text-slate-400'
                            }`}
                          >
                            <span className="block text-[10px] font-bold mb-1">
                              Step {idx + 1}
                            </span>
                            <span className="text-xs leading-tight block">
                              {step.label}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Consultant Notes / Updates */}
                  {enq.consultant_notes && (
                    <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200/80 text-xs space-y-1">
                      <span className="font-bold text-slate-900 flex items-center gap-1.5">
                        <ShieldCheck className="w-4 h-4 text-brand-600" /> Consultant Update:
                      </span>
                      <p className="text-slate-700 leading-relaxed">
                        {enq.consultant_notes}
                      </p>
                    </div>
                  )}

                  {/* Visit Date & Contact Slot */}
                  <div className="flex flex-wrap gap-4 text-xs text-slate-600 pt-2 border-t border-slate-100">
                    {enq.preferred_visit_date && (
                      <span className="flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5 text-brand-600" />
                        Preferred Visit: <strong className="text-slate-800">{enq.preferred_visit_date}</strong>
                      </span>
                    )}
                    <span className="flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-brand-600" />
                      Contact Time: <strong className="text-slate-800">{enq.preferred_contact_time}</strong>
                    </span>
                    {enq.owner_details_shared ? (
                      <span className="px-2.5 py-0.5 bg-emerald-100 text-emerald-800 font-bold rounded-lg flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3 text-emerald-600" /> Owner Contact Shared
                      </span>
                    ) : (
                      <span className="px-2.5 py-0.5 bg-amber-100 text-amber-800 font-medium rounded-lg">
                        Owner Contact Pending Consultant Screening
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
