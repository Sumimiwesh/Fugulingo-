export type ManualContentType = 'text' | 'pdf' | 'image';

export type ManualStatus = 'active' | 'archived' | 'draft';

export interface ManualVersion {
  id: string; // e.g. "v1.0", "v2.0"
  manualId: string;
  versionNumber: number; // 1, 2, 3...
  versionLabel: string; // e.g. "v1.2 初版改定"
  changeLog: string; // 改定内容や変更理由
  contentType: ManualContentType;
  content: string; // 自由記述テキスト、またはPDF/画像の説明文や抽出テキスト
  fileUrl?: string; // Firebase Storage またはローカルURL
  fileName?: string;
  fileSize?: number;
  status: ManualStatus;
  createdAt: string;
  createdBy: string;
  publishedAt?: string;
}

export interface HallManual {
  id: string;
  category: 'welcome' | 'order' | 'serving' | 'clearing' | 'trouble' | 'hygiene';
  categoryLabel: string;
  title: string;
  description: string;
  currentVersionId: string;
  versions: ManualVersion[];
  createdAt: string;
  updatedAt: string;
}
