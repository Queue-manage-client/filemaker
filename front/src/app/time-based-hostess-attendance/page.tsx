'use client';

// ハイドレーションエラーあり　要修正

import React, { useEffect, useRef, useState } from "react";
import Link from 'next/link';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ArrowLeft, Search, Calendar, Plus, Clock, MapPin, FileText, Settings, AlertTriangle } from "lucide-react";
import { timeBasedHostessAttendanceSampleData } from '@/data/timeBasedHostessAttendanceSampleData';
import type { HostessAttendanceTask, AttendanceDataItem } from '@/types/time-based-hostess-attendance';

// --- Types --- 別ファイルに分離済み

// --- Data Conversion ---
function convertToGanttTasks(attendanceData: unknown[]): HostessAttendanceTask[] {
  return attendanceData.map(item => {
    const startDate = new Date();
    const endDate = new Date();
    // itemの型安全を担保し、unknownを型ガード
    if (
      typeof item !== "object" ||
      item === null ||
      typeof (item as AttendanceDataItem).startTime !== "string" ||
      typeof (item as AttendanceDataItem).endTime !== "string"
    ) {
      throw new Error("DATA_001: attendanceDataの要素が不正です");
    }
    const typedItem = item as AttendanceDataItem;
    const { startTime, endTime } = typedItem;

    // 時間文字列をパース
    const [startHour, startMin] = startTime.split(':').map(Number);
    const [endHour, endMin] = endTime.split(':').map(Number);

    // 同日の場合と翌日にまたがる場合を考慮
    startDate.setHours(startHour, startMin, 0, 0);
    if (endHour < startHour) {
      // 翌日にまたがる場合
      endDate.setDate(endDate.getDate() + 1);
    }
    endDate.setHours(endHour, endMin, 0, 0);
    
    return {
      id: typedItem.id || Math.random().toString(36).substr(2, 9),
      hostessId: typedItem.hostessId || 'unknown',
      hostessName: typedItem.hostessName || 'ホステス名未設定',
      start: startDate.toISOString(),
      end: endDate.toISOString(),
      location: typedItem.location || '',
      notes: typedItem.notes || '',
    };
  });
}

// --- Helper Functions ---
const MS_PER_MIN = 60 * 1000;
// const clamp = (v: number, a: number, b: number) => Math.max(a, Math.min(b, v));

function isoToMinutes(iso: string) {
  return Math.floor(new Date(iso).getTime() / MS_PER_MIN);
}

// function minutesToIso(mins: number) {
//   return new Date(mins * MS_PER_MIN).toISOString();
// }

// function snapToOne(mins: number) {
//   return Math.round(mins / 1) * 1;
// }

function formatHourLabel(minutes: number) {
  const d = new Date(minutes * MS_PER_MIN);
  const hh = String(d.getHours()).padStart(2, "0");
  return `${hh}:00`;
}

function formatTimeRange(start: string, end: string) {
  const startDate = new Date(start);
  const endDate = new Date(end);
  return `${startDate.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })} - ${endDate.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}`;
}

