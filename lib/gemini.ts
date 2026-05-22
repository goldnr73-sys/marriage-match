import { GoogleGenerativeAI } from '@google/generative-ai';
import { AnalysisInput, AnalysisResult } from './types';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

export async function analyzeMarriagePartner(input: AnalysisInput): Promise<AnalysisResult> {
  const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });

  const checklistSummary = Object.entries(input.checklist)
    .map(([k, v]) => `${k}: ${v}`)
    .join('\n');

  const psychSummary = input.psychAnswers
    .map((a) => `Q${a.questionId}: ${a.answer}`)
    .join('\n');

  const prompt = `당신은 결혼 심리 전문가이자 현실적인 연애 코치입니다.
사용자가 원하는 결혼 상대 조건과 심리 테스트 결과를 분석하여 현실적인 이상형 프로필을 생성해주세요.

[명시적 조건 체크리스트]
${checklistSummary}

[심리 테스트 답변]
${psychSummary}

위 데이터를 분석하여 아래 JSON 형식으로만 응답해주세요. 다른 텍스트는 절대 포함하지 마세요.
JSON의 모든 값은 한국어로 작성해주세요.
personality 배열에는 정확히 3개의 항목이 있어야 합니다.
score는 60에서 95 사이의 정수여야 합니다.

{
  "partnerProfile": {
    "name": "이름 (예: 지현, 민준 등 한국 이름)",
    "age": "나이대 (예: 29~33세)",
    "job": "직업군 (예: 공기업 직원, IT 개발자, 의료계 종사자 등)",
    "personality": ["특성1", "특성2", "특성3"],
    "lifestyle": "생활 방식 한 두 문장 설명",
    "loveLanguage": "애정 표현 방식 한 문장"
  },
  "realityCheck": {
    "strengths": "이 조건 조합의 장점 (2~3문장)",
    "caution": "현실적으로 주의할 점 — 솔직하고 유머러스하게 (2~3문장)",
    "blindspot": "심리 테스트에서 발견된 숨겨진 기대나 패턴 (2~3문장)"
  },
  "compatibility": {
    "score": 85,
    "summary": "궁합 한줄 요약",
    "tip": "성공적인 결혼을 위한 실용적인 조언 (1~2문장)"
  },
  "tagline": "이 결과를 대표하는 인상적인 한 줄 문구"
}`;

  const result = await model.generateContent(prompt);
  const text = result.response.text();

  const jsonMatch = text.match(/\{[\s\S]*\}/);
  if (!jsonMatch) throw new Error('Gemini 응답에서 JSON을 찾을 수 없습니다.');

  return JSON.parse(jsonMatch[0]) as AnalysisResult;
}
