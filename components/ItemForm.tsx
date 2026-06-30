"use client";

import {
  searchProducts,
  addUserProduct,
} from "@/lib/products";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import { CATEGORIES, type Category } from "@/lib/categories";
import type { NewRestockItem } from "@/lib/types";

type ItemFormProps = {
  onAdd: (item: NewRestockItem) => void;
};

export default function ItemForm({ onAdd }: ItemFormProps) {
  const router = useRouter();
  const [productName, setProductName] = useState("");
  const filteredProducts =
  searchProducts(productName);
  const [category, setCategory] = useState<Category>(CATEGORIES[0]);
  const [quantity, setQuantity] = useState("1");

  const normalizeQuantity = (value: string) => {
    const parsed = Number(value);

    if (!Number.isFinite(parsed) || parsed < 1) {
      return 1;
    }

    return Math.floor(parsed);
  };

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();

    const trimmedName = productName.trim();
    const normalizedQuantity = normalizeQuantity(quantity);

    if (!trimmedName) return;
    
    addUserProduct(
      trimmedName,
      category
    );

    onAdd({
      productName: trimmedName,
      category,
      quantity: normalizedQuantity,
    });

    setProductName("");
    setQuantity("1");
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
            placeholder="예: 새우깡"
            required
          />
          {productName && (
  <div className="autocomplete-list">
   {filteredProducts.map((product) => (
  <div
    key={`${product.source}-${product.name}`}
    className="autocomplete-item"
  >
    <button
      type="button"
      className="autocomplete-select-btn"
      onClick={() => {
        setProductName(product.name);
        setCategory(product.category as Category);
      }}
    >
      <span className="autocomplete-name">
        {product.name}
      </span>
      <span className="autocomplete-category">
        {product.category}
      </span>
    </button>

    {product.source === "user" && (
      <button
        type="button"
        className="autocomplete-manage-btn"
        onClick={() => {
          router.push(
            `/user-products?keyword=${encodeURIComponent(product.name)}`
          );
        }}
      >
        관리
      </button>
    )}
  </div>
))}
</div>
)}
        </label>
<label className="field">
  <span>수량</span>

  <div className="quantity-stepper">
    <button
      type="button"
      className="quantity-stepper-btn"
      onClick={() =>
        setQuantity((prev) =>
          String(Math.max(1, normalizeQuantity(prev) - 1))
        )
      }
    >
      -
    </button>

    <input
      type="number"
      className="quantity-stepper-value"
      min="1"
      step="1"
      inputMode="numeric"
      value={quantity}
      onChange={(event) =>
        setQuantity(event.target.value)
      }
      onBlur={() =>
        setQuantity((prev) =>
          String(normalizeQuantity(prev))
        )
      }
      aria-label="수량"
    />

    <button
      type="button"
      className="quantity-stepper-btn"
      onClick={() =>
        setQuantity((prev) =>
          String(normalizeQuantity(prev) + 1)
        )
      }
    >
      +
    </button>
  </div>
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
        <button type="submit" className="primary-btn">
          체크리스트에 추가
        </button>
      </form>
    </section>
  );
}
