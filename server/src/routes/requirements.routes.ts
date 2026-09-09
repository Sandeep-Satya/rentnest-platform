import { Router, Response } from 'express';
import db from '../db/database';
import { requireAuth, AuthRequest } from '../middleware/auth';
import { computePropertyMatch } from './properties.routes';

const router = Router();

// Get current user's requirement
router.get('/my', requireAuth, (req: AuthRequest, res: Response): void => {
  try {
    const requirement = db.prepare('SELECT * FROM customer_requirements WHERE user_id = ?').get(req.user!.id) as any;
    
    if (!requirement) {
      res.json({ requirement: null });
      return;
    }

    const formatted = {
      ...requirement,
      preferred_areas: JSON.parse(requirement.preferred_areas || '[]'),
      house_types: JSON.parse(requirement.house_types || '[]'),
      bhk_list: JSON.parse(requirement.bhk_list || '[]'),
      furnishing_pref: JSON.parse(requirement.furnishing_pref || '[]')
    };

    res.json({ requirement: formatted });
  } catch (error) {
    console.error('Fetch requirement error:', error);
    res.status(500).json({ error: 'Failed to fetch requirements.' });
  }
});

// Save or Update Customer Requirement & return top matching properties
router.post('/my', requireAuth, (req: AuthRequest, res: Response): void => {
  try {
    const {
      preferred_city = 'Hyderabad',
      preferred_areas = [],
      house_types = [],
      bhk_list = [],
      min_rent = 10000,
      max_rent = 50000,
      total_people = 2,
      tenant_type = 'Family',
      parking_needed = 'Car + Bike',
      max_travel_time = 30,
      preferred_distance = 15.0,
      furnishing_pref = [],
      pet_friendly = false,
      bathrooms_needed = 2,
      water_req = '24/7',
      power_backup_needed = false,
      lift_needed = false,
      security_needed = false,
      balcony_needed = false,
      gated_community_needed = false,
      ground_floor_pref = false,
      other_notes = ''
    } = req.body;

    const existing = db.prepare('SELECT id FROM customer_requirements WHERE user_id = ?').get(req.user!.id) as any;
    const reqId = existing ? existing.id : `req_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`;

    const areasJson = JSON.stringify(preferred_areas);
    const typesJson = JSON.stringify(house_types);
    const bhkJson = JSON.stringify(bhk_list);
    const furnJson = JSON.stringify(furnishing_pref);

    if (existing) {
      db.prepare(`
        UPDATE customer_requirements SET
          preferred_city = ?, preferred_areas = ?, house_types = ?, bhk_list = ?,
          min_rent = ?, max_rent = ?, total_people = ?, tenant_type = ?,
          parking_needed = ?, max_travel_time = ?, preferred_distance = ?,
          furnishing_pref = ?, pet_friendly = ?, bathrooms_needed = ?,
          water_req = ?, power_backup_needed = ?, lift_needed = ?,
          security_needed = ?, balcony_needed = ?, gated_community_needed = ?,
          ground_floor_pref = ?, other_notes = ?, updated_at = CURRENT_TIMESTAMP
        WHERE id = ?
      `).run(
        preferred_city, areasJson, typesJson, bhkJson,
        min_rent, max_rent, total_people, tenant_type,
        parking_needed, max_travel_time, preferred_distance,
        furnJson, pet_friendly ? 1 : 0, bathrooms_needed,
        water_req, power_backup_needed ? 1 : 0, lift_needed ? 1 : 0,
        security_needed ? 1 : 0, balcony_needed ? 1 : 0, gated_community_needed ? 1 : 0,
        ground_floor_pref ? 1 : 0, other_notes,
        existing.id
      );
    } else {
      db.prepare(`
        INSERT INTO customer_requirements (
          id, user_id, preferred_city, preferred_areas, house_types, bhk_list,
          min_rent, max_rent, total_people, tenant_type, parking_needed,
          max_travel_time, preferred_distance, furnishing_pref, pet_friendly,
          bathrooms_needed, water_req, power_backup_needed, lift_needed,
          security_needed, balcony_needed, gated_community_needed,
          ground_floor_pref, other_notes
        ) VALUES (
          ?, ?, ?, ?, ?, ?,
          ?, ?, ?, ?, ?,
          ?, ?, ?, ?,
          ?, ?, ?, ?,
          ?, ?, ?,
          ?, ?
        )
      `).run(
        reqId, req.user!.id, preferred_city, areasJson, typesJson, bhkJson,
        min_rent, max_rent, total_people, tenant_type, parking_needed,
        max_travel_time, preferred_distance, furnJson, pet_friendly ? 1 : 0,
        bathrooms_needed, water_req, power_backup_needed ? 1 : 0, lift_needed ? 1 : 0,
        security_needed ? 1 : 0, balcony_needed ? 1 : 0, gated_community_needed ? 1 : 0,
        ground_floor_pref ? 1 : 0, other_notes
      );
    }

    // Now evaluate all available properties against these requirements
    const properties = db.prepare(`
      SELECT 
        id, prop_code, title, property_type, bhk, bedrooms, bathrooms,
        rent, deposit, city, locality, address, travel_time_mins, distance_km,
        parking, furnishing, water_availability, power_backup, lift, security,
        balcony, pet_friendly, gated_community, preferred_tenants, description,
        images, status
      FROM properties
      WHERE status = 'available'
    `).all() as any[];

    const dummyReq = {
      bhk_list: bhk_list,
      min_rent,
      max_rent,
      preferred_areas,
      preferred_city,
      max_travel_time,
      parking_needed,
      furnishing_pref,
      pet_friendly
    };

    const scoredProperties = properties.map(prop => {
      const match = computePropertyMatch(prop, dummyReq);
      return {
        ...prop,
        images: JSON.parse(prop.images || '[]'),
        matchScore: match.matchPercentage,
        matchReasons: match.reasons
      };
    }).sort((a, b) => b.matchScore - a.matchScore);

    res.json({
      message: 'House requirements saved successfully!',
      matchedProperties: scoredProperties,
      totalMatches: scoredProperties.filter(p => p.matchScore >= 60).length
    });
  } catch (error) {
    console.error('Save requirements error:', error);
    res.status(500).json({ error: 'Failed to save requirements.' });
  }
});

export default router;
