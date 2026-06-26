import type { AuthUser } from "../types/auth";

export interface DemoAccount extends AuthUser {
  password: string;
}

const DEFAULT_ACCOUNTS: DemoAccount[] = [
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

const USERS_STORAGE_KEY = "wayo_demo_accounts";

function loadStoredAccounts(): DemoAccount[] | null {
  try {
    const raw = localStorage.getItem(USERS_STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return null;
    return parsed as DemoAccount[];
  } catch {
    return null;
  }
}

function saveAccounts(accounts: DemoAccount[]) {
  localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(accounts));
}

export function getAccounts() {
  const stored = loadStoredAccounts();
  if (stored && stored.length > 0) return stored;
  saveAccounts(DEFAULT_ACCOUNTS);
  return DEFAULT_ACCOUNTS;
}

export function listDemoAccounts() {
  return getAccounts();
}

function sanitizeAccount(account: DemoAccount): AuthUser {
  const { password: _, ...user } = account;
  return user;
}

export function authenticate(email: string, password: string): AuthUser | null {
  const account = getAccounts().find(
    (a) => a.email === email && a.password === password
  );
  return account ? sanitizeAccount(account) : null;
}

export type RegisterRole = "parent" | "tutor";

interface RegisterInput {
  role: RegisterRole;
  email: string;
  password: string;
  name: string;
  children?: string;
}

export function registerAccount(input: RegisterInput): { ok: true; user: AuthUser } | { ok: false; message: string } {
  const email = input.email.trim().toLowerCase();
  const name = input.name.trim();
  if (!email || !name || !input.password.trim()) {
    return { ok: false, message: "필수 항목을 모두 입력해주세요." };
  }

  const accounts = getAccounts();
  const exists = accounts.some((a) => a.email.toLowerCase() === email);
  if (exists) {
    return { ok: false, message: "이미 가입된 이메일입니다." };
  }

  const nextId = `${input.role}-${Date.now()}`;
  const nextAccount: DemoAccount = {
    id: nextId,
    role: input.role,
    email,
    password: input.password,
    name,
    children: input.role === "parent" ? (input.children?.trim() || "자녀 정보 미입력") : undefined,
    avatar: `https://i.pravatar.cc/80?u=${encodeURIComponent(email)}`,
  };

  const updated = [...accounts, nextAccount];
  saveAccounts(updated);
  return { ok: true, user: sanitizeAccount(nextAccount) };
}

export function attachTutorIdToAccount(accountId: string, tutorId: number): AuthUser | null {
  const accounts = getAccounts();
  const idx = accounts.findIndex((a) => a.id === accountId && a.role === "tutor");
  if (idx < 0) return null;
  accounts[idx] = { ...accounts[idx], tutorId };
  saveAccounts(accounts);
  return sanitizeAccount(accounts[idx]);
}
