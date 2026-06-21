export type Priority = "high" | "medium" | "low";

export type RestockItem = {
  id: string;
  productName: string;
  category: string;
  reason: string;
  priority: Priority;
  checked: boolean;
  quantity: number;
  outOfStock: boolean;
};

export type NewRestockItem = {
  productName: string;
  category: string;
  reason: string;
  priority: Priority;
  quantity: number;
};
