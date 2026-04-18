import { Link } from "react-router-dom";

const stats = [
  { value: "1/100", label: "영어유치원 대비 비용", highlight: true },
  { value: "3단계", label: "검증된 안심 시스템", highlight: false },
  { value: "100%", label: "원어민 대학생 파트너", highlight: false },
];

const valueCards = [
  {
    emoji: "💰",
    title: "영어유치원의 1/100 비용",
    desc: "월 평균 150만원 이상의 영어유치원, 와요는 주 1회 세션 기준 월 10만원대로 시작해요.",
    bg: "bg-blue-50",
    border: "border-blue-100",
  },
  {
    emoji: "🏡",
    title: "우리 집 거실 속 원어민 친구",
    desc: "낯선 기관이 아닌 아이가 가장 편한 공간, 우리 집에서 진행하는 1:1 밀착 케어.",
    bg: "bg-amber-50",
    border: "border-amber-100",
  },
  {
    emoji: "🛡️",
    title: "간호사 출신의 3단계 안심 검증",
    desc: "비자 확인 → 범죄이력 조회 → 안전교육 이수. 꼼꼼한 3단계 검증으로 우리 아이를 지켜요.",
    bg: "bg-green-50",
    border: "border-green-100",
  },
  {
    emoji: "🎨",
    title: "노는 것 같은데 영어가 된다",
    desc: "미술, 스포츠, 요리, 음악... 아이가 좋아하는 활동으로 자연스럽게 영어에 노출돼요.",
    bg: "bg-purple-50",
    border: "border-purple-100",
  },
];

const steps = [
  {
    num: "01",
    title: "튜터 검색",
    desc: "특기와 지역으로 딱 맞는 튜터를 찾아요",
    icon: "🔍",
  },
  {
    num: "02",
    title: "프로필 확인",
    desc: "검증 배지, 후기, 가능 시간을 꼼꼼히 확인해요",
    icon: "📋",
  },
  {
    num: "03",
    title: "직접 예약",
    desc: "중간 수수료 없이 튜터와 직접 연결돼요",
    icon: "📅",
  },
  {
    num: "04",
    title: "우리 집에서 시작",
    desc: "편한 우리 집에서 첫 세션을 시작해요",
    icon: "🏠",
  },
];

const verificationSteps = [
  {
    step: "STEP 1",
    title: "비자 확인",
    desc: "D-2(유학) 비자 소지 여부를 확인해 합법적인 체류 자격을 검증합니다.",
    icon: "🛂",
    color: "text-blue-600",
    bg: "bg-blue-100",
  },
  {
    step: "STEP 2",
    title: "범죄이력 조회",
    desc: "외국인 등록증 기반 경찰청 범죄 경력 조회 결과를 직접 확인합니다.",
    icon: "🔒",
    color: "text-emerald-600",
    bg: "bg-emerald-100",
  },
  {
    step: "STEP 3",
    title: "안전교육 이수",
    desc: "아동 안전 및 응급처치 교육 이수증을 검토합니다. 간호사 출신 운영자가 직접 심사합니다.",
    icon: "📜",
    color: "text-amber-600",
    bg: "bg-amber-100",
  },
];

const testimonials = [
  {
    content:
      "영어유치원 보내려고 대기만 6개월이었는데, 와요 덕분에 당장 다음 주부터 시작할 수 있었어요. 비용도 10분의 1이고 아이도 더 좋아해요!",
    name: "이○○ 맘",
    child: "5세 아들",
    avatar: "https://i.pravatar.cc/60?img=5",
    rating: 5,
  },
  {
    content:
      "간호사 출신 대표님이 직접 튜터를 검증하신다고 해서 믿음이 갔어요. 실제로 비자, 범죄이력, 안전교육까지 모두 확인된 튜터만 등록된다는 게 가장 큰 장점이에요.",
    name: "김○○ 맘",
    child: "7세 딸",
    avatar: "https://i.pravatar.cc/60?img=9",
    rating: 5,
  },
  {
    content:
      "기관 보내기가 무서웠는데 우리 집에서 한다니까 남편도 동의했어요. 아이가 자기 방에서 엠마 선생님이랑 그림 그리는 거 보고 있으면 너무 행복해요.",
    name: "박○○ 맘",
    child: "4세 딸",
    avatar: "https://i.pravatar.cc/60?img=12",
    rating: 5,
  },
];

