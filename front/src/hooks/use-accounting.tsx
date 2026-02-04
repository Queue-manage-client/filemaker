'use client';

import type { AccountingSummary, IncomeSlip, ExpenseSlip, SalesSlip } from '@/types/accounting';

// ダミーフック（API不要）
export function useAccountingList() {
  return { data: [] as AccountingSummary[], isLoading: false, error: null };
}

export function useAccountingById(id: string) {
  return { data: null as AccountingSummary | null, isLoading: false, error: null };
}

export function useIncomeSlips(startDate?: string, endDate?: string) {
  return { data: [] as IncomeSlip[], isLoading: false, error: null };
}

export function useAccountingSummary(startDate?: string, endDate?: string) {
  return { data: [] as AccountingSummary[], isLoading: false, error: null };
}

export function useExpenseSlips(startDate?: string, endDate?: string) {
  return { data: [] as ExpenseSlip[], isLoading: false, error: null };
}

export function useSalesSlips(startDate?: string, endDate?: string) {
  return { data: [] as SalesSlip[], isLoading: false, error: null };
}
