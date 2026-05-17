// app/types/product.ts
export interface Product {
  id: string;
  name: string;
  price: number;
  image: string;
  brand: string;
  category: string;
  description: string;
  colors: string[];
  sizes: number[];
}