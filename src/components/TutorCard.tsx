import { Link } from "react-router-dom";
import type { Tutor } from "../data/tutors";
import { getParentVerificationSummary } from "../data/teacherVerification";
import { isBasicVerified, isPremiumVerified, BASIC_VERIFY_ITEMS, PREMIUM_VERIFY_ITEMS } from "../utils/verification";
import TeacherVerificationBadge from "./TeacherVerificationBadge";
import Icon from "./ui/Icon";
import StatusBadge from "./ui/StatusBadge";

interface Props {
  tutor: Tutor;
}

export default function TutorCard({ tutor }: Props) {
  const basicOk = isBasicVerified(tutor);
  const premiumOk = isPremiumVerified(tutor);
  const platformVerification = getParentVerificationSummary(tutor.id);

  return (
    <Link
      to={`/parent/tutors/${tutor.id}`}
      className="card overflow-hidden hover:border-primary/30 hover:shadow-md transition-all duration-200 group flex flex-col"
    >
      <div className="relative overflow-hidden">
        <img
          src={tutor.photo}
          alt={tutor.name}
          className="w-full h-44 object-cover group-hover:scale-[1.02] transition-transform duration-300"
        />
        <div className="absolute top-3 left-3 flex flex-col gap-1">
          <TeacherVerificationBadge status={platformVerification.status} />
          {premiumOk ? (
            <StatusBadge variant="premium" label="프리미엄 인증" />
          ) : basicOk ? (
            <StatusBadge variant="basic" label="기본 인증" />
          ) : null}
        </div>
        <div className="absolute bottom-3 right-3 bg-white/95 backdrop-blur text-foreground font-semibold text-sm px-3 py-1 rounded-lg shadow-sm">
          ₩{tutor.hourlyRate.toLocaleString()}/h
        </div>
      </div>

      <div className="p-4 flex flex-col flex-1">
        <div className="flex items-start justify-between mb-1">
          <div>
            <h3 className="font-semibold text-foreground">{tutor.name}</h3>
            <p className="text-primary text-xs font-medium">{tutor.nameKo}</p>
          </div>
          <div className="flex items-center gap-0.5 text-sm font-semibold text-foreground">
            <Icon name="star" size={14} className="text-accent fill-accent" />
            {tutor.rating}
          </div>
        </div>

        <p className="text-muted text-xs mb-3">{tutor.affiliation}</p>

        <div className="flex flex-wrap gap-1.5 mb-3">
          {tutor.specialties.slice(0, 3).map((s) => (
            <span key={s} className="bg-surface-muted text-muted text-xs font-medium px-2 py-0.5 rounded-md">
              {s}
            </span>
          ))}
        </div>

        <p className="text-muted text-xs leading-relaxed mb-4 flex-1 line-clamp-2">{tutor.intro.replace(/[^\uAC00-\uD7A3\w\s.,!?·\-]/g, "").trim()}</p>

        <div className="rounded-lg border border-border p-3 space-y-2 bg-surface-muted/30">
          <div>
            <p className="text-[10px] font-semibold text-muted mb-1.5">기본 인증</p>
            <div className="flex flex-wrap gap-1">
              {BASIC_VERIFY_ITEMS.map(({ key, short }) => {
                const ok = tutor.verified.basic[key];
                return (
                  <span key={key} className={`text-[10px] font-medium px-1.5 py-0.5 rounded ${ok ? "bg-primary-50 text-primary" : "bg-surface-muted text-muted/50"}`}>
                    {short}
                  </span>
                );
              })}
            </div>
          </div>
          {premiumOk && (
            <div>
              <p className="text-[10px] font-semibold text-accent mb-1.5">프리미엄 인증</p>
              <div className="flex flex-wrap gap-1">
                {PREMIUM_VERIFY_ITEMS.map(({ key, short }) => {
                  const ok = tutor.verified.premium[key];
                  return (
                    <span key={key} className={`text-[10px] font-medium px-1.5 py-0.5 rounded ${ok ? "bg-accent-50 text-accent" : "bg-surface-muted text-muted/50"}`}>
                      {short}
                    </span>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>
    </Link>
  );
}
