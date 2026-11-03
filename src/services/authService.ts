import {
  signInWithPopup,
  signOut as firebaseSignOut,
  onAuthStateChanged,
  User as FirebaseUser,
} from 'firebase/auth';
import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';
import { auth, db, googleAuthProvider } from '../config/firebase';
import { UserProfile, UserRole } from '../types/auth';
import { STORAGE_KEYS } from '../config/constants';

// 管理者メールアドレスのリスト
const ADMIN_EMAILS = [
  'admin@fugulingo.com',
  'manager@fugulingo.com',
  'shuku@fugulingo.com',
  'sumikashuku@gmail.com',
];

const DEFAULT_GUEST_USER: UserProfile = {
  uid: 'guest-staff-001',
  email: null,
  displayName: 'ゲストスタッフ',
  photoURL: null,
  googlePhotoURL: null,
  role: 'staff',
  createdAt: '2026-03-01T00:00:00Z',
  updatedAt: new Date().toISOString(),
};

const DEFAULT_ADMIN_USER: UserProfile = {
  uid: 'demo-admin-001',
  email: 'admin@fugulingo.com',
  displayName: 'ホールマネージャー 高橋（管理者）',
  photoURL: null,
  googlePhotoURL: null,
  role: 'admin',
  createdAt: '2026-01-01T00:00:00Z',
  updatedAt: new Date().toISOString(),
};

export class AuthService {
  static getStoredUser(): UserProfile {
    const local = localStorage.getItem(STORAGE_KEYS.USER_PROFILE);
    if (local) {
      try {
        return JSON.parse(local);
      } catch (e) {
        console.error('Failed to parse local user profile:', e);
      }
    }
    localStorage.setItem(STORAGE_KEYS.USER_PROFILE, JSON.stringify(DEFAULT_GUEST_USER));
    return DEFAULT_GUEST_USER;
  }

  static async determineRole(email: string | null, uid: string): Promise<UserRole> {
    if (email && ADMIN_EMAILS.includes(email.toLowerCase())) {
      return 'admin';
    }

    if (db && uid) {
      try {
        const userDoc = await getDoc(doc(db, 'users', uid));
        if (userDoc.exists()) {
          const data = userDoc.data();
          if (data.role === 'admin' || data.role === 'staff') {
            return data.role;
          }
        }
      } catch (err) {
        console.warn('Firestore role check failed, defaulting to staff:', err);
      }
    }

    return 'staff';
  }

