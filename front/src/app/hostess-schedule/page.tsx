'use client';

import React, { useState, useMemo, useRef, useCallback, useEffect } from 'react';
import Link from 'next/link';
import { Button } from "@/components/ui/button";
import { ArrowLeft, ChevronLeft, ChevronRight, ChevronDown, Check, Plus, X } from "lucide-react";

// 編集中のバーデータ
interface EditingBar {
  hostessId: string;
  barId: string; // 新規の場合は 'new-{hostessId}'、既存の場合は reservation.id
  startTime: string;
  endTime: string;
  isNew: boolean;
  customerName?: string;
  receptDate?: string;
  location?: string;
  status?: 'pending' | 'confirmed' | 'completed';
}

// 予約データの型定義
interface Reservation {
  id: string;
  customerName: string;
  startTime: string; // "HH:MM" 形式
  endTime: string;   // "HH:MM" 形式
  receptDate: string; // 受付日時
  location: string;
  status: 'pending' | 'confirmed' | 'completed';
}

// ホステスデータの型定義
interface HostessTimelineData {
  id: string;
  name: string;           // 店内名
  workType: string;       // 勤務形態
  assignedStaff: string;  // 担当者
  workStartTime: string;  // "HH:MM" 形式
  workEndTime: string;    // "HH:MM" 形式
  isOff: boolean;         // 休みかどうか
  reservations: Reservation[];
}

// サンプルデータ
const sampleHostessTimeline: HostessTimelineData[] = [
  {
    id: "1",
    name: "すみれ",
    workType: "正社員",
    assignedStaff: "佐藤",
    workStartTime: "",
    workEndTime: "",
    isOff: true,
    reservations: [
      {
        id: "r1",
        customerName: "鈴木一✕ 様",
        startTime: "15:00",
        endTime: "16:30",
        receptDate: "01/25 11:54",
        location: "京都デリヘル...",
        status: "completed"
      }
    ]
  },
  {
    id: "2",
    name: "瑠璃-ruri-",
    workType: "パート",
    assignedStaff: "高橋",
    workStartTime: "10:00",
    workEndTime: "21:00",
    isOff: false,
    reservations: [
      {
        id: "r2",
        customerName: "顧客:未登録",
        startTime: "10:15",
        endTime: "11:35",
        receptDate: "01/22 20:15",
        location: "",
        status: "completed"
      }
    ]
  },
  {
    id: "3",
    name: "かんな",
    workType: "契約",
    assignedStaff: "田中",
    workStartTime: "10:00",
    workEndTime: "18:30",
    isOff: false,
    reservations: []
  },
  {
    id: "4",
    name: "スイレン",
    workType: "派遣",
    assignedStaff: "山田",
    workStartTime: "12:00",
    workEndTime: "17:30",
    isOff: false,
    reservations: [
      {
        id: "r3",
        customerName: "顧客:未登録",
        startTime: "12:30",
        endTime: "14:10",
        receptDate: "01/13 19:48",
        location: "",
        status: "completed"
      }
    ]
  },
  {
    id: "5",
    name: "妃-kisaki-",
    workType: "正社員",
    assignedStaff: "佐藤",
    workStartTime: "14:00",
    workEndTime: "21:00",
    isOff: false,
    reservations: [
      {
        id: "r4",
        customerName: "顧客:未登録",
        startTime: "14:30",
        endTime: "16:10",
        receptDate: "01/15 10:09",
        location: "",
        status: "completed"
      }
    ]
  },
  {
    id: "6",
    name: "ミイ",
    workType: "パート",
    assignedStaff: "鈴木",
    workStartTime: "12:00",
    workEndTime: "18:00",
    isOff: false,
    reservations: [
      {
        id: "r5",
        customerName: "顧客:未登録 様",
        startTime: "12:10",
        endTime: "14:10",
        receptDate: "01/20 16:16",
        location: "京都デリヘル倶楽部",
        status: "pending"
      }
    ]
  },
  {
    id: "7",
    name: "かなの",
    workType: "契約",
    assignedStaff: "高橋",
    workStartTime: "11:00",
    workEndTime: "16:00",
    isOff: false,
    reservations: [
      {
        id: "r6",
        customerName: "顧客:未登録",
        startTime: "11:20",
        endTime: "12:40",
        receptDate: "01/24 13:11",
        location: "",
        status: "completed"
      }
    ]
  },
  {
    id: "8",
    name: "あみ",
    workType: "派遣",
    assignedStaff: "田中",
    workStartTime: "16:00",
    workEndTime: "22:00",
    isOff: false,
    reservations: []
  },
  {
    id: "9",
    name: "雪-yuki-",
    workType: "正社員",
    assignedStaff: "山田",
    workStartTime: "13:00",
    workEndTime: "20:30",
    isOff: false,
    reservations: [
      {
        id: "r7",
        customerName: "顧客:未登録",
        startTime: "15:30",
        endTime: "17:30",
        receptDate: "01/25 15:54",
        location: "",
        status: "pending"
      }
    ]
  },
  {
    id: "10",
    name: "か美-hiro-…",
    workType: "パート",
    assignedStaff: "佐藤",
    workStartTime: "10:00",
    workEndTime: "15:00",
    isOff: false,
    reservations: [
      {
        id: "r8",
        customerName: "たつみ 様",
        startTime: "10:20",
        endTime: "12:40",
        receptDate: "01/22 11:20",
        location: "愛しいね@yeh",
        status: "completed"
      },
      {
        id: "r9",
        customerName: "顧客:未登録",
        startTime: "12:55",
        endTime: "14:15",
        receptDate: "01/22 17:52",
        location: "",
        status: "completed"
      }
    ]
  },
  {
    id: "11",
    name: "りあん",
    workType: "契約",
    assignedStaff: "鈴木",
    workStartTime: "14:00",
    workEndTime: "20:00",
    isOff: false,
    reservations: [
      {
        id: "r10",
        customerName: "豊Q0501 様",
        startTime: "14:30",
        endTime: "16:00",
        receptDate: "01/20 16:23",
        location: "京都デリヘル倶楽部",
        status: "completed"
      }
    ]
  },
  {
    id: "12",
    name: "あず",
    workType: "派遣",
    assignedStaff: "高橋",
    workStartTime: "20:00",
    workEndTime: "01:00",
    isOff: false,
    reservations: []
  }
];

