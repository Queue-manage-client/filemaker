'use client';

// 従業員データ管理用カスタムフック
// React Queryを使用してデータの状態管理を行う

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { employeeService } from '@/services/employee-service';
import { EmployeeWeeklyShift } from '@/types/employee';

// クエリキー定数
const QUERY_KEYS = {
  EMPLOYEE_SALARIES: 'employee-salaries',
  EMPLOYEE_SALARY_DETAIL: 'employee-salary-detail',
  PART_TIME_SALARIES: 'part-time-salaries',
  EMPLOYEE_WEEKLY_SHIFTS: 'employee-weekly-shifts',
} as const;

// 従業員給与一覧取得フック
export function useEmployeeSalaries(year?: number, month?: number) {
  return useQuery({
    queryKey: [QUERY_KEYS.EMPLOYEE_SALARIES, year, month],
    queryFn: () => employeeService.getEmployeeSalaries(year, month),
    staleTime: 5 * 60 * 1000, // 5分間キャッシュ
  });
}

// 従業員給与詳細取得フック
export function useEmployeeSalaryById(id: string) {
  return useQuery({
    queryKey: [QUERY_KEYS.EMPLOYEE_SALARY_DETAIL, id],
    queryFn: () => employeeService.getEmployeeSalaryById(id),
    enabled: !!id,
    staleTime: 5 * 60 * 1000,
  });
}

// パートタイム給与一覧取得フック
export function usePartTimeSalaries(year?: number, month?: number) {
  return useQuery({
    queryKey: [QUERY_KEYS.PART_TIME_SALARIES, year, month],
    queryFn: () => employeeService.getPartTimeSalaries(year, month),
    staleTime: 5 * 60 * 1000,
  });
}

// 従業員週間シフト取得フック
export function useEmployeeWeeklyShifts(weekStartDate: string, weekEndDate: string) {
  return useQuery({
    queryKey: [QUERY_KEYS.EMPLOYEE_WEEKLY_SHIFTS, weekStartDate, weekEndDate],
    queryFn: () => employeeService.getEmployeeWeeklyShifts(weekStartDate, weekEndDate),
    staleTime: 2 * 60 * 1000, // 2分間キャッシュ（スケジュールは頻繁に更新される）
  });
}

// 従業員週間シフト更新ミューテーション
export function useUpdateEmployeeWeeklyShift() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, shift }: { id: string; shift: Partial<EmployeeWeeklyShift> }) =>
      employeeService.updateEmployeeWeeklyShift(id, shift),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.EMPLOYEE_WEEKLY_SHIFTS],
      });
    },
  });
}

// 従業員週間シフト一括更新ミューテーション
export function useUpdateEmployeeWeeklyShifts() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (updates: Array<{ id: string; shift: Partial<EmployeeWeeklyShift> }>) =>
      employeeService.updateEmployeeWeeklyShifts(updates),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.EMPLOYEE_WEEKLY_SHIFTS],
      });
    },
  });
}

