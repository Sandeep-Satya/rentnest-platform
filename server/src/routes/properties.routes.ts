import { Router, Response } from 'express';
import db from '../db/database';
import { optionalAuth, AuthRequest } from '../middleware/auth';

const router = Router();

// Helper to compute match score between a property and customer requirement
export function computePropertyMatch(prop: any, req: any) {
  let score = 0;
  let maxScore = 100;
  const reasons: string[] = [];

  // BHK Match (25 points)
  const reqBhks = typeof req.bhk_list === 'string' ? JSON.parse(req.bhk_list || '[]') : req.bhk_list || [];
  if (reqBhks.length === 0 || reqBhks.includes(prop.bhk)) {
    score += 25;
    reasons.push(`${prop.bhk} BHK matches preference`);
  } else {
    // Partial score if difference is 1 BHK
    const minDiff = Math.min(...reqBhks.map((b: number) => Math.abs(b - prop.bhk)));
    if (minDiff === 1) {
      score += 10;
      reasons.push(`Close to preferred BHK (${prop.bhk} BHK)`);
    }
  }

  // Budget Match (25 points)
  const minRent = Number(req.min_rent) || 0;
  const maxRent = Number(req.max_rent) || 100000;
  if (prop.rent >= minRent && prop.rent <= maxRent) {
    score += 25;
    reasons.push(`Rent ₹${prop.rent.toLocaleString('en-IN')} is within budget`);
  } else if (prop.rent <= maxRent * 1.15) {
    score += 12;
    reasons.push(`Rent ₹${prop.rent.toLocaleString('en-IN')} is slightly above budget`);
  }

  // Locality / City Match (20 points)
  const reqAreas = typeof req.preferred_areas === 'string' ? JSON.parse(req.preferred_areas || '[]') : req.preferred_areas || [];
  if (reqAreas.length === 0 || reqAreas.some((a: string) => a.toLowerCase() === prop.locality.toLowerCase())) {
    score += 20;
    reasons.push(`Prime location in ${prop.locality}`);
  } else if (prop.city.toLowerCase() === (req.preferred_city || 'hyderabad').toLowerCase()) {
    score += 10;
    reasons.push(`Located in ${prop.city}`);
  }

  // Travel Time (10 points)
  const maxTravel = Number(req.max_travel_time) || 60;
  if (prop.travel_time_mins <= maxTravel) {
    score += 10;
    reasons.push(`Fast commute (${prop.travel_time_mins} mins)`);
  }

  // Parking (10 points)
  const reqParking = req.parking_needed || 'No Parking';
  if (reqParking === 'No Parking' || prop.parking === reqParking || prop.parking === 'Car + Bike') {
    score += 10;
    reasons.push(`Parking suitable (${prop.parking})`);
  }

  // Furnishing & Amenities (10 points)
  const reqFurnishing = typeof req.furnishing_pref === 'string' ? JSON.parse(req.furnishing_pref || '[]') : req.furnishing_pref || [];
  if (reqFurnishing.length === 0 || reqFurnishing.includes(prop.furnishing)) {
    score += 5;
    reasons.push(`${prop.furnishing}`);
  }
  if (req.pet_friendly && prop.pet_friendly) {
    score += 5;
    reasons.push('Pet friendly property');
  } else if (!req.pet_friendly) {
    score += 5;
  }

  return {
    matchPercentage: Math.min(100, Math.max(0, score)),
    reasons
  };
}

