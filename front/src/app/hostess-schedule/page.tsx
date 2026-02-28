'use client';

import React, { useState, useMemo, useRef, useCallback } from 'react';
import Link from 'next/link';
import { Button } from "@/components/ui/button";
import { ArrowLeft, ChevronLeft, ChevronRight, ChevronDown, Trash2, Save, X, Check } from "lucide-react";

// スケジュールデータの型定義
interface ScheduleEntry {
  id: string;
  hostessId: string;
  date: string; // "YYYY-MM-DD"
  status: 'work' | 'off';
  startTime: string;
  endTime: string;
  comment: string;
}

// ホステスデータの型定義
interface HostessData {
  id: string;
  name: string;
  workType: string;
  assignedStaff: string;
  storeId: string;
}

// 店舗データ
const sampleStores = [
  { id: "store1", name: "銀座本店" },
  { id: "store2", name: "新宿店" },
  { id: "store3", name: "渋谷店" },
];

// サンプルホステスデータ
const sampleHostesses: HostessData[] = [
  { id: "1", name: "すみれ", workType: "正社員", assignedStaff: "佐藤", storeId: "store1" },
  { id: "2", name: "瑠璃-ruri-", workType: "パート", assignedStaff: "高橋", storeId: "store1" },
  { id: "3", name: "かんな", workType: "契約", assignedStaff: "田中", storeId: "store1" },
  { id: "4", name: "スイレン", workType: "派遣", assignedStaff: "山田", storeId: "store1" },
  { id: "5", name: "妃-kisaki-", workType: "正社員", assignedStaff: "佐藤", storeId: "store2" },
  { id: "6", name: "ミイ", workType: "パート", assignedStaff: "鈴木", storeId: "store2" },
  { id: "7", name: "かなの", workType: "契約", assignedStaff: "高橋", storeId: "store2" },
  { id: "8", name: "あみ", workType: "派遣", assignedStaff: "田中", storeId: "store2" },
  { id: "9", name: "雪-yuki-", workType: "正社員", assignedStaff: "山田", storeId: "store3" },
  { id: "10", name: "か美-hiro-…", workType: "パート", assignedStaff: "佐藤", storeId: "store3" },
  { id: "11", name: "りあん", workType: "契約", assignedStaff: "鈴木", storeId: "store3" },
  { id: "12", name: "あず", workType: "派遣", assignedStaff: "高橋", storeId: "store3" },
];

// 日付をYYYY-MM-DD形式にフォーマット
const formatDateKey = (date: Date): string => {
  return date.toISOString().split('T')[0];
};

// 日付を取得
const getToday = () => new Date();

// 週の開始日（月曜日）を取得
const getWeekStart = (date: Date): Date => {
  const d = new Date(date);
  const day = d.getDay();
  const diff = day === 0 ? -6 : 1 - day;
  d.setDate(d.getDate() + diff);
  return d;
};

// 月の開始日を取得
const getMonthStart = (date: Date): Date => {
  return new Date(date.getFullYear(), date.getMonth(), 1);
};

// 週の日数
const DAY_COUNT = 7;
const DAY_NAMES = ['月', '火', '水', '木', '金', '土', '日'];

// サンプルスケジュールデータを生成
const generateSampleSchedules = (): ScheduleEntry[] => {
  const schedules: ScheduleEntry[] = [];
  const today = getToday();
  const weekStart = getWeekStart(today);

  sampleHostesses.forEach((hostess, hostessIndex) => {
    // 週の各日に対してサンプルデータを作成
    for (let i = 0; i < 7; i++) {
      const date = new Date(weekStart);
      date.setDate(weekStart.getDate() + i);
      const dateStr = formatDateKey(date);

      // ランダムに出勤/休みを決定
      const isOff = (hostessIndex + i) % 4 === 0;

      schedules.push({
        id: `${hostess.id}-${dateStr}`,
        hostessId: hostess.id,
        date: dateStr,
        status: isOff ? 'off' : 'work',
        startTime: isOff ? '' : `${10 + (hostessIndex % 5)}:00`,
        endTime: isOff ? '' : `${18 + (hostessIndex % 4)}:00`,
        comment: '',
      });
    }

    // 月間のデータも追加（今月分）
    const monthStart = getMonthStart(today);
    const daysInMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0).getDate();

    for (let i = 0; i < daysInMonth; i++) {
      const date = new Date(monthStart);
      date.setDate(monthStart.getDate() + i);
      const dateStr = formatDateKey(date);

      // 既に週間データがある場合はスキップ
      if (schedules.find(s => s.hostessId === hostess.id && s.date === dateStr)) {
        continue;
      }

      const isOff = (hostessIndex + i) % 4 === 0;

      schedules.push({
        id: `${hostess.id}-${dateStr}`,
        hostessId: hostess.id,
        date: dateStr,
        status: isOff ? 'off' : 'work',
        startTime: isOff ? '' : `${10 + (hostessIndex % 5)}:00`,
        endTime: isOff ? '' : `${18 + (hostessIndex % 4)}:00`,
        comment: '',
      });
    }
  });

  return schedules;
};

type ViewTab = 'daily' | 'weekly' | 'monthly';

