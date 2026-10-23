import { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { getTutorById } from "../../data/tutors";
import { attachGroupTutor, listPlayGroups } from "../../data/playGroups";
import { placeForArea } from "../../data/places";
import { coverageOf, scheduleFits } from "../../utils/distance";
import { createLessonRequest, listLessonRequests, respondLessonRequest } from "../../data/lessonRequests";
import { getTutorSessions } from "../../data/bookings";
import { artKit, listKitOrders } from "../../data/kits";
import { isBasicVerified, isPremiumVerified } from "../../utils/verification";
import CurriculumGuideModal from "../../components/CurriculumGuideModal";
import StatusBadge from "../../components/ui/StatusBadge";
import Icon from "../../components/ui/Icon";

export default function TutorDashboardPage() {
  const { user } = useAuth();
  const tutor = getTutorById(user?.tutorId ?? 0);
  const sessions = getTutorSessions(user?.tutorId);
  const upcoming = sessions.filter((s) => s.status === "confirmed");
  const myOrders = listKitOrders().filter((order) => order.tutorId === user?.tutorId);
  const [guideWeek, setGuideWeek] = useState<number | null>(null);
  const [tick, setTick] = useState(0);

  if (!tutor) {
    return (
      <div className="card p-5 text-center">
        <p className="font-semibold text-foreground mb-2">Add your tutor profile first.</p>
        <p className="text-sm text-muted mb-4">Parents can find you and request sessions after your profile is saved.</p>
        <Link to="/tutor/profile" className="inline-flex btn-primary text-sm px-4 py-2.5">
          Create profile
        </Link>
      </div>
    );
  }

  const requests = listLessonRequests().filter((item) => tick >= 0 && item.tutorId === tutor.id && item.status === "pending" && item.initiatedBy === "parent");
  const nearbyGroups = listPlayGroups()
    .map((group) => ({ group, coverage: coverageOf(tutor, placeForArea(group.area)) }))
    .filter((item) => item.coverage.ok && scheduleFits(tutor.availableSlots, item.group.schedule));
  const answer = (id: string, status: "accepted" | "declined") => {
    const item = listLessonRequests().find((request) => request.id === id);
    const result = respondLessonRequest(id, status);
    if (result.ok && status === "accepted" && item?.kind === "group" && item.groupId) {
      attachGroupTutor(item.groupId, item.tutorId, item.tutorName);
    }
    setTick((n) => n + 1);
  };

  return (
    <div className="space-y-5">
      <div className="flex items-center gap-4">
        <img src={tutor.photo} alt="" className="w-16 h-16 rounded-2xl object-cover" />
        <div className="min-w-0 flex-1">
          <h1 className="font-black text-slate-900">{tutor.name}</h1>
          <p className="text-sm text-slate-500">{tutor.affiliation}</p>
          {isPremiumVerified(tutor) ? (
            <StatusBadge variant="premium" label="Premium check" />
          ) : isBasicVerified(tutor) ? (
            <span className="mt-1 inline-block"><StatusBadge variant="basic" label="Basic check" /></span>
          ) : null}
        </div>
        {user?.tutorId && (
          <Link
            to="/tutor/verification"
            aria-label="Verification documents"
            className="shrink-0 inline-flex items-center gap-1.5 h-10 px-3 rounded-2xl bg-white border border-slate-100 text-primary"
          >
            <Icon name="shield" size={16} />
            <span className="text-[11px] font-semibold">Checks</span>
          </Link>
        )}
      </div>

      <div className="grid grid-cols-3 gap-3">
        <div className="bg-white rounded-2xl p-3 border border-slate-100 text-center">
          <p className="text-xl font-black text-slate-900">{upcoming.length}</p>
          <p className="text-[10px] text-slate-500">Upcoming</p>
        </div>
        <div className="bg-white rounded-2xl p-3 border border-slate-100 text-center">
          <p className="text-xl font-black text-slate-900">{tutor.rating}</p>
          <p className="text-[10px] text-slate-500">Rating</p>
        </div>
        <div className="bg-white rounded-2xl p-3 border border-slate-100 text-center">
          <p className="text-xl font-black text-emerald-600">₩{(tutor.hourlyRate * 8).toLocaleString()}</p>
          <p className="text-[10px] text-slate-500">Est. this month</p>
        </div>
      </div>

      <section className="card p-4 space-y-3">
        <h2 className="text-sm font-semibold text-foreground">Requests to accept</h2>
        {requests.length === 0 ? (
          <p className="text-xs text-muted">No parent requests inside your travel range.</p>
        ) : requests.map((item) => (
          <div key={item.id} className="flex items-center justify-between gap-3">
            <div>
              <p className="text-sm font-semibold text-foreground">{item.kind === "group" ? item.groupTitle : "Home visit"}</p>
              <p className="text-[11px] text-muted">{item.placeLabel} · {item.distanceKm}km</p>
            </div>
            <div className="flex gap-2">
              <button type="button" onClick={() => answer(item.id, "declined")} className="text-xs font-semibold text-muted">Decline</button>
              <button type="button" onClick={() => answer(item.id, "accepted")} className="text-xs font-semibold text-primary">Accept</button>
            </div>
          </div>
        ))}
      </section>

      <section className="space-y-2">
        <h2 className="text-sm font-semibold text-foreground">Groups you can reach</h2>
        {nearbyGroups.length === 0 ? (
          <p className="card px-4 py-3 text-xs text-muted">No groups inside {tutor.serviceRadiusKm} km.</p>
        ) : nearbyGroups.map(({ group, coverage }) => {
          const applied = listLessonRequests().some((item) => tick >= 0 && item.groupId === group.id && item.tutorId === tutor.id && item.status === "pending");
          return (
          <div key={group.id} className="card p-4 flex items-center justify-between gap-3">
            <div>
              <p className="text-sm font-semibold text-foreground">{group.title}</p>
              <p className="text-[11px] text-muted">{group.area} · {group.schedule} · {coverage.km}km</p>
            </div>
            {group.tutorId === tutor.id ? (
              <span className="text-[11px] font-semibold text-primary">Confirmed</span>
            ) : applied ? (
              <span className="text-[11px] font-semibold text-primary">Waiting</span>
            ) : (
            <button
              type="button"
              onClick={() => {
                createLessonRequest({
                  kind: "group",
                  initiatedBy: "tutor",
                  parentId: group.memberIds[0] ?? "",
                  tutorId: tutor.id,
                  tutorName: tutor.name,
                  groupId: group.id,
                  groupTitle: group.title,
                  placeLabel: group.area,
                  distanceKm: coverage.km ?? 0,
                });
                setTick((n) => n + 1);
              }}
              className="text-xs font-semibold text-primary"
            >
              Apply
            </button>
            )}
          </div>
          );
        })}
      </section>

      <section className="space-y-2">
        <h2 className="text-sm font-semibold text-foreground">Kit guides</h2>
        <p className="text-xs text-muted">Parents order the kit to their home. Open the guide after they buy it.</p>
        {myOrders.length === 0 ? (
          <p className="card px-4 py-3 text-xs text-muted">No parent kit orders yet.</p>
        ) : myOrders.map((order) => {
          const week = artKit.weeks.find((item) => item.week === order.week);
          return (
            <div key={order.id} className="card p-4 flex items-center justify-between gap-3">
              <div>
                <p className="text-sm font-semibold text-foreground">Week {order.week} · {week?.title ?? artKit.name}</p>
                <p className="text-[11px] text-muted mt-0.5">{order.childName} · {order.sessionDate}</p>
              </div>
              <button type="button" onClick={() => setGuideWeek(order.week)} className="text-xs font-semibold text-primary">
                Guide
              </button>
            </div>
          );
        })}
      </section>

      <section>
        <h2 className="font-bold text-slate-900 mb-3">Today</h2>
        {upcoming.slice(0, 2).map((s) => (
          <div key={s.id} className="bg-white rounded-2xl p-4 border border-slate-100 mb-2">
            <p className="font-bold text-slate-800 text-sm">{s.time} · {s.childName}</p>
            <p className="text-xs text-slate-500 mt-1">{s.date}</p>
          </div>
        ))}
      </section>

      {guideWeek !== null && (
        <CurriculumGuideModal kit={artKit} week={guideWeek} lang="en" onClose={() => setGuideWeek(null)} />
      )}
    </div>
  );
}
