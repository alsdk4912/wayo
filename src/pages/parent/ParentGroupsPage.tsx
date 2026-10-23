import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { listPlayGroups } from "../../data/playGroups";

const AREAS = ["전체 지역", "당산동", "문래동", "영등포구", "마포구"];
const AGES = ["전체 연령", "3~4세", "4~5세", "5~6세", "6~7세"];
const ACTIVITIES = ["전체 활동", "그림책", "미술", "신체놀이", "역할놀이"];

function won(n: number) {
  return `${n.toLocaleString()}원`;
}

export default function ParentGroupsPage() {
  const [area, setArea] = useState(AREAS[0]);
  const [age, setAge] = useState(AGES[0]);
  const [activity, setActivity] = useState(ACTIVITIES[0]);
  const groups = useMemo(() => listPlayGroups(), []);
  const visible = groups.filter((group) => {
    if (area !== AREAS[0] && group.area !== area) return false;
    if (age !== AGES[0] && group.ageRange !== age) return false;
    if (activity !== ACTIVITIES[0] && group.activity !== activity) return false;
    return true;
  });

  return (
    <div className="space-y-4">
      <section className="relative overflow-hidden rounded-[24px] bg-gradient-to-br from-primary to-accent text-white p-5">
        <div className="absolute -right-6 -top-8 w-28 h-28 rounded-full bg-white/10" />
        <div className="absolute right-8 bottom-4 w-2.5 h-2.5 rounded-full bg-spark" />
        <div className="relative">
          <p className="text-[11px] font-semibold tracking-wide text-white/80">TOGETHER</p>
          <h1 className="text-[22px] font-bold mt-2 leading-tight">같이하기</h1>
          <p className="text-sm text-white/80 mt-1">가까운 집끼리 모여 영어 놀이를 엽니다.</p>
        </div>
      </section>

      <Link to="/parent/groups/new" className="btn-primary w-full inline-flex items-center justify-center py-3 text-sm">
        우리 동네 그룹 만들기
      </Link>

      <div className="grid grid-cols-3 gap-2">
        {[
          [AREAS, area, setArea],
          [AGES, age, setAge],
          [ACTIVITIES, activity, setActivity],
        ].map(([options, value, setValue]) => (
          <select
            key={String(value)}
            value={value as string}
            onChange={(e) => (setValue as (next: string) => void)(e.target.value)}
            className="w-full rounded-full border border-border bg-white px-2 py-2 text-[11px] font-semibold text-foreground"
          >
            {(options as string[]).map((option) => (
              <option key={option}>{option}</option>
            ))}
          </select>
        ))}
      </div>

      {visible.length === 0 ? (
        <p className="card px-4 py-8 text-center text-sm text-muted">조건에 맞는 그룹이 없습니다.</p>
      ) : (
        <div className="space-y-2.5">
          {visible.map((group) => (
            <article key={group.id} className="card p-4">
              <div className="flex items-start justify-between gap-3">
                <p className="text-[11px] text-muted">{group.area} · {group.ageRange} · {group.schedule}</p>
                <span className="text-[11px] font-semibold text-primary bg-primary-50 px-2 py-0.5 rounded-full shrink-0">
                  {group.memberIds.length}/{group.capacity}명
                </span>
              </div>
              <h2 className="text-base font-bold text-foreground mt-1.5">{group.title}</h2>
              <div className="flex items-end justify-between gap-3 mt-2">
                <p className="text-xs text-muted">{group.activity} · 1회 예상 비용</p>
                <p className="text-base font-bold text-foreground">{won(group.pricePerSession)}</p>
              </div>
              <Link
                to={`/parent/groups/${group.id}`}
                className="mt-3 w-full inline-flex items-center justify-center rounded-full border border-border py-2.5 text-sm font-semibold text-foreground"
              >
                그룹 상세 보기
              </Link>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
