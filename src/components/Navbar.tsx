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
              to="/signup"
              className="text-slate-600 hover:text-slate-900 text-sm font-semibold px-3 py-2 rounded-xl transition-colors"
            >
              회원가입
            </Link>
            <Link
              to="/login"
              className="bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold px-4 py-2 rounded-xl transition-colors"
            >
              로그인
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}
