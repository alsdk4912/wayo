import { getParentVerificationSummary } from "../data/teacherVerification";
import TeacherVerificationBadge from "./TeacherVerificationBadge";
import Icon from "./ui/Icon";

interface Props {
  teacherId: number;
}

function formatDate(iso: string | null) {
  if (!iso) return "-";
  return iso.slice(0, 10).replace(/-/g, ".");
}

export default function TeacherVerificationParentCard({ teacherId }: Props) {
  const summary = getParentVerificationSummary(teacherId);

  return (
    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
      <div className="px-6 py-4 border-b border-slate-50 flex items-center justify-between gap-3">
        <div>
          <p className="font-semibold text-foreground flex items-center gap-2">
            <Icon name="shield" size={16} className="text-primary" />
            플랫폼 확인 절차
          </p>
          <p className="text-slate-400 text-xs mt-0.5">서류 확인 절차 현황 (민감정보 비공개)</p>
        </div>
        <TeacherVerificationBadge status={summary.status} />
      </div>

      <div className="p-6 space-y-4">
        {summary.summaryText && (
          <p className="text-sm text-emerald-800 bg-emerald-50 border border-emerald-100 rounded-xl px-4 py-3">
            {summary.summaryText}
          </p>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
          {[
            { label: "신원 확인", ok: summary.identityVerified },
            { label: "체류자격 확인", ok: summary.visaVerified },
            { label: "아동 활동 적합성 확인", ok: summary.childSafetyVerified },
          ].map((item) => (
            <div
              key={item.label}
              className={`rounded-xl p-3 border text-sm ${item.ok ? "bg-primary-50 border-primary/20 text-primary" : "bg-surface-muted border-border text-muted"}`}
            >
              <span className="font-semibold">{item.label}</span>
              <p className="text-xs mt-1">{item.ok ? "확인 절차 완료" : "확인 전"}</p>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-2 gap-3 text-sm">
          <div>
            <p className="text-xs font-bold text-slate-400 mb-1">최근 확인일</p>
            <p className="text-slate-700">{formatDate(summary.lastReviewedAt)}</p>
          </div>
          <div>
            <p className="text-xs font-bold text-slate-400 mb-1">다음 재확인 예정일</p>
            <p className="text-slate-700">{formatDate(summary.nextReviewDate)}</p>
          </div>
        </div>

        <p className="text-xs text-slate-500 leading-relaxed border-t border-slate-50 pt-4">
          {summary.disclaimer}
        </p>
      </div>
    </div>
  );
}
