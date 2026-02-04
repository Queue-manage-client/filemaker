'use client';

import React, { useState, useMemo, useRef, useCallback, useEffect } from 'react';
import Link from 'next/link';
import { Button } from "@/components/ui/button";
import { ArrowLeft, ChevronLeft, ChevronRight, ChevronDown, Check, Plus, X } from "lucide-react";

// 編集中のバーデータ
interface EditingBar {
  employeeId: string;
  barId: string;
  startTime: string;
  endTime: string;
  isNew: boolean;
  taskName?: string;
  location?: string;
  status?: 'pending' | 'confirmed' | 'completed';
  memo?: string;
}

// 勤務予定データの型定義
interface WorkSchedule {
  id: string;
  taskName: string;
  startTime: string;
  endTime: string;
  location: string;
  status: 'pending' | 'confirmed' | 'completed';
  memo?: string;
}

// 従業員タイムラインデータの型定義
interface EmployeeTimelineData {
  id: string;
  name: string;
  department: string;
  position: string;
  workStartTime: string;
  workEndTime: string;
  isOff: boolean;
  schedules: WorkSchedule[];
}

// サンプルデータ
const sampleEmployeeTimeline: EmployeeTimelineData[] = [
  {
    id: "1",
    name: "山田太郎",
    department: "営業部",
    position: "主任",
    workStartTime: "",
    workEndTime: "",
    isOff: true,
    schedules: [
      {
        id: "s1",
        taskName: "顧客訪問",
        startTime: "10:00",
        endTime: "12:00",
        location: "東京本社",
        status: "completed",
        memo: "重要顧客・事前準備必須"
      }
    ]
  },
  {
    id: "2",
    name: "佐藤花子",
    department: "企画部",
    position: "係長",
    workStartTime: "09:00",
    workEndTime: "18:00",
    isOff: false,
    schedules: [
      {
        id: "s2",
        taskName: "会議",
        startTime: "10:00",
        endTime: "11:30",
        location: "会議室A",
        status: "completed",
        memo: "プロジェクト進捗報告"
      },
      {
        id: "s3",
        taskName: "資料作成",
        startTime: "14:00",
        endTime: "16:00",
        location: "オフィス",
        status: "pending",
        memo: "来週のプレゼン用"
      }
    ]
  },
  {
    id: "3",
    name: "鈴木一郎",
    department: "総務部",
    position: "課長",
    workStartTime: "08:30",
    workEndTime: "17:30",
    isOff: false,
    schedules: []
  },
  {
    id: "4",
    name: "高橋美咲",
    department: "経理部",
    position: "主任",
    workStartTime: "09:00",
    workEndTime: "18:00",
    isOff: false,
    schedules: [
      {
        id: "s4",
        taskName: "月次決算",
        startTime: "09:30",
        endTime: "12:00",
        location: "経理室",
        status: "completed",
        memo: "締め切り厳守"
      }
    ]
  },
  {
    id: "5",
    name: "田中健二",
    department: "人事部",
    position: "部長",
    workStartTime: "08:00",
    workEndTime: "17:00",
    isOff: false,
    schedules: [
      {
        id: "s5",
        taskName: "採用面接",
        startTime: "13:00",
        endTime: "15:00",
        location: "面接室",
        status: "pending",
        memo: "新卒採用・3名予定"
      }
    ]
  },
  {
    id: "6",
    name: "伊藤由美",
    department: "開発部",
    position: "エンジニア",
    workStartTime: "10:00",
    workEndTime: "19:00",
    isOff: false,
    schedules: [
      {
        id: "s6",
        taskName: "開発作業",
        startTime: "10:30",
        endTime: "12:30",
        location: "開発室",
        status: "completed",
        memo: "新機能実装"
      },
      {
        id: "s7",
        taskName: "コードレビュー",
        startTime: "14:00",
        endTime: "15:30",
        location: "開発室",
        status: "pending",
        memo: "PR#123確認"
      }
    ]
  },
  {
    id: "7",
    name: "渡辺誠",
    department: "営業部",
    position: "係長",
    workStartTime: "09:00",
    workEndTime: "18:00",
    isOff: false,
    schedules: [
      {
        id: "s8",
        taskName: "商談",
        startTime: "11:00",
        endTime: "13:00",
        location: "新宿支店",
        status: "completed",
        memo: "契約更新交渉"
      }
    ]
  },
  {
    id: "8",
    name: "小林真理",
    department: "企画部",
    position: "主任",
    workStartTime: "09:30",
    workEndTime: "18:30",
    isOff: false,
    schedules: []
  },
  {
    id: "9",
    name: "加藤直樹",
    department: "総務部",
    position: "主任",
    workStartTime: "08:30",
    workEndTime: "17:30",
    isOff: false,
    schedules: [
      {
        id: "s9",
        taskName: "設備点検",
        startTime: "14:00",
        endTime: "16:00",
        location: "全館",
        status: "pending",
        memo: "月次点検"
      }
    ]
  },
  {
    id: "10",
    name: "吉田恵",
    department: "経理部",
    position: "係長",
    workStartTime: "09:00",
    workEndTime: "18:00",
    isOff: false,
    schedules: [
      {
        id: "s10",
        taskName: "支払処理",
        startTime: "10:00",
        endTime: "11:30",
        location: "経理室",
        status: "completed",
        memo: "月末締め処理"
      },
      {
        id: "s11",
        taskName: "予算会議",
        startTime: "15:00",
        endTime: "17:00",
        location: "会議室B",
        status: "pending",
        memo: "次期予算案検討"
      }
    ]
  },
  {
    id: "11",
    name: "中村拓也",
    department: "開発部",
    position: "リーダー",
    workStartTime: "10:00",
    workEndTime: "19:00",
    isOff: false,
    schedules: [
      {
        id: "s12",
        taskName: "スプリント計画",
        startTime: "10:30",
        endTime: "12:00",
        location: "開発室",
        status: "completed",
        memo: "Sprint #15"
      }
    ]
  },
  {
    id: "12",
    name: "松本さくら",
    department: "人事部",
    position: "主任",
    workStartTime: "09:00",
    workEndTime: "18:00",
    isOff: false,
    schedules: []
  }
];

