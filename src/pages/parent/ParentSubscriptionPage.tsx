import { useState } from "react";
import { premiumExamples } from "../../data/premiumExamples";
import PremiumFeatureModal from "../../components/PremiumFeatureModal";

export default function ParentSubscriptionPage() {
  const [selected, setSelected] = useState<string | null>(null);
  const example = premiumExamples.find((e) => e.id === selected) ?? null;

  return (
    <div className="space-y-5">
      <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-3xl p-6 text-white">
        <p className="text-amber-400 text-xs font-bold uppercase tracking-wide">Premium</p>
        <h1 className="text-xl font-black mt-1">월 4회 정기권 이용 중</h1>
        <p className="text-slate-400 text-sm mt-2">다음 결제일: 2026-07-01 · ₩95,000</p>
      </div>

      <section>
        <h2 className="font-bold text-slate-900 mb-3">프리미엄 혜택</h2>
        <p className="text-xs text-slate-400 mb-4">항목을 눌러 실제 예시를 확인하세요</p>
        <div className="space-y-3">
          {premiumExamples.map((f) => (
            <button
              key={f.id}
              onClick={() => setSelected(f.id)}
              className="w-full bg-white rounded-2xl p-4 border border-slate-100 hover:border-blue-200 hover:shadow-sm transition-all text-left flex items-center gap-4"
            >
              <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${f.color} flex items-center justify-center text-xl flex-shrink-0`}>
                {f.icon}
              </div>
              <div className="flex-1">
                <p className="font-bold text-slate-900 text-sm">{f.title}</p>
                <p className="text-xs text-slate-500 mt-0.5">{f.summary}</p>
              </div>
              <span className="text-slate-300">›</span>
            </button>
          ))}
        </div>
      </section>

      <PremiumFeatureModal example={example} onClose={() => setSelected(null)} />
    </div>
  );
}
