"use client";

import {
  addUserProduct,
  deleteUserProduct,
  isDuplicateProduct,
  searchProducts,
  updateUserProduct,
} from "@/lib/products";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import { CATEGORIES, type Category } from "@/lib/categories";
import type {
  NewRestockItem,
  ProductSearchResult,
} from "@/lib/types";

type ItemFormProps = {
  onAdd: (item: NewRestockItem) => void;
};

export default function ItemForm({ onAdd }: ItemFormProps) {
  const router = useRouter();
  const [productName, setProductName] = useState("");
  const [category, setCategory] =
    useState<Category>(CATEGORIES[0]);
  const [quantity, setQuantity] = useState("1");
  const [openMenuId, setOpenMenuId] =
    useState<string | null>(null);
  const [editingProduct, setEditingProduct] =
    useState<ProductSearchResult | null>(null);
  const [editName, setEditName] = useState("");
  const [editCategory, setEditCategory] =
    useState<Category>(CATEGORIES[0]);
  const [, setProductVersion] = useState(0);

  const filteredProducts = searchProducts(productName);

  const normalizeQuantity = (value: string) => {
    const parsed = Number(value);

    if (!Number.isFinite(parsed) || parsed < 1) {
      return 1;
    }

    return Math.floor(parsed);
  };

  const resetProductInput = () => {
    setProductName("");
    setCategory(CATEGORIES[0]);
    setOpenMenuId(null);
  };

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();

    const trimmedName = productName.trim();
    const normalizedQuantity = normalizeQuantity(quantity);

    if (!trimmedName) return;

    addUserProduct(trimmedName, category);

    onAdd({
      productName: trimmedName,
      category,
      quantity: normalizedQuantity,
    });

    resetProductInput();
    setQuantity("1");
    setProductVersion((prev) => prev + 1);
  };

  const openEdit = (product: ProductSearchResult) => {
    if (!product.id) return;

    setEditingProduct(product);
    setEditName(product.name);
    setEditCategory(product.category as Category);
    setOpenMenuId(null);
  };

  const closeEdit = () => {
    setEditingProduct(null);
    setEditName("");
    setEditCategory(CATEGORIES[0]);
  };

  const saveEdit = () => {
    if (!editingProduct?.id) return;

    const trimmedName = editName.trim();

    if (!trimmedName) {
      window.alert("상품명을 입력해주세요.");
      return;
    }

    if (isDuplicateProduct(trimmedName, editingProduct.id)) {
      window.alert("이미 등록된 상품명입니다.");
      return;
    }

    updateUserProduct(editingProduct.id, {
      name: trimmedName,
      category: editCategory,
    });

    setProductName(trimmedName);
    setCategory(editCategory);
    setProductVersion((prev) => prev + 1);
    closeEdit();
  };

  const deleteProduct = (product: ProductSearchResult) => {
    if (!product.id) return;

    const confirmed = window.confirm(
      "정말 삭제하시겠습니까?"
    );

    if (!confirmed) return;

    deleteUserProduct(product.id);
    setOpenMenuId(null);
    setProductVersion((prev) => prev + 1);
  };

  return (
    <section className="card">
      <h2 className="section-title">항목 추가</h2>
      <p className="section-desc">
        매대를 보며 보충이 필요한 상품을 직접 입력하세요.
      </p>

      <form className="item-form" onSubmit={handleSubmit}>
        <label className="field">
          <span>상품명</span>
          <div className="input-clear-wrap">
            <input
              type="text"
              value={productName}
              onChange={(e) => {
                setProductName(e.target.value);
                setOpenMenuId(null);
              }}
              placeholder="예: 새우깡"
              required
            />
            {productName && (
              <button
                type="button"
                className="input-clear-btn"
                onClick={resetProductInput}
                aria-label="상품명 지우기"
              >
                ×
              </button>
            )}
          </div>

          {productName && (
            <div className="autocomplete-list">
              {filteredProducts.map((product) => (
                <div
                  key={`${product.source}-${product.id ?? product.name}`}
                  className="autocomplete-item"
                >
                  <button
                    type="button"
                    className="autocomplete-select-btn"
                    onClick={() => {
                      setProductName(product.name);
                      setCategory(product.category as Category);
                      setOpenMenuId(null);
                    }}
                  >
                    <span className="autocomplete-name">
                      {product.name}
                    </span>
                    <span className="autocomplete-category">
                      {product.category}
                    </span>
                  </button>

                  {product.source === "user" && product.id && (
                    <div className="autocomplete-menu-wrap">
                      <button
                        type="button"
                        className="autocomplete-menu-btn"
                        onClick={() =>
                          setOpenMenuId((current) =>
                            current === product.id
                              ? null
                              : product.id ?? null
                          )
                        }
                        aria-label={`${product.name} 관리 메뉴`}
                        aria-expanded={openMenuId === product.id}
                      >
                        ...
                      </button>

                      {openMenuId === product.id && (
                        <div className="autocomplete-menu">
                          <button
                            type="button"
                            onClick={() => openEdit(product)}
                          >
                            수정
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              router.push(
                                `/user-products?keyword=${encodeURIComponent(
                                  product.name
                                )}`
                              );
                            }}
                          >
                            상품 관리에서 보기
                          </button>
                          <button
                            type="button"
                            className="autocomplete-menu-danger"
                            onClick={() => deleteProduct(product)}
                          >
                            삭제
                          </button>
                        </div>
                      )}
                    </div>
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
                  String(
                    Math.max(1, normalizeQuantity(prev) - 1)
                  )
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
            onChange={(e) =>
              setCategory(e.target.value as Category)
            }
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

      {editingProduct && (
        <div
          className="modal-backdrop"
          role="presentation"
          onClick={closeEdit}
        >
          <div
            className="quick-edit-sheet"
            role="dialog"
            aria-modal="true"
            aria-labelledby="quick-edit-title"
            onClick={(event) => event.stopPropagation()}
          >
            <h3 id="quick-edit-title">상품 수정</h3>

            <label className="field">
              <span>상품명</span>
              <input
                type="text"
                value={editName}
                onChange={(event) =>
                  setEditName(event.target.value)
                }
              />
            </label>

            <label className="field">
              <span>카테고리</span>
              <select
                value={editCategory}
                onChange={(event) =>
                  setEditCategory(
                    event.target.value as Category
                  )
                }
              >
                {CATEGORIES.map((name) => (
                  <option key={name} value={name}>
                    {name}
                  </option>
                ))}
              </select>
            </label>

            <div className="quick-edit-actions">
              <button
                type="button"
                className="user-product-action-btn user-product-action-btn--secondary"
                onClick={closeEdit}
              >
                취소
              </button>
              <button
                type="button"
                className="user-product-action-btn user-product-action-btn--primary"
                onClick={saveEdit}
              >
                저장
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
