"use client";

import { groupItemsByCategory } from "@/lib/groupItems";
import type { RestockItem } from "@/lib/types";

type RestockChecklistProps = {
  items: RestockItem[];
  onToggle: (id: string) => void;
  onToggleOutOfStock: (id: string) => void;
  onDelete: (id: string) => void;
  onClearCompleted: () => void;
  onReset: () => void;
};

export default function RestockChecklist({
  items,
  onToggle,
  onToggleOutOfStock,
  onDelete,
  onClearCompleted,
  onReset,
}: RestockChecklistProps) {
  const checkedCount = items.filter((item) => item.checked).length;
  const totalCount = items.length;
  const progress = totalCount > 0 ? Math.round((checkedCount / totalCount) * 100) : 0;
  const groups = groupItemsByCategory(items);

  return (
    <section className="card checklist-card">
      <div className="checklist-header">
        <div>
          <h2 className="section-title">보충진열 체크리스트</h2>
          {totalCount > 0 && (
            <p className="checklist-subtitle">총 {totalCount}개 상품</p>
          )}
        </div>
        <div className="header-actions">
          {checkedCount > 0 && (
            <button type="button" className="text-btn" onClick={onClearCompleted}>
              완료 삭제
            </button>
          )}
          {totalCount > 0 && (
            <button type="button" className="text-btn text-btn--danger" onClick={onReset}>
              전체 삭제
            </button>
          )}
        </div>
      </div>

      {totalCount > 0 && (
        <div className="progress-panel" role="status" aria-live="polite">
          <div className="progress-stats">
            <span className="progress-count">
              <strong>{checkedCount}</strong>
              <span className="progress-divider">/</span>
              {totalCount}
            </span>
            <span className="progress-label">완료</span>
          </div>
          <div className="progress-bar">
            <div className="progress-fill" style={{ width: `${progress}%` }} />
          </div>
          <span className="progress-text">{progress}% 완료</span>
        </div>
      )}

      {totalCount === 0 ? (
        <p className="empty-state">아직 항목이 없습니다. 위에서 상품을 추가해 보세요.</p>
      ) : (
        <div className="category-groups">
          {groups.map((group) => (
            <section key={group.category} className="category-group">
              <header className="category-group-header">
                <h3 className="category-group-title">{group.category}</h3>
                <span className="category-group-count">
                  {group.completedCount} / {group.items.length}
                </span>
              </header>

              <ul className="checklist">
                {group.items.map((item) => (
                  <li key={item.id}>
                    <div
                      className={`checklist-item ${item.checked ? "checklist-item--done" : ""}`}
                    >
                      <label className="checklist-label">
                        <input
                          type="checkbox"
                          className="checklist-checkbox"
                          checked={item.checked}
                          onChange={() => onToggle(item.id)}
                          aria-label={`${item.productName} 완료`}
                        />
                        <div className="checklist-body">
                        <div className="checklist-top">
                          <strong className="product-name">
                          {item.productName} {" × "} {item.quantity}
                          </strong>
                        </div>

                        <label>
                          <input
                            type="checkbox"
                            checked={item.outOfStock}
                            onChange={() => onToggleOutOfStock(item.id)}
                          />
                          창고 없음
                        </label>

                        </div>
                      </label>
                      <button
                        type="button"
                        className="delete-btn"
                        onClick={() => onDelete(item.id)}
                        aria-label={`${item.productName} 삭제`}
                      >
                        ✕
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            </section>
          ))}
        </div>
      )}
    </section>
  );
}
