import type { PremiumExample } from "../data/premiumExamples";

interface Props {
  example: PremiumExample | null;
  onClose: () => void;
}

export default function PremiumFeatureModal({ example, onClose }: Props) {
  if (!example) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center p-4 bg-black/50 backdrop-blur-sm" onClick={onClose}>
      <div
        className="bg-white rounded-3xl w-full max-w-md max-h-[85vh] overflow-y-auto shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className={`bg-gradient-to-br ${example.color} p-6 rounded-t-3xl text-white`}>
          <div className="flex items-center justify-between">
            <span className="text-3xl">{example.icon}</span>
            <button onClick={onClose} className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center text-lg">×</button>
          </div>
          <h3 className="text-xl font-black mt-3">{example.title}</h3>
          <p className="text-white/80 text-sm mt-1">{example.summary}</p>
        </div>

        <div className="p-6 space-y-4">
          <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100">
            <p className="text-xs text-slate-400 mb-1">예시 · {example.example.date}</p>
            <p className="text-sm font-bold text-slate-800">{example.example.tutor} · {example.example.child}</p>
            <p className="text-sm text-slate-600 mt-2 leading-relaxed">{example.example.content}</p>
            {example.example.preview && (
              <div className="mt-3 bg-white rounded-xl p-3 border border-slate-200 text-sm text-slate-500 italic">
                {example.example.preview}
              </div>
            )}
          </div>

          <ul className="space-y-2">
            {example.example.details.map((d) => (
              <li key={d} className="flex items-start gap-2 text-sm text-slate-600">
                <span className="text-emerald-500 font-bold">✓</span>
                {d}
              </li>
            ))}
          </ul>

          <p className="text-xs text-center text-slate-400 pt-2">
            월정기권 구독 시 매 세션 후 자동 제공됩니다
          </p>
        </div>
      </div>
    </div>
  );
}
