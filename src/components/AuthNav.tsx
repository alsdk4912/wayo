import { Link } from "react-router-dom";

interface Props {
  active: "login" | "signup";
}

export default function AuthNav({ active }: Props) {
  return (
    <nav className="bg-white border-b border-border sticky top-0 z-50">
      <div className="max-w-lg mx-auto px-5 h-14 flex items-center justify-between">
        <Link to="/" className="font-bold text-foreground text-[17px] tracking-tight">
          와요<span className="text-primary">Wayo</span>
        </Link>
        <div className="flex items-center gap-1 bg-surface-muted p-1 rounded-lg">
          <Link
            to="/login"
            className={`text-sm font-medium px-4 py-1.5 rounded-md transition-colors ${
              active === "login" ? "bg-white text-foreground shadow-sm" : "text-muted"
            }`}
          >
            로그인
          </Link>
          <Link
            to="/signup"
            className={`text-sm font-semibold px-4 py-1.5 rounded-md transition-colors ${
              active === "signup" ? "bg-primary text-white shadow-sm" : "text-muted"
            }`}
          >
            회원가입
          </Link>
        </div>
      </div>
    </nav>
  );
}
