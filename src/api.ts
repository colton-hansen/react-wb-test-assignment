import axios from "axios";

export function endpoint(): string {
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

export function queryError(error: unknown, fallback: string): string {
  return typeof error === "string" && error ? error : fallback;
}
