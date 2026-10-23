import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import {
  attachGroupTutor,
  getPlayGroup,
  INDIVIDUAL_SESSION_PRICE,
  joinPlayGroup,
  leavePlayGroup,
} from "../../data/playGroups";
import { getTutors } from "../../data/tutors";
import { canTutorAcceptMatching } from "../../data/teacherVerification";
import { placeForArea } from "../../data/places";
import { coverageOf, scheduleFits } from "../../utils/distance";
import { createLessonRequest, listLessonRequests, respondLessonRequest } from "../../data/lessonRequests";
import { groupThreadId } from "../../data/chats";
import Icon from "../../components/ui/Icon";

const ACTIVITY_SPECIALTY: Record<string, string[]> = {
  그림책: ["스토리텔링", "창의놀이"],
  미술: ["미술"],
  신체놀이: ["신체놀이", "창의놀이"],
  역할놀이: ["스토리텔링", "창의놀이"],
};

function won(n: number) {
  return `${n.toLocaleString()}원`;
}

export default function ParentGroupDetailPage() {
  const { user } = useAuth();
  const { id } = useParams();
  const [tick, setTick] = useState(0);
  const [message, setMessage] = useState("");
  void tick;
  const group = id ? getPlayGroup(id) : undefined;

  if (!group || !user) {
    return (
      <div className="card p-8 text-center">
        <p className="text-sm font-semibold text-foreground mb-3">그룹을 찾을 수 없습니다.</p>
        <Link to="/parent/groups" className="text-sm font-semibold text-primary">목록으로</Link>
      </div>
    );
  }

  const joined = group.memberIds.includes(user.id);
  const filled = group.memberIds.length >= group.minMembers;
  const save = INDIVIDUAL_SESSION_PRICE - group.pricePerSession;
  const progress = Math.min(100, Math.round((group.memberIds.length / group.capacity) * 100));

  const refresh = (text: string) => {
    setMessage(text);
    setTick((n) => n + 1);
  };

  const place = placeForArea(group.area);
  const wanted = ACTIVITY_SPECIALTY[group.activity] ?? [];
  const nearbyTutors = getTutors()
    .filter((tutor) => canTutorAcceptMatching(tutor.id).ok)
    .map((tutor) => ({ tutor, coverage: coverageOf(tutor, place) }))
    .filter((item) => item.coverage.ok && scheduleFits(item.tutor.availableSlots, group.schedule))
    .filter((item) => wanted.length === 0 || item.tutor.specialties.some((name) => wanted.includes(name)));
  const requests = listLessonRequests().filter((item) => item.kind === "group" && item.groupId === group.id);

  const applyTutor = (tutorId: number, tutorName: string, km: number) => {
    const result = createLessonRequest({
      kind: "group",
      initiatedBy: "parent",
      parentId: user.id,
      tutorId,
      tutorName,
      groupId: group.id,
      groupTitle: group.title,
      placeLabel: group.area,
      distanceKm: km,
    });
    refresh(result.message);
  };

  const answer = (requestId: string, status: "accepted" | "declined", tutorId?: number, tutorName?: string) => {
    const result = respondLessonRequest(requestId, status);
    if (result.ok && status === "accepted" && tutorId && tutorName) {
      attachGroupTutor(group.id, tutorId, tutorName);
    }
    refresh(result.message);
  };

  return (
    <div className="space-y-4">
      <Link to="/parent/groups" className="inline-flex items-center gap-1 text-xs font-semibold text-muted">
        <Icon name="chevron-left" size={14} />
        같이하기
      </Link>

      <section className="relative overflow-hidden rounded-[24px] bg-gradient-to-br from-primary to-accent text-white p-5">
        <div className="absolute -right-8 -top-10 w-28 h-28 rounded-full bg-white/10" />
        <div className="relative">
          <p className="text-[11px] font-semibold tracking-wide text-white/75">{group.area} · {group.ageRange}</p>
          <h1 className="text-[22px] font-bold leading-tight mt-1">{group.title}</h1>
          <p className="text-sm text-white/80 mt-1">{group.schedule} · {group.activity}</p>
        </div>
      </section>

      <section className="card p-4">
        <div className="flex items-end justify-between">
          <div>
            <p className="text-[11px] text-muted">1회 그룹 비용</p>
            <p className="text-2xl font-bold text-foreground">{won(group.pricePerSession)}</p>
          </div>
          <p className="text-xs font-semibold text-primary text-right">개인 방문보다 {won(save)} 낮음</p>
        </div>
        <div className="mt-4">
          <div className="flex justify-between text-[11px] text-muted mb-1.5">
            <span>{group.memberIds.length}/{group.capacity}명</span>
            <span>최소 {group.minMembers}명</span>
          </div>
          <div className="h-2 rounded-full bg-surface-muted overflow-hidden">
            <div className="h-full rounded-full bg-gradient-to-r from-primary to-accent" style={{ width: `${progress}%` }} />
          </div>
        </div>
        <p className="text-sm text-muted leading-relaxed mt-4">{group.note}</p>
        <p className="text-[11px] text-muted mt-3">모집 {group.hostName} · 인원이 모이면 4회 정기로 이어갑니다.</p>
      </section>

      {group.tutorName && (
        <section className="card p-4">
          <p className="text-[11px] text-muted">연결된 선생님</p>
          <p className="text-sm font-semibold text-foreground mt-1">{group.tutorName}</p>
          <Link to={`/parent/tutors/${group.tutorId}`} className="inline-block text-xs font-semibold text-primary mt-2">
            프로필 보기
          </Link>
          {joined && (
            <Link to={`/parent/chats/${groupThreadId(group.id)}`} className="inline-block text-xs font-semibold text-primary mt-2 ml-3">
              그룹 대화
            </Link>
          )}
        </section>
      )}

      {joined && !filled && group.status !== "tutor_requested" && (
        <button type="button" onClick={() => refresh(leavePlayGroup(group.id, user.id).message)} className="w-full py-3 text-sm font-semibold text-muted">
          참여 취소
        </button>
      )}
      {!joined && group.memberIds.length < group.capacity && group.status !== "tutor_requested" && (
        <button
          type="button"
          onClick={() => refresh(joinPlayGroup(group.id, user.id).message)}
          className="btn-primary w-full py-3.5 text-sm"
        >
          이 그룹에 참여
        </button>
      )}

      <section className="space-y-2.5">
          <h2 className="text-sm font-semibold text-foreground px-0.5">동네·시간이 맞는 선생님</h2>
        {nearbyTutors.length === 0 ? (
          <p className="card px-4 py-4 text-sm text-muted">이 동네까지 올 수 있는 선생님이 없습니다.</p>
        ) : nearbyTutors.map(({ tutor, coverage }) => {
          const pending = requests.find((item) => item.tutorId === tutor.id && item.status === "pending");
          const incoming = pending?.initiatedBy === "tutor";
          return (
            <article key={tutor.id} className="card p-4">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="text-sm font-semibold text-foreground">{tutor.name}</p>
                  <p className="text-[11px] text-muted mt-0.5">{coverage.km}km · 범위 {tutor.serviceRadiusKm}km</p>
                </div>
                {incoming && joined ? (
                  <div className="flex gap-2">
                    <button type="button" onClick={() => answer(pending.id, "declined")} className="text-xs font-semibold text-muted">거절</button>
                    <button type="button" onClick={() => answer(pending.id, "accepted", tutor.id, tutor.name)} className="text-xs font-semibold text-primary">수락</button>
                  </div>
                ) : pending || group.tutorId === tutor.id ? (
                  <span className="text-[11px] font-semibold text-primary">{group.tutorId === tutor.id ? "수업 확정" : "수락 대기"}</span>
                ) : joined ? (
                  <button type="button" onClick={() => applyTutor(tutor.id, tutor.name, coverage.km ?? 0)} className="text-xs font-semibold text-primary">신청</button>
                ) : (
                  <span className="text-[11px] text-muted">참여 후 신청</span>
                )}
              </div>
            </article>
          );
        })}
      </section>
      {message && <p className="text-xs font-medium text-primary text-center">{message}</p>}
    </div>
  );
}
