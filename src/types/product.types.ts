export interface Product {
  id: string;
  organizationId: string;
  name: string;
  sku: string | null;
  description: string | null;
  price: number;
  costPrice: number | null;
  stockQuantity: number;
  lowStockLimit: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
}

export interface CreateProductInput {
  name: string;
  sku?: string | null;
  description?: string | null;
  price: number;
  costPrice?: number | null;
  stockQuantity?: number;
  lowStockLimit?: number;
}

export interface UpdateProductInput {
  name?: string;
  sku?: string | null;
  description?: string | null;
  price?: number;
  costPrice?: number | null;
  stockQuantity?: number;
  lowStockLimit?: number;
}

export interface ProductPagination {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface ProductsResponse {
  success: boolean;
  products: Product[];
  pagination: ProductPagination;
}

export interface ProductResponse {
  success: boolean;
  message?: string;
  data: Product;
}