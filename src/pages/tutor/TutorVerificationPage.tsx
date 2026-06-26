import { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { getTutorById } from "../../data/tutors";
import {
  getVerificationByTeacherId,
  getDocuments,
  submitTeacherVerification,
} from "../../data/teacherVerification";
import {
  DOCUMENT_TYPE_LABELS,
  REQUIRED_DOCUMENT_TYPES,
  VERIFICATION_STATUS_LABELS,
  type DocumentType,
} from "../../types/teacherVerification";
import TeacherVerificationBadge from "../../components/TeacherVerificationBadge";
import Icon from "../../components/ui/Icon";

const ALL_DOC_TYPES: DocumentType[] = [
  ...REQUIRED_DOCUMENT_TYPES,
  "CRIMINAL_RECORD_RELATED_DOCUMENT",
  "ETC",
];

function readFileAsBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      resolve(result.split(",")[1] ?? "");
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

export default function TutorVerificationPage() {
  const { user } = useAuth();
  const tutor = getTutorById(user?.tutorId ?? 0);
  const verification = tutor ? getVerificationByTeacherId(tutor.id) : null;
  const docs = verification ? getDocuments(verification.id, tutor?.id) : [];

  const [nationality, setNationality] = useState(verification?.nationality ?? "");
  const [visaType, setVisaType] = useState(verification?.visaType ?? "");
  const [visaExpiryDate, setVisaExpiryDate] = useState(verification?.visaExpiryDate ?? "");
  const [documentIssuedDate, setDocumentIssuedDate] = useState(verification?.documentIssuedDate ?? "");
  const [additionalNote, setAdditionalNote] = useState(verification?.additionalNote ?? "");
  const [consentAgreed, setConsentAgreed] = useState(verification?.consentAgreed ?? false);
  const [uploads, setUploads] = useState<Record<DocumentType, File | null>>(
    () => Object.fromEntries(ALL_DOC_TYPES.map((t) => [t, null])) as Record<DocumentType, File | null>
  );
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  if (!user || !tutor) {
    return (
      <div className="card p-5 text-center">
        <p className="font-semibold text-foreground mb-2">프로필 등록 후 검증 서류를 제출할 수 있습니다.</p>
        <Link to="/tutor/profile" className="btn-primary text-sm px-4 py-2.5 inline-flex">
          프로필 등록하기
        </Link>
      </div>
    );
  }

  const canSubmit = !["IN_REVIEW"].includes(verification?.status ?? "NOT_SUBMITTED");
  const canResubmit = ["NEEDS_RESUBMISSION", "REJECTED", "NOT_SUBMITTED", "SUBMITTED", "EXPIRED"].includes(
    verification?.status ?? "NOT_SUBMITTED"
  );

  const handleFile = (type: DocumentType, file: File | null) => {
    setUploads((prev) => ({ ...prev, [type]: file }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setMessage("");
    setSubmitting(true);

    try {
      const filesToUpload = ALL_DOC_TYPES.filter((t) => uploads[t]);
      const documents = await Promise.all(
        filesToUpload.map(async (documentType) => {
          const file = uploads[documentType]!;
          const contentBase64 = await readFileAsBase64(file);
          return {
            documentType,
            fileName: file.name,
            mimeType: file.type || "application/octet-stream",
            fileSize: file.size,
            contentBase64,
          };
        })
      );

      const result = submitTeacherVerification(tutor.id, user.id, {
        nationality,
        visaType,
        visaExpiryDate,
        documentIssuedDate,
        additionalNote,
        consentAgreed,
        documents,
      });

      if (!result.ok) {
        setError(result.message);
      } else {
        setMessage("서류가 제출되었습니다. 검수 결과를 기다려주세요.");
        window.location.reload();
      }
    } catch {
      setError("파일 처리 중 오류가 발생했습니다.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-xl font-black text-slate-900">강사 검증 서류 제출</h1>
        <p className="text-sm text-slate-500 mt-1">
          영유아 대상 수업 안전성 확보를 위해 신분, 체류자격, 취업 가능 여부, 아동 대상 활동 적합성 확인 절차가 필요합니다.
        </p>
      </div>

      <div className="card p-4 flex items-center justify-between">
        <div>
          <p className="text-xs text-muted mb-1">현재 검증 상태</p>
          <TeacherVerificationBadge status={verification?.status ?? "NOT_SUBMITTED"} />
          <p className="text-xs text-slate-500 mt-1">
            {VERIFICATION_STATUS_LABELS[verification?.status ?? "NOT_SUBMITTED"]}
          </p>
        </div>
        {verification?.submittedAt && (
          <p className="text-xs text-slate-400">
            제출일: {verification.submittedAt.slice(0, 10)}
          </p>
        )}
      </div>

      {verification?.resubmissionReason && (
        <div className="rounded-xl border border-orange-200 bg-orange-50 p-4">
          <p className="text-xs font-bold text-orange-700 mb-1">보완 요청 사유</p>
          <p className="text-sm text-orange-900">{verification.resubmissionReason}</p>
        </div>
      )}
      {verification?.rejectionReason && (
        <div className="rounded-xl border border-red-200 bg-red-50 p-4">
          <p className="text-xs font-bold text-red-700 mb-1">반려 사유</p>
          <p className="text-sm text-red-900">{verification.rejectionReason}</p>
        </div>
      )}

      {docs.length > 0 && (
        <div className="card p-4">
          <p className="text-sm font-semibold text-foreground mb-2">제출된 서류 (파일명만 표시)</p>
          <ul className="space-y-1">
            {docs.map((d) => (
              <li key={d.id} className="text-xs text-muted flex items-center gap-2">
                <Icon name="clipboard" size={14} />
                {DOCUMENT_TYPE_LABELS[d.documentType]} — {d.originalFileName}
              </li>
            ))}
          </ul>
        </div>
      )}

      {canSubmit && canResubmit && (
        <form onSubmit={handleSubmit} className="card p-4 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <label className="block text-sm">
              <span className="text-xs font-semibold text-muted">국적</span>
              <input
                value={nationality}
                onChange={(e) => setNationality(e.target.value)}
                className="mt-1 w-full border border-border rounded-xl px-3 py-2 text-sm"
                placeholder="예: 미국"
                required
              />
            </label>
            <label className="block text-sm">
              <span className="text-xs font-semibold text-muted">체류자격</span>
              <input
                value={visaType}
                onChange={(e) => setVisaType(e.target.value)}
                className="mt-1 w-full border border-border rounded-xl px-3 py-2 text-sm"
                placeholder="예: E-2"
                required
              />
            </label>
            <label className="block text-sm">
              <span className="text-xs font-semibold text-muted">체류만료일</span>
              <input
                type="date"
                value={visaExpiryDate}
                onChange={(e) => setVisaExpiryDate(e.target.value)}
                className="mt-1 w-full border border-border rounded-xl px-3 py-2 text-sm"
                required
              />
            </label>
            <label className="block text-sm">
              <span className="text-xs font-semibold text-muted">서류 발급일</span>
              <input
                type="date"
                value={documentIssuedDate}
                onChange={(e) => setDocumentIssuedDate(e.target.value)}
                className="mt-1 w-full border border-border rounded-xl px-3 py-2 text-sm"
                required
              />
            </label>
          </div>

          <div>
            <p className="text-xs font-semibold text-muted mb-2">제출 서류</p>
            <div className="space-y-3">
              {ALL_DOC_TYPES.map((type) => (
                <label key={type} className="block rounded-xl border border-border p-3">
                  <span className="text-sm font-medium text-foreground">
                    {DOCUMENT_TYPE_LABELS[type]}
                    {REQUIRED_DOCUMENT_TYPES.includes(type) && (
                      <span className="text-red-500 ml-1">*</span>
                    )}
                  </span>
                  <input
                    type="file"
                    className="mt-2 block w-full text-xs"
                    onChange={(e) => handleFile(type, e.target.files?.[0] ?? null)}
                  />
                  {uploads[type] && (
                    <p className="text-[11px] text-muted mt-1">선택: {uploads[type]!.name}</p>
                  )}
                </label>
              ))}
            </div>
          </div>

          <label className="block text-sm">
            <span className="text-xs font-semibold text-muted">추가 설명 메모</span>
            <textarea
              value={additionalNote}
              onChange={(e) => setAdditionalNote(e.target.value)}
              className="mt-1 w-full border border-border rounded-xl px-3 py-2 text-sm"
              rows={3}
              placeholder="검수에 참고할 내용이 있으면 입력해주세요."
            />
          </label>

          <label className="flex items-start gap-2 text-sm cursor-pointer">
            <input
              type="checkbox"
              checked={consentAgreed}
              onChange={(e) => setConsentAgreed(e.target.checked)}
              className="mt-1"
            />
            <span className="text-slate-600">
              제출한 정보는 원어민 강사 검증 및 아동 대상 수업 안전성 확인을 위해 사용되며, 검수 목적 외로 공개되지 않습니다.
            </span>
          </label>

          {error && <p className="text-sm text-red-600">{error}</p>}
          {message && <p className="text-sm text-emerald-600">{message}</p>}

          <button
            type="submit"
            disabled={submitting}
            className="w-full btn-primary py-3 text-sm font-semibold disabled:opacity-50"
          >
            {verification?.status === "NEEDS_RESUBMISSION" ? "재제출하기" : "서류 제출하기"}
          </button>
        </form>
      )}

      {verification?.status === "IN_REVIEW" && (
        <div className="card p-4 text-center text-sm text-muted">
          <Icon name="clock" size={24} className="mx-auto mb-2 opacity-50" />
          서류 검수가 진행 중입니다. 완료 시 알림을 드립니다.
        </div>
      )}

      {verification?.status === "APPROVED" && (
        <div className="card p-4 text-center">
          <p className="text-sm font-semibold text-emerald-700">확인 절차가 완료되었습니다.</p>
          {verification.nextReviewDate && (
            <p className="text-xs text-muted mt-1">
              다음 재확인 예정일: {verification.nextReviewDate}
            </p>
          )}
        </div>
      )}
    </div>
  );
}
