import type { User } from "./types.ts";
import type { UserFormValues } from "./userSchema.ts";

export function asUser(raw: unknown): User {
  const row = (typeof raw === "object" && raw !== null ? raw : {}) as Record<string, unknown>;
  return {
    id: String(row.id ?? ""),
    name: String(row.name ?? ""),
    email: String(row.email ?? ""),
    phone: String(row.phone ?? ""),
    city: String(row.city ?? ""),
    company: String(row.company ?? ""),
    position: String(row.position ?? ""),
    avatar: String(row.avatar ?? ""),
    about: String(row.about ?? ""),
    createdAt: row.createdAt ? String(row.createdAt) : undefined,
  };
}

export function asUsers(raw: unknown): User[] {
  const rows = Array.isArray(raw) ? raw : [];
  return rows.map(asUser).filter((user) => user.id);
}

export function toFormValues(user: User): UserFormValues {
  return {
    name: user.name,
    email: user.email,
    phone: user.phone,
    city: user.city,
    company: user.company,
    position: user.position,
    avatar: user.avatar,
    about: user.about,
  };
}
