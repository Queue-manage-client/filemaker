'use client';

// ダミーフック（API不要）
export function useAccountingList() {
  return { data: [], isLoading: false, error: null };
}

export function useAccountingById(id: string) {
  return { data: null, isLoading: false, error: null };
}
