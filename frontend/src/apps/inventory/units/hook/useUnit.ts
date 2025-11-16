import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { requestApi } from 'utils/functions/requestApi';
import { IUnit } from '../types/unitTypes';

/* =====================================================
   ✅ GET ALL UNITS
===================================================== */
export const useUnits = () => {
  return useQuery({
    queryKey: ['units'],
    queryFn: async () => {
      return await requestApi.get<IUnit[]>('api/inventory/units');
    },
    enabled: true
  });
};

/* =====================================================
   ✅ GET ONE UNIT BY ID
===================================================== */
export const useUnit = (id?: number) => {
  return useQuery({
    queryKey: ['unit', id],
    queryFn: async () => {
      if (!id) return null;
      return await requestApi.get<IUnit>(`api/inventory/units/${id}`);
    },
    enabled: !!id
  });
};

/* =====================================================
   ✅ CREATE UNIT
===================================================== */
export const useCreateUnit = () => {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: async (data: Omit<IUnit, 'id'>) => {
      return await requestApi.post<IUnit>('api/inventory/units', data);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['units'] });
    }
  });
};

/* =====================================================
   ✅ UPDATE UNIT
===================================================== */
export const useUpdateUnit = () => {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, data }: { id: number; data: Partial<IUnit> }) => {
      return await requestApi.put<IUnit>(`api/inventory/units/${id}`, data);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['units'] });
      qc.invalidateQueries({ queryKey: ['unit'] });
    }
  });
};

/* =====================================================
   ✅ DELETE UNIT
===================================================== */
export const useDeleteUnit = () => {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: async (id: number) => {
      await requestApi.delete(`api/inventory/units/${id}`);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['units'] });
    }
  });
};