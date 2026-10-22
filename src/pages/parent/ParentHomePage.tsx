import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { getBookings } from "../../data/bookings";
import Icon from "../../components/ui/Icon";

function prettyDate(iso: string) {
  const [y, m, d] = iso.split("-");
  if (!y || !m || !d) return iso;
  return `${y}.${m}.${d}`;
}

export default function ParentHomePage() {
  const { user } = useAuth();
  const mine = getBookings().filter((b) => b.parentId === user?.id);
  const upcoming = mine
    .filter((b) => b.status === "confirmed" || b.status === "pending")
    .sort((a, b) => `${a.date}${a.time}`.localeCompare(`${b.date}${b.time}`));
  const next = upcoming[0];
  const done = mine.filter((b) => b.status === "completed").length;

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
          <h2 className="text-sm font-semibold text-foreground">다음 세션</h2>
          <Link to="/parent/bookings" className="text-[11px] font-semibold text-primary">전체</Link>
        </div>
        {next ? (
          <div className="card p-4 flex-1 min-h-0 flex flex-col justify-center">
            <div className="flex items-center gap-3">
              <span className="w-11 h-11 rounded-2xl bg-primary-50 text-primary flex items-center justify-center shrink-0">
                <Icon name="calendar" size={18} />
              </span>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-semibold text-foreground truncate">{next.tutorName}</p>
                <p className="text-xs text-muted mt-0.5 truncate">{prettyDate(next.date)} {next.time}</p>
              </div>
              <span className="text-[11px] font-semibold text-primary bg-primary-50 px-2 py-0.5 rounded-full shrink-0">
                {next.status === "pending" ? "대기" : "확정"}
              </span>
            </div>
            <div className="grid grid-cols-2 gap-2 mt-4">
              <div className="rounded-2xl bg-surface-muted px-3 py-2.5">
                <p className="text-[11px] text-muted">아이</p>
                <p className="text-sm font-semibold text-foreground mt-0.5 truncate">{next.childName}</p>
              </div>
              <div className="rounded-2xl bg-surface-muted px-3 py-2.5">
                <p className="text-[11px] text-muted">패키지</p>
                <p className="text-sm font-semibold text-foreground mt-0.5 truncate">{next.package}</p>
              </div>
            </div>
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
    </div>
  );
}
