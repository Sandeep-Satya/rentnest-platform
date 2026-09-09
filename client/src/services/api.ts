const API_BASE = '/api';

function getHeaders(): HeadersInit {
  const token = localStorage.getItem('rentnest_token');
  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {})
  };
}

async function handleResponse<T>(res: Response): Promise<T> {
  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.error || 'Something went wrong. Please try again.');
  }
  return data;
}

export const api = {
  // Auth
  register: (body: any) =>
    fetch(`${API_BASE}/auth/register`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(body)
    }).then(r => handleResponse<any>(r)),

  login: (body: any) =>
    fetch(`${API_BASE}/auth/login`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(body)
    }).then(r => handleResponse<any>(r)),

  demoLogin: (role: 'admin' | 'customer') =>
    fetch(`${API_BASE}/auth/demo-login`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({ role })
    }).then(r => handleResponse<any>(r)),

  getMe: () =>
    fetch(`${API_BASE}/auth/me`, {
      headers: getHeaders()
    }).then(r => handleResponse<any>(r)),

  // Public Properties
  getProperties: (params?: Record<string, string>) => {
    const qs = params ? '?' + new URLSearchParams(params).toString() : '';
    return fetch(`${API_BASE}/properties${qs}`, {
      headers: getHeaders()
    }).then(r => handleResponse<any>(r));
  },

  getFeaturedProperties: () =>
    fetch(`${API_BASE}/properties/featured/all`, {
      headers: getHeaders()
    }).then(r => handleResponse<any>(r)),

  getPropertyById: (id: string) =>
    fetch(`${API_BASE}/properties/${id}`, {
      headers: getHeaders()
    }).then(r => handleResponse<any>(r)),

  // Customer Requirements
  getMyRequirement: () =>
    fetch(`${API_BASE}/requirements/my`, {
      headers: getHeaders()
    }).then(r => handleResponse<any>(r)),

  saveMyRequirement: (data: any) =>
    fetch(`${API_BASE}/requirements/my`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(data)
    }).then(r => handleResponse<any>(r)),

  // Enquiries & Favorites
  submitEnquiry: (data: any) =>
    fetch(`${API_BASE}/enquiries`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(data)
    }).then(r => handleResponse<any>(r)),

  getMyEnquiries: () =>
    fetch(`${API_BASE}/enquiries/my`, {
      headers: getHeaders()
    }).then(r => handleResponse<any>(r)),

  toggleFavorite: (propertyId: string) =>
    fetch(`${API_BASE}/enquiries/favorites/toggle`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({ property_id: propertyId })
    }).then(r => handleResponse<any>(r)),

  getMyFavorites: () =>
    fetch(`${API_BASE}/enquiries/favorites/my`, {
      headers: getHeaders()
    }).then(r => handleResponse<any>(r)),

  // Admin Portal APIs
  getAdminDashboard: () =>
    fetch(`${API_BASE}/admin/dashboard`, {
      headers: getHeaders()
    }).then(r => handleResponse<any>(r)),

  getAdminProperties: () =>
    fetch(`${API_BASE}/admin/properties`, {
      headers: getHeaders()
    }).then(r => handleResponse<any>(r)),

  createProperty: (data: any) =>
    fetch(`${API_BASE}/admin/properties`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(data)
    }).then(r => handleResponse<any>(r)),

  updateProperty: (id: string, data: any) =>
    fetch(`${API_BASE}/admin/properties/${id}`, {
      method: 'PUT',
      headers: getHeaders(),
      body: JSON.stringify(data)
    }).then(r => handleResponse<any>(r)),

  deleteProperty: (id: string) =>
    fetch(`${API_BASE}/admin/properties/${id}`, {
      method: 'DELETE',
      headers: getHeaders()
    }).then(r => handleResponse<any>(r)),

  updatePropertyStatus: (id: string, status: string) =>
    fetch(`${API_BASE}/admin/properties/${id}/status`, {
      method: 'PATCH',
      headers: getHeaders(),
      body: JSON.stringify({ status })
    }).then(r => handleResponse<any>(r)),

  getAdminEnquiries: (status?: string, search?: string) => {
    const p = new URLSearchParams();
    if (status) p.set('status', status);
    if (search) p.set('search', search);
    return fetch(`${API_BASE}/admin/enquiries?${p.toString()}`, {
      headers: getHeaders()
    }).then(r => handleResponse<any>(r));
  },

  updateEnquiryStatus: (id: string, data: any) =>
    fetch(`${API_BASE}/admin/enquiries/${id}/status`, {
      method: 'PATCH',
      headers: getHeaders(),
      body: JSON.stringify(data)
    }).then(r => handleResponse<any>(r)),

  getAdminOwners: () =>
    fetch(`${API_BASE}/admin/owners`, {
      headers: getHeaders()
    }).then(r => handleResponse<any>(r)),

  createOwner: (data: any) =>
    fetch(`${API_BASE}/admin/owners`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(data)
    }).then(r => handleResponse<any>(r)),

  getAdminCustomers: () =>
    fetch(`${API_BASE}/admin/customers`, {
      headers: getHeaders()
    }).then(r => handleResponse<any>(r)),

  getSocialStudioData: (propertyId: string) =>
    fetch(`${API_BASE}/admin/social-studio/${propertyId}`, {
      headers: getHeaders()
    }).then(r => handleResponse<any>(r)),

  getCommissions: () =>
    fetch(`${API_BASE}/admin/commissions`, {
      headers: getHeaders()
    }).then(r => handleResponse<any>(r))
};
