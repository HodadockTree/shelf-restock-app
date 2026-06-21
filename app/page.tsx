"use client";

import { useEffect, useState } from "react";
import ItemForm from "@/components/ItemForm";
import RestockChecklist from "@/components/RestockChecklist";
import { loadItems, saveItems } from "@/lib/storage";
import type { NewRestockItem, RestockItem } from "@/lib/types";

export default function Home() {
  const [items, setItems] = useState<RestockItem[]>([]);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setItems(loadItems());
    setReady(true);
  }, []);

  useEffect(() => {
    if (ready) saveItems(items);
  }, [items, ready]);

  const addItem = (input: NewRestockItem) => {
  const item: RestockItem = {
    ...input,
    id: Date.now().toString(),
    checked: false,
    outOfStock: false,
  };
    setItems((prev) => [item, ...prev]);
  };

  const toggleItem = (id: string) => {
    setItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, checked: !item.checked } : item))
    );
  };

  const toggleOutOfStock = (id: string) => {
    setItems((prev) =>
      prev.map((item) =>
        item.id === id
          ? { ...item, outOfStock: !item.outOfStock }
          : item
      )
    );
  };

  const deleteItem = (id: string) => {
    setItems((prev) => prev.filter((item) => item.id !== id));
  };

  const clearCompleted = () => {
    setItems((prev) => prev.filter((item) => !item.checked));
  };

  const resetAll = () => {
    if (items.length === 0) return;
    if (window.confirm("체크리스트를 모두 삭제할까요?")) {
      setItems([]);
    }
  };

  if (!ready) {
    return (
      <main className="app">
        <p className="loading-text">불러오는 중...</p>
      </main>
    );
  }

  return (
    <main className="app">
      <header className="hero">
        <p className="hero-badge">편의점 보충진열</p>
        <h1>보충진열<br />체크리스트</h1>
        <p className="hero-desc">
          매대를 돌며 필요한 상품을 적고, 보충할 때마다 체크하세요. 목록은 이 기기에 저장됩니다.
        </p>
      </header>

      <ItemForm onAdd={addItem} />

      <RestockChecklist
        items={items}
        onToggle={toggleItem}
        onToggleOutOfStock={toggleOutOfStock}
        onDelete={deleteItem}
        onClearCompleted={clearCompleted}
        onReset={resetAll}
      />
    </main>
  );
}
