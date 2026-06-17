import { useState } from "react";
import { Link } from "react-router-dom";
import { premiumExamples } from "../data/premiumExamples";
import PremiumFeatureModal from "../components/PremiumFeatureModal";

const momNeeds = [
  {
    icon: "🏠",
    title: "우리 집에서, 편하게",
    desc: "이동 없이 거실에서. 아이가 가장 편한 공간에서 영어가 자연스럽게 스며들어요.",
  },
  {
    icon: "✅",
    title: "신원 확인된 원어민만",
    desc: "대학생 아르바이트가 아닌, 신원 검증을 통과한 합법 활동 원어민 강사진.",
  },
  {
    icon: "📱",
    title: "활동 후에도 안심",
    desc: "구독하면 활동 사진, 일지, 위치 공유, AI 영어 리포트까지 한눈에.",
  },
];

const basicVerify = [
  { icon: "🪪", label: "신분증 인증" },
  { icon: "🤳", label: "셀카 얼굴인증" },
  { icon: "🛂", label: "비자 확인" },
  { icon: "🏢", label: "소속 확인" },
];

const premiumVerify = [
  { icon: "📋", label: "본국 범죄경력증명" },
  { icon: "🩺", label: "아동안전교육 수료" },
];

const premiumFeatures = premiumExamples.map((e) => ({
  id: e.id,
  icon: e.icon,
  title: e.title,
  desc: e.summary,
  color: e.color,
}));

const momVoices = [
  {
    quote: "영어유치원 6개월 대기만 하다가 와요로 바로 시작했어요. 비용은 10분의 1인데 아이 반응은 더 좋아요.",
    name: "김○○",
    info: "7세·5세 엄마 · 서울 마포",
    rating: 5,
  },
  {
    quote: "신원 검증 배지 보고 예약했어요. 활동 사진이랑 AI 리포트 받으니 남편도 '이거 괜찮다'고 하더라고요.",
    name: "이○○",
    info: "6세 엄마 · 서울 강남",
    rating: 5,
  },
  {
    quote: "집에서 하니까 아이가 덜 긴장해요. 강사님이 미술 놀이 키트까지 챙겨 오셔서 정말 편했어요.",
    name: "박○○",
    info: "4세 엄마 · 서울 서초",
    rating: 5,
  },
];

