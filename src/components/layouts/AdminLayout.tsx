import { Outlet, Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import Icon, { type IconName } from "../ui/Icon";

const menu: { to: string; label: string; icon: IconName }[] = [
  { to: "/admin", label: "대시보드", icon: "chart" },
  { to: "/admin/tutors", label: "강사 관리", icon: "users" },
  { to: "/admin/users", label: "회원 관리", icon: "profile" },
  { to: "/admin/verifications", label: "인증 심사", icon: "shield" },
  { to: "/admin/kits", label: "키트·정산", icon: "palette" },
];

export default function AdminLayout() {
  const { logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background flex">
      <aside className="w-56 bg-foreground text-white flex flex-col fixed h-full">
        <div className="p-5 border-b border-white/10">
          <p className="font-bold text-lg">와요<span className="text-accent"> Admin</span></p>
          <p className="text-xs text-white/50 mt-1">운영 관리 콘솔</p>
        </div>
        <nav className="flex-1 p-3 space-y-0.5">
          {menu.map((item) => {
            const active = location.pathname === item.to;
            return (
              <Link
                key={item.to}
                to={item.to}
                className={`flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                  active ? "bg-primary text-white" : "text-white/70 hover:bg-white/10 hover:text-white"
                }`}
              >
                <Icon name={item.icon} size={18} />
                {item.label}
              </Link>
            );
          })}
        </nav>
        <div className="p-3 border-t border-white/10">
          <button
            onClick={() => { logout(); navigate("/login"); }}
            className="w-full text-left px-3 py-2 text-sm text-white/50 hover:text-white font-medium"
          >
            로그아웃
          </button>
        </div>
      </aside>
      <main className="flex-1 ml-56 p-6"><Outlet /></main>
    </div>
  );
}