// 時間軸の範囲（10:00〜翌2:00 = 16時間）
const TIME_START_HOUR = 10;
const TIME_END_HOUR = 26; // 翌2:00を26時として扱う
const HOUR_WIDTH = 120; // 1時間あたりのピクセル幅
const ROW_HEIGHT = 52; // 各行の高さ

// ソートタイプの定義
type SortType = 'name-asc' | 'name-desc' | 'worktime-asc' | 'worktime-desc' | 'start-asc' | 'start-desc' | 'staff-asc' | 'staff-desc';

// 滞在時間（勤務時間）を分単位で計算
const calculateWorkMinutes = (hostess: HostessTimelineData): number => {
  if (hostess.isOff || !hostess.workStartTime || !hostess.workEndTime) return 0;
  const [startH, startM] = hostess.workStartTime.split(':').map(Number);
  const [endH, endM] = hostess.workEndTime.split(':').map(Number);
  const startMinutes = startH * 60 + startM;
  let endMinutes = endH * 60 + endM;
  // 深夜をまたぐ場合
  if (endMinutes < startMinutes) {
    endMinutes += 24 * 60;
  }
  return endMinutes - startMinutes;
};

// 勤務開始時間を分単位で取得
const getStartMinutes = (hostess: HostessTimelineData): number => {
  if (hostess.isOff || !hostess.workStartTime) return 9999;
  const [h, m] = hostess.workStartTime.split(':').map(Number);
  return h * 60 + m;
};