// ─── 로드맵 페이즈 컴포넌트 ───────────────────────────
interface RoadmapPhaseProps {
  phase: string;
  period: string;
  status: "current" | "planned" | "future";
  statusLabel: string;
  color: "blue" | "amber" | "emerald";
  icon: string;
  title: string;
  subtitle: string;
  goals: string[];
  execNote: string;
}

const colorMap = {
  blue: {
    ring: "ring-blue-400",
    bg: "bg-blue-600",
    lightBg: "bg-blue-50",
    border: "border-blue-200",
    text: "text-blue-700",
    badge: "bg-blue-600",
    iconBg: "bg-blue-100",
    dot: "bg-blue-500",
    noteBg: "bg-blue-50",
    noteText: "text-blue-700",
    noteBorder: "border-blue-200",
  },
  amber: {
    ring: "ring-amber-400",
    bg: "bg-amber-500",
    lightBg: "bg-amber-50",
    border: "border-amber-200",
    text: "text-amber-700",
    badge: "bg-amber-500",
    iconBg: "bg-amber-100",
    dot: "bg-amber-400",
    noteBg: "bg-amber-50",
    noteText: "text-amber-800",
    noteBorder: "border-amber-200",
  },
  emerald: {
    ring: "ring-emerald-400",
    bg: "bg-emerald-600",
    lightBg: "bg-emerald-50",
    border: "border-emerald-200",
    text: "text-emerald-700",
    badge: "bg-emerald-600",
    iconBg: "bg-emerald-100",
    dot: "bg-emerald-500",
    noteBg: "bg-emerald-50",
    noteText: "text-emerald-800",
    noteBorder: "border-emerald-200",
  },
};

