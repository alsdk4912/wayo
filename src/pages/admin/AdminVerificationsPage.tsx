import { getTutors } from "../../data/tutors";
import { isBasicVerified, isPremiumVerified } from "../../utils/verification";
import { BASIC_VERIFY_ITEMS, PREMIUM_VERIFY_ITEMS } from "../../utils/verification";

export default function AdminVerificationsPage() {
  const tutors = getTutors();
  const pending = tutors.filter((t) => isBasicVerified(t) && !isPremiumVerified(t));

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-black text-slate-900">인증 심사</h1>

      <div className="grid grid-cols-2 gap-4">
        <div className="bg-white rounded-2xl p-5 border border-slate-100">
          <p className="text-sm font-bold text-blue-600 mb-2">기본 인증 (4종)</p>
          <ul className="space-y-1">
            {BASIC_VERIFY_ITEMS.map((v) => (
              <li key={v.key} className="text-sm text-slate-600">✓ {v.label}</li>
            ))}
          </ul>
        </div>
        <div className="bg-white rounded-2xl p-5 border border-slate-100">
          <p className="text-sm font-bold text-amber-600 mb-2">프리미엄 인증 (2종)</p>
          <ul className="space-y-1">
            {PREMIUM_VERIFY_ITEMS.map((v) => (
              <li key={v.key} className="text-sm text-slate-600">✓ {v.label}</li>
            ))}
          </ul>
        </div>
      </div>

      <section>
        <h2 className="font-bold text-slate-900 mb-3">프리미엄 인증 대기 ({pending.length}명)</h2>
        {pending.length === 0 ? (
          <p className="text-slate-500 text-sm">대기 중인 강사가 없습니다.</p>
        ) : (
          pending.map((t) => (
            <div key={t.id} className="bg-white rounded-2xl p-5 border border-slate-100 mb-3 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <img src={t.photo} alt="" className="w-10 h-10 rounded-xl object-cover" />
                <div>
                  <p className="font-bold text-slate-800">{t.name}</p>
                  <p className="text-xs text-slate-400">기본 인증 완료 · 프리미엄 서류 제출 대기</p>
                </div>
              </div>
              <div className="flex gap-2">
                <button className="text-xs font-bold bg-emerald-600 text-white px-3 py-2 rounded-xl">승인</button>
                <button className="text-xs font-bold bg-slate-100 text-slate-600 px-3 py-2 rounded-xl">반려</button>
              </div>
            </div>
          ))
        )}
      </section>
    </div>
  );
}
