import React, { useRef, useState } from 'react';
import html2canvas from 'html2canvas';
import { Certificate } from '../../types/certificate';
import { X, Download, Award, CheckCircle2, ShieldCheck, Sparkles } from 'lucide-react';

interface CertificateModalProps {
  certificate: Certificate | null;
  onClose: () => void;
}

export const CertificateModal: React.FC<CertificateModalProps> = ({
  certificate,
  onClose,
}) => {
  const certificateRef = useRef<HTMLDivElement>(null);
  const [isDownloading, setIsDownloading] = useState<boolean>(false);

  if (!certificate) return null;

  const handleDownloadImage = async () => {
    if (!certificateRef.current) return;

    try {
      setIsDownloading(true);

      const canvas = await html2canvas(certificateRef.current, {
        scale: 2.5, // 高解像度A4用
        useCORS: true,
        backgroundColor: '#FFFEF6',
        logging: false,
      });

      const dataUrl = canvas.toDataURL('image/png');
      const link = document.createElement('a');
      link.download = `Fugulingo_修了証_${certificate.sectionTitle.replace(/\s+/g, '_')}.png`;
      link.href = dataUrl;
      link.click();
    } catch (error) {
      console.error('Failed to export certificate image:', error);
      alert('修了証画像のダウンロードに失敗しました。');
    } finally {
      setIsDownloading(false);
    }
  };

  const formattedDate = new Date(certificate.issuedAt).toLocaleDateString('ja-JP', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-xs p-3 md:p-6 animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-2xl rounded-3xl border border-stone-200 shadow-2xl flex flex-col overflow-hidden max-h-[95vh]">
        {/* モーダルヘッダー */}
        <div className="px-5 py-3 border-b border-stone-200 flex items-center justify-between bg-stone-50">
          <div className="flex items-center space-x-2">
            <Award className="w-5 h-5 text-amber-500" />
            <h3 className="text-sm font-bold text-stone-800">デジタル修了証（横向きA4）</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-full text-stone-400 hover:text-stone-700 hover:bg-stone-200 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* 証書表示エリア（スクロール可能） */}
        <div className="p-4 md:p-6 overflow-y-auto flex-1 bg-stone-100 flex items-center justify-center">
          {/* 横向きA4比率コンテナ (Aspect Ratio: 1.414 : 1) */}
          <div
            ref={certificateRef}
            className="w-full max-w-[620px] aspect-[1.414/1] bg-[#FFFEF6] border-8 border-double border-stone-300 p-6 md:p-8 flex flex-col justify-between relative shadow-lg text-stone-800 select-none overflow-hidden"
            style={{
              boxShadow: 'inset 0 0 40px rgba(175, 223, 228, 0.15)',
            }}
          >
            {/* 四隅の飾り幾何学枠 */}
            <div className="absolute top-2 left-2 w-4 h-4 border-t-2 border-l-2 border-stone-400" />
            <div className="absolute top-2 right-2 w-4 h-4 border-t-2 border-r-2 border-stone-400" />
            <div className="absolute bottom-2 left-2 w-4 h-4 border-b-2 border-l-2 border-stone-400" />
            <div className="absolute bottom-2 right-2 w-4 h-4 border-b-2 border-r-2 border-stone-400" />

            {/* 透かしウォーターマーク */}
            <div className="absolute inset-0 flex items-center justify-center opacity-[0.03] pointer-events-none">
              <span className="text-8xl font-black tracking-widest uppercase">FUGU</span>
            </div>

            {/* 証書上部 */}
            <div className="text-center">
              <div className="inline-flex items-center space-x-1.5 px-3 py-0.5 rounded-full bg-[#AFDFE4]/30 border border-[#AFDFE4] text-[10px] font-bold text-[#2C6268] tracking-widest uppercase mb-1">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Certificate of Completion</span>
              </div>
              <h1 className="text-2xl md:text-3xl font-extrabold tracking-widest text-stone-900 mt-1">
                修　了　証
              </h1>
              <p className="text-[10px] text-stone-500 font-mono tracking-wider mt-0.5">
                No. {certificate.certificateNumber}
              </p>
            </div>

            {/* 証書中央：氏名と本文 */}
            <div className="text-center my-auto space-y-3">
              <div>
                <span className="text-xs text-stone-500 font-medium block">受講者</span>
                <p className="text-xl md:text-2xl font-bold text-stone-900 tracking-wide border-b-2 border-stone-300 inline-block px-6 pb-1">
                  {certificate.userName} 殿
                </p>
              </div>

              <div className="max-w-md mx-auto text-xs md:text-sm text-stone-700 leading-relaxed font-medium">
                貴殿は「Fugulingo」マイクロラーニングプログラムにおいて、
                下記のホール業務基準カリキュラムを優秀な成績で全課程修了されたことをここに証します。
              </div>

              {/* 修了セクション名バッジ */}
              <div className="inline-block bg-[#AFDFE4]/20 border border-[#AFDFE4] px-4 py-1.5 rounded-xl">
                <span className="text-xs md:text-sm font-bold text-[#2C6268]">
                  {certificate.sectionTitle}
                </span>
                <span className="text-[11px] text-stone-600 ml-2 font-semibold">
                  (全ステップ合格 / スコア {certificate.scorePercent}%)
                </span>
              </div>
            </div>

            {/* 証書下部：発行日・認定スタンプ・署名 */}
            <div className="flex items-end justify-between pt-2 border-t border-stone-200">
              <div className="text-left text-[11px] text-stone-500">
                <p className="font-semibold text-stone-600">発行日：{formattedDate}</p>
                <p className="text-[10px] text-stone-400 mt-0.5">
                  ※本修了証は店舗基準達成を証明するデジタル認定証です
                </p>
              </div>

              {/* 認定エンブレム & 印鑑（朱肉風スタンプ） & 署名 */}
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-full border border-amber-300 overflow-hidden shadow-xs shrink-0">
                  <img
                    src="/logo.jpg"
                    alt="Fugulingo Seal"
                    className="w-full h-full object-cover"
                  />
                </div>

                <div className="text-right">
                  <p className="text-xs font-bold text-stone-800">
                    {certificate.signatureName}
                  </p>
                  <p className="text-[10px] text-stone-500">
                    {certificate.signatureTitle}
                  </p>
                </div>

                {/* 朱肉角印風スタンプ */}
                <div className="w-11 h-11 border-2 border-rose-600 rounded-lg flex flex-col items-center justify-center text-rose-600 font-bold text-[9px] leading-tight rotate-[-6deg] shadow-2xs select-none">
                  <span>河豚</span>
                  <span>之印</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* フッターアクションバー */}
        <div className="p-4 bg-white border-t border-stone-200 flex items-center justify-between">
          <p className="text-xs text-stone-500 font-medium hidden sm:block">
            横向きA4比率で保存され、印刷や提出にご利用いただけます。
          </p>
          <div className="flex items-center space-x-3 w-full sm:w-auto">
            <button
              onClick={onClose}
              className="flex-1 sm:flex-none px-4 py-2.5 rounded-xl border border-stone-200 text-stone-600 text-xs font-bold hover:bg-stone-50 transition-colors cursor-pointer"
            >
              閉じる
            </button>
            <button
              disabled={isDownloading}
              onClick={handleDownloadImage}
              className="flex-1 sm:flex-none px-5 py-2.5 rounded-xl bg-stone-900 text-[#AFDFE4] text-xs font-bold hover:bg-stone-800 transition-all flex items-center justify-center space-x-2 shadow-xs cursor-pointer active:scale-95 disabled:opacity-50"
            >
              <Download className="w-4 h-4" />
              <span>{isDownloading ? '生成中...' : 'PNG画像として保存'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
