'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { ArrowLeft, ChevronLeft, ChevronRight, Plus, Edit, Check } from "lucide-react";
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
  const [editingRowId, setEditingRowId] = useState<string | null>(null);
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

  // const getWorkTypeLabel = (workType: WorkType) => {
  //   const labels: Record<WorkType, string> = {
  //     'full_time': '正社員',
  //     'part_time': 'パート',
  //     'contract': '契約',
  //     'dispatch': '派遣',
  //     'temp': '臨時'
  //   };
  //   return labels[workType];
  // };

  const getStoreBgClass = (storeName?: string) => {
    switch (storeName) {
      case '銀座店':
        return 'bg-rose-50';
      case '新宿店':
        return 'bg-indigo-50';
      case '渋谷店':
        return 'bg-emerald-50';
      case '池袋店':
        return 'bg-amber-50';
      case '赤坂店':
        return 'bg-sky-50';
      case '恵比寿店':
        return 'bg-purple-50';
      default:
        return 'bg-white';
    }
  };

  const getStatusColor = (status: HostessScheduleData['status']) => {
    switch (status) {
      case 'confirmed': return 'bg-blue-100 text-blue-800';
      case 'published': return 'bg-green-100 text-green-800';
      case 'draft': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
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

  const updateScheduleFields = (scheduleId: string, fields: Partial<HostessScheduleData>) => {
    setSchedules(prev => prev.map(s => s.id === scheduleId ? { ...s, ...fields } : s));
  };

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
              <h1 className="text-xl font-bold">ホステススケジュール管理</h1>
              
              <div className="flex items-center gap-2">
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={addNewSchedule}
                  className="bg-green-100 hover:bg-green-200"
                >
                  <Plus className="w-4 h-4 mr-1" />
                  新規追加
                </Button>
                <Button variant="outline" size="sm" className="bg-blue-100">
                  一括保存
                </Button>
                <Button variant="outline" size="sm" className="bg-purple-100">
                  印刷
                </Button>
              </div>
            </div>

            <div className="flex items-center gap-4">
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
                <span className="text-gray-600">担当者</span>
                <Select value={filterAssignedStaff || '__all__'} onValueChange={(v) => setFilterAssignedStaff(v === '__all__' ? '' : v)}>
                  <SelectTrigger className="h-7 w-40">
                    <SelectValue placeholder="全て" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="__all__">全て</SelectItem>
                    {assignedStaffOptions.map(name => (
                      <SelectItem key={name} value={name}>{name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-gray-600">勤務形態</span>
                <Select value={filterWorkType || '__all__'} onValueChange={(v) => setFilterWorkType(v === '__all__' ? '' : (v as HostessScheduleData['workType']))}>
                  <SelectTrigger className="h-7 w-40">
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
              </div>

              <div className="flex items-center gap-2">
                <span className="text-gray-600">店舗</span>
                <Select value={filterStoreId || '__all__'} onValueChange={(v) => setFilterStoreId(v === '__all__' ? '' : v)}>
                  <SelectTrigger className="h-7 w-40">
                    <SelectValue placeholder="全て" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="__all__">全て</SelectItem>
                    {storeOptions.map(opt => (
                      <SelectItem key={opt.id} value={opt.id}>{opt.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="ml-auto">
                <Button variant="outline" size="sm" className="h-7" onClick={() => { setFilterAssignedStaff(''); setFilterWorkType(''); setFilterStoreId(''); }}>リセット</Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* メインスケジュールテーブル */}
      <div className="px-4">
        <Card>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full text-xs border-collapse">
                <thead>
                  <tr className="bg-gray-200">
                    <th className="border border-gray-300 px-2 py-2 w-8 sticky left-0 bg-gray-200">No</th>
                    <th className="border border-gray-300 px-2 py-2 w-20 sticky left-8 bg-gray-200">勤務形態</th>
                    <th className="border border-gray-300 px-2 py-2 w-24 sticky left-28 bg-gray-200">名前</th>
                    <th className="border border-gray-300 px-2 py-2 w-20 sticky left-52 bg-gray-200">担当者</th>
                    {dayNames.map((dayName, index) => (
                      <th key={index} className="border border-gray-300 px-2 py-2 w-32">
                        <div className="text-center">
                          <div>{weekDates[index] && formatDate(weekDates[index])} {dayName}</div>
                          <div className="text-xs text-gray-500">時間 / 備考</div>
                        </div>
                      </th>
                    ))}
                    <th className="border border-gray-300 px-2 py-2 w-24">週間統計</th>
                    <th className="border border-gray-300 px-2 py-2 w-20">ステータス</th>
                    <th className="border border-gray-300 px-2 py-2 w-80">備考</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredSchedules.map((schedule, index) => (
                    <tr key={schedule.id} className="hover:bg-gray-50">
                      <td className="border border-gray-300 px-2 py-2 text-center sticky left-0 bg-white">
                        <div className="flex items-center justify-center gap-2">
                          <span>{index + 1}</span>
                          {editingRowId === schedule.id ? (
                            <Button size="sm" variant="ghost" className="h-5 px-1" onClick={() => setEditingRowId(null)}>
                              <Check className="w-3 h-3" />
                            </Button>
                          ) : null}
                        </div>
                      </td>
                      <td className="border border-gray-300 px-2 py-2 sticky left-8 bg-white">
                        <Select value={schedule.workType} onValueChange={(v) => editingRowId === schedule.id ? updateScheduleFields(schedule.id, { workType: v as HostessScheduleData['workType'] }) : undefined}>
                          <SelectTrigger className="border-0 p-0 h-auto text-xs">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="full_time">正社員</SelectItem>
                            <SelectItem value="part_time">パート</SelectItem>
                            <SelectItem value="contract">契約</SelectItem>
                            <SelectItem value="dispatch">派遣</SelectItem>
                            <SelectItem value="temp">臨時</SelectItem>
                          </SelectContent>
                        </Select>
                      </td>
                      <td className={`border border-gray-300 px-2 py-2 sticky left-28 ${getStoreBgClass(schedule.store?.name)}`}>
                        <div className="flex items-center gap-2">
                          <Input
                            value={`${schedule.name}${schedule.isNewcomer ? " (新)" : ""}`}
                            className="border-0 p-0 h-auto text-xs bg-transparent"
                            placeholder="名前"
                            readOnly
                          />
                          {editingRowId === schedule.id ? (
                            <label className="flex items-center gap-1 text-[10px] text-gray-700">
                              <Checkbox
                                checked={!!schedule.isNewcomer}
                                onCheckedChange={(c) => updateScheduleFields(schedule.id, { isNewcomer: Boolean(c) })}
                              />
                              新人
                            </label>
                          ) : null}
                        </div>
                      </td>
                      <td className="border border-gray-300 px-2 py-2 sticky left-52 bg-white">
                        <Input
                          value={schedule.assignedStaff}
                          className="border-0 p-0 h-auto text-xs"
                          placeholder="担当者"
                          readOnly
                        />
                      </td>
                      {dayKeys.map((dayKey, dayIndex) => {
                        const daySchedule = schedule.weeklySchedule[dayKey];
                        // const isEditing = editingCell?.scheduleId === schedule.id && editingCell?.day === dayKey;
                        
                        return (
                          <td key={dayIndex} className="border border-gray-300 px-1 py-1 align-top">
                            {daySchedule.isWorkDay ? (
                              editingRowId === schedule.id ? (
                                <div className="space-y-1 text-left">
                                  <div className="flex items-center gap-1">
                                    <Input
                                      type="time"
                                      value={daySchedule.startTime}
                                      className="h-6 text-xs px-1"
                                      onChange={(e) => updateScheduleCell(schedule.id, dayKey, { startTime: e.target.value })}
                                    />
                                    <span className="text-[10px] text-gray-500">-</span>
                                    <Input
                                      type="time"
                                      value={daySchedule.endTime}
                                      className="h-6 text-xs px-1"
                                      onChange={(e) => updateScheduleCell(schedule.id, dayKey, { endTime: e.target.value })}
                                    />
                                  </div>
                                  <div className="flex items-center gap-1">
                                    <Input
                                      type="number"
                                      value={daySchedule.workHours ?? 0}
                                      className="h-6 text-xs px-1 w-16"
                                      onChange={(e) => updateScheduleCell(schedule.id, dayKey, { workHours: Number(e.target.value) })}
                                    />
                                    <span className="text-[10px] text-gray-500">h</span>
                                  </div>
                                  <Textarea
                                    value={daySchedule.notes ?? ''}
                                    className="text-xs min-h-[48px]"
                                    placeholder="メモ"
                                    onChange={(e) => updateScheduleCell(schedule.id, dayKey, { notes: e.target.value })}
                                  />
                                </div>
                              ) : (
                                <div className="space-y-1">
                                  <div className="bg-blue-50 p-1 rounded text-center">
                                    <div className="font-semibold text-blue-800">
                                      {daySchedule.startTime} - {daySchedule.endTime}
                                    </div>
                                    <div className="text-xs text-blue-600">
                                      {daySchedule.workHours}h
                                    </div>
                                    {daySchedule.notes && (
                                      <div className="text-xs text-gray-600 mt-1">
                                        {daySchedule.notes}
                                      </div>
                                    )}
                                    <Button
                                      size="sm"
                                      variant="ghost"
                                      className="h-4 w-4 p-0 mt-1"
                                      onClick={() => setEditingRowId(schedule.id)}
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
                                    updateScheduleCell(schedule.id, dayKey, {
                                      isWorkDay: true,
                                      startTime: "19:00",
                                      endTime: "02:00",
                                      workHours: 6
                                    });
                                  }}
                                >
                                  + 追加
                                </Button>
                                {daySchedule.notes && (
                                  <div className="text-xs text-gray-500 mt-1">
                                    {daySchedule.notes}
                                  </div>
                                )}
                              </div>
                            )}
                          </td>
                        );
                      })}
                      <td className="border border-gray-300 px-2 py-2 text-center">
                        <div className="space-y-1">
                          <div className="text-xs">
                            <div>勤務日: {schedule.weeklyStats.totalWorkDays}日</div>
                            <div>時間: {schedule.weeklyStats.totalWorkHours}h</div>
                            <div>平均: {schedule.weeklyStats.averageDailyHours.toFixed(1)}h/日</div>
                            <div className="text-green-600 font-semibold">
                              ¥{schedule.weeklyStats.expectedEarnings.toLocaleString()}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="border border-gray-300 px-2 py-2 text-center">
                        <span className={`px-2 py-1 rounded text-xs ${getStatusColor(schedule.status)}`}>
                          {schedule.status === 'confirmed' ? '確定' : schedule.status === 'published' ? '公開' : '下書き'}
                        </span>
                      </td>
                      <td className="border border-gray-300 px-2 py-2 align-top">
                        <Textarea
                          value={schedule.remarks ?? ''}
                          readOnly={editingRowId !== schedule.id}
                          onChange={(e) => updateScheduleFields(schedule.id, { remarks: e.target.value })}
                          placeholder="備考"
                          className="border-0 text-xs min-h-[96px] w-full"
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

      {/* フッター */}
      <div className="p-4 mt-4">
        <div className="flex items-center gap-4 text-xs text-gray-600">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-blue-100 border border-blue-300 rounded"></div>
            <span>勤務予定</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-gray-100 border border-gray-300 rounded"></div>
            <span>休み</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-green-100 border border-green-300 rounded"></div>
            <span>確定済み</span>
          </div>
        </div>
      </div>
    </div>
  );
}