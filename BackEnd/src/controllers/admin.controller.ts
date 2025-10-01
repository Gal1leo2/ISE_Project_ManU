import type { Context } from "hono";
import { AdminService } from "../services/admin.service.js";
import type { PromotionInterface } from "../models/promotion.model.js";
import UserServices from "../services/user.service.js";

export class AdminController {

    private adminService = new AdminService();
    private userService = new UserServices();

    createPromotions = async (c: Context) => {

        try {
            const user = await c.get('user')
            const role = await this.userService.getRole(user.uid);
            if (role !== 'admin') {
                return c.json({ message: 'Access Denied' }, 401)
            }

            const data = await c.req.json<PromotionInterface>();
            const response = await this.adminService.createPromotion(data);

            if (!response.success) {
                return c.json({ message: 'Create promotion failed' }, 400)
            }

            return c.json({ message: response.message }, 200)


        } catch (error: any) {
            return c.json({ message: error.message }, 500)
        }

    }
    updatePromotions = async (c: Context) => {
        try {
            const user = await c.get('user')
            const role = await this.userService.getRole(user.uid);
            if (role !== 'admin') {
                return c.json({ message: 'Access Denied' }, 401)
            }

            const promotionID = c.req.param('id');
            const data = await c.req.json<PromotionInterface>();

            const response = await this.adminService.updatePromotion(promotionID, data)

            if (!response.success) {
                return c.json({ message: 'Update promotion failed' }, 400)
            }

            return c.json({ message: response.message }, 200)

        } catch (error: any) {
            return c.json({ message: error.message }, 400)
        }
    }

    deletePromotions = async (c: Context) => {
        try {
            const user = await c.get('user')
            const role = await this.userService.getRole(user.uid);
            if (role !== 'admin') {
                return c.json({ message: 'Access Denied' }, 401)
            }

            const promotionID = c.req.param('id');
            const response = await this.adminService.deletePromotion(promotionID);

            if (!response.success) {
                return c.json({ message: 'Update promotion failed' }, 400)
            }

            return c.json({ message: response.message }, 200)

        } catch (error: any) {
            return c.json({ message: error.message }, 400)
        }
    }
}