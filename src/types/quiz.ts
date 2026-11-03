export interface QuizOption {
  id: string; // e.g. "A", "B", "C", "D"
  text: string;
}

export interface QuizQuestion {
  id: string;
  sectionId: string;
  stepId: string;
  situation: string; // 状況説明（例：「満席時に予約のないお客様が3名来店された場合」）
  question: string;  // 問いかけ（例：「最も適切な一次対応はどれでしょうか？」）
  options: [QuizOption, QuizOption, QuizOption, QuizOption]; // 4択厳守
  correctOptionId: string; // "A" | "B" | "C" | "D"
  trapExplanation?: string; // ひっかけポイントの解説
  explanation: string; // 正解の理由・解説
  mindsetFeedback: string; // 求められる接客マインド・スキルのフィードバック
  status?: 'draft' | 'approved' | 'published'; // 管理者承認フロー
  createdAt?: string;
  updatedAt?: string;
}

export type StepType = 'lesson' | 'checkpoint' | 'review';

export interface QuizStep {
  id: string;
  sectionId: string;
  stepNumber: number; // 1, 2, 3...
  title: string;
  description: string;
  type: StepType;
  questions: QuizQuestion[];
  passingScorePercent: number; // e.g. 80%
}

export interface QuizSection {
  id: string;
  manualId: string; // 紐づくマニュアルID
  manualVersionId: string; // 紐づくマニュアルバージョンID
  order: number;
  title: string;
  subtitle: string;
  iconName: string; // Lucide icon identifier
  steps: QuizStep[];
}

export interface UserStepProgress {
  stepId: string;
  completed: boolean;
  score: number;
  totalQuestions: number;
  completedAt?: string;
  attempts: number;
}

export interface UserProgressState {
  completedStepIds: string[];
  activeStepId: string;
  unlockedStepIds: string[];
  stepProgress: Record<string, UserStepProgress>;
  completedSectionIds: string[];
}
