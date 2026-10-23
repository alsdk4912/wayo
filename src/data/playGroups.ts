const STORAGE_KEY = "wayo_play_groups";

export type PlayGroupStatus = "recruiting" | "ready" | "tutor_requested";

export interface PlayGroup {
  id: string;
  title: string;
  activity: string;
  area: string;
  ageRange: string;
  schedule: string;
  pricePerSession: number;
  capacity: number;
  minMembers: number;
  memberIds: string[];
  hostName: string;
  note: string;
  status: PlayGroupStatus;
  tutorId?: number;
  tutorName?: string;
}

export const INDIVIDUAL_SESSION_PRICE = 25000;

const SEED: PlayGroup[] = [
  {
    id: "pg-dangsan",
    title: "영어 그림책과 역할놀이",
    activity: "그림책",
    area: "당산동",
    ageRange: "4~5세",
    schedule: "토요일 오전",
    pricePerSession: 18000,
    capacity: 3,
    minMembers: 3,
    memberIds: ["seed-a", "seed-b"],
    hostName: "박○○",
    note: "그림책을 읽고 역할을 나누며 영어로 말합니다. 호스트 집 거실에서 진행합니다.",
    status: "recruiting",
  },
  {
    id: "pg-mullae",
    title: "색깔 영어 미술 놀이",
    activity: "미술",
    area: "문래동",
    ageRange: "5~6세",
    schedule: "일요일 오전",
    pricePerSession: 16000,
    capacity: 3,
    minMembers: 3,
    memberIds: ["seed-c"],
    hostName: "이○○",
    note: "색깔 이름으로 그림을 그립니다. 재료는 미술 키트로 맞춥니다.",
    status: "recruiting",
  },
  {
    id: "pg-ydp",
    title: "노래와 신체 영어 놀이",
    activity: "신체놀이",
    area: "영등포구",
    ageRange: "3~4세",
    schedule: "평일 오후",
    pricePerSession: 14000,
    capacity: 4,
    minMembers: 3,
    memberIds: ["seed-d", "seed-e"],
    hostName: "최○○",
    note: "노래와 몸으로 단어를 익힙니다. 세 가정이 모이면 강사를 연결합니다.",
    status: "recruiting",
  },
];

function load(): PlayGroup[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(SEED));
      return SEED.map((group) => ({ ...group, memberIds: [...group.memberIds] }));
    }
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return SEED;
    return parsed as PlayGroup[];
  } catch {
    return SEED;
  }
}

function save(list: PlayGroup[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
}

function withStatus(group: PlayGroup): PlayGroup {
  if (group.status === "tutor_requested") return group;
  const ready = group.memberIds.length >= group.minMembers;
  return { ...group, status: ready ? "ready" : "recruiting" };
}

export function listPlayGroups() {
  return load().map(withStatus);
}

export function getPlayGroup(id: string) {
  return listPlayGroups().find((group) => group.id === id);
}

export function joinPlayGroup(groupId: string, parentId: string) {
  const list = load();
  const group = list.find((item) => item.id === groupId);
  if (!group) return { ok: false as const, message: "그룹을 찾을 수 없습니다." };
  if (group.status === "tutor_requested") return { ok: false as const, message: "강사 연결이 진행 중인 그룹입니다." };
  if (group.memberIds.includes(parentId)) return { ok: false as const, message: "이미 참여 중입니다." };
  if (group.memberIds.length >= group.capacity) return { ok: false as const, message: "모집 인원이 찼습니다." };
  group.memberIds.push(parentId);
  group.status = group.memberIds.length >= group.minMembers ? "ready" : "recruiting";
  save(list);
  return { ok: true as const, message: "그룹에 참여했습니다." };
}

export function leavePlayGroup(groupId: string, parentId: string) {
  const list = load();
  const group = list.find((item) => item.id === groupId);
  if (!group) return { ok: false as const, message: "그룹을 찾을 수 없습니다." };
  if (group.status === "tutor_requested") return { ok: false as const, message: "강사 연결 후에는 그룹에서 나갈 수 없습니다." };
  group.memberIds = group.memberIds.filter((id) => id !== parentId);
  group.status = group.memberIds.length >= group.minMembers ? "ready" : "recruiting";
  save(list);
  return { ok: true as const, message: "참여를 취소했습니다." };
}

export function attachGroupTutor(groupId: string, tutorId: number, tutorName: string) {
  const list = load();
  const group = list.find((item) => item.id === groupId);
  if (!group) return { ok: false as const, message: "그룹을 찾을 수 없습니다." };
  group.status = "tutor_requested";
  group.tutorId = tutorId;
  group.tutorName = tutorName;
  save(list);
  return { ok: true as const, message: `${tutorName} 선생님과 수업을 확정했습니다.` };
}

export interface CreatePlayGroupInput {
  hostParentId: string;
  hostName: string;
  title: string;
  activity: string;
  area: string;
  ageRange: string;
  schedule: string;
  pricePerSession: number;
  capacity: number;
  note: string;
}

export function createPlayGroup(input: CreatePlayGroupInput) {
  const title = input.title.trim();
  const area = input.area.trim();
  if (!title || !area) return { ok: false as const, message: "제목과 지역을 입력해 주세요." };
  const capacity = Math.min(Math.max(input.capacity, 2), 6);
  const group: PlayGroup = {
    id: `pg-${Date.now()}`,
    title,
    activity: input.activity,
    area,
    ageRange: input.ageRange,
    schedule: input.schedule,
    pricePerSession: input.pricePerSession,
    capacity,
    minMembers: Math.min(3, capacity),
    memberIds: [input.hostParentId],
    hostName: input.hostName,
    note: input.note.trim() || "모인 가정의 거실에서 영어 놀이를 합니다.",
    status: "recruiting",
  };
  const list = load();
  save([group, ...list]);
  return { ok: true as const, group };
}
