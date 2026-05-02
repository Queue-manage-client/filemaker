'use client';

import React, { useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { sampleCastData } from '@/data/castSampleData';
import { getCarsForDriver } from '@/data/transportCarSampleData';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  ArrowLeft,
  ArrowUpRight,
  ArrowDownRight,
  Users,
  Calendar,
  TrendingUp,
  Receipt,
  CheckCircle,
  Car,
  FileText,
  Plus,
  Edit2,
  Trash2,
  Upload,
  Clock,
  User,
  Save,
  ArrowUpDown,
  Search,
  Bell,
  X,
  ChevronLeft,
  ChevronRight,
  Building2,
  MapPin,
  Award,
  CalendarPlus,
  Store,
  History,
  PartyPopper,
  Sparkles,
  Gift,
  Crown,
  CalendarCheck,
  RotateCcw
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

function HostessManagementContent() {
  const searchParams = useSearchParams();
  const castId = searchParams.get('cast_id');
  const foundCast = sampleCastData.find(c => c.id === castId) ?? sampleCastData[0];

  const [activeSection, setActiveSection] = useState<string>('customer');
  const [isAttendanceConfirmed, setIsAttendanceConfirmed] = useState(false);

  // 3状態送迎 state
  type TransportStatus = 'idle' | 'pickup' | 'arrived' | 'sendoff';
  const [transportStatus, setTransportStatus] = useState<TransportStatus>('idle');

  // お迎えドラのドライバー名（dispatch-panel-2d の hostess.driverName に対応）
  // castId をキーにサンプルマッピング
  const castDriverMap: Record<string, string> = {
    '001': '松尾',
    '002': '山田',
    '003': '田中',
    '004': '佐藤',
    '005': '高橋',
    '006': '鈴木',
    '007': '渡辺',
    '008': '伊藤',
    '009': '加藤',
    '010': '山本',
    '011': '中村',
    '012': '小林',
    '013': '松本',
    '014': '吉田',
    '015': '木村',
    '016': '林',
    '017': '森',
    '018': '清水',
    '019': '汐崎',
    '020': '井上',
  };
  const assignedDriverName = castDriverMap[foundCast.id] ?? '松尾';
  const assignedCars = getCarsForDriver(assignedDriverName);

  const handleStartPickup = () => {
    setTransportStatus('pickup');
  };

  const handleArrive = () => {
    setTransportStatus('arrived');
  };

  const handleStartSendoff = () => {
    setTransportStatus('sendoff');
  };

  const handleCompleteSendoff = () => {
    setTransportStatus('idle');
  };

  React.useEffect(() => {
    document.title = 'プロフィール設定 - Dispatch Harmony Hub';
  }, []);

  // 出勤管理 (シフト提出) state
  type ShiftEntry = {
    date: string;        // 'YYYY-MM-DD'
    dayOfWeek: string;   // '月'..'日'
    isWorking: boolean;
    startHour: string;
    startMinute: string;
    endHour: string;
    endMinute: string;
    returnHour: string;
    returnMinute: string;
    pickupLocation: string; // お迎え場所
    dropoffLocation: string; // 送り場所
  };

  // キャスト所属店舗 (1つのシフトを全店舗に自動反映)
  const affiliatedStores = ['京都デリヘル倶楽部', '京都ホテヘル倶楽部', '滋賀DCP'];

  const pickupOptions = ['自宅', '京都駅', '四条烏丸', '丹波橋', '西院', '中書島'];
  const dropoffOptions = ['自宅', '京都駅', '四条烏丸', '丹波橋', '西院', '中書島'];

  const generateInitialShifts = (): ShiftEntry[] => {
    const days = ['月', '火', '水', '木', '金', '土', '日'];
    const start = new Date(2026, 2, 9); // 2026年03月09日 月曜
    return Array.from({ length: 7 }, (_, i) => {
      const d = new Date(start);
      d.setDate(start.getDate() + i);
      const yyyy = d.getFullYear();
      const mm = String(d.getMonth() + 1).padStart(2, '0');
      const dd = String(d.getDate()).padStart(2, '0');
      return {
        date: `${yyyy}-${mm}-${dd}`,
        dayOfWeek: days[i],
        isWorking: true,
        startHour: '19',
        startMinute: '00',
        endHour: '04',
        endMinute: '00',
        returnHour: '06',
        returnMinute: '00',
        pickupLocation: '自宅',
        dropoffLocation: '自宅',
      };
    });
  };
  const [shiftEntries, setShiftEntries] = useState<ShiftEntry[]>(generateInitialShifts());

  const updateShiftField = <K extends keyof ShiftEntry>(idx: number, field: K, value: ShiftEntry[K]) => {
    setShiftEntries(prev => prev.map((row, i) => (i === idx ? { ...row, [field]: value } : row)));
  };

  const submitShift = () => {
    alert(
      `シフトを送信しました\n` +
      `対象: ${shiftEntries.filter(s => s.isWorking).length}日\n` +
      `所属店舗 ${affiliatedStores.length}店舗すべてに同じシフトが反映されます\n` +
      `(${affiliatedStores.join(' / ')})`
    );
  };

  const resetShift = () => {
    setShiftEntries(generateInitialShifts());
  };

  // castSampleData から取得したキャスト情報をホステスデータにマッピング
  const hostessData = {
    name: foundCast.name,
    stageName: foundCast.name,
    thisMonthEarnings: 850000,
    lastMonthEarnings: 780000,
    influencerLevel: 'ゴールド',
    influencerFollowers: 15000,
  };

  const monthOverMonthChange = hostessData.thisMonthEarnings - hostessData.lastMonthEarnings;
  const monthOverMonthPercent = ((monthOverMonthChange / hostessData.lastMonthEarnings) * 100).toFixed(1);
  const isPositiveChange = monthOverMonthChange >= 0;

  // 系列店リスト
  const storeList = [
    { id: 'all', name: 'すべての店舗' },
    { id: 'store1', name: '本店' },
    { id: 'store2', name: '新宿店' },
    { id: 'store3', name: '渋谷店' },
  ];

  // 系列店フィルター
  const [selectedStore, setSelectedStore] = useState('all');

  // カレンダー用の選択日付
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [showCalendar, setShowCalendar] = useState(false);
  const [calendarMonth, setCalendarMonth] = useState(new Date());

  // 接客履歴サンプルデータ（各顧客に過去のメモ履歴を含む + あだ名 + 店舗）
  const [customerHistory, setCustomerHistory] = useState([
    {
      id: '1',
      customerNumber: 'C-0001',
      memberNumber: 'M-001',
      customerName: '田中様',
      nickname: 'たなちゃん',
      storeId: 'store1',
      lastVisitDate: '2026-02-13',
      rating: 5,
      memoHistory: [
        { id: 'm1-4', date: '2026-02-13 20:30', author: '私', content: 'ワイン好き。記念日は3月15日。赤ワイン（フルボディ）がお好み。' },
        { id: 'm1-3', date: '2026-02-05 19:45', author: '私', content: '誕生日のお祝いで来店。シャンパンを注文された。' },
        { id: 'm1-2', date: '2026-01-28 21:00', author: '私', content: '仕事の話が好き。IT企業の経営者。' },
        { id: 'm1-1', date: '2026-01-15 18:30', author: '私', content: '初回来店。紹介での来店。落ち着いた雰囲気を好む。' },
      ]
    },
    {
      id: '2',
      customerNumber: 'C-0003',
      memberNumber: 'M-003',
      customerName: '佐藤様',
      nickname: 'さとさん',
      storeId: 'store2',
      lastVisitDate: '2026-02-10',
      rating: 4,
      memoHistory: [
        { id: 'm2-3', date: '2026-02-10 20:00', author: '私', content: '静かな席を好む。奥の個室がお気に入り。' },
        { id: 'm2-2', date: '2026-01-25 19:30', author: '私', content: '日本酒派。特に純米大吟醸がお好み。' },
        { id: 'm2-1', date: '2026-01-10 21:15', author: '私', content: '初来店。控えめな性格。ゆっくり話を聞くスタイルが合う。' },
      ]
    },
    {
      id: '3',
      customerNumber: 'C-0002',
      memberNumber: 'M-002',
      customerName: '鈴木様',
      nickname: '',
      storeId: 'store1',
      lastVisitDate: '2026-02-08',
      rating: 4,
      memoHistory: [
        { id: 'm3-2', date: '2026-02-08 19:00', author: '私', content: '焼酎派。話題は野球。阪神ファン。' },
        { id: 'm3-1', date: '2026-01-20 20:30', author: '私', content: '初来店。明るい性格で話しやすい。' },
      ]
    },
    {
      id: '4',
      customerNumber: 'C-0004',
      memberNumber: 'M-004',
      customerName: '高橋様',
      nickname: 'タカさん',
      storeId: 'store3',
      lastVisitDate: '2026-02-07',
      rating: 5,
      memoHistory: [
        { id: 'm4-1', date: '2026-02-07 21:00', author: '私', content: 'ウイスキー好き。山崎がお気に入り。' },
      ]
    },
  ]);

  // 検索用のstate
  const [customerSearchQuery, setCustomerSearchQuery] = useState('');

  // ソート用のstate
  const [customerSortKey, setCustomerSortKey] = useState<'customerNumber' | 'memberNumber' | 'customerName' | 'lastVisitDate' | 'latestMemoDate'>('lastVisitDate');

  // 検索とソートを適用した顧客リスト
  const filteredAndSortedCustomerHistory = [...customerHistory]
    // 系列店フィルター
    .filter(customer => {
      if (selectedStore === 'all') return true;
      return customer.storeId === selectedStore;
    })
    // 日付フィルター（カレンダーで指定された場合）
    .filter(customer => {
      if (!selectedDate) return true;
      // 指定日にメモがあるか、または来店日が一致するかをチェック
      const hasMatchingMemo = customer.memoHistory.some(memo =>
        memo.date.startsWith(selectedDate)
      );
      return customer.lastVisitDate === selectedDate || hasMatchingMemo;
    })
    // 検索フィルター
    .filter(customer => {
      if (!customerSearchQuery.trim()) return true;
      const query = customerSearchQuery.toLowerCase();
      // 顧客名で検索
      if (customer.customerName.toLowerCase().includes(query)) return true;
      // あだ名で検索
      if (customer.nickname && customer.nickname.toLowerCase().includes(query)) return true;
      // 顧客番号で検索
      if (customer.customerNumber.toLowerCase().includes(query)) return true;
      // 会員番号で検索
      if (customer.memberNumber.toLowerCase().includes(query)) return true;
      // 来店日で検索
      if (customer.lastVisitDate.includes(query)) return true;
      // メモ内容で検索（フリーワード）
      const memoMatch = customer.memoHistory.some(memo =>
        memo.content.toLowerCase().includes(query)
      );
      if (memoMatch) return true;
      return false;
    })
    // ソート
    .sort((a, b) => {
      switch (customerSortKey) {
        case 'customerNumber':
          return a.customerNumber.localeCompare(b.customerNumber);
        case 'memberNumber':
          return a.memberNumber.localeCompare(b.memberNumber);
        case 'customerName':
          return a.customerName.localeCompare(b.customerName);
        case 'lastVisitDate':
          return b.lastVisitDate.localeCompare(a.lastVisitDate); // 新しい順
        case 'latestMemoDate':
          const aLatestMemo = a.memoHistory[0]?.date || '';
          const bLatestMemo = b.memoHistory[0]?.date || '';
          return bLatestMemo.localeCompare(aLatestMemo); // 新しい順
        default:
          return 0;
      }
    });

  const [editingCustomerId, setEditingCustomerId] = useState<string | null>(null);
  const [editingMemo, setEditingMemo] = useState('');
  const [expandedCustomerId, setExpandedCustomerId] = useState<string | null>(null);
  const [newMemoContent, setNewMemoContent] = useState('');

  // 予約状況サンプルデータ（タイムツリー形式）
  const [reservationSelectedDate, setReservationSelectedDate] = useState('2026-02-14');
  const [reservations, setReservations] = useState([
    {
      id: '1',
      date: '2026-02-14',
      startTime: '19:00',
      endTime: '21:00',
      customerName: '田中様',
      memberNumber: 'M-001',
      status: 'confirmed',
      nominationType: '本指名',
      course: '90分コース',
      storeName: '本店',
      area: '渋谷区',
      location: 'ホテルA（渋谷区道玄坂）',
      note: ''
    },
    {
      id: '2',
      date: '2026-02-14',
      startTime: '22:00',
      endTime: '23:30',
      customerName: '山本様',
      memberNumber: 'M-005',
      status: 'pending',
      nominationType: 'フリー',
      course: '60分コース',
      storeName: '新宿店',
      area: '新宿区',
      location: '自宅（新宿区西新宿）',
      note: ''
    },
    {
      id: '3',
      date: '2026-02-15',
      startTime: '18:30',
      endTime: '20:30',
      customerName: '高橋様',
      memberNumber: 'M-004',
      status: 'confirmed',
      nominationType: '本指名',
      course: '120分コース',
      storeName: '本店',
      area: '港区',
      location: 'ホテルB（港区六本木）',
      note: ''
    },
    {
      id: '4',
      date: '2026-02-15',
      startTime: '21:00',
      endTime: '22:30',
      customerName: '佐藤様',
      memberNumber: 'M-003',
      status: 'confirmed',
      nominationType: '場内指名',
      course: '90分コース',
      storeName: '本店',
      area: '渋谷区',
      location: 'ホテルC（渋谷区恵比寿）',
      note: ''
    },
  ]);

  // 選択日の予約をフィルタリング
  const filteredReservations = reservations.filter(r => r.date === reservationSelectedDate);

  // 姫予約用のstate
  const [himeReservation, setHimeReservation] = useState({
    date: '',
    startTime: '',
    endTime: '',
    area: '',
    course: '',
    location: '',
  });

  // ========================================
  // 評価基準の定義
  // ========================================

  // 合計PVポイント
  const totalPVCriteria = [
    { threshold: 90000, score: 15, label: 'S' },
    { threshold: 45000, score: 13, label: '80' },
    { threshold: 20000, score: 11, label: 'A(70)' },
    { threshold: 15000, score: 9, label: '60' },
    { threshold: 12000, score: 7, label: 'B(50)' },
    { threshold: 9000, score: 6, label: '40' },
    { threshold: 6000, score: 4, label: 'C(30)' },
    { threshold: 3000, score: 2, label: '20' },
    { threshold: 1500, score: 1, label: 'D(10)' },
    { threshold: 0, score: 0, label: '0' },
  ];

  // 出勤日平均PVポイント（NEW）
  const avgPVCriteria = [
    { threshold: 4000, score: 10, label: '4000PV' },
    { threshold: 2000, score: 9, label: '2000PV' },
    { threshold: 1500, score: 8, label: '1500PV' },
    { threshold: 1200, score: 7, label: '1200PV' },
    { threshold: 900, score: 6, label: '900PV' },
    { threshold: 600, score: 5, label: '600PV' },
    { threshold: 300, score: 4, label: '300PV' },
    { threshold: 100, score: 2, label: '100PV' },
    { threshold: 50, score: 1, label: '50PV' },
    { threshold: 0, score: 0, label: '左記未満' },
  ];

  // マイガール人数ポイント
  const myGirlCountCriteria = [
    { threshold: 15000, score: 8, label: '15000人' },
    { threshold: 5000, score: 7, label: '5000人' },
    { threshold: 2000, score: 6, label: '2000人' },
    { threshold: 1000, score: 5, label: '1000人' },
    { threshold: 500, score: 3, label: '500人' },
    { threshold: 200, score: 1, label: '200人' },
    { threshold: 0, score: 0, label: '左記未満' },
  ];

  // マイガール増加ポイント（NEW）
  const myGirlIncreaseCriteria = [
    { threshold: 600, score: 7, label: '600人増' },
    { threshold: 400, score: 6, label: '400人増' },
    { threshold: 200, score: 5, label: '200人増' },
    { threshold: 100, score: 3, label: '100人増' },
    { threshold: 50, score: 2, label: '50人増' },
    { threshold: 20, score: 1, label: '20人増' },
    { threshold: 0, score: 0, label: '左記未満' },
  ];

  // WEB予約ポイント
  const webReservationCriteria = [
    { threshold: 40, score: 15, label: '40本' },
    { threshold: 35, score: 13, label: '35本' },
    { threshold: 30, score: 11, label: '30本' },
    { threshold: 25, score: 9, label: '25本' },
    { threshold: 20, score: 7, label: '20本' },
    { threshold: 15, score: 6, label: '15本' },
    { threshold: 10, score: 4, label: '10本' },
    { threshold: 5, score: 2, label: '5本' },
    { threshold: 1, score: 1, label: '1本' },
    { threshold: 0, score: 0, label: '左記未満' },
  ];

  // 姫デコログインポイント
  const himeDecoLoginCriteria = [
    { threshold: 1, score: 2, label: 'SPログイン' },
    { threshold: 0, score: 0, label: '未ログイン' },
  ];

  // 写メ日記ポイント
  const photoDiaryCriteria = [
    { threshold: 100, score: 5, label: '100本' },
    { threshold: 70, score: 4, label: '70本' },
    { threshold: 50, score: 3, label: '50本' },
    { threshold: 30, score: 2, label: '30本' },
    { threshold: 15, score: 1, label: '15本' },
    { threshold: 0, score: 0, label: '左記未満' },
  ];

  // 日記ポイント
  const diaryCriteria = [
    { threshold: 40, score: 5, label: '40本' },
    { threshold: 30, score: 4, label: '30本' },
    { threshold: 20, score: 3, label: '20本' },
    { threshold: 10, score: 2, label: '10本' },
    { threshold: 5, score: 1, label: '5本' },
    { threshold: 0, score: 0, label: '左記未満' },
  ];

  // 動画日記ポイント
  const videoDiaryCriteria = [
    { threshold: 20, score: 5, label: '20本' },
    { threshold: 10, score: 4, label: '10本' },
    { threshold: 5, score: 3, label: '5本' },
    { threshold: 3, score: 2, label: '3本' },
    { threshold: 1, score: 1, label: '1本' },
    { threshold: 0, score: 0, label: '左記未満' },
  ];

  // キテネポイント
  const kiteneCriteria = [
    { threshold: 400, score: 5, label: '400回' },
    { threshold: 300, score: 4, label: '300回' },
    { threshold: 200, score: 3, label: '200回' },
    { threshold: 100, score: 2, label: '100回' },
    { threshold: 50, score: 1, label: '50回' },
    { threshold: 0, score: 0, label: '左記未満' },
  ];

  // 口コミポイント
  const reviewCriteria = [
    { threshold: 10, score: 8, label: '10件' },
    { threshold: 5, score: 6, label: '5件' },
    { threshold: 3, score: 4, label: '3件' },
    { threshold: 2, score: 3, label: '2件' },
    { threshold: 1, score: 2, label: '1件' },
    { threshold: 0, score: 0, label: '左記未満' },
  ];

  // オキニトーク送信ポイント
  const okiniSendCriteria = [
    { threshold: 200, score: 8, label: '200回' },
    { threshold: 150, score: 6, label: '150回' },
    { threshold: 80, score: 4, label: '80回' },
    { threshold: 30, score: 2, label: '30回' },
    { threshold: 10, score: 1, label: '10回' },
    { threshold: 0, score: 0, label: '左記未満' },
  ];

  // オキニトーク返信ポイント（NEW）
  const okiniReplyCriteria = [
    { threshold: 50, score: 7, label: '50人' },
    { threshold: 40, score: 5, label: '40人' },
    { threshold: 20, score: 3, label: '20人' },
    { threshold: 10, score: 2, label: '10人' },
    { threshold: 5, score: 1, label: '5人' },
    { threshold: 0, score: 0, label: '左記未満' },
  ];

  // スコアを計算する関数
  const calculateScore = (value: number, criteria: { threshold: number; score: number; label: string }[]) => {
    for (const c of criteria) {
      if (value >= c.threshold) {
        return { score: c.score, label: c.label, maxScore: criteria[0].score };
      }
    }
    return { score: 0, label: '該当なし', maxScore: criteria[0].score };
  };

  // 評価ランクを計算する関数（最大100点）
  const calculateRank = (totalScore: number) => {
    if (totalScore >= 80) return { rank: 'S', color: 'text-yellow-500', bgColor: 'bg-gradient-to-r from-yellow-400 to-amber-500', borderColor: 'border-yellow-400' };
    if (totalScore >= 60) return { rank: 'A', color: 'text-red-500', bgColor: 'bg-gradient-to-r from-red-400 to-rose-500', borderColor: 'border-red-400' };
    if (totalScore >= 40) return { rank: 'B', color: 'text-blue-500', bgColor: 'bg-gradient-to-r from-blue-400 to-indigo-500', borderColor: 'border-blue-400' };
    if (totalScore >= 20) return { rank: 'C', color: 'text-green-500', bgColor: 'bg-gradient-to-r from-green-400 to-emerald-500', borderColor: 'border-green-400' };
    return { rank: 'D', color: 'text-gray-500', bgColor: 'bg-gradient-to-r from-gray-400 to-slate-500', borderColor: 'border-gray-400' };
  };

  // マイ実績サンプルデータ（月別）- 詳細版
  const [selectedPerformanceMonth, setSelectedPerformanceMonth] = useState('2026-02');
  const performanceHistory: Record<string, {
    totalPV: number;
    workDays: number;
    myGirlCount: number;
    myGirlIncrease: number;
    webReservation: number;
    himeDecoLogin: boolean;
    photoDiary: number;
    diary: number;
    videoDiary: number;
    kitene: number;
    reviews: number;
    okiniSend: number;
    okiniReply: number;
    totalIncome: number;
    dispatchCount: number;
    nominationCount: number;
    groupRank: number;
    storeRank: number;
    nominationRate: number;
  }> = {
    '2026-02': {
      totalPV: 52000, workDays: 22, myGirlCount: 1850, myGirlIncrease: 120,
      webReservation: 28, himeDecoLogin: true, photoDiary: 65, diary: 25,
      videoDiary: 8, kitene: 180, reviews: 4, okiniSend: 95, okiniReply: 28,
      totalIncome: 850000, dispatchCount: 45, nominationCount: 28,
      groupRank: 8, storeRank: 3, nominationRate: 62.2
    },
    '2026-01': {
      totalPV: 48000, workDays: 20, myGirlCount: 1730, myGirlIncrease: 95,
      webReservation: 25, himeDecoLogin: true, photoDiary: 58, diary: 22,
      videoDiary: 6, kitene: 150, reviews: 3, okiniSend: 80, okiniReply: 22,
      totalIncome: 780000, dispatchCount: 42, nominationCount: 25,
      groupRank: 12, storeRank: 4, nominationRate: 59.5
    },
    '2025-12': {
      totalPV: 68000, workDays: 24, myGirlCount: 1635, myGirlIncrease: 150,
      webReservation: 32, himeDecoLogin: true, photoDiary: 80, diary: 35,
      videoDiary: 12, kitene: 250, reviews: 6, okiniSend: 120, okiniReply: 35,
      totalIncome: 920000, dispatchCount: 52, nominationCount: 35,
      groupRank: 5, storeRank: 2, nominationRate: 67.3
    },
    '2025-11': {
      totalPV: 35000, workDays: 18, myGirlCount: 1485, myGirlIncrease: 70,
      webReservation: 18, himeDecoLogin: false, photoDiary: 42, diary: 15,
      videoDiary: 3, kitene: 95, reviews: 2, okiniSend: 50, okiniReply: 12,
      totalIncome: 650000, dispatchCount: 35, nominationCount: 19,
      groupRank: 18, storeRank: 6, nominationRate: 54.3
    },
    '2025-10': {
      totalPV: 38000, workDays: 19, myGirlCount: 1415, myGirlIncrease: 80,
      webReservation: 20, himeDecoLogin: true, photoDiary: 48, diary: 18,
      videoDiary: 4, kitene: 110, reviews: 2, okiniSend: 60, okiniReply: 15,
      totalIncome: 700000, dispatchCount: 38, nominationCount: 21,
      groupRank: 15, storeRank: 5, nominationRate: 55.3
    },
    '2025-09': {
      totalPV: 42000, workDays: 20, myGirlCount: 1335, myGirlIncrease: 90,
      webReservation: 22, himeDecoLogin: true, photoDiary: 52, diary: 20,
      videoDiary: 5, kitene: 130, reviews: 3, okiniSend: 70, okiniReply: 18,
      totalIncome: 720000, dispatchCount: 40, nominationCount: 23,
      groupRank: 14, storeRank: 4, nominationRate: 57.5
    },
  };

  const currentPerformance = performanceHistory[selectedPerformanceMonth as keyof typeof performanceHistory] || performanceHistory['2026-02'];

  // 出勤日平均PV
  const avgPVPerDay = currentPerformance.workDays > 0
    ? Math.round(currentPerformance.totalPV / currentPerformance.workDays)
    : 0;

  // 各項目のスコア計算
  const scores = {
    totalPV: calculateScore(currentPerformance.totalPV, totalPVCriteria),
    avgPV: calculateScore(avgPVPerDay, avgPVCriteria),
    myGirlCount: calculateScore(currentPerformance.myGirlCount, myGirlCountCriteria),
    myGirlIncrease: calculateScore(currentPerformance.myGirlIncrease, myGirlIncreaseCriteria),
    webReservation: calculateScore(currentPerformance.webReservation, webReservationCriteria),
    himeDecoLogin: calculateScore(currentPerformance.himeDecoLogin ? 1 : 0, himeDecoLoginCriteria),
    photoDiary: calculateScore(currentPerformance.photoDiary, photoDiaryCriteria),
    diary: calculateScore(currentPerformance.diary, diaryCriteria),
    videoDiary: calculateScore(currentPerformance.videoDiary, videoDiaryCriteria),
    kitene: calculateScore(currentPerformance.kitene, kiteneCriteria),
    reviews: calculateScore(currentPerformance.reviews, reviewCriteria),
    okiniSend: calculateScore(currentPerformance.okiniSend, okiniSendCriteria),
    okiniReply: calculateScore(currentPerformance.okiniReply, okiniReplyCriteria),
  };

  const totalScore = scores.totalPV.score + scores.avgPV.score + scores.myGirlCount.score +
    scores.myGirlIncrease.score + scores.webReservation.score + scores.himeDecoLogin.score +
    scores.photoDiary.score + scores.diary.score + scores.videoDiary.score +
    scores.kitene.score + scores.reviews.score + scores.okiniSend.score + scores.okiniReply.score;

  const rankInfo = calculateRank(totalScore);

  // 総所得計算
  const totalEarnings = Object.values(performanceHistory).reduce((sum, month) => sum + month.totalIncome, 0);

  // グループ・店舗順位
  const rankingData = {
    groupRank: currentPerformance.groupRank,
    groupTotal: 150,
    storeRank: currentPerformance.storeRank,
    storeTotal: 25,
    storeName: '本店',
  };

  // お知らせサンプルデータ
  const [announcements, setAnnouncements] = useState([
    {
      id: '1',
      title: '【重要】バレンタインキャンペーンについて',
      content: '2月14日はバレンタインキャンペーンを実施します。特別コースのご案内をお願いします。',
      date: '2026-02-13',
      category: 'campaign',
      isRead: false,
      priority: 'high',
    },
    {
      id: '2',
      title: '新規ルール制定のお知らせ',
      content: '3月1日より、新しい勤務ルールが適用されます。詳細は添付資料をご確認ください。',
      date: '2026-02-10',
      category: 'rule',
      isRead: false,
      priority: 'normal',
    },
    {
      id: '3',
      title: '給与明細配布について',
      content: '今月の給与明細は15日に配布予定です。',
      date: '2026-02-08',
      category: 'info',
      isRead: true,
      priority: 'normal',
    },
  ]);

  const [showAnnouncementPopup, setShowAnnouncementPopup] = useState(true);
  const unreadAnnouncements = announcements.filter(a => !a.isRead);

  // 今月のイベント情報
  const currentMonth = new Date().toLocaleString('ja-JP', { year: 'numeric', month: 'long' });
  const [events] = useState([
    // グループ全体のイベント
    {
      id: 'e1',
      title: 'バレンタインキャンペーン',
      description: '全店舗で特別コース20%OFF。ペアでの来店でシャンパン1本サービス！',
      startDate: '2026-02-01',
      endDate: '2026-02-14',
      type: 'group',
      storeName: 'グループ全店',
      icon: 'heart',
      color: 'pink',
    },
    {
      id: 'e2',
      title: '春の新人キャスト祭り',
      description: '新人キャストとの初回指名で500ポイントプレゼント',
      startDate: '2026-02-15',
      endDate: '2026-02-28',
      type: 'group',
      storeName: 'グループ全店',
      icon: 'sparkle',
      color: 'purple',
    },
    // 本店のイベント
    {
      id: 'e3',
      title: '本店限定 VIPナイト',
      description: 'VIP会員様限定のプレミアムパーティー開催。要予約。',
      startDate: '2026-02-20',
      endDate: '2026-02-20',
      type: 'store',
      storeName: '本店',
      icon: 'star',
      color: 'amber',
    },
    {
      id: 'e4',
      title: '本店 深夜割引デー',
      description: '23時以降のご来店で全コース1,000円引き',
      startDate: '2026-02-10',
      endDate: '2026-02-28',
      type: 'store',
      storeName: '本店',
      icon: 'moon',
      color: 'blue',
    },
    // 新宿店のイベント
    {
      id: 'e5',
      title: '新宿店 オープン1周年記念',
      description: '1周年を記念して、ご来店のお客様全員にプレゼント！',
      startDate: '2026-02-22',
      endDate: '2026-02-22',
      type: 'store',
      storeName: '新宿店',
      icon: 'gift',
      color: 'green',
    },
    // 渋谷店のイベント
    {
      id: 'e6',
      title: '渋谷店 平日限定サービス',
      description: '月〜木曜限定でドリンク1杯無料サービス',
      startDate: '2026-02-01',
      endDate: '2026-02-28',
      type: 'store',
      storeName: '渋谷店',
      icon: 'drink',
      color: 'cyan',
    },
  ]);

  // イベントフィルター用
  const [eventFilter, setEventFilter] = useState<'all' | 'group' | string>('all');

  // フィルタリングされたイベント
  const filteredEvents = events.filter(event => {
    if (eventFilter === 'all') return true;
    if (eventFilter === 'group') return event.type === 'group';
    return event.storeName === eventFilter;
  });

  const markAnnouncementAsRead = (id: string) => {
    setAnnouncements(prev => prev.map(a =>
      a.id === id ? { ...a, isRead: true } : a
    ));
  };

  // バック料金表データ
  const backFeeData = {
    courseBack: [
      { name: '60分コース', price: 10000, backRate: 50, backAmount: 5000 },
      { name: '90分コース', price: 15000, backRate: 50, backAmount: 7500 },
      { name: '120分コース', price: 20000, backRate: 50, backAmount: 10000 },
      { name: '180分コース', price: 28000, backRate: 50, backAmount: 14000 },
      { name: '延長30分', price: 5000, backRate: 50, backAmount: 2500 },
    ],
    nominationBack: [
      { name: '本指名', amount: 2000 },
      { name: '場内指名', amount: 1000 },
      { name: 'フリー（指名なし）', amount: 0 },
    ],
    optionBack: [
      { name: 'オプションA', price: 3000, backRate: 70, backAmount: 2100 },
      { name: 'オプションB', price: 5000, backRate: 70, backAmount: 3500 },
      { name: 'オプションC', price: 8000, backRate: 70, backAmount: 5600 },
    ],
    bonusBack: [
      { name: '月間指名10件達成', amount: 5000 },
      { name: '月間売上100万達成', amount: 10000 },
      { name: '月間売上200万達成', amount: 25000 },
    ],
  };


  const handleSaveCustomerMemo = (id: string) => {
    if (!editingMemo.trim()) return;
    const now = new Date();
    const dateStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')} ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
    setCustomerHistory(prev => prev.map(c =>
      c.id === id ? {
        ...c,
        memoHistory: [{
          id: `m${id}-${Date.now()}`,
          date: dateStr,
          author: '私',
          content: editingMemo
        }, ...c.memoHistory]
      } : c
    ));
    setEditingCustomerId(null);
    setEditingMemo('');
  };

  // 新しいメモを追加する関数
  const handleAddNewMemo = (customerId: string) => {
    if (!newMemoContent.trim()) return;
    const now = new Date();
    const dateStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')} ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
    setCustomerHistory(prev => prev.map(c =>
      c.id === customerId ? {
        ...c,
        memoHistory: [{
          id: `m${customerId}-${Date.now()}`,
          date: dateStr,
          author: '私',
          content: newMemoContent
        }, ...c.memoHistory]
      } : c
    ));
    setNewMemoContent('');
  };

  // メモを削除する関数
  const handleDeleteMemo = (customerId: string, memoId: string) => {
    setCustomerHistory(prev => prev.map(c =>
      c.id === customerId ? {
        ...c,
        memoHistory: c.memoHistory.filter(memo => memo.id !== memoId)
      } : c
    ));
  };

  // あだ名を更新する関数
  const [editingNicknameId, setEditingNicknameId] = useState<string | null>(null);
  const [editingNicknameValue, setEditingNicknameValue] = useState('');

  const handleUpdateNickname = (customerId: string) => {
    setCustomerHistory(prev => prev.map(c =>
      c.id === customerId ? { ...c, nickname: editingNicknameValue } : c
    ));
    setEditingNicknameId(null);
    setEditingNicknameValue('');
  };

  // カレンダーヘルパー関数
  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const days = [];

    // 前月の日を追加
    for (let i = 0; i < firstDay.getDay(); i++) {
      days.push(null);
    }

    // 当月の日を追加
    for (let i = 1; i <= lastDay.getDate(); i++) {
      days.push(i);
    }

    return days;
  };

  const formatDateForCalendar = (year: number, month: number, day: number) => {
    return `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
  };


  // 大カテゴリメニュー
  const mainMenuItems = [
    { id: 'announcement', label: 'お知らせ', icon: Bell, gradient: 'from-red-500 to-rose-500', badge: unreadAnnouncements.length > 0 ? unreadAnnouncements.length : null },
    { id: 'event', label: 'イベント情報', icon: PartyPopper, gradient: 'from-amber-400 to-yellow-500' },
    { id: 'customer', label: '顧客管理', icon: Users, gradient: 'from-purple-500 to-violet-600' },
    { id: 'reservation', label: '予約状況', icon: Calendar, gradient: 'from-pink-500 to-rose-500' },
    { id: 'performance', label: 'マイ実績', icon: TrendingUp, gradient: 'from-cyan-400 to-blue-500' },
    { id: 'hime-reservation', label: '姫予約', icon: CalendarPlus, gradient: 'from-fuchsia-500 to-pink-500' },
    { id: 'back-fee', label: 'バック料金表', icon: Receipt, gradient: 'from-green-500 to-emerald-600' },
    { id: 'attendance', label: '出勤管理', icon: CalendarCheck, gradient: 'from-orange-500 to-amber-600' },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* ヘッダー */}
      <div className="bg-gradient-to-r from-purple-600 to-violet-600 px-4 lg:px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3 lg:gap-4">
            <Link href="/dashboard">
              <button className="w-9 h-9 lg:w-10 lg:h-10 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center transition-colors">
                <ArrowLeft className="w-4 h-4 lg:w-5 lg:h-5 text-white" />
              </button>
            </Link>
            <h1 className="text-white text-lg lg:text-xl font-bold">マイページ</h1>
          </div>
          <div className="flex items-center gap-2 lg:gap-4">
            <div className="w-10 h-10 lg:w-12 lg:h-12 rounded-full bg-white/20 flex items-center justify-center">
              <User className="w-5 h-5 lg:w-6 lg:h-6 text-white" />
            </div>
            <div className="text-white hidden sm:block">
              <div className="flex items-center gap-2">
                <span className="font-bold text-base lg:text-lg">{hostessData.stageName}</span>
                {/* インフルエンサーレベル表示 */}
                <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-gradient-to-r from-amber-400 to-yellow-500 rounded-full text-[10px] font-bold text-amber-900">
                  <Crown className="w-3 h-3" />
                  {hostessData.influencerLevel}
                </span>
              </div>
              <div className="text-white/70 text-xs lg:text-sm flex items-center gap-2">
                <span>{hostessData.name}</span>
                <span className="text-white/50">|</span>
                <span>{hostessData.influencerFollowers.toLocaleString()}フォロワー</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-4 lg:p-6">
        {/* TOP: 収入カード + 小カテゴリ */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 lg:gap-6 mb-4 lg:mb-6">
          {/* 今月の収入 */}
          <Card className="bg-gradient-to-r from-purple-600 to-violet-600 border-none shadow-lg">
            <CardContent className="p-4 lg:p-6">
              <div className="text-white/70 text-xs lg:text-sm mb-1 lg:mb-2">今月の収入</div>
              <div className="text-2xl lg:text-4xl font-bold text-white mb-2 lg:mb-4">
                ¥{hostessData.thisMonthEarnings.toLocaleString()}
              </div>
              <div className="flex items-center justify-between">
                <span className="text-white/70 text-xs lg:text-base">前月比</span>
                <div className={`flex items-center gap-1 lg:gap-2 px-2 lg:px-3 py-1 rounded-full text-xs lg:text-base ${
                  isPositiveChange ? 'bg-white/20 text-white' : 'bg-white/20 text-white'
                }`}>
                  {isPositiveChange ? <ArrowUpRight className="w-3 h-3 lg:w-4 lg:h-4" /> : <ArrowDownRight className="w-3 h-3 lg:w-4 lg:h-4" />}
                  <span className="font-bold">{isPositiveChange ? '+' : ''}{monthOverMonthPercent}%</span>
                  <span className="text-xs lg:text-sm hidden sm:inline">({isPositiveChange ? '+' : ''}¥{monthOverMonthChange.toLocaleString()})</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* お知らせバナー（未読がある場合） */}
          {unreadAnnouncements.length > 0 && showAnnouncementPopup && (
            <Card className="lg:col-span-3 bg-gradient-to-r from-red-500 to-rose-500 border-none shadow-lg animate-pulse">
              <CardContent className="p-4 lg:p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3 text-white">
                    <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
                      <Bell className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="font-bold text-base lg:text-lg">
                        {unreadAnnouncements.length}件の新着お知らせ
                      </div>
                      <div className="text-white/80 text-xs lg:text-sm">
                        {unreadAnnouncements[0].title}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="secondary"
                      size="sm"
                      className="bg-white text-red-500 hover:bg-white/90"
                      onClick={() => setActiveSection('announcement')}
                    >
                      確認する
                    </Button>
                    <button
                      className="text-white/70 hover:text-white"
                      onClick={() => setShowAnnouncementPopup(false)}
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* 小カテゴリ：クイックアクション */}
          <Card className="lg:col-span-2 bg-white border-none shadow-none">
            <CardContent className="p-4 lg:p-6">
              <div className="text-gray-500 text-xs lg:text-sm mb-3 lg:mb-4">クイックアクション</div>
              <div className="grid grid-cols-3 gap-2 lg:gap-4">
                {/* 出勤確認 */}
                <button
                  onClick={() => setIsAttendanceConfirmed(true)}
                  className={`p-2 lg:p-4 rounded-xl lg:rounded-2xl flex flex-col lg:flex-row items-center gap-1 lg:gap-4 transition-all hover:scale-[1.02] ${
                    isAttendanceConfirmed
                      ? 'bg-green-500 shadow-lg shadow-green-500/30'
                      : 'bg-gradient-to-r from-green-500 to-emerald-500 shadow-lg shadow-green-500/20'
                  }`}
                >
                  <div className="w-10 h-10 lg:w-12 lg:h-12 rounded-full bg-white/20 flex items-center justify-center">
                    <CheckCircle className="w-5 h-5 lg:w-6 lg:h-6 text-white" />
                  </div>
                  <div className="text-center lg:text-left">
                    <div className="text-white font-bold text-xs lg:text-base">{isAttendanceConfirmed ? '確認済み' : '出勤確認'}</div>
                    <div className="text-white/70 text-[10px] lg:text-sm hidden lg:block">タップして確認</div>
                  </div>
                </button>

                {/* 送迎車確認 */}
                <button
                  onClick={() => setActiveSection('car')}
                  className={`p-2 lg:p-4 rounded-xl lg:rounded-2xl flex flex-col lg:flex-row items-center gap-1 lg:gap-4 transition-all hover:scale-[1.02] ${
                    transportStatus !== 'idle'
                      ? 'bg-blue-500 shadow-lg shadow-blue-500/30'
                      : 'bg-gradient-to-r from-blue-500 to-cyan-500 shadow-lg shadow-blue-500/20'
                  }`}
                >
                  <div className="w-10 h-10 lg:w-12 lg:h-12 rounded-full bg-white/20 flex items-center justify-center">
                    <Car className="w-5 h-5 lg:w-6 lg:h-6 text-white" />
                  </div>
                  <div className="text-center lg:text-left">
                    <div className="text-white font-bold text-xs lg:text-base">{transportStatus !== 'idle' ? '送迎中' : '送迎車確認'}</div>
                    <div className="text-white/70 text-[10px] lg:text-sm hidden lg:block">担当車両の確認</div>
                  </div>
                </button>

                {/* 出勤申請 */}
                <button
                  onClick={() => setActiveSection('attendance')}
                  className="p-2 lg:p-4 rounded-xl lg:rounded-2xl flex flex-col lg:flex-row items-center gap-1 lg:gap-4 bg-gradient-to-r from-violet-500 to-purple-600 shadow-lg shadow-violet-500/20 transition-all hover:scale-[1.02]"
                >
                  <div className="w-10 h-10 lg:w-12 lg:h-12 rounded-full bg-white/20 flex items-center justify-center">
                    <FileText className="w-5 h-5 lg:w-6 lg:h-6 text-white" />
                  </div>
                  <div className="text-center lg:text-left">
                    <div className="text-white font-bold text-xs lg:text-base">出勤申請</div>
                    <div className="text-white/70 text-[10px] lg:text-sm hidden lg:block">シフト申請を送信</div>
                  </div>
                </button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* メイン：大カテゴリ + コンテンツ */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 lg:gap-6">
          {/* 左サイド：大カテゴリメニュー（2.png風ピルボタン） */}
          {/* モバイル・PC共に縦並び */}
          <div className="flex flex-col gap-2 lg:gap-4">
            {mainMenuItems.map(item => (
              <button
                key={item.id}
                onClick={() => setActiveSection(item.id)}
                className={`w-full h-12 lg:h-14 flex items-center gap-2 lg:gap-3 pl-0.5 lg:pl-1 pr-4 lg:pr-6 rounded-full transition-all relative ${
                  activeSection === item.id
                    ? `bg-gradient-to-r ${item.gradient} shadow-lg`
                    : `bg-gradient-to-r ${item.gradient} opacity-80 hover:opacity-100 shadow-md`
                }`}
              >
                <div className="w-10 h-10 lg:w-12 lg:h-12 rounded-full bg-white shadow-[0_4px_12px_rgba(0,0,0,0.15)] flex items-center justify-center flex-shrink-0 relative">
                  <item.icon className={`w-4 h-4 lg:w-5 lg:h-5 ${
                    item.id === 'announcement' ? 'text-red-500' :
                    item.id === 'event' ? 'text-amber-500' :
                    item.id === 'customer' ? 'text-purple-500' :
                    item.id === 'reservation' ? 'text-pink-500' :
                    item.id === 'performance' ? 'text-cyan-500' :
                    item.id === 'hime-reservation' ? 'text-fuchsia-500' :
                    'text-orange-500'
                  }`} />
                  {/* 未読バッジ */}
                  {item.badge && (
                    <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white text-[10px] rounded-full flex items-center justify-center animate-pulse">
                      {item.badge}
                    </span>
                  )}
                </div>
                <span className="text-white font-semibold text-sm lg:text-base whitespace-nowrap">
                  {item.label}
                </span>
              </button>
            ))}

            {/* 送迎車確認 */}
            <button
              onClick={() => setActiveSection('car')}
              className={`w-full h-12 lg:h-14 flex items-center gap-2 lg:gap-3 pl-0.5 lg:pl-1 pr-4 lg:pr-6 rounded-full transition-all ${
                activeSection === 'car'
                  ? 'bg-gradient-to-r from-blue-500 to-cyan-500 shadow-lg'
                  : 'bg-gradient-to-r from-blue-500 to-cyan-500 opacity-80 hover:opacity-100 shadow-md'
              }`}
            >
              <div className="w-10 h-10 lg:w-12 lg:h-12 rounded-full bg-white shadow-[0_4px_12px_rgba(0,0,0,0.15)] flex items-center justify-center flex-shrink-0">
                <Car className="w-4 h-4 lg:w-5 lg:h-5 text-blue-500" />
              </div>
              <span className="text-white font-semibold text-sm lg:text-base whitespace-nowrap">
                送迎車選択
              </span>
            </button>
          </div>

          {/* 右サイド：コンテンツエリア */}
          <div className="lg:col-span-3">
            <Card className="bg-white border-none shadow-lg min-h-[400px] lg:min-h-[500px]">
              <CardHeader className="border-b border-gray-100 p-4 lg:p-6">
                <CardTitle className="text-gray-800 flex items-center gap-2 lg:gap-3 text-base lg:text-xl">
                  {activeSection === 'announcement' && <><Bell className="w-4 h-4 lg:w-5 lg:h-5 text-red-500" />お知らせ</>}
                  {activeSection === 'event' && <><PartyPopper className="w-4 h-4 lg:w-5 lg:h-5 text-amber-500" />今月のイベント情報</>}
                  {activeSection === 'customer' && <><Users className="w-4 h-4 lg:w-5 lg:h-5 text-purple-500" />顧客管理 - 接客履歴</>}
                  {activeSection === 'reservation' && <><Calendar className="w-4 h-4 lg:w-5 lg:h-5 text-pink-500" />予約状況</>}
                  {activeSection === 'performance' && <><TrendingUp className="w-4 h-4 lg:w-5 lg:h-5 text-cyan-500" />マイ実績</>}
                  {activeSection === 'hime-reservation' && <><CalendarPlus className="w-4 h-4 lg:w-5 lg:h-5 text-fuchsia-500" />姫予約</>}
                  {activeSection === 'back-fee' && <><Receipt className="w-4 h-4 lg:w-5 lg:h-5 text-emerald-500" />バック料金表</>}
                  {activeSection === 'attendance' && <><CalendarCheck className="w-4 h-4 lg:w-5 lg:h-5 text-orange-500" />出勤管理 - シフト提出</>}
                  {activeSection === 'car' && <><Car className="w-4 h-4 lg:w-5 lg:h-5 text-blue-500" />送迎車選択</>}
                </CardTitle>
              </CardHeader>
              <CardContent className="p-4 lg:p-6">
                {/* お知らせ */}
                {activeSection === 'announcement' && (
                  <div className="space-y-4">
                    {/* カテゴリフィルター */}
                    <div className="flex gap-2 flex-wrap">
                      <Badge variant="outline" className="cursor-pointer hover:bg-gray-100">すべて</Badge>
                      <Badge variant="outline" className="cursor-pointer hover:bg-red-50 text-red-500 border-red-200">重要</Badge>
                      <Badge variant="outline" className="cursor-pointer hover:bg-blue-50 text-blue-500 border-blue-200">キャンペーン</Badge>
                      <Badge variant="outline" className="cursor-pointer hover:bg-purple-50 text-purple-500 border-purple-200">ルール</Badge>
                      <Badge variant="outline" className="cursor-pointer hover:bg-gray-50 text-gray-500 border-gray-200">お知らせ</Badge>
                    </div>

                    {/* お知らせリスト */}
                    <div className="space-y-3">
                      {announcements.map(announcement => (
                        <div
                          key={announcement.id}
                          className={`p-4 rounded-xl border transition-colors cursor-pointer ${
                            announcement.isRead
                              ? 'bg-gray-50 border-gray-200'
                              : 'bg-white border-red-200 shadow-sm'
                          }`}
                          onClick={() => markAnnouncementAsRead(announcement.id)}
                        >
                          <div className="flex items-start justify-between gap-3">
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 mb-1 flex-wrap">
                                {!announcement.isRead && (
                                  <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
                                )}
                                {announcement.priority === 'high' && (
                                  <Badge className="bg-red-500 text-white text-[10px]">重要</Badge>
                                )}
                                <Badge variant="outline" className="text-[10px]">
                                  {announcement.category === 'campaign' ? 'キャンペーン' :
                                   announcement.category === 'rule' ? 'ルール' : 'お知らせ'}
                                </Badge>
                                <span className="text-xs text-gray-400">{announcement.date}</span>
                              </div>
                              <h3 className="font-bold text-gray-800 text-sm lg:text-base mb-1">
                                {announcement.title}
                              </h3>
                              <p className="text-gray-600 text-sm">{announcement.content}</p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* イベント情報 */}
                {activeSection === 'event' && (
                  <div className="space-y-4">
                    {/* 月表示 */}
                    <div className="text-center">
                      <span className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-amber-100 to-yellow-100 rounded-full text-amber-700 font-bold">
                        <Sparkles className="w-4 h-4" />
                        {currentMonth}のイベント
                      </span>
                    </div>

                    {/* フィルター */}
                    <div className="flex flex-wrap gap-2">
                      <button
                        onClick={() => setEventFilter('all')}
                        className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
                          eventFilter === 'all'
                            ? 'bg-amber-500 text-white'
                            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                        }`}
                      >
                        すべて
                      </button>
                      <button
                        onClick={() => setEventFilter('group')}
                        className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors flex items-center gap-1 ${
                          eventFilter === 'group'
                            ? 'bg-purple-500 text-white'
                            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                        }`}
                      >
                        <Sparkles className="w-3 h-3" />
                        グループ全店
                      </button>
                      {storeList.filter(s => s.id !== 'all').map(store => (
                        <button
                          key={store.id}
                          onClick={() => setEventFilter(store.name)}
                          className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors flex items-center gap-1 ${
                            eventFilter === store.name
                              ? 'bg-blue-500 text-white'
                              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                          }`}
                        >
                          <Store className="w-3 h-3" />
                          {store.name}
                        </button>
                      ))}
                    </div>

                    {/* イベントリスト */}
                    <div className="space-y-3">
                      {filteredEvents.length === 0 ? (
                        <div className="text-center py-8 text-gray-500">
                          <PartyPopper className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                          <p>選択した条件に該当するイベントはありません</p>
                        </div>
                      ) : (
                        filteredEvents.map(event => (
                          <div
                            key={event.id}
                            className={`p-4 rounded-xl border-l-4 transition-all hover:shadow-md ${
                              event.type === 'group'
                                ? 'bg-gradient-to-r from-purple-50 to-pink-50 border-purple-500'
                                : event.color === 'amber'
                                ? 'bg-gradient-to-r from-amber-50 to-yellow-50 border-amber-500'
                                : event.color === 'blue'
                                ? 'bg-gradient-to-r from-blue-50 to-cyan-50 border-blue-500'
                                : event.color === 'green'
                                ? 'bg-gradient-to-r from-green-50 to-emerald-50 border-green-500'
                                : event.color === 'cyan'
                                ? 'bg-gradient-to-r from-cyan-50 to-teal-50 border-cyan-500'
                                : 'bg-gradient-to-r from-pink-50 to-rose-50 border-pink-500'
                            }`}
                          >
                            <div className="flex items-start justify-between gap-3">
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2 flex-wrap mb-2">
                                  <Badge className={`text-[10px] ${
                                    event.type === 'group'
                                      ? 'bg-purple-500'
                                      : 'bg-blue-500'
                                  }`}>
                                    {event.type === 'group' ? 'グループ' : event.storeName}
                                  </Badge>
                                  <span className="text-xs text-gray-500">
                                    {event.startDate === event.endDate
                                      ? event.startDate
                                      : `${event.startDate} 〜 ${event.endDate}`}
                                  </span>
                                </div>
                                <h3 className="font-bold text-gray-800 text-base lg:text-lg mb-1 flex items-center gap-2">
                                  {event.icon === 'gift' && <Gift className="w-4 h-4 text-green-500" />}
                                  {event.icon === 'sparkle' && <Sparkles className="w-4 h-4 text-purple-500" />}
                                  {event.icon === 'star' && <Award className="w-4 h-4 text-amber-500" />}
                                  {event.title}
                                </h3>
                                <p className="text-gray-600 text-sm">{event.description}</p>
                              </div>
                            </div>
                          </div>
                        ))
                      )}
                    </div>

                    {/* 過去のイベント確認リンク */}
                    <div className="text-center pt-4">
                      <button className="text-sm text-gray-500 hover:text-amber-600 transition-colors flex items-center gap-1 mx-auto">
                        <History className="w-4 h-4" />
                        過去のイベントを確認する
                      </button>
                    </div>
                  </div>
                )}

                {/* 顧客管理 */}
                {activeSection === 'customer' && (
                  <div className="space-y-3 lg:space-y-4">
                    {/* 検索バーとフィルター */}
                    <div className="flex flex-col gap-3">
                      {/* 検索バー */}
                      <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <Input
                          placeholder="名前・あだ名・会員番号・来店日・フリーワードで検索..."
                          value={customerSearchQuery}
                          onChange={(e) => setCustomerSearchQuery(e.target.value)}
                          className="pl-10 bg-white border-gray-200 text-gray-800 placeholder:text-gray-400 text-sm lg:text-base"
                        />
                      </div>

                      {/* 系列店フィルター + カレンダー */}
                      <div className="flex flex-wrap gap-2">
                        {/* 系列店フィルター */}
                        <Select value={selectedStore} onValueChange={setSelectedStore}>
                          <SelectTrigger className="w-[140px] h-9 text-sm">
                            <Store className="w-4 h-4 mr-1" />
                            <SelectValue placeholder="店舗" />
                          </SelectTrigger>
                          <SelectContent>
                            {storeList.map(store => (
                              <SelectItem key={store.id} value={store.id}>{store.name}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>

                        {/* カレンダー日付指定 */}
                        <Popover open={showCalendar} onOpenChange={setShowCalendar}>
                          <PopoverTrigger asChild>
                            <Button variant="outline" className="h-9 text-sm gap-2">
                              <Calendar className="w-4 h-4" />
                              {selectedDate || '日付指定'}
                              {selectedDate && (
                                <X
                                  className="w-3 h-3 ml-1 hover:text-red-500"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setSelectedDate(null);
                                  }}
                                />
                              )}
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-3" align="start">
                            <div className="space-y-2">
                              <div className="flex items-center justify-between">
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => setCalendarMonth(new Date(calendarMonth.getFullYear(), calendarMonth.getMonth() - 1))}
                                >
                                  <ChevronLeft className="w-4 h-4" />
                                </Button>
                                <span className="font-medium">
                                  {calendarMonth.getFullYear()}年{calendarMonth.getMonth() + 1}月
                                </span>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => setCalendarMonth(new Date(calendarMonth.getFullYear(), calendarMonth.getMonth() + 1))}
                                >
                                  <ChevronRight className="w-4 h-4" />
                                </Button>
                              </div>
                              <div className="grid grid-cols-7 gap-1 text-center text-xs">
                                {['日', '月', '火', '水', '木', '金', '土'].map(day => (
                                  <div key={day} className="p-1 text-gray-500 font-medium">{day}</div>
                                ))}
                                {getDaysInMonth(calendarMonth).map((day, idx) => (
                                  <button
                                    key={idx}
                                    disabled={day === null}
                                    onClick={() => {
                                      if (day) {
                                        const dateStr = formatDateForCalendar(calendarMonth.getFullYear(), calendarMonth.getMonth(), day);
                                        setSelectedDate(dateStr);
                                        setShowCalendar(false);
                                      }
                                    }}
                                    className={`p-1.5 rounded text-sm ${
                                      day === null ? '' :
                                      selectedDate === formatDateForCalendar(calendarMonth.getFullYear(), calendarMonth.getMonth(), day)
                                        ? 'bg-purple-600 text-white'
                                        : 'hover:bg-gray-100'
                                    }`}
                                  >
                                    {day}
                                  </button>
                                ))}
                              </div>
                            </div>
                          </PopoverContent>
                        </Popover>
                      </div>

                      {/* ボタンとソート */}
                      <div className="flex flex-col sm:flex-row gap-2 sm:items-center sm:justify-between">
                        <Button className="bg-purple-600 hover:bg-purple-700 text-sm lg:text-base">
                          <Plus className="w-4 h-4 mr-1 lg:mr-2" />新規顧客追加
                        </Button>
                        <div className="flex items-center gap-2">
                          <ArrowUpDown className="w-4 h-4 text-gray-500" />
                          <Select value={customerSortKey} onValueChange={(value: 'customerNumber' | 'memberNumber' | 'customerName' | 'lastVisitDate' | 'latestMemoDate') => setCustomerSortKey(value)}>
                            <SelectTrigger className="w-[180px] h-9 text-sm">
                              <SelectValue placeholder="並び替え" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="lastVisitDate">最終来店日順</SelectItem>
                              <SelectItem value="latestMemoDate">最新メモ日付順</SelectItem>
                              <SelectItem value="customerNumber">顧客番号順</SelectItem>
                              <SelectItem value="memberNumber">会員番号順</SelectItem>
                              <SelectItem value="customerName">名前順</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>

                      {/* フィルター状態表示 */}
                      {(customerSearchQuery || selectedStore !== 'all' || selectedDate) && (
                        <div className="flex flex-wrap items-center gap-2 text-sm">
                          <span className="text-gray-500">絞り込み:</span>
                          {selectedStore !== 'all' && (
                            <Badge variant="secondary" className="gap-1">
                              <Store className="w-3 h-3" />
                              {storeList.find(s => s.id === selectedStore)?.name}
                              <X className="w-3 h-3 cursor-pointer" onClick={() => setSelectedStore('all')} />
                            </Badge>
                          )}
                          {selectedDate && (
                            <Badge variant="secondary" className="gap-1">
                              <Calendar className="w-3 h-3" />
                              {selectedDate}
                              <X className="w-3 h-3 cursor-pointer" onClick={() => setSelectedDate(null)} />
                            </Badge>
                          )}
                          {customerSearchQuery && (
                            <Badge variant="secondary" className="gap-1">
                              <Search className="w-3 h-3" />
                              {customerSearchQuery}
                              <X className="w-3 h-3 cursor-pointer" onClick={() => setCustomerSearchQuery('')} />
                            </Badge>
                          )}
                          <span className="text-gray-500 ml-2">
                            {filteredAndSortedCustomerHistory.length}件
                          </span>
                        </div>
                      )}
                    </div>

                    {/* 検索結果が0件の場合 */}
                    {filteredAndSortedCustomerHistory.length === 0 && customerSearchQuery && (
                      <div className="text-center py-8 text-gray-500">
                        <Search className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                        <p className="text-base font-medium">「{customerSearchQuery}」に一致する顧客が見つかりません</p>
                        <p className="text-sm mt-1">別のキーワードで検索してください</p>
                      </div>
                    )}

                    <div className="grid gap-3 lg:gap-4">
                      {filteredAndSortedCustomerHistory.map(customer => (
                        <div key={customer.id} className="bg-gray-50 rounded-xl overflow-hidden">
                          {/* 顧客ヘッダー（クリックで展開） */}
                          <div
                            className="p-3 lg:p-4 cursor-pointer hover:bg-gray-100 transition-colors"
                            onClick={() => setExpandedCustomerId(expandedCustomerId === customer.id ? null : customer.id)}
                          >
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-3">
                                <div className="w-10 h-10 lg:w-12 lg:h-12 rounded-full bg-purple-100 flex items-center justify-center flex-shrink-0">
                                  <User className="w-5 h-5 lg:w-6 lg:h-6 text-purple-500" />
                                </div>
                                <div className="min-w-0">
                                  <div className="flex items-center gap-2 flex-wrap">
                                    <span className="font-bold text-gray-800 text-base lg:text-lg">{customer.customerName}</span>
                                    {/* あだ名表示・編集 */}
                                    {editingNicknameId === customer.id ? (
                                      <div className="flex items-center gap-1" onClick={(e) => e.stopPropagation()}>
                                        <Input
                                          value={editingNicknameValue}
                                          onChange={(e) => setEditingNicknameValue(e.target.value)}
                                          className="h-6 w-20 text-xs px-1"
                                          placeholder="あだ名"
                                        />
                                        <Button
                                          size="sm"
                                          className="h-6 px-2 text-xs"
                                          onClick={() => handleUpdateNickname(customer.id)}
                                        >
                                          <Save className="w-3 h-3" />
                                        </Button>
                                        <Button
                                          size="sm"
                                          variant="ghost"
                                          className="h-6 px-1 text-xs"
                                          onClick={() => setEditingNicknameId(null)}
                                        >
                                          <X className="w-3 h-3" />
                                        </Button>
                                      </div>
                                    ) : customer.nickname ? (
                                      <span
                                        className="text-xs bg-pink-100 text-pink-600 px-2 py-0.5 rounded cursor-pointer hover:bg-pink-200"
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          setEditingNicknameId(customer.id);
                                          setEditingNicknameValue(customer.nickname);
                                        }}
                                      >
                                        {customer.nickname}
                                      </span>
                                    ) : (
                                      <button
                                        className="text-[10px] text-gray-400 hover:text-purple-500 flex items-center gap-0.5"
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          setEditingNicknameId(customer.id);
                                          setEditingNicknameValue('');
                                        }}
                                      >
                                        <Plus className="w-3 h-3" />あだ名
                                      </button>
                                    )}
                                    <span className="text-xs bg-blue-600 text-white px-2 py-0.5 rounded font-mono font-semibold">{customer.customerNumber}</span>
                                    <span className="text-xs bg-purple-600 text-white px-2 py-0.5 rounded font-mono font-semibold">{customer.memberNumber}</span>
                                  </div>
                                  <div className="flex items-center gap-2 text-xs text-gray-500 flex-wrap mt-1">
                                    <span className="flex items-center gap-1">
                                      <Calendar className="w-3 h-3" />
                                      来店: {customer.lastVisitDate}
                                    </span>
                                    <span className="bg-purple-100 text-purple-600 px-1.5 py-0.5 rounded">
                                      メモ {customer.memoHistory.length}件
                                    </span>
                                    {/* 店舗バッジ */}
                                    <span className="bg-gray-100 text-gray-600 px-1.5 py-0.5 rounded flex items-center gap-1">
                                      <Store className="w-3 h-3" />
                                      {storeList.find(s => s.id === customer.storeId)?.name || '不明'}
                                    </span>
                                  </div>
                                </div>
                              </div>
                              <span className={`transform transition-transform flex-shrink-0 ${expandedCustomerId === customer.id ? 'rotate-180' : ''}`}>
                                ▼
                              </span>
                            </div>
                            {/* 最新メモ or 検索マッチしたメモプレビュー */}
                            {customer.memoHistory.length > 0 && expandedCustomerId !== customer.id && (() => {
                              // 検索クエリがある場合、マッチしたメモを優先表示
                              const query = customerSearchQuery.toLowerCase().trim();
                              let displayMemo = customer.memoHistory[0];
                              let isSearchMatch = false;

                              if (query) {
                                const matchedMemo = customer.memoHistory.find(memo =>
                                  memo.content.toLowerCase().includes(query)
                                );
                                if (matchedMemo) {
                                  displayMemo = matchedMemo;
                                  isSearchMatch = true;
                                }
                              }

                              return (
                                <div className={`mt-2 p-2 rounded-lg border ${isSearchMatch ? 'bg-yellow-50 border-yellow-300' : 'bg-white border-gray-200'}`}>
                                  <div className="flex items-center gap-2 text-xs text-gray-400 mb-1">
                                    <Clock className="w-3 h-3" />
                                    <span className={`font-semibold ${isSearchMatch ? 'text-yellow-600' : 'text-purple-600'}`}>{displayMemo.date}</span>
                                    <span>のメモ</span>
                                    {isSearchMatch && (
                                      <span className="bg-yellow-200 text-yellow-700 px-1.5 py-0.5 rounded text-[10px] font-semibold">検索マッチ</span>
                                    )}
                                  </div>
                                  <p className="text-gray-600 text-sm line-clamp-2">{displayMemo.content}</p>
                                </div>
                              );
                            })()}
                          </div>

                          {/* 展開時：過去のメモ履歴 */}
                          {expandedCustomerId === customer.id && (
                            <div className="border-t border-gray-200">
                              {/* 新規メモ入力 */}
                              <div className="p-3 lg:p-4 bg-purple-50 border-b border-gray-200">
                                <div className="text-xs font-semibold text-purple-700 mb-2">📝 新しいメモを追加</div>
                                <div className="flex gap-2">
                                  <Textarea
                                    value={newMemoContent}
                                    onChange={(e) => setNewMemoContent(e.target.value)}
                                    placeholder="このお客様についてのメモを入力..."
                                    className="flex-1 bg-white border-purple-200 text-gray-800 text-sm min-h-[60px]"
                                  />
                                  <Button
                                    size="sm"
                                    onClick={() => handleAddNewMemo(customer.id)}
                                    className="bg-purple-600 hover:bg-purple-700 h-auto"
                                  >
                                    <Plus className="w-4 h-4" />
                                  </Button>
                                </div>
                              </div>

                              {/* メモ履歴一覧 */}
                              <div className="p-3 lg:p-4">
                                <div className="text-xs font-semibold text-gray-500 mb-3 flex items-center gap-2">
                                  <Clock className="w-3 h-3" />
                                  お客様との歴史（過去のメモ）
                                </div>
                                <div className="space-y-2 max-h-[300px] overflow-y-auto">
                                  {customer.memoHistory.map((memo, idx) => (
                                    <div
                                      key={memo.id}
                                      className={`p-3 rounded-lg border ${idx === 0 ? 'bg-purple-50 border-purple-200' : 'bg-white border-gray-200'}`}
                                    >
                                      <div className="flex items-center justify-between mb-1">
                                        <span className={`text-xs font-semibold ${idx === 0 ? 'text-purple-600' : 'text-gray-500'}`}>
                                          {memo.date}
                                        </span>
                                        <div className="flex items-center gap-2">
                                          <span className="text-xs bg-gray-100 px-1.5 py-0.5 rounded text-gray-500">
                                            {memo.author}
                                          </span>
                                          {/* メモ削除ボタン */}
                                          <AlertDialog>
                                            <AlertDialogTrigger asChild>
                                              <button className="text-gray-400 hover:text-red-500 transition-colors">
                                                <Trash2 className="w-3.5 h-3.5" />
                                              </button>
                                            </AlertDialogTrigger>
                                            <AlertDialogContent>
                                              <AlertDialogHeader>
                                                <AlertDialogTitle>メモを削除しますか？</AlertDialogTitle>
                                                <AlertDialogDescription>
                                                  このメモを削除すると元に戻せません。本当に削除しますか？
                                                </AlertDialogDescription>
                                              </AlertDialogHeader>
                                              <AlertDialogFooter>
                                                <AlertDialogCancel>キャンセル</AlertDialogCancel>
                                                <AlertDialogAction
                                                  className="bg-red-500 hover:bg-red-600"
                                                  onClick={() => handleDeleteMemo(customer.id, memo.id)}
                                                >
                                                  削除する
                                                </AlertDialogAction>
                                              </AlertDialogFooter>
                                            </AlertDialogContent>
                                          </AlertDialog>
                                        </div>
                                      </div>
                                      <p className="text-gray-700 text-sm">{memo.content}</p>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* 予約状況（タイムツリー形式） */}
                {activeSection === 'reservation' && (
                  <div className="space-y-4">
                    {/* 日付選択 */}
                    <div className="flex items-center gap-3">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          const date = new Date(reservationSelectedDate);
                          date.setDate(date.getDate() - 1);
                          setReservationSelectedDate(date.toISOString().split('T')[0]);
                        }}
                      >
                        <ChevronLeft className="w-4 h-4" />
                      </Button>
                      <div className="flex-1 text-center">
                        <div className="font-bold text-lg text-gray-800">{reservationSelectedDate}</div>
                        <div className="text-sm text-gray-500">
                          {filteredReservations.length}件の予約
                        </div>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          const date = new Date(reservationSelectedDate);
                          date.setDate(date.getDate() + 1);
                          setReservationSelectedDate(date.toISOString().split('T')[0]);
                        }}
                      >
                        <ChevronRight className="w-4 h-4" />
                      </Button>
                    </div>

                    {/* タイムライン */}
                    <div className="relative">
                      {/* 時間軸 */}
                      <div className="absolute left-0 top-0 bottom-0 w-16 bg-gray-50 rounded-l-xl" />

                      <div className="space-y-0">
                        {filteredReservations.length === 0 ? (
                          <div className="text-center py-12 text-gray-500">
                            <Calendar className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                            <p>この日の予約はありません</p>
                          </div>
                        ) : (
                          filteredReservations
                            .sort((a, b) => a.startTime.localeCompare(b.startTime))
                            .map((reservation, idx) => (
                              <div key={reservation.id} className="flex">
                                {/* 時間表示 */}
                                <div className="w-16 flex-shrink-0 relative">
                                  <div className="absolute top-4 left-2 text-xs font-semibold text-gray-600">
                                    {reservation.startTime}
                                  </div>
                                  {idx < filteredReservations.length - 1 && (
                                    <div className="absolute left-8 top-8 bottom-0 w-0.5 bg-gray-200" />
                                  )}
                                </div>

                                {/* 予約カード */}
                                <div className={`flex-1 mb-3 p-4 rounded-xl border-l-4 ${
                                  reservation.status === 'confirmed'
                                    ? 'bg-green-50 border-green-500'
                                    : 'bg-yellow-50 border-yellow-500'
                                }`}>
                                  <div className="flex items-start justify-between gap-2 mb-2">
                                    <div>
                                      <div className="flex items-center gap-2 flex-wrap">
                                        <span className="font-bold text-gray-800">{reservation.customerName}</span>
                                        <span className="text-xs bg-gray-200 text-gray-600 px-1.5 py-0.5 rounded font-mono">
                                          {reservation.memberNumber}
                                        </span>
                                        <Badge className={`text-[10px] ${
                                          reservation.nominationType === '本指名' ? 'bg-pink-500' :
                                          reservation.nominationType === '場内指名' ? 'bg-purple-500' :
                                          'bg-gray-500'
                                        }`}>
                                          {reservation.nominationType}
                                        </Badge>
                                      </div>
                                      <div className="text-xs text-gray-500 mt-1">
                                        {reservation.startTime} - {reservation.endTime} ({reservation.course})
                                      </div>
                                    </div>
                                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                                      reservation.status === 'confirmed'
                                        ? 'bg-green-100 text-green-600'
                                        : 'bg-yellow-100 text-yellow-600'
                                    }`}>
                                      {reservation.status === 'confirmed' ? '確定' : '仮予約'}
                                    </span>
                                  </div>

                                  <div className="grid grid-cols-2 gap-2 text-xs text-gray-600">
                                    <div className="flex items-center gap-1">
                                      <Store className="w-3 h-3" />
                                      {reservation.storeName}
                                    </div>
                                    <div className="flex items-center gap-1">
                                      <MapPin className="w-3 h-3" />
                                      {reservation.area}
                                    </div>
                                  </div>
                                  <div className="text-xs text-gray-600 mt-1 flex items-center gap-1">
                                    <Building2 className="w-3 h-3" />
                                    {reservation.location}
                                  </div>
                                </div>
                              </div>
                            ))
                        )}
                      </div>
                    </div>
                  </div>
                )}

                {/* マイ実績 */}
                {activeSection === 'performance' && (
                  <div className="space-y-4 lg:space-y-6">
                    {/* 月選択 */}
                    <div className="flex items-center justify-between">
                      <Select value={selectedPerformanceMonth} onValueChange={setSelectedPerformanceMonth}>
                        <SelectTrigger className="w-[140px] h-9 text-sm">
                          <History className="w-4 h-4 mr-1" />
                          <SelectValue placeholder="月を選択" />
                        </SelectTrigger>
                        <SelectContent>
                          {Object.keys(performanceHistory).map(month => (
                            <SelectItem key={month} value={month}>
                              {month.replace('-', '年')}月
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <div className="text-sm text-gray-500">
                        {selectedPerformanceMonth.replace('-', '年')}月の実績
                      </div>
                    </div>

                    {/* 総合評価カード */}
                    <div className={`p-4 lg:p-6 ${rankInfo.bgColor} rounded-2xl border-2 ${rankInfo.borderColor}`}>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <div className="w-16 h-16 lg:w-24 lg:h-24 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
                            <span className="text-4xl lg:text-6xl font-bold text-white">{rankInfo.rank}</span>
                          </div>
                          <div>
                            <div className="text-white/80 text-xs lg:text-sm">総合評価</div>
                            <div className="text-2xl lg:text-4xl font-bold text-white">
                              {totalScore}<span className="text-lg lg:text-xl text-white/70">/100点</span>
                            </div>
                            <div className="w-24 lg:w-32 h-2 bg-white/30 rounded-full mt-2">
                              <div
                                className="h-full bg-white rounded-full transition-all"
                                style={{ width: `${totalScore}%` }}
                              />
                            </div>
                          </div>
                        </div>
                        <div className="text-right text-white">
                          <div className="text-xs lg:text-sm text-white/70">指名率</div>
                          <div className="text-xl lg:text-2xl font-bold">{currentPerformance.nominationRate}%</div>
                        </div>
                      </div>
                    </div>

                    {/* 総所得・順位 */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-3 lg:gap-4">
                      <div className="p-4 lg:p-5 bg-gradient-to-r from-amber-400 to-orange-500 rounded-2xl">
                        <div className="text-white/80 text-xs lg:text-sm mb-1">当月所得</div>
                        <div className="text-xl lg:text-2xl font-bold text-white">
                          ¥{currentPerformance.totalIncome.toLocaleString()}
                        </div>
                        <div className="text-white/60 text-xs mt-1">
                          累計: ¥{totalEarnings.toLocaleString()}
                        </div>
                      </div>
                      <div className="p-4 lg:p-5 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl text-center">
                        <div className="text-white/80 text-xs lg:text-sm mb-1">グループ順位</div>
                        <div className="text-2xl lg:text-3xl font-bold text-white">{rankingData.groupRank}位</div>
                        <div className="text-white/60 text-xs">/ {rankingData.groupTotal}人中</div>
                      </div>
                      <div className="p-4 lg:p-5 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-2xl text-center">
                        <div className="text-white/80 text-xs lg:text-sm mb-1">{rankingData.storeName}順位</div>
                        <div className="text-2xl lg:text-3xl font-bold text-white">{rankingData.storeRank}位</div>
                        <div className="text-white/60 text-xs">/ {rankingData.storeTotal}人中</div>
                      </div>
                    </div>

                    {/* 派遣・指名サマリー */}
                    <div className="grid grid-cols-3 gap-2 lg:gap-4">
                      <div className="p-3 lg:p-4 bg-pink-50 rounded-xl text-center">
                        <div className="text-xl lg:text-2xl font-bold text-pink-600">{currentPerformance.dispatchCount}</div>
                        <div className="text-xs text-gray-600">派遣数</div>
                      </div>
                      <div className="p-3 lg:p-4 bg-purple-50 rounded-xl text-center">
                        <div className="text-xl lg:text-2xl font-bold text-purple-600">{currentPerformance.nominationCount}</div>
                        <div className="text-xs text-gray-600">指名数</div>
                      </div>
                      <div className="p-3 lg:p-4 bg-blue-50 rounded-xl text-center">
                        <div className="text-xl lg:text-2xl font-bold text-blue-600">{currentPerformance.workDays}日</div>
                        <div className="text-xs text-gray-600">出勤日数</div>
                      </div>
                    </div>

                    {/* 評価項目詳細 */}
                    <div className="bg-gray-50 rounded-xl p-3 lg:p-4">
                      <div className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                        <TrendingUp className="w-4 h-4 text-cyan-500" />
                        評価項目詳細
                      </div>
                      <div className="space-y-2">
                        {/* 合計PVポイント */}
                        <div className="flex items-center justify-between p-2 bg-white rounded-lg">
                          <div className="flex-1">
                            <div className="text-sm font-medium text-gray-700">合計PVポイント</div>
                            <div className="text-xs text-gray-500">{currentPerformance.totalPV.toLocaleString()} PV</div>
                          </div>
                          <div className="flex items-center gap-2">
                            <Badge variant="outline" className="text-xs">{scores.totalPV.label}</Badge>
                            <div className="w-12 text-right font-bold text-pink-600">{scores.totalPV.score}/{scores.totalPV.maxScore}</div>
                          </div>
                        </div>

                        {/* 出勤日平均PVポイント（NEW） */}
                        <div className="flex items-center justify-between p-2 bg-yellow-50 rounded-lg border border-yellow-200">
                          <div className="flex-1">
                            <div className="text-sm font-medium text-gray-700 flex items-center gap-1">
                              出勤日平均PVポイント
                              <Badge className="bg-yellow-500 text-white text-[10px] px-1">NEW</Badge>
                            </div>
                            <div className="text-xs text-gray-500">{avgPVPerDay.toLocaleString()} PV/日</div>
                          </div>
                          <div className="flex items-center gap-2">
                            <Badge variant="outline" className="text-xs">{scores.avgPV.label}</Badge>
                            <div className="w-12 text-right font-bold text-pink-600">{scores.avgPV.score}/{scores.avgPV.maxScore}</div>
                          </div>
                        </div>

                        {/* マイガール人数ポイント */}
                        <div className="flex items-center justify-between p-2 bg-white rounded-lg">
                          <div className="flex-1">
                            <div className="text-sm font-medium text-gray-700">マイガール人数ポイント</div>
                            <div className="text-xs text-gray-500">{currentPerformance.myGirlCount.toLocaleString()}人</div>
                          </div>
                          <div className="flex items-center gap-2">
                            <Badge variant="outline" className="text-xs">{scores.myGirlCount.label}</Badge>
                            <div className="w-12 text-right font-bold text-pink-600">{scores.myGirlCount.score}/{scores.myGirlCount.maxScore}</div>
                          </div>
                        </div>

                        {/* マイガール増加ポイント（NEW） */}
                        <div className="flex items-center justify-between p-2 bg-yellow-50 rounded-lg border border-yellow-200">
                          <div className="flex-1">
                            <div className="text-sm font-medium text-gray-700 flex items-center gap-1">
                              マイガール増加ポイント
                              <Badge className="bg-yellow-500 text-white text-[10px] px-1">NEW</Badge>
                            </div>
                            <div className="text-xs text-gray-500">+{currentPerformance.myGirlIncrease}人</div>
                          </div>
                          <div className="flex items-center gap-2">
                            <Badge variant="outline" className="text-xs">{scores.myGirlIncrease.label}</Badge>
                            <div className="w-12 text-right font-bold text-pink-600">{scores.myGirlIncrease.score}/{scores.myGirlIncrease.maxScore}</div>
                          </div>
                        </div>

                        {/* WEB予約ポイント */}
                        <div className="flex items-center justify-between p-2 bg-white rounded-lg">
                          <div className="flex-1">
                            <div className="text-sm font-medium text-gray-700">WEB予約ポイント</div>
                            <div className="text-xs text-gray-500">{currentPerformance.webReservation}本</div>
                          </div>
                          <div className="flex items-center gap-2">
                            <Badge variant="outline" className="text-xs">{scores.webReservation.label}</Badge>
                            <div className="w-12 text-right font-bold text-pink-600">{scores.webReservation.score}/{scores.webReservation.maxScore}</div>
                          </div>
                        </div>

                        {/* 姫デコログインポイント */}
                        <div className="flex items-center justify-between p-2 bg-white rounded-lg">
                          <div className="flex-1">
                            <div className="text-sm font-medium text-gray-700">姫デコログインポイント</div>
                            <div className="text-xs text-gray-500">{currentPerformance.himeDecoLogin ? 'SPログイン済' : '未ログイン'}</div>
                          </div>
                          <div className="flex items-center gap-2">
                            <Badge variant="outline" className={`text-xs ${currentPerformance.himeDecoLogin ? 'border-green-500 text-green-600' : ''}`}>
                              {scores.himeDecoLogin.label}
                            </Badge>
                            <div className="w-12 text-right font-bold text-pink-600">{scores.himeDecoLogin.score}/{scores.himeDecoLogin.maxScore}</div>
                          </div>
                        </div>

                        {/* 写メ日記ポイント */}
                        <div className="flex items-center justify-between p-2 bg-white rounded-lg">
                          <div className="flex-1">
                            <div className="text-sm font-medium text-gray-700">写メ日記ポイント</div>
                            <div className="text-xs text-gray-500">{currentPerformance.photoDiary}本</div>
                          </div>
                          <div className="flex items-center gap-2">
                            <Badge variant="outline" className="text-xs">{scores.photoDiary.label}</Badge>
                            <div className="w-12 text-right font-bold text-pink-600">{scores.photoDiary.score}/{scores.photoDiary.maxScore}</div>
                          </div>
                        </div>

                        {/* 日記ポイント */}
                        <div className="flex items-center justify-between p-2 bg-white rounded-lg">
                          <div className="flex-1">
                            <div className="text-sm font-medium text-gray-700">日記ポイント</div>
                            <div className="text-xs text-gray-500">{currentPerformance.diary}本</div>
                          </div>
                          <div className="flex items-center gap-2">
                            <Badge variant="outline" className="text-xs">{scores.diary.label}</Badge>
                            <div className="w-12 text-right font-bold text-pink-600">{scores.diary.score}/{scores.diary.maxScore}</div>
                          </div>
                        </div>

                        {/* 動画日記ポイント */}
                        <div className="flex items-center justify-between p-2 bg-white rounded-lg">
                          <div className="flex-1">
                            <div className="text-sm font-medium text-gray-700">動画日記ポイント</div>
                            <div className="text-xs text-gray-500">{currentPerformance.videoDiary}本</div>
                          </div>
                          <div className="flex items-center gap-2">
                            <Badge variant="outline" className="text-xs">{scores.videoDiary.label}</Badge>
                            <div className="w-12 text-right font-bold text-pink-600">{scores.videoDiary.score}/{scores.videoDiary.maxScore}</div>
                          </div>
                        </div>

                        {/* キテネポイント */}
                        <div className="flex items-center justify-between p-2 bg-white rounded-lg">
                          <div className="flex-1">
                            <div className="text-sm font-medium text-gray-700">キテネポイント</div>
                            <div className="text-xs text-gray-500">{currentPerformance.kitene}回</div>
                          </div>
                          <div className="flex items-center gap-2">
                            <Badge variant="outline" className="text-xs">{scores.kitene.label}</Badge>
                            <div className="w-12 text-right font-bold text-pink-600">{scores.kitene.score}/{scores.kitene.maxScore}</div>
                          </div>
                        </div>

                        {/* 口コミポイント */}
                        <div className="flex items-center justify-between p-2 bg-white rounded-lg">
                          <div className="flex-1">
                            <div className="text-sm font-medium text-gray-700">口コミポイント</div>
                            <div className="text-xs text-gray-500">{currentPerformance.reviews}件</div>
                          </div>
                          <div className="flex items-center gap-2">
                            <Badge variant="outline" className="text-xs">{scores.reviews.label}</Badge>
                            <div className="w-12 text-right font-bold text-pink-600">{scores.reviews.score}/{scores.reviews.maxScore}</div>
                          </div>
                        </div>

                        {/* オキニトーク送信ポイント */}
                        <div className="flex items-center justify-between p-2 bg-white rounded-lg">
                          <div className="flex-1">
                            <div className="text-sm font-medium text-gray-700">オキニトーク送信ポイント</div>
                            <div className="text-xs text-gray-500">{currentPerformance.okiniSend}回</div>
                          </div>
                          <div className="flex items-center gap-2">
                            <Badge variant="outline" className="text-xs">{scores.okiniSend.label}</Badge>
                            <div className="w-12 text-right font-bold text-pink-600">{scores.okiniSend.score}/{scores.okiniSend.maxScore}</div>
                          </div>
                        </div>

                        {/* オキニトーク返信ポイント（NEW） */}
                        <div className="flex items-center justify-between p-2 bg-yellow-50 rounded-lg border border-yellow-200">
                          <div className="flex-1">
                            <div className="text-sm font-medium text-gray-700 flex items-center gap-1">
                              オキニトーク返信ポイント
                              <Badge className="bg-yellow-500 text-white text-[10px] px-1">NEW</Badge>
                            </div>
                            <div className="text-xs text-gray-500">{currentPerformance.okiniReply}人</div>
                          </div>
                          <div className="flex items-center gap-2">
                            <Badge variant="outline" className="text-xs">{scores.okiniReply.label}</Badge>
                            <div className="w-12 text-right font-bold text-pink-600">{scores.okiniReply.score}/{scores.okiniReply.maxScore}</div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* 過去実績履歴 */}
                    <div className="bg-gray-50 rounded-xl p-3 lg:p-4">
                      <div className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                        <History className="w-4 h-4 text-cyan-500" />
                        過去の実績履歴
                      </div>
                      <div className="space-y-2">
                        {Object.entries(performanceHistory)
                          .sort(([a], [b]) => b.localeCompare(a))
                          .map(([monthKey, data]) => {
                            const [year, month] = monthKey.split('-');
                            // 各月のスコア計算
                            const monthAvgPV = data.workDays > 0 ? Math.round(data.totalPV / data.workDays) : 0;
                            const monthTotalScore =
                              calculateScore(data.totalPV, totalPVCriteria).score +
                              calculateScore(monthAvgPV, avgPVCriteria).score +
                              calculateScore(data.myGirlCount, myGirlCountCriteria).score +
                              calculateScore(data.myGirlIncrease, myGirlIncreaseCriteria).score +
                              calculateScore(data.webReservation, webReservationCriteria).score +
                              calculateScore(data.himeDecoLogin ? 1 : 0, himeDecoLoginCriteria).score +
                              calculateScore(data.photoDiary, photoDiaryCriteria).score +
                              calculateScore(data.diary, diaryCriteria).score +
                              calculateScore(data.videoDiary, videoDiaryCriteria).score +
                              calculateScore(data.kitene, kiteneCriteria).score +
                              calculateScore(data.reviews, reviewCriteria).score +
                              calculateScore(data.okiniSend, okiniSendCriteria).score +
                              calculateScore(data.okiniReply, okiniReplyCriteria).score;
                            const monthRankInfo = calculateRank(monthTotalScore);
                            const isSelected = monthKey === selectedPerformanceMonth;
                            return (
                              <div
                                key={monthKey}
                                className={`flex items-center justify-between p-3 rounded-lg cursor-pointer transition-all ${
                                  isSelected ? 'bg-pink-100 border-2 border-pink-300' : 'bg-white hover:bg-gray-100'
                                }`}
                                onClick={() => setSelectedPerformanceMonth(monthKey)}
                              >
                                <div className="flex items-center gap-3">
                                  <div className={`w-10 h-10 ${monthRankInfo.bgColor} rounded-full flex items-center justify-center`}>
                                    <span className="text-lg font-bold text-white">{monthRankInfo.rank}</span>
                                  </div>
                                  <div>
                                    <div className="font-semibold text-gray-800">{year}年{Number(month)}月</div>
                                    <div className="text-xs text-gray-500">
                                      グループ{data.groupRank}位 / 店舗{data.storeRank}位
                                    </div>
                                  </div>
                                </div>
                                <div className="text-right">
                                  <div className="font-bold text-green-600">¥{data.totalIncome.toLocaleString()}</div>
                                  <div className="text-xs text-gray-500">
                                    {monthTotalScore}点 / 指名率{data.nominationRate}%
                                  </div>
                                </div>
                              </div>
                            );
                          })}
                      </div>
                    </div>

                    {/* 過去6ヶ月の所得推移グラフ */}
                    <div className="p-4 bg-gray-50 rounded-xl">
                      <div className="text-sm font-semibold text-gray-600 mb-3">過去6ヶ月の所得推移</div>
                      <div className="flex items-end gap-2 h-24">
                        {Object.entries(performanceHistory).reverse().map(([month, data]) => {
                          const maxIncome = Math.max(...Object.values(performanceHistory).map(d => d.totalIncome));
                          const height = (data.totalIncome / maxIncome) * 100;
                          return (
                            <div key={month} className="flex-1 flex flex-col items-center">
                              <div
                                className={`w-full rounded-t transition-all ${selectedPerformanceMonth === month ? 'bg-purple-500' : 'bg-gray-300'}`}
                                style={{ height: `${height}%` }}
                              />
                              <div className="text-[10px] text-gray-500 mt-1">{month.split('-')[1]}月</div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                )}

                {/* 姫予約 */}
                {activeSection === 'hime-reservation' && (
                  <div className="space-y-4 lg:space-y-6">
                    <div className="p-4 lg:p-6 bg-gradient-to-r from-fuchsia-50 to-pink-50 rounded-xl border border-fuchsia-200">
                      <div className="text-sm font-semibold text-fuchsia-700 mb-4 flex items-center gap-2">
                        <CalendarPlus className="w-4 h-4" />
                        予約状況を確認しながら、自分で予約を登録できます
                      </div>

                      <div className="grid gap-4">
                        {/* 日付・時間 */}
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                          <div>
                            <label className="text-xs font-semibold text-gray-600 mb-1 block">日付</label>
                            <Input
                              type="date"
                              value={himeReservation.date}
                              onChange={(e) => setHimeReservation(prev => ({ ...prev, date: e.target.value }))}
                              className="bg-white"
                            />
                          </div>
                          <div>
                            <label className="text-xs font-semibold text-gray-600 mb-1 block">開始時間</label>
                            <Input
                              type="time"
                              value={himeReservation.startTime}
                              onChange={(e) => setHimeReservation(prev => ({ ...prev, startTime: e.target.value }))}
                              className="bg-white"
                            />
                          </div>
                          <div>
                            <label className="text-xs font-semibold text-gray-600 mb-1 block">終了時間</label>
                            <Input
                              type="time"
                              value={himeReservation.endTime}
                              onChange={(e) => setHimeReservation(prev => ({ ...prev, endTime: e.target.value }))}
                              className="bg-white"
                            />
                          </div>
                        </div>

                        {/* 場所・コース */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          <div>
                            <label className="text-xs font-semibold text-gray-600 mb-1 block">エリア</label>
                            <Select
                              value={himeReservation.area}
                              onValueChange={(value) => setHimeReservation(prev => ({ ...prev, area: value }))}
                            >
                              <SelectTrigger className="bg-white">
                                <SelectValue placeholder="エリアを選択" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="shibuya">渋谷区</SelectItem>
                                <SelectItem value="shinjuku">新宿区</SelectItem>
                                <SelectItem value="minato">港区</SelectItem>
                                <SelectItem value="meguro">目黒区</SelectItem>
                                <SelectItem value="setagaya">世田谷区</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          <div>
                            <label className="text-xs font-semibold text-gray-600 mb-1 block">コース</label>
                            <Select
                              value={himeReservation.course}
                              onValueChange={(value) => setHimeReservation(prev => ({ ...prev, course: value }))}
                            >
                              <SelectTrigger className="bg-white">
                                <SelectValue placeholder="コースを選択" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="60min">60分コース</SelectItem>
                                <SelectItem value="90min">90分コース</SelectItem>
                                <SelectItem value="120min">120分コース</SelectItem>
                                <SelectItem value="180min">180分コース</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        </div>

                        {/* 場所詳細 */}
                        <div>
                          <label className="text-xs font-semibold text-gray-600 mb-1 block">場所（ホテル名・住所など）</label>
                          <Input
                            placeholder="例: ホテルA（渋谷区道玄坂）"
                            value={himeReservation.location}
                            onChange={(e) => setHimeReservation(prev => ({ ...prev, location: e.target.value }))}
                            className="bg-white"
                          />
                        </div>

                        {/* 登録ボタン */}
                        <Button
                          className="w-full bg-gradient-to-r from-fuchsia-500 to-pink-500 hover:from-fuchsia-600 hover:to-pink-600 text-white"
                          onClick={() => {
                            if (!himeReservation.date || !himeReservation.startTime || !himeReservation.course) {
                              alert('日付、開始時間、コースは必須です');
                              return;
                            }
                            // 伝票作成処理（実際はAPI呼び出し）
                            alert(`予約登録完了！\n\n日付: ${himeReservation.date}\n時間: ${himeReservation.startTime} - ${himeReservation.endTime}\nコース: ${himeReservation.course}\n場所: ${himeReservation.location}\n\n伝票が自動作成されました。`);
                            setHimeReservation({
                              date: '',
                              startTime: '',
                              endTime: '',
                              area: '',
                              course: '',
                              location: '',
                            });
                          }}
                        >
                          <FileText className="w-4 h-4 mr-2" />
                          予約登録して伝票作成
                        </Button>
                      </div>
                    </div>

                    {/* 予約状況プレビュー */}
                    <div className="p-4 bg-gray-50 rounded-xl">
                      <div className="text-sm font-semibold text-gray-600 mb-3">本日以降の予約状況</div>
                      <div className="space-y-2">
                        {reservations.slice(0, 3).map(reservation => (
                          <div key={reservation.id} className="p-2 bg-white rounded-lg border border-gray-200 text-sm">
                            <div className="flex items-center justify-between">
                              <span className="font-medium">{reservation.date} {reservation.startTime}</span>
                              <Badge className={reservation.status === 'confirmed' ? 'bg-green-500' : 'bg-yellow-500'}>
                                {reservation.status === 'confirmed' ? '確定' : '仮予約'}
                              </Badge>
                            </div>
                            <div className="text-gray-500 text-xs mt-1">{reservation.course} - {reservation.area}</div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {/* バック料金表 */}
                {activeSection === 'back-fee' && (
                  <div className="space-y-4 lg:space-y-6">
                    {/* コースバック */}
                    <div className="p-3 lg:p-5 bg-gradient-to-br from-emerald-50 to-green-50 rounded-xl border border-emerald-200">
                      <h4 className="font-bold text-emerald-700 mb-3 lg:mb-4 flex items-center gap-2 text-sm lg:text-base">
                        <Receipt className="w-4 h-4 lg:w-5 lg:h-5" />
                        コースバック
                      </h4>
                      <div className="overflow-x-auto">
                        <table className="w-full text-xs lg:text-sm">
                          <thead>
                            <tr className="border-b border-emerald-200">
                              <th className="text-left py-2 px-2 lg:px-3 text-gray-600 font-medium">コース名</th>
                              <th className="text-right py-2 px-2 lg:px-3 text-gray-600 font-medium">料金</th>
                              <th className="text-right py-2 px-2 lg:px-3 text-gray-600 font-medium">バック率</th>
                              <th className="text-right py-2 px-2 lg:px-3 text-emerald-600 font-bold">バック額</th>
                            </tr>
                          </thead>
                          <tbody>
                            {backFeeData.courseBack.map((item, index) => (
                              <tr key={index} className="border-b border-emerald-100 last:border-0">
                                <td className="py-2 px-2 lg:px-3 text-gray-800">{item.name}</td>
                                <td className="py-2 px-2 lg:px-3 text-right text-gray-700">¥{item.price.toLocaleString()}</td>
                                <td className="py-2 px-2 lg:px-3 text-right text-gray-700">{item.backRate}%</td>
                                <td className="py-2 px-2 lg:px-3 text-right font-bold text-emerald-600">¥{item.backAmount.toLocaleString()}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>

                    {/* 指名バック */}
                    <div className="p-3 lg:p-5 bg-gradient-to-br from-pink-50 to-rose-50 rounded-xl border border-pink-200">
                      <h4 className="font-bold text-pink-700 mb-3 lg:mb-4 flex items-center gap-2 text-sm lg:text-base">
                        <Award className="w-4 h-4 lg:w-5 lg:h-5" />
                        指名バック
                      </h4>
                      <div className="grid gap-2 lg:gap-3">
                        {backFeeData.nominationBack.map((item, index) => (
                          <div key={index} className="flex items-center justify-between p-2 lg:p-3 bg-white/60 rounded-lg">
                            <span className="text-gray-800 text-sm lg:text-base">{item.name}</span>
                            <span className="font-bold text-pink-600 text-sm lg:text-base">¥{item.amount.toLocaleString()}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* オプションバック */}
                    <div className="p-3 lg:p-5 bg-gradient-to-br from-purple-50 to-violet-50 rounded-xl border border-purple-200">
                      <h4 className="font-bold text-purple-700 mb-3 lg:mb-4 flex items-center gap-2 text-sm lg:text-base">
                        <Sparkles className="w-4 h-4 lg:w-5 lg:h-5" />
                        オプションバック
                      </h4>
                      <div className="overflow-x-auto">
                        <table className="w-full text-xs lg:text-sm">
                          <thead>
                            <tr className="border-b border-purple-200">
                              <th className="text-left py-2 px-2 lg:px-3 text-gray-600 font-medium">オプション名</th>
                              <th className="text-right py-2 px-2 lg:px-3 text-gray-600 font-medium">料金</th>
                              <th className="text-right py-2 px-2 lg:px-3 text-gray-600 font-medium">バック率</th>
                              <th className="text-right py-2 px-2 lg:px-3 text-purple-600 font-bold">バック額</th>
                            </tr>
                          </thead>
                          <tbody>
                            {backFeeData.optionBack.map((item, index) => (
                              <tr key={index} className="border-b border-purple-100 last:border-0">
                                <td className="py-2 px-2 lg:px-3 text-gray-800">{item.name}</td>
                                <td className="py-2 px-2 lg:px-3 text-right text-gray-700">¥{item.price.toLocaleString()}</td>
                                <td className="py-2 px-2 lg:px-3 text-right text-gray-700">{item.backRate}%</td>
                                <td className="py-2 px-2 lg:px-3 text-right font-bold text-purple-600">¥{item.backAmount.toLocaleString()}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>

                    {/* ボーナスバック */}
                    <div className="p-3 lg:p-5 bg-gradient-to-br from-amber-50 to-yellow-50 rounded-xl border border-amber-200">
                      <h4 className="font-bold text-amber-700 mb-3 lg:mb-4 flex items-center gap-2 text-sm lg:text-base">
                        <Gift className="w-4 h-4 lg:w-5 lg:h-5" />
                        ボーナスバック
                      </h4>
                      <div className="grid gap-2 lg:gap-3">
                        {backFeeData.bonusBack.map((item, index) => (
                          <div key={index} className="flex items-center justify-between p-2 lg:p-3 bg-white/60 rounded-lg">
                            <span className="text-gray-800 text-sm lg:text-base">{item.name}</span>
                            <span className="font-bold text-amber-600 text-sm lg:text-base">+¥{item.amount.toLocaleString()}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* 計算例 */}
                    <div className="p-3 lg:p-5 bg-gradient-to-br from-blue-50 to-cyan-50 rounded-xl border border-blue-200">
                      <h4 className="font-bold text-blue-700 mb-3 lg:mb-4 flex items-center gap-2 text-sm lg:text-base">
                        <TrendingUp className="w-4 h-4 lg:w-5 lg:h-5" />
                        バック計算例
                      </h4>
                      <div className="bg-white/60 rounded-lg p-3 lg:p-4 text-xs lg:text-sm">
                        <div className="space-y-2">
                          <div className="flex justify-between text-gray-700">
                            <span>90分コース バック</span>
                            <span>¥7,500</span>
                          </div>
                          <div className="flex justify-between text-gray-700">
                            <span>本指名バック</span>
                            <span>¥2,000</span>
                          </div>
                          <div className="flex justify-between text-gray-700">
                            <span>オプションAバック</span>
                            <span>¥2,100</span>
                          </div>
                          <div className="border-t border-blue-200 pt-2 mt-2">
                            <div className="flex justify-between font-bold text-blue-700 text-sm lg:text-base">
                              <span>合計バック</span>
                              <span>¥11,600</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* 出勤管理 - シフト提出 */}
                {activeSection === 'attendance' && (
                  <div className="space-y-6">
                    {/* ステップ1: 所属店舗確認 (1シフト→全店舗自動反映) */}
                    <div className="border border-blue-300 rounded-lg p-4 bg-blue-50/30">
                      <div className="text-sm font-bold text-gray-800 mb-2">
                        ステップ1　所属店舗を確認します。シフト提出すると以下すべての店舗に同じ時間が自動反映されます。
                      </div>
                      <div className="space-y-2">
                        {affiliatedStores.map(name => (
                          <div
                            key={name}
                            className="border border-blue-400 bg-white rounded px-3 py-2 text-sm text-gray-800 flex items-center gap-2"
                          >
                            <span className="text-emerald-600">✓</span>
                            {name}
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* ステップ2: シフト編集テーブル */}
                    <div className="border border-blue-300 rounded-lg p-4 bg-blue-50/30">
                      <div className="text-sm font-bold text-gray-800 mb-3">
                        ステップ2　下記の出勤予定を編集して、最後にOKをクリックします。
                      </div>
                      <div className="overflow-x-auto">
                        <table className="w-full border-collapse text-sm">
                          <thead>
                            <tr className="bg-cyan-200 text-gray-800">
                              <th className="border border-cyan-400 px-2 py-1 text-left">日付</th>
                              <th className="border border-cyan-400 px-2 py-1">出勤</th>
                              <th className="border border-cyan-400 px-2 py-1">出勤時刻</th>
                              <th className="border border-cyan-400 px-2 py-1">終了時刻</th>
                              <th className="border border-cyan-400 px-2 py-1">帰宅時刻</th>
                              <th className="border border-cyan-400 px-2 py-1">送迎</th>
                            </tr>
                          </thead>
                          <tbody>
                            <tr className="bg-cyan-100">
                              <td colSpan={6} className="border border-cyan-400 px-2 py-1 text-center font-semibold text-gray-800">
                                2026年03月
                              </td>
                            </tr>
                            {shiftEntries.map((entry, idx) => {
                              const dayNum = entry.date.split('-')[2];
                              return (
                                <tr key={entry.date} className="bg-yellow-100/60 hover:bg-yellow-100">
                                  <td className="border border-yellow-300 px-2 py-1">
                                    <span className="font-bold mr-1">{dayNum}日</span>
                                    <span>{entry.dayOfWeek}</span>
                                  </td>
                                  <td className="border border-yellow-300 px-2 py-1 text-center">
                                    <input
                                      type="checkbox"
                                      aria-label={`${dayNum}日 出勤`}
                                      checked={entry.isWorking}
                                      onChange={e => updateShiftField(idx, 'isWorking', e.target.checked)}
                                      className="w-4 h-4 accent-blue-600"
                                    />
                                  </td>
                                  <td className="border border-yellow-300 px-2 py-1">
                                    <div className="flex items-center gap-1 justify-center">
                                      <select
                                        aria-label={`${dayNum}日 出勤時`}
                                        disabled={!entry.isWorking}
                                        value={entry.startHour}
                                        onChange={e => updateShiftField(idx, 'startHour', e.target.value)}
                                        className="border rounded px-1 py-0.5 text-sm disabled:opacity-50"
                                      >
                                        {Array.from({ length: 24 }, (_, h) => String(h).padStart(2, '0')).map(h => (
                                          <option key={h} value={h}>{h}</option>
                                        ))}
                                      </select>
                                      <span>:</span>
                                      <select
                                        aria-label={`${dayNum}日 出勤分`}
                                        disabled={!entry.isWorking}
                                        value={entry.startMinute}
                                        onChange={e => updateShiftField(idx, 'startMinute', e.target.value)}
                                        className="border rounded px-1 py-0.5 text-sm disabled:opacity-50"
                                      >
                                        {['00', '15', '30', '45'].map(m => (
                                          <option key={m} value={m}>{m}</option>
                                        ))}
                                      </select>
                                    </div>
                                  </td>
                                  <td className="border border-yellow-300 px-2 py-1">
                                    <div className="flex items-center gap-1 justify-center">
                                      <select
                                        aria-label={`${dayNum}日 終了時`}
                                        disabled={!entry.isWorking}
                                        value={entry.endHour}
                                        onChange={e => updateShiftField(idx, 'endHour', e.target.value)}
                                        className="border rounded px-1 py-0.5 text-sm disabled:opacity-50"
                                      >
                                        {Array.from({ length: 24 }, (_, h) => String(h).padStart(2, '0')).map(h => (
                                          <option key={h} value={h}>{h}</option>
                                        ))}
                                      </select>
                                      <span>:</span>
                                      <select
                                        aria-label={`${dayNum}日 終了分`}
                                        disabled={!entry.isWorking}
                                        value={entry.endMinute}
                                        onChange={e => updateShiftField(idx, 'endMinute', e.target.value)}
                                        className="border rounded px-1 py-0.5 text-sm disabled:opacity-50"
                                      >
                                        {['00', '15', '30', '45'].map(m => (
                                          <option key={m} value={m}>{m}</option>
                                        ))}
                                      </select>
                                    </div>
                                  </td>
                                  <td className="border border-yellow-300 px-2 py-1">
                                    <div className="flex items-center gap-1 justify-center">
                                      <select
                                        aria-label={`${dayNum}日 帰宅時`}
                                        disabled={!entry.isWorking}
                                        value={entry.returnHour}
                                        onChange={e => updateShiftField(idx, 'returnHour', e.target.value)}
                                        className="border rounded px-1 py-0.5 text-sm disabled:opacity-50"
                                      >
                                        {Array.from({ length: 24 }, (_, h) => String(h).padStart(2, '0')).map(h => (
                                          <option key={h} value={h}>{h}</option>
                                        ))}
                                      </select>
                                      <span>:</span>
                                      <select
                                        aria-label={`${dayNum}日 帰宅分`}
                                        disabled={!entry.isWorking}
                                        value={entry.returnMinute}
                                        onChange={e => updateShiftField(idx, 'returnMinute', e.target.value)}
                                        className="border rounded px-1 py-0.5 text-sm disabled:opacity-50"
                                      >
                                        {['00', '15', '30', '45'].map(m => (
                                          <option key={m} value={m}>{m}</option>
                                        ))}
                                      </select>
                                    </div>
                                  </td>
                                  <td className="border border-yellow-300 px-2 py-1">
                                    <div className="flex flex-col gap-1 items-center">
                                      <select
                                        aria-label={`${dayNum}日 お迎え場所`}
                                        disabled={!entry.isWorking}
                                        value={entry.pickupLocation}
                                        onChange={e => updateShiftField(idx, 'pickupLocation', e.target.value)}
                                        className="border rounded px-1 py-0.5 text-xs disabled:opacity-50 w-full"
                                      >
                                        {pickupOptions.map(opt => (
                                          <option key={opt} value={opt}>迎: {opt}</option>
                                        ))}
                                      </select>
                                      <select
                                        aria-label={`${dayNum}日 送り場所`}
                                        disabled={!entry.isWorking}
                                        value={entry.dropoffLocation}
                                        onChange={e => updateShiftField(idx, 'dropoffLocation', e.target.value)}
                                        className="border rounded px-1 py-0.5 text-xs disabled:opacity-50 w-full"
                                      >
                                        {dropoffOptions.map(opt => (
                                          <option key={opt} value={opt}>送: {opt}</option>
                                        ))}
                                      </select>
                                    </div>
                                  </td>
                                </tr>
                              );
                            })}
                            <tr className="bg-cyan-100">
                              <td colSpan={6} className="border border-cyan-400 px-2 py-1 text-center font-semibold text-gray-800">
                                2026年03月
                              </td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                      <p className="text-xs text-gray-600 mt-3">
                        よろしければ OKボタンをタップしてください。
                      </p>
                      <div className="flex gap-3 mt-3">
                        <Button
                          type="button"
                          onClick={submitShift}
                          className="bg-blue-600 hover:bg-blue-700 text-white px-6"
                        >
                          OK
                        </Button>
                        <p className="text-xs text-gray-600 self-center">
                          入力を元に戻すには、リセットをタップします。
                        </p>
                        <Button
                          type="button"
                          variant="outline"
                          onClick={resetShift}
                          className="border-gray-400 text-gray-700"
                        >
                          <RotateCcw className="w-4 h-4 mr-1" />
                          リセット
                        </Button>
                      </div>
                    </div>
                  </div>
                )}

                {/* 送迎 */}
                {activeSection === 'car' && (
                  <div className="space-y-3 lg:space-y-4">

                    {/* idle: お迎え車両確認ボタン */}
                    {transportStatus === 'idle' && (
                      <div className="space-y-3">
                        <p className="text-gray-500 text-sm lg:text-base">担当ドライバー: {assignedDriverName}</p>
                        <div className="rounded-xl bg-blue-50 border border-blue-100 p-4 flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full flex items-center justify-center bg-blue-100 flex-shrink-0">
                            <Car className="w-5 h-5 text-blue-500" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="font-bold text-base text-gray-800">{assignedCars.pickup.name}</div>
                            <div className="text-[10px] font-mono text-gray-400">社番: {assignedCars.pickup.vehicleNumber}</div>
                            <div className="text-xs text-gray-500 flex items-center gap-1">
                              <User className="w-3 h-3" />{assignedCars.pickup.driverName}
                            </div>
                          </div>
                          <div className="text-right flex-shrink-0">
                            <div className="text-[10px] text-gray-400">到着予定</div>
                            <div className="font-bold text-lg text-gray-800 flex items-center gap-1 justify-end">
                              <Clock className="w-4 h-4 text-blue-400" />{assignedCars.pickup.eta}
                            </div>
                          </div>
                        </div>
                        <Button
                          className="w-full h-11 lg:h-13 text-sm lg:text-base bg-blue-600 hover:bg-blue-700 flex items-center gap-2 justify-center"
                          onClick={handleStartPickup}
                        >
                          <Car className="w-4 h-4" />
                          お迎え車両を確認する
                        </Button>
                      </div>
                    )}

                    {/* pickup: お迎え中カード */}
                    {transportStatus === 'pickup' && (
                      <div className="space-y-3">
                        <div className="rounded-2xl bg-gradient-to-br from-blue-500 to-cyan-500 p-4 lg:p-6 shadow-lg shadow-blue-500/30 text-white">
                          <div className="text-center mb-4">
                            <div className="text-xs lg:text-sm font-medium text-white/70 mb-1">お迎え車両</div>
                            <div className="text-2xl lg:text-3xl font-bold">この車です</div>
                          </div>
                          <div className="bg-white/15 rounded-xl p-3 lg:p-4 space-y-2">
                            <div className="flex items-center gap-2">
                              <Car className="w-4 h-4 lg:w-5 lg:h-5 text-white/80 flex-shrink-0" />
                              <span className="font-bold text-base lg:text-lg">{assignedCars.pickup.name}</span>
                            </div>
                            <div className="flex items-center gap-2 text-white/80 text-xs lg:text-sm">
                              <MapPin className="w-3 h-3 lg:w-4 lg:h-4 flex-shrink-0" />
                              <span className="font-mono">{assignedCars.pickup.vehicleNumber}</span>
                            </div>
                            <div className="flex items-center gap-2 text-white/80 text-xs lg:text-sm">
                              <User className="w-3 h-3 lg:w-4 lg:h-4 flex-shrink-0" />
                              <span>{assignedCars.pickup.driverName}</span>
                            </div>
                            {assignedCars.pickup.driverPhone && (
                              <div className="flex items-center gap-2 text-white/80 text-xs lg:text-sm">
                                <MapPin className="w-3 h-3 lg:w-4 lg:h-4 flex-shrink-0" />
                                <span>{assignedCars.pickup.driverPhone}</span>
                              </div>
                            )}
                            <div className="flex items-center gap-2 text-white font-bold text-sm lg:text-base">
                              <Clock className="w-4 h-4 flex-shrink-0" />
                              <span>到着予想: {assignedCars.pickup.eta}</span>
                            </div>
                          </div>
                        </div>
                        <Button
                          className="w-full h-11 lg:h-13 text-sm lg:text-base bg-blue-600 hover:bg-blue-700 flex items-center gap-2 justify-center"
                          onClick={handleArrive}
                        >
                          <CheckCircle className="w-4 h-4" />
                          到着しました
                        </Button>
                      </div>
                    )}

                    {/* arrived: 到着済みカード */}
                    {transportStatus === 'arrived' && (
                      <div className="space-y-3">
                        <div className="rounded-2xl bg-gradient-to-br from-amber-400 to-yellow-500 p-4 lg:p-6 shadow-lg shadow-amber-400/30 text-white">
                          <div className="text-center mb-4">
                            <div className="flex items-center justify-center gap-2 mb-2">
                              <CheckCircle className="w-6 h-6 lg:w-8 lg:h-8" />
                              <span className="text-xl lg:text-2xl font-bold">到着済み</span>
                            </div>
                            <div className="text-white/80 text-sm lg:text-base">次の送迎をお待ちください</div>
                          </div>
                          <div className="bg-white/15 rounded-xl p-3 text-center text-white/90 text-xs lg:text-sm">
                            お仕事終了後、送迎ドライバーがお迎えに参ります
                          </div>
                        </div>
                        <Button
                          className="w-full h-11 lg:h-13 text-sm lg:text-base bg-amber-500 hover:bg-amber-600 flex items-center gap-2 justify-center"
                          onClick={handleStartSendoff}
                        >
                          <Car className="w-4 h-4" />
                          送迎を開始する
                        </Button>
                      </div>
                    )}

                    {/* sendoff: 送迎中カード */}
                    {transportStatus === 'sendoff' && (
                      <div className="space-y-3">
                        <div className="rounded-2xl bg-gradient-to-br from-green-500 to-emerald-500 p-4 lg:p-6 shadow-lg shadow-green-500/30 text-white">
                          <div className="text-center mb-4">
                            <div className="text-xs lg:text-sm font-medium text-white/70 mb-1">送迎中</div>
                            <div className="text-2xl lg:text-3xl font-bold">この車です</div>
                          </div>
                          <div className="bg-white/15 rounded-xl p-3 lg:p-4 space-y-2">
                            <div className="flex items-center gap-2">
                              <Car className="w-4 h-4 lg:w-5 lg:h-5 text-white/80 flex-shrink-0" />
                              <span className="font-bold text-base lg:text-lg">{assignedCars.sendoff.name}</span>
                            </div>
                            <div className="flex items-center gap-2 text-white/80 text-xs lg:text-sm">
                              <MapPin className="w-3 h-3 lg:w-4 lg:h-4 flex-shrink-0" />
                              <span className="font-mono">{assignedCars.sendoff.vehicleNumber}</span>
                            </div>
                            <div className="flex items-center gap-2 text-white/80 text-xs lg:text-sm">
                              <User className="w-3 h-3 lg:w-4 lg:h-4 flex-shrink-0" />
                              <span>{assignedCars.sendoff.driverName}</span>
                            </div>
                            {assignedCars.sendoff.driverPhone && (
                              <div className="flex items-center gap-2 text-white/80 text-xs lg:text-sm">
                                <MapPin className="w-3 h-3 lg:w-4 lg:h-4 flex-shrink-0" />
                                <span>{assignedCars.sendoff.driverPhone}</span>
                              </div>
                            )}
                            <div className="flex items-center gap-2 text-white font-bold text-sm lg:text-base">
                              <Clock className="w-4 h-4 flex-shrink-0" />
                              <span>送り予定: {assignedCars.sendoff.eta}</span>
                            </div>
                          </div>
                        </div>
                        <Button
                          className="w-full h-11 lg:h-13 text-sm lg:text-base bg-green-600 hover:bg-green-700 flex items-center gap-2 justify-center"
                          onClick={handleCompleteSendoff}
                        >
                          <CheckCircle className="w-4 h-4" />
                          完了・リセット
                        </Button>
                      </div>
                    )}

                  </div>
                )}

              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function HostessManagementPage() {
  return (
    <Suspense fallback={<div className="flex items-center justify-center h-screen text-gray-500">読み込み中...</div>}>
      <HostessManagementContent />
    </Suspense>
  );
}
