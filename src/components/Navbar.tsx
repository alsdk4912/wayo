import { Link } from "react-router-dom";
import BrandLogo from "./BrandLogo";

export default function Navbar() {
  return (
    <nav className="bg-white border-b border-border sticky top-0 z-50">
      <div className="max-w-5xl mx-auto px-5">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center" aria-label="와요 홈">
            <BrandLogo className="h-8" />
          </Link>
          <div className="flex items-center gap-2">
            <Link
              to="/login"
              className="text-muted hover:text-foreground text-sm font-medium px-3 py-1.5 rounded-full transition-colors leading-tight text-center"
            >
              로그인
              <span className="block text-[10px] font-normal">Log in</span>
            </Link>
            <Link to="/signup" className="btn-primary text-sm px-4 py-1.5 leading-tight text-center">
              회원가입
              <span className="block text-[10px] font-medium text-white/80">Sign up</span>
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}
