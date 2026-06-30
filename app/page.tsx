"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import ItemForm from "@/components/ItemForm";
import PreviousChecklist from "@/components/PreviousChecklist";
import RestockChecklist from "@/components/RestockChecklist";
import {
  loadItems,
  saveItems,
  clearPreviousChecklist,
  loadPreviousChecklist,
  savePreviousChecklist,
  loadUnresolvedItems,
  saveUnresolvedItems,
} from "@/lib/storage";

import type {
  NewRestockItem,
  RestockItem,
  UnresolvedItem,
} from "@/lib/types";

export default function Home() {
const [items, setItems] =
  useState<RestockItem[]>([]);

const [unresolvedItems, setUnresolvedItems] =
  useState<UnresolvedItem[]>([]);

const [previousItems, setPreviousItems] =
  useState<RestockItem[]>([]);

const [ready, setReady] =
  useState(false);

const itemsRef = useRef<RestockItem[]>([]);

  useEffect(() => {
    const savedItems = loadItems();
    setItems(savedItems);
    itemsRef.current = savedItems;
    setPreviousItems(
      loadPreviousChecklist()
    );
    setUnresolvedItems(
      loadUnresolvedItems()
    );
    setReady(true);
  }, []);

  useEffect(() => {
    if (ready) {
      saveItems(items);
    }
    itemsRef.current = items;
  }, [items, ready]);

  useEffect(() => {
    if (ready) {
      saveUnresolvedItems(
        unresolvedItems
      );
    }
  }, [unresolvedItems, ready]);

  const addItem = (input: NewRestockItem) => {
    const normalizedName = normalizeProductName(
      input.productName
    );

    if (!normalizedName) return;

    const exists = itemsRef.current.some((item) =>
      normalizeProductName(
        getItemProductName(item)
      ) === normalizedName
    );

    if (exists) {
      window.alert("이미 체크리스트에 있는 상품입니다.");
      return;
    }

    const item: RestockItem = {
      ...input,
      id: Date.now().toString(),
      checked: false,
      outOfStock: false,
    };

    setItems((prev) => {
      const alreadyExists = prev.some(
        (currentItem) =>
          normalizeProductName(
            getItemProductName(currentItem)
          ) === normalizedName
      );

      if (alreadyExists) return prev;

      const nextItems = [item, ...prev];
      itemsRef.current = nextItems;

      return nextItems;
    });
  };

  const toggleItem = (id: string) => {
    setItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, checked: !item.checked } : item))
    );
  };

  const toggleOutOfStock = (id: string) => {
    setItems((prev) =>
      prev.map((item) => {
        if (item.id !== id) return item;
  
        const nextOutOfStock = !item.outOfStock;
  
        if (nextOutOfStock) {
          setUnresolvedItems((current) => {
            const exists = current.some(
              (u) => u.productName === item.productName
            );
  
            if (exists) return current;
  
            return [
              ...current,
              {
                productName: item.productName,
                category: item.category,
              },
            ];
          });
        }
  
        return {
          ...item,
          outOfStock: nextOutOfStock,
          checked: nextOutOfStock,
        };
      })
    );
  };

  const addUnresolvedItem = (
    item: UnresolvedItem
  ) => {
    const newItem: RestockItem = {
      id: Date.now().toString(),
      productName: item.productName,
      category: item.category,
      quantity: 1,
      checked: false,
      outOfStock: false,
    };
  
    setItems((prev) => [newItem, ...prev]);
  
    setUnresolvedItems((prev) =>
      prev.filter(
        (target) =>
          target.productName !== item.productName
      )
    );
  };
  
  const deleteUnresolvedItem = (
    productName: string
  ) => {
    setUnresolvedItems((prev) =>
      prev.filter(
        (item) =>
          item.productName !== productName
      )
    );
  };

  const deleteItem = (id: string) => {
    setItems((prev) => prev.filter((item) => item.id !== id));
  };

  const createRestoredItem = (
    item: RestockItem
  ): RestockItem => ({
    ...item,
    id: crypto.randomUUID(),
    checked: false,
    outOfStock: false,
  });

  const getItemProductName = (
    item: RestockItem
  ) => {
    const legacyItem = item as RestockItem & {
      name?: string;
      title?: string;
    };

    return (
      legacyItem.productName ??
      legacyItem.name ??
      legacyItem.title ??
      ""
    );
  };

  const normalizeProductName = (name: string) =>
    name
      .normalize("NFKC")
      .trim()
      .replace(/\s+/g, " ")
      .toLowerCase();

  const addPreviousItems = (
    targets: RestockItem[]
  ) => {
    const existingNames = new Set(
      itemsRef.current.map((item) =>
        normalizeProductName(
          getItemProductName(item)
        )
      )
    );

    const restoredItems = targets
      .filter((item) => {
        const normalizedName = normalizeProductName(
          getItemProductName(item)
        );

        if (
          !normalizedName ||
          existingNames.has(normalizedName)
        ) {
          return false;
        }

        existingNames.add(normalizedName);
        return true;
      })
      .map(createRestoredItem);

    if (restoredItems.length > 0) {
      setItems((prev) => {
        const existingPrevNames = new Set(
          prev.map((item) =>
            normalizeProductName(
              getItemProductName(item)
            )
          )
        );

        const finalRestoredItems = restoredItems.filter(
          (item) => {
            const normalizedName = normalizeProductName(
              getItemProductName(item)
            );

            if (
              !normalizedName ||
              existingPrevNames.has(normalizedName)
            ) {
              return false;
            }

            existingPrevNames.add(normalizedName);
            return true;
          }
        );

        const nextItems = [
          ...finalRestoredItems,
          ...prev,
        ];

        itemsRef.current = nextItems;

        return nextItems;
      });
    }

    return {
      addedCount: restoredItems.length,
      skippedCount:
        targets.length - restoredItems.length,
    };
  };

  const loadAllPreviousItems = () => {
    return addPreviousItems(previousItems);
  };

  const loadSelectedPreviousItems = (
    ids: string[]
  ) => {
    const selectedIdSet = new Set(ids);
    return addPreviousItems(
      previousItems.filter((item) =>
        selectedIdSet.has(item.id)
      )
    );
  };

  const saveCurrentAsPrevious = () => {
    savePreviousChecklist(items);
    setPreviousItems(items);
  };

  const deletePreviousChecklist = () => {
    clearPreviousChecklist();
    setPreviousItems([]);
  };

  const deletePreviousChecklistItem = (
    id: string
  ) => {
    setPreviousItems((prev) => {
      const nextItems = prev.filter(
        (item) => item.id !== id
      );

      savePreviousChecklist(nextItems);

      return nextItems;
    });
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

        <Link
          href="/user-products"
          className="text-btn"
          style={{
            display: "inline-flex",
            marginTop: "14px",
            minHeight: "44px",
            alignItems: "center",
          }}
        >
          상품 관리
        </Link>
        <Link
          href="/disposal-memos"
          className="text-btn"
          style={{
            display: "inline-flex",
            marginTop: "14px",
            marginLeft: "16px",
            minHeight: "44px",
            alignItems: "center",
          }}
        >
          폐기 메모
        </Link>
      </header>

      <ItemForm onAdd={addItem} />

      <PreviousChecklist
        items={previousItems}
        onLoadAll={loadAllPreviousItems}
        onLoadSelected={loadSelectedPreviousItems}
        onDeletePrevious={deletePreviousChecklist}
        onDeleteItem={deletePreviousChecklistItem}
      />

      <RestockChecklist
        items={items}
        onToggle={toggleItem}
        onToggleOutOfStock={toggleOutOfStock}
        onDelete={deleteItem}
        onSaveCurrent={saveCurrentAsPrevious}
        onClearCompleted={clearCompleted}
        onReset={resetAll}
      />
    </main>
  );
}

