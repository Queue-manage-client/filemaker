'use client';

import { employeeSampleData } from '@/data/employeeSampleData';

// ダミーフック（API不要、サンプルデータ使用）
export function useEmployeeList() {
  return { data: employeeSampleData, isLoading: false, error: null };
}

export function useEmployeeById(id: string) {
  const employee = employeeSampleData.find(e => e.id === id) || null;
  return { data: employee, isLoading: false, error: null };
}
