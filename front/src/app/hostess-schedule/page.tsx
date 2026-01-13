'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowLeft, ChevronLeft, ChevronRight, Plus } from "lucide-react";
import type { HostessScheduleData, DailyWorkSchedule } from '@/types/hostess';
// WorkType は将来の実装で使用予定

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

// 空の日次スケジュールを作成
const createEmptyDailySchedule = (): DailyWorkSchedule => ({
  isWorkDay: false,
  startTime: '',
  endTime: '',
  breakTime: 0,
  workHours: 0,
  notes: ''
});

// サンプルホステススケジュールデータ
const sampleHostessSchedules: HostessScheduleData[] = [
  {
    id: "1",
    hostessId: "H001",
    workType: "full_time",
    name: "田中美咲",
    assignedStaff: "佐藤",
    hostessManager: "山田HM",
    store: { id: "S001", name: "銀座店" },
    weeklySchedule: {
      monday: { isWorkDay: true, startTime: "19:00", endTime: "02:00", breakTime: 60, workHours: 6, notes: "" },
      tuesday: { isWorkDay: false, startTime: "", endTime: "", breakTime: 0, workHours: 0, notes: "休み" },
      wednesday: { isWorkDay: true, startTime: "19:00", endTime: "02:00", breakTime: 60, workHours: 6, notes: "" },
      thursday: { isWorkDay: true, startTime: "19:00", endTime: "02:00", breakTime: 60, workHours: 6, notes: "" },
      friday: { isWorkDay: true, startTime: "19:00", endTime: "03:00", breakTime: 60, workHours: 7, notes: "" },
      saturday: { isWorkDay: true, startTime: "19:00", endTime: "03:00", breakTime: 60, workHours: 7, notes: "" },
      sunday: { isWorkDay: false, startTime: "", endTime: "", breakTime: 0, workHours: 0, notes: "休み" }
    },
    weeklyStats: {
      totalWorkDays: 5,
      totalWorkHours: 32,
      averageDailyHours: 6.4,
      expectedEarnings: 160000
    },
    weekStartDate: "2025-01-27",
    weekEndDate: "2025-02-02",
    lastUpdated: "2025-01-26T10:00:00Z",
    status: "confirmed",
    remarks: "VIP対応あり"
  },
  {
    id: "2",
    hostessId: "H002",
    workType: "part_time",
    name: "鈴木さくら",
    assignedStaff: "高橋",
    hostessManager: "田中HM",
    store: { id: "S002", name: "新宿店" },
    weeklySchedule: {
      monday: createEmptyDailySchedule(),
      tuesday: { isWorkDay: true, startTime: "20:00", endTime: "01:00", breakTime: 30, workHours: 4.5, notes: "" },
      wednesday: createEmptyDailySchedule(),
      thursday: { isWorkDay: true, startTime: "20:00", endTime: "01:00", breakTime: 30, workHours: 4.5, notes: "" },
      friday: { isWorkDay: true, startTime: "20:00", endTime: "02:00", breakTime: 30, workHours: 5.5, notes: "" },
      saturday: { isWorkDay: true, startTime: "19:00", endTime: "02:00", breakTime: 60, workHours: 6, notes: "" },
      sunday: createEmptyDailySchedule()
    },
    weeklyStats: {
      totalWorkDays: 4,
      totalWorkHours: 20.5,
      averageDailyHours: 5.1,
      expectedEarnings: 102500
    },
    weekStartDate: "2025-01-27",
    weekEndDate: "2025-02-02",
    lastUpdated: "2025-01-26T10:00:00Z",
    status: "draft",
    remarks: "火木のみ出勤"
  },
  {
    id: "3",
    hostessId: "H003",
    workType: "part_time",
    name: "中村あい",
    assignedStaff: "斎藤",
    hostessManager: "木村HM",
    isNewcomer: true,
    store: { id: "S003", name: "渋谷店" },
    weeklySchedule: {
      monday: { isWorkDay: true, startTime: "18:00", endTime: "00:00", breakTime: 30, workHours: 5.5, notes: "" },
      tuesday: createEmptyDailySchedule(),
      wednesday: { isWorkDay: true, startTime: "18:00", endTime: "00:00", breakTime: 30, workHours: 5.5, notes: "" },
      thursday: createEmptyDailySchedule(),
      friday: { isWorkDay: true, startTime: "19:00", endTime: "01:00", breakTime: 30, workHours: 5, notes: "" },
      saturday: createEmptyDailySchedule(),
      sunday: createEmptyDailySchedule()
    },
    weeklyStats: {
      totalWorkDays: 3,
      totalWorkHours: 16,
      averageDailyHours: 5.3,
      expectedEarnings: 80000
    },
    weekStartDate: "2025-01-27",
    weekEndDate: "2025-02-02",
    lastUpdated: "2025-01-26T11:00:00Z",
    status: "draft",
    remarks: "新人研修中"
  },
  {
    id: "4",
    hostessId: "H004",
    workType: "contract",
    name: "小林ゆか",
    assignedStaff: "渡辺",
    hostessManager: "石井HM",
    store: { id: "S004", name: "池袋店" },
    weeklySchedule: {
      monday: createEmptyDailySchedule(),
      tuesday: { isWorkDay: true, startTime: "20:00", endTime: "02:00", breakTime: 45, workHours: 5.25, notes: "" },
      wednesday: createEmptyDailySchedule(),
      thursday: { isWorkDay: true, startTime: "20:00", endTime: "02:00", breakTime: 45, workHours: 5.25, notes: "" },
      friday: { isWorkDay: true, startTime: "21:00", endTime: "03:00", breakTime: 30, workHours: 5.5, notes: "" },
      saturday: { isWorkDay: true, startTime: "21:00", endTime: "03:00", breakTime: 30, workHours: 5.5, notes: "" },
      sunday: createEmptyDailySchedule()
    },
    weeklyStats: {
      totalWorkDays: 4,
      totalWorkHours: 21.5,
      averageDailyHours: 5.4,
      expectedEarnings: 107500
    },
    weekStartDate: "2025-01-27",
    weekEndDate: "2025-02-02",
    lastUpdated: "2025-01-26T12:00:00Z",
    status: "published",
    remarks: "遅番中心"
  },
  {
    id: "5",
    hostessId: "H005",
    workType: "dispatch",
    name: "加藤りな",
    assignedStaff: "森",
    hostessManager: "阿部HM",
    store: { id: "S005", name: "赤坂店" },
    weeklySchedule: {
      monday: { isWorkDay: true, startTime: "19:00", endTime: "01:00", breakTime: 30, workHours: 5.5, notes: "" },
      tuesday: { isWorkDay: true, startTime: "19:00", endTime: "01:00", breakTime: 30, workHours: 5.5, notes: "" },
      wednesday: createEmptyDailySchedule(),
      thursday: createEmptyDailySchedule(),
      friday: { isWorkDay: true, startTime: "20:00", endTime: "02:00", breakTime: 30, workHours: 5.5, notes: "" },
      saturday: { isWorkDay: true, startTime: "20:00", endTime: "02:00", breakTime: 30, workHours: 5.5, notes: "" },
      sunday: createEmptyDailySchedule()
    },
    weeklyStats: {
      totalWorkDays: 4,
      totalWorkHours: 22,
      averageDailyHours: 5.5,
      expectedEarnings: 110000
    },
    weekStartDate: "2025-01-27",
    weekEndDate: "2025-02-02",
    lastUpdated: "2025-01-26T12:30:00Z",
    status: "confirmed",
    remarks: "金土は繁忙対応"
  },
  {
    id: "6",
    hostessId: "H006",
    workType: "full_time",
    name: "山本かえで",
    assignedStaff: "池田",
    hostessManager: "山下HM",
    store: { id: "S006", name: "恵比寿店" },
    weeklySchedule: {
      monday: { isWorkDay: true, startTime: "18:30", endTime: "00:30", breakTime: 60, workHours: 5, notes: "" },
      tuesday: { isWorkDay: true, startTime: "18:30", endTime: "00:30", breakTime: 60, workHours: 5, notes: "" },
      wednesday: { isWorkDay: true, startTime: "18:30", endTime: "00:30", breakTime: 60, workHours: 5, notes: "" },
      thursday: createEmptyDailySchedule(),
      friday: { isWorkDay: true, startTime: "19:00", endTime: "01:00", breakTime: 30, workHours: 5.5, notes: "" },
      saturday: createEmptyDailySchedule(),
      sunday: createEmptyDailySchedule()
    },
    weeklyStats: {
      totalWorkDays: 4,
      totalWorkHours: 20.5,
      averageDailyHours: 5.1,
      expectedEarnings: 102500
    },
    weekStartDate: "2025-01-27",
    weekEndDate: "2025-02-02",
    lastUpdated: "2025-01-26T13:00:00Z",
    status: "draft",
    remarks: "平日メイン"
  }
];

