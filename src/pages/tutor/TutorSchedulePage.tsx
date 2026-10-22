import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { getTutorById, getTutorDateOverrides, saveTutorDateSlots, slotsForTutorDate } from "../../data/tutors";

const HOURS = ["09:00", "10:00", "11:00", "12:00", "13:00", "14:00", "15:00", "16:00", "17:00", "18:00"];
const WEEKDAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const MONTHS = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

function isoDate(year: number, month: number, day: number) {
  return `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
}

function monthCells(year: number, month: number) {
  const first = new Date(year, month, 1).getDay();
  const count = new Date(year, month + 1, 0).getDate();
  const cells: Array<number | null> = Array(first).fill(null);
  for (let day = 1; day <= count; day += 1) cells.push(day);
  while (cells.length % 7 !== 0) cells.push(null);
  return cells;
}

export default function TutorSchedulePage() {
  const { user } = useAuth();
  const tutor = getTutorById(user?.tutorId ?? 0);
  const today = new Date();
  const todayIso = isoDate(today.getFullYear(), today.getMonth(), today.getDate());
  const [year, setYear] = useState(today.getFullYear());
  const [month, setMonth] = useState(today.getMonth());
  const [selected, setSelected] = useState(todayIso);
  const [revision, setRevision] = useState(0);

  const cells = useMemo(() => monthCells(year, month), [year, month]);
  const selectedSlots = tutor ? slotsForTutorDate(tutor, selected) : [];
  void revision;

  if (!tutor) {
    return (
      <div className="bg-white rounded-2xl border border-slate-100 p-5">
        <p className="text-slate-500 text-sm mb-3">Save your profile before setting hours.</p>
        <Link to="/tutor/profile" className="text-primary text-sm font-bold hover:underline">
          Create tutor profile
        </Link>
      </div>
    );
  }

  const shiftMonth = (delta: number) => {
    const next = new Date(year, month + delta, 1);
    setYear(next.getFullYear());
    setMonth(next.getMonth());
  };

  const toggleHour = (hour: string) => {
    const current = slotsForTutorDate(tutor, selected);
    const next = current.includes(hour)
      ? current.filter((item) => item !== hour)
      : [...current, hour];
    saveTutorDateSlots(tutor.id, selected, next);
    setRevision((value) => value + 1);
  };

  const overrides = getTutorDateOverrides(tutor.id);
  const selectedLabel = new Date(`${selected}T00:00:00`).toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
  });
  const isPast = selected < todayIso;

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-xl font-black text-slate-900">Schedule</h1>
        <p className="text-sm text-slate-500">Pick a date, then choose the hours you can teach.</p>
      </div>

      <section className="bg-white rounded-[24px] border border-border p-4">
        <div className="flex items-center justify-between mb-3">
          <button type="button" onClick={() => shiftMonth(-1)} className="w-8 h-8 rounded-full hover:bg-surface-muted text-muted" aria-label="Previous month">‹</button>
          <p className="text-sm font-bold text-foreground">{MONTHS[month]} {year}</p>
          <button type="button" onClick={() => shiftMonth(1)} className="w-8 h-8 rounded-full hover:bg-surface-muted text-muted" aria-label="Next month">›</button>
        </div>
        <div className="grid grid-cols-7 mb-1">
          {WEEKDAYS.map((day) => (
            <div key={day} className="text-center text-[11px] font-semibold text-muted py-1">{day}</div>
          ))}
        </div>
        <div className="grid grid-cols-7 gap-1">
          {cells.map((day, index) => {
            if (!day) return <div key={`empty-${index}`} />;
            const iso = isoDate(year, month, day);
            const open = (Object.prototype.hasOwnProperty.call(overrides, iso)
              ? overrides[iso]
              : slotsForTutorDate(tutor, iso)).length > 0;
            const active = iso === selected;
            const past = iso < todayIso;
            return (
              <button
                key={iso}
                type="button"
                onClick={() => setSelected(iso)}
                className={`h-11 rounded-2xl text-sm font-semibold flex flex-col items-center justify-center gap-0.5 ${
                  active
                    ? "bg-primary text-white"
                    : past
                      ? "text-muted/50"
                      : "text-foreground hover:bg-primary-50"
                }`}
              >
                <span>{day}</span>
                <span className={`w-1 h-1 rounded-full ${open ? (active ? "bg-spark" : "bg-primary") : "bg-transparent"}`} />
              </button>
            );
          })}
        </div>
      </section>

      <section className="bg-white rounded-[24px] border border-border p-4">
        <div className="flex items-baseline justify-between mb-3">
          <h2 className="text-sm font-bold text-foreground">{selectedLabel}</h2>
          <p className="text-[11px] text-muted">{selectedSlots.length} open</p>
        </div>
        {isPast ? (
          <p className="text-sm text-muted">Past dates stay as a record. Choose today or a later date to edit hours.</p>
        ) : (
          <div className="grid grid-cols-3 gap-2">
            {HOURS.map((hour) => {
              const on = selectedSlots.includes(hour);
              return (
                <button
                  key={hour}
                  type="button"
                  onClick={() => toggleHour(hour)}
                  className={`py-2.5 rounded-full text-sm font-semibold border ${
                    on
                      ? "bg-primary text-white border-primary"
                      : "bg-white text-muted border-border"
                  }`}
                >
                  {hour}
                </button>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
}
