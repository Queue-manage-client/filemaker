'use client';

import { sampleCustomers } from '@/data/customerSampleData';

// ダミーフック（API不要、サンプルデータ使用）
export function useCustomerList() {
  return { data: sampleCustomers, isLoading: false, error: null };
}

export function useCustomerById(id: string) {
  const customer = sampleCustomers.find(c => c.id === id) || null;
  return { data: customer, isLoading: false, error: null };
}
