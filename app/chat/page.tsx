"use client";

import { useState, useEffect, useRef, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { ChatMessage } from "@/lib/types";

const MAX_EXCHANGES = 8;

function ChatContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const checklistEncoded = searchParams.get("checklist") ?? "";

  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [userCount, setUserCount] = useState(0);
  const [isDone, setIsDone] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const progress = Math.min((userCount / MAX_EXCHANGES) * 100, 100);

  useEffect(() => {
    startChat();
  }, []);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  async function startChat() {
    setIsTyping(true);
    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: [], isFirst: true }),
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
        body: JSON.stringify({ messages: newMessages }),
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

  return (
    <main className="flex flex-col h-screen max-w-lg mx-auto">
      {/* 헤더 */}
      <div className="flex-none px-4 pt-6 pb-3 space-y-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-pink-300 to-purple-400 flex items-center justify-center text-white text-sm font-bold">
              아이
            </div>
            <span className="font-semibold text-stone-800">아이와 대화</span>
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
                아
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
              아
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
