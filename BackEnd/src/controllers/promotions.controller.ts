import type { Context } from "hono";
import { PromotionsService } from "../services/promotion.service.js";

export class PromotionsController {

    private promotionsService = new PromotionsService();

    getAllPromotion = async (c: Context) => {
        try {
            const response = await this.promotionsService.getAllPromotions();
            return c.json(response, 200)
        } catch (error: any) {
            return c.json({ message: error.message }, 400);
        }
    }

    getPromotionById = async (c: Context) => {
        try {
            const promotionID = c.req.param('id');
            const response = await this.promotionsService.getPromotionById(promotionID);
            return c.json(response, 200)
        } catch (error: any) {
            return c.json({ message: error.message }, 400);

        }
    }

    getPromotionRecommended = async (c: Context) => {
        try {
            const response = await this.promotionsService.getRecommendedPromotions();
            return c.json(response, 200)
        } catch (error: any) {
            return c.json({ message: error.message }, 400);
        }
    }

    promotionCompare = async (c: Context) => {
        try {
            const body = await c.req.json();
            const { promotionIds } = body;
            
            if (!promotionIds || !Array.isArray(promotionIds) || promotionIds.length < 2) {
                return c.json({ message: 'Please provide at least 2 promotion IDs to compare' }, 400);
            }
            
            const response = await this.promotionsService.comparePromotions(promotionIds);
            return c.json(response, 200)
        } catch (error: any) {
            return c.json({ message: error.message }, 400);
        }
    }
}