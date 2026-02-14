'use client';

import { sampleHostessLedger, sampleHostessManagers, sampleHostessRanking } from '@/data/hostessSampleData';

// ダミーフック（API不要、サンプルデータ使用）
export function useHostessList() {
  return { data: sampleHostessLedger, isLoading: false, error: null };
}

export function useHostessById(id: string) {
  const hostess = sampleHostessLedger.find(h => h.id === id) || null;
  return { data: hostess, isLoading: false, error: null };
}

export function useHostessLedger() {
  return { data: sampleHostessLedger, isLoading: false, error: null };
}

export function useHostessManagers() {
  return { data: sampleHostessManagers, isLoading: false, error: null };
}

export function useHostessRanking(_period?: string) {
  return { data: sampleHostessRanking, isLoading: false, error: null };
}
