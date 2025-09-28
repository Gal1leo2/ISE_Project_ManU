import { auth } from '../libs/firebase.js';
import { getFirestore } from "firebase-admin/firestore";
import type { User } from '../models/user.model.js';

const db = getFirestore();

export default class UserServices {

    async register(uid: string) {
        const response = await db.collection("users").doc(uid).set({
            role: "user",
            createdAt: new Date(),
        });

        return response;
    }

    async getRole(uid : string){
        const data = await db.collection("users").doc(uid).get();
        return data.data()?.role;
    }
}

