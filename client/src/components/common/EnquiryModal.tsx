import React, { useState, useEffect } from 'react';
import { Property } from '../../types';
import { useAuth } from '../../context/AuthContext';
import { api } from '../../services/api';
import confetti from 'canvas-confetti';
import {
  X,
  ShieldCheck,
  Calendar,
  Clock,
  Send,
  Phone,
  User as UserIcon,
  Mail,
  CheckCircle2,
  Lock
} from 'lucide-react';

interface EnquiryModalProps {
  property: Property | null;
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export const EnquiryModal: React.FC<EnquiryModalProps> = ({
  property,
  isOpen,
  onClose,
  onSuccess
}) => {
  const { user } = useAuth();
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [preferredVisitDate, setPreferredVisitDate] = useState('');
  const [preferredContactTime, setPreferredContactTime] = useState('Evening (6 PM - 8 PM)');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [assignedCode, setAssignedCode] = useState('');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      setName(user.name || '');
      setEmail(user.email || '');
      setPhone(user.phone || '');
    }
  }, [user]);

  if (!isOpen || !property) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !phone.trim()) {
      setError('Please provide your name and contact phone number.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const res = await api.submitEnquiry({
        property_id: property.id,
        customer_name: name,
        customer_phone: phone,
        customer_email: email,
        preferred_visit_date: preferredVisitDate,
        preferred_contact_time: preferredContactTime,
        message: message || `I am interested in ${property.prop_code} (${property.bhk} BHK in ${property.locality}). Please share details and arrange a visit.`
      });

      setAssignedCode(res.enquiryCode || 'ENQ-CONFIRMED');
      setSubmitted(true);

      // Trigger celebratory confetti
      confetti({
        particleCount: 80,
        spread: 60,
        origin: { y: 0.6 }
      });

      if (onSuccess) onSuccess();
    } catch (err: any) {
      setError(err.message || 'Failed to submit enquiry. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="relative bg-white rounded-3xl max-w-lg w-full shadow-2xl border border-slate-100 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="bg-gradient-to-r from-slate-900 to-slate-800 text-white p-6 relative">
          <button
            onClick={onClose}
            className="absolute top-5 right-5 w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-slate-300 hover:text-white transition"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-2 text-emerald-400 text-xs font-semibold uppercase tracking-wider mb-1">
            <ShieldCheck className="w-4 h-4" /> Verified Rental Enquiry
          </div>
          <h2 className="text-xl font-bold text-white">Connect with Rental Consultant</h2>
          <p className="text-xs text-slate-300 mt-1">
            Property Ref: <span className="font-bold text-amber-300">{property.prop_code}</span> • {property.bhk} BHK {property.property_type} in {property.locality}
          </p>
        </div>

        {/* Modal Body */}
        <div className="p-6">
          {submitted ? (
            <div className="text-center py-6 space-y-4">
              <div className="w-16 h-16 rounded-2xl bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-10 h-10" />
              </div>
              <h3 className="text-xl font-bold text-slate-900">Enquiry Received!</h3>
              <p className="text-sm text-slate-600 max-w-sm mx-auto leading-relaxed">
                Your lead reference number is <strong className="text-brand-600">{assignedCode}</strong>.
                Our Senior Consultant will verify owner schedule and contact you at <strong className="text-slate-800">{phone}</strong>.
              </p>

              <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-100 text-left text-xs space-y-2">
                <p className="font-semibold text-emerald-900 flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" /> What Happens Next?
                </p>
                <ol className="list-decimal list-inside space-y-1 text-emerald-800">
                  <li>Consultant verifies vacant status with owner.</li>
                  <li>Physical or video site visit is scheduled.</li>
                  <li>Consultant facilitates rental agreement and owner introduction.</li>
                </ol>
              </div>

              <div className="pt-4 flex gap-3">
                <button
                  onClick={onClose}
                  className="w-full py-3 bg-brand-600 hover:bg-brand-700 text-white font-semibold text-sm rounded-xl transition"
                >
                  Done & Continue Browsing
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-700 font-medium">
                  {error}
                </div>
              )}

              {/* Notice Banner */}
              <div className="p-3 bg-amber-50 border border-amber-200/80 rounded-xl flex items-start gap-2.5 text-xs text-amber-800">
                <Lock className="w-4 h-4 text-amber-600 mt-0.5 flex-shrink-0" />
                <span>
                  <strong>Owner Privacy Protected:</strong> Direct owner contact is shared by our consultant once your requirements and visit slot are confirmed.
                </span>
              </div>

              {/* Name & Phone */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Your Full Name *
                  </label>
                  <div className="relative">
                    <UserIcon className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                    <input
                      type="text"
                      required
                      placeholder="e.g. Rahul Verma"
                      value={name}
                      onChange={e => setName(e.target.value)}
                      className="w-full pl-9 pr-3 py-2 text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Phone / WhatsApp *
                  </label>
                  <div className="relative">
                    <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                    <input
                      type="tel"
                      required
                      placeholder="e.g. +91 98111 22233"
                      value={phone}
                      onChange={e => setPhone(e.target.value)}
                      className="w-full pl-9 pr-3 py-2 text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-500"
                    />
                  </div>
                </div>
              </div>

              {/* Email */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Email Address (Optional)
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                  <input
                    type="email"
                    placeholder="e.g. rahul@example.com"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-500"
                  />
                </div>
              </div>

              {/* Preferred Date & Contact Time */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Preferred Visit Date
                  </label>
                  <div className="relative">
                    <Calendar className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                    <input
                      type="date"
                      value={preferredVisitDate}
                      onChange={e => setPreferredVisitDate(e.target.value)}
                      className="w-full pl-9 pr-3 py-2 text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Preferred Call Time
                  </label>
                  <div className="relative">
                    <Clock className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                    <select
                      value={preferredContactTime}
                      onChange={e => setPreferredContactTime(e.target.value)}
                      className="w-full pl-9 pr-3 py-2 text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-500 bg-white"
                    >
                      <option value="Morning (9 AM - 12 PM)">Morning (9 AM - 12 PM)</option>
                      <option value="Afternoon (12 PM - 4 PM)">Afternoon (12 PM - 4 PM)</option>
                      <option value="Evening (6 PM - 8 PM)">Evening (6 PM - 8 PM)</option>
                      <option value="Anytime">Anytime</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Message */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Message / Special Requirements
                </label>
                <textarea
                  rows={2}
                  placeholder="e.g. We are a family of 3 planning to move in 2 weeks. Need to check car parking space."
                  value={message}
                  onChange={e => setMessage(e.target.value)}
                  className="w-full px-3 py-2 text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-500"
                />
              </div>

              {/* Submit CTA */}
              <div className="pt-2">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3 bg-brand-600 hover:bg-brand-700 text-white font-bold text-sm rounded-xl shadow-lg shadow-brand-600/25 transition flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {loading ? (
                    'Submitting to Consultant...'
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      Submit Enquiry & Request Owner Details
                    </>
                  )}
                </button>
                <p className="text-[11px] text-center text-slate-400 mt-2">
                  Zero spam guarantee • 100% Verified rental listings
                </p>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
