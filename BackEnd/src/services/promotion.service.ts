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

    getRecommendedPromotions = async (): Promise<PromotionInterface[]> => {
        // Get promotions that are currently active (between startDate and endDate)
        const now = new Date().toISOString();
        const snapshot = await db.collection("promotions")
            .where("startDate", "<=", now)
            .where("endDate", ">=", now)
            .orderBy("startDate", "desc")
            .limit(10)
            .get();

        const promotions: PromotionInterface[] = snapshot.docs.map(doc => {
            return {
                id: doc.id,
                ...(doc.data() as Omit<PromotionInterface, "id">),
            };
        });

        if (snapshot.empty) {
            throw new Error('No recommended promotions available!');
        }

        return promotions;
    }

    comparePromotions = async (promotionIds: string[]): Promise<PromotionInterface[]> => {
        const docs = await Promise.all(
          promotionIds.map((id) => db.collection("promotions").doc(id).get())
        );
      
        const missing = docs
          .map((doc, idx) => (!doc.exists ? promotionIds[idx] : null))
          .filter((v): v is string => v !== null);
      
        if (missing.length) {
          throw new Error(`Promotion not found: ${missing.join(", ")}`);
        }
      
        return docs.map((doc) => ({
          id: doc.id,
          ...(doc.data() as Omit<PromotionInterface, "id">),
        }));
      }
}