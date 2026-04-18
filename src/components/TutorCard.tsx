import { Link } from "react-router-dom";
import type { Tutor } from "../data/tutors";

interface Props {
  tutor: Tutor;
}

// SVG 아이콘 컴포넌트
function PassportIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="3" width="18" height="18" rx="2" />
      <circle cx="12" cy="10" r="3" />
      <path d="M7 21v-1a5 5 0 0 1 10 0v1" />
      <line x1="7" y1="6" x2="10" y2="6" />
    </svg>
  );
}

function ShieldBadgeIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
      <polyline points="9 12 11 14 15 10" />
    </svg>
  );
}

function MedicalCrossIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M11 2a2 2 0 0 0-2 2v5H4a2 2 0 0 0-2 2v2c0 1.1.9 2 2 2h5v5c0 1.1.9 2 2 2h2a2 2 0 0 0 2-2v-5h5a2 2 0 0 0 2-2v-2a2 2 0 0 0-2-2h-5V4a2 2 0 0 0-2-2h-2z" />
    </svg>
  );
}

const verifyItems = [
  {
    key: "visa" as const,
    label: "비자 검증",
    shortLabel: "비자",
    Icon: PassportIcon,
    activeColor: "text-blue-600",
    activeBg: "bg-blue-100",
    tooltip: "D-2 유학비자 확인 완료",
  },
  {
    key: "criminalCheck" as const,
    label: "범죄이력 조회",
    shortLabel: "범죄이력",
    Icon: ShieldBadgeIcon,
    activeColor: "text-emerald-600",
    activeBg: "bg-emerald-100",
    tooltip: "경찰청 범죄경력 조회 완료",
  },
  {
    key: "safetyTraining" as const,
    label: "안전교육 이수",
    shortLabel: "안전교육",
    Icon: MedicalCrossIcon,
    activeColor: "text-rose-500",
    activeBg: "bg-rose-100",
    tooltip: "유아 안전·응급처치 교육 수료",
  },
];

export default function TutorCard({ tutor }: Props) {
  const verifiedCount = [
    tutor.verified.visa,
    tutor.verified.criminalCheck,
    tutor.verified.safetyTraining,
  ].filter(Boolean).length;
  const allVerified = verifiedCount === 3;

  return (
    <Link
      to={`/tutors/${tutor.id}`}
      className="bg-white rounded-2xl shadow-sm border border-slate-100 hover:shadow-xl hover:border-blue-200 hover:-translate-y-1 transition-all duration-200 overflow-hidden group flex flex-col"
    >
      {/* Photo */}
      <div className="relative overflow-hidden">
        <img
          src={tutor.photo}
          alt={tutor.name}
          className="w-full h-52 object-cover group-hover:scale-105 transition-transform duration-300"
        />

        {/* 상단 오버레이 - 전체인증 뱃지 */}
        {allVerified && (
          <div className="absolute top-3 left-3 flex items-center gap-1.5 bg-emerald-500 text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-lg">
            <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            WAYO 안심 인증 완료
          </div>
        )}
        {!allVerified && (
          <div className="absolute top-3 left-3 flex items-center gap-1.5 bg-amber-400 text-slate-900 text-xs font-bold px-3 py-1.5 rounded-full shadow-lg">
            <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
            인증 {verifiedCount}/3 완료
          </div>
        )}

        {/* 하단 가격 오버레이 */}
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent px-4 pt-8 pb-3">
          <span className="text-white font-black text-lg">₩{tutor.hourlyRate.toLocaleString()}</span>
          <span className="text-white/80 text-sm font-medium"> / 1시간</span>
        </div>
      </div>

      {/* Info */}
      <div className="p-5 flex flex-col flex-1">
        {/* 이름 + 별점 */}
        <div className="flex items-start justify-between mb-0.5">
          <div>
            <h3 className="font-black text-slate-800 text-base leading-tight">{tutor.name}</h3>
            <p className="text-blue-600 text-xs font-semibold">{tutor.nameKo}</p>
          </div>
          <div className="flex items-center gap-0.5 text-sm font-bold text-slate-700 bg-amber-50 border border-amber-200 px-2 py-1 rounded-lg">
            <span className="text-amber-400">★</span>
            {tutor.rating}
            <span className="text-slate-400 font-normal text-xs ml-0.5">({tutor.reviewCount})</span>
          </div>
        </div>

        <p className="text-slate-400 text-xs mb-3">{tutor.university}</p>

        {/* 특기 태그 */}
        <div className="flex flex-wrap gap-1.5 mb-3">
          {tutor.specialties.map((s) => (
            <span
              key={s}
              className="bg-amber-50 text-amber-700 border border-amber-200 text-xs font-semibold px-2.5 py-1 rounded-full"
            >
              {s}
            </span>
          ))}
        </div>

        {/* 한줄 소개 */}
        <p className="text-slate-500 text-xs leading-relaxed mb-4 flex-1">{tutor.intro}</p>

        {/* ── 3단계 안심 검증 패널 ── */}
        <div className={`rounded-xl border p-3 ${allVerified ? "bg-emerald-50 border-emerald-200" : "bg-slate-50 border-slate-200"}`}>
          <div className="flex items-center justify-between mb-2">
            <span className={`text-xs font-bold uppercase tracking-wide ${allVerified ? "text-emerald-700" : "text-slate-500"}`}>
              🛡️ 3단계 안심 검증
            </span>
            <span className={`text-xs font-bold ${allVerified ? "text-emerald-600" : "text-amber-600"}`}>
              {verifiedCount}/3 완료
            </span>
          </div>
          <div className="grid grid-cols-3 gap-2">
            {verifyItems.map(({ key, shortLabel, Icon, activeColor, activeBg }) => {
              const ok = tutor.verified[key];
              return (
                <div
                  key={key}
                  className={`flex flex-col items-center gap-1.5 py-2 rounded-lg border transition-all ${
                    ok
                      ? `${activeBg} border-transparent`
                      : "bg-white border-slate-100 opacity-40"
                  }`}
                >
                  <div className={`w-7 h-7 rounded-full flex items-center justify-center ${ok ? activeBg : "bg-slate-100"}`}>
                    <Icon className={`w-4 h-4 ${ok ? activeColor : "text-slate-300"}`} />
                  </div>
                  <span className={`text-center leading-tight font-semibold ${ok ? activeColor : "text-slate-300"}`} style={{ fontSize: "10px" }}>
                    {shortLabel}
                    {ok && (
                      <span className="block text-center" style={{ fontSize: "9px" }}>✓ 완료</span>
                    )}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </Link>
  );
}
