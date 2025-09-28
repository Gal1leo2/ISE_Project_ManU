import admin, { db } from "../libs/firebase.js";
import type { PromotionInterface } from "../models/promotion.model.js";

export class AdminService {

    async createPromotion(data: PromotionInterface) {

        const promotion = db.collection("promotions").doc(); //auto generate id

        await promotion.set({
            id: promotion.id,
            title: data.title,
            description: data.description,
            provider: data.provider,
            startDate: data.startDate,
            endDate: data.endDate,
            link: data.endDate,
            catagory: data.catagory
        })

        return {
            success : true,
            message: 'Create promotion success'
        }

    }

    async updatePromotion(id: string, data: Partial<PromotionInterface>) {

        const promotion = db.collection("promotions").doc(id); //find id

        const docSnap = await promotion.get();
        if (!docSnap.exists) {
            throw new Error("Promotion not found");
        }

        await promotion.update({
            ...data,
            updatedAt: admin.firestore.FieldValue.serverTimestamp(),
        })

        return {
            success : true,
            message: `Promotion ${id} updated`
        }

    }

    async deletePromotion(id: string) {

        const promotion = db.collection("promotions").doc(id); //find id

        const docSnap = await promotion.get();
        if (!docSnap.exists) {
            throw new Error("Promotion not found");
        }

        await promotion.delete();

        return {
            success : true,
            message: `Promotion ${id} deleted`
        }

    }

}