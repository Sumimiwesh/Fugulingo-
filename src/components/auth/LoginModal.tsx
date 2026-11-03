import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { X, CheckCircle2, ShieldCheck, Flame, Award } from 'lucide-react';

export const LoginModal: React.FC = () => {
  const { isLoginModalOpen, setIsLoginModalOpen, loginWithGoogle } = useApp();
  const [isLoading, setIsLoading] = useState<boolean>(false);

  if (!isLoginModalOpen) return null;

  const handleGoogleLogin = async () => {
    try {
      setIsLoading(true);
      await loginWithGoogle();
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in duration-200">
      <div className="bg-[#FFFEF6] w-full max-w-sm rounded-3xl border border-stone-200 shadow-2xl p-6 flex flex-col relative text-center">
        {/* 閉じるボタン */}
        <button
          onClick={() => setIsLoginModalOpen(false)}
          className="absolute top-4 right-4 p-1 rounded-full text-stone-400 hover:text-stone-700 hover:bg-stone-100 transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* ロゴアイコン */}
        <div className="w-16 h-16 rounded-full border-2 border-[#AFDFE4] p-1 mx-auto shadow-xs bg-white mb-3">
          <img
            src="/logo.jpg"
            alt="Fugulingo"
            className="w-full h-full object-cover rounded-full"
          />
        </div>

        <h3 className="text-lg font-extrabold text-stone-900 tracking-tight">
          Fugulingoにログイン
        </h3>
        <p className="text-xs text-stone-500 mt-1 mb-5">
          Googleアカウントでログインすると、あなた専用の学習進捗と連続記録を安全に保持できます。
        </p>

        {/* 特徴リスト */}
        <div className="bg-white rounded-2xl border border-stone-200/90 p-3.5 mb-5 text-left space-y-2 text-xs text-stone-700">
          <div className="flex items-center space-x-2">
            <Flame className="w-4 h-4 text-amber-500 shrink-0" />
            <span className="font-medium">連続学習日数（ストリーク）を個別保持</span>
          </div>
          <div className="flex items-center space-x-2">
            <Award className="w-4 h-4 text-amber-500 shrink-0" />
            <span className="font-medium">獲得した修了証をいつでも閲覧・PNG保存</span>
          </div>
          <div className="flex items-center space-x-2">
            <ShieldCheck className="w-4 h-4 text-[#4AA3AE] shrink-0" />
            <span className="font-medium">スマホやPCなど端末が変わっても同期</span>
          </div>
        </div>

        {/* Googleログインボタン */}
        <button
          disabled={isLoading}
          onClick={handleGoogleLogin}
          className="w-full py-3.5 px-4 rounded-2xl bg-white hover:bg-stone-50 border border-stone-300 text-stone-800 font-bold text-xs shadow-xs hover:shadow-sm active:scale-98 transition-all flex items-center justify-center space-x-3 cursor-pointer disabled:opacity-60"
        >
          {/* Google G Logo SVG */}
          <svg className="w-4 h-4" viewBox="0 0 24 24">
            <path
              fill="#4285F4"
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
            />
            <path
              fill="#34A853"
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            />
            <path
              fill="#FBBC05"
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
            />
            <path
              fill="#EA4335"
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
            />
          </svg>
          <span>{isLoading ? 'ログイン処理中...' : 'Googleアカウントでログイン'}</span>
        </button>

        <p className="text-[10px] text-stone-400 mt-3">
          ※ログインしなくてもゲストとしてすぐに学習を始められます
        </p>
      </div>
    </div>
  );
};
