'use client';

import React, { useState } from 'react';
import Link from 'next/link';
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
  Crown
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

export default function HostessManagementPage() {
  const [activeSection, setActiveSection] = useState<string>('customer');
  const [isAttendanceConfirmed, setIsAttendanceConfirmed] = useState(false);
  const [selectedCarId, setSelectedCarId] = useState<string | null>(null);

  React.useEffect(() => {
    document.title = 'プロフィール設定 - Dispatch Harmony Hub';
  }, []);

  // サンプルデータ
  const hostessData = {
    name: '山田 花子',
    stageName: 'はなこ',
    thisMonthEarnings: 850000,
    lastMonthEarnings: 780000,
    influencerLevel: 'ゴールド', // インフルエンサーレベル
    influencerFollowers: 15000, // フォロワー数
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

  // マイ実績サンプルデータ（月別）
  const [selectedPerformanceMonth, setSelectedPerformanceMonth] = useState('2026-02');
  const performanceHistory = {
    '2026-02': { totalSales: 850000, nominations: 15, newCustomers: 3, repeatRate: 78 },
    '2026-01': { totalSales: 780000, nominations: 12, newCustomers: 5, repeatRate: 72 },
    '2025-12': { totalSales: 920000, nominations: 18, newCustomers: 4, repeatRate: 80 },
    '2025-11': { totalSales: 650000, nominations: 10, newCustomers: 2, repeatRate: 68 },
    '2025-10': { totalSales: 700000, nominations: 11, newCustomers: 3, repeatRate: 70 },
    '2025-09': { totalSales: 720000, nominations: 13, newCustomers: 4, repeatRate: 75 },
  };
  const currentPerformance = performanceHistory[selectedPerformanceMonth as keyof typeof performanceHistory] || performanceHistory['2026-02'];
  const prevMonth = Object.keys(performanceHistory).find((_, idx, arr) =>
    arr[idx - 1] === selectedPerformanceMonth
  );
  const prevPerformance = prevMonth ? performanceHistory[prevMonth as keyof typeof performanceHistory] : null;

  // 総所得計算
  const totalEarnings = Object.values(performanceHistory).reduce((sum, month) => sum + month.totalSales, 0);

  // グループ・店舗順位
  const rankingData = {
    groupRank: 8,
    groupTotal: 150,
    storeRank: 3,
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

  // 送迎車サンプルデータ（社番・送り担当ドライバー情報を追加）
  const availableCars = [
    { id: '1', name: '1号車', vehicleNumber: '品川 500 あ 12-34', driver: '山田ドライバー', sendDriver: '鈴木ドライバー', eta: '18:30' },
    { id: '2', name: '2号車', vehicleNumber: '品川 500 い 56-78', driver: '田中ドライバー', sendDriver: '高橋ドライバー', eta: '18:45' },
    { id: '3', name: '3号車', vehicleNumber: '品川 500 う 90-12', driver: '佐藤ドライバー', sendDriver: '伊藤ドライバー', eta: '19:00' },
  ];

  // 迎え完了状態の管理
  const [pickupCompleted, setPickupCompleted] = useState(false);

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
                    selectedCarId
                      ? 'bg-blue-500 shadow-lg shadow-blue-500/30'
                      : 'bg-gradient-to-r from-blue-500 to-cyan-500 shadow-lg shadow-blue-500/20'
                  }`}
                >
                  <div className="w-10 h-10 lg:w-12 lg:h-12 rounded-full bg-white/20 flex items-center justify-center">
                    <Car className="w-5 h-5 lg:w-6 lg:h-6 text-white" />
                  </div>
                  <div className="text-center lg:text-left">
                    <div className="text-white font-bold text-xs lg:text-base">{selectedCarId ? '選択済み' : '送迎車確認'}</div>
                    <div className="text-white/70 text-[10px] lg:text-sm hidden lg:block">出勤時の車両選択</div>
                  </div>
                </button>

                {/* 出勤申請 */}
                <button
                  onClick={() => alert('出勤申請を送信しました')}
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

                    {/* 総所得 */}
                    <div className="p-4 lg:p-6 bg-gradient-to-r from-amber-400 to-orange-500 rounded-2xl">
                      <div className="text-white/80 text-xs lg:text-sm mb-1">累計総所得</div>
                      <div className="text-2xl lg:text-4xl font-bold text-white">
                        ¥{totalEarnings.toLocaleString()}
                      </div>
                    </div>

                    {/* 順位（グループ・店舗） */}
                    <div className="grid grid-cols-2 gap-3 lg:gap-4">
                      <div className="p-4 lg:p-6 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl text-center">
                        <div className="text-white/80 text-xs lg:text-sm mb-1">グループ順位</div>
                        <div className="text-3xl lg:text-5xl font-bold text-white mb-1">{rankingData.groupRank}位</div>
                        <div className="text-white/70 text-sm">/ {rankingData.groupTotal}人中</div>
                      </div>
                      <div className="p-4 lg:p-6 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-2xl text-center">
                        <div className="text-white/80 text-xs lg:text-sm mb-1">{rankingData.storeName}順位</div>
                        <div className="text-3xl lg:text-5xl font-bold text-white mb-1">{rankingData.storeRank}位</div>
                        <div className="text-white/70 text-sm">/ {rankingData.storeTotal}人中</div>
                      </div>
                    </div>

                    {/* 月別実績 */}
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 lg:gap-4">
                      <div className="p-3 lg:p-5 bg-gray-50 rounded-xl text-center">
                        <div className="text-gray-500 text-xs lg:text-sm mb-1 lg:mb-2">売上</div>
                        <div className="text-lg lg:text-2xl font-bold text-gray-800">¥{currentPerformance.totalSales.toLocaleString()}</div>
                        {prevPerformance && (
                          <div className={`text-xs lg:text-sm mt-1 ${currentPerformance.totalSales >= prevPerformance.totalSales ? 'text-green-500' : 'text-red-500'}`}>
                            {currentPerformance.totalSales >= prevPerformance.totalSales ? '+' : ''}
                            {((currentPerformance.totalSales - prevPerformance.totalSales) / prevPerformance.totalSales * 100).toFixed(1)}%
                          </div>
                        )}
                      </div>
                      <div className="p-3 lg:p-5 bg-gray-50 rounded-xl text-center">
                        <div className="text-gray-500 text-xs lg:text-sm mb-1 lg:mb-2">指名数</div>
                        <div className="text-lg lg:text-2xl font-bold text-gray-800">{currentPerformance.nominations}件</div>
                        {prevPerformance && (
                          <div className={`text-xs lg:text-sm mt-1 ${currentPerformance.nominations >= prevPerformance.nominations ? 'text-green-500' : 'text-red-500'}`}>
                            {currentPerformance.nominations >= prevPerformance.nominations ? '+' : ''}
                            {currentPerformance.nominations - prevPerformance.nominations}件
                          </div>
                        )}
                      </div>
                      <div className="p-3 lg:p-5 bg-gray-50 rounded-xl text-center">
                        <div className="text-gray-500 text-xs lg:text-sm mb-1 lg:mb-2">新規顧客</div>
                        <div className="text-lg lg:text-2xl font-bold text-gray-800">{currentPerformance.newCustomers}人</div>
                      </div>
                      <div className="p-3 lg:p-5 bg-gray-50 rounded-xl text-center">
                        <div className="text-gray-500 text-xs lg:text-sm mb-1 lg:mb-2">リピート率</div>
                        <div className="text-lg lg:text-2xl font-bold text-gray-800">{currentPerformance.repeatRate}%</div>
                      </div>
                    </div>

                    {/* 過去実績グラフ（簡易版） */}
                    <div className="p-4 bg-gray-50 rounded-xl">
                      <div className="text-sm font-semibold text-gray-600 mb-3">過去6ヶ月の売上推移</div>
                      <div className="flex items-end gap-2 h-24">
                        {Object.entries(performanceHistory).reverse().map(([month, data]) => {
                          const maxSales = Math.max(...Object.values(performanceHistory).map(d => d.totalSales));
                          const height = (data.totalSales / maxSales) * 100;
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

                {/* 送迎車選択 */}
                {activeSection === 'car' && (
                  <div className="space-y-3 lg:space-y-4">
                    {/* 迎え/送り切り替えタブ */}
                    <div className="flex gap-2 p-1 bg-gray-100 rounded-lg">
                      <button
                        onClick={() => setPickupCompleted(false)}
                        className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-all ${
                          !pickupCompleted
                            ? 'bg-blue-500 text-white shadow-sm'
                            : 'text-gray-600 hover:bg-gray-200'
                        }`}
                      >
                        迎え
                      </button>
                      <button
                        onClick={() => setPickupCompleted(true)}
                        className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-all ${
                          pickupCompleted
                            ? 'bg-green-500 text-white shadow-sm'
                            : 'text-gray-600 hover:bg-gray-200'
                        }`}
                      >
                        送り
                      </button>
                    </div>

                    <p className="text-gray-500 mb-3 lg:mb-4 text-sm lg:text-base">
                      {pickupCompleted ? '送り担当のドライバー情報' : '出勤時に利用する送迎車を選択してください'}
                    </p>

                    <div className="grid gap-2 lg:gap-3">
                      {availableCars.map(car => (
                        <button
                          key={car.id}
                          onClick={() => setSelectedCarId(car.id)}
                          className={`w-full p-3 lg:p-4 rounded-xl transition-all flex items-center gap-3 lg:gap-4 ${
                            selectedCarId === car.id
                              ? pickupCompleted
                                ? 'bg-gradient-to-r from-green-500 to-emerald-500 shadow-lg shadow-green-500/30'
                                : 'bg-gradient-to-r from-blue-500 to-cyan-500 shadow-lg shadow-blue-500/30'
                              : 'bg-gray-50 hover:bg-gray-100'
                          }`}
                        >
                          <div className={`w-10 h-10 lg:w-14 lg:h-14 rounded-full flex items-center justify-center flex-shrink-0 ${
                            selectedCarId === car.id ? 'bg-white/20' : pickupCompleted ? 'bg-green-100' : 'bg-blue-100'
                          }`}>
                            <Car className={`w-5 h-5 lg:w-7 lg:h-7 ${selectedCarId === car.id ? 'text-white' : pickupCompleted ? 'text-green-500' : 'text-blue-500'}`} />
                          </div>
                          <div className="flex-1 text-left min-w-0">
                            <div className={`font-bold text-base lg:text-lg ${selectedCarId === car.id ? 'text-white' : 'text-gray-800'}`}>
                              {car.name}
                            </div>
                            {/* 社番表示 */}
                            <div className={`text-[10px] lg:text-xs font-mono ${selectedCarId === car.id ? 'text-white/60' : 'text-gray-400'}`}>
                              社番: {car.vehicleNumber}
                            </div>
                            {/* 迎え/送りに応じてドライバー名を切り替え */}
                            <div className={`text-xs lg:text-sm ${selectedCarId === car.id ? 'text-white/70' : 'text-gray-500'}`}>
                              {pickupCompleted ? `送り: ${car.sendDriver}` : `迎え: ${car.driver}`}
                            </div>
                          </div>
                          <div className="text-right flex-shrink-0">
                            <div className={`text-[10px] lg:text-xs ${selectedCarId === car.id ? 'text-white/60' : 'text-gray-400'}`}>
                              {pickupCompleted ? '送り予定' : '到着予定'}
                            </div>
                            <div className={`font-bold text-lg lg:text-xl ${selectedCarId === car.id ? 'text-white' : 'text-gray-800'}`}>
                              {car.eta}
                            </div>
                          </div>
                        </button>
                      ))}
                    </div>
                    {selectedCarId && !pickupCompleted && (
                      <Button
                        className="w-full h-10 lg:h-12 text-sm lg:text-lg bg-blue-600 hover:bg-blue-700 mt-3 lg:mt-4"
                        onClick={() => {
                          setPickupCompleted(true);
                          alert('迎え完了！送り担当ドライバー情報に切り替わりました');
                        }}
                      >
                        迎え完了（送りドライバーに切り替え）
                      </Button>
                    )}
                    {selectedCarId && pickupCompleted && (
                      <div className="p-4 bg-green-50 rounded-xl border border-green-200">
                        <div className="text-green-700 font-medium text-sm">✓ 送り担当ドライバーが割り当てられています</div>
                        <div className="text-green-600 text-xs mt-1">
                          お仕事終了後、送りドライバーがお迎えに参ります
                        </div>
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
