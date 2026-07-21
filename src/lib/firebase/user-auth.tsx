'use client';

import { createContext, useContext, useState, useEffect, useCallback, useRef, type ReactNode } from 'react';
import {
  signInWithPopup,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  signOut as firebaseSignOut,
  onAuthStateChanged,
  updateProfile,
  type User,
} from 'firebase/auth';
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';
import { getFirebaseAuth, getFirebaseDb, isFirebaseConfigured } from './client';
import { pushProgressToCloud, PROGRESS_CHANGED_EVENT } from './user-progress-sync';

export interface UserProfile {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
  createdAt?: string;
}

interface UserAuthContextValue {
  user: UserProfile | null;
  loading: boolean;
  signInWithGoogle: () => Promise<void>;
  signInWithEmail: (email: string, password: string) => Promise<void>;
  signUpWithEmail: (email: string, password: string, name: string) => Promise<void>;
  signOut: () => Promise<void>;
}

const UserAuthContext = createContext<UserAuthContextValue>({
  user: null,
  loading: true,
  signInWithGoogle: async () => {},
  signInWithEmail: async () => {},
  signUpWithEmail: async () => {},
  signOut: async () => {},
});

export function useUserAuth() {
  return useContext(UserAuthContext);
}

async function ensureUserDoc(firebaseUser: User) {
  const db = getFirebaseDb();
  const ref = doc(db, 'users', firebaseUser.uid);
  const snap = await getDoc(ref);
  if (!snap.exists()) {
    await setDoc(ref, {
      email: firebaseUser.email,
      displayName: firebaseUser.displayName || '',
      photoURL: firebaseUser.photoURL || '',
      createdAt: serverTimestamp(),
      streak: { current: 0, longest: 0, lastActiveDate: '', totalActiveDays: 0 },
      dsaProgress: {},
      csProgress: {},
      roadmapProgress: {},
      bookmarks: [],
    });
  }
}

export function UserAuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isFirebaseConfigured) {
      setLoading(false);
      return;
    }
    const auth = getFirebaseAuth();
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        await ensureUserDoc(firebaseUser);
        setUser({
          uid: firebaseUser.uid,
          email: firebaseUser.email,
          displayName: firebaseUser.displayName,
          photoURL: firebaseUser.photoURL,
        });
      } else {
        setUser(null);
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  // Auto-sync: debounce push to cloud on progress changes
  const syncTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const pendingSyncRef = useRef(false);

  useEffect(() => {
    if (!user) return;

    function handleProgressChange() {
      pendingSyncRef.current = true;
      if (syncTimerRef.current) clearTimeout(syncTimerRef.current);
      syncTimerRef.current = setTimeout(() => {
        if (user) {
          pushProgressToCloud(user.uid);
          pendingSyncRef.current = false;
        }
      }, 5000);
    }

    function handleBeforeUnload() {
      if (pendingSyncRef.current && user) {
        pushProgressToCloud(user.uid);
      }
    }

    window.addEventListener(PROGRESS_CHANGED_EVENT, handleProgressChange);
    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => {
      window.removeEventListener(PROGRESS_CHANGED_EVENT, handleProgressChange);
      window.removeEventListener('beforeunload', handleBeforeUnload);
      if (syncTimerRef.current) clearTimeout(syncTimerRef.current);
    };
  }, [user]);

  const signInWithGoogle = useCallback(async () => {
    const auth = getFirebaseAuth();
    const provider = new GoogleAuthProvider();
    await signInWithPopup(auth, provider);
  }, []);

  const signInWithEmail = useCallback(async (email: string, password: string) => {
    const auth = getFirebaseAuth();
    await signInWithEmailAndPassword(auth, email, password);
  }, []);

  const signUpWithEmail = useCallback(async (email: string, password: string, name: string) => {
    const auth = getFirebaseAuth();
    const result = await createUserWithEmailAndPassword(auth, email, password);
    await updateProfile(result.user, { displayName: name });
  }, []);

  const signOut = useCallback(async () => {
    if (pendingSyncRef.current && user) {
      if (syncTimerRef.current) clearTimeout(syncTimerRef.current);
      await pushProgressToCloud(user.uid);
      pendingSyncRef.current = false;
    }
    const auth = getFirebaseAuth();
    await firebaseSignOut(auth);
    setUser(null);
  }, [user]);

  return (
    <UserAuthContext.Provider value={{ user, loading, signInWithGoogle, signInWithEmail, signUpWithEmail, signOut }}>
      {children}
    </UserAuthContext.Provider>
  );
}
