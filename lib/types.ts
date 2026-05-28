export interface ChecklistData {
  // 경제적 조건
  minSalary: string;
  minAsset: string;
  debtTolerance: string;
  jobStability: number;
  parentsRetirement: string;
  weddingSupport: string;
  // 가족/생활
  livingArea: string;
  inLawRelation: string;
  religion: string;
  // 가치관
  childPlan: string;
  roleShare: string;
  careerVsFamily: string;
  // 관계 스타일
  conflictStyle: string;
  emotionExpression: string;
  personalTime: string;
  // 외모 & 첫인상
  preferredHeight: string;
  preferredBodyType: string;
  preferredStyle: string;
  dislikedStyle: string;
  // 나이 차이
  ageDifference: string;
  maxAgeDiff: string;
  selfCareAgeTolerance: string;
}

export interface ChatMessage {
  role: 'ai' | 'user';
  content: string;
}

export interface AnalysisInput {
  checklist: ChecklistData;
  chatHistory: ChatMessage[];
}

export interface PsychInsight {
  insight: string;      // 대화에서 나타난 핵심 패턴
  hiddenDesire: string; // 숨겨진 기대
  reality: string;      // 현실 조건과의 괴리 / 주의점
  tagline: string;      // 한줄 요약
}

export interface AnalysisResult {
  psychInsight: PsychInsight;
}
