import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { getBookings, type Booking } from "../../data/bookings";
import { getTutorById } from "../../data/tutors";
import { premiumExamples, type PremiumExample } from "../../data/premiumExamples";
import PremiumFeatureModal from "../../components/PremiumFeatureModal";
import Icon from "../../components/ui/Icon";

const SESSION_MINUTES = 60;

function prettyDate(iso: string) {
  const [y, m, d] = iso.split("-");
  if (!y || !m || !d) return iso;
  return `${y}.${m}.${d}`;
}

function clock(date: Date) {
  return `${String(date.getHours()).padStart(2, "0")}:${String(date.getMinutes()).padStart(2, "0")}`;
}

function sessionStart(booking: Booking) {
  const [y, m, d] = booking.date.split("-").map(Number);
  const [hh, mm] = booking.time.split(":").map(Number);
  return new Date(y, (m || 1) - 1, d || 1, hh || 0, mm || 0, 0, 0);
}

function isLiveSession(booking: Booking, now: Date) {
  if (booking.status !== "confirmed") return false;
  const start = sessionStart(booking).getTime();
  const end = start + SESSION_MINUTES * 60_000;
  const current = now.getTime();
  return current >= start && current < end;
}

function locationExample(booking: Booking): PremiumExample | null {
  const base = premiumExamples.find((item) => item.id === "location");
  if (!base) return null;
  const start = sessionStart(booking);
  const arrive = new Date(start.getTime() - 5 * 60_000);
  const end = new Date(start.getTime() + SESSION_MINUTES * 60_000);
  const place = getTutorById(booking.tutorId)?.location ?? "방문 수업";
  return {
    ...base,
    example: {
      ...base.example,
      date: `${prettyDate(booking.date)} ${booking.time}`,
      tutor: booking.tutorName,
      child: booking.childName,
      details: [
        `${clock(arrive)} 출발 · 수업 장소로 이동`,
        `${clock(start)} 세션 시작 · ${place}`,
        `${clock(end)} 세션 종료 예정`,
      ],
    },
  };
}

