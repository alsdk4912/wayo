import { Link } from "react-router-dom";

export default function Navbar() {
  return (
    <nav className="bg-white/80 backdrop-blur-md border-b border-slate-100 sticky top-0 z-50">
      <div className="max-w-5xl mx-auto px-5">
        <div className="flex items-center justify-between h-14">
          <Link to="/" className="font-black text-slate-900 tracking-tight">
            와요<span className="text-blue-600">Wayo</span>
          </Link>
          <div className="flex items-center gap-2">
            <Link
              to="/login"
              className="text-slate-600 hover:text-slate-900 text-sm font-semibold px-3 py-2 rounded-xl transition-colors"
            >
              로그인
            </Link>
            <Link
              to="/signup"
              className="bg-amber-400 hover:bg-amber-300 text-slate-900 text-sm font-black px-4 py-2 rounded-xl transition-colors shadow-sm"
            >
              회원가입
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}
