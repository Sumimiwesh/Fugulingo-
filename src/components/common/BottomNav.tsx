import React from 'react';
import { useApp, AppNavTab } from '../../context/AppContext';
import { Compass, Users, Award, Settings, ShieldCheck } from 'lucide-react';

export const BottomNav: React.FC = () => {
  const { activeTab, setActiveTab, user, certificates } = useApp();

  const navItems = [
    {
      id: 'home' as AppNavTab,
      label: 'ホーム',
      icon: Compass,
      badge: null,
    },
    {
      id: 'community' as AppNavTab,
      label: '仲間',
      icon: Users,
      badge: null,
    },
    {
      id: 'certificates' as AppNavTab,
      label: '修了証',
      icon: Award,
      badge: certificates.length > 0 ? certificates.length : null,
    },
    {
      id: 'settings' as AppNavTab,
      label: '設定',
      icon: Settings,
      badge: null,
    },
  ];

  // 管理者の場合は管理タブも表示
  if (user.role === 'admin') {
    navItems.splice(3, 0, {
      id: 'admin' as AppNavTab,
      label: '管理画面',
      icon: ShieldCheck,
      badge: null,
    });
  }

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-30 bg-[#FFFEF6]/95 backdrop-blur-md border-t border-stone-200/80 px-2 py-1.5">
      <div className="max-w-md mx-auto flex items-center justify-around">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;

          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`flex flex-col items-center justify-center py-1 px-2.5 rounded-xl transition-all relative cursor-pointer ${
                isActive
                  ? 'text-stone-900 font-bold'
                  : 'text-stone-400 hover:text-stone-600 font-medium'
              }`}
            >
              <div
                className={`w-10 h-7 flex items-center justify-center rounded-full transition-all ${
                  isActive ? 'bg-[#AFDFE4]/40 text-stone-900 scale-105' : 'text-stone-400'
                }`}
              >
                <Icon className={`w-5 h-5 ${isActive ? 'stroke-[2.5]' : 'stroke-2'}`} />
              </div>
              <span className="text-[10px] mt-0.5 tracking-tight">{item.label}</span>

              {item.badge !== null && (
                <span className="absolute top-0 right-1 w-4 h-4 bg-amber-500 text-white text-[9px] font-bold rounded-full flex items-center justify-center">
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
};
