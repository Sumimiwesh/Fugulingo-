import {
  doc,
  setDoc,
  getDoc,
  collection,
  getDocs,
  updateDoc,
} from 'firebase/firestore';
import { db } from '../config/firebase';
import { STORAGE_KEYS } from '../config/constants';
import { HallManual, ManualVersion } from '../types/manual';
import { QuizSection, UserProgressState, QuizQuestion } from '../types/quiz';
import { StreakInfo, DailyStudyRecord } from '../types/streak';
import { Certificate } from '../types/certificate';
import { INITIAL_MANUALS, INITIAL_SECTIONS } from '../data/initialHallManuals';

// ===== 初期状態ジェネレータ =====
export const getInitialProgressState = (sections: QuizSection[]): UserProgressState => {
  const firstSection = sections[0];
  const firstStep = firstSection?.steps[0];
  const activeStepId = firstStep?.id || 'step-1-1';

  return {
    completedStepIds: [],
    activeStepId,
    unlockedStepIds: [activeStepId],
    stepProgress: {},
    completedSectionIds: [],
  };
};

export const getInitialStreakInfo = (): StreakInfo => {
  return {
    currentStreak: 1, // 初期デモ用で本日の利用開始を表示
    longestStreak: 1,
    lastStudiedDate: new Date().toISOString().split('T')[0],
    totalDaysStudied: 1,
    totalQuestionsSolved: 0,
    studyRecords: {},
  };
};

// ===== リポジトリクラス (疎結合・プラットフォーム非依存) =====
export class DataService {
  // --- マニュアル関連 ---
  static async getManuals(): Promise<HallManual[]> {
    if (db) {
      try {
        const querySnapshot = await getDocs(collection(db, 'manuals'));
        if (!querySnapshot.empty) {
          const list: HallManual[] = [];
          querySnapshot.forEach((d) => list.push(d.data() as HallManual));
          return list;
        }
      } catch (err) {
        console.warn('Firestore getManuals fallback to local:', err);
      }
    }

    const localData = localStorage.getItem(STORAGE_KEYS.MANUALS);
    if (localData) {
      try {
        const parsed: HallManual[] = JSON.parse(localData);
        // 新しいマニュアル構成（manual-brand-course）を含んでいるか確認
        if (parsed.some((m) => m.id === 'manual-brand-course')) {
          return parsed;
        }
      } catch (e) {
        console.error('Failed to parse local manuals:', e);
      }
    }

    // 初期マニュアルを保存して返却
    localStorage.setItem(STORAGE_KEYS.MANUALS, JSON.stringify(INITIAL_MANUALS));
    return INITIAL_MANUALS;
  }

  static async saveManual(manual: HallManual): Promise<void> {
    const manuals = await this.getManuals();
    const index = manuals.findIndex((m) => m.id === manual.id);
    if (index >= 0) {
      manuals[index] = manual;
    } else {
      manuals.push(manual);
    }

    localStorage.setItem(STORAGE_KEYS.MANUALS, JSON.stringify(manuals));

    if (db) {
      try {
        await setDoc(doc(db, 'manuals', manual.id), manual);
      } catch (err) {
        console.warn('Firestore saveManual error:', err);
      }
    }
  }

  // マニュアルの版管理（新バージョン追加 & 旧バージョンアーカイブ）
  static async addManualVersion(
    manualId: string,
    newVersion: ManualVersion
  ): Promise<HallManual> {
    const manuals = await this.getManuals();
    const manual = manuals.find((m) => m.id === manualId);
    if (!manual) throw new Error(`Manual not found: ${manualId}`);

    // 既存のactiveバージョンをすべてarchivedに変更
    manual.versions = manual.versions.map((v) => ({
      ...v,
      status: 'archived' as const,
    }));

    // 新バージョンを追加し、カレントに設定
    newVersion.status = 'active';
    manual.versions.unshift(newVersion);
    manual.currentVersionId = newVersion.id;
    manual.updatedAt = new Date().toISOString();

    await this.saveManual(manual);
    return manual;
  }

