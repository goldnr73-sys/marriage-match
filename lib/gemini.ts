import Groq from 'groq-sdk';
import { AnalysisInput, AnalysisResult } from './types';

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

export async function analyzeMarriagePartner(input: AnalysisInput): Promise<AnalysisResult> {
  const chatSummary = input.chatHistory
    .map((m) => `${m.role === 'ai' ? '[아이]' : '[사용자]'}: ${m.content}`)
    .join('\n');

  const prompt = `You are a Korean marriage psychology analyst. Analyze the conversation below and respond ONLY with valid JSON.

CRITICAL: Every string value in the JSON must be written in Korean (한국어) ONLY.
NEVER use Chinese characters (漢字), Japanese, Russian, or any non-Korean script.
Use ONLY Korean Hangul (한글), spaces, numbers, and basic punctuation like .,!?~

[대화 내용]
${chatSummary}

The user's partner-seeking style must be classified into ONE of these 4 types:
- 안정탐색형: Prioritizes economic stability and trust above all
- 감성교류형: Seeks deep conversation and emotional sharing
- 독립동반자형: Values personal autonomy with equal partnership
- 가정헌신형: Centers on family, stability, and mutual devotion

Respond with ONLY this JSON structure, no other text:
{
  "psychInsight": {
    "insight": "2-3 sentences in Korean describing the core psychological pattern found in the conversation",
    "hiddenDesire": "2-3 sentences in Korean describing hidden expectations the user may not be aware of",
    "reality": "2-3 sentences in Korean with honest, direct reality check about contradictions or concerns",
    "tagline": "One memorable Korean sentence summarizing this person's view on marriage",
    "partnerType": "안정탐색형 or 감성교류형 or 독립동반자형 or 가정헌신형",
    "typeDescription": "1-2 sentences in Korean explaining why this type fits this person"
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

  // 한자·일본어·러시아어 제거
  const strip = (s: string) => s.replace(/[一-鿿぀-ヿЀ-ӿ]/g, '').replace(/\s{2,}/g, ' ').trim();
  result.psychInsight.insight = strip(result.psychInsight.insight);
  result.psychInsight.hiddenDesire = strip(result.psychInsight.hiddenDesire);
  result.psychInsight.reality = strip(result.psychInsight.reality);
  result.psychInsight.tagline = strip(result.psychInsight.tagline);
  result.psychInsight.typeDescription = strip(result.psychInsight.typeDescription);

  return result;
}
