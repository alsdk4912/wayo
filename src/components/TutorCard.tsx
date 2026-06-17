import { Link } from "react-router-dom";
import type { Tutor } from "../data/tutors";
import { isBasicVerified, isPremiumVerified, BASIC_VERIFY_ITEMS, PREMIUM_VERIFY_ITEMS } from "../utils/verification";

interface Props {
  tutor: Tutor;
}

export default function TutorCard({ tutor }: Props) {
  const basicOk = isBasicVerified(tutor);
  const premiumOk = isPremiumVerified(tutor);

  return (
    <Link
      to={`/tutors/${tutor.id}`}
      className="bg-white rounded-3xl border border-slate-100 hover:border-blue-200 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200 overflow-hidden group flex flex-col"
    >
      {/* Photo */}
      <div className="relative overflow-hidden">
        <img
          src={tutor.photo}
          alt={tutor.name}
          className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
        />
        {premiumOk ? (
          <div className="absolute top-3 left-3 flex items-center gap-1 bg-amber-500 text-white text-xs font-bold px-2.5 py-1 rounded-full shadow">
            ⭐ 프리미엄 인증
          </div>
        ) : basicOk ? (
          <div className="absolute top-3 left-3 flex items-center gap-1 bg-blue-600 text-white text-xs font-bold px-2.5 py-1 rounded-full shadow">
            ✓ 기본 인증
          </div>
        ) : null}
        <div className="absolute bottom-3 right-3 bg-white/95 backdrop-blur text-slate-900 font-black text-sm px-3 py-1 rounded-full shadow">
          ₩{tutor.hourlyRate.toLocaleString()}/h
        </div>
      </div>

      <div className="p-5 flex flex-col flex-1">
        <div className="flex items-start justify-between mb-1">
          <div>
            <h3 className="font-black text-slate-900">{tutor.name}</h3>
            <p className="text-blue-600 text-xs font-semibold">{tutor.nameKo}</p>
          </div>
          <div className="flex items-center gap-0.5 text-sm font-bold bg-amber-50 px-2 py-1 rounded-lg">
            <span className="text-amber-400">★</span>{tutor.rating}
          </div>
        </div>

        <p className="text-slate-400 text-xs mb-3">{tutor.affiliation} · {tutor.role}</p>

        <div className="flex flex-wrap gap-1.5 mb-3">
          {tutor.specialties.slice(0, 3).map((s) => (
            <span key={s} className="bg-slate-100 text-slate-600 text-xs font-medium px-2.5 py-1 rounded-full">
              {s}
            </span>
          ))}
        </div>

        <p className="text-slate-500 text-xs leading-relaxed mb-4 flex-1">{tutor.intro}</p>

        {/* 인증 배지 */}
        <div className="rounded-2xl border border-slate-100 p-3 space-y-2">
          <div>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wide mb-1.5">기본 인증</p>
            <div className="flex flex-wrap gap-1">
              {BASIC_VERIFY_ITEMS.map(({ key, short }) => {
                const ok = tutor.verified.basic[key];
                return (
                  <span
                    key={key}
                    className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                      ok ? "bg-blue-50 text-blue-700" : "bg-slate-50 text-slate-300"
                    }`}
                  >
                    {ok ? "✓" : "○"} {short}
                  </span>
                );
              })}
            </div>
          </div>
          {premiumOk && (
            <div>
              <p className="text-[10px] font-bold text-amber-600 uppercase tracking-wide mb-1.5">프리미엄 인증</p>
              <div className="flex flex-wrap gap-1">
                {PREMIUM_VERIFY_ITEMS.map(({ key, short }) => {
                  const ok = tutor.verified.premium[key];
                  return (
                    <span
                      key={key}
                      className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                        ok ? "bg-amber-50 text-amber-700" : "bg-slate-50 text-slate-300"
                      }`}
                    >
                      {ok ? "✓" : "○"} {short}
                    </span>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>
    </Link>
  );
}
