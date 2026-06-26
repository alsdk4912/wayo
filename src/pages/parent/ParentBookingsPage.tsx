import { cancelBookingRequest, getBookings } from "../../data/bookings";
import { useAuth } from "../../context/AuthContext";
import { cancelMatchingRequest, getMatchingRequests } from "../../data/matching";
import Icon from "../../components/ui/Icon";
import StatusBadge from "../../components/ui/StatusBadge";

const bookingStatusMap = {
  pending: "pending",
  confirmed: "confirmed",
  completed: "completed",
  cancelled: "cancelled",
} as const;

const matchingStatusMap = {
  pending: "pending",
  matched: "matched",
  cancelled: "cancelled",
} as const;

export default function ParentBookingsPage() {
  const { user } = useAuth();
  const myBookings = getBookings().filter((b) => b.parentId === user?.id);
  const myMatchingRequests = getMatchingRequests().filter((m) => m.parentId === user?.id);

  return (
    <div className="space-y-5">
      <h1 className="text-lg font-bold text-foreground">내 예약</h1>

      <section className="card p-5">
        <h2 className="text-sm font-semibold text-foreground mb-3">매칭 신청</h2>
        {myMatchingRequests.length === 0 ? (
          <p className="text-xs text-muted">매칭 신청 내역이 없습니다.</p>
        ) : (
          <div className="space-y-2">
            {myMatchingRequests.map((req) => (
              <div key={req.id} className="rounded-lg border border-border bg-surface-muted/50 px-3 py-3">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <p className="text-sm font-semibold text-foreground">{req.tutorName}</p>
                    <p className="text-xs text-muted mt-0.5">{req.childSummary}</p>
                    <p className="text-xs text-muted">{req.requestNote}</p>
                  </div>
                  <StatusBadge variant={matchingStatusMap[req.status]} label={
                    req.status === "matched" ? "매칭완료" : req.status === "cancelled" ? "취소됨" : "접수"
                  } />
                </div>
                {req.status === "pending" && (
                  <button type="button" onClick={() => cancelMatchingRequest(req.id)} className="mt-2 text-xs font-semibold text-red-500">
                    매칭 신청 취소
                  </button>
                )}
              </div>
            ))}
          </div>
        )}
      </section>

      {myBookings.length === 0 ? (
        <div className="card p-10 text-center">
          <Icon name="calendar" size={32} className="text-muted mx-auto mb-3 opacity-40" />
          <p className="text-sm text-muted">예약 내역이 없습니다.</p>
        </div>
      ) : (
        myBookings.map((b) => (
          <div key={b.id} className="card p-5">
            <div className="flex items-center justify-between mb-3">
              <p className="font-semibold text-foreground">{b.tutorName}</p>
              <StatusBadge variant={bookingStatusMap[b.status]} label={
                b.status === "confirmed" ? "예정" : b.status === "completed" ? "완료" : b.status === "cancelled" ? "취소됨" : "대기"
              } />
            </div>
            <div className="space-y-2 text-sm text-muted">
              <div className="flex items-center gap-2">
                <Icon name="calendar" size={15} className="shrink-0" />
                <span>{b.date} {b.time}</span>
              </div>
              <div className="flex items-center gap-2">
                <Icon name="baby" size={15} className="shrink-0" />
                <span>{b.childName}</span>
              </div>
              <div className="flex items-center gap-2">
                <Icon name="package" size={15} className="shrink-0" />
                <span>{b.package}</span>
              </div>
              {b.kitIncluded && (
                <div className="flex items-center gap-2 text-accent">
                  <Icon name="palette" size={15} className="shrink-0" />
                  <span className="font-medium">미술 키트 {b.kitWeek}주차 · ₩{b.kitPrice?.toLocaleString()}</span>
                </div>
              )}
            </div>
            {b.status === "completed" && (
              <div className="mt-3 pt-3 border-t border-border flex gap-1.5 flex-wrap">
                {["활동사진", "활동일지", "AI리포트"].map((f) => (
                  <span key={f} className="text-[11px] bg-primary-50 text-primary px-2 py-1 rounded-md font-medium">{f}</span>
                ))}
              </div>
            )}
            {(b.status === "pending" || b.status === "confirmed") && (
              <button type="button" onClick={() => cancelBookingRequest(b.id)} className="mt-3 text-xs font-semibold text-red-500">
                예약 요청 취소
              </button>
            )}
          </div>
        ))
      )}
    </div>
  );
}
