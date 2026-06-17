import { useAuth } from "../../context/AuthContext";
import { tutors } from "../../data/tutors";
import { tutorSessions } from "../../data/bookings";
import { isBasicVerified, isPremiumVerified } from "../../utils/verification";

export default function TutorDashboardPage() {
  const { user } = useAuth();
  const tutor = tutors.find((t) => t.id === user?.tutorId);
  const sessions = tutorSessions.filter((s) => s.tutorId === user?.tutorId);
  const upcoming = sessions.filter((s) => s.status === "confirmed");

  if (!tutor) return <p className="text-slate-500">강사 정보를 찾을 수 없습니다.</p>;

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

      <section>
        <h2 className="font-bold text-slate-900 mb-3">오늘의 일정</h2>
        {upcoming.slice(0, 2).map((s) => (
          <div key={s.id} className="bg-white rounded-2xl p-4 border border-slate-100 mb-2">
            <p className="font-bold text-slate-800 text-sm">{s.time} · {s.childName}</p>
            <p className="text-xs text-slate-500 mt-1">{s.date}</p>
          </div>
        ))}
      </section>
    </div>
  );
}
