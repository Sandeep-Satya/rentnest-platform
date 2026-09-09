import { Router, Response } from 'express';
import db from '../db/database';
import { requireAdmin, AuthRequest } from '../middleware/auth';

const router = Router();

// Apply admin guard to all admin routes
router.use(requireAdmin);

// 1. Dashboard Metrics
router.get('/dashboard', (req: AuthRequest, res: Response): void => {
  try {
    const totalProperties = (db.prepare('SELECT COUNT(*) as c FROM properties').get() as any).c;
    const availableProperties = (db.prepare("SELECT COUNT(*) as c FROM properties WHERE status = 'available'").get() as any).c;
    const occupiedProperties = (db.prepare("SELECT COUNT(*) as c FROM properties WHERE status = 'occupied'").get() as any).c;
    const underDiscussionProperties = (db.prepare("SELECT COUNT(*) as c FROM properties WHERE status = 'under_discussion'").get() as any).c;

    const totalEnquiries = (db.prepare('SELECT COUNT(*) as c FROM enquiries').get() as any).c;
    const newEnquiries = (db.prepare("SELECT COUNT(*) as c FROM enquiries WHERE status = 'new'").get() as any).c;
    const inProgressEnquiries = (db.prepare("SELECT COUNT(*) as c FROM enquiries WHERE status IN ('contacted', 'property_shared', 'visit_scheduled', 'negotiation')").get() as any).c;
    const completedEnquiries = (db.prepare("SELECT COUNT(*) as c FROM enquiries WHERE status = 'completed'").get() as any).c;

    const totalCustomers = (db.prepare("SELECT COUNT(*) as c FROM users WHERE role = 'customer'").get() as any).c;
    const totalOwners = (db.prepare('SELECT COUNT(*) as c FROM property_owners').get() as any).c;

    const totalCommission = (db.prepare("SELECT COALESCE(SUM(commission_amount), 0) as s FROM enquiries WHERE status = 'completed'").get() as any).s;

    // Recent leads
    const recentEnquiries = db.prepare(`
      SELECT 
        e.id, e.enquiry_code, e.customer_name, e.customer_phone, e.customer_email,
        e.status, e.created_at, e.preferred_visit_date, e.owner_details_shared,
        p.prop_code, p.title as property_title, p.locality, p.rent, p.bhk
      FROM enquiries e
      JOIN properties p ON e.property_id = p.id
      ORDER BY e.created_at DESC
      LIMIT 6
    `).all();

    // Locality breakdown
    const localityStats = db.prepare(`
      SELECT locality, COUNT(*) as count, AVG(rent) as avg_rent
      FROM properties
      GROUP BY locality
      ORDER BY count DESC
      LIMIT 5
    `).all();

    res.json({
      metrics: {
        totalProperties,
        availableProperties,
        occupiedProperties,
        underDiscussionProperties,
        totalEnquiries,
        newEnquiries,
        inProgressEnquiries,
        completedEnquiries,
        totalCustomers,
        totalOwners,
        totalCommission
      },
      recentEnquiries,
      localityStats
    });
  } catch (error) {
    console.error('Admin dashboard error:', error);
    res.status(500).json({ error: 'Failed to fetch dashboard metrics.' });
  }
});

// 2. Properties Management (Includes Private Owner Details)
router.get('/properties', (req: AuthRequest, res: Response): void => {
  try {
    const properties = db.prepare(`
      SELECT 
        p.*,
        o.name as owner_name, o.phone as owner_phone, o.email as owner_email,
        o.notes as owner_notes, o.commission_terms as owner_commission_terms
      FROM properties p
      LEFT JOIN property_owners o ON p.owner_id = o.id
      ORDER BY p.created_at DESC
    `).all() as any[];

    const formatted = properties.map(p => ({
      ...p,
      images: JSON.parse(p.images || '[]')
    }));

    res.json({ properties: formatted });
  } catch (error) {
    console.error('Admin properties error:', error);
    res.status(500).json({ error: 'Failed to fetch admin properties.' });
  }
});

