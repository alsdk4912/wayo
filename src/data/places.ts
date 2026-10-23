export interface Place {
  id: string;
  label: string;
  district: string;
  lat: number;
  lng: number;
}

export const PLACES: Place[] = [
  { id: "hapjeong", label: "합정동", district: "마포구", lat: 37.5495, lng: 126.9137 },
  { id: "mangwon", label: "망원동", district: "마포구", lat: 37.5563, lng: 126.9014 },
  { id: "dangsan", label: "당산동", district: "영등포구", lat: 37.5344, lng: 126.9024 },
  { id: "mullae", label: "문래동", district: "영등포구", lat: 37.5176, lng: 126.8954 },
  { id: "yeongdeungpo", label: "영등포구", district: "영등포구", lat: 37.5264, lng: 126.8963 },
  { id: "seongsu", label: "성수동", district: "성동구", lat: 37.5446, lng: 127.0559 },
  { id: "itaewon", label: "이태원동", district: "용산구", lat: 37.5345, lng: 126.9946 },
  { id: "hyehwa", label: "혜화동", district: "종로구", lat: 37.5822, lng: 127.0017 },
  { id: "seocho", label: "서초동", district: "서초구", lat: 37.4836, lng: 127.0327 },
  { id: "yeoksam", label: "역삼동", district: "강남구", lat: 37.5007, lng: 127.0365 },
];

const DISTRICT_CENTER: Record<string, string> = {
  "서울 마포구": "mangwon",
  "서울 서초구": "seocho",
  "서울 강남구": "yeoksam",
  "서울 성동구": "seongsu",
  "서울 용산구": "itaewon",
  "서울 종로구": "hyehwa",
};

export function placeById(id?: string) {
  return PLACES.find((place) => place.id === id);
}

export function placeForArea(area: string) {
  return PLACES.find((place) => place.label === area) ?? PLACES.find((place) => place.district === area);
}

export function placeForTutorLocation(location: string) {
  const id = DISTRICT_CENTER[location];
  return id ? placeById(id) : undefined;
}
