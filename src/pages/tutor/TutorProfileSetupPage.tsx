import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { getTutorById, upsertTutorProfile } from "../../data/tutors";
import { attachTutorIdToAccount } from "../../data/users";
import { PLACES, placeById } from "../../data/places";

const RADII = [1, 2, 5, 10];

const SPECIALTY_OPTIONS = [
  { value: "미술", label: "Art" },
  { value: "놀이", label: "Play" },
  { value: "스포츠", label: "Sports" },
  { value: "음악", label: "Music" },
  { value: "쿠킹", label: "Cooking" },
  { value: "코딩", label: "Coding" },
  { value: "동화책", label: "Stories" },
];

export default function TutorProfileSetupPage() {
  const navigate = useNavigate();
  const { user, refreshUser } = useAuth();
  const existingTutor = getTutorById(user?.tutorId ?? 0);
  const [nameKo, setNameKo] = useState(existingTutor?.nameKo ?? "");
  const [affiliation, setAffiliation] = useState(existingTutor?.affiliation ?? "New Wayo tutor");
  const [role, setRole] = useState(existingTutor?.role ?? "Children's English play teacher");
  const [location, setLocation] = useState(existingTutor?.location ?? "서울 마포구");
  const [areaId, setAreaId] = useState(user?.areaId ?? "mangwon");
  const [radiusKm, setRadiusKm] = useState(existingTutor?.serviceRadiusKm ?? 5);
  const [hourlyRate, setHourlyRate] = useState(existingTutor?.hourlyRate ?? 23000);
  const [intro, setIntro] = useState(existingTutor?.intro ?? "Let's play and learn English together.");
  const [longIntro, setLongIntro] = useState(existingTutor?.longIntro ?? "Hello, I plan English play sessions around each child's pace.");
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
      setError("Add a Korean name and at least one specialty.");
      return;
    }
    const place = placeById(areaId);
    const tutor = upsertTutorProfile(user, {
      nameKo,
      affiliation,
      role,
      location: place ? `${place.district} ${place.label}` : location,
      lat: place?.lat,
      lng: place?.lng,
      serviceRadiusKm: radiusKm,
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
      <h1 className="text-xl font-black text-slate-900">Tutor profile</h1>
      <p className="text-sm text-slate-500">This is what parents see when they look for a teacher.</p>
      <form onSubmit={submit} className="space-y-3 bg-white rounded-2xl border border-slate-100 p-4">
        <input value={nameKo} onChange={(e) => setNameKo(e.target.value)} className="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm" placeholder="Korean name (e.g. 엠마 존슨)" />
        <input value={affiliation} onChange={(e) => setAffiliation(e.target.value)} className="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm" placeholder="Affiliation" />
        <input value={role} onChange={(e) => setRole(e.target.value)} className="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm" placeholder="Role" />
        <div>
          <p className="text-xs font-bold text-slate-500 mb-2">Home base</p>
          <select
            value={areaId}
            onChange={(e) => {
              setAreaId(e.target.value);
              const place = placeById(e.target.value);
              if (place) setLocation(`${place.district} ${place.label}`);
            }}
            className="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm"
          >
            {PLACES.map((place) => (
              <option key={place.id} value={place.id}>{place.district} {place.label}</option>
            ))}
          </select>
        </div>
        <div>
          <p className="text-xs font-bold text-slate-500 mb-2">Travel range · {radiusKm} km</p>
          <div className="relative mx-auto w-40 h-40 my-3">
            {[10, 5, 2, 1].map((km) => (
              <span
                key={km}
                className={`absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full border ${radiusKm >= km ? "border-primary/50 bg-primary/5" : "border-slate-200"}`}
                style={{ width: `${km * 10}%`, height: `${km * 10}%` }}
              />
            ))}
            <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-primary" />
          </div>
          <div className="grid grid-cols-4 gap-2">
            {RADII.map((km) => (
              <button
                key={km}
                type="button"
                onClick={() => setRadiusKm(km)}
                className={`py-2 rounded-full text-xs font-semibold border ${radiusKm === km ? "bg-primary text-white border-primary" : "bg-white border-slate-200 text-slate-500"}`}
              >
                {km} km
              </button>
            ))}
          </div>
          <p className="text-[11px] text-slate-500 mt-2">Parents and groups inside this circle can request a visit.</p>
        </div>
        <input type="number" min={10000} step={1000} value={hourlyRate} onChange={(e) => setHourlyRate(Number(e.target.value))} className="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm" placeholder="Hourly rate (KRW)" />
        <textarea value={intro} onChange={(e) => setIntro(e.target.value)} className="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm" rows={2} placeholder="Short intro" />
        <textarea value={longIntro} onChange={(e) => setLongIntro(e.target.value)} className="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm" rows={4} placeholder="Longer intro" />

        <div>
          <p className="text-xs font-bold text-slate-500 mb-2">Specialties</p>
          <div className="flex flex-wrap gap-2">
            {SPECIALTY_OPTIONS.map((option) => {
              const active = specialties.includes(option.value);
              return (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => toggleSpecialty(option.value)}
                  className={`px-3 py-1.5 rounded-full text-xs font-semibold border ${active ? "bg-amber-100 border-amber-300 text-amber-800" : "bg-white border-slate-200 text-slate-500"}`}
                >
                  {option.label}
                </button>
              );
            })}
          </div>
        </div>

        <div className="rounded-xl border border-slate-200 p-3 space-y-2">
          <p className="text-xs font-bold text-slate-600">Document names (demo)</p>
          <label className="block text-xs text-slate-500">
            ID copy
            <input
              type="file"
              className="mt-1 block w-full text-xs"
              onChange={(e) => setIdCardFile(e.target.files?.[0]?.name ?? "")}
            />
          </label>
          {idCardFile && <p className="text-[11px] text-slate-500">Selected: {idCardFile}</p>}
          <label className="block text-xs text-slate-500">
            Stay document
            <input
              type="file"
              className="mt-1 block w-full text-xs"
              onChange={(e) => setVisaFile(e.target.files?.[0]?.name ?? "")}
            />
          </label>
          {visaFile && <p className="text-[11px] text-slate-500">Selected: {visaFile}</p>}
          <label className="block text-xs text-slate-500">
            Child safety document (optional)
            <input
              type="file"
              className="mt-1 block w-full text-xs"
              onChange={(e) => setCriminalRecordFile(e.target.files?.[0]?.name ?? "")}
            />
          </label>
          {criminalRecordFile && <p className="text-[11px] text-slate-500">Selected: {criminalRecordFile}</p>}
        </div>
        {error && <p className="text-xs text-red-500">{error}</p>}
        <button type="submit" className="w-full bg-blue-600 text-white font-bold py-3 rounded-xl">
          Save profile
        </button>
      </form>
    </div>
  );
}

