'use client';

import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import Link from 'next/link';
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Input } from "@/components/ui/input";
import { ArrowLeft, ChevronLeft, ChevronRight, ChevronDown, ArrowUpDown, Check, Star, X, Package, Sparkles, UserPlus, AlertTriangle, History, UserCheck } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
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
  customerName?: string; // 顧客名（未登録の場合はundefined）
  guideType?: 'width' | 'specified'; // 案内タイプ: 幅 or 指定
}

// サンプル顧客名リスト
const sampleCustomerNames = [
  '山田様', '田中様', '佐藤様', '鈴木様', '高橋様',
  '渡辺様', '伊藤様', '中村様', '小林様', '加藤様',
  null, null, null, // 一部は未登録
];

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

// 新人日数を計算（newbieStartDate から今日まで）
const calcNewbieDays = (startDate: string): number => {
  const start = new Date(startDate);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  start.setHours(0, 0, 0, 0);
  const diff = Math.floor((today.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
  return diff + 1; // 初日を1日目とする
};

// 2つの時刻の差を分で計算（深夜帯対応）
const calcMinutes = (start: string, end: string): number => {
  const s = timeToMinutes(start);
  const e = timeToMinutes(end);
  return Math.max(0, e - s);
};

export default function RT2Panel() {
  const [currentTime, setCurrentTime] = useState<Date | null>(null);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [sortKey, setSortKey] = useState<SortKey>('endTime');
  const [sortOrder, setSortOrder] = useState<SortOrder>('asc');

  // 選択された予約（A12: ポップアップ用）
  const [selectedReservation, setSelectedReservation] = useState<{ castId: string; reservationId: string } | null>(null);

  // フィルター状態
  const [filterManager, setFilterManager] = useState<string>('all');
  const [filterWorkStyle, _setFilterWorkStyle] = useState<string>('all');
  const [filterStore, setFilterStore] = useState<string>('all');
  const [filterNewbie, setFilterNewbie] = useState<boolean>(false); // 新人フィルター

  // 料金計算ポップオーバー状態
  const [pricePopoverCastId, setPricePopoverCastId] = useState<string | null>(null);
  const [pricePopoverPosition, setPricePopoverPosition] = useState<{ top: number; left: number } | null>(null);
  const [nominationType, setNominationType] = useState<'free' | 'panel' | 'honshimei'>('free');
  const [transportFeeInput, setTransportFeeInput] = useState<string>('2');  // 1000円単位（表示値）
  const [specialNominationFee, setSpecialNominationFee] = useState<string>(''); // 特別指名料
  const [otherFees, setOtherFees] = useState<{ label: string; amount: string }[]>([]); // その他費用
  const [discounts, setDiscounts] = useState<{ type: string; amount: string }[]>([{ type: 'none', amount: '' }]); // 動的割引

  // 本指名確認ダイアログ用の状態
  const [showHonshimeiConfirm, setShowHonshimeiConfirm] = useState(false);
  const [pendingHonshimei, setPendingHonshimei] = useState(false);
  const [customerNameInput, setCustomerNameInput] = useState('');
  const [honshimeiValidationError, setHonshimeiValidationError] = useState<string | null>(null);

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

    // 交通費（1000円単位）
    const transportFee = (parseInt(transportFeeInput) || 0) * 1000;

    // 特別指名料
    const specialNomination = parseInt(specialNominationFee) || 0;

    // その他費用合計
    const otherFeesTotal = otherFees.reduce((sum, fee) => sum + (parseInt(fee.amount) || 0), 0);

    // 小計
    const subtotal = baseFee + nominationFee + transportFee + specialNomination + otherFeesTotal;

    // 割引計算（複数の割引を合計）
    let totalDiscount = 0;
    discounts.forEach(d => {
      if (d.type === '1000off') totalDiscount += 1000;
      else if (d.type === '2000off') totalDiscount += 2000;
      else if (d.type === '3000off') totalDiscount += 3000;
      else if (d.type === '5000off') totalDiscount += 5000;
      else if (d.type === '10percent') totalDiscount += Math.floor(subtotal * 0.1);
      else if (d.type === 'custom' && d.amount) totalDiscount += parseInt(d.amount) || 0;
    });

    return {
      baseFee,
      nominationFee,
      transportFee,
      specialNomination,
      otherFeesTotal,
      discount: totalDiscount,
      total: subtotal - totalDiscount
    };
  }, [nominationType, transportFeeInput, specialNominationFee, otherFees, discounts]);

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
    setTransportFeeInput('2');
    setSpecialNominationFee('');
    setOtherFees([]);
    setDiscounts([{ type: 'none', amount: '' }]);
    setPricePopoverCastId(castId);
  }, []);

  // ポップオーバーを閉じる
  const closePricePopover = useCallback(() => {
    setPricePopoverCastId(null);
    setPricePopoverPosition(null);
    // 本指名確認関連もリセット
    setShowHonshimeiConfirm(false);
    setPendingHonshimei(false);
    setCustomerNameInput('');
    setHonshimeiValidationError(null);
  }, []);

  // 本指名確認済みのキャスト履歴（デモ用サンプルデータ）
  const honshimeiHistoryData = useMemo(() => {
    return new Map([
      ['cast-1', ['山田様', '田中様']],
      ['cast-2', ['佐藤様', '高橋様', '渡辺様']],
      ['cast-3', ['鈴木様']],
    ]);
  }, []);

  // 指名区分変更のハンドラー（本指名の場合は確認ダイアログを表示）
  const handleNominationTypeChange = useCallback((value: 'free' | 'panel' | 'honshimei') => {
    if (value === 'honshimei') {
      // 本指名の場合は確認ダイアログを表示
      setPendingHonshimei(true);
      setShowHonshimeiConfirm(true);
      setCustomerNameInput('');
      setHonshimeiValidationError(null);
    } else {
      setNominationType(value);
    }
  }, []);

  // 本指名確認
  const confirmHonshimei = useCallback(() => {
    if (!customerNameInput.trim()) {
      setHonshimeiValidationError('顧客名を入力してください');
      return;
    }

    // 過去の指名履歴をチェック
    const castHistory = pricePopoverCastId ? honshimeiHistoryData.get(pricePopoverCastId) : [];
    const hasHistory = castHistory?.some(name =>
      name.includes(customerNameInput.trim()) || customerNameInput.trim().includes(name.replace('様', ''))
    );

    if (!hasHistory) {
      setHonshimeiValidationError(`「${customerNameInput}」様の指名履歴が見つかりません。本指名として登録するには過去の利用履歴が必要です。`);
      return;
    }

    // 確認完了
    setNominationType('honshimei');
    setShowHonshimeiConfirm(false);
    setPendingHonshimei(false);
    setCustomerNameInput('');
    setHonshimeiValidationError(null);
  }, [customerNameInput, pricePopoverCastId, honshimeiHistoryData]);

  // 本指名キャンセル
  const cancelHonshimei = useCallback(() => {
    setShowHonshimeiConfirm(false);
    setPendingHonshimei(false);
    setCustomerNameInput('');
    setHonshimeiValidationError(null);
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
    // 新人フィルター
    if (filterNewbie) {
      filteredData = filteredData.filter(cast => cast.isNewbie);
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
  }, [sortKey, sortOrder, filterManager, filterWorkStyle, filterStore, filterNewbie]);

  // 新人カウント
  const newbieCount = useMemo(() => {
    return sampleCastData.filter(cast => cast.isNewbie).length;
  }, []);

  // 新人日数による分類（1週間以内、2週間以内、1ヶ月以内）
  const getNewbieLevel = (days: number): 'new' | 'recent' | 'normal' => {
    if (days <= 7) return 'new';
    if (days <= 14) return 'recent';
    return 'normal';
  };

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

  // 顧客名をランダムに取得（デモ用）
  const getRandomCustomerName = (seed: string): string | undefined => {
    // シード値を使って一貫した顧客名を返す
    const hash = seed.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    const name = sampleCustomerNames[hash % sampleCustomerNames.length];
    return name || undefined;
  };

  // キャストの予約データを抽出
  const getReservations = (cast: TodayCastData): ReservationData[] => {
    const reservations: ReservationData[] = [];

    // 最終接客（その日最後の予定）
    if (cast.finalCustomer && (cast.finalCustomerTime || cast.homeTime)) {
      reservations.push({
        id: `${cast.id}-final`,
        time: cast.finalCustomerTime || cast.homeTime,
        location: cast.finalCustomer,
        type: 'final',
        customerName: getRandomCustomerName(`${cast.id}-final`),
        guideType: 'specified'
      });
    }

    // 接客中（今対応中の予約）
    if (cast.nowCustomer && cast.nowCustomerTime) {
      reservations.push({
        id: `${cast.id}-current`,
        time: cast.nowCustomerTime,
        location: cast.nowCustomer,
        type: 'current',
        customerName: getRandomCustomerName(`${cast.id}-current`),
        guideType: 'specified'
      });
    }

    // INドライバー稼働中
    if (cast.inDriverMoving) {
      reservations.push({
        id: `${cast.id}-inDriver`,
        time: cast.inDriverMoving,
        location: cast.deliverPlace,
        type: 'inDriver',
        customerName: getRandomCustomerName(`${cast.id}-inDriver`),
        guideType: 'width'
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
          // 末尾に "[指定]" が含まれていれば 'specified'、なければ 'width'
          const isSpecified = parts[parts.length - 1] === '[指定]';
          const location = isSpecified ? parts.slice(1, -1).join(' ') : parts.slice(1).join(' ');
          reservations.push({
            id: `${cast.id}-${type}`,
            time: parts[0],
            location,
            type,
            customerName: getRandomCustomerName(`${cast.id}-${type}`),
            guideType: isSpecified ? 'specified' : 'width'
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
            <Link href="/cast-attendance-schedule">
              <Button className="h-8 px-3 text-xs bg-pink-300 hover:bg-pink-400 text-black border border-black">
                キャスト出勤予定
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
              {/* 新人フィルターボタン */}
              <Button
                variant={filterNewbie ? "default" : "outline"}
                className={`h-8 px-3 text-xs flex items-center gap-1 ${
                  filterNewbie
                    ? 'bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white border-0'
                    : 'border-green-500 text-green-600 hover:bg-green-50'
                }`}
                onClick={() => setFilterNewbie(!filterNewbie)}
              >
                <UserPlus className="w-3.5 h-3.5" />
                新人
                <span className={`ml-1 px-1.5 py-0.5 rounded-full text-[10px] font-bold ${
                  filterNewbie ? 'bg-white/20 text-white' : 'bg-green-100 text-green-700'
                }`}>
                  {newbieCount}
                </span>
              </Button>
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
            {sortedData.map((cast) => {
              const newbieDays = cast.isNewbie && cast.newbieStartDate ? calcNewbieDays(cast.newbieStartDate) : null;
              const newbieLevel = newbieDays ? getNewbieLevel(newbieDays) : null;

              return (
              <div
                key={cast.id}
                className={`flex cursor-pointer hover:opacity-80 ${
                  newbieLevel === 'new'
                    ? 'border-2 border-green-500 shadow-[0_0_8px_rgba(34,197,94,0.5)] ring-1 ring-green-400'
                    : newbieLevel === 'recent'
                    ? 'border-2 border-green-300'
                    : 'border border-blue-200'
                }`}
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
                <div className={`w-[80px] border-r border-blue-200 flex items-center px-1 relative group cursor-pointer ${
                  cast.isNewbie && cast.newbieStartDate && getNewbieLevel(calcNewbieDays(cast.newbieStartDate)) === 'new'
                    ? 'animate-pulse'
                    : ''
                }`}>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-0.5">
                      {cast.isNewbie && cast.newbieStartDate && (
                        <div className={`flex items-center gap-0.5 px-1 py-0.5 rounded text-[8px] font-bold flex-shrink-0 ${
                          getNewbieLevel(calcNewbieDays(cast.newbieStartDate)) === 'new'
                            ? 'bg-gradient-to-r from-green-500 to-emerald-500 text-white shadow-sm'
                            : getNewbieLevel(calcNewbieDays(cast.newbieStartDate)) === 'recent'
                            ? 'bg-green-100 text-green-700 border border-green-300'
                            : 'bg-gray-100 text-green-600'
                        }`}>
                          <Sparkles className="w-2 h-2" />
                          {calcNewbieDays(cast.newbieStartDate)}日
                        </div>
                      )}
                      <span className="text-[11px] font-bold truncate">{cast.name}</span>
                      <ChevronDown className="w-2.5 h-2.5 text-gray-400 flex-shrink-0" />
                    </div>
                    <div className="flex items-center gap-0.5 text-[9px] leading-none">
                      <span className="text-gray-600">{cast.remark}</span>
                      <span className="text-pink-600">{cast.achieve}</span>
                    </div>
                  </div>
                  {/* ホバーで詳細ツールチップ表示 */}
                  <div className="hidden group-hover:block absolute left-full top-0 ml-1 z-[100] bg-white border-2 border-emerald-400 rounded shadow-2xl p-2 min-w-[200px] pointer-events-none">
                    <div className="text-[11px] font-bold mb-1">{cast.name}</div>
                    <div className="text-[10px] text-gray-600 mb-1">{cast.remark} {cast.achieve}</div>
                    <div className="text-[10px] text-gray-700 mb-1">
                      {cast.startTime}〜{cast.endTime}（幅{calcMinutes(cast.startTime, cast.endTime)}分）
                    </div>
                    {cast.isNewbie && cast.newbieStartDate && (
                      <div className={`text-[10px] px-2 py-1 rounded mb-1 whitespace-nowrap inline-flex items-center gap-1 ${
                        getNewbieLevel(calcNewbieDays(cast.newbieStartDate)) === 'new'
                          ? 'bg-gradient-to-r from-green-500 to-emerald-500 text-white'
                          : getNewbieLevel(calcNewbieDays(cast.newbieStartDate)) === 'recent'
                          ? 'bg-green-100 text-green-700 border border-green-300'
                          : 'bg-green-50 text-green-600'
                      }`}>
                        <Sparkles className="w-3 h-3" />
                        新人 {calcNewbieDays(cast.newbieStartDate)}日目
                        {getNewbieLevel(calcNewbieDays(cast.newbieStartDate)) === 'new' && (
                          <span className="ml-1 text-[8px] bg-white/20 px-1 rounded">1週間以内</span>
                        )}
                        {getNewbieLevel(calcNewbieDays(cast.newbieStartDate)) === 'recent' && (
                          <span className="ml-1 text-[8px] bg-green-200 px-1 rounded">2週間以内</span>
                        )}
                      </div>
                    )}
                    {cast.hasGuarantee && cast.guaranteeRemaining != null && cast.guaranteeRemaining > 0 && (
                      <div className="text-[10px] bg-amber-100 text-amber-700 px-1.5 py-0.5 rounded whitespace-nowrap inline-block">
                        保証 ¥{cast.guaranteeRemaining.toLocaleString()}
                      </div>
                    )}
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
            );
            })}
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
            onClick={() => setSelectedReservation(null)}
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
                  const newbieDays = cast.isNewbie && cast.newbieStartDate ? calcNewbieDays(cast.newbieStartDate) : null;
                  const newbieLevel = newbieDays ? getNewbieLevel(newbieDays) : null;

                  return (
                    <div
                      key={cast.id}
                      className={`relative ${
                        newbieLevel === 'new'
                          ? 'border-2 border-green-500 ring-1 ring-green-400'
                          : newbieLevel === 'recent'
                          ? 'border-2 border-green-300'
                          : 'border border-gray-200'
                      }`}
                      style={{
                        height: `${ROW_HEIGHT}px`,
                        marginBottom: `${ROW_GAP}px`,
                        backgroundColor: newbieLevel === 'new'
                          ? 'rgba(220, 252, 231, 0.5)'
                          : newbieLevel === 'recent'
                          ? 'rgba(220, 252, 231, 0.3)'
                          : index % 2 === 0 ? '#f8fafc' : '#ffffff'
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
                        const isSelected =
                          selectedReservation?.castId === cast.id &&
                          selectedReservation?.reservationId === reservation.id;

                        return (
                          <div
                            key={reservation.id}
                            className="group absolute cursor-pointer"
                            style={{
                              left: `${barLeft}px`,
                              width: `${barWidth}px`,
                              top: '6px',
                              bottom: '6px',
                              zIndex: isSelected ? 20 : 1
                            }}
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedReservation(
                                isSelected ? null : { castId: cast.id, reservationId: reservation.id }
                              );
                            }}
                          >
                            {/* A12: クリックポップアップ */}
                            {isSelected && (
                              <div
                                className="absolute bottom-full left-0 mb-2 bg-white border border-gray-200 rounded shadow-lg z-50 text-xs"
                                style={{ minWidth: '180px' }}
                                onClick={(e) => e.stopPropagation()}
                              >
                                <div
                                  className="px-2 py-1 rounded-t text-white text-[10px] font-bold flex items-center justify-between"
                                  style={{ background: getReservationColor(reservation.type) }}
                                >
                                  <span>{getReservationLabel(reservation.type)}</span>
                                  <button
                                    className="ml-2 opacity-80 hover:opacity-100"
                                    onClick={() => setSelectedReservation(null)}
                                  >
                                    <X className="w-3 h-3" />
                                  </button>
                                </div>
                                <div className="px-2 py-1.5 space-y-0.5">
                                  <div className="flex items-center gap-1">
                                    <span className="text-gray-500 w-14 flex-shrink-0">予約時刻</span>
                                    <span className="font-medium text-gray-800">{reservation.time}</span>
                                  </div>
                                  <div className="flex items-center gap-1">
                                    <span className="text-gray-500 w-14 flex-shrink-0">案内場所</span>
                                    <span className="font-medium text-gray-800">{reservation.location || '未定'}</span>
                                  </div>
                                  <div className="flex items-center gap-1">
                                    <span className="text-gray-500 w-14 flex-shrink-0">タイプ</span>
                                    <span
                                      className={`px-1 rounded text-[9px] font-bold ${reservation.guideType === 'specified' ? 'bg-orange-100 text-orange-700' : 'bg-blue-100 text-blue-700'}`}
                                    >
                                      {reservation.guideType === 'specified' ? '指定' : '幅'}
                                    </span>
                                  </div>
                                  <div className="flex items-center gap-1">
                                    <span className="text-gray-500 w-14 flex-shrink-0">顧客</span>
                                    <span className={`font-medium ${reservation.customerName ? 'text-gray-800' : 'text-orange-500'}`}>
                                      {reservation.customerName || '未登録'}
                                    </span>
                                  </div>
                                  <div className="flex items-center gap-1 pt-1.5 border-t border-gray-200 mt-1">
                                    <button
                                      type="button"
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        alert(`伝票作成画面を開きます\n対象予約: ${reservation.time} ${reservation.location}\n顧客: ${reservation.customerName || '未登録'}`);
                                      }}
                                      className="flex-1 px-2 py-1 bg-emerald-500 text-white text-[10px] font-bold rounded hover:bg-emerald-600"
                                    >
                                      📝 伝票作成
                                    </button>
                                    <button
                                      type="button"
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        if (confirm(`予約を止めますか？\n${reservation.time} ${reservation.location}`)) {
                                          alert('予約を止めました');
                                        }
                                      }}
                                      className="flex-1 px-2 py-1 bg-rose-500 text-white text-[10px] font-bold rounded hover:bg-rose-600"
                                    >
                                      ⏹ 止め
                                    </button>
                                  </div>
                                </div>
                              </div>
                            )}

                            {/* ホバーツールチップ（ポップアップ非表示時のみ） */}
                            {!isSelected && (
                              <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-2 bg-gray-800 text-white text-xs rounded shadow-lg whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50">
                                <div className="font-medium mb-1">{getReservationLabel(reservation.type)}</div>
                                <div>{reservation.time} - {reservation.location}</div>
                                <div className={`mt-1 pt-1 border-t border-gray-600 ${reservation.customerName ? 'text-green-300' : 'text-orange-300'}`}>
                                  顧客: {reservation.customerName || '顧客未登録'}
                                </div>
                                <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-gray-800" />
                              </div>
                            )}

                            {/* バー本体 */}
                            <div
                              className={`absolute inset-0 rounded-full flex items-center px-2 shadow-sm overflow-hidden hover:ring-2 hover:ring-offset-1 hover:ring-blue-400 ${isSelected ? 'ring-2 ring-offset-1 ring-yellow-400' : ''}`}
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
            className="fixed z-50 w-80 bg-white rounded-md shadow-lg border max-h-[90vh] overflow-y-auto"
            style={{
              top: `${Math.min(pricePopoverPosition.top, window.innerHeight - 500)}px`,
              left: `${pricePopoverPosition.left}px`
            }}
          >
            <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-3 py-2 flex items-center justify-between rounded-t-md sticky top-0">
              <span className="font-bold text-sm">料金計算 - {selectedCastForPrice.name}</span>
              <button onClick={closePricePopover} className="hover:bg-blue-500 rounded p-0.5">
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="p-3 space-y-3">
              {/* 預り荷物の詳細 */}
              {selectedCastForPrice.luggageDetails && (
                <div className="bg-orange-50 border border-orange-300 rounded-md p-2">
                  <div className="flex items-center gap-2">
                    <Package className="w-4 h-4 text-orange-600" />
                    <span className="text-xs font-bold text-orange-700">預り荷物</span>
                  </div>
                  <p className="text-sm text-orange-800 mt-1 font-medium">{selectedCastForPrice.luggageDetails}</p>
                </div>
              )}

              {/* 指名区分 */}
              <div>
                <Label className="text-xs font-bold text-gray-700 mb-1.5 block">指名区分</Label>
                <RadioGroup value={nominationType} onValueChange={handleNominationTypeChange} className="flex gap-2">
                  <div className={`flex items-center px-2 py-1 rounded-md border ${nominationType === 'free' ? 'bg-blue-50 border-blue-300' : 'border-gray-200'}`}>
                    <RadioGroupItem value="free" id="price-free" className="w-3 h-3" />
                    <Label htmlFor="price-free" className="text-xs ml-1 cursor-pointer">フリー</Label>
                  </div>
                  <div className={`flex items-center px-2 py-1 rounded-md border ${nominationType === 'panel' ? 'bg-purple-50 border-purple-300' : 'border-gray-200'}`}>
                    <RadioGroupItem value="panel" id="price-panel" className="w-3 h-3" />
                    <Label htmlFor="price-panel" className="text-xs ml-1 cursor-pointer">パネル</Label>
                  </div>
                  <div className={`flex items-center px-2 py-1 rounded-md border ${nominationType === 'honshimei' ? 'bg-amber-50 border-amber-400' : 'border-gray-200'}`}>
                    <RadioGroupItem value="honshimei" id="price-hon" className="w-3 h-3" />
                    <Label htmlFor="price-hon" className="text-xs ml-1 cursor-pointer flex items-center gap-1">
                      <Star className="w-3 h-3 text-amber-500" />
                      本指名
                    </Label>
                  </div>
                </RadioGroup>
                {/* 本指名選択時の注意メッセージ */}
                {nominationType === 'honshimei' && (
                  <div className="mt-2 p-2 bg-amber-50 border border-amber-300 rounded-md">
                    <div className="flex items-center gap-1 text-amber-700">
                      <UserCheck className="w-4 h-4" />
                      <span className="text-xs font-bold">本指名確認済み</span>
                    </div>
                    <p className="text-[10px] text-amber-600 mt-1">
                      顧客の指名履歴を確認しました。本指名料金が適用されます。
                    </p>
                  </div>
                )}
              </div>

              {/* 交通費（1000円単位） */}
              <div>
                <Label className="text-xs font-bold text-gray-700 mb-1.5 block">交通費（1000円単位）</Label>
                <div className="flex items-center gap-2">
                  <Input
                    type="text"
                    inputMode="numeric"
                    value={transportFeeInput}
                    onFocus={(e) => {
                      if (e.target.value === '0') {
                        setTransportFeeInput('');
                      }
                    }}
                    onChange={(e) => {
                      const val = e.target.value.replace(/[^0-9]/g, '');
                      setTransportFeeInput(val);
                    }}
                    className="h-7 text-xs w-16 text-right"
                    placeholder="0"
                  />
                  <span className="text-xs text-gray-600">× 1,000円 = ¥{((parseInt(transportFeeInput) || 0) * 1000).toLocaleString()}</span>
                </div>
              </div>

              {/* 特別指名料 */}
              <div>
                <Label className="text-xs font-bold text-gray-700 mb-1.5 block">特別指名料</Label>
                <div className="flex items-center gap-2">
                  <Input
                    type="text"
                    inputMode="numeric"
                    value={specialNominationFee}
                    onFocus={(e) => {
                      if (e.target.value === '0') {
                        setSpecialNominationFee('');
                      }
                    }}
                    onChange={(e) => {
                      const val = e.target.value.replace(/[^0-9]/g, '');
                      setSpecialNominationFee(val);
                    }}
                    className="h-7 text-xs w-24 text-right"
                    placeholder="0"
                  />
                  <span className="text-xs text-gray-600">円</span>
                </div>
              </div>

              {/* その他費用 */}
              <div>
                <Label className="text-xs font-bold text-gray-700 mb-1.5 block">その他（キャンセル料等）</Label>
                <div className="space-y-2">
                  {otherFees.map((fee, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <Input
                        type="text"
                        value={fee.label}
                        onChange={(e) => {
                          const newFees = [...otherFees];
                          newFees[index].label = e.target.value;
                          setOtherFees(newFees);
                        }}
                        className="h-7 text-xs flex-1"
                        placeholder="項目名"
                      />
                      <Input
                        type="text"
                        inputMode="numeric"
                        value={fee.amount}
                        onFocus={(e) => {
                          if (e.target.value === '0') {
                            const newFees = [...otherFees];
                            newFees[index].amount = '';
                            setOtherFees(newFees);
                          }
                        }}
                        onChange={(e) => {
                          const val = e.target.value.replace(/[^0-9]/g, '');
                          const newFees = [...otherFees];
                          newFees[index].amount = val;
                          setOtherFees(newFees);
                        }}
                        className="h-7 text-xs w-20 text-right"
                        placeholder="金額"
                      />
                      <span className="text-xs text-gray-600">円</span>
                      <button
                        onClick={() => {
                          const newFees = otherFees.filter((_, i) => i !== index);
                          setOtherFees(newFees);
                        }}
                        className="text-red-500 hover:text-red-700 p-1"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                  <Button
                    variant="outline"
                    size="sm"
                    className="h-6 text-xs w-full"
                    onClick={() => setOtherFees([...otherFees, { label: '', amount: '' }])}
                  >
                    + その他費用を追加
                  </Button>
                </div>
              </div>

              {/* 割引（動的に増える） */}
              <div>
                <Label className="text-xs font-bold text-gray-700 mb-1.5 block">割引</Label>
                <div className="space-y-2">
                  {discounts.map((discount, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <Select
                        value={discount.type}
                        onValueChange={(v) => {
                          const newDiscounts = [...discounts];
                          newDiscounts[index].type = v;
                          newDiscounts[index].amount = '';
                          // 割引が選択されたら次の割引欄を追加
                          if (v !== 'none' && index === discounts.length - 1) {
                            newDiscounts.push({ type: 'none', amount: '' });
                          }
                          setDiscounts(newDiscounts);
                        }}
                      >
                        <SelectTrigger className="h-7 text-xs flex-1">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="none">割引なし</SelectItem>
                          <SelectItem value="1000off">1,000円引き</SelectItem>
                          <SelectItem value="2000off">2,000円引き</SelectItem>
                          <SelectItem value="3000off">3,000円引き</SelectItem>
                          <SelectItem value="5000off">5,000円引き</SelectItem>
                          <SelectItem value="10percent">10%OFF</SelectItem>
                          <SelectItem value="custom">金額入力</SelectItem>
                        </SelectContent>
                      </Select>
                      {discount.type === 'custom' && (
                        <div className="flex items-center gap-1">
                          <Input
                            type="text"
                            inputMode="numeric"
                            value={discount.amount}
                            onFocus={(e) => {
                              if (e.target.value === '0') {
                                const newDiscounts = [...discounts];
                                newDiscounts[index].amount = '';
                                setDiscounts(newDiscounts);
                              }
                            }}
                            onChange={(e) => {
                              const val = e.target.value.replace(/[^0-9]/g, '');
                              const newDiscounts = [...discounts];
                              newDiscounts[index].amount = val;
                              // 金額が入力されたら次の割引欄を追加
                              if (val && index === discounts.length - 1) {
                                newDiscounts.push({ type: 'none', amount: '' });
                              }
                              setDiscounts(newDiscounts);
                            }}
                            className="h-7 text-xs w-20 text-right"
                            placeholder="0"
                          />
                          <span className="text-xs text-gray-600">円</span>
                        </div>
                      )}
                      {index > 0 && (
                        <button
                          onClick={() => {
                            const newDiscounts = discounts.filter((_, i) => i !== index);
                            setDiscounts(newDiscounts);
                          }}
                          className="text-red-500 hover:text-red-700 p-1"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
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
                {calculateTotal.specialNomination > 0 && (
                  <div className="flex justify-between text-xs text-gray-600">
                    <span>特別指名料</span>
                    <span>¥{calculateTotal.specialNomination.toLocaleString()}</span>
                  </div>
                )}
                {calculateTotal.otherFeesTotal > 0 && (
                  <div className="flex justify-between text-xs text-gray-600">
                    <span>その他</span>
                    <span>¥{calculateTotal.otherFeesTotal.toLocaleString()}</span>
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

              {/* 起票ボタン */}
              <Button
                className="w-full h-12 text-lg font-bold bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white shadow-lg"
                onClick={() => {
                  // 起票処理（将来的に実装）
                  alert(`起票完了\n総額: ¥${calculateTotal.total.toLocaleString()}`);
                  closePricePopover();
                }}
              >
                起票する
              </Button>
            </div>
          </div>
        </>
      )}

      {/* 本指名確認ダイアログ */}
      <AlertDialog open={showHonshimeiConfirm} onOpenChange={(open) => {
        if (!open) cancelHonshimei();
      }}>
        <AlertDialogContent className="max-w-md">
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2">
              <Star className="w-5 h-5 text-amber-500 fill-amber-500" />
              本指名の確認
            </AlertDialogTitle>
            <AlertDialogDescription asChild>
              <div className="space-y-4">
                <div className="bg-amber-50 border border-amber-200 rounded-md p-3">
                  <div className="flex items-center gap-2 text-amber-700 mb-2">
                    <AlertTriangle className="w-4 h-4" />
                    <span className="font-bold text-sm">本指名間違い防止チェック</span>
                  </div>
                  <p className="text-xs text-amber-600">
                    本指名は過去に利用実績のある顧客のみ適用可能です。
                    顧客名を入力して履歴を確認してください。
                  </p>
                </div>

                {selectedCastForPrice && (
                  <div className="bg-gray-50 rounded-md p-3">
                    <div className="text-sm">
                      <span className="text-gray-500">対象キャスト:</span>
                      <span className="ml-2 font-bold">{selectedCastForPrice.name}</span>
                    </div>
                    <div className="text-xs text-gray-500 mt-1 flex items-center gap-1">
                      <History className="w-3 h-3" />
                      過去の指名履歴を確認します
                    </div>
                  </div>
                )}

                <div className="space-y-2">
                  <Label htmlFor="customer-name" className="text-sm font-bold">
                    顧客名を入力
                  </Label>
                  <Input
                    id="customer-name"
                    type="text"
                    value={customerNameInput}
                    onChange={(e) => {
                      setCustomerNameInput(e.target.value);
                      setHonshimeiValidationError(null);
                    }}
                    placeholder="例: 山田、田中様"
                    className="h-10"
                  />
                  {honshimeiValidationError && (
                    <div className="text-xs text-red-600 bg-red-50 border border-red-200 rounded p-2">
                      {honshimeiValidationError}
                    </div>
                  )}
                </div>

                <div className="bg-blue-50 border border-blue-200 rounded-md p-2">
                  <p className="text-xs text-blue-700">
                    <strong>ヒント:</strong> 顧客名は部分一致で検索されます。
                    「山田」と入力すると「山田様」の履歴がマッチします。
                  </p>
                </div>
              </div>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={cancelHonshimei}>
              キャンセル
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmHonshimei}
              className="bg-amber-500 hover:bg-amber-600"
            >
              <UserCheck className="w-4 h-4 mr-2" />
              履歴を確認して本指名
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
