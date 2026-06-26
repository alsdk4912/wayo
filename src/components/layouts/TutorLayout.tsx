import { Outlet, Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const tabs = [
  { to: "/tutor", label: "홈", icon: "📊" },
  { to: "/tutor/profile", label: "프로필", icon: "🪪" },
  { to: "/tutor/schedule", label: "일정", icon: "📅" },
  { to: "/tutor/sessions", label: "세션", icon: "✅" },
];

export default function TutorLayout() {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#fafafa] flex flex-col">
      <header className="bg-white border-b border-slate-100 sticky top-0 z-40">
        <div className="max-w-lg mx-auto px-4 h-14 flex items-center justify-between">
          <div>
            <p className="text-xs text-slate-400">강사 포털</p>
            <p className="font-black text-slate-900 text-sm">{user?.name}</p>
          </div>
          <button
            onClick={() => { logout(); navigate("/login"); }}
            className="text-xs text-slate-400 hover:text-slate-600"
          >
            로그아웃
          </button>
        </div>
      </header>

      <main className="flex-1 max-w-lg mx-auto w-full px-4 py-5 pb-24"><Outlet /></main>

      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-slate-100 z-40">
        <div className="max-w-lg mx-auto flex">
          {tabs.map((tab) => {
            const active = location.pathname === tab.to;
            return (
              <Link
                key={tab.to}
                to={tab.to}
                className={`flex-1 flex flex-col items-center py-2.5 text-xs font-semibold ${
                  active ? "text-blue-600" : "text-slate-400"
                }`}
              >
                <span className="text-lg mb-0.5">{tab.icon}</span>
                {tab.label}
              </Link>
            );
          })}
        </div>
      </nav>
    </div>
  );
}
