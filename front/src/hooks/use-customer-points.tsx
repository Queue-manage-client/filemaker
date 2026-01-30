'use client';

// ダミーフック（API不要）
export function useCustomerPointsList() {
  return { data: [], isLoading: false, error: null };
}

export function useCustomerPointsById(id: string) {
  return { data: null, isLoading: false, error: null };
}
