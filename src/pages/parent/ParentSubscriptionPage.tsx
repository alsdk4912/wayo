import { useMemo, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { getBookings } from "../../data/bookings";
import { premiumExamples } from "../../data/premiumExamples";
import PremiumFeatureModal from "../../components/PremiumFeatureModal";
import Icon, { type IconName } from "../../components/ui/Icon";

const PLANS = [
  { id: "monthly4", name: "월 4회", sessions: 4, price: 95000, cadence: "주 1회", tag: "현재" },
  { id: "monthly8", name: "월 8회", sessions: 8, price: 171000, cadence: "주 2회", tag: "집중" },
] as const;

const BENEFIT_ICONS: Record<string, IconName> = {
  photos: "camera",
  diary: "book",
  location: "map-pin",
  "ai-report": "sparkles",
};

function won(n: number) {
  return `₩${n.toLocaleString()}`;
}

export default function ParentSubscriptionPage() {
  const { user } = useAuth();
  const [planId, setPlanId] = useState<(typeof PLANS)[number]["id"]>("monthly4");
  const [selected, setSelected] = useState<string | null>(null);
  const example = premiumExamples.find((e) => e.id === selected) ?? null;
  const plan = PLANS.find((p) => p.id === planId) ?? PLANS[0];

  const used = useMemo(() => {
    const done = getBookings().filter(
      (b) => b.parentId === user?.id && (b.status === "completed" || b.status === "confirmed")
    ).length;
    return Math.min(done || 2, plan.sessions);
  }, [user?.id, plan.sessions]);

  const remain = Math.max(plan.sessions - used, 0);
  const progress = Math.round((used / plan.sessions) * 100);

  return (
    <div className="space-y-4">
      <section className="relative overflow-hidden rounded-[24px] bg-gradient-to-br from-primary to-accent text-white p-5">
        <div className="absolute -right-6 -top-8 w-28 h-28 rounded-full bg-white/10" />
        <div className="absolute right-10 bottom-[-18px] w-3 h-3 rounded-full bg-spark" />
        <div className="relative">
          <div className="flex items-center justify-between gap-3">
            <p className="text-[11px] font-semibold tracking-wide text-white/80">WAYO PASS</p>
            <span className="text-[11px] font-semibold bg-white/15 px-2.5 py-1 rounded-full">이용 중</span>
          </div>
          <h1 className="text-[22px] font-bold mt-3 leading-tight">{plan.name} 정기권</h1>
          <p className="text-sm text-white/80 mt-1">{plan.cadence} · 다음 결제일 2026.07.01</p>
          <p className="text-3xl font-bold mt-4 tracking-tight">{won(plan.price)}<span className="text-sm font-medium text-white/70"> /월</span></p>
        </div>
      </section>

      <section className="card p-4">
        <div className="flex items-end justify-between mb-3">
          <div>
            <p className="text-xs text-muted">이번 달 이용</p>
            <p className="text-lg font-bold text-foreground mt-0.5">{used}<span className="text-sm font-medium text-muted"> / {plan.sessions}회</span></p>
          </div>
          <p className="text-sm font-semibold text-primary">잔여 {remain}회</p>
        </div>
        <div className="h-2 rounded-full bg-surface-muted overflow-hidden">
          <div className="h-full rounded-full bg-gradient-to-r from-primary to-accent" style={{ width: `${progress}%` }} />
        </div>
        <div className="grid grid-cols-3 gap-2 mt-4">
          {[
            { label: "제공", value: `${plan.sessions}회` },
            { label: "결제", value: "매월 1일" },
            { label: "혜택", value: "4종" },
          ].map((item) => (
            <div key={item.label} className="rounded-2xl bg-surface-muted px-2 py-2.5 text-center">
              <p className="text-sm font-bold text-foreground">{item.value}</p>
              <p className="text-[11px] text-muted mt-0.5">{item.label}</p>
            </div>
          ))}
        </div>
      </section>

      <section>
        <div className="flex items-baseline justify-between mb-2.5 px-0.5">
          <h2 className="text-sm font-semibold text-foreground">플랜</h2>
          <p className="text-[11px] text-muted">파일럿 · 화면에서만 전환</p>
        </div>
        <div className="grid grid-cols-2 gap-2.5">
          {PLANS.map((item) => {
            const active = item.id === planId;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => setPlanId(item.id)}
                className={`text-left rounded-[20px] p-3.5 border transition-colors ${
                  active ? "bg-white border-primary shadow-[0_8px_24px_rgba(72,128,240,0.12)]" : "bg-white/70 border-border"
                }`}
              >
                <div className="flex items-center justify-between">
                  <p className="text-sm font-bold text-foreground">{item.name}</p>
                  <span className={`text-[10px] font-semibold px-1.5 py-0.5 rounded-full ${active ? "bg-primary text-white" : "bg-surface-muted text-muted"}`}>
                    {item.tag}
                  </span>
                </div>
                <p className="text-base font-bold text-foreground mt-2">{won(item.price)}</p>
                <p className="text-[11px] text-muted mt-0.5">{item.cadence}</p>
              </button>
            );
          })}
        </div>
      </section>

      <section>
        <h2 className="text-sm font-semibold text-foreground mb-2.5 px-0.5">포함 혜택</h2>
        <div className="card divide-y divide-border overflow-hidden">
          {premiumExamples.map((f) => (
            <button
              key={f.id}
              type="button"
              onClick={() => setSelected(f.id)}
              className="w-full px-4 py-3.5 flex items-center gap-3 text-left hover:bg-primary-50/50 transition-colors"
            >
              <span className="w-10 h-10 rounded-2xl bg-primary-50 flex items-center justify-center shrink-0">
                <Icon name={BENEFIT_ICONS[f.id] ?? "sparkles"} size={18} className="text-primary" />
              </span>
              <span className="flex-1 min-w-0">
                <span className="block text-sm font-semibold text-foreground">{f.title}</span>
                <span className="block text-xs text-muted mt-0.5 truncate">{f.summary}</span>
              </span>
              <span className="text-[11px] font-semibold text-primary shrink-0">예시</span>
            </button>
          ))}
        </div>
      </section>

      <p className="text-[11px] text-muted leading-relaxed px-1">
        표시 금액과 회차는 파일럿 안내입니다. 실제 결제·해지·환불은 이 화면에서 처리되지 않습니다.
      </p>

      <PremiumFeatureModal example={example} onClose={() => setSelected(null)} />
    </div>
  );
}