function RoadmapPhase({
  phase, period, status, statusLabel, color, icon, title, subtitle, goals, execNote,
}: RoadmapPhaseProps) {
  const c = colorMap[color];
  const isCurrent = status === "current";
  return (
    <div className={`relative flex flex-col rounded-2xl border-2 ${isCurrent ? `${c.border} shadow-lg` : "border-slate-100"} bg-white overflow-hidden`}>
      {/* 상단 색상 헤더 */}
      <div className={`${c.bg} px-5 py-4`}>
        <div className="flex items-center justify-between mb-2">
          <span className="text-white/70 text-xs font-bold tracking-widest uppercase">{phase}</span>
          <span className={`text-xs font-black px-2.5 py-1 rounded-full ${
            isCurrent
              ? "bg-white text-blue-600 animate-pulse"
              : status === "planned"
              ? "bg-white/20 text-white"
              : "bg-white/10 text-white/60"
          }`}>
            {isCurrent ? "🟢 " : ""}{statusLabel}
          </span>
        </div>
        <div className="flex items-center gap-3">
          <div className={`w-12 h-12 ${c.iconBg} rounded-xl flex items-center justify-center text-2xl flex-shrink-0`}>
            {icon}
          </div>
          <div>
            <h3 className="text-white font-black text-lg leading-tight">{title}</h3>
            <p className="text-white/70 text-xs">{period} · {subtitle}</p>
          </div>
        </div>
      </div>

      {/* 목표 리스트 */}
      <div className="p-5 flex-1">
        <ul className="space-y-2.5">
          {goals.map((g, i) => (
            <li key={i} className="flex items-start gap-2.5">
              <span className={`w-4 h-4 rounded-full ${c.dot} flex-shrink-0 mt-0.5 flex items-center justify-center`}>
                <span className="text-white font-black" style={{ fontSize: "9px" }}>{i + 1}</span>
              </span>
              <span className="text-slate-700 text-sm leading-relaxed">{g}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* 실행력 노트 */}
      <div className={`mx-5 mb-5 ${c.noteBg} border ${c.noteBorder} rounded-xl p-3`}>
        <p className={`text-xs font-bold ${c.noteText} mb-0.5`}>⚡ 실행 노트</p>
        <p className={`text-xs ${c.noteText} opacity-80 leading-relaxed`}>{execNote}</p>
      </div>
    </div>
  );
}

export default function HomePage() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-600 via-blue-700 to-blue-800 text-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-16 sm:py-24">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur rounded-full px-4 py-2 mb-6 text-sm font-medium">
              <span>🇺🇸</span>
              <span>원어민 대학생이 직접 우리 집으로 찾아와요</span>
            </div>
            <h1 className="text-4xl sm:text-5xl font-black leading-tight mb-6">
              영어유치원 대신,
              <br />
              <span className="text-amber-300">우리 집 거실</span>에서
              <br />
              원어민 친구와 놀아요
            </h1>
            <p className="text-lg sm:text-xl text-blue-100 mb-4 leading-relaxed">
              영어유치원 월 150만원이 부담스러우셨나요?
              <br />
              와요는 <strong className="text-white">검증된 원어민 대학생</strong>이
              아이가 가장 편한 우리 집으로 찾아오는
              <br className="hidden sm:block" /> 1:1 영어 놀이/미술 파트너 서비스예요.
            </p>
            <p className="text-blue-200 text-sm mb-8">
              ✓ 간호사 출신의 3단계 안심 검증 ✓ 직거래로 중간 수수료 없음 ✓ 우리 아이 취향 맞춤 매칭
            </p>
            <div className="flex flex-col sm:flex-row gap-3">
              <Link
                to="/tutors"
                className="inline-flex items-center justify-center gap-2 bg-amber-400 hover:bg-amber-300 text-slate-900 font-black text-lg px-8 py-4 rounded-2xl shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-0.5"
              >
                튜터 찾아보기 →
              </Link>
              <a
                href="#how-it-works"
                className="inline-flex items-center justify-center gap-2 bg-white/10 hover:bg-white/20 text-white font-semibold text-base px-6 py-4 rounded-2xl border border-white/20 transition-all"
              >
                어떻게 작동하나요?
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Bar */}
      <section className="bg-white border-b border-slate-100 shadow-sm">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-5">
          <div className="flex flex-col sm:flex-row items-center justify-center gap-6 sm:gap-12">
            {stats.map((s) => (
              <div key={s.label} className="text-center">
                <div
                  className={`text-3xl font-black ${s.highlight ? "text-amber-500" : "text-blue-600"}`}
                >
                  {s.value}
                </div>
                <div className="text-sm text-slate-500 mt-0.5">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Value Cards */}
      <section className="py-16 bg-slate-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-black text-slate-800 mb-3">
              왜 와요인가요?
            </h2>
            <p className="text-slate-500 text-base">
              두 아이 엄마이자 간호사 출신 대표가 직접 설계한 서비스예요
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {valueCards.map((card) => (
              <div
                key={card.title}
                className={`${card.bg} border ${card.border} rounded-2xl p-6 hover:shadow-md transition-shadow`}
              >
                <div className="text-4xl mb-4">{card.emoji}</div>
                <h3 className="font-bold text-slate-800 text-base mb-2">
                  {card.title}
                </h3>
                <p className="text-slate-600 text-sm leading-relaxed">
                  {card.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-16 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-black text-slate-800 mb-3">
              이렇게 시작해요
            </h2>
            <p className="text-slate-500">4단계로 간단하게, 직접 연결</p>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {steps.map((step, i) => (
              <div key={step.num} className="relative text-center">
                {i < steps.length - 1 && (
                  <div className="hidden lg:block absolute top-10 left-[60%] w-[80%] h-0.5 bg-blue-100 z-0" />
                )}
                <div className="relative z-10 w-20 h-20 bg-blue-50 border-2 border-blue-200 rounded-full flex items-center justify-center text-3xl mx-auto mb-4 shadow-sm">
                  {step.icon}
                </div>
                <div className="text-xs font-bold text-blue-400 mb-1">{step.num}</div>
                <h3 className="font-bold text-slate-800 text-sm mb-1">{step.title}</h3>
                <p className="text-slate-500 text-xs leading-relaxed">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 3-Step Verification */}
      <section className="py-16 bg-gradient-to-br from-slate-800 to-slate-900 text-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 bg-white/10 rounded-full px-4 py-2 text-sm mb-4">
              <span>🏥</span>
              <span>간호사 출신 대표의 꼼꼼한 안심 시스템</span>
            </div>
            <h2 className="text-3xl font-black mb-3">3단계 안심 검증</h2>
            <p className="text-slate-300 text-base">
              우리 아이에게 낯선 사람을 보내는 거잖아요.
              <br />
              그래서 저는 제 아이에게 맡겨도 될 사람만 등록시켜요.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {verificationSteps.map((v) => (
              <div key={v.step} className="bg-white/10 backdrop-blur rounded-2xl p-6 border border-white/10">
                <div className={`w-14 h-14 ${v.bg} rounded-2xl flex items-center justify-center text-2xl mb-4`}>
                  {v.icon}
                </div>
                <div className="text-xs font-bold text-slate-400 mb-1">{v.step}</div>
                <h3 className={`text-lg font-bold ${v.color} mb-2`}>{v.title}</h3>
                <p className="text-slate-300 text-sm leading-relaxed">{v.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16 bg-amber-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-black text-slate-800 mb-3">
              학부모님들의 이야기
            </h2>
            <p className="text-slate-500">실제 와요를 이용한 가족들의 후기예요</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map((t) => (
              <div
                key={t.name}
                className="bg-white rounded-2xl p-6 shadow-sm border border-amber-100 hover:shadow-md transition-shadow"
              >
                <div className="flex mb-3">
                  {Array.from({ length: t.rating }).map((_, i) => (
                    <span key={i} className="text-amber-400 text-base">★</span>
                  ))}
                </div>
                <p className="text-slate-600 text-sm leading-relaxed mb-5">
                  "{t.content}"
                </p>
                <div className="flex items-center gap-3">
                  <img
                    src={t.avatar}
                    alt={t.name}
                    className="w-10 h-10 rounded-full object-cover"
                  />
                  <div>
                    <div className="font-semibold text-slate-800 text-sm">{t.name}</div>
                    <div className="text-slate-400 text-xs">{t.child} 학부모</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════
          6개월 안심 검증 로드맵
      ══════════════════════════════════════ */}
      <section id="roadmap" className="py-20 bg-white overflow-hidden">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          {/* 헤더 */}
          <div className="text-center mb-4">
            <div className="inline-flex items-center gap-2 bg-blue-50 border border-blue-200 text-blue-700 text-sm font-bold px-4 py-2 rounded-full mb-5">
              📋 모두의창업 서비스 고도화 계획
            </div>
            <h2 className="text-3xl sm:text-4xl font-black text-slate-800 mb-3">
              6개월 안심 성장 로드맵
            </h2>
            <p className="text-slate-500 text-base max-w-xl mx-auto">
              두 아이 엄마이자 간호사 출신 창업자의 꼼꼼함으로,<br className="hidden sm:block" />
              단계별로 검증하며 확장합니다.
            </p>
          </div>

          {/* 실행력 강조 배너 */}
          <div className="flex flex-wrap items-center justify-center gap-3 mb-12">
            <span className="flex items-center gap-2 bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-bold px-3 py-2 rounded-full">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse inline-block" />
              노코드(Cursor) 프로토타입 이미 구축 중
            </span>
            <span className="flex items-center gap-2 bg-blue-50 border border-blue-200 text-blue-700 text-xs font-bold px-3 py-2 rounded-full">
              🔬 데이터 기반 안심 검증 시스템 운영
            </span>
            <span className="flex items-center gap-2 bg-amber-50 border border-amber-200 text-amber-700 text-xs font-bold px-3 py-2 rounded-full">
              👩‍⚕️ 간호사 출신 창업자 직접 심사
            </span>
          </div>

          {/* 타임라인 */}
          <div className="relative">
            {/* 수평 연결선 (데스크톱) */}
            <div className="hidden lg:block absolute top-[52px] left-[10%] right-[10%] h-0.5 bg-gradient-to-r from-blue-200 via-amber-300 to-emerald-300 z-0" />

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
              {/* Phase 1 */}
              <RoadmapPhase
                phase="Phase 1"
                period="1 – 2개월"
                status="current"
                statusLabel="진행 중"
                color="blue"
                icon="🚀"
                title="시범 서비스 런칭"
                subtitle="서울 주요 대학 인근 집중"
                goals={[
                  "서울 연세·고려·서울대 인근 시범 운영",
                  "50가구 초기 데이터 확보",
                  "튜터 10명 온보딩 & 3단계 검증 완료",
                  "노코드 예약 시스템 실사용 검증",
                  "학부모 Net Promoter Score 측정",
                ]}
                execNote="현재 Cursor로 풀스택 프로토타입 구축 완료, 실사용자 피드백 수집 중"
              />

              {/* Phase 2 */}
              <RoadmapPhase
                phase="Phase 2"
                period="3 – 4개월"
                status="planned"
                statusLabel="준비 중"
                color="amber"
                icon="📚"
                title="콘텐츠 고도화"
                subtitle="전문가 참여 커리큘럼 완성"
                goals={[
                  "아동교육 전문가 협업 놀이 키트 개발",
                  "튜터 표준 교육 매뉴얼 정립",
                  "미술·스포츠·쿠킹·코딩 4개 트랙 완성",
                  "세션 보고서 자동화 도구 연동",
                  "누적 후기 100건 & 평점 4.8+ 달성",
                ]}
                execNote="아동교육학과 교수진 자문 계획, 놀이 키트 파일럿 15가정 테스트"
              />

              {/* Phase 3 */}
              <RoadmapPhase
                phase="Phase 3"
                period="5 – 6개월"
                status="future"
                statusLabel="예정"
                color="emerald"
                icon="🗺️"
                title="전국 확장"
                subtitle="경기·부산·대구 권역 진출"
                goals={[
                  "수도권 경기도 서비스 지역 확대",
                  "부산·대구 파트너 튜터 모집",
                  "누적 서비스 가구 300가구 달성",
                  "정기 구독 모델 전환율 60%+ 목표",
                  "모바일 앱 MVP 개발 착수",
                ]}
                execNote="초기 50가구 데이터로 검증된 모델을 전국 확장, 앱 개발 예산 확보 목표"
              />
            </div>
          </div>

          {/* 창업자 정체성 강조 카드 */}
          <div className="mt-14 bg-gradient-to-br from-slate-800 to-slate-900 rounded-3xl p-8 grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <div>
              <div className="inline-flex items-center gap-2 bg-white/10 text-white text-xs font-bold px-3 py-1.5 rounded-full mb-4">
                👩‍👧‍👦 창업자 정체성
              </div>
              <h3 className="text-white text-2xl font-black mb-3 leading-snug">
                "내 아이들에게 맡겨도 될<br />사람만 등록합니다"
              </h3>
              <p className="text-slate-300 text-sm leading-relaxed mb-5">
                7세·4세 두 아이 엄마이자 10년 경력 간호사로서,<br />
                저는 안전 검증의 허점을 누구보다 잘 알아요.<br />
                와요의 3단계 검증은 제 아이를 기준으로 설계되었어요.
              </p>
              <div className="flex flex-wrap gap-2">
                {["두 아이 엄마", "10년 경력 간호사", "직접 설계한 안전 기준", "노코드 즉각 실행"].map((t) => (
                  <span key={t} className="bg-white/10 text-white/80 text-xs font-medium px-3 py-1.5 rounded-full border border-white/10">{t}</span>
                ))}
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {[
                { label: "초기 목표 가구", value: "50", unit: "가구", color: "from-blue-500 to-blue-600" },
                { label: "6개월 목표 가구", value: "300", unit: "가구", color: "from-emerald-500 to-emerald-600" },
                { label: "서비스 비용 절감", value: "90%+", unit: "절약", color: "from-amber-500 to-amber-600" },
                { label: "검증 완료 튜터", value: "10명", unit: "목표", color: "from-purple-500 to-purple-600" },
              ].map((m) => (
                <div key={m.label} className={`bg-gradient-to-br ${m.color} rounded-2xl p-4 text-center`}>
                  <div className="text-white font-black text-2xl leading-none">{m.value}</div>
                  <div className="text-white/70 text-xs mt-1">{m.unit}</div>
                  <div className="text-white/60 text-xs mt-1 leading-tight">{m.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-blue-600">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 text-center">
          <h2 className="text-3xl sm:text-4xl font-black text-white mb-4">
            지금 바로 시작해볼까요?
          </h2>
          <p className="text-blue-100 text-lg mb-8">
            우리 아이에게 딱 맞는 원어민 친구를 찾아드릴게요.
            <br />첫 세션은 언제든지 취소 가능해요.
          </p>
          <Link
            to="/tutors"
            className="inline-flex items-center gap-2 bg-amber-400 hover:bg-amber-300 text-slate-900 font-black text-xl px-10 py-5 rounded-2xl shadow-xl hover:shadow-2xl transition-all transform hover:-translate-y-1"
          >
            튜터 찾아보기 🎉
          </Link>
          <p className="text-blue-200 text-sm mt-4">
            현재 6명의 검증된 튜터가 기다리고 있어요
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 text-slate-400 py-10">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 text-center">
          <div className="text-2xl font-black text-white mb-2">
            와요<span className="text-amber-400">Wayo</span>
          </div>
          <p className="text-sm mb-4">우리집 유학 · 집으로 찾아오는 원어민 친구</p>
          <p className="text-xs text-slate-600">
            © 2025 와요Wayo. All rights reserved. · 이 사이트는 프로토타입입니다.
          </p>
        </div>
      </footer>
    </div>
  );
}
