import React from 'react';
import { useApp } from '../../context/AppContext';
import { QuizSection, QuizStep } from '../../types/quiz';
import {
  Check,
  Lock,
  Star,
  Award,
  Sparkles,
  BookOpen,
  DoorOpen,
  Utensils,
  ShieldAlert,
  ChevronRight,
} from 'lucide-react';

const ICON_MAP: Record<string, React.ElementType> = {
  DoorOpen,
  Utensils,
  ShieldAlert,
  BookOpen,
};

export const LearningTree: React.FC = () => {
  const { sections, progress, startQuiz, openCertificateModal, certificates } = useApp();

  return (
    <div className="pb-24 pt-3 px-4 max-w-md mx-auto space-y-8">
      {sections.map((section, secIndex) => {
        const SectionIcon = ICON_MAP[section.iconName] || BookOpen;
        const completedStepsCount = section.steps.filter((st) =>
          progress.completedStepIds.includes(st.id)
        ).length;
        const progressPercent = Math.round(
          (completedStepsCount / section.steps.length) * 100
        );
        const isSectionFullyCompleted =
          progress.completedSectionIds.includes(section.id) ||
          completedStepsCount === section.steps.length;

        // このセクションの修了証があるか探す
        const sectionCert = certificates.find((c) => c.sectionId === section.id);

        return (
          <div key={section.id} className="relative">
            {/* セクションヘッダーバナー */}
            <div className="bg-white rounded-2xl border border-stone-200/90 shadow-xs p-4 mb-6 transition-all hover:shadow-sm">
              <div className="flex items-start justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-xl bg-[#AFDFE4]/30 border border-[#AFDFE4] flex items-center justify-center text-stone-800">
                    <SectionIcon className="w-5 h-5 stroke-[2.2]" />
                  </div>
                  <div>
                    <span className="text-[11px] font-bold tracking-wider uppercase text-[#4AA3AE]">
                      SECTION {secIndex + 1}
                    </span>
                    <h2 className="text-base font-bold text-stone-800 leading-tight">
                      {section.title}
                    </h2>
                    <p className="text-xs text-stone-500 mt-0.5 line-clamp-1">
                      {section.subtitle}
                    </p>
                  </div>
                </div>

                {/* 修了証バッジ（全問完了時） */}
                {isSectionFullyCompleted && sectionCert && (
                  <button
                    onClick={() => openCertificateModal(sectionCert)}
                    className="flex flex-col items-center justify-center px-2 py-1 bg-amber-50 border border-amber-200 rounded-lg text-amber-800 text-[10px] font-bold shadow-2xs hover:bg-amber-100 transition-colors cursor-pointer"
                    title="修了証を見る"
                  >
                    <Award className="w-4 h-4 text-amber-600 mb-0.5" />
                    <span>修了証</span>
                  </button>
                )}
              </div>

              {/* 進捗プログレスバー */}
              <div className="mt-3">
                <div className="flex items-center justify-between text-[11px] text-stone-500 mb-1 font-medium">
                  <span>進捗状況</span>
                  <span>
                    {completedStepsCount} / {section.steps.length} ステップ ({progressPercent}%)
                  </span>
                </div>
                <div className="w-full h-2 bg-stone-100 rounded-full overflow-hidden border border-stone-200/50">
                  <div
                    className="h-full bg-[#AFDFE4] transition-all duration-500 rounded-full"
                    style={{ width: `${progressPercent}%` }}
                  />
                </div>
              </div>
            </div>

            {/* デュオリンゴ風 縦型ステップノード (S字風オフセット配置) */}
            <div className="relative flex flex-col items-center space-y-6 my-2">
              {section.steps.map((step, stepIndex) => {
                const isCompleted = progress.completedStepIds.includes(step.id);
                const isUnlocked =
                  isCompleted || progress.unlockedStepIds.includes(step.id);
                const isCheckpoint = step.type === 'checkpoint';

                // デュオリンゴ風の左右揺らぎ配置 (0: 中央, 1: やや左, 2: やや右, 3: 中央...)
                const offsetPattern = [0, -32, 32, 0];
                const xOffset = offsetPattern[stepIndex % offsetPattern.length];

                return (
                  <div
                    key={step.id}
                    className="relative flex flex-col items-center group"
                    style={{ transform: `translateX(${xOffset}px)` }}
                  >
                    {/* ステップボタン */}
                    <button
                      disabled={!isUnlocked}
                      onClick={() => startQuiz(step)}
                      className={`relative w-16 h-16 rounded-full flex flex-col items-center justify-center transition-all duration-200 ${
                        isCompleted
                          ? 'bg-amber-400 text-stone-900 border-b-4 border-amber-600 shadow-sm active:border-b-0 active:translate-y-1 hover:brightness-105 cursor-pointer'
                          : isUnlocked
                          ? 'bg-[#AFDFE4] text-stone-900 border-b-4 border-[#78bfc8] shadow-md ring-4 ring-[#AFDFE4]/40 animate-bounce-gentle active:border-b-0 active:translate-y-1 hover:brightness-105 cursor-pointer'
                          : 'bg-stone-200 text-stone-400 border-b-4 border-stone-300 cursor-not-allowed opacity-80'
                      }`}
                    >
                      {/* アイコンまたは数字 */}
                      {isCompleted ? (
                        <Check className="w-8 h-8 stroke-[3] text-stone-900" />
                      ) : isUnlocked ? (
                        isCheckpoint ? (
                          <Star className="w-7 h-7 stroke-[2.5] text-stone-800 fill-stone-800" />
                        ) : (
                          <span className="text-xl font-extrabold tracking-tight">
                            {step.stepNumber}
                          </span>
                        )
                      ) : (
                        <Lock className="w-6 h-6 stroke-[2]" />
                      )}

                      {/* チェックポイント王冠・星マーク */}
                      {isCheckpoint && (
                        <div className="absolute -top-2 -right-1 bg-amber-400 border border-amber-600 rounded-full p-1 shadow-2xs">
                          <Award className="w-3 h-3 text-stone-900" />
                        </div>
                      )}
                    </button>

                    {/* ステップタイトルラベル */}
                    <div
                      className={`mt-2 px-3 py-1 rounded-full text-center text-xs font-semibold max-w-[160px] truncate shadow-2xs border ${
                        isUnlocked
                          ? 'bg-white text-stone-800 border-stone-200'
                          : 'bg-stone-100 text-stone-400 border-stone-200'
                      }`}
                    >
                      {step.title}
                    </div>

                    {/* 解放中（次の挑戦）のポップアップ吹き出し */}
                    {isUnlocked && !isCompleted && (
                      <div className="absolute -top-7 bg-stone-900 text-white text-[10px] font-bold px-2.5 py-0.5 rounded-full shadow-md animate-pulse flex items-center space-x-1">
                        <Sparkles className="w-3 h-3 text-[#AFDFE4]" />
                        <span>START!</span>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
};
