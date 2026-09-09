export interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  role: 'customer' | 'admin';
  created_at?: string;
}

export interface Property {
  id: string;
  prop_code: string;
  title: string;
  property_type: 'Apartment' | 'Independent House' | 'Villa' | 'Gated Community';
  bhk: number;
  bedrooms: number;
  bathrooms: number;
  rent: number;
  deposit: number;
  city: string;
  locality: string;
  address: string;
  latitude?: number;
  longitude?: number;
  available_from: string;
  travel_time_mins: number;
  distance_km: number;
  parking: 'No Parking' | 'Bike Only' | 'Car Only' | 'Car + Bike';
  furnishing: 'Unfurnished' | 'Semi-Furnished' | 'Fully Furnished';
  water_availability: '24/7' | 'Morning & Evening' | 'Tanker';
  power_backup: number;
  lift: number;
  security: number;
  balcony: number;
  pet_friendly: number;
  gated_community: number;
  ground_floor: number;
  preferred_tenants: 'Any' | 'Family' | 'Bachelors' | 'Working Professionals';
  description: string;
  images: string[];
  status: 'available' | 'under_discussion' | 'occupied';
  is_favorite?: boolean;
  matchScore?: number;
  matchReasons?: string[];
  created_at?: string;
  updated_at?: string;

  // Admin / Consultant only fields
  owner_id?: string;
  owner_name?: string;
  owner_phone?: string;
  owner_email?: string;
  owner_notes?: string;
  owner_commission_terms?: string;
}

export interface CustomerRequirement {
  id?: string;
  user_id?: string;
  preferred_city: string;
  preferred_areas: string[];
  house_types: string[];
  bhk_list: number[];
  min_rent: number;
  max_rent: number;
  total_people: number;
  tenant_type: 'Family' | 'Bachelors' | 'Working Professionals' | 'Any';
  parking_needed: 'No Parking' | 'Bike Only' | 'Car Only' | 'Car + Bike';
  max_travel_time: number;
  preferred_distance: number;
  furnishing_pref: string[];
  pet_friendly: boolean;
  bathrooms_needed: number;
  water_req: string;
  power_backup_needed: boolean;
  lift_needed: boolean;
  security_needed: boolean;
  balcony_needed: boolean;
  gated_community_needed: boolean;
  ground_floor_pref: boolean;
  other_notes: string;
}

export interface Enquiry {
  id: string;
  enquiry_code: string;
  user_id?: string;
  property_id: string;
  customer_name: string;
  customer_phone: string;
  customer_email: string;
  preferred_visit_date: string;
  preferred_contact_time: string;
  message: string;
  status: 'new' | 'contacted' | 'property_shared' | 'visit_scheduled' | 'negotiation' | 'completed' | 'cancelled';
  consultant_notes?: string;
  owner_details_shared: number;
  commission_amount: number;
  deal_closed_at?: string;
  created_at: string;
  updated_at: string;

  // Property joins
  prop_code?: string;
  property_title?: string;
  property_type?: string;
  bhk?: number;
  rent?: number;
  locality?: string;
  city?: string;
  property_images?: string[];
  property_status?: string;

  // Owner joins (Admin only)
  owner_id?: string;
  owner_name?: string;
  owner_phone?: string;
  owner_email?: string;
}

export interface PropertyOwner {
  id: string;
  name: string;
  phone: string;
  email?: string;
  notes?: string;
  commission_terms?: string;
  property_count?: number;
  total_commission_earned?: number;
  created_at: string;
}

export interface DashboardMetrics {
  totalProperties: number;
  availableProperties: number;
  occupiedProperties: number;
  underDiscussionProperties: number;
  totalEnquiries: number;
  newEnquiries: number;
  inProgressEnquiries: number;
  completedEnquiries: number;
  totalCustomers: number;
  totalOwners: number;
  totalCommission: number;
}
