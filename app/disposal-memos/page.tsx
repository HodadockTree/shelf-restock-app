"use client";

import Link from "next/link";
import {
  ChangeEvent,
  FormEvent,
  useEffect,
  useRef,
  useState,
} from "react";
import DisposalMemoCard from "@/components/DisposalMemoCard";
import {
  addDisposalMemo,
  deleteDisposalMemo,
  getDisposalMemos,
} from "@/lib/disposalMemos";
import type { DisposalMemo } from "@/lib/types";

export default function DisposalMemosPage() {
  const [memos, setMemos] = useState<DisposalMemo[]>([]);
  const [imageDataUrl, setImageDataUrl] = useState("");
  const [memo, setMemo] = useState("");
  const [ready, setReady] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setMemos(getDisposalMemos());
    setReady(true);
  }, []);

  const handleImageChange = async (
    event: ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];

    if (!file) {
      setImageDataUrl("");
      return;
    }

    const resizedImage = await resizeImage(file);
    setImageDataUrl(resizedImage);
  };

  const handleSubmit = (
    event: FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    const trimmedMemo = memo.trim();

    if (!imageDataUrl && !trimmedMemo) {
      window.alert("사진이나 메모 중 하나는 입력해주세요.");
      return;
    }

    setMemos(
      addDisposalMemo({
        imageDataUrl,
        memo: trimmedMemo,
      })
    );

    setImageDataUrl("");
    setMemo("");

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleDelete = (id: string) => {
    const confirmed = window.confirm(
      "이 폐기 메모를 삭제할까요?"
    );

    if (!confirmed) return;

    setMemos(deleteDisposalMemo(id));
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
        <Link
          href="/"
          className="back-icon-btn"
          aria-label="보충진열 화면으로 돌아가기"
          title="보충진열 화면으로 돌아가기"
        >
          ←
        </Link>

        <p className="hero-badge">폐기 메모</p>
        <h1>사진으로 남기는<br />폐기 확인 메모</h1>
        <p className="hero-desc">
          폐기 예정 상품이나 다음 근무자가 확인해야 할 상품을 간단히 남겨두세요.
        </p>
      </header>

      <section className="card">
        <h2 className="section-title">메모 추가</h2>
        <p className="section-desc">
          사진만 남기거나, 메모만 남길 수도 있습니다.
        </p>

        <form className="disposal-form" onSubmit={handleSubmit}>
          <label className="field">
            <span>사진</span>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              capture="environment"
              onChange={handleImageChange}
            />
          </label>

          {imageDataUrl && (
            <img
              src={imageDataUrl}
              alt="선택한 폐기 메모 사진"
              className="disposal-preview"
            />
          )}

          <label className="field">
            <span>메모</span>
            <textarea
              value={memo}
              onChange={(event) =>
                setMemo(event.target.value)
              }
              placeholder="예: 내일 오전 폐기, 다음 근무자 확인"
              rows={3}
            />
          </label>

          <button
            type="submit"
            className="primary-btn"
            disabled={!imageDataUrl && !memo.trim()}
          >
            폐기 메모 저장
          </button>
        </form>
      </section>

      <section className="card">
        <div className="checklist-header">
          <div>
            <h2 className="section-title">저장된 메모</h2>
            {memos.length > 0 && (
              <p className="checklist-subtitle">
                총 {memos.length}개 메모
              </p>
            )}
          </div>
        </div>

        {memos.length === 0 ? (
          <p className="empty-state">
            아직 저장된 폐기 메모가 없습니다.
          </p>
        ) : (
          <ul className="disposal-list">
            {memos.map((item) => (
              <DisposalMemoCard
                key={item.id}
                memo={item}
                onDelete={handleDelete}
              />
            ))}
          </ul>
        )}
      </section>
    </main>
  );
}

function resizeImage(file: File): Promise<string> {
  return new Promise((resolve) => {
    const reader = new FileReader();

    reader.onload = () => {
      const originalDataUrl =
        typeof reader.result === "string"
          ? reader.result
          : "";

      if (!originalDataUrl) {
        resolve("");
        return;
      }

      const image = new Image();

      image.onload = () => {
        const maxSize = 1280;
        const scale = Math.min(
          1,
          maxSize / Math.max(image.width, image.height)
        );
        const width = Math.round(image.width * scale);
        const height = Math.round(image.height * scale);
        const canvas = document.createElement("canvas");

        canvas.width = width;
        canvas.height = height;

        const context = canvas.getContext("2d");

        if (!context) {
          resolve(originalDataUrl);
          return;
        }

        context.drawImage(image, 0, 0, width, height);
        resolve(canvas.toDataURL("image/jpeg", 0.78));
      };

      image.onerror = () => resolve(originalDataUrl);
      image.src = originalDataUrl;
    };

    reader.onerror = () => resolve("");
    reader.readAsDataURL(file);
  });
}
