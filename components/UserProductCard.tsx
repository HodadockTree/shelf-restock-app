import { CATEGORIES } from "@/lib/categories";
import type { UserProduct } from "@/lib/types";

type UserProductCardProps = {
  product: UserProduct;
  isEditing: boolean;
  editName: string;
  editCategory: (typeof CATEGORIES)[number];
  onEdit: (product: UserProduct) => void;
  onDelete: (product: UserProduct) => void;
  onEditNameChange: (name: string) => void;
  onEditCategoryChange: (
    category: (typeof CATEGORIES)[number]
  ) => void;
  onSaveEdit: (product: UserProduct) => void;
  onCancelEdit: () => void;
};

export default function UserProductCard({
  product,
  isEditing,
  editName,
  editCategory,
  onEdit,
  onDelete,
  onEditNameChange,
  onEditCategoryChange,
  onSaveEdit,
  onCancelEdit,
}: UserProductCardProps) {
  return (
    <article
      className={`card user-product-card ${
        isEditing ? "user-product-card--editing" : ""
      }`}
    >
      {isEditing ? (
        <>
          <div className="user-product-edit-header">
            <h2 className="user-product-title">
              상품 수정
            </h2>
            <span className="user-product-edit-badge">
              수정 중
            </span>
          </div>

          <label className="field">
            <span>상품명</span>

            <input
              type="text"
              value={editName}
              onChange={(e) =>
                onEditNameChange(e.target.value)
              }
            />
          </label>

          <label className="field">
            <span>카테고리</span>

            <select
              value={editCategory}
              onChange={(e) =>
                onEditCategoryChange(
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
              className="user-product-action-btn user-product-action-btn--primary"
              onClick={() => onSaveEdit(product)}
            >
              저장
            </button>

            <button
              type="button"
              className="user-product-action-btn user-product-action-btn--secondary"
              onClick={onCancelEdit}
            >
              취소
            </button>
          </div>
        </>
      ) : (
        <>
          <h2 className="user-product-title">
            {product.name}
          </h2>

          <p className="user-product-category">
            {product.category}
          </p>

          <div className="user-product-actions">
            <button
              type="button"
              className="user-product-action-btn user-product-action-btn--secondary"
              onClick={() => onEdit(product)}
            >
              수정
            </button>

            <button
              type="button"
              className="user-product-action-btn user-product-action-btn--danger"
              onClick={() => onDelete(product)}
            >
              삭제
            </button>
          </div>
        </>
      )}
    </article>
  );
}
