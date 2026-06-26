import { Link } from "react-router-dom";

interface Props {
  active: "login" | "signup";
}

export default function AuthNav({ active }: Props) {
  return (
    <nav className="bg-white/95 backdrop-blur-md border-b border-white/20 sticky top-0 z-50">
      <div className="max-w-5xl mx-auto px-5 h-14 flex items-center justify-between">
        <Link to="/" className="font-black text-slate-900 tracking-tight">
          와요<span className="text-blue-600">Wayo</span>
        </Link>
        <div className="flex items-center gap-2">
          <Link
            to="/login"
            className={`text-sm font-semibold px-4 py-2 rounded-xl transition-colors ${
              active === "login"
                ? "bg-blue-600 text-white"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            로그인
          </Link>
          <Link
            to="/signup"
            className={`text-sm font-black px-4 py-2 rounded-xl transition-colors ${
              active === "signup"
                ? "bg-amber-400 text-slate-900"
                : "bg-amber-100 text-amber-800 hover:bg-amber-200"
            }`}
          >
            회원가입
          </Link>
        </div>
      </div>
    </nav>
  );
}
