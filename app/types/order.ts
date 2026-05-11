export interface OrderItem {
  id: string;
  productId: string;
  name: string;
  quantity: number;
  price: number;
  size?: number;
  color?: string;
}

export interface Order {
  id: string;
  items: OrderItem[];
  total: number;
  status: "pending" | "completed" | "cancelled";
  createdAt: string;
}