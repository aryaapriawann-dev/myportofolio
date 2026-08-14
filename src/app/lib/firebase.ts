import { initializeApp, getApps, type FirebaseApp } from "firebase/app";
import {
  getFirestore,
  doc,
  setDoc,
  updateDoc,
  deleteDoc,
} from "firebase/firestore";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

let app: FirebaseApp;
if (!getApps().length) {
  app = initializeApp(firebaseConfig);
} else {
  app = getApps()[0];
}

export const db = getFirestore(app);
export const firebaseApp = app;

export const saveDoc = async (path: string, id: string, data: Record<string, unknown>) => {
  const ref = doc(db, path, id);
  await setDoc(ref, data, { merge: false });
  return ref;
};

export const updateDocById = async (path: string, id: string, data: Partial<Record<string, unknown>>) => {
  const ref = doc(db, path, id);
  await updateDoc(ref, data);
  return ref;
};

export const deleteDocById = async (path: string, id: string) => {
  const ref = doc(db, path, id);
  await deleteDoc(ref);
  return ref;
};