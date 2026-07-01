"use client";

import { groupItemsByCategory } from "@/lib/groupItems";
import { matchesSearchKeyword } from "@/lib/search";
import { useState } from "react";
import type { RestockItem } from "@/lib/types";

type RestockChecklistProps = {
  items: RestockItem[];
  onToggle: (id: string) => void;
  onToggleOutOfStock: (id: string) => void;
  onDelete: (id: string) => void;
  onSaveCurrent: () => void;
  onClearCompleted: () => void;
  onReset: () => void;
};

export default function RestockChecklist({
  items,
  onToggle,
  onDelete,
  onSaveCurrent,
  onClearCompleted,
  onReset,
}: RestockChecklistProps) {
  const activeGroups = groupItemsByCategory(items);
  const [searchKeyword, setSearchKeyword] = useState("");
  const [isCompletedCollapsed, setIsCompletedCollapsed] =
    useState(true);
  const [collapsedCategories, setCollapsedCategories] =
    useState<Record<string, boolean>>({});
  const hasSearchKeyword = searchKeyword.trim().length > 0;
  const filteredItems = hasSearchKeyword
    ? items.filter((item) =>
        matchesSearchKeyword(
          item.productName,
          searchKeyword
        )
      )
    : items;
  const shouldHideCompleted =
    !hasSearchKeyword && isCompletedCollapsed;
  const visibleItems = shouldHideCompleted
    ? filteredItems.filter((item) => !item.checked)
    : filteredItems;
  const visibleGroups = groupItemsByCategory(visibleItems);
  
  const checkedCount =
    activeGroups
      .flatMap((group) => group.items)
      .filter((item) => item.checked)
      .length;
  
  const totalCount =
    activeGroups
      .flatMap((group) => group.items)
      .length;
  
  const progress =
    totalCount > 0
      ? Math.round((checkedCount / totalCount) * 100)
      : 0;

  const toggleCategory = (category: string) => {
    setCollapsedCategories((prev) => ({
      ...prev,
      [category]: !prev[category],
    }));
  };

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
          {totalCount > 0 && (
            <button type="button" className="text-btn" onClick={onSaveCurrent}>
              현재 목록 저장
            </button>
          )}
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
        <>
          <label className="field checklist-search">
            <span>체크리스트 검색</span>
            <div className="input-clear-wrap">
              <input
                type="search"
                value={searchKeyword}
                onChange={(event) =>
                  setSearchKeyword(event.target.value)
                }
                placeholder="체크리스트에서 찾기"
              />
              {searchKeyword && (
                <button
                  type="button"
                  className="input-clear-btn"
                  onClick={() => setSearchKeyword("")}
                  aria-label="검색어 지우기"
                >
                  ×
                </button>
              )}
            </div>
          </label>

          {checkedCount > 0 && !hasSearchKeyword && (
            <button
              type="button"
              className="completed-fold-btn"
              onClick={() =>
                setIsCompletedCollapsed((prev) => !prev)
              }
              aria-expanded={!isCompletedCollapsed}
            >
              {isCompletedCollapsed
                ? `완료 항목 ${checkedCount}개 접힘`
                : `완료 항목 ${checkedCount}개 펼쳐짐`}
            </button>
          )}

          {visibleGroups.length === 0 ? (
            <p className="empty-state">
              {hasSearchKeyword
                ? "검색 결과가 없습니다."
                : "완료되지 않은 항목이 없습니다."}
            </p>
          ) : (
            <div className="category-groups">
              {visibleGroups.map((group) => {
                const isCollapsed =
                  !hasSearchKeyword &&
                  collapsedCategories[group.category];
                const listId = `category-items-${group.category}`;

                return (
                <section
                  key={group.category}
                  className={`category-group ${
                    isCollapsed
                      ? "category-group--collapsed"
                      : ""
                  }`}
                >
                  <header className="category-group-header">
                    <div className="category-group-summary">
                      <h3 className="category-group-title">{group.category}</h3>
                      <span className="category-group-count">
                        {group.completedCount} / {group.items.length}
                      </span>
                    </div>

                    <button
                      type="button"
                      className="category-toggle-btn"
                      onClick={() =>
                        toggleCategory(group.category)
                      }
                      aria-expanded={!isCollapsed}
                      aria-controls={listId}
                    >
                      {isCollapsed ? "펼치기" : "접기"}
                    </button>
                  </header>

                  {!isCollapsed && (
                  <ul id={listId} className="checklist">
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

                            <span className="checklist-body">
                              <strong className="product-name">
                                {item.productName}
                              </strong>
                            </span>
                          </label>

                          <div className="checklist-controls">
                            <span className="quantity-badge">
                              × {item.quantity}
                            </span>

                            <button
                              type="button"
                              className="delete-btn"
                              onClick={() => onDelete(item.id)}
                              aria-label={`${item.productName} 삭제`}
                            >
                              ×
                            </button>
                          </div>
                        </div>
                      </li>
                    ))}
                  </ul>
                  )}
                </section>
                );
              })}
            </div>
          )}
        </>
      )}
    </section>
  );
}
