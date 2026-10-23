import type { AuthUser } from "../types/auth";
import { getBookings } from "./bookings";
import { listLessonRequests } from "./lessonRequests";
import { listPlayGroups } from "./playGroups";
import { getTutorById } from "./tutors";
import { getAccounts } from "./users";

const STORAGE_KEY = "wayo_chats";

export interface ChatMessage {
  id: string;
  threadId: string;
  senderId: string;
  senderName: string;
  body: string;
  createdAt: string;
}

export interface ChatThread {
  id: string;
  kind: "visit" | "group";
  title: string;
  subtitle: string;
  tutorId: number;
  participantIds: string[];
}

const SEED: ChatMessage[] = [
  {
    id: "m-seed-1",
    threadId: "visit-parent-1-1",
    senderId: "parent-1",
    senderName: "김지현",
    body: "주의사항: 지우는 땅콩 알레르기가 있어요. 간식은 주지 말아 주세요.",
    createdAt: "2026-06-18T09:00:00.000Z",
  },
  {
    id: "m-seed-2",
    threadId: "visit-parent-1-1",
    senderId: "tutor-1",
    senderName: "Emma Johnson",
    body: "This week we'll play with color-name cards, then spend the last 10 minutes describing the picture.",
    createdAt: "2026-06-18T09:12:00.000Z",
  },
];

function load(): ChatMessage[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(SEED));
      return SEED.map((item) => ({ ...item }));
    }
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed as ChatMessage[] : [];
  } catch {
    return [];
  }
}

function save(list: ChatMessage[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
}

function tutorAccountId(tutorId: number) {
  return getAccounts().find((account) => account.role === "tutor" && account.tutorId === tutorId)?.id;
}

function accountName(id: string) {
  return getAccounts().find((account) => account.id === id)?.name ?? "";
}

export function visitThreadId(parentId: string, tutorId: number) {
  return `visit-${parentId}-${tutorId}`;
}

export function groupThreadId(groupId: string) {
  return `group-${groupId}`;
}

export function listThreads(user: AuthUser): ChatThread[] {
  const messages = load();
  const threads = new Map<string, ChatThread>();

  for (const booking of getBookings()) {
    if (booking.status === "cancelled") continue;
    const tutorUserId = tutorAccountId(booking.tutorId);
    const id = visitThreadId(booking.parentId, booking.tutorId);
    threads.set(id, {
      id,
      kind: "visit",
      title: user.role === "tutor" ? accountName(booking.parentId) || booking.childName : booking.tutorName,
      subtitle: `${booking.date} ${booking.time} · ${booking.childName}`,
      tutorId: booking.tutorId,
      participantIds: [booking.parentId, tutorUserId].filter((item): item is string => Boolean(item)),
    });
  }

  for (const request of listLessonRequests()) {
    if (request.status !== "accepted" || request.kind !== "visit") continue;
    const tutorUserId = tutorAccountId(request.tutorId);
    const id = visitThreadId(request.parentId, request.tutorId);
    if (threads.has(id)) continue;
    threads.set(id, {
      id,
      kind: "visit",
      title: user.role === "tutor" ? accountName(request.parentId) || "Parent" : request.tutorName,
      subtitle: `${request.placeLabel} 방문`,
      tutorId: request.tutorId,
      participantIds: [request.parentId, tutorUserId].filter((item): item is string => Boolean(item)),
    });
  }

  for (const group of listPlayGroups()) {
    if (!group.tutorId || group.status !== "tutor_requested") continue;
    const tutorUserId = tutorAccountId(group.tutorId);
    const tutorName = group.tutorName || getTutorById(group.tutorId)?.name || "선생님";
    threads.set(groupThreadId(group.id), {
      id: groupThreadId(group.id),
      kind: "group",
      title: user.role === "tutor" ? group.title : tutorName,
      subtitle: `${group.title} · ${group.area}`,
      tutorId: group.tutorId,
      participantIds: [...group.memberIds, tutorUserId].filter((item): item is string => Boolean(item)),
    });
  }

  return [...threads.values()]
    .filter((thread) => thread.participantIds.includes(user.id) || user.tutorId === thread.tutorId)
    .map((thread) => {
      const last = messages.filter((item) => item.threadId === thread.id).at(-1);
      return last ? { ...thread, subtitle: last.body } : thread;
    })
    .sort((a, b) => a.title.localeCompare(b.title, "ko"));
}

export function listMessages(threadId: string) {
  return load().filter((item) => item.threadId === threadId);
}

export function sendMessage(thread: ChatThread, sender: AuthUser, body: string) {
  const text = body.trim();
  if (!text) return { ok: false as const, message: "내용을 입력해 주세요." };
  const allowed = thread.participantIds.includes(sender.id) || sender.tutorId === thread.tutorId;
  if (!allowed) return { ok: false as const, message: "이 대화에 참여할 수 없습니다." };
  const next: ChatMessage = {
    id: `m-${Date.now()}`,
    threadId: thread.id,
    senderId: sender.id,
    senderName: sender.name,
    body: text,
    createdAt: new Date().toISOString(),
  };
  save([...load(), next]);
  return { ok: true as const, message: next };
}
