'use client';

import { staffSampleData } from '@/data/staffSampleData';

// ダミーフック（API不要、サンプルデータ使用）
export function useStaffList() {
  return { data: staffSampleData, isLoading: false, error: null };
}

export function useStaffById(id: string) {
  const staff = staffSampleData.find(s => s.id === id) || null;
  return { data: staff, isLoading: false, error: null };
}
