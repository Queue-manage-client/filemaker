'use client';

// 顧客ポイントデータ管理用カスタムフック
// React Queryを使用してデータの状態管理を行う

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { customerPointsService } from '@/services/customer-points-service';

// クエリキー定数
const QUERY_KEYS = {
  CUSTOMER_POINTS: 'customer-points',
  CUSTOMER_POINTS_DETAIL: 'customer-points-detail',
  POINT_HISTORY: 'point-history',
} as const;

// 顧客ポイント一覧取得フック
export function useCustomerPoints() {
  return useQuery({
    queryKey: [QUERY_KEYS.CUSTOMER_POINTS],
    queryFn: () => customerPointsService.getCustomerPoints(),
    staleTime: 5 * 60 * 1000, // 5分間キャッシュ
  });
}

// 顧客ポイント詳細取得フック
export function useCustomerPointsById(customerId: string) {
  return useQuery({
    queryKey: [QUERY_KEYS.CUSTOMER_POINTS_DETAIL, customerId],
    queryFn: () => customerPointsService.getCustomerPointsById(customerId),
    enabled: !!customerId,
    staleTime: 5 * 60 * 1000,
  });
}

// ポイント履歴取得フック
export function usePointHistory(customerId: string, startDate?: string, endDate?: string) {
  return useQuery({
    queryKey: [QUERY_KEYS.POINT_HISTORY, customerId, startDate, endDate],
    queryFn: () => customerPointsService.getPointHistory(customerId, startDate, endDate),
    enabled: !!customerId,
    staleTime: 5 * 60 * 1000,
  });
}

// ポイント付与ミューテーション
export function useAddPoints() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ customerId, points, reason }: { customerId: string; points: number; reason: string }) =>
      customerPointsService.addPoints(customerId, points, reason),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.CUSTOMER_POINTS],
      });
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.CUSTOMER_POINTS_DETAIL, variables.customerId],
      });
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.POINT_HISTORY, variables.customerId],
      });
    },
  });
}

// ポイント使用ミューテーション
export function useUsePoints() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ customerId, points, reason }: { customerId: string; points: number; reason: string }) =>
      customerPointsService.usePoints(customerId, points, reason),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.CUSTOMER_POINTS],
      });
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.CUSTOMER_POINTS_DETAIL, variables.customerId],
      });
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.POINT_HISTORY, variables.customerId],
      });
    },
  });
}

// ポイント調整ミューテーション
export function useAdjustPoints() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ customerId, points, reason }: { customerId: string; points: number; reason: string }) =>
      customerPointsService.adjustPoints(customerId, points, reason),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.CUSTOMER_POINTS],
      });
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.CUSTOMER_POINTS_DETAIL, variables.customerId],
      });
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.POINT_HISTORY, variables.customerId],
      });
    },
  });
}

