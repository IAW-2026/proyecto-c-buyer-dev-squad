"use server";

import { getProducts } from "../services/Products.service";

export async function fetchProductsAction({
  page,
  limit,
  category,
  brand,
  minPrice,
  maxPrice,
  search,
}: {
  page: number;
  limit: number;
  category?: string;
  brand?: string;
  minPrice?: number;
  maxPrice?: number;
  search?: string;
}) {
  return getProducts({ page, limit, category, brand, minPrice, maxPrice, search });
}