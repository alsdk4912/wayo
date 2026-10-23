import { Link, Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import AppHeader from "../ui/AppHeader";
import TabBar, { type TabItem } from "../ui/TabBar";
import Icon from "../ui/Icon";

const tabs: TabItem[] = [
  { to: "/tutor", label: "Home", icon: "home", exact: true },
  { to: "/tutor/profile", label: "Profile", icon: "profile" },
  { to: "/tutor/verification", label: "Checks", icon: "shield" },
  { to: "/tutor/schedule", label: "Schedule", icon: "calendar" },
  { to: "/tutor/sessions", label: "Sessions", icon: "check-circle" },
];

export default function TutorLayout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <AppHeader
        title={user?.name}
        subtitle="Tutor portal"
        right={
          <div className="flex items-center gap-3">
            <Link to="/tutor/chats" aria-label="Chats" className="text-muted hover:text-foreground">
              <Icon name="message" size={18} />
            </Link>
            <Link to="/tutor/me" aria-label="My page" className="text-muted hover:text-foreground">
              <Icon name="profile" size={18} />
            </Link>
            <button
              onClick={() => { logout(); navigate("/login"); }}
              className="text-xs text-muted hover:text-foreground font-medium"
            >
              Log out
            </button>
          </div>
        }
      />

      <main className="flex-1 max-w-lg mx-auto w-full px-4 py-5 pb-24"><Outlet /></main>
      <TabBar tabs={tabs} />
    </div>
  );
}
