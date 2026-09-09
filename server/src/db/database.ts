import Database from 'better-sqlite3';
import path from 'path';
import { seed } from './seed';

const dbPath = path.join(__dirname, '../../rentconsult.db');
const db = new Database(dbPath);

// Enable WAL mode and foreign keys for performance and data integrity
db.pragma('journal_mode = WAL');
db.pragma('foreign_keys = ON');

export function initDatabase() {
  db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      email TEXT UNIQUE NOT NULL,
      phone TEXT,
      password_hash TEXT NOT NULL,
      role TEXT NOT NULL DEFAULT 'customer', -- 'customer' | 'admin'
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS property_owners (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      phone TEXT NOT NULL,
      email TEXT,
      notes TEXT,
      commission_terms TEXT, -- e.g. "15 days rent" or "₹10,000 flat"
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS properties (
      id TEXT PRIMARY KEY,
      prop_code TEXT UNIQUE NOT NULL,
      title TEXT NOT NULL,
      property_type TEXT NOT NULL, -- 'Apartment' | 'Independent House' | 'Villa' | 'Gated Community'
      bhk INTEGER NOT NULL,
      bedrooms INTEGER NOT NULL,
      bathrooms INTEGER NOT NULL,
      rent INTEGER NOT NULL,
      deposit INTEGER NOT NULL,
      city TEXT NOT NULL,
      locality TEXT NOT NULL,
      address TEXT NOT NULL,
      latitude REAL,
      longitude REAL,
      available_from TEXT NOT NULL,
      travel_time_mins INTEGER NOT NULL,
      distance_km REAL NOT NULL,
      parking TEXT NOT NULL, -- 'No Parking' | 'Bike Only' | 'Car Only' | 'Car + Bike'
      furnishing TEXT NOT NULL, -- 'Unfurnished' | 'Semi-Furnished' | 'Fully Furnished'
      water_availability TEXT NOT NULL DEFAULT '24/7', -- '24/7' | 'Morning & Evening' | 'Tanker'
      power_backup INTEGER NOT NULL DEFAULT 1,
      lift INTEGER NOT NULL DEFAULT 1,
      security INTEGER NOT NULL DEFAULT 1,
      balcony INTEGER NOT NULL DEFAULT 1,
      pet_friendly INTEGER NOT NULL DEFAULT 0,
      gated_community INTEGER NOT NULL DEFAULT 0,
      ground_floor INTEGER NOT NULL DEFAULT 0,
      preferred_tenants TEXT NOT NULL DEFAULT 'Any', -- 'Family' | 'Bachelors' | 'Working Professionals' | 'Any'
      description TEXT NOT NULL,
      images TEXT NOT NULL, -- JSON array of image URLs
      status TEXT NOT NULL DEFAULT 'available', -- 'available' | 'under_discussion' | 'occupied'
      owner_id TEXT REFERENCES property_owners(id) ON DELETE SET NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS customer_requirements (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      preferred_city TEXT NOT NULL,
      preferred_areas TEXT NOT NULL, -- JSON array of strings
      house_types TEXT NOT NULL, -- JSON array
      bhk_list TEXT NOT NULL, -- JSON array of numbers e.g. [1, 2]
      min_rent INTEGER NOT NULL DEFAULT 0,
      max_rent INTEGER NOT NULL DEFAULT 100000,
      total_people INTEGER NOT NULL DEFAULT 1,
      tenant_type TEXT NOT NULL DEFAULT 'Family',
      parking_needed TEXT NOT NULL DEFAULT 'Bike Only',
      max_travel_time INTEGER NOT NULL DEFAULT 60,
      preferred_distance REAL NOT NULL DEFAULT 20.0,
      furnishing_pref TEXT NOT NULL, -- JSON array
      pet_friendly INTEGER NOT NULL DEFAULT 0,
      bathrooms_needed INTEGER NOT NULL DEFAULT 1,
      water_req TEXT NOT NULL DEFAULT '24/7',
      power_backup_needed INTEGER NOT NULL DEFAULT 0,
      lift_needed INTEGER NOT NULL DEFAULT 0,
      security_needed INTEGER NOT NULL DEFAULT 0,
      balcony_needed INTEGER NOT NULL DEFAULT 0,
      gated_community_needed INTEGER NOT NULL DEFAULT 0,
      ground_floor_pref INTEGER NOT NULL DEFAULT 0,
      other_notes TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS enquiries (
      id TEXT PRIMARY KEY,
      enquiry_code TEXT UNIQUE NOT NULL,
      user_id TEXT REFERENCES users(id) ON DELETE SET NULL,
      property_id TEXT NOT NULL REFERENCES properties(id) ON DELETE CASCADE,
      customer_name TEXT NOT NULL,
      customer_phone TEXT NOT NULL,
      customer_email TEXT NOT NULL,
      preferred_visit_date TEXT,
      preferred_contact_time TEXT,
      message TEXT,
      status TEXT NOT NULL DEFAULT 'new', -- 'new' | 'contacted' | 'property_shared' | 'visit_scheduled' | 'negotiation' | 'completed' | 'cancelled'
      consultant_notes TEXT,
      owner_details_shared INTEGER NOT NULL DEFAULT 0,
      commission_amount REAL NOT NULL DEFAULT 0,
      deal_closed_at DATETIME,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS favorites (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      property_id TEXT NOT NULL REFERENCES properties(id) ON DELETE CASCADE,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      UNIQUE(user_id, property_id)
    );
  `);

  // Auto-seed if database is fresh
  try {
    const propCount = (db.prepare('SELECT COUNT(*) as c FROM properties').get() as any).c;
    if (propCount === 0) {
      console.log('Database empty. Automatically populating initial properties and owners...');
      seed();
    }
  } catch (err) {
    console.error('Auto-seed check error:', err);
  }
}

export default db;
