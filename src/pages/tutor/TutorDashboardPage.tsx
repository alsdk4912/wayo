import { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { getTutorById } from "../../data/tutors";
import { getTutorSessions } from "../../data/bookings";
import { artKit, kitOrders } from "../../data/kits";
import { isBasicVerified, isPremiumVerified } from "../../utils/verification";
import { getTutorVerificationBadgeLabel, getVerificationByTeacherId } from "../../data/teacherVerification";
import TeacherVerificationBadge from "../../components/TeacherVerificationBadge";
import CurriculumGuideModal from "../../components/CurriculumGuideModal";
import StatusBadge from "../../components/ui/StatusBadge";

export default function TutorDashboardPage() {
  const { user } = useAuth();
  const tutor = getTutorById(user?.tutorId ?? 0);
  const sessions = getTutorSessions(user?.tutorId);
  const upcoming = sessions.filter((s) => s.status === "confirmed");
  const myOrders = kitOrders.filter((o) => o.tutorId === user?.tutorId);
  const [guideWeek, setGuideWeek] = useState<number | null>(null);
  const [orderedIds, setOrderedIds] = useState<Set<string>>(new Set());

  if (!tutor) {
    return (
      <div className="card p-5 text-center">
        <p className="font-semibold text-foreground mb-2">Add your tutor profile first.</p>
        <p className="text-sm text-muted mb-4">Parents can find you and request sessions after your profile is saved.</p>
        <Link to="/tutor/profile" className="inline-flex btn-primary text-sm px-4 py-2.5">
          Create profile
        </Link>
      </div>
    );
  }

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
            <StatusBadge variant="premium" label="Premium check" />
          ) : isBasicVerified(tutor) ? (
            <span className="mt-1 inline-block"><StatusBadge variant="basic" label="Basic check" /></span>
          ) : null}
        </div>
      </div>

      <div className="grid grid-cols-3 gap-3">
        <div className="bg-white rounded-2xl p-3 border border-slate-100 text-center">
          <p className="text-xl font-black text-slate-900">{upcoming.length}</p>
          <p className="text-[10px] text-slate-500">Upcoming</p>
        </div>
        <div className="bg-white rounded-2xl p-3 border border-slate-100 text-center">
          <p className="text-xl font-black text-slate-900">{tutor.rating}</p>
          <p className="text-[10px] text-slate-500">Rating</p>
        </div>
        <div className="bg-white rounded-2xl p-3 border border-slate-100 text-center">
          <p className="text-xl font-black text-emerald-600">₩{(tutor.hourlyRate * 8).toLocaleString()}</p>
          <p className="text-[10px] text-slate-500">Est. this month</p>
        </div>
      </div>

      {user?.tutorId && (
        <Link to="/tutor/verification" className="card p-4 flex items-center justify-between hover:border-primary/30">
          <div>
            <p className="text-sm font-semibold text-foreground">Verification documents</p>
            <p className="text-xs text-muted mt-0.5">ID, stay status, and child-activity checks</p>
          </div>
          <TeacherVerificationBadge
            status={getVerificationByTeacherId(user.tutorId)?.status ?? "NOT_SUBMITTED"}
            label={getTutorVerificationBadgeLabel(getVerificationByTeacherId(user.tutorId)?.status ?? "NOT_SUBMITTED")}
          />
        </Link>
      )}

      {/* 다음 세션 키트 주문 */}
      <section className="bg-gradient-to-br from-primary-50 to-accent-50 rounded-[20px] border border-primary/15 overflow-hidden">
        <div className="px-4 py-3 border-b border-primary/10 flex items-center justify-between">
          <h2 className="font-bold text-foreground text-sm">Order the next session kit</h2>
          <span className="text-[10px] font-bold bg-spark text-foreground px-2 py-0.5 rounded-full">Wayo kit</span>
        </div>
        <div className="p-4 space-y-3">
          {upcoming.length === 0 ? (
            <p className="text-sm text-muted text-center py-4">No upcoming sessions.</p>
          ) : (
            upcoming.map((s) => {
              const week = s.kitWeek ?? 1;
              const existing = myOrders.find((o) => o.sessionDate === s.date);
              const justOrdered = orderedIds.has(s.id);
              const isOrdered = !!existing || justOrdered;
              return (
                <div key={s.id} className="bg-white rounded-2xl p-4 border border-primary/10">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <p className="font-bold text-slate-800 text-sm">{s.childName}</p>
                      <p className="text-xs text-slate-500">{s.date} {s.time}</p>
                    </div>
                    {s.kitIncluded && (
                      <span className="text-[10px] font-bold bg-primary-50 text-primary px-2 py-0.5 rounded-full">Kit included</span>
                    )}
                  </div>
                  <p className="text-xs text-slate-600 mb-3">
                    Week {week} · {artKit.weeks.find((w) => w.week === week)?.title ?? artKit.name}
                  </p>
                  <div className="flex gap-2">
                    {!isOrdered ? (
                      <button
                        onClick={() => handleOrderKit(s.id, week)}
                        className="flex-1 py-2.5 btn-primary text-sm font-bold"
                      >
                        Order kit · ₩{artKit.pricePerWeek.toLocaleString()}
                      </button>
                    ) : (
                      <div className="flex-1 py-2.5 bg-emerald-50 text-emerald-700 text-sm font-bold rounded-xl text-center border border-emerald-100">
                        Ordered
                      </div>
                    )}
                    <button
                      onClick={() => setGuideWeek(week)}
                      className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-sm font-bold rounded-xl"
                    >
                      Guide
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
          <h2 className="font-bold text-slate-900 mb-3 text-sm">Kit delivery</h2>
          {myOrders.map((o) => (
            <div key={o.id} className="bg-white rounded-2xl p-4 border border-slate-100 mb-2 flex justify-between items-center">
              <div>
                <p className="font-bold text-slate-800 text-sm">Week {o.week} kit · {o.childName}</p>
                <p className="text-xs text-slate-400">Session {o.sessionDate}</p>
              </div>
              <span className={`text-xs font-bold px-2 py-1 rounded-full ${
                o.status === "delivered" ? "bg-emerald-50 text-emerald-600" :
                o.status === "preparing" ? "bg-blue-50 text-blue-600" :
                "bg-amber-50 text-amber-600"
              }`}>
                {o.status === "delivered" ? "Delivered" : o.status === "preparing" ? "Packing" : "Received"}
              </span>
            </div>
          ))}
        </section>
      )}

      <section>
        <h2 className="font-bold text-slate-900 mb-3">Today</h2>
        {upcoming.slice(0, 2).map((s) => (
          <div key={s.id} className="bg-white rounded-2xl p-4 border border-slate-100 mb-2">
            <p className="font-bold text-slate-800 text-sm">{s.time} · {s.childName}</p>
            <p className="text-xs text-slate-500 mt-1">{s.date}</p>
          </div>
        ))}
      </section>

      {guideWeek !== null && (
        <CurriculumGuideModal kit={artKit} week={guideWeek} lang="en" onClose={() => setGuideWeek(null)} />
      )}
    </div>
  );
}
