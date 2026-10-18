import { useState } from "react";
import { Link } from "react-router-dom";
import { premiumExamples } from "../data/premiumExamples";
import { artKit } from "../data/kits";
import PremiumFeatureModal from "../components/PremiumFeatureModal";
import Icon, { type IconName } from "../components/ui/Icon";

const parentNeeds: { icon: IconName; title: string; desc: string }[] = [
  { icon: "home", title: "우리 집에서, 편하게", desc: "이동 없이 거실에서. 아이가 가장 편한 공간에서 영어가 자연스럽게 스며들어요." },
  { icon: "shield", title: "확인 절차를 거친 영어메이트만", desc: "신분·체류자격·아동 대상 활동 적합성 서류를 제출하고, 플랫폼 검수를 마친 선생님만 매칭됩니다." },
  { icon: "bell", title: "활동 후에도 안심", desc: "구독하면 활동 사진, 일지, 위치 공유, AI 영어 리포트까지 한눈에." },
];

const basicVerify: { icon: IconName; label: string }[] = [
  { icon: "id-card", label: "신분 확인" },
  { icon: "passport", label: "체류자격 확인" },
  { icon: "building", label: "취업 가능 여부" },
  { icon: "heart-pulse", label: "아동 활동 적합성" },
];

const premiumVerify: { icon: IconName; label: string }[] = [
  { icon: "clipboard", label: "관련 서류 추가 제출" },
  { icon: "camera", label: "재확인 일정 관리" },
];

const parentVoices = [
  { quote: "긴 대기 없이 와요로 바로 시작했어요. 아이 반응이 정말 좋아요.", name: "김○○", info: "7세·5세 부모님 · 서울 마포" },
  { quote: "확인 절차 완료 배지 보고 예약했어요. 활동 사진이랑 AI 리포트 받으니 가족도 안심했어요.", name: "이○○", info: "6세 부모님 · 서울 강남" },
  { quote: "집에서 하니까 아이가 덜 긴장해요. 선생님이 미술 키트까지 챙겨 오셔서 정말 편했어요.", name: "박○○", info: "4세 부모님 · 서울 서초" },
];

