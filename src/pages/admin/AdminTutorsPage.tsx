import { getTutors } from "../../data/tutors";
import { isBasicVerified, isPremiumVerified } from "../../utils/verification";

export default function AdminTutorsPage() {
  const tutors = getTutors();
  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-black text-slate-900">강사 관리</h1>

      <div className="bg-white rounded-2xl border border-slate-100 overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-slate-50 text-slate-500 text-xs">
            <tr>
              <th className="text-left p-4">강사</th>
              <th className="text-left p-4">소속</th>
              <th className="text-left p-4">기본인증</th>
              <th className="text-left p-4">프리미엄</th>
              <th className="text-left p-4">평점</th>
            </tr>
          </thead>
          <tbody>
            {tutors.map((t) => (
              <tr key={t.id} className="border-t border-slate-50">
                <td className="p-4">
                  <div className="flex items-center gap-3">
                    <img src={t.photo} alt="" className="w-8 h-8 rounded-lg object-cover" />
                    <span className="font-semibold text-slate-800">{t.name}</span>
                  </div>
                </td>
                <td className="p-4 text-slate-500">{t.affiliation}</td>
                <td className="p-4">
                  <span className={`text-xs font-bold px-2 py-1 rounded-full ${isBasicVerified(t) ? "bg-blue-50 text-blue-600" : "bg-red-50 text-red-500"}`}>
                    {isBasicVerified(t) ? "완료" : "미완료"}
                  </span>
                </td>
                <td className="p-4">
                  <span className={`text-xs font-bold px-2 py-1 rounded-full ${isPremiumVerified(t) ? "bg-amber-50 text-amber-600" : "bg-slate-100 text-slate-400"}`}>
                    {isPremiumVerified(t) ? "완료" : "대기"}
                  </span>
                </td>
                <td className="p-4 font-bold text-slate-700">★ {t.rating}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
