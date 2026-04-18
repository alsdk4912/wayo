import { Link, useLocation } from "react-router-dom";

export default function Navbar() {
  const location = useLocation();

  return (
    <nav className="bg-white border-b border-blue-100 sticky top-0 z-50 shadow-sm">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center gap-2">
            <span className="text-2xl font-black text-blue-600 tracking-tight">
              와요<span className="text-amber-400">Wayo</span>
            </span>
            <span className="hidden sm:block text-xs text-slate-400 font-medium border-l border-slate-200 pl-2 ml-1">
              우리집 유학
            </span>
          </Link>

          <div className="flex items-center gap-1 sm:gap-2">
            <Link
              to="/tutors"
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                location.pathname === "/tutors" || location.pathname.startsWith("/tutors/")
                  ? "bg-blue-50 text-blue-600"
                  : "text-slate-600 hover:text-blue-600 hover:bg-blue-50"
              }`}
            >
              튜터 찾기
            </Link>
            <Link
              to="/tutors"
              className="hidden sm:flex bg-blue-600 text-white text-sm font-semibold px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors items-center gap-1"
            >
              시작하기
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}
