import type { Context } from "hono";
import { ReviewService } from "../services/review.service.js";

export class ReviewsController {

    private reviewService = new ReviewService();

    createReview = async (c: Context) => {
        try {
            const user = await c.get('user');
            if (!user?.uid) {
                return c.json({ message: 'Unauthorized' }, 401);
            }

            const body = await c.req.json();
            const { promotionId, rating, comment } = body as { promotionId?: string; rating?: number; comment?: string };

            if (!promotionId || typeof rating !== 'number') {
                return c.json({ message: 'promotionId and rating are required' }, 400);
            }

            if (rating < 1 || rating > 5) {
                return c.json({ message: 'rating must be between 1 and 5' }, 400);
            }

            const response = await this.reviewService.createReview({
                promotionId,
                userId: user.uid,
                rating,
                comment,
            });

            return c.json(response, 200);
        } catch (error: any) {
            return c.json({ message: error.message }, 400);
        }
    }

    getReviewsByPromotionId = async (c: Context) => {
        try {
            const promotionId = c.req.param('id');
            const reviews = await this.reviewService.getReviewsByPromotionId(promotionId);
            return c.json(reviews, 200);
        } catch (error: any) {
            return c.json({ message: error.message }, 400);
        }
    }
}


