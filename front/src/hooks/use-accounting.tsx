'use client';

// ダミーフック（API不要）
export function useAccountingList() {
  return { data: [], isLoading: false, error: null };
}

export function useAccountingById(id: string) {
  return { data: null, isLoading: false, error: null };
}

export function useIncomeSlips(startDate?: string, endDate?: string) {
  return { data: [], isLoading: false, error: null };
}

export function useAccountingSummary(startDate?: string, endDate?: string) {
  return { data: [], isLoading: false, error: null };
}

export function useExpenseSlips(startDate?: string, endDate?: string) {
  return { data: [], isLoading: false, error: null };
}

export function useSalesSlips(startDate?: string, endDate?: string) {
  return { data: [], isLoading: false, error: null };
}
