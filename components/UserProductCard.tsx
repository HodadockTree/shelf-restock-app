import type { UserProduct } from "@/lib/types";

type UserProductCardProps = {
  product: UserProduct;
  onEdit: (product: UserProduct) => void;
  onDelete: (product: UserProduct) => void;
};

export default function UserProductCard({
  product,
  onEdit,
  onDelete,
}: UserProductCardProps) {
  return (
    <article className="card">
      <h2 className="user-product-title">
        {product.name}
      </h2>

      <p className="user-product-category">
        {product.category}
      </p>

      <div className="user-product-actions">
        <button onClick={() => onEdit(product)}>
          수정
        </button>

        <button onClick={() => onDelete(product)}>
          삭제
        </button>
      </div>
    </article>
  );
}