import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { bookings } from "../../data/bookings";

export default function ParentHomePage() {
  const { user } = useAuth();
  const myBookings = bookings.filter((b) => b.parentId === user?.id);
  const upcoming = myBookings.filter((b) => b.status === "confirmed");

  return (
    <div className="space-y-5">
      <div className="bg-gradient-to-br from-blue-600 to-indigo-600 rounded-3xl p-6 text-white">
        <p className="text-blue-100 text-sm">안녕하세요 👋</p>
        <h1 className="text-2xl font-black mt-1">{user?.name}님</h1>
        <p className="text-blue-100 text-sm mt-1">{user?.children} 엄마 · 월 4회 정기권 이용 중</p>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="bg-white rounded-2xl p-4 border border-slate-100">
          <p className="text-2xl font-black text-slate-900">{upcoming.length}</p>
          <p className="text-xs text-slate-500 mt-1">예정된 세션</p>
        </div>
        <div className="bg-white rounded-2xl p-4 border border-slate-100">
          <p className="text-2xl font-black text-amber-500">⭐</p>
          <p className="text-xs text-slate-500 mt-1">프리미엄 구독 중</p>
        </div>
      </div>

      {upcoming.length > 0 && (
        <section>
          <h2 className="font-bold text-slate-900 mb-3">다음 세션</h2>
          {upcoming.map((b) => (
            <div key={b.id} className="bg-white rounded-2xl p-4 border border-slate-100 flex items-center gap-4">
              <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center text-xl">📅</div>
              <div className="flex-1">
                <p className="font-bold text-slate-800 text-sm">{b.tutorName}</p>
                <p className="text-xs text-slate-500">{b.date} {b.time} · {b.childName}</p>
              </div>
              <span className="text-xs font-bold text-blue-600 bg-blue-50 px-2 py-1 rounded-full">확정</span>
            </div>
          ))}
        </section>
      )}

      <section>
        <h2 className="font-bold text-slate-900 mb-3">빠른 메뉴</h2>
        <div className="grid grid-cols-2 gap-3">
          <Link to="/parent/tutors" className="bg-white rounded-2xl p-4 border border-slate-100 hover:border-blue-200 transition-colors">
            <span className="text-2xl">👩‍🏫</span>
            <p className="font-bold text-slate-800 text-sm mt-2">강사 찾기</p>
          </Link>
          <Link to="/parent/subscription" className="bg-white rounded-2xl p-4 border border-slate-100 hover:border-blue-200 transition-colors">
            <span className="text-2xl">✨</span>
            <p className="font-bold text-slate-800 text-sm mt-2">프리미엄 혜택</p>
          </Link>
        </div>
      </section>
    </div>
  );
}
