import type { AuthUser } from "../types/auth";

export interface DemoAccount extends AuthUser {
  password: string;
}

export const DEMO_ACCOUNTS: DemoAccount[] = [
  {
    id: "parent-1",
    email: "mom@wayo.kr",
    password: "wayo1234",
    name: "김지현",
    role: "parent",
    children: "7세·5세",
    avatar: "https://i.pravatar.cc/80?img=5",
  },
  {
    id: "tutor-1",
    email: "emma@wayo.kr",
    password: "wayo1234",
    name: "Emma Johnson",
    role: "tutor",
    tutorId: 1,
    avatar: "https://i.pravatar.cc/80?img=47",
  },
  {
    id: "admin-1",
    email: "admin@wayo.kr",
    password: "wayo1234",
    name: "와요 운영팀",
    role: "admin",
    avatar: "https://i.pravatar.cc/80?img=60",
  },
];

export function authenticate(email: string, password: string): AuthUser | null {
  const account = DEMO_ACCOUNTS.find(
    (a) => a.email === email && a.password === password
  );
  if (!account) return null;
  const { password: _, ...user } = account;
  return user;
}
