import React from 'react';
import { Link } from 'react-router-dom';
import { Building2, ShieldCheck, Phone, Mail, MapPin, Instagram, Facebook, Send } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-slate-900 text-slate-400 pt-16 pb-12 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">
          {/* Brand Col */}
          <div className="space-y-4">
            <Link to="/" className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-xl bg-brand-600 flex items-center justify-center text-white shadow-md">
                <Building2 className="w-6 h-6" />
              </div>
              <span className="text-xl font-bold text-white tracking-tight">
                Rent<span className="text-brand-500">Nest</span>
              </span>
            </Link>
            <p className="text-sm leading-relaxed text-slate-400">
              Your trusted house rental consultancy platform. We bridge the gap between premium rental property owners and verified tenants with transparent service fees and zero hassle.
            </p>
            <div className="flex items-center gap-3 text-slate-300 pt-2">
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noreferrer"
                className="w-9 h-9 rounded-lg bg-slate-800 hover:bg-brand-600 hover:text-white flex items-center justify-center transition"
                title="Follow our Instagram for daily house tours"
              >
                <Instagram className="w-4 h-4" />
              </a>
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noreferrer"
                className="w-9 h-9 rounded-lg bg-slate-800 hover:bg-brand-600 hover:text-white flex items-center justify-center transition"
              >
                <Facebook className="w-4 h-4" />
              </a>
              <a
                href="https://wa.me/919876543210"
                target="_blank"
                rel="noreferrer"
                className="w-9 h-9 rounded-lg bg-slate-800 hover:bg-emerald-600 hover:text-white flex items-center justify-center transition"
                title="Chat with Senior Consultant on WhatsApp"
              >
                <Send className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white text-sm font-semibold uppercase tracking-wider mb-4">Quick Discovery</h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link to="/properties" className="hover:text-emerald-400 transition">All Rental Houses</Link>
              </li>
              <li>
                <Link to="/properties?propertyType=Apartment" className="hover:text-emerald-400 transition">Gated Apartments</Link>
              </li>
              <li>
                <Link to="/properties?propertyType=Villa" className="hover:text-emerald-400 transition">Independent Villas</Link>
              </li>
              <li>
                <Link to="/properties?bhk=2" className="hover:text-emerald-400 transition">2 BHK Family Homes</Link>
              </li>
              <li>
                <Link to="/properties?bhk=1" className="hover:text-emerald-400 transition">1 BHK Studio Flats</Link>
              </li>
              <li>
                <Link to="/my-requirements" className="text-emerald-400 font-medium hover:underline">Submit House Requirements →</Link>
              </li>
            </ul>
          </div>

          {/* Top Localities */}
          <div>
            <h4 className="text-white text-sm font-semibold uppercase tracking-wider mb-4">Prime Localities</h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link to="/properties?locality=Madhapur" className="hover:text-emerald-400 transition">Madhapur (Hitec City)</Link>
              </li>
              <li>
                <Link to="/properties?locality=Gachibowli" className="hover:text-emerald-400 transition">Gachibowli Financial Hub</Link>
              </li>
              <li>
                <Link to="/properties?locality=Kondapur" className="hover:text-emerald-400 transition">Kondapur & Silpa Park</Link>
              </li>
              <li>
                <Link to="/properties?locality=Jubilee%20Hills" className="hover:text-emerald-400 transition">Jubilee Hills Luxury Belt</Link>
              </li>
              <li>
                <Link to="/properties?locality=Kukatpally" className="hover:text-emerald-400 transition">Kukatpally Metro Zone</Link>
              </li>
            </ul>
          </div>

          {/* Contact & Consultancy Notice */}
          <div className="space-y-4">
            <h4 className="text-white text-sm font-semibold uppercase tracking-wider mb-4">Consultancy Desk</h4>
            <div className="space-y-3 text-sm">
              <div className="flex items-start gap-3">
                <MapPin className="w-4 h-4 text-emerald-400 mt-1 flex-shrink-0" />
                <span>Level 4, Cyber Gateway, Madhapur, Hyderabad, TS 500081</span>
              </div>
              <div className="flex items-center gap-3">
                <Phone className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                <span>+91 98765 43210 / +91 98765 43211</span>
              </div>
              <div className="flex items-center gap-3">
                <Mail className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                <span>consult@rentnest.in</span>
              </div>
            </div>

            <div className="p-3 bg-slate-800/80 rounded-xl border border-slate-700/60 text-xs">
              <span className="flex items-center gap-1.5 text-emerald-400 font-semibold mb-1">
                <ShieldCheck className="w-4 h-4" /> Direct Owner Protection
              </span>
              <p className="text-slate-400 leading-normal">
                Property owner phone numbers are kept confidential and shared only upon tenant requirement verification and consultation.
              </p>
            </div>
          </div>
        </div>

        <div className="border-t border-slate-800 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>© {new Date().getFullYear()} RentNest Consultancy Services. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <Link to="/about" className="hover:text-slate-400 transition">About Our Model</Link>
            <Link to="/contact" className="hover:text-slate-400 transition">Contact Us</Link>
            <span className="text-slate-600">|</span>
            <span>Transparent 15-Day Service Fee Model</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
