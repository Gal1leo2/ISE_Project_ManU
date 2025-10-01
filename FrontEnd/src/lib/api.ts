import type { Promotion } from './types';

const API_BASE = 'http://localhost:3001/api/v1';

export const api = {
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
  }
};