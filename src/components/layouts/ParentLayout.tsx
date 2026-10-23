import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import AppHeader from "../ui/AppHeader";
import TabBar, { type TabItem } from "../ui/TabBar";
import Icon from "../ui/Icon";

const tabs: TabItem[] = [
  { to: "/parent", label: "홈", icon: "home", exact: true },
  { to: "/parent/tutors", label: "강사", icon: "users" },
  { to: "/parent/bookings", label: "예약", icon: "calendar" },
  { to: "/parent/subscription", label: "구독", icon: "crown" },
];

export default function ParentLayout() {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const lockedHome = useLocation().pathname === "/parent";

  return (
    <div className={`bg-background flex flex-col ${lockedHome ? "h-dvh overflow-hidden" : "min-h-screen"}`}>
      <AppHeader
        right={
          <div className="flex items-center gap-3">
            <Link to="/parent/chats" aria-label="채팅" className="text-muted hover:text-foreground">
              <Icon name="message" size={18} />
            </Link>
            <Link to="/parent/me" aria-label="마이페이지" className="text-muted hover:text-foreground">
              <Icon name="profile" size={18} />
            </Link>
            <button
              onClick={() => { logout(); navigate("/login"); }}
              className="text-xs text-muted hover:text-foreground font-medium"
            >
              로그아웃
            </button>
          </div>
        }
      />

      <main className={`flex-1 max-w-lg mx-auto w-full px-4 min-h-0 ${lockedHome ? "pt-4 pb-[4.75rem] overflow-hidden" : "py-5 pb-24"}`}>
        <Outlet />
      </main>
      <TabBar tabs={tabs} />
    </div>
  );
}
