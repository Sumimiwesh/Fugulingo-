import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { QuizQuestion } from '../../types/quiz';
import {
  X,
  CheckCircle2,
  XCircle,
  HelpCircle,
  HeartHandshake,
  Lightbulb,
  ArrowRight,
  RotateCcw,
  Sparkles,
} from 'lucide-react';

export const QuizModal: React.FC = () => {
  const { activeQuizStep, closeQuiz, completeQuizStep } = useApp();

  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [selectedOptionId, setSelectedOptionId] = useState<string | null>(null);
  const [isAnswerSubmitted, setIsAnswerSubmitted] = useState<boolean>(false);
  const [score, setScore] = useState<number>(0);
  const [isFinished, setIsFinished] = useState<boolean>(false);
  const [isPassedResult, setIsPassedResult] = useState<boolean>(false);

  if (!activeQuizStep) return null;

  const currentQuestion: QuizQuestion | undefined =
    activeQuizStep.questions[currentIndex];

  const handleSelectOption = (optionId: string) => {
    if (isAnswerSubmitted) return;
    setSelectedOptionId(optionId);
  };

  const handleSubmitAnswer = () => {
    if (!selectedOptionId || !currentQuestion) return;
    setIsAnswerSubmitted(true);

    if (selectedOptionId === currentQuestion.correctOptionId) {
      setScore((prev) => prev + 1);
    }
  };

  const handleNextQuestion = async () => {
    if (currentIndex + 1 < activeQuizStep.questions.length) {
      setCurrentIndex((prev) => prev + 1);
      setSelectedOptionId(null);
      setIsAnswerSubmitted(false);
    } else {
      // 終了判定
      const finalScore =
        score + (selectedOptionId === currentQuestion?.correctOptionId ? 0 : 0);
      const total = activeQuizStep.questions.length;
      const passed = await completeQuizStep(activeQuizStep.id, finalScore, total);

      setIsPassedResult(passed);
      setIsFinished(true);
    }
  };

  const handleRetry = () => {
    setCurrentIndex(0);
    setSelectedOptionId(null);
    setIsAnswerSubmitted(false);
    setScore(0);
    setIsFinished(false);
  };

  const isCurrentCorrect =
    currentQuestion && selectedOptionId === currentQuestion.correctOptionId;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in duration-200">
      <div className="bg-[#FFFEF6] w-full max-w-md rounded-3xl border border-stone-200 shadow-2xl flex flex-col max-h-[90vh] overflow-hidden">
        {/* ヘッダー */}
        <div className="px-5 py-3.5 border-b border-stone-200/80 flex items-center justify-between bg-white">
          <div className="flex items-center space-x-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#AFDFE4]" />
            <h3 className="text-sm font-bold text-stone-800 truncate max-w-[240px]">
              {activeQuizStep.title}
            </h3>
          </div>
          <button
            onClick={closeQuiz}
            className="p-1 rounded-full text-stone-400 hover:text-stone-700 hover:bg-stone-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* 進捗プログレスバー */}
        {!isFinished && (
          <div className="w-full bg-stone-100 h-1.5 overflow-hidden">
            <div
              className="bg-[#AFDFE4] h-full transition-all duration-300"
              style={{
                width: `${
                  ((currentIndex + (isAnswerSubmitted ? 1 : 0)) /
                    activeQuizStep.questions.length) *
                  100
                }%`,
              }}
            />
          </div>
        )}

        {/* コンテンツ本体 */}
        <div className="p-5 overflow-y-auto flex-1 space-y-4">
          {!isFinished && currentQuestion ? (
            <>
              {/* シチュエーションボックス */}
              <div className="bg-stone-50 border border-stone-200/90 rounded-2xl p-3.5">
                <div className="flex items-center space-x-1.5 text-stone-600 text-xs font-bold mb-1">
                  <HelpCircle className="w-4 h-4 text-[#4AA3AE]" />
                  <span>状況設定（シチュエーション）</span>
                </div>
                <p className="text-xs text-stone-700 leading-relaxed font-medium">
                  {currentQuestion.situation}
                </p>
              </div>

              {/* 問いかけ */}
              <div className="pt-1">
                <span className="text-[11px] font-bold text-stone-400 tracking-wider">
                  QUESTION {currentIndex + 1} / {activeQuizStep.questions.length}
                </span>
                <h4 className="text-sm font-bold text-stone-800 mt-0.5 leading-snug">
                  {currentQuestion.question}
                </h4>
              </div>

              {/* 4択選択肢カード */}
              <div className="space-y-2.5 pt-1">
                {currentQuestion.options.map((option) => {
                  const isSelected = selectedOptionId === option.id;
                  const isCorrect = option.id === currentQuestion.correctOptionId;

                  let borderClass = 'border-stone-200 hover:border-stone-300 bg-white';
                  let badgeClass = 'bg-stone-100 text-stone-600';

                  if (isAnswerSubmitted) {
                    if (isCorrect) {
                      borderClass = 'border-emerald-500 bg-emerald-50/80 ring-1 ring-emerald-500';
                      badgeClass = 'bg-emerald-500 text-white font-bold';
                    } else if (isSelected) {
                      borderClass = 'border-rose-400 bg-rose-50/70 ring-1 ring-rose-400';
                      badgeClass = 'bg-rose-500 text-white font-bold';
                    } else {
                      borderClass = 'border-stone-100 bg-stone-50/50 opacity-50';
                    }
                  } else if (isSelected) {
                    borderClass = 'border-[#4AA3AE] bg-[#AFDFE4]/20 ring-2 ring-[#AFDFE4] shadow-xs';
                    badgeClass = 'bg-[#4AA3AE] text-white font-bold';
                  }

                  return (
                    <button
                      key={option.id}
                      disabled={isAnswerSubmitted}
                      onClick={() => handleSelectOption(option.id)}
                      className={`w-full text-left p-3.5 rounded-2xl border transition-all duration-150 flex items-start space-x-3 cursor-pointer ${borderClass}`}
                    >
                      <span
                        className={`w-6 h-6 rounded-lg text-xs flex items-center justify-center shrink-0 transition-colors ${badgeClass}`}
                      >
                        {option.id}
                      </span>
                      <span className="text-xs text-stone-800 font-medium leading-relaxed flex-1">
                        {option.text}
                      </span>
                    </button>
                  );
                })}
              </div>

              {/* 解答即時フィードバックカード */}
              {isAnswerSubmitted && (
                <div
                  className={`mt-4 rounded-2xl p-4 border animate-in fade-in slide-in-from-bottom-2 duration-200 space-y-3 ${
                    isCurrentCorrect
                      ? 'bg-emerald-50/90 border-emerald-200 text-emerald-950'
                      : 'bg-rose-50/90 border-rose-200 text-rose-950'
                  }`}
                >
                  {/* 正誤判定ヘッダー */}
                  <div className="flex items-center space-x-2">
                    {isCurrentCorrect ? (
                      <>
                        <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                        <span className="font-extrabold text-sm text-emerald-800">
                          正解！
                        </span>
                      </>
                    ) : (
                      <>
                        <XCircle className="w-5 h-5 text-rose-600 shrink-0" />
                        <span className="font-extrabold text-sm text-rose-800">
                          惜しい！正解は「{currentQuestion.correctOptionId}」です
                        </span>
                      </>
                    )}
                  </div>

                  {/* ひっかけのポイント（不正解時または注意喚起） */}
                  {currentQuestion.trapExplanation && (
                    <div className="bg-white/80 rounded-xl p-3 border border-stone-200/60 text-xs space-y-1">
                      <div className="flex items-center space-x-1.5 font-bold text-amber-800">
                        <Lightbulb className="w-3.5 h-3.5 text-amber-600" />
                        <span>ポイント</span>
                      </div>
                      <p className="text-stone-700 leading-relaxed font-normal">
                        {currentQuestion.trapExplanation}
                      </p>
                    </div>
                  )}

                  {/* 正解の理由・解説 */}
                  <div className="bg-white/80 rounded-xl p-3 border border-stone-200/60 text-xs space-y-1">
                    <div className="flex items-center space-x-1.5 font-bold text-stone-800">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                      <span>マニュアル基準の解説</span>
                    </div>
                    <p className="text-stone-700 leading-relaxed font-normal">
                      {currentQuestion.explanation}
                    </p>
                  </div>

                  {/* 求められる接客マインド・スキルのフィードバック文 */}
                  {currentQuestion.mindsetFeedback && (
                    <div className="bg-white/90 rounded-xl p-3 border border-[#AFDFE4] text-xs space-y-1">
                      <div className="flex items-center space-x-1.5 font-bold text-[#2C6268]">
                        <HeartHandshake className="w-3.5 h-3.5 text-[#4AA3AE]" />
                        <span>求められる接客マインド・スキル</span>
                      </div>
                      <p className="text-stone-800 leading-relaxed font-medium">
                        {currentQuestion.mindsetFeedback}
                      </p>
                    </div>
                  )}
                </div>
              )}
            </>
          ) : (
            /* 結果判定画面 */
            <div className="py-6 flex flex-col items-center text-center space-y-4">
              <div
                className={`w-20 h-20 rounded-full flex items-center justify-center border-4 ${
                  isPassedResult
                    ? 'bg-amber-50 border-amber-400 text-amber-500 animate-bounce-gentle'
                    : 'bg-stone-100 border-stone-300 text-stone-400'
                }`}
              >
                {isPassedResult ? (
                  <Sparkles className="w-10 h-10 fill-amber-400" />
                ) : (
                  <RotateCcw className="w-10 h-10" />
                )}
              </div>

              <div>
                <h4 className="text-lg font-extrabold text-stone-800">
                  {isPassedResult ? 'ステップ合格！' : 'もう一歩で合格です'}
                </h4>
                <p className="text-xs text-stone-500 mt-1">
                  {isPassedResult
                    ? '接客基準をしっかりマスターできています！次のステップへ進みましょう。'
                    : '80%以上の正解で合格となります。解説を振り返って再挑戦してみましょう。'}
                </p>
              </div>

              {/* スコアカード */}
              <div className="w-full bg-white rounded-2xl border border-stone-200 p-4 shadow-xs flex items-center justify-around">
                <div>
                  <span className="text-[11px] text-stone-400 font-bold block">正解数</span>
                  <span className="text-xl font-extrabold text-stone-800">
                    {score} / {activeQuizStep.questions.length} 問
                  </span>
                </div>
                <div className="w-px h-8 bg-stone-200" />
                <div>
                  <span className="text-[11px] text-stone-400 font-bold block">正解率</span>
                  <span
                    className={`text-xl font-extrabold ${
                      isPassedResult ? 'text-emerald-600' : 'text-amber-600'
                    }`}
                  >
                    {Math.round((score / activeQuizStep.questions.length) * 100)}%
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* フッターアクションボタン */}
        <div className="p-4 bg-white border-t border-stone-200/80">
          {!isFinished ? (
            !isAnswerSubmitted ? (
              <button
                disabled={!selectedOptionId}
                onClick={handleSubmitAnswer}
                className={`w-full py-3.5 rounded-2xl font-bold text-sm tracking-wide transition-all shadow-xs ${
                  selectedOptionId
                    ? 'bg-stone-900 text-white hover:bg-stone-800 active:scale-[0.99] cursor-pointer'
                    : 'bg-stone-200 text-stone-400 cursor-not-allowed'
                }`}
              >
                回答する
              </button>
            ) : (
              <button
                onClick={handleNextQuestion}
                className="w-full py-3.5 rounded-2xl font-bold text-sm tracking-wide bg-stone-900 text-[#AFDFE4] hover:bg-stone-800 active:scale-[0.99] transition-all flex items-center justify-center space-x-2 cursor-pointer shadow-xs"
              >
                <span>
                  {currentIndex + 1 < activeQuizStep.questions.length
                    ? '次の問題へ'
                    : '結果を確認する'}
                </span>
                <ArrowRight className="w-4 h-4" />
              </button>
            )
          ) : (
            <div className="flex space-x-3">
              <button
                onClick={handleRetry}
                className="flex-1 py-3.5 rounded-2xl font-bold text-xs bg-stone-100 hover:bg-stone-200 text-stone-700 transition-colors cursor-pointer"
              >
                もう一度解く
              </button>
              <button
                onClick={closeQuiz}
                className="flex-1 py-3.5 rounded-2xl font-bold text-xs bg-stone-900 text-white hover:bg-stone-800 transition-colors cursor-pointer shadow-xs"
              >
                学習ツリーに戻る
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
