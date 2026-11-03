import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { storage } from '../config/firebase';

export interface UploadFileResult {
  url: string;
  fileName: string;
  fileSize: number;
  contentType: string;
}

export const uploadManualFile = async (
  file: File,
  manualId: string
): Promise<UploadFileResult> => {
  // Firebase Storageが利用可能な場合 (Spark無料枠: 5GBまで)
  if (storage) {
    try {
      const sanitizedName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_');
      const storagePath = `manuals/${manualId}/${Date.now()}_${sanitizedName}`;
      const storageRef = ref(storage, storagePath);

      const snapshot = await uploadBytes(storageRef, file, {
        contentType: file.type,
      });

      const url = await getDownloadURL(snapshot.ref);

      return {
        url,
        fileName: file.name,
        fileSize: file.size,
        contentType: file.type,
      };
    } catch (error) {
      console.warn('Firebase Storage upload failed, falling back to local object URL:', error);
    }
  }

  // フォールバック: ブラウザの Blob URL
  const localUrl = URL.createObjectURL(file);
  return {
    url: localUrl,
    fileName: file.name,
    fileSize: file.size,
    contentType: file.type,
  };
};

/**
 * プロフィール画像のアップロード & 最適化
 * 画像を 300x300 正方形に圧縮して Firebase Storage または DataURL に保存
 */
export const uploadProfileImage = async (
  file: File,
  userId: string
): Promise<string> => {
  // 1. 画像の最適化（リサイズ & WebP/JPEG変換）
  const optimizedDataUrl = await resizeImageToDataUrl(file, 300, 300);

  // 2. Firebase Storage が使える場合は Storage にアップロード
  if (storage && userId) {
    try {
      const response = await fetch(optimizedDataUrl);
      const blob = await response.blob();
      const storagePath = `users/${userId}/profile_${Date.now()}.jpg`;
      const storageRef = ref(storage, storagePath);

      const snapshot = await uploadBytes(storageRef, blob, {
        contentType: 'image/jpeg',
      });

      const downloadUrl = await getDownloadURL(snapshot.ref);
      return downloadUrl;
    } catch (error) {
      console.warn('Failed to upload to Firebase Storage, using DataURL fallback:', error);
    }
  }

  // フォールバック: DataURL (ローカル & Firestore に直接保存可能)
  return optimizedDataUrl;
};

// 画像リサイズ用ユーティリティ
const resizeImageToDataUrl = (
  file: File,
  maxWidth: number,
  maxHeight: number
): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (readerEvent) => {
      const image = new Image();
      image.onload = () => {
        let width = image.width;
        let height = image.height;

        // 正方形にトリミング & リサイズ
        const size = Math.min(width, height);
        const startX = (width - size) / 2;
        const startY = (height - size) / 2;

        const canvas = document.createElement('canvas');
        canvas.width = maxWidth;
        canvas.height = maxHeight;

        const ctx = canvas.getContext('2d');
        if (!ctx) {
          resolve(readerEvent.target?.result as string);
          return;
        }

        ctx.drawImage(
          image,
          startX,
          startY,
          size,
          size,
          0,
          0,
          maxWidth,
          maxHeight
        );

        // JPEG 85%品質で出力
        const dataUrl = canvas.toDataURL('image/jpeg', 0.85);
        resolve(dataUrl);
      };
      image.onerror = (err) => reject(err);
      image.src = readerEvent.target?.result as string;
    };
    reader.onerror = (err) => reject(err);
    reader.readAsDataURL(file);
  });
};
