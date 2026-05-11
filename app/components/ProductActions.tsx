"use client";

import { useState } from "react";
import SizeSelector from "./SizeSelector";
import AddToCartButton from "./AddToCartButton";

type Props = {
  sizes: number[];
  productId: string;
};

export default function ProductActions({ sizes, productId }: Props) {
  const [selectedSize, setSelectedSize] = useState<number | null>(null);

  return (
    <>
      <SizeSelector
        sizes={sizes}
        selected={selectedSize}
        onSelect={setSelectedSize}
      />
      <div className="mt-6 flex gap-3">
        <AddToCartButton
          productId={productId}
          selectedSize={selectedSize}
        />
      </div>
    </>
  );
}