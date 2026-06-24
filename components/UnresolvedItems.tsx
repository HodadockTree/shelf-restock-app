"use client";

import type { UnresolvedItem } from "@/lib/types";

type Props = {
  items: UnresolvedItem[];
  onAdd: (item: UnresolvedItem) => void;
  onDelete: (productName: string) => void;
};

export default function UnresolvedItems({
  items,
  onAdd,
  onDelete,
}: Props) {
  if (items.length === 0) return null;

  return (
    <section className="card">
      <h2 className="section-title">
        재확인 상품
      </h2>

      <ul>
      {items.map((item) => (
  <li
    key={item.productName}
    style={{
      marginBottom: "12px",
    }}
  >
    <div>
      {item.productName}
    </div>

    <div>
      <button
        type="button"
        onClick={() => onAdd(item)}
      >
        있음
      </button>

      <button
        type="button"
        onClick={() =>
          onDelete(item.productName)
        }
      >
        없음
      </button>
    </div>
  </li>
))}
      </ul>
    </section>
  );
}