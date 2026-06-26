import { getTutors } from "../../data/tutors";
import { getBookings } from "../../data/bookings";
import { artKit, kitOrders } from "../../data/kits";
import { listDemoAccounts } from "../../data/users";
import { isPremiumVerified } from "../../utils/verification";

export default function AdminDashboardPage() {
  const tutors = getTutors();
  const bookings = getBookings();
  const accounts = listDemoAccounts();
  const premiumCount = tutors.filter(isPremiumVerified).length;
  const pendingPremium = tutors.filter((t) => !isPremiumVerified(t)).length;
  const kitMargin = kitOrders.reduce((s, o) => s + o.margin, 0);

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-black text-slate-900">운영 대시보드</h1>

      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        {[
          { label: "등록 강사", value: tutors.length, color: "text-blue-600" },
          { label: "프리미엄 인증", value: premiumCount, color: "text-amber-600" },
          { label: "인증 대기", value: pendingPremium, color: "text-red-500" },
          { label: "이번달 예약", value: bookings.length, color: "text-emerald-600" },
          { label: "키트 마진", value: `₩${kitMargin.toLocaleString()}`, color: "text-violet-600" },
        ].map((s) => (
          <div key={s.label} className="bg-white rounded-2xl p-5 border border-slate-100">
            <p className={`text-3xl font-black ${s.color}`}>{s.value}</p>
            <p className="text-sm text-slate-500 mt-1">{s.label}</p>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-2xl border border-slate-100 p-5">
        <h2 className="font-bold text-slate-900 mb-4">키트·커리큘럼 요약</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm">
          <div className="bg-amber-50 rounded-xl p-4">
            <p className="text-xs text-amber-600 font-bold">재고</p>
            <p className="text-xl font-black text-amber-800">{artKit.stock}세트</p>
          </div>
          <div className="bg-blue-50 rounded-xl p-4">
            <p className="text-xs text-blue-600 font-bold">키트 주문</p>
            <p className="text-xl font-black text-blue-800">{kitOrders.length}건</p>
          </div>
          <div className="bg-violet-50 rounded-xl p-4">
            <p className="text-xs text-violet-600 font-bold">파트너</p>
            <p className="font-bold text-violet-800">{artKit.partner}</p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-100 p-5">
        <h2 className="font-bold text-slate-900 mb-4">최근 예약</h2>
        <div className="space-y-3">
          {bookings.map((b) => (
            <div key={b.id} className="flex items-center justify-between text-sm border-b border-slate-50 pb-3 last:border-0">
              <div>
                <p className="font-semibold text-slate-800">{b.tutorName} → {b.childName}</p>
                <p className="text-xs text-slate-400">{b.date} {b.time}</p>
              </div>
              <span className="text-xs font-bold text-blue-600">{b.package}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-100 p-5">
        <h2 className="font-bold text-slate-900 mb-2">데모 계정</h2>
        <p className="text-sm text-slate-500">총 {accounts.length}개 (학부모·강사·관리자)</p>
      </div>
    </div>
  );
}
