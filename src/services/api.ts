import { API_ENDPOINTS } from '@/config/api';

// Generic API fetch function
async function apiFetch<T>(url: string, options?: RequestInit): Promise<T> {
  const response = await fetch(url, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options?.headers,
    },
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'Network error' }));
    throw new Error(error.message || 'API request failed');
  }

  return response.json();
}

// Devices API
export const devicesApi = {
  getAll: () => apiFetch(API_ENDPOINTS.devices),
  getById: (id: string) => apiFetch(`${API_ENDPOINTS.devices}?id=${id}`),
  create: (data: any) => apiFetch(API_ENDPOINTS.devices, {
    method: 'POST',
    body: JSON.stringify(data),
  }),
  update: (data: any) => apiFetch(API_ENDPOINTS.devices, {
    method: 'PUT',
    body: JSON.stringify(data),
  }),
  delete: (id: string) => apiFetch(`${API_ENDPOINTS.devices}?id=${id}`, {
    method: 'DELETE',
  }),
};

// SIM Cards API
export const simCardsApi = {
  getAll: () => apiFetch(API_ENDPOINTS.simCards),
  getById: (id: number) => apiFetch(`${API_ENDPOINTS.simCards}?id=${id}`),
  create: (data: any) => apiFetch(API_ENDPOINTS.simCards, {
    method: 'POST',
    body: JSON.stringify(data),
  }),
  update: (data: any) => apiFetch(API_ENDPOINTS.simCards, {
    method: 'PUT',
    body: JSON.stringify(data),
  }),
  delete: (id: number) => apiFetch(`${API_ENDPOINTS.simCards}?id=${id}`, {
    method: 'DELETE',
  }),
};

// Users API
export const usersApi = {
  getAll: () => apiFetch(API_ENDPOINTS.users),
  getById: (id: string) => apiFetch(`${API_ENDPOINTS.users}?id=${id}`),
  create: (data: any) => apiFetch(API_ENDPOINTS.users, {
    method: 'POST',
    body: JSON.stringify(data),
  }),
  update: (data: any) => apiFetch(API_ENDPOINTS.users, {
    method: 'PUT',
    body: JSON.stringify(data),
  }),
  delete: (id: string) => apiFetch(`${API_ENDPOINTS.users}?id=${id}`, {
    method: 'DELETE',
  }),
};

// Activations API
export const activationsApi = {
  getAll: () => apiFetch(API_ENDPOINTS.activations),
  getById: (id: number) => apiFetch(`${API_ENDPOINTS.activations}?id=${id}`),
  create: (data: any) => apiFetch(API_ENDPOINTS.activations, {
    method: 'POST',
    body: JSON.stringify(data),
  }),
  update: (data: any) => apiFetch(API_ENDPOINTS.activations, {
    method: 'PUT',
    body: JSON.stringify(data),
  }),
  delete: (id: number) => apiFetch(`${API_ENDPOINTS.activations}?id=${id}`, {
    method: 'DELETE',
  }),
};

// Topups API
export const topupsApi = {
  getAll: () => apiFetch(API_ENDPOINTS.topups),
  getById: (id: number) => apiFetch(`${API_ENDPOINTS.topups}?id=${id}`),
  create: (data: any) => apiFetch(API_ENDPOINTS.topups, {
    method: 'POST',
    body: JSON.stringify(data),
  }),
  update: (data: any) => apiFetch(API_ENDPOINTS.topups, {
    method: 'PUT',
    body: JSON.stringify(data),
  }),
  delete: (id: number) => apiFetch(`${API_ENDPOINTS.topups}?id=${id}`, {
    method: 'DELETE',
  }),
};