// Add New Property
router.post('/properties', (req: AuthRequest, res: Response): void => {
  try {
    const {
      title, property_type, bhk, bedrooms, bathrooms, rent, deposit,
      city = 'Hyderabad', locality, address, latitude, longitude,
      available_from = 'Immediate', travel_time_mins = 20, distance_km = 3.0,
      parking = 'Car + Bike', furnishing = 'Semi-Furnished', water_availability = '24/7',
      power_backup = true, lift = true, security = true, balcony = true,
      pet_friendly = false, gated_community = false, ground_floor = false,
      preferred_tenants = 'Any', description, images = [], status = 'available',
      // Owner info
      owner_id, owner_name, owner_phone, owner_email, owner_notes, commission_terms
    } = req.body;

    if (!title || !bhk || !rent || !locality || !address) {
      res.status(400).json({ error: 'Title, BHK, rent, locality and address are required.' });
      return;
    }

    let finalOwnerId = owner_id;

    // If owner name/phone is provided without an existing owner_id, create new owner
    if (!finalOwnerId && owner_name && owner_phone) {
      finalOwnerId = `own_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`;
      db.prepare(`
        INSERT INTO property_owners (id, name, phone, email, notes, commission_terms)
        VALUES (?, ?, ?, ?, ?, ?)
      `).run(finalOwnerId, owner_name, owner_phone, owner_email || '', owner_notes || '', commission_terms || '15 Days Rent');
    }

    const count = (db.prepare('SELECT COUNT(*) as count FROM properties').get() as any).count;
    const propCode = `PROP${String(count + 1).padStart(3, '0')}`;
    const propId = `prop_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`;

    db.prepare(`
      INSERT INTO properties (
        id, prop_code, title, property_type, bhk, bedrooms, bathrooms,
        rent, deposit, city, locality, address, latitude, longitude,
        available_from, travel_time_mins, distance_km, parking, furnishing,
        water_availability, power_backup, lift, security, balcony,
        pet_friendly, gated_community, ground_floor, preferred_tenants,
        description, images, status, owner_id
      ) VALUES (
        ?, ?, ?, ?, ?, ?, ?,
        ?, ?, ?, ?, ?, ?, ?,
        ?, ?, ?, ?, ?,
        ?, ?, ?, ?, ?,
        ?, ?, ?, ?,
        ?, ?, ?, ?
      )
    `).run(
      propId, propCode, title, property_type || 'Apartment', Number(bhk), Number(bedrooms || bhk),
      Number(bathrooms || bhk), Number(rent), Number(deposit || rent * 2),
      city, locality, address, Number(latitude || 17.44), Number(longitude || 78.38),
      available_from, Number(travel_time_mins), Number(distance_km),
      parking, furnishing, water_availability,
      power_backup ? 1 : 0, lift ? 1 : 0, security ? 1 : 0, balcony ? 1 : 0,
      pet_friendly ? 1 : 0, gated_community ? 1 : 0, ground_floor ? 1 : 0,
      preferred_tenants, description || '', JSON.stringify(images),
      status, finalOwnerId || null
    );

    res.status(201).json({
      message: 'Property created successfully',
      propertyId: propId,
      propCode
    });
  } catch (error) {
    console.error('Admin create property error:', error);
    res.status(500).json({ error: 'Failed to create property.' });
  }
});

