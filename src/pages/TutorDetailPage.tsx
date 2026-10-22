import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { getTutorById, slotsForTutorDate } from "../data/tutors";
import { artKit, supportsArtKit } from "../data/kits";
import { createMatchingRequest } from "../data/matching";
import { createBookingRequest } from "../data/bookings";
import { canTutorAcceptMatching } from "../data/teacherVerification";
import KitWeekPreview from "../components/KitWeekPreview";
import TeacherVerificationParentCard from "../components/TeacherVerificationParentCard";
import Icon from "../components/ui/Icon";

const MONTH_NAMES = ["1월", "2월", "3월", "4월", "5월", "6월", "7월", "8월", "9월", "10월", "11월", "12월"];
const DAY_NAMES = ["일", "월", "화", "수", "목", "금", "토"];

function getCalendarDays(year: number, month: number) {
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const days: (number | null)[] = Array(firstDay).fill(null);
  for (let d = 1; d <= daysInMonth; d++) days.push(d);
  return days;
}

const PACKAGES = [
  { id: "trial", label: "1회", stored: "1회 체험권", desc: "첫 만남", sessions: 1, discount: 0, badge: null },
  { id: "monthly4", label: "월 4회", stored: "월 4회 정기권", desc: "주 1회", sessions: 4, discount: 5, badge: "기본" },
  { id: "monthly8", label: "월 8회", stored: "월 8회 정기권", desc: "주 2회", sessions: 8, discount: 10, badge: "집중" },
];

const PASS_BENEFITS = ["활동 사진", "활동일지", "위치 공유", "놀이영어 리포트"];

function won(n: number) {
  return `₩${n.toLocaleString()}`;
}

