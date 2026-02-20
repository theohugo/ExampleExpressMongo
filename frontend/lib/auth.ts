import { User } from "@/types";

const AUTH_STORAGE_KEY = "auth:user";

export function getStoredUser(): User | null {
  if (typeof window === "undefined") return null;

  const raw = window.localStorage.getItem(AUTH_STORAGE_KEY);
  if (!raw) return null;

  try {
    return JSON.parse(raw) as User;
  } catch {
    return null;
  }
}

export function saveUser(user: User) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(user));
  window.dispatchEvent(new Event("auth-changed"));
}

export function clearUser() {
  if (typeof window === "undefined") return;
  window.localStorage.removeItem(AUTH_STORAGE_KEY);
  window.dispatchEvent(new Event("auth-changed"));
}

export function buildUserHeaders(user: User | null): HeadersInit {
  if (!user?._id) return {};
  return {
    "x-user-id": user._id,
  };
}

export function getCartId(user: User): string {
  return `cart-${user._id}`;
}
