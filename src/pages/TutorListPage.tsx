import { useState } from "react";
import { tutors } from "../data/tutors";
import TutorCard from "../components/TutorCard";

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
  const [verifiedOnly, setVerifiedOnly] = useState(false);

  const filtered = tutors
    .filter((t) => {
      if (selectedSpecialty !== "전체") {
        if (!t.specialties.some((s) => s.includes(selectedSpecialty))) return false;
      }
      if (verifiedOnly) {
        if (!t.verified.visa || !t.verified.criminalCheck || !t.verified.safetyTraining) return false;
      }
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
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10">
          <h1 className="text-3xl font-black mb-2">검증된 튜터 찾기</h1>
          <p className="text-blue-100">
            모든 튜터는 비자·범죄이력·안전교육 3단계 검증을 거쳤어요
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
                  onClick={() => setVerifiedOnly(!verifiedOnly)}
                  className={`w-10 h-6 rounded-full transition-colors relative ${
                    verifiedOnly ? "bg-emerald-500" : "bg-slate-200"
                  }`}
                >
                  <span
                    className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow transition-transform ${
                      verifiedOnly ? "translate-x-5" : "translate-x-1"
                    }`}
                  />
                </div>
                <span className="text-sm font-medium text-slate-600">전체 인증만 보기</span>
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
              onClick={() => { setSelectedSpecialty("전체"); setVerifiedOnly(false); }}
              className="mt-4 text-blue-600 font-semibold text-sm hover:underline"
            >
              필터 초기화
            </button>
          </div>
        )}

        {/* Safety Banner */}
        <div className="mt-12 bg-gradient-to-r from-emerald-50 to-blue-50 border border-emerald-100 rounded-2xl p-6">
          <div className="flex items-start gap-4">
            <span className="text-3xl mt-0.5">🛡️</span>
            <div>
              <h3 className="font-bold text-slate-800 mb-1">안심하고 이용하세요</h3>
              <p className="text-slate-600 text-sm leading-relaxed">
                와요의 모든 튜터는 등록 전 <strong>비자 확인 → 범죄이력 조회 → 안전교육 이수</strong>의 3단계 검증을 통과합니다.
                간호사 출신 운영자가 직접 서류를 심사하며, 안전교육 미이수 튜터는 별도로 표시됩니다.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
