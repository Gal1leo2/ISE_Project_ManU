import { db } from "../libs/firebase.js";
import type { ReviewInterface } from "../models/review.model.js";

export class ReviewService {

    async createReview(data: Omit<ReviewInterface, 'id' | 'createdAt'>) {
        const ref = db.collection("reviews").doc();
        const doc: ReviewInterface = {
            id: ref.id,
            ...data,
        };
        await ref.set(doc);
        return { success: true, id: ref.id };
    }

    async getReviewsByPromotionId(promotionId: string): Promise<ReviewInterface[]> {
        const snapshot = await db.collection("reviews").where("promotionId", "==", promotionId).get();
        const reviews: ReviewInterface[] = snapshot.docs.map(doc => doc.data() as ReviewInterface);
        return reviews;
    }
}


