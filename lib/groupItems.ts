import { CATEGORIES } from "./categories";
import type { RestockItem } from "./types";

export type CategoryGroup = {
  category: string;
  items: RestockItem[];
  completedCount: number;
};

function sortItems(items: RestockItem[]): RestockItem[] {
  return [...items].sort((a, b) => {
    if (a.checked !== b.checked) return a.checked ? 1 : -1;
    
    return 0;
  });
}

export function groupItemsByCategory(items: RestockItem[]): CategoryGroup[] {
  const map = new Map<string, RestockItem[]>();

  for (const item of items) {
    const category = item.category.trim() || "기타";
    const list = map.get(category) ?? [];
    list.push(item);
    map.set(category, list);
  }

  const knownGroups = CATEGORIES.filter((category) => map.has(category)).map((category) => {
    const groupItems = sortItems(map.get(category)!);
    return {
      category,
      items: groupItems,
      completedCount: groupItems.filter((item) => item.checked).length,
    };
  });

  const unknownCategories = [...map.keys()]
    .filter((category) => !CATEGORIES.includes(category as (typeof CATEGORIES)[number]))
    .sort((a, b) => a.localeCompare(b, "ko"));

  const unknownGroups = unknownCategories.map((category) => {
    const groupItems = sortItems(map.get(category)!);
    return {
      category,
      items: groupItems,
      completedCount: groupItems.filter((item) => item.checked).length,
    };
  });

  return [...knownGroups, ...unknownGroups];
}
