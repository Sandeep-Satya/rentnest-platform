import { Router, Response } from 'express';
import db from '../db/database';
import { requireAuth, AuthRequest } from '../middleware/auth';
import { computePropertyMatch } from './properties.routes';

const router = Router();

// Get current user's requirement
router.get('/my', requireAuth, async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const requirementResult = await db.query('SELECT * FROM customer_requirements WHERE user_id = $1', [req.user!.id]);
    const requirement = requirementResult.rows[0];
    
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
router.post('/my', requireAuth, async (req: AuthRequest, res: Response): Promise<void> => {
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

    const existingResult = await db.query('SELECT id FROM customer_requirements WHERE user_id = $1', [req.user!.id]);
    const existing = existingResult.rows[0];
    const reqId = existing ? existing.id : `req_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`;

    const areasJson = JSON.stringify(preferred_areas);
    const typesJson = JSON.stringify(house_types);
    const bhkJson = JSON.stringify(bhk_list);
    const furnJson = JSON.stringify(furnishing_pref);

    if (existing) {
      await db.query(`
        UPDATE customer_requirements SET
          preferred_city = $1, preferred_areas = $2, house_types = $3, bhk_list = $4,
          min_rent = $5, max_rent = $6, total_people = $7, tenant_type = $8,
          parking_needed = $9, max_travel_time = $10, preferred_distance = $11,
          furnishing_pref = $12, pet_friendly = $13, bathrooms_needed = $14,
          water_req = $15, power_backup_needed = $16, lift_needed = $17,
          security_needed = $18, balcony_needed = $19, gated_community_needed = $20,
          ground_floor_pref = $21, other_notes = $22, updated_at = CURRENT_TIMESTAMP
        WHERE id = $23
      `, [
        preferred_city, areasJson, typesJson, bhkJson,
        min_rent, max_rent, total_people, tenant_type,
        parking_needed, max_travel_time, preferred_distance,
        furnJson, pet_friendly ? 1 : 0, bathrooms_needed,
        water_req, power_backup_needed ? 1 : 0, lift_needed ? 1 : 0,
        security_needed ? 1 : 0, balcony_needed ? 1 : 0, gated_community_needed ? 1 : 0,
        ground_floor_pref ? 1 : 0, other_notes,
        existing.id
      ]);
    } else {
      await db.query(`
        INSERT INTO customer_requirements (
          id, user_id, preferred_city, preferred_areas, house_types, bhk_list,
          min_rent, max_rent, total_people, tenant_type, parking_needed,
          max_travel_time, preferred_distance, furnishing_pref, pet_friendly,
          bathrooms_needed, water_req, power_backup_needed, lift_needed,
          security_needed, balcony_needed, gated_community_needed,
          ground_floor_pref, other_notes
        ) VALUES (
          $1, $2, $3, $4, $5, $6,
          $7, $8, $9, $10, $11,
          $12, $13, $14, $15,
          $16, $17, $18, $19,
          $20, $21, $22,
          $23, $24
        )
      `, [
        reqId, req.user!.id, preferred_city, areasJson, typesJson, bhkJson,
        min_rent, max_rent, total_people, tenant_type, parking_needed,
        max_travel_time, preferred_distance, furnJson, pet_friendly ? 1 : 0,
        bathrooms_needed, water_req, power_backup_needed ? 1 : 0, lift_needed ? 1 : 0,
        security_needed ? 1 : 0, balcony_needed ? 1 : 0, gated_community_needed ? 1 : 0,
        ground_floor_pref ? 1 : 0, other_notes
      ]);
    }

    // Now evaluate all available properties against these requirements
    const propertiesResult = await db.query(`
      SELECT 
        id, prop_code, title, property_type, bhk, bedrooms, bathrooms,
        rent, deposit, city, locality, address, travel_time_mins, distance_km,
        parking, furnishing, water_availability, power_backup, lift, security,
        balcony, pet_friendly, gated_community, preferred_tenants, description,
        images, status
      FROM properties
      WHERE status = 'available'
    `);
    const properties = propertiesResult.rows;

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

    const scoredProperties = properties.map((prop: any) => {
      const match = computePropertyMatch(prop, dummyReq);
      return {
        ...prop,
        images: JSON.parse(prop.images || '[]'),
        matchScore: match.matchPercentage,
        matchReasons: match.reasons
      };
    }).sort((a: any, b: any) => b.matchScore - a.matchScore);

    res.json({
      message: 'House requirements saved successfully!',
      matchedProperties: scoredProperties,
      totalMatches: scoredProperties.filter((p: any) => p.matchScore >= 60).length
    });
  } catch (error) {
    console.error('Save requirements error:', error);
    res.status(500).json({ error: 'Failed to save requirements.' });
  }
});

export default router;
