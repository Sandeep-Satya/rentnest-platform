import React from 'react';
import { Routes, Route, Outlet } from 'react-router-dom';
import { Navbar } from './components/common/Navbar';
import { Footer } from './components/common/Footer';
import { HomePage } from './pages/HomePage';
import { PropertiesPage } from './pages/PropertiesPage';
import { PropertyDetailPage } from './pages/PropertyDetailPage';
import { RequirementFormPage } from './pages/RequirementFormPage';
import { FavoritesPage } from './pages/FavoritesPage';
import { CustomerEnquiriesPage } from './pages/CustomerEnquiriesPage';
import { AboutPage } from './pages/AboutPage';
import { ContactPage } from './pages/ContactPage';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';

// Admin Pages
import { AdminLayout } from './components/admin/AdminLayout';
import { AdminDashboard } from './pages/admin/AdminDashboard';
import { AdminProperties } from './pages/admin/AdminProperties';
import { AdminAddEditProperty } from './pages/admin/AdminAddEditProperty';
import { AdminEnquiries } from './pages/admin/AdminEnquiries';
import { AdminOwners } from './pages/admin/AdminOwners';
import { AdminCustomers } from './pages/admin/AdminCustomers';
import { AdminSocialStudio } from './pages/admin/AdminSocialStudio';
import { AdminCommissions } from './pages/admin/AdminCommissions';

const PublicLayout: React.FC = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

export const App: React.FC = () => {
  return (
    <Routes>
      {/* Customer / Public Routes */}
      <Route path="/" element={<PublicLayout />}>
        <Route index element={<HomePage />} />
        <Route path="properties" element={<PropertiesPage />} />
        <Route path="search" element={<PropertiesPage />} />
        <Route path="properties/:id" element={<PropertyDetailPage />} />
        <Route path="my-requirements" element={<RequirementFormPage />} />
        <Route path="favorites" element={<FavoritesPage />} />
        <Route path="enquiries" element={<CustomerEnquiriesPage />} />
        <Route path="about" element={<AboutPage />} />
        <Route path="contact" element={<ContactPage />} />
        <Route path="login" element={<LoginPage />} />
        <Route path="register" element={<RegisterPage />} />
      </Route>

      {/* Admin / Consultant Portal Routes */}
      <Route path="/admin" element={<AdminLayout />}>
        <Route index element={<AdminDashboard />} />
        <Route path="properties" element={<AdminProperties />} />
        <Route path="properties/add" element={<AdminAddEditProperty />} />
        <Route path="properties/edit/:id" element={<AdminAddEditProperty />} />
        <Route path="enquiries" element={<AdminEnquiries />} />
        <Route path="owners" element={<AdminOwners />} />
        <Route path="customers" element={<AdminCustomers />} />
        <Route path="social-studio" element={<AdminSocialStudio />} />
        <Route path="commissions" element={<AdminCommissions />} />
      </Route>
    </Routes>
  );
};

export default App;
