import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { UserProfile, UserRole } from '../types/auth';
import { QuizSection, QuizStep, UserProgressState, QuizQuestion } from '../types/quiz';
import { HallManual, ManualVersion } from '../types/manual';
import { StreakInfo } from '../types/streak';
import { Certificate } from '../types/certificate';
import { CommunityUserRank, ActivityFeedItem } from '../types/social';
import { DataService, getInitialProgressState, getInitialStreakInfo } from '../services/dataService';
import { AuthService } from '../services/authService';
import { SocialService } from '../services/socialService';
import { STORAGE_KEYS } from '../config/constants';
import confetti from 'canvas-confetti';

export type AppNavTab = 'home' | 'community' | 'certificates' | 'settings' | 'admin';

interface AppContextType {
  user: UserProfile;
  setUserRole: (role: UserRole) => void;
  toggleRole: () => void;
  activeTab: AppNavTab;
  setActiveTab: (tab: AppNavTab) => void;

  // 認証関連
  loginWithGoogle: (role?: UserRole) => Promise<void>;
  startAsGuest: (role: UserRole) => void;
  logout: () => Promise<void>;
  isLoginModalOpen: boolean;
  setIsLoginModalOpen: (open: boolean) => void;
  isProfileEditOpen: boolean;
  setIsProfileEditOpen: (open: boolean) => void;
  updateProfile: (updates: { displayName?: string; photoURL?: string | null }) => Promise<void>;

  // データ一覧
  sections: QuizSection[];
  manuals: HallManual[];
  progress: UserProgressState;
  streak: StreakInfo;
  certificates: Certificate[];
  isLoading: boolean;

  // 仲間・ランキング関連
  leaderboard: CommunityUserRank[];
  activities: ActivityFeedItem[];
  toggleLikeActivity: (id: string) => void;

  // クイズモーダル制御
  activeQuizStep: QuizStep | null;
  startQuiz: (step: QuizStep) => void;
  closeQuiz: () => void;
  completeQuizStep: (stepId: string, score: number, total: number) => Promise<boolean>;

  // カレンダーモーダル制御
  isCalendarOpen: boolean;
  setIsCalendarOpen: (open: boolean) => void;

  // 修了証モーダル制御
  currentCertificate: Certificate | null;
  openCertificateModal: (cert: Certificate) => void;
  closeCertificateModal: () => void;

  // 管理者操作
  saveManual: (manual: HallManual) => Promise<void>;
  addManualVersion: (manualId: string, version: ManualVersion) => Promise<void>;
  restoreManualVersion: (manualId: string, versionId: string) => Promise<void>;
  publishQuestion: (sectionId: string, stepId: string, question: QuizQuestion) => Promise<void>;

