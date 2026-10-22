import { Link } from "react-router-dom";
import BrandLogo from "../BrandLogo";

interface Props {
  title?: React.ReactNode;
  subtitle?: string;
  right?: React.ReactNode;
  homeTo?: string;
}

export default function AppHeader({ title, subtitle, right, homeTo = "/" }: Props) {
  return (
    <header className="bg-white border-b border-border sticky top-0 z-40">
      <div className="max-w-lg mx-auto px-4 h-14 flex items-center justify-between">
        {title ? (
          <div>
            {subtitle && <p className="text-[11px] text-muted leading-none mb-0.5">{subtitle}</p>}
            <p className="font-semibold text-foreground text-sm leading-tight">{title}</p>
          </div>
        ) : (
          <Link to={homeTo} className="flex items-center" aria-label="와요 홈">
            <BrandLogo className="h-8" />
          </Link>
        )}
        {right}
      </div>
    </header>
  );
}
