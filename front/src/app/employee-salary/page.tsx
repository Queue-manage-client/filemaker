'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ArrowLeft, ChevronLeft, ChevronRight, Search, Calendar, Users, FileText, Calculator, BookOpen } from "lucide-react";
import type { ShiftType } from '@/types/employee';
import { shiftTypeSettings } from '@/types/employee';
import { sampleEmployeeWeeklyShifts } from '@/data/employeeSampleData';
import { useEmployeeWeeklyShifts } from '@/hooks/use-employee';

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

export default function EmployeeSalary() {
  const [currentWeekStart, setCurrentWeekStart] = useState(new Date());
  const [weekDates, setWeekDates] = useState<Date[]>([]);
  const [activeTab, setActiveTab] = useState<TabType>('weekly_schedule');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    document.title = '従業員週間出勤予定 - Dispatch Harmony Hub';
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

  const getShiftColor = (shiftType: ShiftType) => {
    const settings = shiftTypeSettings[shiftType];
    return settings ? settings.color : 'bg-gray-200';
  };

  const getShiftTextColor = (shiftType: ShiftType) => {
    const settings = shiftTypeSettings[shiftType];
    return settings ? settings.textColor : 'text-gray-800';
  };

  // const getShiftLabel = (shiftType: ShiftType) => {
  //   const settings = shiftTypeSettings[shiftType];
  //   return settings ? settings.label : '不明';
  // };

  const filteredShifts = shiftsData.filter(shift =>
    shift.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    shift.employeeNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
    shift.position.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const tabConfig = [
    { key: 'weekly_schedule', label: '従業員週間出勤予定', icon: Calendar },
    { key: 'attendance_registration', label: '出勤表登録', icon: Users },
    { key: 'shift_print', label: 'シフト表印刷', icon: FileText },
    { key: 'registration_list', label: '登録情報一覧', icon: BookOpen },
    { key: 'monthly_summary', label: '締め・月別集計', icon: Calculator }
  ];

  return (
    <div className="min-h-screen bg-gray-100">
      {/* 戻るボタン */}
      <div className="p-4">
        <Link href="/dashboard">
          <Button
            variant="outline"
            className="flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            ダッシュボードに戻る
          </Button>
        </Link>
      </div>

      {/* ヘッダー */}
      <div className="px-4 mb-4">
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <h1 className="text-xl font-bold">従業員週間出勤予定</h1>

              <div className="flex items-center gap-4">
                {error && (
                  <span className="text-red-600 text-sm">データ取得に失敗しました</span>
                )}
                {isLoading && (
                  <span className="text-gray-600 text-sm">読み込み中...</span>
                )}
                {/* 週移動ボタン */}
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => navigateWeek('prev')}
                  >
                    <ChevronLeft className="w-4 h-4" />
                    前週
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={goToCurrentWeek}
                  >
                    今週
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => navigateWeek('next')}
                  >
                    翌週
                    <ChevronRight className="w-4 h-4" />
                  </Button>
                </div>

                {/* 週表示 */}
                <div className="text-sm font-semibold">
                  {weekDates.length > 0 && `${formatDate(weekDates[0])} - ${formatDate(weekDates[6])}`}
                </div>

                {/* 検索 */}
                <div className="flex items-center gap-2">
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
            </div>

            {/* タブ */}
            <div className="flex items-center gap-2 mt-4">
              {tabConfig.map((tab) => {
                const Icon = tab.icon;
                return (
                  <Button
                    key={tab.key}
                    variant={activeTab === tab.key ? "default" : "outline"}
                    size="sm"
                    onClick={() => setActiveTab(tab.key as TabType)}
                    className="flex items-center gap-2"
                  >
                    <Icon className="w-4 h-4" />
                    {tab.label}
                  </Button>
                );
              })}
            </div>
          </CardHeader>
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
                    <th className="border border-gray-300 px-2 py-2 w-16 sticky left-0 bg-gray-200">No</th>
                    <th className="border border-gray-300 px-2 py-2 w-20 sticky left-16 bg-gray-200">従業員No</th>
                    <th className="border border-gray-300 px-2 py-2 w-24 sticky left-36 bg-gray-200">氏名</th>
                    <th className="border border-gray-300 px-2 py-2 w-20 sticky left-60 bg-gray-200">部署</th>
                    <th className="border border-gray-300 px-2 py-2 w-20 sticky left-80 bg-gray-200">役職</th>
                    {weekDates.map((date, index) => (
                      <th key={index} className="border border-gray-300 px-2 py-2 w-32">
                        <div className="text-center">
                          <div>{formatDate(date)} {getDayName(date)}</div>
                          <div className="text-xs text-gray-500">時間 / 場所</div>
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
                        {index + 1}
                      </td>
                      <td className="border border-gray-300 px-2 py-2 text-center sticky left-16 bg-white">
                        {shift.employeeNumber}
                      </td>
                      <td className="border border-gray-300 px-2 py-2 sticky left-36 bg-white">
                        <div className="font-semibold">{shift.name}</div>
                      </td>
                      <td className="border border-gray-300 px-2 py-2 sticky left-60 bg-white">
                        {shift.department}
                      </td>
                      <td className="border border-gray-300 px-2 py-2 sticky left-80 bg-white">
                        {shift.position}
                      </td>
                      {(['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'] as const).map((dayKey, dayIndex) => {
                        const daySchedule = shift.weeklySchedule[dayKey];

                        return (
                          <td key={dayIndex} className="border border-gray-300 px-1 py-1">
                            {daySchedule.isWorkDay ? (
                              <div className="space-y-1">
                                <div className={`text-xs p-1 rounded text-center ${getShiftColor(daySchedule.shiftType)} ${getShiftTextColor(daySchedule.shiftType)}`}>
                                  <div className="font-semibold">
                                    {daySchedule.startTime} - {daySchedule.endTime}
                                  </div>
                                  <div className="text-xs opacity-75">
                                    {daySchedule.workHours}h ({daySchedule.breakTime}m休憩)
                                  </div>
                                  {daySchedule.location && (
                                    <div className="text-xs opacity-75">
                                      {daySchedule.location}
                                    </div>
                                  )}
                                  {daySchedule.notes && (
                                    <div className="text-xs opacity-75 mt-1">
                                      {daySchedule.notes}
                                    </div>
                                  )}
                                </div>
                              </div>
                            ) : (
                              <div className="text-center">
                                <div className={`text-xs p-2 rounded ${getShiftColor('off')} ${getShiftTextColor('off')}`}>
                                  休み
                                </div>
                              </div>
                            )}
                          </td>
                        );
                      })}
                      <td className="border border-gray-300 px-2 py-2 text-center">
                        <div className="space-y-1">
                          <div className="text-xs">
                            <div>勤務日: {shift.weeklyStats.totalWorkDays}日</div>
                            <div>総時間: {shift.weeklyStats.totalWorkHours}h</div>
                            <div>休憩: {shift.weeklyStats.totalBreakTime}分</div>
                            <div className="text-green-600 font-semibold">
                              ¥{(shift.weeklyStats.totalWorkHours * 1500).toLocaleString()}
                            </div>
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
          <span className="font-semibold">シフト種類:</span>
          {(Object.entries(shiftTypeSettings) as [string, typeof shiftTypeSettings[keyof typeof shiftTypeSettings]][]).map(([key, settings]) => (
            <div key={key} className="flex items-center gap-2">
              <div className={`w-4 h-4 rounded ${settings.color}`}></div>
              <span>{settings.label}</span>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}