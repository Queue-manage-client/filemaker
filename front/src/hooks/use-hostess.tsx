'use client';

// ホステスデータ管理用カスタムフック
// React Queryを使用してデータの状態管理を行う

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { hostessService } from '@/services/hostess-service';
import { HostessLedger } from '@/types/hostess';
import { HostessScheduleData } from '@/types/hostess';

// クエリキー定数
const QUERY_KEYS = {
  HOSTESS_LEDGER: 'hostess-ledger',
  HOSTESS_DETAIL: 'hostess-detail',
  HOSTESS_RANKING: 'hostess-ranking',
  HOSTESS_MANAGERS: 'hostess-managers',
  HOSTESS_SCHEDULES: 'hostess-schedules',
} as const;

// ホステス台帳一覧取得フック
export function useHostessLedger() {
  return useQuery({
    queryKey: [QUERY_KEYS.HOSTESS_LEDGER],
    queryFn: () => hostessService.getHostessLedger(),
    staleTime: 5 * 60 * 1000, // 5分間キャッシュ
  });
}

// ホステス詳細取得フック
export function useHostessById(id: string) {
  return useQuery({
    queryKey: [QUERY_KEYS.HOSTESS_DETAIL, id],
    queryFn: () => hostessService.getHostessById(id),
    enabled: !!id,
    staleTime: 5 * 60 * 1000,
  });
}

// ホステスランキング取得フック
export function useHostessRanking(period: 'monthly' | 'weekly' | 'yearly' = 'monthly', startDate?: string, endDate?: string) {
  return useQuery({
    queryKey: [QUERY_KEYS.HOSTESS_RANKING, period, startDate, endDate],
    queryFn: () => hostessService.getHostessRanking(period, startDate, endDate),
    staleTime: 5 * 60 * 1000,
  });
}

// ホステスマネージャー一覧取得フック
export function useHostessManagers() {
  return useQuery({
    queryKey: [QUERY_KEYS.HOSTESS_MANAGERS],
    queryFn: () => hostessService.getHostessManagers(),
    staleTime: 5 * 60 * 1000,
  });
}

// ホステススケジュール取得フック
export function useHostessSchedules(weekStartDate: string, weekEndDate: string) {
  return useQuery({
    queryKey: [QUERY_KEYS.HOSTESS_SCHEDULES, weekStartDate, weekEndDate],
    queryFn: () => hostessService.getHostessSchedules(weekStartDate, weekEndDate),
    staleTime: 2 * 60 * 1000, // 2分間キャッシュ（スケジュールは頻繁に更新される）
  });
}

// ホステス作成ミューテーション
export function useCreateHostess() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (hostess: Omit<HostessLedger, 'id'>) =>
      hostessService.createHostess(hostess),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.HOSTESS_LEDGER],
      });
    },
  });
}

// ホステス更新ミューテーション
export function useUpdateHostess() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, updates }: { id: string; updates: Partial<HostessLedger> }) =>
      hostessService.updateHostess(id, updates),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.HOSTESS_LEDGER],
      });
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.HOSTESS_DETAIL, variables.id],
      });
    },
  });
}

// ホステス削除ミューテーション
export function useDeleteHostess() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => hostessService.deleteHostess(id),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.HOSTESS_LEDGER],
      });
    },
  });
}

// ホステススケジュール更新ミューテーション
export function useUpdateHostessSchedule() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, schedule }: { id: string; schedule: Partial<HostessScheduleData> }) =>
      hostessService.updateHostessSchedule(id, schedule),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.HOSTESS_SCHEDULES],
      });
    },
  });
}

