"use client";

import { PRODUCTS } from "@/lib/products";
import { FormEvent, useState } from "react";
import { CATEGORIES, type Category } from "@/lib/categories";
import type { NewRestockItem } from "@/lib/types";

type ItemFormProps = {
  onAdd: (item: NewRestockItem) => void;
};

export default function ItemForm({ onAdd }: ItemFormProps) {
  const [productName, setProductName] = useState("");
  const filteredProducts = PRODUCTS.filter((product) =>
    product.name.toLowerCase().includes(productName.toLowerCase())
  ).slice(0, 5);
  const [category, setCategory] = useState<Category>(CATEGORIES[0]);
  const [reason, setReason] = useState("");

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();

    const trimmedName = productName.trim();
    if (!trimmedName) return;

    onAdd({
      productName: trimmedName,
      category,
      reason: reason.trim() || "재고 부족",
      priority: "medium",
    });

    setProductName("");
    setReason("");
  };

  return (
    <section className="card">
      <h2 className="section-title">항목 추가</h2>
      <p className="section-desc">매대를 보며 보충이 필요한 상품을 직접 입력하세요.</p>

      <form className="item-form" onSubmit={handleSubmit}>
        <label className="field">
          <span>상품명</span>
          <input
            type="text"
            value={productName}
            onChange={(e) => setProductName(e.target.value)}
            placeholder="예: 코카콜라 500ml"
            required
          />
          {productName && (
  <div>
   {filteredProducts.map((product) => (
  <button
    key={product.name}
    type="button"
    onClick={() => {
      setProductName(product.name);
      setCategory(product.category as Category);
    }}
  >
    {product.name}
  </button>
))}
</div>
)}
        </label>

        <label className="field">
          <span>카테고리</span>
          <select
  value={category}
  onChange={(e) => setCategory(e.target.value as Category)}
>
            {CATEGORIES.map((name) => (
              <option key={name} value={name}>
                {name}
              </option>
            ))}
          </select>
        </label>

        <label className="field">
          <span>메모 (선택)</span>
          <input
            type="text"
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            placeholder="예: 2칸 비어 있음"
          />
        </label>

        <button type="submit" className="primary-btn">
          체크리스트에 추가
        </button>
      </form>
    </section>
  );
}
