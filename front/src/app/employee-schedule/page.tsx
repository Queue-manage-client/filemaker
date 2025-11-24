'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowLeft, ChevronLeft, ChevronRight, Search, Calendar, Users, FileText, Calculator, BookOpen, Plus, Edit, Check } from "lucide-react";
import type { DailyShift, EmployeeWeeklyShift } from '@/types/employee';
import { sampleEmployeeWeeklyShifts } from '@/data/employeeSampleData';
import { useEmployeeWeeklyShifts, useUpdateEmployeeWeeklyShift, useUpdateEmployeeWeeklyShifts } from '@/hooks/use-employee';

// 今週の日付を取得する関数
const getCurrentWeekDates = (baseDate: Date = new Date()) => {
  const today = new Date(baseDate);
  const dayOfWeek = today.getDay(); // 0 = Sunday, 1 = Monday, etc.
  const mondayOffset = dayOfWeek === 0 ? -6 : 1 - dayOfWeek; // Monday start

  const monday = new Date(today);
  monday.setDate(today.getDate() + mondayOffset);

  const dates = [];
  for (let i = 0; i < 7; i++) {
    const date = new Date(monday);
    date.setDate(monday.getDate() + i);
    dates.push(date);
  }
  return dates;
};

// タブのタイプ定義
type TabType = 'weekly_schedule' | 'attendance_registration' | 'shift_print' | 'registration_list' | 'monthly_summary';

