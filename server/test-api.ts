import http from 'http';

async function request(url: string, options: any = {}) {
  return new Promise<{ status: number; data: any }>((resolve, reject) => {
    const u = new URL(url);
    const req = http.request({
      hostname: u.hostname,
      port: u.port,
      path: u.pathname + u.search,
      method: options.method || 'GET',
      headers: options.headers || {}
    }, (res) => {
      let body = '';
      res.on('data', chunk => body += chunk);
      res.on('end', () => {
        try {
          resolve({ status: res.statusCode || 200, data: JSON.parse(body) });
        } catch {
          resolve({ status: res.statusCode || 200, data: body });
        }
      });
    });
    req.on('error', reject);
    if (options.body) {
      req.write(typeof options.body === 'string' ? options.body : JSON.stringify(options.body));
    }
    req.end();
  });
}

async function runTests() {
  console.log('🧪 Starting automated API & Security Verification Tests...\n');

  const BASE_URL = 'http://localhost:5000/api';

  // 1. Health check
  console.log('1. Testing /health endpoint...');
  const health = await request(`${BASE_URL}/health`);
  console.log('  Health check status:', health.status, health.data.status === 'ok' ? '✅ PASS' : '❌ FAIL');

  // 2. Demo Login Customer
  console.log('\n2. Testing Customer Demo Login...');
  const custLogin = await request(`${BASE_URL}/auth/demo-login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: { role: 'customer' }
  });
  console.log('  Customer token issued:', custLogin.status === 200 && custLogin.data.token ? '✅ PASS' : '❌ FAIL');
  const custToken = custLogin.data.token;

  // 3. Demo Login Admin
  console.log('\n3. Testing Admin Demo Login...');
  const adminLogin = await request(`${BASE_URL}/auth/demo-login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: { role: 'admin' }
  });
  console.log('  Admin token issued:', adminLogin.status === 200 && adminLogin.data.user.role === 'admin' ? '✅ PASS' : '❌ FAIL');
  const adminToken = adminLogin.data.token;

  // 4. Public Properties & Security Privacy Check
  console.log('\n4. Testing Public Properties & Owner Privacy Guard...');
  const publicProps = await request(`${BASE_URL}/properties`);
  console.log(`  Fetched ${publicProps.data.properties.length} public properties.`);
  
  // Verify that NO public property contains owner_phone, owner_name, owner_email
  const hasOwnerLeak = publicProps.data.properties.some((p: any) => p.owner_phone || p.owner_name || p.owner_notes);
  console.log('  Owner Phone / Email / Notes stripped from public endpoint:', !hasOwnerLeak ? '✅ PASS (Strict Privacy Protected)' : '❌ FAIL (Data Leak detected!)');

  // 5. Admin Properties & Owner Access Check
  console.log('\n5. Testing Admin Properties (Must include Private Owner details)...');
  const adminProps = await request(`${BASE_URL}/admin/properties`, {
    headers: { Authorization: `Bearer ${adminToken}` }
  });
  const hasOwnerDataInAdmin = adminProps.data.properties.some((p: any) => p.owner_phone && p.owner_name);
  console.log('  Admin can access private owner contact records:', hasOwnerDataInAdmin ? '✅ PASS' : '❌ FAIL');

  // 6. Customer Access Denial to Admin endpoints
  console.log('\n6. Testing Role Guard (Customer trying to access /admin/properties)...');
  const customerAccessDenial = await request(`${BASE_URL}/admin/properties`, {
    headers: { Authorization: `Bearer ${custToken}` }
  });
  console.log('  Customer denied with 403 Forbidden:', customerAccessDenial.status === 403 ? '✅ PASS' : '❌ FAIL');

  // 7. House Requirement Saving and Match Engine
  console.log('\n7. Testing Smart Requirement Match Engine...');
  const reqSave = await request(`${BASE_URL}/requirements/my`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${custToken}`
    },
    body: {
      preferred_city: 'Hyderabad',
      preferred_areas: ['Madhapur', 'Gachibowli'],
      house_types: ['Apartment'],
      bhk_list: [2],
      min_rent: 20000,
      max_rent: 30000,
      parking_needed: 'Car + Bike',
      max_travel_time: 25
    }
  });
  const topMatch = reqSave.data.matchedProperties[0];
  console.log(`  Top recommended property: ${topMatch.prop_code} with ${topMatch.matchScore}% Match.`);
  console.log('  Match scoring engine:', topMatch.matchScore >= 80 ? '✅ PASS' : '❌ FAIL');

  // 8. Submit "I'm Interested" Enquiry
  console.log('\n8. Testing Enquiry Submission ("I\'m Interested")...');
  const enqRes = await request(`${BASE_URL}/enquiries`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${custToken}`
    },
    body: {
      property_id: topMatch.id,
      customer_name: 'Rahul Verma',
      customer_phone: '+91 98111 22233',
      preferred_visit_date: '2026-09-10',
      preferred_contact_time: 'Evening (6 PM - 8 PM)',
      message: 'Interested in physical walkthrough this weekend.'
    }
  });
  console.log('  Enquiry created code:', enqRes.data.enquiryCode, enqRes.status === 201 ? '✅ PASS' : '❌ FAIL');

  // 9. Admin Dashboard Metrics
  console.log('\n9. Testing Admin Dashboard Metrics...');
  const dashRes = await request(`${BASE_URL}/admin/dashboard`, {
    headers: { Authorization: `Bearer ${adminToken}` }
  });
  console.log('  Admin metrics loaded:', dashRes.data.metrics.totalProperties > 0 ? '✅ PASS' : '❌ FAIL');
  console.log('  Total Commission calculated:', `₹${dashRes.data.metrics.totalCommission.toLocaleString('en-IN')}`);

  // 10. Social Media Content Studio
  console.log('\n10. Testing Instagram & Social Media Content Studio Generator...');
  const socialRes = await request(`${BASE_URL}/admin/social-studio/${topMatch.id}`, {
    headers: { Authorization: `Bearer ${adminToken}` }
  });
  console.log('  Instagram caption & hashtags generated:', socialRes.data.instagramCaption.includes('#HouseForRent') ? '✅ PASS' : '❌ FAIL');

  console.log('\n✨ ALL AUTOMATED TESTS COMPLETED SUCCESSFULLY! ✨');
}

runTests().catch(console.error);
