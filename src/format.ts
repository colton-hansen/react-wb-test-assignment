export function joinFilled(parts: Array<string | undefined>, fallback: string): string {
  return parts.filter(Boolean).join(", ") || fallback;
}

export function initials(name: string): string {
  const letters = name.trim().split(/\s+/).slice(0, 2).map((part) => part[0] ?? "");
  const value = letters.join("").toUpperCase();
  return value || "?";
}

export function formatDate(value?: string): string {
  if (!value) return "-";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return new Intl.DateTimeFormat("ru-RU", { dateStyle: "medium", timeStyle: "short" }).format(date);
}
