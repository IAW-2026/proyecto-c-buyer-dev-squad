// types/order.ts
export interface OrderItem {
  productId: string;
  name: string;
  quantity: number;
  price: number;
  size: number;
  color: string;
}
export type OrderStatusType = "PENDING" | "PAID" | "SHIPPED" | "DELIVERED";