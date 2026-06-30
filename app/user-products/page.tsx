"use client";

import Link from "next/link";
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
      const initialKeyword = new URLSearchParams(
        window.location.search
      ).get("keyword") ?? "";

      setKeyword(initialKeyword);

      if (initialKeyword.trim()) {
        setProducts(
          searchUserProducts(initialKeyword)
        );
        return;
      }

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
  <Link
    href="/"
    className="back-icon-btn"
    aria-label="체크리스트로 돌아가기"
    title="체크리스트로 돌아가기"
  >
    ←
  </Link>

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
    <UserProductCard
      key={product.id}
      product={product}
      isEditing={editingProductId === product.id}
      editName={editName}
      editCategory={editCategory}
      onEdit={handleEdit}
      onDelete={handleDelete}
      onEditNameChange={setEditName}
      onEditCategoryChange={setEditCategory}
      onSaveEdit={handleSaveEdit}
      onCancelEdit={handleCancelEdit}
    />
  ))
)}
</section>
    </main>
  );
}
