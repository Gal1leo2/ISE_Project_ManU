import { db } from "../libs/firebase.js";
import type { PromotionInterface } from "../models/promotion.model.js";
export class PromotionsService {

    getAllPromotions = async (): Promise<PromotionInterface[]> => {
        const snapshot = await db.collection("promotions").get();

        const promotions: PromotionInterface[] = snapshot.docs.map(doc => {
            return {
                id: doc.id,
                ...(doc.data() as Omit<PromotionInterface, "id">),
            };
        });

        if (snapshot.empty) {
            throw new Error('No such promotion!');
        }

        return promotions;
    };

    getPromotionById = async (id: string) => {
        const promotion = await db.collection("promotions").doc(id).get();

        if (!promotion.exists) {
            throw new Error('No such promotion!');
        }

        return promotion.data();
    }
}