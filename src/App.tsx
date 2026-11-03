import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Header } from './components/common/Header';
import { BottomNav } from './components/common/BottomNav';
import { LearningTree } from './components/quiz/LearningTree';
import { QuizModal } from './components/quiz/QuizModal';
import { StreakCalendarModal } from './components/quiz/StreakCalendar';
import { CertificateModal } from './components/certificate/CertificateModal';
import { CertificateListView } from './components/certificate/CertificateListView';
import { CommunityView } from './components/community/CommunityView';
import { AdminDashboard } from './components/admin/AdminDashboard';
import { SettingsView } from './components/settings/SettingsView';
import { LoginModal } from './components/auth/LoginModal';
import { ProfileEditModal } from './components/profile/ProfileEditModal';

const MainLayout: React.FC = () => {
  const {
    activeTab,
    isCalendarOpen,
    setIsCalendarOpen,
    isProfileEditOpen,
    setIsProfileEditOpen,
    currentCertificate,
    closeCertificateModal,
    activeQuizStep,
  } = useApp();

  return (
    <div className="min-h-screen bg-[#FFFEF6] text-stone-800 font-sans antialiased selection:bg-[#AFDFE4]/50 selection:text-stone-900">
      {/* 画面ヘッダー */}
      <Header onOpenCalendar={() => setIsCalendarOpen(true)} />

      {/* メイン画面コンテンツ（モバイルファースト・PC中央コンテナ） */}
      <main className="min-h-[calc(100vh-120px)]">
        {activeTab === 'home' && <LearningTree />}
        {activeTab === 'community' && <CommunityView />}
        {activeTab === 'certificates' && <CertificateListView />}
        {activeTab === 'admin' && <AdminDashboard />}
        {activeTab === 'settings' && <SettingsView />}
      </main>

      {/* 下部ナビゲーションバー */}
      <BottomNav />

      {/* グローバルモーダル */}
      {activeQuizStep && <QuizModal />}
      <StreakCalendarModal
        isOpen={isCalendarOpen}
        onClose={() => setIsCalendarOpen(false)}
      />
      <CertificateModal
        certificate={currentCertificate}
        onClose={closeCertificateModal}
      />
      <LoginModal />
      <ProfileEditModal
        isOpen={isProfileEditOpen}
        onClose={() => setIsProfileEditOpen(false)}
      />
    </div>
  );
};

export function App() {
  return (
    <AppProvider>
      <MainLayout />
    </AppProvider>
  );
}

export default App;
