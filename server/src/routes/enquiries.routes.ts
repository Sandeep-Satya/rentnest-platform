import { Router, Response } from 'express';
import db from '../db/database';
import { requireAuth, optionalAuth, AuthRequest } from '../middleware/auth';

const router = Router();

// Submit an enquiry / "I'm Interested" / "Request Owner Details"
router.post('/', optionalAuth, (req: AuthRequest, res: Response): void => {
  try {
    const {
      property_id,
      customer_name,
      customer_phone,
      customer_email,
      preferred_visit_date,
      preferred_contact_time,
      message
    } = req.body;

    if (!property_id || !customer_name || !customer_phone) {
      res.status(400).json({ error: 'Property ID, customer name and phone number are required.' });
      return;
    }

    const prop = db.prepare('SELECT id, prop_code, title FROM properties WHERE id = ?').get(property_id) as any;
    if (!prop) {
      res.status(404).json({ error: 'Property listing not found.' });
      return;
    }

    const count = (db.prepare('SELECT COUNT(*) as count FROM enquiries').get() as any).count;
    const enquiryCode = `ENQ${100 + count + 1}`;
    const enqId = `enq_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`;
    const userId = req.user ? req.user.id : null;

    db.prepare(`
      INSERT INTO enquiries (
        id, enquiry_code, user_id, property_id, customer_name, customer_phone,
        customer_email, preferred_visit_date, preferred_contact_time, message, status
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'new')
    `).run(
      enqId,
      enquiryCode,
      userId,
      property_id,
      customer_name,
      customer_phone,
      customer_email || '',
      preferred_visit_date || '',
      preferred_contact_time || 'Anytime',
      message || ''
    );

    res.status(201).json({
      message: 'Enquiry submitted successfully! A rental consultant will contact you shortly.',
      enquiryCode,
      enquiryId: enqId
    });
  } catch (error) {
    console.error('Enquiry submission error:', error);
    res.status(500).json({ error: 'Failed to submit enquiry.' });
  }
});

// Get customer's submitted enquiries
router.get('/my', requireAuth, (req: AuthRequest, res: Response): void => {
  try {
    const enquiries = db.prepare(`
      SELECT 
        e.id, e.enquiry_code, e.property_id, e.customer_name, e.customer_phone,
        e.customer_email, e.preferred_visit_date, e.preferred_contact_time,
        e.message, e.status, e.consultant_notes, e.owner_details_shared,
        e.created_at, e.updated_at,
        p.prop_code, p.title as property_title, p.property_type, p.bhk, p.rent,
        p.locality, p.city, p.images
      FROM enquiries e
      JOIN properties p ON e.property_id = p.id
      WHERE e.user_id = ? OR e.customer_email = ?
      ORDER BY e.created_at DESC
    `).all(req.user!.id, req.user!.email) as any[];

    const formatted = enquiries.map(e => ({
      ...e,
      property_images: JSON.parse(e.images || '[]')
    }));

    res.json({ enquiries: formatted });
  } catch (error) {
    console.error('Fetch customer enquiries error:', error);
    res.status(500).json({ error: 'Failed to fetch enquiries.' });
  }
});

// Toggle favorite property
router.post('/favorites/toggle', requireAuth, (req: AuthRequest, res: Response): void => {
  try {
    const { property_id } = req.body;
    if (!property_id) {
      res.status(400).json({ error: 'property_id is required.' });
      return;
    }

    const existing = db.prepare('SELECT id FROM favorites WHERE user_id = ? AND property_id = ?').get(req.user!.id, property_id) as any;

    if (existing) {
      db.prepare('DELETE FROM favorites WHERE id = ?').run(existing.id);
      res.json({ message: 'Removed from saved properties', isFavorite: false });
    } else {
      const favId = `fav_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`;
      db.prepare('INSERT INTO favorites (id, user_id, property_id) VALUES (?, ?, ?)').run(favId, req.user!.id, property_id);
      res.json({ message: 'Saved to favorite properties', isFavorite: true });
    }
  } catch (error) {
    console.error('Favorite toggle error:', error);
    res.status(500).json({ error: 'Failed to toggle favorite.' });
  }
});

// Get user's favorites
router.get('/favorites/my', requireAuth, (req: AuthRequest, res: Response): void => {
  try {
    const favorites = db.prepare(`
      SELECT 
        f.id as favorite_id, f.created_at as saved_at,
        p.id, p.prop_code, p.title, p.property_type, p.bhk, p.bedrooms, p.bathrooms,
        p.rent, p.deposit, p.city, p.locality, p.address, p.travel_time_mins,
        p.parking, p.furnishing, p.images, p.status
      FROM favorites f
      JOIN properties p ON f.property_id = p.id
      WHERE f.user_id = ?
      ORDER BY f.created_at DESC
    `).all(req.user!.id) as any[];

    const formatted = favorites.map(f => ({
      ...f,
      images: JSON.parse(f.images || '[]')
    }));

    res.json({ favorites: formatted });
  } catch (error) {
    console.error('Fetch favorites error:', error);
    res.status(500).json({ error: 'Failed to fetch favorites.' });
  }
});

export default router;