  // 旧バージョンの復元（アクティブ化）
  static async restoreManualVersion(
    manualId: string,
    versionId: string
  ): Promise<HallManual> {
    const manuals = await this.getManuals();
    const manual = manuals.find((m) => m.id === manualId);
    if (!manual) throw new Error(`Manual not found: ${manualId}`);

    manual.versions = manual.versions.map((v) => {
      if (v.id === versionId) {
        return { ...v, status: 'active' as const };
      }
      return { ...v, status: 'archived' as const };
    });

    manual.currentVersionId = versionId;
    manual.updatedAt = new Date().toISOString();

    await this.saveManual(manual);
    return manual;
  }

  // --- クイズセクション関連 ---
  static async getSections(): Promise<QuizSection[]> {
    if (db) {
      try {
        const querySnapshot = await getDocs(collection(db, 'sections'));
        if (!querySnapshot.empty) {
          const list: QuizSection[] = [];
          querySnapshot.forEach((d) => list.push(d.data() as QuizSection));
          return list.sort((a, b) => a.order - b.order);
        }
      } catch (err) {
        console.warn('Firestore getSections fallback to local:', err);
      }
    }

    const localData = localStorage.getItem(STORAGE_KEYS.SECTIONS);
    if (localData) {
      try {
        const parsed: QuizSection[] = JSON.parse(localData);
        if (parsed.some((s) => s.manualId === 'manual-brand-course')) {
          return parsed;
        }
      } catch (e) {
        console.error('Failed to parse local sections:', e);
      }
    }

    localStorage.setItem(STORAGE_KEYS.SECTIONS, JSON.stringify(INITIAL_SECTIONS));
    return INITIAL_SECTIONS;
  }

  static async saveSections(sections: QuizSection[]): Promise<void> {
    localStorage.setItem(STORAGE_KEYS.SECTIONS, JSON.stringify(sections));

    if (db) {
      try {
        for (const sec of sections) {
          await setDoc(doc(db, 'sections', sec.id), sec);
        }
      } catch (err) {
        console.warn('Firestore saveSections error:', err);
      }
    }
  }

  // 新規問題の公開・追加
  static async publishQuestionToStep(
    sectionId: string,
    stepId: string,
    question: QuizQuestion
  ): Promise<QuizSection[]> {
    const sections = await this.getSections();
    const section = sections.find((s) => s.id === sectionId);
    if (!section) throw new Error(`Section not found: ${sectionId}`);

    const step = section.steps.find((st) => st.id === stepId);
    if (!step) throw new Error(`Step not found: ${stepId}`);

    question.status = 'published';
    question.updatedAt = new Date().toISOString();

    const existingIndex = step.questions.findIndex((q) => q.id === question.id);
    if (existingIndex >= 0) {
      step.questions[existingIndex] = question;
    } else {
      step.questions.push(question);
    }

    await this.saveSections(sections);
    return sections;
  }

  // --- 学習進捗関連 ---
  static async getProgress(userId: string): Promise<UserProgressState> {
    const sections = await this.getSections();
    const defaultState = getInitialProgressState(sections);

    if (db && userId) {
      try {
        const snap = await getDoc(doc(db, 'userProgress', userId));
        if (snap.exists()) {
          return snap.data() as UserProgressState;
        }
      } catch (err) {
        console.warn('Firestore getProgress fallback to local:', err);
      }
    }

    const localData = localStorage.getItem(`${STORAGE_KEYS.PROGRESS_STATE}_${userId}`);
    if (localData) {
      try {
        return JSON.parse(localData);
      } catch (e) {
        console.error('Failed to parse local progress:', e);
      }
    }

    return defaultState;
  }

  static async saveProgress(
    userId: string,
    progress: UserProgressState
  ): Promise<void> {
    localStorage.setItem(
      `${STORAGE_KEYS.PROGRESS_STATE}_${userId}`,
      JSON.stringify(progress)
    );

    if (db && userId) {
      try {
        await setDoc(doc(db, 'userProgress', userId), progress);
      } catch (err) {
        console.warn('Firestore saveProgress error:', err);
      }
    }
  }

  // --- ストリーク・カレンダー記録関連 ---
  static async getStreakInfo(userId: string): Promise<StreakInfo> {
    const defaultStreak = getInitialStreakInfo();

    if (db && userId) {
      try {
        const snap = await getDoc(doc(db, 'userStreaks', userId));
        if (snap.exists()) {
          return snap.data() as StreakInfo;
        }
      } catch (err) {
        console.warn('Firestore getStreakInfo fallback to local:', err);
      }
    }

    const localData = localStorage.getItem(`${STORAGE_KEYS.STREAK_INFO}_${userId}`);
    if (localData) {
      try {
        return JSON.parse(localData);
      } catch (e) {
        console.error('Failed to parse local streak:', e);
      }
    }

    return defaultStreak;
  }

