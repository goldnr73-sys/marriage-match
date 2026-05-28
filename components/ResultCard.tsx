import { ChecklistData, AnalysisResult } from "@/lib/types";
import { checklistCategories } from "@/lib/checklist";

const TYPE_EMOJI: Record<string, string> = {
  '안정탐색형': '🏛️',
  '감성교류형': '💬',
  '독립동반자형': '🌿',
  '가정헌신형': '🏡',
};

interface Props {
  checklist: ChecklistData;
  result: AnalysisResult;
}

export default function ResultCard({ checklist, result }: Props) {
  const { psychInsight } = result;

  return (
    <div id="result-card" className="bg-white rounded-3xl border border-stone-100 shadow-sm overflow-hidden">
      {/* 헤더 */}
      <div className="bg-gradient-to-br from-pink-400 to-purple-500 p-6 text-white">
        <div className="flex items-center gap-2 mb-3">
          <span className="text-lg">{TYPE_EMOJI[psychInsight.partnerType] ?? '💍'}</span>
          <span className="text-sm font-bold bg-white/20 px-3 py-0.5 rounded-full">
            {psychInsight.partnerType}
          </span>
        </div>
        <p className="text-sm font-medium opacity-80 mb-1">내가 원하는 결혼 상대 분석</p>
        <h2 className="text-xl font-bold leading-snug">"{psychInsight.tagline}"</h2>
      </div>

      <div className="p-6 space-y-6">
        {/* 섹션 A: 내가 설정한 조건 */}
        <div className="space-y-3">
          <h3 className="text-xs font-semibold text-stone-400 uppercase tracking-wider">
            📋 내가 설정한 조건
          </h3>
          <div className="space-y-3">
            {checklistCategories.map((cat) => (
              <div key={cat.id} className="bg-stone-50 rounded-2xl p-4">
                <p className="text-xs font-semibold text-stone-500 mb-2">
                  {cat.emoji} {cat.title}
                </p>
                <div className="space-y-1">
                  {cat.items.map((item) => {
                    const value = checklist[item.id];
                    return (
                      <div key={item.id} className="flex items-center justify-between text-sm">
                        <span className="text-stone-500">{item.label}</span>
                        <span className="font-medium text-stone-800">
                          {item.type === 'rating' ? `${value}점` : String(value)}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 구분선 */}
        <div className="border-t border-stone-100" />

        {/* 섹션 B: AI 심리 분석 */}
        <div className="space-y-3">
          <h3 className="text-xs font-semibold text-stone-400 uppercase tracking-wider">
            🧠 AI 심리 분석
          </h3>

          <div className="bg-gradient-to-r from-pink-50 to-purple-50 rounded-2xl p-4 border border-pink-100">
            <p className="text-xs font-semibold text-purple-600 mb-1">
              {TYPE_EMOJI[psychInsight.partnerType] ?? '💍'} {psychInsight.partnerType}
            </p>
            <p className="text-sm text-stone-700 leading-relaxed">{psychInsight.typeDescription}</p>
          </div>

          <div className="bg-purple-50 rounded-2xl p-4 border border-purple-100">
            <p className="text-xs font-semibold text-purple-600 mb-1">대화에서 발견된 패턴</p>
            <p className="text-sm text-stone-700 leading-relaxed">{psychInsight.insight}</p>
          </div>

          <div className="bg-pink-50 rounded-2xl p-4 border border-pink-100">
            <p className="text-xs font-semibold text-pink-500 mb-1">🔍 숨겨진 기대</p>
            <p className="text-sm text-stone-700 leading-relaxed">{psychInsight.hiddenDesire}</p>
          </div>

          <div className="bg-amber-50 rounded-2xl p-4 border border-amber-100">
            <p className="text-xs font-semibold text-amber-600 mb-1">⚠️ 현실 체크</p>
            <p className="text-sm text-stone-700 leading-relaxed">{psychInsight.reality}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
