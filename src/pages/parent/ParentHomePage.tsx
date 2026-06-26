import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { getBookings } from "../../data/bookings";
import Icon from "../../components/ui/Icon";
import StatusBadge from "../../components/ui/StatusBadge";

export default function ParentHomePage() {
  const { user } = useAuth();
  const myBookings = getBookings().filter((b) => b.parentId === user?.id);
  const upcoming = myBookings.filter((b) => b.status === "confirmed");

  return (
    <div className="space-y-5">
      <section className="card p-5">
        <p className="text-sm text-muted">안녕하세요</p>
        <h1 className="text-xl font-bold text-foreground mt-0.5">{user?.name}님</h1>
        <p className="text-sm text-muted mt-1">{user?.children} · 월 4회 정기권 이용 중</p>
      </section>

      <div className="grid grid-cols-2 gap-3">
        <div className="card p-4">
          <p className="text-2xl font-bold text-foreground">{upcoming.length}</p>
          <p className="text-xs text-muted mt-1">예정된 세션</p>
        </div>
        <div className="card p-4">
          <div className="flex items-center gap-1.5">
            <Icon name="crown" size={18} className="text-accent" />
            <p className="text-sm font-semibold text-foreground">프리미엄</p>
          </div>
          <p className="text-xs text-muted mt-1.5">구독 이용 중</p>
        </div>
      </div>

      {upcoming.length > 0 && (
        <section>
          <h2 className="text-sm font-semibold text-foreground mb-3">다음 세션</h2>
          {upcoming.map((b) => (
            <div key={b.id} className="card p-4 flex items-center gap-3 mb-2">
              <div className="w-10 h-10 bg-primary-50 rounded-lg flex items-center justify-center shrink-0">
                <Icon name="calendar" size={18} className="text-primary" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-foreground text-sm">{b.tutorName}</p>
                <p className="text-xs text-muted truncate">{b.date} {b.time} · {b.childName}</p>
              </div>
              <StatusBadge variant="confirmed" label="확정" />
            </div>
          ))}
        </section>
      )}

      <section>
        <h2 className="text-sm font-semibold text-foreground mb-3">빠른 메뉴</h2>
        <div className="grid grid-cols-2 gap-3">
          <Link to="/parent/tutors" className="card p-4 hover:border-primary/30 transition-colors group">
            <div className="w-9 h-9 bg-primary-50 rounded-lg flex items-center justify-center mb-3 group-hover:bg-primary/10 transition-colors">
              <Icon name="users" size={18} className="text-primary" />
            </div>
            <p className="font-semibold text-foreground text-sm">강사 찾기</p>
            <p className="text-xs text-muted mt-0.5">인증 강사 탐색</p>
          </Link>
          <Link to="/parent/subscription" className="card p-4 hover:border-primary/30 transition-colors group">
            <div className="w-9 h-9 bg-accent-50 rounded-lg flex items-center justify-center mb-3">
              <Icon name="sparkles" size={18} className="text-accent" />
            </div>
            <p className="font-semibold text-foreground text-sm">프리미엄 혜택</p>
            <p className="text-xs text-muted mt-0.5">구독 기능 안내</p>
          </Link>
        </div>
      </section>
    </div>
  );
}
