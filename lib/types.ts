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
  insight: string;
  hiddenDesire: string;
  reality: string;
  tagline: string;
  partnerType: '안정탐색형' | '감성교류형' | '독립동반자형' | '가정헌신형';
  typeDescription: string;
}

export interface AnalysisResult {
  psychInsight: PsychInsight;
}
