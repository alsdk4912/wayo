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
    phone: "010-3210-7788",
    birthDate: "1991-04-12",
    address: "서울 마포구 합정동 123",
    areaId: "hapjeong",
  },
  {
    id: "tutor-1",
    email: "emma@wayo.kr",
    password: "wayo1234",
    name: "Emma Johnson",
    role: "tutor",
    tutorId: 1,
    avatar: "https://i.pravatar.cc/80?img=47",
    phone: "010-5551-2048",
    birthDate: "1996-08-03",
    address: "서울 마포구 망원동 45",
    areaId: "mangwon",
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

function mergeAccounts(stored: DemoAccount[]) {
  const ids = new Set(stored.map((account) => account.id));
  const merged = stored.map((account) => {
    const seed = DEFAULT_ACCOUNTS.find((item) => item.id === account.id);
    if (!seed) return account;
    return {
      ...seed,
      ...account,
      phone: account.phone || seed.phone,
      birthDate: account.birthDate || seed.birthDate,
      address: account.address || seed.address,
      areaId: account.areaId || seed.areaId,
    };
  });
  for (const seed of DEFAULT_ACCOUNTS) {
    if (!ids.has(seed.id)) merged.push(seed);
  }
  return merged;
}

export function getAccounts() {
  const stored = loadStoredAccounts();
  if (!stored || stored.length === 0) {
    saveAccounts(DEFAULT_ACCOUNTS);
    return DEFAULT_ACCOUNTS;
  }
  return mergeAccounts(stored);
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
  phone: string;
  birthDate: string;
  address: string;
  areaId: string;
}

export function registerAccount(input: RegisterInput): { ok: true; user: AuthUser } | { ok: false; message: string } {
  const email = input.email.trim().toLowerCase();
  const name = input.name.trim();
  const phone = input.phone.trim();
  const address = input.address.trim();
  if (!email || !name || !input.password.trim() || !phone || !input.birthDate || !address || !input.areaId) {
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
    phone,
    birthDate: input.birthDate,
    address,
    areaId: input.areaId,
  };

  const updated = [...accounts, nextAccount];
  saveAccounts(updated);
  return { ok: true, user: sanitizeAccount(nextAccount) };
}

export function changePassword(accountId: string, current: string, next: string) {
  if (next.trim().length < 6) return { ok: false as const, message: "비밀번호는 6자 이상이어야 합니다." };
  const accounts = getAccounts();
  const account = accounts.find((item) => item.id === accountId);
  if (!account || account.password !== current) return { ok: false as const, message: "현재 비밀번호가 맞지 않습니다." };
  account.password = next;
  saveAccounts(accounts);
  return { ok: true as const, message: "비밀번호를 변경했습니다." };
}

export function resetPassword(email: string, phone: string, next: string) {
  if (next.trim().length < 6) return { ok: false as const, message: "비밀번호는 6자 이상이어야 합니다." };
  const accounts = getAccounts();
  const account = accounts.find((item) => item.email.toLowerCase() === email.trim().toLowerCase() && item.phone === phone.trim());
  if (!account) return { ok: false as const, message: "이메일과 휴대폰 번호가 일치하는 계정이 없습니다." };
  account.password = next;
  saveAccounts(accounts);
  return { ok: true as const, message: "비밀번호를 다시 설정했습니다. 로그인해 주세요." };
}

export function updateAccount(accountId: string, patch: Partial<Pick<DemoAccount, "phone" | "birthDate" | "address" | "areaId" | "children" | "name">>): AuthUser | null {
  const accounts = getAccounts();
  const idx = accounts.findIndex((account) => account.id === accountId);
  if (idx < 0) return null;
  accounts[idx] = { ...accounts[idx], ...patch };
  saveAccounts(accounts);
  return sanitizeAccount(accounts[idx]);
}

export function attachTutorIdToAccount(accountId: string, tutorId: number): AuthUser | null {
  const accounts = getAccounts();
  const idx = accounts.findIndex((a) => a.id === accountId && a.role === "tutor");
  if (idx < 0) return null;
  accounts[idx] = { ...accounts[idx], tutorId };
  saveAccounts(accounts);
  return sanitizeAccount(accounts[idx]);
}
