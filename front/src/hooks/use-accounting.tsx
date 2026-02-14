'use client';

import type { AccountingSummary, IncomeSlip, ExpenseSlip, SalesSlip } from '@/types/accounting';

// ダミーフック（API不要）
export function useAccountingList() {
  return { data: [] as AccountingSummary[], isLoading: false, error: null };
}

export function useAccountingById(_id: string) {
  return { data: null as AccountingSummary | null, isLoading: false, error: null };
}

export function useIncomeSlips(_startDate?: string, _endDate?: string) {
  return { data: [] as IncomeSlip[], isLoading: false, error: null };
}

export function useAccountingSummary(_startDate?: string, _endDate?: string) {
  return { data: [] as AccountingSummary[], isLoading: false, error: null };
}

export function useExpenseSlips(_startDate?: string, _endDate?: string) {
  return { data: [] as ExpenseSlip[], isLoading: false, error: null };
}

export function useSalesSlips(_startDate?: string, _endDate?: string) {
  return { data: [] as SalesSlip[], isLoading: false, error: null };
}
