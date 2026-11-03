import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { HallManual, ManualVersion, ManualContentType } from '../../types/manual';
import { uploadManualFile } from '../../services/storageService';
import {
  FileText,
  Upload,
  History,
  RotateCcw,
  CheckCircle,
  Plus,
  BookOpen,
  Eye,
  FileCheck,
} from 'lucide-react';

export const ManualManager: React.FC = () => {
  const { manuals, saveManual, addManualVersion, restoreManualVersion } = useApp();

  const [selectedManual, setSelectedManual] = useState<HallManual>(manuals[0] || null);
  const [isNewVersionModalOpen, setIsNewVersionModalOpen] = useState<boolean>(false);

  // 新バージョンフォーム
  const [versionLabel, setVersionLabel] = useState<string>('');
  const [changeLog, setChangeLog] = useState<string>('');
  const [contentType, setContentType] = useState<ManualContentType>('text');
  const [textContent, setTextContent] = useState<string>('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  // マニュアル選択切り替え
  const handleSelectManual = (manual: HallManual) => {
    setSelectedManual(manual);
  };

  const handleOpenNewVersionModal = () => {
    if (!selectedManual) return;
    const nextVerNum = selectedManual.versions.length + 1;
    setVersionLabel(`v1.${nextVerNum - 1} 改定版`);
    setChangeLog('');
    const currentActive = selectedManual.versions.find(
      (v) => v.id === selectedManual.currentVersionId
    );
    setTextContent(currentActive?.content || '');
    setSelectedFile(null);
    setIsNewVersionModalOpen(true);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedFile(file);
      if (file.type.includes('pdf')) {
        setContentType('pdf');
      } else if (file.type.includes('image')) {
        setContentType('image');
      }
    }
  };

  const handleSubmitNewVersion = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedManual) return;

    try {
      setIsSubmitting(true);

      let fileUrl: string | undefined = undefined;
      let fileName: string | undefined = undefined;
      let fileSize: number | undefined = undefined;

      if (selectedFile) {
        const uploadResult = await uploadManualFile(selectedFile, selectedManual.id);
        fileUrl = uploadResult.url;
        fileName = uploadResult.fileName;
        fileSize = uploadResult.fileSize;
      }

      const newVersion: ManualVersion = {
        id: `ver-${selectedManual.id}-${Date.now()}`,
        manualId: selectedManual.id,
        versionNumber: selectedManual.versions.length + 1,
        versionLabel: versionLabel.trim() || `v1.${selectedManual.versions.length}`,
        changeLog: changeLog.trim() || 'マニュアルの改定更新',
        contentType,
        content: textContent.trim(),
        fileUrl,
        fileName,
        fileSize,
        status: 'active',
        createdAt: new Date().toISOString(),
        createdBy: '管理者',
      };

      await addManualVersion(selectedManual.id, newVersion);

      // 選択中マニュアルのステート更新
      const updated = manuals.find((m) => m.id === selectedManual.id);
      if (updated) setSelectedManual(updated);

      setIsNewVersionModalOpen(false);
      alert('マニュアルの新バージョンを登録・公開しました（旧版はアーカイブされました）。');
    } catch (error) {
      console.error('Failed to submit new version:', error);
      alert('バージョンの登録に失敗しました。');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRestore = async (versionId: string) => {
    if (!selectedManual) return;
    if (
      !confirm('このバージョンを現在のアクティブ（最新運用版）として復元しますか？')
    )
      return;

    try {
      await restoreManualVersion(selectedManual.id, versionId);
      const updated = manuals.find((m) => m.id === selectedManual.id);
      if (updated) setSelectedManual(updated);
      alert('指定バージョンを復元しました。');
    } catch (error) {
      console.error('Failed to restore version:', error);
      alert('バージョンの復元に失敗しました。');
    }
  };

  const activeVersion = selectedManual?.versions.find(
    (v) => v.id === selectedManual.currentVersionId
  );

  return (
    <div className="space-y-6">
      {/* マニュアル選択セレクター */}
      <div className="bg-white rounded-2xl border border-stone-200 p-4 shadow-xs">
        <label className="text-xs font-bold text-stone-500 block mb-2">
          管理対象マニュアル
        </label>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
          {manuals.map((m) => (
            <button
              key={m.id}
              onClick={() => handleSelectManual(m)}
              className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                selectedManual?.id === m.id
                  ? 'bg-[#AFDFE4]/20 border-[#4AA3AE] ring-2 ring-[#AFDFE4]'
                  : 'bg-stone-50/50 border-stone-200 hover:bg-stone-100'
              }`}
            >
              <span className="text-[10px] font-bold text-[#2C6268] uppercase block">
                {m.categoryLabel}
              </span>
              <span className="text-xs font-bold text-stone-800 line-clamp-1">
                {m.title}
              </span>
            </button>
          ))}
        </div>
      </div>

      {selectedManual && (
        <div className="space-y-6">
          {/* 現在運用中のアクティブマニュアル */}
          <div className="bg-white rounded-2xl border border-stone-200 p-5 shadow-xs">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-stone-100 gap-3">
              <div>
                <div className="flex items-center space-x-2">
                  <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-bold text-[10px] flex items-center space-x-1">
                    <CheckCircle className="w-3 h-3" />
                    <span>運用中（Active）</span>
                  </span>
                  <span className="text-xs font-bold text-stone-500">
                    {activeVersion?.versionLabel}
                  </span>
                </div>
                <h3 className="text-base font-extrabold text-stone-900 mt-1">
                  {selectedManual.title}
                </h3>
              </div>

              <button
                onClick={handleOpenNewVersionModal}
                className="px-4 py-2 rounded-xl bg-stone-900 text-[#AFDFE4] text-xs font-bold hover:bg-stone-800 transition-colors flex items-center justify-center space-x-1.5 shadow-2xs cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>新版の改定・登録</span>
              </button>
            </div>

            {/* 本文プレビュー */}
            <div className="mt-4 bg-stone-50 rounded-xl p-4 border border-stone-200/80">
              <div className="flex items-center justify-between text-xs text-stone-500 mb-2 font-semibold">
                <span className="flex items-center space-x-1">
                  <BookOpen className="w-4 h-4 text-[#4AA3AE]" />
                  <span>マニュアル本文 / 抽出内容</span>
                </span>
                <span>作成者: {activeVersion?.createdBy}</span>
              </div>
              <pre className="text-xs text-stone-700 font-sans whitespace-pre-wrap leading-relaxed max-h-48 overflow-y-auto">
                {activeVersion?.content}
              </pre>
              {activeVersion?.fileUrl && (
                <div className="mt-3 pt-3 border-t border-stone-200 flex items-center space-x-2 text-xs text-[#2C6268]">
                  <FileCheck className="w-4 h-4" />
                  <span>添付ファイル: {activeVersion.fileName || 'マニュアル資料'}</span>
                  <a
                    href={activeVersion.fileUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="underline text-stone-500 hover:text-stone-800 text-[11px]"
                  >
                    表示
                  </a>
                </div>
              )}
            </div>
          </div>

          {/* バージョン履歴（版管理 & 旧版の復元） */}
          <div className="bg-white rounded-2xl border border-stone-200 p-5 shadow-xs">
            <div className="flex items-center space-x-2 mb-4">
              <History className="w-5 h-5 text-stone-600" />
              <h4 className="text-sm font-bold text-stone-800">
                バージョン履歴（版管理）
              </h4>
            </div>

            <div className="space-y-3">
              {selectedManual.versions.map((ver) => {
                const isActive = ver.id === selectedManual.currentVersionId;

                return (
                  <div
                    key={ver.id}
                    className={`p-3.5 rounded-xl border flex flex-col sm:flex-row sm:items-center justify-between gap-3 transition-all ${
                      isActive
                        ? 'bg-emerald-50/50 border-emerald-300 ring-1 ring-emerald-300'
                        : 'bg-stone-50/60 border-stone-200'
                    }`}
                  >
                    <div>
                      <div className="flex items-center space-x-2">
                        <span className="text-xs font-bold text-stone-900">
                          {ver.versionLabel}
                        </span>
                        {isActive ? (
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                            現在のアクティブ
                          </span>
                        ) : (
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-stone-200 text-stone-600">
                            アーカイブ（旧版）
                          </span>
                        )}
                        <span className="text-[10px] text-stone-400">
                          {new Date(ver.createdAt).toLocaleDateString('ja-JP')}
                        </span>
                      </div>
                      <p className="text-xs text-stone-600 mt-1">
                        {ver.changeLog || '変更なし'}
                      </p>
                    </div>

                    <div>
                      {isActive ? (
                        <span className="text-xs font-bold text-emerald-700 flex items-center space-x-1">
                          <CheckCircle className="w-4 h-4" />
                          <span>運用中</span>
                        </span>
                      ) : (
                        <button
                          onClick={() => handleRestore(ver.id)}
                          className="px-3 py-1.5 rounded-lg border border-stone-300 bg-white hover:bg-stone-100 text-stone-700 text-xs font-bold transition-all flex items-center space-x-1 shadow-2xs active:scale-95 cursor-pointer"
                          title="この旧バージョンをアクティブに戻す"
                        >
                          <RotateCcw className="w-3.5 h-3.5" />
                          <span>この版を復元</span>
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* 新バージョン改定モーダル */}
      {isNewVersionModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in duration-200">
          <div className="bg-[#FFFEF6] w-full max-w-lg rounded-3xl border border-stone-200 shadow-2xl p-6 flex flex-col max-h-[90vh] overflow-y-auto">
            <h3 className="text-base font-bold text-stone-900 pb-3 border-b border-stone-200">
              新マニュアル版の登録・改定（{selectedManual?.title}）
            </h3>

            <form onSubmit={handleSubmitNewVersion} className="mt-4 space-y-4">
              <div>
                <label className="text-xs font-bold text-stone-700 block mb-1">
                  バージョン表記（ラベル）
                </label>
                <input
                  type="text"
                  required
                  value={versionLabel}
                  onChange={(e) => setVersionLabel(e.target.value)}
                  placeholder="例: v1.2 混雑時レジ誘導改定"
                  className="w-full px-3 py-2 rounded-xl border border-stone-300 text-xs text-stone-800 focus:outline-none focus:ring-2 focus:ring-[#AFDFE4]"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-stone-700 block mb-1">
                  改定理由・変更ログ
                </label>
                <input
                  type="text"
                  required
                  value={changeLog}
                  onChange={(e) => setChangeLog(e.target.value)}
                  placeholder="例: 雨天時の傘預かりフローおよび声かけを追加。"
                  className="w-full px-3 py-2 rounded-xl border border-stone-300 text-xs text-stone-800 focus:outline-none focus:ring-2 focus:ring-[#AFDFE4]"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-stone-700 block mb-1">
                  マニュアルファイル添付（PDF / 画像 / 任意）
                </label>
                <input
                  type="file"
                  accept=".pdf,image/*"
                  onChange={handleFileChange}
                  className="text-xs text-stone-600 file:mr-3 file:py-1.5 file:px-3 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-stone-200 file:text-stone-800 hover:file:bg-stone-300"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-stone-700 block mb-1">
                  マニュアル本文（自由記述テキスト / AI問題生成の元データ）
                </label>
                <textarea
                  rows={6}
                  required
                  value={textContent}
                  onChange={(e) => setTextContent(e.target.value)}
                  placeholder="マニュアルのルールや手順を記載してください..."
                  className="w-full px-3 py-2 rounded-xl border border-stone-300 text-xs text-stone-800 focus:outline-none focus:ring-2 focus:ring-[#AFDFE4] font-sans leading-relaxed"
                />
              </div>

              <div className="flex justify-end space-x-2 pt-3 border-t border-stone-200">
                <button
                  type="button"
                  onClick={() => setIsNewVersionModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-stone-200 text-stone-600 text-xs font-bold hover:bg-stone-100"
                >
                  キャンセル
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-5 py-2 rounded-xl bg-stone-900 text-[#AFDFE4] text-xs font-bold hover:bg-stone-800 disabled:opacity-50"
                >
                  {isSubmitting ? '保存中...' : '新版を保存・即時運用化'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
