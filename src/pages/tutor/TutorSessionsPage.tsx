import { useAuth } from "../../context/AuthContext";
import { getTutorSessions, updateBookingStatus } from "../../data/bookings";
import StatusBadge from "../../components/ui/StatusBadge";

const statusMap = {
  pending: "pending",
  confirmed: "confirmed",
  completed: "completed",
  cancelled: "cancelled",
} as const;

const statusLabel = {
  pending: "요청",
  confirmed: "예정",
  completed: "완료",
  cancelled: "취소됨",
} as const;

export default function TutorSessionsPage() {
  const { user } = useAuth();
  const sessions = getTutorSessions(user?.tutorId);

  return (
    <div className="space-y-4">
      <h1 className="text-lg font-bold text-foreground">세션 관리</h1>

      {sessions.length === 0 && (
        <div className="card p-10 text-center">
          <p className="text-sm text-muted">예정된 세션이 없습니다.</p>
        </div>
      )}

      {sessions.map((s) => (
        <div key={s.id} className="card p-5">
          <div className="flex justify-between items-start mb-2">
            <p className="font-semibold text-foreground">{s.childName}</p>
            <StatusBadge variant={statusMap[s.status]} label={statusLabel[s.status]} />
          </div>
          <p className="text-sm text-muted">{s.date} {s.time}</p>
          {s.status === "pending" && (
            <button onClick={() => updateBookingStatus(s.id, "confirmed")} className="mt-3 w-full py-2.5 btn-accent text-sm">
              예약 요청 수락
            </button>
          )}
          {s.status === "confirmed" && (
            <button onClick={() => updateBookingStatus(s.id, "completed")} className="mt-3 w-full py-2.5 btn-primary text-sm">
              세션 완료 처리
            </button>
          )}
          {s.status === "completed" && (
            <p className="mt-2 text-xs text-emerald-600 font-medium">활동일지·사진 전송 완료</p>
          )}
        </div>
      ))}
    </div>
  );
}
