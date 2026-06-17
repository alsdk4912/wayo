import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { tutors } from "../data/tutors";
import { isBasicVerified, isPremiumVerified } from "../utils/verification";

const MONTH_NAMES = ["1월", "2월", "3월", "4월", "5월", "6월", "7월", "8월", "9월", "10월", "11월", "12월"];
const DAY_NAMES = ["일", "월", "화", "수", "목", "금", "토"];

function getCalendarDays(year: number, month: number) {
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const days: (number | null)[] = Array(firstDay).fill(null);
  for (let d = 1; d <= daysInMonth; d++) days.push(d);
  return days;
}

const dayIndexMap: Record<string, number> = {
  일요일: 0, 월요일: 1, 화요일: 2, 수요일: 3, 목요일: 4, 금요일: 5, 토요일: 6,
};

// 세션 패키지
const PACKAGES = [
  {
    id: "trial",
    label: "1회 체험권",
    desc: "부담 없이 첫 만남",
    sessions: 1,
    discount: 0,
    badge: null,
  },
  {
    id: "monthly4",
    label: "월 4회 정기권",
    desc: "주 1회 꾸준히",
    sessions: 4,
    discount: 5,
    badge: "인기",
  },
  {
    id: "monthly8",
    label: "월 8회 정기권",
    desc: "주 2회 집중 케어",
    sessions: 8,
    discount: 10,
    badge: "최고 효과",
  },
];

// SVG 아이콘
function CheckCircleIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
    </svg>
  );
}
function QuoteIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
    </svg>
  );
}

const basicVerifyConfig = [
  { key: "idCard" as const, label: "신분증 인증", desc: "유효 신분증으로 본인 확인", emoji: "🪪" },
  { key: "selfie" as const, label: "셀카 얼굴인증", desc: "실시간 얼굴 매칭 인증", emoji: "🤳" },
  { key: "visa" as const, label: "비자 확인", desc: "합법적 활동 가능 비자 소지", emoji: "🛂" },
  { key: "affiliation" as const, label: "소속 확인", desc: "와요 공인 강사 소속 검증", emoji: "🏢" },
];

const premiumVerifyConfig = [
  { key: "criminalRecord" as const, label: "본국 범죄경력증명", desc: "출신국 범죄경력 증명서 제출", emoji: "📋" },
  { key: "safetyTraining" as const, label: "아동안전교육 수료", desc: "아동 안전·응급처치 교육 이수", emoji: "🩺" },
];

function StarRow({ rating, size = "text-base" }: { rating: number; size?: string }) {
  return (
    <span className="flex">
      {[1, 2, 3, 4, 5].map((i) => (
        <span key={i} className={`${size} ${i <= rating ? "text-amber-400" : "text-slate-200"}`}>★</span>
      ))}
    </span>
  );
}