export default function HomePage() {
  const [selectedPremium, setSelectedPremium] = useState<string | null>(null);
  const premiumExample = premiumExamples.find((e) => e.id === selectedPremium) ?? null;

  return (
    <div className="min-h-screen bg-[#fafafa]">
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-600 via-blue-600 to-sky-500" />
        <div className="absolute inset-0 opacity-30 bg-[radial-gradient(circle_at_30%_20%,white_0%,transparent_50%)]" />
        <div className="relative max-w-5xl mx-auto px-5 pt-16 pb-24 sm:pt-24 sm:pb-32">
          <div className="inline-flex items-center gap-2 bg-white/15 backdrop-blur-md text-white text-sm font-medium px-4 py-2 rounded-full mb-8 border border-white/20">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            신원 검증된 원어민 강사 · 우리 집 영어 놀이
          </div>

          <h1 className="text-4xl sm:text-6xl font-black text-white leading-[1.1] tracking-tight mb-6">
            영어유치원 대신,
            <br />
            <span className="text-amber-300">우리 집</span>에서
            <br />
            원어민과 놀아요
          </h1>

          <p className="text-lg sm:text-xl text-blue-100 max-w-xl leading-relaxed mb-10">
            합법적으로 활동하는 검증된 원어민 강사가
            우리 집으로 찾아와 미술·놀이·스포츠로 영어를 배워요.
            월 10만원대부터 시작.
          </p>

          <div className="flex flex-col sm:flex-row gap-3">
            <Link
              to="/login"
              className="inline-flex items-center justify-center gap-2 bg-white text-blue-700 font-bold text-base px-8 py-4 rounded-2xl shadow-xl hover:shadow-2xl hover:-translate-y-0.5 transition-all"
            >
              시작하기
              <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
              </svg>
            </Link>
            <a
              href="#premium"
              className="inline-flex items-center justify-center gap-2 bg-white/10 hover:bg-white/20 text-white font-semibold text-base px-6 py-4 rounded-2xl border border-white/25 transition-all"
            >
              프리미엄 구독 보기
            </a>
          </div>

          {/* Trust pills */}
          <div className="flex flex-wrap gap-2 mt-10">
            {["기본 인증 4종", "프리미엄 인증 2종", "수수료 0원 직거래", "월정기권 구독"].map((t) => (
              <span key={t} className="text-xs font-semibold text-white/90 bg-white/10 px-3 py-1.5 rounded-full border border-white/15">
                {t}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* Stats strip */}
      <section className="bg-white border-b border-slate-100">
        <div className="max-w-5xl mx-auto px-5 py-6 grid grid-cols-3 divide-x divide-slate-100">
          {[
            { value: "1/10", label: "영어유치원 대비 비용" },
            { value: "2단계", label: "안심 인증 배지" },
            { value: "4가지", label: "프리미엄 구독 혜택" },
          ].map((s) => (
            <div key={s.label} className="text-center px-2">
              <div className="text-2xl sm:text-3xl font-black text-slate-900">{s.value}</div>
              <div className="text-xs sm:text-sm text-slate-500 mt-0.5">{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* 엄마들이 원하는 것 */}
      <section className="py-20 px-5">
        <div className="max-w-5xl mx-auto">
          <p className="text-sm font-bold text-blue-600 uppercase tracking-widest mb-2">Why Wayo</p>
          <h2 className="text-3xl sm:text-4xl font-black text-slate-900 mb-3">
            엄마들이 진짜 원하는 것
          </h2>
          <p className="text-slate-500 mb-12 max-w-lg">
            비싼 학원, 긴 대기, 불안한 신원 확인. 와요는 이 세 가지를 한 번에 해결해요.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {momNeeds.map((item) => (
              <div
                key={item.title}
                className="bg-white rounded-3xl p-7 border border-slate-100 shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="text-4xl mb-4">{item.icon}</div>
                <h3 className="font-black text-slate-900 text-lg mb-2">{item.title}</h3>
                <p className="text-slate-500 text-sm leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 2단계 인증 */}
      <section id="verification" className="py-20 px-5 bg-white">
        <div className="max-w-5xl mx-auto">
          <p className="text-sm font-bold text-blue-600 uppercase tracking-widest mb-2">Safety</p>
          <h2 className="text-3xl sm:text-4xl font-black text-slate-900 mb-3">
            2단계 안심 인증 배지
          </h2>
          <p className="text-slate-500 mb-12 max-w-xl">
            모든 강사는 가입 시 기본 인증을 거치고, 프리미엄 인증을 추가하면
            더 높은 수준의 교육 서비스를 제공합니다.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* 기본 인증 */}
            <div className="rounded-3xl border-2 border-blue-100 bg-blue-50/50 p-7">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-blue-600 rounded-2xl flex items-center justify-center text-white font-black text-sm">
                  1
                </div>
                <div>
                  <p className="font-black text-slate-900 text-lg">기본 인증</p>
                  <p className="text-blue-600 text-sm font-medium">가입 시 필수 · 모든 강사</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                {basicVerify.map((v) => (
                  <div key={v.label} className="bg-white rounded-2xl p-4 flex items-center gap-3 border border-blue-100">
                    <span className="text-2xl">{v.icon}</span>
                    <span className="text-sm font-semibold text-slate-700">{v.label}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* 프리미엄 인증 */}
            <div className="rounded-3xl border-2 border-amber-200 bg-gradient-to-br from-amber-50 to-orange-50 p-7">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-amber-500 rounded-2xl flex items-center justify-center text-white font-black text-sm">
                  2
                </div>
                <div>
                  <p className="font-black text-slate-900 text-lg">프리미엄 인증</p>
                  <p className="text-amber-600 text-sm font-medium">선택 · 더 높은 신뢰 수준</p>
                </div>
              </div>
              <div className="space-y-3 mb-4">
                {premiumVerify.map((v) => (
                  <div key={v.label} className="bg-white rounded-2xl p-4 flex items-center gap-3 border border-amber-100">
                    <span className="text-2xl">{v.icon}</span>
                    <span className="text-sm font-semibold text-slate-700">{v.label}</span>
                  </div>
                ))}
              </div>
              <p className="text-xs text-amber-700 bg-amber-100 rounded-xl px-4 py-2.5 font-medium">
                ✦ 프리미엄 인증 강사는 더 꼼꼼한 안전 기준을 충족한 강사입니다
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 프리미엄 구독 */}
      <section id="premium" className="py-20 px-5 bg-slate-900">
        <div className="max-w-5xl mx-auto">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-12">
            <div>
              <p className="text-sm font-bold text-amber-400 uppercase tracking-widest mb-2">Premium</p>
              <h2 className="text-3xl sm:text-4xl font-black text-white mb-2">
                월정기권 구독 혜택
              </h2>
              <p className="text-slate-400 max-w-md">
                월 4회·8회 정기권 구독 시, 활동 후에도 안심할 수 있는 프리미엄 기능을 이용하세요.
              </p>
            </div>
            <div className="bg-amber-400 text-slate-900 font-black text-sm px-5 py-2.5 rounded-full self-start">
              월 4회부터 이용 가능
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {premiumFeatures.map((f) => (
              <button
                key={f.id}
                onClick={() => setSelectedPremium(f.id)}
                className="bg-white/5 border border-white/10 rounded-3xl p-6 hover:bg-white/10 transition-colors text-left"
              >
                <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${f.color} flex items-center justify-center text-2xl mb-4`}>
                  {f.icon}
                </div>
                <h3 className="font-black text-white text-lg mb-1">{f.title}</h3>
                <p className="text-slate-400 text-sm">{f.desc}</p>
                <p className="text-amber-400 text-xs font-semibold mt-2">예시 보기 →</p>
              </button>
            ))}
          </div>

          <PremiumFeatureModal example={premiumExample} onClose={() => setSelectedPremium(null)} />

          <div className="mt-8 bg-white/5 border border-white/10 rounded-2xl p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <p className="text-white font-bold mb-1">구독 예시: 월 4회 정기권</p>
              <p className="text-slate-400 text-sm">활동 사진 + 일지 + 위치공유 + AI 리포트 포함 · 수수료 0원</p>
            </div>
            <Link
              to="/login"
              className="flex-shrink-0 bg-amber-400 hover:bg-amber-300 text-slate-900 font-black px-6 py-3 rounded-xl transition-colors"
            >
              로그인 후 구독하기
            </Link>
          </div>
        </div>
      </section>

      {/* 이용 방법 */}
      <section className="py-20 px-5">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl font-black text-slate-900 mb-12 text-center">이렇게 이용해요</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {[
              { num: "01", title: "강사 선택", desc: "인증 배지와 후기를 보고 우리 아이에 맞는 강사를 골라요" },
              { num: "02", title: "날짜 예약", desc: "가능한 시간을 선택하고 월정기권으로 구독해요" },
              { num: "03", title: "우리 집에서 시작", desc: "강사가 찾아와 놀이하며, 활동 후 리포트를 받아요" },
            ].map((step) => (
              <div key={step.num} className="text-center">
                <div className="w-14 h-14 bg-blue-600 text-white font-black text-lg rounded-2xl flex items-center justify-center mx-auto mb-4">
                  {step.num}
                </div>
                <h3 className="font-black text-slate-900 mb-2">{step.title}</h3>
                <p className="text-slate-500 text-sm leading-relaxed">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 엄마 후기 */}
      <section className="py-20 px-5 bg-white">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl font-black text-slate-900 mb-3">실제 엄마들의 이야기</h2>
          <p className="text-slate-500 mb-10">와요를 이용 중인 학부모님들의 후기예요</p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {momVoices.map((v) => (
              <div key={v.name} className="bg-[#fafafa] rounded-3xl p-6 border border-slate-100">
                <div className="flex mb-3">
                  {Array.from({ length: v.rating }).map((_, i) => (
                    <span key={i} className="text-amber-400">★</span>
                  ))}
                </div>
                <p className="text-slate-700 text-sm leading-relaxed mb-5">"{v.quote}"</p>
                <div>
                  <p className="font-bold text-slate-900 text-sm">{v.name}</p>
                  <p className="text-slate-400 text-xs">{v.info}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-5 bg-gradient-to-br from-indigo-600 to-blue-600">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-3xl sm:text-4xl font-black text-white mb-4">
            지금 바로 시작해볼까요?
          </h2>
          <p className="text-blue-100 mb-8">
            검증된 원어민 강사가 우리 집으로 찾아옵니다.
            첫 세션은 언제든 취소 가능해요.
          </p>
          <Link
            to="/login"
            className="inline-flex items-center gap-2 bg-white text-blue-700 font-black text-lg px-10 py-5 rounded-2xl shadow-xl hover:-translate-y-1 transition-all"
          >
            로그인 / 회원가입
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 text-slate-500 py-10 px-5 text-center">
        <p className="text-2xl font-black text-white mb-1">
          와요<span className="text-amber-400">Wayo</span>
        </p>
        <p className="text-sm mb-4">우리집 유학 · 신원 검증된 원어민 영어 놀이</p>
        <p className="text-xs text-slate-600">© 2025 와요Wayo · 프로토타입</p>
      </footer>
    </div>
  );
}
