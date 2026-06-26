import { Link } from "react-router-dom";

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
          <Link to={homeTo} className="font-bold text-foreground text-[17px] tracking-tight">
            와요<span className="text-primary">Wayo</span>
          </Link>
        )}
        {right}
      </div>
    </header>
  );
}
