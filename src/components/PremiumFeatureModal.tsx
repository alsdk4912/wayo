import type { PremiumExample } from "../data/premiumExamples";
import Icon from "./ui/Icon";

interface Props {
  example: PremiumExample | null;
  onClose: () => void;
}

const PHOTO_TILES = [
  { label: "red", tone: "from-primary to-[#6aa0ff]" },
  { label: "blue", tone: "from-[#6a7cf0] to-accent" },
  { label: "green", tone: "from-[#5b9dff] to-[#7d8cf6]" },
  { label: "brush", tone: "from-accent to-[#9a86f6]" },
  { label: "paint", tone: "from-[#4f86f0] to-[#8a74f4]" },
  { label: "mix", tone: "from-[#7a62f0] to-[#f8c848]" },
];

export default function PremiumFeatureModal({ example, onClose }: Props) {
  if (!example) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center sm:p-4 bg-slate-900/40 backdrop-blur-[2px]" onClick={onClose}>
      <div
        className="bg-white w-full sm:max-w-md max-h-[88vh] overflow-y-auto rounded-t-[28px] sm:rounded-[28px] shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="sticky top-0 bg-white/95 backdrop-blur px-5 pt-4 pb-3 flex items-start justify-between gap-3 border-b border-border z-10">
          <div>
            <p className="text-[11px] font-semibold tracking-wide text-primary">세션 리포트</p>
            <h3 className="text-lg font-bold text-foreground mt-0.5">{example.title}</h3>
            <p className="text-xs text-muted mt-1">{example.example.date} · {example.example.child}</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-surface-muted flex items-center justify-center text-muted"
            aria-label="닫기"
          >
            <Icon name="close" size={16} />
          </button>
        </div>

        <div className="px-5 py-4 space-y-4">
          <div className="flex items-center justify-between text-xs">
            <span className="font-semibold text-foreground">{example.example.tutor}</span>
            <span className="text-muted">영어메이트</span>
          </div>

          {example.id === "photos" && <PhotoPreview />}
          {example.id === "diary" && <DiaryPreview />}
          {example.id === "location" && <LocationPreview details={example.example.details} />}
          {example.id === "ai-report" && <ReportPreview />}

          <p className="text-[11px] text-muted leading-relaxed">
            {example.summary} 월정기권 이용 중이면 세션 후 이 형태로 제공됩니다.
          </p>
        </div>
      </div>
    </div>
  );
}

