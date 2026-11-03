import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Users,
  Trophy,
  Flame,
  Award,
  Sparkles,
  Heart,
  Clock,
  CheckCircle2,
  ThumbsUp,
} from 'lucide-react';

export const CommunityView: React.FC = () => {
  const { leaderboard, activities, toggleLikeActivity, user, streak } = useApp();
  const [subTab, setSubTab] = useState<'ranking' | 'timeline'>('ranking');

  return (
    <div className="pb-24 pt-4 px-4 max-w-md mx-auto space-y-5">
      {/* 画面ヘッダー */}
      <div>
        <h2 className="text-xl font-extrabold text-stone-800 tracking-tight flex items-center space-x-2">
          <Users className="w-5 h-5 text-[#4AA3AE]" />
          <span>仲間たちの学習記録</span>
        </h2>
        <p className="text-xs text-stone-500 mt-1">
          店舗の仲間がどれくらい頑張っているか確認して、一緒にモチベーションを高めましょう！
        </p>
      </div>

      {/* サブタブ切り替え */}
      <div className="flex bg-stone-100 p-1 rounded-2xl border border-stone-200/80">
        <button
          onClick={() => setSubTab('ranking')}
          className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center space-x-1.5 cursor-pointer ${
            subTab === 'ranking'
              ? 'bg-white text-stone-900 shadow-2xs'
              : 'text-stone-500 hover:text-stone-700'
          }`}
        >
          <Trophy className="w-3.5 h-3.5 text-amber-500" />
          <span>連続学習ランキング</span>
        </button>

        <button
          onClick={() => setSubTab('timeline')}
          className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center space-x-1.5 cursor-pointer ${
            subTab === 'timeline'
              ? 'bg-white text-stone-900 shadow-2xs'
              : 'text-stone-500 hover:text-stone-700'
          }`}
        >
          <Sparkles className="w-3.5 h-3.5 text-[#2C6268]" />
          <span>応援タイムライン</span>
        </button>
      </div>

      {/* 1. ランキング表示 */}
      {subTab === 'ranking' && (
        <div className="space-y-3">
          {/* トップ3 表彰台カード（上位3名） */}
          <div className="bg-gradient-to-b from-[#AFDFE4]/30 via-white to-white rounded-3xl border border-stone-200 p-4 shadow-xs">
            <span className="text-[11px] font-bold text-stone-500 uppercase tracking-wider block text-center mb-3">
              今週のストリークトップランカー 🔥
            </span>

            <div className="flex items-end justify-center space-x-3 pt-2 pb-1">
              {/* 2位 */}
              {leaderboard[1] && (
                <div className="flex flex-col items-center flex-1">
                  <div className="w-12 h-12 rounded-full border-2 border-stone-300 overflow-hidden bg-white shadow-xs relative">
                    {leaderboard[1].photoURL ? (
                      <img
                        src={leaderboard[1].photoURL}
                        alt={leaderboard[1].displayName}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-stone-600 font-bold text-xs bg-stone-100">
                        {leaderboard[1].displayName.slice(0, 1)}
                      </div>
                    )}
                    <span className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-stone-300 text-stone-800 text-[10px] font-extrabold flex items-center justify-center border border-white">
                      2
                    </span>
                  </div>
                  <span className="text-xs font-bold text-stone-800 mt-1.5 truncate max-w-[80px]">
                    {leaderboard[1].displayName}
                  </span>
                  <span className="text-[11px] font-extrabold text-amber-600 flex items-center space-x-0.5">
                    <Flame className="w-3 h-3 fill-amber-500 text-amber-500" />
                    <span>{leaderboard[1].streakDays}日</span>
                  </span>
                </div>
              )}

              {/* 1位（ゴールド王冠） */}
              {leaderboard[0] && (
                <div className="flex flex-col items-center flex-1 -translate-y-2">
                  <div className="relative">
                    <div className="w-16 h-16 rounded-full border-2 border-amber-400 ring-4 ring-amber-400/20 overflow-hidden bg-white shadow-md">
                      {leaderboard[0].photoURL ? (
                        <img
                          src={leaderboard[0].photoURL}
                          alt={leaderboard[0].displayName}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-amber-700 font-bold text-sm bg-amber-50">
                          {leaderboard[0].displayName.slice(0, 1)}
                        </div>
                      )}
                    </div>
                    <span className="absolute -top-3 left-1/2 -translate-x-1/2 text-lg">
                      👑
                    </span>
                    <span className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-amber-400 text-stone-900 text-xs font-extrabold flex items-center justify-center border border-white shadow-xs">
                      1
                    </span>
                  </div>
                  <span className="text-xs font-extrabold text-stone-900 mt-1.5 truncate max-w-[90px]">
                    {leaderboard[0].displayName}
                  </span>
                  <span className="text-xs font-black text-amber-600 flex items-center space-x-0.5">
                    <Flame className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
                    <span>{leaderboard[0].streakDays}日連続</span>
                  </span>
                </div>
              )}

              {/* 3位 */}
              {leaderboard[2] && (
                <div className="flex flex-col items-center flex-1">
                  <div className="w-12 h-12 rounded-full border-2 border-amber-600/40 overflow-hidden bg-white shadow-xs relative">
                    {leaderboard[2].photoURL ? (
                      <img
                        src={leaderboard[2].photoURL}
                        alt={leaderboard[2].displayName}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-stone-600 font-bold text-xs bg-stone-100">
                        {leaderboard[2].displayName.slice(0, 1)}
                      </div>
                    )}
                    <span className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-amber-700 text-white text-[10px] font-extrabold flex items-center justify-center border border-white">
                      3
                    </span>
                  </div>
                  <span className="text-xs font-bold text-stone-800 mt-1.5 truncate max-w-[80px]">
                    {leaderboard[2].displayName}
                  </span>
                  <span className="text-[11px] font-extrabold text-amber-600 flex items-center space-x-0.5">
                    <Flame className="w-3 h-3 fill-amber-500 text-amber-500" />
                    <span>{leaderboard[2].streakDays}日</span>
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* ランキングリスト一覧 */}
          <div className="space-y-2">
            {leaderboard.map((member) => {
              const isMe = member.isCurrentUser;

              return (
                <div
                  key={member.uid}
                  className={`p-3 rounded-2xl border transition-all flex items-center justify-between ${
                    isMe
                      ? 'bg-[#AFDFE4]/20 border-[#4AA3AE] ring-2 ring-[#AFDFE4] shadow-xs'
                      : 'bg-white border-stone-200'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <span
                      className={`w-6 text-center text-xs font-extrabold ${
                        member.rank === 1
                          ? 'text-amber-500'
                          : member.rank === 2
                          ? 'text-stone-400'
                          : member.rank === 3
                          ? 'text-amber-700'
                          : 'text-stone-400'
                      }`}
                    >
                      {member.rank}
                    </span>

                    <div className="w-9 h-9 rounded-full overflow-hidden border border-stone-200 bg-stone-100 shrink-0">
                      {member.photoURL ? (
                        <img
                          src={member.photoURL}
                          alt={member.displayName}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-stone-600 font-bold text-xs">
                          {member.displayName.slice(0, 1)}
                        </div>
                      )}
                    </div>

                    <div>
                      <div className="flex items-center space-x-1.5">
                        <span className="text-xs font-bold text-stone-900 leading-tight">
                          {member.displayName}
                        </span>
                        {isMe && (
                          <span className="text-[9px] font-extrabold px-1.5 py-0.2 rounded-full bg-stone-800 text-white">
                            YOU
                          </span>
                        )}
                      </div>
                      <span className="text-[10px] text-stone-400">
                        累計 {member.totalQuestions}問クリア / 修了証 {member.certificatesCount}枚
                      </span>
                    </div>
                  </div>

                  {/* 連続日数バッジ */}
                  <div className="flex items-center space-x-1 bg-amber-50 border border-amber-200/80 px-2.5 py-1 rounded-full">
                    <Flame className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                    <span className="text-xs font-extrabold text-stone-800">
                      {member.streakDays}
                      <span className="text-[10px] font-medium text-stone-500 ml-0.5">日</span>
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* 2. 応援タイムライン表示 */}
      {subTab === 'timeline' && (
        <div className="space-y-3">
          {activities.map((act) => {
            const timeAgo = formatTimeAgo(act.timestamp);

            return (
              <div
                key={act.id}
                className="bg-white rounded-2xl border border-stone-200 p-4 shadow-xs space-y-2.5 transition-all hover:border-[#AFDFE4]"
              >
                {/* 投稿者ヘッダー */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <div className="w-8 h-8 rounded-full border border-stone-200 overflow-hidden bg-stone-100 shrink-0">
                      {act.userPhotoURL ? (
                        <img
                          src={act.userPhotoURL}
                          alt={act.userName}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-stone-600 font-bold text-xs">
                          {act.userName.slice(0, 1)}
                        </div>
                      )}
                    </div>
                    <div>
                      <span className="text-xs font-bold text-stone-800 block leading-tight">
                        {act.userName}
                      </span>
                      <span className="text-[10px] text-stone-400 flex items-center space-x-0.5">
                        <Clock className="w-2.5 h-2.5" />
                        <span>{timeAgo}</span>
                      </span>
                    </div>
                  </div>

                  {/* タイプバッジ */}
                  {act.type === 'certificate' ? (
                    <span className="px-2 py-0.5 rounded-full bg-amber-50 border border-amber-200 text-amber-700 text-[10px] font-bold flex items-center space-x-1">
                      <Award className="w-3 h-3" />
                      <span>修了証獲得</span>
                    </span>
                  ) : act.type === 'streak' ? (
                    <span className="px-2 py-0.5 rounded-full bg-rose-50 border border-rose-200 text-rose-700 text-[10px] font-bold flex items-center space-x-1">
                      <Flame className="w-3 h-3 fill-rose-500" />
                      <span>継続記録</span>
                    </span>
                  ) : (
                    <span className="px-2 py-0.5 rounded-full bg-[#AFDFE4]/30 border border-[#AFDFE4] text-[#2C6268] text-[10px] font-bold flex items-center space-x-1">
                      <CheckCircle2 className="w-3 h-3" />
                      <span>合格達成</span>
                    </span>
                  )}
                </div>

                {/* 内容 */}
                <div className="bg-stone-50/70 p-3 rounded-xl border border-stone-100 text-xs">
                  <p className="font-bold text-stone-800">{act.title}</p>
                  <p className="text-stone-600 mt-0.5 text-[11px] leading-relaxed">
                    {act.detail}
                  </p>
                </div>

                {/* 応援・拍手ボタン */}
                <div className="flex items-center justify-end pt-1">
                  <button
                    onClick={() => toggleLikeActivity(act.id)}
                    className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer active:scale-95 ${
                      act.likedByMe
                        ? 'bg-rose-50 border border-rose-300 text-rose-600 ring-2 ring-rose-200'
                        : 'bg-stone-50 hover:bg-stone-100 border border-stone-200 text-stone-600'
                    }`}
                  >
                    <span className="text-sm">👏</span>
                    <span>ナイス！</span>
                    <span
                      className={`text-[11px] font-extrabold ${
                        act.likedByMe ? 'text-rose-600' : 'text-stone-500'
                      }`}
                    >
                      {act.likesCount}
                    </span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

// 時間表記ヘルパー
function formatTimeAgo(isoString: string): string {
  const diffSec = Math.floor((Date.now() - new Date(isoString).getTime()) / 1000);
  if (diffSec < 60) return 'たった今';
  const diffMin = Math.floor(diffSec / 60);
  if (diffMin < 60) return `${diffMin}分前`;
  const diffHour = Math.floor(diffMin / 60);
  if (diffHour < 24) return `${diffHour}時間前`;
  const diffDay = Math.floor(diffHour / 24);
  return `${diffDay}日前`;
}
