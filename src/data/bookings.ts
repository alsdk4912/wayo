export interface Booking {
  id: string;
  parentId: string;
  tutorId: number;
  tutorName: string;
  date: string;
  time: string;
  status: "confirmed" | "completed" | "pending" | "cancelled";
  package: string;
  childName: string;
  kitIncluded?: boolean;
  kitWeek?: number;
  kitPrice?: number;
}

const DEFAULT_BOOKINGS: Booking[] = [
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

const BOOKING_STORAGE_KEY = "wayo_bookings";

function loadStoredBookings(): Booking[] | null {
  try {
    const raw = localStorage.getItem(BOOKING_STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return null;
    return parsed as Booking[];
  } catch {
    return null;
  }
}

function saveBookings(list: Booking[]) {
  localStorage.setItem(BOOKING_STORAGE_KEY, JSON.stringify(list));
}

export function getBookings() {
  const stored = loadStoredBookings();
  if (stored && stored.length > 0) return stored;
  saveBookings(DEFAULT_BOOKINGS);
  return DEFAULT_BOOKINGS;
}

interface BookingRequestInput {
  parentId: string;
  tutorId: number;
  tutorName: string;
  date: string;
  time: string;
  packageName: string;
  childName: string;
  kitIncluded?: boolean;
  kitWeek?: number;
  kitPrice?: number;
}

export function createBookingRequest(input: BookingRequestInput) {
  const list = getBookings();
  const nextBooking: Booking = {
    id: `b-${Date.now()}`,
    parentId: input.parentId,
    tutorId: input.tutorId,
    tutorName: input.tutorName,
    date: input.date,
    time: input.time,
    status: "pending",
    package: input.packageName,
    childName: input.childName.trim() || "자녀 정보 미입력",
    kitIncluded: input.kitIncluded,
    kitWeek: input.kitWeek,
    kitPrice: input.kitPrice,
  };
  const merged = [nextBooking, ...list];
  saveBookings(merged);
  return nextBooking;
}

export function updateBookingStatus(bookingId: string, status: Booking["status"]) {
  const list = getBookings();
  const merged = list.map((booking) => (
    booking.id === bookingId ? { ...booking, status } : booking
  ));
  saveBookings(merged);
}

export function cancelBookingRequest(bookingId: string) {
  updateBookingStatus(bookingId, "cancelled");
}

export function getTutorSessions(tutorId?: number) {
  if (!tutorId) return [];
  return getBookings().filter((booking) => booking.tutorId === tutorId);
}

export const bookings = DEFAULT_BOOKINGS;
export const tutorSessions = DEFAULT_BOOKINGS;