  static async recordStudySession(
    userId: string,
    result: { questionsAnswered: number; correctCount: number; isStepCompleted: boolean }
  ): Promise<StreakInfo> {
    const streakInfo = await this.getStreakInfo(userId);
    const today = new Date().toISOString().split('T')[0];

    const todayRecord: DailyStudyRecord = streakInfo.studyRecords[today] || {
      date: today,
      questionsAnswered: 0,
      correctAnswers: 0,
      stepsCompleted: 0,
      minutesSpent: 0,
    };

    todayRecord.questionsAnswered += result.questionsAnswered;
    todayRecord.correctAnswers += result.correctCount;
    if (result.isStepCompleted) {
      todayRecord.stepsCompleted += 1;
    }
    todayRecord.minutesSpent += 3; // クイズ1回約3分換算

    streakInfo.studyRecords[today] = todayRecord;
    streakInfo.totalQuestionsSolved += result.questionsAnswered;

    // ストリーク日数の計算
    if (streakInfo.lastStudiedDate !== today) {
      const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];
      if (streakInfo.lastStudiedDate === yesterday) {
        streakInfo.currentStreak += 1;
      } else if (!streakInfo.lastStudiedDate) {
        streakInfo.currentStreak = 1;
      } else {
        streakInfo.currentStreak = 1;
      }

      streakInfo.totalDaysStudied += 1;
      streakInfo.lastStudiedDate = today;

      if (streakInfo.currentStreak > streakInfo.longestStreak) {
        streakInfo.longestStreak = streakInfo.currentStreak;
      }
    }

    localStorage.setItem(
      `${STORAGE_KEYS.STREAK_INFO}_${userId}`,
      JSON.stringify(streakInfo)
    );

    if (db && userId) {
      try {
        await setDoc(doc(db, 'userStreaks', userId), streakInfo);
      } catch (err) {
        console.warn('Firestore recordStudySession error:', err);
      }
    }

    return streakInfo;
  }

  // --- デジタル修了証関連 ---
  static async getCertificates(userId: string): Promise<Certificate[]> {
    if (db && userId) {
      try {
        const querySnapshot = await getDocs(collection(db, `users/${userId}/certificates`));
        if (!querySnapshot.empty) {
          const list: Certificate[] = [];
          querySnapshot.forEach((d) => list.push(d.data() as Certificate));
          return list;
        }
      } catch (err) {
        console.warn('Firestore getCertificates fallback to local:', err);
      }
    }

    const localData = localStorage.getItem(`${STORAGE_KEYS.CERTIFICATES}_${userId}`);
    if (localData) {
      try {
        return JSON.parse(localData);
      } catch (e) {
        console.error('Failed to parse local certificates:', e);
      }
    }

    return [];
  }

  static async issueCertificate(
    userId: string,
    certData: Omit<Certificate, 'id' | 'certificateNumber' | 'issuedAt'>
  ): Promise<Certificate> {
    const certs = await this.getCertificates(userId);

    // 既に同一セクションの修了証があるかチェック
    const existing = certs.find((c) => c.sectionId === certData.sectionId);
    if (existing) {
      return existing;
    }

    const issueDate = new Date();
    const certNumber = `FUGU-${issueDate.getFullYear()}-${Math.floor(
      1000 + Math.random() * 9000
    )}`;

    const newCert: Certificate = {
      ...certData,
      id: `cert-${Date.now()}`,
      certificateNumber: certNumber,
      issuedAt: issueDate.toISOString(),
    };

    certs.push(newCert);
    localStorage.setItem(`${STORAGE_KEYS.CERTIFICATES}_${userId}`, JSON.stringify(certs));

    if (db && userId) {
      try {
        await setDoc(doc(db, `users/${userId}/certificates`, newCert.id), newCert);
      } catch (err) {
        console.warn('Firestore issueCertificate error:', err);
      }
    }

    return newCert;
  }
}
