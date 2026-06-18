import Link from "next/link";
import type { Seller } from "../types/seller";
import { SellerPopover } from "./SellerPopover";
import CartButton from "./CartButton";

export default function SellerInfo({
  seller,
  productId,
}: {
  seller: Seller;
  productId: string;
}) {
  return (
    <div className="mt-auto flex gap-3 flex-wrap items-center">
      <SellerPopover seller={seller} />
      <Link
      href={`${process.env.NEXT_PUBLIC_FEEDBACK_URL}/explorar/producto/${productId}`}
      className="btn-secondary text-sm px-4 py-2 rounded-xl">
        ⭐ Ver reseñas
      </Link>
      <CartButton />
    </div>
  );
}
