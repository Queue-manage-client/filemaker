'use client';

import { sampleEmployeeSalaries, sampleEmployeeWeeklyShifts } from '@/data/employeeSampleData';

// ダミーフック（API不要、サンプルデータ使用）
export function useEmployeeList() {
  return { data: sampleEmployeeSalaries, isLoading: false, error: null };
}

export function useEmployeeById(id: string) {
  const employee = sampleEmployeeSalaries.find(e => e.id === id) || null;
  return { data: employee, isLoading: false, error: null };
}

export function useEmployeeWeeklyShifts(_startDate?: string, _endDate?: string) {
  return { data: sampleEmployeeWeeklyShifts, isLoading: false, error: null };
}
