# 내 결혼 상대 찾기 앱

## 프로젝트 개요

> "감성 말고 현실. 내가 진짜 원하는 결혼 상대를 찾아드립니다."

현실적인 결혼 조건(경제/가족/가치관/관계/외모) 체크리스트 + AI 채팅 심리 분석을 결합해 맞춤형 결혼 상대 리포트를 생성하는 웹 앱.

## 기술 스택

| 항목 | 선택 |
|------|------|
| Framework | Next.js 16 (App Router) + TypeScript |
| Styling | Tailwind CSS v4 |
| AI | Groq API (`llama-3.3-70b-versatile`) |
| 이미지 저장 | `html2canvas` |
| 배포 | Vercel 권장 |

## 환경 변수

`.env.local` 파일에 설정:

```env
GROQ_API_KEY=your_groq_api_key_here
```

**API 키 발급:** https://console.groq.com → API Keys (무료, 카드 불필요)

## 앱 플로우

```
/ (랜딩)
  → /checklist
      [1] 인트로 슬라이드 (9장, 탭/클릭으로 진행)
      [2] 닉네임 입력 (필수, 최대 10자)
      [3] 현실 조건 체크리스트 (5카테고리)
  → /chat
      [4] 행복이 소개 슬라이드 (6장)
      [5] AI "행복이"와 채팅 심리 분석 (8회 대화)
  → /result (분석 결과 — 조건 나열 + 심리 분석 + 공유)
```

## 파일 구조

```
app/
  page.tsx                  # 랜딩 페이지
  checklist/page.tsx        # 인트로 슬라이드 → 닉네임 입력 → 체크리스트
  chat/page.tsx             # 행복이 소개 슬라이드 → AI 채팅
  test/page.tsx             # /chat 으로 리다이렉트 (하위 호환)
  result/page.tsx           # 분석 결과 + URL/이미지 공유
  api/
    chat/route.ts           # 채팅 AI API (Groq) — 닉네임 수신 후 프롬프트 반영
    analyze/route.ts        # 결과 분석 API (Groq)

components/
  ResultCard.tsx            # 결과 카드 (조건 나열 + 심리 분석 두 섹션)
  ShareButtons.tsx          # URL 복사 + PNG 이미지 저장

lib/
  types.ts                  # ChecklistData, ChatMessage, AnalysisResult 타입
  checklist.ts              # 5카테고리 × 체크리스트 항목 데이터 (select/rating/text 타입)
  gemini.ts                 # Groq 클라이언트 + 분석 프롬프트 (파일명 유지)
  utils.ts                  # base64 인코딩/디코딩 유틸
```

## URL 파라미터 흐름

```
/checklist
  → /chat?checklist=BASE64&nickname=URL_ENCODED
    → /result?checklist=BASE64&chat=BASE64
```

- `nickname`: 체크리스트 닉네임 입력 → chat API 시스템 프롬프트에 삽입
- `checklist`: 5카테고리 선택값 JSON → base64
- `chat`: 대화 메시지 배열 JSON → base64

## [1] 인트로 슬라이드 (checklist 진입 시)

`/checklist` 진입 시 9장 스토리텔링 슬라이드 표시.

- 구현: `app/checklist/page.tsx` 상단 `introSlides` 배열
- 상태: `showIntro: boolean`, `currentSlide: number`, `visible: boolean`
- 슬라이드 전환 시 200ms 페이드 애니메이션 (`transition-opacity duration-200`)
- 탭/클릭으로 진행, 하단 도트 네비게이터, 상단 진행 바
- 마지막 슬라이드 "시작하기" → 닉네임 입력 화면으로 전환

### 슬라이드 구성 (9장)

| # | highlight | title/sub |
|---|-----------|-----------|
| 1 | 결혼, 언제쯤 하게 될까요? | — |
| 2 | 어떤 사람과 하느냐입니다. | title: 언제보다 더 중요한 건, |
| 3 | 막상 말하기 어렵지 않으세요? | title: 그런데 '어떤 사람'인지 |
| 4 | — | title: A씨는 설렘으로 결혼을 결정했습니다. / sub: 나중에서야 깨달았습니다. |
| 5 | "나는 어떤 사람이 필요한가?" | title: B씨는 먼저 자신에게 물었습니다. |
| 6 | 자신의 기준이 있었느냐 없었느냐입니다. | title: 차이는 결혼 전, |
| 7 | — | title: 결혼에서 중요한 건 사람마다 다릅니다. / sub: 돈? 가치관? 생활 방식? 가족 관계? |
| 8 | 당신도 몰랐던 기준이 보입니다. | title: 행복이와 이야기하다 보면, |
| 9 | 지금부터 검사를 시작해볼까요? | isCta: true |

## [2] 닉네임 입력

인트로 마지막 슬라이드 "시작하기" 클릭 후 표시.

- 구현: `app/checklist/page.tsx` `showNickname` 상태
- 필수 입력 (빈값이면 버튼 비활성화), 최대 10자
- Enter 또는 "테스트 시작하기" 버튼으로 체크리스트 진입
- 건너뛰기 없음

## [3] 파트 1: 현실 조건 체크리스트

5개 카테고리를 단계별로 입력:

