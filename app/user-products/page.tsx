"use client";

import { useEffect, useState } from "react";
import {
    deleteUserProduct,
    getUserProducts,
    isDuplicateProduct,
    searchUserProducts,
    updateUserProduct,
  } from "@/lib/products";
import { CATEGORIES } from "@/lib/categories";
import UserProductCard from "@/components/UserProductCard";
import type { UserProduct } from "@/lib/types";

export default function UserProductsPage() {
    const [products, setProducts] =
      useState<UserProduct[]>([]);

    const [keyword, setKeyword] =
        useState("");

    const [editingProductId, setEditingProductId] =
        useState<string | null>(null);

    const [editName, setEditName] =
        useState("");

    const [editCategory, setEditCategory] =
        useState<(typeof CATEGORIES)[number]>(
          CATEGORIES[0]
        );
  
    useEffect(() => {
      setProducts(getUserProducts());
    }, []);

    function refreshProducts(
        nextKeyword = keyword
      ) {
        if (!nextKeyword.trim()) {
          setProducts(getUserProducts());
          return;
        }
      
        setProducts(
          searchUserProducts(nextKeyword)
        );
      }

    function handleSearch(
        keyword: string
      ) {
        setKeyword(keyword);
        refreshProducts(keyword);
      }

      function handleEdit(product: UserProduct) {
        setEditingProductId(product.id);
        setEditName(product.name);
        setEditCategory(
          product.category as (typeof CATEGORIES)[number]
        );
      }

      function handleCancelEdit() {
        setEditingProductId(null);
        setEditName("");
        setEditCategory(CATEGORIES[0]);
      }

      function handleSaveEdit(product: UserProduct) {
        const trimmedName = editName.trim();

        if (!trimmedName) {
          window.alert("상품명을 입력해주세요.");
          return;
        }

        if (
          isDuplicateProduct(
            trimmedName,
            product.id
          )
        ) {
          window.alert("이미 등록된 상품명입니다.");
          return;
        }

        updateUserProduct(product.id, {
          name: trimmedName,
          category: editCategory,
        });

        handleCancelEdit();
        refreshProducts();
      }
      
      function handleDelete(product: UserProduct) {
        const confirmed = window.confirm(
          "정말 삭제하시겠습니까?"
        );

        if (!confirmed) return;

        deleteUserProduct(product.id);

        if (editingProductId === product.id) {
          handleCancelEdit();
        }

        refreshProducts();
      }
  
    return (
      <main className="app">
        <header className="hero">
  <p className="hero-badge">
    편의점 보충진열
  </p>

  <h1>사용자 상품 관리</h1>

  <p className="hero-desc">
    등록한 사용자 상품을 수정하거나 삭제할 수 있습니다.
  </p>
</header>

<section className="card">
  <label className="field">
    <span>상품 검색</span>

    <input
      type="text"
      placeholder="상품명을 입력하세요"
      value={keyword}
      onChange={(e) =>
        handleSearch(e.target.value)
      }
    />
  </label>
</section>

<section className="user-products-list">
{products.length === 0 ? (
  <p className="empty-state">
    {keyword.trim()
      ? "검색 결과가 없습니다."
      : "등록된 사용자 상품이 없습니다."}
  </p>
) : (
  products.map((product) => (
    <div key={product.id}>
      <UserProductCard
        product={product}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />

      {editingProductId === product.id && (
        <section className="card">
          <label className="field">
            <span>상품명</span>

            <input
              type="text"
              value={editName}
              onChange={(e) =>
                setEditName(e.target.value)
              }
            />
          </label>

          <label className="field">
            <span>카테고리</span>

            <select
              value={editCategory}
              onChange={(e) =>
                setEditCategory(
                  e.target.value as (typeof CATEGORIES)[number]
                )
              }
            >
              {CATEGORIES.map((category) => (
                <option
                  key={category}
                  value={category}
                >
                  {category}
                </option>
              ))}
            </select>
          </label>

          <div className="user-product-actions">
            <button
              type="button"
              onClick={() =>
                handleSaveEdit(product)
              }
            >
              저장
            </button>

            <button
              type="button"
              onClick={handleCancelEdit}
            >
              취소
            </button>
          </div>
        </section>
      )}
    </div>
  ))
)}
</section>
    </main>
  );
}