export default function TutorDetailPage() {
  const { user } = useAuth();
  const { id } = useParams();
  const tutor = getTutorById(Number(id));

  const today = new Date();
  const [calYear, setCalYear] = useState(today.getFullYear());
  const [calMonth, setCalMonth] = useState(today.getMonth());
  const [selectedDay, setSelectedDay] = useState<number | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [selectedPackage, setSelectedPackage] = useState("monthly4");
  const [includeKit, setIncludeKit] = useState(false);
  const [selectedKitWeek, setSelectedKitWeek] = useState(1);
  const [showKitPreview, setShowKitPreview] = useState(false);
  const [bookingStep, setBookingStep] = useState<"select" | "confirm" | "done">("select");
  const [childName, setChildName] = useState("");
  const [matchingChildSummary, setMatchingChildSummary] = useState("");
  const [matchingNote, setMatchingNote] = useState("");
  const [matchingMessage, setMatchingMessage] = useState("");
  const [bookingError, setBookingError] = useState("");

  const matchingAllowed = tutor ? canTutorAcceptMatching(tutor.id).ok : false;

  if (!tutor) {
    return (
      <div className="card p-8 text-center">
        <p className="text-sm font-semibold text-foreground mb-3">선생님을 찾을 수 없습니다</p>
        <Link to="/parent/tutors" className="text-sm font-semibold text-primary">
          강사 목록
        </Link>
      </div>
    );
  }

  const calDays = getCalendarDays(calYear, calMonth);
  const isoForDay = (day: number) => `${calYear}-${String(calMonth + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
  const availableTimesForDay = selectedDay ? slotsForTutorDate(tutor, isoForDay(selectedDay)) : [];
  const isPastDay = (d: number) => {
    const date = new Date(calYear, calMonth, d);
    return date < new Date(today.getFullYear(), today.getMonth(), today.getDate());
  };

  const pkg = PACKAGES.find((p) => p.id === selectedPackage)!;
  const basePrice = tutor.hourlyRate * pkg.sessions;
  const discountAmt = Math.round(basePrice * pkg.discount / 100);
  const sessionPrice = basePrice - discountAmt;
  const kitTotal = includeKit ? artKit.pricePerWeek * pkg.sessions : 0;
  const finalPrice = sessionPrice + kitTotal;
  const hasArtKit = supportsArtKit(tutor.specialties);
  const canBook = Boolean(selectedDay && selectedTime && childName.trim());

  const ratingDist = [5, 4, 3, 2, 1].map((star) => ({
    star,
    count: tutor.reviews.filter((r) => r.rating === star).length,
  }));
  const maxCount = Math.max(...ratingDist.map((r) => r.count), 1);
  const bookingDate = selectedDay ? isoForDay(selectedDay) : "";

  const shiftMonth = (dir: -1 | 1) => {
    const next = new Date(calYear, calMonth + dir, 1);
    setCalYear(next.getFullYear());
    setCalMonth(next.getMonth());
    setSelectedDay(null);
    setSelectedTime(null);
  };

  return (
    <div className="space-y-4">
      <Link to="/parent/tutors" className="inline-flex items-center gap-1 text-xs font-semibold text-muted">
        <Icon name="chevron-left" size={14} />
        강사
      </Link>

      <section className="relative overflow-hidden rounded-[24px] bg-gradient-to-br from-primary to-accent text-white p-5">
        <div className="absolute -right-8 -top-10 w-32 h-32 rounded-full bg-white/10" />
        <div className="absolute right-6 bottom-5 w-2.5 h-2.5 rounded-full bg-spark" />
        <div className="relative flex gap-4">
          <img
            src={tutor.photo}
            alt={tutor.name}
            className="w-[72px] h-[72px] rounded-2xl object-cover ring-2 ring-white/30 shrink-0"
          />
          <div className="min-w-0">
            <p className="text-[11px] font-semibold tracking-wide text-white/75">ENGLISH MATE</p>
            <h1 className="text-[22px] font-bold leading-tight mt-0.5 truncate">{tutor.name}</h1>
            <p className="text-sm text-white/85">{tutor.nameKo}</p>
            <p className="text-xs text-white/70 mt-1 line-clamp-2">{tutor.role}</p>
          </div>
        </div>
        <div className="relative mt-4 flex items-center justify-between gap-3 text-sm">
          <span className="inline-flex items-center gap-1 text-white/90 min-w-0">
            <Icon name="map-pin" size={14} />
            <span className="truncate">{tutor.location}</span>
          </span>
          <span className="inline-flex items-center gap-1 bg-white/15 px-2.5 py-1 rounded-full text-xs font-semibold shrink-0">
            <Icon name="star" size={12} className="text-spark" />
            {tutor.rating}
            <span className="text-white/70 font-medium">· {tutor.reviewCount}</span>
          </span>
        </div>
      </section>

      <section className="card p-4">
        <div className="flex items-end justify-between gap-3">
          <div>
            <p className="text-[11px] text-muted">1회 수업</p>
            <p className="text-2xl font-bold tracking-tight text-foreground">
              {won(tutor.hourlyRate)}
              <span className="text-xs font-medium text-muted"> /시간</span>
            </p>
          </div>
          <p className="text-[11px] text-muted text-right">{tutor.affiliation}</p>
        </div>
        <div className="flex flex-wrap gap-1.5 mt-3">
          {tutor.specialties.map((s) => (
            <span key={s} className="text-xs font-semibold text-primary bg-primary-50 px-2.5 py-1 rounded-full">{s}</span>
          ))}
          {tutor.languages.map((l) => (
            <span key={l} className="text-xs font-medium text-muted bg-surface-muted px-2.5 py-1 rounded-full">{l}</span>
          ))}
        </div>
      </section>

      <TeacherVerificationParentCard teacherId={tutor.id} />

      <section className="card p-4">
        <h2 className="text-sm font-semibold text-foreground">소개</h2>
        <p className="text-sm text-muted leading-relaxed mt-2">{tutor.longIntro}</p>
        <div className="mt-4 pt-4 border-t border-border">
          <p className="text-[11px] text-muted">경력</p>
          <p className="text-sm text-foreground mt-1">{tutor.experience}</p>
        </div>
      </section>

      <section>
        <div className="flex items-baseline justify-between mb-2.5 px-0.5">
          <h2 className="text-sm font-semibold text-foreground">후기</h2>
          <p className="text-[11px] text-muted">{tutor.reviewCount}개</p>
        </div>
        <div className="card p-4 mb-2.5">
          <div className="flex items-center gap-4">
            <div>
              <p className="text-3xl font-bold text-foreground leading-none">{tutor.rating}</p>
              <p className="text-[11px] text-muted mt-1">평균</p>
            </div>
            <div className="flex-1 space-y-1">
              {ratingDist.map(({ star, count }) => (
                <div key={star} className="flex items-center gap-2">
                  <span className="text-[10px] text-muted w-3 text-right">{star}</span>
                  <div className="flex-1 h-1.5 rounded-full bg-surface-muted overflow-hidden">
                    <div className="h-full rounded-full bg-gradient-to-r from-primary to-accent" style={{ width: `${(count / maxCount) * 100}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
        {tutor.reviews.length === 0 ? (
          <p className="card p-4 text-sm text-muted">아직 후기가 없습니다.</p>
        ) : (
          <div className="space-y-2.5">
            {tutor.reviews.map((review) => (
              <article key={review.id} className="card p-4">
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2 min-w-0">
                    <img src={review.avatar} alt="" className="w-8 h-8 rounded-full object-cover" />
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-foreground truncate">{review.parentName}</p>
                      <p className="text-[11px] text-muted">{review.childrenDesc}</p>
                    </div>
                  </div>
                  <p className="text-[11px] text-muted shrink-0">{review.date}</p>
                </div>
                <p className="text-sm font-semibold text-foreground mt-3 leading-snug">“{review.highlight}”</p>
                <p className="text-sm text-muted leading-relaxed mt-1.5">{review.content}</p>
                <div className="flex flex-wrap gap-1.5 mt-3">
                  {review.keywords.map((kw) => (
                    <span key={kw} className="text-[11px] text-muted bg-surface-muted px-2 py-0.5 rounded-full">{kw}</span>
                  ))}
                </div>
              </article>
            ))}
          </div>
        )}
      </section>

      <section className="card overflow-hidden">
        {bookingStep === "done" ? (
          <div className="p-5 text-center">
            <div className="w-12 h-12 rounded-full bg-primary-50 text-primary flex items-center justify-center mx-auto">
              <Icon name="check-circle" size={22} />
            </div>
            <h3 className="text-lg font-bold text-foreground mt-3">예약 요청을 보냈습니다</h3>
            <p className="text-sm text-muted mt-1">
              {calYear}년 {MONTH_NAMES[calMonth]} {selectedDay}일 · {selectedTime}
              <br />
              {pkg.label}
              {includeKit && <> · 미술 키트 {selectedKitWeek}주차</>}
            </p>
            <p className="text-xs text-muted leading-relaxed mt-4 bg-surface-muted rounded-2xl px-4 py-3">
              선생님에게 요청이 전달됩니다. 첫 수업 전날까지 직접 정산하며, 24시간 전까지 취소할 수 있습니다.
            </p>
            <button
              type="button"
              onClick={() => { setBookingStep("select"); setSelectedDay(null); setSelectedTime(null); }}
              className="text-sm font-semibold text-primary mt-4"
            >
              다른 날 예약
            </button>
          </div>
        ) : bookingStep === "confirm" ? (
          <div className="p-4">
            <button type="button" onClick={() => setBookingStep("select")} className="text-xs font-semibold text-muted mb-3">
              뒤로
            </button>
            <h3 className="text-sm font-semibold text-foreground mb-3">예약 확인</h3>
            <dl className="space-y-2 text-sm">
              {[
                ["선생님", `${tutor.name} · ${tutor.nameKo}`],
                ["일정", `${calMonth + 1}월 ${selectedDay}일 ${selectedTime}`],
                ["패키지", `${pkg.label} · ${pkg.sessions}회`],
              ].map(([label, value]) => (
                <div key={label} className="flex justify-between gap-3">
                  <dt className="text-muted">{label}</dt>
                  <dd className="font-semibold text-foreground text-right">{value}</dd>
                </div>
              ))}
              {pkg.discount > 0 && (
                <div className="flex justify-between text-primary">
                  <dt>할인 {pkg.discount}%</dt>
                  <dd className="font-semibold">-{won(discountAmt)}</dd>
                </div>
              )}
              {includeKit && (
                <div className="flex justify-between">
                  <dt className="text-muted">미술 키트 × {pkg.sessions}</dt>
                  <dd className="font-semibold">{won(kitTotal)}</dd>
                </div>
              )}
            </dl>
            <div className="flex items-end justify-between mt-4 pt-4 border-t border-border">
              <p className="text-xs text-muted">결제 예정</p>
              <p className="text-2xl font-bold text-foreground">{won(finalPrice)}</p>
            </div>
            <p className="text-[11px] text-muted leading-relaxed mt-3">
              파일럿 기간에는 첫 수업 전날까지 선생님과 직접 정산합니다.
            </p>
            <button
              type="button"
              disabled={!matchingAllowed}
              onClick={() => {
                if (!user || !selectedTime || !bookingDate) return;
                setBookingError("");
                const result = createBookingRequest({
                  parentId: user.id,
                  tutorId: tutor.id,
                  tutorName: tutor.name,
                  date: bookingDate,
                  time: selectedTime,
                  packageName: pkg.stored,
                  childName,
                  kitIncluded: includeKit,
                  kitWeek: includeKit ? selectedKitWeek : undefined,
                  kitPrice: includeKit ? artKit.pricePerWeek : undefined,
                });
                if (!result.ok) {
                  setBookingError(result.message);
                  return;
                }
                setBookingStep("done");
              }}
              className="w-full btn-primary py-3.5 text-sm mt-4 disabled:opacity-40 disabled:cursor-not-allowed"
            >
              예약 요청 보내기
            </button>
            {bookingError && <p className="text-xs text-red-600 text-center mt-2">{bookingError}</p>}
          </div>
        ) : (
          <>
            <div className="p-4 border-b border-border">
              <h2 className="text-sm font-semibold text-foreground mb-3">매칭 신청</h2>
              <div className="space-y-2">
                <input
                  value={matchingChildSummary}
                  onChange={(e) => setMatchingChildSummary(e.target.value)}
                  className="w-full border border-border rounded-2xl px-3 py-2.5 text-sm bg-white focus:outline-none focus:border-primary"
                  placeholder="자녀 정보 · 6세, 영어 노출 초급"
                />
                <textarea
                  value={matchingNote}
                  onChange={(e) => setMatchingNote(e.target.value)}
                  rows={2}
                  className="w-full border border-border rounded-2xl px-3 py-2.5 text-sm bg-white focus:outline-none focus:border-primary"
                  placeholder="요청 메모"
                />
                <button
                  type="button"
                  disabled={!matchingAllowed}
                  onClick={() => {
                    if (!user) return;
                    const result = createMatchingRequest({
                      parentId: user.id,
                      tutorId: tutor.id,
                      tutorName: tutor.name,
                      childSummary: matchingChildSummary,
                      requestNote: matchingNote,
                    });
                    if (!result.ok) {
                      setMatchingMessage(result.message);
                      return;
                    }
                    setMatchingMessage("매칭 신청이 접수되었습니다.");
                    setMatchingChildSummary("");
                    setMatchingNote("");
                  }}
                  className="w-full py-2.5 rounded-full border border-primary/30 text-primary bg-primary-50 text-sm font-semibold disabled:opacity-40"
                >
                  매칭 신청
                </button>
                {matchingMessage && (
                  <p className={`text-xs font-medium ${matchingMessage.includes("접수") ? "text-primary" : "text-red-600"}`}>
                    {matchingMessage}
                  </p>
                )}
                {!matchingAllowed && (
                  <p className="text-xs text-foreground bg-surface-muted rounded-2xl px-3 py-2">
                    {canTutorAcceptMatching(tutor.id).message}
                  </p>
                )}
              </div>
            </div>

            <div className="p-4 border-b border-border">
              <h2 className="text-sm font-semibold text-foreground mb-2">수업 패키지</h2>
              <input
                value={childName}
                onChange={(e) => setChildName(e.target.value)}
                className="w-full border border-border rounded-2xl px-3 py-2.5 text-sm bg-white mb-3 focus:outline-none focus:border-primary"
                placeholder="아이 이름 · 지우, 7세"
              />
              <div className="space-y-2">
                {PACKAGES.map((p) => {
                  const pBase = tutor.hourlyRate * p.sessions;
                  const pFinal = pBase - Math.round(pBase * p.discount / 100);
                  const active = selectedPackage === p.id;
                  return (
                    <button
                      key={p.id}
                      type="button"
                      onClick={() => setSelectedPackage(p.id)}
                      className={`w-full flex items-center justify-between rounded-[18px] border px-3.5 py-3 text-left ${
                        active ? "border-primary bg-white shadow-[0_8px_24px_rgba(72,128,240,0.12)]" : "border-border bg-white"
                      }`}
                    >
                      <div>
                        <div className="flex items-center gap-1.5">
                          <span className="text-sm font-bold text-foreground">{p.label}</span>
                          {p.badge && (
                            <span className={`text-[10px] font-semibold px-1.5 py-0.5 rounded-full ${active ? "bg-primary text-white" : "bg-surface-muted text-muted"}`}>
                              {p.badge}
                            </span>
                          )}
                        </div>
                        <p className="text-[11px] text-muted mt-0.5">{p.desc}{p.discount > 0 ? ` · ${p.discount}%` : ""}</p>
                      </div>
                      <div className="text-right">
                        {p.discount > 0 && <p className="text-[11px] text-muted line-through">{won(pBase)}</p>}
                        <p className="text-sm font-bold text-foreground">{won(pFinal)}</p>
                      </div>
                    </button>
                  );
                })}
              </div>
              {(selectedPackage === "monthly4" || selectedPackage === "monthly8") && (
                <div className="mt-3 grid grid-cols-2 gap-1.5">
                  {PASS_BENEFITS.map((f) => (
                    <span key={f} className="text-[11px] font-medium text-accent bg-accent-50 rounded-xl px-2.5 py-2">{f}</span>
                  ))}
                </div>
              )}
            </div>

            {hasArtKit && (
              <div className="p-4 border-b border-border">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <h2 className="text-sm font-semibold text-foreground">미술 키트</h2>
                    <p className="text-[11px] text-muted mt-0.5">{artKit.partner} · {won(artKit.pricePerWeek)}/회</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setIncludeKit(!includeKit)}
                    className={`relative w-11 h-6 rounded-full transition-colors ${includeKit ? "bg-primary" : "bg-border"}`}
                    aria-pressed={includeKit}
                  >
                    <span className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${includeKit ? "left-5" : "left-0.5"}`} />
                  </button>
                </div>
                {includeKit ? (
                  <div className="mt-3 space-y-2">
                    <p className="text-xs text-muted">{artKit.name} · {selectedKitWeek}주차 · {pkg.sessions}회 {won(kitTotal)}</p>
                    <button type="button" onClick={() => setShowKitPreview(!showKitPreview)} className="text-xs font-semibold text-primary">
                      {showKitPreview ? "커리큘럼 닫기" : "주차별 커리큘럼"}
                    </button>
                    {showKitPreview && (
                      <KitWeekPreview weeks={artKit.weeks} selectedWeek={selectedKitWeek} onSelectWeek={setSelectedKitWeek} compact />
                    )}
                  </div>
                ) : (
                  <p className="text-[11px] text-muted mt-2">키트 없이 진행하면 선생님이 준비물로 수업합니다.</p>
                )}
              </div>
            )}

            <div className="p-4 border-b border-border">
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-sm font-semibold text-foreground">날짜</h2>
                <div className="flex items-center gap-1">
                  <button type="button" onClick={() => shiftMonth(-1)} className="w-7 h-7 rounded-full text-muted hover:bg-surface-muted" aria-label="이전 달">‹</button>
                  <span className="text-xs font-semibold text-foreground w-16 text-center">{calYear}.{String(calMonth + 1).padStart(2, "0")}</span>
                  <button type="button" onClick={() => shiftMonth(1)} className="w-7 h-7 rounded-full text-muted hover:bg-surface-muted" aria-label="다음 달">›</button>
                </div>
              </div>
              <div className="grid grid-cols-7 mb-1">
                {DAY_NAMES.map((d) => (
                  <div key={d} className="text-center text-[10px] font-semibold text-muted py-1">{d}</div>
                ))}
              </div>
              <div className="grid grid-cols-7 gap-1">
                {calDays.map((day, i) => {
                  if (!day) return <div key={`e-${i}`} />;
                  const isAvail = slotsForTutorDate(tutor, isoForDay(day)).length > 0 && !isPastDay(day);
                  const isSel = selectedDay === day;
                  return (
                    <button
                      key={day}
                      type="button"
                      disabled={!isAvail}
                      onClick={() => { setSelectedDay(day); setSelectedTime(null); }}
                      className={`h-8 rounded-full text-xs font-semibold ${
                        isSel ? "bg-primary text-white" :
                        isAvail ? "bg-primary-50 text-primary" :
                        "text-muted/40"
                      }`}
                    >
                      {day}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="p-4">
              <h2 className="text-sm font-semibold text-foreground mb-2">
                시간
                {selectedDay && <span className="text-muted font-medium"> · {calMonth + 1}/{selectedDay}</span>}
              </h2>
              {!selectedDay ? (
                <p className="text-xs text-muted">날짜를 선택하면 시간이 열립니다.</p>
              ) : availableTimesForDay.length === 0 ? (
                <p className="text-xs text-muted">이 날은 가능한 시간이 없습니다.</p>
              ) : (
                <div className="grid grid-cols-3 gap-2">
                  {availableTimesForDay.map((time) => (
                    <button
                      key={time}
                      type="button"
                      onClick={() => setSelectedTime(time)}
                      className={`py-2 rounded-full text-sm font-semibold border ${
                        selectedTime === time ? "bg-primary text-white border-primary" : "bg-white text-foreground border-border"
                      }`}
                    >
                      {time}
                    </button>
                  ))}
                </div>
              )}

              {canBook && (
                <div className="mt-4 rounded-2xl bg-surface-muted px-3 py-2.5 text-xs space-y-1">
                  <div className="flex justify-between text-muted">
                    <span>{pkg.label} · {pkg.sessions}회</span>
                    <span>{won(sessionPrice)}</span>
                  </div>
                  {includeKit && (
                    <div className="flex justify-between text-muted">
                      <span>미술 키트</span>
                      <span>{won(kitTotal)}</span>
                    </div>
                  )}
                  <div className="flex justify-between font-bold text-foreground text-sm pt-1">
                    <span>합계</span>
                    <span>{won(finalPrice)}</span>
                  </div>
                </div>
              )}

              <button
                type="button"
                disabled={!canBook}
                onClick={() => setBookingStep("confirm")}
                className="w-full btn-primary py-3.5 text-sm mt-3 disabled:opacity-40 disabled:cursor-not-allowed"
              >
                {canBook ? `예약하기 · ${won(finalPrice)}` : "아이, 날짜, 시간을 선택하세요"}
              </button>
              <p className="text-[11px] text-muted text-center mt-2">첫 수업 24시간 전까지 취소</p>
            </div>
          </>
        )}
      </section>
    </div>
  );
}
