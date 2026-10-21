export type UserRole =
  | "super_admin"
  | "school_admin"
  | "teacher"
  | "student";

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  schoolId?: string | null;
}

export interface AuthData {
  token: string;
  user: AuthUser;
}

const AUTH_KEY = "webverse-auth";

export function getAuth(): AuthData | null {
  try {
    const saved = localStorage.getItem(AUTH_KEY);
    return saved ? (JSON.parse(saved) as AuthData) : null;
  } catch {
    return null;
  }
}

export function saveAuth(data: AuthData): void {
  localStorage.setItem(AUTH_KEY, JSON.stringify(data));
}

export function clearAuth(): void {
  localStorage.removeItem(AUTH_KEY);
}