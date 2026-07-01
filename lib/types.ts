export type RestockItem = {
  id: string;
  productName: string;
  category: string;
  checked: boolean;
  quantity: number;
  outOfStock: boolean;
};

export type NewRestockItem = {
  productName: string;
  category: string;
  quantity: number;
};

export type UnresolvedItem = {
  productName: string;
  category: string;
};

export type UserProduct = {
  id: string;
  name: string;
  category: string;
  createdAt: number;
};

export type DisposalMemo = {
  id: string;
  imageDataUrl: string;
  memo: string;
  createdAt: string;
};

export type ProductSearchResult = {
  id?: string;
  name: string;
  category: string;
  source: "default" | "user";
};
