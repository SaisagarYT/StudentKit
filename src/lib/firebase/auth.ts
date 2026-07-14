'use client';

import { useState, useEffect, useCallback } from 'react';
import {
  signInWithPopup,
  GoogleAuthProvider,
  signOut as firebaseSignOut,
  onAuthStateChanged,
} from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { getFirebaseAuth, getFirebaseDb, isFirebaseConfigured } from './client';

export interface AdminUser {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
  role: 'admin' | 'editor';
}

export function useAuth() {
  const [user, setUser] = useState<AdminUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [configError, setConfigError] = useState(false);

  useEffect(() => {
    if (!isFirebaseConfigured) {
      setConfigError(true);
      setLoading(false);
      return;
    }

    const auth = getFirebaseAuth();
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        try {
          const adminDoc = await getDoc(doc(getFirebaseDb(), 'admins', firebaseUser.uid));
          if (adminDoc.exists()) {
            const data = adminDoc.data();
            setUser({
              uid: firebaseUser.uid,
              email: firebaseUser.email,
              displayName: firebaseUser.displayName,
              photoURL: firebaseUser.photoURL,
              role: data.role || 'editor',
            });
          } else {
            await firebaseSignOut(auth);
            setUser(null);
          }
        } catch {
          setUser(null);
        }
      } else {
        setUser(null);
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const signInWithGoogle = useCallback(async () => {
    const auth = getFirebaseAuth();
    const provider = new GoogleAuthProvider();
    const result = await signInWithPopup(auth, provider);
    const adminDoc = await getDoc(doc(getFirebaseDb(), 'admins', result.user.uid));
    if (!adminDoc.exists()) {
      await firebaseSignOut(auth);
      throw new Error('You do not have admin access.');
    }
    return result.user;
  }, []);

  const signOut = useCallback(async () => {
    const auth = getFirebaseAuth();
    await firebaseSignOut(auth);
    setUser(null);
  }, []);

  return { user, loading, signInWithGoogle, signOut, configError };
}
