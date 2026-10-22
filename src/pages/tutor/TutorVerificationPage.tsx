import { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { getTutorById } from "../../data/tutors";
import {
  getTutorVerificationBadgeLabel,
  getVerificationByTeacherId,
  getDocuments,
  submitTeacherVerification,
} from "../../data/teacherVerification";
import {
  DOCUMENT_TYPE_LABELS_EN,
  REQUIRED_DOCUMENT_TYPES,
  VERIFICATION_STATUS_LABELS_EN,
  type DocumentType,
} from "../../types/teacherVerification";
import TeacherVerificationBadge from "../../components/TeacherVerificationBadge";
import Icon from "../../components/ui/Icon";

const ALL_DOC_TYPES: DocumentType[] = [
  ...REQUIRED_DOCUMENT_TYPES,
  "CRIMINAL_RECORD_RELATED_DOCUMENT",
  "ETC",
];

const ERROR_EN: Record<string, string> = {
  "검증 정보 활용 동의가 필요합니다.": "Please agree before submitting.",
  "필수 정보를 모두 입력해주세요.": "Fill in every required field.",
  "최소 1개 이상의 서류를 제출해주세요.": "Upload at least one document.",
  "검수중인 서류는 수정할 수 없습니다. 관리자 안내를 기다려주세요.": "Documents in review cannot be changed yet.",
};

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
        <p className="font-semibold text-foreground mb-2">Create your profile before uploading documents.</p>
        <Link to="/tutor/profile" className="btn-primary text-sm px-4 py-2.5 inline-flex">
          Create profile
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
        setError(ERROR_EN[result.message] ?? result.message);
      } else {
        setMessage("Submitted. Please wait for review.");
        window.location.reload();
      }
    } catch {
      setError("Could not read the file.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-xl font-black text-slate-900">Verification documents</h1>
        <p className="text-sm text-slate-500 mt-1">
          Lessons with young children need an ID check, stay status, work eligibility, and a child-activity suitability review.
        </p>
      </div>

      <div className="card p-4 flex items-center justify-between">
        <div>
          <p className="text-xs text-muted mb-1">Current status</p>
          <TeacherVerificationBadge
            status={verification?.status ?? "NOT_SUBMITTED"}
            label={getTutorVerificationBadgeLabel(verification?.status ?? "NOT_SUBMITTED")}
          />
          <p className="text-xs text-slate-500 mt-1">
            {VERIFICATION_STATUS_LABELS_EN[verification?.status ?? "NOT_SUBMITTED"]}
          </p>
        </div>
        {verification?.submittedAt && (
          <p className="text-xs text-slate-400">
            Submitted {verification.submittedAt.slice(0, 10)}
          </p>
        )}
      </div>

      {verification?.resubmissionReason && (
        <div className="rounded-xl border border-orange-200 bg-orange-50 p-4">
          <p className="text-xs font-bold text-orange-700 mb-1">Update requested</p>
          <p className="text-sm text-orange-900">{verification.resubmissionReason}</p>
        </div>
      )}
      {verification?.rejectionReason && (
        <div className="rounded-xl border border-red-200 bg-red-50 p-4">
          <p className="text-xs font-bold text-red-700 mb-1">Rejected</p>
          <p className="text-sm text-red-900">{verification.rejectionReason}</p>
        </div>
      )}

      {docs.length > 0 && (
        <div className="card p-4">
          <p className="text-sm font-semibold text-foreground mb-2">Uploaded files</p>
          <ul className="space-y-1">
            {docs.map((d) => (
              <li key={d.id} className="text-xs text-muted flex items-center gap-2">
                <Icon name="clipboard" size={14} />
                {DOCUMENT_TYPE_LABELS_EN[d.documentType]} — {d.originalFileName}
              </li>
            ))}
          </ul>
        </div>
      )}

      {canSubmit && canResubmit && (
        <form onSubmit={handleSubmit} className="card p-4 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <label className="block text-sm">
              <span className="text-xs font-semibold text-muted">Nationality</span>
              <input
                value={nationality}
                onChange={(e) => setNationality(e.target.value)}
                className="mt-1 w-full border border-border rounded-xl px-3 py-2 text-sm"
                placeholder="e.g. United States"
                required
              />
            </label>
            <label className="block text-sm">
              <span className="text-xs font-semibold text-muted">Status of stay</span>
              <input
                value={visaType}
                onChange={(e) => setVisaType(e.target.value)}
                className="mt-1 w-full border border-border rounded-xl px-3 py-2 text-sm"
                placeholder="e.g. E-2"
                required
              />
            </label>
            <label className="block text-sm">
              <span className="text-xs font-semibold text-muted">Stay expiry</span>
              <input
                type="date"
                value={visaExpiryDate}
                onChange={(e) => setVisaExpiryDate(e.target.value)}
                className="mt-1 w-full border border-border rounded-xl px-3 py-2 text-sm"
                required
              />
            </label>
            <label className="block text-sm">
              <span className="text-xs font-semibold text-muted">Document issue date</span>
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
            <p className="text-xs font-semibold text-muted mb-2">Documents</p>
            <div className="space-y-3">
              {ALL_DOC_TYPES.map((type) => (
                <label key={type} className="block rounded-xl border border-border p-3">
                  <span className="text-sm font-medium text-foreground">
                    {DOCUMENT_TYPE_LABELS_EN[type]}
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
                    <p className="text-[11px] text-muted mt-1">Selected: {uploads[type]!.name}</p>
                  )}
                </label>
              ))}
            </div>
          </div>

          <label className="block text-sm">
            <span className="text-xs font-semibold text-muted">Note</span>
            <textarea
              value={additionalNote}
              onChange={(e) => setAdditionalNote(e.target.value)}
              className="mt-1 w-full border border-border rounded-xl px-3 py-2 text-sm"
              rows={3}
              placeholder="Anything the reviewer should know"
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
              This information is used only to review tutor identity, stay status, and suitability for lessons with children. It is not published.
            </span>
          </label>

          {error && <p className="text-sm text-red-600">{error}</p>}
          {message && <p className="text-sm text-emerald-600">{message}</p>}

          <button
            type="submit"
            disabled={submitting}
            className="w-full btn-primary py-3 text-sm font-semibold disabled:opacity-50"
          >
            {verification?.status === "NEEDS_RESUBMISSION" ? "Submit again" : "Submit documents"}
          </button>
        </form>
      )}

      {verification?.status === "IN_REVIEW" && (
        <div className="card p-4 text-center text-sm text-muted">
          <Icon name="clock" size={24} className="mx-auto mb-2 opacity-50" />
          Your documents are in review.
        </div>
      )}

      {verification?.status === "APPROVED" && (
        <div className="card p-4 text-center">
          <p className="text-sm font-semibold text-emerald-700">Check complete.</p>
          {verification.nextReviewDate && (
            <p className="text-xs text-muted mt-1">
              Next review: {verification.nextReviewDate}
            </p>
          )}
        </div>
      )}
    </div>
  );
}
