import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { requestApi } from 'utils/functions/requestApi';
import { IBikeModel } from '../types/bikeModelTypes';

/* =====================================================
   ✅ GET ALL BIKE MODELS
===================================================== */
export const useBikeModels = () => {
  return useQuery({
    queryKey: ['bikeModels'],
    queryFn: async () => {
      return await requestApi.get<IBikeModel[]>('api/inventory/bike-models');
    },
    enabled: true
  });
};

/* =====================================================
   ✅ GET ONE BIKE MODEL BY ID
===================================================== */
export const useBikeModel = (id?: number) => {
  return useQuery({
    queryKey: ['bikeModel', id],
    queryFn: async () => {
      if (!id) return null;
      return await requestApi.get<IBikeModel>(`api/inventory/bike-models/${id}`);
    },
    enabled: !!id
  });
};

/* =====================================================
   ✅ CREATE BIKE MODEL
===================================================== */
export const useCreateBikeModel = () => {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: async (data: Omit<IBikeModel, 'id' | 'companyName'>) => {
      return await requestApi.post<IBikeModel>('api/inventory/bike-models', data);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['bikeModels'] });
    }
  });
};

/* =====================================================
   ✅ UPDATE BIKE MODEL
===================================================== */
export const useUpdateBikeModel = () => {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, data }: { id: number; data: Partial<IBikeModel> }) => {
      return await requestApi.put<IBikeModel>(`api/inventory/bike-models/${id}`, data);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['bikeModels'] });
      qc.invalidateQueries({ queryKey: ['bikeModel'] });
    }
  });
};

/* =====================================================
   ✅ DELETE BIKE MODEL
===================================================== */
export const useDeleteBikeModel = () => {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: async (id: number) => {
      await requestApi.delete(`api/inventory/bike-models/${id}`);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['bikeModels'] });
    }
  });
};