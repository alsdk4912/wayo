import { useAuth } from "../../context/AuthContext";
import { tutorSessions } from "../../data/bookings";

export default function TutorSessionsPage() {
  const { user } = useAuth();
  const sessions = tutorSessions.filter((s) => s.tutorId === user?.tutorId);

  return (
    <div className="space-y-4">
      <h1 className="text-xl font-black text-slate-900">세션 관리</h1>

      {sessions.map((s) => (
        <div key={s.id} className="bg-white rounded-2xl p-5 border border-slate-100">
          <div className="flex justify-between items-start mb-2">
            <p className="font-bold text-slate-900">{s.childName}</p>
            <span className={`text-xs font-bold px-2 py-1 rounded-full ${
              s.status === "confirmed" ? "bg-blue-50 text-blue-600" : "bg-emerald-50 text-emerald-600"
            }`}>
              {s.status === "confirmed" ? "예정" : "완료"}
            </span>
          </div>
          <p className="text-sm text-slate-500">{s.date} {s.time}</p>
          {s.status === "confirmed" && (
            <button className="mt-3 w-full py-2.5 bg-blue-600 text-white text-sm font-bold rounded-xl">
              세션 시작하기
            </button>
          )}
          {s.status === "completed" && (
            <p className="mt-2 text-xs text-emerald-600 font-medium">✓ 활동일지·사진 전송 완료</p>
          )}
        </div>
      ))}
    </div>
  );
}
