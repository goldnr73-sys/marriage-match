"use client";

import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { psychQuestions } from "@/lib/questions";
import { PsychAnswer } from "@/lib/types";

function TestContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const checklistEncoded = searchParams.get("checklist") ?? "";

  const [currentQ, setCurrentQ] = useState(0);
  const [answers, setAnswers] = useState<PsychAnswer[]>([]);
  const [selected, setSelected] = useState<string | null>(null);

  const question = psychQuestions[currentQ];
  const isLast = currentQ === psychQuestions.length - 1;
  const progress = ((currentQ) / psychQuestions.length) * 100;

  function handleSelect(value: string) {
    setSelected(value);
  }

  function handleNext() {
    if (!selected) return;

    const newAnswers = [...answers, { questionId: question.id, answer: selected }];
    setAnswers(newAnswers);
    setSelected(null);

    if (isLast) {
      const analysisInput = {
        checklist: JSON.parse(decodeURIComponent(atob(checklistEncoded))),
        psychAnswers: newAnswers,
      };
      const encoded = btoa(encodeURIComponent(JSON.stringify(analysisInput)));
      router.push(`/result?input=${encoded}`);
    } else {
      setCurrentQ((prev) => prev + 1);
    }
  }

  return (
    <main className="min-h-screen flex flex-col items-center px-4 py-8">
      <div className="max-w-lg w-full space-y-6">
        {/* 헤더 */}
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-sm text-stone-400">
            <span>파트 2</span>
            <span>/</span>
            <span className="text-stone-700 font-medium">심리 테스트</span>
          </div>
          <div className="w-full h-1.5 bg-stone-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-pink-400 to-purple-500 rounded-full transition-all duration-500"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* 질문 카드 */}
        <div className="bg-white rounded-3xl p-6 border border-stone-100 shadow-sm space-y-5">
          <div className="space-y-1">
            <span className="text-xs font-semibold text-pink-400 uppercase tracking-wider">
              Q{currentQ + 1} / {psychQuestions.length}
            </span>
            <h2 className="text-lg font-bold text-stone-900 leading-snug">
              {question.question}
            </h2>
            <p className="text-sm text-stone-500">{question.context}</p>
          </div>

          <div className="space-y-2.5">
            {question.options.map((opt) => (
              <button
                key={opt.value}
                onClick={() => handleSelect(opt.value)}
                className={`w-full text-left px-4 py-3.5 rounded-2xl border text-sm font-medium transition-all ${
                  selected === opt.value
                    ? "border-pink-400 bg-pink-50 text-pink-800"
                    : "border-stone-200 bg-white text-stone-700 hover:border-stone-300 hover:bg-stone-50"
                }`}
              >
                <span className="font-bold text-stone-400 mr-2">{opt.value}</span>
                {opt.label}
              </button>
            ))}
          </div>
        </div>

        {/* 버튼 */}
        <button
          onClick={handleNext}
          disabled={!selected}
          className={`w-full py-4 rounded-2xl font-bold text-lg transition-all ${
            selected
              ? "bg-gradient-to-r from-pink-400 to-purple-500 text-white shadow-md hover:shadow-lg hover:scale-105"
              : "bg-stone-100 text-stone-300 cursor-not-allowed"
          }`}
        >
          {isLast ? "AI 분석 시작 →" : "다음 질문 →"}
        </button>

        <p className="text-center text-xs text-stone-400">
          답변을 선택하면 다음으로 넘어갑니다
        </p>
      </div>
    </main>
  );
}

export default function TestPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center text-stone-400">로딩 중...</div>}>
      <TestContent />
    </Suspense>
  );
}
