// types/order.ts
export interface OrderItem {
  productId: string;
  name: string;
  quantity: number;
  price: number;
  size: number;
  color: string;
}
export type orderStatus = "PENDING" | "PAID" | "SHIPPED" | "DELIVERED";