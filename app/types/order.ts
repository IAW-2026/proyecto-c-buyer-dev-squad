
export interface OrderItem {
  id: string;

  productId: string;

  name: string;
  image: string;

  quantity: number;
  price: number;

  size: number;
  color: string;
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