import type { Promotion } from './types';
import { authStore } from './stores/auth';
import { get } from 'svelte/store';

const API_BASE = 'http://localhost:3001/api/v1';

async function getAuthHeaders(): Promise<HeadersInit> {
  const token = await authStore.getToken();
  return {
    'Content-Type': 'application/json',
    ...(token && { 'Authorization': `Bearer ${token}` })
  };
}

export const api = {
  // Public Promotion APIs
  async getAllPromotions(): Promise<Promotion[]> {
    const res = await fetch(`${API_BASE}/promotions`);
    if (!res.ok) throw new Error('Failed to fetch promotions');
    return res.json();
  },

  async getPromotionById(id: string): Promise<Promotion> {
    const res = await fetch(`${API_BASE}/promotions/${id}`);
    if (!res.ok) throw new Error('Failed to fetch promotion');
    return res.json();
  },

  async comparePromotions(promotionIds: string[]) {
    const res = await fetch(`${API_BASE}/promotions/recommended`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ promotionIds })
    });
    if (!res.ok) throw new Error('Failed to compare promotions');
    return res.json();
  },

  // User APIs
  async registerUser(): Promise<any> {
    const headers = await getAuthHeaders();
    const res = await fetch(`${API_BASE}/register`, {
      method: 'GET',
      headers
    });
    if (!res.ok) throw new Error('Failed to register user');
    return res.json();
  },

  // Admin APIs
  async createPromotion(data: Omit<Promotion, 'id'>): Promise<any> {
    const headers = await getAuthHeaders();
    const res = await fetch(`${API_BASE}/admin/promotions`, {
      method: 'POST',
      headers,
      body: JSON.stringify(data)
    });
    if (!res.ok) {
      const error = await res.json();
      throw new Error(error.message || 'Failed to create promotion');
    }
    return res.json();
  },

  async updatePromotion(id: string, data: Partial<Promotion>): Promise<any> {
    const headers = await getAuthHeaders();
    const res = await fetch(`${API_BASE}/admin/promotions/${id}`, {
      method: 'PUT',
      headers,
      body: JSON.stringify(data)
    });
    if (!res.ok) {
      const error = await res.json();
      throw new Error(error.message || 'Failed to update promotion');
    }
    return res.json();
  },

  async deletePromotion(id: string): Promise<any> {
    const headers = await getAuthHeaders();
    const res = await fetch(`${API_BASE}/admin/promotions/${id}`, {
      method: 'DELETE',
      headers
    });
    if (!res.ok) {
      const error = await res.json();
      throw new Error(error.message || 'Failed to delete promotion');
    }
    return res.json();
  }
};