  // リフレッシュ
  reloadAllData: () => Promise<void>;
  resetProgress: () => Promise<void>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile>(AuthService.getStoredUser());
  const [activeTab, setActiveTab] = useState<AppNavTab>('home');
  const [sections, setSections] = useState<QuizSection[]>([]);
  const [manuals, setManuals] = useState<HallManual[]>([]);
  const [progress, setProgress] = useState<UserProgressState>(getInitialProgressState([]));
  const [streak, setStreak] = useState<StreakInfo>(getInitialStreakInfo());
  const [certificates, setCertificates] = useState<Certificate[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // ソーシャル
  const [activities, setActivities] = useState<ActivityFeedItem[]>([]);

  // モーダル
  const [activeQuizStep, setActiveQuizStep] = useState<QuizStep | null>(null);
  const [isCalendarOpen, setIsCalendarOpen] = useState<boolean>(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState<boolean>(false);
  const [isProfileEditOpen, setIsProfileEditOpen] = useState<boolean>(false);
  const [currentCertificate, setCurrentCertificate] = useState<Certificate | null>(null);

  // 認証状態の監視
  useEffect(() => {
    const unsubscribe = AuthService.onAuthStateChange((currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  // 初回訪問時または役割未選択時に「アルバイトですか？管理者ですか？」モーダルを案内
  useEffect(() => {
    const hasChosen = localStorage.getItem('fugulingo_initial_role_selected');
    const storedUser = localStorage.getItem(STORAGE_KEYS.USER_PROFILE);
    if (!hasChosen && !storedUser) {
      setIsLoginModalOpen(true);
    }
  }, []);

  const loadData = async () => {
    setIsLoading(true);
    try {
      const [fetchedManuals, fetchedSections] = await Promise.all([
        DataService.getManuals(),
        DataService.getSections(),
      ]);

      setManuals(fetchedManuals);
      setSections(fetchedSections);

      const [fetchedProgress, fetchedStreak, fetchedCerts] = await Promise.all([
        DataService.getProgress(user.uid),
        DataService.getStreakInfo(user.uid),
        DataService.getCertificates(user.uid),
      ]);

      setProgress(fetchedProgress);
      setStreak(fetchedStreak);
      setCertificates(fetchedCerts);
      setActivities(SocialService.getActivities());
    } catch (error) {
      console.error('Failed to load app data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [user.uid]);

  // Googleログイン
  const loginWithGoogle = async (role?: UserRole) => {
    try {
      localStorage.setItem('fugulingo_initial_role_selected', 'true');
      const loggedInUser = await AuthService.signInWithGoogle(role);
      setUser(loggedInUser);
      setIsLoginModalOpen(false);
      if (loggedInUser.role === 'admin') {
        setActiveTab('admin');
      } else {
        setActiveTab('home');
      }

      // ログイン成功のお祝い紙吹雪
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.5 },
      });
    } catch (error) {
      console.error('Login error:', error);
    }
  };

  const startAsGuest = (role: UserRole) => {
    localStorage.setItem('fugulingo_initial_role_selected', 'true');
    const guest = AuthService.startAsGuest(role);
    setUser(guest);
    setIsLoginModalOpen(false);
    if (role === 'admin') {
      setActiveTab('admin');
    } else {
      setActiveTab('home');
    }
  };

  const logout = async () => {
    await AuthService.signOut();
    const guest = AuthService.getStoredUser();
    setUser(guest);
  };

  // プロフィール更新（画像、表示名）
  const updateProfile = async (updates: {
    displayName?: string;
    photoURL?: string | null;
  }) => {
    const updatedUser = await AuthService.updateProfileDetails(user.uid, updates);
    setUser(updatedUser);
  };

  const setUserRole = (role: UserRole) => {
    const updated = AuthService.setUserRole(role);
    setUser(updated);
    if (role === 'staff' && activeTab === 'admin') {
      setActiveTab('home');
    }
  };

  const toggleRole = () => {
    const updated = AuthService.toggleDemoRole();
    setUser(updated);
    if (updated.role === 'staff' && activeTab === 'admin') {
      setActiveTab('home');
    }
  };

  // ソーシャル拍手
  const toggleLikeActivity = (id: string) => {
    const updated = SocialService.toggleLike(id);
    setActivities(updated);
  };

  const startQuiz = (step: QuizStep) => {
    setActiveQuizStep(step);
  };

  const closeQuiz = () => {
    setActiveQuizStep(null);
  };

  const completeQuizStep = async (
    stepId: string,
    score: number,
    total: number
  ): Promise<boolean> => {
    const passingRatio = score / total;
    const isPassed = passingRatio >= 0.8; // 80%以上で合格

    // 1. ストリーク＆日々の学習ログを記録
    const updatedStreak = await DataService.recordStudySession(user.uid, {
      questionsAnswered: total,
      correctCount: score,
      isStepCompleted: isPassed,
    });
    setStreak(updatedStreak);

    if (isPassed) {
      // 紙吹雪エフェクト
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#AFDFE4', '#58cc02', '#FFD700', '#FF8000'],
      });

      // 2. 進捗更新
      const newCompleted = Array.from(new Set([...progress.completedStepIds, stepId]));

      // 現在のステップを見つける
      let nextStepId: string | null = null;
      let targetSection: QuizSection | null = null;
      let currentStep: QuizStep | null = null;

      for (const sec of sections) {
        const stepIdx = sec.steps.findIndex((s) => s.id === stepId);
        if (stepIdx >= 0) {
          targetSection = sec;
          currentStep = sec.steps[stepIdx];
          if (stepIdx + 1 < sec.steps.length) {
            nextStepId = sec.steps[stepIdx + 1].id;
          }
          break;
        }
      }

      // 次のステップがなければ、次のセクションの最初のステップへ
      if (!nextStepId && targetSection) {
        const currentSecIndex = sections.findIndex((s) => s.id === targetSection?.id);
        if (currentSecIndex + 1 < sections.length) {
          nextStepId = sections[currentSecIndex + 1].steps[0]?.id || null;
        }
      }

      const newUnlocked = nextStepId
        ? Array.from(new Set([...progress.unlockedStepIds, nextStepId]))
        : progress.unlockedStepIds;

      // 仲間のタイムラインにアクティビティを自動投稿
      if (currentStep) {
        SocialService.addActivity(
          user,
          score === total ? 'perfect_score' : 'lesson_complete',
          `${currentStep.title} をクリア！`,
          score === total
            ? `全問満点（${score}/${total}問）で合格しました！⭐`
            : `確認テストに合格しました（${score}/${total}問正解）`
        );
        setActivities(SocialService.getActivities());
      }

      // セクション全問クリア判定（修了証発行）
      let newCompletedSections = [...progress.completedSectionIds];
      if (targetSection) {
        const allStepsInSecCompleted = targetSection.steps.every(
          (st) => st.id === stepId || newCompleted.includes(st.id)
        );

        if (allStepsInSecCompleted && !newCompletedSections.includes(targetSection.id)) {
          newCompletedSections.push(targetSection.id);

          // デジタル修了証の発行
          const cert = await DataService.issueCertificate(user.uid, {
            userId: user.uid,
            userName: user.displayName || 'スタッフ',
            sectionId: targetSection.id,
            sectionTitle: targetSection.title,
            scorePercent: Math.round(passingRatio * 100),
            totalStepsCompleted: targetSection.steps.length,
            badgeType: 'gold',
            signatureName: 'Fugulingo 検定委員会',
            signatureTitle: 'ホールサービス認定マスター',
          });

          setCertificates((prev) => [...prev.filter((c) => c.id !== cert.id), cert]);
          setCurrentCertificate(cert);

          // 修了証獲得のタイムライン投稿
          SocialService.addActivity(
            user,
            'certificate',
            `${targetSection.title} 修了証を獲得！🎉`,
            `全ステップを修了し、店舗公認のデジタル修了証が授与されました！`
          );
          setActivities(SocialService.getActivities());
        }
      }

      const updatedProgress: UserProgressState = {
        ...progress,
        completedStepIds: newCompleted,
        unlockedStepIds: newUnlocked,
        activeStepId: nextStepId || stepId,
        completedSectionIds: newCompletedSections,
        stepProgress: {
          ...progress.stepProgress,
          [stepId]: {
            stepId,
            completed: true,
            score,
            totalQuestions: total,
            completedAt: new Date().toISOString(),
            attempts: (progress.stepProgress[stepId]?.attempts || 0) + 1,
          },
        },
      };

      setProgress(updatedProgress);
      await DataService.saveProgress(user.uid, updatedProgress);
      return true;
    }

    return false;
  };

  const openCertificateModal = (cert: Certificate) => {
    setCurrentCertificate(cert);
  };

  const closeCertificateModal = () => {
    setCurrentCertificate(null);
  };

  // 管理者操作
  const saveManual = async (manual: HallManual) => {
    await DataService.saveManual(manual);
    const updated = await DataService.getManuals();
    setManuals(updated);
  };

  const addManualVersion = async (manualId: string, version: ManualVersion) => {
    await DataService.addManualVersion(manualId, version);
    const updated = await DataService.getManuals();
    setManuals(updated);
  };

  const restoreManualVersion = async (manualId: string, versionId: string) => {
    await DataService.restoreManualVersion(manualId, versionId);
    const updated = await DataService.getManuals();
    setManuals(updated);
  };

  const publishQuestion = async (
    sectionId: string,
    stepId: string,
    question: QuizQuestion
  ) => {
    const updatedSections = await DataService.publishQuestionToStep(
      sectionId,
      stepId,
      question
    );
    setSections(updatedSections);
  };

  const reloadAllData = async () => {
    await loadData();
  };

  const resetProgress = async () => {
    const initial = getInitialProgressState(sections);
    const initialStreak = getInitialStreakInfo();
    setProgress(initial);
    setStreak(initialStreak);
    setCertificates([]);
    await DataService.saveProgress(user.uid, initial);
    localStorage.removeItem(`${STORAGE_KEYS.STREAK_INFO}_${user.uid}`);
    localStorage.removeItem(`${STORAGE_KEYS.CERTIFICATES}_${user.uid}`);
  };

  const leaderboard = SocialService.getLeaderboard(user, streak, certificates);

  return (
    <AppContext.Provider
      value={{
        user,
        setUserRole,
        toggleRole,
        activeTab,
        setActiveTab,
        loginWithGoogle,
        startAsGuest,
        logout,
        isLoginModalOpen,
        setIsLoginModalOpen,
        isProfileEditOpen,
        setIsProfileEditOpen,
        updateProfile,
        sections,
        manuals,
        progress,
        streak,
        certificates,
        leaderboard,
        activities,
        toggleLikeActivity,
        isLoading,
        activeQuizStep,
        startQuiz,
        closeQuiz,
        completeQuizStep,
        isCalendarOpen,
        setIsCalendarOpen,
        currentCertificate,
        openCertificateModal,
        closeCertificateModal,
        saveManual,
        addManualVersion,
        restoreManualVersion,
        publishQuestion,
        reloadAllData,
        resetProgress,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
