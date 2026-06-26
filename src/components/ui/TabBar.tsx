import { Link, useLocation } from "react-router-dom";
import Icon, { type IconName } from "./Icon";

export interface TabItem {
  to: string;
  label: string;
  icon: IconName;
  exact?: boolean;
}

interface Props {
  tabs: TabItem[];
}

export default function TabBar({ tabs }: Props) {
  const location = useLocation();

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-border z-40 safe-bottom">
      <div className="max-w-lg mx-auto flex">
        {tabs.map((tab) => {
          const active = tab.exact
            ? location.pathname === tab.to
            : location.pathname === tab.to || (tab.to !== tabs[0].to && location.pathname.startsWith(tab.to));
          return (
            <Link
              key={tab.to}
              to={tab.to}
              className={`flex-1 flex flex-col items-center gap-0.5 py-2 pt-2.5 text-[11px] font-medium transition-colors ${
                active ? "text-primary" : "text-muted"
              }`}
            >
              <Icon name={tab.icon} size={22} className={active ? "text-primary" : "text-muted"} />
              {tab.label}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
