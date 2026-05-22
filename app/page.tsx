import Link from "next/link";

export default function Home() {
  return (
    <main className="flex flex-col items-center justify-center min-h-screen px-4 py-16">
      <div className="max-w-lg w-full text-center space-y-8">
        <div className="space-y-3">
          <div className="text-5xl">💍</div>
          <h1 className="text-4xl font-bold text-stone-900">
            내 결혼 상대{" "}
            <span className="gradient-text">찾기</span>
          </h1>
          <p className="text-lg text-stone-500 leading-relaxed">
            감성 말고 현실.<br />
            내가 진짜 원하는 결혼 상대를 찾아드립니다.
          </p>
        </div>

        <div className="grid grid-cols-2 gap-4 text-left">
          {[
            { emoji: "💰", title: "현실 조건", desc: "연봉, 자산, 부채, 부모님 상황까지" },
            { emoji: "🧠", title: "심리 분석", desc: "7가지 시나리오로 숨겨진 기대 발굴" },
            { emoji: "🤖", title: "AI 분석", desc: "Gemini AI가 종합 프로필 생성" },
            { emoji: "📤", title: "공유 기능", desc: "URL 링크 + 이미지로 저장·공유" },
          ].map((item) => (
            <div
              key={item.title}
              className="bg-white rounded-2xl p-4 border border-stone-100 card-hover"
            >
              <div className="text-2xl mb-2">{item.emoji}</div>
              <div className="font-semibold text-stone-800 text-sm">{item.title}</div>
              <div className="text-xs text-stone-500 mt-1">{item.desc}</div>
            </div>
          ))}
        </div>

        <div className="space-y-3">
          <div className="flex items-center gap-2 text-sm text-stone-400 justify-center flex-wrap">
            <span className="w-6 h-6 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center font-bold text-xs">1</span>
            <span>현실 조건 설정</span>
            <span className="text-stone-300">→</span>
            <span className="w-6 h-6 rounded-full bg-pink-100 text-pink-600 flex items-center justify-center font-bold text-xs">2</span>
            <span>심리 테스트</span>
            <span className="text-stone-300">→</span>
            <span className="w-6 h-6 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center font-bold text-xs">3</span>
            <span>결과 확인</span>
          </div>

          <Link
            href="/checklist"
            className="block w-full py-4 px-8 bg-gradient-to-r from-amber-400 to-pink-500 text-white font-bold text-lg rounded-2xl shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-200 text-center"
          >
            지금 바로 시작하기 →
          </Link>

          <p className="text-xs text-stone-400">
            로그인 불필요 · 약 5분 소요
          </p>
        </div>
      </div>
    </main>
  );
}
