'use client';

import { staffSampleList } from '@/data/staffSampleData';
import { sampleStaffLedger } from '@/data/employeeSampleData';
import { staffLedgerSampleData } from '@/data/staffLedgerSampleData';

// ダミーフック（API不要、サンプルデータ使用）
export function useStaffList() {
  return { data: staffSampleList, isLoading: false, error: null };
}

export function useStaffById(id: string) {
  const staff = sampleStaffLedger.find(s => s.id === id) || null;
  return { data: staff, isLoading: false, error: null };
}

export function useStaffLedger() {
  return { data: staffLedgerSampleData, isLoading: false, error: null };
}
