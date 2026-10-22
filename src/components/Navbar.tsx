import { Link } from "react-router-dom";
import BrandLogo from "./BrandLogo";

export default function Navbar() {
  return (
    <nav className="bg-white border-b border-border sticky top-0 z-50">
      <div className="max-w-5xl mx-auto px-5">
        <div className="flex items-center justify-between h-14">
          <Link to="/" className="flex items-center" aria-label="와요 홈">
            <BrandLogo className="h-8" />
          </Link>
          <div className="flex items-center gap-2">
            <Link
              to="/login"
              className="text-muted hover:text-foreground text-sm font-medium px-3 py-2 rounded-full transition-colors"
            >
              로그인
            </Link>
            <Link to="/signup" className="btn-primary text-sm px-4 py-2">
              회원가입
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}
