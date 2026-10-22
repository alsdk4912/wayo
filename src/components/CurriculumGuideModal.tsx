import type { ArtKit } from "../data/kits";

interface Props {
  kit: ArtKit;
  week: number;
  lang?: "ko" | "en";
  onClose: () => void;
}

export default function CurriculumGuideModal({ kit, week, lang = "ko", onClose }: Props) {
  const en = lang === "en";
  const w = kit.weeks.find((x) => x.week === week) ?? kit.weeks[0];

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4 bg-black/50" onClick={onClose}>
      <div
        className="bg-white rounded-2xl w-full max-w-md max-h-[85vh] overflow-y-auto shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="sticky top-0 bg-gradient-to-r from-primary to-accent px-5 py-4 rounded-t-2xl">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-white/80 text-xs font-medium">{en ? "Lesson guide" : "커리큘럼 가이드"}</p>
              <p className="text-white font-black text-lg">{en ? `Week ${w.week}` : `${w.week}주차`} · {w.title}</p>
            </div>
            <button onClick={onClose} className="text-white/80 hover:text-white text-xl w-8 h-8">×</button>
          </div>
        </div>

        <div className="p-5 space-y-5">
          <div className="bg-amber-50 border border-amber-100 rounded-xl p-4">
            <p className="text-xs font-bold text-amber-700 mb-1">{en ? "Theme" : "수업 테마"}</p>
            <p className="text-sm font-bold text-slate-800">{w.theme}</p>
          </div>

          <div>
            <p className="text-xs font-bold text-slate-500 uppercase mb-2">{en ? "60-minute flow" : "수업 플로우 (60분)"}</p>
            <ol className="space-y-2 text-sm text-slate-700">
              <li className="flex gap-2"><span className="font-bold text-blue-600">{en ? "0–5 min" : "0–5분"}</span> Greeting and warm-up</li>
              <li className="flex gap-2"><span className="font-bold text-blue-600">{en ? "5–15 min" : "5–15분"}</span> Vocabulary ({w.englishFocus.slice(0, 2).join(", ")})</li>
              <li className="flex gap-2"><span className="font-bold text-blue-600">{en ? "15–45 min" : "15–45분"}</span> Main activity — {w.theme}</li>
              <li className="flex gap-2"><span className="font-bold text-blue-600">{en ? "45–55 min" : "45–55분"}</span> Show and tell</li>
              <li className="flex gap-2"><span className="font-bold text-blue-600">{en ? "55–60 min" : "55–60분"}</span> Wrap-up and cleanup</li>
            </ol>
          </div>

          <div>
            <p className="text-xs font-bold text-slate-500 uppercase mb-2">{en ? "Kit checklist" : "키트 구성품 체크리스트"}</p>
            <div className="space-y-1.5">
              {w.items.map((item) => (
                <label key={item} className="flex items-center gap-2 text-sm text-slate-700">
                  <input type="checkbox" className="rounded border-slate-300" defaultChecked />
                  {item}
                </label>
              ))}
            </div>
          </div>

          <div className="bg-slate-50 rounded-xl p-4 text-xs text-slate-500 leading-relaxed">
            <p className="font-bold text-slate-700 mb-1">{kit.partner}</p>
            {en
              ? "This guide is prepared with the Wayo curriculum partner. Download the PDF before class."
              : "본 가이드는 와요 공식 커리큘럼 파트너가 검수한 자료입니다. 수업 전 PDF를 다운로드해 오프라인에서도 확인하세요."}
          </div>

          <button className="w-full py-3.5 bg-slate-900 text-white font-bold rounded-xl text-sm">
            {en ? "Download PDF guide (demo)" : "PDF 가이드 다운로드 (데모)"}
          </button>
        </div>
      </div>
    </div>
  );
}
