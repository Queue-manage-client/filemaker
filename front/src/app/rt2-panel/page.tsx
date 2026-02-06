'use client';

import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import Link from 'next/link';
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Input } from "@/components/ui/input";
import { ArrowLeft, ChevronLeft, ChevronRight, ChevronDown, ArrowUpDown, Check, Star, X } from "lucide-react";
import type { TodayCastData } from '@/types';
import { sampleCastData } from '@/data/castSampleData';

// 時間軸の範囲（17:00〜翌7:00 = 14時間）
const TIME_START_HOUR = 17;
const TIME_END_HOUR = 31; // 翌日7時 = 24 + 7
const HOUR_WIDTH = 100;
const ROW_HEIGHT = 40;
const ROW_GAP = 6; // 行間のギャップ

type SortKey = 'endTime' | 'category' | 'ranking' | 'startTime' | 'name';
type SortOrder = 'asc' | 'desc';

// 予約データの型定義
interface ReservationData {
  id: string;
  time: string;
  location: string;
  type: 'final' | 'current' | 'inDriver' | 'next1' | 'next2' | 'next3' | 'next4' | 'next5';
}

// 時間を分に変換（深夜帯対応）
const timeToMinutes = (time: string): number => {
  if (!time) return 0;
  const [hours, minutes] = time.split(':').map(Number);
  // 17時より前の場合は翌日として扱う
  if (hours < TIME_START_HOUR) {
    return (hours + 24) * 60 + (minutes || 0);
  }
  return hours * 60 + (minutes || 0);
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
const getRemarkColor = (remark: string, storeColor?: string): string => {
  if (storeColor) return storeColor;
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

export default function RT2Panel() {
  const [currentTime, setCurrentTime] = useState<Date | null>(null);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [sortKey, setSortKey] = useState<SortKey>('endTime');
  const [sortOrder, setSortOrder] = useState<SortOrder>('asc');

  // フィルター状態
  const [filterManager, setFilterManager] = useState<string>('all');
  const [filterWorkStyle, setFilterWorkStyle] = useState<string>('all');
  const [filterStore, setFilterStore] = useState<string>('all');

  // 料金計算ポップオーバー状態
  const [pricePopoverCastId, setPricePopoverCastId] = useState<string | null>(null);
  const [pricePopoverPosition, setPricePopoverPosition] = useState<{ top: number; left: number } | null>(null);
  const [nominationType, setNominationType] = useState<'free' | 'panel' | 'honshimei'>('free');
  const [transportFee, setTransportFee] = useState<number>(2000);
  const [locationType, setLocationType] = useState<'love_hotel' | 'city_hotel' | 'home'>('love_hotel');
  const [discountType, setDiscountType] = useState<'none' | '1000off' | '2000off' | '10percent'>('none');

  // 選択されたキャストを取得
  const selectedCastForPrice = useMemo(() => {
    if (!pricePopoverCastId) return null;
    return sampleCastData.find(cast => cast.id === pricePopoverCastId) || null;
  }, [pricePopoverCastId]);

  // 料金計算
  const calculateTotal = useMemo(() => {
    // ベース料金（例: 60分コース）
    const baseFee = 15000;

    // 指名料金
    const nominationFee = nominationType === 'free' ? 0 : nominationType === 'panel' ? 1000 : 2000;

    // 場所料金
    const locationFee = locationType === 'love_hotel' ? 0 : locationType === 'city_hotel' ? 1000 : 0;

    // 小計
    let subtotal = baseFee + nominationFee + transportFee + locationFee;

    // 割引計算
    let discount = 0;
    if (discountType === '1000off') discount = 1000;
    else if (discountType === '2000off') discount = 2000;
    else if (discountType === '10percent') discount = Math.floor(subtotal * 0.1);

    return {
      baseFee,
      nominationFee,
      transportFee,
      locationFee,
      discount,
      total: subtotal - discount
    };
  }, [nominationType, transportFee, locationType, discountType]);

  // ポップオーバーを開く時に状態をリセット
  const openPricePopover = useCallback((castId: string) => {
    // ボタンの位置を取得
    const button = document.querySelector(`[data-price-button="${castId}"]`);
    if (button) {
      const rect = button.getBoundingClientRect();
      setPricePopoverPosition({
        top: rect.top,
        left: rect.right + 8
      });
    }
    setNominationType('free');
    setTransportFee(2000);
    setLocationType('love_hotel');
    setDiscountType('none');
    setPricePopoverCastId(castId);
  }, []);

  // ポップオーバーを閉じる
  const closePricePopover = useCallback(() => {
    setPricePopoverCastId(null);
    setPricePopoverPosition(null);
  }, []);

  // フィルターオプションを動的に生成
  const filterOptions = useMemo(() => {
    const managers = new Set<string>();
    const workStyles = new Set<string>();
    const stores = new Set<string>();

    sampleCastData.forEach(cast => {
      if (cast.manager) managers.add(cast.manager);
      if (cast.workStyle) workStyles.add(cast.workStyle);
      if (cast.store) stores.add(cast.store);
    });

    return {
      managers: Array.from(managers),
      workStyles: Array.from(workStyles),
      stores: Array.from(stores),
    };
  }, []);

  useEffect(() => {
    document.title = 'RT Ⅱ パネル - Dispatch Harmony Hub';
    setCurrentTime(new Date());
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // カテゴリーの優先順位
  const categoryOrder: Record<string, number> = {
    'VIP': 1,
    'SUP': 2,
    'Lady': 3,
    'Girls': 4,
    '新人': 5,
  };

  // フィルターとソートを適用したデータ
  const sortedData = useMemo(() => {
    let filteredData = [...sampleCastData];

    if (filterManager !== 'all') {
      filteredData = filteredData.filter(cast => cast.manager === filterManager);
    }
    if (filterWorkStyle !== 'all') {
      filteredData = filteredData.filter(cast => cast.workStyle === filterWorkStyle);
    }
    if (filterStore !== 'all') {
      filteredData = filteredData.filter(cast => cast.store === filterStore);
    }

    return filteredData.sort((a, b) => {
      let comparison = 0;

      switch (sortKey) {
        case 'endTime':
          comparison = timeToMinutes(a.endTime) - timeToMinutes(b.endTime);
          break;
        case 'startTime':
          comparison = timeToMinutes(a.startTime) - timeToMinutes(b.startTime);
          break;
        case 'category':
          const catA = categoryOrder[a.remark] || 99;
          const catB = categoryOrder[b.remark] || 99;
          comparison = catA - catB;
          break;
        case 'ranking':
          comparison = parseInt(a.ranking || '999') - parseInt(b.ranking || '999');
          break;
        case 'name':
          comparison = a.name.localeCompare(b.name, 'ja');
          break;
        default:
          comparison = 0;
      }

      return sortOrder === 'asc' ? comparison : -comparison;
    });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sortKey, sortOrder, filterManager, filterWorkStyle, filterStore]);

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
  const getReservations = (cast: TodayCastData): ReservationData[] => {
    const reservations: ReservationData[] = [];

    // 最終接客（その日最後の予定）
    if (cast.finalCustomer && (cast.finalCustomerTime || cast.homeTime)) {
      reservations.push({
        id: `${cast.id}-final`,
        time: cast.finalCustomerTime || cast.homeTime,
        location: cast.finalCustomer,
        type: 'final'
      });
    }

    // 接客中（今対応中の予約）
    if (cast.nowCustomer && cast.nowCustomerTime) {
      reservations.push({
        id: `${cast.id}-current`,
        time: cast.nowCustomerTime,
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
              className="h-8 px-3 text-xs flex items-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              戻る
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
            <div className="text-sm font-mono bg-blue-500 text-white px-3 py-1 ml-2">
              {currentTime ? formatTime(currentTime) : '--:--:--'}
            </div>

            {/* ナビゲーションボタン */}
            <Link href="/customer-ledger">
              <Button variant="outline" className="h-8 px-3 text-xs border-black">
                新顧客検索
              </Button>
            </Link>
            <Link href="/dispatch-panel-2d">
              <Button className="h-8 px-3 text-xs bg-amber-200 hover:bg-amber-300 text-black border border-black">
                配車パネル
              </Button>
            </Link>
            <Link href="/tehai">
              <Button className="h-8 px-3 text-xs bg-purple-400 hover:bg-purple-500 text-black border border-black">
                手配表
              </Button>
            </Link>

            {/* ソート */}
            <div className="flex items-center gap-1 ml-2">
              <Select value={sortKey} onValueChange={(v) => setSortKey(v as SortKey)}>
                <SelectTrigger className="h-8 w-[100px] text-xs">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="endTime">終了時間</SelectItem>
                  <SelectItem value="startTime">出勤時間</SelectItem>
                  <SelectItem value="category">カテゴリー</SelectItem>
                  <SelectItem value="ranking">順位</SelectItem>
                  <SelectItem value="name">名前</SelectItem>
                </SelectContent>
              </Select>
              <Button
                variant="outline"
                size="sm"
                className="h-8 px-2"
                onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
              >
                <ArrowUpDown className="w-3 h-3" />
                <span className="ml-1 text-xs">{sortOrder === 'asc' ? '▲' : '▼'}</span>
              </Button>
            </div>

            {/* フィルター */}
            <div className="flex items-center gap-1 ml-2">
              <Select value={filterManager} onValueChange={setFilterManager}>
                <SelectTrigger className="h-8 w-[80px] text-xs">
                  <SelectValue placeholder="担当" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">全担当</SelectItem>
                  {filterOptions.managers.map(m => (
                    <SelectItem key={m} value={m}>{m}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={filterStore} onValueChange={setFilterStore}>
                <SelectTrigger className="h-8 w-[90px] text-xs">
                  <SelectValue placeholder="店舗" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">全店舗</SelectItem>
                  {filterOptions.stores.map(s => (
                    <SelectItem key={s} value={s}>{s}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
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
            <div className="w-[25px] border-r border-blue-200 flex items-center justify-center text-[10px] font-bold text-gray-700"></div>
            <div className="w-[30px] border-r border-blue-200 flex items-center justify-center text-[10px] font-bold text-gray-700">確認</div>
            <div className="w-[40px] border-r border-blue-200 flex items-center justify-center text-[10px] font-bold text-gray-700">出勤</div>
            <div className="w-[80px] border-r border-blue-200 flex items-center justify-center text-[10px] font-bold text-gray-700">名前</div>
            <div className="w-[25px] border-r border-blue-200 flex items-center justify-center text-[10px] font-bold text-gray-700">￥</div>
            <div className="w-[25px] border-r border-blue-200 flex items-center justify-center text-[10px] font-bold text-gray-700">H</div>
            <div className="w-[45px] border-r border-blue-200 flex items-center justify-center text-[10px] font-bold text-gray-700">併用</div>
            <div className="w-[60px] border-r border-blue-200 flex items-center justify-center text-[10px] font-bold text-gray-700">迎場所</div>
            <div className="w-[40px] border-r border-blue-200 flex items-center justify-center text-[10px] font-bold text-gray-700">受付</div>
            <div className="w-[40px] border-r border-blue-200 flex items-center justify-center text-[10px] font-bold text-gray-700">終了</div>
            <div className="w-[40px] border-r border-blue-200 flex items-center justify-center text-[10px] font-bold text-gray-700">帰宅</div>
            <div className="w-[60px] border-r border-blue-200 flex items-center justify-center text-[10px] font-bold text-gray-700">送場所</div>
            <div className="w-[30px] border-r border-blue-200 flex items-center justify-center text-[10px] font-bold text-gray-700">実績</div>
            <div className="w-[60px] flex items-center justify-center text-[10px] font-bold text-gray-700">出勤値客</div>
          </div>

          {/* キャストリスト */}
          <div
            ref={leftPanelRef}
            className="flex-1 overflow-y-auto overflow-x-hidden [&::-webkit-scrollbar]:hidden bg-slate-400"
            onScroll={handleLeftPanelScroll}
            style={{ scrollbarWidth: 'none', padding: '2px 0' }}
          >
            {sortedData.map((cast) => (
              <div
                key={cast.id}
                className="border border-blue-200 flex cursor-pointer hover:opacity-80"
                style={{
                  height: `${ROW_HEIGHT}px`,
                  marginBottom: `${ROW_GAP}px`,
                  backgroundColor: getRemarkColor(cast.remark, cast.storeColor)
                }}
              >
                {/* チェックボックス */}
                <div className="w-[25px] border-r border-blue-200 flex items-center justify-center" onClick={(e) => e.stopPropagation()}>
                  <input type="checkbox" className="w-3 h-3 accent-red-600 cursor-pointer" />
                </div>
                {/* 出勤確認 */}
                <div className={`w-[30px] border-r border-blue-200 flex items-center justify-center ${cast.isAttendanceConfirmed ? 'bg-green-100' : 'bg-red-100'}`}>
                  {cast.isAttendanceConfirmed ? (
                    <Check className="w-3 h-3 text-green-600" />
                  ) : (
                    <span className="text-red-600 text-[9px]">未</span>
                  )}
                </div>
                {/* 出勤 */}
                <div className="w-[40px] border-r border-blue-200 flex items-center justify-center">
                  <span className="text-[9px] text-black">出勤</span>
                </div>
                {/* 名前 */}
                <div className="w-[80px] border-r border-blue-200 flex items-center px-1">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-0.5">
                      {cast.isNewbie && <Star className="w-3 h-3 text-yellow-500 fill-yellow-500 flex-shrink-0" />}
                      <span className="text-xs font-bold truncate">{cast.name}</span>
                      <ChevronDown className="w-3 h-3 text-gray-500 flex-shrink-0" />
                    </div>
                    <div className="flex items-center gap-1 text-[9px]">
                      <span className="text-black">{cast.remark}</span>
                      {cast.achieve && <span className="text-red-600">{cast.achieve}</span>}
                    </div>
                  </div>
                </div>
                {/* ￥ボタン */}
                <div className="w-[25px] border-r border-blue-200 flex items-center justify-center p-0.5" onClick={(e) => e.stopPropagation()}>
                  <button
                    data-price-button={cast.id}
                    onClick={() => openPricePopover(cast.id)}
                    className="w-full h-full rounded text-white text-[10px] font-bold flex items-center justify-center shadow-[inset_0_1px_0_rgba(255,255,255,0.3),inset_0_-2px_0_rgba(0,0,0,0.2),0_2px_3px_rgba(0,0,0,0.3)] active:shadow-[inset_0_2px_3px_rgba(0,0,0,0.3)] active:translate-y-[1px]"
                    style={{ background: 'linear-gradient(180deg, #3b82f6 0%, #2563eb 50%, #1d4ed8 100%)' }}
                  >
                    ￥
                  </button>
                </div>
                {/* Hボタン */}
                <div className="w-[25px] border-r border-blue-200 flex items-center justify-center p-0.5" onClick={(e) => e.stopPropagation()}>
                  <button className="w-full h-full rounded text-black text-[10px] font-bold flex items-center justify-center shadow-[inset_0_1px_0_rgba(255,255,255,0.5),inset_0_-2px_0_rgba(0,0,0,0.15),0_2px_3px_rgba(0,0,0,0.2)] active:shadow-[inset_0_2px_3px_rgba(0,0,0,0.2)] active:translate-y-[1px]" style={{ background: 'linear-gradient(180deg, #fbcfe8 0%, #f9a8d4 50%, #f472b6 100%)' }}>H</button>
                </div>
                {/* 併用 */}
                <div className="w-[45px] border-r border-blue-200 flex items-center justify-center">
                  <span className="text-[9px] text-black truncate">{cast.concurrent || ''}</span>
                </div>
                {/* 迎場所 */}
                <div className="w-[60px] border-r border-blue-200 flex items-center justify-center">
                  <span className="text-[9px] text-black truncate">{cast.deliverPlace}</span>
                </div>
                {/* 受付 */}
                <div className="w-[40px] border-r border-blue-200 flex items-center justify-center">
                  <span className="text-[11px] text-gray-900 font-bold">{cast.startTime}</span>
                </div>
                {/* 終了 */}
                <div className="w-[40px] border-r border-blue-200 flex items-center justify-center">
                  <span className="text-[11px] text-gray-900 font-bold">{cast.endTime}</span>
                </div>
                {/* 帰宅 */}
                <div className="w-[40px] border-r border-blue-200 flex items-center justify-center">
                  <span className="text-[11px] text-gray-900 font-bold">{cast.homeTime}</span>
                </div>
                {/* 送場所 */}
                <div className="w-[60px] border-r border-blue-200 flex items-center justify-center">
                  <span className="text-[9px] text-black truncate">{cast.deliverPlace}</span>
                </div>
                {/* 実績 */}
                <div className="w-[30px] border-r border-blue-200 flex items-center justify-center">
                  <span className="text-[10px] text-black">{cast.deliverCount || ''}</span>
                </div>
                {/* 出勤値客 */}
                <div className="w-[60px] flex items-center justify-center">
                  <span className="text-[9px] text-black truncate">{cast.special}</span>
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
              style={{ width: `${(TIME_END_HOUR - TIME_START_HOUR + 1) * HOUR_WIDTH + 310}px` }}
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
              {/* 追加カラム - 右にスクロールして表示（左パネルと同じデザイン） */}
              <div className="w-[60px] flex-shrink-0 border-l border-r border-blue-200 flex items-center justify-center text-[10px] font-bold text-gray-700 bg-blue-50">特記</div>
              <div className="w-[60px] flex-shrink-0 border-r border-blue-200 flex items-center justify-center text-[10px] font-bold text-gray-700 bg-blue-50">NG場所</div>
              <div className="w-[40px] flex-shrink-0 border-r border-blue-200 flex items-center justify-center text-[10px] font-bold text-gray-700 bg-blue-50">待ち</div>
              <div className="w-[60px] flex-shrink-0 border-r border-blue-200 flex items-center justify-center text-[10px] font-bold text-gray-700 bg-blue-50">web</div>
              <div className="w-[50px] flex-shrink-0 border-r border-blue-200 flex items-center justify-center text-[10px] font-bold text-gray-700 bg-blue-50">mode</div>
              <div className="w-[40px] flex-shrink-0 border-r border-blue-200 flex items-center justify-center text-[10px] font-bold text-gray-700 bg-blue-50">順位</div>
            </div>
          </div>

          {/* タイムラインボディ */}
          <div
            ref={timelineBodyRef}
            className="flex-1 overflow-auto"
            onScroll={handleTimelineScroll}
          >
            <div
              className="flex"
              style={{
                width: `${(TIME_END_HOUR - TIME_START_HOUR + 1) * HOUR_WIDTH + 310}px`,
                minHeight: '100%'
              }}
            >
              {/* タイムライン部分 */}
              <div
                className="flex-shrink-0 bg-slate-400"
                style={{
                  width: `${(TIME_END_HOUR - TIME_START_HOUR + 1) * HOUR_WIDTH}px`,
                  padding: '2px 0'
                }}
              >
                {sortedData.map((cast, index) => {
                  const reservations = getReservations(cast);

                  return (
                    <div
                      key={cast.id}
                      className="relative border border-gray-200"
                      style={{
                        height: `${ROW_HEIGHT}px`,
                        marginBottom: `${ROW_GAP}px`,
                        backgroundColor: index % 2 === 0 ? '#f8fafc' : '#ffffff'
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
                        const barWidth = 120;

                        return (
                          <div
                            key={reservation.id}
                            className="group absolute cursor-pointer"
                            style={{
                              left: `${barLeft}px`,
                              width: `${barWidth}px`,
                              top: '6px',
                              bottom: '6px',
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

              {/* 右側カラム群（左パネルと同じデザイン - ボーダーが縦に突っ切る） */}
              <div className="flex flex-shrink-0 bg-slate-400" style={{ padding: '2px 0' }}>
                {/* 特記 */}
                <div className="w-[60px] border-l border-blue-200 bg-slate-400">
                  {sortedData.map((cast) => (
                    <div
                      key={`special-${cast.id}`}
                      className="border-t border-b border-r border-blue-200 flex items-center justify-center"
                      style={{
                        height: `${ROW_HEIGHT}px`,
                        marginBottom: `${ROW_GAP}px`,
                        backgroundColor: getRemarkColor(cast.remark, cast.storeColor)
                      }}
                    >
                      <span className="text-[9px] text-black truncate px-1">{cast.special || ''}</span>
                    </div>
                  ))}
                </div>
                {/* NG場所 */}
                <div className="w-[60px] border-l border-blue-200 bg-slate-400">
                  {sortedData.map((cast) => (
                    <div
                      key={`ng-${cast.id}`}
                      className="border-t border-b border-r border-blue-200 flex items-center justify-center"
                      style={{
                        height: `${ROW_HEIGHT}px`,
                        marginBottom: `${ROW_GAP}px`,
                        backgroundColor: getRemarkColor(cast.remark, cast.storeColor)
                      }}
                    >
                      <span className="text-[9px] text-red-600 truncate px-1">{cast.ngPlace || ''}</span>
                    </div>
                  ))}
                </div>
                {/* 待ち */}
                <div className="w-[40px] border-l border-blue-200 bg-slate-400">
                  {sortedData.map((cast) => (
                    <div
                      key={`wait-${cast.id}`}
                      className="border-t border-b border-r border-blue-200 flex items-center justify-center"
                      style={{
                        height: `${ROW_HEIGHT}px`,
                        marginBottom: `${ROW_GAP}px`,
                        backgroundColor: getRemarkColor(cast.remark, cast.storeColor)
                      }}
                    >
                      <span className="text-[9px] text-black">{cast.waitTime || ''}</span>
                    </div>
                  ))}
                </div>
                {/* web */}
                <div className="w-[60px] border-l border-blue-200 bg-slate-400">
                  {sortedData.map((cast) => (
                    <div
                      key={`web-${cast.id}`}
                      className="border-t border-b border-r border-blue-200 flex items-center justify-center"
                      style={{
                        height: `${ROW_HEIGHT}px`,
                        marginBottom: `${ROW_GAP}px`,
                        backgroundColor: getRemarkColor(cast.remark, cast.storeColor)
                      }}
                    >
                      <span className={`text-[9px] ${cast.webStatus === 'オンライン' ? 'text-green-600' : 'text-red-600'}`}>{cast.webStatus || ''}</span>
                    </div>
                  ))}
                </div>
                {/* mode */}
                <div className="w-[50px] border-l border-blue-200 bg-slate-400">
                  {sortedData.map((cast) => (
                    <div
                      key={`mode-${cast.id}`}
                      className="border-t border-b border-r border-blue-200 flex items-center justify-center"
                      style={{
                        height: `${ROW_HEIGHT}px`,
                        marginBottom: `${ROW_GAP}px`,
                        backgroundColor: getRemarkColor(cast.remark, cast.storeColor)
                      }}
                    >
                      <span className={`text-[9px] ${cast.mode === '自動' ? 'text-blue-600' : 'text-orange-600'}`}>{cast.mode || ''}</span>
                    </div>
                  ))}
                </div>
                {/* 順位 */}
                <div className="w-[40px] border-l border-blue-200 bg-slate-400">
                  {sortedData.map((cast) => (
                    <div
                      key={`rank-${cast.id}`}
                      className="border-t border-b border-r border-blue-200 flex items-center justify-center"
                      style={{
                        height: `${ROW_HEIGHT}px`,
                        marginBottom: `${ROW_GAP}px`,
                        backgroundColor: getRemarkColor(cast.remark, cast.storeColor)
                      }}
                    >
                      <span className="text-[9px] text-black font-medium">{cast.ranking || ''}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 料金計算ポップオーバー（1つだけ） */}
      {pricePopoverCastId && selectedCastForPrice && pricePopoverPosition && (
        <>
          {/* オーバーレイ */}
          <div
            className="fixed inset-0 z-40"
            onClick={closePricePopover}
          />
          {/* ポップオーバー本体 */}
          <div
            className="fixed z-50 w-72 bg-white rounded-md shadow-lg border"
            style={{
              top: `${pricePopoverPosition.top}px`,
              left: `${pricePopoverPosition.left}px`
            }}
          >
            <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-3 py-2 flex items-center justify-between rounded-t-md">
              <span className="font-bold text-sm">料金計算 - {selectedCastForPrice.name}</span>
              <button onClick={closePricePopover} className="hover:bg-blue-500 rounded p-0.5">
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="p-3 space-y-3">
              {/* 指名区分 */}
              <div>
                <Label className="text-xs font-bold text-gray-700 mb-1.5 block">指名区分</Label>
                <RadioGroup value={nominationType} onValueChange={(v) => setNominationType(v as typeof nominationType)} className="flex gap-2">
                  <div className="flex items-center">
                    <RadioGroupItem value="free" id="price-free" className="w-3 h-3" />
                    <Label htmlFor="price-free" className="text-xs ml-1 cursor-pointer">フリー</Label>
                  </div>
                  <div className="flex items-center">
                    <RadioGroupItem value="panel" id="price-panel" className="w-3 h-3" />
                    <Label htmlFor="price-panel" className="text-xs ml-1 cursor-pointer">パネル</Label>
                  </div>
                  <div className="flex items-center">
                    <RadioGroupItem value="honshimei" id="price-hon" className="w-3 h-3" />
                    <Label htmlFor="price-hon" className="text-xs ml-1 cursor-pointer">本指名</Label>
                  </div>
                </RadioGroup>
              </div>

              {/* 交通費 */}
              <div>
                <Label className="text-xs font-bold text-gray-700 mb-1.5 block">交通費</Label>
                <div className="flex items-center gap-2">
                  <Input
                    type="number"
                    value={transportFee}
                    onChange={(e) => setTransportFee(Number(e.target.value))}
                    className="h-7 text-xs w-24"
                  />
                  <span className="text-xs text-gray-600">円</span>
                </div>
              </div>

              {/* 場所選択 */}
              <div>
                <Label className="text-xs font-bold text-gray-700 mb-1.5 block">場所</Label>
                <RadioGroup value={locationType} onValueChange={(v) => setLocationType(v as typeof locationType)} className="flex flex-wrap gap-2">
                  <div className="flex items-center">
                    <RadioGroupItem value="love_hotel" id="price-love" className="w-3 h-3" />
                    <Label htmlFor="price-love" className="text-xs ml-1 cursor-pointer">ラブホテル</Label>
                  </div>
                  <div className="flex items-center">
                    <RadioGroupItem value="city_hotel" id="price-city" className="w-3 h-3" />
                    <Label htmlFor="price-city" className="text-xs ml-1 cursor-pointer">シティホテル</Label>
                  </div>
                  <div className="flex items-center">
                    <RadioGroupItem value="home" id="price-home" className="w-3 h-3" />
                    <Label htmlFor="price-home" className="text-xs ml-1 cursor-pointer">自宅</Label>
                  </div>
                </RadioGroup>
              </div>

              {/* 割引 */}
              <div>
                <Label className="text-xs font-bold text-gray-700 mb-1.5 block">割引</Label>
                <Select value={discountType} onValueChange={(v) => setDiscountType(v as typeof discountType)}>
                  <SelectTrigger className="h-7 text-xs">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">割引なし</SelectItem>
                    <SelectItem value="1000off">1,000円引き</SelectItem>
                    <SelectItem value="2000off">2,000円引き</SelectItem>
                    <SelectItem value="10percent">10%OFF</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* 料金明細 */}
              <div className="border-t pt-2 mt-2 space-y-1">
                <div className="flex justify-between text-xs text-gray-600">
                  <span>基本料金</span>
                  <span>¥{calculateTotal.baseFee.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-xs text-gray-600">
                  <span>指名料</span>
                  <span>¥{calculateTotal.nominationFee.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-xs text-gray-600">
                  <span>交通費</span>
                  <span>¥{calculateTotal.transportFee.toLocaleString()}</span>
                </div>
                {calculateTotal.locationFee > 0 && (
                  <div className="flex justify-between text-xs text-gray-600">
                    <span>場所料金</span>
                    <span>¥{calculateTotal.locationFee.toLocaleString()}</span>
                  </div>
                )}
                {calculateTotal.discount > 0 && (
                  <div className="flex justify-between text-xs text-red-600">
                    <span>割引</span>
                    <span>-¥{calculateTotal.discount.toLocaleString()}</span>
                  </div>
                )}
                <div className="flex justify-between text-sm font-bold border-t pt-1 mt-1">
                  <span>総額</span>
                  <span className="text-blue-600">¥{calculateTotal.total.toLocaleString()}</span>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