export default function HostessSchedule() {
  React.useEffect(() => {
    document.title = 'ホステススケジュール管理 - Dispatch Harmony Hub';
  }, []);

  const [currentDate, setCurrentDate] = useState(new Date());
  const [hostessData] = useState<HostessTimelineData[]>(sampleHostessTimeline);
  const [sortType, setSortType] = useState<SortType>('name-asc');
  const [searchText, setSearchText] = useState('');
  const [staffFilter, setStaffFilter] = useState<string>('');

  // 編集中のバー管理 (キーは barId)
  const [editingBars, setEditingBars] = useState<Map<string, EditingBar>>(new Map());
  // 現在編集モードのバーID
  const [activeEditBarId, setActiveEditBarId] = useState<string | null>(null);
  // 保存確認モーダル
  const [showSaveConfirm, setShowSaveConfirm] = useState<string | null>(null); // barId
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

  // 担当者リストを抽出
  const staffList = useMemo(() => {
    const staffSet = new Set<string>();
    hostessData.forEach(h => {
      if (h.assignedStaff) staffSet.add(h.assignedStaff);
    });
    return Array.from(staffSet).sort((a, b) => a.localeCompare(b, 'ja'));
  }, [hostessData]);

  // フィルタ・ソート済みホステスリスト
  const hostesses = useMemo(() => {
    let filtered = [...hostessData];

    // キャスト名で検索
    if (searchText.trim()) {
      filtered = filtered.filter(h =>
        h.name.toLowerCase().includes(searchText.toLowerCase())
      );
    }

    // 担当者でフィルター
    if (staffFilter) {
      filtered = filtered.filter(h => h.assignedStaff === staffFilter);
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
      case 'staff-asc':
        return filtered.sort((a, b) => a.assignedStaff.localeCompare(b.assignedStaff, 'ja'));
      case 'staff-desc':
        return filtered.sort((a, b) => b.assignedStaff.localeCompare(a.assignedStaff, 'ja'));
      default:
        return filtered;
    }
  }, [hostessData, sortType, searchText, staffFilter]);

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
    let adjustedHours = hours;
    // 深夜0時以降は24時以降として扱う
    if (hours < TIME_START_HOUR) {
      adjustedHours = hours + 24;
    }
    const totalMinutes = adjustedHours * 60 + minutes - TIME_START_HOUR * 60;
    return (totalMinutes / 60) * HOUR_WIDTH;
  };

  // 予約バーの幅を計算
  const getBarWidth = (startTime: string, endTime: string): number => {
    const startPos = timeToPosition(startTime);
    const endPos = timeToPosition(endTime);
    return endPos - startPos;
  };

  // 時間軸の時間リストを生成
  const timeSlots = useMemo(() => {
    const slots = [];
    for (let hour = TIME_START_HOUR; hour <= TIME_END_HOUR; hour++) {
      const displayHour = hour >= 24 ? hour - 24 : hour;
      slots.push({
        hour,
        display: `${displayHour}:00`
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
    const minutes = Math.round(totalMinutes % 60 / 30) * 30; // 30分単位に丸める
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

  // 時間オプション（0-23、深夜は24-26も含む）
  const hourOptions = Array.from({ length: 27 }, (_, i) => i);
  // 分オプション（10分単位）
  const minuteOptions = [0, 10, 20, 30, 40, 50];

  // 新しいバーを作成
  const handleCreateBar = (hostessId: string) => {
    const barId = `new-${hostessId}`;
    const newBar: EditingBar = {
      hostessId,
      barId,
      startTime: '12:00',
      endTime: '14:00',
      isNew: true,
      customerName: '新規予約',
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
  const handleBarClick = (hostessId: string, reservation: Reservation) => {
    const barId = reservation.id;
    // 既に編集中なら編集解除
    if (activeEditBarId === barId) {
      setActiveEditBarId(null);
      return;
    }
    // まだ編集バーとして登録されていなければ登録
    if (!editingBars.has(barId)) {
      const editBar: EditingBar = {
        hostessId,
        barId,
        startTime: reservation.startTime,
        endTime: reservation.endTime,
        isNew: false,
        customerName: reservation.customerName,
        receptDate: reservation.receptDate,
        location: reservation.location,
        status: reservation.status
      };
      setEditingBars(new Map(editingBars.set(barId, editBar)));
    }
    setActiveEditBarId(barId);
  };

  // 新規バーが存在するかチェック
  const hasNewBar = (hostessId: string) => {
    return editingBars.has(`new-${hostessId}`);
  };

  // 手動で時間を更新
  // 時間変更（時または分）
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

  // 保存確認モーダルを開く
  const openSaveConfirm = (barId: string) => {
    setShowSaveConfirm(barId);
  };

  // 保存を実行
  const handleConfirmSave = () => {
    if (showSaveConfirm) {
      const bar = editingBars.get(showSaveConfirm);
      if (bar) {
        // ここで実際のAPI保存処理を行う（今は状態管理のみ）
        // console.log('保存:', bar);
        // 保存後は編集状態を解除
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
    // 全ての編集中のバーを選択状態にする
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
      // ここで実際のAPI保存処理を行う（今は状態管理のみ）
      newMap.delete(barId);
      if (activeEditBarId === barId) {
        setActiveEditBarId(null);
      }
    });
    setEditingBars(newMap);
    setShowBulkSaveModal(false);
    setSelectedForSave(new Set());
  };

  // ホステス名を取得
  const getHostessName = (hostessId: string): string => {
    const hostess = hostessData.find(h => h.id === hostessId);
    return hostess?.name || '不明';
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
            <h1 className="text-lg font-bold mr-2">ホステススケジュール</h1>

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
        {/* 左側: 担当者フィルター・ソートボタン */}
        <div className="flex items-center gap-2">
        {/* 担当者フィルター */}
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

        {/* ソートボタン */}
        <span className="text-xs text-gray-600 font-medium">並び替え:</span>
        <button
          onClick={() => setSortType(sortType === 'name-asc' ? 'name-desc' : 'name-asc')}
          className={`px-2 py-1 text-xs rounded border ${
            sortType === 'name-asc' || sortType === 'name-desc'
              ? 'bg-pink-500 text-white border-pink-500'
              : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
          }`}
        >
          五十音順 {sortType === 'name-asc' ? '▲' : sortType === 'name-desc' ? '▼' : ''}
        </button>
        <button
          onClick={() => setSortType(sortType === 'worktime-desc' ? 'worktime-asc' : 'worktime-desc')}
          className={`px-2 py-1 text-xs rounded border ${
            sortType === 'worktime-desc' || sortType === 'worktime-asc'
              ? 'bg-pink-500 text-white border-pink-500'
              : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
          }`}
        >
          滞在時間 {sortType === 'worktime-desc' ? '▼多' : sortType === 'worktime-asc' ? '▲少' : ''}
        </button>
        <button
          onClick={() => setSortType(sortType === 'start-asc' ? 'start-desc' : 'start-asc')}
          className={`px-2 py-1 text-xs rounded border ${
            sortType === 'start-asc' || sortType === 'start-desc'
              ? 'bg-pink-500 text-white border-pink-500'
              : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
          }`}
        >
          出勤時間 {sortType === 'start-asc' ? '▲早' : sortType === 'start-desc' ? '▼遅' : ''}
        </button>
        <button
          onClick={() => setSortType(sortType === 'staff-asc' ? 'staff-desc' : 'staff-asc')}
          className={`px-2 py-1 text-xs rounded border ${
            sortType === 'staff-asc' || sortType === 'staff-desc'
              ? 'bg-pink-500 text-white border-pink-500'
              : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
          }`}
        >
          担当者 {sortType === 'staff-asc' ? '▲' : sortType === 'staff-desc' ? '▼' : ''}
        </button>
        </div>

        {/* キャスト検索 */}
        <div className="ml-8 flex items-center gap-2">
          <span className="text-xs text-gray-600 font-medium">検索:</span>
          <input
            type="text"
            placeholder="キャスト名"
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            className="w-[180px] h-7 px-3 text-xs border border-gray-500 rounded-full focus:outline-none focus:ring-1 focus:ring-pink-400"
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
        {/* 左側パネル - ホステスリスト（3カラム） */}
        <div className="flex-shrink-0 flex flex-col bg-pink-100 border-r border-pink-300">
          {/* ヘッダー行 */}
          <div className="h-[30px] border-b border-pink-300 flex-shrink-0 flex">
            <div className="w-[100px] border-r border-pink-300 flex items-center justify-center text-xs font-bold text-gray-700">
              店内名
            </div>
            <div className="w-[60px] border-r border-pink-300 flex items-center justify-center text-xs font-bold text-gray-700">
              勤務形態
            </div>
            <div className="w-[50px] border-r border-pink-300 flex items-center justify-center text-xs font-bold text-gray-700">
              担当者
            </div>
            <div className="w-[50px] flex items-center justify-center text-xs font-bold text-gray-700">
              作成
            </div>
          </div>

          {/* ホステスリスト */}
          <div
            ref={leftPanelRef}
            className="flex-1 overflow-y-auto overflow-x-hidden [&::-webkit-scrollbar]:hidden"
            onScroll={handleLeftPanelScroll}
            style={{ scrollbarWidth: 'none' }}
          >
            {hostesses.map((hostess) => (
              <div
                key={hostess.id}
                className="border-b border-pink-300 flex"
                style={{ height: `${ROW_HEIGHT}px` }}
              >
                {/* 店内名 */}
                <div className="w-[100px] border-r border-pink-300 flex items-center px-2">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1">
                      <span className="text-sm font-medium truncate">{hostess.name}</span>
                      <ChevronDown className="w-3 h-3 text-gray-500 flex-shrink-0" />
                    </div>
                    <div className="text-xs text-gray-600">
                      {hostess.isOff ? (
                        <span className="text-red-500 font-medium">休み</span>
                      ) : (
                        `${hostess.workStartTime}-${hostess.workEndTime}`
                      )}
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
                {/* 作成ボタン */}
                <div className="w-[50px] flex items-center justify-center">
                  {hasNewBar(hostess.id) ? (
                    <button
                      onClick={() => handleCancelEdit(`new-${hostess.id}`)}
                      className="w-7 h-7 rounded bg-red-500 hover:bg-red-600 text-white flex items-center justify-center"
                      title="キャンセル"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  ) : (
                    <button
                      onClick={() => handleCreateBar(hostess.id)}
                      className="w-7 h-7 rounded bg-blue-400 hover:bg-blue-500 text-white flex items-center justify-center"
                      title="バーを作成"
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
              {hostesses.map((hostess, index) => (
                <div
                  key={hostess.id}
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
                  {!hostess.isOff && hostess.workStartTime && hostess.workEndTime && (
                    <div
                      className="absolute top-0 bottom-0"
                      style={{
                        left: `${timeToPosition(hostess.workStartTime)}px`,
                        width: `${getBarWidth(hostess.workStartTime, hostess.workEndTime)}px`,
                        backgroundColor: 'rgba(255, 182, 193, 0.2)'
                      }}
                    />
                  )}

                  {/* 予約バー（既存） */}
                  {hostess.reservations.map((reservation) => {
                    const barId = reservation.id;
                    const _isEditing = editingBars.has(barId);
                    const isActiveEdit = activeEditBarId === barId;
                    const editBar = editingBars.get(barId);

                    // 編集中なら編集バーの時間を使う
                    const displayStartTime = editBar?.startTime ?? reservation.startTime;
                    const displayEndTime = editBar?.endTime ?? reservation.endTime;
                    const isPending = (editBar?.status ?? reservation.status) === 'pending';

                    const barLeft = timeToPosition(displayStartTime);
                    const barWidth = getBarWidth(displayStartTime, displayEndTime);

                    return (
                      <div
                        key={reservation.id}
                        className={`absolute top-[4px] bottom-[4px] rounded-full flex items-center px-2 shadow-sm ${
                          isActiveEdit ? 'cursor-move ring-2 ring-blue-400 ring-offset-1' : 'cursor-pointer'
                        }`}
                        style={{
                          left: `${barLeft}px`,
                          width: `${Math.max(barWidth, 120)}px`,
                          minWidth: '120px',
                          background: isPending
                            ? 'linear-gradient(135deg, #c084fc 0%, #a855f7 50%, #9333ea 100%)'
                            : 'linear-gradient(135deg, #d4d4d4 0%, #a3a3a3 50%, #737373 100%)',
                          zIndex: isActiveEdit ? 10 : 1
                        }}
                        onClick={() => handleBarClick(hostess.id, reservation)}
                        onMouseDown={(e) => {
                          if (isActiveEdit) {
                            handleDragStart(e, barId, 'move');
                          }
                        }}
                      >
                        {/* 左リサイズハンドル（編集モード時のみ） */}
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
                        <div className={`text-[10px] mr-1 flex-shrink-0 ${isPending ? 'text-purple-200' : 'text-gray-500'}`}>
                          出勤日時
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
                        <div className="text-[10px] ml-1 flex-shrink-0 text-white">
                          完了
                        </div>

                        {/* 右リサイズハンドル（編集モード時のみ） */}
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
                          const startParsed = parseTime(displayStartTime);
                          const endParsed = parseTime(displayEndTime);
                          return (
                          <div
                            className="absolute -top-10 left-0 bg-white rounded shadow-lg border border-gray-300 px-2 py-1 flex items-center gap-1 z-20"
                            onClick={(e) => e.stopPropagation()}
                            onMouseDown={(e) => e.stopPropagation()}
                          >
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
                          );
                        })()}
                      </div>
                    );
                  })}

                  {/* 新規作成バー */}
                  {hasNewBar(hostess.id) && (() => {
                    const barId = `new-${hostess.id}`;
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
                          background: 'linear-gradient(135deg, #c084fc 0%, #a855f7 50%, #9333ea 100%)',
                          zIndex: isActiveEdit ? 10 : 1
                        }}
                        onClick={() => setActiveEditBarId(isActiveEdit ? null : barId)}
                        onMouseDown={(e) => {
                          if (isActiveEdit) {
                            handleDragStart(e, barId, 'move');
                          }
                        }}
                      >
                        {/* 左リサイズハンドル（編集モード時のみ） */}
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

                        {/* 予約情報 */}
                        <div className="flex-1 min-w-0 overflow-hidden">
                          <div className="text-[11px] font-medium truncate leading-tight text-white">
                            {bar.customerName || '新規予約'}
                          </div>
                          <div className="text-[10px] truncate leading-tight text-purple-200">
                            新規作成
                          </div>
                        </div>

                        {/* 完了マーク */}
                        <div className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 ml-1 bg-white/30">
                          <Check className="w-3 h-3 text-white" />
                        </div>

                        {/* ステータステキスト */}
                        <div className="text-[10px] ml-1 flex-shrink-0 text-purple-200">
                          新規
                        </div>

                        {/* 右リサイズハンドル（編集モード時のみ） */}
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
                          return (
                          <div
                            className="absolute -top-10 left-0 bg-white rounded shadow-lg border border-gray-300 px-2 py-1 flex items-center gap-1 z-20"
                            onClick={(e) => e.stopPropagation()}
                            onMouseDown={(e) => e.stopPropagation()}
                          >
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
                      {getHostessName(bar.hostessId)}
                    </div>
                    <div className="text-xs text-gray-500">
                      {bar.startTime} 〜 {bar.endTime}
                      {bar.isNew && <span className="ml-2 text-purple-500">（新規）</span>}
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
