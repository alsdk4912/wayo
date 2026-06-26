import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { getTutors } from "../../data/tutors";
import { getVerifications, runVerificationExpiryJob, runTeacherVerificationSelfTests } from "../../data/teacherVerification";
import { VERIFICATION_STATUS_LABELS, type VerificationStatus } from "../../types/teacherVerification";
import TeacherVerificationBadge from "../../components/TeacherVerificationBadge";

const STATUS_FILTERS: Array<VerificationStatus | "ALL" | "EXPIRING"> = [
  "ALL",
  "SUBMITTED",
  "IN_REVIEW",
  "NEEDS_RESUBMISSION",
  "APPROVED",
  "EXPIRING",
  "EXPIRED",
  "SUSPENDED",
  "REJECTED",
];

export default function AdminVerificationsPage() {
  const [statusFilter, setStatusFilter] = useState<VerificationStatus | "ALL" | "EXPIRING">("ALL");
  const [testResult, setTestResult] = useState<string | null>(null);
  runVerificationExpiryJob();

  const tutors = getTutors();
  const verifications = getVerifications();

  const rows = useMemo(() => {
    return verifications
      .map((v) => {
        const tutor = tutors.find((t) => t.id === v.teacherId);
        return { verification: v, tutor };
      })
      .filter((row) => row.tutor)
      .filter((row) => {
        if (statusFilter === "ALL") return true;
        if (statusFilter === "EXPIRING") return row.verification.status === "EXPIRING_SOON";
        return row.verification.status === statusFilter;
      })
      .sort((a, b) => {
        const priority: Record<VerificationStatus, number> = {
          SUBMITTED: 0,
          IN_REVIEW: 1,
          NEEDS_RESUBMISSION: 2,
          EXPIRING_SOON: 3,
          EXPIRED: 4,
          SUSPENDED: 5,
          NOT_SUBMITTED: 6,
          APPROVED: 7,
          REJECTED: 8,
        };
        return priority[a.verification.status] - priority[b.verification.status];
      });
  }, [verifications, tutors, statusFilter]);

  const pendingCount = verifications.filter((v) =>
    ["SUBMITTED", "IN_REVIEW", "NEEDS_RESUBMISSION"].includes(v.status)
  ).length;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-2xl font-black text-slate-900">강사 검증 검수</h1>
          <p className="text-sm text-slate-500 mt-1">
            제출 서류를 확인한 뒤 항목별 확인 여부를 체크하고 검증 상태를 변경하세요.
          </p>
        </div>
        <div className="flex flex-wrap gap-2 items-center">
        <div className="text-sm text-slate-600 bg-white border border-slate-100 rounded-xl px-4 py-2">
          검수 대기·진행: <strong>{pendingCount}</strong>건
        </div>
        <button
          type="button"
          onClick={() => {
            const r = runTeacherVerificationSelfTests();
            setTestResult(r.pass ? "자가 테스트 통과" : `실패: ${r.errors.join(", ")}`);
          }}
          className="text-xs font-semibold bg-slate-100 text-slate-600 px-3 py-2 rounded-xl"
        >
          자가 테스트
        </button>
        {testResult && <span className="text-xs text-muted">{testResult}</span>}
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
        {STATUS_FILTERS.map((filter) => (
          <button
            key={filter}
            type="button"
            onClick={() => setStatusFilter(filter)}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-colors ${
              statusFilter === filter
                ? "bg-primary text-white border-primary"
                : "bg-white text-muted border-border hover:border-primary/30"
            }`}
          >
            {filter === "ALL"
              ? "전체"
              : filter === "EXPIRING"
                ? "만료예정"
                : VERIFICATION_STATUS_LABELS[filter]}
          </button>
        ))}
      </div>

      {rows.length === 0 ? (
        <p className="text-slate-500 text-sm">해당 조건의 강사가 없습니다.</p>
      ) : (
        <div className="space-y-3">
          {rows.map(({ verification, tutor }) => (
            <Link
              key={verification.id}
              to={`/admin/verifications/${verification.teacherId}`}
              className="bg-white rounded-2xl p-5 border border-slate-100 flex items-center justify-between gap-4 hover:border-primary/30 transition-colors"
            >
              <div className="flex items-center gap-3 min-w-0">
                <img src={tutor!.photo} alt="" className="w-10 h-10 rounded-xl object-cover shrink-0" />
                <div className="min-w-0">
                  <p className="font-bold text-slate-800 truncate">{tutor!.name}</p>
                  <p className="text-xs text-slate-400">
                    {verification.nationality || "국적 미입력"} · {verification.visaType || "체류자격 미입력"}
                    {verification.visaExpiryDate && ` · 만료 ${verification.visaExpiryDate}`}
                  </p>
                </div>
              </div>
              <TeacherVerificationBadge status={verification.status} />
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
