import { Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import AppHeader from "../ui/AppHeader";
import TabBar, { type TabItem } from "../ui/TabBar";

const tabs: TabItem[] = [
  { to: "/tutor", label: "홈", icon: "home", exact: true },
  { to: "/tutor/profile", label: "프로필", icon: "profile" },
  { to: "/tutor/verification", label: "검증", icon: "shield" },
  { to: "/tutor/schedule", label: "일정", icon: "calendar" },
  { to: "/tutor/sessions", label: "세션", icon: "check-circle" },
];

export default function TutorLayout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <AppHeader
        title={user?.name}
        subtitle="강사 포털"
        right={
          <button
            onClick={() => { logout(); navigate("/login"); }}
            className="text-xs text-muted hover:text-foreground font-medium"
          >
            로그아웃
          </button>
        }
      />

      <main className="flex-1 max-w-lg mx-auto w-full px-4 py-5 pb-24"><Outlet /></main>
      <TabBar tabs={tabs} />
    </div>
  );
}
