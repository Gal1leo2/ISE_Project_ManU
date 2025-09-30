import admin from 'firebase-admin';
import serviceAccount from '../config/firebaseServices.json'  with { type: 'json' };

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount as admin.ServiceAccount),
});
export const auth = admin.auth();
export const db = admin.firestore();
export default admin;