// Update Property
router.put('/properties/:id', (req: AuthRequest, res: Response): void => {
  try {
    const { id } = req.params;
    const {
      title, property_type, bhk, bedrooms, bathrooms, rent, deposit,
      city, locality, address, latitude, longitude, available_from,
      travel_time_mins, distance_km, parking, furnishing, water_availability,
      power_backup, lift, security, balcony, pet_friendly, gated_community,
      ground_floor, preferred_tenants, description, images, status, owner_id,
      owner_name, owner_phone, owner_email, owner_notes, commission_terms
    } = req.body;

    const existing = db.prepare('SELECT * FROM properties WHERE id = ?').get(id) as any;
    if (!existing) {
      res.status(404).json({ error: 'Property not found.' });
      return;
    }

    let finalOwnerId = owner_id || existing.owner_id;

    // Update owner details if provided
    if (finalOwnerId && (owner_name || owner_phone || owner_email || owner_notes || commission_terms)) {
      db.prepare(`
        UPDATE property_owners SET
          name = COALESCE(?, name),
          phone = COALESCE(?, phone),
          email = COALESCE(?, email),
          notes = COALESCE(?, notes),
          commission_terms = COALESCE(?, commission_terms)
        WHERE id = ?
      `).run(owner_name, owner_phone, owner_email, owner_notes, commission_terms, finalOwnerId);
    } else if (!finalOwnerId && owner_name && owner_phone) {
      finalOwnerId = `own_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`;
      db.prepare(`
        INSERT INTO property_owners (id, name, phone, email, notes, commission_terms)
        VALUES (?, ?, ?, ?, ?, ?)
      `).run(finalOwnerId, owner_name, owner_phone, owner_email || '', owner_notes || '', commission_terms || '15 Days Rent');
    }

    db.prepare(`
      UPDATE properties SET
        title = ?, property_type = ?, bhk = ?, bedrooms = ?, bathrooms = ?,
        rent = ?, deposit = ?, city = ?, locality = ?, address = ?,
        latitude = ?, longitude = ?, available_from = ?, travel_time_mins = ?,
        distance_km = ?, parking = ?, furnishing = ?, water_availability = ?,
        power_backup = ?, lift = ?, security = ?, balcony = ?,
        pet_friendly = ?, gated_community = ?, ground_floor = ?,
        preferred_tenants = ?, description = ?, images = ?, status = ?,
        owner_id = ?, updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `).run(
      title, property_type, Number(bhk), Number(bedrooms), Number(bathrooms),
      Number(rent), Number(deposit), city, locality, address,
      Number(latitude), Number(longitude), available_from, Number(travel_time_mins),
      Number(distance_km), parking, furnishing, water_availability,
      power_backup ? 1 : 0, lift ? 1 : 0, security ? 1 : 0, balcony ? 1 : 0,
      pet_friendly ? 1 : 0, gated_community ? 1 : 0, ground_floor ? 1 : 0,
      preferred_tenants, description, JSON.stringify(images), status,
      finalOwnerId || null, id
    );

    res.json({ message: 'Property updated successfully.' });
  } catch (error) {
    console.error('Update property error:', error);
    res.status(500).json({ error: 'Failed to update property.' });
  }
});

