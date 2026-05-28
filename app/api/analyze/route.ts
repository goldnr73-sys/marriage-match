import { NextRequest, NextResponse } from "next/server";
import { analyzeMarriagePartner } from "@/lib/gemini";
import { AnalysisInput } from "@/lib/types";

export async function POST(req: NextRequest) {
  try {
    const input: AnalysisInput = await req.json();
    const result = await analyzeMarriagePartner(input);
    return NextResponse.json(result);
  } catch (error) {
    console.error("분석 오류:", error);
    return NextResponse.json({ error: "분석 중 오류가 발생했습니다." }, { status: 500 });
  }
}
