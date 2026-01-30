'use client';

import { hostessSampleData } from '@/data/hostessSampleData';

// ダミーフック（API不要、サンプルデータ使用）
export function useHostessList() {
  return { data: hostessSampleData, isLoading: false, error: null };
}

export function useHostessById(id: string) {
  const hostess = hostessSampleData.find(h => h.id === id) || null;
  return { data: hostess, isLoading: false, error: null };
}
