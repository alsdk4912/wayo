import type { VerificationStatus } from "../types/teacherVerification";
import { getParentVerificationBadgeLabel } from "../data/teacherVerification";

const styles: Record<VerificationStatus, string> = {
  NOT_SUBMITTED: "bg-surface-muted text-muted",
  SUBMITTED: "bg-amber-50 text-amber-700",
  IN_REVIEW: "bg-amber-50 text-amber-700",
  APPROVED: "bg-emerald-50 text-emerald-700",
  REJECTED: "bg-red-50 text-red-700",
  NEEDS_RESUBMISSION: "bg-orange-50 text-orange-700",
  EXPIRING_SOON: "bg-orange-50 text-orange-700",
  EXPIRED: "bg-red-50 text-red-700",
  SUSPENDED: "bg-red-50 text-red-700",
};

interface Props {
  status: VerificationStatus;
  label?: string;
}

export default function TeacherVerificationBadge({ status, label }: Props) {
  return (
    <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-md ${styles[status]}`}>
      {label ?? getParentVerificationBadgeLabel(status)}
    </span>
  );
}
