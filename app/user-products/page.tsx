"use client";

import { useEffect, useState } from "react";
import {
    deleteUserProduct,
    getUserProducts,
    searchUserProducts,
  } from "@/lib/products";
import UserProductCard from "@/components/UserProductCard";
import type { UserProduct } from "@/lib/types";

export default function UserProductsPage() {
    const [products, setProducts] =
      useState<UserProduct[]>([]);

    const [keyword, setKeyword] =
        useState("");
  
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
        console.log("수정", product);
      }
      
      function handleDelete(product: UserProduct) {
        const confirmed = window.confirm(
          "정말 삭제하시겠습니까?"
        );

        if (!confirmed) return;

        deleteUserProduct(product.id);
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
    <UserProductCard
      key={product.id}
      product={product}
      onEdit={handleEdit}
      onDelete={handleDelete}
    />
  ))
)}
</section>
    </main>
  );
}