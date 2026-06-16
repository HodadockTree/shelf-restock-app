import type { RestockItem } from "./types";

const STORAGE_KEY = "shelf-restock-checklist";

export function loadItems(): RestockItem[] {
  if (typeof window === "undefined") return [];

  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as RestockItem[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function saveItems(items: RestockItem[]): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
}
