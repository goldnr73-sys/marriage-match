"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { toPng } from "html-to-image";
import { AnalysisResult, ChecklistData, ChatMessage } from "@/lib/types";
import ResultCard from "@/components/ResultCard";
import ShareButtons from "@/components/ShareButtons";

function safeDecodeB64(encoded: string) {
  try {
    return JSON.parse(decodeURIComponent(atob(encoded)));
  } catch {
    return null;
  }
}

const TYPE_EMOJI: Record<string, string> = {
  '안정탐색형': '🏛️',
  '감성교류형': '💬',
  '독립동반자형': '🌿',
  '가정헌신형': '🏡',
};

function ResultContent() {
  const searchParams = useSearchParams();
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [checklist, setChecklist] = useState<ChecklistData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [loadingText, setLoadingText] = useState("대화 내용을 분석하는 중...");
  const [showCover, setShowCover] = useState(true);
  const nickname = searchParams.get("nickname") ?? "";

  useEffect(() => {
    const checklistParam = searchParams.get("checklist");
    const chatParam = searchParams.get("chat");

    if (!checklistParam || !chatParam) {
      setError("분석 데이터가 없습니다.");
      setLoading(false);
      return;
    }

    const checklistData: ChecklistData = safeDecodeB64(checklistParam);
    const chatHistory: ChatMessage[] = safeDecodeB64(chatParam);

    if (!checklistData || !chatHistory) {
      setError("데이터를 읽을 수 없습니다.");
      setLoading(false);
      return;
    }

    setChecklist(checklistData);

    const messages = ["대화 내용을 분석하는 중...", "심리 패턴을 파악하는 중...", "숨겨진 기대를 찾는 중...", "마무리 중..."];
    let i = 0;
    const interval = setInterval(() => {
      i = (i + 1) % messages.length;
      setLoadingText(messages[i]);
    }, 1500);

    fetch("/api/analyze", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ checklist: checklistData, chatHistory }),
    })
      .then((res) => { if (!res.ok) throw new Error("서버 오류"); return res.json(); })
      .then((data: AnalysisResult) => setResult(data))
      .catch(() => setError("분석 중 오류가 발생했습니다. 다시 시도해주세요."))
      .finally(() => { clearInterval(interval); setLoading(false); });

    return () => clearInterval(interval);
  }, [searchParams]);

  async function handleSaveImage() {
    const el = document.getElementById("result-card");
    if (!el) return;
    try {
      const dataUrl = await toPng(el, { cacheBust: true, pixelRatio: 2 });
      const link = document.createElement("a");
      link.download = "내_결혼상대_분석.png";
      link.href = dataUrl;
      link.click();
    } catch {
      alert("이미지 저장에 실패했습니다. 다시 시도해주세요.");
    }
  }

  const shareUrl = typeof window !== "undefined" ? window.location.href : "";

  if (loading) {
    return (
      <main className="min-h-screen flex flex-col items-center justify-center px-4">
        <div className="text-center space-y-6">
          <div className="text-6xl animate-bounce">💍</div>
          <div className="space-y-2">
            <div className="w-12 h-12 border-4 border-pink-400 border-t-transparent rounded-full animate-spin mx-auto" />
            <p className="text-stone-600 font-medium">{loadingText}</p>
            <p className="text-xs text-stone-400">AI가 열심히 분석하고 있어요</p>
          </div>
        </div>
      </main>
    );
  }

  if (error || !result || !checklist) {
    return (
      <main className="min-h-screen flex flex-col items-center justify-center px-4">
        <div className="text-center space-y-4">
          <div className="text-4xl">😢</div>
          <p className="text-stone-600">{error ?? "알 수 없는 오류"}</p>
          <Link href="/" className="block px-6 py-3 bg-amber-400 text-white rounded-2xl font-medium hover:bg-amber-500 transition-colors">
            처음으로 돌아가기
          </Link>
        </div>
      </main>
    );
  }

  if (showCover) {
    const typeEmoji = TYPE_EMOJI[result.psychInsight.partnerType] ?? '💍';
    return (
      <main className="min-h-screen flex flex-col items-center justify-center px-6">
        <div className="text-center space-y-8 max-w-sm w-full">
          <div className="text-7xl">💍</div>
          <div className="space-y-2">
            <p className="text-xs text-stone-400 font-medium tracking-widest uppercase">Analysis Complete</p>
            <h1 className="text-2xl font-bold text-stone-900">
              {nickname ? `${nickname}님의` : "나의"} 결혼 파트너 성향
            </h1>
          </div>
          <div className="inline-flex items-center gap-2 px-5 py-3 bg-gradient-to-r from-pink-50 to-purple-50 border border-pink-200 rounded-full">
            <span className="text-xl">{typeEmoji}</span>
            <span className="text-base font-bold text-stone-800">{result.psychInsight.partnerType}</span>
          </div>
          <div className="flex justify-center gap-6 text-sm text-stone-500">
            <span className="flex items-center gap-1.5">
              <span className="text-green-500 font-bold">✓</span> 체크리스트 완료
            </span>
            <span className="flex items-center gap-1.5">
              <span className="text-green-500 font-bold">✓</span> 행복이 대화 완료
            </span>
          </div>
          <button
            onClick={() => setShowCover(false)}
            className="w-full py-4 bg-stone-900 text-white rounded-2xl font-semibold text-base hover:bg-stone-700 transition-colors"
          >
            결과 보기 →
          </button>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen flex flex-col items-center px-4 py-8">
      <div className="max-w-lg w-full space-y-6">
        <div className="text-center space-y-1">
          <h1 className="text-2xl font-bold text-stone-900">분석 완료!</h1>
          <p className="text-sm text-stone-500">대화를 바탕으로 분석한 결혼 상대 리포트</p>
        </div>

        <ResultCard checklist={checklist} result={result} />

        <ShareButtons onSaveImage={handleSaveImage} shareUrl={shareUrl} />

        <div className="text-center">
          <Link href="/" className="text-sm text-stone-400 hover:text-stone-600 underline underline-offset-2 transition-colors">
            다시 처음부터 하기
          </Link>
        </div>
      </div>
    </main>
  );
}

export default function ResultPage() {
  return (
    <Suspense fallback={
      <main className="min-h-screen flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-pink-400 border-t-transparent rounded-full animate-spin" />
      </main>
    }>
      <ResultContent />
    </Suspense>
  );
}
