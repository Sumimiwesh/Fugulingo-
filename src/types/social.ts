export interface CommunityUserRank {
  uid: string;
  displayName: string;
  photoURL: string | null;
  role: 'staff' | 'admin';
  streakDays: number;
  totalQuestions: number;
  certificatesCount: number;
  rank: number;
  isCurrentUser?: boolean;
}

export interface ActivityFeedItem {
  id: string;
  userId: string;
  userName: string;
  userPhotoURL: string | null;
  type: 'streak' | 'certificate' | 'perfect_score' | 'lesson_complete';
  title: string;
  detail: string;
  timestamp: string; // ISO string
  likesCount: number;
  likedByMe?: boolean;
}
