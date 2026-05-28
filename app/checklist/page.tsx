"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { checklistCategories } from "@/lib/checklist";
import { ChecklistData } from "@/lib/types";

const introSlides = [
  {
    title: "소개팅에서, 직장에서,\n처음 만나는 자리에서,",
    highlight: "나는 어떤 사람과\n잘 맞을까?",
    sub: "사람들은 나에게 어떤 짝꿍이 맞을까?",
    emoji: null,
  },
  {
    title: "여기 두 커플이 있습니다.",
    highlight: null,
    sub: null,
    emoji: "💑",
  },
  {
    title: "커플 A",
    highlight: "첫눈에 반해 결혼했습니다.",
    sub: "그런데 2년 후, 돈 문제와 가치관 차이로\n매일 다투고 있습니다.",
    emoji: "😔",
  },
  {
    title: "커플 B",
    highlight: "결혼 전 서로의 기준을\n먼저 확인했습니다.",
    sub: "5년이 지난 지금도 큰 갈등 없이\n행복하게 살고 있습니다.",
    emoji: "😊",
  },
  {
    title: "이들 사이엔 단 하나의 차이가 있습니다.",
    highlight: "결혼 전, 자신의 기준이\n있었느냐 없었느냐.",
    sub: null,
    emoji: null,
  },
  {
    title: "사람마다 결혼에서\n중요하게 생각하는 것이 다릅니다.",
    highlight: null,
    sub: "경제적 안정, 가치관의 일치,\n생활 방식, 가족 관계...",
    emoji: "🤔",
  },
  {
    title: "그렇기 때문에",
    highlight: "내가 무엇을 원하는지\n먼저 아는 것이",
    sub: "짝꿍을 찾는 첫걸음입니다.",
    emoji: null,
  },
  {
    title: "이 검사는 5가지 영역에서\n당신의 결혼 기준을 파악하고,",
    highlight: null,
    sub: "AI와의 대화로 스스로도\n몰랐던 가치관까지 분석합니다.",
    emoji: "🤖",
  },
  {
    title: "지금부터 검사를\n시작해보겠습니다.",
    highlight: null,
    sub: null,
    emoji: "💍",
    isCta: true,
  },
];

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
  preferredHeight: "상관없음",
  preferredBodyType: "상관없음",
  preferredStyle: "",
  dislikedStyle: "",
  ageDifference: "상관없음",
  maxAgeDiff: "상관없음",
  selfCareAgeTolerance: "상관없음",
};

export default function ChecklistPage() {
  const router = useRouter();
  const [data, setData] = useState<ChecklistData>(defaultChecklist);
  const [activeCategory, setActiveCategory] = useState(0);
  const [showIntro, setShowIntro] = useState(true);
  const [currentSlide, setCurrentSlide] = useState(0);

  const slide = introSlides[currentSlide];
  const isLastSlide = currentSlide === introSlides.length - 1;

  function handleSlideAdvance() {
    if (isLastSlide) return;
    setCurrentSlide((prev) => prev + 1);
  }

  const category = checklistCategories[activeCategory];
  const isLast = activeCategory === checklistCategories.length - 1;

  function handleSelect(id: keyof ChecklistData, value: string | number) {
    setData((prev) => ({ ...prev, [id]: value }));
  }

  function handleNext() {
    if (isLast) {
      const encoded = btoa(encodeURIComponent(JSON.stringify(data)));
      router.push(`/chat?checklist=${encodeURIComponent(encoded)}`);
    } else {
      setActiveCategory((prev) => prev + 1);
    }
  }

  function handleBack() {
    if (activeCategory > 0) setActiveCategory((prev) => prev - 1);
  }

  if (showIntro) {
    return (
      <div
        className="min-h-screen bg-white flex flex-col select-none"
        onClick={handleSlideAdvance}
      >
        {/* 상단 진행 바 */}
        <div className="h-0.5 bg-gray-100 w-full">
          <div
            className="h-full bg-gray-800 transition-all duration-500"
            style={{ width: `${((currentSlide + 1) / introSlides.length) * 100}%` }}
          />
        </div>

        {/* 헤더 */}
        <div className="flex items-center justify-between px-6 pt-4 pb-0">
          <div />
          <span className="text-xs text-gray-400 tracking-widest">marriage-match</span>
          <span className="text-xs text-gray-400">
            {currentSlide + 1} / {introSlides.length}
          </span>
        </div>

        {/* 슬라이드 본문 */}
        <div className="flex-1 flex flex-col items-center justify-center px-10 text-center gap-6">
          {slide.emoji && (
            <span className="text-7xl leading-none">{slide.emoji}</span>
          )}
          {slide.title && (
            <p className="text-gray-400 text-base whitespace-pre-line leading-relaxed">
              {slide.title}
            </p>
          )}
          {slide.highlight && (
            <p className="text-gray-900 text-2xl font-bold whitespace-pre-line leading-snug">
              {slide.highlight}
            </p>
          )}
          {slide.sub && (
            <p className="text-gray-400 text-sm whitespace-pre-line leading-relaxed">
              {slide.sub}
            </p>
          )}
          {slide.isCta && (
            <div className="mt-4 flex flex-col items-center gap-3" onClick={(e) => e.stopPropagation()}>
              <button
                onClick={() => setShowIntro(false)}
                className="px-12 py-4 bg-gray-900 text-white text-base font-semibold rounded-2xl hover:bg-gray-800 transition-colors"
              >
                시작하기
              </button>
              <span className="text-xs text-gray-400">약 5분 소요 · AI 논문 기반</span>
            </div>
          )}
        </div>

        {/* 하단 도트 + 탭 안내 */}
        <div className="flex flex-col items-center gap-3 pb-8">
          <div className="flex gap-1.5">
            {introSlides.map((_, i) => (
              <div
                key={i}
                className={`rounded-full transition-all duration-300 ${
                  i === currentSlide
                    ? "w-5 h-1.5 bg-gray-800"
                    : "w-1.5 h-1.5 bg-gray-200"
                }`}
              />
            ))}
          </div>
          {!isLastSlide && (
            <span className="text-xs text-gray-400">탭하여 계속</span>
          )}
        </div>
      </div>
    );
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

                {item.type === "text" && (
                  <textarea
                    value={data[item.id] as string}
                    onChange={(e) => handleSelect(item.id, e.target.value)}
                    placeholder={item.placeholder}
                    rows={2}
                    className="w-full px-3 py-2 rounded-xl border border-stone-200 text-sm focus:outline-none focus:border-amber-300 resize-none leading-relaxed"
                  />
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
