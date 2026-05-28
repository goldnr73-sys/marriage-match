# 내 결혼 상대 찾기 앱

## 프로젝트 개요

> "감성 말고 현실. 내가 진짜 원하는 결혼 상대를 찾아드립니다."

현실적인 결혼 조건(경제/가족/가치관/관계) 체크리스트 + AI 채팅 심리 분석을 결합해 맞춤형 결혼 상대 리포트를 생성하는 웹 앱.

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
  → /checklist  (파트1: 현실 조건 체크리스트, 4카테고리)
    → /chat     (파트2: AI "아이"와 채팅 심리 분석, 8회 대화)
      → /result (분석 결과 — 조건 나열 + 심리 분석 + 공유)
```

## 파일 구조

```
app/
  page.tsx                  # 랜딩 페이지
  checklist/page.tsx        # 현실 조건 체크리스트 (4카테고리 스텝)
  chat/page.tsx             # AI 채팅 심리 분석 페이지
  test/page.tsx             # /chat 으로 리다이렉트 (하위 호환)
  result/page.tsx           # 분석 결과 + URL/이미지 공유
  api/
    chat/route.ts           # 채팅 AI API (Groq)
    analyze/route.ts        # 결과 분석 API (Groq)

components/
  ResultCard.tsx            # 결과 카드 (조건 나열 + 심리 분석 두 섹션)
  ShareButtons.tsx          # URL 복사 + PNG 이미지 저장

lib/
  types.ts                  # ChecklistData, ChatMessage, AnalysisResult 타입
  checklist.ts              # 4카테고리 × 체크리스트 항목 데이터
  gemini.ts                 # Groq 클라이언트 + 분석 프롬프트 (파일명 유지)
  utils.ts                  # base64 인코딩/디코딩 유틸
```

## 파트 1: 현실 조건 체크리스트

4개 카테고리를 단계별로 입력:

| 카테고리 | 항목 |
|---------|------|
| 💰 경제 | 최소 연봉, 최소 자산, 부채 허용 여부, 직업 안정성, 부모님 노후 준비, 결혼 지원 규모 |
| 🏠 가족/생활 | 거주 지역, 시댁/처가 관계, 종교 |
| 👶 가치관 | 자녀 계획, 역할 분담, 커리어 vs 가정 |
| 💬 관계 스타일 | 갈등 해결 방식, 감정 표현 빈도, 개인 시간 |

## 파트 2: AI 채팅 심리 분석

- AI 캐릭터 **"아이"** 가 먼저 말을 걸고 반말로 자연스럽게 대화
- 사용자가 자유 텍스트로 답변 (선택지 없음)
- 8번 대화 후 자동 종료 → 결과 페이지로 이동
- 진행도 바 + `●●●` 타이핑 인디케이터
- 탐색 주제: 갈등 태도 / 경제관 / 가족 관계 / 개인 시간 / 감정 표현 / 미래 계획

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

## 비한국어 문자 필터

Groq LLaMA 모델이 한자·러시아어를 혼용하는 문제를 두 단계로 방지:
1. **프롬프트**: "ONLY Korean Hangul, NEVER use Chinese/Japanese/Russian" 명시
2. **후처리**: 정규식 `/[一-鿿぀-ヿЀ-ӿ]/g` 로 비한글 CJK/키릴 문자 제거
   - 채팅 API: `app/api/chat/route.ts`
   - 분석 API: `lib/gemini.ts`

## URL 공유

- 결과 URL에 checklist + chat 데이터 포함 (base64 인코딩)
- `/result?checklist=BASE64&chat=BASE64` 형태
- 로그인 불필요

## 개발 서버 실행

```bash
npm run dev
# → http://localhost:3000
```

## 배포 (Vercel)

```bash
npx vercel --prod
# 환경 변수 GROQ_API_KEY 설정 필요
```
