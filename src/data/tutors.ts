export interface Review {
  id: number;
  parentName: string;
  childAge: string;
  childrenDesc: string;
  rating: number;
  date: string;
  content: string;
  highlight: string;
  avatar: string;
  keywords: string[];
}

export interface TimeSlot {
  day: string;
  slots: string[];
}

export interface Tutor {
  id: number;
  name: string;
  nameKo: string;
  affiliation: string;
  role: string;
  specialties: string[];
  hourlyRate: number;
  rating: number;
  reviewCount: number;
  location: string;
  photo: string;
  intro: string;
  longIntro: string;
  verified: {
    basic: {
      idCard: boolean;
      selfie: boolean;
      visa: boolean;
      affiliation: boolean;
    };
    premium: {
      criminalRecord: boolean;
      safetyTraining: boolean;
    };
  };
  availableSlots: TimeSlot[];
  reviews: Review[];
  tags: string[];
  experience: string;
  languages: string[];
}

export const tutors: Tutor[] = [
  {
    id: 1,
    name: "Emma Johnson",
    nameKo: "엠마 존슨",
    affiliation: "와요 공인 강사",
    role: "아동 미술·영어 놀이 전문",
    specialties: ["미술", "창의놀이", "스토리텔링"],
    hourlyRate: 25000,
    rating: 4.9,
    reviewCount: 23,
    location: "서울 마포구",
    photo: "https://i.pravatar.cc/300?img=47",
    intro: "아이들과 함께 그림 그리며 영어로 놀아요! 🎨",
    longIntro:
      "안녕하세요! 저는 미국 오레곤 출신의 원어민 강사 엠마예요. 아동 미술과 영어 놀이를 전문으로 하며, 합법적인 활동 비자를 소지한 와요 공인 강사입니다. 수채화와 아크릴화를 즐겨 그리며, 아이들에게 영어로 색깔, 모양, 감정을 표현하는 법을 가르쳐 드릴 수 있어요.",
    verified: {
      basic: { idCard: true, selfie: true, visa: true, affiliation: true },
      premium: { criminalRecord: true, safetyTraining: true },
    },
    availableSlots: [
      { day: "월요일", slots: ["10:00", "14:00", "16:00"] },
      { day: "수요일", slots: ["10:00", "14:00"] },
      { day: "금요일", slots: ["10:00", "13:00", "15:00"] },
      { day: "토요일", slots: ["10:00", "11:00", "14:00"] },
    ],
    reviews: [
      {
        id: 1,
        parentName: "김○○ 맘",
        childAge: "5세",
        childrenDesc: "5세 딸 엄마",
        rating: 5,
        date: "2025-03-15",
        highlight: "수업 후 '엠마 언니 또 와?'를 반복해요",
        content:
          "우리 아이가 처음엔 낯선 언니 보고 숨더니 30분도 안 되어서 같이 그림 그리고 있었어요. 엠마 선생님이 아이 눈높이에서 천천히 다가와 주셨고, 수업 끝나고도 '엠마 언니 또 와?'를 반복해요. 영어로 색깔 이름 말하는 걸 집에서도 쓰더라고요! 미술 놀이 키트도 직접 챙겨오셔서 어질러질 걱정도 없었어요. 재료비도 따로 안 받으셔서 감동이었습니다.",
        avatar: "https://i.pravatar.cc/50?img=5",
        keywords: ["아이와 잘 놀아줘요", "미술 키트 지참", "영어 자연스럽게"],
      },
      {
        id: 2,
        parentName: "이○○ 맘",
        childAge: "7세",
        childrenDesc: "7세·4세 두 아이 엄마",
        rating: 5,
        date: "2025-02-28",
        highlight: "그림을 영어로 설명하는 영상, 너무 감동이었습니다",
        content:
          "미술 전공이라 그런지 아이에게 다양한 기법을 가르쳐 주셨어요. 수업 내내 영어로 진행되는데 아이가 하나도 지루해하지 않고 집중했어요. 수업 후 그려온 그림을 영어로 설명하는 짧은 영상을 카카오톡으로 보내주셨는데 너무 감동이었습니다. 둘째도 같이 참여하고 싶다고 해서 두 아이 함께 수업 부탁드렸는데 흔쾌히 진행해 주셨어요.",
        avatar: "https://i.pravatar.cc/50?img=9",
        keywords: ["세션 후 영상 보고서", "형제 동반 가능", "체계적인 수업"],
      },
      {
        id: 3,
        parentName: "박○○ 맘",
        childAge: "6세",
        childrenDesc: "6세 아들 엄마",
        rating: 5,
        date: "2025-02-10",
        highlight: "신원 검증 배지 보고 바로 예약했어요",
        content:
          "처음 만나는 날 신분증·비자·소속 확인이 완료된 강사라는 게 프로필에 표시돼 있어서 안심하고 예약했어요. 프리미엄 인증까지 완료된 강사라 범죄경력증명과 안전교육도 확인됐고요. 아이도 선생님을 금방 따라서 첫날부터 영어로 대화하려 하더라고요.",
        avatar: "https://i.pravatar.cc/50?img=12",
        keywords: ["신원 투명 공개", "첫날부터 잘 따름", "안심 100%"],
      },
    ],
    tags: ["미술", "창의력", "온화한성격", "교육전공"],
    experience: "아동 미술 지도 3년, 방과후 영어 프로그램 보조 2년",
    languages: ["영어 (원어민)", "한국어 (초급)"],
  },
  {
    id: 2,
    name: "Jake Miller",
    nameKo: "제이크 밀러",
    affiliation: "국제학교 체육 프로그램",
    role: "신체활동·영어 놀이 강사",
    specialties: ["신체놀이", "스포츠", "야외활동"],
    hourlyRate: 22000,
    rating: 4.8,
    reviewCount: 18,
    location: "서울 서초구",
    photo: "https://i.pravatar.cc/300?img=15",
    intro: "공 던지고 뛰면서 영어로 수다 떨어요! ⚽",
    longIntro:
      "하이, 저는 캘리포니아 출신의 원어민 강사 제이크예요! 국제학교 체육 프로그램에서 활동하며, 아이들에게 몸을 움직이는 즐거움과 함께 영어를 자연스럽게 배울 수 있도록 도와드려요.",
    verified: {
      basic: { idCard: true, selfie: true, visa: true, affiliation: true },
      premium: { criminalRecord: true, safetyTraining: true },
    },
    availableSlots: [
      { day: "화요일", slots: ["15:00", "17:00"] },
      { day: "목요일", slots: ["15:00", "17:00"] },
      { day: "토요일", slots: ["10:00", "13:00", "15:00"] },
      { day: "일요일", slots: ["10:00", "14:00"] },
    ],
    reviews: [
      {
        id: 1,
        parentName: "최○○ 맘",
        childAge: "8세",
        childrenDesc: "8세 아들 엄마",
        rating: 5,
        date: "2025-03-20",
        highlight: "아이가 먼저 'shoot!' 외치며 영어에 흥미 붙였어요!",
        content:
          "에너지 넘치는 우리 아들이 드디어 영어에 흥미를 붙였어요! 제이크 선생님이 거실에서 미니 농구 놀이를 하면서 영어로만 소통하는데, 아이가 먼저 'shoot!' 'pass!' 이러면서 따라 하더라고요. 유일하게 6개월 기다려도 못 들어간 영어유치원 대신 선택했는데 너무 만족스러워요. 강력 추천합니다.",
        avatar: "https://i.pravatar.cc/50?img=33",
        keywords: ["에너지 넘치는 수업", "스포츠로 영어 시작", "남아 강추"],
      },
      {
        id: 2,
        parentName: "정○○ 맘",
        childAge: "7세",
        childrenDesc: "7세·5세 두 아이 엄마",
        rating: 5,
        date: "2025-03-01",
        highlight: "기본 인증만으로도 안심, 프리미엄 인증은 더 믿음직해요",
        content:
          "남자아이 두 명을 맡아주셨는데 정말 프로페셔널하게 관리해 주셨어요. 와요 기본 인증(신분증·얼굴·비자·소속)과 프리미엄 인증까지 완료된 강사라 믿고 맡겼어요. 영어유치원 월 150만원 내던 게 너무 아깝다는 걸 이제야 알았어요.",
        avatar: "https://i.pravatar.cc/50?img=41",
        keywords: ["안전 서류 확인", "형제 동반 수업", "가성비 최고"],
      },
    ],
    tags: ["스포츠", "신체발달", "활동적", "남아추천"],
    experience: "청소년 스포츠 캠프 코치 2년, ESL 보조 교사 1년",
    languages: ["영어 (원어민)", "스페인어 (중급)"],
  },
  {
    id: 3,
    name: "Sophie Chen",
    nameKo: "소피 첸",
    affiliation: "영어유치원 정규 강사 경력",
    role: "동화·보드게임·STEM 전문",
    specialties: ["동화읽기", "보드게임", "STEM놀이"],
    hourlyRate: 28000,
    rating: 5.0,
    reviewCount: 31,
    location: "서울 강남구",
    photo: "https://i.pravatar.cc/300?img=44",
    intro: "책 속 세상을 영어로 여행해요! 📚",
    longIntro:
      "안녕하세요, 저는 캐나다 밴쿠버 출신 원어민 강사 소피예요. 영어유치원에서 정규 강사로 활동한 경력이 있으며, 아동발달에 맞춘 영어 놀이를 전문으로 합니다.",
    verified: {
      basic: { idCard: true, selfie: true, visa: true, affiliation: true },
      premium: { criminalRecord: true, safetyTraining: true },
    },
    availableSlots: [
      { day: "월요일", slots: ["10:00", "13:00", "16:00"] },
      { day: "화요일", slots: ["10:00", "13:00"] },
      { day: "수요일", slots: ["10:00", "14:00", "16:00"] },
      { day: "금요일", slots: ["10:00", "13:00"] },
    ],
    reviews: [
      {
        id: 1,
        parentName: "강○○ 맘",
        childAge: "4세",
        childrenDesc: "4세 딸 엄마",
        rating: 5,
        date: "2025-03-25",
        highlight: "가르치는 느낌 없이 자연스럽게 영어가 스며들어요",
        content:
          "4살짜리에게 영어를 어떻게 가르치나 걱정했는데 소피 선생님은 전혀 '가르치는' 느낌이 없었어요. 그냥 같이 놀면서 영어로 된 노래 부르고 책 읽어주셨는데 아이가 자기도 모르게 따라 하더라고요. 너무 자연스러워서 깜짝 놀랐습니다. 아동발달 전공이라 연령에 맞는 접근법도 정말 탁월해요.",
        avatar: "https://i.pravatar.cc/50?img=20",
        keywords: ["자연스러운 영어 노출", "연령별 맞춤 접근", "4세도 OK"],
      },
      {
        id: 2,
        parentName: "윤○○ 맘",
        childAge: "6세",
        childrenDesc: "6세 아들·3세 딸 두 아이 엄마",
        rating: 5,
        date: "2025-03-10",
        highlight: "영어유치원 비용의 1/10, 효과는 비슷하거나 더 좋아요",
        content:
          "3개월째 이용 중인데 아이의 영어 노출 양이 확실히 늘었어요. 매 세션 후에 간단한 활동 보고서를 카카오톡으로 보내주셔서 오늘 뭘 했는지 알 수 있어서 좋아요. 영어유치원 비용의 10분의 1도 안 되는데 효과는 비슷하거나 더 좋은 것 같아요. 3개월 꾸준히 하니 아이가 영어 그림책을 혼자 펼쳐보게 됐어요.",
        avatar: "https://i.pravatar.cc/50?img=25",
        keywords: ["세션 보고서 제공", "3개월 꾸준히 변화", "최고의 가성비"],
      },
      {
        id: 3,
        parentName: "손○○ 맘",
        childAge: "5세",
        childrenDesc: "5세·2세 두 아이 엄마",
        rating: 5,
        date: "2025-02-15",
        highlight: "수업 없는 날도 '소피 언니?' 찾아요 — 그게 답이에요",
        content:
          "안전교육 이수증과 비자·소속 확인이 프로필에 표시돼 있어서 너무 믿음직스러웠어요. 월정기권 구독 후 활동 사진과 AI 리포트까지 받으니 남편도 동의하게 됐어요.",
        avatar: "https://i.pravatar.cc/50?img=31",
        keywords: ["서류 완벽 공개", "아이가 먼저 찾아요", "남편도 동의"],
      },
    ],
    tags: ["동화책", "보드게임", "STEM", "꼼꼼한선생님", "영유경험"],
    experience: "영어유치원 보조교사 2년, 어린이집 자원봉사 1년",
    languages: ["영어 (원어민)", "중국어 (원어민)", "한국어 (중급)"],
  },
  {
    id: 4,
    name: "Liam O'Brien",
    nameKo: "리암 오브라이언",
    affiliation: "와요 기본 인증 강사",
    role: "음악·율동 영어 놀이",
    specialties: ["음악놀이", "율동", "뮤지컬"],
    hourlyRate: 23000,
    rating: 4.7,
    reviewCount: 14,
    location: "서울 성동구",
    photo: "https://i.pravatar.cc/300?img=11",
    intro: "노래하고 춤추면서 영어 감각을 키워요! 🎵",
    longIntro:
      "헬로, 저는 아일랜드 더블린 출신 원어민 강사 리암이에요! 기타와 율동을 활용한 영어 놀이를 전문으로 하며, 와요 기본 인증을 완료한 강사입니다. 프리미엄 인증은 준비 중이에요.",
    verified: {
      basic: { idCard: true, selfie: true, visa: true, affiliation: true },
      premium: { criminalRecord: false, safetyTraining: false },
    },
    availableSlots: [
      { day: "수요일", slots: ["15:00", "17:00"] },
      { day: "금요일", slots: ["14:00", "16:00"] },
      { day: "토요일", slots: ["11:00", "13:00", "15:00"] },
    ],
    reviews: [
      {
        id: 1,
        parentName: "임○○ 맘",
        childAge: "5세",
        childrenDesc: "5세 딸 엄마",
        rating: 5,
        date: "2025-03-18",
        highlight: "이제 집에서 혼자 영어 노래를 흥얼거려요!",
        content:
          "말수 적은 우리 딸아이가 노래로 영어를 시작하더니 이제 집에서 혼자 영어 노래를 흥얼거려요! 리암 선생님 덕분에 영어가 즐거운 것이라는 인식이 생긴 것 같아요. 기타 반주도 해주시고 율동도 같이 하시는데 아이가 너무 재밌어해요. 부끄러움 많은 아이한테 이렇게 효과가 좋을 줄 몰랐어요.",
        avatar: "https://i.pravatar.cc/50?img=49",
        keywords: ["노래로 영어 시작", "수줍은 아이 강추", "기타 반주 있어요"],
      },
      {
        id: 2,
        parentName: "조○○ 맘",
        childAge: "6세",
        childrenDesc: "6세 아들 엄마",
        rating: 4,
        date: "2025-02-25",
        highlight: "기본 인증으로도 충분히 안심, 프리미엄 인증은 곧 완료 예정",
        content:
          "음악 활동 위주라서 아이가 굉장히 즐거워해요. 기본 인증(신분증·얼굴·비자·소속)은 완료되어 있어서 신뢰할 수 있었고, 프리미엄 인증은 4월 초 완료 예정이라고 하셨어요.",
        avatar: "https://i.pravatar.cc/50?img=52",
        keywords: ["음악 활동 최고", "안전교육 수료 예정", "신뢰 기반 있음"],
      },
    ],
    tags: ["음악", "노래", "발음교정", "율동", "수줍은아이추천"],
    experience: "음악 교육 자원봉사 1년, 아이리쉬 댄스 강사 2년",
    languages: ["영어 (원어민)", "아일랜드어 (초급)"],
  },
  {
    id: 5,
    name: "Mia Thompson",
    nameKo: "미아 톰슨",
    affiliation: "유아 STEAM 전문 강사",
    role: "쿠킹·과학실험 영어 놀이",
    specialties: ["쿠킹클래스", "과학실험", "자연탐구"],
    hourlyRate: 26000,
    rating: 4.9,
    reviewCount: 20,
    location: "서울 용산구",
    photo: "https://i.pravatar.cc/300?img=48",
    intro: "요리하고 실험하면서 영어로 '왜?'를 찾아요! 🍳",
    longIntro:
      "하이, 저는 호주 시드니 출신 원어민 강사 미아예요! 유아 STEAM 체험 학습을 전문으로 하며, 쿠킹과 과학 실험을 영어로 진행합니다.",
    verified: {
      basic: { idCard: true, selfie: true, visa: true, affiliation: true },
      premium: { criminalRecord: true, safetyTraining: true },
    },
    availableSlots: [
      { day: "화요일", slots: ["10:00", "14:00"] },
      { day: "목요일", slots: ["10:00", "14:00", "16:00"] },
      { day: "토요일", slots: ["10:00", "13:00"] },
    ],
    reviews: [
      {
        id: 1,
        parentName: "황○○ 맘",
        childAge: "7세",
        childrenDesc: "7세 딸 엄마",
        rating: 5,
        date: "2025-03-22",
        highlight: "쿠키 만들며 배운 영어 단어, 아직도 기억해요!",
        content:
          "쿠킹 수업을 하면서 계량컵에 적힌 영어, 레시피 읽기를 함께 배웠는데 아이가 너무 좋아했어요. 실제로 쿠키를 만들어서 먹었는데 그날 배운 단어들을 아직도 기억하더라고요. 학습 효과 최고입니다! 미아 선생님이 재료를 직접 사 오셔서 저는 뒷정리만 했어요. 정말 편하고 감동이었어요.",
        avatar: "https://i.pravatar.cc/50?img=37",
        keywords: ["쿠킹으로 영어 학습", "재료 직접 준비", "기억에 오래 남아요"],
      },
      {
        id: 2,
        parentName: "서○○ 맘",
        childAge: "8세",
        childrenDesc: "8세·6세 두 아이 엄마",
        rating: 5,
        date: "2025-03-05",
        highlight: "화산 실험을 영어로 — 두 아이가 완전히 빠졌어요",
        content:
          "과학 실험을 영어로 진행해 주셔서 아이가 흥미진진해했어요. 화산 만들기, 달걀 실험 등 집에서 할 수 있는 안전한 실험들을 준비해 오셔서 감동받았습니다. 모든 재료가 식품 안전 기준 내에 있어서 두 아이 모두 마음 놓고 참여했어요. 유아교육 전공이라 실험 과정에서도 영어 설명이 정말 체계적이에요.",
        avatar: "https://i.pravatar.cc/50?img=42",
        keywords: ["안전한 과학 실험", "영어 체계적 설명", "두 아이 동반 가능"],
      },
    ],
    tags: ["쿠킹", "과학실험", "탐구형", "체험학습", "호기심아이추천"],
    experience: "유아 STEM 프로그램 보조 2년, 호주 데이케어 근무 1년",
    languages: ["영어 (원어민)", "프랑스어 (초급)"],
  },
  {
    id: 6,
    name: "Noah Williams",
    nameKo: "노아 윌리엄스",
    affiliation: "와요 공인 강사",
    role: "코딩·레고 영어 놀이",
    specialties: ["코딩놀이", "레고/블록", "퍼즐"],
    hourlyRate: 27000,
    rating: 4.8,
    reviewCount: 11,
    location: "서울 종로구",
    photo: "https://i.pravatar.cc/300?img=13",
    intro: "블록 쌓고 코딩하며 영어로 생각해요! 🤖",
    longIntro:
      "안녕하세요, 저는 미국 시애틀 출신 원어민 강사 노아예요! 레고와 언플러그드 코딩 놀이를 영어로 진행하며, 와요 공인 강사로 활동 중입니다.",
    verified: {
      basic: { idCard: true, selfie: true, visa: true, affiliation: true },
      premium: { criminalRecord: true, safetyTraining: true },
    },
    availableSlots: [
      { day: "월요일", slots: ["15:00", "17:00"] },
      { day: "수요일", slots: ["15:00", "17:00"] },
      { day: "토요일", slots: ["10:00", "13:00", "15:00"] },
    ],
    reviews: [
      {
        id: 1,
        parentName: "차○○ 맘",
        childAge: "8세",
        childrenDesc: "8세 아들 엄마",
        rating: 5,
        date: "2025-03-12",
        highlight: "영어를 '공부'가 아니라 '활동'으로 인식하게 됐어요",
        content:
          "레고 좋아하는 아들에게 딱 맞는 선생님을 찾았어요! 영어로 설계도 읽고 블록 맞추면서 수업하니까 아이가 1시간이 금방 지나간다고 해요. 덕분에 영어를 '공부'가 아니라 '활동'으로 인식하게 됐어요. 컴공 전공이라 코딩 로직을 쉽게 설명해 주시는 것도 큰 장점이에요. 초등 입학 전 준비로 이보다 좋은 선택은 없을 것 같아요.",
        avatar: "https://i.pravatar.cc/50?img=60",
        keywords: ["레고로 영어 시작", "코딩 로직 연결", "초등 입학 준비"],
      },
    ],
    tags: ["코딩", "레고", "STEM", "논리적사고", "조용한아이추천"],
    experience: "방과후 코딩 클럽 보조 1년, 아이 돌봄 봉사 2년",
    languages: ["영어 (원어민)", "일본어 (초급)"],
  },
];
