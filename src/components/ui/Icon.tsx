type IconName =
  | "home"
  | "users"
  | "calendar"
  | "star"
  | "crown"
  | "search"
  | "shield"
  | "profile"
  | "check-circle"
  | "chart"
  | "palette"
  | "clock"
  | "baby"
  | "package"
  | "map-pin"
  | "chevron-right"
  | "chevron-left"
  | "sparkles"
  | "handshake"
  | "book"
  | "id-card"
  | "camera"
  | "passport"
  | "building"
  | "clipboard"
  | "heart-pulse"
  | "message"
  | "bell"
  | "menu"
  | "close"
  | "panel-left"
  | "log-out";

const paths: Record<IconName, string> = {
  home: "M3 10.5L12 3l9 7.5V20a1 1 0 01-1 1h-5v-6H9v6H4a1 1 0 01-1-1v-9.5z",
  users: "M17 20h5v-2a4 4 0 00-4-4h-1M9 20H4v-2a4 4 0 014-4h1m8-4a4 4 0 11-8 0 4 4 0 018 0zM16 7a4 4 0 11-8 0 4 4 0 018 0z",
  calendar: "M8 2v4m8-4v4M3 10h18M5 4h14a2 2 0 012 2v14a2 2 0 01-2 2H5a2 2 0 01-2-2V6a2 2 0 012-2z",
  star: "M12 2l3.09 6.26L22 9.27l-5 4.87L18.18 22 12 18.56 5.82 22 7 14.14l-5-4.87 6.91-1.01L12 2z",
  crown: "M2 17l3-9 5 4 2-8 2 8 5-4 3 9H2z",
  search: "M21 21l-4.35-4.35M11 18a7 7 0 100-14 7 7 0 000 14z",
  shield: "M12 2l8 4v6c0 5-3.5 9.5-8 10-4.5-.5-8-5-8-10V6l8-4z",
  profile: "M20 21a8 8 0 10-16 0M12 11a4 4 0 100-8 4 4 0 000 8z",
  "check-circle": "M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z",
  chart: "M4 19V5m6 14V9m6 10V3m6 16v-4",
  palette: "M12 2a10 10 0 1010 10c0-2.5-2-4-4-4h-1.5a1.5 1.5 0 010-3H17a3 3 0 003-3 10 10 0 00-8-6zM7.5 12a1.5 1.5 0 110-3 1.5 1.5 0 010 3zm3-4.5a1.5 1.5 0 110-3 1.5 1.5 0 010 3zm4.5 0a1.5 1.5 0 110-3 1.5 1.5 0 010 3z",
  clock: "M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z",
  baby: "M12 2a5 5 0 015 5c0 2.2-1.4 4.1-3.4 4.8L16 20H8l-2.4-8.2A5 5 0 0112 2z",
  package: "M21 16V8a2 2 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4A2 2 0 003 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4A2 2 0 0021 16zM3.3 7.7L12 12l8.7-4.3M12 22V12",
  "map-pin": "M12 21s7-4.5 7-11a7 7 0 10-14 0c0 6.5 7 11 7 11zM12 10a2 2 0 100-4 2 2 0 000 4z",
  "chevron-right": "M9 18l6-6-6-6",
  "chevron-left": "M15 18l-6-6 6-6",
  sparkles: "M12 3v2m0 14v2M3 12h2m14 0h2M5.6 5.6l1.4 1.4m10 10 1.4 1.4M18.4 5.6l-1.4 1.4M7 17l-1.4 1.4",
  handshake: "M11 11l3 3m-1-5l2 2m-6 6l-2 2m8-8l2-2M7 7l2-2m10 10l2 2M3 12h2m14 0h2",
  book: "M4 19.5A2.5 2.5 0 016.5 17H20M4 4.5A2.5 2.5 0 016.5 2H20v20H6.5A2.5 2.5 0 014 19.5v-15z",
  "id-card": "M3 5a2 2 0 012-2h14a2 2 0 012 2v14a2 2 0 01-2 2H5a2 2 0 01-2-2V5zm4 4h8M7 15h4",
  camera: "M23 19a2 2 0 01-2 2H3a2 2 0 01-2-2V8a2 2 0 012-2h3l2-3h8l2 3h3a2 2 0 012 2v11zM12 17a4 4 0 100-8 4 4 0 000 8z",
  passport: "M4 4h16v16H4V4zm4 2v12m8-12v12M8 8h8M8 16h8",
  building: "M3 21h18M5 21V7l7-4 7 4v14M9 21v-4h6v4M9 9h.01M15 9h.01M9 13h.01M15 13h.01",
  clipboard: "M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2",
  "heart-pulse": "M20.8 4.6a5.5 5.5 0 00-7.8 0L12 5.6l-1-1a5.5 5.5 0 00-7.8 7.8l1 1L12 21l7.8-7.6 1-1a5.5 5.5 0 000-7.8zM12 13v-2m0 4h.01",
  message: "M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2v10z",
  bell: "M18 8A6 6 0 106 8c0 7-3 9-3 9h18s-3-2-3-9M13.7 21a2 2 0 01-3.4 0",
  menu: "M4 6h16M4 12h16M4 18h16",
  close: "M18 6L6 18M6 6l12 12",
  "panel-left": "M9 3H5a2 2 0 00-2 2v14a2 2 0 002 2h4M9 3v18M9 3h10a2 2 0 012 2v14a2 2 0 01-2 2H9",
  "log-out": "M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4M16 17l5-5-5-5M21 12H9",
};

interface Props {
  name: IconName;
  className?: string;
  size?: number;
}

export default function Icon({ name, className = "", size = 20 }: Props) {
  return (
    <svg
      viewBox="0 0 24 24"
      width={size}
      height={size}
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden
    >
      <path d={paths[name]} />
    </svg>
  );
}

export type { IconName };
