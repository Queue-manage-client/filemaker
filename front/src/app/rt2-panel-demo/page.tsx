'use client';

import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import Link from 'next/link';
import { Button } from "@/components/ui/button";
import { ArrowLeft, ChevronLeft, ChevronRight, ChevronDown } from "lucide-react";
import { sampleCastData } from '@/data/castSampleData';
import { formatDate } from 'date-fns';

// 時間軸の範囲（17:00〜翌7:00 = 14時間）
const TIME_START_HOUR = 17;
const TIME_END_HOUR = 31; // 翌日7時 = 24 + 7
const HOUR_WIDTH = 100;
const ROW_HEIGHT = 52;

// 予約データの型定義
interface ReservationData {
  id: string;
  time: string;
  location: string;
  type: 'final' | 'current' | 'inDriver' | 'next1' | 'next2' | 'next3' | 'next4' | 'next5';
}

// 時間を分に変換（深夜帯対応）
const timeToMinutes = (time: string): number => {
  const [hours, minutes] = time.split(':').map(Number);
  // 17時より前の場合は翌日として扱う
  if (hours < TIME_START_HOUR) {
    return (hours + 24) * 60 + minutes;
  }
  return hours * 60 + minutes;
};

// 時間をピクセル位置に変換
const timeToPosition = (time: string): number => {
  const minutes = timeToMinutes(time);
  const startMinutes = TIME_START_HOUR * 60;
  const diffMinutes = minutes - startMinutes;
  return (diffMinutes / 60) * HOUR_WIDTH;
};

// タイプに応じた色を取得
const getReservationColor = (type: ReservationData['type']): string => {
  switch (type) {
    case 'final':
      return 'linear-gradient(135deg, #f97316 0%, #ea580c 50%, #c2410c 100%)'; // オレンジ
    case 'current':
      return 'linear-gradient(135deg, #22c55e 0%, #16a34a 50%, #15803d 100%)'; // 緑
    case 'inDriver':
      return 'linear-gradient(135deg, #3b82f6 0%, #2563eb 50%, #1d4ed8 100%)'; // 青
    default:
      return 'linear-gradient(135deg, #a855f7 0%, #9333ea 50%, #7e22ce 100%)'; // 紫（予約）
  }
};

// タイプに応じたラベルを取得
const getReservationLabel = (type: ReservationData['type']): string => {
  switch (type) {
    case 'final':
      return '最終';
    case 'current':
      return '接客中';
    case 'inDriver':
      return 'IN';
    case 'next1':
      return '予約1';
    case 'next2':
      return '予約2';
    case 'next3':
      return '予約3';
    case 'next4':
      return '予約4';
    case 'next5':
      return '予約5+';
    default:
      return '予約';
  }
};

// remarkに応じた背景色を取得
const getRemarkColor = (remark: string): string => {
  switch (remark) {
    case 'VIP':
      return '#fef3c7'; // 黄色系
    case 'Lady':
      return '#dbeafe'; // 青系
    case 'Girls':
      return '#fce7f3'; // ピンク系
    case 'SUP':
      return '#e9d5ff'; // 紫系
    case '新人':
      return '#dcfce7'; // 緑系
    default:
      return '#f3f4f6'; // グレー
  }
};

