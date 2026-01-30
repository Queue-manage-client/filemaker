'use client';

import { storeBasicInfoSampleData } from '@/data/storeLedgerSampleData';

// ダミーフック（API不要、サンプルデータ使用）
export function useStoreList() {
  return { data: storeBasicInfoSampleData, isLoading: false, error: null };
}

export function useStoreById(id: string) {
  const store = storeBasicInfoSampleData.find(s => s.id === id) || null;
  return { data: store, isLoading: false, error: null };
}
