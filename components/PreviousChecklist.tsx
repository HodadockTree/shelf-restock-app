"use client";

import { useState } from "react";
import type { RestockItem } from "@/lib/types";

type PreviousChecklistProps = {
  items: RestockItem[];
  onLoadAll: () => AddPreviousItemsResult;
  onLoadSelected: (ids: string[]) => AddPreviousItemsResult;
  onDeletePrevious: () => void;
  onDeleteItem: (id: string) => void;
};

type AddPreviousItemsResult = {
  addedCount: number;
  skippedCount: number;
};

export default function PreviousChecklist({
  items,
  onLoadAll,
  onLoadSelected,
  onDeletePrevious,
  onDeleteItem,
}: PreviousChecklistProps) {
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [message, setMessage] = useState("");

  const hasPreviousItems = items.length > 0;

  const toggleSelected = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id)
        ? prev.filter((selectedId) => selectedId !== id)
        : [...prev, id]
    );
  };

  const getResultMessage = ({
    addedCount,
    skippedCount,
  }: AddPreviousItemsResult) => {
    if (addedCount === 0) {
      return "이미 오늘 체크리스트에 있는 항목입니다.";
    }

    if (skippedCount > 0) {
      return (
        addedCount +
        "개 항목을 추가했습니다. " +
        skippedCount +
        "개 항목은 이미 있어 제외했습니다."
      );
    }

    return addedCount + "개 항목을 추가했습니다.";
  };

  const handleLoadAll = () => {
    if (!hasPreviousItems) {
      setMessage("저장된 직전 체크리스트가 없습니다.");
      return;
    }

    setMessage(getResultMessage(onLoadAll()));
  };

  const handleLoadSelected = () => {
    if (selectedIds.length === 0) {
      setMessage("추가할 항목을 선택하세요.");
      return;
    }

    const result = onLoadSelected(selectedIds);
    setSelectedIds([]);
    setMessage(getResultMessage(result));
  };

  const handleDeletePrevious = () => {
    if (
      !window.confirm(
        "직전 체크리스트를 삭제할까요? 현재 보충진열 체크리스트는 유지됩니다."
      )
    ) {
      return;
    }

    onDeletePrevious();
    setSelectedIds([]);
    setMessage("직전 체크리스트를 삭제했습니다.");
  };

  const handleDeleteItem = (id: string) => {
    onDeleteItem(id);
    setSelectedIds((prev) =>
      prev.filter((selectedId) => selectedId !== id)
    );
    setMessage("직전 체크리스트 항목을 삭제했습니다.");
  };

  return (
    <section className="card previous-checklist-card">
      <div className="previous-checklist-header">
        <div>
          <h2 className="section-title">직전 체크리스트</h2>
          <p className="section-desc">
            오늘도 필요한 항목만 선택하세요
          </p>
        </div>

        {hasPreviousItems && (
          <div className="previous-checklist-actions">
            <button
              type="button"
              className="text-btn text-btn--danger"
              onClick={handleDeletePrevious}
            >
              직전 목록 삭제
            </button>
          </div>
        )}
      </div>

      <button
        type="button"
        className="secondary-btn"
        onClick={handleLoadAll}
      >
        직전 체크리스트 불러오기
      </button>

      {!hasPreviousItems ? (
        <p className="empty-state previous-empty">
          저장된 직전 체크리스트가 없습니다.
        </p>
      ) : (
        <>
          <ul className="previous-checklist">
            {items.map((item) => (
              <li key={item.id}>
                <div className="previous-checklist-item">
                  <label className="previous-checklist-select">
                    <input
                      type="checkbox"
                      checked={selectedIds.includes(item.id)}
                      onChange={() => toggleSelected(item.id)}
                    />
                    <span className="previous-product-name">
                      {item.productName}
                    </span>
                  </label>

                  <div className="previous-checklist-controls">
                    <span className="previous-product-quantity">
                      × {item.quantity}
                    </span>

                    <button
                      type="button"
                      className="previous-item-delete-btn"
                      onClick={() => handleDeleteItem(item.id)}
                      aria-label={`${item.productName} 삭제`}
                    >
                      ×
                    </button>
                  </div>
                </div>
              </li>
            ))}
          </ul>

          <button
            type="button"
            className="primary-btn"
            onClick={handleLoadSelected}
          >
            선택 항목 추가
          </button>
        </>
      )}

      {message && (
        <p className="status-message" role="status" aria-live="polite">
          {message}
        </p>
      )}
    </section>
  );
}