| 카테고리 | 항목 |
|---------|------|
| 💰 경제 | 최소 연봉, 최소 자산, 부채 허용 여부, 직업 안정성, 부모님 노후 준비, 결혼 지원 규모 |
| 🏠 가족/생활 | 거주 지역, 시댁/처가 관계, 종교, 나이 차이 허용 범위, 최대 허용 나이 차이, 자기 관리 조건부 나이 차이 |
| 👶 가치관 | 자녀 계획, 역할 분담, 커리어 vs 가정 |
| 💬 관계 스타일 | 갈등 해결 방식, 감정 표현 빈도, 개인 시간 |
| ✨ 외모 & 첫인상 | 선호하는 키, 선호하는 체형, 좋아하는 스타일 (자유 입력), 싫어하는 스타일 (자유 입력) |

## [4] 행복이 소개 슬라이드 (chat 진입 시)

`/chat` 진입 시 체크리스트 완료를 축하하고 대화를 예고하는 6장 슬라이드 표시.
행복이(AI)가 사용자에게 직접 말을 거는 형식 (반말).

- 구현: `app/chat/page.tsx` `getPreChatSlides(nickname)` 함수 + `showPreChat` 상태
- 상태: `showPreChat: boolean`, `preChatSlide: number`, `preChatVisible: boolean`
- 200ms 페이드 애니메이션
- 마지막 슬라이드 "대화 시작하기" 클릭 시 `startChat()` API 호출 시작
- 디자인: 흰 배경, CSS 펄 구체, "다음"(회색 pill) / "대화 시작하기"(검정 버튼), 하단 도트

### 슬라이드 구성 (6장, {닉네임} 보간)

| # | 텍스트 |
|---|--------|
| 1 | `{닉네임}, 솔직하게 답해줘서 고마워!` |
| 2 | `이 보고서는 단순한 설문이 아닌, {닉네임}의 결혼 가치관을 심리적으로 분석하는 보고서야.` |
| 3 | `{닉네임}에게 맞는 결혼 상대를 더 정확하게 알기 위해 나랑 잠깐 대화해보자.` |
| 4 | `그동안의 연애와 관계 경험을 되돌아보는 좋은 기회가 될거야.` |
| 5 | `솔직하게 얘기해줄수록 훨씬 정확한 결과를 받아볼 수 있어.` |
| 6 | `자, 그러면 시작해보자!` + "대화 시작하기" 버튼 |

## [5] 파트 2: AI 채팅 심리 분석

- AI 캐릭터 **"행복이"** 가 먼저 말을 걸고 반말로 자연스럽게 대화
- 사용자가 자유 텍스트로 답변 (선택지 없음)
- 8번 대화 후 자동 종료 → 결과 페이지로 이동
- 진행도 바 + `●●●` 타이핑 인디케이터
- 탐색 주제: 갈등 태도 / 경제관 / 가족 관계 / 개인 시간 / 감정 표현 / 미래 계획
- 닉네임이 있으면 행복이가 대화 중 닉네임으로 호칭

## 결과 화면 구성

### 섹션 A — 내가 설정한 조건 (객관적 나열)
체크리스트에서 선택한 값을 카테고리별로 그대로 표시

### 섹션 B — AI 심리 분석 (채팅 기반)
| 항목 | 내용 |
|------|------|
| 대화에서 발견된 패턴 | 핵심 심리 패턴 |
| 숨겨진 기대 | 사용자가 인식 못한 무의식적 기대 |
| 현실 체크 | 조건과 심리 사이의 괴리, 솔직한 주의사항 |

## AI 분석 결과 구조 (JSON)

```json
{
  "psychInsight": {
    "insight": "핵심 심리 패턴 (2~3문장)",
    "hiddenDesire": "숨겨진 기대 (2~3문장)",
    "reality": "현실 체크 (직설적, 2~3문장)",
    "tagline": "결혼관 한줄 요약"
  }
}
```

## AI 캐릭터: 행복이

- 이름: **행복이** (구: 아이)
- 시스템 프롬프트: `app/api/chat/route.ts` `SYSTEM_PROMPT`
- 닉네임 처리: 요청 body의 `nickname` 값을 받아 `nameClause`로 프롬프트에 추가
  ```
  The user's nickname is "{nickname}". Address them as "{nickname}" naturally in conversation.
  ```
- 아바타: `bg-gradient-to-br from-pink-300 to-purple-400`, 텍스트 "행"

## 비한국어 문자 필터

Groq LLaMA 모델이 한자·러시아어·영어를 혼용하는 문제를 두 단계로 방지:
1. **프롬프트**: "ONLY Korean Hangul, NEVER use Chinese/Japanese/Russian/English" 명시
2. **후처리**: 정규식으로 비한글 문자 제거
   - CJK/키릴 제거: `/[一-鿿぀-ヿЀ-ӿ]/g`
   - 영어/라틴 제거: `/[a-zA-Z]+/g`
   - 채팅 API: `app/api/chat/route.ts`
   - 분석 API: `lib/gemini.ts`

## 개발 서버 실행

```bash
cd /Users/geumdain/newidea/marriage-match
npm run dev
# → http://localhost:3000
```

## 배포 (Vercel)

```bash
npx vercel --prod
# 환경 변수 GROQ_API_KEY 설정 필요
```

## GitHub

- Repository: `goldnr73-sys/marriage-match`
- Branch: `main`
