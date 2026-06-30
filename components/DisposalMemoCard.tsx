import type { DisposalMemo } from "@/lib/types";

type DisposalMemoCardProps = {
  memo: DisposalMemo;
  onDelete: (id: string) => void;
};

export default function DisposalMemoCard({
  memo,
  onDelete,
}: DisposalMemoCardProps) {
  return (
    <li className="disposal-item">
      {memo.imageDataUrl ? (
        <img
          src={memo.imageDataUrl}
          alt=""
          className="disposal-thumb"
        />
      ) : (
        <div
          className="disposal-thumb disposal-thumb--empty"
          aria-hidden="true"
        >
          메모
        </div>
      )}

      <div className="disposal-body">
        {memo.memo ? (
          <p className="disposal-memo">
            {memo.memo}
          </p>
        ) : (
          <p className="disposal-memo disposal-memo--empty">
            사진만 저장됨
          </p>
        )}

        <time
          className="disposal-time"
          dateTime={memo.createdAt}
        >
          {formatCreatedAt(memo.createdAt)}
        </time>
      </div>

      <button
        type="button"
        className="delete-btn"
        onClick={() => onDelete(memo.id)}
        aria-label="폐기 메모 삭제"
      >
        ×
      </button>
    </li>
  );
}

function formatCreatedAt(createdAt: string) {
  const date = new Date(createdAt);

  if (Number.isNaN(date.getTime())) {
    return createdAt;
  }

  return new Intl.DateTimeFormat("ko-KR", {
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
}