// Delete Property
router.delete('/properties/:id', (req: AuthRequest, res: Response): void => {
  try {
    const { id } = req.params;
    db.prepare('DELETE FROM properties WHERE id = ?').run(id);
    res.json({ message: 'Property deleted successfully.' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete property.' });
  }
});

// Quick toggle property status
router.patch('/properties/:id/status', (req: AuthRequest, res: Response): void => {
  try {
    const { id } = req.params;
    const { status } = req.body; // 'available' | 'under_discussion' | 'occupied'

    if (!['available', 'under_discussion', 'occupied'].includes(status)) {
      res.status(400).json({ error: 'Invalid status value.' });
      return;
    }

    db.prepare('UPDATE properties SET status = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?').run(status, id);
    res.json({ message: `Property marked as ${status}.` });
  } catch (error) {
    res.status(500).json({ error: 'Failed to update property status.' });
  }
});

// 3. Enquiries / Leads Management
router.get('/enquiries', (req: AuthRequest, res: Response): void => {
  try {
    const { status, search } = req.query;
    let query = `
      SELECT 
        e.*,
        p.prop_code, p.title as property_title, p.rent, p.bhk, p.locality,
        p.images as property_images, p.status as property_status,
        o.id as owner_id, o.name as owner_name, o.phone as owner_phone, o.email as owner_email
      FROM enquiries e
      JOIN properties p ON e.property_id = p.id
      LEFT JOIN property_owners o ON p.owner_id = o.id
      WHERE 1=1
    `;
    const params: any[] = [];

    if (status && status !== 'all') {
      query += ` AND e.status = ?`;
      params.push(status);
    }
    if (search) {
      query += ` AND (e.customer_name LIKE ? OR e.customer_phone LIKE ? OR e.enquiry_code LIKE ? OR p.title LIKE ?)`;
      const s = `%${search}%`;
      params.push(s, s, s, s);
    }

    query += ` ORDER BY e.created_at DESC`;

    const enquiries = db.prepare(query).all(...params) as any[];

    const formatted = enquiries.map(e => ({
      ...e,
      property_images: JSON.parse(e.property_images || '[]')
    }));

    res.json({ enquiries: formatted });
  } catch (error) {
    console.error('Admin enquiries error:', error);
    res.status(500).json({ error: 'Failed to fetch enquiries.' });
  }
});

// Update Enquiry Status & Consultant Notes
router.patch('/enquiries/:id/status', (req: AuthRequest, res: Response): void => {
  try {
    const { id } = req.params;
    const { status, consultant_notes, commission_amount, owner_details_shared } = req.body;

    const enq = db.prepare('SELECT * FROM enquiries WHERE id = ?').get(id) as any;
    if (!enq) {
      res.status(404).json({ error: 'Enquiry not found.' });
      return;
    }

    let dealClosedAt = enq.deal_closed_at;
    if (status === 'completed' && !dealClosedAt) {
      dealClosedAt = new Date().toISOString();
      // Also mark property as occupied
      db.prepare("UPDATE properties SET status = 'occupied' WHERE id = ?").run(enq.property_id);
    }

    db.prepare(`
      UPDATE enquiries SET
        status = COALESCE(?, status),
        consultant_notes = COALESCE(?, consultant_notes),
        commission_amount = COALESCE(?, commission_amount),
        owner_details_shared = COALESCE(?, owner_details_shared),
        deal_closed_at = ?,
        updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `).run(
      status, consultant_notes, commission_amount !== undefined ? Number(commission_amount) : null,
      owner_details_shared !== undefined ? (owner_details_shared ? 1 : 0) : null,
      dealClosedAt, id
    );

    res.json({ message: 'Enquiry lead updated successfully.' });
  } catch (error) {
    console.error('Update enquiry error:', error);
    res.status(500).json({ error: 'Failed to update enquiry.' });
  }
});

// 4. Property Owners CRM
router.get('/owners', (req: AuthRequest, res: Response): void => {
  try {
    const owners = db.prepare(`
      SELECT 
        o.*,
        COUNT(p.id) as property_count,
        COALESCE(SUM(CASE WHEN e.status = 'completed' THEN e.commission_amount ELSE 0 END), 0) as total_commission_earned
      FROM property_owners o
      LEFT JOIN properties p ON o.id = p.owner_id
      LEFT JOIN enquiries e ON p.id = e.property_id
      GROUP BY o.id
      ORDER BY o.created_at DESC
    `).all();

    res.json({ owners });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch property owners.' });
  }
});

// Add Property Owner
router.post('/owners', (req: AuthRequest, res: Response): void => {
  try {
    const { name, phone, email, notes, commission_terms } = req.body;
    if (!name || !phone) {
      res.status(400).json({ error: 'Owner name and phone are required.' });
      return;
    }

    const id = `own_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`;
    db.prepare(`
      INSERT INTO property_owners (id, name, phone, email, notes, commission_terms)
      VALUES (?, ?, ?, ?, ?, ?)
    `).run(id, name, phone, email || '', notes || '', commission_terms || '15 Days Rent');

    res.status(201).json({ message: 'Property owner added successfully.', ownerId: id });
  } catch (error) {
    res.status(500).json({ error: 'Failed to add owner.' });
  }
});

// 5. Customer CRM (Profiles & Requirements)
router.get('/customers', (req: AuthRequest, res: Response): void => {
  try {
    const customers = db.prepare(`
      SELECT 
        u.id, u.name, u.email, u.phone, u.created_at,
        r.preferred_city, r.preferred_areas, r.house_types, r.bhk_list,
        r.min_rent, r.max_rent, r.total_people, r.tenant_type, r.parking_needed,
        r.max_travel_time, r.furnishing_pref, r.pet_friendly, r.other_notes,
        COUNT(DISTINCT e.id) as total_enquiries,
        COUNT(DISTINCT f.id) as total_favorites
      FROM users u
      LEFT JOIN customer_requirements r ON u.id = r.user_id
      LEFT JOIN enquiries e ON u.id = e.user_id
      LEFT JOIN favorites f ON u.id = f.user_id
      WHERE u.role = 'customer'
      GROUP BY u.id
      ORDER BY u.created_at DESC
    `).all() as any[];

    const formatted = customers.map(c => ({
      ...c,
      preferred_areas: JSON.parse(c.preferred_areas || '[]'),
      house_types: JSON.parse(c.house_types || '[]'),
      bhk_list: JSON.parse(c.bhk_list || '[]'),
      furnishing_pref: JSON.parse(c.furnishing_pref || '[]')
    }));

    res.json({ customers: formatted });
  } catch (error) {
    console.error('Customer CRM error:', error);
    res.status(500).json({ error: 'Failed to fetch customers.' });
  }
});

// 6. Instagram & Social Media Content Studio
router.get('/social-studio/:propertyId', (req: AuthRequest, res: Response): void => {
  try {
    const { propertyId } = req.params;
    const prop = db.prepare('SELECT * FROM properties WHERE id = ?').get(propertyId) as any;
    if (!prop) {
      res.status(404).json({ error: 'Property not found.' });
      return;
    }

    const images = JSON.parse(prop.images || '[]');
    const formattedRent = `₹${prop.rent.toLocaleString('en-IN')}`;
    const formattedDeposit = `₹${prop.deposit.toLocaleString('en-IN')}`;

    // Generate Instagram Post Caption
    const instagramCaption = `🏠 ${prop.bhk} BHK ${prop.property_type.toUpperCase()} FOR RENT IN ${prop.locality.toUpperCase()}!

✨ Key Highlights:
📍 Location: ${prop.locality}, ${prop.city}
💰 Monthly Rent: ${formattedRent}/month
🔒 Deposit: ${formattedDeposit}
🚗 Parking: ${prop.parking}
🛋️ Furnishing: ${prop.furnishing}
💧 Water: ${prop.water_availability}
⏱️ Commute: ${prop.travel_time_mins} mins from Cyber Towers / Tech Hub
${prop.pet_friendly ? '🐾 Pet Friendly: Yes' : ''}
${prop.gated_community ? '🛡️ Gated Community with 24/7 Security' : ''}

📝 Details:
${prop.description}

Interested in viewing or requesting verified owner contact?
📲 DM us or WhatsApp: +91 98765 43210
🌐 Website ID: ${prop.prop_code}

#HouseForRent #${prop.locality.replace(/\s+/g, '')}Rentals #${prop.city}RealEstate #${prop.bhk}BHK #RentalConsultancy #RentNest #HyderabadHouses #FlatsForRent`;

    // WhatsApp Broadcast Message
    const whatsappBroadcast = `🌟 *NEW RENTAL LISTING ALERT: ${prop.prop_code}* 🌟

🏡 *${prop.bhk} BHK ${prop.property_type} - ${prop.locality}, ${prop.city}*
💵 *Rent:* ${formattedRent}/month | *Deposit:* ${formattedDeposit}
🚗 *Parking:* ${prop.parking} | 🛋️ *Furnishing:* ${prop.furnishing}
⏱️ *Travel Time:* ${prop.travel_time_mins} mins to City Center

👉 *View photos & schedule visit:* Contact Vikram Sharma (+91 98765 43210)
Property Ref: ${prop.prop_code}`;

    res.json({
      property: { ...prop, images },
      instagramCaption,
      whatsappBroadcast,
      shareableUrl: `http://localhost:5173/properties/${prop.id}`
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to generate social media content.' });
  }
});

// 7. Commission & Revenue Tracker
router.get('/commissions', (req: AuthRequest, res: Response): void => {
  try {
    const deals = db.prepare(`
      SELECT 
        e.id, e.enquiry_code, e.customer_name, e.customer_phone,
        e.commission_amount, e.deal_closed_at, e.created_at,
        p.prop_code, p.title as property_title, p.locality, p.rent,
        o.name as owner_name, o.commission_terms
      FROM enquiries e
      JOIN properties p ON e.property_id = p.id
      LEFT JOIN property_owners o ON p.owner_id = o.id
      WHERE e.status = 'completed'
      ORDER BY e.deal_closed_at DESC
    `).all();

    const totalEarned = (db.prepare("SELECT COALESCE(SUM(commission_amount), 0) as total FROM enquiries WHERE status = 'completed'").get() as any).total;
    const pendingDeals = (db.prepare("SELECT COUNT(*) as count FROM enquiries WHERE status IN ('negotiation', 'visit_scheduled')").get() as any).count;

    res.json({
      totalEarned,
      pendingDeals,
      closedDealsCount: deals.length,
      deals
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch commissions.' });
  }
});

export default router;
