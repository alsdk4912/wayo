import { Link, useLocation } from "react-router-dom";

export default function Navbar() {
  const location = useLocation();

  return (
    <nav className="bg-white/80 backdrop-blur-md border-b border-slate-100 sticky top-0 z-50">
      <div className="max-w-5xl mx-auto px-5">
        <div className="flex items-center justify-between h-14">
          <Link to="/" className="flex items-center gap-1.5">
            <span className="text-xl font-black text-slate-900 tracking-tight">
              와요<span className="text-blue-600">Wayo</span>
            </span>
          </Link>

          <div className="flex items-center gap-1">
            <Link
              to="/tutors"
              className={`px-3 py-1.5 rounded-xl text-sm font-semibold transition-colors ${
                location.pathname.startsWith("/tutors")
                  ? "bg-slate-900 text-white"
                  : "text-slate-600 hover:bg-slate-100"
              }`}
            >
              강사 찾기
            </Link>
            <Link
              to="/tutors"
              className="hidden sm:flex bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold px-4 py-2 rounded-xl transition-colors"
            >
              시작하기
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}
