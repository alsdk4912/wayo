import { Link } from "react-router-dom";

export default function Navbar() {
  return (
    <nav className="bg-white border-b border-border sticky top-0 z-50">
      <div className="max-w-5xl mx-auto px-5">
        <div className="flex items-center justify-between h-14">
          <Link to="/" className="font-bold text-foreground text-[17px] tracking-tight">
            와요<span className="text-primary">Wayo</span>
          </Link>
          <div className="flex items-center gap-2">
            <Link
              to="/login"
              className="text-muted hover:text-foreground text-sm font-medium px-3 py-2 rounded-lg transition-colors"
            >
              로그인
            </Link>
            <Link
              to="/signup"
              className="btn-accent text-sm px-4 py-2"
            >
              회원가입
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}
