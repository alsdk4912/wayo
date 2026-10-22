import { useState } from "react";
import { cancelBookingRequest, getBookings, type Booking } from "../../data/bookings";
import { useAuth } from "../../context/AuthContext";
import { cancelMatchingRequest, getMatchingRequests } from "../../data/matching";
import { premiumExamples, type PremiumExample } from "../../data/premiumExamples";
import PremiumFeatureModal from "../../components/PremiumFeatureModal";
import StatusBadge from "../../components/ui/StatusBadge";

const SESSION_FEATURES = [
  { id: "photos", label: "활동 사진" },
  { id: "diary", label: "활동일지" },
  { id: "ai-report", label: "리포트" },
] as const;

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

const bookingLabel: Record<Booking["status"], string> = {
  pending: "대기",
  confirmed: "예정",
  completed: "완료",
  cancelled: "취소",
};

function dateChip(iso: string) {
  const [, m, d] = iso.split("-");
  return { month: m ? `${Number(m)}월` : "", day: d ? String(Number(d)) : iso };
}

export default function ParentBookingsPage() {
  const { user } = useAuth();
  const [tick, setTick] = useState(0);
  const [openFeature, setOpenFeature] = useState<{ bookingId: string; featureId: string } | null>(null);
  void tick;
  const myBookings = getBookings().filter((b) => b.parentId === user?.id);
  const myMatchingRequests = getMatchingRequests().filter((m) => m.parentId === user?.id);
  const upcoming = myBookings.filter((b) => b.status === "confirmed" || b.status === "pending").length;
  const done = myBookings.filter((b) => b.status === "completed").length;

  const refresh = () => setTick((n) => n + 1);
  const openedBooking = myBookings.find((b) => b.id === openFeature?.bookingId);
  const openedExample: PremiumExample | null = (() => {
    if (!openedBooking || !openFeature) return null;
    const base = premiumExamples.find((item) => item.id === openFeature.featureId);
    if (!base) return null;
    return {
      ...base,
      example: {
        ...base.example,
        date: `${openedBooking.date.replace(/-/g, ".")} ${openedBooking.time}`,
        tutor: openedBooking.tutorName,
        child: openedBooking.childName,
      },
    };
  })();

  return (
    <div className="space-y-4">
      <section className="relative overflow-hidden rounded-[24px] bg-gradient-to-br from-primary to-accent text-white p-5">
        <div className="absolute -right-6 -top-8 w-28 h-28 rounded-full bg-white/10" />
        <div className="absolute right-10 bottom-[-18px] w-3 h-3 rounded-full bg-spark" />
        <div className="relative">
          <p className="text-[11px] font-semibold tracking-wide text-white/80">SESSIONS</p>
          <h1 className="text-[22px] font-bold mt-2 leading-tight">예약</h1>
          <p className="text-sm text-white/80 mt-1">예정 {upcoming}건 · 완료 {done}건</p>
        </div>
      </section>

      <section>
        <h2 className="text-sm font-semibold text-foreground mb-2.5 px-0.5">매칭</h2>
        {myMatchingRequests.length === 0 ? (
          <p className="card px-4 py-3.5 text-sm text-muted">접수된 매칭이 없습니다.</p>
        ) : (
          <div className="card divide-y divide-border overflow-hidden">
            {myMatchingRequests.map((req) => (
              <div key={req.id} className="px-4 py-3.5">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-foreground truncate">{req.tutorName}</p>
                    <p className="text-xs text-muted mt-0.5 truncate">{req.childSummary || "자녀 정보 없음"}</p>
                  </div>
                  <StatusBadge
                    variant={matchingStatusMap[req.status]}
                    label={req.status === "matched" ? "완료" : req.status === "cancelled" ? "취소" : "접수"}
                  />
                </div>
                {req.status === "pending" && (
                  <button
                    type="button"
                    onClick={() => { cancelMatchingRequest(req.id); refresh(); }}
                    className="mt-2 text-[11px] font-semibold text-muted"
                  >
                    신청 취소
                  </button>
                )}
              </div>
            ))}
          </div>
        )}
      </section>

      <section>
        <h2 className="text-sm font-semibold text-foreground mb-2.5 px-0.5">세션</h2>
        {myBookings.length === 0 ? (
          <p className="card px-4 py-8 text-center text-sm text-muted">예약 내역이 없습니다.</p>
        ) : (
          <div className="space-y-2.5">
            {myBookings.map((b) => {
              const chip = dateChip(b.date);
              return (
                <article key={b.id} className="card p-3.5">
                  <div className="flex gap-3">
                    <div className="w-14 rounded-2xl bg-primary-50 text-primary text-center py-2 shrink-0">
                      <p className="text-[10px] font-semibold">{chip.month}</p>
                      <p className="text-lg font-bold leading-none mt-0.5">{chip.day}</p>
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-start justify-between gap-2">
                        <p className="text-sm font-semibold text-foreground truncate">{b.tutorName}</p>
                        <StatusBadge variant={bookingStatusMap[b.status]} label={bookingLabel[b.status]} />
                      </div>
                      <p className="text-xs text-muted mt-1">{b.time} · {b.childName}</p>
                      <p className="text-[11px] text-muted mt-0.5 truncate">
                        {b.package}
                        {b.kitIncluded ? ` · 키트 ${b.kitWeek}주차` : ""}
                      </p>
                    </div>
                  </div>
                  {b.status === "completed" && (
                    <div className="grid grid-cols-3 gap-1.5 mt-3">
                      {SESSION_FEATURES.map((f) => (
                        <button
                          key={f.id}
                          type="button"
                          onClick={() => setOpenFeature({ bookingId: b.id, featureId: f.id })}
                          className="text-[11px] font-medium text-center text-accent bg-accent-50 rounded-xl py-1.5"
                        >
                          {f.label}
                        </button>
                      ))}
                    </div>
                  )}
                  {(b.status === "pending" || b.status === "confirmed") && (
                    <button
                      type="button"
                      onClick={() => { cancelBookingRequest(b.id); refresh(); }}
                      className="mt-3 text-[11px] font-semibold text-muted"
                    >
                      예약 취소
                    </button>
                  )}
                </article>
              );
            })}
          </div>
        )}
      </section>

      <PremiumFeatureModal example={openedExample} onClose={() => setOpenFeature(null)} />
    </div>
  );
}
