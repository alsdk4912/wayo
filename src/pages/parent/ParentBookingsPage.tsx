import { bookings } from "../../data/bookings";
import { useAuth } from "../../context/AuthContext";

export default function ParentBookingsPage() {
  const { user } = useAuth();
  const myBookings = bookings.filter((b) => b.parentId === user?.id);

  return (
    <div className="space-y-4">
      <h1 className="text-xl font-black text-slate-900">내 예약</h1>

      {myBookings.length === 0 ? (
        <p className="text-slate-500 text-sm text-center py-12">예약 내역이 없습니다.</p>
      ) : (
        myBookings.map((b) => (
          <div key={b.id} className="bg-white rounded-2xl p-5 border border-slate-100">
            <div className="flex items-center justify-between mb-3">
              <p className="font-bold text-slate-900">{b.tutorName}</p>
              <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${
                b.status === "confirmed" ? "bg-blue-50 text-blue-600" :
                b.status === "completed" ? "bg-emerald-50 text-emerald-600" :
                "bg-amber-50 text-amber-600"
              }`}>
                {b.status === "confirmed" ? "예정" : b.status === "completed" ? "완료" : "대기"}
              </span>
            </div>
            <div className="space-y-1 text-sm text-slate-500">
              <p>📅 {b.date} {b.time}</p>
              <p>👶 {b.childName}</p>
              <p>📦 {b.package}</p>
              {b.kitIncluded && (
                <p className="text-amber-700 font-medium">🎨 미술 키트 {b.kitWeek}주차 · ₩{b.kitPrice?.toLocaleString()}</p>
              )}
            </div>
            {b.status === "completed" && (
              <div className="mt-3 pt-3 border-t border-slate-50 flex gap-2">
                {["활동사진", "활동일지", "AI리포트"].map((f) => (
                  <span key={f} className="text-xs bg-indigo-50 text-indigo-600 px-2 py-1 rounded-full font-medium">{f} ✓</span>
                ))}
              </div>
            )}
          </div>
        ))
      )}
    </div>
  );
}
