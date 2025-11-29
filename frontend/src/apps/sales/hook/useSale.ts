import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { requestApi } from 'utils/functions/requestApi';
import { ISale } from '../types/saleTypes';

/* =====================================================
   ✅ GET ALL SALES
===================================================== */
export const useSales = () => {
  return useQuery({
    queryKey: ['sales'],
    queryFn: async () => {
      return await requestApi.get<ISale[]>('api/sales');
    },
    enabled: true
  });
};

/* =====================================================
   ✅ GET ONE SALE BY ID
===================================================== */
export const useSale = (id?: number) => {
  return useQuery({
    queryKey: ['sale', id],
    queryFn: async () => {
      if (!id) return null;
      return await requestApi.get<ISale>(`api/sales/${id}`);
    },
    enabled: !!id
  });
};

/* =====================================================
   ✅ CREATE SALE (BULK)
===================================================== */
export const useCreateSale = () => {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: async (data: Omit<ISale, 'id' | 'customerName'>) => {
      return await requestApi.post<ISale>('api/sales/bulk-create', data);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['sales'] });
    }
  });
};

/* =====================================================
   ✅ UPDATE SALE (BULK)
===================================================== */
export const useUpdateSale = () => {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, data }: { id: number; data: Partial<ISale> }) => {
      return await requestApi.put<ISale>(`api/sales/bulk-update`, { id, ...data });
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['sales'] });
      qc.invalidateQueries({ queryKey: ['sale'] });
    }
  });
};

/* =====================================================
   ✅ RETURN SALE (BULK)
===================================================== */
export const useReturnSale = () => {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: async (data: Omit<ISale, 'id' | 'customerName'>) => {
      return await requestApi.post<ISale>('api/sales/return/bulk-create', data);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['sales'] });
    }
  });
};

/* =====================================================
   ✅ DELETE SALE
===================================================== */
export const useDeleteSale = () => {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: async (id: number) => {
      await requestApi.delete(`api/sales/${id}`);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['sales'] });
    }
  });
};