import { useEffect, useState } from "react";
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
  const [mobileOpen, setMobileOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false);

  useEffect(() => {
    setMobileOpen(false);
  }, [location.pathname]);

  const currentPage = menu.find((item) => item.to === location.pathname)?.label ?? "관리자";

  return (
    <div className="min-h-screen bg-background flex">
      {/* 모바일 오버레이 */}
      {mobileOpen && (
        <button
          type="button"
          aria-label="메뉴 닫기"
          className="fixed inset-0 bg-black/40 z-40 lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      <aside
        className={`fixed inset-y-0 left-0 z-50 bg-foreground text-white flex flex-col transition-all duration-200 ease-out
          ${mobileOpen ? "translate-x-0" : "-translate-x-full"}
          lg:translate-x-0
          ${collapsed ? "lg:w-16" : "lg:w-56"}
          w-64`}
      >
        <div className={`border-b border-white/10 ${collapsed ? "lg:p-3 lg:flex lg:justify-center p-5 flex justify-between items-center" : "p-5 flex justify-between items-center"}`}>
          {collapsed ? (
            <p className="hidden lg:block font-bold text-accent text-lg">W</p>
          ) : (
            <div className="min-w-0">
              <p className="font-bold text-lg truncate">와요<span className="text-accent"> Admin</span></p>
              <p className="text-xs text-white/50 mt-1">운영 관리 콘솔</p>
            </div>
          )}
          <button
            type="button"
            onClick={() => setMobileOpen(false)}
            className="lg:hidden p-1.5 rounded-lg hover:bg-white/10"
            aria-label="메뉴 닫기"
          >
            <Icon name="close" size={20} />
          </button>
        </div>

        <nav className="flex-1 p-3 space-y-0.5 overflow-y-auto">
          {menu.map((item) => {
            const active = location.pathname === item.to;
            return (
              <Link
                key={item.to}
                to={item.to}
                title={collapsed ? item.label : undefined}
                className={`flex items-center gap-2.5 rounded-lg text-sm font-medium transition-colors ${
                  collapsed ? "lg:justify-center lg:px-0 px-3 py-2.5" : "px-3 py-2.5"
                } ${active ? "bg-primary text-white" : "text-white/70 hover:bg-white/10 hover:text-white"}`}
              >
                <Icon name={item.icon} size={18} className="shrink-0" />
                <span className={`${collapsed ? "lg:hidden" : ""}`}>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        <div className="p-3 border-t border-white/10 space-y-1">
          <button
            type="button"
            onClick={() => setCollapsed((v) => !v)}
            className={`hidden lg:flex items-center gap-2 w-full rounded-lg text-sm text-white/50 hover:text-white hover:bg-white/10 font-medium transition-colors ${
              collapsed ? "justify-center px-0 py-2" : "px-3 py-2"
            }`}
            aria-label={collapsed ? "사이드바 펼치기" : "사이드바 접기"}
          >
            <Icon name={collapsed ? "chevron-right" : "panel-left"} size={18} />
            {!collapsed && <span>메뉴 접기</span>}
          </button>
          <button
            onClick={() => { logout(); navigate("/login"); }}
            className={`flex items-center gap-2 w-full text-sm text-white/50 hover:text-white font-medium rounded-lg hover:bg-white/10 transition-colors ${
              collapsed ? "lg:justify-center lg:px-0 px-3 py-2" : "px-3 py-2"
            }`}
            title="로그아웃"
          >
            {collapsed && <Icon name="log-out" size={18} className="hidden lg:block shrink-0" />}
            <span className={collapsed ? "lg:hidden" : ""}>로그아웃</span>
          </button>
        </div>
      </aside>

      <div className={`flex-1 flex flex-col min-w-0 transition-all duration-200 ${collapsed ? "lg:ml-16" : "lg:ml-56"}`}>
        <header className="sticky top-0 z-30 bg-white border-b border-border lg:hidden">
          <div className="flex items-center gap-3 px-4 h-14">
            <button
              type="button"
              onClick={() => setMobileOpen(true)}
              className="p-2 -ml-2 rounded-lg hover:bg-surface-muted"
              aria-label="메뉴 열기"
            >
              <Icon name="menu" size={22} className="text-foreground" />
            </button>
            <div className="min-w-0 flex-1">
              <p className="text-xs text-muted">와요 Admin</p>
              <p className="text-sm font-semibold text-foreground truncate">{currentPage}</p>
            </div>
          </div>
        </header>

        <main className="flex-1 p-4 sm:p-6 min-w-0"><Outlet /></main>
      </div>
    </div>
  );
}
