import { Link } from "react-router-dom";
import BrandLogo from "../components/BrandLogo";
import Icon, { type IconName } from "../components/ui/Icon";

const points: { icon: IconName; title: string; titleEn: string; desc: string; descEn: string }[] = [
  { icon: "home", title: "우리 집", titleEn: "At home", desc: "거실에서 놀이로 영어", descEn: "English play in the living room" },
  { icon: "shield", title: "확인 절차", titleEn: "Checks", desc: "서류 제출 후 검수 완료", descEn: "Documents reviewed by the platform" },
  { icon: "handshake", title: "선생님", titleEn: "Teacher", desc: "영어메이트가 찾아옵니다", descEn: "An English mate visits your home" },
];

export default function HomePage() {
  return (
    <div className="min-h-[calc(100dvh-4rem)] bg-white flex flex-col">
      <main className="flex-1 flex flex-col items-center justify-center max-w-lg mx-auto w-full px-6 py-6 text-center">
        <BrandLogo className="h-20 sm:h-24 mb-4" />

        <h1 className="text-3xl font-bold text-foreground leading-tight tracking-tight">
          우리 집에서
          <br />
          <span className="text-primary">영어메이트</span>와
        </h1>
        <p className="text-sm text-primary/80 font-medium mt-1 mb-3">English play at home</p>

        <p className="text-muted text-sm leading-relaxed max-w-xs">
          신분·체류자격 서류를 제출하고 검수를 마친 선생님이 집으로 찾아옵니다.
        </p>
        <p className="text-muted/80 text-xs leading-relaxed max-w-xs mt-1 mb-6">
          A teacher who submitted ID and stay documents, and passed review, visits your home.
        </p>

        <ul className="w-full space-y-2 text-left">
          {points.map((item) => (
            <li key={item.title} className="flex items-center gap-3 rounded-full bg-primary-50/80 px-4 py-2">
              <span className="w-9 h-9 rounded-full bg-white flex items-center justify-center shrink-0 shadow-sm">
                <Icon name={item.icon} size={16} className="text-primary" />
              </span>
              <span>
                <span className="block text-sm font-semibold text-foreground">
                  {item.title}
                  <span className="font-medium text-muted"> · {item.titleEn}</span>
                </span>
                <span className="block text-xs text-muted">{item.desc} · {item.descEn}</span>
              </span>
            </li>
          ))}
        </ul>
      </main>

      <div className="px-6 pb-8 pt-2 max-w-lg mx-auto w-full">
        <Link to="/login" className="btn-primary w-full inline-flex flex-col items-center justify-center py-3 text-sm shadow-md">
          <span className="inline-flex items-center gap-2">
            더 알아보기
            <Icon name="chevron-right" size={16} />
          </span>
          <span className="text-[11px] font-medium text-white/80">Learn more</span>
        </Link>
      </div>
    </div>
  );
}
