const STORAGE_KEY = "wayo_lesson_requests";

export interface LessonRequest {
  id: string;
  kind: "visit" | "group";
  initiatedBy: "parent" | "tutor";
  status: "pending" | "accepted" | "declined";
  parentId: string;
  tutorId: number;
  tutorName: string;
  groupId?: string;
  groupTitle?: string;
  placeLabel: string;
  distanceKm: number;
  createdAt: string;
}

function load(): LessonRequest[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed as LessonRequest[] : [];
  } catch {
    return [];
  }
}

function save(list: LessonRequest[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
}

export function listLessonRequests() {
  return load().sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}

export function createLessonRequest(input: Omit<LessonRequest, "id" | "status" | "createdAt">) {
  const list = load();
  const duplicate = list.find((item) => (
    item.status === "pending"
    && item.kind === input.kind
    && item.tutorId === input.tutorId
    && item.parentId === input.parentId
    && item.groupId === input.groupId
    && item.initiatedBy === input.initiatedBy
  ));
  if (duplicate) return { ok: false as const, message: "이미 수락을 기다리는 신청이 있습니다." };
  const request: LessonRequest = {
    ...input,
    id: `lr-${Date.now()}`,
    status: "pending",
    createdAt: new Date().toISOString(),
  };
  save([request, ...list]);
  return { ok: true as const, request, message: "신청했습니다. 상대가 수락하면 수업이 확정됩니다." };
}

export function respondLessonRequest(id: string, status: "accepted" | "declined") {
  const list = load();
  const target = list.find((item) => item.id === id);
  if (!target || target.status !== "pending") return { ok: false as const, message: "처리할 신청이 없습니다." };
  target.status = status;
  save(list);
  return {
    ok: true as const,
    message: status === "accepted" ? "수업을 수락했습니다." : "신청을 거절했습니다.",
  };
}
