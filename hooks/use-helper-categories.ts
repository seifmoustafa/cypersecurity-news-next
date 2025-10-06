import { useState, useEffect } from "react";
import { container } from "@/core/di/container";
import type { HelperCategory, HelperCategoriesResponse, Helper, HelpersResponse } from "@/core/domain/models/helper";

export function useHelperCategories(page = 1, pageSize = 10, search?: string) {
  const [categories, setCategories] = useState<HelperCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState<HelperCategoriesResponse["pagination"] | null>(null);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await container.services.helper.getAllCategories(page, pageSize, search);
        setCategories(response.data);
        setPagination(response.pagination);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to fetch helper categories");
        console.error("Error fetching helper categories:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, [page, pageSize, search]);

  const refetch = () => {
    const fetchCategories = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await container.services.helper.getAllCategories(page, pageSize, search);
        setCategories(response.data);
        setPagination(response.pagination);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to fetch helper categories");
        console.error("Error fetching helper categories:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  };

  return { categories, loading, error, pagination, refetch };
}

export function useHelperCategoryById(id: string) {
  const [category, setCategory] = useState<HelperCategory | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCategory = async () => {
      if (!id) return;
      
      try {
        setLoading(true);
        setError(null);
        const response = await container.services.helper.getCategoryById(id);
        setCategory(response);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to fetch helper category");
        console.error("Error fetching helper category:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchCategory();
  }, [id]);

  return { category, loading, error };
}

export function useHelpersByCategory(categoryId: string, page = 1, pageSize = 10, search?: string) {
  const [helpers, setHelpers] = useState<Helper[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState<HelpersResponse["pagination"] | null>(null);

  useEffect(() => {
    const fetchHelpers = async () => {
      if (!categoryId) return;
      
      try {
        setLoading(true);
        setError(null);
        const response = await container.services.helper.getHelpersByCategory(categoryId, page, pageSize, search);
        setHelpers(response.data);
        setPagination(response.pagination);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to fetch helpers");
        console.error("Error fetching helpers:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchHelpers();
  }, [categoryId, page, pageSize, search]);

  const refetch = () => {
    const fetchHelpers = async () => {
      if (!categoryId) return;
      
      try {
        setLoading(true);
        setError(null);
        const response = await container.services.helper.getHelpersByCategory(categoryId, page, pageSize, search);
        setHelpers(response.data);
        setPagination(response.pagination);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to fetch helpers");
        console.error("Error fetching helpers:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchHelpers();
  };

  return { helpers, loading, error, pagination, refetch };
}

export function useHelperById(id: string) {
  const [helper, setHelper] = useState<Helper | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchHelper = async () => {
      if (!id) return;
      
      try {
        setLoading(true);
        setError(null);
        const response = await container.services.helper.getHelperById(id);
        setHelper(response);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to fetch helper");
        console.error("Error fetching helper:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchHelper();
  }, [id]);

  return { helper, loading, error };
}