export default function RT2PanelDemo() {
  const [currentTime, setCurrentTime] = useState<Date | null>(null);
  const [currentDate, setCurrentDate] = useState(new Date());

  useEffect(() => {
    document.title = 'RT Ⅱ パネル - Dispatch Harmony Hub';
    // クライアントサイドでのみ時刻を設定
    setCurrentTime(new Date());
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const formatTime = (date: Date) => {
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');

    return `${hours}:${minutes}:${seconds}`;
  };

  // 日付ナビゲーション
  const navigateDate = (direction: 'prev' | 'next') => {
    const newDate = new Date(currentDate);
    newDate.setDate(currentDate.getDate() + (direction === 'next' ? 1 : -1));
    setCurrentDate(newDate);
  };

  const formatDateDisplay = (date: Date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const dayNames = ['日', '月', '火', '水', '木', '金', '土'];
    const dayOfWeek = dayNames[date.getDay()];
    return `${year}/${month}/${day}(${dayOfWeek})`;
  };

  // スクロール同期用のref
  const leftPanelRef = useRef<HTMLDivElement>(null);
  const timelineBodyRef = useRef<HTMLDivElement>(null);
  const timeHeaderRef = useRef<HTMLDivElement>(null);

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

  // キャストの予約データを抽出
  const getReservations = (cast: typeof sampleCastData[0]): ReservationData[] => {
    const reservations: ReservationData[] = [];

    // 最終接客
    if (cast.finalCustomer && cast.homeTime) {
      reservations.push({
        id: `${cast.id}-final`,
        time: cast.homeTime,
        location: cast.finalCustomer,
        type: 'final'
      });
    }

    // 接客中
    if (cast.nowCustomer && cast.homeTime) {
      reservations.push({
        id: `${cast.id}-current`,
        time: cast.homeTime,
        location: cast.nowCustomer,
        type: 'current'
      });
    }

    // INドライバー稼働中
    if (cast.inDriverMoving) {
      reservations.push({
        id: `${cast.id}-inDriver`,
        time: cast.inDriverMoving,
        location: cast.deliverPlace,
        type: 'inDriver'
      });
    }

    // 予約1〜5
    const nextFields = [
      { field: cast.next1, type: 'next1' as const },
      { field: cast.next2, type: 'next2' as const },
      { field: cast.next3, type: 'next3' as const },
      { field: cast.next4, type: 'next4' as const },
      { field: cast.next5, type: 'next5' as const },
    ];

    nextFields.forEach(({ field, type }) => {
      if (field) {
        const parts = field.split(' ');
        if (parts.length >= 2) {
          reservations.push({
            id: `${cast.id}-${type}`,
            time: parts[0],
            location: parts.slice(1).join(' '),
            type
          });
        }
      }
    });

    return reservations;
  };

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
            <h1 className="text-lg font-bold mr-2">RT Ⅱ パネル</h1>

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
                {formatDateDisplay(currentDate)}
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

            {/* 現在時刻 */}
            <div className="text-sm font-mono bg-blue-500 text-white px-3 py-1 ml-4">
              {currentTime ? formatTime(currentTime) : '--:--:--'}
            </div>
          </div>
        </div>
      </div>

      {/* メインコンテンツ */}
      <div className="flex-1 flex overflow-hidden">
        {/* 左側パネル - キャスト情報 */}
        <div className="flex-shrink-0 flex flex-col bg-blue-50 border-r border-blue-200">
          {/* ヘッダー行 */}
          <div className="h-[30px] border-b border-blue-200 flex-shrink-0 flex">
            <div className="w-[30px] border-r border-blue-200 flex items-center justify-center text-xs font-bold text-gray-700">

            </div>
            <div className="w-[45px] border-r border-blue-200 flex items-center justify-center text-xs font-bold text-gray-700">
              出勤
            </div>
            <div className="w-[80px] border-r border-blue-200 flex items-center justify-center text-xs font-bold text-gray-700">
              名前
            </div>
            <div className="w-[30px] border-r border-blue-200 flex items-center justify-center text-xs font-bold text-gray-700">
              ￥
            </div>
            <div className="w-[30px] border-r border-blue-200 flex items-center justify-center text-xs font-bold text-gray-700">
              H
            </div>
            <div className="w-[50px] border-r border-blue-200 flex items-center justify-center text-xs font-bold text-gray-700">
              併用
            </div>
            <div className="w-[70px] border-r border-blue-200 flex items-center justify-center text-xs font-bold text-gray-700">
              迎場所
            </div>
            <div className="w-[45px] border-r border-blue-200 flex items-center justify-center text-xs font-bold text-gray-700">
              受付
            </div>
            <div className="w-[45px] border-r border-blue-200 flex items-center justify-center text-xs font-bold text-gray-700">
              終了
            </div>
            <div className="w-[45px] border-r border-blue-200 flex items-center justify-center text-xs font-bold text-gray-700">
              帰宅
            </div>
            <div className="w-[70px] border-r border-blue-200 flex items-center justify-center text-xs font-bold text-gray-700">
              送場所
            </div>
            <div className="w-[35px] border-r border-blue-200 flex items-center justify-center text-xs font-bold text-gray-700">
              実績
            </div>
            <div className="w-[70px] border-r border-blue-200 flex items-center justify-center text-xs font-bold text-gray-700">
              出勤値客
            </div>
            <div className="w-[80px] border-r border-blue-200 flex items-center justify-center text-xs font-bold text-gray-700">
              特記事項
            </div>
            <div className="w-[80px] border-r border-blue-200 flex items-center justify-center text-xs font-bold text-gray-700">
              NG場所
            </div>
            <div className="w-[50px] border-r border-blue-200 flex items-center justify-center text-xs font-bold text-gray-700">
              待ち
            </div>
            <div className="w-[60px] border-r border-blue-200 flex items-center justify-center text-xs font-bold text-gray-700">
              web
            </div>
            <div className="w-[45px] border-r border-blue-200 flex items-center justify-center text-xs font-bold text-gray-700">
              mode
            </div>
            <div className="w-[35px] flex items-center justify-center text-xs font-bold text-gray-700">
              順位
            </div>
          </div>

          {/* キャストリスト */}
          <div
            ref={leftPanelRef}
            className="flex-1 overflow-y-auto overflow-x-hidden [&::-webkit-scrollbar]:hidden"
            onScroll={handleLeftPanelScroll}
            style={{ scrollbarWidth: 'none' }}
          >
            {sampleCastData.map((cast) => (
              <div
                key={cast.id}
                className="border-b border-blue-200 flex"
                style={{
                  height: `${ROW_HEIGHT}px`,
                  backgroundColor: getRemarkColor(cast.remark)
                }}
              >
                {/* チェックボックス */}
                <div className="w-[30px] border-r border-blue-200 flex items-center justify-center">
                  <input
                    type="checkbox"
                    className="w-3 h-3 accent-red-600 cursor-pointer"
                  />
                </div>
                {/* 出勤 */}
                <div className="w-[45px] border-r border-blue-200 flex items-center justify-center">
                  <span className="text-[10px] text-black">出勤</span>
                </div>
                {/* 名前 */}
                <div className="w-[80px] border-r border-blue-200 flex items-center px-1">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-0.5">
                      <span className="text-xs font-bold truncate">{cast.name}</span>
                      <ChevronDown className="w-3 h-3 text-gray-500 flex-shrink-0" />
                    </div>
                    <div className="flex items-center gap-1 text-[10px]">
                      <span className="text-black">{cast.remark}</span>
                      {cast.achieve && (
                        <span className="text-red-600">{cast.achieve}</span>
                      )}
                    </div>
                  </div>
                </div>
                {/* ￥ボタン */}
                <div className="w-[30px] border-r border-blue-200 flex items-center justify-center bg-blue-600">
                  <button className="w-full h-full bg-transparent hover:bg-blue-700 text-white text-xs border-0 flex items-center justify-center rounded-none">
                    ￥
                  </button>
                </div>
                {/* Hボタン */}
                <div className="w-[30px] border-r border-blue-200 flex items-center justify-center bg-pink-200">
                  <button className="w-full h-full bg-transparent hover:bg-pink-300 text-black text-xs border-0 flex items-center justify-center rounded-none font-bold">
                    H
                  </button>
                </div>
                {/* 併用 */}
                <div className="w-[50px] border-r border-blue-200 flex items-center justify-center">
                  <span className="text-[10px] text-black truncate">{cast.concurrent || ''}</span>
                </div>
                {/* 迎場所 */}
                <div className="w-[70px] border-r border-blue-200 flex items-center justify-center">
                  <span className="text-[10px] text-black truncate">{cast.deliverPlace}</span>
                </div>
                {/* 受付 */}
                <div className="w-[45px] border-r border-blue-200 flex items-center justify-center">
                  <span className="text-xs text-black">{cast.startTime}</span>
                </div>
                {/* 終了 */}
                <div className="w-[45px] border-r border-blue-200 flex items-center justify-center">
                  <span className="text-xs text-black">{cast.endTime}</span>
                </div>
                {/* 帰宅 */}
                <div className="w-[45px] border-r border-blue-200 flex items-center justify-center">
                  <span className="text-xs text-black">{cast.homeTime}</span>
                </div>
                {/* 送場所 */}
                <div className="w-[70px] border-r border-blue-200 flex items-center justify-center">
                  <span className="text-[10px] text-black truncate">{cast.deliverPlace}</span>
                </div>
                {/* 実績 */}
                <div className="w-[35px] border-r border-blue-200 flex items-center justify-center">
                  <span className="text-xs text-black">{cast.deliverCount || ''}</span>
                </div>
                {/* 出勤値客 */}
                <div className="w-[70px] border-r border-blue-200 flex items-center justify-center">
                  <span className="text-[10px] text-black truncate">{cast.special}</span>
                </div>
                {/* 特記事項 */}
                <div className="w-[80px] border-r border-blue-200 flex items-center justify-center">
                  <span className="text-[10px] text-black truncate">{cast.remark}</span>
                </div>
                {/* NG場所 */}
                <div className="w-[80px] border-r border-blue-200 flex items-center justify-center">
                  <span className="text-[10px] text-red-600 truncate">{cast.ngPlace}</span>
                </div>
                {/* 待ち時間 */}
                <div className="w-[50px] border-r border-blue-200 flex items-center justify-center">
                  <span className="text-[10px] text-black">{cast.waitTime}</span>
                </div>
                {/* web状態 */}
                <div className="w-[60px] border-r border-blue-200 flex items-center justify-center">
                  <span className={`text-[10px] ${cast.webStatus === "オンライン" ? "text-green-600" : "text-red-600"}`}>
                    {cast.webStatus}
                  </span>
                </div>
                {/* mode */}
                <div className="w-[45px] border-r border-blue-200 flex items-center justify-center">
                  <span className={`text-[10px] ${cast.mode === "自動" ? "text-blue-600" : "text-orange-600"}`}>
                    {cast.mode}
                  </span>
                </div>
                {/* 順位 */}
                <div className="w-[35px] flex items-center justify-center">
                  <span className="text-xs font-bold text-black">{cast.ranking}</span>
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
              {sampleCastData.map((cast, index) => {
                const reservations = getReservations(cast);

                return (
                  <div
                    key={cast.id}
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
                    {cast.startTime && cast.endTime && (
                      <div
                        className="absolute top-0 bottom-0"
                        style={{
                          left: `${timeToPosition(cast.startTime)}px`,
                          width: `${timeToPosition(cast.endTime) - timeToPosition(cast.startTime)}px`,
                          backgroundColor: 'rgba(59, 130, 246, 0.1)'
                        }}
                      />
                    )}

                    {/* 予約バー */}
                    {reservations.map((reservation) => {
                      const barLeft = timeToPosition(reservation.time);
                      const barWidth = 120; // 固定幅

                      return (
                        <div
                          key={reservation.id}
                          className="group absolute top-[6px] bottom-[6px] cursor-pointer"
                          style={{
                            left: `${barLeft}px`,
                            width: `${barWidth}px`,
                            zIndex: 1
                          }}
                        >
                          {/* ツールチップ */}
                          <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-2 bg-gray-800 text-white text-xs rounded shadow-lg whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50">
                            <div className="font-medium mb-1">{getReservationLabel(reservation.type)}</div>
                            <div>{reservation.time} - {reservation.location}</div>
                            <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-gray-800" />
                          </div>

                          {/* バー本体 */}
                          <div
                            className="absolute inset-0 rounded-full flex items-center px-2 shadow-sm overflow-hidden hover:ring-2 hover:ring-offset-1 hover:ring-blue-400"
                            style={{
                              background: getReservationColor(reservation.type)
                            }}
                          >
                            {/* 時間表示 */}
                            <div className="flex flex-col justify-center mr-1 text-[10px] leading-tight flex-shrink-0 font-medium">
                              <span className="text-white">{reservation.time}</span>
                            </div>

                            {/* 場所 */}
                            <div className="flex-1 min-w-0 overflow-hidden">
                              <div className="text-[10px] font-medium truncate leading-tight text-white">
                                {reservation.location}
                              </div>
                            </div>

                            {/* ラベル */}
                            <div className="text-[9px] ml-1 flex-shrink-0 text-white/80 whitespace-nowrap">
                              {getReservationLabel(reservation.type)}
                            </div>

                            {/* 矢印ボタン */}
                            <div className="w-4 h-4 rounded-full flex items-center justify-center flex-shrink-0 ml-1 bg-white/30 hover:bg-white/50">
                              <ChevronLeft className="w-3 h-3 text-white" strokeWidth={3} />
                            </div>
                          </div>
                        </div>
                      );
                    })}

                    {/* 待機中表示（予約がない場合） */}
                    {reservations.length === 0 && (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <span className="text-xs text-gray-400">待機中</span>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
