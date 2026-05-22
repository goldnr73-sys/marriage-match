import { AnalysisResult } from "@/lib/types";

interface Props {
  result: AnalysisResult;
}

export default function ResultCard({ result }: Props) {
  const { partnerProfile, realityCheck, compatibility } = result;
  const scoreColor =
    compatibility.score >= 85
      ? "text-green-600"
      : compatibility.score >= 70
      ? "text-amber-600"
      : "text-orange-600";

  return (
    <div
      id="result-card"
      className="bg-white rounded-3xl border border-stone-100 shadow-sm overflow-hidden"
    >
      {/* 상단 헤더 */}
      <div className="bg-gradient-to-br from-amber-400 to-pink-500 p-6 text-white">
        <p className="text-sm font-medium opacity-80 mb-1">나의 결혼 상대</p>
        <h2 className="text-3xl font-bold">{partnerProfile.name}</h2>
        <p className="text-sm opacity-90 mt-1">
          {partnerProfile.age} · {partnerProfile.job}
        </p>
        <p className="text-sm mt-3 italic opacity-90">"{result.tagline}"</p>
      </div>

      <div className="p-6 space-y-5">
        {/* 성격 태그 */}
        <div className="space-y-2">
          <h3 className="text-xs font-semibold text-stone-400 uppercase tracking-wider">핵심 특성</h3>
          <div className="flex flex-wrap gap-2">
            {partnerProfile.personality.map((trait) => (
              <span
                key={trait}
                className="px-3 py-1 bg-amber-50 text-amber-700 rounded-full text-sm font-medium border border-amber-200"
              >
                {trait}
              </span>
            ))}
          </div>
        </div>

        {/* 생활/애정 표현 */}
        <div className="grid grid-cols-1 gap-3">
          <div className="bg-stone-50 rounded-2xl p-4">
            <p className="text-xs text-stone-400 font-medium mb-1">생활 방식</p>
            <p className="text-sm text-stone-700">{partnerProfile.lifestyle}</p>
          </div>
          <div className="bg-stone-50 rounded-2xl p-4">
            <p className="text-xs text-stone-400 font-medium mb-1">애정 표현 스타일</p>
            <p className="text-sm text-stone-700">{partnerProfile.loveLanguage}</p>
          </div>
        </div>

        {/* 궁합 점수 */}
        <div className="bg-stone-50 rounded-2xl p-4 space-y-2">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-semibold text-stone-400 uppercase tracking-wider">궁합 점수</h3>
            <span className={`text-2xl font-bold ${scoreColor}`}>{compatibility.score}점</span>
          </div>
          <div className="w-full h-2 bg-stone-200 rounded-full overflow-hidden">
            <div
              className="h-full rounded-full bg-gradient-to-r from-amber-400 to-pink-500 transition-all"
              style={{ width: `${compatibility.score}%` }}
            />
          </div>
          <p className="text-sm text-stone-600">{compatibility.summary}</p>
        </div>

        {/* 현실 체크 */}
        <div className="space-y-3">
          <div className="bg-green-50 rounded-2xl p-4 border border-green-100">
            <p className="text-xs font-semibold text-green-600 mb-1">✅ 이 조건의 장점</p>
            <p className="text-sm text-stone-700">{realityCheck.strengths}</p>
          </div>
          <div className="bg-orange-50 rounded-2xl p-4 border border-orange-100">
            <p className="text-xs font-semibold text-orange-500 mb-1">⚠️ 현실 주의사항</p>
            <p className="text-sm text-stone-700">{realityCheck.caution}</p>
          </div>
          <div className="bg-purple-50 rounded-2xl p-4 border border-purple-100">
            <p className="text-xs font-semibold text-purple-500 mb-1">🔍 숨겨진 기대 (심리 분석)</p>
            <p className="text-sm text-stone-700">{realityCheck.blindspot}</p>
          </div>
        </div>

        {/* 조언 */}
        <div className="bg-gradient-to-r from-amber-50 to-pink-50 rounded-2xl p-4 border border-amber-100">
          <p className="text-xs font-semibold text-amber-600 mb-1">💡 성공적인 결혼을 위한 조언</p>
          <p className="text-sm text-stone-700">{compatibility.tip}</p>
        </div>
      </div>
    </div>
  );
}