export default function TutorDetailPage() {
  const { id } = useParams();
  const tutor = tutors.find((t) => t.id === Number(id));

  const today = new Date();
  const [calYear, setCalYear] = useState(today.getFullYear());
  const [calMonth, setCalMonth] = useState(today.getMonth());
  const [selectedDay, setSelectedDay] = useState<number | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [selectedPackage, setSelectedPackage] = useState("monthly4");
  const [bookingStep, setBookingStep] = useState<"select" | "confirm" | "done">("select");

  if (!tutor) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-5xl mb-4">😕</div>
          <p className="text-slate-600 font-medium mb-4">튜터를 찾을 수 없어요</p>
          <Link to="/parent/tutors" className="text-blue-600 font-semibold hover:underline">
            강사 목록으로 돌아가기
          </Link>
        </div>
      </div>
    );
  }

  const calDays = getCalendarDays(calYear, calMonth);
  const availableDayIndices = new Set(tutor.availableSlots.map((s) => dayIndexMap[s.day]));
  const selectedDayName = selectedDay !== null
    ? DAY_NAMES[new Date(calYear, calMonth, selectedDay).getDay()] + "요일"
    : null;
  const availableTimesForDay = selectedDayName
    ? tutor.availableSlots.find((s) => s.day === selectedDayName)?.slots ?? []
    : [];
  const isPastDay = (d: number) => {
    const date = new Date(calYear, calMonth, d);
    return date < new Date(today.getFullYear(), today.getMonth(), today.getDate());
  };

  const pkg = PACKAGES.find((p) => p.id === selectedPackage)!;
  const basePrice = tutor.hourlyRate * pkg.sessions;
  const discountAmt = Math.round(basePrice * pkg.discount / 100);
  const finalPrice = basePrice - discountAmt;
  const kgPrice = 1500000; // 영어유치원 월 비용 기준

  // 별점 분포 계산
  const ratingDist = [5, 4, 3, 2, 1].map((star) => ({
    star,
    count: tutor.reviews.filter((r) => r.rating === star).length,
  }));
  const maxCount = Math.max(...ratingDist.map((r) => r.count), 1);

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Breadcrumb */}
      <div className="bg-white border-b border-slate-100">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-3">
          <nav className="flex items-center gap-2 text-sm text-slate-400">
            <Link to="/parent" className="hover:text-blue-600">홈</Link>
            <span>/</span>
            <Link to="/parent/tutors" className="hover:text-blue-600">강사 찾기</Link>
            <span>/</span>
            <span className="text-slate-700 font-medium">{tutor.name}</span>
          </nav>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* ═══════════ LEFT ═══════════ */}
          <div className="lg:col-span-2 space-y-6">

            {/* ① 프로필 헤더 */}
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
              <div className="h-28 bg-gradient-to-r from-blue-600 to-blue-400" />
              <div className="px-6 pb-6">
                <div className="flex items-end gap-4 -mt-14 mb-4">
                  <img
                    src={tutor.photo}
                    alt={tutor.name}
                    className="w-24 h-24 rounded-2xl border-4 border-white shadow-lg object-cover"
                  />
                  <div className="mb-1 flex-1">
                    <div className="flex items-start justify-between flex-wrap gap-2">
                      <div>
                        <h1 className="text-2xl font-black text-slate-800">{tutor.name}</h1>
                        <p className="text-blue-600 font-semibold text-sm">{tutor.nameKo}</p>
                        <p className="text-slate-400 text-sm">{tutor.affiliation} · {tutor.role}</p>
                      </div>
                      <div className="flex items-center gap-1.5 bg-amber-50 border border-amber-200 px-3 py-1.5 rounded-xl">
                        <span className="text-amber-400 text-lg">★</span>
                        <span className="font-black text-slate-800">{tutor.rating}</span>
                        <span className="text-slate-400 text-xs">({tutor.reviewCount}개)</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-2 mb-4 text-sm text-slate-500">
                  <span>📍 {tutor.location}</span>
                  <span className="text-slate-200">|</span>
                  <span className="font-bold text-blue-600 text-base">₩{tutor.hourlyRate.toLocaleString()}/시간</span>
                </div>

                <div className="flex flex-wrap gap-2 mb-2">
                  {tutor.specialties.map((s) => (
                    <span key={s} className="bg-amber-50 text-amber-700 border border-amber-200 text-sm font-semibold px-3 py-1 rounded-full">{s}</span>
                  ))}
                  {tutor.tags.slice(0, 3).map((t) => (
                    <span key={t} className="bg-blue-50 text-blue-600 border border-blue-100 text-xs font-medium px-2.5 py-1 rounded-full">#{t}</span>
                  ))}
                </div>
              </div>
            </div>

            {/* ② 2단계 안심 인증 */}
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
              <div className="px-6 py-4 border-b border-slate-50 flex items-center justify-between">
                <div>
                  <p className="font-black text-slate-900">🛡️ 안심 인증 배지</p>
                  <p className="text-slate-400 text-xs mt-0.5">기본 인증 필수 · 프리미엄 인증 선택</p>
                </div>
                {isPremiumVerified(tutor) ? (
                  <span className="text-xs font-bold bg-amber-100 text-amber-700 px-3 py-1.5 rounded-full">⭐ 프리미엄 인증</span>
                ) : isBasicVerified(tutor) ? (
                  <span className="text-xs font-bold bg-blue-100 text-blue-700 px-3 py-1.5 rounded-full">✓ 기본 인증</span>
                ) : null}
              </div>
              <div className="p-6 space-y-5">
                <div>
                  <p className="text-xs font-bold text-blue-600 uppercase tracking-wide mb-3">기본 인증 (가입 필수)</p>
                  <div className="grid grid-cols-2 gap-2">
                    {basicVerifyConfig.map(({ key, label, desc, emoji }) => {
                      const ok = tutor.verified.basic[key];
                      return (
                        <div key={key} className={`rounded-xl p-3 border ${ok ? "bg-blue-50 border-blue-100" : "bg-slate-50 border-slate-100 opacity-50"}`}>
                          <div className="flex items-center gap-2 mb-1">
                            <span>{emoji}</span>
                            <span className="text-sm font-bold text-slate-800">{label}</span>
                            {ok && <span className="text-xs text-blue-600 font-bold ml-auto">✓</span>}
                          </div>
                          <p className="text-xs text-slate-500">{desc}</p>
                        </div>
                      );
                    })}
                  </div>
                </div>
                <div>
                  <p className="text-xs font-bold text-amber-600 uppercase tracking-wide mb-3">프리미엄 인증 (선택 · 더 높은 신뢰)</p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {premiumVerifyConfig.map(({ key, label, desc, emoji }) => {
                      const ok = tutor.verified.premium[key];
                      return (
                        <div key={key} className={`rounded-xl p-3 border ${ok ? "bg-amber-50 border-amber-100" : "bg-slate-50 border-slate-100"}`}>
                          <div className="flex items-center gap-2 mb-1">
                            <span>{emoji}</span>
                            <span className="text-sm font-bold text-slate-800">{label}</span>
                            {ok ? (
                              <span className="text-xs text-amber-600 font-bold ml-auto">✓ 완료</span>
                            ) : (
                              <span className="text-xs text-slate-400 font-medium ml-auto">준비 중</span>
                            )}
                          </div>
                          <p className="text-xs text-slate-500">{desc}</p>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>

            {/* ③ 소개글 */}
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
              <h2 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
                <span>👋</span> 튜터 소개
              </h2>
              <p className="text-slate-600 leading-relaxed">{tutor.longIntro}</p>
              <div className="mt-5 grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm border-t border-slate-50 pt-5">
                <div>
                  <p className="font-bold text-slate-400 text-xs uppercase tracking-wide mb-1.5">경력</p>
                  <p className="text-slate-700">{tutor.experience}</p>
                </div>
                <div>
                  <p className="font-bold text-slate-400 text-xs uppercase tracking-wide mb-1.5">사용 언어</p>
                  <div className="flex flex-wrap gap-1.5">
                    {tutor.languages.map((l) => (
                      <span key={l} className="bg-blue-50 text-blue-700 text-xs px-2.5 py-1 rounded-full border border-blue-100">{l}</span>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* ④ 학부모 후기 — 핵심 섹션 (id anchor for scroll) */}
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
              {/* 헤더 */}
              <div className="px-6 pt-6 pb-5 border-b border-slate-50">
                <h2 className="text-lg font-black text-slate-800 mb-4 flex items-center gap-2">
                  <span>💬</span> 학부모 후기
                  <span className="bg-blue-600 text-white text-xs font-bold px-2 py-0.5 rounded-full ml-1">{tutor.reviewCount}</span>
                </h2>

                {/* 별점 요약 */}
                <div className="flex items-center gap-6 flex-wrap">
                  {/* 평균 점수 */}
                  <div className="text-center">
                    <div className="text-5xl font-black text-slate-800 leading-none">{tutor.rating}</div>
                    <StarRow rating={Math.round(tutor.rating)} size="text-lg" />
                    <p className="text-xs text-slate-400 mt-1">{tutor.reviewCount}개 후기</p>
                  </div>
                  {/* 분포 바 */}
                  <div className="flex-1 space-y-1.5 min-w-40">
                    {ratingDist.map(({ star, count }) => (
                      <div key={star} className="flex items-center gap-2 text-xs">
                        <span className="text-amber-400 w-3 text-right font-bold">{star}</span>
                        <span className="text-amber-400 text-xs">★</span>
                        <div className="flex-1 h-2 bg-slate-100 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-amber-400 rounded-full transition-all"
                            style={{ width: `${(count / maxCount) * 100}%` }}
                          />
                        </div>
                        <span className="text-slate-400 w-3 text-right">{count}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* 후기 목록 */}
              <div className="divide-y divide-slate-50">
                {tutor.reviews.map((review, idx) => (
                  <div key={review.id} className={`p-6 ${idx === 0 ? "bg-blue-50/30" : ""}`}>
                    {/* 추천 후기 레이블 */}
                    {idx === 0 && (
                      <div className="inline-flex items-center gap-1 bg-blue-600 text-white text-xs font-bold px-2.5 py-1 rounded-full mb-3">
                        ✨ 추천 후기
                      </div>
                    )}

                    <div className="flex items-start gap-3">
                      <img
                        src={review.avatar}
                        alt={review.parentName}
                        className="w-11 h-11 rounded-full object-cover flex-shrink-0 border-2 border-white shadow"
                      />
                      <div className="flex-1">
                        {/* 작성자 정보 */}
                        <div className="flex items-center justify-between flex-wrap gap-2 mb-1">
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-slate-800 text-sm">{review.parentName}</span>
                            <span className="bg-slate-100 text-slate-500 text-xs font-medium px-2 py-0.5 rounded-full">
                              {review.childrenDesc}
                            </span>
                          </div>
                          <span className="text-slate-400 text-xs">{review.date}</span>
                        </div>

                        {/* 별점 */}
                        <div className="flex items-center gap-2 mb-3">
                          <StarRow rating={review.rating} size="text-base" />
                          <span className="font-bold text-slate-600 text-sm">{review.rating}.0</span>
                        </div>

                        {/* 하이라이트 인용문 */}
                        <div className="flex items-start gap-2 bg-white border border-blue-100 rounded-xl p-3 mb-3">
                          <QuoteIcon className="w-4 h-4 text-blue-300 flex-shrink-0 mt-0.5" />
                          <p className="text-blue-700 font-semibold text-sm leading-relaxed">
                            {review.highlight}
                          </p>
                        </div>

                        {/* 본문 */}
                        <p className="text-slate-600 text-sm leading-relaxed mb-3">{review.content}</p>

                        {/* 키워드 태그 */}
                        <div className="flex flex-wrap gap-1.5">
                          {review.keywords.map((kw) => (
                            <span key={kw} className="bg-amber-50 text-amber-700 border border-amber-100 text-xs font-medium px-2.5 py-1 rounded-full">
                              #{kw}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* 후기 하단 안내 */}
              <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex items-center gap-2 text-sm text-slate-500">
                <CheckCircleIcon className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                모든 후기는 실제 세션을 완료한 학부모님이 작성했습니다.
              </div>
            </div>
          </div>

          {/* ═══════════ RIGHT — 예약/결제 ═══════════ */}
          <div className="space-y-4">
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden sticky top-24">

              {bookingStep === "done" ? (
                /* ── 예약 완료 화면 ── */
                <div className="p-6 text-center">
                  <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <CheckCircleIcon className="w-9 h-9 text-emerald-500" />
                  </div>
                  <h3 className="font-black text-slate-800 text-lg mb-1">예약 요청 완료!</h3>
                  <p className="text-slate-500 text-sm mb-4">
                    {calYear}년 {MONTH_NAMES[calMonth]} {selectedDay}일<br />
                    {selectedTime} · {pkg.label}
                  </p>
                  <div className="bg-blue-50 rounded-xl p-4 text-left mb-4">
                    <p className="text-blue-800 text-xs font-bold mb-1">📱 다음 단계</p>
                    <p className="text-blue-600 text-xs leading-relaxed">
                      튜터에게 예약 알림이 전송됩니다.<br />
                      24시간 내 카카오톡으로 확정 연락이 옵니다.<br />
                      직거래로 진행되며 수수료는 없어요.
                    </p>
                  </div>
                  <button
                    onClick={() => { setBookingStep("select"); setSelectedDay(null); setSelectedTime(null); }}
                    className="text-blue-600 text-sm font-semibold hover:underline"
                  >
                    다른 날 예약하기
                  </button>
                </div>
              ) : bookingStep === "confirm" ? (
                /* ── 결제 확인 화면 ── */
                <div className="p-5">
                  <button onClick={() => setBookingStep("select")} className="flex items-center gap-1 text-slate-400 text-sm mb-4 hover:text-blue-600">
                    ← 뒤로가기
                  </button>
                  <h3 className="font-black text-slate-800 mb-4">예약 확인</h3>

                  <div className="space-y-3 text-sm mb-5">
                    <div className="flex justify-between items-center py-2 border-b border-slate-50">
                      <span className="text-slate-500">튜터</span>
                      <span className="font-semibold text-slate-800">{tutor.name} ({tutor.nameKo})</span>
                    </div>
                    <div className="flex justify-between items-center py-2 border-b border-slate-50">
                      <span className="text-slate-500">날짜 · 시간</span>
                      <span className="font-semibold text-slate-800">{calMonth + 1}월 {selectedDay}일 {selectedTime}</span>
                    </div>
                    <div className="flex justify-between items-center py-2 border-b border-slate-50">
                      <span className="text-slate-500">패키지</span>
                      <span className="font-semibold text-slate-800">{pkg.label} ({pkg.sessions}회)</span>
                    </div>
                    {pkg.discount > 0 && (
                      <div className="flex justify-between items-center py-2 border-b border-slate-50">
                        <span className="text-slate-500">할인 ({pkg.discount}%)</span>
                        <span className="font-semibold text-emerald-600">-₩{discountAmt.toLocaleString()}</span>
                      </div>
                    )}
                    <div className="flex justify-between items-center py-2">
                      <span className="font-bold text-slate-800">결제 예정 금액</span>
                      <span className="font-black text-blue-600 text-lg">₩{finalPrice.toLocaleString()}</span>
                    </div>
                  </div>

                  <div className="bg-amber-50 border border-amber-100 rounded-xl p-3 mb-4 text-xs text-amber-800">
                    <p className="font-bold mb-0.5">💛 직거래 안내</p>
                    결제는 첫 세션 전날까지 튜터에게 직접 계좌이체로 진행돼요. 와요 수수료 ₩0.
                  </div>

                  <button
                    onClick={() => setBookingStep("done")}
                    className="w-full py-4 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-black text-base shadow-lg hover:shadow-xl transition-all"
                  >
                    예약 확정하기
                  </button>
                  <p className="text-center text-xs text-slate-400 mt-2">첫 세션 24시간 전까지 무료 취소 가능</p>
                </div>
              ) : (
                /* ── 메인 예약 선택 화면 ── */
                <>
                  {/* 패키지 선택 */}
                  <div className="p-5 border-b border-slate-100">
                    <h2 className="text-sm font-bold text-slate-700 mb-3 flex items-center gap-2">
                      <span>📦</span> 세션 패키지 선택
                    </h2>
                    <div className="space-y-2">
                      {PACKAGES.map((p) => {
                        const pBase = tutor.hourlyRate * p.sessions;
                        const pDiscount = Math.round(pBase * p.discount / 100);
                        const pFinal = pBase - pDiscount;
                        const isSelected = selectedPackage === p.id;
                        return (
                          <button
                            key={p.id}
                            onClick={() => setSelectedPackage(p.id)}
                            className={`w-full flex items-center justify-between rounded-xl border p-3 text-left transition-all ${
                              isSelected
                                ? "border-blue-500 bg-blue-50"
                                : "border-slate-200 bg-white hover:border-blue-200"
                            }`}
                          >
                            <div className="flex items-center gap-2">
                              <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${isSelected ? "border-blue-500" : "border-slate-300"}`}>
                                {isSelected && <div className="w-2 h-2 rounded-full bg-blue-500" />}
                              </div>
                              <div>
                                <div className="flex items-center gap-1.5">
                                  <span className={`text-sm font-bold ${isSelected ? "text-blue-700" : "text-slate-700"}`}>{p.label}</span>
                                  {p.badge && (
                                    <span className="bg-amber-400 text-slate-900 text-xs font-black px-1.5 py-0.5 rounded-full leading-none">{p.badge}</span>
                                  )}
                                </div>
                                <span className="text-xs text-slate-400">{p.desc}</span>
                              </div>
                            </div>
                            <div className="text-right">
                              {p.discount > 0 && (
                                <p className="text-xs text-slate-400 line-through">₩{pBase.toLocaleString()}</p>
                              )}
                              <p className={`text-sm font-black ${isSelected ? "text-blue-700" : "text-slate-700"}`}>
                                ₩{pFinal.toLocaleString()}
                              </p>
                              {p.discount > 0 && (
                                <p className="text-xs text-emerald-600 font-semibold">{p.discount}% 할인</p>
                              )}
                            </div>
                          </button>
                        );
                      })}
                    </div>

                    {(selectedPackage === "monthly4" || selectedPackage === "monthly8") && (
                      <div className="mt-3 bg-indigo-50 border border-indigo-100 rounded-xl p-3">
                        <p className="text-xs font-bold text-indigo-700 mb-2">✨ 월정기권 프리미엄 혜택 포함</p>
                        <div className="grid grid-cols-2 gap-1.5 text-[11px] text-indigo-600 font-medium">
                          {["활동 후 사진", "활동일지 자동생성", "실시간 위치 공유", "AI 놀이영어 리포트"].map((f) => (
                            <span key={f}>✓ {f}</span>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* 영어유치원 비교 */}
                    <div className="mt-3 bg-slate-50 rounded-xl p-3 text-xs text-slate-500 flex items-center justify-between">
                      <span>영어유치원 월 비용</span>
                      <div className="text-right">
                        <p className="line-through text-slate-400">₩{kgPrice.toLocaleString()}</p>
                        <p className="text-emerald-600 font-bold">와요 {Math.round((1 - finalPrice / kgPrice) * 100)}% 절약</p>
                      </div>
                    </div>
                  </div>

                  {/* 캘린더 */}
                  <div className="p-5 border-b border-slate-100">
                    <h2 className="text-sm font-bold text-slate-700 mb-3 flex items-center gap-2">
                      <span>📅</span> 날짜 선택
                    </h2>
                    <div className="flex items-center justify-between mb-3">
                      <button onClick={() => {
                        if (calMonth === 0) { setCalMonth(11); setCalYear(calYear - 1); }
                        else setCalMonth(calMonth - 1);
                        setSelectedDay(null); setSelectedTime(null);
                      }} className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-slate-100 text-slate-500 font-bold text-lg">‹</button>
                      <span className="font-bold text-slate-700 text-sm">{calYear}년 {MONTH_NAMES[calMonth]}</span>
                      <button onClick={() => {
                        if (calMonth === 11) { setCalMonth(0); setCalYear(calYear + 1); }
                        else setCalMonth(calMonth + 1);
                        setSelectedDay(null); setSelectedTime(null);
                      }} className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-slate-100 text-slate-500 font-bold text-lg">›</button>
                    </div>
                    <div className="grid grid-cols-7 mb-1">
                      {DAY_NAMES.map((d, i) => (
                        <div key={d} className={`text-center text-xs font-bold py-1 ${i === 0 ? "text-red-400" : i === 6 ? "text-blue-400" : "text-slate-400"}`}>{d}</div>
                      ))}
                    </div>
                    <div className="grid grid-cols-7 gap-0.5">
                      {calDays.map((day, i) => {
                        if (!day) return <div key={`e-${i}`} />;
                        const dow = new Date(calYear, calMonth, day).getDay();
                        const isAvail = availableDayIndices.has(dow) && !isPastDay(day);
                        const isSel = selectedDay === day;
                        const isPast = isPastDay(day);
                        return (
                          <button
                            key={day}
                            disabled={!isAvail}
                            onClick={() => { setSelectedDay(day); setSelectedTime(null); }}
                            className={`h-8 w-full text-xs rounded-lg font-semibold transition-colors ${
                              isSel ? "bg-blue-600 text-white shadow" :
                              isAvail ? "bg-blue-50 text-blue-700 hover:bg-blue-100 hover:shadow-sm" :
                              isPast ? "text-slate-200 cursor-not-allowed" :
                              "text-slate-300 cursor-not-allowed"
                            }`}
                          >{day}</button>
                        );
                      })}
                    </div>
                    <div className="flex items-center gap-3 mt-2 text-xs text-slate-400">
                      <span className="flex items-center gap-1"><span className="w-3 h-3 rounded bg-blue-100 border border-blue-300 inline-block" /> 예약가능</span>
                      <span className="flex items-center gap-1"><span className="w-3 h-3 rounded bg-blue-600 inline-block" /> 선택됨</span>
                    </div>
                  </div>

                  {/* 시간 선택 */}
                  <div className="p-5 border-b border-slate-100">
                    <h2 className="text-sm font-bold text-slate-700 mb-3 flex items-center gap-2">
                      <span>⏰</span> 시간 선택
                      {selectedDay && <span className="text-slate-400 font-normal text-xs">({calMonth + 1}월 {selectedDay}일)</span>}
                    </h2>
                    {!selectedDay ? (
                      <p className="text-slate-400 text-xs py-2">날짜를 먼저 선택해주세요</p>
                    ) : availableTimesForDay.length === 0 ? (
                      <p className="text-slate-400 text-xs py-2">이 날은 가능한 시간이 없어요</p>
                    ) : (
                      <div className="grid grid-cols-3 gap-2">
                        {availableTimesForDay.map((time) => (
                          <button
                            key={time}
                            onClick={() => setSelectedTime(time)}
                            className={`py-2 rounded-xl text-sm font-bold border transition-all ${
                              selectedTime === time
                                ? "bg-blue-600 text-white border-blue-600 shadow"
                                : "bg-white text-slate-600 border-slate-200 hover:border-blue-400 hover:text-blue-600"
                            }`}
                          >{time}</button>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* CTA 버튼 영역 */}
                  <div className="p-5">
                    {selectedDay && selectedTime && (
                      <div className="bg-slate-50 rounded-xl p-3 mb-3 text-xs space-y-1">
                        <div className="flex justify-between text-slate-500">
                          <span>{pkg.label} · {pkg.sessions}회</span>
                          <span>₩{basePrice.toLocaleString()}</span>
                        </div>
                        {pkg.discount > 0 && (
                          <div className="flex justify-between text-emerald-600 font-semibold">
                            <span>정기권 {pkg.discount}% 할인</span>
                            <span>-₩{discountAmt.toLocaleString()}</span>
                          </div>
                        )}
                        <div className="flex justify-between font-black text-slate-800 text-sm border-t border-slate-200 pt-1 mt-1">
                          <span>합계</span>
                          <span>₩{finalPrice.toLocaleString()}</span>
                        </div>
                      </div>
                    )}

                    <button
                      disabled={!selectedDay || !selectedTime}
                      onClick={() => setBookingStep("confirm")}
                      className={`w-full py-4 rounded-xl font-black text-base transition-all ${
                        selectedDay && selectedTime
                          ? "bg-amber-400 hover:bg-amber-300 text-slate-900 shadow-lg hover:shadow-xl hover:-translate-y-0.5"
                          : "bg-slate-100 text-slate-400 cursor-not-allowed"
                      }`}
                    >
                      {selectedDay && selectedTime
                        ? `예약하기 · ₩${finalPrice.toLocaleString()}`
                        : "날짜와 시간을 선택해주세요"}
                    </button>

                    <div className="flex items-center justify-center gap-4 mt-3 text-xs text-slate-400">
                      <span className="flex items-center gap-1">
                        <CheckCircleIcon className="w-3.5 h-3.5 text-emerald-500" />
                        수수료 ₩0
                      </span>
                      <span className="flex items-center gap-1">
                        <CheckCircleIcon className="w-3.5 h-3.5 text-emerald-500" />
                        24시간 무료 취소
                      </span>
                    </div>
                  </div>
                </>
              )}
            </div>

            {/* 안심 보장 카드 */}
            <div className="bg-gradient-to-br from-blue-600 to-blue-700 rounded-2xl p-5 text-white">
              <p className="font-black text-sm mb-3">🛡️ 와요 안심 보장</p>
              <ul className="space-y-2 text-xs text-blue-100">
                <li className="flex items-start gap-2">
                  <CheckCircleIcon className="w-4 h-4 text-blue-300 flex-shrink-0 mt-0.5" />
                  신분증·얼굴·비자·소속 기본 인증 완료 강사만 등록
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircleIcon className="w-4 h-4 text-blue-300 flex-shrink-0 mt-0.5" />
                  월정기권 구독 시 활동사진·일지·위치·AI 리포트 제공
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircleIcon className="w-4 h-4 text-blue-300 flex-shrink-0 mt-0.5" />
                  수수료 0원, 강사와 직접 거래
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