// 時間軸の範囲（6:00〜22:00 = 16時間）
const TIME_START_HOUR = 6;
const TIME_END_HOUR = 22;
const HOUR_WIDTH = 120;
const ROW_HEIGHT = 52;

// ソートタイプの定義
type SortType = 'name-asc' | 'name-desc' | 'worktime-asc' | 'worktime-desc' | 'start-asc' | 'start-desc' | 'department-asc' | 'department-desc';

// 滞在時間（勤務時間）を分単位で計算
const calculateWorkMinutes = (employee: EmployeeTimelineData): number => {
  if (employee.isOff || !employee.workStartTime || !employee.workEndTime) return 0;
  const [startH, startM] = employee.workStartTime.split(':').map(Number);
  const [endH, endM] = employee.workEndTime.split(':').map(Number);
  const startMinutes = startH * 60 + startM;
  let endMinutes = endH * 60 + endM;
  if (endMinutes < startMinutes) {
    endMinutes += 24 * 60;
  }
  return endMinutes - startMinutes;
};

// 勤務開始時間を分単位で取得
const getStartMinutes = (employee: EmployeeTimelineData): number => {
  if (employee.isOff || !employee.workStartTime) return 9999;
  const [h, m] = employee.workStartTime.split(':').map(Number);
  return h * 60 + m;
};

// 部署の色を取得
const getDepartmentColor = (department: string): string => {
  const colors: Record<string, string> = {
    '営業部': '#fecdd3',
    '企画部': '#c7d2fe',
    '総務部': '#a7f3d0',
    '経理部': '#fde68a',
    '人事部': '#bae6fd',
    '開発部': '#e9d5ff',
  };
  return colors[department] || '#e5e7eb';
};

