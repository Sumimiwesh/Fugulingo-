import React, { useState, useRef } from 'react';
import { useApp } from '../../context/AppContext';
import { uploadProfileImage } from '../../services/storageService';
import {
  X,
  Camera,
  Upload,
  User,
  RotateCcw,
  CheckCircle2,
  Sparkles,
  Image as ImageIcon,
} from 'lucide-react';

interface ProfileEditModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ProfileEditModal: React.FC<ProfileEditModalProps> = ({
  isOpen,
  onClose,
}) => {
  const { user, updateProfile } = useApp();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [displayName, setDisplayName] = useState<string>(user.displayName || '');
  const [previewPhoto, setPreviewPhoto] = useState<string | null>(user.photoURL);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [isSuccess, setIsSuccess] = useState<boolean>(false);

  if (!isOpen) return null;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedFile(file);
      // ローカルプレビュー生成
      const previewUrl = URL.createObjectURL(file);
      setPreviewPhoto(previewUrl);
    }
  };

  const handleResetToGooglePhoto = () => {
    if (user.googlePhotoURL) {
      setPreviewPhoto(user.googlePhotoURL);
      setSelectedFile(null);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!displayName.trim()) {
      alert('表示名を入力してください');
      return;
    }

    try {
      setIsSaving(true);
      let finalPhotoURL = previewPhoto;

      // 新しい画像ファイルが選ばれている場合はアップロード
      if (selectedFile) {
        finalPhotoURL = await uploadProfileImage(selectedFile, user.uid);
      }

      await updateProfile({
        displayName: displayName.trim(),
        photoURL: finalPhotoURL,
      });

      setIsSuccess(true);
      setTimeout(() => {
        setIsSuccess(false);
        onClose();
      }, 1000);
    } catch (error) {
      console.error('Failed to update profile:', error);
      alert('プロフィールの保存に失敗しました。');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in duration-200">
      <div className="bg-[#FFFEF6] w-full max-w-sm rounded-3xl border border-stone-200 shadow-2xl p-6 flex flex-col relative text-stone-800">
        {/* 閉じるボタン */}
        <button
          onClick={onClose}
          className="p-1 rounded-full text-stone-400 hover:text-stone-700 hover:bg-stone-100 transition-colors absolute top-4 right-4 cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        <h3 className="text-base font-extrabold text-stone-900 tracking-tight text-center">
          プロフィール設定
        </h3>
        <p className="text-xs text-stone-500 text-center mt-0.5 mb-5">
          アイコン画像と表示名をカスタマイズできます
        </p>

        <form onSubmit={handleSave} className="space-y-5">
          {/* プロフィール画像アップロード & プレビュー */}
          <div className="flex flex-col items-center">
            <div className="relative group">
              <div className="w-24 h-24 rounded-full border-3 border-[#AFDFE4] shadow-md overflow-hidden bg-white flex items-center justify-center relative">
                {previewPhoto ? (
                  <img
                    src={previewPhoto}
                    alt="Preview"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-stone-400 bg-stone-100 font-bold text-2xl">
                    {displayName ? displayName.slice(0, 1) : 'U'}
                  </div>
                )}
              </div>

              {/* カメラアイコンオーバーレイボタン */}
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="absolute bottom-0 right-0 p-2 rounded-full bg-stone-900 text-[#AFDFE4] shadow-md hover:bg-stone-800 transition-transform active:scale-90 cursor-pointer"
                title="画像を変更する"
              >
                <Camera className="w-4 h-4" />
              </button>
            </div>

            {/* 非表示のファイルインプット */}
            <input
              type="file"
              ref={fileInputRef}
              accept="image/*"
              onChange={handleFileChange}
              className="hidden"
            />

            <div className="flex items-center space-x-2 mt-3">
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="text-xs font-bold text-[#2C6268] hover:underline flex items-center space-x-1 cursor-pointer"
              >
                <Upload className="w-3.5 h-3.5" />
                <span>写真を選択・変更</span>
              </button>

              {user.googlePhotoURL && previewPhoto !== user.googlePhotoURL && (
                <button
                  type="button"
                  onClick={handleResetToGooglePhoto}
                  className="text-xs font-medium text-stone-400 hover:text-stone-700 flex items-center space-x-1 cursor-pointer"
                >
                  <RotateCcw className="w-3 h-3" />
                  <span>Google画像に戻す</span>
                </button>
              )}
            </div>
          </div>

          {/* 表示名入力 */}
          <div>
            <label className="text-xs font-bold text-stone-700 block mb-1">
              表示名（店舗での呼び名・ニックネーム）
            </label>
            <div className="relative">
              <input
                type="text"
                required
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                placeholder="例: さくら、佐藤（ホール）"
                maxLength={20}
                className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-xs text-stone-800 focus:outline-none focus:ring-2 focus:ring-[#AFDFE4] bg-white font-medium"
              />
              <span className="absolute right-3 top-2.5 text-[10px] text-stone-400">
                {displayName.length}/20
              </span>
            </div>
            <p className="text-[10px] text-stone-400 mt-1">
              ※修了証の受講者名や、仲間ランキング・応援タイムラインに表示されます。
            </p>
          </div>

          {/* 保存ボタン */}
          <div className="pt-2">
            <button
              type="submit"
              disabled={isSaving || isSuccess}
              className={`w-full py-3 rounded-2xl font-bold text-xs tracking-wide transition-all flex items-center justify-center space-x-2 shadow-xs cursor-pointer ${
                isSuccess
                  ? 'bg-emerald-600 text-white'
                  : 'bg-stone-900 text-[#AFDFE4] hover:bg-stone-800 active:scale-98 disabled:opacity-50'
              }`}
            >
              {isSuccess ? (
                <>
                  <CheckCircle2 className="w-4 h-4 text-white" />
                  <span>保存しました！</span>
                </>
              ) : (
                <span>{isSaving ? '保存中...' : 'プロフィールを保存'}</span>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
