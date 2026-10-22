import { Link } from "react-router-dom";
import BrandLogo from "./BrandLogo";

interface Props {
  active: "login" | "signup";
}

export default function AuthNav({ active }: Props) {
  return (
    <nav className="bg-white border-b border-border sticky top-0 z-50">
      <div className="max-w-lg mx-auto px-5 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center" aria-label="와요 홈">
          <BrandLogo className="h-8" />
        </Link>
        <div className="flex items-center gap-1 bg-surface-muted p-1 rounded-full">
          <Link
            to="/login"
            className={`text-sm font-medium px-4 py-1.5 rounded-full transition-colors ${
              active === "login" ? "bg-white text-foreground shadow-sm" : "text-muted"
            }`}
          >
            <span className="block leading-tight">로그인</span>
            <span className={`block text-[10px] font-normal ${active === "login" ? "text-muted" : ""}`}>Log in</span>
          </Link>
          <Link
            to="/signup"
            className={`text-sm font-semibold px-4 py-1.5 rounded-full transition-colors text-center ${
              active === "signup" ? "bg-primary text-white shadow-sm" : "text-muted"
            }`}
          >
            <span className="block leading-tight">회원가입</span>
            <span className={`block text-[10px] font-normal ${active === "signup" ? "text-white/80" : ""}`}>Sign up</span>
          </Link>
        </div>
      </div>
    </nav>
  );
}
