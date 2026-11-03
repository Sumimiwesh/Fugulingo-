import React from 'react';
import { useApp } from '../../context/AppContext';
import { Award, Lock, ExternalLink, Calendar, CheckCircle2 } from 'lucide-react';

export const CertificateListView: React.FC = () => {
  const { sections, certificates, openCertificateModal, setActiveTab } = useApp();

  return (
    <div className="pb-24 pt-4 px-4 max-w-md mx-auto space-y-6">
      {/* 画面ヘッダー */}
      <div>
        <h2 className="text-xl font-extrabold text-stone-800 tracking-tight flex items-center space-x-2">
          <Award className="w-6 h-6 text-amber-500" />
          <span>修了証ギャラリー</span>
        </h2>
        <p className="text-xs text-stone-500 mt-1">
          各セクションの確認テストに合格すると、デジタル修了証（横向きA4 / PNG）が授与されます。
        </p>
      </div>

      {/* 修了証カード一覧 */}
      <div className="space-y-4">
        {sections.map((section, index) => {
          const cert = certificates.find((c) => c.sectionId === section.id);
          const isAcquired = !!cert;

          return (
            <div
              key={section.id}
              className={`rounded-2xl border transition-all p-4 ${
                isAcquired
                  ? 'bg-white border-amber-200/80 shadow-xs hover:shadow-md'
                  : 'bg-stone-50/70 border-stone-200 opacity-80'
              }`}
            >
              <div className="flex items-start justify-between">
                <div className="flex items-start space-x-3">
                  <div
                    className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 border ${
                      isAcquired
                        ? 'bg-amber-50 border-amber-300 text-amber-600'
                        : 'bg-stone-200 border-stone-300 text-stone-400'
                    }`}
                  >
                    {isAcquired ? (
                      <Award className="w-6 h-6" />
                    ) : (
                      <Lock className="w-5 h-5" />
                    )}
                  </div>

                  <div>
                    <span className="text-[10px] font-bold tracking-wider uppercase text-stone-400">
                      SECTION {index + 1}
                    </span>
                    <h3 className="text-sm font-bold text-stone-800 leading-snug">
                      {section.title}
                    </h3>
                    <p className="text-xs text-stone-500 mt-0.5 line-clamp-1">
                      {section.subtitle}
                    </p>

                    {isAcquired && (
                      <div className="flex items-center space-x-3 mt-2 text-[11px] text-stone-600 font-medium">
                        <span className="flex items-center space-x-1">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                          <span>修了認定済</span>
                        </span>
                        <span className="flex items-center space-x-1 text-stone-400">
                          <Calendar className="w-3 h-3" />
                          <span>
                            {new Date(cert.issuedAt).toLocaleDateString('ja-JP')}
                          </span>
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                {/* アクションボタン */}
                <div>
                  {isAcquired ? (
                    <button
                      onClick={() => openCertificateModal(cert)}
                      className="px-3 py-1.5 rounded-xl bg-stone-900 text-[#AFDFE4] text-xs font-bold hover:bg-stone-800 transition-colors flex items-center space-x-1 shadow-2xs cursor-pointer"
                    >
                      <span>表示・保存</span>
                      <ExternalLink className="w-3 h-3" />
                    </button>
                  ) : (
                    <button
                      onClick={() => setActiveTab('home')}
                      className="px-3 py-1.5 rounded-xl bg-stone-200 hover:bg-stone-300 text-stone-600 text-xs font-semibold transition-colors cursor-pointer"
                    >
                      学習する
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
