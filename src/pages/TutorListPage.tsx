import { useState } from "react";
import { getTutors } from "../data/tutors";
import { isTutorVisibleInSearch } from "../data/teacherVerification";
import TutorCard from "../components/TutorCard";
import { isPremiumVerified } from "../utils/verification";
import { coverageOf } from "../utils/distance";
import { placeById, PLACES } from "../data/places";
import { updateAccount } from "../data/users";
import { useAuth } from "../context/AuthContext";
import Icon from "../components/ui/Icon";

const specialtyOptions = ["전체", "미술", "놀이", "스포츠", "음악", "쿠킹", "코딩", "동화책"];
const sortOptions = [
  { value: "rating", label: "별점 높은 순" },
  { value: "price_asc", label: "가격 낮은 순" },
  { value: "price_desc", label: "가격 높은 순" },
  { value: "reviews", label: "후기 많은 순" },
];

export default function TutorListPage() {
  const { user, refreshUser } = useAuth();
  const [selectedSpecialty, setSelectedSpecialty] = useState("전체");
  const [sortBy, setSortBy] = useState("rating");
  const [premiumOnly, setPremiumOnly] = useState(false);
  const [areaId, setAreaId] = useState(user?.areaId ?? "");
  const point = placeById(areaId);

  const tutors = getTutors();

  const filtered = tutors
    .filter((t) => isTutorVisibleInSearch(t.id))
    .filter((t) => (point ? coverageOf(t, point).ok : false))
    .filter((t) => {
      if (selectedSpecialty !== "전체" && !t.specialties.some((s) => s.includes(selectedSpecialty))) return false;
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
    <div className="min-h-screen bg-background -mx-4 -mt-5">
      <div className="bg-white border-b border-border px-4 py-6">
        <h1 className="text-xl font-bold text-foreground mb-1">방문 가능한 선생님</h1>
        <p className="text-muted text-sm">{point ? `${placeById(areaId)?.district} ${placeById(areaId)?.label}에서 이동 범위가 닿는 선생님` : "수업 받을 동네를 선택하면 목록이 열립니다."}</p>
        <select
          value={areaId}
          onChange={(e) => {
            const next = e.target.value;
            setAreaId(next);
            const place = placeById(next);
            if (!user || !place) return;
            const updated = updateAccount(user.id, { areaId: next, address: user.address || `${place.district} ${place.label}` });
            if (updated) refreshUser(updated);
          }}
          className="mt-3 w-full border border-border rounded-2xl px-3 py-2.5 text-sm bg-white"
        >
          <option value="">동네 선택</option>
          {PLACES.map((place) => (
            <option key={place.id} value={place.id}>{place.district} {place.label}</option>
          ))}
        </select>
      </div>

      <div className="px-4 py-5">
        {/* Filters */}
        <div className="card p-4 mb-6">
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
            {/* Specialty Filter */}
            <div className="flex flex-col gap-2 w-full sm:w-auto">
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wide">특기 분야</span>
              <div className="flex flex-wrap gap-2">
                {specialtyOptions.map((spec) => (
                  <button
                    key={spec}
                    onClick={() => setSelectedSpecialty(spec)}
                    className={`px-3 py-1.5 rounded-lg text-sm font-medium border transition-colors ${
                      selectedSpecialty === spec
                        ? "bg-primary text-white border-primary"
                        : "bg-white text-muted border-border hover:border-primary/30"
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
              <TutorCard key={tutor.id} tutor={tutor} distanceKm={point ? coverageOf(tutor, point).km : null} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <Icon name="search" size={36} className="text-muted mx-auto mb-3 opacity-30" />
            <p className="text-muted font-medium text-sm">해당 조건의 강사가 없어요</p>
            <button
              onClick={() => { setSelectedSpecialty("전체"); setPremiumOnly(false); }}
              className="mt-4 text-blue-600 font-semibold text-sm hover:underline"
            >
              필터 초기화
            </button>
          </div>
        )}

        {/* Safety Banner */}
        <div className="mt-8 card p-5 flex items-start gap-3">
          <Icon name="shield" size={20} className="text-primary shrink-0 mt-0.5" />
          <div>
            <h3 className="font-semibold text-foreground text-sm mb-1">2단계 안심 인증</h3>
            <p className="text-muted text-xs leading-relaxed">
              모든 강사는 신분증·얼굴·비자·소속 기본 인증을 거칩니다. 프리미엄 인증 강사는 범죄경력증명·아동안전교육까지 완료했어요.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
