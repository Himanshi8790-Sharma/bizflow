import { api } from "../lib/api";
import type {
  Product,
  CreateProductInput,
  UpdateProductInput,
  ProductResponse,
  ProductsResponse,
} from "../types/product.types";

export const productService = {
  // Get products with pagination
  async getProducts(
    page = 1,
    limit = 10,
  ): Promise<ProductsResponse> {
    const response = await api.get<ProductsResponse>("/products", {
      params: { page, limit },
    });

    return response.data;
  },

  // Get a single product
  async getProductById(id: string): Promise<Product> {
    const response = await api.get<ProductResponse>(
      `/products/${id}`,
    );

    return response.data.data;
  },

  // Create a product
  async createProduct(
    data: CreateProductInput,
  ): Promise<Product> {
    const response = await api.post<ProductResponse>(
      "/products",
      data,
    );

    return response.data.data;
  },

  // Update a product
  async updateProduct(
    id: string,
    data: UpdateProductInput,
  ): Promise<Product> {
    const response = await api.patch<ProductResponse>(
      `/products/${id}`,
      data,
    );

    return response.data.data;
  },

  // Soft-delete a product
  async deleteProduct(
    id: string,
  ): Promise<{ success: boolean; message: string }> {
    const response = await api.delete<{
      success: boolean;
      message: string;
    }>(`/products/${id}`);

    return response.data;
  },
};