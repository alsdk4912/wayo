import type {
  DocumentType,
  ParentVerificationSummary,
  TeacherVerification,
  TeacherVerificationDocument,
  TeacherVerificationLog,
  VerificationStatus,
} from "../types/teacherVerification";
import { REQUIRED_DOCUMENT_TYPES } from "../types/teacherVerification";

const VERIFICATION_KEY = "wayo_teacher_verifications";
const DOCUMENTS_KEY = "wayo_teacher_verification_documents";
const LOGS_KEY = "wayo_teacher_verification_logs";

const PARENT_DISCLAIMER =
  "플랫폼은 강사의 신원, 체류자격, 아동 대상 활동 적합성 확인 절차를 운영하고 있습니다. 단, 본 표시는 플랫폼의 서류 확인 절차 완료를 의미하며 절대적인 안전 보장을 의미하지 않습니다.";

function nowIso() {
  return new Date().toISOString();
}

function todayStr() {
  return new Date().toISOString().slice(0, 10);
}

function addDays(dateStr: string, days: number) {
  const d = new Date(dateStr);
  d.setDate(d.getDate() + days);
  return d.toISOString().slice(0, 10);
}

function daysUntil(dateStr: string) {
  const target = new Date(dateStr);
  const today = new Date(todayStr());
  return Math.ceil((target.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
}

function loadJson<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

function saveJson<T>(key: string, data: T) {
  localStorage.setItem(key, JSON.stringify(data));
}

/** 데모용 민감정보 마스킹 저장 (실서비스에서는 서버 측 암호화 필요) */
export function encryptSensitiveValue(value: string): string {
  if (!value) return "";
  return `enc:${btoa(unescape(encodeURIComponent(value)))}`;
}

export function decryptSensitiveValue(encrypted: string): string {
  if (!encrypted.startsWith("enc:")) return encrypted;
  try {
    return decodeURIComponent(escape(atob(encrypted.slice(4))));
  } catch {
    return "[복호화 불가]";
  }
}

function appendLog(entry: Omit<TeacherVerificationLog, "id" | "createdAt">) {
  const logs = loadJson<TeacherVerificationLog[]>(LOGS_KEY, []);
  logs.unshift({
    ...entry,
    id: `tvl-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    createdAt: nowIso(),
  });
  saveJson(LOGS_KEY, logs);
}

function createEmptyVerification(teacherId: number): TeacherVerification {
  const ts = nowIso();
  return {
    id: `tv-${teacherId}`,
    teacherId,
    status: "NOT_SUBMITTED",
    nationality: "",
    visaType: "",
    visaExpiryDate: "",
    documentIssuedDate: "",
    submittedAt: null,
    reviewedAt: null,
    approvedAt: null,
    nextReviewDate: null,
    reviewerId: null,
    rejectionReason: null,
    resubmissionReason: null,
    adminMemo: null,
    additionalNote: null,
    consentAgreed: false,
    identityCheck: false,
    visaCheck: false,
    workEligibilityCheck: false,
    childSafetyCheck: false,
    documentReviewCheck: false,
    createdAt: ts,
    updatedAt: ts,
  };
}

function seedApprovedVerification(teacherId: number, nationality: string, visaType: string): TeacherVerification {
  const today = todayStr();
  const ts = nowIso();
  return {
    id: `tv-${teacherId}`,
    teacherId,
    status: "APPROVED",
    nationality,
    visaType,
    visaExpiryDate: addDays(today, 400),
    documentIssuedDate: addDays(today, -30),
    submittedAt: addDays(today, -20) + "T10:00:00.000Z",
    reviewedAt: addDays(today, -15) + "T11:00:00.000Z",
    approvedAt: addDays(today, -15) + "T11:00:00.000Z",
    nextReviewDate: addDays(today, 180),
    reviewerId: "admin-1",
    rejectionReason: null,
    resubmissionReason: null,
    adminMemo: "데모 시드 데이터",
    additionalNote: null,
    consentAgreed: true,
    identityCheck: true,
    visaCheck: true,
    workEligibilityCheck: true,
    childSafetyCheck: true,
    documentReviewCheck: true,
    createdAt: ts,
    updatedAt: ts,
  };
}

const DEFAULT_VERIFICATIONS: TeacherVerification[] = [
  seedApprovedVerification(1, "미국", "E-2"),
  seedApprovedVerification(2, "미국", "E-2"),
  seedApprovedVerification(3, "캐나다", "E-2"),
  seedApprovedVerification(5, "호주", "E-2"),
  seedApprovedVerification(6, "미국", "E-2"),
  createEmptyVerification(4),
];

function getAllVerifications(): TeacherVerification[] {
  const stored = loadJson<TeacherVerification[] | null>(VERIFICATION_KEY, null);
  if (stored && stored.length > 0) return stored;
  saveJson(VERIFICATION_KEY, DEFAULT_VERIFICATIONS);
  return DEFAULT_VERIFICATIONS;
}

function saveVerifications(list: TeacherVerification[]) {
  saveJson(VERIFICATION_KEY, list);
}

export function getVerifications() {
  return getAllVerifications();
}

export function getVerificationByTeacherId(teacherId: number) {
  return getAllVerifications().find((v) => v.teacherId === teacherId) ?? null;
}

export function ensureVerificationRecord(teacherId: number) {
  const list = getAllVerifications();
  const existing = list.find((v) => v.teacherId === teacherId);
  if (existing) return existing;
  const created = createEmptyVerification(teacherId);
  saveVerifications([...list, created]);
  return created;
}

function flagTutorBookingsForReview(teacherId: number) {
  try {
    const raw = localStorage.getItem("wayo_bookings");
    if (!raw) return;
    const list = JSON.parse(raw) as { tutorId: number; status: string; needsVerificationReview?: boolean }[];
    const merged = list.map((b) =>
      b.tutorId === teacherId && b.status !== "cancelled" && b.status !== "completed"
        ? { ...b, needsVerificationReview: true }
        : b
    );
    localStorage.setItem("wayo_bookings", JSON.stringify(merged));
  } catch {
    /* ignore */
  }
}

function updateVerificationRecord(
  teacherId: number,
  updater: (current: TeacherVerification) => TeacherVerification,
  log?: { actorId: string; action: string; reason?: string | null }
) {
  const list = getAllVerifications();
  const idx = list.findIndex((v) => v.teacherId === teacherId);
  if (idx < 0) return null;
  const fromStatus = list[idx].status;
  const next = { ...updater(list[idx]), updatedAt: nowIso() };
  list[idx] = next;
  saveVerifications(list);
  if (log) {
    appendLog({
      verificationId: next.id,
      teacherId,
      actorId: log.actorId,
      fromStatus,
      toStatus: next.status,
      action: log.action,
      reason: log.reason ?? null,
    });
  }
  if (
    (next.status === "EXPIRED" || next.status === "SUSPENDED") &&
    fromStatus !== next.status
  ) {
    flagTutorBookingsForReview(teacherId);
  }
  return next;
}

export function getDocuments(verificationId?: string, teacherId?: number) {
  const docs = loadJson<TeacherVerificationDocument[]>(DOCUMENTS_KEY, []);
  return docs.filter((d) => {
    if (d.isDeleted) return false;
    if (verificationId && d.verificationId !== verificationId) return false;
    if (teacherId && d.teacherId !== teacherId) return false;
    return true;
  });
}

function saveDocuments(docs: TeacherVerificationDocument[]) {
  saveJson(DOCUMENTS_KEY, docs);
}

export function getVerificationLogs(verificationId: string) {
  return loadJson<TeacherVerificationLog[]>(LOGS_KEY, []).filter((l) => l.verificationId === verificationId);
}

export interface SubmitVerificationInput {
  nationality: string;
  visaType: string;
  visaExpiryDate: string;
  documentIssuedDate: string;
  additionalNote?: string;
  consentAgreed: boolean;
  documents: {
    documentType: DocumentType;
    fileName: string;
    mimeType: string;
    fileSize: number;
    contentBase64: string;
  }[];
}

export function submitTeacherVerification(teacherId: number, actorId: string, input: SubmitVerificationInput) {
  if (!input.consentAgreed) {
    return { ok: false as const, message: "검증 정보 활용 동의가 필요합니다." };
  }
  if (!input.nationality.trim() || !input.visaType.trim() || !input.visaExpiryDate || !input.documentIssuedDate) {
    return { ok: false as const, message: "필수 정보를 모두 입력해주세요." };
  }
  if (input.documents.length === 0) {
    return { ok: false as const, message: "최소 1개 이상의 서류를 제출해주세요." };
  }

  const record = ensureVerificationRecord(teacherId);
  if (record.status === "IN_REVIEW") {
    return { ok: false as const, message: "검수중인 서류는 수정할 수 없습니다. 관리자 안내를 기다려주세요." };
  }

  const verificationId = record.id;
  const allDocs = loadJson<TeacherVerificationDocument[]>(DOCUMENTS_KEY, []);
  const uploadedAt = nowIso();

  const newDocs: TeacherVerificationDocument[] = input.documents.map((doc) => ({
    id: `tvd-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    verificationId,
    teacherId,
    documentType: doc.documentType,
    storageKey: encryptSensitiveValue(doc.contentBase64),
    originalFileName: doc.fileName,
    mimeType: doc.mimeType,
    fileSize: doc.fileSize,
    uploadedAt,
    deletedAt: null,
    isDeleted: false,
  }));

  saveDocuments([...allDocs, ...newDocs]);

  const updated = updateVerificationRecord(
    teacherId,
    (v) => ({
      ...v,
      status: "SUBMITTED",
      nationality: input.nationality.trim(),
      visaType: input.visaType.trim(),
      visaExpiryDate: input.visaExpiryDate,
      documentIssuedDate: input.documentIssuedDate,
      additionalNote: input.additionalNote?.trim() || null,
      consentAgreed: true,
      submittedAt: uploadedAt,
      rejectionReason: null,
      resubmissionReason: null,
    }),
    { actorId, action: "SUBMIT", reason: "강사 서류 제출" }
  );

  return { ok: true as const, verification: updated! };
}

export function getDocumentForActor(documentId: string, actor: { id: string; role: "admin" | "tutor" }, teacherId?: number) {
  const docs = loadJson<TeacherVerificationDocument[]>(DOCUMENTS_KEY, []);
  const doc = docs.find((d) => d.id === documentId && !d.isDeleted);
  if (!doc) return null;
  if (actor.role === "admin") return doc;
  if (actor.role === "tutor" && teacherId === doc.teacherId && actor.id) return doc;
  return null;
}

export function softDeleteDocument(documentId: string, actorId: string) {
  const docs = loadJson<TeacherVerificationDocument[]>(DOCUMENTS_KEY, []);
  const idx = docs.findIndex((d) => d.id === documentId);
  if (idx < 0) return false;
  docs[idx] = { ...docs[idx], isDeleted: true, deletedAt: nowIso() };
  saveDocuments(docs);
  appendLog({
    verificationId: docs[idx].verificationId,
    teacherId: docs[idx].teacherId,
    actorId,
    fromStatus: null,
    toStatus: getVerificationByTeacherId(docs[idx].teacherId)?.status ?? "NOT_SUBMITTED",
    action: "DELETE_DOCUMENT",
    reason: docs[idx].originalFileName,
  });
  return true;
}

function hasRequiredDocuments(verificationId: string) {
  const docs = getDocuments(verificationId);
  const types = new Set(docs.map((d) => d.documentType));
  return REQUIRED_DOCUMENT_TYPES.every((t) => types.has(t));
}

function allChecksComplete(v: TeacherVerification) {
  return v.identityCheck && v.visaCheck && v.workEligibilityCheck && v.childSafetyCheck && v.documentReviewCheck;
}

export interface AdminReviewInput {
  identityCheck: boolean;
  visaCheck: boolean;
  workEligibilityCheck: boolean;
  childSafetyCheck: boolean;
  documentReviewCheck: boolean;
  adminMemo?: string;
  nextReviewDate?: string;
  reason?: string;
}

export function setVerificationInReview(teacherId: number, reviewerId: string) {
  const v = getVerificationByTeacherId(teacherId);
  if (!v) return { ok: false as const, message: "검증 기록이 없습니다." };
  if (!["SUBMITTED", "NEEDS_RESUBMISSION"].includes(v.status)) {
    return { ok: false as const, message: "검수중으로 변경할 수 없는 상태입니다." };
  }
  updateVerificationRecord(
    teacherId,
    (cur) => ({ ...cur, status: "IN_REVIEW", reviewerId, reviewedAt: nowIso() }),
    { actorId: reviewerId, action: "SET_IN_REVIEW" }
  );
  return { ok: true as const };
}

export function approveVerification(teacherId: number, reviewerId: string, input: AdminReviewInput) {
  const v = getVerificationByTeacherId(teacherId);
  if (!v) return { ok: false as const, message: "검증 기록이 없습니다." };
  if (v.visaExpiryDate && v.visaExpiryDate < todayStr()) {
    return { ok: false as const, message: "체류만료일이 현재일 이후여야 확인완료 처리할 수 있습니다." };
  }
  if (!hasRequiredDocuments(v.id)) {
    return { ok: false as const, message: "필수 서류가 모두 제출되어야 합니다." };
  }
  const checks = { ...v, ...input };
  if (!allChecksComplete(checks)) {
    return { ok: false as const, message: "항목별 확인 체크를 모두 완료해주세요." };
  }
  if (!input.nextReviewDate) {
    return { ok: false as const, message: "다음 재확인 예정일을 설정해주세요." };
  }

  const ts = nowIso();
  updateVerificationRecord(
    teacherId,
    (cur) => ({
      ...cur,
      status: "APPROVED",
      identityCheck: input.identityCheck,
      visaCheck: input.visaCheck,
      workEligibilityCheck: input.workEligibilityCheck,
      childSafetyCheck: input.childSafetyCheck,
      documentReviewCheck: input.documentReviewCheck,
      adminMemo: input.adminMemo?.trim() || cur.adminMemo,
      nextReviewDate: input.nextReviewDate!,
      reviewerId,
      reviewedAt: ts,
      approvedAt: ts,
      rejectionReason: null,
      resubmissionReason: null,
    }),
    { actorId: reviewerId, action: "APPROVE", reason: input.reason ?? null }
  );
  return { ok: true as const };
}

export function rejectVerification(teacherId: number, reviewerId: string, rejectionReason: string) {
  if (!rejectionReason.trim()) {
    return { ok: false as const, message: "반려 사유를 입력해주세요." };
  }
  updateVerificationRecord(
    teacherId,
    (cur) => ({
      ...cur,
      status: "REJECTED",
      rejectionReason: rejectionReason.trim(),
      reviewerId,
      reviewedAt: nowIso(),
    }),
    { actorId: reviewerId, action: "REJECT", reason: rejectionReason.trim() }
  );
  return { ok: true as const };
}

export function requestResubmission(teacherId: number, reviewerId: string, resubmissionReason: string) {
  if (!resubmissionReason.trim()) {
    return { ok: false as const, message: "보완 요청 사유를 입력해주세요." };
  }
  updateVerificationRecord(
    teacherId,
    (cur) => ({
      ...cur,
      status: "NEEDS_RESUBMISSION",
      resubmissionReason: resubmissionReason.trim(),
      reviewerId,
      reviewedAt: nowIso(),
    }),
    { actorId: reviewerId, action: "REQUEST_RESUBMISSION", reason: resubmissionReason.trim() }
  );
  return { ok: true as const };
}

export function suspendVerification(teacherId: number, reviewerId: string, reason: string) {
  updateVerificationRecord(
    teacherId,
    (cur) => ({
      ...cur,
      status: "SUSPENDED",
      adminMemo: reason.trim() || cur.adminMemo,
      reviewerId,
      reviewedAt: nowIso(),
    }),
    { actorId: reviewerId, action: "SUSPEND", reason: reason.trim() || null }
  );
  return { ok: true as const };
}

export function adminUpdateVerificationChecks(teacherId: number, reviewerId: string, input: AdminReviewInput) {
  updateVerificationRecord(
    teacherId,
    (cur) => ({
      ...cur,
      identityCheck: input.identityCheck,
      visaCheck: input.visaCheck,
      workEligibilityCheck: input.workEligibilityCheck,
      childSafetyCheck: input.childSafetyCheck,
      documentReviewCheck: input.documentReviewCheck,
      adminMemo: input.adminMemo?.trim() ?? cur.adminMemo,
      nextReviewDate: input.nextReviewDate ?? cur.nextReviewDate,
      reviewerId,
    }),
    { actorId: reviewerId, action: "UPDATE_CHECKS" }
  );
  return { ok: true as const };
}

/** 만료일 기준 상태 자동 갱신 (cron 대체 — 앱 로드·관리자 수동 실행) */
export function runVerificationExpiryJob() {
  const list = getAllVerifications();
  let updated = 0;
  const today = todayStr();

  const next = list.map((v) => {
    if (v.status === "SUSPENDED" || v.status === "REJECTED" || v.status === "NOT_SUBMITTED") return v;
    const expiry = v.visaExpiryDate || v.nextReviewDate;
    if (!expiry) return v;

    let newStatus = v.status;
    if (expiry < today) {
      if (v.status !== "EXPIRED") {
        newStatus = "EXPIRED";
        updated += 1;
        appendLog({
          verificationId: v.id,
          teacherId: v.teacherId,
          actorId: "system",
          fromStatus: v.status,
          toStatus: "EXPIRED",
          action: "AUTO_EXPIRE",
          reason: `만료일 ${expiry} 경과`,
        });
      }
    } else if (daysUntil(expiry) <= 30 && v.status === "APPROVED") {
      newStatus = "EXPIRING_SOON";
      updated += 1;
      appendLog({
          verificationId: v.id,
          teacherId: v.teacherId,
          actorId: "system",
          fromStatus: v.status,
          toStatus: "EXPIRING_SOON",
        action: "AUTO_EXPIRING_SOON",
        reason: `만료 30일 이내 (${expiry})`,
      });
    }
    return newStatus === v.status ? v : { ...v, status: newStatus, updatedAt: nowIso() };
  });

  if (updated > 0) saveVerifications(next);
  return { updated, total: list.length };
}

export function canTutorAcceptMatching(teacherId: number): { ok: boolean; message?: string } {
  runVerificationExpiryJob();
  const v = getVerificationByTeacherId(teacherId);
  if (!v) {
    return { ok: false, message: "검증 절차가 완료되지 않은 강사입니다. (미제출)" };
  }
  if (v.status !== "APPROVED") {
    const label = {
      NOT_SUBMITTED: "검증 준비중",
      SUBMITTED: "서류 검수 대기",
      IN_REVIEW: "서류 검수중",
      REJECTED: "검증 반려",
      NEEDS_RESUBMISSION: "서류 보완 필요",
      EXPIRED: "검증 만료",
      SUSPENDED: "활동 제한",
      EXPIRING_SOON: "",
      APPROVED: "",
    }[v.status];
    return { ok: false, message: `현재 이 강사는 신규 매칭·예약이 제한됩니다. (${label})` };
  }
  return { ok: true };
}

export function isTutorVisibleInSearch(teacherId: number) {
  runVerificationExpiryJob();
  const v = getVerificationByTeacherId(teacherId);
  if (!v) return true;
  return v.status !== "SUSPENDED";
}

export function getParentVerificationBadgeLabel(status: VerificationStatus): string {
  switch (status) {
    case "NOT_SUBMITTED":
      return "검증 준비중";
    case "SUBMITTED":
    case "IN_REVIEW":
      return "서류 검수중";
    case "APPROVED":
      return "확인 절차 완료";
    case "EXPIRING_SOON":
      return "재확인 필요";
    case "EXPIRED":
      return "검증 만료";
    case "SUSPENDED":
      return "매칭 제한";
    case "REJECTED":
    case "NEEDS_RESUBMISSION":
      return "검증 준비중";
    default:
      return "검증 준비중";
  }
}

export function getParentVerificationSummary(teacherId: number): ParentVerificationSummary {
  runVerificationExpiryJob();
  const v = getVerificationByTeacherId(teacherId);
  const status = v?.status ?? "NOT_SUBMITTED";
  const approved = status === "APPROVED";

  return {
    teacherId,
    status,
    badgeLabel: getParentVerificationBadgeLabel(status),
    identityVerified: approved && !!v?.identityCheck,
    visaVerified: approved && !!v?.visaCheck,
    childSafetyVerified: approved && !!v?.childSafetyCheck,
    lastReviewedAt: v?.reviewedAt ?? v?.approvedAt ?? null,
    nextReviewDate: v?.nextReviewDate ?? null,
    disclaimer: PARENT_DISCLAIMER,
    summaryText: approved
      ? "이 강사는 플랫폼의 신원 및 체류자격 확인 절차를 완료했습니다."
      : status === "EXPIRING_SOON"
        ? "이 강사의 확인 절차 재확인이 예정되어 있습니다."
        : null,
  };
}

/** 테스트 시나리오 자가 검증 */
export function runTeacherVerificationSelfTests() {
  const errors: string[] = [];
  const assert = (cond: boolean, msg: string) => { if (!cond) errors.push(msg); };

  const testTeacherId = 9999;
  ensureVerificationRecord(testTeacherId);
  let v = getVerificationByTeacherId(testTeacherId)!;
  assert(v.status === "NOT_SUBMITTED", "초기 상태 NOT_SUBMITTED");

  const submit = submitTeacherVerification(testTeacherId, "tutor-test", {
    nationality: "영국",
    visaType: "E-2",
    visaExpiryDate: addDays(todayStr(), 365),
    documentIssuedDate: todayStr(),
    consentAgreed: true,
    documents: REQUIRED_DOCUMENT_TYPES.map((documentType, i) => ({
      documentType,
      fileName: `doc-${i}.pdf`,
      mimeType: "application/pdf",
      fileSize: 100,
      contentBase64: "dGVzdA==",
    })),
  });
  assert(submit.ok, "제출 성공");
  v = getVerificationByTeacherId(testTeacherId)!;
  assert(v.status === "SUBMITTED", "제출 후 SUBMITTED");

  setVerificationInReview(testTeacherId, "admin-test");
  v = getVerificationByTeacherId(testTeacherId)!;
  assert(v.status === "IN_REVIEW", "검수중 IN_REVIEW");

  const failApprove = approveVerification(testTeacherId, "admin-test", {
    identityCheck: false,
    visaCheck: false,
    workEligibilityCheck: false,
    childSafetyCheck: false,
    documentReviewCheck: false,
  });
  assert(!failApprove.ok, "체크 미완료 시 승인 불가");

  approveVerification(testTeacherId, "admin-test", {
    identityCheck: true,
    visaCheck: true,
    workEligibilityCheck: true,
    childSafetyCheck: true,
    documentReviewCheck: true,
    nextReviewDate: addDays(todayStr(), 90),
  });
  v = getVerificationByTeacherId(testTeacherId)!;
  assert(v.status === "APPROVED", "승인 APPROVED");
  assert(!!v.approvedAt && !!v.reviewerId, "approvedAt·reviewerId 저장");

  assert(!rejectVerification(testTeacherId, "admin-test", "").ok, "반려 사유 필수");
  assert(!requestResubmission(testTeacherId, "admin-test", "").ok, "보완 사유 필수");

  const parentSummary = getParentVerificationSummary(testTeacherId);
  assert(parentSummary.disclaimer.includes("절대적인 안전 보장"), "보호자 면책 문구");

  const logs = getVerificationLogs(v.id);
  assert(logs.length > 0, "상태 변경 로그");

  assert(!canTutorAcceptMatching(4).ok, "미승인 강사 매칭 불가");

  return { pass: errors.length === 0, errors };
}