export default function HostessSchedule() {
  React.useEffect(() => {
    document.title = 'ホステススケジュール管理 - Dispatch Harmony Hub';
  }, []);

  const [currentDate, setCurrentDate] = useState(getToday());
  const [activeTab, setActiveTab] = useState<ViewTab>('daily');
  const [hostesses] = useState<HostessData[]>(sampleHostesses);
  const [stores] = useState(sampleStores);
  const [selectedStoreId, setSelectedStoreId] = useState<string>(sampleStores[0].id);
  const [schedules, setSchedules] = useState<ScheduleEntry[]>(generateSampleSchedules);
  const [originalSchedules, setOriginalSchedules] = useState<ScheduleEntry[]>(generateSampleSchedules);
  const [searchText, setSearchText] = useState('');
  const [staffFilter, setStaffFilter] = useState<string>('');
  const [selectedHostessId, setSelectedHostessId] = useState<string | null>(null);

  // 変更追跡用
  const [changedHostessIds, setChangedHostessIds] = useState<Set<string>>(new Set());

  // 保存モーダル用
  const [showSaveModal, setShowSaveModal] = useState(false);
  const [selectedForSave, setSelectedForSave] = useState<Set<string>>(new Set());

  // スクロール同期用のref
  const leftPanelRef = useRef<HTMLDivElement>(null);
  const rightPanelRef = useRef<HTMLDivElement>(null);
  const isScrollingSyncRef = useRef(false);

  // 左パネルのスクロールを右に同期
  const handleLeftScroll = useCallback(() => {
    if (isScrollingSyncRef.current) return;
    if (leftPanelRef.current && rightPanelRef.current) {
      isScrollingSyncRef.current = true;
      rightPanelRef.current.scrollTop = leftPanelRef.current.scrollTop;
      requestAnimationFrame(() => {
        isScrollingSyncRef.current = false;
      });
    }
  }, []);

  // 右パネルのスクロールを左に同期
  const handleRightScroll = useCallback(() => {
    if (isScrollingSyncRef.current) return;
    if (leftPanelRef.current && rightPanelRef.current) {
      isScrollingSyncRef.current = true;
      leftPanelRef.current.scrollTop = rightPanelRef.current.scrollTop;
      requestAnimationFrame(() => {
        isScrollingSyncRef.current = false;
      });
    }
  }, []);

  // スケジュールを更新
  const updateSchedule = useCallback((hostessId: string, dateStr: string, updates: Partial<ScheduleEntry>) => {
    setSchedules(prev => {
      const index = prev.findIndex(s => s.hostessId === hostessId && s.date === dateStr);
      if (index >= 0) {
        const newSchedules = [...prev];
        newSchedules[index] = { ...newSchedules[index], ...updates };
        return newSchedules;
      } else {
        // 新規作成
        return [...prev, {
          id: `${hostessId}-${dateStr}`,
          hostessId,
          date: dateStr,
          status: 'work' as const,
          startTime: '',
          endTime: '',
          comment: '',
          ...updates,
        }];
      }
    });
    // 変更されたホステスを追跡
    setChangedHostessIds(prev => new Set(prev).add(hostessId));
  }, []);

  // 変更があるホステスの情報を取得
  const changedHostesses = useMemo(() => {
    return hostesses.filter(h => changedHostessIds.has(h.id));
  }, [hostesses, changedHostessIds]);

  // 保存モーダルを開く
  const openSaveModal = useCallback(() => {
    setSelectedForSave(new Set(changedHostessIds));
    setShowSaveModal(true);
  }, [changedHostessIds]);

  // 保存実行
  const handleSave = useCallback(() => {
    // 選択されていないホステスの変更を元に戻す
    const hostsToRevert = Array.from(changedHostessIds).filter(id => !selectedForSave.has(id));

    if (hostsToRevert.length > 0) {
      setSchedules(prev => {
        const newSchedules = prev.map(schedule => {
          if (hostsToRevert.includes(schedule.hostessId)) {
            // 元のスケジュールに戻す
            const original = originalSchedules.find(
              o => o.hostessId === schedule.hostessId && o.date === schedule.date
            );
            return original || schedule;
          }
          return schedule;
        });
        return newSchedules;
      });
    }

    // 保存されたスケジュールを新しい「元」として設定
    setSchedules(current => {
      const savedSchedules = current.filter(s => selectedForSave.has(s.hostessId) || !changedHostessIds.has(s.hostessId));
      setOriginalSchedules([...current]);
      return current;
    });

    // 変更追跡をリセット（保存されたもののみ）
    setChangedHostessIds(new Set());
    setShowSaveModal(false);

    // 保存完了の通知（実際のAPIコールはここで行う）
    alert(`${selectedForSave.size}名のスケジュールを保存しました`);
  }, [changedHostessIds, selectedForSave, originalSchedules]);

  // 保存選択のトグル
  const toggleSaveSelection = useCallback((hostessId: string) => {
    setSelectedForSave(prev => {
      const newSet = new Set(prev);
      if (newSet.has(hostessId)) {
        newSet.delete(hostessId);
      } else {
        newSet.add(hostessId);
      }
      return newSet;
    });
  }, []);

  // 全選択/全解除
  const toggleSelectAll = useCallback(() => {
    if (selectedForSave.size === changedHostessIds.size) {
      setSelectedForSave(new Set());
    } else {
      setSelectedForSave(new Set(changedHostessIds));
    }
  }, [changedHostessIds, selectedForSave.size]);

  // ドラッグ操作用のstate
  const [dragState, setDragState] = useState<{
    hostessId: string;
    dateStr: string;
    mode: 'create' | 'move' | 'resize-start' | 'resize-end';
    startX: number;
    initialStartTime: string;
    initialEndTime: string;
  } | null>(null);

  // X座標から時間を計算
  const xToTime = useCallback((x: number, containerWidth: number): string => {
    const totalMinutes = Math.round((x / containerWidth) * 36 * 60);
    const clampedMinutes = Math.max(0, Math.min(36 * 60 - 1, totalMinutes));
    const hours = Math.floor(clampedMinutes / 60);
    const minutes = Math.round((clampedMinutes % 60) / 15) * 15; // 15分単位
    return `${hours.toString().padStart(2, '0')}:${(minutes % 60).toString().padStart(2, '0')}`;
  }, []);

  // 時間を分に変換
  const timeToMinutes = useCallback((time: string): number => {
    if (!time) return 0;
    const [hours, minutes] = time.split(':').map(Number);
    return hours * 60 + (minutes || 0);
  }, []);

  // 分を時間文字列に変換
  const minutesToTime = useCallback((totalMinutes: number): string => {
    const clampedMinutes = Math.max(0, Math.min(36 * 60 - 1, totalMinutes));
    const hours = Math.floor(clampedMinutes / 60);
    const minutes = clampedMinutes % 60;
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
  }, []);

  // タイムラインでのマウスダウン（新規作成開始）
  const handleTimelineMouseDown = useCallback((
    e: React.MouseEvent<HTMLDivElement>,
    hostessId: string,
    dateStr: string,
    hasExistingBar: boolean
  ) => {
    if (hasExistingBar) return; // 既存バーがある場合は新規作成しない

    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const time = xToTime(x, rect.width);

    setDragState({
      hostessId,
      dateStr,
      mode: 'create',
      startX: x,
      initialStartTime: time,
      initialEndTime: time,
    });

    updateSchedule(hostessId, dateStr, {
      status: 'work',
      startTime: time,
      endTime: time,
    });
  }, [xToTime, updateSchedule]);

  // バーのマウスダウン（移動開始）
  const handleBarMouseDown = useCallback((
    e: React.MouseEvent<HTMLDivElement>,
    hostessId: string,
    dateStr: string,
    startTime: string,
    endTime: string
  ) => {
    e.stopPropagation();

    setDragState({
      hostessId,
      dateStr,
      mode: 'move',
      startX: e.clientX,
      initialStartTime: startTime,
      initialEndTime: endTime,
    });
  }, []);

  // リサイズハンドルのマウスダウン
  const handleResizeMouseDown = useCallback((
    e: React.MouseEvent<HTMLDivElement>,
    hostessId: string,
    dateStr: string,
    startTime: string,
    endTime: string,
    edge: 'start' | 'end'
  ) => {
    e.stopPropagation();

    setDragState({
      hostessId,
      dateStr,
      mode: edge === 'start' ? 'resize-start' : 'resize-end',
      startX: e.clientX,
      initialStartTime: startTime,
      initialEndTime: endTime,
    });
  }, []);

  // マウス移動処理
  React.useEffect(() => {
    if (!dragState) return;

    const handleMouseMove = (e: MouseEvent) => {
      const timelineElements = document.querySelectorAll('[data-timeline]');
      let containerWidth = 800; // デフォルト

      timelineElements.forEach((el) => {
        if (el.getAttribute('data-hostess-id') === dragState.hostessId) {
          containerWidth = el.getBoundingClientRect().width;
        }
      });

      const deltaX = e.clientX - dragState.startX;
      const deltaMinutes = Math.round((deltaX / containerWidth) * 36 * 60 / 15) * 15; // 15分単位

      if (dragState.mode === 'create') {
        const startMinutes = timeToMinutes(dragState.initialStartTime);
        const currentX = dragState.startX + deltaX;
        const currentTime = xToTime(currentX, containerWidth);
        const currentMinutes = timeToMinutes(currentTime);

        if (currentMinutes >= startMinutes) {
          updateSchedule(dragState.hostessId, dragState.dateStr, {
            startTime: dragState.initialStartTime,
            endTime: currentTime,
          });
        } else {
          updateSchedule(dragState.hostessId, dragState.dateStr, {
            startTime: currentTime,
            endTime: dragState.initialStartTime,
          });
        }
      } else if (dragState.mode === 'move') {
        const startMinutes = timeToMinutes(dragState.initialStartTime) + deltaMinutes;
        const endMinutes = timeToMinutes(dragState.initialEndTime) + deltaMinutes;
        const duration = timeToMinutes(dragState.initialEndTime) - timeToMinutes(dragState.initialStartTime);

        // 範囲チェック
        if (startMinutes >= 0 && endMinutes <= 36 * 60) {
          updateSchedule(dragState.hostessId, dragState.dateStr, {
            startTime: minutesToTime(startMinutes),
            endTime: minutesToTime(endMinutes),
          });
        }
      } else if (dragState.mode === 'resize-start') {
        const newStartMinutes = timeToMinutes(dragState.initialStartTime) + deltaMinutes;
        const endMinutes = timeToMinutes(dragState.initialEndTime);

        if (newStartMinutes >= 0 && newStartMinutes < endMinutes - 15) {
          updateSchedule(dragState.hostessId, dragState.dateStr, {
            startTime: minutesToTime(newStartMinutes),
          });
        }
      } else if (dragState.mode === 'resize-end') {
        const startMinutes = timeToMinutes(dragState.initialStartTime);
        const newEndMinutes = timeToMinutes(dragState.initialEndTime) + deltaMinutes;

        if (newEndMinutes <= 36 * 60 && newEndMinutes > startMinutes + 15) {
          updateSchedule(dragState.hostessId, dragState.dateStr, {
            endTime: minutesToTime(newEndMinutes),
          });
        }
      }
    };

    const handleMouseUp = () => {
      setDragState(null);
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [dragState, timeToMinutes, minutesToTime, xToTime, updateSchedule]);

  // 担当者リストを抽出
  const staffList = useMemo(() => {
    const staffSet = new Set<string>();
    hostesses.forEach(h => {
      if (h.assignedStaff) staffSet.add(h.assignedStaff);
    });
    return Array.from(staffSet).sort((a, b) => a.localeCompare(b, 'ja'));
  }, [hostesses]);

  // フィルタされたホステス
  const filteredHostesses = useMemo(() => {
    let filtered = [...hostesses];
    // 店舗でフィルタ
    filtered = filtered.filter(h => h.storeId === selectedStoreId);
    if (searchText.trim()) {
      filtered = filtered.filter(h =>
        h.name.toLowerCase().includes(searchText.toLowerCase())
      );
    }
    if (staffFilter) {
      filtered = filtered.filter(h => h.assignedStaff === staffFilter);
    }
    return filtered;
  }, [hostesses, selectedStoreId, searchText, staffFilter]);

  // ナビゲーション
  const navigate = (direction: 'prev' | 'next') => {
    const newDate = new Date(currentDate);
    if (activeTab === 'daily') {
      newDate.setDate(currentDate.getDate() + (direction === 'next' ? 1 : -1));
    } else if (activeTab === 'weekly') {
      newDate.setDate(currentDate.getDate() + (direction === 'next' ? 7 : -7));
    } else {
      newDate.setMonth(currentDate.getMonth() + (direction === 'next' ? 1 : -1));
    }
    setCurrentDate(newDate);
  };

  // 日付表示フォーマット
  const formatDateDisplay = () => {
    if (activeTab === 'daily') {
      return `${currentDate.getFullYear()}年${currentDate.getMonth() + 1}月${currentDate.getDate()}日(${['日', '月', '火', '水', '木', '金', '土'][currentDate.getDay()]})`;
    } else if (activeTab === 'weekly') {
      const start = getWeekStart(currentDate);
      const end = new Date(start);
      end.setDate(start.getDate() + 6);
      return `${start.getFullYear()}年 ${start.getMonth() + 1}/${start.getDate()}〜${end.getMonth() + 1}/${end.getDate()}`;
    } else {
      return `${currentDate.getFullYear()}年${currentDate.getMonth() + 1}月`;
    }
  };

  // 週の日付リストを生成
  const weekDays = useMemo(() => {
    const start = getWeekStart(currentDate);
    return Array.from({ length: DAY_COUNT }, (_, i) => {
      const date = new Date(start);
      date.setDate(start.getDate() + i);
      const dayOfWeek = date.getDay();
      return {
        date,
        dateStr: formatDateKey(date),
        dayIndex: i,
        dayName: DAY_NAMES[i],
        displayDate: `${date.getDate()}(${['日', '月', '火', '水', '木', '金', '土'][dayOfWeek]})`,
        isWeekend: dayOfWeek === 0 || dayOfWeek === 6,
      };
    });
  }, [currentDate]);

  // 月の日付リストを生成
  const monthDays = useMemo(() => {
    const start = getMonthStart(currentDate);
    const daysInMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate();
    return Array.from({ length: daysInMonth }, (_, i) => {
      const date = new Date(start);
      date.setDate(start.getDate() + i);
      const dayOfWeek = date.getDay();
      return {
        date,
        dateStr: formatDateKey(date),
        dayIndex: i,
        dayName: ['日', '月', '火', '水', '木', '金', '土'][dayOfWeek],
        displayDate: `${date.getDate()}(${['日', '月', '火', '水', '木', '金', '土'][dayOfWeek]})`,
        isWeekend: dayOfWeek === 0 || dayOfWeek === 6,
      };
    });
  }, [currentDate]);

  // 月間カレンダー用の週別データを生成（月〜日の7列）
  const monthCalendarWeeks = useMemo(() => {
    const start = getMonthStart(currentDate);
    const daysInMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate();
    const firstDayOfWeek = start.getDay(); // 0=日, 1=月, ..., 6=土
    // 月曜始まりに変換 (月=0, 火=1, ..., 日=6)
    const firstDayOffset = firstDayOfWeek === 0 ? 6 : firstDayOfWeek - 1;

    const weeks: Array<Array<{
      date: Date | null;
      dateStr: string;
      dayOfMonth: number;
      dayName: string;
      isWeekend: boolean;
      isCurrentMonth: boolean;
    } | null>> = [];

    let currentWeek: typeof weeks[0] = [];

    // 月初の空白セル
    for (let i = 0; i < firstDayOffset; i++) {
      currentWeek.push(null);
    }

    // 月の日付を埋める
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
      const dayOfWeek = date.getDay();
      const dayIndex = dayOfWeek === 0 ? 6 : dayOfWeek - 1; // 月曜始まりのインデックス

      currentWeek.push({
        date,
        dateStr: formatDateKey(date),
        dayOfMonth: day,
        dayName: ['日', '月', '火', '水', '木', '金', '土'][dayOfWeek],
        isWeekend: dayOfWeek === 0 || dayOfWeek === 6,
        isCurrentMonth: true,
      });

      // 週の終わり（日曜日）または月末
      if (dayIndex === 6 || day === daysInMonth) {
        // 週末の空白セル
        while (currentWeek.length < 7) {
          currentWeek.push(null);
        }
        weeks.push(currentWeek);
        currentWeek = [];
      }
    }

    return weeks;
  }, [currentDate]);

  // 選択中のホステス
  const selectedHostess = useMemo(() => {
    if (!selectedHostessId) return null;
    return hostesses.find(h => h.id === selectedHostessId) || null;
  }, [selectedHostessId, hostesses]);

  // 月間タブ時、店舗変更時に自動的に最初のホステスを選択
  React.useEffect(() => {
    if (activeTab === 'monthly' && filteredHostesses.length > 0) {
      // 現在選択中のホステスが表示中のリストにいなければ、最初のホステスを選択
      const isSelectedInList = filteredHostesses.some(h => h.id === selectedHostessId);
      if (!isSelectedInList) {
        setSelectedHostessId(filteredHostesses[0].id);
      }
    }
  }, [activeTab, filteredHostesses, selectedHostessId]);

  // 特定のホステスと日付のスケジュールを取得
  const getSchedule = (hostessId: string, dateStr: string): ScheduleEntry | undefined => {
    return schedules.find(s => s.hostessId === hostessId && s.date === dateStr);
  };

  // 日の出勤者数を取得
  const getWorkCountForDate = (dateStr: string): number => {
    return schedules.filter(s =>
      s.date === dateStr &&
      s.status === 'work' &&
      filteredHostesses.some(h => h.id === s.hostessId)
    ).length;
  };

  // 時間をパーセントに変換（0-36時間対応）
  const timeToPercent = (time: string): number => {
    if (!time) return 0;
    const [hours, minutes] = time.split(':').map(Number);
    const totalMinutes = hours * 60 + (minutes || 0);
    return (totalMinutes / (36 * 60)) * 100; // 0-36時間の範囲
  };

  // バーの幅を計算
  const getBarWidth = (startTime: string, endTime: string): number => {
    if (!startTime || !endTime) return 0;
    const startPercent = timeToPercent(startTime);
    let endPercent = timeToPercent(endTime);
    // 翌日の場合
    if (endPercent < startPercent) {
      endPercent += (24 * 60) / (36 * 60) * 100;
    }
    return Math.max(endPercent - startPercent, 2);
  };

  // 時間軸の目盛り（0-36時間）
  const hourMarkers = Array.from({ length: 37 }, (_, i) => i);

  return (
    <div className="h-screen bg-gray-100 flex flex-col overflow-hidden">
      {/* ヘッダー */}
      <div className="h-[50px] bg-white border-b border-zinc-300 flex-shrink-0">
        <div className="flex items-center h-full px-2">
          <Link href="/dashboard">
            <Button
              variant="outline"
              className="h-8 px-3 text-sm flex items-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              ダッシュボードに戻る
            </Button>
          </Link>

          <div className="flex-1 flex items-center justify-center gap-4">
            <h1 className="text-lg font-bold">ホステススケジュール</h1>

            {/* 店舗選択 */}
            <select
              value={selectedStoreId}
              onChange={(e) => setSelectedStoreId(e.target.value)}
              className="h-8 px-3 text-sm font-medium border border-pink-300 rounded bg-pink-50 text-pink-700 focus:outline-none focus:ring-2 focus:ring-pink-400"
            >
              {stores.map(store => (
                <option key={store.id} value={store.id}>
                  {store.name}
                </option>
              ))}
            </select>

            {/* タブ切り替え */}
            <div className="flex bg-gray-200 rounded-lg p-1">
              <button
                onClick={() => setActiveTab('daily')}
                className={`px-4 py-1.5 text-sm font-medium rounded-md transition-colors ${
                  activeTab === 'daily'
                    ? 'bg-white text-blue-600 shadow-sm'
                    : 'text-gray-600 hover:text-gray-800'
                }`}
              >
                当日
              </button>
              <button
                onClick={() => setActiveTab('weekly')}
                className={`px-4 py-1.5 text-sm font-medium rounded-md transition-colors ${
                  activeTab === 'weekly'
                    ? 'bg-white text-blue-600 shadow-sm'
                    : 'text-gray-600 hover:text-gray-800'
                }`}
              >
                週間
              </button>
              <button
                onClick={() => setActiveTab('monthly')}
                className={`px-4 py-1.5 text-sm font-medium rounded-md transition-colors ${
                  activeTab === 'monthly'
                    ? 'bg-white text-blue-600 shadow-sm'
                    : 'text-gray-600 hover:text-gray-800'
                }`}
              >
                月間
              </button>
            </div>

            {/* 日付ナビゲーション */}
            <div className="flex items-center">
              <Button
                variant="outline"
                size="icon"
                className="h-8 w-8"
                onClick={() => navigate('prev')}
              >
                <ChevronLeft className="w-4 h-4" />
              </Button>
              <div className="text-sm font-mono bg-gray-500 text-white px-3 py-1 min-w-[180px] text-center">
                {formatDateDisplay()}
              </div>
              <Button
                variant="outline"
                size="icon"
                className="h-8 w-8"
                onClick={() => navigate('next')}
              >
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>

            {/* 保存ボタン */}
            <Button
              onClick={openSaveModal}
              disabled={changedHostessIds.size === 0}
              className={`h-8 px-4 text-sm flex items-center gap-2 ${
                changedHostessIds.size > 0
                  ? 'bg-blue-600 hover:bg-blue-700 text-white'
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              }`}
            >
              <Save className="w-4 h-4" />
              保存
              {changedHostessIds.size > 0 && (
                <span className="bg-white text-blue-600 text-xs px-1.5 py-0.5 rounded-full">
                  {changedHostessIds.size}
                </span>
              )}
            </Button>
          </div>
        </div>
      </div>

      {/* フィルター */}
      <div className="h-[36px] bg-white border-b border-zinc-300 flex items-center px-3 flex-shrink-0">
        <div className="flex items-center gap-2">
          <span className="text-xs text-gray-600 font-medium">担当者:</span>
          <select
            value={staffFilter}
            onChange={(e) => setStaffFilter(e.target.value)}
            className="h-7 px-2 text-xs border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-pink-400"
          >
            <option value="">全員</option>
            {staffList.map(staff => (
              <option key={staff} value={staff}>{staff}</option>
            ))}
          </select>
          <div className="w-px h-5 bg-gray-300 mx-1" />
          <span className="text-xs text-gray-600 font-medium">検索:</span>
          <input
            type="text"
            placeholder="キャスト名"
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            className="w-[180px] h-7 px-3 text-xs border border-gray-500 rounded-full focus:outline-none focus:ring-1 focus:ring-pink-400"
          />
        </div>
      </div>

      {/* メインコンテンツ */}
      <div className="flex-1 flex overflow-hidden">
        {/* 左側パネル - ホステスリスト（4カラム） */}
        <div className="flex-shrink-0 flex flex-col bg-pink-100 border-r border-pink-300">
          {/* ヘッダー行 */}
          <div className="h-[40px] border-b border-pink-300 flex-shrink-0 flex">
            <div className="w-[100px] border-r border-pink-300 flex items-center justify-center text-xs font-bold text-gray-700">
              名前
            </div>
            <div className="w-[60px] border-r border-pink-300 flex items-center justify-center text-xs font-bold text-gray-700">
              勤務形態
            </div>
            <div className="w-[50px] border-r border-pink-300 flex items-center justify-center text-xs font-bold text-gray-700">
              担当者
            </div>
            <div className="w-[50px] flex items-center justify-center text-xs font-bold text-gray-700">
              {activeTab === 'daily' ? '日' : activeTab === 'weekly' ? '週' : '月'}
            </div>
          </div>

          {/* ホステスリスト */}
          <div
            ref={leftPanelRef}
            onScroll={handleLeftScroll}
            className="flex-1 overflow-y-auto"
          >
            {filteredHostesses.map((hostess) => (
              <div
                key={hostess.id}
                className={`border-b border-pink-300 flex ${
                  activeTab === 'monthly' ? 'cursor-pointer hover:bg-pink-200' : ''
                } ${activeTab === 'monthly' && selectedHostessId === hostess.id ? 'bg-pink-300' : ''}`}
                style={{ height: activeTab === 'monthly' ? '40px' : '100px' }}
                onClick={() => {
                  if (activeTab === 'monthly') {
                    setSelectedHostessId(hostess.id);
                  }
                }}
              >
                {/* 名前 */}
                <div className="w-[100px] border-r border-pink-300 flex items-center px-2">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1">
                      <span className="text-sm font-medium truncate">{hostess.name}</span>
                      <ChevronDown className="w-3 h-3 text-gray-500 flex-shrink-0" />
                    </div>
                  </div>
                </div>
                {/* 勤務形態 */}
                <div className="w-[60px] border-r border-pink-300 flex items-center justify-center">
                  <span className="text-xs text-gray-700">{hostess.workType}</span>
                </div>
                {/* 担当者 */}
                <div className="w-[50px] border-r border-pink-300 flex items-center justify-center">
                  <span className="text-xs text-gray-700">{hostess.assignedStaff}</span>
                </div>
                {/* 週/日/月 */}
                <div className="w-[50px] flex items-center justify-center">
                  <span className="text-[10px] text-gray-400">
                    {activeTab === 'daily' ? '日スケ' : activeTab === 'weekly' ? '週スケ' : '月スケ'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 右側パネル - スケジュール表示 */}
        <div className="flex-1 overflow-hidden flex flex-col">
          {/* 当日タブ */}
          {activeTab === 'daily' && (
            <div
              ref={rightPanelRef}
              onScroll={handleRightScroll}
              className="flex-1 overflow-auto"
            >
              {filteredHostesses.map((hostess, index) => {
                const todayStr = formatDateKey(currentDate);
                const schedule = getSchedule(hostess.id, todayStr);
                const isWork = schedule?.status === 'work';
                const startTime = schedule?.startTime || '';
                const endTime = schedule?.endTime || '';
                const comment = schedule?.comment || '';

                return (
                  <div
                    key={hostess.id}
                    className="h-[100px] border-b border-gray-200"
                    style={{ backgroundColor: index % 2 === 0 ? '#f8fafc' : '#ffffff' }}
                  >
                    {/* 上段: 入力コントロール */}
                    <div className="h-[40px] flex items-center px-2 border-b border-gray-100">
                      {/* 出勤/休みセレクト */}
                      <div className="relative flex-shrink-0">
                        <select
                          value={schedule?.status || 'work'}
                          onChange={(e) => updateSchedule(hostess.id, todayStr, {
                            status: e.target.value as 'work' | 'off',
                            startTime: e.target.value === 'off' ? '' : startTime,
                            endTime: e.target.value === 'off' ? '' : endTime,
                          })}
                          className={`h-7 px-2 pr-6 text-sm font-medium rounded border-none appearance-none cursor-pointer ${
                            isWork
                              ? 'bg-blue-100 text-blue-600'
                              : 'bg-pink-100 text-pink-500'
                          }`}
                        >
                          <option value="work">出勤</option>
                          <option value="off">休み</option>
                        </select>
                        <ChevronDown className="absolute right-1 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none text-gray-400" />
                      </div>

                      {/* 時間表示 */}
                      <div className="flex-1 flex items-center justify-center gap-2">
                        {isWork ? (
                          <>
                            <input
                              type="time"
                              value={startTime}
                              onChange={(e) => updateSchedule(hostess.id, todayStr, { startTime: e.target.value })}
                              className="h-7 px-2 text-sm border-none bg-transparent text-center"
                            />
                            <span className="text-gray-500">〜</span>
                            <input
                              type="time"
                              value={endTime}
                              onChange={(e) => updateSchedule(hostess.id, todayStr, { endTime: e.target.value })}
                              className="h-7 px-2 text-sm border-none bg-transparent text-center"
                            />
                          </>
                        ) : (
                          <span className="text-pink-400 text-sm">休み</span>
                        )}
                      </div>

                      {/* コメント入力 */}
                      <input
                        type="text"
                        placeholder="コメントを入力"
                        value={comment}
                        onChange={(e) => updateSchedule(hostess.id, todayStr, { comment: e.target.value })}
                        className="w-[180px] h-7 px-3 text-sm border border-gray-300 rounded flex-shrink-0"
                      />

                      {/* 削除ボタン */}
                      <button
                        onClick={() => updateSchedule(hostess.id, todayStr, {
                          status: 'work',
                          startTime: '',
                          endTime: '',
                          comment: '',
                        })}
                        className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded ml-2 flex-shrink-0"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                    {/* 下段: タイムライン */}
                    <div
                      className="h-[60px] relative cursor-crosshair select-none"
                      data-timeline
                      data-hostess-id={hostess.id}
                      onMouseDown={(e) => handleTimelineMouseDown(e, hostess.id, todayStr, !!(isWork && startTime && endTime))}
                    >
                      {/* 時間目盛り */}
                      {hourMarkers.map((hour) => (
                        <div
                          key={hour}
                          className="absolute top-0 bottom-0 border-l border-gray-200 flex flex-col pointer-events-none"
                          style={{ left: `${(hour / 36) * 100}%`, width: `${100 / 36}%` }}
                        >
                          <span className="text-[10px] text-gray-400 pl-0.5">
                            {hour <= 24 ? hour : hour - 24}
                          </span>
                        </div>
                      ))}

                      {/* 勤務バー */}
                      {isWork && startTime && endTime && (
                        <div
                          className="absolute top-4 bottom-2 rounded cursor-move group"
                          style={{
                            left: `${timeToPercent(startTime)}%`,
                            width: `${getBarWidth(startTime, endTime)}%`,
                            background: 'linear-gradient(to right, #93c5fd, #3b82f6)',
                          }}
                          onMouseDown={(e) => handleBarMouseDown(e, hostess.id, todayStr, startTime, endTime)}
                        >
                          {/* 左リサイズハンドル */}
                          <div
                            className="absolute left-0 top-0 bottom-0 w-2 cursor-ew-resize hover:bg-blue-700/50 rounded-l"
                            onMouseDown={(e) => handleResizeMouseDown(e, hostess.id, todayStr, startTime, endTime, 'start')}
                          />
                          {/* 右リサイズハンドル */}
                          <div
                            className="absolute right-0 top-0 bottom-0 w-2 cursor-ew-resize hover:bg-blue-700/50 rounded-r"
                            onMouseDown={(e) => handleResizeMouseDown(e, hostess.id, todayStr, startTime, endTime, 'end')}
                          />
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* 週間タブ */}
          {activeTab === 'weekly' && (
            <>
              {/* 曜日ヘッダー */}
              <div className="h-[40px] bg-gray-50 border-b border-gray-300 flex-shrink-0 flex">
                {weekDays.map((day) => (
                  <div
                    key={day.dayIndex}
                    className={`flex-1 border-r border-gray-300 flex items-center justify-center gap-2 ${
                      day.isWeekend ? (day.dayName === '土' ? 'bg-blue-50' : 'bg-red-50') : ''
                    }`}
                  >
                    <span className={`text-sm font-medium ${
                      day.dayName === '土' ? 'text-blue-600' :
                      day.dayName === '日' ? 'text-red-600' : 'text-gray-700'
                    }`}>
                      {day.displayDate}
                    </span>
                    <span className="text-xs bg-gray-200 text-gray-600 px-1.5 py-0.5 rounded">
                      {getWorkCountForDate(day.dateStr)}名
                    </span>
                  </div>
                ))}
              </div>

              {/* スケジュールボディ */}
              <div
                ref={rightPanelRef}
                onScroll={handleRightScroll}
                className="flex-1 overflow-auto"
              >
                {filteredHostesses.map((hostess, index) => (
                  <div
                    key={hostess.id}
                    className="h-[100px] flex border-b border-gray-200"
                    style={{ backgroundColor: index % 2 === 0 ? '#f8fafc' : '#ffffff' }}
                  >
                    {weekDays.map((day) => {
                      const schedule = getSchedule(hostess.id, day.dateStr);
                      const isWork = schedule?.status === 'work';
                      const startTime = schedule?.startTime || '';
                      const endTime = schedule?.endTime || '';
                      const comment = schedule?.comment || '';

                      return (
                        <div
                          key={day.dayIndex}
                          className={`flex-1 border-r border-gray-200 p-2 ${
                            day.isWeekend ? (day.dayName === '土' ? 'bg-blue-50/30' : 'bg-red-50/30') : ''
                          }`}
                        >
                          {/* 出勤/休みセレクト */}
                          <div className="relative mb-1">
                            <select
                              value={schedule?.status || 'work'}
                              onChange={(e) => updateSchedule(hostess.id, day.dateStr, {
                                status: e.target.value as 'work' | 'off',
                                startTime: e.target.value === 'off' ? '' : startTime,
                                endTime: e.target.value === 'off' ? '' : endTime,
                              })}
                              className={`w-full h-6 px-2 pr-6 text-xs font-medium rounded border-none appearance-none cursor-pointer ${
                                isWork
                                  ? 'bg-blue-100 text-blue-600'
                                  : 'bg-pink-100 text-pink-500'
                              }`}
                            >
                              <option value="work">出勤</option>
                              <option value="off">休み</option>
                            </select>
                            <ChevronDown className="absolute right-1 top-1/2 -translate-y-1/2 w-3 h-3 pointer-events-none text-gray-400" />
                          </div>

                          {/* 時間表示 */}
                          {isWork && (
                            <div className="flex items-center gap-1 mb-1">
                              <input
                                type="time"
                                value={startTime}
                                onChange={(e) => updateSchedule(hostess.id, day.dateStr, { startTime: e.target.value })}
                                className="w-[70px] h-5 px-1 text-xs border border-gray-300 rounded"
                              />
                              <span className="text-xs text-gray-400">〜</span>
                              <input
                                type="time"
                                value={endTime}
                                onChange={(e) => updateSchedule(hostess.id, day.dateStr, { endTime: e.target.value })}
                                className="w-[70px] h-5 px-1 text-xs border border-gray-300 rounded"
                              />
                            </div>
                          )}

                          {/* コメント入力 */}
                          <input
                            type="text"
                            placeholder="コメントを入力"
                            value={comment}
                            onChange={(e) => updateSchedule(hostess.id, day.dateStr, { comment: e.target.value })}
                            className="w-full h-5 px-2 text-xs text-pink-400 placeholder-pink-300 border-none bg-transparent focus:outline-none focus:bg-pink-50 rounded"
                          />
                        </div>
                      );
                    })}
                  </div>
                ))}
              </div>
            </>
          )}

          {/* 月間タブ */}
          {activeTab === 'monthly' && (
            <>
              {selectedHostess ? (
                <>
                  {/* 選択中のホステス名 */}
                  <div className="h-[40px] bg-pink-100 border-b border-pink-300 flex items-center px-4">
                    <span className="text-lg font-bold text-pink-700">{selectedHostess.name}</span>
                    <span className="ml-2 text-sm text-gray-600">の月間スケジュール</span>
                  </div>

                  {/* 曜日ヘッダー（週間と同じ7列） */}
                  <div className="h-[40px] bg-gray-50 border-b border-gray-300 flex-shrink-0 flex">
                    {DAY_NAMES.map((dayName, index) => {
                      const isWeekend = index === 5 || index === 6; // 土=5, 日=6
                      return (
                        <div
                          key={index}
                          className={`flex-1 border-r border-gray-300 flex items-center justify-center ${
                            isWeekend ? (index === 5 ? 'bg-blue-50' : 'bg-red-50') : ''
                          }`}
                        >
                          <span className={`text-sm font-medium ${
                            index === 5 ? 'text-blue-600' :
                            index === 6 ? 'text-red-600' : 'text-gray-700'
                          }`}>
                            {dayName}
                          </span>
                        </div>
                      );
                    })}
                  </div>

                  {/* カレンダーボディ */}
                  <div className="flex-1 overflow-auto">
                    {monthCalendarWeeks.map((week, weekIndex) => (
                      <div
                        key={weekIndex}
                        className="flex border-b border-gray-200"
                        style={{ minHeight: '120px' }}
                      >
                        {week.map((day, dayIndex) => {
                          if (!day) {
                            // 空白セル
                            return (
                              <div
                                key={dayIndex}
                                className="flex-1 border-r border-gray-200 bg-gray-100"
                              />
                            );
                          }

                          const schedule = getSchedule(selectedHostess.id, day.dateStr);
                          const isWork = schedule?.status === 'work';
                          const startTime = schedule?.startTime || '';
                          const endTime = schedule?.endTime || '';
                          const comment = schedule?.comment || '';

                          return (
                            <div
                              key={dayIndex}
                              className={`flex-1 border-r border-gray-200 p-2 ${
                                day.isWeekend ? (day.dayName === '土' ? 'bg-blue-50/30' : 'bg-red-50/30') : 'bg-white'
                              }`}
                            >
                              {/* 日付 */}
                              <div className={`text-sm font-bold mb-2 ${
                                day.dayName === '土' ? 'text-blue-600' :
                                day.dayName === '日' ? 'text-red-600' : 'text-gray-700'
                              }`}>
                                {day.dayOfMonth}
                              </div>

                              {/* 出勤/休みセレクト */}
                              <div className="relative mb-1">
                                <select
                                  value={schedule?.status || 'work'}
                                  onChange={(e) => updateSchedule(selectedHostess.id, day.dateStr, {
                                    status: e.target.value as 'work' | 'off',
                                    startTime: e.target.value === 'off' ? '' : startTime,
                                    endTime: e.target.value === 'off' ? '' : endTime,
                                  })}
                                  className={`w-full h-6 px-2 pr-6 text-xs font-medium rounded border-none appearance-none cursor-pointer ${
                                    isWork
                                      ? 'bg-blue-100 text-blue-600'
                                      : 'bg-pink-100 text-pink-500'
                                  }`}
                                >
                                  <option value="work">出勤</option>
                                  <option value="off">休み</option>
                                </select>
                                <ChevronDown className="absolute right-1 top-1/2 -translate-y-1/2 w-3 h-3 pointer-events-none text-gray-400" />
                              </div>

                              {/* 時間表示 */}
                              {isWork && (
                                <div className="flex flex-col gap-1 mb-1">
                                  <input
                                    type="time"
                                    value={startTime}
                                    onChange={(e) => updateSchedule(selectedHostess.id, day.dateStr, { startTime: e.target.value })}
                                    className="w-full h-5 px-1 text-xs border border-gray-300 rounded"
                                  />
                                  <input
                                    type="time"
                                    value={endTime}
                                    onChange={(e) => updateSchedule(selectedHostess.id, day.dateStr, { endTime: e.target.value })}
                                    className="w-full h-5 px-1 text-xs border border-gray-300 rounded"
                                  />
                                </div>
                              )}

                              {/* コメント入力 */}
                              <input
                                type="text"
                                placeholder="コメント"
                                value={comment}
                                onChange={(e) => updateSchedule(selectedHostess.id, day.dateStr, { comment: e.target.value })}
                                className="w-full h-5 px-2 text-xs text-pink-400 placeholder-pink-300 border border-gray-200 bg-transparent focus:outline-none focus:bg-pink-50 rounded"
                              />
                            </div>
                          );
                        })}
                      </div>
                    ))}
                  </div>
                </>
              ) : (
                // ホステス未選択時
                <div className="flex-1 flex items-center justify-center bg-gray-50">
                  <div className="text-center text-gray-500">
                    <p className="text-lg font-medium">左のリストからホステスを選択してください</p>
                    <p className="text-sm mt-1">選択したホステスの月間カレンダーが表示されます</p>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* 保存確認モーダル */}
      {showSaveModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl w-[500px] max-h-[80vh] flex flex-col">
            {/* モーダルヘッダー */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200">
              <h2 className="text-lg font-bold text-gray-800">スケジュールを保存</h2>
              <button
                onClick={() => setShowSaveModal(false)}
                className="p-1 hover:bg-gray-100 rounded"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>

            {/* モーダルコンテンツ */}
            <div className="flex-1 overflow-y-auto p-4">
              <p className="text-sm text-gray-600 mb-4">
                以下の{changedHostesses.length}名のスケジュールが変更されています。保存する人を選択してください。
              </p>

              {/* 全選択/全解除 */}
              <div className="mb-3 pb-3 border-b border-gray-200">
                <button
                  onClick={toggleSelectAll}
                  className="text-sm text-blue-600 hover:text-blue-800 flex items-center gap-2"
                >
                  <div className={`w-5 h-5 rounded border-2 flex items-center justify-center ${
                    selectedForSave.size === changedHostessIds.size
                      ? 'bg-blue-600 border-blue-600'
                      : 'border-gray-300'
                  }`}>
                    {selectedForSave.size === changedHostessIds.size && (
                      <Check className="w-3 h-3 text-white" />
                    )}
                  </div>
                  {selectedForSave.size === changedHostessIds.size ? '全て解除' : '全て選択'}
                </button>
              </div>

              {/* ホステスリスト */}
              <div className="space-y-2">
                {changedHostesses.map(hostess => {
                  const isSelected = selectedForSave.has(hostess.id);
                  return (
                    <div
                      key={hostess.id}
                      onClick={() => toggleSaveSelection(hostess.id)}
                      className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-colors ${
                        isSelected
                          ? 'bg-blue-50 border border-blue-200'
                          : 'bg-gray-50 border border-gray-200 hover:bg-gray-100'
                      }`}
                    >
                      <div className={`w-5 h-5 rounded border-2 flex items-center justify-center flex-shrink-0 ${
                        isSelected
                          ? 'bg-blue-600 border-blue-600'
                          : 'border-gray-300'
                      }`}>
                        {isSelected && <Check className="w-3 h-3 text-white" />}
                      </div>
                      <div className="flex-1">
                        <div className="font-medium text-gray-800">{hostess.name}</div>
                        <div className="text-xs text-gray-500">
                          {hostess.workType} / 担当: {hostess.assignedStaff}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* モーダルフッター */}
            <div className="flex items-center justify-between px-4 py-3 border-t border-gray-200 bg-gray-50 rounded-b-lg">
              <div className="text-sm text-gray-600">
                {selectedForSave.size}名を保存
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  onClick={() => setShowSaveModal(false)}
                  className="px-4"
                >
                  キャンセル
                </Button>
                <Button
                  onClick={handleSave}
                  disabled={selectedForSave.size === 0}
                  className={`px-4 ${
                    selectedForSave.size > 0
                      ? 'bg-blue-600 hover:bg-blue-700 text-white'
                      : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  }`}
                >
                  <Save className="w-4 h-4 mr-2" />
                  保存する
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
