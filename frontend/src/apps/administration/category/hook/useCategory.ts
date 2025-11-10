// hooks/useCategoryApi.ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { requestApi } from 'utils/functions/requestApi';
import { ICategory } from '../types/categoryTypes';

/* =====================================================
   ✅ GET ALL CATEGORIES
===================================================== */
export const useCategories = () => {
  return useQuery({
    queryKey: ['categories'],
    queryFn: async () => {
      return await requestApi.get<ICategory[]>('api/inventory/categories');
    },
    enabled: true
  });
};

/* =====================================================
   ✅ GET ONE CATEGORY BY ID
===================================================== */
export const useCategory = (id?: number) => {
  return useQuery({
    queryKey: ['category', id],
    queryFn: async () => {
      if (!id) return null;
      return await requestApi.get<ICategory>(`api/inventory/categories/${id}`);
    },
    enabled: !!id
  });
};

/* =====================================================
   ✅ CREATE CATEGORY
===================================================== */
export const useCreateCategory = () => {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: async (data: Omit<ICategory, 'id' | 'created_at' | 'updated_at'>) => {
      return await requestApi.post<ICategory>('api/inventory/categories', data);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['categories'] });
    }
  });
};

/* =====================================================
   ✅ UPDATE CATEGORY
===================================================== */
export const useUpdateCategory = () => {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, data }: { id: number; data: Partial<ICategory> }) => {
      return await requestApi.put<ICategory>(`api/inventory/categories/${id}`, data);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['categories'] });
      qc.invalidateQueries({ queryKey: ['category'] });
    }
  });
};

/* =====================================================
   ✅ DELETE CATEGORY
===================================================== */
export const useDeleteCategory = () => {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: async (id: number) => {
      await requestApi.delete(`api/inventory/categories/${id}`);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['categories'] });
    }
  });
};
