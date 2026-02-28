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
  Camera,
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
  ArrowUpDown
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

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
  };

  const monthOverMonthChange = hostessData.thisMonthEarnings - hostessData.lastMonthEarnings;
  const monthOverMonthPercent = ((monthOverMonthChange / hostessData.lastMonthEarnings) * 100).toFixed(1);
  const isPositiveChange = monthOverMonthChange >= 0;

  // 接客履歴サンプルデータ（各顧客に過去のメモ履歴を含む）
  const [customerHistory, setCustomerHistory] = useState([
    {
      id: '1',
      memberNumber: 'M-001',
      customerName: '田中様',
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
      memberNumber: 'M-003',
      customerName: '佐藤様',
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
      memberNumber: 'M-002',
      customerName: '鈴木様',
      lastVisitDate: '2026-02-08',
      rating: 4,
      memoHistory: [
        { id: 'm3-2', date: '2026-02-08 19:00', author: '私', content: '焼酎派。話題は野球。阪神ファン。' },
        { id: 'm3-1', date: '2026-01-20 20:30', author: '私', content: '初来店。明るい性格で話しやすい。' },
      ]
    },
  ]);

  // ソート用のstate
  const [customerSortKey, setCustomerSortKey] = useState<'memberNumber' | 'customerName' | 'lastVisitDate'>('lastVisitDate');

  // ソートされた顧客リスト
  const sortedCustomerHistory = [...customerHistory].sort((a, b) => {
    switch (customerSortKey) {
      case 'memberNumber':
        return a.memberNumber.localeCompare(b.memberNumber);
      case 'customerName':
        return a.customerName.localeCompare(b.customerName);
      case 'lastVisitDate':
        return b.lastVisitDate.localeCompare(a.lastVisitDate); // 新しい順
      default:
        return 0;
    }
  });

  const [editingCustomerId, setEditingCustomerId] = useState<string | null>(null);
  const [editingMemo, setEditingMemo] = useState('');
  const [expandedCustomerId, setExpandedCustomerId] = useState<string | null>(null);
  const [newMemoContent, setNewMemoContent] = useState('');

  // 予約状況サンプルデータ
  const [reservations, setReservations] = useState([
    { id: '1', date: '2026-02-14', time: '19:00', customerName: '田中様', status: 'confirmed', note: '' },
    { id: '2', date: '2026-02-15', time: '20:00', customerName: '山本様', status: 'pending', note: '' },
    { id: '3', date: '2026-02-16', time: '18:30', customerName: '高橋様', status: 'confirmed', note: '' },
  ]);

  // マイ実績サンプルデータ
  const performanceData = {
    thisMonth: { totalSales: 850000, nominations: 15, newCustomers: 3, repeatRate: 78 },
    lastMonth: { totalSales: 780000, nominations: 12, newCustomers: 5, repeatRate: 72 },
    ranking: 3,
    totalRankingCount: 25,
  };

  // 写メ日記サンプルデータ
  const [diaryEntries, setDiaryEntries] = useState([
    { id: '1', date: '2026-02-13', image: null, caption: '今日も頑張ります！', status: 'published' },
    { id: '2', date: '2026-02-12', image: null, caption: 'バレンタイン準備中', status: 'draft' },
  ]);

  const [newDiaryCaption, setNewDiaryCaption] = useState('');

  // 送迎車サンプルデータ
  const availableCars = [
    { id: '1', name: '1号車', driver: '山田ドライバー', eta: '18:30' },
    { id: '2', name: '2号車', driver: '田中ドライバー', eta: '18:45' },
    { id: '3', name: '3号車', driver: '佐藤ドライバー', eta: '19:00' },
  ];

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

  const handleAddDiary = () => {
    if (!newDiaryCaption.trim()) return;
    const newEntry = {
      id: String(Date.now()),
      date: new Date().toISOString().split('T')[0],
      image: null,
      caption: newDiaryCaption,
      status: 'draft' as const,
    };
    setDiaryEntries(prev => [newEntry, ...prev]);
    setNewDiaryCaption('');
  };

  // 大カテゴリメニュー
  const mainMenuItems = [
    { id: 'customer', label: '顧客管理', icon: Users, gradient: 'from-purple-500 to-violet-600' },
    { id: 'reservation', label: '予約状況', icon: Calendar, gradient: 'from-pink-500 to-rose-500' },
    { id: 'performance', label: 'マイ実績', icon: TrendingUp, gradient: 'from-cyan-400 to-blue-500' },
    { id: 'diary', label: '写メ日記', icon: Camera, gradient: 'from-amber-400 to-orange-500' },
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
              <div className="font-bold text-base lg:text-lg">{hostessData.stageName}</div>
              <div className="text-white/70 text-xs lg:text-sm">{hostessData.name}</div>
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
          {/* モバイル：横スクロール / PC：縦並び */}
          <div className="flex lg:flex-col gap-2 lg:gap-4 overflow-x-auto pb-2 lg:pb-0 lg:space-y-0 -mx-4 px-4 lg:mx-0 lg:px-0">
            {mainMenuItems.map(item => (
              <button
                key={item.id}
                onClick={() => setActiveSection(item.id)}
                className={`flex-shrink-0 h-12 lg:h-14 flex items-center gap-2 lg:gap-3 pl-0.5 lg:pl-1 pr-4 lg:pr-6 rounded-full transition-all ${
                  activeSection === item.id
                    ? `bg-gradient-to-r ${item.gradient} shadow-lg`
                    : `bg-gradient-to-r ${item.gradient} opacity-80 hover:opacity-100 shadow-md`
                }`}
              >
                <div className="w-10 h-10 lg:w-12 lg:h-12 rounded-full bg-white shadow-[0_4px_12px_rgba(0,0,0,0.15)] flex items-center justify-center flex-shrink-0">
                  <item.icon className={`w-4 h-4 lg:w-5 lg:h-5 ${
                    item.id === 'customer' ? 'text-purple-500' :
                    item.id === 'reservation' ? 'text-pink-500' :
                    item.id === 'performance' ? 'text-cyan-500' :
                    'text-orange-500'
                  }`} />
                </div>
                <span className="text-white font-semibold text-sm lg:text-base whitespace-nowrap">
                  {item.label}
                </span>
              </button>
            ))}

            {/* 送迎車確認 */}
            <button
              onClick={() => setActiveSection('car')}
              className={`flex-shrink-0 h-12 lg:h-14 flex items-center gap-2 lg:gap-3 pl-0.5 lg:pl-1 pr-4 lg:pr-6 rounded-full transition-all ${
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
                  {activeSection === 'customer' && <><Users className="w-4 h-4 lg:w-5 lg:h-5 text-purple-500" />顧客管理 - 接客履歴</>}
                  {activeSection === 'reservation' && <><Calendar className="w-4 h-4 lg:w-5 lg:h-5 text-pink-500" />予約状況</>}
                  {activeSection === 'performance' && <><TrendingUp className="w-4 h-4 lg:w-5 lg:h-5 text-cyan-500" />マイ実績</>}
                  {activeSection === 'diary' && <><Camera className="w-4 h-4 lg:w-5 lg:h-5 text-orange-500" />写メ日記</>}
                  {activeSection === 'car' && <><Car className="w-4 h-4 lg:w-5 lg:h-5 text-blue-500" />送迎車選択</>}
                </CardTitle>
              </CardHeader>
              <CardContent className="p-4 lg:p-6">
                {/* 顧客管理 */}
                {activeSection === 'customer' && (
                  <div className="space-y-3 lg:space-y-4">
                    <div className="flex flex-col sm:flex-row gap-2 sm:items-center sm:justify-between">
                      <Button className="bg-purple-600 hover:bg-purple-700 text-sm lg:text-base">
                        <Plus className="w-4 h-4 mr-1 lg:mr-2" />新規顧客追加
                      </Button>
                      <div className="flex items-center gap-2">
                        <ArrowUpDown className="w-4 h-4 text-gray-500" />
                        <Select value={customerSortKey} onValueChange={(value: 'memberNumber' | 'customerName' | 'lastVisitDate') => setCustomerSortKey(value)}>
                          <SelectTrigger className="w-[160px] h-9 text-sm">
                            <SelectValue placeholder="並び替え" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="lastVisitDate">最終来店日順</SelectItem>
                            <SelectItem value="memberNumber">会員番号順</SelectItem>
                            <SelectItem value="customerName">名前順</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <div className="grid gap-3 lg:gap-4">
                      {sortedCustomerHistory.map(customer => (
                        <div key={customer.id} className="bg-gray-50 rounded-xl overflow-hidden">
                          {/* 顧客ヘッダー（クリックで展開） */}
                          <div
                            className="p-3 lg:p-4 cursor-pointer hover:bg-gray-100 transition-colors"
                            onClick={() => setExpandedCustomerId(expandedCustomerId === customer.id ? null : customer.id)}
                          >
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-3">
                                <div className="w-10 h-10 lg:w-12 lg:h-12 rounded-full bg-purple-100 flex items-center justify-center">
                                  <User className="w-5 h-5 lg:w-6 lg:h-6 text-purple-500" />
                                </div>
                                <div>
                                  <div className="flex items-center gap-2">
                                    <span className="font-bold text-gray-800 text-base lg:text-lg">{customer.customerName}</span>
                                    <span className="text-xs bg-gray-200 text-gray-600 px-1.5 py-0.5 rounded font-mono">{customer.memberNumber}</span>
                                  </div>
                                  <div className="flex items-center gap-2 text-xs text-gray-500">
                                    <span>最終来店: {customer.lastVisitDate}</span>
                                    <span className="bg-purple-100 text-purple-600 px-1.5 py-0.5 rounded">
                                      メモ {customer.memoHistory.length}件
                                    </span>
                                  </div>
                                </div>
                              </div>
                              <span className={`transform transition-transform ${expandedCustomerId === customer.id ? 'rotate-180' : ''}`}>
                                ▼
                              </span>
                            </div>
                            {/* 最新メモプレビュー */}
                            {customer.memoHistory.length > 0 && expandedCustomerId !== customer.id && (
                              <div className="mt-2 p-2 bg-white rounded-lg border border-gray-200">
                                <div className="text-xs text-gray-400 mb-1">最新メモ ({customer.memoHistory[0].date})</div>
                                <p className="text-gray-600 text-sm line-clamp-2">{customer.memoHistory[0].content}</p>
                              </div>
                            )}
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
                                        <span className="text-xs bg-gray-100 px-1.5 py-0.5 rounded text-gray-500">
                                          {memo.author}
                                        </span>
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

                {/* 予約状況 */}
                {activeSection === 'reservation' && (
                  <div className="grid gap-3 lg:gap-4">
                    {reservations.map(reservation => (
                      <div key={reservation.id} className="p-3 lg:p-4 bg-gray-50 rounded-xl">
                        <div className="flex items-center justify-between mb-2 lg:mb-3 flex-wrap gap-2">
                          <div className="flex items-center gap-2 lg:gap-3">
                            <Clock className="w-4 h-4 lg:w-5 lg:h-5 text-pink-500" />
                            <span className="font-bold text-gray-800 text-base lg:text-lg">{reservation.date}</span>
                            <span className="text-gray-500 text-sm lg:text-base">{reservation.time}</span>
                          </div>
                          <span className={`px-2 lg:px-3 py-0.5 lg:py-1 rounded-full text-xs lg:text-sm font-medium ${
                            reservation.status === 'confirmed'
                              ? 'bg-green-100 text-green-600'
                              : 'bg-yellow-100 text-yellow-600'
                          }`}>
                            {reservation.status === 'confirmed' ? '確定' : '仮予約'}
                          </span>
                        </div>
                        <div className="text-gray-700 mb-2 lg:mb-3 text-sm lg:text-base">{reservation.customerName}</div>
                        <Input
                          placeholder="メモを追加..."
                          className="bg-white border-gray-200 text-gray-800 placeholder:text-gray-400 text-sm lg:text-base"
                          value={reservation.note}
                          onChange={(e) => {
                            setReservations(prev => prev.map(r =>
                              r.id === reservation.id ? { ...r, note: e.target.value } : r
                            ));
                          }}
                        />
                      </div>
                    ))}
                  </div>
                )}

                {/* マイ実績 */}
                {activeSection === 'performance' && (
                  <div className="space-y-4 lg:space-y-6">
                    <div className="text-center p-5 lg:p-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl">
                      <div className="text-4xl lg:text-6xl font-bold text-white mb-1 lg:mb-2">{performanceData.ranking}位</div>
                      <div className="text-white/80 text-base lg:text-lg">/ {performanceData.totalRankingCount}人中</div>
                    </div>
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 lg:gap-4">
                      <div className="p-3 lg:p-5 bg-gray-50 rounded-xl text-center">
                        <div className="text-gray-500 text-xs lg:text-sm mb-1 lg:mb-2">売上</div>
                        <div className="text-lg lg:text-2xl font-bold text-gray-800">¥{performanceData.thisMonth.totalSales.toLocaleString()}</div>
                        <div className="text-green-500 text-xs lg:text-sm mt-1">
                          +{((performanceData.thisMonth.totalSales - performanceData.lastMonth.totalSales) / performanceData.lastMonth.totalSales * 100).toFixed(1)}%
                        </div>
                      </div>
                      <div className="p-3 lg:p-5 bg-gray-50 rounded-xl text-center">
                        <div className="text-gray-500 text-xs lg:text-sm mb-1 lg:mb-2">指名数</div>
                        <div className="text-lg lg:text-2xl font-bold text-gray-800">{performanceData.thisMonth.nominations}件</div>
                        <div className="text-green-500 text-xs lg:text-sm mt-1">
                          +{performanceData.thisMonth.nominations - performanceData.lastMonth.nominations}件
                        </div>
                      </div>
                      <div className="p-3 lg:p-5 bg-gray-50 rounded-xl text-center">
                        <div className="text-gray-500 text-xs lg:text-sm mb-1 lg:mb-2">新規顧客</div>
                        <div className="text-lg lg:text-2xl font-bold text-gray-800">{performanceData.thisMonth.newCustomers}人</div>
                      </div>
                      <div className="p-3 lg:p-5 bg-gray-50 rounded-xl text-center">
                        <div className="text-gray-500 text-xs lg:text-sm mb-1 lg:mb-2">リピート率</div>
                        <div className="text-lg lg:text-2xl font-bold text-gray-800">{performanceData.thisMonth.repeatRate}%</div>
                      </div>
                    </div>
                  </div>
                )}

                {/* 写メ日記 */}
                {activeSection === 'diary' && (
                  <div className="space-y-4 lg:space-y-6">
                    <div className="p-3 lg:p-5 bg-gray-50 rounded-xl">
                      <div className="flex flex-col sm:flex-row gap-3 lg:gap-4 mb-3 lg:mb-4">
                        <button className="w-20 h-20 lg:w-24 lg:h-24 rounded-xl border-2 border-dashed border-orange-300 flex items-center justify-center bg-orange-50 hover:bg-orange-100 transition-colors flex-shrink-0 mx-auto sm:mx-0">
                          <Upload className="w-6 h-6 lg:w-8 lg:h-8 text-orange-400" />
                        </button>
                        <Textarea
                          placeholder="今日のひとことを入力..."
                          value={newDiaryCaption}
                          onChange={(e) => setNewDiaryCaption(e.target.value)}
                          className="flex-1 bg-white border-gray-200 text-gray-800 placeholder:text-gray-400 text-sm lg:text-base"
                          rows={3}
                        />
                      </div>
                      <Button className="w-full bg-orange-500 hover:bg-orange-600 text-sm lg:text-base" onClick={handleAddDiary}>
                        投稿する
                      </Button>
                    </div>
                    <div className="grid gap-3 lg:gap-4">
                      {diaryEntries.map(entry => (
                        <div key={entry.id} className="p-3 lg:p-4 bg-gray-50 rounded-xl flex gap-3 lg:gap-4">
                          <div className="w-16 h-16 lg:w-24 lg:h-24 bg-gray-200 rounded-xl flex items-center justify-center flex-shrink-0">
                            <Camera className="w-6 h-6 lg:w-10 lg:h-10 text-gray-400" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between mb-1 lg:mb-2">
                              <span className="text-gray-500 text-xs lg:text-sm">{entry.date}</span>
                              <span className={`px-1.5 lg:px-2 py-0.5 lg:py-1 rounded-full text-[10px] lg:text-xs ${
                                entry.status === 'published' ? 'bg-green-100 text-green-600' : 'bg-gray-200 text-gray-600'
                              }`}>
                                {entry.status === 'published' ? '公開中' : '下書き'}
                              </span>
                            </div>
                            <p className="text-gray-700 mb-2 lg:mb-3 text-sm lg:text-base">{entry.caption}</p>
                            <div className="flex gap-2">
                              <Button size="sm" variant="outline" className="text-xs lg:text-sm h-7 lg:h-8 px-2 lg:px-3">
                                <Edit2 className="w-3 h-3 mr-1" />編集
                              </Button>
                              <Button size="sm" variant="outline" className="text-red-500 hover:text-red-600 hover:bg-red-50 text-xs lg:text-sm h-7 lg:h-8 px-2 lg:px-3">
                                <Trash2 className="w-3 h-3 mr-1" />削除
                              </Button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* 送迎車選択 */}
                {activeSection === 'car' && (
                  <div className="space-y-3 lg:space-y-4">
                    <p className="text-gray-500 mb-3 lg:mb-4 text-sm lg:text-base">出勤時に利用する送迎車を選択してください</p>
                    <div className="grid gap-2 lg:gap-3">
                      {availableCars.map(car => (
                        <button
                          key={car.id}
                          onClick={() => setSelectedCarId(car.id)}
                          className={`w-full p-3 lg:p-4 rounded-xl transition-all flex items-center gap-3 lg:gap-4 ${
                            selectedCarId === car.id
                              ? 'bg-gradient-to-r from-blue-500 to-cyan-500 shadow-lg shadow-blue-500/30'
                              : 'bg-gray-50 hover:bg-gray-100'
                          }`}
                        >
                          <div className={`w-10 h-10 lg:w-14 lg:h-14 rounded-full flex items-center justify-center flex-shrink-0 ${
                            selectedCarId === car.id ? 'bg-white/20' : 'bg-blue-100'
                          }`}>
                            <Car className={`w-5 h-5 lg:w-7 lg:h-7 ${selectedCarId === car.id ? 'text-white' : 'text-blue-500'}`} />
                          </div>
                          <div className="flex-1 text-left min-w-0">
                            <div className={`font-bold text-base lg:text-lg ${selectedCarId === car.id ? 'text-white' : 'text-gray-800'}`}>
                              {car.name}
                            </div>
                            <div className={`text-xs lg:text-sm ${selectedCarId === car.id ? 'text-white/70' : 'text-gray-500'}`}>
                              {car.driver}
                            </div>
                          </div>
                          <div className="text-right flex-shrink-0">
                            <div className={`text-[10px] lg:text-xs ${selectedCarId === car.id ? 'text-white/60' : 'text-gray-400'}`}>
                              到着予定
                            </div>
                            <div className={`font-bold text-lg lg:text-xl ${selectedCarId === car.id ? 'text-white' : 'text-gray-800'}`}>
                              {car.eta}
                            </div>
                          </div>
                        </button>
                      ))}
                    </div>
                    {selectedCarId && (
                      <Button className="w-full h-10 lg:h-12 text-sm lg:text-lg bg-blue-600 hover:bg-blue-700 mt-3 lg:mt-4">
                        この車両で確定する
                      </Button>
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
