"use client";

import { useState, useEffect, useRef, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { ChatMessage } from "@/lib/types";

const MAX_EXCHANGES = 8;

function getPreChatSlides(nickname: string) {
  const name = nickname || "잠깐";
  return [
    { text: `${nickname ? nickname + ", " : ""}솔직하게 답해줘서 고마워!` },
    { text: `이 보고서는 단순한 설문이 아닌,\n${name}의 결혼 가치관을\n심리적으로 분석하는 보고서야.` },
    { text: `${name}에게 맞는 결혼 상대를\n더 정확하게 알기 위해\n나랑 잠깐 대화해보자.` },
    { text: "그동안의 연애와 관계 경험을\n되돌아보는 좋은 기회가 될거야." },
    { text: "솔직하게 얘기해줄수록\n훨씬 정확한 결과를 받아볼 수 있어." },
    { text: "자, 그러면 시작해보자!", isCta: true },
  ];
}

function ChatContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const checklistEncoded = searchParams.get("checklist") ?? "";
  const nicknameParam = searchParams.get("nickname") ?? "";

  const [showPreChat, setShowPreChat] = useState(true);
  const [preChatSlide, setPreChatSlide] = useState(0);
  const [preChatVisible, setPreChatVisible] = useState(true);

  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [userCount, setUserCount] = useState(0);
  const [isDone, setIsDone] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const progress = Math.min((userCount / MAX_EXCHANGES) * 100, 100);

  useEffect(() => {
    if (!showPreChat) startChat();
  }, [showPreChat]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  function handlePreChatNext() {
    const slides = getPreChatSlides(nicknameParam);
    if (preChatSlide < slides.length - 1) {
      setPreChatVisible(false);
      setTimeout(() => {
        setPreChatSlide((p) => p + 1);
        setPreChatVisible(true);
      }, 200);
    } else {
      setShowPreChat(false);
    }
  }

  async function startChat() {
    setIsTyping(true);
    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: [], isFirst: true, nickname: nicknameParam }),
      });
      const data = await res.json();
      setMessages([{ role: "ai", content: data.content }]);
    } catch {
      setMessages([{ role: "ai", content: "안녕! 나랑 잠깐 대화해볼까? 결혼 상대에 대해 좀 더 깊이 알아보려고 해." }]);
    } finally {
      setIsTyping(false);
    }
  }

  async function sendMessage() {
    const text = input.trim();
    if (!text || isTyping || isDone) return;

    const newMessages: ChatMessage[] = [...messages, { role: "user", content: text }];
    setMessages(newMessages);
    setInput("");
    setUserCount((c) => c + 1);
    setIsTyping(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: newMessages, nickname: nicknameParam }),
      });
      const data = await res.json();
      const aiMessages: ChatMessage[] = [...newMessages, { role: "ai", content: data.content }];
      setMessages(aiMessages);

      if (data.done) {
        setIsDone(true);
        setTimeout(() => goToResult(aiMessages), 2000);
      }
    } catch {
      setMessages((prev) => [...prev, { role: "ai", content: "잠깐, 뭔가 오류가 났어. 다시 시도해줄래?" }]);
    } finally {
      setIsTyping(false);
      inputRef.current?.focus();
    }
  }

  function goToResult(finalMessages: ChatMessage[]) {
    const chatEncoded = encodeURIComponent(btoa(encodeURIComponent(JSON.stringify(finalMessages))));
    router.push(`/result?checklist=${checklistEncoded}&chat=${chatEncoded}`);
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  }

  if (showPreChat) {
    const slides = getPreChatSlides(nicknameParam);
    const slide = slides[preChatSlide];
    const isLast = preChatSlide === slides.length - 1;

    return (
      <div className="min-h-screen bg-white flex flex-col select-none">
        {/* 헤더 */}
        <div className="flex items-center justify-between px-6 pt-4 pb-0">
          <div />
          <span className="text-xs text-gray-400 tracking-widest">marriage-match</span>
          <div />
        </div>

        {/* 본문 */}
        <div
          className={`flex-1 flex flex-col items-center justify-center px-10 text-center gap-8 transition-opacity duration-200 ${preChatVisible ? "opacity-100" : "opacity-0"}`}
        >
          {/* 펄 구체 */}
          <div className="w-36 h-36 rounded-full bg-gradient-to-br from-gray-50 to-gray-200 shadow-[inset_-8px_-8px_16px_rgba(0,0,0,0.08),inset_4px_4px_8px_rgba(255,255,255,0.9),0_8px_32px_rgba(0,0,0,0.08)]" />

          {/* 텍스트 */}
          <p className="text-gray-600 text-xl leading-relaxed whitespace-pre-line">
            {slide.text}
          </p>

          {/* 버튼 */}
          {isLast ? (
            <button
              onClick={handlePreChatNext}
              className="px-10 py-4 rounded-2xl bg-gray-900 text-white font-semibold text-base hover:bg-gray-800 transition-colors"
            >
              대화 시작하기
            </button>
          ) : (
            <button
              onClick={handlePreChatNext}
              className="px-10 py-3 rounded-full bg-gray-100 text-gray-500 text-base hover:bg-gray-200 transition-colors"
            >
              다음
            </button>
          )}
        </div>

        {/* 하단 도트 */}
        <div className="flex justify-center gap-1.5 pb-8">
          {slides.map((_, i) => (
            <div
              key={i}
              className={`rounded-full transition-all duration-300 ${
                i === preChatSlide
                  ? "w-5 h-1.5 bg-gray-800"
                  : "w-1.5 h-1.5 bg-gray-200"
              }`}
            />
          ))}
        </div>
      </div>
    );
  }

  return (
    <main className="flex flex-col h-screen max-w-lg mx-auto">
      {/* 헤더 */}
      <div className="flex-none px-4 pt-6 pb-3 space-y-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-pink-300 to-purple-400 flex items-center justify-center text-white text-sm font-bold">
              행복
            </div>
            <span className="font-semibold text-stone-800">행복이와 대화</span>
          </div>
          <span className="text-sm text-stone-400">{Math.round(progress)}%</span>
        </div>
        <div className="w-full h-1.5 bg-stone-200 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-pink-400 to-purple-500 rounded-full transition-all duration-500"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* 메시지 영역 */}
      <div className="flex-1 overflow-y-auto px-4 py-2 space-y-3">
        {messages.map((msg, i) => (
          <div key={i} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
            {msg.role === "ai" && (
              <div className="w-7 h-7 rounded-full bg-gradient-to-br from-pink-300 to-purple-400 flex-none mr-2 mt-1 flex items-center justify-center text-white text-xs font-bold">
                행
              </div>
            )}
            <div
              className={`max-w-[78%] px-4 py-3 rounded-2xl text-sm leading-relaxed ${
                msg.role === "ai"
                  ? "bg-white border border-stone-100 text-stone-800 rounded-tl-sm shadow-sm"
                  : "bg-gradient-to-br from-pink-400 to-purple-500 text-white rounded-tr-sm"
              }`}
            >
              {msg.content}
            </div>
          </div>
        ))}

        {/* 타이핑 인디케이터 */}
        {isTyping && (
          <div className="flex justify-start">
            <div className="w-7 h-7 rounded-full bg-gradient-to-br from-pink-300 to-purple-400 flex-none mr-2 mt-1 flex items-center justify-center text-white text-xs font-bold">
              행
            </div>
            <div className="bg-white border border-stone-100 rounded-2xl rounded-tl-sm px-4 py-3 shadow-sm">
              <span className="flex gap-1 items-center h-4">
                {[0, 1, 2].map((i) => (
                  <span
                    key={i}
                    className="w-1.5 h-1.5 bg-stone-400 rounded-full animate-bounce"
                    style={{ animationDelay: `${i * 0.15}s` }}
                  />
                ))}
              </span>
            </div>
          </div>
        )}

        {isDone && (
          <div className="text-center py-3">
            <span className="text-xs text-stone-400 bg-stone-100 px-3 py-1 rounded-full">
              분석 중으로 이동하는 중...
            </span>
          </div>
        )}

        <div ref={bottomRef} />
      </div>

      {/* 입력창 */}
      <div className="flex-none px-4 py-4 border-t border-stone-100 bg-white">
        <div className="flex gap-2">
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={isDone ? "대화가 끝났어요" : "메시지를 입력하세요..."}
            disabled={isDone || isTyping}
            className="flex-1 px-4 py-3 rounded-2xl border border-stone-200 text-sm focus:outline-none focus:border-pink-300 disabled:bg-stone-50 disabled:text-stone-400"
          />
          <button
            onClick={sendMessage}
            disabled={!input.trim() || isDone || isTyping}
            className="w-11 h-11 rounded-2xl bg-gradient-to-br from-pink-400 to-purple-500 text-white flex items-center justify-center disabled:opacity-40 disabled:cursor-not-allowed transition-opacity"
          >
            <svg className="w-4 h-4 rotate-90" fill="currentColor" viewBox="0 0 20 20">
              <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" />
            </svg>
          </button>
        </div>
      </div>
    </main>
  );
}

export default function ChatPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center text-stone-400">로딩 중...</div>}>
      <ChatContent />
    </Suspense>
  );
}
