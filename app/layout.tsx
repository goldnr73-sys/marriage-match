import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "내 결혼 상대 찾기 | 현실적인 결혼 조건 분석",
  description: "감성 말고 현실. 내가 진짜 원하는 결혼 상대를 AI가 분석해드립니다.",
  openGraph: {
    title: "내 결혼 상대 찾기",
    description: "현실 조건 체크리스트 + 심리 테스트로 찾는 나의 결혼 상대",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko" className="h-full">
      <body className="min-h-full flex flex-col bg-stone-50">{children}</body>
    </html>
  );
}