function PhotoPreview() {
  return (
    <div className="space-y-3">
      <div className="grid grid-cols-3 gap-2">
        {PHOTO_TILES.map((tile) => (
          <div key={tile.label} className={`aspect-square rounded-2xl bg-gradient-to-br ${tile.tone} p-2 flex items-end`}>
            <span className="text-[10px] font-semibold text-white/90 bg-black/15 rounded-full px-2 py-0.5">{tile.label}</span>
          </div>
        ))}
      </div>
      <div className="grid grid-cols-3 gap-2">
        {[
          ["6장", "자동 업로드"],
          ["비식별", "얼굴 가림 옵션"],
          ["날짜별", "갤러리 조회"],
        ].map(([title, desc]) => (
          <div key={title} className="rounded-2xl bg-surface-muted px-2 py-2.5 text-center">
            <p className="text-xs font-bold text-foreground">{title}</p>
            <p className="text-[10px] text-muted mt-0.5">{desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

function DiaryPreview() {
  const blocks = [
    { time: "40분", title: "수채화", desc: "색깔 이름을 말하며 그리기" },
    { time: "15분", title: "단어 놀이", desc: "red, blue, brush, paint" },
    { time: "5분", title: "마무리", desc: "오늘 표현 다시 말하기" },
  ];
  const words = ["red", "blue", "brush", "paint", "beautiful"];

  return (
    <div className="space-y-3">
      <div className="rounded-[20px] border border-border overflow-hidden">
        {blocks.map((block, index) => (
          <div key={block.title} className={`flex gap-3 px-3.5 py-3 ${index > 0 ? "border-t border-border" : ""}`}>
            <span className="text-[11px] font-semibold text-primary w-10 pt-0.5">{block.time}</span>
            <span>
              <span className="block text-sm font-semibold text-foreground">{block.title}</span>
              <span className="block text-xs text-muted mt-0.5">{block.desc}</span>
            </span>
          </div>
        ))}
      </div>
      <div>
        <p className="text-[11px] font-semibold text-muted mb-2">오늘 만난 표현</p>
        <div className="flex flex-wrap gap-1.5">
          {words.map((word) => (
            <span key={word} className="text-xs font-medium text-primary bg-primary-50 px-2.5 py-1 rounded-full">{word}</span>
          ))}
        </div>
      </div>
      <div className="rounded-2xl bg-surface-muted px-3.5 py-3">
        <p className="text-[11px] text-muted">다음 세션 제안</p>
        <p className="text-sm font-semibold text-foreground mt-0.5">색깔을 섞어 새 이름 만들기</p>
      </div>
    </div>
  );
}

function LocationPreview({ details }: { details: string[] }) {
  return (
    <div className="space-y-3">
      <div className="relative h-36 rounded-[20px] overflow-hidden bg-[#eef3fb] border border-border">
        <div className="absolute inset-0 opacity-60" style={{ backgroundImage: "linear-gradient(#d7e3f5 1px, transparent 1px), linear-gradient(90deg, #d7e3f5 1px, transparent 1px)", backgroundSize: "22px 22px" }} />
        <div className="absolute left-[18%] top-1/2 w-[58%] h-1 rounded-full bg-gradient-to-r from-primary to-accent" />
        <span className="absolute left-[16%] top-[42%] w-3 h-3 rounded-full bg-white border-2 border-primary" />
        <span className="absolute left-[70%] top-[42%] w-3.5 h-3.5 rounded-full bg-spark border-2 border-white shadow" />
        <p className="absolute left-3 bottom-3 text-[11px] font-semibold text-foreground bg-white/90 rounded-full px-2.5 py-1">서울 마포구 · 방문 수업</p>
      </div>
      <ol className="space-y-2">
        {details.map((item) => (
          <li key={item} className="flex items-start gap-2.5 rounded-2xl border border-border px-3 py-2.5">
            <Icon name="map-pin" size={14} className="text-primary mt-0.5 shrink-0" />
            <span className="text-sm text-foreground">{item}</span>
          </li>
        ))}
      </ol>
    </div>
  );
}

function ReportPreview() {
  return (
    <div className="space-y-3">
      <div className="grid grid-cols-2 gap-2">
        <div className="rounded-[20px] bg-primary-50 p-3.5">
          <p className="text-2xl font-bold text-primary">12</p>
          <p className="text-[11px] text-muted mt-1">새로 들은 표현</p>
        </div>
        <div className="rounded-[20px] bg-accent-50 p-3.5">
          <p className="text-2xl font-bold text-accent">5</p>
          <p className="text-[11px] text-muted mt-1">스스로 말한 표현</p>
        </div>
      </div>
      <div className="rounded-[20px] border border-border p-3.5 space-y-2">
        <p className="text-[11px] font-semibold text-muted">아이가 한 말</p>
        {["I like blue!", "This is my painting"].map((line) => (
          <p key={line} className="text-sm font-medium text-foreground bg-surface-muted rounded-xl px-3 py-2">{line}</p>
        ))}
      </div>
      <div className="rounded-[20px] border border-border p-3.5">
        <p className="text-[11px] font-semibold text-muted">집에서 이어하기</p>
        <p className="text-sm text-foreground mt-1">색깔 카드를 보면서 영어 이름을 말해 봅니다.</p>
      </div>
    </div>
  );
}
