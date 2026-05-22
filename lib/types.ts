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
}

export interface PsychAnswer {
  questionId: number;
  answer: string;
}

export interface AnalysisInput {
  checklist: ChecklistData;
  psychAnswers: PsychAnswer[];
}

export interface PartnerProfile {
  name: string;
  age: string;
  job: string;
  personality: string[];
  lifestyle: string;
  loveLanguage: string;
}

export interface RealityCheck {
  strengths: string;
  caution: string;
  blindspot: string;
}

export interface Compatibility {
  score: number;
  summary: string;
  tip: string;
}

export interface AnalysisResult {
  partnerProfile: PartnerProfile;
  realityCheck: RealityCheck;
  compatibility: Compatibility;
  tagline: string;
}
