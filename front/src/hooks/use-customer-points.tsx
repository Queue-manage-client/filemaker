'use client';

import type { CustomerPoints } from '@/types/customer';

// ダミーフック（API不要）
export function useCustomerPointsList() {
  return { data: [] as CustomerPoints[], isLoading: false, error: null };
}

export function useCustomerPointsById(_id: string) {
  return { data: null as CustomerPoints | null, isLoading: false, error: null };
}

export function useCustomerPoints() {
  return { data: [] as CustomerPoints[], isLoading: false, error: null };
}