// Get all properties with filtering and optional user match scoring
router.get('/', optionalAuth, (req: AuthRequest, res: Response): void => {
  try {
    const {
      city,
      locality,
      propertyType,
      bhk,
      minRent,
      maxRent,
      parking,
      furnishing,
      tenantType,
      maxTravelTime,
      petFriendly,
      water,
      powerBackup,
      lift,
      security,
      balcony,
      gatedCommunity,
      search,
      sortBy = 'newest'
    } = req.query;

    let query = `
      SELECT 
        id, prop_code, title, property_type, bhk, bedrooms, bathrooms,
        rent, deposit, city, locality, address, latitude, longitude,
        available_from, travel_time_mins, distance_km, parking, furnishing,
        water_availability, power_backup, lift, security, balcony,
        pet_friendly, gated_community, ground_floor, preferred_tenants,
        description, images, status, created_at, updated_at
      FROM properties
      WHERE status != 'occupied'
    `;
    const params: any[] = [];

    if (city) {
      query += ` AND LOWER(city) = LOWER(?)`;
      params.push(city);
    }
    if (locality) {
      query += ` AND LOWER(locality) = LOWER(?)`;
      params.push(locality);
    }
    if (propertyType) {
      query += ` AND property_type = ?`;
      params.push(propertyType);
    }
    if (bhk) {
      query += ` AND bhk = ?`;
      params.push(Number(bhk));
    }
    if (minRent) {
      query += ` AND rent >= ?`;
      params.push(Number(minRent));
    }
    if (maxRent) {
      query += ` AND rent <= ?`;
      params.push(Number(maxRent));
    }
    if (parking && parking !== 'Any') {
      if (parking === 'Car + Bike') {
        query += ` AND parking = 'Car + Bike'`;
      } else if (parking === 'Car Only') {
        query += ` AND parking IN ('Car Only', 'Car + Bike')`;
      } else if (parking === 'Bike Only') {
        query += ` AND parking IN ('Bike Only', 'Car + Bike')`;
      }
    }
    if (furnishing && furnishing !== 'Any') {
      query += ` AND furnishing = ?`;
      params.push(furnishing);
    }
    if (tenantType && tenantType !== 'Any') {
      query += ` AND (preferred_tenants = ? OR preferred_tenants = 'Any')`;
      params.push(tenantType);
    }
    if (maxTravelTime) {
      query += ` AND travel_time_mins <= ?`;
      params.push(Number(maxTravelTime));
    }
    if (petFriendly === 'true' || petFriendly === '1') {
      query += ` AND pet_friendly = 1`;
    }
    if (powerBackup === 'true' || powerBackup === '1') {
      query += ` AND power_backup = 1`;
    }
    if (lift === 'true' || lift === '1') {
      query += ` AND lift = 1`;
    }
    if (security === 'true' || security === '1') {
      query += ` AND security = 1`;
    }
    if (balcony === 'true' || balcony === '1') {
      query += ` AND balcony = 1`;
    }
    if (gatedCommunity === 'true' || gatedCommunity === '1') {
      query += ` AND gated_community = 1`;
    }
    if (search) {
      query += ` AND (title LIKE ? OR description LIKE ? OR locality LIKE ? OR address LIKE ?)`;
      const searchPattern = `%${search}%`;
      params.push(searchPattern, searchPattern, searchPattern, searchPattern);
    }

    if (sortBy === 'rent_asc') {
      query += ` ORDER BY rent ASC`;
    } else if (sortBy === 'rent_desc') {
      query += ` ORDER BY rent DESC`;
    } else {
      query += ` ORDER BY created_at DESC`;
    }

    const rows = db.prepare(query).all(...params) as any[];

    // Check if user has saved requirements to compute match
    let userReq: any = null;
    let userFavorites: Set<string> = new Set();

    if (req.user) {
      userReq = db.prepare('SELECT * FROM customer_requirements WHERE user_id = ?').get(req.user.id);
      const favRows = db.prepare('SELECT property_id FROM favorites WHERE user_id = ?').all(req.user.id) as any[];
      favRows.forEach(f => userFavorites.add(f.property_id));
    }

    let properties = rows.map(prop => {
      let images = [];
      try {
        images = JSON.parse(prop.images);
      } catch {
        images = [];
      }

      let matchData = null;
      if (userReq) {
        matchData = computePropertyMatch(prop, userReq);
      }

      return {
        ...prop,
        images,
        is_favorite: userFavorites.has(prop.id),
        matchScore: matchData ? matchData.matchPercentage : undefined,
        matchReasons: matchData ? matchData.reasons : undefined
      };
    });

    if (sortBy === 'match' && userReq) {
      properties.sort((a, b) => (b.matchScore || 0) - (a.matchScore || 0));
    }

    // Get unique localities and stats for filter sidebar
    const localities = db.prepare('SELECT DISTINCT locality FROM properties ORDER BY locality ASC').all().map((r: any) => r.locality);
    const cities = db.prepare('SELECT DISTINCT city FROM properties ORDER BY city ASC').all().map((r: any) => r.city);

    res.json({
      properties,
      count: properties.length,
      filterOptions: {
        cities,
        localities,
        propertyTypes: ['Apartment', 'Independent House', 'Villa', 'Gated Community'],
        furnishings: ['Unfurnished', 'Semi-Furnished', 'Fully Furnished'],
        parkingOptions: ['No Parking', 'Bike Only', 'Car Only', 'Car + Bike'],
        tenantTypes: ['Any', 'Family', 'Bachelors', 'Working Professionals']
      }
    });
  } catch (error) {
    console.error('Properties fetch error:', error);
    res.status(500).json({ error: 'Failed to fetch properties.' });
  }
});

