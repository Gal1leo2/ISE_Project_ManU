import { writable } from 'svelte/store';
import { auth } from '$lib/firebase';
import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword,
  signOut as firebaseSignOut,
  onAuthStateChanged,
  type User
} from 'firebase/auth';

interface AuthState {
  user: User | null;
  loading: boolean;
  token: string | null;
}

function createAuthStore() {
  const { subscribe, set, update } = writable<AuthState>({
    user: null,
    loading: true,
    token: null
  });

  onAuthStateChanged(auth, async (user) => {
    if (user) {
      const token = await user.getIdToken();
      set({ user, loading: false, token });
    } else {
      set({ user: null, loading: false, token: null });
    }
  });

  return {
    subscribe,
    signIn: async (email: string, password: string) => {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const token = await userCredential.user.getIdToken();
      update(state => ({ ...state, user: userCredential.user, token }));
    },
    signUp: async (email: string, password: string) => {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const token = await userCredential.user.getIdToken();
      update(state => ({ ...state, user: userCredential.user, token }));
      return token;
    },
    signOut: async () => {
      await firebaseSignOut(auth);
      set({ user: null, loading: false, token: null });
    },
    getToken: async () => {
      const user = auth.currentUser;
      if (user) {
        return await user.getIdToken();
      }
      return null;
    }
  };
}

export const authStore = createAuthStore();