export type ProductSize = 'S7' | 'S8' | 'S9' | 'S10';
export type ProductColor = 'Blanco' | 'Negro' | 'Gris';

export const PRODUCT_SIZE_MAP: Record<ProductSize, number> = {
  S7: 7,
  S8: 8,
  S9: 9,
  S10: 10,
};

export const PRODUCT_COLOR_MAP: Record<ProductColor, number> = {
  Blanco: 1,
  Negro: 2,
  Gris: 3,
};

export interface Product {
  id: number;
  code: string;
  name: string;
  description: string;
  size: string;
  color: string;
  price: number;
  stock: number;
  imageUrl: string;
  isActive: boolean;
  createdAt: string;
}

export interface ProductFilter {
  minPrice?: number;
  maxPrice?: number;
  search?: string;
  size?: ProductSize;
  color?: ProductColor;
  page?: number;
  pageSize?: number;
}

export interface CreateProductRequest {
  code: string;
  name: string;
  description: string;
  size: number;
  color: number;
  price: number;
  stock: number;
  imageUrl: string;
}

export interface UpdateProductRequest {
  name?: string;
  description?: string;
  size?: number;
  color?: number;
  price?: number;
  stock?: number;
  imageUrl?: string;
  isActive?: boolean;
}