export default function ParentHomePage() {
  const { user } = useAuth();
  const [now, setNow] = useState(() => new Date());
  const [showLocation, setShowLocation] = useState(false);
  const mine = getBookings().filter((b) => b.parentId === user?.id);
  const live = mine
    .filter((b) => isLiveSession(b, now))
    .sort((a, b) => sessionStart(b).getTime() - sessionStart(a).getTime())[0];
  const upcoming = mine
    .filter((b) => (b.status === "confirmed" || b.status === "pending") && b.id !== live?.id)
    .sort((a, b) => `${a.date}${a.time}`.localeCompare(`${b.date}${b.time}`));
  const next = upcoming[0];
  const featured = live ?? next;
  const done = mine.filter((b) => b.status === "completed").length;

  useEffect(() => {
    const id = window.setInterval(() => setNow(new Date()), 30_000);
    return () => window.clearInterval(id);
  }, []);

  return (
    <div className="h-full overflow-hidden flex flex-col gap-3">
      <section className="relative overflow-hidden rounded-[24px] bg-gradient-to-br from-primary to-accent text-white px-5 py-4 shrink-0">
        <div className="absolute -right-6 -top-8 w-24 h-24 rounded-full bg-white/10" />
        <div className="absolute right-8 bottom-3 w-2.5 h-2.5 rounded-full bg-spark" />
        <div className="relative">
          <p className="text-[11px] font-semibold tracking-wide text-white/75">WAYO HOME</p>
          <h1 className="text-[22px] font-bold leading-tight mt-1">{user?.name}님</h1>
          <p className="text-sm text-white/80 mt-1">{user?.children ?? "자녀"} · 월 4회 정기권</p>
        </div>
      </section>

      <section className="card px-2 py-3 grid grid-cols-3 shrink-0">
        {[
          { value: String(upcoming.length), label: "예정" },
          { value: String(done), label: "완료" },
          { value: "4회", label: "이번 달" },
        ].map((item) => (
          <div key={item.label} className="text-center">
            <p className="text-lg font-bold text-foreground">{item.value}</p>
            <p className="text-[11px] text-muted mt-0.5">{item.label}</p>
          </div>
        ))}
      </section>

      <section className="flex-1 min-h-0 flex flex-col">
        <div className="flex items-baseline justify-between mb-2 px-0.5 shrink-0">
          <h2 className="text-sm font-semibold text-foreground">{live ? "현재 세션" : "다음 세션"}</h2>
          <Link to="/parent/bookings" className="text-[11px] font-semibold text-primary">전체</Link>
        </div>
        {featured ? (
          <div className="card p-4 flex-1 min-h-0 flex flex-col justify-center">
            <div className="flex items-center gap-3">
              <span className="w-11 h-11 rounded-2xl bg-primary-50 text-primary flex items-center justify-center shrink-0">
                <Icon name={live ? "map-pin" : "calendar"} size={18} />
              </span>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-semibold text-foreground truncate">{featured.tutorName}</p>
                <p className="text-xs text-muted mt-0.5 truncate">{prettyDate(featured.date)} {featured.time}</p>
              </div>
              <span className="text-[11px] font-semibold text-primary bg-primary-50 px-2 py-0.5 rounded-full shrink-0">
                {live ? "수업 중" : featured.status === "pending" ? "대기" : "확정"}
              </span>
            </div>
            <div className="grid grid-cols-2 gap-2 mt-4">
              <div className="rounded-2xl bg-surface-muted px-3 py-2.5">
                <p className="text-[11px] text-muted">아이</p>
                <p className="text-sm font-semibold text-foreground mt-0.5 truncate">{featured.childName}</p>
              </div>
              <div className="rounded-2xl bg-surface-muted px-3 py-2.5">
                <p className="text-[11px] text-muted">{live ? "장소" : "패키지"}</p>
                <p className="text-sm font-semibold text-foreground mt-0.5 truncate">
                  {live ? (getTutorById(featured.tutorId)?.location ?? "방문 수업") : featured.package}
                </p>
              </div>
            </div>
            {live && (
              <button type="button" onClick={() => setShowLocation(true)} className="btn-primary w-full py-2.5 text-sm mt-3">
                위치 공유 보기
              </button>
            )}
          </div>
        ) : (
          <div className="card p-4 flex-1 min-h-0 flex flex-col items-center justify-center text-center">
            <p className="text-sm font-semibold text-foreground">예정된 세션이 없습니다</p>
            <p className="text-xs text-muted mt-1">영어메이트를 고르면 집에서 수업이 시작됩니다.</p>
          </div>
        )}
      </section>

      <div className="grid grid-cols-2 gap-2.5 shrink-0">
        <Link to="/parent/tutors" className="card px-3.5 py-3 flex items-center gap-2.5">
          <span className="w-9 h-9 rounded-2xl bg-primary-50 text-primary flex items-center justify-center shrink-0">
            <Icon name="users" size={16} />
          </span>
          <span>
            <span className="block text-sm font-semibold text-foreground">강사 찾기</span>
            <span className="block text-[11px] text-muted">영어메이트</span>
          </span>
        </Link>
        <Link to="/parent/subscription" className="card px-3.5 py-3 flex items-center gap-2.5">
          <span className="w-9 h-9 rounded-2xl bg-accent-50 text-accent flex items-center justify-center shrink-0">
            <Icon name="crown" size={16} />
          </span>
          <span>
            <span className="block text-sm font-semibold text-foreground">구독</span>
            <span className="block text-[11px] text-muted">Wayo Pass</span>
          </span>
        </Link>
      </div>
      <PremiumFeatureModal example={showLocation && live ? locationExample(live) : null} onClose={() => setShowLocation(false)} />
    </div>
  );
}
