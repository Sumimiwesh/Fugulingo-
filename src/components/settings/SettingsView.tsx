import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  getActiveFirebaseConfig,
  saveFirebaseConfigToStorage,
  clearFirebaseConfigFromStorage,
  isFirebaseLive,
} from '../../config/firebase';
import {
  Settings as SettingsIcon,
  User,
  ShieldCheck,
  Database,
  RotateCcw,
  Sparkles,
  Info,
  CheckCircle,
  LogIn,
  LogOut,
  Camera,
  Server,
  CloudCheck,
  Key,
  ExternalLink,
} from 'lucide-react';

export const SettingsView: React.FC = () => {
  const {
    user,
    setUserRole,
    resetProgress,
    setIsLoginModalOpen,
    setIsProfileEditOpen,
    logout,
  } = useApp();

  const isGoogleUser = user.email && user.email.includes('@');
  const isCloudLive = isFirebaseLive();

  // Firebase Config設定ステート
  const currentConfig = getActiveFirebaseConfig();
  const [apiKey, setApiKey] = useState<string>(currentConfig?.apiKey || '');
  const [projectId, setProjectId] = useState<string>(currentConfig?.projectId || '');
  const [authDomain, setAuthDomain] = useState<string>(currentConfig?.authDomain || '');
  const [storageBucket, setStorageBucket] = useState<string>(currentConfig?.storageBucket || '');
  const [isFirebaseFormOpen, setIsFirebaseFormOpen] = useState<boolean>(false);
  const [configSuccessMessage, setConfigSuccessMessage] = useState<string>('');

  const handleSaveFirebaseConfig = (e: React.FormEvent) => {
    e.preventDefault();
    if (!apiKey.trim() || !projectId.trim()) {
      alert('API Key と Project ID は必須です');
      return;
    }

    saveFirebaseConfigToStorage({
      apiKey: apiKey.trim(),
      projectId: projectId.trim(),
      authDomain: authDomain.trim() || `${projectId.trim()}.firebaseapp.com`,
      storageBucket: storageBucket.trim() || `${projectId.trim()}.appspot.com`,
      messagingSenderId: '',
      appId: '',
    });

    setConfigSuccessMessage('設定を保存しました！ページを再読み込みして接続します...');
    setTimeout(() => {
      window.location.reload();
    }, 1200);
  };

  const handleClearFirebaseConfig = () => {
    if (confirm('Firebase設定をリセットし、スタンドアロンモードに戻しますか？')) {
      clearFirebaseConfigFromStorage();
      window.location.reload();
    }
  };

  const handleReset = async () => {
    if (
      confirm(
        'これまでのクイズ進捗・ストリーク・修了証データを初期化しますか？（テスト用）'
      )
    ) {
      await resetProgress();
      alert('進捗データをリセットしました。');
    }
  };

  return (
    <div className="pb-24 pt-4 px-4 max-w-md mx-auto space-y-6">
      {/* 画面ヘッダー */}
      <div>
        <h2 className="text-xl font-extrabold text-stone-800 tracking-tight flex items-center space-x-2">
          <SettingsIcon className="w-5 h-5 text-stone-600" />
          <span>アカウント & アプリ設定</span>
        </h2>
        <p className="text-xs text-stone-500 mt-1">
          Googleログイン、プロフィール画像の設定、本番Firebase接続を行えます。
        </p>
      </div>

      {/* ユーザープロファイルカード */}
      <div className="bg-white rounded-2xl border border-stone-200 p-5 shadow-xs space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-stone-100">
          <div className="flex items-center space-x-3">
            <div className="w-14 h-14 rounded-full overflow-hidden border-2 border-[#AFDFE4] bg-stone-50 flex items-center justify-center text-stone-800 font-bold text-xl shrink-0 shadow-xs relative group">
              {user.photoURL ? (
                <img
                  src={user.photoURL}
                  alt={user.displayName || 'User'}
                  className="w-full h-full object-cover"
                />
              ) : (
                <span>{user.displayName ? user.displayName.slice(0, 1) : 'F'}</span>
              )}
            </div>
            <div>
              <div className="flex items-center space-x-1.5">
                <span className="text-sm font-bold text-stone-800">
                  {user.displayName}
                </span>
                <span
                  className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                    user.role === 'admin'
                      ? 'bg-stone-900 text-[#AFDFE4]'
                      : 'bg-emerald-100 text-emerald-800'
                  }`}
                >
                  {user.role === 'admin' ? '管理者（Admin）' : 'ホールスタッフ'}
                </span>
              </div>
              <p className="text-xs text-stone-400 font-mono mt-0.5 truncate max-w-[190px]">
                {user.email || 'ゲスト（未ログイン）'}
              </p>
            </div>
          </div>

          {/* プロフィール編集ボタン */}
          <button
            onClick={() => setIsProfileEditOpen(true)}
            className="px-3 py-1.5 rounded-xl border border-stone-300 bg-white hover:bg-stone-50 text-stone-700 text-xs font-bold transition-all flex items-center space-x-1 shadow-2xs cursor-pointer"
          >
            <Camera className="w-3.5 h-3.5 text-[#2C6268]" />
            <span>写真・名前編集</span>
          </button>
        </div>

        {/* ログイン・ログアウト操作 */}
        <div>
          {isGoogleUser ? (
            <div className="flex items-center justify-between bg-stone-50 p-3 rounded-xl border border-stone-200">
              <div className="flex items-center space-x-2">
                <CheckCircle className="w-4 h-4 text-emerald-500" />
                <span className="text-xs text-stone-700 font-bold">
                  Googleアカウント連携中
                </span>
              </div>
              <button
                onClick={logout}
                className="px-3 py-1.5 rounded-lg border border-stone-300 bg-white hover:bg-rose-50 hover:text-rose-600 text-stone-700 text-xs font-bold transition-all flex items-center space-x-1 cursor-pointer"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>ログアウト</span>
              </button>
            </div>
          ) : (
            <button
              onClick={() => setIsLoginModalOpen(true)}
              className="w-full py-3 rounded-xl bg-stone-900 hover:bg-stone-800 text-white font-bold text-xs flex items-center justify-center space-x-2 transition-all cursor-pointer shadow-xs"
            >
              <LogIn className="w-4 h-4 text-[#AFDFE4]" />
              <span>Googleアカウントでログインして記録を保持</span>
            </button>
          )}
        </div>

        {/* ロール切り替えスイッチ */}
        <div className="pt-2">
          <label className="text-xs font-bold text-stone-700 block mb-1.5">
            画面・権限ロールの切り替え（テスト・管理用）
          </label>
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => setUserRole('staff')}
              className={`py-2.5 px-3 rounded-xl border text-xs font-bold flex items-center justify-center space-x-1.5 transition-all cursor-pointer ${
                user.role === 'staff'
                  ? 'bg-emerald-50 border-emerald-400 text-emerald-900 ring-2 ring-emerald-300'
                  : 'bg-stone-50 border-stone-200 text-stone-500 hover:bg-stone-100'
              }`}
            >
              <User className="w-4 h-4" />
              <span>アルバイト画面</span>
            </button>

            <button
              onClick={() => setUserRole('admin')}
              className={`py-2.5 px-3 rounded-xl border text-xs font-bold flex items-center justify-center space-x-1.5 transition-all cursor-pointer ${
                user.role === 'admin'
                  ? 'bg-stone-900 border-stone-800 text-[#AFDFE4] ring-2 ring-[#AFDFE4]/50'
                  : 'bg-stone-50 border-stone-200 text-stone-500 hover:bg-stone-100'
              }`}
            >
              <ShieldCheck className="w-4 h-4" />
              <span>管理者画面</span>
            </button>
          </div>
          <p className="text-[10px] text-stone-400 mt-1.5">
            ※管理者ロールにするとマニュアルの登録・版管理や問題生成が行えます。
          </p>
        </div>
      </div>

      {/* 本番 Firebase 接続設定カード */}
      <div className="bg-white rounded-2xl border border-stone-200 p-5 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Server className="w-4 h-4 text-[#4AA3AE]" />
            <span className="text-xs font-bold text-stone-800">
              Firebase 本番クラウド接続（Spark完全無料枠）
            </span>
          </div>
          <span
            className={`text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center space-x-1 ${
              isCloudLive
                ? 'bg-emerald-100 text-emerald-800'
                : 'bg-stone-100 text-stone-600'
            }`}
          >
            <span className={`w-1.5 h-1.5 rounded-full ${isCloudLive ? 'bg-emerald-500 animate-pulse' : 'bg-stone-400'}`} />
            <span>{isCloudLive ? '本番クラウド稼働中' : 'スタンドアロン稼働中'}</span>
          </span>
        </div>

        <p className="text-xs text-stone-500 leading-relaxed">
          Firebase（Google公式・完全無料Sparkプラン）のプロジェクト設定を登録すると、本物のGoogle認証やFirestoreによる複数端末同期がオンラインで稼働します。
        </p>

        <button
          onClick={() => setIsFirebaseFormOpen(!isFirebaseFormOpen)}
          className="text-xs font-bold text-[#2C6268] hover:underline flex items-center space-x-1 cursor-pointer"
        >
          <span>{isFirebaseFormOpen ? '設定フォームを閉じる' : 'Firebase接続設定を入力・変更する ▼'}</span>
        </button>

        {isFirebaseFormOpen && (
          <form
            onSubmit={handleSaveFirebaseConfig}
            className="p-4 bg-stone-50 rounded-2xl border border-stone-200 space-y-3 pt-3 animate-in fade-in"
          >
            <div className="flex items-center justify-between text-[11px] text-stone-500 mb-1">
              <span>Firebase Console の設定値を入力</span>
              <a
                href="https://console.firebase.google.com/"
                target="_blank"
                rel="noreferrer"
                className="text-[#2C6268] hover:underline flex items-center space-x-0.5"
              >
                <span>Consoleを開く</span>
                <ExternalLink className="w-2.5 h-2.5" />
              </a>
            </div>

            <div>
              <label className="text-[11px] font-bold text-stone-700 block mb-0.5">
                API Key (apiKey)
              </label>
              <input
                type="text"
                required
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                placeholder="AIzaSy..."
                className="w-full px-2.5 py-1.5 rounded-lg border border-stone-300 text-xs bg-white font-mono"
              />
            </div>

            <div>
              <label className="text-[11px] font-bold text-stone-700 block mb-0.5">
                Project ID (projectId)
              </label>
              <input
                type="text"
                required
                value={projectId}
                onChange={(e) => setProjectId(e.target.value)}
                placeholder="your-app-id"
                className="w-full px-2.5 py-1.5 rounded-lg border border-stone-300 text-xs bg-white font-mono"
              />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="text-[11px] font-bold text-stone-700 block mb-0.5">
                  Auth Domain (任意)
                </label>
                <input
                  type="text"
                  value={authDomain}
                  onChange={(e) => setAuthDomain(e.target.value)}
                  placeholder="app.firebaseapp.com"
                  className="w-full px-2.5 py-1.5 rounded-lg border border-stone-300 text-xs bg-white font-mono"
                />
              </div>
              <div>
                <label className="text-[11px] font-bold text-stone-700 block mb-0.5">
                  Storage Bucket (任意)
                </label>
                <input
                  type="text"
                  value={storageBucket}
                  onChange={(e) => setStorageBucket(e.target.value)}
                  placeholder="app.appspot.com"
                  className="w-full px-2.5 py-1.5 rounded-lg border border-stone-300 text-xs bg-white font-mono"
                />
              </div>
            </div>

            {configSuccessMessage && (
              <p className="text-xs text-emerald-600 font-bold">
                {configSuccessMessage}
              </p>
            )}

            <div className="flex space-x-2 pt-2">
              <button
                type="submit"
                className="flex-1 py-2 rounded-xl bg-stone-900 text-[#AFDFE4] text-xs font-bold hover:bg-stone-800 transition-colors shadow-2xs cursor-pointer"
              >
                保存して本番接続
              </button>
              {currentConfig && (
                <button
                  type="button"
                  onClick={handleClearFirebaseConfig}
                  className="px-3 py-2 rounded-xl border border-stone-300 text-stone-500 text-xs font-bold hover:bg-stone-200 transition-colors cursor-pointer"
                >
                  リセット
                </button>
              )}
            </div>
          </form>
        )}
      </div>

      {/* 学習データ初期化ボタン */}
      <div className="pt-2">
        <button
          onClick={handleReset}
          className="w-full py-2.5 rounded-xl border border-stone-200 text-stone-500 hover:text-rose-600 hover:border-rose-300 hover:bg-rose-50 text-xs font-semibold transition-colors flex items-center justify-center space-x-1.5 cursor-pointer"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>学習進捗・ストリークをリセット（テスト用）</span>
        </button>
      </div>
    </div>
  );
};
