import { Hono } from "hono";
import { AdminController } from "../controllers/admin.controller.js";
import { authMiddleware } from "../middlewares/auth.js";


const adminController = new AdminController();

const router = new Hono();

router.post('/promotions',authMiddleware, adminController.createPromotions)
router.put('/promotions/:id',authMiddleware, adminController.updatePromotions)
router.delete('/promotions/:id',authMiddleware, adminController.deletePromotions)

export default router;