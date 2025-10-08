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

    async getRole(uid: string) {
        const data = await db.collection("users").doc(uid).get();
        return data.data()?.role;
    }

    async getUserById(uid: string) {
        const data = await db.collection("users").doc(uid).get();
        if (!data.exists) {
            throw new Error("User not found");
        }
        return data.data();
    }
    async getUserBookmarks(uid: string) {
        const data = await db.collection("users").doc(uid).collection("bookmarks").get();
        if (!data.empty) {
            throw new Error("User not found");
        }
        return data.docs.map(doc => doc.data());
    }
    async createUserBookmark(uid: string, bookmarkId: string) {

        const data = await db.collection("users").doc(uid).collection("bookmarks").add({
            uid: uid,
            bookmarkId: bookmarkId,
        });
        if(!data.id){
            throw new Error("Bookmark not created");
        }
        return "Bookmark created";
    }
    async deleteUserBookmark(uid: string, bookmarkId: string) {
        const data = await db.collection("users").doc(uid).collection("bookmarks").doc(bookmarkId).delete();
        if (!data.writeTime) {
            throw new Error("Bookmark not deleted");
        }
        return "Bookmark deleted";
    }
}

