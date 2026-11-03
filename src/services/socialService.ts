import { CommunityUserRank, ActivityFeedItem } from '../types/social';
import { UserProfile } from '../types/auth';
import { StreakInfo } from '../types/streak';
import { Certificate } from '../types/certificate';

const MOCK_COMMUNITY_MEMBERS: CommunityUserRank[] = [
  {
    uid: 'staff-sato',
    displayName: '佐藤 リーダー',
    photoURL: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80',
    role: 'staff',
    streakDays: 14,
    totalQuestions: 68,
    certificatesCount: 3,
    rank: 1,
  },
  {
    uid: 'staff-tanaka',
    displayName: '田中 健太',
    photoURL: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&auto=format&fit=crop&q=80',
    role: 'staff',
    streakDays: 9,
    totalQuestions: 44,
    certificatesCount: 2,
    rank: 2,
  },
  {
    uid: 'staff-yuka',
    displayName: '小林 ゆうか',
    photoURL: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=120&auto=format&fit=crop&q=80',
    role: 'staff',
    streakDays: 6,
    totalQuestions: 32,
    certificatesCount: 1,
    rank: 3,
  },
  {
    uid: 'staff-watanabe',
    displayName: '渡辺 蓮',
    photoURL: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=120&auto=format&fit=crop&q=80',
    role: 'staff',
    streakDays: 4,
    totalQuestions: 22,
    certificatesCount: 1,
    rank: 4,
  },
  {
    uid: 'admin-takahashi',
    displayName: '高橋 店長',
    photoURL: null,
    role: 'admin',
    streakDays: 21,
    totalQuestions: 95,
    certificatesCount: 3,
    rank: 0, // 管理者
  }
];

const INITIAL_ACTIVITIES: ActivityFeedItem[] = [
  {
    id: 'act-1',
    userId: 'staff-sato',
    userName: '佐藤 リーダー',
    userPhotoURL: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80',
    type: 'certificate',
    title: '第3章「トラブル・クレーム一次対応」修了！',
    detail: '確認テストに一発合格し、デジタル修了証を獲得しました 🎉',
    timestamp: new Date(Date.now() - 1000 * 60 * 25).toISOString(), // 25分前
    likesCount: 5,
    likedByMe: false,
  },
  {
    id: 'act-2',
    userId: 'staff-tanaka',
    userName: '田中 健太',
    userPhotoURL: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&auto=format&fit=crop&q=80',
    type: 'streak',
    title: '連続学習 9日目を達成！ 🔥',
    detail: '毎日コツコツ継続中！店舗の接客マナーをマスターしています。',
    timestamp: new Date(Date.now() - 1000 * 60 * 120).toISOString(), // 2時間前
    likesCount: 8,
    likedByMe: true,
  },
  {
    id: 'act-3',
    userId: 'staff-yuka',
    userName: '小林 ゆうか',
    userPhotoURL: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=120&auto=format&fit=crop&q=80',
    type: 'perfect_score',
    title: '第1章 確認テストで満点スコアを達成 ⭐',
    detail: '「お出迎えとご案内」の全問正解を果たしました！',
    timestamp: new Date(Date.now() - 1000 * 60 * 360).toISOString(), // 6時間前
    likesCount: 12,
    likedByMe: false,
  }
];

export class SocialService {
  private static LOCAL_ACTIVITIES_KEY = 'fugulingo_community_activities';
  private static LOCAL_LIKES_KEY = 'fugulingo_liked_activities';

  static getLeaderboard(
    currentUser: UserProfile,
    currentStreak: StreakInfo,
    currentCerts: Certificate[]
  ): CommunityUserRank[] {
    // 現在のユーザーをリストにマージ
    const currentUserEntry: CommunityUserRank = {
      uid: currentUser.uid,
      displayName: currentUser.displayName || 'あなた',
      photoURL: currentUser.photoURL,
      role: currentUser.role,
      streakDays: currentStreak.currentStreak,
      totalQuestions: currentStreak.totalQuestionsSolved,
      certificatesCount: currentCerts.length,
      rank: 1,
      isCurrentUser: true,
    };

    // 他のメンバーから自分以外のものを除外してマージ
    const members = MOCK_COMMUNITY_MEMBERS.filter((m) => m.uid !== currentUser.uid);
    members.push(currentUserEntry);

    // ストリーク日数順でソート（同じ場合は回答数順）
    members.sort((a, b) => {
      if (b.streakDays !== a.streakDays) {
        return b.streakDays - a.streakDays;
      }
      return b.totalQuestions - a.totalQuestions;
    });

    // 順位付け
    return members.map((m, index) => ({
      ...m,
      rank: index + 1,
    }));
  }

  static getActivities(): ActivityFeedItem[] {
    const stored = localStorage.getItem(this.LOCAL_ACTIVITIES_KEY);
    const likedIds: string[] = JSON.parse(
      localStorage.getItem(this.LOCAL_LIKES_KEY) || '[]'
    );

    let list = stored ? JSON.parse(stored) : INITIAL_ACTIVITIES;

    return list.map((item: ActivityFeedItem) => ({
      ...item,
      likedByMe: likedIds.includes(item.id),
    }));
  }

  static toggleLike(activityId: string): ActivityFeedItem[] {
    const activities = this.getActivities();
    const likedIds: string[] = JSON.parse(
      localStorage.getItem(this.LOCAL_LIKES_KEY) || '[]'
    );

    const isAlreadyLiked = likedIds.includes(activityId);
    let updatedLikedIds: string[];

    if (isAlreadyLiked) {
      updatedLikedIds = likedIds.filter((id) => id !== activityId);
    } else {
      updatedLikedIds = [...likedIds, activityId];
    }

    localStorage.setItem(this.LOCAL_LIKES_KEY, JSON.stringify(updatedLikedIds));

    const updatedActivities = activities.map((act) => {
      if (act.id === activityId) {
        return {
          ...act,
          likesCount: act.likesCount + (isAlreadyLiked ? -1 : 1),
          likedByMe: !isAlreadyLiked,
        };
      }
      return act;
    });

    localStorage.setItem(this.LOCAL_ACTIVITIES_KEY, JSON.stringify(updatedActivities));
    return updatedActivities;
  }

  static addActivity(
    user: UserProfile,
    type: ActivityFeedItem['type'],
    title: string,
    detail: string
  ): void {
    const activities = this.getActivities();
    const newActivity: ActivityFeedItem = {
      id: `act-${Date.now()}`,
      userId: user.uid,
      userName: user.displayName || 'スタッフ',
      userPhotoURL: user.photoURL,
      type,
      title,
      detail,
      timestamp: new Date().toISOString(),
      likesCount: 1, // 初期いいね
      likedByMe: false,
    };

    const nextList = [newActivity, ...activities.slice(0, 19)]; // 最大20件
    localStorage.setItem(this.LOCAL_ACTIVITIES_KEY, JSON.stringify(nextList));
  }
}
