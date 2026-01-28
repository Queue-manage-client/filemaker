'use client';

// 顧客データ管理用カスタムフック
// React Queryを使用してデータの状態管理を行う

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { customerService } from '@/services/customer-service';
import { Customer } from '@/types';

// クエリキー定数
const QUERY_KEYS = {
  CUSTOMERS: 'customers',
  CUSTOMER_DETAIL: 'customer-detail',
  CUSTOMER_SEARCH: 'customer-search',
  CUSTOMER_VEHICLES: 'customer-vehicles',
  CUSTOMER_USAGE_HISTORY: 'customer-usage-history',
} as const;

// 顧客一覧取得フック
export function useCustomers() {
  return useQuery({
    queryKey: [QUERY_KEYS.CUSTOMERS],
    queryFn: () => customerService.getCustomers(),
    staleTime: 5 * 60 * 1000, // 5分間キャッシュ
  });
}

// 顧客詳細取得フック
export function useCustomerById(id: string) {
  return useQuery({
    queryKey: [QUERY_KEYS.CUSTOMER_DETAIL, id],
    queryFn: () => customerService.getCustomerById(id),
    enabled: !!id,
    staleTime: 5 * 60 * 1000,
  });
}

// 顧客検索フック
export function useSearchCustomers(query: string) {
  return useQuery({
    queryKey: [QUERY_KEYS.CUSTOMER_SEARCH, query],
    queryFn: () => customerService.searchCustomers(query),
    enabled: query.length > 0,
    staleTime: 2 * 60 * 1000, // 2分間キャッシュ
  });
}

// 顧客の車両情報取得フック
export function useCustomerVehicles(customerId: string) {
  return useQuery({
    queryKey: [QUERY_KEYS.CUSTOMER_VEHICLES, customerId],
    queryFn: () => customerService.getCustomerVehicles(customerId),
    enabled: !!customerId,
    staleTime: 5 * 60 * 1000,
  });
}

// 顧客の利用履歴取得フック
export function useCustomerUsageHistory(customerId: string, startDate?: string, endDate?: string) {
  return useQuery({
    queryKey: [QUERY_KEYS.CUSTOMER_USAGE_HISTORY, customerId, startDate, endDate],
    queryFn: () => customerService.getCustomerUsageHistory(customerId, startDate, endDate),
    enabled: !!customerId,
    staleTime: 5 * 60 * 1000,
  });
}

// 顧客作成ミューテーション
export function useCreateCustomer() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (customer: Omit<Customer, 'id'>) =>
      customerService.createCustomer(customer),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.CUSTOMERS],
      });
    },
  });
}

// 顧客更新ミューテーション
export function useUpdateCustomer() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, updates }: { id: string; updates: Partial<Customer> }) =>
      customerService.updateCustomer(id, updates),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.CUSTOMERS],
      });
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.CUSTOMER_DETAIL, variables.id],
      });
    },
  });
}

// 顧客削除ミューテーション
export function useDeleteCustomer() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => customerService.deleteCustomer(id),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.CUSTOMERS],
      });
    },
  });
}

