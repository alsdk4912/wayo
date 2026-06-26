import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { getTutorById } from "../../data/tutors";

export default function TutorSchedulePage() {
  const { user } = useAuth();
  const tutor = getTutorById(user?.tutorId ?? 0);

  if (!tutor) {
    return (
      <div className="bg-white rounded-2xl border border-slate-100 p-5">
        <p className="text-slate-500 text-sm mb-3">프로필 등록 후 일정 설정이 가능합니다.</p>
        <Link to="/tutor/profile" className="text-blue-600 text-sm font-bold hover:underline">
          원어민 프로필 등록하기
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h1 className="text-xl font-black text-slate-900">가능 일정</h1>
      <p className="text-sm text-slate-500">학부모가 예약할 수 있는 시간입니다</p>

      <div className="space-y-3">
        {tutor.availableSlots.map((slot) => (
          <div key={slot.day} className="bg-white rounded-2xl p-4 border border-slate-100">
            <p className="font-bold text-slate-800 mb-2">{slot.day}</p>
            <div className="flex flex-wrap gap-2">
              {slot.slots.map((time) => (
                <span key={time} className="bg-blue-50 text-blue-700 text-sm font-semibold px-3 py-1.5 rounded-xl">
                  {time}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>

      <button className="w-full py-3 border-2 border-dashed border-slate-200 rounded-2xl text-sm text-slate-400 font-medium">
        + 일정 추가 (데모)
      </button>
    </div>
  );
}