export default function HomePage() {
  const [selectedPremium, setSelectedPremium] = useState<string | null>(null);
  const premiumExample = premiumExamples.find((e) => e.id === selectedPremium) ?? null;

  return (
    <div className="min-h-screen bg-background">
      {/* Hero */}
      <section className="bg-white border-b border-border">
        <div className="max-w-3xl mx-auto px-5 pt-14 pb-16 sm:pt-20 sm:pb-20">
          <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-primary bg-primary-50 px-3 py-1.5 rounded-full mb-6">
            <span className="w-1.5 h-1.5 rounded-full bg-primary" />
            확인 절차 완료 영어메이트 · 우리 집 영어 놀이
          </span>

          <h1 className="text-3xl sm:text-[2.75rem] font-bold text-foreground leading-tight tracking-tight mb-5">
            영어유치원 대신,
            <br />
            <span className="text-primary">우리 집</span>에서 영어메이트와
          </h1>

          <p className="text-base sm:text-lg text-muted max-w-lg leading-relaxed mb-3">
            확인 절차를 마친 영어메이트가 우리 집으로 찾아와 미술·놀이·스포츠로 영어를 배워요. 월 10만원대부터.
          </p>
          <p className="text-sm text-slate-500 max-w-lg leading-relaxed mb-8">
            검증이란 선생님이 신분·체류자격·취업 가능 여부·아동 대상 활동 적합성 서류를 제출하고, 관리자가 검수한 뒤 「확인 절차 완료」 상태를 부여하는 과정입니다.
          </p>

          <div className="flex flex-col sm:flex-row gap-3">
            <Link to="/signup" className="btn-accent inline-flex items-center justify-center gap-2 px-7 py-3.5 text-sm">
              우리 아이 메이트 찾기
              <Icon name="chevron-right" size={16} />
            </Link>
            <Link to="/login" className="inline-flex items-center justify-center px-6 py-3.5 text-sm font-semibold text-muted border border-border rounded-[10px] hover:bg-surface-muted transition-colors">
              로그인
            </Link>
          </div>

          <div className="flex flex-wrap gap-2 mt-8">
            {["신분·체류 확인 절차", "서류 검수 후 매칭", "수수료 0원", "월정기권"].map((t) => (
              <span key={t} className="text-xs font-medium text-muted bg-surface-muted px-3 py-1.5 rounded-md">{t}</span>
            ))}
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="border-b border-border bg-white">
        <div className="max-w-3xl mx-auto px-5 py-6 grid grid-cols-3 divide-x divide-border">
          {[
            { value: "우리 집", label: "방문 영어 놀이" },
            { value: "서류 검수", label: "확인 절차" },
            { value: "4가지", label: "프리미엄 혜택" },
          ].map((s) => (
            <div key={s.label} className="text-center px-2">
              <div className="text-xl sm:text-2xl font-bold text-foreground">{s.value}</div>
              <div className="text-xs text-muted mt-0.5">{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Why */}
      <section className="py-16 px-5">
        <div className="max-w-3xl mx-auto">
          <p className="text-xs font-semibold text-primary uppercase tracking-wider mb-2">Why Wayo</p>
          <h2 className="text-2xl font-bold text-foreground mb-3">부모님이 진짜 원하는 것</h2>
          <p className="text-muted text-sm mb-10 max-w-md">비싼 학원, 긴 대기, 누구를 집에 들일지 고민. 와요는 이 세 가지를 한 번에 해결해요.</p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {parentNeeds.map((item) => (
              <div key={item.title} className="card p-5">
                <div className="w-10 h-10 bg-primary-50 rounded-lg flex items-center justify-center mb-4">
                  <Icon name={item.icon} size={20} className="text-primary" />
                </div>
                <h3 className="font-semibold text-foreground mb-2">{item.title}</h3>
                <p className="text-muted text-sm leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Verification */}
      <section id="verification" className="py-16 px-5 bg-white border-y border-border">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-2xl font-bold text-foreground mb-3">선생님이 받는 확인 절차</h2>
          <p className="text-muted text-sm mb-2">
            와요는 범죄경력을 직접 조회하지 않습니다. 선생님이 관련 서류를 제출하고, 관리자가 검수한 뒤 「확인 절차 완료」 상태를 부여합니다.
          </p>
          <p className="text-muted text-sm mb-10">
            보호자에게는 원본 서류가 아닌 확인 완료 여부와 최근 확인일만 보여줍니다.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="card p-5 border-primary/20">
              <p className="text-sm font-semibold text-primary mb-4">필수 확인 항목</p>
              <div className="grid grid-cols-2 gap-2">
                {basicVerify.map((v) => (
                  <div key={v.label} className="flex items-center gap-2 p-3 rounded-lg bg-surface-muted">
                    <Icon name={v.icon} size={16} className="text-primary shrink-0" />
                    <span className="text-xs font-medium text-foreground">{v.label}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="card p-5 border-accent/20">
              <p className="text-sm font-semibold text-accent mb-4">추가 관리</p>
              <div className="space-y-2">
                {premiumVerify.map((v) => (
                  <div key={v.label} className="flex items-center gap-2 p-3 rounded-lg bg-accent-50">
                    <Icon name={v.icon} size={16} className="text-accent shrink-0" />
                    <span className="text-xs font-medium text-foreground">{v.label}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Kit */}
      <section className="py-16 px-5">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-2xl font-bold text-foreground mb-3">표준 미술 커리큘럼</h2>
          <p className="text-muted text-sm mb-8">미술학원 원장이 제작한 주차별 교구·재료. 키트 포함 예약 시 일관된 수업 품질을 보장합니다.</p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-6">
            {[
              { icon: "package" as IconName, title: "주차별 키트", desc: `8주 · 회당 ₩${artKit.pricePerWeek.toLocaleString()}` },
              { icon: "book" as IconName, title: "커리큘럼 가이드", desc: "선생님용 수업 플로우 포함" },
              { icon: "handshake" as IconName, title: "파트너 제작", desc: artKit.partner },
            ].map((item) => (
              <div key={item.title} className="card p-4">
                <Icon name={item.icon} size={20} className="text-primary mb-3" />
                <p className="font-semibold text-foreground text-sm mb-1">{item.title}</p>
                <p className="text-xs text-muted">{item.desc}</p>
              </div>
            ))}
          </div>
          <Link to="/signup" className="btn-primary inline-flex items-center gap-2 px-5 py-2.5 text-sm">
            우리 아이 메이트 찾기 <Icon name="chevron-right" size={16} />
          </Link>
        </div>
      </section>

      {/* Premium */}
      <section id="premium" className="py-16 px-5 bg-foreground text-white">
        <div className="max-w-3xl mx-auto">
          <p className="text-xs font-semibold text-accent uppercase tracking-wider mb-2">Premium</p>
          <h2 className="text-2xl font-bold mb-2">월정기권 구독 혜택</h2>
          <p className="text-white/60 text-sm mb-10">월 4회·8회 정기권 구독 시 프리미엄 기능을 이용하세요.</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {premiumExamples.map((f) => (
              <button
                key={f.id}
                onClick={() => setSelectedPremium(f.id)}
                className="bg-white/5 border border-white/10 rounded-xl p-5 hover:bg-white/10 transition-colors text-left"
              >
                <h3 className="font-semibold text-white mb-1">{f.title}</h3>
                <p className="text-white/50 text-sm">{f.summary}</p>
                <p className="text-accent text-xs font-medium mt-2">예시 보기</p>
              </button>
            ))}
          </div>
          <PremiumFeatureModal example={premiumExample} onClose={() => setSelectedPremium(null)} />
          <div className="mt-8 card bg-white/5 border-white/10 p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <p className="font-semibold text-white mb-1">월 4회 정기권</p>
              <p className="text-white/50 text-sm">활동 사진 + 일지 + 위치공유 + AI 리포트</p>
            </div>
            <Link to="/signup" className="btn-accent px-5 py-2.5 text-sm shrink-0">우리 아이 메이트 찾기</Link>
          </div>
        </div>
      </section>

      {/* Steps */}
      <section className="py-16 px-5 bg-white">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-2xl font-bold text-foreground mb-10 text-center">이렇게 이용해요</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {[
              { num: "01", title: "영어메이트 선택", desc: "확인 절차 배지와 후기를 보고 맞는 선생님을 골라요" },
              { num: "02", title: "날짜 예약", desc: "가능한 시간을 선택하고 정기권으로 구독해요" },
              { num: "03", title: "우리 집에서 시작", desc: "선생님이 찾아와 놀이하며 리포트를 받아요" },
            ].map((step) => (
              <div key={step.num} className="text-center">
                <div className="w-12 h-12 bg-primary text-white font-bold text-sm rounded-xl flex items-center justify-center mx-auto mb-4">{step.num}</div>
                <h3 className="font-semibold text-foreground mb-2">{step.title}</h3>
                <p className="text-muted text-sm leading-relaxed">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Reviews */}
      <section className="py-16 px-5 border-t border-border">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-2xl font-bold text-foreground mb-8">학부모 후기</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {parentVoices.map((v) => (
              <div key={v.name} className="card p-5">
                <p className="text-foreground text-sm leading-relaxed mb-4">"{v.quote}"</p>
                <p className="font-semibold text-foreground text-sm">{v.name}</p>
                <p className="text-muted text-xs">{v.info}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 px-5 bg-primary">
        <div className="max-w-xl mx-auto text-center">
          <h2 className="text-2xl font-bold text-white mb-3">지금 바로 시작해볼까요?</h2>
          <p className="text-white/70 text-sm mb-8">확인 절차를 마친 영어메이트가 우리 집으로 찾아옵니다.</p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link to="/signup" className="btn-accent px-8 py-3.5 text-sm">우리 아이 메이트 찾기</Link>
            <Link to="/login" className="text-white/90 font-semibold text-sm px-6 py-3 border border-white/30 rounded-[10px] hover:bg-white/10 transition-colors">로그인</Link>
          </div>
        </div>
      </section>

      <footer className="bg-foreground text-white/40 py-8 px-5 text-center">
        <p className="font-bold text-white text-lg mb-1">와요<span className="text-accent">Wayo</span></p>
        <p className="text-xs">우리집 유학 · 확인 절차를 거친 영어메이트와 함께</p>
      </footer>
    </div>
  );
}
