import { Outlet, Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const menu = [
  { to: "/admin", label: "대시보드", icon: "📊" },
  { to: "/admin/tutors", label: "강사 관리", icon: "👩‍🏫" },
  { to: "/admin/users", label: "회원 관리", icon: "👨‍👩‍👧" },
  { to: "/admin/verifications", label: "인증 심사", icon: "🛡️" },
];

export default function AdminLayout() {
  const { logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-slate-100 flex">
      <aside className="w-56 bg-slate-900 text-white flex flex-col fixed h-full">
        <div className="p-5 border-b border-slate-700">
          <p className="font-black text-lg">와요<span className="text-amber-400">Admin</span></p>
          <p className="text-xs text-slate-400 mt-1">운영 관리 콘솔</p>
        </div>
        <nav className="flex-1 p-3 space-y-1">
          {menu.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              className={`flex items-center gap-2 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                location.pathname === item.to
                  ? "bg-blue-600 text-white"
                  : "text-slate-300 hover:bg-slate-800"
              }`}
            >
              <span>{item.icon}</span>
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="p-3 border-t border-slate-700">
          <button
            onClick={() => { logout(); navigate("/login"); }}
            className="w-full text-left px-3 py-2 text-sm text-slate-400 hover:text-white"
          >
            로그아웃
          </button>
        </div>
      </aside>
      <main className="flex-1 ml-56 p-6"><Outlet /></main>
    </div>
  );
}
