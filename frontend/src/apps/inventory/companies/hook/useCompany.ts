import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { requestApi } from 'utils/functions/requestApi';
import { ICompany } from '../types/companyTypes';

/* =====================================================
   ✅ GET ALL COMPANIES
===================================================== */
export const useCompanies = () => {
  return useQuery({
    queryKey: ['companies'],
    queryFn: async () => {
      return await requestApi.get<ICompany[]>('api/inventory/companies');
    },
    enabled: true
  });
};

/* =====================================================
   ✅ GET ONE COMPANY BY ID
===================================================== */
export const useCompany = (id?: number) => {
  return useQuery({
    queryKey: ['company', id],
    queryFn: async () => {
      if (!id) return null;
      return await requestApi.get<ICompany>(`api/inventory/companies/${id}`);
    },
    enabled: !!id
  });
};

/* =====================================================
   ✅ CREATE COMPANY
===================================================== */
export const useCreateCompany = () => {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: async (data: Omit<ICompany, 'id'>) => {
      return await requestApi.post<ICompany>('api/inventory/companies', data);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['companies'] });
    }
  });
};

/* =====================================================
   ✅ UPDATE COMPANY
===================================================== */
export const useUpdateCompany = () => {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, data }: { id: number; data: Partial<ICompany> }) => {
      return await requestApi.put<ICompany>(`api/inventory/companies/${id}`, data);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['companies'] });
      qc.invalidateQueries({ queryKey: ['company'] });
    }
  });
};

/* =====================================================
   ✅ DELETE COMPANY
===================================================== */
export const useDeleteCompany = () => {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: async (id: number) => {
      await requestApi.delete(`api/inventory/companies/${id}`);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['companies'] });
    }
  });
};