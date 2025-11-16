import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { requestApi } from 'utils/functions/requestApi';
import { IProductUnitConversion } from '../types/productUnitConversionTypes';

/* =====================================================
   ✅ GET ALL PRODUCT UNIT CONVERSIONS
===================================================== */
export const useProductUnitConversions = () => {
  return useQuery({
    queryKey: ['productUnitConversions'],
    queryFn: async () => {
      return await requestApi.get<IProductUnitConversion[]>('api/inventory/product-unit-conversions');
    },
    enabled: true
  });
};

/* =====================================================
   ✅ GET ONE PRODUCT UNIT CONVERSION BY ID
===================================================== */
export const useProductUnitConversion = (id?: number) => {
  return useQuery({
    queryKey: ['productUnitConversion', id],
    queryFn: async () => {
      if (!id) return null;
      return await requestApi.get<IProductUnitConversion>(`api/inventory/product-unit-conversions/${id}`);
    },
    enabled: !!id
  });
};

/* =====================================================
   ✅ CREATE PRODUCT UNIT CONVERSION
===================================================== */
export const useCreateProductUnitConversion = () => {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: async (data: Omit<IProductUnitConversion, 'id' | 'productName' | 'unitName'>) => {
      return await requestApi.post<IProductUnitConversion>('api/inventory/product-unit-conversions', data);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['productUnitConversions'] });
    }
  });
};

/* =====================================================
   ✅ UPDATE PRODUCT UNIT CONVERSION
===================================================== */
export const useUpdateProductUnitConversion = () => {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, data }: { id: number; data: Partial<IProductUnitConversion> }) => {
      return await requestApi.put<IProductUnitConversion>(`api/inventory/product-unit-conversions/${id}`, data);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['productUnitConversions'] });
      qc.invalidateQueries({ queryKey: ['productUnitConversion'] });
    }
  });
};

/* =====================================================
   ✅ DELETE PRODUCT UNIT CONVERSION
===================================================== */
export const useDeleteProductUnitConversion = () => {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: async (id: number) => {
      await requestApi.delete(`api/inventory/product-unit-conversions/${id}`);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['productUnitConversions'] });
    }
  });
};