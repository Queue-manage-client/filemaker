'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowLeft, ChevronLeft, ChevronRight, Plus } from "lucide-react";
import type { DailyShift, EmployeeWeeklyShift } from '@/types/employee';
import { sampleEmployeeWeeklyShifts } from '@/data/employeeSampleData';

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

// 空の日次シフトを作成
const createEmptyDailyShift = (): DailyShift => ({
  isWorkDay: false,
  shiftType: 'off',
  startTime: '',
  endTime: '',
  breakTime: 0,
  workHours: 0,
  location: '',
  notes: ''
});

const dayNames = ['月', '火', '水', '木', '金', '土', '日'];
const dayKeys: (keyof EmployeeWeeklyShift['weeklySchedule'])[] = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];

export default function EmployeeSchedule() {
  const router = useRouter();
  const [currentWeekStart, setCurrentWeekStart] = useState(new Date());
  const [weekDates, setWeekDates] = useState<Date[]>([]);
  const [schedules, setSchedules] = useState<EmployeeWeeklyShift[]>(sampleEmployeeWeeklyShifts);
  const [filterDepartment, setFilterDepartment] = useState<string>('');
  const [filterPosition, setFilterPosition] = useState<string>('');

  useEffect(() => {
    document.title = '従業員スケジュール管理 - Dispatch Harmony Hub';
  }, []);

  useEffect(() => {
    setWeekDates(getCurrentWeekDates(currentWeekStart));
  }, [currentWeekStart]);

  const navigateWeek = (direction: 'prev' | 'next') => {
    const newDate = new Date(currentWeekStart);
    newDate.setDate(currentWeekStart.getDate() + (direction === 'next' ? 7 : -7));
    setCurrentWeekStart(newDate);
  };

  const formatDate = (date: Date) => {
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${month}/${day}`;
  };

  const departmentOptions = useMemo(() => {
    const set = new Set<string>();
    schedules.forEach(s => { if (s.department) set.add(s.department); });
    return Array.from(set);
  }, [schedules]);

  const positionOptions = useMemo(() => {
    const set = new Set<string>();
    schedules.forEach(s => { if (s.position) set.add(s.position); });
    return Array.from(set);
  }, [schedules]);

  const filteredSchedules = useMemo(() => {
    return schedules.filter(s => {
      if (filterDepartment && s.department !== filterDepartment) return false;
      if (filterPosition && s.position !== filterPosition) return false;
      return true;
    });
  }, [schedules, filterDepartment, filterPosition]);

  const updateScheduleCell = (scheduleId: string, day: keyof EmployeeWeeklyShift['weeklySchedule'], updates: Partial<DailyShift>) => {
    setSchedules(prev => prev.map(schedule => {
      if (schedule.id === scheduleId) {
        const updatedSchedule = {
          ...schedule,
          weeklySchedule: {
            ...schedule.weeklySchedule,
            [day]: {
              ...schedule.weeklySchedule[day],
              ...updates
            }
          }
        };
        
        // 週間統計を再計算
        const values = Object.values(updatedSchedule.weeklySchedule);
        const totalWorkDays = values.filter(d => d.isWorkDay).length;
        const totalWorkHours = values.reduce((sum, d) => sum + (d.workHours || 0), 0);
        const totalBreakTime = values.reduce((sum, d) => sum + (d.breakTime || 0), 0);
        const regularHours = values.reduce((sum, d) => sum + Math.min(d.workHours || 0, 8), 0);
        const overtimeHours = values.reduce((sum, d) => sum + Math.max((d.workHours || 0) - 8, 0), 0);
        
        updatedSchedule.weeklyStats = {
          totalWorkDays,
          totalWorkHours,
          totalBreakTime,
          regularHours,
          overtimeHours,
          nightHours: schedule.weeklyStats.nightHours,
          holidayHours: schedule.weeklyStats.holidayHours,
        };
        
        return updatedSchedule;
      }
      return schedule;
    }));
  };

  const addNewSchedule = () => {
    const newSchedule: EmployeeWeeklyShift = {
      id: Date.now().toString(),
      employeeId: `E${String(schedules.length + 1).padStart(3, '0')}`,
      employeeNumber: `EMP${String(schedules.length + 1).padStart(3, '0')}`,
      name: "",
      department: "",
      position: "",
      weeklySchedule: {
        monday: createEmptyDailyShift(),
        tuesday: createEmptyDailyShift(),
        wednesday: createEmptyDailyShift(),
        thursday: createEmptyDailyShift(),
        friday: createEmptyDailyShift(),
        saturday: createEmptyDailyShift(),
        sunday: createEmptyDailyShift()
      },
      weeklyStats: {
        totalWorkDays: 0,
        totalWorkHours: 0,
        totalBreakTime: 0,
        regularHours: 0,
        overtimeHours: 0,
        nightHours: 0,
        holidayHours: 0
      },
      weekStartDate: weekDates[0]?.toISOString().split('T')[0] || '',
      weekEndDate: weekDates[6]?.toISOString().split('T')[0] || '',
      lastUpdated: new Date().toISOString(),
      status: "draft"
    };
    
    setSchedules(prev => [...prev, newSchedule]);
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* ヘッダー - hostess-schedule スタイル */}
      <div className="h-[50px] bg-white border-b border-zinc-300">
        <div className="flex items-center h-full px-2">
          {/* ダッシュボードに戻る - 左端 */}
          <Button
            variant="outline"
            onClick={() => router.push('/dashboard')}
            className="h-8 px-3 text-sm flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            ダッシュボードに戻る
          </Button>

          {/* 中央配置のボタン群 */}
          <div className="flex-1 flex items-center justify-center gap-2">
            {/* タイトル */}
            <h1 className="text-lg font-bold mr-2">従業員スケジュール管理</h1>

            {/* 週間ナビゲーション */}
            <div className="flex items-center">
              <Button
                variant="outline"
                size="icon"
                className="h-8 w-8"
                onClick={() => navigateWeek('prev')}
              >
                <ChevronLeft className="w-4 h-4" />
              </Button>
              <div className="text-sm font-mono bg-gray-500 text-white px-2 py-1">
                {weekDates.length > 0 && `${formatDate(weekDates[0])} - ${formatDate(weekDates[6])}`}
              </div>
              <Button
                variant="outline"
                size="icon"
                className="h-8 w-8"
                onClick={() => navigateWeek('next')}
              >
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>

            {/* アクションボタン */}
            <Button 
              className="h-8 px-4 text-sm bg-green-200 hover:bg-green-300 text-black border border-black"
              onClick={addNewSchedule}
            >
              <Plus className="w-4 h-4 mr-1" />
              新規追加
            </Button>
            <Button className="h-8 px-4 text-sm bg-blue-200 hover:bg-blue-300 text-black border border-black">
              一括保存
            </Button>
            <Button className="h-8 px-4 text-sm bg-purple-200 hover:bg-purple-300 text-black border border-black">
              印刷
            </Button>

            {/* フィルター選択 */}
            <div className="flex items-center gap-2 ml-4">
              <span className="text-sm text-gray-600">部署:</span>
              <Select value={filterDepartment || '__all__'} onValueChange={(v) => setFilterDepartment(v === '__all__' ? '' : v)}>
                <SelectTrigger className="h-8 w-[100px] text-sm">
                  <SelectValue placeholder="全て" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="__all__">全て</SelectItem>
                  {departmentOptions.map(name => (
                    <SelectItem key={name} value={name}>{name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <span className="text-sm text-gray-600">役職:</span>
              <Select value={filterPosition || '__all__'} onValueChange={(v) => setFilterPosition(v === '__all__' ? '' : v)}>
                <SelectTrigger className="h-8 w-[100px] text-sm">
                  <SelectValue placeholder="全て" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="__all__">全て</SelectItem>
                  {positionOptions.map(name => (
                    <SelectItem key={name} value={name}>{name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Button 
                variant="outline" 
                size="sm" 
                className="h-8 text-sm" 
                onClick={() => { setFilterDepartment(''); setFilterPosition(''); }}
              >
                リセット
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* メインコンテンツ */}
      <div className="p-4">
        <Card>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full text-sm table-fixed">
                <colgroup>
                  <col style={{width: '40px'}} />
                  <col style={{width: '90px'}} />
                  <col style={{width: '120px'}} />
                  <col style={{width: '80px'}} />
                  <col style={{width: '80px'}} />
                  {dayNames.map((_, i) => (
                    <col key={i} style={{width: '160px'}} />
                  ))}
                  <col style={{width: '100px'}} />
                  <col style={{width: '180px'}} />
                </colgroup>
                <thead>
                  <tr className="bg-white">
                    <th className="border border-gray-600 px-1 py-1 text-center text-sm sticky left-0 bg-white">No</th>
                    <th className="border border-gray-600 px-1 py-1 text-center text-sm sticky left-[40px] bg-white">従業員No</th>
                    <th className="border border-gray-600 px-1 py-1 text-center text-sm sticky left-[130px] bg-white">名前</th>
                    <th className="border border-gray-600 px-1 py-1 text-center text-sm sticky left-[250px] bg-white">部署</th>
                    <th className="border border-gray-600 px-1 py-1 text-center text-sm sticky left-[330px] bg-white">役職</th>
                    {dayNames.map((dayName, index) => (
                      <th key={index} className="border border-gray-600 px-1 py-1 text-center text-sm">
                        <div>{weekDates[index] && formatDate(weekDates[index])} {dayName}</div>
                      </th>
                    ))}
                    <th className="border border-gray-600 px-1 py-1 text-center text-sm">週間統計</th>
                    <th className="border border-gray-600 px-1 py-1 text-center text-sm">備考</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredSchedules.map((schedule, index) => (
                    <tr 
                      key={schedule.id} 
                      className="hover:opacity-80"
                      style={{ backgroundColor: schedule.department === '営業部' ? '#fff1f2' : 
                               schedule.department === '企画部' ? '#eef2ff' :
                               schedule.department === '総務部' ? '#ecfdf5' :
                               schedule.department === '経理部' ? '#fffbeb' :
                               schedule.department === '人事部' ? '#f0f9ff' :
                               schedule.department === '開発部' ? '#faf5ff' : '#fef3c7' }}
                    >
                      <td className="border border-gray-600 px-1 py-1 text-center sticky left-0" style={{ backgroundColor: 'inherit' }}>
                        <span className="text-sm">{index + 1}</span>
                      </td>
                      <td className="border border-gray-600 px-1 py-1 sticky left-[40px]" style={{ backgroundColor: 'inherit' }}>
                        <span className="text-sm">{schedule.employeeNumber}</span>
                      </td>
                      <td className="border border-gray-600 px-1 py-1 sticky left-[130px]" style={{ backgroundColor: 'inherit' }}>
                        <span className="text-sm font-bold">{schedule.name}</span>
                      </td>
                      <td className="border border-gray-600 px-1 py-1 sticky left-[250px]" style={{ backgroundColor: 'inherit' }}>
                        <span className="text-sm">{schedule.department}</span>
                      </td>
                      <td className="border border-gray-600 px-1 py-1 sticky left-[330px]" style={{ backgroundColor: 'inherit' }}>
                        <span className="text-sm">{schedule.position}</span>
                      </td>
                      {dayKeys.map((dayKey, dayIndex) => {
                        const daySchedule = schedule.weeklySchedule[dayKey];

                        return (
                          <td key={dayIndex} className="border border-gray-600 px-0.5 py-1 align-top">
                            <div className="flex items-center gap-0.5">
                              <input
                                type="time"
                                value={daySchedule.startTime || ''}
                                onChange={(e) => {
                                  updateScheduleCell(schedule.id, dayKey, {
                                    startTime: e.target.value,
                                    isWorkDay: e.target.value !== ''
                                  });
                                }}
                                className="w-[72px] h-7 text-sm border border-gray-400 rounded-sm px-0.5"
                              />
                              <span className="text-sm">〜</span>
                              <input
                                type="time"
                                value={daySchedule.endTime || ''}
                                onChange={(e) => {
                                  updateScheduleCell(schedule.id, dayKey, {
                                    endTime: e.target.value,
                                    isWorkDay: daySchedule.startTime !== '' || e.target.value !== ''
                                  });
                                }}
                                className="w-[72px] h-7 text-sm border border-gray-400 rounded-sm px-0.5"
                              />
                            </div>
                          </td>
                        );
                      })}
                      <td className="border border-gray-600 px-1 py-1 text-center">
                        <div className="space-y-0">
                          <div className="text-sm">勤務日: {schedule.weeklyStats.totalWorkDays}日</div>
                          <div className="text-sm">時間: {schedule.weeklyStats.totalWorkHours}h</div>
                        </div>
                      </td>
                      <td className="border border-gray-600 px-1 py-1 align-top">
                        <input
                          type="text"
                          value={schedule.remarks ?? ''}
                          onChange={(e) => {
                            setSchedules(prev => prev.map(s =>
                              s.id === schedule.id ? { ...s, remarks: e.target.value } : s
                            ));
                          }}
                          className="w-full h-7 text-sm border border-gray-400 rounded-sm px-0.5"
                          placeholder="備考"
                        />
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
      <div className="mt-2 px-2">
        <div className="flex items-center gap-4 text-sm text-gray-600">
          <div className="flex items-center gap-1">
            <div className="w-3 h-3" style={{backgroundColor: '#fff1f2'}}></div>
            <span>営業部</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-3 h-3" style={{backgroundColor: '#eef2ff'}}></div>
            <span>企画部</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-3 h-3" style={{backgroundColor: '#ecfdf5'}}></div>
            <span>総務部</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-3 h-3" style={{backgroundColor: '#fffbeb'}}></div>
            <span>経理部</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-3 h-3" style={{backgroundColor: '#f0f9ff'}}></div>
            <span>人事部</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-3 h-3" style={{backgroundColor: '#faf5ff'}}></div>
            <span>開発部</span>
          </div>
        </div>
      </div>
    </div>
  );
}
