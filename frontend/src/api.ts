// frontend/src/api.ts
import { Database, Booking, ItemBorrowing, User, UserRole } from './types';

// Kalau kamu pakai Vite Proxy (disarankan), cukup pakai baseURL = "/api"
// Kalau tidak pakai proxy, set VITE_API_BASE_URL="http://localhost:3001/api"
const BASE_URL =
  (import.meta as any).env?.VITE_API_BASE_URL ||
  '/api';

async function http<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${BASE_URL}${path}`, {
    headers: { 'Content-Type': 'application/json', ...(init?.headers || {}) },
    ...init,
  });

  // express sering balikin HTML kalau 404 → tangkap juga
  const text = await res.text();
  let data: any = null;
  try { data = text ? JSON.parse(text) : null; } catch { data = text; }

  if (!res.ok) {
    const msg = (data && (data.message || data.error)) || `HTTP ${res.status}`;
    throw new Error(msg);
  }
  return data as T;
}

export type PagedResponse<T> = {
  data: T[];
  page: number;
  limit: number;
  total: number;
  totalPages: number;
};

export const api = {
  // === Database ===
  async getDatabase(): Promise<Database> {
    // backend: GET /api/database
    return http<Database>('/database', { method: 'GET' });
  },

  // === Auth ===
  async login(username: string, password: string): Promise<{ success: boolean; user?: User; message?: string }> {
    // backend: POST /api/auth/login
    return http('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ username, password }),
    });
  },

  async register(registerData: any): Promise<{ success: boolean; message: string }> {
    // backend: POST /api/auth/register
    // registerData minimal: { username, password, fullName }
    return http('/auth/register', {
      method: 'POST',
      body: JSON.stringify(registerData),
    });
  },

  // === User Management ===
  async getUsers(): Promise<User[]> {
    // backend: GET /api/users
    return http<User[]>('/users', { method: 'GET' });
  },

  async updateUser(id: string, updateData: { password?: string; fullName?: string; role?: UserRole }): Promise<void> {
    // backend: PUT /api/users/:id
    await http(`/users/${id}`, {
      method: 'PUT',
      body: JSON.stringify(updateData),
    });
  },

  async deleteUser(id: string): Promise<void> {
    // backend: DELETE /api/users/:id
    await http(`/users/${id}`, { method: 'DELETE' });
  },

  // === Bookings ===
  async createBooking(bookingData: any): Promise<Booking> {
    // backend: POST /api/bookings
    return http<Booking>('/bookings', {
      method: 'POST',
      body: JSON.stringify(bookingData),
    });
  },

  async updateBookingStatus(id: string, status: 'APPROVED' | 'REJECTED' | 'PENDING'): Promise<void> {
    // backend: PATCH /api/bookings/:id/status
    await http(`/bookings/${id}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status }),
    });
  },

  // === Item Borrowing ===
  async createItemBorrowing(borrowData: any): Promise<ItemBorrowing> {
    // backend: POST /api/borrowings
    return http<ItemBorrowing>('/borrowings', {
      method: 'POST',
      body: JSON.stringify(borrowData),
    });
  },

  async updateItemBorrowingStatus(id: string, status: 'APPROVED' | 'REJECTED' | 'RETURNED'): Promise<void> {
    // backend: PATCH /api/borrowings/:id/status
    await http(`/borrowings/${id}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status }),
    });
  },

  // === General CRUD (rooms/lecturers/courses/schedules/items) ===
  async add(type: string, itemData: any): Promise<any> {
    // backend: POST /api/crud/:type
    return http(`/crud/${type}`, {
      method: 'POST',
      body: JSON.stringify(itemData),
    });
  },

  async update(type: string, id: string, itemData: any): Promise<void> {
    // backend: PUT /api/crud/:type/:id
    await http(`/crud/${type}/${id}`, {
      method: 'PUT',
      body: JSON.stringify(itemData),
    });
  },

  async delete(type: string, id: string): Promise<void> {
    // backend: DELETE /api/crud/:type/:id
    await http(`/crud/${type}/${id}`, { method: 'DELETE' });
  },

  async getPaged<T>(
    resource: string,
    params: { page?: number; limit?: number; q?: string }
  ): Promise<PagedResponse<T>> {
    const page = params.page ?? 1;
    const limit = params.limit ?? 9;

    const qs = new URLSearchParams({
      page: String(page),
      limit: String(limit),
      ...(params.q ? { q: params.q } : {}),
    });

    // backend: GET /api/crud/:resource?page=&limit=&q=
    return http<PagedResponse<T>>(`/crud/${resource}?${qs.toString()}`, {
      method: 'GET',
    });
  },
};
