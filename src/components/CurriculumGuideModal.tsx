import type { ArtKit } from "../data/kits";

interface Props {
  kit: ArtKit;
  week: number;
  onClose: () => void;
}

export default function CurriculumGuideModal({ kit, week, onClose }: Props) {
  const w = kit.weeks.find((x) => x.week === week) ?? kit.weeks[0];

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4 bg-black/50" onClick={onClose}>
      <div
        className="bg-white rounded-2xl w-full max-w-md max-h-[85vh] overflow-y-auto shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="sticky top-0 bg-gradient-to-r from-amber-500 to-orange-500 px-5 py-4 rounded-t-2xl">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-white/80 text-xs font-medium">커리큘럼 가이드</p>
              <p className="text-white font-black text-lg">{w.week}주차 · {w.title}</p>
            </div>
            <button onClick={onClose} className="text-white/80 hover:text-white text-xl w-8 h-8">×</button>
          </div>
        </div>

        <div className="p-5 space-y-5">
          <div className="bg-amber-50 border border-amber-100 rounded-xl p-4">
            <p className="text-xs font-bold text-amber-700 mb-1">수업 테마</p>
            <p className="text-sm font-bold text-slate-800">{w.theme}</p>
          </div>

          <div>
            <p className="text-xs font-bold text-slate-500 uppercase mb-2">수업 플로우 (60분)</p>
            <ol className="space-y-2 text-sm text-slate-700">
              <li className="flex gap-2"><span className="font-bold text-blue-600">0–5분</span> Greeting & warm-up (영어 인사)</li>
              <li className="flex gap-2"><span className="font-bold text-blue-600">5–15분</span> Vocabulary intro ({w.englishFocus.slice(0, 2).join(", ")})</li>
              <li className="flex gap-2"><span className="font-bold text-blue-600">15–45분</span> Main activity — {w.theme}</li>
              <li className="flex gap-2"><span className="font-bold text-blue-600">45–55분</span> Show & tell (영어로 작품 설명)</li>
              <li className="flex gap-2"><span className="font-bold text-blue-600">55–60분</span> Wrap-up & cleanup</li>
            </ol>
          </div>

          <div>
            <p className="text-xs font-bold text-slate-500 uppercase mb-2">키트 구성품 체크리스트</p>
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
            <p className="font-bold text-slate-700 mb-1">📎 {kit.partner} 제작</p>
            본 가이드는 와요 공식 커리큘럼 파트너가 검수한 자료입니다. 수업 전 PDF를 다운로드해 오프라인에서도 확인하세요.
          </div>

          <button className="w-full py-3.5 bg-slate-900 text-white font-bold rounded-xl text-sm">
            PDF 가이드 다운로드 (데모)
          </button>
        </div>
      </div>
    </div>
  );
}
