import { artKit, kitOrders, PARTNER } from "../../data/kits";

const statusLabel: Record<string, { text: string; color: string }> = {
  pending: { text: "주문 접수", color: "bg-amber-50 text-amber-700" },
  preparing: { text: "포장 중", color: "bg-blue-50 text-blue-700" },
  shipped: { text: "배송 중", color: "bg-indigo-50 text-indigo-700" },
  delivered: { text: "배송 완료", color: "bg-emerald-50 text-emerald-700" },
};

export default function AdminKitsPage() {
  const totalMargin = kitOrders.reduce((sum, o) => sum + o.margin, 0);
  const partnerShare = Math.round(PARTNER.monthlyRevenue * PARTNER.settlementRate);
  const wayoShare = PARTNER.monthlyRevenue - partnerShare;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-black text-slate-900">키트·커리큘럼 관리</h1>
        <p className="text-sm text-slate-500 mt-1">교구 재고 · 주문 · 파트너 정산</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "재고 (주차별 키트)", value: artKit.stock, color: artKit.stock <= artKit.lowStockThreshold ? "text-red-500" : "text-blue-600" },
          { label: "이번달 주문", value: kitOrders.length, color: "text-emerald-600" },
          { label: "키트 마진 수익", value: `₩${totalMargin.toLocaleString()}`, color: "text-amber-600" },
          { label: "파트너 정산 대기", value: `₩${PARTNER.pendingSettlement.toLocaleString()}`, color: "text-violet-600" },
        ].map((s) => (
          <div key={s.label} className="bg-white rounded-2xl p-5 border border-slate-100">
            <p className={`text-2xl font-black ${s.color}`}>{s.value}</p>
            <p className="text-sm text-slate-500 mt-1">{s.label}</p>
          </div>
        ))}
      </div>

      {/* 재고 */}
      <div className="bg-white rounded-2xl border border-slate-100 overflow-hidden">
        <div className="px-5 py-4 border-b border-slate-50 flex items-center justify-between">
          <h2 className="font-bold text-slate-900">📦 재고 현황</h2>
          {artKit.stock <= artKit.lowStockThreshold && (
            <span className="text-xs font-bold bg-red-50 text-red-600 px-2.5 py-1 rounded-full">재고 부족 알림</span>
          )}
        </div>
        <div className="p-5">
          <div className="flex items-start justify-between mb-4">
            <div>
              <p className="font-bold text-slate-800">{artKit.name}</p>
              <p className="text-sm text-slate-500">{artKit.track}</p>
            </div>
            <div className="text-right text-sm">
              <p className="text-slate-500">주차당 판매가</p>
              <p className="font-black text-slate-800">₩{artKit.pricePerWeek.toLocaleString()}</p>
              <p className="text-xs text-emerald-600">마진 ₩{(artKit.pricePerWeek - artKit.costPerWeek).toLocaleString()}/키트</p>
            </div>
          </div>
          <div className="grid grid-cols-4 sm:grid-cols-8 gap-2">
            {artKit.weeks.map((w) => {
              const weekStock = Math.floor(artKit.stock / artKit.totalWeeks) + (w.week <= artKit.stock % artKit.totalWeeks ? 1 : 0);
              return (
                <div key={w.week} className="bg-slate-50 rounded-xl p-2 text-center border border-slate-100">
                  <p className="text-xs font-bold text-slate-400">{w.week}주</p>
                  <p className="text-lg font-black text-slate-800">{weekStock}</p>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* 주문 */}
      <div className="bg-white rounded-2xl border border-slate-100 overflow-hidden">
        <div className="px-5 py-4 border-b border-slate-50">
          <h2 className="font-bold text-slate-900">🚚 키트 주문 내역</h2>
        </div>
        <div className="divide-y divide-slate-50">
          {kitOrders.map((o) => {
            const st = statusLabel[o.status];
            return (
              <div key={o.id} className="px-5 py-4 flex items-center justify-between gap-4 flex-wrap">
                <div>
                  <p className="font-semibold text-slate-800 text-sm">
                    {o.tutorName} · {o.week}주차 키트
                  </p>
                  <p className="text-xs text-slate-400 mt-0.5">
                    세션 {o.sessionDate} · {o.childName} · {o.deliveryTo === "tutor" ? "강사 수령" : "학부모 직배"}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <div className="text-right text-xs">
                    <p className="font-bold text-slate-700">₩{o.unitPrice.toLocaleString()}</p>
                    <p className="text-emerald-600">마진 ₩{o.margin.toLocaleString()}</p>
                  </div>
                  <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${st.color}`}>{st.text}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 파트너 정산 */}
      <div className="bg-white rounded-2xl border border-slate-100 overflow-hidden">
        <div className="px-5 py-4 border-b border-slate-50">
          <h2 className="font-bold text-slate-900">🤝 파트너 정산</h2>
        </div>
        <div className="p-5">
          <div className="flex items-start gap-4 mb-5">
            <div className="w-12 h-12 bg-amber-100 rounded-2xl flex items-center justify-center text-2xl">🎨</div>
            <div>
              <p className="font-bold text-slate-900">{PARTNER.name}</p>
              <p className="text-sm text-slate-500">{PARTNER.role}</p>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-5">
            <div className="bg-slate-50 rounded-xl p-4">
              <p className="text-xs text-slate-500">이번달 키트 매출</p>
              <p className="text-xl font-black text-slate-800">₩{PARTNER.monthlyRevenue.toLocaleString()}</p>
            </div>
            <div className="bg-violet-50 rounded-xl p-4">
              <p className="text-xs text-violet-600">파트너 정산 ({PARTNER.settlementRate * 100}%)</p>
              <p className="text-xl font-black text-violet-700">₩{partnerShare.toLocaleString()}</p>
            </div>
            <div className="bg-emerald-50 rounded-xl p-4">
              <p className="text-xs text-emerald-600">와요 마진 수익</p>
              <p className="text-xl font-black text-emerald-700">₩{wayoShare.toLocaleString()}</p>
            </div>
          </div>
          <div className="flex items-center justify-between bg-amber-50 border border-amber-100 rounded-xl p-4">
            <div>
              <p className="text-sm font-bold text-amber-800">정산 대기 금액</p>
              <p className="text-xs text-amber-600 mt-0.5">다음 정산일: 2026-06-25</p>
            </div>
            <p className="text-lg font-black text-amber-700">₩{PARTNER.pendingSettlement.toLocaleString()}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
