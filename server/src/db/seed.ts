import bcrypt from 'bcryptjs';
import db, { initDatabase } from './database';

export function seed() {
  initDatabase();

  console.log('Seeding initial data...');

  // Clear existing
  db.exec(`
    DELETE FROM favorites;
    DELETE FROM enquiries;
    DELETE FROM customer_requirements;
    DELETE FROM properties;
    DELETE FROM property_owners;
    DELETE FROM users;
  `);

  const passwordHash = bcrypt.hashSync('admin123', 10);
  const customerPass = bcrypt.hashSync('customer123', 10);

  // 1. Users
  const insertUser = db.prepare(`
    INSERT INTO users (id, name, email, phone, password_hash, role)
    VALUES (?, ?, ?, ?, ?, ?)
  `);

  insertUser.run('usr_admin_1', 'Vikram Sharma (Lead Consultant)', 'admin@rentconsult.com', '+91 98765 43210', passwordHash, 'admin');
  insertUser.run('usr_cust_1', 'Rahul Verma', 'rahul@example.com', '+91 98111 22233', customerPass, 'customer');
  insertUser.run('usr_cust_2', 'Priya Sundaram', 'priya@example.com', '+91 98222 33344', customerPass, 'customer');
  insertUser.run('usr_cust_3', 'Amitabh Sengupta', 'amitabh@example.com', '+91 98333 44455', customerPass, 'customer');

  // 2. Property Owners (Strictly Private to Admin)
  const insertOwner = db.prepare(`
    INSERT INTO property_owners (id, name, phone, email, notes, commission_terms)
    VALUES (?, ?, ?, ?, ?, ?)
  `);

  insertOwner.run('own_1', 'K. V. Ramana Rao', '+91 94401 23456', 'ramana.rao@gmail.com', 'Retired Govt Official. Prefers vegetarian family tenants. Very prompt with maintenance.', '15 Days Rent upon agreement');
  insertOwner.run('own_2', 'Sunita Reddy', '+91 98490 87654', 'sunita.reddy@yahoo.com', 'NRI owner based in Dubai. Handled via local power of attorney. Open to corporate bachelors.', '1 Month Rent flat commission');
  insertOwner.run('own_3', 'Capt. Arvind Nair', '+91 99887 65432', 'capt.nair@outlook.com', 'Ex-Merchant Navy. Property newly renovated with Italian tiles and modular kitchen.', '₹15,000 fixed consultancy fee');
  insertOwner.run('own_4', 'Muralidhar Gupta', '+91 91234 56789', 'muralidhar.g@gmail.com', 'Owns multiple independent floors in Kondapur. Very cordial and supportive owner.', '15 Days Rent upon token advance');

  // 3. Properties
  const insertProp = db.prepare(`
    INSERT INTO properties (
      id, prop_code, title, property_type, bhk, bedrooms, bathrooms, rent, deposit,
      city, locality, address, latitude, longitude, available_from, travel_time_mins, distance_km,
      parking, furnishing, water_availability, power_backup, lift, security, balcony,
      pet_friendly, gated_community, ground_floor, preferred_tenants, description, images, status, owner_id
    ) VALUES (
      ?, ?, ?, ?, ?, ?, ?, ?, ?,
      ?, ?, ?, ?, ?, ?, ?, ?,
      ?, ?, ?, ?, ?, ?, ?,
      ?, ?, ?, ?, ?, ?, ?, ?
    )
  `);

  const prop1Images = JSON.stringify([
    'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1200&q=80'
  ]);

  insertProp.run(
    'prop_1',
    'PROP001',
    'Spacious 2 BHK High-Rise Apartment with Skyline View',
    'Apartment',
    2, 2, 2, 25000, 50000,
    'Hyderabad', 'Madhapur', 'Flat 602, Cyber Heights, Near Metro Station, Madhapur',
    17.4483, 78.3915, 'Immediate', 15, 2.5,
    'Car + Bike', 'Semi-Furnished', '24/7',
    1, 1, 1, 1,
    1, 1, 0, 'Family',
    'Sunlit and well-ventilated 2 BHK apartment in a premium gated community at the heart of Madhapur. Features 2 large balconies overlooking Durgam Cheruvu, modular kitchen with chimney, teak-wood wardrobes in both bedrooms, 24/7 Manjeera water, clubhouse access, swimming pool, and round-the-clock CCTV security.',
    prop1Images, 'available', 'own_1'
  );

  const prop2Images = JSON.stringify([
    'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1502005229762-ee1b2da97ba0?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1613977257363-707ba9348227?auto=format&fit=crop&w=1200&q=80'
  ]);

  insertProp.run(
    'prop_2',
    'PROP002',
    'Luxury 3 BHK Gated Community Flat with 2 Balconies',
    'Gated Community',
    3, 3, 3, 38000, 80000,
    'Hyderabad', 'Gachibowli', 'Block C-404, My Home Vihanga, ISB Road, Gachibowli',
    17.4334, 78.3489, '1st of Next Month', 10, 1.8,
    'Car + Bike', 'Fully Furnished', '24/7',
    1, 1, 1, 1,
    0, 1, 0, 'Working Professionals',
    'Impeccably furnished 3 BHK residence with premium Italian leather sofas, Sony 55-inch smart LED TV, king-size orthopedic beds in all 3 rooms, 4-burner Faber gas hob, Samsung double-door refrigerator, and automatic washing machine. 5 mins drive to Amazon and Microsoft campus.',
    prop2Images, 'available', 'own_2'
  );

  const prop3Images = JSON.stringify([
    'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1583847268964-b28dc8f51f92?auto=format&fit=crop&w=1200&q=80'
  ]);

  insertProp.run(
    'prop_3',
    'PROP003',
    'Cozy & Modern 1 BHK Studio for Bachelors/Solo Professional',
    'Apartment',
    1, 1, 1, 16000, 32000,
    'Hyderabad', 'Kondapur', 'Plot 88, Silpa Park Layout, Behind RTO Office, Kondapur',
    17.4699, 78.3578, 'Immediate', 20, 3.2,
    'Bike Only', 'Semi-Furnished', '24/7',
    1, 1, 1, 1,
    1, 0, 0, 'Bachelors',
    'Independent 1 BHK flat with dedicated bike parking, AC in bedroom, geyser in bathroom, and high-speed fiber internet provision. Walking distance to Botanical Garden and prominent supermarkets & dining spots.',
    prop3Images, 'available', 'own_4'
  );

  const prop4Images = JSON.stringify([
    'https://images.unsplash.com/photo-1600585154526-990dced4db0d?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1600566753376-12c8ab7fb75b?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1600573472550-8090b5e0745e?auto=format&fit=crop&w=1200&q=80'
  ]);

  insertProp.run(
    'prop_4',
    'PROP004',
    'Premium 4 BHK Independent Duplex Villa with Private Lawn',
    'Villa',
    4, 4, 4, 65000, 150000,
    'Hyderabad', 'Jubilee Hills', 'Villa #14, Road No. 36, Near Peddamma Temple, Jubilee Hills',
    17.4319, 78.4073, 'Within 15 Days', 25, 4.5,
    'Car + Bike', 'Fully Furnished', '24/7',
    1, 0, 1, 1,
    1, 1, 1, 'Family',
    'Exclusive standalone luxury villa in the serene diplomatic belt of Jubilee Hills. 4 palatial en-suite bedrooms, private garden with sit-out, dedicated domestic help quarters with separate washroom, automated covered 2-car garage, and top-tier solar water heating system.',
    prop4Images, 'available', 'own_3'
  );

  const prop5Images = JSON.stringify([
    'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1560185007-cde436f6a4d0?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1554995207-c18c203602cb?auto=format&fit=crop&w=1200&q=80'
  ]);

  insertProp.run(
    'prop_5',
    'PROP005',
    'Budget-Friendly 2 BHK in Peaceful Residential Colony',
    'Independent House',
    2, 2, 2, 19500, 39000,
    'Hyderabad', 'Kukatpally', 'House 12-4-56, 3rd Floor, Vivek Nagar, Kukatpally',
    17.4849, 78.4138, 'Immediate', 30, 6.0,
    'Car + Bike', 'Unfurnished', 'Morning & Evening',
    1, 1, 0, 1,
    0, 0, 0, 'Family',
    'Affordable and spacious 2 BHK home for family. Large living hall, east-facing entry, borewell + municipal drinking water, separate electrical sub-meter, close to schools and Kukatpally Metro Station.',
    prop5Images, 'available', 'own_1'
  );

  const prop6Images = JSON.stringify([
    'https://images.unsplash.com/photo-1560448204-603b3fc33ddc?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&w=1200&q=80'
  ]);

  insertProp.run(
    'prop_6',
    'PROP006',
    'Chic 2 BHK Flat next to Financial District Tech Parks',
    'Apartment',
    2, 2, 2, 28000, 56000,
    'Hyderabad', 'Financial District', 'Tower B, 12th Floor, Nanakramguda, Financial District',
    17.4156, 78.3429, 'Immediate', 5, 1.0,
    'Car + Bike', 'Semi-Furnished', '24/7',
    1, 1, 1, 1,
    1, 1, 0, 'Working Professionals',
    'Prime location walking distance to Wipro Circle, Apple, and Capgemini. Features false ceiling with LED ambient lighting, modular kitchen, piped gas line, dedicated covered car parking and power backup.',
    prop6Images, 'available', 'own_2'
  );

  // 4. Customer Requirements (for Rahul)
  const insertReq = db.prepare(`
    INSERT INTO customer_requirements (
      id, user_id, preferred_city, preferred_areas, house_types, bhk_list,
      min_rent, max_rent, total_people, tenant_type, parking_needed,
      max_travel_time, preferred_distance, furnishing_pref, pet_friendly,
      bathrooms_needed, water_req, power_backup_needed, lift_needed, security_needed,
      balcony_needed, gated_community_needed, ground_floor_pref, other_notes
    ) VALUES (
      ?, ?, ?, ?, ?, ?,
      ?, ?, ?, ?, ?,
      ?, ?, ?, ?,
      ?, ?, ?, ?, ?,
      ?, ?, ?, ?
    )
  `);

  insertReq.run(
    'req_1',
    'usr_cust_1',
    'Hyderabad',
    JSON.stringify(['Madhapur', 'Gachibowli', 'Kondapur']),
    JSON.stringify(['Apartment', 'Gated Community']),
    JSON.stringify([2, 3]),
    20000, 30000,
    3,
    'Family',
    'Car + Bike',
    25,
    5.0,
    JSON.stringify(['Semi-Furnished', 'Fully Furnished']),
    1,
    2,
    '24/7',
    1, 1, 1, 1, 1, 0,
    'Prefer east facing or well-ventilated flat close to international schools.'
  );

  // 5. Enquiries / Leads
  const insertEnq = db.prepare(`
    INSERT INTO enquiries (
      id, enquiry_code, user_id, property_id, customer_name, customer_phone, customer_email,
      preferred_visit_date, preferred_contact_time, message, status, consultant_notes,
      owner_details_shared, commission_amount, deal_closed_at
    ) VALUES (
      ?, ?, ?, ?, ?, ?, ?,
      ?, ?, ?, ?, ?,
      ?, ?, ?
    )
  `);

  insertEnq.run(
    'enq_1',
    'ENQ101',
    'usr_cust_1',
    'prop_1',
    'Rahul Verma',
    '+91 98111 22233',
    'rahul@example.com',
    '2026-09-05',
    'Evening (6 PM - 8 PM)',
    'We are a family of 3 shifting from Pune. Very keen on viewing this Madhapur 2 BHK flat this weekend.',
    'visit_scheduled',
    'Spoke with Rahul. Verified tenant credentials. Scheduled physical site visit on Saturday 5 PM. Informed owner Mr. Ramana Rao.',
    1,
    0,
    null
  );

  insertEnq.run(
    'enq_2',
    'ENQ102',
    'usr_cust_2',
    'prop_2',
    'Priya Sundaram',
    '+91 98222 33344',
    'priya@example.com',
    '2026-09-08',
    'Anytime',
    'Looking for a fully furnished flat in Gachibowli for me and 2 colleagues working at Microsoft.',
    'contacted',
    'Initial call completed. Sent brochure and video walkthrough on WhatsApp. Awaiting confirmation on visit slot.',
    0,
    0,
    null
  );

  insertEnq.run(
    'enq_3',
    'ENQ103',
    'usr_cust_3',
    'prop_4',
    'Amitabh Sengupta',
    '+91 98333 44455',
    'amitabh@example.com',
    '2026-08-25',
    'Morning',
    'Relocating VP at Deloitte looking for luxury 4 BHK villa with pet friendly lawn.',
    'completed',
    'Deal successfully closed! Agreement executed on Aug 28th. Owner Capt. Nair and tenant both pleased. Service fee received.',
    1,
    25000,
    '2026-08-28 16:30:00'
  );

  // 6. Favorites
  const insertFav = db.prepare(`
    INSERT INTO favorites (id, user_id, property_id)
    VALUES (?, ?, ?)
  `);

  insertFav.run('fav_1', 'usr_cust_1', 'prop_1');
  insertFav.run('fav_2', 'usr_cust_1', 'prop_2');

  console.log('Database seeded successfully!');
}

if (require.main === module) {
  seed();
}
