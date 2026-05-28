"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { checklistCategories } from "@/lib/checklist";
import { ChecklistData } from "@/lib/types";

const introSlides = [
  {
    title: null,
    highlight: "결혼, 언제쯤 하게 될까요?",
    sub: null,
    emoji: null,
  },
  {
    title: "언제보다 더 중요한 건,",
    highlight: "어떤 사람과 하느냐입니다.",
    sub: null,
    emoji: null,
  },
  {
    title: "그런데 '어떤 사람'인지",
    highlight: "막상 말하기 어렵지 않으세요?",
    sub: null,
    emoji: null,
  },
  {
    title: "A씨는 설렘으로 결혼을 결정했습니다.",
    highlight: null,
    sub: "나중에서야 깨달았습니다.",
    emoji: "😔",
  },
  {
    title: "B씨는 먼저 자신에게 물었습니다.",
    highlight: "\"나는 어떤 사람이 필요한가?\"",
    sub: null,
    emoji: "😊",
  },
  {
    title: "차이는 결혼 전,",
    highlight: "자신의 기준이 있었느냐 없었느냐입니다.",
    sub: null,
    emoji: null,
  },
  {
    title: "결혼에서 중요한 건 사람마다 다릅니다.",
    highlight: null,
    sub: "돈? 가치관? 생활 방식? 가족 관계?",
    emoji: "🤔",
  },
  {
    title: "행복이와 이야기하다 보면,",
    highlight: "당신도 몰랐던 기준이 보입니다.",
    sub: null,
    emoji: null,
  },
  {
    title: null,
    highlight: "지금부터 검사를 시작해볼까요?",
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
  const [visible, setVisible] = useState(true);
  const [showNickname, setShowNickname] = useState(false);
  const [nickname, setNickname] = useState("");

  const slide = introSlides[currentSlide];
  const isLastSlide = currentSlide === introSlides.length - 1;

  function handleSlideAdvance() {
    if (isLastSlide) return;
    setVisible(false);
    setTimeout(() => {
      setCurrentSlide((prev) => prev + 1);
      setVisible(true);
    }, 200);
  }

  const category = checklistCategories[activeCategory];
  const isLast = activeCategory === checklistCategories.length - 1;

  function handleSelect(id: keyof ChecklistData, value: string | number) {
    setData((prev) => ({ ...prev, [id]: value }));
  }

  function handleNext() {
    if (isLast) {
      const encoded = btoa(encodeURIComponent(JSON.stringify(data)));
      const nick = encodeURIComponent(nickname);
      router.push(`/chat?checklist=${encodeURIComponent(encoded)}&nickname=${nick}`);
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
        <div className={`flex-1 flex flex-col items-center justify-center px-10 text-center gap-6 transition-opacity duration-200 ${visible ? "opacity-100" : "opacity-0"}`}>
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
                onClick={() => { setShowIntro(false); setShowNickname(true); }}
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

  if (showNickname) {
    return (
      <div className="min-h-screen bg-white flex flex-col select-none">
        {/* 헤더 */}
        <div className="flex items-center justify-between px-6 pt-4 pb-0">
          <div />
          <span className="text-xs text-gray-400 tracking-widest">marriage-match</span>
          <div />
        </div>

        {/* 본문 */}
        <div className="flex-1 flex flex-col items-center justify-center px-10 text-center gap-6">
          <span className="text-6xl leading-none">💬</span>
          <p className="text-gray-900 text-2xl font-bold leading-snug">
            어떻게 불러드릴까요?
          </p>
          <input
            type="text"
            value={nickname}
            onChange={(e) => setNickname(e.target.value.slice(0, 10))}
            onKeyDown={(e) => { if (e.key === "Enter") setShowNickname(false); }}
            placeholder="닉네임을 입력하세요"
            autoFocus
            className="w-full max-w-xs px-4 py-3 rounded-2xl border border-gray-200 text-center text-base focus:outline-none focus:border-gray-400 bg-gray-50"
          />
          <div className="flex flex-col items-center gap-3 mt-2">
            <button
              onClick={() => setShowNickname(false)}
              disabled={!nickname.trim()}
              className="px-12 py-4 bg-gray-900 text-white text-base font-semibold rounded-2xl hover:bg-gray-800 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
            >
              테스트 시작하기
            </button>
          </div>
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
