export interface PremiumExample {
  id: string;
  title: string;
  icon: string;
  color: string;
  summary: string;
  example: {
    date: string;
    tutor: string;
    child: string;
    content: string;
    details: string[];
    preview?: string;
  };
}

export const premiumExamples: PremiumExample[] = [
  {
    id: "photos",
    title: "활동 후 사진",
    icon: "📸",
    color: "from-violet-500 to-purple-600",
    summary: "세션 종료 후 활동 사진이 자동으로 전송됩니다.",
    example: {
      date: "2026-06-13 15:05",
      tutor: "Emma Johnson",
      child: "지우 (7세)",
      content: "오늘 수채화 놀이 — 색깔 이름을 영어로 말하며 그림을 그렸어요.",
      details: [
        "사진 6장 자동 업로드",
        "아이 얼굴 블러 처리 옵션 적용",
        "갤러리에서 날짜별 조회 가능",
      ],
      preview: "🎨 Emma와 함께한 Watercolor Time — red, blue, green!",
    },
  },
  {
    id: "diary",
    title: "활동일지 자동생성",
    icon: "📝",
    color: "from-blue-500 to-cyan-500",
    summary: "세션 내용이 구조화된 일지로 자동 정리됩니다.",
    example: {
      date: "2026-06-13",
      tutor: "Emma Johnson",
      child: "지우 (7세)",
      content: "【오늘의 활동】 미술(수채화) 40분 · 영어 단어 게임 15분 · 마무리 노래 5분",
      details: [
        "학습 단어: red, blue, brush, paint, beautiful",
        "아이 참여도: ★★★★★",
        "다음 세션 제안: 색깔 혼합 실험",
      ],
    },
  },
  {
    id: "location",
    title: "실시간 위치 공유",
    icon: "📍",
    color: "from-emerald-500 to-teal-500",
    summary: "강사 도착·활동·종료 시점의 위치를 확인할 수 있어요.",
    example: {
      date: "2026-06-13",
      tutor: "Emma Johnson",
      child: "지우 (7세)",
      content: "세션 타임라인",
      details: [
        "13:55 도착 확인 — 서울 마포구 ○○아파트",
        "14:00 세션 시작",
        "15:00 세션 종료 · 안전 귀가 확인",
      ],
      preview: "🗺️ 지도에서 실시간 이동 경로 확인 (데모)",
    },
  },
  {
    id: "ai-report",
    title: "AI 놀이영어 리포트",
    icon: "✨",
    color: "from-amber-500 to-orange-500",
    summary: "아이가 사용한 영어 표현을 AI가 분석·요약해 드려요.",
    example: {
      date: "2026-06-13",
      tutor: "Emma Johnson",
      child: "지우 (7세)",
      content: "지우는 오늘 12개의 새 영어 단어에 노출되었고, 5개를 스스로 발화했어요.",
      details: [
        "자발 발화: \"I like blue!\", \"This is my painting\"",
        "발음 피드백: 'th' 발음 연습 필요",
        "추천 홈 활동: 색깔 카드로 영어 이름 말하기",
      ],
    },
  },
];
