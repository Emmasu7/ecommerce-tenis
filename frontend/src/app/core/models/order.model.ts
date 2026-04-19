export type OrderStatus = 'EnProceso' | 'Pagado' | 'Enviado' | 'Entregado';

export interface OrderItem {
  id: number;
  productId: number;
  productName: string;
  productCode: string;
  quantity: number;
  unitPrice: number;
  subtotal: number;
}

export interface Order {
  id: number;
  userId: number;
  userFullName: string;
  status: OrderStatus;
  totalAmount: number;
  shippingAddress: string;
  createdAt: string;
  updatedAt: string;
  items: OrderItem[];
}

export interface CreateOrderRequest {
  shippingAddress: string;
  items: { productId: number; quantity: number }[];
}
