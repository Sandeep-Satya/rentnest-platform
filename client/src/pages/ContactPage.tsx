import React, { useState } from 'react';
import { MapPin, Phone, Mail, Clock, Send, CheckCircle2, Instagram } from 'lucide-react';
import confetti from 'canvas-confetti';

export const ContactPage: React.FC = () => {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    confetti({ particleCount: 50, spread: 60 });
  };

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto space-y-12">
        <div className="text-center space-y-2">
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900">
            Contact Our Rental Consultancy Desk
          </h1>
          <p className="text-xs text-slate-500">
            Reach out for property listing inquiries, owner onboarding, or tenant assistance.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Info Card */}
          <div className="bg-slate-900 text-white rounded-3xl p-8 space-y-8 flex flex-col justify-between">
            <div className="space-y-6">
              <h3 className="text-xl font-bold">Hyderabad Headquarters</h3>
              
              <div className="space-y-4 text-xs text-slate-300">
                <div className="flex items-start gap-3">
                  <MapPin className="w-4 h-4 text-emerald-400 mt-0.5 flex-shrink-0" />
                  <span>Level 4, Cyber Gateway, Madhapur, Hitec City, Hyderabad - 500081</span>
                </div>
                <div className="flex items-center gap-3">
                  <Phone className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                  <span>+91 98765 43210 (Senior Consultant Line)</span>
                </div>
                <div className="flex items-center gap-3">
                  <Mail className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                  <span>consult@rentnest.in</span>
                </div>
                <div className="flex items-center gap-3">
                  <Clock className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                  <span>Monday – Sunday: 9:00 AM – 8:30 PM</span>
                </div>
              </div>
            </div>

            <div className="p-4 bg-slate-800 rounded-2xl border border-slate-700 space-y-2">
              <span className="text-[11px] font-bold text-pink-400 flex items-center gap-1.5">
                <Instagram className="w-4 h-4" /> Instagram Community
              </span>
              <p className="text-xs text-slate-300">
                Follow our official handle <strong>@rentnest.consultancy</strong> for daily reels and stories of vacant houses.
              </p>
            </div>
          </div>

          {/* Form */}
          <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-xl">
            {submitted ? (
              <div className="text-center py-10 space-y-3">
                <CheckCircle2 className="w-12 h-12 text-emerald-600 mx-auto" />
                <h3 className="text-lg font-bold text-slate-900">Message Received</h3>
                <p className="text-xs text-slate-600">
                  Our rental advisor will call you shortly at <strong>{phone}</strong>.
                </p>
                <button
                  onClick={() => setSubmitted(false)}
                  className="mt-4 px-4 py-2 bg-slate-100 text-slate-700 text-xs font-bold rounded-xl"
                >
                  Send Another Message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <h3 className="text-base font-bold text-slate-900 mb-2">Send Us a Direct Message</h3>

                <div>
                  <label className="block text-xs font-bold uppercase text-slate-600 mb-1">Your Name</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Vikramaditya"
                    value={name}
                    onChange={e => setName(e.target.value)}
                    className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-brand-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase text-slate-600 mb-1">Phone Number</label>
                  <input
                    type="tel"
                    required
                    placeholder="e.g. +91 98490 12345"
                    value={phone}
                    onChange={e => setPhone(e.target.value)}
                    className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-brand-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase text-slate-600 mb-1">Message</label>
                  <textarea
                    rows={3}
                    required
                    placeholder="I am looking for a 3 BHK in Gachibowli or I am a property owner looking to list..."
                    value={message}
                    onChange={e => setMessage(e.target.value)}
                    className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-brand-500 focus:outline-none"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3 bg-brand-600 hover:bg-brand-700 text-white font-bold rounded-xl text-sm shadow-md transition flex items-center justify-center gap-2"
                >
                  <Send className="w-4 h-4" /> Send to Consultant Desk
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
