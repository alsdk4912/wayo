export interface KitWeek {
  week: number;
  title: string;
  theme: string;
  englishFocus: string[];
  items: string[];
}

export interface ArtKit {
  id: string;
  name: string;
  track: string;
  totalWeeks: number;
  pricePerWeek: number;
  costPerWeek: number;
  fullSetPrice: number;
  partner: string;
  partnerRole: string;
  description: string;
  weeks: KitWeek[];
  stock: number;
  lowStockThreshold: number;
}

export interface KitOrder {
  id: string;
  tutorId: number;
  tutorName: string;
  kitId: string;
  week: number;
  quantity: number;
  unitPrice: number;
  margin: number;
  status: "pending" | "preparing" | "shipped" | "delivered";
  orderDate: string;
  sessionDate: string;
  childName: string;
  deliveryTo: "tutor" | "parent";
}

export const PARTNER = {
  name: "아트스튜디오 이지",
  role: "미술학원 원장 · 와요 공식 커리큘럼 파트너",
  settlementRate: 0.65,
  monthlyRevenue: 428000,
  pendingSettlement: 89200,
};

export const artKit: ArtKit = {
  id: "art-basic-8w",
  name: "와요 공식 미술 놀이 키트",
  track: "수채화·창의미술 8주 과정",
  totalWeeks: 8,
  pricePerWeek: 12000,
  costPerWeek: 8000,
  fullSetPrice: 88000,
  partner: PARTNER.name,
  partnerRole: PARTNER.role,
  description: "미술학원 원장이 직접 제작한 주차별 교구·재료. 강사 준비 부담 없이 표준 커리큘럼으로 진행할 수 있어요.",
  stock: 47,
  lowStockThreshold: 15,
  weeks: [
    {
      week: 1,
      title: "Rainbow Colors",
      theme: "무지개 색깔 탐험",
      englishFocus: ["red", "blue", "yellow", "mix colors"],
      items: ["수채 물감 6색", "두꺼운 도화지", "붓 세트", "팔레트", "색깔 카드"],
    },
    {
      week: 2,
      title: "Shape Friends",
      theme: "도형 친구들 그리기",
      englishFocus: ["circle", "square", "triangle", "big & small"],
      items: ["도형 스탬프", "컬러 페이퍼", "풀스틱", "가위(안전)", "도형 가이드 시트"],
    },
    {
      week: 3,
      title: "Animal Safari",
      theme: "동물 사파리 그림",
      englishFocus: ["cat", "dog", "bird", "I like..."],
      items: ["동물 스티커", "크레파스", "스케치북", "눈 스티커", "동물 카드"],
    },
    {
      week: 4,
      title: "Texture Play",
      theme: "촉감 놀이 미술",
      englishFocus: ["soft", "rough", "smooth", "feel"],
      items: ["알루미늄 호일", "면사", "스펀지", "접착 테이프", "촉감 샘플 카드"],
    },
    {
      week: 5,
      title: "My Family Portrait",
      theme: "우리 가족 초상화",
      englishFocus: ["mom", "dad", "sister", "brother", "family"],
      items: ["캔버스 보드", "아크릴 물감", "붓(중·소)", "연필", "가족 실루엣 카드"],
    },
    {
      week: 6,
      title: "Nature Collage",
      theme: "자연 콜라주",
      englishFocus: ["leaf", "flower", "tree", "outside"],
      items: ["건조화", "리본", "콜라주 베이스", "접착제", "자연물 수집 가방"],
    },
    {
      week: 7,
      title: "Dream Castle",
      theme: "꿈의 성 만들기",
      englishFocus: ["castle", "princess", "knight", "my dream"],
      items: ["색종이", "반짝이", "큐빅", "성 템플릿", "접착 스티커"],
    },
    {
      week: 8,
      title: "My Masterpiece",
      theme: "나만의 작품 전시",
      englishFocus: ["artist", "painting", "beautiful", "I made..."],
      items: ["액자 보드", "서명 스티커", "전시 라벨", "리본", "작품 설명 카드"],
    },
  ],
};

export const kitOrders: KitOrder[] = [
  {
    id: "ko1",
    tutorId: 1,
    tutorName: "Emma Johnson",
    kitId: "art-basic-8w",
    week: 3,
    quantity: 1,
    unitPrice: 12000,
    margin: 4000,
    status: "preparing",
    orderDate: "2026-06-17",
    sessionDate: "2026-06-20",
    childName: "지우 (7세)",
    deliveryTo: "tutor",
  },
  {
    id: "ko2",
    tutorId: 1,
    tutorName: "Emma Johnson",
    kitId: "art-basic-8w",
    week: 4,
    quantity: 1,
    unitPrice: 12000,
    margin: 4000,
    status: "pending",
    orderDate: "2026-06-17",
    sessionDate: "2026-06-21",
    childName: "서준 (6세)",
    deliveryTo: "tutor",
  },
  {
    id: "ko3",
    tutorId: 1,
    tutorName: "Emma Johnson",
    kitId: "art-basic-8w",
    week: 2,
    quantity: 1,
    unitPrice: 12000,
    margin: 4000,
    status: "delivered",
    orderDate: "2026-06-10",
    sessionDate: "2026-06-13",
    childName: "지우 (7세)",
    deliveryTo: "tutor",
  },
];

export function getKitMargin(unitPrice: number, cost: number) {
  return unitPrice - cost;
}

export function supportsArtKit(specialties: string[]) {
  return specialties.includes("미술");
}
