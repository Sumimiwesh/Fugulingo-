export type UserRole = 'staff' | 'admin';

export interface UserProfile {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
  googlePhotoURL?: string | null; // Googleアカウント登録時の元画像
  role: UserRole;
  createdAt: string;
  updatedAt: string;
}
