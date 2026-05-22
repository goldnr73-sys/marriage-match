"use client";

import { useState } from "react";

interface Props {
  onSaveImage: () => void;
  shareUrl: string;
}

export default function ShareButtons({ onSaveImage, shareUrl }: Props) {
  const [copied, setCopied] = useState(false);

  async function handleCopyUrl() {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      alert("링크 복사에 실패했습니다.");
    }
  }

  return (
    <div className="space-y-3">
      <p className="text-center text-sm text-stone-500 font-medium">결과 저장 · 공유</p>
      <div className="flex gap-3">
        <button
          onClick={handleCopyUrl}
          className={`flex-1 py-3 rounded-2xl border font-medium text-sm transition-all ${
            copied
              ? "bg-green-50 border-green-300 text-green-700"
              : "bg-white border-stone-200 text-stone-700 hover:border-stone-300 hover:bg-stone-50"
          }`}
        >
          {copied ? "✅ 링크 복사됨!" : "🔗 링크 복사"}
        </button>
        <button
          onClick={onSaveImage}
          className="flex-1 py-3 rounded-2xl border border-stone-200 bg-white text-stone-700 font-medium text-sm hover:border-stone-300 hover:bg-stone-50 transition-all"
        >
          📷 이미지 저장
        </button>
      </div>
    </div>
  );
}
