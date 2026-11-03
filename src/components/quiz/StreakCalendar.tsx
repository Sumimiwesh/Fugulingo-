import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  X,
  Flame,
  Calendar as CalendarIcon,
  ChevronLeft,
  ChevronRight,
  Trophy,
  CheckCircle,
} from 'lucide-react';

interface StreakCalendarModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const StreakCalendarModal: React.FC<StreakCalendarModalProps> = ({
  isOpen,
  onClose,
}) => {
  const { streak } = useApp();
  const [currentDate, setCurrentDate] = useState<Date>(new Date());

  if (!isOpen) return null;

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth(); // 0-indexed

  // 月の日数を計算
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDayOfWeek = new Date(year, month, 1).getDay(); // 0: 日曜

  const handlePrevMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1));
  };

  const dayLabels = ['日', '月', '火', '水', '木', '金', '土'];

  // 日付文字列生成 (YYYY-MM-DD)
  const formatKey = (day: number) => {
    const mm = String(month + 1).padStart(2, '0');
    const dd = String(day).padStart(2, '0');
    return `${year}-${mm}-${dd}`;
  };

  const todayStr = new Date().toISOString().split('T')[0];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in duration-200">
      <div className="bg-[#FFFEF6] w-full max-w-md rounded-3xl border border-stone-200 shadow-2xl overflow-hidden flex flex-col">
        {/* ヘッダー */}
        <div className="px-5 py-4 border-b border-stone-200/80 flex items-center justify-between bg-white">
          <div className="flex items-center space-x-2">
            <div className="p-1.5 rounded-xl bg-amber-50 text-amber-500">
              <Flame className="w-5 h-5 fill-amber-500" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-stone-800">連続学習カレンダー</h3>
              <p className="text-[10px] text-stone-500 font-medium">
                日々のマイクロトレーニング記録
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-full text-stone-400 hover:text-stone-700 hover:bg-stone-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* ストリークサマリーバナー */}
        <div className="p-4 bg-gradient-to-r from-amber-500/10 via-[#AFDFE4]/30 to-amber-500/10 border-b border-stone-200/60">
          <div className="grid grid-cols-3 gap-2 text-center">
            <div className="bg-white/90 p-2.5 rounded-2xl border border-stone-200/70 shadow-2xs">
              <span className="text-[10px] text-stone-500 font-bold block">現在の連続</span>
              <div className="flex items-center justify-center space-x-1 mt-0.5">
                <Flame className="w-4 h-4 text-amber-500 fill-amber-500" />
                <span className="text-lg font-extrabold text-stone-800">
                  {streak.currentStreak}
                  <span className="text-xs font-bold text-stone-500 ml-0.5">日</span>
                </span>
              </div>
            </div>

            <div className="bg-white/90 p-2.5 rounded-2xl border border-stone-200/70 shadow-2xs">
              <span className="text-[10px] text-stone-500 font-bold block">最長記録</span>
              <div className="flex items-center justify-center space-x-1 mt-0.5">
                <Trophy className="w-4 h-4 text-amber-600" />
                <span className="text-lg font-extrabold text-stone-800">
                  {streak.longestStreak}
                  <span className="text-xs font-bold text-stone-500 ml-0.5">日</span>
                </span>
              </div>
            </div>

            <div className="bg-white/90 p-2.5 rounded-2xl border border-stone-200/70 shadow-2xs">
              <span className="text-[10px] text-stone-500 font-bold block">累計学習日数</span>
              <div className="flex items-center justify-center space-x-1 mt-0.5">
                <CalendarIcon className="w-4 h-4 text-[#4AA3AE]" />
                <span className="text-lg font-extrabold text-stone-800">
                  {streak.totalDaysStudied}
                  <span className="text-xs font-bold text-stone-500 ml-0.5">日</span>
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* カレンダーコントロール */}
        <div className="px-5 pt-4 pb-2 flex items-center justify-between">
          <span className="text-sm font-bold text-stone-800">
            {year}年 {month + 1}月
          </span>
          <div className="flex items-center space-x-1">
            <button
              onClick={handlePrevMonth}
              className="p-1.5 rounded-lg border border-stone-200 hover:bg-stone-100 text-stone-600 transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={handleNextMonth}
              className="p-1.5 rounded-lg border border-stone-200 hover:bg-stone-100 text-stone-600 transition-colors"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* 月間カレンダーグリッド */}
        <div className="px-5 pb-5 flex-1">
          {/* 曜日ヘッダー */}
          <div className="grid grid-cols-7 gap-1 text-center mb-1.5">
            {dayLabels.map((label, idx) => (
              <span
                key={label}
                className={`text-[11px] font-bold py-1 ${
                  idx === 0
                    ? 'text-rose-500'
                    : idx === 6
                    ? 'text-sky-500'
                    : 'text-stone-400'
                }`}
              >
                {label}
              </span>
            ))}
          </div>

          {/* 日付セル */}
          <div className="grid grid-cols-7 gap-1">
            {/* 月初めの空白 */}
            {Array.from({ length: firstDayOfWeek }).map((_, i) => (
              <div key={`empty-${i}`} className="h-10" />
            ))}

            {/* 当月の日付 */}
            {Array.from({ length: daysInMonth }).map((_, i) => {
              const day = i + 1;
              const dateStr = formatKey(day);
              const studyRecord = streak.studyRecords[dateStr];
              const isStudied =
                !!studyRecord ||
                // 本日または過去の利用があればハイライト
                (dateStr === todayStr && streak.currentStreak > 0);
              const isToday = dateStr === todayStr;

              return (
                <div
                  key={dateStr}
                  className={`h-11 rounded-xl flex flex-col items-center justify-center relative transition-all border ${
                    isStudied
                      ? 'bg-[#AFDFE4]/40 border-[#AFDFE4] text-stone-900 font-bold shadow-2xs'
                      : 'bg-white border-stone-100 text-stone-600'
                  } ${isToday ? 'ring-2 ring-stone-800' : ''}`}
                >
                  <span className="text-xs leading-none">{day}</span>
                  {isStudied && (
                    <div className="mt-1 flex items-center justify-center">
                      <div className="w-1.5 h-1.5 rounded-full bg-[#2C6268]" />
                    </div>
                  )}
                  {isToday && (
                    <span className="text-[8px] font-bold text-stone-500 absolute -top-1.5 px-1 bg-white rounded-full border border-stone-200">
                      今日
                    </span>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* 閉じるボタン */}
        <div className="p-4 bg-white border-t border-stone-200/80">
          <button
            onClick={onClose}
            className="w-full py-2.5 rounded-2xl bg-stone-900 text-white font-bold text-xs hover:bg-stone-800 transition-colors cursor-pointer"
          >
            閉じる
          </button>
        </div>
      </div>
    </div>
  );
};