// --- Main Component ---
export default function TimeBasedHostessAttendance() {
  React.useEffect(() => {
    document.title = '時間別ホステス出勤管理 - Dispatch Harmony Hub';
  }, []);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [width, setWidth] = useState(1200);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDate] = useState('2025-01-27'); // 将来の日付フィルタ機能で使用予定
  
  // データの変換と状態管理
  const [tasks] = useState<HostessAttendanceTask[]>(
    convertToGanttTasks(timeBasedHostessAttendanceSampleData)
  );
  
  const [active, setActive] = useState<{
    id: string;
    mode: "drag" | "resize-left" | "resize-right"
  } | null>(null);

  // クリック時の詳細表示用
  const [selectedTask, setSelectedTask] = useState<HostessAttendanceTask | null>(null);

  // 目標設定ダイアログ
  const [showTargetSettings, setShowTargetSettings] = useState(false);

  // 時間区分の目標設定（編集可能）
  const [timeSlotTargets, setTimeSlotTargets] = useState([
    { label: '9時〜13時', start: 9, end: 13, targetMinutes: 480, targetPercent: 13 },
    { label: '13時〜17時', start: 13, end: 17, targetMinutes: 720, targetPercent: 19 },
    { label: '17時〜21時', start: 17, end: 21, targetMinutes: 960, targetPercent: 26 },
    { label: '21時〜1時', start: 21, end: 25, targetMinutes: 1200, targetPercent: 32 },
    { label: '1時〜4時', start: 1, end: 4, targetMinutes: 360, targetPercent: 10 },
  ]);

  // 検索フィルター
  const filteredTasks = tasks.filter(task =>
    task.hostessName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    task.location?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // 幅の監視
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const ro = new ResizeObserver(() => {
      setWidth(el.clientWidth);
    });
    ro.observe(el);
    setWidth(el.clientWidth);
    return () => ro.disconnect();
  }, []);

  // 時間範囲の設定（9時〜翌4:30時、右側余白のため30分延長）
  const today = new Date();
  const rangeStart = new Date(today);
  rangeStart.setHours(9, 0, 0, 0);
  const rangeEnd = new Date(today);
  rangeEnd.setDate(rangeEnd.getDate() + 1);
  rangeEnd.setHours(4, 30, 0, 0);

  const startM = isoToMinutes(rangeStart.toISOString());
  const endM = isoToMinutes(rangeEnd.toISOString());
  const totalMinutes = Math.max(1, endM - startM);
  const pxPerMin = width / totalMinutes;

  const minutesToX = (m: number) => (m - startM) * pxPerMin;

  // ドラッグ&ドロップの状態管理
  const pointerState = useRef<{
    originX: number;
    taskId: string;
    initialStart: number;
    initialEnd: number;
    mode: "drag" | "resize-left" | "resize-right";
  } | null>(null);

  function beginPointer(e: React.PointerEvent, task: HostessAttendanceTask, mode: "drag" | "resize-left" | "resize-right") {
    (e.target as Element).setPointerCapture(e.pointerId);
    e.stopPropagation();
    
    const px = e.clientX - (containerRef.current?.getBoundingClientRect().left ?? 0);
    const initStart = isoToMinutes(task.start);
    const initEnd = isoToMinutes(task.end);
    
    pointerState.current = {
      originX: px,
      taskId: task.id,
      initialStart: initStart,
      initialEnd: initEnd,
      mode,
    };
    setActive({ id: task.id, mode });
  }

  function endPointer() {
    if (!pointerState.current) return;
    pointerState.current = null;
    setActive(null);
  }

  useEffect(() => {
    //const onMove = (e: PointerEvent) => movePointer(e);
    const onUp = () => endPointer();
    
    //window.addEventListener("pointermove", onMove);
    window.addEventListener("pointerup", onUp);
    window.addEventListener("pointercancel", onUp);
    
    return () => {
      //window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerup", onUp);
      window.removeEventListener("pointercancel", onUp);
    };
  }, [pxPerMin, startM, endM]);

  // 時間軸の目盛り生成（重要な時間のみ表示）
  const hourTicks: number[] = [];
  // 時間区分境界線と2時間ごとの目盛りを含む重要な時間
  const importantHours = [9, 11, 13, 15, 17, 19, 21, 23, 1, 3, 4]; // 4時も追加
  
  for (const hour of importantHours) {
    if (hour >= 9 && hour <= 23) {
      const d = new Date();
      d.setHours(hour, 0, 0, 0);
      hourTicks.push(isoToMinutes(d.toISOString()));
    } else if (hour >= 0 && hour <= 4) {
      const d = new Date();
      d.setDate(d.getDate() + 1);
      d.setHours(hour, 0, 0, 0);
      hourTicks.push(isoToMinutes(d.toISOString()));
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}/${month}/${day}`;
  };

  // 時間区分の定義（状態管理のtimeSlotTargetsを使用）
  const timeSlots = timeSlotTargets;

  // 時間区分別の統計計算
  const calculateTimeSlotStats = () => {
    return timeSlots.map(slot => {
      let totalMinutes = 0;
      let hostessCount = 0; // 延べ人数
      
      filteredTasks.forEach(task => {
        const startDate = new Date(task.start);
        const endDate = new Date(task.end);
        
        // タスクの開始・終了時間（24時間制、翌日は+24時間）
        const startHour = startDate.getHours();
        let endHour = endDate.getHours();
        const startMinute = startDate.getMinutes();
        const endMinute = endDate.getMinutes();
        
        // 翌日にまたがる場合の処理
        if (endHour < startHour || (endHour === startHour && endMinute < startMinute)) {
          endHour += 24;
        }
        
        // タスクの開始・終了（分単位、翌日考慮）
        const taskStartMin = startHour * 60 + startMinute;
        const taskEndMin = endHour * 60 + endMinute;
        
        // 時間区分の開始・終了（分単位）
        let slotStartMin: number;
        let slotEndMin: number;
        
        if (slot.start === 21 && slot.end === 25) {
          // 21時〜1時（翌日）: 21:00〜25:00（翌1:00）
          slotStartMin = 21 * 60;
          slotEndMin = 25 * 60;
        } else if (slot.start === 1 && slot.end === 4) {
          // 1時〜4時（翌日）: 25:00〜28:00（翌1:00〜翌4:00）
          slotStartMin = 25 * 60;
          slotEndMin = 28 * 60;
        } else {
          // 通常の時間区分
          slotStartMin = slot.start * 60;
          slotEndMin = slot.end * 60;
        }
        
        // 重複時間の計算
        const overlapStart = Math.max(slotStartMin, taskStartMin);
        const overlapEnd = Math.min(slotEndMin, taskEndMin);
        
        if (overlapStart < overlapEnd) {
          totalMinutes += overlapEnd - overlapStart;
          hostessCount += 1; // この時間区分に勤務しているホステス数をカウント
        }
      });
      
      // 時間と分に変換 一時的に無効化
      //const hours = Math.floor(totalMinutes / 60);
      //const minutes = totalMinutes % 60;
      
      const difference = totalMinutes - slot.targetMinutes;
      return {
        label: slot.label,
        totalMinutes,
        hostessCount,
        displayTime: `${totalMinutes}分`,
        targetMinutes: slot.targetMinutes,
        difference,
        differenceDisplay: difference >= 0 ? `+${difference}分` : `${difference}分`,
      };
    });
  };

  const timeSlotStats = calculateTimeSlotStats();

  // 総計統計の計算
  const totalTargetMinutes = timeSlotStats.reduce((sum, stat) => sum + stat.targetMinutes, 0);
  const totalStats = {
    totalMinutes: timeSlotStats.reduce((sum, stat) => sum + stat.totalMinutes, 0),
    totalHostessCount: timeSlotStats.reduce((sum, stat) => sum + stat.hostessCount, 0),
    totalTargetMinutes,
    totalDifference: timeSlotStats.reduce((sum, stat) => sum + stat.totalMinutes, 0) - totalTargetMinutes,
  };

  const totalDisplayTime = `${totalStats.totalMinutes}分`;
  const totalDifferenceDisplay = totalStats.totalDifference >= 0 ? `+${totalStats.totalDifference}分` : `${totalStats.totalDifference}分`;

  // 各区分に達成率・割合・マイナスポイントを追加
  const timeSlotStatsWithPercentage = timeSlotStats.map((stat, index) => {
    // 達成率 = 実績 / 目標 × 100
    const achievementRate = stat.targetMinutes > 0
      ? Math.round((stat.totalMinutes / stat.targetMinutes) * 100 * 10) / 10
      : 0;

    // 全体に対する割合
    const percentage = totalStats.totalMinutes > 0
      ? Math.round((stat.totalMinutes / totalStats.totalMinutes) * 100 * 10) / 10
      : 0;

    // 目標%
    const targetPercent = timeSlotTargets[index]?.targetPercent || 0;

    // マイナスポイント計算（達成率が100%未満の場合、不足%に応じてポイント減）
    // 例: 達成率80%なら -20ポイント
    const minusPoints = achievementRate < 100 ? Math.round(100 - achievementRate) : 0;

    return {
      ...stat,
      achievementRate,
      percentage,
      targetPercent,
      minusPoints,
    };
  });

  // 総合達成率
  const totalAchievementRate = totalStats.totalTargetMinutes > 0
    ? Math.round((totalStats.totalMinutes / totalStats.totalTargetMinutes) * 100 * 10) / 10
    : 0;

  // 総合マイナスポイント
  const totalMinusPoints = totalAchievementRate < 100 ? Math.round(100 - totalAchievementRate) : 0;

  return (
    <div className="min-h-screen bg-gray-100">
      {/* ヘッダー */}
      <div className="p-4">
        <Link href="/dashboard">
          <Button
            variant="outline"
            className="flex items-center gap-2 mb-4"
          >
            <ArrowLeft className="w-4 h-4" />
            ダッシュボードに戻る
          </Button>
        </Link>

        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <h1 className="text-xl font-bold">時間別ホステス出勤管理</h1>

              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  <span className="text-sm font-semibold">{formatDate(selectedDate)}</span>
                </div>

                <div className="flex items-center gap-2">
                  <Input
                    placeholder="ホステス名・場所で検索"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-64"
                  />
                  <Button variant="outline" size="sm">
                    <Search className="w-4 h-4" />
                  </Button>
                </div>

                <Button size="sm" className="flex items-center gap-2">
                  <Plus className="w-4 h-4" />
                  新規追加
                </Button>

                <Button
                  size="sm"
                  variant="outline"
                  className="flex items-center gap-2"
                  onClick={() => setShowTargetSettings(true)}
                >
                  <Settings className="w-4 h-4" />
                  目標%設定
                </Button>
              </div>
            </div>
          </CardHeader>
        </Card>
      </div>

      {/* メインコンテンツ */}
      <div className="px-4">
        <Card>
          <CardContent className="p-0">
            <div className="w-full">
              <div className="flex items-center gap-4 mb-2 px-4 pt-4">
                <div className="text-sm text-slate-600">タイムライン (9:00 〜 翌4:30)</div>
                <div className="text-xs text-slate-500">調整スナップ: 1分</div>
                <div className="text-xs text-slate-500">総件数: {filteredTasks.length}件</div>
              </div>

              <div className="border rounded-lg overflow-hidden mx-4" style={{ width: 'calc(100% - 2rem)' }}>
                <div className="flex">
                  {/* 左側：ホステス名リスト */}
                  <div className="w-48 bg-gray-50 border-r">
                    {/* ヘッダー */}
                    <div className="h-10 bg-white border-b flex items-center px-3">
                      <div className="text-xs text-slate-600 font-medium">ホステス名</div>
                    </div>
                    
                    {/* ホステスリスト */}
                    <div className="relative" style={{ height: Math.max(400, filteredTasks.length * 64) }}>
                      {filteredTasks.map((task, idx) => {
                        const top = idx * 64 + 8;
                        return (
                          <div key={task.id} className="absolute" style={{ left: 0, top, right: 0 }}>
                            <div className="px-3 py-2 text-sm text-slate-700">
                              <div className="font-semibold">{task.hostessName}</div>
                              <div className="text-xs text-slate-500">{task.location}</div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* 右側：ガントチャート */}
                  <div ref={containerRef} className="flex-1 select-none">
                    {/* 時間軸ヘッダー */}
                    <div className="relative h-10 bg-white border-b">
                      <div style={{ position: "absolute", left: 0, top: 0, right: 0, bottom: 0 }}>
                        {hourTicks.map((m) => {
                          const x = minutesToX(m);
                          return (
                            <div key={m} style={{ position: "absolute", left: x }} className="-translate-x-1/2">
                              <div className="text-xs text-slate-600 font-medium">{formatHourLabel(m)}</div>
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    {/* タスク表示エリア */}
                    <div className="relative" style={{ height: Math.max(400, filteredTasks.length * 64) }}>
                      {/* 背景グリッド */}
                      <div style={{ position: "absolute", left: 0, right: 0, top: 0, bottom: 0 }}>
                        {Array.from({ length: Math.ceil(totalMinutes / 60) }).map((_, i) => {
                          const m = startM + i * 60;
                          const x = minutesToX(m);
                          const hour = new Date(m * MS_PER_MIN).getHours();
                          
                          // 重要な時間のみ表示（時間区分境界線 + 目盛り表示時間）
                          const importantHours = [9, 11, 13, 15, 17, 19, 21, 23, 1, 3, 4];
                          const isBoundary = [9, 13, 17, 21, 1, 4].includes(hour);
                          const isImportantHour = importantHours.includes(hour);
                          
                          if (!isImportantHour) {
                            return null; // 重要でない時間は表示しない
                          }
                          
                          const lineWidth = isBoundary ? 3 : 1;
                          const opacity = isBoundary ? "opacity-50" : "opacity-20";
                          const bgColor = isBoundary ? "bg-blue-500" : "bg-gray-400";
                          
                          return (
                            <div 
                              key={i} 
                              style={{ position: "absolute", left: x, top: 0, bottom: 0, width: lineWidth }} 
                              className={`${opacity} ${bgColor}`} 
                            />
                          );
                        })}
                      </div>

                      {/* ホステスタスク */}
                      {filteredTasks.map((task, idx) => {
                        const top = idx * 64 + 8;
                        const startMin = isoToMinutes(task.start);
                        const endMin = isoToMinutes(task.end);
                        const left = minutesToX(startMin);
                        const w = Math.max(80, (endMin - startMin) * pxPerMin);
                        const isActive = active?.id === task.id;

                        return (
                          <div key={task.id} className="absolute" style={{ left: 0, top }}>
                            {/* 勤務時間バー */}
                            <div
                              className={`rounded-md shadow-md cursor-pointer transition-all hover:brightness-110 ${isActive ? "ring-2 ring-offset-1 ring-blue-400" : ""}`}
                              style={{
                                position: "absolute",
                                left,
                                width: w,
                                height: 40,
                                background: "#60a5fa",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "space-between",
                                padding: "0 8px",
                                color: "white",
                                userSelect: "none",
                              }}
                              onClick={() => setSelectedTask(task)}
                              onPointerDown={(e) => beginPointer(e, task, "drag")}
                              title={`${task.hostessName}: ${formatTimeRange(task.start, task.end)} - クリックで詳細表示`}
                            >
                              <div className="text-xs truncate flex-1">
                                {formatTimeRange(task.start, task.end)}
                              </div>

                              {/* リサイズハンドル（右） */}
                              <div
                                onPointerDown={(e) => {
                                  e.stopPropagation();
                                  beginPointer(e, task, "resize-right");
                                }}
                                style={{ width: 12, height: "100%", cursor: "ew-resize", display: "flex", alignItems: "center", justifyContent: "center" }}
                              >
                                <div className="w-1 h-6 rounded bg-white/80" />
                              </div>

                              {/* リサイズハンドル（左） */}
                              <div
                                onPointerDown={(e) => {
                                  e.stopPropagation();
                                  beginPointer(e, task, "resize-left");
                                }}
                                style={{ position: "absolute", left: -8, top: 0, width: 16, height: "100%", cursor: "ew-resize" }}
                              />
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* フッター - 時間区分別統計 */}
      <div className="p-4 mt-4">
        <Card>
          <CardContent className="p-4">
            {/* タイトル行 */}
            <div className="mb-4 pb-2 border-b border-gray-200">
              <h3 className="text-lg font-bold text-gray-800 mb-2">時間区分別統計</h3>
              <div className="grid grid-cols-5 gap-2 text-xs text-gray-600 font-medium">
                <div>時間帯</div>
                <div>人数計</div>
                <div>実績(分)</div>
                <div>目標時間(分)</div>
                <div>目標との差</div>
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              {timeSlotStatsWithPercentage.map((stat, index) => (
                <div
                  key={index}
                  className={`rounded-lg p-3 border ${
                    stat.difference >= 0
                      ? 'bg-gradient-to-r from-blue-50 to-blue-100 border-blue-200'
                      : 'bg-gradient-to-r from-red-50 to-red-100 border-red-200'
                  }`}
                >
                  {/* 時間帯ラベル */}
                  <div className={`text-xs font-bold mb-2 pb-1 border-b ${stat.difference >= 0 ? 'text-blue-800 border-blue-200' : 'text-red-800 border-red-200'}`}>
                    {stat.label}
                  </div>

                  {/* 延人数計 */}
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-[10px] text-gray-600">延人数計</span>
                    <span className="text-sm font-bold">{stat.hostessCount}</span>
                  </div>

                  {/* 実績（分と%） */}
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-[10px] text-gray-600">実績</span>
                    <div className="flex items-center gap-1">
                      <span className="text-sm font-bold">{stat.totalMinutes.toLocaleString()}</span>
                      <span className="text-[10px] bg-blue-200 px-1 rounded">{stat.percentage}%</span>
                    </div>
                  </div>

                  {/* 目標時間(分)と% */}
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-[10px] text-gray-600">目標時間(分)</span>
                    <div className="flex items-center gap-1">
                      <span className="text-sm font-bold">{stat.targetMinutes.toLocaleString()}</span>
                      <span className="text-[10px] bg-blue-200 px-1 rounded">{stat.targetPercent}%</span>
                    </div>
                  </div>

                  {/* 目標との差 */}
                  <div className={`flex justify-between items-center mt-2 pt-1 border-t ${stat.difference >= 0 ? 'border-blue-200' : 'border-red-200'}`}>
                    <span className="text-[10px] text-gray-600">目標との差</span>
                    <div className="flex items-center gap-1">
                      <span className={`text-sm font-bold ${stat.difference >= 0 ? 'text-blue-700' : 'text-red-600'}`}>
                        {stat.difference >= 0 ? '+' : ''}{stat.difference.toLocaleString()}
                      </span>
                      <span className={`text-[10px] px-1 rounded ${stat.difference >= 0 ? 'bg-blue-200' : 'bg-red-200'}`}>
                        {stat.difference >= 0 ? '+' : ''}{((stat.difference / (stat.targetMinutes || 1)) * 100).toFixed(0)}%
                      </span>
                    </div>
                  </div>
                </div>
              ))}

              {/* 総計カード */}
              <div className="rounded-lg p-3 border bg-gradient-to-r from-green-50 to-green-100 border-green-200">
                {/* 総計ラベル */}
                <div className="text-xs font-bold mb-2 pb-1 border-b text-green-800 border-green-200">
                  総計
                </div>

                {/* 延人数計 */}
                <div className="flex justify-between items-center mb-1">
                  <span className="text-[10px] text-gray-600">延人数計</span>
                  <span className="text-sm font-bold">{totalStats.totalHostessCount}</span>
                </div>

                {/* 実績（分と%） */}
                <div className="flex justify-between items-center mb-1">
                  <span className="text-[10px] text-gray-600">実績</span>
                  <div className="flex items-center gap-1">
                    <span className="text-sm font-bold">{totalStats.totalMinutes.toLocaleString()}</span>
                    <span className="text-[10px] bg-green-200 px-1 rounded">100%</span>
                  </div>
                </div>

                {/* 目標時間(分)と% */}
                <div className="flex justify-between items-center mb-1">
                  <span className="text-[10px] text-gray-600">目標時間(分)</span>
                  <div className="flex items-center gap-1">
                    <span className="text-sm font-bold">{totalStats.totalTargetMinutes.toLocaleString()}</span>
                    <span className="text-[10px] bg-green-200 px-1 rounded">100%</span>
                  </div>
                </div>

                {/* 目標との差 */}
                <div className={`flex justify-between items-center mt-2 pt-1 border-t border-green-200`}>
                  <span className="text-[10px] text-gray-600">目標との差</span>
                  <div className="flex items-center gap-1">
                    <span className={`text-sm font-bold ${totalStats.totalDifference >= 0 ? 'text-blue-700' : 'text-red-600'}`}>
                      {totalStats.totalDifference >= 0 ? '+' : ''}{totalStats.totalDifference.toLocaleString()}
                    </span>
                  </div>
                </div>

                {/* 達成目標率・ポイント */}
                <div className="mt-2 pt-2 border-t border-green-300 bg-white/50 rounded p-2">
                  <div className="text-[10px] text-gray-600 mb-1">達成目標率</div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] text-gray-500">達成率</span>
                    <span className={`text-lg font-bold ${totalAchievementRate >= 100 ? 'text-blue-600' : 'text-red-600'}`}>
                      {totalAchievementRate}%
                    </span>
                  </div>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-[10px] text-gray-500">ポイント</span>
                    <span className={`text-lg font-bold ${totalAchievementRate >= 100 ? 'text-green-600' : 'text-red-600'}`}>
                      {totalAchievementRate >= 100 ? ((totalAchievementRate - 100) / 10).toFixed(1) : `-${totalMinusPoints}`}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* 目標%設定ダイアログ */}
      <Dialog open={showTargetSettings} onOpenChange={setShowTargetSettings}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Settings className="w-5 h-5 text-blue-600" />
              時間別目標%設定
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="text-sm text-gray-600 bg-yellow-50 p-3 rounded-lg border border-yellow-200">
              <p className="font-medium text-yellow-800 mb-1">管理部歩合への影響</p>
              <p>各時間帯の達成率が100%を下回ると、不足分に応じてマイナスポイントが発生します。</p>
            </div>

            {/* 目標設定テーブル */}
            <div className="border rounded-lg overflow-hidden">
              <table className="w-full text-sm">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="text-left px-3 py-2">時間帯</th>
                    <th className="text-center px-3 py-2">目標時間(分)</th>
                    <th className="text-center px-3 py-2">目標%</th>
                  </tr>
                </thead>
                <tbody>
                  {timeSlotTargets.map((slot, index) => (
                    <tr key={index} className="border-t">
                      <td className="px-3 py-2 font-medium">{slot.label}</td>
                      <td className="px-3 py-2">
                        <Input
                          type="number"
                          value={slot.targetMinutes}
                          onChange={(e) => {
                            const newTargets = [...timeSlotTargets];
                            newTargets[index].targetMinutes = Number(e.target.value);
                            setTimeSlotTargets(newTargets);
                          }}
                          className="w-24 text-center"
                        />
                      </td>
                      <td className="px-3 py-2">
                        <div className="flex items-center justify-center gap-1">
                          <Input
                            type="number"
                            value={slot.targetPercent}
                            onChange={(e) => {
                              const newTargets = [...timeSlotTargets];
                              newTargets[index].targetPercent = Number(e.target.value);
                              setTimeSlotTargets(newTargets);
                            }}
                            className="w-16 text-center"
                            min={0}
                            max={100}
                          />
                          <span>%</span>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
                <tfoot className="bg-gray-50">
                  <tr className="border-t font-bold">
                    <td className="px-3 py-2">合計</td>
                    <td className="px-3 py-2 text-center">
                      {timeSlotTargets.reduce((sum, s) => sum + s.targetMinutes, 0)}分
                    </td>
                    <td className="px-3 py-2 text-center">
                      {timeSlotTargets.reduce((sum, s) => sum + s.targetPercent, 0)}%
                    </td>
                  </tr>
                </tfoot>
              </table>
            </div>

            {/* 目標%合計が100でない場合の警告 */}
            {timeSlotTargets.reduce((sum, s) => sum + s.targetPercent, 0) !== 100 && (
              <div className="flex items-center gap-2 text-orange-600 bg-orange-50 p-2 rounded">
                <AlertTriangle className="w-4 h-4" />
                <span className="text-sm">目標%の合計が100%になるように調整してください</span>
              </div>
            )}

            <div className="flex gap-2 pt-4 border-t">
              <Button variant="outline" className="flex-1" onClick={() => setShowTargetSettings(false)}>
                キャンセル
              </Button>
              <Button className="flex-1" onClick={() => setShowTargetSettings(false)}>
                保存
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* 詳細表示ダイアログ */}
      <Dialog open={!!selectedTask} onOpenChange={(open) => !open && setSelectedTask(null)}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Clock className="w-5 h-5 text-blue-600" />
              勤務詳細
            </DialogTitle>
          </DialogHeader>
          {selectedTask && (
            <div className="space-y-4">
              {/* ホステス情報 */}
              <div className="bg-blue-50 rounded-lg p-4">
                <div className="text-lg font-bold text-blue-900">{selectedTask.hostessName}</div>
                <div className="text-sm text-blue-700">ID: {selectedTask.hostessId}</div>
              </div>

              {/* 勤務時間 */}
              <div className="flex items-start gap-3">
                <Clock className="w-5 h-5 text-gray-500 mt-0.5" />
                <div>
                  <div className="text-sm font-medium text-gray-700">勤務時間</div>
                  <div className="text-base font-semibold">{formatTimeRange(selectedTask.start, selectedTask.end)}</div>
                  <div className="text-xs text-gray-500">
                    {(() => {
                      const startDate = new Date(selectedTask.start);
                      const endDate = new Date(selectedTask.end);
                      const diffMs = endDate.getTime() - startDate.getTime();
                      const diffMins = Math.floor(diffMs / (1000 * 60));
                      const hours = Math.floor(diffMins / 60);
                      const mins = diffMins % 60;
                      return `合計: ${hours}時間${mins > 0 ? `${mins}分` : ''}`;
                    })()}
                  </div>
                </div>
              </div>

              {/* 場所 */}
              {selectedTask.location && (
                <div className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 text-gray-500 mt-0.5" />
                  <div>
                    <div className="text-sm font-medium text-gray-700">場所</div>
                    <div className="text-base">{selectedTask.location}</div>
                  </div>
                </div>
              )}

              {/* 備考 */}
              {selectedTask.notes && (
                <div className="flex items-start gap-3">
                  <FileText className="w-5 h-5 text-gray-500 mt-0.5" />
                  <div>
                    <div className="text-sm font-medium text-gray-700">備考</div>
                    <div className="text-base whitespace-pre-wrap">{selectedTask.notes}</div>
                  </div>
                </div>
              )}

              {/* アクションボタン */}
              <div className="flex gap-2 pt-4 border-t">
                <Button variant="outline" className="flex-1" onClick={() => setSelectedTask(null)}>
                  閉じる
                </Button>
                <Button className="flex-1">
                  編集
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}