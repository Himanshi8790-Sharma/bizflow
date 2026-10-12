


import { api } from "../lib/api";
import { CreateCustomerInput, Customer, CustomerResponse, CustomersResponse, DeleteCustomerResponse, UpdateCustomerInput } from "../types/customer.types";

export const customerService = {
  // Get customers with pagination
  async getCustomers(
    page = 1,
    limit = 10,
  ): Promise<CustomersResponse> {
    const response = await api.get<CustomersResponse>("/customers", {
      params: { page, limit },
    });

    return response.data;
  },

  // Get a single customer
  async getCustomerById(id: string): Promise<Customer> {
    const response = await api.get<CustomerResponse>(
      `/customers/${id}`,
    );

    return response.data.data;
  },

  // Create a customer
  async createCustomer(
    data: CreateCustomerInput,
  ): Promise<Customer> {
    const response = await api.post<CustomerResponse>(
      "/customers",
      data,
    );

    return response.data.data;
  },

  // Update a customer
  async updateCustomer(
    id: string,
    data: UpdateCustomerInput,
  ): Promise<Customer> {
    const response = await api.patch<CustomerResponse>(
      `/customers/${id}`,
      data,
    );

    return response.data.data;
  },

  // Soft-delete a customer
  async deleteCustomer(
    id: string,
  ): Promise<DeleteCustomerResponse> {
    const response = await api.delete<DeleteCustomerResponse>(
      `/customers/${id}`,
    );

    return response.data;
  },
};