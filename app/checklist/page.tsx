"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { checklistCategories } from "@/lib/checklist";
import { ChecklistData } from "@/lib/types";

const defaultChecklist: ChecklistData = {
  minSalary: "상관없음",
  minAsset: "상관없음",
  debtTolerance: "있어도 괜찮음",
  jobStability: 3,
  parentsRetirement: "상관없음",
  weddingSupport: "상관없음",
  livingArea: "상관없음",
  inLawRelation: "적당히 왕래",
  religion: "상관없음",
  childPlan: "상황 보고 결정",
  roleShare: "가능한 반반",
  careerVsFamily: "균형 중시",
  conflictStyle: "즉시 대화로 해결",
  emotionExpression: "가끔이면 충분",
  personalTime: "각자 시간 중요",
};

export default function ChecklistPage() {
  const router = useRouter();
  const [data, setData] = useState<ChecklistData>(defaultChecklist);
  const [activeCategory, setActiveCategory] = useState(0);

  const category = checklistCategories[activeCategory];
  const isLast = activeCategory === checklistCategories.length - 1;

  function handleSelect(id: keyof ChecklistData, value: string | number) {
    setData((prev) => ({ ...prev, [id]: value }));
  }

  function handleNext() {
    if (isLast) {
      const encoded = btoa(encodeURIComponent(JSON.stringify(data)));
      router.push(`/test?checklist=${encoded}`);
    } else {
      setActiveCategory((prev) => prev + 1);
    }
  }

  function handleBack() {
    if (activeCategory > 0) setActiveCategory((prev) => prev - 1);
  }

  return (
    <main className="min-h-screen flex flex-col items-center px-4 py-8">
      <div className="max-w-lg w-full space-y-6">
        {/* 헤더 */}
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-sm text-stone-400">
            <span>파트 1</span>
            <span>/</span>
            <span className="text-stone-700 font-medium">현실 조건 설정</span>
          </div>
          {/* 진행바 */}
          <div className="flex gap-1.5">
            {checklistCategories.map((_, i) => (
              <div
                key={i}
                className={`h-1.5 flex-1 rounded-full transition-all duration-300 ${
                  i <= activeCategory ? "bg-amber-400" : "bg-stone-200"
                }`}
              />
            ))}
          </div>
        </div>

        {/* 카테고리 카드 */}
        <div className="bg-white rounded-3xl p-6 border border-stone-100 shadow-sm space-y-6">
          <div>
            <span className="text-3xl">{category.emoji}</span>
            <h2 className="text-xl font-bold text-stone-900 mt-2">{category.title}</h2>
          </div>

          <div className="space-y-6">
            {category.items.map((item) => (
              <div key={item.id} className="space-y-2">
                <label className="text-sm font-medium text-stone-700">{item.label}</label>

                {item.type === "select" && item.options && (
                  <div className="flex flex-wrap gap-2">
                    {item.options.map((opt) => (
                      <button
                        key={opt}
                        onClick={() => handleSelect(item.id, opt)}
                        className={`option-btn px-3 py-1.5 rounded-xl border text-sm font-medium transition-all ${
                          data[item.id] === opt
                            ? "border-amber-400 bg-amber-50 text-amber-800"
                            : "border-stone-200 bg-white text-stone-600 hover:border-stone-300"
                        }`}
                      >
                        {opt}
                      </button>
                    ))}
                  </div>
                )}

                {item.type === "rating" && (
                  <div className="flex gap-1">
                    {Array.from({ length: item.max ?? 5 }, (_, i) => i + 1).map((star) => (
                      <button
                        key={star}
                        onClick={() => handleSelect(item.id, star)}
                        className="rating-star"
                      >
                        <span className={star <= (data[item.id] as number) ? "text-amber-400" : "text-stone-200"}>
                          ★
                        </span>
                      </button>
                    ))}
                    <span className="text-sm text-stone-400 ml-2 self-center">
                      {data[item.id] as number}점
                    </span>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* 버튼 */}
        <div className="flex gap-3">
          {activeCategory > 0 && (
            <button
              onClick={handleBack}
              className="flex-1 py-3 rounded-2xl border border-stone-200 text-stone-600 font-medium hover:bg-stone-50 transition-colors"
            >
              ← 이전
            </button>
          )}
          <button
            onClick={handleNext}
            className="flex-1 py-3 rounded-2xl bg-gradient-to-r from-amber-400 to-pink-500 text-white font-bold hover:shadow-md transition-all"
          >
            {isLast ? "심리 테스트로 →" : "다음 →"}
          </button>
        </div>

        <p className="text-center text-xs text-stone-400">
          {activeCategory + 1} / {checklistCategories.length} 카테고리
        </p>
      </div>
    </main>
  );
}
