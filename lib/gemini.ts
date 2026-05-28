import Groq from 'groq-sdk';
import { AnalysisInput, AnalysisResult } from './types';

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

export async function analyzeMarriagePartner(input: AnalysisInput): Promise<AnalysisResult> {
  const chatSummary = input.chatHistory
    .map((m) => `${m.role === 'ai' ? '[아이]' : '[사용자]'}: ${m.content}`)
    .join('\n');

  const prompt = `You are a Korean marriage psychology analyst. Your PRIMARY goal is to write razor-sharp, deeply personalized insights based ONLY on what this specific person actually said in the conversation below.

CRITICAL LANGUAGE RULES:
- Every string value must be written in Korean (한국어) ONLY
- NEVER use Chinese characters (漢字), Japanese, Russian, or any non-Korean script
- Use ONLY Korean Hangul (한글), spaces, numbers, and basic punctuation like .,!?~

PERSONALIZATION RULES (most important):
- You MUST reference specific things the user actually said, specific words they used, or specific patterns in HOW they answered
- NEVER write generic statements that could apply to anyone
- Each sentence must feel like it was written ONLY for this exact person
- Do NOT let the type classification influence the analysis — analyze first, classify second

[대화 내용]
${chatSummary}

After writing the personalized analysis, classify into ONE type based solely on what emerged:
- 안정탐색형: economic stability and reliability above all else
- 감성교류형: emotional depth and conversation as the core bond
- 독립동반자형: personal autonomy within an equal partnership
- 가정헌신형: family-centered life with deep mutual commitment

Respond with ONLY this JSON structure, no other text:
{
  "psychInsight": {
    "insight": "2-3 sentences: what specific patterns in THIS person's answers reveal about their psychology — cite what they actually said",
    "hiddenDesire": "2-3 sentences: what this person's WAY of answering (not just the content) suggests they unconsciously want — be specific and surprising",
    "reality": "2-3 sentences: the sharpest honest contradiction or blind spot found specifically in THIS conversation — be direct, not generic",
    "tagline": "One memorable Korean sentence that captures THIS person's unique marriage philosophy",
    "partnerType": "안정탐색형 or 감성교류형 or 독립동반자형 or 가정헌신형",
    "typeDescription": "1-2 sentences: why THIS specific person's answers led to this classification"
  }
}`;

  const completion = await groq.chat.completions.create({
    model: 'llama-3.3-70b-versatile',
    messages: [{ role: 'user', content: prompt }],
    temperature: 0.7,
  });

  const text = completion.choices[0].message.content ?? '';
  const jsonMatch = text.match(/\{[\s\S]*\}/);
  if (!jsonMatch) throw new Error('응답에서 JSON을 찾을 수 없습니다.');

  const result = JSON.parse(jsonMatch[0]) as AnalysisResult;

  // 한자·일본어·러시아어·영어 제거
  const strip = (s: string) => s.replace(/[一-鿿぀-ヿЀ-ӿa-zA-Z]/g, '').replace(/\s{2,}/g, ' ').trim();
  result.psychInsight.insight = strip(result.psychInsight.insight);
  result.psychInsight.hiddenDesire = strip(result.psychInsight.hiddenDesire);
  result.psychInsight.reality = strip(result.psychInsight.reality);
  result.psychInsight.tagline = strip(result.psychInsight.tagline);
  result.psychInsight.typeDescription = strip(result.psychInsight.typeDescription);

  return result;
}
