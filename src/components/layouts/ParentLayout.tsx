import { Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import AppHeader from "../ui/AppHeader";
import TabBar, { type TabItem } from "../ui/TabBar";

const tabs: TabItem[] = [
  { to: "/parent", label: "홈", icon: "home", exact: true },
  { to: "/parent/tutors", label: "강사", icon: "users" },
  { to: "/parent/bookings", label: "예약", icon: "calendar" },
  { to: "/parent/subscription", label: "구독", icon: "crown" },
];

export default function ParentLayout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <AppHeader
        right={
          <div className="flex items-center gap-3">
            <span className="text-xs text-muted hidden sm:block">{user?.name}님</span>
            <button
              onClick={() => { logout(); navigate("/login"); }}
              className="text-xs text-muted hover:text-foreground font-medium"
            >
              로그아웃
            </button>
          </div>
        }
      />

      <main className="flex-1 max-w-lg mx-auto w-full px-4 py-5 pb-24"><Outlet /></main>
      <TabBar tabs={tabs} />
    </div>
  );
}