export default function EmployeeSchedule() {
  const router = useRouter();
  const [currentWeekStart, setCurrentWeekStart] = useState(new Date());
  const [weekDates, setWeekDates] = useState<Date[]>([]);
  const [activeTab, setActiveTab] = useState<TabType>('weekly_schedule');
  const [searchQuery, setSearchQuery] = useState('');
  const [editingRowId, setEditingRowId] = useState<string | null>(null);
  const [filterDepartment, setFilterDepartment] = useState<string>('');
  const [filterPosition, setFilterPosition] = useState<string>('');
  const [isEditAll, setIsEditAll] = useState(false);

  useEffect(() => {
    document.title = '従業員スケジュール管理 - Dispatch Harmony Hub';
  }, []);

  useEffect(() => {
    setWeekDates(getCurrentWeekDates(currentWeekStart));
  }, [currentWeekStart]);

  // 週の開始日と終了日を計算
  const weekStartDateStr = useMemo(() => {
    if (weekDates.length === 0) return '';
    const date = weekDates[0];
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
  }, [weekDates]);

  const weekEndDateStr = useMemo(() => {
    if (weekDates.length === 0) return '';
    const date = weekDates[6];
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
  }, [weekDates]);

  // React Queryを使用してデータ取得（フォールバックとしてサンプルデータを使用）
  const { data: shiftsData = sampleEmployeeWeeklyShifts, isLoading, error } = useEmployeeWeeklyShifts(
    weekStartDateStr || '2025-01-27',
    weekEndDateStr || '2025-02-02'
  );
  
  const updateShift = useUpdateEmployeeWeeklyShift();
  const updateShiftsBatch = useUpdateEmployeeWeeklyShifts();

  const navigateWeek = (direction: 'prev' | 'next') => {
    const newDate = new Date(currentWeekStart);
    newDate.setDate(currentWeekStart.getDate() + (direction === 'next' ? 7 : -7));
    setCurrentWeekStart(newDate);
  };

  const goToCurrentWeek = () => {
    setCurrentWeekStart(new Date());
  };

  const formatDate = (date: Date) => {
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${month}/${day}`;
  };

  const getDayName = (date: Date) => {
    const days = ['日', '月', '火', '水', '木', '金', '土'];
    return days[date.getDay()];
  };

  const departmentOptions = useMemo(() => {
    const set = new Set<string>();
    shiftsData.forEach(s => { if (s.department) set.add(s.department); });
    return Array.from(set);
  }, [shiftsData]);

  const positionOptions = useMemo(() => {
    const set = new Set<string>();
    shiftsData.forEach(s => { if (s.position) set.add(s.position); });
    return Array.from(set);
  }, [shiftsData]);

  const filteredShifts = useMemo(() => {
    return shiftsData.filter(shift => {
      const matchesSearch = shift.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        shift.employeeNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
        shift.position.toLowerCase().includes(searchQuery.toLowerCase());
      if (!matchesSearch) return false;
      if (filterDepartment && shift.department !== filterDepartment) return false;
      if (filterPosition && shift.position !== filterPosition) return false;
      return true;
    });
  }, [shiftsData, searchQuery, filterDepartment, filterPosition]);

  const tabConfig = [
    { key: 'weekly_schedule', label: '従業員週間出勤予定', icon: Calendar },
    { key: 'attendance_registration', label: '出勤表登録', icon: Users },
    { key: 'shift_print', label: 'シフト表印刷', icon: FileText },
    { key: 'registration_list', label: '登録情報一覧', icon: BookOpen },
    { key: 'monthly_summary', label: '締め・月別集計', icon: Calculator }
  ];

  const dayNames = ['月', '火', '水', '木', '金', '土', '日'];
  const dayKeys: (keyof EmployeeWeeklyShift['weeklySchedule'])[] = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];

  const createEmptyDailyShift = (): DailyShift => ({
    isWorkDay: false,
    shiftType: 'off',
    breakTime: 0,
    workHours: 0,
    location: '',
    notes: ''
  });

  const updateScheduleCell = async (scheduleId: string, day: keyof EmployeeWeeklyShift['weeklySchedule'], updates: Partial<DailyShift>) => {
    const schedule = shiftsData.find(s => s.id === scheduleId);
    if (!schedule) return;
    
    const updatedSchedule = {
      ...schedule,
      weeklySchedule: {
        ...schedule.weeklySchedule,
        [day]: {
          ...schedule.weeklySchedule[day],
          ...updates
        }
      }
    } as EmployeeWeeklyShift;

    const values = Object.values(updatedSchedule.weeklySchedule);
    const totalWorkDays = values.filter(d => d.isWorkDay).length;
    const totalWorkHours = values.reduce((sum, d) => sum + (d.workHours || 0), 0);
    const totalBreakTime = values.reduce((sum, d) => sum + (d.breakTime || 0), 0);
    const regularHours = values.reduce((sum, d) => sum + Math.min(d.workHours || 0, 8), 0);
    const overtimeHours = values.reduce((sum, d) => sum + Math.max((d.workHours || 0) - 8, 0), 0);
    const holidayHours = values.reduce((sum, d) => sum + (d.shiftType === 'holiday' ? (d.workHours || 0) : 0), 0);

    updatedSchedule.weeklyStats = {
      totalWorkDays,
      totalWorkHours,
      totalBreakTime,
      regularHours,
      overtimeHours,
      nightHours: schedule.weeklyStats.nightHours,
      holidayHours,
    };

    try {
      await updateShift.mutateAsync({
        id: scheduleId,
        shift: updatedSchedule,
      });
    } catch (error) {
      console.error('Failed to update schedule:', error);
    }
  };

  const addNewSchedule = () => {
    // 新規スケジュール追加の処理（実装はモーダルなどで行う想定）
  };

  const handleBatchSave = async () => {
    // 一括保存の処理
    const updates = filteredShifts.map(shift => ({
      id: shift.id,
      shift: shift,
    }));
    
    try {
      await updateShiftsBatch.mutateAsync(updates);
      setIsEditAll(false);
      setEditingRowId(null);
    } catch (error) {
      console.error('Failed to batch update schedules:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* 戻るボタン */}
      <div className="p-4">
        <Button
          variant="outline"
          onClick={() => router.push('/dashboard')}
          className="flex items-center gap-2"
        >
          <ArrowLeft className="w-4 h-4" />
          ダッシュボードに戻る
        </Button>
      </div>

      {/* ヘッダー */}
      <div className="px-4 mb-4">
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <h1 className="text-xl font-bold">従業員スケジュール管理</h1>

              <div className="flex items-center gap-2">
                {error && (
                  <span className="text-red-600 text-sm">データ取得に失敗しました</span>
                )}
                {isLoading && (
                  <span className="text-gray-600 text-sm">読み込み中...</span>
                )}
                <Button
                  variant="outline"
                  size="sm"
                  onClick={addNewSchedule}
                  className="bg-green-100 hover:bg-green-200"
                >
                  <Plus className="w-4 h-4 mr-1" />
                  新規追加
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className={isEditAll ? 'bg-yellow-200' : 'bg-yellow-100'}
                  onClick={() => setIsEditAll(prev => !prev)}
                >
                  <Calendar className="w-4 h-4 mr-1" />
                  {isEditAll ? '全員編集: ON' : '全員編集: OFF'}
                </Button>
                <Button variant="outline" size="sm" className="bg-blue-100" onClick={handleBatchSave}>
                  一括保存
                </Button>
                <Button variant="outline" size="sm" className="bg-purple-100">
                  印刷
                </Button>
              </div>
            </div>

            <div className="flex items-center gap-4 mt-2">
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => navigateWeek('prev')}
                >
                  <ChevronLeft className="w-4 h-4" />
                </Button>
                <span className="text-sm font-semibold">
                  {weekDates.length > 0 && `${formatDate(weekDates[0])} - ${formatDate(weekDates[6])}`}
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => navigateWeek('next')}
                >
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </div>

              <div className="flex items-center gap-2 ml-auto">
                <Input
                  placeholder="従業員名・番号で検索"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-48"
                />
                <Button variant="outline" size="sm">
                  <Search className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </CardHeader>
        </Card>
      </div>

      {/* フィルター行 */}
      <div className="px-4 mb-3">
        <Card>
          <CardContent className="py-3">
            <div className="flex flex-wrap items-center gap-3 text-xs">
              <div className="flex items-center gap-2">
                <span className="text-gray-600">部署</span>
                <Select value={filterDepartment || '__all__'} onValueChange={(v) => setFilterDepartment(v === '__all__' ? '' : v)}>
                  <SelectTrigger className="h-7 w-40">
                    <SelectValue placeholder="全て" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="__all__">全て</SelectItem>
                    {departmentOptions.map(name => (
                      <SelectItem key={name} value={name}>{name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-gray-600">役職</span>
                <Select value={filterPosition || '__all__'} onValueChange={(v) => setFilterPosition(v === '__all__' ? '' : v)}>
                  <SelectTrigger className="h-7 w-40">
                    <SelectValue placeholder="全て" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="__all__">全て</SelectItem>
                    {positionOptions.map(name => (
                      <SelectItem key={name} value={name}>{name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="ml-auto">
                <Button variant="outline" size="sm" className="h-7" onClick={() => { setFilterDepartment(''); setFilterPosition(''); setSearchQuery(''); }}>リセット</Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* メインコンテンツ */}
      <div className="px-4">
        <Card>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full text-xs border-collapse">
                <thead>
                  <tr className="bg-gray-200">
                    <th className="border border-gray-300 px-2 py-2 w-8 sticky left-0 bg-gray-200">No</th>
                    <th className="border border-gray-300 px-2 py-2 w-20 sticky left-8 bg-gray-200">従業員No</th>
                    <th className="border border-gray-300 px-2 py-2 w-24 sticky left-28 bg-gray-200">氏名</th>
                    <th className="border border-gray-300 px-2 py-2 w-20 sticky left-52 bg-gray-200">部署</th>
                    <th className="border border-gray-300 px-2 py-2 w-20 sticky left-72 bg-gray-200">役職</th>
                    {dayNames.map((dayName, index) => (
                      <th key={index} className="border border-gray-300 px-2 py-2 w-32">
                        <div className="text-center">
                          <div>{weekDates[index] && `${formatDate(weekDates[index])} ${dayName}`}</div>
                          <div className="text-xs text-gray-500">時間 / 備考</div>
                        </div>
                      </th>
                    ))}
                    <th className="border border-gray-300 px-2 py-2 w-24">週間統計</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredShifts.map((shift, index) => (
                    <tr key={shift.id} className="hover:bg-gray-50">
                      <td className="border border-gray-300 px-2 py-2 text-center sticky left-0 bg-white">
                        <div className="flex items-center justify-center gap-2">
                          <span>{index + 1}</span>
                          {(editingRowId === shift.id || isEditAll) ? (
                            <Button size="sm" variant="ghost" className="h-5 px-1" onClick={() => setEditingRowId(null)}>
                              <Check className="w-3 h-3" />
                            </Button>
                          ) : null}
                        </div>
                      </td>
                      <td className="border border-gray-300 px-2 py-2 text-center sticky left-8 bg-white">
                        {shift.employeeNumber}
                      </td>
                      <td className="border border-gray-300 px-2 py-2 sticky left-28 bg-white">
                        <div className="font-semibold">{shift.name}</div>
                      </td>
                      <td className="border border-gray-300 px-2 py-2 sticky left-52 bg-white">
                        {shift.department}
                      </td>
                      <td className="border border-gray-300 px-2 py-2 sticky left-72 bg-white">
                        {shift.position}
                      </td>
                      {(['monday','tuesday','wednesday','thursday','friday','saturday','sunday'] as const).map((dayKey, dayIndex) => {
                        const daySchedule = shift.weeklySchedule[dayKey];
                        return (
                          <td key={dayIndex} className="border border-gray-300 px-1 py-1 align-top">
                            {daySchedule.isWorkDay ? (
                              (editingRowId === shift.id || isEditAll) ? (
                                <div className="space-y-1 text-left">
                                  <div className="flex items-center gap-1">
                                    <Input
                                      type="time"
                                      value={daySchedule.startTime || ''}
                                      className="h-6 text-xs px-1"
                                      onChange={(e) => updateScheduleCell(shift.id, dayKey, { startTime: e.target.value })}
                                    />
                                    <span className="text-[10px] text-gray-500">-</span>
                                    <Input
                                      type="time"
                                      value={daySchedule.endTime || ''}
                                      className="h-6 text-xs px-1"
                                      onChange={(e) => updateScheduleCell(shift.id, dayKey, { endTime: e.target.value })}
                                    />
                                  </div>
                                  <div className="flex items-center gap-1">
                                    <Input
                                      type="number"
                                      value={daySchedule.workHours ?? 0}
                                      className="h-6 text-xs px-1 w-16"
                                      onChange={(e) => updateScheduleCell(shift.id, dayKey, { workHours: Number(e.target.value) })}
                                    />
                                    <span className="text-[10px] text-gray-500">h</span>
                                  </div>
                                  <Textarea
                                    value={daySchedule.notes ?? ''}
                                    className="text-xs min-h-[48px]"
                                    placeholder="メモ"
                                    onChange={(e) => updateScheduleCell(shift.id, dayKey, { notes: e.target.value })}
                                  />
                                </div>
                              ) : (
                                <div className="space-y-1">
                                  <div className="bg-blue-50 p-1 rounded text-center">
                                    <div className="font-semibold text-blue-800">
                                      {daySchedule.startTime} - {daySchedule.endTime}
                                    </div>
                                    <div className="text-xs text-blue-600">{daySchedule.workHours}h</div>
                                    {daySchedule.notes && (
                                      <div className="text-xs text-gray-600 mt-1">{daySchedule.notes}</div>
                                    )}
                                    <Button
                                      size="sm"
                                      variant="ghost"
                                      className="h-4 w-4 p-0 mt-1"
                                      onClick={() => setEditingRowId(shift.id)}
                                    >
                                      <Edit className="w-3 h-3" />
                                    </Button>
                                  </div>
                                </div>
                              )
                            ) : (
                              <div className="text-center">
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  className="h-6 w-full text-xs"
                                  onClick={() => {
                                    updateScheduleCell(shift.id, dayKey, {
                                      isWorkDay: true,
                                      shiftType: 'day',
                                      startTime: '09:00',
                                      endTime: '18:00',
                                      breakTime: 60,
                                      workHours: 8,
                                    });
                                  }}
                                >
                                  + 追加
                                </Button>
                                {daySchedule.notes && (
                                  <div className="text-xs text-gray-500 mt-1">{daySchedule.notes}</div>
                                )}
                              </div>
                            )}
                          </td>
                        );
                      })}
                      <td className="border border-gray-300 px-2 py-2 text-center">
                        <div className="space-y-1">
                          <div className="text-xs">
                            <div>勤務日: {shift.weeklyStats.totalWorkDays}日</div>
                            <div>時間: {shift.weeklyStats.totalWorkHours}h</div>
                          </div>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* フッター - 凡例 */}
      <div className="p-4 mt-4">
        <div className="flex flex-wrap items-center gap-4 text-xs text-gray-600">
          <span className="font-semibold">表示:</span>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded bg-blue-100 border border-blue-300"></div>
            <span>出勤</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded bg-gray-100 border border-gray-300"></div>
            <span>休み</span>
          </div>
        </div>

      </div>
    </div>
  );
}
