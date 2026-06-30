import type { DisposalMemo } from "./types";

const DISPOSAL_MEMOS_STORAGE_KEY = "disposal-memos";

type AddDisposalMemoInput = {
  imageDataUrl: string;
  memo: string;
};

export function getDisposalMemos(): DisposalMemo[] {
  if (typeof window === "undefined") return [];

  try {
    const raw = localStorage.getItem(
      DISPOSAL_MEMOS_STORAGE_KEY
    );

    if (!raw) return [];

    const parsed = JSON.parse(raw);

    return Array.isArray(parsed)
      ? parsed.filter(isDisposalMemo)
      : [];
  } catch {
    return [];
  }
}

export function addDisposalMemo(
  input: AddDisposalMemoInput
): DisposalMemo[] {
  const newMemo: DisposalMemo = {
    id: crypto.randomUUID(),
    imageDataUrl: input.imageDataUrl,
    memo: input.memo,
    createdAt: new Date().toISOString(),
  };

  const nextMemos = [
    newMemo,
    ...getDisposalMemos(),
  ];

  saveDisposalMemos(nextMemos);

  return nextMemos;
}

export function deleteDisposalMemo(
  id: string
): DisposalMemo[] {
  const nextMemos = getDisposalMemos().filter(
    (memo) => memo.id !== id
  );

  saveDisposalMemos(nextMemos);

  return nextMemos;
}

function saveDisposalMemos(
  memos: DisposalMemo[]
): void {
  localStorage.setItem(
    DISPOSAL_MEMOS_STORAGE_KEY,
    JSON.stringify(memos)
  );
}

function isDisposalMemo(
  value: unknown
): value is DisposalMemo {
  if (!value || typeof value !== "object") {
    return false;
  }

  const memo = value as DisposalMemo;

  return (
    typeof memo.id === "string" &&
    typeof memo.imageDataUrl === "string" &&
    typeof memo.memo === "string" &&
    typeof memo.createdAt === "string"
  );
}
