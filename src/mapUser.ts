import { z } from "zod";

const text = z.preprocess((value) => (value == null ? "" : String(value)), z.string());

const createdAt = z.preprocess(
  (value) => (value == null || value === "" ? undefined : String(value)),
  z.string().optional(),
);

export const userResponseSchema = z.object({
  id: text,
  name: text,
  email: text,
  phone: text,
  city: text,
  company: text,
  position: text,
  avatar: text,
  about: text,
  createdAt,
});

export type User = z.infer<typeof userResponseSchema>;

export function asUser(raw: unknown): User {
  const parsed = userResponseSchema.safeParse(raw);
  if (!parsed.success || !parsed.data.id) {
    throw new Error("Сервер вернул пользователя в неожиданном виде.");
  }
  return parsed.data;
}

export function asUsers(raw: unknown): User[] {
  const rows = Array.isArray(raw) ? raw : [];
  return rows.flatMap((row) => {
    const parsed = userResponseSchema.safeParse(row);
    if (!parsed.success || !parsed.data.id) return [];
    return [parsed.data];
  });
}
