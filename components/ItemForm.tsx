"use client";

import { FormEvent, useState } from "react";
import { CATEGORIES, type Category } from "@/lib/categories";
import type { NewRestockItem, Priority } from "@/lib/types";

type ItemFormProps = {
  onAdd: (item: NewRestockItem) => void;
};

export default function ItemForm({ onAdd }: ItemFormProps) {
  const [productName, setProductName] = useState("");
  const [category, setCategory] = useState<Category>(CATEGORIES[0]);
  const [reason, setReason] = useState("");
  const [priority, setPriority] = useState<Priority>("medium");

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();

    const trimmedName = productName.trim();
    if (!trimmedName) return;

    onAdd({
      productName: trimmedName,
      category,
      reason: reason.trim() || "재고 부족",
      priority,
    });

    setProductName("");
    setReason("");
    setPriority("medium");
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

        <label className="field">
          <span>우선순위</span>
          <select
            value={priority}
            onChange={(e) => setPriority(e.target.value as Priority)}
          >
            <option value="high">긴급 — 거의 없음</option>
            <option value="medium">보통 — 조금 부족</option>
            <option value="low">낮음 — 정리 필요</option>
          </select>
        </label>

        <button type="submit" className="primary-btn">
          체크리스트에 추가
        </button>
      </form>
    </section>
  );
}
