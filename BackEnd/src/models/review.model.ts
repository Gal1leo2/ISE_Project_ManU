export interface ReviewInterface {
    id: string;
    promotionId: string;
    userId: string;
    rating: number; // 1-5
    comment?: string;
    createdAt?: unknown; // Firestore timestamp
}


