import React from 'react';
import { useApp } from '../../context/AppContext';
import { Flame, ShieldCheck, User, LogIn, LogOut } from 'lucide-react';

interface HeaderProps {
  onOpenCalendar?: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onOpenCalendar }) => {
  const {
    user,
    streak,
    activeTab,
    setActiveTab,
    setIsLoginModalOpen,
    setIsProfileEditOpen,
  } = useApp();

  const isGoogleUser = user.email && user.email.includes('@');

  return (
    <header className="sticky top-0 z-30 bg-[#FFFEF6]/95 backdrop-blur-md border-b border-stone-200/80 px-4 py-2.5">
      <div className="max-w-md mx-auto flex items-center justify-between">
        {/* 左上: アップロードされたFugulingoロゴ画像を円形に切り取って配置 */}
        <div
          onClick={() => setActiveTab('home')}
          className="flex items-center space-x-2.5 cursor-pointer group select-none"
        >
          <div className="w-10 h-10 rounded-full border border-stone-200/90 bg-white shadow-xs overflow-hidden flex items-center justify-center shrink-0 transition-transform duration-200 group-hover:scale-105">
            <img
              src="/logo.jpg"
              alt="Fugulingo Logo"
              className="w-full h-full object-cover object-center"
              onError={(e) => {
                // 画像が万が一読めない場合のSVGフォールバック
                e.currentTarget.style.display = 'none';
              }}
            />
          </div>

          <div className="flex flex-col">
            <div className="flex items-center space-x-1.5">
              <span className="font-extrabold tracking-tight text-stone-800 text-lg leading-tight">
                Fugulingo
              </span>
              {user.role === 'admin' && (
                <span className="text-[10px] font-semibold tracking-wide uppercase px-1.5 py-0.5 rounded-full bg-stone-800 text-[#AFDFE4] shadow-2xs">
                  ADMIN
                </span>
              )}
            </div>
            <span className="text-[10px] text-stone-500 font-medium leading-none">
              ホール業務ラーニング
            </span>
          </div>
        </div>

        {/* 右側: ストリーク表示 & Googleログイン/アカウント */}
        <div className="flex items-center space-x-2">
          {/* ストリークカウンター（炎ボタン） */}
          <button
            onClick={onOpenCalendar}
            className="flex items-center space-x-1.5 px-2.5 py-1 rounded-full bg-white border border-stone-200 hover:border-[#AFDFE4] shadow-xs active:scale-95 transition-all cursor-pointer"
            title="学習カレンダーを見る"
          >
            <Flame className="w-4 h-4 text-amber-500 fill-amber-500 animate-pulse" />
            <span className="text-xs font-bold text-stone-700">
              {streak.currentStreak}日
            </span>
          </button>

          {/* Googleログインボタン または ユーザーアイコン */}
          {isGoogleUser ? (
            <div className="flex items-center space-x-1">
              <button
                onClick={() => setIsProfileEditOpen(true)}
                className="w-8 h-8 rounded-full border border-stone-200 overflow-hidden bg-[#AFDFE4]/30 flex items-center justify-center text-xs font-bold text-stone-700 hover:ring-2 hover:ring-[#AFDFE4] transition-all cursor-pointer"
                title={`${user.displayName || 'スタッフ'} (クリックでアイコン・名前変更)`}
              >
                {user.photoURL ? (
                  <img
                    src={user.photoURL}
                    alt={user.displayName || 'User'}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span>{user.displayName?.slice(0, 1) || 'U'}</span>
                )}
              </button>
            </div>
          ) : (
            <button
              onClick={() => setIsLoginModalOpen(true)}
              className="px-2.5 py-1 rounded-full bg-white hover:bg-stone-50 border border-stone-300 text-stone-700 text-xs font-bold flex items-center space-x-1 shadow-2xs transition-all active:scale-95 cursor-pointer"
              title="Googleアカウントでログインして記録を保持"
            >
              <LogIn className="w-3.5 h-3.5 text-[#2C6268]" />
              <span className="text-[11px]">ログイン</span>
            </button>
          )}

          {/* 管理者ダッシュボードへのリンク (管理者のみ) */}
          {user.role === 'admin' && (
            <button
              onClick={() => setActiveTab(activeTab === 'admin' ? 'home' : 'admin')}
              className={`p-1.5 rounded-full text-xs font-semibold flex items-center justify-center transition-all ${
                activeTab === 'admin'
                  ? 'bg-stone-800 text-[#AFDFE4] ring-2 ring-[#AFDFE4]/50'
                  : 'bg-[#AFDFE4]/30 hover:bg-[#AFDFE4]/50 text-stone-800 border border-[#AFDFE4]'
              }`}
              title={activeTab === 'admin' ? '学習ツリーへ' : '管理者画面へ'}
            >
              <ShieldCheck className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </header>
  );
};
