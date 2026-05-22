"use client";

import { useEffect, useState, useRef, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import html2canvas from "html2canvas";
import { AnalysisResult } from "@/lib/types";
import ResultCard from "@/components/ResultCard";
import ShareButtons from "@/components/ShareButtons";
import { encodeResult, decodeResult } from "@/lib/utils";

function ResultContent() {
  const searchParams = useSearchParams();
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [loadingText, setLoadingText] = useState("조건을 분석하는 중...");
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // 이미 결과가 URL에 있으면 decode해서 바로 표시
    const resultParam = searchParams.get("result");
    if (resultParam) {
      const decoded = decodeResult(resultParam);
      if (decoded) {
        setResult(decoded);
        setLoading(false);
        return;
      }
    }

    // 새로 분석 실행
    const inputParam = searchParams.get("input");
    if (!inputParam) {
      setError("분석 데이터가 없습니다.");
      setLoading(false);
      return;
    }

    let input;
    try {
      input = JSON.parse(decodeURIComponent(atob(inputParam)));
    } catch {
      setError("데이터를 읽을 수 없습니다.");
      setLoading(false);
      return;
    }

    const messages = [
      "조건을 분석하는 중...",
      "심리 패턴을 파악하는 중...",
      "이상형 프로필 생성 중...",
      "마무리 중...",
    ];
    let i = 0;
    const interval = setInterval(() => {
      i = (i + 1) % messages.length;
      setLoadingText(messages[i]);
    }, 1500);

    fetch("/api/analyze", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(input),
    })
      .then((res) => {
        if (!res.ok) throw new Error("서버 오류");
        return res.json();
      })
      .then((data: AnalysisResult) => {
        setResult(data);
        // URL을 결과 공유 URL로 교체 (히스토리에 남기지 않음)
        const encoded = encodeResult(data);
        const url = `${window.location.origin}/result?result=${encoded}`;
        window.history.replaceState(null, "", url);
      })
      .catch((err) => {
        console.error(err);
        setError("분석 중 오류가 발생했습니다. 다시 시도해주세요.");
      })
      .finally(() => {
        clearInterval(interval);
        setLoading(false);
      });

    return () => clearInterval(interval);
  }, [searchParams]);

  async function handleSaveImage() {
    const el = document.getElementById("result-card");
    if (!el) return;
    const canvas = await html2canvas(el, { scale: 2, backgroundColor: "#ffffff" });
    const link = document.createElement("a");
    link.download = "내_결혼상대_프로필.png";
    link.href = canvas.toDataURL("image/png");
    link.click();
  }

  const shareUrl =
    typeof window !== "undefined" ? window.location.href : "";

  if (loading) {
    return (
      <main className="min-h-screen flex flex-col items-center justify-center px-4">
        <div className="text-center space-y-6">
          <div className="text-6xl animate-bounce">💍</div>
          <div className="space-y-2">
            <div className="w-12 h-12 border-4 border-amber-400 border-t-transparent rounded-full animate-spin mx-auto" />
            <p className="text-stone-600 font-medium">{loadingText}</p>
            <p className="text-xs text-stone-400">AI가 열심히 분석하고 있어요</p>
          </div>
        </div>
      </main>
    );
  }

  if (error || !result) {
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

  return (
    <main className="min-h-screen flex flex-col items-center px-4 py-8">
      <div className="max-w-lg w-full space-y-6">
        <div className="text-center space-y-1">
          <h1 className="text-2xl font-bold text-stone-900">분석 완료!</h1>
          <p className="text-sm text-stone-500">당신의 현실적인 결혼 상대 프로필입니다</p>
        </div>

        <div ref={cardRef}>
          <ResultCard result={result} />
        </div>

        <ShareButtons onSaveImage={handleSaveImage} shareUrl={shareUrl} />

        <div className="text-center">
          <Link
            href="/"
            className="text-sm text-stone-400 hover:text-stone-600 underline underline-offset-2 transition-colors"
          >
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
        <div className="w-10 h-10 border-4 border-amber-400 border-t-transparent rounded-full animate-spin" />
      </main>
    }>
      <ResultContent />
    </Suspense>
  );
}
