import { Link } from "react-router-dom";
import BrandLogo from "../components/BrandLogo";
import Icon, { type IconName } from "../components/ui/Icon";

const points: { icon: IconName; title: string; desc: string }[] = [
  { icon: "home", title: "우리 집", desc: "거실에서 놀이로 영어" },
  { icon: "shield", title: "확인 절차", desc: "서류 제출 후 검수 완료" },
  { icon: "handshake", title: "선생님", desc: "영어메이트가 찾아옵니다" },
];

export default function HomePage() {
  return (
    <div className="min-h-[calc(100dvh-3.5rem)] bg-white flex flex-col">
      <main className="flex-1 flex flex-col items-center justify-center max-w-lg mx-auto w-full px-6 py-8 text-center">
        <BrandLogo className="h-24 sm:h-28 mb-6" />

        <h1 className="text-3xl font-bold text-foreground leading-tight tracking-tight mb-3">
          우리 집에서
          <br />
          <span className="text-primary">영어메이트</span>와
        </h1>

        <p className="text-muted text-sm leading-relaxed mb-8 max-w-xs">
          신분·체류자격 서류를 제출하고 검수를 마친 선생님이 집으로 찾아옵니다.
        </p>

        <ul className="w-full space-y-2.5 text-left">
          {points.map((item) => (
            <li key={item.title} className="flex items-center gap-3 rounded-full bg-primary-50/80 px-4 py-2.5">
              <span className="w-9 h-9 rounded-full bg-white flex items-center justify-center shrink-0 shadow-sm">
                <Icon name={item.icon} size={16} className="text-primary" />
              </span>
              <span>
                <span className="block text-sm font-semibold text-foreground">{item.title}</span>
                <span className="block text-xs text-muted">{item.desc}</span>
              </span>
            </li>
          ))}
        </ul>
      </main>

      <div className="px-6 pb-8 pt-2 max-w-lg mx-auto w-full">
        <Link to="/login" className="btn-primary w-full inline-flex items-center justify-center gap-2 py-3.5 text-sm shadow-md">
          더 알아보기
          <Icon name="chevron-right" size={16} />
        </Link>
      </div>
    </div>
  );
}
