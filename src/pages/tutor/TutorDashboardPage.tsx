import { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { tutors } from "../../data/tutors";
import { tutorSessions } from "../../data/bookings";
import { artKit, kitOrders } from "../../data/kits";
import { isBasicVerified, isPremiumVerified } from "../../utils/verification";
import CurriculumGuideModal from "../../components/CurriculumGuideModal";

export default function TutorDashboardPage() {
  const { user } = useAuth();
  const tutor = tutors.find((t) => t.id === user?.tutorId);
  const sessions = tutorSessions.filter((s) => s.tutorId === user?.tutorId);
  const upcoming = sessions.filter((s) => s.status === "confirmed");
  const myOrders = kitOrders.filter((o) => o.tutorId === user?.tutorId);
  const [guideWeek, setGuideWeek] = useState<number | null>(null);
  const [orderedIds, setOrderedIds] = useState<Set<string>>(new Set());

  if (!tutor) return <p className="text-slate-500">강사 정보를 찾을 수 없습니다.</p>;

  const handleOrderKit = (sessionId: string, week: number) => {
    setOrderedIds((prev) => new Set(prev).add(sessionId));
    setGuideWeek(week);
  };

  return (
    <div className="space-y-5">
      <div className="flex items-center gap-4">
        <img src={tutor.photo} alt="" className="w-16 h-16 rounded-2xl object-cover" />
        <div>
          <h1 className="font-black text-slate-900">{tutor.name}</h1>
          <p className="text-sm text-slate-500">{tutor.affiliation}</p>
          {isPremiumVerified(tutor) ? (
            <span className="text-xs font-bold text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full mt-1 inline-block">⭐ 프리미엄 인증</span>
          ) : isBasicVerified(tutor) ? (
            <span className="text-xs font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full mt-1 inline-block">✓ 기본 인증</span>
          ) : null}
        </div>
      </div>

      <div className="grid grid-cols-3 gap-3">
        <div className="bg-white rounded-2xl p-3 border border-slate-100 text-center">
          <p className="text-xl font-black text-slate-900">{upcoming.length}</p>
          <p className="text-[10px] text-slate-500">예정 세션</p>
        </div>
        <div className="bg-white rounded-2xl p-3 border border-slate-100 text-center">
          <p className="text-xl font-black text-slate-900">{tutor.rating}</p>
          <p className="text-[10px] text-slate-500">평점</p>
        </div>
        <div className="bg-white rounded-2xl p-3 border border-slate-100 text-center">
          <p className="text-xl font-black text-emerald-600">₩{(tutor.hourlyRate * 8).toLocaleString()}</p>
          <p className="text-[10px] text-slate-500">이번달 예상</p>
        </div>
      </div>

      {/* 다음 세션 키트 주문 */}
      <section className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-2xl border border-amber-100 overflow-hidden">
        <div className="px-4 py-3 border-b border-amber-100 flex items-center justify-between">
          <h2 className="font-bold text-amber-900 text-sm">🎨 다음 세션 키트 주문</h2>
          <span className="text-[10px] font-bold bg-amber-200 text-amber-800 px-2 py-0.5 rounded-full">와요 공식</span>
        </div>
        <div className="p-4 space-y-3">
          {upcoming.length === 0 ? (
            <p className="text-sm text-amber-700/70 text-center py-4">예정된 세션이 없습니다.</p>
          ) : (
            upcoming.map((s) => {
              const week = s.kitWeek ?? 1;
              const existing = myOrders.find((o) => o.sessionDate === s.date);
              const justOrdered = orderedIds.has(s.id);
              const isOrdered = !!existing || justOrdered;
              return (
                <div key={s.id} className="bg-white rounded-xl p-4 border border-amber-100">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <p className="font-bold text-slate-800 text-sm">{s.childName}</p>
                      <p className="text-xs text-slate-500">{s.date} {s.time}</p>
                    </div>
                    {s.kitIncluded && (
                      <span className="text-[10px] font-bold bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full">키트 포함 예약</span>
                    )}
                  </div>
                  <p className="text-xs text-slate-600 mb-3">
                    {week}주차 · {artKit.weeks.find((w) => w.week === week)?.title ?? artKit.name}
                  </p>
                  <div className="flex gap-2">
                    {!isOrdered ? (
                      <button
                        onClick={() => handleOrderKit(s.id, week)}
                        className="flex-1 py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-900 text-sm font-bold rounded-xl transition-colors"
                      >
                        키트 주문 · ₩{artKit.pricePerWeek.toLocaleString()}
                      </button>
                    ) : (
                      <div className="flex-1 py-2.5 bg-emerald-50 text-emerald-700 text-sm font-bold rounded-xl text-center border border-emerald-100">
                        ✓ 주문 완료
                      </div>
                    )}
                    <button
                      onClick={() => setGuideWeek(week)}
                      className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-sm font-bold rounded-xl"
                    >
                      가이드
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </section>

      {/* 키트 주문 현황 */}
      {myOrders.length > 0 && (
        <section>
          <h2 className="font-bold text-slate-900 mb-3 text-sm">키트 배송 현황</h2>
          {myOrders.map((o) => (
            <div key={o.id} className="bg-white rounded-2xl p-4 border border-slate-100 mb-2 flex justify-between items-center">
              <div>
                <p className="font-bold text-slate-800 text-sm">{o.week}주차 키트 · {o.childName}</p>
                <p className="text-xs text-slate-400">세션 {o.sessionDate}</p>
              </div>
              <span className={`text-xs font-bold px-2 py-1 rounded-full ${
                o.status === "delivered" ? "bg-emerald-50 text-emerald-600" :
                o.status === "preparing" ? "bg-blue-50 text-blue-600" :
                "bg-amber-50 text-amber-600"
              }`}>
                {o.status === "delivered" ? "배송완료" : o.status === "preparing" ? "포장중" : "접수"}
              </span>
            </div>
          ))}
        </section>
      )}

      <section>
        <h2 className="font-bold text-slate-900 mb-3">오늘의 일정</h2>
        {upcoming.slice(0, 2).map((s) => (
          <div key={s.id} className="bg-white rounded-2xl p-4 border border-slate-100 mb-2">
            <p className="font-bold text-slate-800 text-sm">{s.time} · {s.childName}</p>
            <p className="text-xs text-slate-500 mt-1">{s.date}</p>
          </div>
        ))}
      </section>

      {guideWeek !== null && (
        <CurriculumGuideModal kit={artKit} week={guideWeek} onClose={() => setGuideWeek(null)} />
      )}
    </div>
  );
}
