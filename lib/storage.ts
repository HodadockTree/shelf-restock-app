import type {
  RestockItem,
  UnresolvedItem,
  UserProduct,
} from "./types";

const STORAGE_KEY = "shelf-restock-checklist";

const PREVIOUS_CHECKLIST_STORAGE_KEY =
  "shelf-restock-previous-checklist";

const UNRESOLVED_STORAGE_KEY =
  "shelf-restock-unresolved";

const USER_PRODUCTS_STORAGE_KEY =
  "shelf-restock-user-products";

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

export function loadPreviousChecklist(): RestockItem[] {
  if (typeof window === "undefined") return [];

  try {
    const raw = localStorage.getItem(
      PREVIOUS_CHECKLIST_STORAGE_KEY
    );

    if (!raw) return [];

    const parsed = JSON.parse(raw) as RestockItem[];

    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function savePreviousChecklist(
  items: RestockItem[]
): void {
  localStorage.setItem(
    PREVIOUS_CHECKLIST_STORAGE_KEY,
    JSON.stringify(items)
  );
}

export function clearPreviousChecklist(): void {
  localStorage.removeItem(
    PREVIOUS_CHECKLIST_STORAGE_KEY
  );
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
export function loadUserProducts(): UserProduct[] {
  if (typeof window === "undefined") return [];

  try {
    const raw = localStorage.getItem(
      USER_PRODUCTS_STORAGE_KEY
    );

    if (!raw) return [];

    const parsed = JSON.parse(raw);
    
    if (!Array.isArray(parsed)) {
      return [];
    }
    
    return migrateUserProducts(parsed);
  } catch {
    return [];
  }
}

type LegacyUserProduct = Omit<UserProduct, "id">;

function migrateUserProducts(
  products: Array<UserProduct | LegacyUserProduct>
): UserProduct[] {
  let migrated = false;

  const result = products.map((product) => {
    if ("id" in product) {
      return product;
    }

    migrated = true;

    return {
      ...product,
      id: crypto.randomUUID(),
    };
  });

  if (migrated) {
    saveUserProducts(result);
  }

  return result;
}

export function saveUserProducts(
  products: UserProduct[]
): void {
  localStorage.setItem(
    USER_PRODUCTS_STORAGE_KEY,
    JSON.stringify(products)
  );
}