  static async signInWithGoogle(): Promise<UserProfile> {
    if (auth) {
      try {
        const result = await signInWithPopup(auth, googleAuthProvider);
        const user = result.user;
        const role = await this.determineRole(user.email, user.uid);

        // 既存のFirestoreプロフィール（カスタム画像など）があるか確認
        let existingCustomPhoto: string | null = null;
        let existingDisplayName: string | null = null;

        if (db) {
          try {
            const userSnap = await getDoc(doc(db, 'users', user.uid));
            if (userSnap.exists()) {
              const data = userSnap.data();
              existingCustomPhoto = data.photoURL || null;
              existingDisplayName = data.displayName || null;
            }
          } catch (e) {
            console.warn('Error fetching existing user data:', e);
          }
        }

        const profile: UserProfile = {
          uid: user.uid,
          email: user.email,
          displayName: existingDisplayName || user.displayName || 'Googleスタッフ',
          photoURL: existingCustomPhoto || user.photoURL,
          googlePhotoURL: user.photoURL,
          role,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };

        if (db) {
          try {
            await setDoc(doc(db, 'users', user.uid), profile, { merge: true });
          } catch (err) {
            console.warn('Failed to save user in Firestore:', err);
          }
        }

        localStorage.setItem(STORAGE_KEYS.USER_PROFILE, JSON.stringify(profile));
        return profile;
      } catch (error: any) {
        console.warn('Firebase signInWithPopup failed or cancelled:', error);
        if (error.code === 'auth/popup-closed-by-user') {
          throw error;
        }
        // ポップアップがブロックされた、または未設定の場合はローカル設定へフォールバック
      }
    }

    // Firebase未接続環境でのテスト用Googleログイン
    const mockGoogleUser: UserProfile = {
      uid: `google-user-${Date.now()}`,
      email: 'my-google-account@gmail.com',
      displayName: 'Google ログインスタッフ',
      photoURL: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=120&auto=format&fit=crop&q=80',
      googlePhotoURL: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=120&auto=format&fit=crop&q=80',
      role: 'staff',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    localStorage.setItem(STORAGE_KEYS.USER_PROFILE, JSON.stringify(mockGoogleUser));
    return mockGoogleUser;
  }

  static async updateProfileDetails(
    uid: string,
    updates: { displayName?: string; photoURL?: string | null }
  ): Promise<UserProfile> {
    const current = this.getStoredUser();

    const updated: UserProfile = {
      ...current,
      displayName: updates.displayName !== undefined ? updates.displayName : current.displayName,
      photoURL: updates.photoURL !== undefined ? updates.photoURL : current.photoURL,
      updatedAt: new Date().toISOString(),
    };

    localStorage.setItem(STORAGE_KEYS.USER_PROFILE, JSON.stringify(updated));

    if (db && uid) {
      try {
        await updateDoc(doc(db, 'users', uid), {
          ...updates,
          updatedAt: new Date().toISOString(),
        });
      } catch (err) {
        console.warn('Firestore updateDoc failed, falling back to setDoc:', err);
        try {
          await setDoc(doc(db, 'users', uid), updated, { merge: true });
        } catch (e) {
          console.error('Failed to setDoc user:', e);
        }
      }
    }

    return updated;
  }

  static async signOut(): Promise<void> {
    if (auth) {
      try {
        await firebaseSignOut(auth);
      } catch (err) {
        console.warn('Firebase signout error:', err);
      }
    }
    // ゲストスタッフ状態に戻す
    localStorage.setItem(STORAGE_KEYS.USER_PROFILE, JSON.stringify(DEFAULT_GUEST_USER));
  }

  static onAuthStateChange(callback: (user: UserProfile) => void): () => void {
    if (auth) {
      return onAuthStateChanged(auth, async (firebaseUser: FirebaseUser | null) => {
        if (firebaseUser) {
          const role = await this.determineRole(firebaseUser.email, firebaseUser.uid);
          let currentCustomPhoto: string | null = null;
          let currentDisplayName: string | null = null;

          if (db) {
            try {
              const docSnap = await getDoc(doc(db, 'users', firebaseUser.uid));
              if (docSnap.exists()) {
                const data = docSnap.data();
                currentCustomPhoto = data.photoURL || null;
                currentDisplayName = data.displayName || null;
              }
            } catch (e) {
              console.warn('Error reading user on auth state change:', e);
            }
          }

          const profile: UserProfile = {
            uid: firebaseUser.uid,
            email: firebaseUser.email,
            displayName: currentDisplayName || firebaseUser.displayName || 'スタッフ',
            photoURL: currentCustomPhoto || firebaseUser.photoURL,
            googlePhotoURL: firebaseUser.photoURL,
            role,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          };
          localStorage.setItem(STORAGE_KEYS.USER_PROFILE, JSON.stringify(profile));
          callback(profile);
        } else {
          callback(this.getStoredUser());
        }
      });
    }

    return () => {};
  }

  static setUserRole(role: UserRole): UserProfile {
    const current = this.getStoredUser();
    const name = current.displayName || 'スタッフ';
    const updated: UserProfile = {
      ...current,
      role,
      displayName:
        role === 'admin'
          ? (name.includes('管理者') ? name : `${name}（管理者）`)
          : name.replace('（管理者）', ''),
      updatedAt: new Date().toISOString(),
    };
    localStorage.setItem(STORAGE_KEYS.USER_PROFILE, JSON.stringify(updated));
    return updated;
  }

  static toggleDemoRole(): UserProfile {
    const current = this.getStoredUser();
    const nextUser = current.role === 'admin' ? DEFAULT_GUEST_USER : DEFAULT_ADMIN_USER;
    localStorage.setItem(STORAGE_KEYS.USER_PROFILE, JSON.stringify(nextUser));
    return nextUser;
  }
}
