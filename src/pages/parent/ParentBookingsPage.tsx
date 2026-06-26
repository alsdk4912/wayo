import { cancelBookingRequest, getBookings } from "../../data/bookings";
import { useAuth } from "../../context/AuthContext";
import { cancelMatchingRequest, getMatchingRequests } from "../../data/matching";

export default function ParentBookingsPage() {
  const { user } = useAuth();
  const myBookings = getBookings().filter((b) => b.parentId === user?.id);
  const myMatchingRequests = getMatchingRequests().filter((m) => m.parentId === user?.id);

  return (
    <div className="space-y-4">
      <h1 className="text-xl font-black text-slate-900">내 예약</h1>

      <div className="bg-white rounded-2xl p-5 border border-slate-100">
        <p className="font-bold text-slate-800 mb-2">매칭 신청</p>
        {myMatchingRequests.length === 0 ? (
          <p className="text-xs text-slate-400">매칭 신청 내역이 없습니다.</p>
        ) : (
          <div className="space-y-2">
            {myMatchingRequests.map((req) => (
              <div key={req.id} className="rounded-xl border border-blue-100 bg-blue-50 px-3 py-2">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <p className="text-sm font-semibold text-blue-700">{req.tutorName}</p>
                    <p className="text-xs text-blue-600">{req.childSummary}</p>
                    <p className="text-xs text-blue-500">{req.requestNote}</p>
                  </div>
                  <span className={`text-[10px] font-bold px-2 py-1 rounded-full ${
                    req.status === "matched" ? "bg-emerald-100 text-emerald-700" :
                    req.status === "cancelled" ? "bg-slate-200 text-slate-600" :
                    "bg-amber-100 text-amber-700"
                  }`}>
                    {req.status === "matched" ? "매칭완료" : req.status === "cancelled" ? "취소됨" : "접수"}
                  </span>
                </div>
                {req.status === "pending" && (
                  <button
                    type="button"
                    onClick={() => cancelMatchingRequest(req.id)}
                    className="mt-2 text-xs font-bold text-red-600 hover:underline"
                  >
                    매칭 신청 취소
                  </button>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {myBookings.length === 0 ? (
        <p className="text-slate-500 text-sm text-center py-12">예약 내역이 없습니다.</p>
      ) : (
        myBookings.map((b) => (
          <div key={b.id} className="bg-white rounded-2xl p-5 border border-slate-100">
            <div className="flex items-center justify-between mb-3">
              <p className="font-bold text-slate-900">{b.tutorName}</p>
              <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${
                b.status === "cancelled" ? "bg-slate-100 text-slate-500" :
                b.status === "confirmed" ? "bg-blue-50 text-blue-600" :
                b.status === "completed" ? "bg-emerald-50 text-emerald-600" :
                "bg-amber-50 text-amber-600"
              }`}>
                {b.status === "confirmed" ? "예정" : b.status === "completed" ? "완료" : b.status === "cancelled" ? "취소됨" : "대기"}
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
            {(b.status === "pending" || b.status === "confirmed") && (
              <button
                type="button"
                onClick={() => cancelBookingRequest(b.id)}
                className="mt-3 text-xs font-bold text-red-600 hover:underline"
              >
                예약 요청 취소
              </button>
            )}
          </div>
        ))
      )}
    </div>
  );
}
