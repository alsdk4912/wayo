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
    <div className="card overflow-hidden">
      <div className="px-4 py-3.5 border-b border-border flex items-center justify-between gap-3">
        <div>
          <p className="text-sm font-semibold text-foreground flex items-center gap-2">
            <Icon name="shield" size={15} className="text-primary" />
            확인 절차
          </p>
          <p className="text-[11px] text-muted mt-0.5">서류 확인 현황 · 민감정보는 보이지 않습니다</p>
        </div>
        <TeacherVerificationBadge status={summary.status} />
      </div>

      <div className="p-4 space-y-3">
        {summary.summaryText && (
          <p className="text-sm text-foreground bg-primary-50 rounded-2xl px-3.5 py-3">{summary.summaryText}</p>
        )}

        <div className="grid grid-cols-3 gap-1.5">
          {[
            { label: "신원", ok: summary.identityVerified },
            { label: "체류자격", ok: summary.visaVerified },
            { label: "아동 활동", ok: summary.childSafetyVerified },
          ].map((item) => (
            <div
              key={item.label}
              className={`rounded-2xl px-2 py-2.5 text-center ${item.ok ? "bg-primary-50 text-primary" : "bg-surface-muted text-muted"}`}
            >
              <p className="text-[11px] font-semibold leading-tight">{item.label}</p>
              <p className="text-[10px] mt-1">{item.ok ? "완료" : "확인 전"}</p>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-2 gap-2">
          <div className="rounded-2xl bg-surface-muted px-3 py-2.5">
            <p className="text-[11px] text-muted">최근 확인</p>
            <p className="text-sm font-semibold text-foreground mt-0.5">{formatDate(summary.lastReviewedAt)}</p>
          </div>
          <div className="rounded-2xl bg-surface-muted px-3 py-2.5">
            <p className="text-[11px] text-muted">다음 재확인</p>
            <p className="text-sm font-semibold text-foreground mt-0.5">{formatDate(summary.nextReviewDate)}</p>
          </div>
        </div>

        <p className="text-[11px] text-muted leading-relaxed">{summary.disclaimer}</p>
      </div>
    </div>
  );
}
