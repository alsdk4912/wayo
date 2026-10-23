import { useState } from "react";
import { Link } from "react-router-dom";
import { cancelBookingRequest, getBookings, type Booking } from "../../data/bookings";
import { useAuth } from "../../context/AuthContext";
import { cancelMatchingRequest, getMatchingRequests } from "../../data/matching";
import { attachGroupTutor, getPlayGroup } from "../../data/playGroups";
import { listLessonRequests, respondLessonRequest } from "../../data/lessonRequests";
import { visitThreadId } from "../../data/chats";
import { addSessionReview, getTutorById, reviewForBooking } from "../../data/tutors";
import { artKit, createKitOrder, kitOrderForSession, KIT_STATUS_LABEL, listKitOrders, supportsArtKit } from "../../data/kits";
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
  const [kitWeek, setKitWeek] = useState<Record<string, number>>({});
  const [kitMessage, setKitMessage] = useState("");
  const [reviewBookingId, setReviewBookingId] = useState<string | null>(null);
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewText, setReviewText] = useState("");
  const [reviewMessage, setReviewMessage] = useState("");
  const [openFeature, setOpenFeature] = useState<{ bookingId: string; featureId: string } | null>(null);
  void tick;
  const myBookings = getBookings().filter((b) => b.parentId === user?.id);
  const myMatchingRequests = getMatchingRequests().filter((m) => m.parentId === user?.id);
  const upcoming = myBookings.filter((b) => b.status === "confirmed" || b.status === "pending").length;
  const done = myBookings.filter((b) => b.status === "completed").length;

  const refresh = () => setTick((n) => n + 1);
  const parentOrders = listKitOrders().filter((order) => tick >= 0 && order.parentId === user?.id);
  const lessonItems = listLessonRequests().filter((item) => (
    tick >= 0 && (
      item.parentId === user?.id
      || Boolean(item.groupId && getPlayGroup(item.groupId)?.memberIds.includes(user?.id ?? ""))
    )
  ));
  const answerLesson = (id: string, status: "accepted" | "declined") => {
    const item = lessonItems.find((request) => request.id === id);
    const result = respondLessonRequest(id, status);
    if (result.ok && status === "accepted" && item?.kind === "group" && item.groupId) {
      attachGroupTutor(item.groupId, item.tutorId, item.tutorName);
    }
    refresh();
  };
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
        <h2 className="text-sm font-semibold text-foreground mb-2.5 px-0.5">수업 신청</h2>
        {lessonItems.length === 0 ? (
          <p className="card px-4 py-3.5 text-sm text-muted">오고 가는 신청이 없습니다.</p>
        ) : (
          <div className="card divide-y divide-border overflow-hidden">
            {lessonItems.map((item) => {
              const incoming = item.status === "pending" && item.initiatedBy === "tutor";
              return (
                <div key={item.id} className="px-4 py-3.5">
                  <p className="text-sm font-semibold text-foreground">{item.kind === "group" ? item.groupTitle : `${item.tutorName} 방문`}</p>
                  <p className="text-xs text-muted mt-0.5">{item.placeLabel} · {item.distanceKm}km · {item.status === "accepted" ? "확정" : item.status === "declined" ? "거절" : item.initiatedBy === "parent" ? "수락 대기" : "수락 필요"}</p>
                  {incoming && (
                    <div className="flex gap-3 mt-2">
                      <button type="button" onClick={() => answerLesson(item.id, "declined")} className="text-[11px] font-semibold text-muted">거절</button>
                      <button type="button" onClick={() => answerLesson(item.id, "accepted")} className="text-[11px] font-semibold text-primary">수락</button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
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
        <h2 className="text-sm font-semibold text-foreground mb-2.5 px-0.5">키트 배송</h2>
        <p className="text-[11px] text-muted mb-2 px-0.5">강사와 정한 키트는 학부모 집으로 배송됩니다.</p>
        {parentOrders.length === 0 ? (
          <p className="card px-4 py-3.5 text-sm text-muted">주문한 키트가 없습니다.</p>
        ) : (
          <div className="space-y-2">
            {parentOrders.map((order) => {
              const week = artKit.weeks.find((item) => item.week === order.week);
              return (
                <article key={order.id} className="card p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="text-sm font-semibold text-foreground">{order.week}주차 · {week?.title ?? artKit.name}</p>
                      <p className="text-xs text-muted mt-0.5">{order.sessionDate} · {order.childName} · {order.tutorName}</p>
                    </div>
                    <span className="text-[11px] font-semibold text-primary bg-primary-50 px-2 py-0.5 rounded-full shrink-0">{KIT_STATUS_LABEL[order.status]}</span>
                  </div>
                  <p className="text-[11px] text-muted mt-2">배송지 · {order.address}</p>
                </article>
              );
            })}
          </div>
        )}
        {kitMessage && <p className="text-xs font-medium text-primary mt-2 px-0.5">{kitMessage}</p>}
      </section>

      <section>
        <h2 className="text-sm font-semibold text-foreground mb-2.5 px-0.5">세션</h2>
        {myBookings.length === 0 ? (
          <p className="card px-4 py-8 text-center text-sm text-muted">예약 내역이 없습니다.</p>
        ) : (
          <div className="space-y-2.5">
            {myBookings.map((b) => {
              const chip = dateChip(b.date);
              const artTutor = supportsArtKit(getTutorById(b.tutorId)?.specialties ?? []);
              const sessionOrder = user ? kitOrderForSession(user.id, b.tutorId, b.date) : undefined;
              const week = kitWeek[b.id] ?? b.kitWeek ?? 1;
              const sessionReview = reviewForBooking(b.tutorId, b.id);
              const canOrder = artTutor && (b.status === "pending" || b.status === "confirmed") && !sessionOrder;
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
                  {b.status === "completed" && sessionReview && (
                    <p className="mt-3 text-[11px] font-semibold text-primary">후기 {sessionReview.rating}점 · {sessionReview.highlight}</p>
                  )}
                  {b.status === "completed" && !sessionReview && reviewBookingId === b.id && user && (
                    <form
                      className="mt-3 rounded-2xl bg-surface-muted p-3 space-y-2"
                      onSubmit={(e) => {
                        e.preventDefault();
                        const result = addSessionReview({
                          tutorId: b.tutorId,
                          bookingId: b.id,
                          parentName: user.name,
                          childName: b.childName,
                          avatar: user.avatar,
                          rating: reviewRating,
                          content: reviewText,
                        });
                        setReviewMessage(result.message);
                        if (result.ok) {
                          setReviewBookingId(null);
                          setReviewText("");
                          refresh();
                        }
                      }}
                    >
                      <div className="flex gap-1">
                        {[1, 2, 3, 4, 5].map((score) => (
                          <button
                            key={score}
                            type="button"
                            onClick={() => setReviewRating(score)}
                            className={`w-8 h-8 rounded-full text-xs font-bold ${reviewRating >= score ? "bg-primary text-white" : "bg-white text-muted border border-border"}`}
                          >
                            {score}
                          </button>
                        ))}
                      </div>
                      <textarea
                        value={reviewText}
                        onChange={(e) => setReviewText(e.target.value)}
                        rows={2}
                        className="w-full border border-border rounded-xl px-3 py-2 text-sm bg-white"
                        placeholder="수업은 어땠나요?"
                      />
                      <button type="submit" className="btn-primary w-full py-2.5 text-xs">후기 등록</button>
                      {reviewMessage && <p className="text-xs font-medium text-primary">{reviewMessage}</p>}
                    </form>
                  )}
                  {b.status === "completed" && !sessionReview && reviewBookingId !== b.id && (
                    <button type="button" onClick={() => { setReviewBookingId(b.id); setReviewRating(5); setReviewMessage(""); }} className="mt-3 text-[11px] font-semibold text-primary">
                      후기 남기기
                    </button>
                  )}
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
                  {canOrder && user && (
                    <div className="mt-3 rounded-2xl bg-surface-muted p-3 space-y-2">
                      <p className="text-[11px] font-semibold text-foreground">와요 키트 · 집으로 주문</p>
                      <select
                        value={week}
                        onChange={(e) => setKitWeek((prev) => ({ ...prev, [b.id]: Number(e.target.value) }))}
                        className="w-full border border-border rounded-xl px-2 py-2 text-xs bg-white"
                      >
                        {artKit.weeks.map((item) => (
                          <option key={item.week} value={item.week}>{item.week}주차 · {item.title}</option>
                        ))}
                      </select>
                      <button
                        type="button"
                        onClick={() => {
                          const result = createKitOrder({
                            parentId: user.id,
                            tutorId: b.tutorId,
                            tutorName: b.tutorName,
                            week,
                            sessionDate: b.date,
                            childName: b.childName,
                            address: user.address ?? "",
                          });
                          setKitMessage(result.message);
                          if (result.ok) refresh();
                        }}
                        className="btn-primary w-full py-2.5 text-xs"
                      >
                        {week}주차 주문 · ₩{artKit.pricePerWeek.toLocaleString()}
                      </button>
                      <p className="text-[11px] text-muted">배송지 · {user.address || "마이페이지에 주소를 저장해 주세요."}</p>
                    </div>
                  )}
                  {(b.status === "pending" || b.status === "confirmed" || b.status === "completed") && (
                    <Link to={`/parent/chats/${visitThreadId(b.parentId, b.tutorId)}`} className="mt-3 mr-3 inline-block text-[11px] font-semibold text-primary">
                      대화하기
                    </Link>
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
