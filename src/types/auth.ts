export type UserRole = "parent" | "tutor" | "admin";

export interface AuthUser {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  tutorId?: number;
  children?: string;
  avatar?: string;
  phone?: string;
  birthDate?: string;
  address?: string;
  areaId?: string;
}
