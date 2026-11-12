import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { UserRole } from '../../types/auth';
import {
  X,
  CheckCircle2,
  ShieldCheck,
  Flame,
  Award,
  ChefHat,
  Briefcase,
  Sparkles,
  ArrowRight,
} from 'lucide-react';

export const LoginModal: React.FC = () => {
  const { isLoginModalOpen, setIsLoginModalOpen, loginWithGoogle, startAsGuest, user } = useApp();
  const [selectedRole, setSelectedRole] = useState<UserRole>(user.role || 'staff');
  const [isLoading, setIsLoading] = useState<boolean>(false);

  if (!isLoginModalOpen) return null;

  const handleGoogleLogin = async (role: UserRole) => {
    try {
      setIsLoading(true);
      await loginWithGoogle(role);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGuestStart = (role: UserRole) => {
    startAsGuest(role);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in duration-200">
      <div className="bg-[#FFFEF6] w-full max-w-md rounded-3xl border border-stone-200 shadow-2xl p-6 flex flex-col relative text-center max-h-[92vh] overflow-y-auto">
        {/* 閉じるボタン */}
        <button
          onClick={() => setIsLoginModalOpen(false)}
          className="absolute top-4 right-4 p-1 rounded-full text-stone-400 hover:text-stone-700 hover:bg-stone-100 transition-colors cursor-pointer"
          aria-label="閉じる"
        >
          <X className="w-5 h-5" />
        </button>

        {/* ロゴアイコン */}
        <div className="w-16 h-16 rounded-full border-2 border-[#AFDFE4] p-1 mx-auto shadow-xs bg-white mb-2">
          <img
            src="/logo.jpg"
            alt="Fugulingo"
            className="w-full h-full object-cover rounded-full"
          />
        </div>

        <div className="inline-flex items-center justify-center space-x-1.5 mx-auto bg-[#AFDFE4]/30 text-[#2C6268] text-[11px] font-bold px-3 py-0.5 rounded-full mb-1.5">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Fugulingo へようこそ</span>
        </div>

        <h3 className="text-xl font-extrabold text-stone-900 tracking-tight">
          あなたはアルバイトですか？管理者ですか？
        </h3>
        <p className="text-xs text-stone-500 mt-1 mb-4">
          ご利用の立場を選択してスタートしてください。（後からいつでも切り替えられます）
        </p>

        {/* 立場選択カード (アルバイト vs 管理者) */}
        <div className="grid grid-cols-2 gap-3 mb-4 text-left">
          {/* アルバイト スタッフ */}
          <button
            type="button"
            onClick={() => setSelectedRole('staff')}
            className={`p-3.5 rounded-2xl border-2 transition-all flex flex-col justify-between cursor-pointer text-left relative ${
              selectedRole === 'staff'
                ? 'border-[#2C6268] bg-[#AFDFE4]/25 shadow-sm ring-1 ring-[#2C6268]/20'
                : 'border-stone-200 bg-white hover:border-stone-300'
            }`}
          >
            {selectedRole === 'staff' && (
              <div className="absolute top-2.5 right-2.5">
                <CheckCircle2 className="w-4 h-4 text-[#2C6268]" />
              </div>
            )}
            <div className="w-9 h-9 rounded-xl bg-amber-100 flex items-center justify-center mb-2 text-amber-700">
              <ChefHat className="w-5 h-5" />
            </div>
            <div>
              <span className="block text-xs font-black text-stone-900">
                アルバイト
              </span>
              <span className="block text-[10px] text-stone-500 font-medium mt-0.5 leading-snug">
                ホール接客クイズで学習・連続日数＆修了証の獲得
              </span>
            </div>
          </button>

          {/* 店長・管理者 */}
          <button
            type="button"
            onClick={() => setSelectedRole('admin')}
            className={`p-3.5 rounded-2xl border-2 transition-all flex flex-col justify-between cursor-pointer text-left relative ${
              selectedRole === 'admin'
                ? 'border-[#2C6268] bg-[#AFDFE4]/25 shadow-sm ring-1 ring-[#2C6268]/20'
                : 'border-stone-200 bg-white hover:border-stone-300'
            }`}
          >
            {selectedRole === 'admin' && (
              <div className="absolute top-2.5 right-2.5">
                <CheckCircle2 className="w-4 h-4 text-[#2C6268]" />
              </div>
            )}
            <div className="w-9 h-9 rounded-xl bg-stone-100 flex items-center justify-center mb-2 text-stone-700">
              <Briefcase className="w-5 h-5" />
            </div>
            <div>
              <span className="block text-xs font-black text-stone-900">
                店長・管理者
              </span>
              <span className="block text-[10px] text-stone-500 font-medium mt-0.5 leading-snug">
                店舗マニュアル編集・AI問題生成・スタッフ育成
              </span>
            </div>
          </button>
        </div>

        {/* 役割ごとの特徴ハイライト */}
        <div className="bg-white rounded-2xl border border-stone-200/90 p-3 mb-4 text-left space-y-1.5 text-xs text-stone-700">
          {selectedRole === 'staff' ? (
            <>
              <div className="flex items-center space-x-2">
                <Flame className="w-4 h-4 text-amber-500 shrink-0" />
                <span className="font-medium text-[11px]">
                  毎日の連続学習日数（ストリーク）を記録
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <Award className="w-4 h-4 text-amber-500 shrink-0" />
                <span className="font-medium text-[11px]">
                  合格時に本格ゴールド修了証を発行＆画像保存
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <ShieldCheck className="w-4 h-4 text-[#4AA3AE] shrink-0" />
                <span className="font-medium text-[11px]">
                  とらふぐ亭の実物メニューに完全対応した接客判断力
                </span>
              </div>
            </>
          ) : (
            <>
              <div className="flex items-center space-x-2">
                <Briefcase className="w-4 h-4 text-stone-700 shrink-0" />
                <span className="font-medium text-[11px]">
                  コース・ひれ酒・焼きふぐ等の店舗マニュアル管理
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <Sparkles className="w-4 h-4 text-amber-500 shrink-0" />
                <span className="font-medium text-[11px]">
                  写真や文章から4択クイズ・解説をAIで自動生成
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <ShieldCheck className="w-4 h-4 text-[#4AA3AE] shrink-0" />
                <span className="font-medium text-[11px]">
                  新版マニュアルの公開とバージョン履歴管理
                </span>
              </div>
            </>
          )}
        </div>

        {/* アクションボタン */}
        <div className="space-y-2">
          {/* Googleログインボタン */}
          <button
            type="button"
            disabled={isLoading}
            onClick={() => handleGoogleLogin(selectedRole)}
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
            <span>
              {isLoading
                ? 'ログイン処理中...'
                : selectedRole === 'admin'
                ? '管理者としてGoogleログイン'
                : 'アルバイトとしてGoogleログイン'}
            </span>
          </button>

          {/* ログインせずにゲストで始めるボタン */}
          <button
            type="button"
            onClick={() => handleGuestStart(selectedRole)}
            className="w-full py-2.5 px-4 rounded-xl bg-stone-100 hover:bg-stone-200/80 text-stone-700 font-bold text-xs transition-colors flex items-center justify-center space-x-1.5 cursor-pointer"
          >
            <span>
              {selectedRole === 'admin'
                ? 'ログインせずに管理者画面を体験（ゲスト）'
                : 'ログインせずにすぐ学習を始める（ゲスト）'}
            </span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <p className="text-[10px] text-stone-400 mt-3 leading-tight">
          ※Googleアカウントでログインすると、スマホ・PCなどの端末が変わっても連続学習記録や修了証が安全に保持されます。
        </p>
      </div>
    </div>
  );
};
