'use client';

import React, { useState, useMemo, useRef, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from "@/components/ui/button";
import { ArrowLeft, ChevronLeft, ChevronRight, ChevronDown, Check } from "lucide-react";

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

export default function HostessSchedule() {
  React.useEffect(() => {
    document.title = 'ホステススケジュール管理 - Dispatch Harmony Hub';
  }, []);

  const router = useRouter();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [hostesses] = useState<HostessTimelineData[]>(sampleHostessTimeline);

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

  return (
    <div className="h-screen bg-gray-100 flex flex-col overflow-hidden">
      {/* ヘッダー */}
      <div className="h-[50px] bg-white border-b border-zinc-300 flex-shrink-0">
        <div className="flex items-center h-full px-2">
          <Button
            variant="outline"
            onClick={() => router.push('/dashboard')}
            className="h-8 px-3 text-sm flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            ダッシュボードに戻る
          </Button>

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

      {/* メインコンテンツ */}
      <div className="flex-1 flex overflow-hidden">
        {/* 左側パネル - ホステスリスト（3カラム） */}
        <div className="flex-shrink-0 flex flex-col bg-pink-100 border-r border-pink-300">
          {/* ヘッダー行 */}
          <div className="h-[30px] border-b border-pink-300 flex-shrink-0 flex">
            <div className="w-[120px] border-r border-pink-300 flex items-center justify-center text-xs font-bold text-gray-700">
              店内名
            </div>
            <div className="w-[70px] border-r border-pink-300 flex items-center justify-center text-xs font-bold text-gray-700">
              勤務形態
            </div>
            <div className="w-[60px] flex items-center justify-center text-xs font-bold text-gray-700">
              担当者
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
                <div className="w-[120px] border-r border-pink-300 flex items-center px-2">
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
                <div className="w-[70px] border-r border-pink-300 flex items-center justify-center">
                  <span className="text-xs text-gray-700">{hostess.workType}</span>
                </div>
                {/* 担当者 */}
                <div className="w-[60px] flex items-center justify-center">
                  <span className="text-xs text-gray-700">{hostess.assignedStaff}</span>
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

                  {/* 予約バー */}
                  {hostess.reservations.map((reservation) => {
                    const isPending = reservation.status === 'pending';
                    const barLeft = timeToPosition(reservation.startTime);
                    const barWidth = getBarWidth(reservation.startTime, reservation.endTime);

                    return (
                      <div
                        key={reservation.id}
                        className="absolute top-[4px] bottom-[4px] rounded-full flex items-center px-2 cursor-pointer shadow-sm"
                        style={{
                          left: `${barLeft}px`,
                          width: `${barWidth}px`,
                          minWidth: '120px',
                          background: isPending
                            ? 'linear-gradient(135deg, #c084fc 0%, #a855f7 50%, #9333ea 100%)'
                            : 'linear-gradient(135deg, #d4d4d4 0%, #a3a3a3 50%, #737373 100%)'
                        }}
                      >
                        {/* 時間表示 */}
                        <div className="flex flex-col justify-center mr-2 text-[11px] leading-tight flex-shrink-0 font-medium">
                          <span className={isPending ? 'text-white' : 'text-gray-700'}>
                            {reservation.startTime}
                          </span>
                          <span className={isPending ? 'text-white' : 'text-gray-700'}>
                            {reservation.endTime}
                          </span>
                        </div>

                        {/* 予約情報 */}
                        <div className="flex-1 min-w-0 overflow-hidden">
                          <div className={`text-[11px] font-medium truncate leading-tight ${isPending ? 'text-white' : 'text-gray-800'}`}>
                            {reservation.customerName}
                          </div>
                          <div className={`text-[10px] truncate leading-tight ${isPending ? 'text-purple-200' : 'text-gray-600'}`}>
                            受付: {reservation.receptDate}
                          </div>
                          {reservation.location && (
                            <div className={`text-[10px] truncate leading-tight ${isPending ? 'text-purple-200' : 'text-gray-600'}`}>
                              {reservation.location}
                            </div>
                          )}
                        </div>

                        {/* 完了マーク */}
                        <div className={`w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 ml-1 ${
                          isPending ? 'bg-white/30' : 'bg-white/50'
                        }`}>
                          <Check className={`w-3 h-3 ${isPending ? 'text-white' : 'text-gray-600'}`} />
                        </div>

                        {/* ステータステキスト */}
                        <div className={`text-[10px] ml-1 flex-shrink-0 ${isPending ? 'text-purple-200' : 'text-gray-500'}`}>
                          完了
                        </div>
                      </div>
                    );
                  })}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
