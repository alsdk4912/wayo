type Variant = "pending" | "confirmed" | "completed" | "cancelled" | "matched" | "premium" | "basic";

const styles: Record<Variant, string> = {
  pending: "bg-amber-50 text-amber-700",
  confirmed: "bg-primary-50 text-primary",
  completed: "bg-emerald-50 text-emerald-700",
  cancelled: "bg-surface-muted text-muted",
  matched: "bg-emerald-50 text-emerald-700",
  premium: "bg-accent-50 text-accent",
  basic: "bg-primary-50 text-primary",
};

const labels: Record<Variant, string> = {
  pending: "대기",
  confirmed: "예정",
  completed: "완료",
  cancelled: "취소됨",
  matched: "매칭완료",
  premium: "프리미엄",
  basic: "기본 인증",
};

interface Props {
  variant: Variant;
  label?: string;
}

export default function StatusBadge({ variant, label }: Props) {
  return (
    <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-md ${styles[variant]}`}>
      {label ?? labels[variant]}
    </span>
  );
}
