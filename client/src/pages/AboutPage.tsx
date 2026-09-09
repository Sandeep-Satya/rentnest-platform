import React from 'react';
import { Link } from 'react-router-dom';
import { Building2, ShieldCheck, CheckCircle2, Users, DollarSign, Clock, Phone, Sparkles } from 'lucide-react';

export const AboutPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-12">
        {/* Header */}
        <div className="text-center space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-100 text-emerald-800 rounded-full text-xs font-bold uppercase tracking-wider">
            <Building2 className="w-4 h-4 text-emerald-600" /> About Our Consultancy
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            The Modern House Rental Consultancy
          </h1>
          <p className="text-sm text-slate-600 max-w-2xl mx-auto leading-relaxed">
            RentNest is a dedicated rental discovery and matchmaking platform designed for tenants who want zero broker chaos and for owners who want dignified, verified tenants.
          </p>
        </div>

        {/* Business Model Explanation */}
        <div className="bg-white rounded-3xl p-8 sm:p-10 border border-slate-200 shadow-xl space-y-6">
          <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <DollarSign className="w-5 h-5 text-brand-600" /> How Our Consultancy Model Works
          </h2>

          <div className="space-y-4 text-sm text-slate-700 leading-relaxed">
            <p>
              We are <strong>not a direct online rental transaction store</strong>, nor do we run endless classified ads. Instead, our senior consultants operate on a curated <strong>Assisted Rental Advisory model</strong>:
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 space-y-2">
                <span className="w-7 h-7 rounded-lg bg-brand-600 text-white font-bold text-xs flex items-center justify-center">1</span>
                <h4 className="font-bold text-slate-900 text-xs">Direct Owner Onboarding</h4>
                <p className="text-xs text-slate-600">
                  Property owners share their vacant house details and agree on clear commission terms.
                </p>
              </div>

              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 space-y-2">
                <span className="w-7 h-7 rounded-lg bg-brand-600 text-white font-bold text-xs flex items-center justify-center">2</span>
                <h4 className="font-bold text-slate-900 text-xs">Tenant Match & Tour</h4>
                <p className="text-xs text-slate-600">
                  We match verified tenant requirements, arrange coordinated site visits, and filter suitable candidates.
                </p>
              </div>

              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 space-y-2">
                <span className="w-7 h-7 rounded-lg bg-brand-600 text-white font-bold text-xs flex items-center justify-center">3</span>
                <h4 className="font-bold text-slate-900 text-xs">Agreement & Service Fee</h4>
                <p className="text-xs text-slate-600">
                  Once both parties finalize terms and sign the rental agreement, our consultancy receives a transparent service fee.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Why Owner Privacy Matters */}
        <div className="bg-gradient-to-br from-slate-900 to-slate-800 text-white rounded-3xl p-8 sm:p-10 shadow-2xl space-y-4">
          <div className="flex items-center gap-2 text-emerald-400 text-xs font-bold uppercase">
            <ShieldCheck className="w-4 h-4" /> Safeguarding Property Owners
          </div>
          <h3 className="text-xl font-bold">Why Owner Phone Numbers are Protected</h3>
          <p className="text-xs text-slate-300 leading-relaxed max-w-2xl">
            Unlike open classified boards where owner phone numbers get scraped by dozens of unverified local brokers causing 40+ spam calls per day, RentNest acts as the protective shield. Our consultants verify tenant seriousness and schedule visits directly before connecting owner and tenant.
          </p>
        </div>

        {/* CTA */}
        <div className="text-center pt-4">
          <Link
            to="/my-requirements"
            className="inline-flex items-center gap-2 px-8 py-4 bg-brand-600 hover:bg-brand-700 text-white font-bold rounded-2xl text-sm shadow-xl shadow-brand-600/30 transition"
          >
            <Sparkles className="w-4 h-4" /> Share Your Requirements with Us
          </Link>
        </div>
      </div>
    </div>
  );
};
