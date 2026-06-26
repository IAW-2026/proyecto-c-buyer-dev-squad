"use client";

import { useState } from "react";
import SizeSelector from "./SizeSelector";
import ColorSelector from "./ColorSelector";
import AddToCartButton from "./AddToCartButton";

type Props = {
  sizes: number[];
  colors: string[];
  productId: string;
};

export default function ProductActions({ sizes, colors, productId }: Props) {
  const [selectedSize, setSelectedSize] = useState<number | null>(null);
  const [selectedColor, setSelectedColor] = useState<string | null>(null);

  return (
    <>
      <SizeSelector
        sizes={sizes}
        selected={selectedSize}
        onSelect={setSelectedSize}
      />
      <ColorSelector
        colors={colors}
        selected={selectedColor}
        onSelect={setSelectedColor}
      />
      <div className="mt-3 flex gap-2">
        <AddToCartButton
          productId={productId}
          selectedSize={selectedSize}
          selectedColor={selectedColor}
        />
      </div>
    </>
  );
}