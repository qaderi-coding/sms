import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { requestApi } from 'utils/functions/requestApi';
import { IProduct } from '../types/productTypes';

/* =====================================================
   ✅ GET ALL PRODUCTS
===================================================== */
export const useProducts = () => {
  return useQuery({
    queryKey: ['products'],
    queryFn: async () => {
      return await requestApi.get<IProduct[]>('api/inventory/products');
    },
    enabled: true
  });
};

/* =====================================================
   ✅ GET ONE PRODUCT BY ID
===================================================== */
export const useProduct = (id?: number) => {
  return useQuery({
    queryKey: ['product', id],
    queryFn: async () => {
      if (!id) return null;
      return await requestApi.get<IProduct>(`api/inventory/products/${id}`);
    },
    enabled: !!id
  });
};

/* =====================================================
   ✅ CREATE PRODUCT
===================================================== */
export const useCreateProduct = () => {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: async (data: Omit<IProduct, 'id' | 'categoryName' | 'companyName' | 'bikeModelName' | 'baseUnitName'>) => {
      return await requestApi.post<IProduct>('api/inventory/products', data);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['products'] });
    }
  });
};

/* =====================================================
   ✅ UPDATE PRODUCT
===================================================== */
export const useUpdateProduct = () => {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, data }: { id: number; data: Partial<IProduct> }) => {
      return await requestApi.put<IProduct>(`api/inventory/products/${id}`, data);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['products'] });
      qc.invalidateQueries({ queryKey: ['product'] });
    }
  });
};

/* =====================================================
   ✅ DELETE PRODUCT
===================================================== */
export const useDeleteProduct = () => {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: async (id: number) => {
      await requestApi.delete(`api/inventory/products/${id}`);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['products'] });
    }
  });
};