export function distanceKm(a: { lat: number; lng: number }, b: { lat: number; lng: number }) {
  const toRad = (deg: number) => (deg * Math.PI) / 180;
  const dLat = toRad(b.lat - a.lat);
  const dLng = toRad(b.lng - a.lng);
  const lat1 = toRad(a.lat);
  const lat2 = toRad(b.lat);
  const h = Math.sin(dLat / 2) ** 2 + Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLng / 2) ** 2;
  return 6371 * 2 * Math.atan2(Math.sqrt(h), Math.sqrt(1 - h));
}

export function coverageOf(
  tutor: { lat?: number; lng?: number; serviceRadiusKm?: number },
  point?: { lat: number; lng: number }
) {
  if (!point || tutor.lat == null || tutor.lng == null || !tutor.serviceRadiusKm) {
    return { ok: false, km: null as number | null };
  }
  const km = Math.round(distanceKm(tutor as { lat: number; lng: number }, point) * 10) / 10;
  return { ok: km <= tutor.serviceRadiusKm, km };
}

export function scheduleFits(slots: { day: string; slots: string[] }[], schedule: string) {
  const weekdays = ["월요일", "화요일", "수요일", "목요일", "금요일"];
  const allDays = [...weekdays, "토요일", "일요일"];
  const days = schedule.includes("평일") ? weekdays : allDays.filter((day) => schedule.includes(day));
  const wantMorning = schedule.includes("오전");
  const wantAfternoon = schedule.includes("오후");
  const wantEvening = schedule.includes("저녁");
  const timeOk = (time: string) => {
    const hour = Number(time.slice(0, 2));
    if (Number.isNaN(hour)) return false;
    if (!wantMorning && !wantAfternoon && !wantEvening) return true;
    if (wantMorning && hour < 12) return true;
    if (wantAfternoon && hour >= 12 && hour < 18) return true;
    if (wantEvening && hour >= 18) return true;
    return false;
  };
  const pool = days.length > 0 ? slots.filter((slot) => days.includes(slot.day)) : slots;
  return pool.some((slot) => slot.slots.some(timeOk));
}
