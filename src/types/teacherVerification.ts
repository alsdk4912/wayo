export type VerificationStatus =
  | "NOT_SUBMITTED"
  | "SUBMITTED"
  | "IN_REVIEW"
  | "APPROVED"
  | "REJECTED"
  | "NEEDS_RESUBMISSION"
  | "EXPIRING_SOON"
  | "EXPIRED"
  | "SUSPENDED";

export type DocumentType =
  | "PASSPORT"
  | "ALIEN_REGISTRATION_CARD"
  | "VISA_DOCUMENT"
  | "WORK_ELIGIBILITY_DOCUMENT"
  | "CHILD_SAFETY_DOCUMENT"
  | "CRIMINAL_RECORD_RELATED_DOCUMENT"
  | "ETC";

export interface TeacherVerification {
  id: string;
  teacherId: number;
  status: VerificationStatus;
  nationality: string;
  visaType: string;
  visaExpiryDate: string;
  documentIssuedDate: string;
  submittedAt: string | null;
  reviewedAt: string | null;
  approvedAt: string | null;
  nextReviewDate: string | null;
  reviewerId: string | null;
  rejectionReason: string | null;
  resubmissionReason: string | null;
  adminMemo: string | null;
  additionalNote: string | null;
  consentAgreed: boolean;
  identityCheck: boolean;
  visaCheck: boolean;
  workEligibilityCheck: boolean;
  childSafetyCheck: boolean;
  documentReviewCheck: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface TeacherVerificationDocument {
  id: string;
  verificationId: string;
  teacherId: number;
  documentType: DocumentType;
  storageKey: string;
  originalFileName: string;
  mimeType: string;
  fileSize: number;
  uploadedAt: string;
  deletedAt: string | null;
  isDeleted: boolean;
}

export interface TeacherVerificationLog {
  id: string;
  verificationId: string;
  teacherId: number;
  actorId: string;
  fromStatus: VerificationStatus | null;
  toStatus: VerificationStatus;
  action: string;
  reason: string | null;
  createdAt: string;
}

export interface ParentVerificationSummary {
  teacherId: number;
  status: VerificationStatus;
  badgeLabel: string;
  identityVerified: boolean;
  visaVerified: boolean;
  childSafetyVerified: boolean;
  lastReviewedAt: string | null;
  nextReviewDate: string | null;
  disclaimer: string;
  summaryText: string | null;
}

export const REQUIRED_DOCUMENT_TYPES: DocumentType[] = [
  "PASSPORT",
  "ALIEN_REGISTRATION_CARD",
  "VISA_DOCUMENT",
  "WORK_ELIGIBILITY_DOCUMENT",
  "CHILD_SAFETY_DOCUMENT",
];

export const DOCUMENT_TYPE_LABELS: Record<DocumentType, string> = {
  PASSPORT: "여권 또는 신분 확인 서류",
  ALIEN_REGISTRATION_CARD: "외국인등록증 또는 거소증",
  VISA_DOCUMENT: "체류자격 정보 서류",
  WORK_ELIGIBILITY_DOCUMENT: "취업 가능 여부 확인 자료",
  CHILD_SAFETY_DOCUMENT: "아동 대상 활동 적합성 확인 서류",
  CRIMINAL_RECORD_RELATED_DOCUMENT: "성범죄·아동학대·범죄경력 관련 제출 확인서",
  ETC: "기타 서류",
};

export const VERIFICATION_STATUS_LABELS: Record<VerificationStatus, string> = {
  NOT_SUBMITTED: "미제출",
  SUBMITTED: "제출완료",
  IN_REVIEW: "검수중",
  APPROVED: "확인완료",
  REJECTED: "반려",
  NEEDS_RESUBMISSION: "보완요청",
  EXPIRING_SOON: "만료예정",
  EXPIRED: "만료",
  SUSPENDED: "활동제한",
};
