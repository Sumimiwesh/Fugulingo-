import { initializeApp, getApps, getApp, FirebaseApp } from 'firebase/app';
import { getAuth, Auth, GoogleAuthProvider } from 'firebase/auth';
import { getFirestore, Firestore } from 'firebase/firestore';
import { getStorage, FirebaseStorage } from 'firebase/storage';
import { STORAGE_KEYS } from './constants';

export interface FirebaseClientConfig {
  apiKey: string;
  authDomain: string;
  projectId: string;
  storageBucket: string;
  messagingSenderId: string;
  appId: string;
}

// 保存されている設定、または環境変数からの設定を取得
export const getActiveFirebaseConfig = (): FirebaseClientConfig | null => {
  // 1. ローカルストレージにユーザーが入力した本番設定があるか確認
  try {
    const saved = localStorage.getItem(STORAGE_KEYS.FIREBASE_CONFIG);
    if (saved) {
      const parsed = JSON.parse(saved);
      if (parsed.apiKey && parsed.projectId) {
        return parsed;
      }
    }
  } catch (e) {
    console.error('Failed to parse saved firebase config:', e);
  }

  // 2. 環境変数からの設定
  const apiKey = import.meta.env.VITE_FIREBASE_API_KEY;
  const projectId = import.meta.env.VITE_FIREBASE_PROJECT_ID;

  if (apiKey && projectId) {
    return {
      apiKey,
      authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || `${projectId}.firebaseapp.com`,
      projectId,
      storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || `${projectId}.appspot.com`,
      messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || '',
      appId: import.meta.env.VITE_FIREBASE_APP_ID || '',
    };
  }

  return null;
};

export const saveFirebaseConfigToStorage = (config: FirebaseClientConfig): void => {
  localStorage.setItem(STORAGE_KEYS.FIREBASE_CONFIG, JSON.stringify(config));
};

export const clearFirebaseConfigFromStorage = (): void => {
  localStorage.removeItem(STORAGE_KEYS.FIREBASE_CONFIG);
};

let app: FirebaseApp | null = null;
let auth: Auth | null = null;
let db: Firestore | null = null;
let storage: FirebaseStorage | null = null;
let isConfiguredLive = false;

export const initFirebase = (customConfig?: FirebaseClientConfig | null) => {
  const config = customConfig || getActiveFirebaseConfig();

  if (!config || !config.apiKey) {
    isConfiguredLive = false;
    return { app: null, auth: null, db: null, storage: null, isLive: false };
  }

  try {
    if (!getApps().length) {
      app = initializeApp(config);
    } else {
      app = getApp();
    }

    auth = getAuth(app);
    db = getFirestore(app);
    storage = getStorage(app);
    isConfiguredLive = true;

    return { app, auth, db, storage, isLive: true };
  } catch (error) {
    console.warn('Firebase initialization failed, falling back to standalone mode:', error);
    isConfiguredLive = false;
    return { app: null, auth: null, db: null, storage: null, isLive: false };
  }
};

const initial = initFirebase();
export { app, auth, db, storage };
export const isFirebaseLive = () => isConfiguredLive;
export const googleAuthProvider = new GoogleAuthProvider();
