import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { requestApi } from 'utils/functions/requestApi';
import { ICustomer, IPaymentStatus } from './commonDropdownTypes';

export const useCustomers = () => {
  return useQuery({
    queryKey: ['customers'],
    queryFn: async () => {
      return await requestApi.get<ICustomer[]>('api/parties/customers');
    },
    enabled: true
  });
};

export const useCurrency = () => {
  return useQuery({
    queryKey: ['currency'],
    queryFn: async () => {
      return await requestApi.get<ICustomer[]>('api/core/currencies');
    },
    enabled: true
  });
};

export const usePaymentStatus = () => {
  return useQuery({
    queryKey: ['payment-status'],
    queryFn: async () => {
      return await requestApi.get<IPaymentStatus[]>('api/core/payment-status');
    },
    enabled: true
  });
};
