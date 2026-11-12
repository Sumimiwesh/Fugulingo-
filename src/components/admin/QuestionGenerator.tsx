import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { QuizQuestion, QuizOption } from '../../types/quiz';
import { generateQuizQuestionsFromManual } from '../../services/quizGeneratorService';
import {
  Sparkles,
  Bot,
  CheckCircle,
  HelpCircle,
  Lightbulb,
  HeartHandshake,
  Edit3,
  Send,
  BookOpen,
  SlidersHorizontal,
} from 'lucide-react';

export const QuestionGenerator: React.FC = () => {
  const { manuals, sections, publishQuestion } = useApp();

  const [selectedManualId, setSelectedManualId] = useState<string>(
    manuals[0]?.id || ''
  );
  const [targetSectionId, setTargetSectionId] = useState<string>(
    sections[0]?.id || ''
  );
  const [targetStepId, setTargetStepId] = useState<string>(
    sections[0]?.steps[0]?.id || ''
  );

  // マニュアル本文（編集・直接入力も可能）
  const currentManual = manuals.find((m) => m.id === selectedManualId);
  const activeVer = currentManual?.versions.find(
    (v) => v.id === currentManual?.currentVersionId
  );
  const [manualContent, setManualContent] = useState<string>(
    activeVer?.content || ''
  );

  const [focusPoint, setFocusPoint] = useState<string>('新人が犯しやすいミスと丁寧な言葉遣い');
  const [questionCount, setQuestionCount] = useState<number>(2);

  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [generatedQuestions, setGeneratedQuestions] = useState<QuizQuestion[]>([]);
  const [editingQuestionId, setEditingQuestionId] = useState<string | null>(null);
  const [publishedSuccessMap, setPublishedSuccessMap] = useState<Record<string, boolean>>({});

  // マニュアル選択変更
  const handleManualChange = (mId: string) => {
    setSelectedManualId(mId);
    const m = manuals.find((item) => item.id === mId);
    const v = m?.versions.find((ver) => ver.id === m?.currentVersionId);
    setManualContent(v?.content || '');
  };

  // セクション変更
  const handleSectionChange = (secId: string) => {
    setTargetSectionId(secId);
    const sec = sections.find((s) => s.id === secId);
    if (sec && sec.steps.length > 0) {
      setTargetStepId(sec.steps[0].id);
    }
  };

  const handleGenerate = async () => {
    if (!manualContent.trim()) {
      alert('マニュアル本文を入力または選択してください。');
      return;
    }

    try {
      setIsGenerating(true);
      const generated = await generateQuizQuestionsFromManual({
        manualTitle: currentManual?.title || '飲食店ホール接客マニュアル',
        manualContent,
        sectionId: targetSectionId,
        stepId: targetStepId,
        questionCount,
        focusPoint,
      });

      setGeneratedQuestions(generated);
      setPublishedSuccessMap({});
    } catch (error: any) {
      console.error('Quiz generation error:', error);
      alert(`問題生成に失敗しました: ${error.message || 'エラーが発生しました'}`);
    } finally {
      setIsGenerating(false);
    }
  };

  const handlePublish = async (question: QuizQuestion) => {
    try {
      await publishQuestion(targetSectionId, targetStepId, question);
      setPublishedSuccessMap((prev) => ({ ...prev, [question.id]: true }));
      alert('問題を承認し、学習ツリーに即時反映・公開しました！');
    } catch (error) {
      console.error('Failed to publish question:', error);
      alert('問題の公開に失敗しました。');
    }
  };

  // インライン編集用ハンドラ
  const handleUpdateField = (
    qId: string,
    field: keyof QuizQuestion,
    value: any
  ) => {
    setGeneratedQuestions((prev) =>
      prev.map((q) => (q.id === qId ? { ...q, [field]: value } : q))
    );
  };

  const handleUpdateOption = (
    qId: string,
    optId: string,
    text: string
  ) => {
    setGeneratedQuestions((prev) =>
      prev.map((q) => {
        if (q.id === qId) {
          const newOpts = q.options.map((opt) =>
            opt.id === optId ? { ...opt, text } : opt
          ) as [QuizOption, QuizOption, QuizOption, QuizOption];
          return { ...q, options: newOpts };
        }
        return q;
      })
    );
  };

  const currentSection = sections.find((s) => s.id === targetSectionId);

  return (
    <div className="space-y-6">
      {/* 問題生成パラメーター設定カード（APIキー不要・完全内蔵） */}
      <div className="bg-white rounded-2xl border border-stone-200 p-5 shadow-xs space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-stone-100">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-lg bg-[#AFDFE4]/30 border border-[#AFDFE4] flex items-center justify-center text-stone-800">
              <Sparkles className="w-4 h-4 text-[#2C6268]" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-stone-800">
                マニュアルから4択問題を自動生成
              </h3>
              <p className="text-[10px] text-stone-500 font-medium">
                APIキー不要・完全オフライン対応でマニュアルから即座にクイズを抽出
              </p>
            </div>
          </div>
          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
            キー設定不要
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* マニュアル選択 */}
          <div>
            <label className="text-xs font-bold text-stone-700 block mb-1">
              参照元マニュアル
            </label>
            <select
              value={selectedManualId}
              onChange={(e) => handleManualChange(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-stone-300 text-xs text-stone-800 bg-white"
            >
              {manuals.map((m) => (
                <option key={m.id} value={m.id}>
                  {m.title}
                </option>
              ))}
            </select>
          </div>

          {/* 公開先セクション */}
          <div>
            <label className="text-xs font-bold text-stone-700 block mb-1">
              反映先セクション & ステップ
            </label>
            <div className="flex space-x-2">
              <select
                value={targetSectionId}
                onChange={(e) => handleSectionChange(e.target.value)}
                className="w-1/2 px-3 py-2 rounded-xl border border-stone-300 text-xs text-stone-800 bg-white"
              >
                {sections.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.title}
                  </option>
                ))}
              </select>
              <select
                value={targetStepId}
                onChange={(e) => setTargetStepId(e.target.value)}
                className="w-1/2 px-3 py-2 rounded-xl border border-stone-300 text-xs text-stone-800 bg-white"
              >
                {currentSection?.steps.map((st) => (
                  <option key={st.id} value={st.id}>
                    ステップ {st.stepNumber}: {st.title}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* 重点ポイント & 生成数 */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="sm:col-span-2">
            <label className="text-xs font-bold text-stone-700 block mb-1">
              出題の重点テーマ（ひっかけ・マインドの指定）
            </label>
            <input
              type="text"
              value={focusPoint}
              onChange={(e) => setFocusPoint(e.target.value)}
              placeholder="例: お客様と目が合った瞬間の笑顔、料理名復唱マナー"
              className="w-full px-3 py-2 rounded-xl border border-stone-300 text-xs text-stone-800"
            />
          </div>

          <div>
            <label className="text-xs font-bold text-stone-700 block mb-1">
              生成問題数
            </label>
            <select
              value={questionCount}
              onChange={(e) => setQuestionCount(Number(e.target.value))}
              className="w-full px-3 py-2 rounded-xl border border-stone-300 text-xs text-stone-800 bg-white"
            >
              <option value={1}>1問</option>
              <option value={2}>2問（推奨）</option>
              <option value={3}>3問</option>
            </select>
          </div>
        </div>

        {/* マニュアル本文確認 */}
        <div>
          <label className="text-xs font-bold text-stone-700 block mb-1 flex items-center justify-between">
            <span>マニュアル抽出テキスト（問題生成ソース）</span>
            <span className="text-[10px] text-stone-400 font-normal">
              自由に追加・編集可能
            </span>
          </label>
          <textarea
            rows={5}
            value={manualContent}
            onChange={(e) => setManualContent(e.target.value)}
            className="w-full px-3 py-2 rounded-xl border border-stone-300 text-xs text-stone-800 leading-relaxed font-sans"
          />
        </div>

        {/* 生成ボタン */}
        <button
          disabled={isGenerating}
          onClick={handleGenerate}
          className="w-full py-3.5 rounded-2xl bg-stone-900 text-[#AFDFE4] text-xs font-bold hover:bg-stone-800 transition-all flex items-center justify-center space-x-2 shadow-xs cursor-pointer active:scale-98 disabled:opacity-50"
        >
          <Sparkles className="w-4 h-4" />
          <span>{isGenerating ? '問題を自動生成中...' : '4択問題を自動生成する'}</span>
        </button>
      </div>

      {/* 生成された問題のレビュー & 編集 & 承認公開 */}
      {generatedQuestions.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-bold text-stone-800 flex items-center space-x-1.5">
              <span>生成された問題のプレビュー & 承認・公開</span>
              <span className="text-xs px-2 py-0.5 rounded-full bg-[#AFDFE4]/40 text-[#2C6268] font-bold">
                {generatedQuestions.length}件
              </span>
            </h4>
            <span className="text-[11px] text-stone-500">
              ※内容を確認・修正した上で「承認して学習ツリーに公開」してください
            </span>
          </div>

          {generatedQuestions.map((q, idx) => {
            const isPublished = publishedSuccessMap[q.id];
            const isEditing = editingQuestionId === q.id;

            return (
              <div
                key={q.id}
                className="bg-white rounded-2xl border border-stone-200 p-5 shadow-xs space-y-4"
              >
                {/* 問題ヘッダー */}
                <div className="flex items-center justify-between pb-2 border-b border-stone-100">
                  <span className="text-xs font-bold text-stone-500">
                    問題 {idx + 1}
                  </span>
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() =>
                        setEditingQuestionId(isEditing ? null : q.id)
                      }
                      className="text-xs text-stone-500 hover:text-stone-800 flex items-center space-x-1 px-2 py-1 rounded hover:bg-stone-100 cursor-pointer"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                      <span>{isEditing ? '編集完了' : '編集する'}</span>
                    </button>
                    {isPublished ? (
                      <span className="px-3 py-1 rounded-xl bg-emerald-100 text-emerald-800 font-bold text-xs flex items-center space-x-1">
                        <CheckCircle className="w-3.5 h-3.5" />
                        <span>ツリーに公開済</span>
                      </span>
                    ) : (
                      <button
                        onClick={() => handlePublish(q)}
                        className="px-4 py-1.5 rounded-xl bg-stone-900 text-[#AFDFE4] text-xs font-bold hover:bg-stone-800 transition-colors flex items-center space-x-1 shadow-2xs cursor-pointer"
                      >
                        <Send className="w-3.5 h-3.5" />
                        <span>承認して公開</span>
                      </button>
                    )}
                  </div>
                </div>

                {/* シチュエーション & 問いかけ */}
                <div className="space-y-2">
                  <div className="bg-stone-50 p-3 rounded-xl border border-stone-200 text-xs">
                    <span className="font-bold text-stone-500 block mb-0.5">
                      状況（シチュエーション）
                    </span>
                    {isEditing ? (
                      <input
                        type="text"
                        value={q.situation}
                        onChange={(e) =>
                          handleUpdateField(q.id, 'situation', e.target.value)
                        }
                        className="w-full px-2 py-1 rounded border border-stone-300"
                      />
                    ) : (
                      <p className="text-stone-800 font-medium">{q.situation}</p>
                    )}
                  </div>

                  <div>
                    <span className="text-xs font-bold text-stone-500 block mb-0.5">
                      設問
                    </span>
                    {isEditing ? (
                      <input
                        type="text"
                        value={q.question}
                        onChange={(e) =>
                          handleUpdateField(q.id, 'question', e.target.value)
                        }
                        className="w-full px-2 py-1 rounded border border-stone-300 font-bold text-xs"
                      />
                    ) : (
                      <p className="text-xs font-bold text-stone-900">{q.question}</p>
                    )}
                  </div>
                </div>

                {/* 4つの選択肢 */}
                <div className="space-y-1.5">
                  <span className="text-[11px] font-bold text-stone-400 block">
                    選択肢（概ね同等文字数） & 正解指定
                  </span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {q.options.map((opt) => {
                      const isCorrect = opt.id === q.correctOptionId;

                      return (
                        <div
                          key={opt.id}
                          className={`p-2.5 rounded-xl border text-xs flex items-center space-x-2 ${
                            isCorrect
                              ? 'bg-emerald-50 border-emerald-400 text-emerald-950 ring-1 ring-emerald-300'
                              : 'bg-stone-50 border-stone-200 text-stone-700'
                          }`}
                        >
                          <button
                            type="button"
                            onClick={() =>
                              handleUpdateField(q.id, 'correctOptionId', opt.id)
                            }
                            title="クリックで正解に設定"
                            className={`w-5 h-5 rounded-md text-[10px] font-bold flex items-center justify-center shrink-0 cursor-pointer ${
                              isCorrect
                                ? 'bg-emerald-600 text-white'
                                : 'bg-stone-200 text-stone-600 hover:bg-stone-300'
                            }`}
                          >
                            {opt.id}
                          </button>
                          {isEditing ? (
                            <input
                              type="text"
                              value={opt.text}
                              onChange={(e) =>
                                handleUpdateOption(q.id, opt.id, e.target.value)
                              }
                              className="flex-1 px-1.5 py-0.5 rounded border border-stone-300 text-xs"
                            />
                          ) : (
                            <span className="flex-1 leading-snug">{opt.text}</span>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* ひっかけの罠・解説・接客マインド */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs pt-1">
                  <div className="bg-amber-50/80 p-2.5 rounded-xl border border-amber-200 text-amber-950">
                    <span className="font-bold block text-[10px] text-amber-800 mb-0.5">
                      ポイント
                    </span>
                    {isEditing ? (
                      <textarea
                        rows={2}
                        value={q.trapExplanation}
                        onChange={(e) =>
                          handleUpdateField(q.id, 'trapExplanation', e.target.value)
                        }
                        className="w-full text-xs p-1 rounded border border-amber-300"
                      />
                    ) : (
                      <p className="leading-relaxed">{q.trapExplanation}</p>
                    )}
                  </div>

                  <div className="bg-stone-50 p-2.5 rounded-xl border border-stone-200 text-stone-800">
                    <span className="font-bold block text-[10px] text-stone-500 mb-0.5">
                      正解の根拠・解説
                    </span>
                    {isEditing ? (
                      <textarea
                        rows={2}
                        value={q.explanation}
                        onChange={(e) =>
                          handleUpdateField(q.id, 'explanation', e.target.value)
                        }
                        className="w-full text-xs p-1 rounded border border-stone-300"
                      />
                    ) : (
                      <p className="leading-relaxed">{q.explanation}</p>
                    )}
                  </div>

                  <div className="bg-[#AFDFE4]/20 p-2.5 rounded-xl border border-[#AFDFE4] text-[#2C6268]">
                    <span className="font-bold block text-[10px] text-[#2C6268] mb-0.5">
                      求められる接客マインド
                    </span>
                    {isEditing ? (
                      <textarea
                        rows={2}
                        value={q.mindsetFeedback}
                        onChange={(e) =>
                          handleUpdateField(q.id, 'mindsetFeedback', e.target.value)
                        }
                        className="w-full text-xs p-1 rounded border border-[#AFDFE4]"
                      />
                    ) : (
                      <p className="leading-relaxed font-medium">{q.mindsetFeedback}</p>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
