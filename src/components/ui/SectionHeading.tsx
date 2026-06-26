import Icon, { type IconName } from "./Icon";

interface Props {
  icon: IconName;
  children: React.ReactNode;
  className?: string;
}

export default function SectionHeading({ icon, children, className = "" }: Props) {
  return (
    <h2 className={`text-sm font-semibold text-foreground flex items-center gap-2 ${className}`}>
      <Icon name={icon} size={16} className="text-primary shrink-0" />
      {children}
    </h2>
  );
}
