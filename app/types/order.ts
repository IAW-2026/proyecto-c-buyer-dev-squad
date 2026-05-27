import { Product } from "./product";

// types/order.ts
export interface OrderItem {
  id: string;
  productId: string;

  quantity: number;
  price: number;

  size: number;
  color: string;

  product: Pick<Product, "name" | "image">;
}
export type OrderStatusType = "PENDING" | "PAID" | "SHIPPED" | "DELIVERED";
export interface Order {
  id: string;
  total: number;
  status: OrderStatusType;
  createdAt: Date;

  user: {
    firstName?: string | null;
    lastName?: string | null;
    email: string;
  };

  items: OrderItem[];
}