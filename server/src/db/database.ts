import { Pool } from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const db = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
});

export async function initDatabase() {
  const client = await db.connect();
  try {
    await client.query(`
      CREATE TABLE IF NOT EXISTS users (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        email TEXT UNIQUE NOT NULL,
        phone TEXT,
        password_hash TEXT NOT NULL,
        role TEXT NOT NULL DEFAULT 'customer',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS property_owners (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        phone TEXT NOT NULL,
        email TEXT,
        notes TEXT,
        commission_terms TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS properties (
        id TEXT PRIMARY KEY,
        prop_code TEXT UNIQUE NOT NULL,
        title TEXT NOT NULL,
        property_type TEXT NOT NULL,
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
        parking TEXT NOT NULL,
        furnishing TEXT NOT NULL,
        water_availability TEXT NOT NULL DEFAULT '24/7',
        power_backup INTEGER NOT NULL DEFAULT 1,
        lift INTEGER NOT NULL DEFAULT 1,
        security INTEGER NOT NULL DEFAULT 1,
        balcony INTEGER NOT NULL DEFAULT 1,
        pet_friendly INTEGER NOT NULL DEFAULT 0,
        gated_community INTEGER NOT NULL DEFAULT 0,
        ground_floor INTEGER NOT NULL DEFAULT 0,
        preferred_tenants TEXT NOT NULL DEFAULT 'Any',
        description TEXT NOT NULL,
        images TEXT NOT NULL,
        status TEXT NOT NULL DEFAULT 'available',
        owner_id TEXT REFERENCES property_owners(id) ON DELETE SET NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS customer_requirements (
        id TEXT PRIMARY KEY,
        user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        preferred_city TEXT NOT NULL,
        preferred_areas TEXT NOT NULL,
        house_types TEXT NOT NULL,
        bhk_list TEXT NOT NULL,
        min_rent INTEGER NOT NULL DEFAULT 0,
        max_rent INTEGER NOT NULL DEFAULT 100000,
        total_people INTEGER NOT NULL DEFAULT 1,
        tenant_type TEXT NOT NULL DEFAULT 'Family',
        parking_needed TEXT NOT NULL DEFAULT 'Bike Only',
        max_travel_time INTEGER NOT NULL DEFAULT 60,
        preferred_distance REAL NOT NULL DEFAULT 20.0,
        furnishing_pref TEXT NOT NULL,
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
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
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
        status TEXT NOT NULL DEFAULT 'new',
        consultant_notes TEXT,
        owner_details_shared INTEGER NOT NULL DEFAULT 0,
        commission_amount REAL NOT NULL DEFAULT 0,
        deal_closed_at TIMESTAMP,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS favorites (
        id TEXT PRIMARY KEY,
        user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        property_id TEXT NOT NULL REFERENCES properties(id) ON DELETE CASCADE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        UNIQUE(user_id, property_id)
      );
    `);
    console.log('Database schema initialized (PostgreSQL)');
  } catch (err) {
    console.error('Error initializing database schema:', err);
  } finally {
    client.release();
  }
}

export default db;
