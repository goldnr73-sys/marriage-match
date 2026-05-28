export interface ChecklistItem {
  id: keyof import('./types').ChecklistData;
  label: string;
  type: 'select' | 'rating' | 'text';
  options?: string[];
  max?: number;
  placeholder?: string;
}

export interface ChecklistCategory {
  id: string;
  title: string;
  emoji: string;
  items: ChecklistItem[];
}

export const checklistCategories: ChecklistCategory[] = [
  {
    id: 'economic',
    title: '경제적 조건',
    emoji: '💰',
    items: [
      {
        id: 'minSalary',
        label: '최소 연봉 수준',
        type: 'select',
        options: ['상관없음', '3천만원 이하', '3천~5천만원', '5천~7천만원', '7천만원 이상'],
      },
      {
        id: 'minAsset',
        label: '최소 자산 수준',
        type: 'select',
        options: ['상관없음', '5천만원 이하', '5천만~1억원', '1억~3억원', '3억원 이상'],
      },
      {
        id: 'debtTolerance',
        label: '부채 허용 여부',
        type: 'select',
        options: ['있어도 괜찮음', '소액만 허용', '절대 안 됨'],
      },
      {
        id: 'jobStability',
        label: '직업 안정성 중요도',
        type: 'rating',
        max: 5,
      },
      {
        id: 'parentsRetirement',
        label: '부모님 노후 준비 여부',
        type: 'select',
        options: ['준비되어 있어야 함', '일부 준비면 됨', '상관없음'],
      },
      {
        id: 'weddingSupport',
        label: '결혼 지원 가능 규모',
        type: 'select',
        options: ['상관없음', '소액 지원이면 됨', '전세금 일부 지원', '주택 지원 기대'],
      },
    ],
  },
  {
    id: 'family',
    title: '가족/생활 방식',
    emoji: '🏠',
    items: [
      {
        id: 'livingArea',
        label: '거주 희망 지역',
        type: 'select',
        options: ['상관없음', '수도권', '지방', '해외'],
      },
      {
        id: 'inLawRelation',
        label: '시댁/처가 관계 기대',
        type: 'select',
        options: ['최대한 독립적으로', '적당히 왕래', '가족처럼 가까이'],
      },
      {
        id: 'religion',
        label: '종교',
        type: 'select',
        options: ['상관없음', '같은 종교이면 좋겠음', '종교 없는 사람'],
      },
      {
        id: 'ageDifference',
        label: '나이 차이 허용 범위',
        type: 'select',
        options: ['상관없음', '동갑 선호', '연상 선호 (1~5살)', '연상 선호 (5살 이상)', '연하 선호 (1~5살)', '연하 선호 (5살 이상)'],
      },
      {
        id: 'maxAgeDiff',
        label: '최대 허용 나이 차이',
        type: 'select',
        options: ['상관없음', '3살 이내', '5살 이내', '10살 이내', '10살 이상도 됨'],
      },
      {
        id: 'selfCareAgeTolerance',
        label: '자기 관리가 잘 된다면 나이 차이는?',
        type: 'select',
        options: ['상관없음', '변화 없음', '5살까지 허용', '8살까지 허용', '10살까지 허용', '나이 제한 없음'],
      },
    ],
  },
  {
    id: 'values',
    title: '가치관',
    emoji: '👶',
    items: [
      {
        id: 'childPlan',
        label: '자녀 계획',
        type: 'select',
        options: ['자녀를 원함', '상황 보고 결정', '자녀를 원하지 않음'],
      },
      {
        id: 'roleShare',
        label: '결혼 후 역할 분담',
        type: 'select',
        options: ['전통적 역할 분담', '가능한 반반', '맞벌이 필수'],
      },
      {
        id: 'careerVsFamily',
        label: '커리어 vs 가정',
        type: 'select',
        options: ['커리어 우선', '균형 중시', '가정 우선'],
      },
    ],
  },
  {
    id: 'relationship',
    title: '성격/관계 스타일',
    emoji: '💬',
    items: [
      {
        id: 'conflictStyle',
        label: '갈등 해결 방식',
        type: 'select',
        options: ['즉시 대화로 해결', '시간 가진 뒤 대화'],
      },
      {
        id: 'emotionExpression',
        label: '감정 표현 빈도',
        type: 'select',
        options: ['자주 표현해주면 좋겠음', '가끔이면 충분', '말 안 해도 알아주는 사람'],
      },
      {
        id: 'personalTime',
        label: '개인 시간 중요도',
        type: 'select',
        options: ['각자 시간 중요', '함께하는 시간이 더 좋음'],
      },
    ],
  },
  {
    id: 'appearance',
    title: '외모 & 첫인상',
    emoji: '✨',
    items: [
      {
        id: 'preferredHeight',
        label: '선호하는 키',
        type: 'select',
        options: ['상관없음', '나보다 크면 됨', '165cm 이상', '170cm 이상', '175cm 이상', '180cm 이상'],
      },
      {
        id: 'preferredBodyType',
        label: '선호하는 체형',
        type: 'select',
        options: ['상관없음', '슬림한 편', '보통 체형', '건강한 체형 (약간 근육)', '통통해도 괜찮음'],
      },
      {
        id: 'preferredStyle',
        label: '내가 좋아하는 스타일',
        type: 'text',
        placeholder: '예) 깔끔하고 단정한 편, 운동을 즐기는 느낌...',
      },
      {
        id: 'dislikedStyle',
        label: '내가 싫어하는 스타일',
        type: 'text',
        placeholder: '예) 지저분한 옷차림, 과한 향수...',
      },
    ],
  },
];
