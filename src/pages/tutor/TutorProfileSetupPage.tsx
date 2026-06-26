import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { getTutorById, upsertTutorProfile } from "../../data/tutors";
import { attachTutorIdToAccount } from "../../data/users";

const SPECIALTY_OPTIONS = ["미술", "놀이", "스포츠", "음악", "쿠킹", "코딩", "동화책"];

export default function TutorProfileSetupPage() {
  const navigate = useNavigate();
  const { user, refreshUser } = useAuth();
  const existingTutor = getTutorById(user?.tutorId ?? 0);
  const [nameKo, setNameKo] = useState(existingTutor?.nameKo ?? "");
  const [affiliation, setAffiliation] = useState(existingTutor?.affiliation ?? "와요 신규 원어민 강사");
  const [role, setRole] = useState(existingTutor?.role ?? "아동 영어 놀이 강사");
  const [location, setLocation] = useState(existingTutor?.location ?? "서울");
  const [hourlyRate, setHourlyRate] = useState(existingTutor?.hourlyRate ?? 23000);
  const [intro, setIntro] = useState(existingTutor?.intro ?? "아이와 즐겁게 영어로 놀아요!");
  const [longIntro, setLongIntro] = useState(existingTutor?.longIntro ?? "학부모님 안녕하세요. 아이 성향에 맞춰 영어 놀이 수업을 진행합니다.");
  const [specialties, setSpecialties] = useState<string[]>(existingTutor?.specialties ?? ["놀이"]);
  const [idCardFile, setIdCardFile] = useState(existingTutor?.verificationDocs?.idCardFile ?? "");
  const [visaFile, setVisaFile] = useState(existingTutor?.verificationDocs?.visaFile ?? "");
  const [criminalRecordFile, setCriminalRecordFile] = useState(existingTutor?.verificationDocs?.criminalRecordFile ?? "");
  const [error, setError] = useState("");

  if (!user) return null;

  const toggleSpecialty = (value: string) => {
    setSpecialties((prev) => (
      prev.includes(value) ? prev.filter((item) => item !== value) : [...prev, value]
    ));
  };

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nameKo.trim() || specialties.length === 0) {
      setError("한글 이름과 전문 분야를 입력해주세요.");
      return;
    }
    const tutor = upsertTutorProfile(user, {
      nameKo,
      affiliation,
      role,
      location,
      specialties,
      hourlyRate,
      intro,
      longIntro,
      availableSlots: [
        { day: "월요일", slots: ["10:00", "14:00"] },
        { day: "수요일", slots: ["10:00", "14:00"] },
        { day: "토요일", slots: ["11:00", "15:00"] },
      ],
      verificationDocs: {
        idCardFile,
        visaFile,
        criminalRecordFile,
      },
    });
    const nextUser = attachTutorIdToAccount(user.id, tutor.id);
    if (nextUser) refreshUser(nextUser);
    navigate("/tutor", { replace: true });
  };

  return (
    <div className="space-y-4">
      <h1 className="text-xl font-black text-slate-900">원어민 프로필 등록</h1>
      <p className="text-sm text-slate-500">학부모에게 노출될 강사 프로필을 입력해주세요.</p>
      <form onSubmit={submit} className="space-y-3 bg-white rounded-2xl border border-slate-100 p-4">
        <input value={nameKo} onChange={(e) => setNameKo(e.target.value)} className="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm" placeholder="한글 이름 (예: 엠마 존슨)" />
        <input value={affiliation} onChange={(e) => setAffiliation(e.target.value)} className="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm" placeholder="소속/경력" />
        <input value={role} onChange={(e) => setRole(e.target.value)} className="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm" placeholder="전문 역할" />
        <input value={location} onChange={(e) => setLocation(e.target.value)} className="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm" placeholder="활동 지역" />
        <input type="number" min={10000} step={1000} value={hourlyRate} onChange={(e) => setHourlyRate(Number(e.target.value))} className="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm" placeholder="시간당 금액" />
        <textarea value={intro} onChange={(e) => setIntro(e.target.value)} className="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm" rows={2} placeholder="짧은 소개" />
        <textarea value={longIntro} onChange={(e) => setLongIntro(e.target.value)} className="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm" rows={4} placeholder="상세 소개" />

        <div>
          <p className="text-xs font-bold text-slate-500 mb-2">전문 분야</p>
          <div className="flex flex-wrap gap-2">
            {SPECIALTY_OPTIONS.map((option) => {
              const active = specialties.includes(option);
              return (
                <button
                  key={option}
                  type="button"
                  onClick={() => toggleSpecialty(option)}
                  className={`px-3 py-1.5 rounded-full text-xs font-semibold border ${active ? "bg-amber-100 border-amber-300 text-amber-800" : "bg-white border-slate-200 text-slate-500"}`}
                >
                  {option}
                </button>
              );
            })}
          </div>
        </div>

        <div className="rounded-xl border border-slate-200 p-3 space-y-2">
          <p className="text-xs font-bold text-slate-600">인증서류 업로드 (데모)</p>
          <label className="block text-xs text-slate-500">
            신분증 사본
            <input
              type="file"
              className="mt-1 block w-full text-xs"
              onChange={(e) => setIdCardFile(e.target.files?.[0]?.name ?? "")}
            />
          </label>
          {idCardFile && <p className="text-[11px] text-slate-500">업로드됨: {idCardFile}</p>}
          <label className="block text-xs text-slate-500">
            비자 증빙
            <input
              type="file"
              className="mt-1 block w-full text-xs"
              onChange={(e) => setVisaFile(e.target.files?.[0]?.name ?? "")}
            />
          </label>
          {visaFile && <p className="text-[11px] text-slate-500">업로드됨: {visaFile}</p>}
          <label className="block text-xs text-slate-500">
            범죄경력증명서 (선택)
            <input
              type="file"
              className="mt-1 block w-full text-xs"
              onChange={(e) => setCriminalRecordFile(e.target.files?.[0]?.name ?? "")}
            />
          </label>
          {criminalRecordFile && <p className="text-[11px] text-slate-500">업로드됨: {criminalRecordFile}</p>}
        </div>
        {error && <p className="text-xs text-red-500">{error}</p>}
        <button type="submit" className="w-full bg-blue-600 text-white font-bold py-3 rounded-xl">
          프로필 저장
        </button>
      </form>
    </div>
  );
}

