import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { getTutorById } from "../../data/tutors";
import {
  adminUpdateVerificationChecks,
  approveVerification,
  decryptSensitiveValue,
  getDocumentForActor,
  getDocuments,
  getVerificationByTeacherId,
  getVerificationLogs,
  rejectVerification,
  requestResubmission,
  setVerificationInReview,
  softDeleteDocument,
  suspendVerification,
} from "../../data/teacherVerification";
import {
  DOCUMENT_TYPE_LABELS,
  VERIFICATION_STATUS_LABELS,
} from "../../types/teacherVerification";
import TeacherVerificationBadge from "../../components/TeacherVerificationBadge";

function formatDt(iso: string | null) {
  if (!iso) return "-";
  return iso.replace("T", " ").slice(0, 16);
}

export default function AdminVerificationDetailPage() {
  const { teacherId } = useParams();
  const { user } = useAuth();
  const id = Number(teacherId);
  const tutor = getTutorById(id);
  const verification = getVerificationByTeacherId(id);
  const docs = verification ? getDocuments(verification.id) : [];
  const logs = verification ? getVerificationLogs(verification.id) : [];

  const [checks, setChecks] = useState({
    identityCheck: verification?.identityCheck ?? false,
    visaCheck: verification?.visaCheck ?? false,
    workEligibilityCheck: verification?.workEligibilityCheck ?? false,
    childSafetyCheck: verification?.childSafetyCheck ?? false,
    documentReviewCheck: verification?.documentReviewCheck ?? false,
  });
  const [adminMemo, setAdminMemo] = useState(verification?.adminMemo ?? "");
  const [nextReviewDate, setNextReviewDate] = useState(verification?.nextReviewDate ?? "");
  const [rejectionReason, setRejectionReason] = useState("");
  const [resubmissionReason, setResubmissionReason] = useState("");
  const [suspendReason, setSuspendReason] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  if (!tutor || !verification || !user) {
    return (
      <div>
        <p className="text-slate-500">검증 정보를 찾을 수 없습니다.</p>
        <Link to="/admin/verifications" className="text-primary text-sm mt-2 inline-block">
          목록으로
        </Link>
      </div>
    );
  }

  const reviewerId = user.id;
  const refresh = () => window.location.reload();

  const saveChecks = () => {
    adminUpdateVerificationChecks(id, reviewerId, {
      ...checks,
      adminMemo,
      nextReviewDate: nextReviewDate || undefined,
    });
    setMessage("검수 정보가 저장되었습니다.");
  };

  const handleInReview = () => {
    const r = setVerificationInReview(id, reviewerId);
    if (!r.ok) setError(r.message);
    else refresh();
  };

  const handleApprove = () => {
    saveChecks();
    const r = approveVerification(id, reviewerId, {
      ...checks,
      adminMemo,
      nextReviewDate,
    });
    if (!r.ok) setError(r.message);
    else refresh();
  };

  const handleReject = () => {
    const r = rejectVerification(id, reviewerId, rejectionReason);
    if (!r.ok) setError(r.message);
    else refresh();
  };

  const handleResubmit = () => {
    const r = requestResubmission(id, reviewerId, resubmissionReason);
    if (!r.ok) setError(r.message);
    else refresh();
  };

  const handleSuspend = () => {
    suspendVerification(id, reviewerId, suspendReason);
    refresh();
  };

  const downloadDoc = (documentId: string) => {
    const doc = getDocumentForActor(documentId, { id: user.id, role: "admin" });
    if (!doc) {
      setError("파일에 접근할 수 없습니다.");
      return;
    }
    const content = decryptSensitiveValue(doc.storageKey);
    const link = document.createElement("a");
    link.href = `data:${doc.mimeType};base64,${content}`;
    link.download = doc.originalFileName;
    link.click();
  };

  return (
    <div className="space-y-6 max-w-4xl">
      <Link to="/admin/verifications" className="text-sm text-primary font-medium">
        ← 검증 목록
      </Link>

      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
        <div className="flex items-center gap-3">
          <img src={tutor.photo} alt="" className="w-14 h-14 rounded-2xl object-cover" />
          <div>
            <h1 className="text-2xl font-black text-slate-900">{tutor.name}</h1>
            <p className="text-sm text-slate-500">{tutor.nameKo}</p>
            <div className="mt-2 flex items-center gap-2">
              <TeacherVerificationBadge status={verification.status} />
              <span className="text-xs text-muted">
                {VERIFICATION_STATUS_LABELS[verification.status]}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-sm">
        <div className="bg-white rounded-xl border p-3">
          <p className="text-xs text-muted">국적</p>
          <p className="font-semibold">{verification.nationality || "-"}</p>
        </div>
        <div className="bg-white rounded-xl border p-3">
          <p className="text-xs text-muted">체류자격</p>
          <p className="font-semibold">{verification.visaType || "-"}</p>
        </div>
        <div className="bg-white rounded-xl border p-3">
          <p className="text-xs text-muted">체류만료일</p>
          <p className="font-semibold">{verification.visaExpiryDate || "-"}</p>
        </div>
        <div className="bg-white rounded-xl border p-3">
          <p className="text-xs text-muted">제출일</p>
          <p className="font-semibold">{formatDt(verification.submittedAt)}</p>
        </div>
      </div>

      {verification.additionalNote && (
        <div className="bg-slate-50 rounded-xl p-4 text-sm">
          <p className="text-xs font-bold text-muted mb-1">강사 메모</p>
          <p>{verification.additionalNote}</p>
        </div>
      )}

      <section className="bg-white rounded-2xl border p-5 space-y-3">
        <h2 className="font-bold text-slate-900">제출 서류</h2>
        {docs.length === 0 ? (
          <p className="text-sm text-muted">제출된 서류가 없습니다.</p>
        ) : (
          <ul className="space-y-2">
            {docs.map((doc) => (
              <li
                key={doc.id}
                className="flex flex-wrap items-center justify-between gap-2 rounded-xl border border-slate-100 p-3 text-sm"
              >
                <div>
                  <p className="font-medium">{DOCUMENT_TYPE_LABELS[doc.documentType]}</p>
                  <p className="text-xs text-muted">
                    {doc.originalFileName} · {(doc.fileSize / 1024).toFixed(1)}KB · {formatDt(doc.uploadedAt)}
                  </p>
                </div>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => downloadDoc(doc.id)}
                    className="text-xs font-semibold bg-primary text-white px-3 py-1.5 rounded-lg"
                  >
                    다운로드
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      softDeleteDocument(doc.id, reviewerId);
                      refresh();
                    }}
                    className="text-xs font-semibold bg-slate-100 text-slate-600 px-3 py-1.5 rounded-lg"
                  >
                    삭제
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section className="bg-white rounded-2xl border p-5 space-y-4">
        <h2 className="font-bold text-slate-900">항목별 확인</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {[
            { key: "identityCheck" as const, label: "신분 확인" },
            { key: "visaCheck" as const, label: "체류자격 확인" },
            { key: "workEligibilityCheck" as const, label: "취업 가능 여부 확인" },
            { key: "childSafetyCheck" as const, label: "아동 대상 활동 적합성 확인" },
            { key: "documentReviewCheck" as const, label: "서류 검수 확인" },
          ].map((item) => (
            <label key={item.key} className="flex items-center gap-2 text-sm cursor-pointer">
              <input
                type="checkbox"
                checked={checks[item.key]}
                onChange={(e) => setChecks((prev) => ({ ...prev, [item.key]: e.target.checked }))}
              />
              {item.label}
            </label>
          ))}
        </div>

        <label className="block text-sm">
          <span className="text-xs font-semibold text-muted">다음 재확인 예정일</span>
          <input
            type="date"
            value={nextReviewDate}
            onChange={(e) => setNextReviewDate(e.target.value)}
            className="mt-1 w-full border border-border rounded-xl px-3 py-2 text-sm max-w-xs"
          />
        </label>

        <label className="block text-sm">
          <span className="text-xs font-semibold text-muted">관리자 메모</span>
          <textarea
            value={adminMemo}
            onChange={(e) => setAdminMemo(e.target.value)}
            className="mt-1 w-full border border-border rounded-xl px-3 py-2 text-sm"
            rows={3}
          />
        </label>

        <button
          type="button"
          onClick={saveChecks}
          className="text-xs font-semibold bg-slate-100 text-slate-700 px-4 py-2 rounded-xl"
        >
          검수 정보 저장
        </button>
      </section>

      <section className="bg-white rounded-2xl border p-5 space-y-4">
        <h2 className="font-bold text-slate-900">검수 처리</h2>
        {error && <p className="text-sm text-red-600">{error}</p>}
        {message && <p className="text-sm text-emerald-600">{message}</p>}

        <div className="flex flex-wrap gap-2">
          <button type="button" onClick={handleInReview} className="btn-primary text-xs px-4 py-2">
            검수중으로 변경
          </button>
          <button
            type="button"
            onClick={handleApprove}
            className="text-xs font-semibold bg-emerald-600 text-white px-4 py-2 rounded-xl"
          >
            확인완료 처리
          </button>
          <button
            type="button"
            onClick={handleResubmit}
            className="text-xs font-semibold bg-orange-500 text-white px-4 py-2 rounded-xl"
          >
            보완요청 처리
          </button>
          <button
            type="button"
            onClick={handleReject}
            className="text-xs font-semibold bg-red-600 text-white px-4 py-2 rounded-xl"
          >
            반려 처리
          </button>
          <button
            type="button"
            onClick={handleSuspend}
            className="text-xs font-semibold bg-slate-800 text-white px-4 py-2 rounded-xl"
          >
            활동제한 처리
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <label className="block text-sm">
            <span className="text-xs font-semibold text-muted">보완 요청 사유</span>
            <input
              value={resubmissionReason}
              onChange={(e) => setResubmissionReason(e.target.value)}
              className="mt-1 w-full border border-border rounded-xl px-3 py-2 text-sm"
            />
          </label>
          <label className="block text-sm">
            <span className="text-xs font-semibold text-muted">반려 사유</span>
            <input
              value={rejectionReason}
              onChange={(e) => setRejectionReason(e.target.value)}
              className="mt-1 w-full border border-border rounded-xl px-3 py-2 text-sm"
            />
          </label>
          <label className="block text-sm sm:col-span-2">
            <span className="text-xs font-semibold text-muted">활동제한 사유</span>
            <input
              value={suspendReason}
              onChange={(e) => setSuspendReason(e.target.value)}
              className="mt-1 w-full border border-border rounded-xl px-3 py-2 text-sm"
            />
          </label>
        </div>
      </section>

      <section className="bg-white rounded-2xl border p-5">
        <h2 className="font-bold text-slate-900 mb-3">검수 이력</h2>
        {logs.length === 0 ? (
          <p className="text-sm text-muted">이력이 없습니다.</p>
        ) : (
          <ul className="space-y-2 text-sm">
            {logs.map((log) => (
              <li key={log.id} className="border-b border-slate-50 pb-2">
                <p className="font-medium">
                  {log.action}
                  {log.fromStatus && ` (${log.fromStatus} → ${log.toStatus})`}
                </p>
                <p className="text-xs text-muted">
                  {formatDt(log.createdAt)} · 검수자 {log.actorId}
                  {log.reason && ` · ${log.reason}`}
                </p>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