export default function EmployeeSchedule() {
  useEffect(() => {
    document.title = '従業員スケジュール管理 - Dispatch Harmony Hub';
  }, []);

  const [currentDate, setCurrentDate] = useState(new Date());
  const [employeeData] = useState<EmployeeTimelineData[]>(sampleEmployeeTimeline);
  const [sortType, setSortType] = useState<SortType>('name-asc');
  const [searchText, setSearchText] = useState('');
  const [departmentFilter, setDepartmentFilter] = useState<string>('');

  // 編集中のバー管理
  const [editingBars, setEditingBars] = useState<Map<string, EditingBar>>(new Map());
  const [activeEditBarId, setActiveEditBarId] = useState<string | null>(null);
  const [showSaveConfirm, setShowSaveConfirm] = useState<string | null>(null);
  // 一括保存モーダル
  const [showBulkSaveModal, setShowBulkSaveModal] = useState(false);
  const [selectedForSave, setSelectedForSave] = useState<Set<string>>(new Set());

  // ドラッグ状態
  const [isDragging, setIsDragging] = useState(false);
  const [dragType, setDragType] = useState<'move' | 'resize-left' | 'resize-right' | null>(null);
  const [dragBarId, setDragBarId] = useState<string | null>(null);
  const [dragStartX, setDragStartX] = useState(0);
  const [dragStartBarLeft, setDragStartBarLeft] = useState(0);
  const [dragStartBarWidth, setDragStartBarWidth] = useState(0);

  // 部署リストを抽出
  const departmentList = useMemo(() => {
    const deptSet = new Set<string>();
    employeeData.forEach(e => {
      if (e.department) deptSet.add(e.department);
    });
    return Array.from(deptSet).sort((a, b) => a.localeCompare(b, 'ja'));
  }, [employeeData]);

  // フィルタ・ソート済み従業員リスト
  const employees = useMemo(() => {
    let filtered = [...employeeData];

    // 名前で検索
    if (searchText.trim()) {
      filtered = filtered.filter(e =>
        e.name.toLowerCase().includes(searchText.toLowerCase())
      );
    }

    // 部署でフィルター
    if (departmentFilter) {
      filtered = filtered.filter(e => e.department === departmentFilter);
    }

    // ソート
    switch (sortType) {
      case 'name-asc':
        return filtered.sort((a, b) => a.name.localeCompare(b.name, 'ja'));
      case 'name-desc':
        return filtered.sort((a, b) => b.name.localeCompare(a.name, 'ja'));
      case 'worktime-desc':
        return filtered.sort((a, b) => calculateWorkMinutes(b) - calculateWorkMinutes(a));
      case 'worktime-asc':
        return filtered.sort((a, b) => calculateWorkMinutes(a) - calculateWorkMinutes(b));
      case 'start-asc':
        return filtered.sort((a, b) => getStartMinutes(a) - getStartMinutes(b));
      case 'start-desc':
        return filtered.sort((a, b) => getStartMinutes(b) - getStartMinutes(a));
      case 'department-asc':
        return filtered.sort((a, b) => a.department.localeCompare(b.department, 'ja'));
      case 'department-desc':
        return filtered.sort((a, b) => b.department.localeCompare(a.department, 'ja'));
      default:
        return filtered;
    }
  }, [employeeData, sortType, searchText, departmentFilter]);

  // スクロール同期用のref
  const leftPanelRef = useRef<HTMLDivElement>(null);
  const timelineBodyRef = useRef<HTMLDivElement>(null);
  const timeHeaderRef = useRef<HTMLDivElement>(null);

  // 日付ナビゲーション
  const navigateDate = (direction: 'prev' | 'next') => {
    const newDate = new Date(currentDate);
    newDate.setDate(currentDate.getDate() + (direction === 'next' ? 1 : -1));
    setCurrentDate(newDate);
  };

  const formatDate = (date: Date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const dayNames = ['日', '月', '火', '水', '木', '金', '土'];
    const dayOfWeek = dayNames[date.getDay()];
    return `${year}/${month}/${day}(${dayOfWeek})`;
  };

  // 時間をピクセル位置に変換
  const timeToPosition = (time: string): number => {
    const [hours, minutes] = time.split(':').map(Number);
    const totalMinutes = hours * 60 + minutes - TIME_START_HOUR * 60;
    return (totalMinutes / 60) * HOUR_WIDTH;
  };

  // バーの幅を計算
  const getBarWidth = (startTime: string, endTime: string): number => {
    const startPos = timeToPosition(startTime);
    const endPos = timeToPosition(endTime);
    return endPos - startPos;
  };

  // 時間軸の時間リストを生成
  const timeSlots = useMemo(() => {
    const slots = [];
    for (let hour = TIME_START_HOUR; hour <= TIME_END_HOUR; hour++) {
      slots.push({
        hour,
        display: `${hour}:00`
      });
    }
    return slots;
  }, []);

  // 垂直スクロール同期
  const handleTimelineScroll = useCallback(() => {
    if (timelineBodyRef.current && leftPanelRef.current && timeHeaderRef.current) {
      leftPanelRef.current.scrollTop = timelineBodyRef.current.scrollTop;
      timeHeaderRef.current.scrollLeft = timelineBodyRef.current.scrollLeft;
    }
  }, []);

  const handleLeftPanelScroll = useCallback(() => {
    if (timelineBodyRef.current && leftPanelRef.current) {
      timelineBodyRef.current.scrollTop = leftPanelRef.current.scrollTop;
    }
  }, []);

  // ピクセル位置を時間に変換（ドラッグ時は30分単位）
  const positionToTime = (position: number): string => {
    const totalMinutes = (position / HOUR_WIDTH) * 60 + TIME_START_HOUR * 60;
    let hours = Math.floor(totalMinutes / 60);
    const minutes = Math.round(totalMinutes % 60 / 30) * 30;
    if (minutes >= 60) {
      hours += 1;
    }
    const adjustedMinutes = minutes % 60;
    if (hours >= 24) hours -= 24;
    return `${String(hours).padStart(2, '0')}:${String(adjustedMinutes).padStart(2, '0')}`;
  };

  // 時間の時と分を分離
  const parseTime = (time: string): { hours: number; minutes: number } => {
    const [h, m] = time.split(':').map(Number);
    return { hours: h, minutes: m };
  };

  // 時間を組み立て
  const buildTime = (hours: number, minutes: number): string => {
    return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`;
  };

  // 時間オプション（0-23）
  const hourOptions = Array.from({ length: 24 }, (_, i) => i);
  // 分オプション（10分単位）
  const minuteOptions = [0, 10, 20, 30, 40, 50];

  // 新しいバーを作成
  const handleCreateBar = (employeeId: string) => {
    const barId = `new-${employeeId}`;
    const newBar: EditingBar = {
      employeeId,
      barId,
      startTime: '10:00',
      endTime: '12:00',
      isNew: true,
      taskName: '新規予定',
      status: 'pending'
    };
    setEditingBars(new Map(editingBars.set(barId, newBar)));
    setActiveEditBarId(barId);
  };

  // バーを削除（編集キャンセル）
  const handleCancelEdit = (barId: string) => {
    const newMap = new Map(editingBars);
    newMap.delete(barId);
    setEditingBars(newMap);
    if (activeEditBarId === barId) {
      setActiveEditBarId(null);
    }
  };

  // 既存バーをタップして編集モードに
  const handleBarClick = (employeeId: string, schedule: WorkSchedule) => {
    const barId = schedule.id;
    if (activeEditBarId === barId) {
      setActiveEditBarId(null);
      return;
    }
    if (!editingBars.has(barId)) {
      const editBar: EditingBar = {
        employeeId,
        barId,
        startTime: schedule.startTime,
        endTime: schedule.endTime,
        isNew: false,
        taskName: schedule.taskName,
        location: schedule.location,
        status: schedule.status,
        memo: schedule.memo
      };
      setEditingBars(new Map(editingBars.set(barId, editBar)));
    }
    setActiveEditBarId(barId);
  };

  // 新規バーが存在するかチェック
  const hasNewBar = (employeeId: string) => {
    return editingBars.has(`new-${employeeId}`);
  };

  // 手動で時間を更新
  const handleTimeChange = (barId: string, field: 'startTime' | 'endTime', value: string) => {
    const bar = editingBars.get(barId);
    if (bar) {
      const updatedBar = { ...bar, [field]: value };
      setEditingBars(new Map(editingBars.set(barId, updatedBar)));
    }
  };

  // 時のみ変更
  const handleHourChange = (barId: string, field: 'startTime' | 'endTime', newHour: number) => {
    const bar = editingBars.get(barId);
    if (bar) {
      const currentTime = field === 'startTime' ? bar.startTime : bar.endTime;
      const { minutes } = parseTime(currentTime);
      const newTime = buildTime(newHour, minutes);
      handleTimeChange(barId, field, newTime);
    }
  };

  // 分のみ変更
  const handleMinuteChange = (barId: string, field: 'startTime' | 'endTime', newMinute: number) => {
    const bar = editingBars.get(barId);
    if (bar) {
      const currentTime = field === 'startTime' ? bar.startTime : bar.endTime;
      const { hours } = parseTime(currentTime);
      const newTime = buildTime(hours, newMinute);
      handleTimeChange(barId, field, newTime);
    }
  };

  // 備考を変更
  const handleMemoChange = (barId: string, memo: string) => {
    const bar = editingBars.get(barId);
    if (bar) {
      const updatedBar = { ...bar, memo };
      setEditingBars(new Map(editingBars.set(barId, updatedBar)));
    }
  };

  // 保存確認モーダルを開く
  const openSaveConfirm = (barId: string) => {
    setShowSaveConfirm(barId);
  };

  // 保存を実行
  const handleConfirmSave = () => {
    if (showSaveConfirm) {
      const bar = editingBars.get(showSaveConfirm);
      if (bar) {
        const newMap = new Map(editingBars);
        newMap.delete(showSaveConfirm);
        setEditingBars(newMap);
        if (activeEditBarId === showSaveConfirm) {
          setActiveEditBarId(null);
        }
      }
      setShowSaveConfirm(null);
    }
  };

  // 一括保存モーダルを開く
  const openBulkSaveModal = () => {
    const allBarIds = new Set(editingBars.keys());
    setSelectedForSave(allBarIds);
    setShowBulkSaveModal(true);
  };

  // チェックボックスの切り替え
  const toggleSaveSelection = (barId: string) => {
    const newSet = new Set(selectedForSave);
    if (newSet.has(barId)) {
      newSet.delete(barId);
    } else {
      newSet.add(barId);
    }
    setSelectedForSave(newSet);
  };

  // 一括保存を実行
  const handleBulkSave = () => {
    const newMap = new Map(editingBars);
    selectedForSave.forEach(barId => {
      newMap.delete(barId);
      if (activeEditBarId === barId) {
        setActiveEditBarId(null);
      }
    });
    setEditingBars(newMap);
    setShowBulkSaveModal(false);
    setSelectedForSave(new Set());
  };

  // 従業員名を取得
  const getEmployeeName = (employeeId: string): string => {
    const employee = employeeData.find(e => e.id === employeeId);
    return employee?.name || '不明';
  };

  // ドラッグ開始
  const handleDragStart = (
    e: React.MouseEvent,
    barId: string,
    type: 'move' | 'resize-left' | 'resize-right'
  ) => {
    e.preventDefault();
    e.stopPropagation();
    const bar = editingBars.get(barId);
    if (!bar) return;

    setIsDragging(true);
    setDragType(type);
    setDragBarId(barId);
    setDragStartX(e.clientX);
    setDragStartBarLeft(timeToPosition(bar.startTime));
    setDragStartBarWidth(getBarWidth(bar.startTime, bar.endTime));
  };

  // ドラッグ中
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isDragging || !dragBarId || !dragType) return;

      const deltaX = e.clientX - dragStartX;
      const bar = editingBars.get(dragBarId);
      if (!bar) return;

      let newStartPos = dragStartBarLeft;
      let newEndPos = dragStartBarLeft + dragStartBarWidth;

      if (dragType === 'move') {
        newStartPos = Math.max(0, dragStartBarLeft + deltaX);
        newEndPos = newStartPos + dragStartBarWidth;
      } else if (dragType === 'resize-left') {
        newStartPos = Math.max(0, Math.min(dragStartBarLeft + deltaX, newEndPos - 30));
      } else if (dragType === 'resize-right') {
        newEndPos = Math.max(newStartPos + 30, dragStartBarLeft + dragStartBarWidth + deltaX);
      }

      const newStartTime = positionToTime(newStartPos);
      const newEndTime = positionToTime(newEndPos);

      const updatedBar = { ...bar, startTime: newStartTime, endTime: newEndTime };
      setEditingBars(new Map(editingBars.set(dragBarId, updatedBar)));
    };

    const handleMouseUp = () => {
      setIsDragging(false);
      setDragType(null);
      setDragBarId(null);
    };

    if (isDragging) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
    }

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, dragType, dragBarId, dragStartX, dragStartBarLeft, dragStartBarWidth, editingBars]);

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

          <div className="flex-1 flex items-center justify-center gap-2">
            <h1 className="text-lg font-bold mr-2">従業員スケジュール管理</h1>

            {/* 日付ナビゲーション */}
            <div className="flex items-center">
              <Button
                variant="outline"
                size="icon"
                className="h-8 w-8"
                onClick={() => navigateDate('prev')}
              >
                <ChevronLeft className="w-4 h-4" />
              </Button>
              <div className="text-sm font-mono bg-gray-500 text-white px-3 py-1 min-w-[140px] text-center">
                {formatDate(currentDate)}
              </div>
              <Button
                variant="outline"
                size="icon"
                className="h-8 w-8"
                onClick={() => navigateDate('next')}
              >
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* ソートボタン・検索・フィルター */}
      <div className="h-[36px] bg-white border-b border-zinc-300 flex items-center px-3 flex-shrink-0">
        {/* 左側: 部署フィルター・ソートボタン */}
        <div className="flex items-center gap-2">
          {/* 部署フィルター */}
          <span className="text-xs text-gray-600 font-medium">部署:</span>
          <select
            value={departmentFilter}
            onChange={(e) => setDepartmentFilter(e.target.value)}
            className="h-7 px-2 text-xs border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-400"
          >
            <option value="">全部署</option>
            {departmentList.map(dept => (
              <option key={dept} value={dept}>{dept}</option>
            ))}
          </select>

          <div className="w-px h-5 bg-gray-300 mx-1" />

          {/* ソートボタン */}
          <span className="text-xs text-gray-600 font-medium">並び替え:</span>
          <button
            onClick={() => setSortType(sortType === 'name-asc' ? 'name-desc' : 'name-asc')}
            className={`px-2 py-1 text-xs rounded border ${
              sortType === 'name-asc' || sortType === 'name-desc'
                ? 'bg-blue-500 text-white border-blue-500'
                : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
            }`}
          >
            五十音順 {sortType === 'name-asc' ? '▲' : sortType === 'name-desc' ? '▼' : ''}
          </button>
          <button
            onClick={() => setSortType(sortType === 'department-asc' ? 'department-desc' : 'department-asc')}
            className={`px-2 py-1 text-xs rounded border ${
              sortType === 'department-asc' || sortType === 'department-desc'
                ? 'bg-blue-500 text-white border-blue-500'
                : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
            }`}
          >
            部署 {sortType === 'department-asc' ? '▲' : sortType === 'department-desc' ? '▼' : ''}
          </button>
          <button
            onClick={() => setSortType(sortType === 'worktime-desc' ? 'worktime-asc' : 'worktime-desc')}
            className={`px-2 py-1 text-xs rounded border ${
              sortType === 'worktime-desc' || sortType === 'worktime-asc'
                ? 'bg-blue-500 text-white border-blue-500'
                : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
            }`}
          >
            勤務時間 {sortType === 'worktime-desc' ? '▼多' : sortType === 'worktime-asc' ? '▲少' : ''}
          </button>
          <button
            onClick={() => setSortType(sortType === 'start-asc' ? 'start-desc' : 'start-asc')}
            className={`px-2 py-1 text-xs rounded border ${
              sortType === 'start-asc' || sortType === 'start-desc'
                ? 'bg-blue-500 text-white border-blue-500'
                : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
            }`}
          >
            出勤時間 {sortType === 'start-asc' ? '▲早' : sortType === 'start-desc' ? '▼遅' : ''}
          </button>
        </div>

        {/* 従業員検索 */}
        <div className="ml-8 flex items-center gap-2">
          <span className="text-xs text-gray-600 font-medium">検索:</span>
          <input
            type="text"
            placeholder="従業員名"
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            className="w-[180px] h-7 px-3 text-xs border border-gray-500 rounded-full focus:outline-none focus:ring-1 focus:ring-blue-400"
          />
        </div>

        {/* 一括保存ボタン（編集中のバーがある場合のみ表示） */}
        {editingBars.size > 0 && (
          <div className="ml-auto flex items-center gap-2">
            <span className="text-xs text-orange-600 font-medium">
              {editingBars.size}件の変更あり
            </span>
            <button
              onClick={openBulkSaveModal}
              className="px-3 py-1 text-xs bg-blue-500 text-white rounded hover:bg-blue-600 font-medium"
            >
              一括保存
            </button>
          </div>
        )}
      </div>

      {/* メインコンテンツ */}
      <div className="flex-1 flex overflow-hidden">
        {/* 左側パネル - 従業員リスト */}
        <div className="flex-shrink-0 flex flex-col bg-blue-50 border-r border-blue-200">
          {/* ヘッダー行 */}
          <div className="h-[30px] border-b border-blue-200 flex-shrink-0 flex">
            <div className="w-[100px] border-r border-blue-200 flex items-center justify-center text-xs font-bold text-gray-700">
              名前
            </div>
            <div className="w-[70px] border-r border-blue-200 flex items-center justify-center text-xs font-bold text-gray-700">
              部署
            </div>
            <div className="w-[60px] border-r border-blue-200 flex items-center justify-center text-xs font-bold text-gray-700">
              役職
            </div>
            <div className="w-[50px] flex items-center justify-center text-xs font-bold text-gray-700">
              作成
            </div>
          </div>

          {/* 従業員リスト */}
          <div
            ref={leftPanelRef}
            className="flex-1 overflow-y-auto overflow-x-hidden [&::-webkit-scrollbar]:hidden"
            onScroll={handleLeftPanelScroll}
            style={{ scrollbarWidth: 'none' }}
          >
            {employees.map((employee) => (
              <div
                key={employee.id}
                className="border-b border-blue-200 flex"
                style={{
                  height: `${ROW_HEIGHT}px`,
                  backgroundColor: getDepartmentColor(employee.department)
                }}
              >
                {/* 名前 */}
                <div className="w-[100px] border-r border-blue-200 flex items-center px-2">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1">
                      <span className="text-sm font-medium truncate">{employee.name}</span>
                      <ChevronDown className="w-3 h-3 text-gray-500 flex-shrink-0" />
                    </div>
                    <div className="text-xs text-gray-600">
                      {employee.isOff ? (
                        <span className="text-red-500 font-medium">休み</span>
                      ) : (
                        `${employee.workStartTime}-${employee.workEndTime}`
                      )}
                    </div>
                  </div>
                </div>
                {/* 部署 */}
                <div className="w-[70px] border-r border-blue-200 flex items-center justify-center">
                  <span className="text-xs text-gray-700">{employee.department}</span>
                </div>
                {/* 役職 */}
                <div className="w-[60px] border-r border-blue-200 flex items-center justify-center">
                  <span className="text-xs text-gray-700">{employee.position}</span>
                </div>
                {/* 作成ボタン */}
                <div className="w-[50px] flex items-center justify-center">
                  {hasNewBar(employee.id) ? (
                    <button
                      onClick={() => handleCancelEdit(`new-${employee.id}`)}
                      className="w-7 h-7 rounded bg-red-500 hover:bg-red-600 text-white flex items-center justify-center"
                      title="キャンセル"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  ) : (
                    <button
                      onClick={() => handleCreateBar(employee.id)}
                      className="w-7 h-7 rounded bg-blue-400 hover:bg-blue-500 text-white flex items-center justify-center"
                      title="予定を作成"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 右側パネル - タイムライン */}
        <div className="flex-1 overflow-hidden flex flex-col">
          {/* 時間軸ヘッダー */}
          <div
            ref={timeHeaderRef}
            className="h-[30px] bg-gray-50 border-b border-gray-300 flex-shrink-0 overflow-x-hidden"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            <div
              className="flex"
              style={{ width: `${(TIME_END_HOUR - TIME_START_HOUR + 1) * HOUR_WIDTH}px` }}
            >
              {timeSlots.map((slot) => (
                <div
                  key={slot.hour}
                  className="flex-shrink-0 border-r border-gray-300 flex items-center justify-center text-sm text-gray-600 font-medium"
                  style={{ width: `${HOUR_WIDTH}px` }}
                >
                  {slot.display}
                </div>
              ))}
            </div>
          </div>

          {/* タイムラインボディ */}
          <div
            ref={timelineBodyRef}
            className="flex-1 overflow-auto"
            onScroll={handleTimelineScroll}
          >
            <div
              style={{
                width: `${(TIME_END_HOUR - TIME_START_HOUR + 1) * HOUR_WIDTH}px`,
                minHeight: '100%'
              }}
            >
              {employees.map((employee, index) => (
                <div
                  key={employee.id}
                  className="relative border-b border-gray-200"
                  style={{
                    height: `${ROW_HEIGHT}px`,
                    backgroundColor: index % 2 === 0 ? '#fafafa' : '#ffffff'
                  }}
                >
                  {/* 時間のグリッド線 */}
                  {timeSlots.map((slot) => (
                    <div
                      key={slot.hour}
                      className="absolute top-0 bottom-0 border-r border-gray-200"
                      style={{ left: `${(slot.hour - TIME_START_HOUR) * HOUR_WIDTH}px` }}
                    />
                  ))}

                  {/* 勤務時間の背景 */}
                  {!employee.isOff && employee.workStartTime && employee.workEndTime && (
                    <div
                      className="absolute top-0 bottom-0"
                      style={{
                        left: `${timeToPosition(employee.workStartTime)}px`,
                        width: `${getBarWidth(employee.workStartTime, employee.workEndTime)}px`,
                        backgroundColor: 'rgba(59, 130, 246, 0.15)'
                      }}
                    />
                  )}

                  {/* スケジュールバー（既存） */}
                  {employee.schedules.map((schedule) => {
                    const barId = schedule.id;
                    const isActiveEdit = activeEditBarId === barId;
                    const editBar = editingBars.get(barId);

                    const displayStartTime = editBar?.startTime ?? schedule.startTime;
                    const displayEndTime = editBar?.endTime ?? schedule.endTime;
                    const isPending = (editBar?.status ?? schedule.status) === 'pending';
                    const displayMemo = editBar?.memo ?? schedule.memo;

                    const barLeft = timeToPosition(displayStartTime);
                    const barWidth = getBarWidth(displayStartTime, displayEndTime);

                    return (
                      <div
                        key={schedule.id}
                        className="group absolute top-[4px] bottom-[4px]"
                        style={{
                          left: `${barLeft}px`,
                          width: `${barWidth}px`,
                          minWidth: '60px',
                          zIndex: isActiveEdit ? 10 : 1
                        }}
                      >
                        {/* 備考ツールチップ（ホバー時表示） */}
                        {displayMemo && (
                          <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-2 bg-gray-800 text-white text-xs rounded shadow-lg whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50">
                            <div className="font-medium mb-1">備考:</div>
                            <div>{displayMemo}</div>
                            <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-gray-800" />
                          </div>
                        )}

                        {/* バー本体 */}
                        <div
                          className={`absolute inset-0 rounded-full flex items-center px-2 shadow-sm overflow-hidden ${
                            isActiveEdit ? 'cursor-move ring-2 ring-blue-400 ring-offset-1' : 'cursor-pointer'
                          }`}
                          style={{
                            background: isPending
                              ? 'linear-gradient(135deg, #60a5fa 0%, #3b82f6 50%, #2563eb 100%)'
                              : 'linear-gradient(135deg, #d4d4d4 0%, #a3a3a3 50%, #737373 100%)'
                          }}
                          onClick={() => handleBarClick(employee.id, schedule)}
                          onMouseDown={(e) => {
                            if (isActiveEdit) {
                              handleDragStart(e, barId, 'move');
                            }
                          }}
                        >
                          {/* 左リサイズハンドル */}
                          {isActiveEdit && (
                            <div
                              className="absolute left-0 top-0 bottom-0 w-4 cursor-ew-resize rounded-l-full flex items-center justify-center hover:bg-black/20"
                              onMouseDown={(e) => {
                                e.stopPropagation();
                                handleDragStart(e, barId, 'resize-left');
                              }}
                            >
                              <div className="w-0.5 h-4 bg-white/70 rounded" />
                            </div>
                          )}

                          {/* 出勤日時表示 */}
                          <div className={`text-[10px] mr-1 flex-shrink-0 ${isPending ? 'text-blue-200' : 'text-gray-500'}`}>
                            予定時間
                          </div>
                          <div className="flex flex-col justify-center mr-2 text-[11px] leading-tight flex-shrink-0 font-medium">
                            <span className={isPending ? 'text-white' : 'text-gray-700'}>
                              {displayStartTime}
                            </span>
                            <span className={isPending ? 'text-white' : 'text-gray-700'}>
                              {displayEndTime}
                            </span>
                          </div>

                          {/* スペーサー */}
                          <div className="flex-1" />

                          {/* 完了マーク */}
                          <div className={`w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 ml-1 ${
                            isPending ? 'bg-white/30' : 'bg-white/50'
                          }`}>
                            <Check className={`w-3 h-3 ${isPending ? 'text-white' : 'text-gray-600'}`} />
                          </div>

                          {/* ステータステキスト */}
                          <div className="text-[10px] ml-1 text-white whitespace-nowrap">
                            {isPending ? '予定' : '完了'}
                          </div>

                          {/* 右リサイズハンドル */}
                          {isActiveEdit && (
                            <div
                              className="absolute right-0 top-0 bottom-0 w-4 cursor-ew-resize rounded-r-full flex items-center justify-center hover:bg-black/20"
                              onMouseDown={(e) => {
                                e.stopPropagation();
                                handleDragStart(e, barId, 'resize-right');
                              }}
                            >
                              <div className="w-0.5 h-4 bg-white/70 rounded" />
                            </div>
                          )}
                        </div>

                        {/* 時間入力フィールド（編集モード時のみ） - バー外に配置 */}
                        {isActiveEdit && (() => {
                          const startParsed = parseTime(displayStartTime);
                          const endParsed = parseTime(displayEndTime);
                          const currentMemo = editBar?.memo ?? schedule.memo ?? '';
                          return (
                          <div
                            className="absolute -top-[72px] left-0 bg-white rounded shadow-lg border border-gray-300 px-2 py-2 z-50"
                            onClick={(e) => e.stopPropagation()}
                            onMouseDown={(e) => e.stopPropagation()}
                          >
                            {/* 時間入力行 */}
                            <div className="flex items-center gap-1 mb-2">
                              <select
                                value={startParsed.hours}
                                onChange={(e) => handleHourChange(barId, 'startTime', Number(e.target.value))}
                                className="w-[50px] text-xs border border-gray-300 rounded px-1 py-0.5"
                              >
                                {hourOptions.map(h => (
                                  <option key={h} value={h}>{String(h).padStart(2, '0')}</option>
                                ))}
                              </select>
                              <span className="text-xs text-gray-500">:</span>
                              <select
                                value={startParsed.minutes}
                                onChange={(e) => handleMinuteChange(barId, 'startTime', Number(e.target.value))}
                                className="w-[50px] text-xs border border-gray-300 rounded px-1 py-0.5"
                              >
                                {minuteOptions.map(m => (
                                  <option key={m} value={m}>{String(m).padStart(2, '0')}</option>
                                ))}
                              </select>
                              <span className="text-xs text-gray-500">〜</span>
                              <select
                                value={endParsed.hours}
                                onChange={(e) => handleHourChange(barId, 'endTime', Number(e.target.value))}
                                className="w-[50px] text-xs border border-gray-300 rounded px-1 py-0.5"
                              >
                                {hourOptions.map(h => (
                                  <option key={h} value={h}>{String(h).padStart(2, '0')}</option>
                                ))}
                              </select>
                              <span className="text-xs text-gray-500">:</span>
                              <select
                                value={endParsed.minutes}
                                onChange={(e) => handleMinuteChange(barId, 'endTime', Number(e.target.value))}
                                className="w-[50px] text-xs border border-gray-300 rounded px-1 py-0.5"
                              >
                                {minuteOptions.map(m => (
                                  <option key={m} value={m}>{String(m).padStart(2, '0')}</option>
                                ))}
                              </select>
                              <button
                                onClick={() => openSaveConfirm(barId)}
                                className="ml-2 px-3 py-0.5 bg-blue-400 hover:bg-blue-500 text-white text-xs rounded whitespace-nowrap"
                              >
                                保存
                              </button>
                            </div>
                            {/* 備考入力行 */}
                            <div className="flex items-center gap-1">
                              <span className="text-xs text-gray-500">備考:</span>
                              <input
                                type="text"
                                value={currentMemo}
                                onChange={(e) => handleMemoChange(barId, e.target.value)}
                                placeholder="備考を入力"
                                className="flex-1 text-xs border border-gray-300 rounded px-2 py-0.5 min-w-[200px]"
                              />
                            </div>
                          </div>
                          );
                        })()}
                      </div>
                    );
                  })}

                  {/* 新規作成バー */}
                  {hasNewBar(employee.id) && (() => {
                    const barId = `new-${employee.id}`;
                    const bar = editingBars.get(barId)!;
                    const isActiveEdit = activeEditBarId === barId;
                    const barLeft = timeToPosition(bar.startTime);
                    const barWidth = getBarWidth(bar.startTime, bar.endTime);

                    return (
                      <div
                        className={`absolute top-[4px] bottom-[4px] rounded-full flex items-center px-2 shadow-sm ${
                          isActiveEdit ? 'cursor-move ring-2 ring-blue-400 ring-offset-1' : 'cursor-pointer'
                        }`}
                        style={{
                          left: `${barLeft}px`,
                          width: `${Math.max(barWidth, 120)}px`,
                          minWidth: '120px',
                          background: 'linear-gradient(135deg, #60a5fa 0%, #3b82f6 50%, #2563eb 100%)',
                          zIndex: isActiveEdit ? 10 : 1
                        }}
                        onClick={() => setActiveEditBarId(isActiveEdit ? null : barId)}
                        onMouseDown={(e) => {
                          if (isActiveEdit) {
                            handleDragStart(e, barId, 'move');
                          }
                        }}
                      >
                        {/* 左リサイズハンドル */}
                        {isActiveEdit && (
                          <div
                            className="absolute left-0 top-0 bottom-0 w-4 cursor-ew-resize rounded-l-full flex items-center justify-center hover:bg-black/20"
                            onMouseDown={(e) => {
                              e.stopPropagation();
                              handleDragStart(e, barId, 'resize-left');
                            }}
                          >
                            <div className="w-0.5 h-4 bg-white/70 rounded" />
                          </div>
                        )}

                        {/* 時間表示 */}
                        <div className="flex flex-col justify-center mr-2 text-[11px] leading-tight flex-shrink-0 font-medium">
                          <span className="text-white">{bar.startTime}</span>
                          <span className="text-white">{bar.endTime}</span>
                        </div>

                        {/* 予定情報 */}
                        <div className="flex-1 min-w-0 overflow-hidden">
                          <div className="text-[11px] font-medium truncate leading-tight text-white">
                            {bar.taskName || '新規予定'}
                          </div>
                          <div className="text-[10px] truncate leading-tight text-blue-200">
                            新規作成
                          </div>
                        </div>

                        {/* 完了マーク */}
                        <div className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 ml-1 bg-white/30">
                          <Check className="w-3 h-3 text-white" />
                        </div>

                        {/* ステータステキスト */}
                        <div className="text-[10px] ml-1 flex-shrink-0 text-blue-200">
                          新規
                        </div>

                        {/* 右リサイズハンドル */}
                        {isActiveEdit && (
                          <div
                            className="absolute right-0 top-0 bottom-0 w-4 cursor-ew-resize rounded-r-full flex items-center justify-center hover:bg-black/20"
                            onMouseDown={(e) => {
                              e.stopPropagation();
                              handleDragStart(e, barId, 'resize-right');
                            }}
                          >
                            <div className="w-0.5 h-4 bg-white/70 rounded" />
                          </div>
                        )}

                        {/* 時間入力フィールド（編集モード時のみ） */}
                        {isActiveEdit && (() => {
                          const startParsed = parseTime(bar.startTime);
                          const endParsed = parseTime(bar.endTime);
                          const currentMemo = bar.memo ?? '';
                          return (
                          <div
                            className="absolute -top-[72px] left-0 bg-white rounded shadow-lg border border-gray-300 px-2 py-2 z-50"
                            onClick={(e) => e.stopPropagation()}
                            onMouseDown={(e) => e.stopPropagation()}
                          >
                            {/* 時間入力行 */}
                            <div className="flex items-center gap-1 mb-2">
                              <select
                                value={startParsed.hours}
                                onChange={(e) => handleHourChange(barId, 'startTime', Number(e.target.value))}
                                className="w-[50px] text-xs border border-gray-300 rounded px-1 py-0.5"
                              >
                                {hourOptions.map(h => (
                                  <option key={h} value={h}>{String(h).padStart(2, '0')}</option>
                                ))}
                              </select>
                              <span className="text-xs text-gray-500">:</span>
                              <select
                                value={startParsed.minutes}
                                onChange={(e) => handleMinuteChange(barId, 'startTime', Number(e.target.value))}
                                className="w-[50px] text-xs border border-gray-300 rounded px-1 py-0.5"
                              >
                                {minuteOptions.map(m => (
                                  <option key={m} value={m}>{String(m).padStart(2, '0')}</option>
                                ))}
                              </select>
                              <span className="text-xs text-gray-500">〜</span>
                              <select
                                value={endParsed.hours}
                                onChange={(e) => handleHourChange(barId, 'endTime', Number(e.target.value))}
                                className="w-[50px] text-xs border border-gray-300 rounded px-1 py-0.5"
                              >
                                {hourOptions.map(h => (
                                  <option key={h} value={h}>{String(h).padStart(2, '0')}</option>
                                ))}
                              </select>
                              <span className="text-xs text-gray-500">:</span>
                              <select
                                value={endParsed.minutes}
                                onChange={(e) => handleMinuteChange(barId, 'endTime', Number(e.target.value))}
                                className="w-[50px] text-xs border border-gray-300 rounded px-1 py-0.5"
                              >
                                {minuteOptions.map(m => (
                                  <option key={m} value={m}>{String(m).padStart(2, '0')}</option>
                                ))}
                              </select>
                              <button
                                onClick={() => openSaveConfirm(barId)}
                                className="ml-2 px-3 py-0.5 bg-blue-400 hover:bg-blue-500 text-white text-xs rounded whitespace-nowrap"
                              >
                                保存
                              </button>
                            </div>
                            {/* 備考入力行 */}
                            <div className="flex items-center gap-1">
                              <span className="text-xs text-gray-500">備考:</span>
                              <input
                                type="text"
                                value={currentMemo}
                                onChange={(e) => handleMemoChange(barId, e.target.value)}
                                placeholder="備考を入力"
                                className="flex-1 text-xs border border-gray-300 rounded px-2 py-0.5 min-w-[200px]"
                              />
                            </div>
                          </div>
                          );
                        })()}
                      </div>
                    );
                  })()}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* 保存確認モーダル */}
      {showSaveConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl p-6 w-[320px]">
            <h3 className="text-lg font-bold mb-4">確認</h3>
            <p className="text-sm text-gray-600 mb-6">本当に保存しますか？</p>
            <div className="flex gap-2">
              <button
                onClick={() => setShowSaveConfirm(null)}
                className="flex-1 px-4 py-2 border border-gray-300 rounded hover:bg-gray-50 text-sm font-medium"
              >
                キャンセル
              </button>
              <button
                onClick={handleConfirmSave}
                className="flex-1 px-4 py-2 bg-blue-400 text-white rounded hover:bg-blue-500 text-sm font-medium"
              >
                保存する
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 一括保存モーダル */}
      {showBulkSaveModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl p-6 w-[450px] max-h-[80vh] flex flex-col">
            <h3 className="text-lg font-bold mb-2">一括保存</h3>
            <p className="text-sm text-gray-600 mb-4">
              保存する変更にチェックを入れてください。チェックを外すと保存されません。
            </p>

            {/* 変更リスト */}
            <div className="flex-1 overflow-y-auto border border-gray-200 rounded mb-4">
              {Array.from(editingBars.entries()).map(([barId, bar]) => (
                <label
                  key={barId}
                  className="flex items-center gap-3 px-4 py-3 border-b border-gray-100 last:border-b-0 hover:bg-gray-50 cursor-pointer"
                >
                  <input
                    type="checkbox"
                    checked={selectedForSave.has(barId)}
                    onChange={() => toggleSaveSelection(barId)}
                    className="w-4 h-4 text-blue-500 rounded border-gray-300 focus:ring-blue-400"
                  />
                  <div className="flex-1">
                    <div className="text-sm font-medium text-gray-800">
                      {getEmployeeName(bar.employeeId)}
                    </div>
                    <div className="text-xs text-gray-500">
                      {bar.startTime} 〜 {bar.endTime}
                      {bar.isNew && <span className="ml-2 text-blue-500">（新規）</span>}
                    </div>
                  </div>
                </label>
              ))}
            </div>

            {/* 選択数表示 */}
            <div className="text-sm text-gray-600 mb-4">
              {selectedForSave.size} / {editingBars.size} 件を保存
            </div>

            {/* ボタン */}
            <div className="flex gap-2">
              <button
                onClick={() => {
                  setShowBulkSaveModal(false);
                  setSelectedForSave(new Set());
                }}
                className="flex-1 px-4 py-2 border border-gray-300 rounded hover:bg-gray-50 text-sm font-medium"
              >
                キャンセル
              </button>
              <button
                onClick={handleBulkSave}
                disabled={selectedForSave.size === 0}
                className={`flex-1 px-4 py-2 rounded text-sm font-medium ${
                  selectedForSave.size > 0
                    ? 'bg-blue-500 text-white hover:bg-blue-600'
                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                }`}
              >
                保存する
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