// Get featured properties for landing page
router.get('/featured/all', (req: AuthRequest, res: Response): void => {
  try {
    const rows = db.prepare(`
      SELECT 
        id, prop_code, title, property_type, bhk, bedrooms, bathrooms,
        rent, deposit, city, locality, address, travel_time_mins, distance_km,
        parking, furnishing, water_availability, power_backup, lift, security,
        balcony, pet_friendly, gated_community, preferred_tenants, description,
        images, status, created_at
      FROM properties
      WHERE status = 'available'
      ORDER BY rent DESC
      LIMIT 6
    `).all() as any[];

    const properties = rows.map(prop => ({
      ...prop,
      images: JSON.parse(prop.images || '[]')
    }));

    res.json({ properties });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch featured properties.' });
  }
});

// Get Single Property Details (PUBLIC - Strict Owner Privacy)
router.get('/:id', optionalAuth, (req: AuthRequest, res: Response): void => {
  try {
    const { id } = req.params;
    const prop = db.prepare(`
      SELECT 
        id, prop_code, title, property_type, bhk, bedrooms, bathrooms,
        rent, deposit, city, locality, address, latitude, longitude,
        available_from, travel_time_mins, distance_km, parking, furnishing,
        water_availability, power_backup, lift, security, balcony,
        pet_friendly, gated_community, ground_floor, preferred_tenants,
        description, images, status, created_at, updated_at
      FROM properties
      WHERE id = ? OR prop_code = ?
    `).get(id, id) as any;

    if (!prop) {
      res.status(404).json({ error: 'Property not found.' });
      return;
    }

    let images = [];
    try {
      images = JSON.parse(prop.images);
    } catch {
      images = [];
    }

    let isFavorite = false;
    let matchData = null;

    if (req.user) {
      const fav = db.prepare('SELECT id FROM favorites WHERE user_id = ? AND property_id = ?').get(req.user.id, prop.id);
      isFavorite = !!fav;

      const userReq = db.prepare('SELECT * FROM customer_requirements WHERE user_id = ?').get(req.user.id);
      if (userReq) {
        matchData = computePropertyMatch(prop, userReq);
      }
    }

    // Related similar properties
    const similarRows = db.prepare(`
      SELECT id, prop_code, title, property_type, bhk, rent, locality, city, images, furnishing
      FROM properties
      WHERE id != ? AND (locality = ? OR bhk = ?) AND status != 'occupied'
      LIMIT 3
    `).all(prop.id, prop.locality, prop.bhk) as any[];

    const similarProperties = similarRows.map(s => ({
      ...s,
      images: JSON.parse(s.images || '[]')
    }));

    res.json({
      property: {
        ...prop,
        images,
        is_favorite: isFavorite,
        matchScore: matchData ? matchData.matchPercentage : undefined,
        matchReasons: matchData ? matchData.reasons : undefined
      },
      similarProperties
    });
  } catch (error) {
    console.error('Single property error:', error);
    res.status(500).json({ error: 'Failed to retrieve property details.' });
  }
});

export default router;
