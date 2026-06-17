export interface Booking {
  id: string;
  parentId: string;
  tutorId: number;
  tutorName: string;
  date: string;
  time: string;
  status: "confirmed" | "completed" | "pending";
  package: string;
  childName: string;
  kitIncluded?: boolean;
  kitWeek?: number;
  kitPrice?: number;
}

export const bookings: Booking[] = [
  {
    id: "b1",
    parentId: "parent-1",
    tutorId: 1,
    tutorName: "Emma Johnson",
    date: "2026-06-20",
    time: "14:00",
    status: "confirmed",
    package: "월 4회 정기권",
    childName: "지우 (7세)",
    kitIncluded: true,
    kitWeek: 3,
    kitPrice: 12000,
  },
  {
    id: "b2",
    parentId: "parent-1",
    tutorId: 1,
    tutorName: "Emma Johnson",
    date: "2026-06-13",
    time: "14:00",
    status: "completed",
    package: "월 4회 정기권",
    childName: "지우 (7세)",
    kitIncluded: true,
    kitWeek: 2,
    kitPrice: 12000,
  },
  {
    id: "b3",
    parentId: "parent-1",
    tutorId: 3,
    tutorName: "Sophie Chen",
    date: "2026-06-08",
    time: "10:00",
    status: "completed",
    package: "1회 체험권",
    childName: "하은 (5세)",
  },
];

export const tutorSessions: Booking[] = [
  {
    id: "b1",
    parentId: "parent-1",
    tutorId: 1,
    tutorName: "Emma Johnson",
    date: "2026-06-20",
    time: "14:00",
    status: "confirmed",
    package: "월 4회",
    childName: "지우 (7세) · 마포구",
    kitIncluded: true,
    kitWeek: 3,
    kitPrice: 12000,
  },
  {
    id: "b4",
    parentId: "parent-2",
    tutorId: 1,
    tutorName: "Emma Johnson",
    date: "2026-06-21",
    time: "10:00",
    status: "confirmed",
    package: "월 4회",
    childName: "서준 (6세) · 용산구",
    kitIncluded: true,
    kitWeek: 4,
    kitPrice: 12000,
  },
  {
    id: "b2",
    parentId: "parent-1",
    tutorId: 1,
    tutorName: "Emma Johnson",
    date: "2026-06-13",
    time: "14:00",
    status: "completed",
    package: "월 4회",
    childName: "지우 (7세) · 마포구",
    kitIncluded: true,
    kitWeek: 2,
    kitPrice: 12000,
  },
];
