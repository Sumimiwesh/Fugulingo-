export interface DailyStudyRecord {
  date: string; // YYYY-MM-DD
  questionsAnswered: number;
  correctAnswers: number;
  stepsCompleted: number;
  minutesSpent: number;
}

export interface StreakInfo {
  currentStreak: number;
  longestStreak: number;
  lastStudiedDate: string | null; // YYYY-MM-DD
  totalDaysStudied: number;
  totalQuestionsSolved: number;
  studyRecords: Record<string, DailyStudyRecord>; // key: YYYY-MM-DD
}
