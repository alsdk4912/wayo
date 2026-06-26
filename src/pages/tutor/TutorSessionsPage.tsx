import { useAuth } from "../../context/AuthContext";
import { getTutorSessions, updateBookingStatus } from "../../data/bookings";

export default function TutorSessionsPage() {
  const { user } = useAuth();
  const sessions = getTutorSessions(user?.tutorId);

  return (
    <div className="space-y-4">
      <h1 className="text-xl font-black text-slate-900">세션 관리</h1>

      {sessions.map((s) => (
        <div key={s.id} className="bg-white rounded-2xl p-5 border border-slate-100">
          <div className="flex justify-between items-start mb-2">
            <p className="font-bold text-slate-900">{s.childName}</p>
            <span className={`text-xs font-bold px-2 py-1 rounded-full ${
              s.status === "cancelled" ? "bg-slate-100 text-slate-500" :
              s.status === "pending" ? "bg-amber-50 text-amber-600" :
              s.status === "confirmed" ? "bg-blue-50 text-blue-600" : "bg-emerald-50 text-emerald-600"
            }`}>
              {s.status === "pending" ? "요청" : s.status === "confirmed" ? "예정" : s.status === "cancelled" ? "취소됨" : "완료"}
            </span>
          </div>
          <p className="text-sm text-slate-500">{s.date} {s.time}</p>
          {s.status === "pending" && (
            <button
              onClick={() => updateBookingStatus(s.id, "confirmed")}
              className="mt-3 w-full py-2.5 bg-amber-500 text-slate-900 text-sm font-bold rounded-xl"
            >
              예약 요청 수락
            </button>
          )}
          {s.status === "confirmed" && (
            <button
              onClick={() => updateBookingStatus(s.id, "completed")}
              className="mt-3 w-full py-2.5 bg-blue-600 text-white text-sm font-bold rounded-xl"
            >
              세션 완료 처리
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
