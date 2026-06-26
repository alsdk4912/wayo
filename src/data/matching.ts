export interface MatchingRequest {
  id: string;
  parentId: string;
  tutorId: number;
  tutorName: string;
  childSummary: string;
  requestNote: string;
  status: "pending" | "matched" | "cancelled";
  requestedAt: string;
}

const MATCHING_STORAGE_KEY = "wayo_matching_requests";

function loadStoredMatchingRequests(): MatchingRequest[] {
  try {
    const raw = localStorage.getItem(MATCHING_STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed as MatchingRequest[];
  } catch {
    return [];
  }
}

function saveMatchingRequests(list: MatchingRequest[]) {
  localStorage.setItem(MATCHING_STORAGE_KEY, JSON.stringify(list));
}

export function getMatchingRequests() {
  return loadStoredMatchingRequests();
}

interface CreateMatchingInput {
  parentId: string;
  tutorId: number;
  tutorName: string;
  childSummary: string;
  requestNote: string;
}

export function createMatchingRequest(input: CreateMatchingInput) {
  const list = loadStoredMatchingRequests();
  const nextRequest: MatchingRequest = {
    id: `m-${Date.now()}`,
    parentId: input.parentId,
    tutorId: input.tutorId,
    tutorName: input.tutorName,
    childSummary: input.childSummary.trim() || "자녀 정보 미입력",
    requestNote: input.requestNote.trim() || "요청 메모 없음",
    status: "pending",
    requestedAt: new Date().toISOString(),
  };
  saveMatchingRequests([nextRequest, ...list]);
  return nextRequest;
}

export function cancelMatchingRequest(requestId: string) {
  const list = loadStoredMatchingRequests();
  const merged = list.map((item) => (
    item.id === requestId ? { ...item, status: "cancelled" as const } : item
  ));
  saveMatchingRequests(merged);
}

