import { Hono } from "hono";
import { UserController } from "../controllers/user.controller.js";
import { authMiddleware } from "../middlewares/auth.js";
import { PromotionsController } from "../controllers/promotions.controller.js";

const router = new Hono();

const userController = new UserController();
const promotionsController = new PromotionsController();


//user
router.get('/register',authMiddleware, userController.register);


//Promotion public
router.get('/promotions', promotionsController.getAllPromotion)
router.get('/promotions/:id', promotionsController.getPromotionById)
router.get('/promotions/recommended', promotionsController.getPromotionRecommended)
router.post('/promotions/recommended', promotionsController.promotionCompare)


//Review Rate
router.post('/review')
router.get('/promotions/:id/reviews')

export default router;
