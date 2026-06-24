import type {
  RestockItem,
  UnresolvedItem,
} from "./types";

const STORAGE_KEY = "shelf-restock-checklist";

const UNRESOLVED_STORAGE_KEY =
  "shelf-restock-unresolved";

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

export function loadUnresolvedItems(): UnresolvedItem[] {
  if (typeof window === "undefined") return [];

  try {
    const raw = localStorage.getItem(
      UNRESOLVED_STORAGE_KEY
    );

    if (!raw) return [];

    const parsed = JSON.parse(raw);

    return Array.isArray(parsed)
      ? parsed
      : [];
  } catch {
    return [];
  }
}

export function saveUnresolvedItems(
  items: UnresolvedItem[]
): void {
  localStorage.setItem(
    UNRESOLVED_STORAGE_KEY,
    JSON.stringify(items)
  );
}