const dayNames = ['月', '火', '水', '木', '金', '土', '日'];
const dayKeys: (keyof HostessScheduleData['weeklySchedule'])[] = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];

export default function HostessSchedule() {
  React.useEffect(() => {
    document.title = 'ホステススケジュール管理 - Dispatch Harmony Hub';
  }, []);
  const router = useRouter();
  const [currentWeekStart, setCurrentWeekStart] = useState(new Date());
  const [weekDates, setWeekDates] = useState<Date[]>([]);
  const [schedules, setSchedules] = useState<HostessScheduleData[]>(sampleHostessSchedules);
  const [filterAssignedStaff, setFilterAssignedStaff] = useState<string>('');
  const [filterWorkType, setFilterWorkType] = useState<HostessScheduleData['workType'] | ''>('');
  const [filterStoreId, setFilterStoreId] = useState<string>('');

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


  const assignedStaffOptions = useMemo(() => {
    const set = new Set<string>();
    schedules.forEach(s => { if (s.assignedStaff) set.add(s.assignedStaff); });
    return Array.from(set);
  }, [schedules]);

  const storeOptions = useMemo(() => {
    const map = new Map<string, string>();
    schedules.forEach(s => {
      if (s.store?.id) {
        map.set(s.store.id, s.store.name);
      }
    });
    return Array.from(map.entries()).map(([id, name]) => ({ id, name }));
  }, [schedules]);

  const filteredSchedules = useMemo(() => {
    return schedules.filter(s => {
      if (filterAssignedStaff && s.assignedStaff !== filterAssignedStaff) return false;
      if (filterWorkType && s.workType !== filterWorkType) return false;
      if (filterStoreId && s.store?.id !== filterStoreId) return false;
      return true;
    });
  }, [schedules, filterAssignedStaff, filterWorkType, filterStoreId]);

  const updateScheduleCell = (scheduleId: string, day: keyof HostessScheduleData['weeklySchedule'], updates: Partial<DailyWorkSchedule>) => {
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
        const totalWorkDays = Object.values(updatedSchedule.weeklySchedule).filter(d => d.isWorkDay).length;
        const totalWorkHours = Object.values(updatedSchedule.weeklySchedule).reduce((sum, d) => sum + (d.workHours || 0), 0);
        
        updatedSchedule.weeklyStats = {
          totalWorkDays,
          totalWorkHours,
          averageDailyHours: totalWorkDays > 0 ? totalWorkHours / totalWorkDays : 0,
          expectedEarnings: totalWorkHours * 5000 // 仮の時給計算
        };
        
        return updatedSchedule;
      }
      return schedule;
    }));
  };

  const addNewSchedule = () => {
    const newSchedule: HostessScheduleData = {
      id: Date.now().toString(),
      hostessId: `H${String(schedules.length + 1).padStart(3, '0')}`,
      workType: "part_time",
      name: "",
      assignedStaff: "",
      hostessManager: "",
      weeklySchedule: {
        monday: createEmptyDailySchedule(),
        tuesday: createEmptyDailySchedule(),
        wednesday: createEmptyDailySchedule(),
        thursday: createEmptyDailySchedule(),
        friday: createEmptyDailySchedule(),
        saturday: createEmptyDailySchedule(),
        sunday: createEmptyDailySchedule()
      },
      weeklyStats: {
        totalWorkDays: 0,
        totalWorkHours: 0,
        averageDailyHours: 0,
        expectedEarnings: 0
      },
      weekStartDate: "2025-01-27",
      weekEndDate: "2025-02-02",
      lastUpdated: new Date().toISOString(),
      status: "draft"
    };
    
    setSchedules(prev => [...prev, newSchedule]);
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* ヘッダー - rt2-panel スタイル */}
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
            <h1 className="text-lg font-bold mr-2">ホステススケジュール管理</h1>

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
              <span className="text-sm text-gray-600">担当者:</span>
              <Select value={filterAssignedStaff || '__all__'} onValueChange={(v) => setFilterAssignedStaff(v === '__all__' ? '' : v)}>
                <SelectTrigger className="h-8 w-[100px] text-sm">
                  <SelectValue placeholder="全て" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="__all__">全て</SelectItem>
                  {assignedStaffOptions.map(name => (
                    <SelectItem key={name} value={name}>{name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <span className="text-sm text-gray-600">勤務形態:</span>
              <Select value={filterWorkType || '__all__'} onValueChange={(v) => setFilterWorkType(v === '__all__' ? '' : (v as HostessScheduleData['workType']))}>
                <SelectTrigger className="h-8 w-[100px] text-sm">
                  <SelectValue placeholder="全て" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="__all__">全て</SelectItem>
                  <SelectItem value="full_time">正社員</SelectItem>
                  <SelectItem value="part_time">パート</SelectItem>
                  <SelectItem value="contract">契約</SelectItem>
                  <SelectItem value="dispatch">派遣</SelectItem>
                  <SelectItem value="temp">臨時</SelectItem>
                </SelectContent>
              </Select>
              <span className="text-sm text-gray-600">店舗:</span>
              <Select value={filterStoreId || '__all__'} onValueChange={(v) => setFilterStoreId(v === '__all__' ? '' : v)}>
                <SelectTrigger className="h-8 w-[100px] text-sm">
                  <SelectValue placeholder="全て" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="__all__">全て</SelectItem>
                  {storeOptions.map(opt => (
                    <SelectItem key={opt.id} value={opt.id}>{opt.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Button 
                variant="outline" 
                size="sm" 
                className="h-8 text-sm" 
                onClick={() => { setFilterAssignedStaff(''); setFilterWorkType(''); setFilterStoreId(''); }}
              >
                リセット
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* メインコンテンツ */}
      <div className="p-4">

      {/* メインスケジュールテーブル */}
        <Card>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full text-sm table-fixed">
                <colgroup>
                  <col style={{width: '25px'}} />
                  <col style={{width: '90px'}} />
                  <col style={{width: '120px'}} />
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
                    <th className="border border-gray-600 px-1 py-1 text-center text-sm sticky left-[30px] bg-white">勤務形態</th>
                    <th className="border border-gray-600 px-1 py-1 text-center text-sm sticky left-[100px] bg-white">名前</th>
                    <th className="border border-gray-600 px-1 py-1 text-center text-sm sticky left-[200px] bg-white">担当者</th>
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
                      style={{ backgroundColor: schedule.store?.name === '銀座店' ? '#fff1f2' : 
                               schedule.store?.name === '新宿店' ? '#eef2ff' :
                               schedule.store?.name === '渋谷店' ? '#ecfdf5' :
                               schedule.store?.name === '池袋店' ? '#fffbeb' :
                               schedule.store?.name === '赤坂店' ? '#f0f9ff' :
                               schedule.store?.name === '恵比寿店' ? '#faf5ff' : '#fef3c7' }}
                    >
                      <td className="border border-gray-600 px-1 py-1 text-center sticky left-0" style={{ backgroundColor: 'inherit' }}>
                        <span className="text-sm">{index + 1}</span>
                      </td>
                      <td className="border border-gray-600 px-1 py-1 sticky left-[30px]" style={{ backgroundColor: 'inherit' }}>
                        <span className="text-sm">
                          {schedule.workType === 'full_time' ? '正社員' :
                           schedule.workType === 'part_time' ? 'パート' :
                           schedule.workType === 'contract' ? '契約' :
                           schedule.workType === 'dispatch' ? '派遣' : '臨時'}
                        </span>
                      </td>
                      <td className="border border-gray-600 px-1 py-1 sticky left-[100px]" style={{ backgroundColor: 'inherit' }}>
                        <span className="text-sm font-bold">{schedule.isNewcomer && <span className="text-red-500 mr-1">【新人】</span>}{schedule.name}</span>
                      </td>
                      <td className="border border-gray-600 px-1 py-1 sticky left-[200px]" style={{ backgroundColor: 'inherit' }}>
                        <span className="text-sm">{schedule.assignedStaff}</span>
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
            <span>銀座店</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-3 h-3" style={{backgroundColor: '#eef2ff'}}></div>
            <span>新宿店</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-3 h-3" style={{backgroundColor: '#ecfdf5'}}></div>
            <span>渋谷店</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-3 h-3" style={{backgroundColor: '#fffbeb'}}></div>
            <span>池袋店</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-3 h-3" style={{backgroundColor: '#f0f9ff'}}></div>
            <span>赤坂店</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-3 h-3" style={{backgroundColor: '#faf5ff'}}></div>
            <span>恵比寿店</span>
          </div>
        </div>
      </div>
    </div>
  );
}