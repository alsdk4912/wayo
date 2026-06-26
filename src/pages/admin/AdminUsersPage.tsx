import { listDemoAccounts } from "../../data/users";

export default function AdminUsersPage() {
  const parents = listDemoAccounts().filter((a) => a.role === "parent");

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-black text-slate-900">회원 관리</h1>

      <div className="bg-white rounded-2xl border border-slate-100 p-5">
        <h2 className="font-bold text-slate-800 mb-4">학부모 회원</h2>
        {parents.map((u) => (
          <div key={u.id} className="flex items-center gap-4 py-3 border-b border-slate-50 last:border-0">
            <img src={u.avatar} alt="" className="w-10 h-10 rounded-full" />
            <div className="flex-1">
              <p className="font-semibold text-slate-800">{u.name}</p>
              <p className="text-xs text-slate-400">{u.email} · {u.children}</p>
            </div>
            <span className="text-xs font-bold bg-emerald-50 text-emerald-600 px-2 py-1 rounded-full">프리미엄 구독</span>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-2xl border border-slate-100 p-5">
        <h2 className="font-bold text-slate-800 mb-2">통계</h2>
        <p className="text-sm text-slate-500">총 학부모 {parents.length}명 · 월정기권 구독률 100% (데모)</p>
      </div>
    </div>
  );
}
