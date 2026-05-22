export interface PsychQuestion {
  id: number;
  question: string;
  context: string;
  options: { value: string; label: string }[];
}

export const psychQuestions: PsychQuestion[] = [
  {
    id: 1,
    question: '결혼기념일, 상대가 깜짝 이벤트를 준비했어요. 근데 내 취향이 아니에요.',
    context: '어떻게 반응할 것 같아요?',
    options: [
      { value: 'A', label: '기뻐하면서 취향은 나중에 슬쩍 알려줄 것 같아요' },
      { value: 'B', label: '솔직하게 "다음엔 이런 거 해줘" 라고 말할 것 같아요' },
      { value: 'C', label: '이벤트 자체가 좋으니까 그냥 즐길 것 같아요' },
      { value: 'D', label: '조금 섭섭하지만 내색은 안 할 것 같아요' },
    ],
  },
  {
    id: 2,
    question: '상대가 갑자기 이직하겠다고 해요. 연봉이 줄 수도 있어요.',
    context: '어떤 반응이 나올 것 같아요?',
    options: [
      { value: 'A', label: '왜 하고 싶은지 먼저 충분히 들을 것 같아요' },
      { value: 'B', label: '현실적인 계획을 먼저 따져볼 것 같아요' },
      { value: 'C', label: '하고 싶으면 해야지, 응원해줄 것 같아요' },
      { value: 'D', label: '솔직히 좀 불안할 것 같아요' },
    ],
  },
  {
    id: 3,
    question: '명절에 양가 모두 오라고 해요. 일정이 겹쳐요.',
    context: '어떻게 하면 좋겠어요?',
    options: [
      { value: 'A', label: '번갈아가며 공평하게 방문하면 좋겠어요' },
      { value: 'B', label: '우리 가족이 우선이라고 생각해요' },
      { value: 'C', label: '두 집 다 잠깐씩이라도 얼굴 비추면 좋겠어요' },
      { value: 'D', label: '솔직히 가능하면 우리 둘만 보내고 싶어요' },
    ],
  },
  {
    id: 4,
    question: '아이가 아파서 오늘 회사를 빠져야 해요.',
    context: '누가 빠지는 게 맞다고 생각해요?',
    options: [
      { value: 'A', label: '그날 더 여유 있는 쪽이 가면 됨' },
      { value: 'B', label: '번갈아가며 맡는 게 맞음' },
      { value: 'C', label: '솔직히 제가 더 중요한 미팅이 있으면 상대방이 가면 좋겠음' },
      { value: 'D', label: '아이 일은 함께 결정하되 상대방에게 좀 더 기대게 될 것 같음' },
    ],
  },
  {
    id: 5,
    question: '상대가 친구들과 주말마다 나가요. 나는 집에서 쉬고 싶어요.',
    context: '어떤 마음이 들 것 같아요?',
    options: [
      { value: 'A', label: '괜찮아요. 각자 시간도 중요하죠' },
      { value: 'B', label: '가끔은 같이 있는 날도 만들면 좋겠다고 말할 것 같아요' },
      { value: 'C', label: '솔직히 조금 섭섭할 것 같아요' },
      { value: 'D', label: '나도 내 시간 즐기면 되니까 별로 신경 안 쓸 것 같아요' },
    ],
  },
  {
    id: 6,
    question: '예상치 못한 큰 돈이 생겼어요 (예: 성과급, 상속).',
    context: '어떻게 쓰면 좋겠어요?',
    options: [
      { value: 'A', label: '저축/투자로 미래를 대비하면 좋겠음' },
      { value: 'B', label: '집 마련이나 큰 목표에 쓰면 좋겠음' },
      { value: 'C', label: '둘이 여행이나 경험에 쓰면 좋겠음' },
      { value: 'D', label: '부모님께 드리거나 가족을 위해 쓰면 좋겠음' },
    ],
  },
  {
    id: 7,
    question: '결혼 5년차, 일상이 반복되고 설렘이 줄어든 것 같아요.',
    context: '어떻게 하고 싶어요?',
    options: [
      { value: 'A', label: '둘만의 여행이나 이벤트로 환기하면 좋겠어요' },
      { value: 'B', label: '안정적인 일상이 나쁘지 않다고 느낄 것 같아요' },
      { value: 'C', label: '새로운 취미나 도전을 함께 시작하면 좋겠어요' },
      { value: 'D', label: '솔직히 상대방과 깊은 대화가 필요할 것 같아요' },
    ],
  },
];
