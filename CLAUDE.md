# 내 결혼 상대 찾기 앱

## 프로젝트 개요

> "감성 말고 현실. 내가 진짜 원하는 결혼 상대를 찾아드립니다."

일반적인 이상형 찾기 앱과 달리 **현실적인 결혼 조건(경제/가족/가치관/관계)**과 **심리 테스트**를 결합해 Gemini AI가 맞춤형 결혼 상대 프로필을 생성하는 웹 앱.

## 기술 스택

| 항목 | 선택 |
|------|------|
| Framework | Next.js 16 (App Router) + TypeScript |
| Styling | Tailwind CSS v4 |
| AI | Google Gemini API (`gemini-2.0-flash`) |
| 이미지 저장 | `html2canvas` |
| 배포 | Vercel 권장 |

## 환경 변수

`.env.local` 파일에 설정:

```env
GEMINI_API_KEY=your_gemini_api_key_here
```

**API 키 발급:** https://aistudio.google.com → Get API key (무료)

## 앱 플로우

```
/ (랜딩)
  → /checklist (파트1: 현실 조건 체크리스트, 4카테고리)
    → /test (파트2: 심리 테스트, 7문항)
      → /result (AI 분석 결과 + URL/이미지 공유)
```

## 파일 구조

```
app/
  page.tsx                  # 랜딩 페이지
  checklist/page.tsx        # 현실 조건 체크리스트 (4개 카테고리 스텝)
  test/page.tsx             # 심리 테스트 (7개 시나리오 질문)
  result/page.tsx           # AI 분석 결과 + 공유
  api/analyze/route.ts      # Gemini API POST 엔드포인트

components/
  ResultCard.tsx            # 결과 카드 UI (공유용 디자인, html2canvas 대상)
  ShareButtons.tsx          # URL 복사 + PNG 이미지 저장 버튼

lib/
  types.ts                  # ChecklistData, AnalysisResult 등 TypeScript 타입
  checklist.ts              # 4개 카테고리 × 체크리스트 항목 데이터
  questions.ts              # 심리 테스트 7문항 + 선택지 데이터
  gemini.ts                 # Gemini SDK 클라이언트 + 프롬프트 로직
  utils.ts                  # 결과/입력 데이터 base64 인코딩/디코딩 유틸
```

## 파트 1: 현실 조건 체크리스트

4개 카테고리를 단계별로 입력:

| 카테고리 | 항목 |
|---------|------|
| 💰 경제 | 최소 연봉, 최소 자산, 부채 허용 여부, 직업 안정성, 부모님 노후 준비, 결혼 지원 규모 |
| 🏠 가족/생활 | 거주 지역, 시댁/처가 관계, 종교 |
| 👶 가치관 | 자녀 계획, 역할 분담, 커리어 vs 가정 |
| 💬 관계 스타일 | 갈등 해결 방식, 감정 표현 빈도, 개인 시간 |

## 파트 2: 심리 테스트 시나리오 (7문항)

무의식적 기대를 발굴하는 시나리오 기반 질문:

1. 결혼기념일 이벤트 — 취향이 안 맞을 때 반응 → 배려 방식
2. 상대방 이직 — 연봉 감소 가능 → 경제 안정 vs 성장
3. 명절 양가 일정 충돌 → 가족 우선순위
4. 아이 아플 때 육아 담당 → 실제 롤 분담 기대
5. 상대방 주말 외출 빈도 → 개인 공간 / 의존도
6. 목돈 생겼을 때 사용처 → 재정 가치관
7. 결혼 5년차 루틴 → 안정 vs 변화 욕구

## AI 분석 결과 구조

Gemini가 생성하는 JSON:

```json
{
  "partnerProfile": { "name", "age", "job", "personality[]", "lifestyle", "loveLanguage" },
  "realityCheck": { "strengths", "caution", "blindspot" },
  "compatibility": { "score(60-95)", "summary", "tip" },
  "tagline": "한줄 문구"
}
```

## 공유 기능

- **URL 공유**: 결과를 base64로 인코딩 → `/result?result=BASE64` 형태로 공유 가능 (로그인 불필요)
- **이미지 저장**: `html2canvas`로 `#result-card` 캡처 → PNG 다운로드

## 개발 서버 실행

```bash
npm run dev
# → http://localhost:3000
```

## 배포 (Vercel)

```bash
npx vercel --prod
# 환경 변수 GEMINI_API_KEY 설정 필요
```
