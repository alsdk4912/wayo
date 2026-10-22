import logo from "../assets/wayo-logo.jpg";

interface Props {
  className?: string;
}

export default function BrandLogo({ className = "h-8" }: Props) {
  return <img src={logo} alt="wayo" className={`w-auto object-contain ${className}`} />;
}
