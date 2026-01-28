'use client';

// 会計データ管理用カスタムフック
// React Queryを使用してデータの状態管理を行う

import { useQuery } from '@tanstack/react-query';
import { accountingService } from '@/services/accounting-service';

// クエリキー定数
const QUERY_KEYS = {
  ACCOUNTING_SUMMARY: 'accounting-summary',
  INCOME_SLIPS: 'income-slips',
  EXPENSE_SLIPS: 'expense-slips',
  SALES_SLIPS: 'sales-slips',
} as const;

// 会計集計データ取得フック
export function useAccountingSummary(startDate?: string, endDate?: string) {
  return useQuery({
    queryKey: [QUERY_KEYS.ACCOUNTING_SUMMARY, startDate, endDate],
    queryFn: () => accountingService.getAccountingSummary(startDate, endDate),
    staleTime: 5 * 60 * 1000, // 5分間キャッシュ
  });
}

// 収支伝票取得フック
export function useIncomeSlips(startDate?: string, endDate?: string) {
  return useQuery({
    queryKey: [QUERY_KEYS.INCOME_SLIPS, startDate, endDate],
    queryFn: () => accountingService.getIncomeSlips(startDate, endDate),
    staleTime: 5 * 60 * 1000,
  });
}

// 支出伝票取得フック
export function useExpenseSlips(startDate?: string, endDate?: string) {
  return useQuery({
    queryKey: [QUERY_KEYS.EXPENSE_SLIPS, startDate, endDate],
    queryFn: () => accountingService.getExpenseSlips(startDate, endDate),
    staleTime: 5 * 60 * 1000,
  });
}

// 売上伝票取得フック
export function useSalesSlips(startDate?: string, endDate?: string) {
  return useQuery({
    queryKey: [QUERY_KEYS.SALES_SLIPS, startDate, endDate],
    queryFn: () => accountingService.getSalesSlips(startDate, endDate),
    staleTime: 5 * 60 * 1000,
  });
}

