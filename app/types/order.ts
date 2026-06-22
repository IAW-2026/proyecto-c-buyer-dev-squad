
export interface OrderItem {
  id: string;
  productId: string;
  name: string;
  imageUrl: string;
  sellerId: string;
  quantity: number;
  price: number;
  size: number;
  color: string;
}

export type OrderStatusType = "PENDING" | "PAID" | "SHIPPED" | "DELIVERED";

export interface Order {
  id: string;
  total: number;
  discount: number;
  shipping: number;
  address: string | null;
  originAddress: string | null;
  status: OrderStatusType;
  createdAt: Date;
  user: {
    firstName?: string | null;
    lastName?: string | null;
    email: string;
  };
  items: OrderItem[];
}