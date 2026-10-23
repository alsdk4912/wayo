import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { createPlayGroup } from "../../data/playGroups";
import { PLACES, placeById } from "../../data/places";
import Icon from "../../components/ui/Icon";

const ACTIVITIES = ["그림책", "미술", "신체놀이", "역할놀이"];
const AGES = ["3~4세", "4~5세", "5~6세", "6~7세"];
const SCHEDULES = ["토요일 오전", "일요일 오전", "평일 오전", "평일 오후"];

export default function ParentGroupCreatePage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [area, setArea] = useState(placeById(user?.areaId)?.label ?? "합정동");
  const [activity, setActivity] = useState(ACTIVITIES[0]);
  const [ageRange, setAgeRange] = useState(AGES[1]);
  const [schedule, setSchedule] = useState(SCHEDULES[0]);
  const [capacity, setCapacity] = useState(3);
  const [price, setPrice] = useState(16000);
  const [note, setNote] = useState("");
  const [error, setError] = useState("");

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    const result = createPlayGroup({
      hostParentId: user.id,
      hostName: user.name,
      title,
      activity,
      area,
      ageRange,
      schedule,
      pricePerSession: price,
      capacity,
      note,
    });
    if (!result.ok) {
      setError(result.message);
      return;
    }
    navigate(`/parent/groups/${result.group.id}`);
  };

  return (
    <div className="space-y-4">
      <Link to="/parent/groups" className="inline-flex items-center gap-1 text-xs font-semibold text-muted">
        <Icon name="chevron-left" size={14} />
        같이하기
      </Link>
      <section>
        <h1 className="text-lg font-bold text-foreground">그룹 만들기</h1>
        <p className="text-sm text-muted mt-1">지역과 시간을 올리면 가까운 가정이 모임에 참여합니다.</p>
      </section>
      <form onSubmit={submit} className="card p-4 space-y-3">
        <label className="block text-[11px] font-semibold text-muted">
          모임 이름
          <input value={title} onChange={(e) => setTitle(e.target.value)} className="mt-1 w-full border border-border rounded-2xl px-3 py-2.5 text-sm text-foreground" placeholder="영어 그림책과 역할놀이" />
        </label>
        <label className="block text-[11px] font-semibold text-muted">
          동네
          <select value={area} onChange={(e) => setArea(e.target.value)} className="mt-1 w-full border border-border rounded-2xl px-3 py-2.5 text-sm bg-white">
            {PLACES.map((place) => (
              <option key={place.id} value={place.label}>{place.district} {place.label}</option>
            ))}
          </select>
        </label>
        <div className="grid grid-cols-2 gap-2">
          <label className="block text-[11px] font-semibold text-muted">
            활동
            <select value={activity} onChange={(e) => setActivity(e.target.value)} className="mt-1 w-full border border-border rounded-2xl px-3 py-2.5 text-sm bg-white">
              {ACTIVITIES.map((item) => <option key={item}>{item}</option>)}
            </select>
          </label>
          <label className="block text-[11px] font-semibold text-muted">
            연령
            <select value={ageRange} onChange={(e) => setAgeRange(e.target.value)} className="mt-1 w-full border border-border rounded-2xl px-3 py-2.5 text-sm bg-white">
              {AGES.map((item) => <option key={item}>{item}</option>)}
            </select>
          </label>
        </div>
        <label className="block text-[11px] font-semibold text-muted">
          시간
          <select value={schedule} onChange={(e) => setSchedule(e.target.value)} className="mt-1 w-full border border-border rounded-2xl px-3 py-2.5 text-sm bg-white">
            {SCHEDULES.map((item) => <option key={item}>{item}</option>)}
          </select>
        </label>
        <div className="grid grid-cols-2 gap-2">
          <label className="block text-[11px] font-semibold text-muted">
            모집 인원
            <input type="number" min={2} max={6} value={capacity} onChange={(e) => setCapacity(Number(e.target.value))} className="mt-1 w-full border border-border rounded-2xl px-3 py-2.5 text-sm" />
          </label>
          <label className="block text-[11px] font-semibold text-muted">
            1회 비용
            <input type="number" min={10000} step={1000} value={price} onChange={(e) => setPrice(Number(e.target.value))} className="mt-1 w-full border border-border rounded-2xl px-3 py-2.5 text-sm" />
          </label>
        </div>
        <label className="block text-[11px] font-semibold text-muted">
          소개
          <textarea value={note} onChange={(e) => setNote(e.target.value)} rows={3} className="mt-1 w-full border border-border rounded-2xl px-3 py-2.5 text-sm" placeholder="거실에서 진행, 첫째 5세" />
        </label>
        {error && <p className="text-xs text-red-600">{error}</p>}
        <button type="submit" className="btn-primary w-full py-3.5 text-sm">그룹 열기</button>
      </form>
    </div>
  );
}
