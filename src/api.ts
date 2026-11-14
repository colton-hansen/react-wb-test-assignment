import axios from "axios";
import type { User, UserInput } from "./types.ts";

function endpoint(): string {
  const url = import.meta.env.VITE_API_URL?.trim();
  if (!url) {
    throw new Error("Не задан VITE_API_URL. Создайте ресурс users на mockapi.io и укажите его адрес в .env.local.");
  }
  return url.replace(/\/$/, "");
}

export function getErrorMessage(error: unknown): string {
  if (axios.isAxiosError(error)) {
    if (error.response?.status === 404) return "Пользователь не найден.";
    if (error.response) return `Запрос не выполнен. Код ответа: ${error.response.status}.`;
    return "Сервер не ответил. Проверьте адрес API и соединение.";
  }
  if (error instanceof Error && error.message) return error.message;
  return "Не удалось выполнить запрос.";
}

function asUser(raw: unknown): User {
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

const headers = { "content-type": "application/json" };

export async function fetchUsers(): Promise<User[]> {
  const { data } = await axios.get<unknown>(endpoint(), { headers });
  const rows = Array.isArray(data) ? data : [];
  return rows.map(asUser).filter((user) => user.id);
}

export async function fetchUser(id: string): Promise<User> {
  const { data } = await axios.get<unknown>(`${endpoint()}/${id}`, { headers });
  return asUser(data);
}

export async function createUser(input: UserInput): Promise<User> {
  const { data } = await axios.post<unknown>(endpoint(), input, { headers });
  return asUser(data);
}

export async function updateUser(id: string, input: UserInput & { createdAt?: string }): Promise<User> {
  const { data } = await axios.put<unknown>(`${endpoint()}/${id}`, input, { headers });
  return asUser(data);
}
