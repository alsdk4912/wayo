import { useState } from "react";
import { tutors } from "../data/tutors";
import TutorCard from "../components/TutorCard";
import { isPremiumVerified } from "../utils/verification";

const specialtyOptions = ["전체", "미술", "놀이", "스포츠", "음악", "쿠킹", "코딩", "동화책"];
const sortOptions = [
  { value: "rating", label: "별점 높은 순" },
  { value: "price_asc", label: "가격 낮은 순" },
  { value: "price_desc", label: "가격 높은 순" },
  { value: "reviews", label: "후기 많은 순" },
];

export default function TutorListPage() {
  const [selectedSpecialty, setSelectedSpecialty] = useState("전체");
  const [sortBy, setSortBy] = useState("rating");
  const [premiumOnly, setPremiumOnly] = useState(false);

  const filtered = tutors
    .filter((t) => {
      if (selectedSpecialty !== "전체") {
        if (!t.specialties.some((s) => s.includes(selectedSpecialty))) return false;
      }
      if (premiumOnly && !isPremiumVerified(t)) return false;
      return true;
    })
    .sort((a, b) => {
      if (sortBy === "rating") return b.rating - a.rating;
      if (sortBy === "price_asc") return a.hourlyRate - b.hourlyRate;
      if (sortBy === "price_desc") return b.hourlyRate - a.hourlyRate;
      if (sortBy === "reviews") return b.reviewCount - a.reviewCount;
      return 0;
    });

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Page Header */}
      <div className="bg-slate-900 text-white">
        <div className="max-w-5xl mx-auto px-5 py-10">
          <h1 className="text-3xl font-black mb-2">검증된 원어민 강사</h1>
          <p className="text-slate-400 text-sm">
            기본 인증 4종 완료 강사 · 프리미엄 인증은 더 높은 안심 수준
          </p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
        {/* Filters */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 mb-8">
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
            {/* Specialty Filter */}
            <div className="flex flex-col gap-2 w-full sm:w-auto">
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wide">특기 분야</span>
              <div className="flex flex-wrap gap-2">
                {specialtyOptions.map((spec) => (
                  <button
                    key={spec}
                    onClick={() => setSelectedSpecialty(spec)}
                    className={`px-3.5 py-1.5 rounded-full text-sm font-medium border transition-colors ${
                      selectedSpecialty === spec
                        ? "bg-blue-600 text-white border-blue-600"
                        : "bg-white text-slate-600 border-slate-200 hover:border-blue-300 hover:text-blue-600"
                    }`}
                  >
                    {spec}
                  </button>
                ))}
              </div>
            </div>

            {/* Sort + Verified */}
            <div className="flex items-center gap-3 flex-wrap">
              <label className="flex items-center gap-2 cursor-pointer select-none">
                <div
                  onClick={() => setPremiumOnly(!premiumOnly)}
                  className={`w-10 h-6 rounded-full transition-colors relative ${
                    premiumOnly ? "bg-amber-500" : "bg-slate-200"
                  }`}
                >
                  <span
                    className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow transition-transform ${
                      premiumOnly ? "translate-x-5" : "translate-x-1"
                    }`}
                  />
                </div>
                <span className="text-sm font-medium text-slate-600">프리미엄 인증만</span>
              </label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="border border-slate-200 rounded-xl text-sm text-slate-600 px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-blue-300"
              >
                {sortOptions.map((o) => (
                  <option key={o.value} value={o.value}>{o.label}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Result Count */}
        <div className="flex items-center justify-between mb-5">
          <p className="text-slate-500 text-sm">
            <span className="font-bold text-slate-700">{filtered.length}명</span>의 튜터를 찾았어요
          </p>
        </div>

        {/* Tutor Grid */}
        {filtered.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((tutor) => (
              <TutorCard key={tutor.id} tutor={tutor} />
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <div className="text-5xl mb-4">🔍</div>
            <p className="text-slate-500 font-medium">해당 조건의 튜터가 없어요</p>
            <button
              onClick={() => { setSelectedSpecialty("전체"); setPremiumOnly(false); }}
              className="mt-4 text-blue-600 font-semibold text-sm hover:underline"
            >
              필터 초기화
            </button>
          </div>
        )}

        {/* Safety Banner */}
        <div className="mt-12 bg-blue-50 border border-blue-100 rounded-2xl p-6">
          <div className="flex items-start gap-4">
            <span className="text-2xl">🛡️</span>
            <div>
              <h3 className="font-bold text-slate-800 mb-1">2단계 안심 인증</h3>
              <p className="text-slate-600 text-sm leading-relaxed">
                모든 강사는 <strong>신분증·얼굴·비자·소속</strong> 기본 인증을 거칩니다.
                프리미엄 인증 강사는 <strong>본국 범죄경력증명·아동안전교육</strong>까지 완료했어요.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
