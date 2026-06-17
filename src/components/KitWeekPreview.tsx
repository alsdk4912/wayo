import { useState } from "react";
import type { KitWeek } from "../data/kits";

interface Props {
  weeks: KitWeek[];
  selectedWeek?: number;
  onSelectWeek?: (week: number) => void;
  compact?: boolean;
}

export default function KitWeekPreview({ weeks, selectedWeek = 1, onSelectWeek, compact }: Props) {
  const [openWeek, setOpenWeek] = useState(selectedWeek);

  return (
    <div className="space-y-2">
      {weeks.map((w) => {
        const isOpen = openWeek === w.week;
        const isSelected = selectedWeek === w.week;
        return (
          <div
            key={w.week}
            className={`rounded-xl border transition-colors ${
              isSelected ? "border-amber-300 bg-amber-50/50" : "border-slate-100 bg-white"
            }`}
          >
            <button
              type="button"
              onClick={() => {
                setOpenWeek(isOpen ? 0 : w.week);
                onSelectWeek?.(w.week);
              }}
              className="w-full flex items-center justify-between px-4 py-3 text-left"
            >
              <div className="flex items-center gap-3">
                <span className={`w-8 h-8 rounded-lg flex items-center justify-center text-xs font-black ${
                  isSelected ? "bg-amber-400 text-slate-900" : "bg-slate-100 text-slate-600"
                }`}>
                  {w.week}주
                </span>
                <div>
                  <p className="text-sm font-bold text-slate-800">{w.title}</p>
                  {!compact && <p className="text-xs text-slate-400">{w.theme}</p>}
                </div>
              </div>
              <span className="text-slate-400 text-xs">{isOpen ? "▲" : "▼"}</span>
            </button>
            {isOpen && (
              <div className="px-4 pb-4 border-t border-slate-50 pt-3">
                <p className="text-xs font-bold text-blue-600 mb-2">영어 표현</p>
                <div className="flex flex-wrap gap-1.5 mb-3">
                  {w.englishFocus.map((e) => (
                    <span key={e} className="text-xs bg-blue-50 text-blue-700 px-2 py-0.5 rounded-full border border-blue-100">
                      {e}
                    </span>
                  ))}
                </div>
                <p className="text-xs font-bold text-slate-500 mb-1.5">포함 교구</p>
                <ul className="text-xs text-slate-600 space-y-1">
                  {w.items.map((item) => (
                    <li key={item} className="flex items-center gap-1.5">
                      <span className="text-amber-500">•</span> {item}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
