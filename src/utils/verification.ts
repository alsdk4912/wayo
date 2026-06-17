import type { Tutor } from "../data/tutors";

export function isBasicVerified(tutor: Tutor) {
  const b = tutor.verified.basic;
  return b.idCard && b.selfie && b.visa && b.affiliation;
}

export function isPremiumVerified(tutor: Tutor) {
  const p = tutor.verified.premium;
  return p.criminalRecord && p.safetyTraining;
}

export const BASIC_VERIFY_ITEMS = [
  { key: "idCard" as const, label: "신분증", short: "신분증" },
  { key: "selfie" as const, label: "셀카 얼굴인증", short: "얼굴인증" },
  { key: "visa" as const, label: "비자 확인", short: "비자" },
  { key: "affiliation" as const, label: "소속 확인", short: "소속" },
];

export const PREMIUM_VERIFY_ITEMS = [
  { key: "criminalRecord" as const, label: "본국 범죄경력증명", short: "범죄경력" },
  { key: "safetyTraining" as const, label: "아동안전교육 수료", short: "안전교육" },
];
