import React, { useState } from 'react';
import { ManualManager } from './ManualManager';
import { QuestionGenerator } from './QuestionGenerator';
import { BookOpen, Sparkles, ShieldCheck } from 'lucide-react';

export const AdminDashboard: React.FC = () => {
  const [adminTab, setAdminTab] = useState<'manuals' | 'generator'>('manuals');

  return (
    <div className="pb-24 pt-4 px-4 max-w-2xl mx-auto space-y-6">
      {/* ダッシュボードヘッダー */}
      <div className="bg-stone-900 text-white rounded-2xl p-5 shadow-sm border border-stone-800">
        <div className="flex items-center space-x-2 text-[#AFDFE4] text-xs font-bold uppercase tracking-wider mb-1">
          <ShieldCheck className="w-4 h-4" />
          <span>管理者コンソール（Role: Admin）</span>
        </div>
        <h2 className="text-xl font-extrabold tracking-tight">
          ホール業務マニュアル & 問題管理ダッシュボード
        </h2>
        <p className="text-xs text-stone-300 mt-1">
          マニュアルの版管理（旧版復元）と、マニュアル内容に基づく実践的4択問題の自動生成・承認・学習ツリー公開を行います。
        </p>

        {/* タブ切り替え */}
        <div className="flex space-x-2 mt-4 pt-3 border-t border-stone-800">
          <button
            onClick={() => setAdminTab('manuals')}
            className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center space-x-1.5 transition-all cursor-pointer ${
              adminTab === 'manuals'
                ? 'bg-[#AFDFE4] text-stone-900 shadow-sm'
                : 'text-stone-300 hover:text-white hover:bg-stone-800'
            }`}
          >
            <BookOpen className="w-4 h-4" />
            <span>マニュアル版管理（登録・履歴復元）</span>
          </button>

          <button
            onClick={() => setAdminTab('generator')}
            className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center space-x-1.5 transition-all cursor-pointer ${
              adminTab === 'generator'
                ? 'bg-[#AFDFE4] text-stone-900 shadow-sm'
                : 'text-stone-300 hover:text-white hover:bg-stone-800'
            }`}
          >
            <Sparkles className="w-4 h-4" />
            <span>4択問題の自動生成・公開</span>
          </button>
        </div>
      </div>

      {/* タブコンテンツ */}
      {adminTab === 'manuals' ? <ManualManager /> : <QuestionGenerator />}
    </div>
  );
};
