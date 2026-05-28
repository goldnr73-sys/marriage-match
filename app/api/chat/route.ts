import { NextRequest, NextResponse } from "next/server";
import Groq from "groq-sdk";
import { ChatMessage } from "@/lib/types";

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

const SYSTEM_PROMPT = `You are a Korean-language marriage psychology analysis AI named "아이".
Your task is to have a natural conversation in KOREAN ONLY to understand the user's expectations about a marriage partner.

CRITICAL LANGUAGE RULE:
- You MUST respond ONLY in Korean (한국어)
- NEVER use Chinese characters (漢字), Japanese, Russian, English, or any other language
- Use ONLY Korean Hangul (한글), numbers, and basic punctuation
- If you catch yourself about to write a non-Korean character, replace it with the Korean equivalent

Conversation rules:
- Use friendly informal Korean speech (반말): "~야", "~어", "~지?", "~거야?"
- Ask only ONE question per message
- Show empathy with the user's answers before asking the next question
- Keep messages short (2-3 sentences max)
- Topics to explore naturally:
  * 갈등 상황에서의 태도
  * 경제관과 소비 스타일
  * 가족 관계 기대
  * 혼자만의 시간 vs 함께하는 시간
  * 미래 계획에 대한 태도
  * 감정 표현 방식

After the user's 8th reply, wrap up warmly in Korean and add exactly this at the end: [DONE]`;

export async function POST(req: NextRequest) {
  try {
    const { messages, isFirst }: { messages: ChatMessage[]; isFirst?: boolean } = await req.json();

    const groqMessages: Groq.Chat.ChatCompletionMessageParam[] = [
      { role: "system", content: SYSTEM_PROMPT },
    ];

    if (isFirst) {
      groqMessages.push({
        role: "user",
        content: "대화를 시작해줘",
      });
    } else {
      for (const msg of messages) {
        groqMessages.push({
          role: msg.role === "ai" ? "assistant" : "user",
          content: msg.content,
        });
      }
    }

    const completion = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: groqMessages,
      temperature: 0.9,
      max_tokens: 300,
    });

    const raw = completion.choices[0].message.content ?? "";
    const isDone = raw.includes("[DONE]");
    // 한자·일본어·러시아어·영어 등 비한글 문자 제거
    const cleanContent = raw
      .replace("[DONE]", "")
      .replace(/[一-鿿぀-ヿЀ-ӿ]/g, "")
      .replace(/[a-zA-Z]+/g, "")
      .replace(/\s{2,}/g, " ")
      .trim();

    return NextResponse.json({ content: cleanContent, done: isDone });
  } catch (error) {
    console.error("채팅 오류:", error);
    return NextResponse.json({ error: "채팅 오류가 발생했습니다." }, { status: 500 });
  }
}
