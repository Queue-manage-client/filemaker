'use client';

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup } from "@/components/ui/radio-group";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { FileText, User2, ArrowLeft, Pen, UserPlus, Phone, List, Gift, Users, History, Search, LogIn, LogOut, X, Shield } from "lucide-react";
import { useToast } from '@/hooks/use-toast';
import { Customer, OperationLog } from '@/types';
import type { Vehicle, UsageHistory, PreferenceForm, ReceiptForm, PetOption, WorkAreaOption } from '@/types/customer-ledger';
import { sampleCustomers, sampleOperationLogs } from '@/data/customerSampleData';
import { isAfter, isBefore, parseISO, isValid } from 'date-fns';

// 型は分離済み

export default function CustomerLedger() {
  React.useEffect(() => {
    document.title = '顧客台帳 - Dispatch Harmony Hub';
  }, []);

  const [selectedCustomer, setSelectedCustomer] = useState<Customer>(sampleCustomers[0]);
  const [, setVehicles] = useState<Vehicle[]>([
    { id: '1', type: 'BMW 7シリーズ', color: 'ブラック', number: '品川300あ1234' }
  ]);
  
  // 管理者モード
  const [isAdminMode, setIsAdminMode] = useState(false);

  // 管理者ログインモーダル
  const ADMIN_CODE = 'admin1234';
  const [isAdminLoginModalOpen, setIsAdminLoginModalOpen] = useState(false);
  const [adminCodeInput, setAdminCodeInput] = useState('');
  const [adminCodeError, setAdminCodeError] = useState('');

  const handleAdminLogin = () => {
    if (adminCodeInput === ADMIN_CODE) {
      setIsAdminMode(true);
      setAdminCodeInput('');
      setAdminCodeError('');
      setIsAdminLoginModalOpen(false);
    } else {
      setAdminCodeError('管理者コードが正しくありません');
    }
  };

  const handleAdminLogout = () => {
    setIsAdminMode(false);
    setAdminCodeInput('');
    setAdminCodeError('');
  };

  // 操作ログモーダル
  const [isOperationLogModalOpen, setIsOperationLogModalOpen] = useState(false);
  const [operationLogs] = useState<OperationLog[]>(sampleOperationLogs);
  const [logFilterOperator, setLogFilterOperator] = useState('');
  const [logFilterDateFrom, setLogFilterDateFrom] = useState('');
  const [logFilterDateTo, setLogFilterDateTo] = useState('');

  const filteredOperationLogs = operationLogs.filter(log => {
    const matchOperator = logFilterOperator === '' || log.operatorName.includes(logFilterOperator);
    const logDate = parseISO(log.date);
    const matchDateFrom = logFilterDateFrom === '' || !isValid(parseISO(logFilterDateFrom)) || !isBefore(logDate, parseISO(logFilterDateFrom));
    const matchDateTo = logFilterDateTo === '' || !isValid(parseISO(logFilterDateTo)) || !isAfter(logDate, parseISO(logFilterDateTo + 'T23:59:59'));
    return matchOperator && matchDateFrom && matchDateTo;
  });

  // 顧客一覧フィルター
  const [customerSearchText, setCustomerSearchText] = useState('');
  const [customerEventFilter, setCustomerEventFilter] = useState('all');
  const [customerVisitDateFrom, setCustomerVisitDateFrom] = useState('');
  const [customerVisitDateTo, setCustomerVisitDateTo] = useState('');

  // 顧客一覧タブの選択状態
  const [selectedCustomerIds, setSelectedCustomerIds] = useState<string[]>([]);

  // アクティブタブ管理
  const [activeTab, setActiveTab] = useState<string>('customer-list');

  // 一括ポイント付与モーダル
  const [isBulkPointModalOpen, setIsBulkPointModalOpen] = useState(false);
  const [bulkPointSign, setBulkPointSign] = useState<'plus' | 'minus'>('plus');
  const [bulkPointAmount, setBulkPointAmount] = useState('');
  const [bulkPointRemarks, setBulkPointRemarks] = useState('');
  const [bulkManualIds, setBulkManualIds] = useState('');

  const { toast } = useToast();

  // 拡張サンプル顧客一覧（6件）
  const extendedCustomers: Customer[] = [
    ...sampleCustomers,
    { ...sampleCustomers[0], id: 'cust004', customerNumber: 'C-00004', name: '高橋一郎', nameKana: 'タカハシイチロウ', phoneNumber: '090-1111-2222', totalAmount: 320000, lastVisitDate: '2025-03-15', lastUsedEvent: '周年記念' },
    { ...sampleCustomers[1], id: 'cust005', customerNumber: 'C-00005', name: '伊藤めぐみ', nameKana: 'イトウメグミ', phoneNumber: '080-3333-4444', totalAmount: 180000, lastVisitDate: '2025-02-20', lastUsedEvent: '新春キャンペーン' },
    { ...sampleCustomers[2], id: 'cust006', customerNumber: 'C-00006', name: '渡辺健二', nameKana: 'ワタナベケンジ', phoneNumber: '070-5555-6666', totalAmount: 560000, lastVisitDate: '2025-01-05', lastUsedEvent: '夏フェス2025' },
  ];

  // フィルター後顧客一覧
  const filteredCustomers = extendedCustomers.filter(customer => {
    // テキスト検索（会員番号 OR 電話番号 OR 氏名フリガナ OR 氏名）
    const searchLower = customerSearchText.toLowerCase();
    const matchText = customerSearchText === '' || (
      customer.customerNumber.toLowerCase().includes(searchLower) ||
      customer.phoneNumber.includes(customerSearchText) ||
      customer.nameKana.toLowerCase().includes(searchLower) ||
      customer.name.includes(customerSearchText)
    );
    // イベントフィルター
    const matchEvent = customerEventFilter === 'all' || customer.lastUsedEvent === customerEventFilter;
    // 来店日フィルター
    const visitDate = customer.lastVisitDate ? parseISO(customer.lastVisitDate) : null;
    const matchDateFrom = customerVisitDateFrom === '' || !visitDate || !isValid(parseISO(customerVisitDateFrom)) || !isBefore(visitDate, parseISO(customerVisitDateFrom));
    const matchDateTo = customerVisitDateTo === '' || !visitDate || !isValid(parseISO(customerVisitDateTo)) || !isAfter(visitDate, parseISO(customerVisitDateTo));
    return matchText && matchEvent && matchDateFrom && matchDateTo;
  });

  // 利用イベント一覧（ユニーク）
  const eventOptions = Array.from(
    new Set(extendedCustomers.map(c => c.lastUsedEvent).filter((e): e is string => !!e))
  );

  // 顧客ポイント残高サンプル
  const customerPointsMap: Record<string, number> = {
    cust001: 3420, cust002: 1680, cust003: 8200,
    cust004: 500, cust005: 1200, cust006: 4500,
  };

  const handleToggleCustomer = (id: string) => {
    setSelectedCustomerIds(prev =>
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    );
  };

  const handleSelectAll = () => {
    if (selectedCustomerIds.length === filteredCustomers.length && filteredCustomers.length > 0) {
      setSelectedCustomerIds([]);
    } else {
      setSelectedCustomerIds(filteredCustomers.map(c => c.id));
    }
  };

  const handleBulkPointSave = () => {
    const manualIdList = bulkManualIds
      .split(/[,\n]/)
      .map(s => s.trim())
      .filter(Boolean);
    const allIds = Array.from(new Set([...selectedCustomerIds, ...manualIdList]));
    const count = allIds.length;
    const amount = parseInt(bulkPointAmount, 10);
    if (!count) {
      toast({ title: 'エラー', description: '対象顧客を選択してください', variant: 'destructive' });
      return;
    }
    if (!bulkPointAmount || isNaN(amount) || amount <= 0) {
      toast({ title: 'エラー', description: 'ポイント数を正しく入力してください', variant: 'destructive' });
      return;
    }
    toast({
      title: `${count}件にポイント付与しました`,
      description: `${bulkPointSign === 'plus' ? '+' : '-'}${amount.toLocaleString()}ポイント${bulkPointRemarks ? ` / ${bulkPointRemarks}` : ''}`,
    });
    setIsBulkPointModalOpen(false);
    setBulkPointAmount('');
    setBulkPointRemarks('');
    setBulkManualIds('');
  };

  const [kanaFilter, setKanaFilter] = useState<string>('all');
  const [preferenceForm, setPreferenceForm] = useState<PreferenceForm>({
    favoriteType: '',
    speakingStyle: '',
    dislikedType: ''
  });
  const [petSelections, setPetSelections] = useState<Record<PetOption, boolean>>({
    dog: false,
    cat: false,
    none: false,
    other: false
  });
  const [workArea, setWorkArea] = useState<WorkAreaOption>('local');
  const [receiptForm, setReceiptForm] = useState<ReceiptForm>({
    recipient: '',
    note: ''
  });

  // 新規顧客ダイアログ
  const [showNewCustomerDialog, setShowNewCustomerDialog] = useState(false);
  const [newCustomerPhone, setNewCustomerPhone] = useState('');
  const [newCustomerName, setNewCustomerName] = useState('');
  const [newCustomerNameKana, setNewCustomerNameKana] = useState('');

  const handleNewCustomer = () => {
    // 着信番号を自動取得する想定（デモでは最後に架電された番号をシミュレート）
    const simulatedCallerNumber = '090-1234-5678';
    setNewCustomerPhone(simulatedCallerNumber);
    setNewCustomerName('');
    setNewCustomerNameKana('');
    setShowNewCustomerDialog(true);
  };

  const handleSaveNewCustomer = () => {
    // フロントエンドのみ: 保存処理のシミュレーション
    setShowNewCustomerDialog(false);
  };

  // 顧客の統計カード表示状態
  const [showCustomerStats, setShowCustomerStats] = useState(false);
  const statsCardRef = useRef<HTMLDivElement>(null);

  // カード外クリックで閉じる
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (statsCardRef.current && !statsCardRef.current.contains(event.target as Node)) {
        setShowCustomerStats(false);
      }
    };

    if (showCustomerStats) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showCustomerStats]);

  // 本日の利用回数（サンプル値）
  const todayVisitCount = 3;

  // 顧客の統計データ
  const customerStats = {
    firstVisit: '2017/04/07',
    historyCount: 4,
    continuousDays: 3064,
    nominationCount: 1,
    nominationRate: 25,
    extensionCount: null as number | null,
    averageTime: 30,
    totalAmount: 240000,
    averageAmount: 60000
  };

  // ポイント履歴ウィンドウを開く関数
  const openPointHistoryWindow = () => {
    const width = Math.floor(window.screen.width / 2);
    const height = 600;
    const left = Math.floor((window.screen.width - width) / 2);
    const top = Math.floor((window.screen.height - height) / 2);
    window.open(
      '/customer-ledger/point-history',
      'pointHistory',
      `width=${width},height=${height},left=${left},top=${top},scrollbars=yes,resizable=yes`
    );
  };

  // メモ履歴の状態管理
  const [customerMemoHistory, setCustomerMemoHistory] = useState<Array<{
    id: string;
    date: string;
    author: string;
    content: string;
  }>>([
    { id: '5', date: '2025/01/26 14:30', author: '山田', content: '本日来店。前回と同様90分コース希望。お酒は控えめに。' },
    { id: '4', date: '2025/01/20 18:45', author: '佐藤', content: '指名あり。会話が好きなタイプ。時間に余裕を持った対応を。' },
    { id: '3', date: '2025/01/15 12:00', author: '山田', content: '誕生日プレゼントを渡した。とても喜んでいた。' },
    { id: '2', date: '2025/01/10 20:15', author: '鈴木', content: '初めてのご利用。紹介での来店。丁寧な対応を心がける。' },
    { id: '1', date: '2025/01/05 16:00', author: '田中', content: '新規顧客登録。仕事帰りの利用が多いとのこと。' },
  ]);
  const [newMemo, setNewMemo] = useState('');

  // メモを追加する関数
  const addMemo = () => {
    if (newMemo.trim()) {
      const now = new Date();
      const dateStr = `${now.getFullYear()}/${String(now.getMonth() + 1).padStart(2, '0')}/${String(now.getDate()).padStart(2, '0')} ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
      setCustomerMemoHistory(prev => [{
        id: Date.now().toString(),
        date: dateStr,
        author: '現在のユーザー',
        content: newMemo,
      }, ...prev]);
      setNewMemo('');
    }
  };

  const [usageHistory] = useState<UsageHistory[]>([
    {
      id: '1',
      receptionNumber: 'R-2025-001',
      date: '2025-01-26',
      storeName: '本店',
      staffName: '佐藤美智子',
      category: 'ガールズ',
      startTime: '19:00',
      endTime: '23:30',
      amount: 45000,
      status: 'completed'
    },
    {
      id: '2',
      receptionNumber: 'R-2025-002',
      date: '2025-01-25',
      storeName: '銀座支店',
      staffName: 'あ',
      category: 'プレミアム',
      startTime: '20:00',
      endTime: '01:00',
      amount: 68000,
      status: 'completed'
    },
    {
      id: '3',
      receptionNumber: 'R-2025-003',
      date: '2025-01-24',
      storeName: '本店',
      staffName: '山田愛子',
      category: 'ガールズ',
      startTime: '18:30',
      endTime: '',
      amount: 0,
      status: 'absent'
    },
    {
      id: '4',
      receptionNumber: 'R-2025-004',
      date: '2025-01-23',
      storeName: '新宿支店',
      staffName: '鈴木麻美',
      category: 'スタンダード',
      startTime: '19:30',
      endTime: '22:45',
      amount: 32000,
      status: 'completed'
    },
    {
      id: '5',
      receptionNumber: 'R-2025-005',
      date: '2025-01-22',
      storeName: 'VIPルーム',
      staffName: '高橋美香',
      category: 'プレミアム',
      startTime: '20:30',
      endTime: '02:15',
      amount: 95000,
      status: 'completed'
    }
  ]);

  const _handleCustomerChange = (updatedFields: Partial<Customer>) => {
    setSelectedCustomer(prev => ({
      ...prev,
      ...updatedFields
    }));
  };

  const _addVehicle = () => {
    const newVehicle: Vehicle = {
      id: Date.now().toString(),
      type: '',
      color: '',
      number: ''
    };
    setVehicles(prev => [...prev, newVehicle]);
  };

  const _removeVehicle = (id: string) => {
    setVehicles(prev => prev.filter(v => v.id !== id));
  };

  const _updateVehicle = (id: string, field: keyof Omit<Vehicle, 'id'>, value: string) => {
    setVehicles(prev => prev.map(v =>
      v.id === id ? { ...v, [field]: value } : v
    ));
  };

  // フィルタリングされた履歴
  const filteredHistory = usageHistory.filter(history => {
    if (kanaFilter === 'all') return true;
    return history.staffName.charAt(0) === kanaFilter;
  });

  // 五十音グリッド配置（指定の並び）
  const rawKanaRows = [
    'あかさたなはまやらわ',
    'いきしちにひみ　り　',
    'うくすつぬふぬゆるを',
    'えけせてねへめ　れ　',
    'おこそとのほもよろん'
  ];

  const kanaGridRows: string[][] = rawKanaRows.map(row =>
    Array.from(row).map(char => (char === '　' ? '' : char))
  );

  const petOptions: { key: PetOption; label: string }[] = [
    { key: 'dog', label: '犬' },
    { key: 'cat', label: '猫' },
    { key: 'none', label: 'なし' },
    { key: 'other', label: 'その他' }
  ];

  const handlePreferenceChange = (field: keyof PreferenceForm, value: string) => {
    setPreferenceForm(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const togglePetSelection = (option: PetOption) => {
    setPetSelections(prev => {
      const next = { ...prev };
      if (option === 'none') {
        // 「なし」を選択したら他を解除
        next.none = !prev.none;
        if (next.none) {
          next.dog = false;
          next.cat = false;
          next.other = false;
        }
      } else {
        const newValue = !prev[option];
        next[option] = newValue;
        if (newValue && prev.none) {
          next.none = false;
        }
      }
      return next;
    });
  };

  const handleReceiptChange = (field: keyof ReceiptForm, value: string) => {
    setReceiptForm(prev => ({
      ...prev,
      [field]: value
    }));
  };

  return (
    <div className="min-h-screen bg-pink-100 p-0.5">
      {/* ヘッダー */}
      <div className="bg-white p-1 mb-0">
        <div>
          <div className="flex items-center justify-between">
            {/* 左側：ダッシュボードに戻るボタンとナビゲーションボタン */}
            <div className="flex items-center gap-2">
              <Link href="/dashboard">
                <Button
                  variant="outline"
                  className="flex items-center gap-2"
                >
                  <ArrowLeft className="w-4 h-4" />
                  ダッシュボードに戻る
                </Button>
              </Link>
              <Link href="/customer-ledger">
                <button
                  className="px-4 py-2 bg-blue-500 border-2 border-blue-700 text-white text-sm font-semibold rounded hover:bg-blue-600 transition-colors"
                >
                  顧客検索
                </button>
              </Link>
              <Link href="/dispatch-panel-2d">
                <button
                  className="px-4 py-2 bg-amber-200 border-2 border-amber-700 text-amber-900 text-sm font-semibold rounded hover:bg-amber-300 transition-colors"
                >
                  配車パネル
                </button>
              </Link>
              <Link href="/rt2-panel">
                <button
                  className="px-4 py-2 bg-pink-300 border-2 border-pink-700 text-pink-900 text-sm font-semibold rounded hover:bg-pink-400 transition-colors"
                >
                  RTⅡパネル
                </button>
              </Link>
              <button
                onClick={() => {
                  // RTパネルの処理をここに追加
                }}
                className="px-4 py-2 bg-yellow-300 border-2 border-yellow-700 text-yellow-900 text-sm font-semibold rounded hover:bg-yellow-400 transition-colors"
              >
                RTパネル
              </button>
              <button
                onClick={() => {
                  // 新規顧客検索の処理をここに追加
                }}
                className="px-4 py-2 bg-green-500 border-2 border-green-700 text-white text-sm font-semibold rounded hover:bg-green-600 transition-colors"
              >
                新規顧客検索
              </button>
              <button
                onClick={handleNewCustomer}
                className="px-4 py-2 bg-orange-500 border-2 border-orange-700 text-white text-sm font-semibold rounded hover:bg-orange-600 transition-colors flex items-center gap-1"
              >
                <UserPlus className="w-4 h-4" />
                新規顧客
              </button>
            </div>
            
            {/* 右側：統合顧客テキストと追加情報 */}
            <div className="flex items-center gap-3 flex-1 justify-end">
              {/* OTNb 7 */}
              <div className="text-purple-600 text-sm font-semibold">
                OTNb 7
              </div>
              
              {/* 統合済み情報 */}
              <div className="text-sm">
                <div className="text-gray-900">統合済 2011/9/13</div>
                <div className="text-gray-900">京都へ統合</div>
              </div>
              
              {/* 訂正ボタン */}
              <button
                onClick={() => {
                  // 訂正の処理をここに追加
                }}
                className="px-3 py-1.5 bg-pink-100 border-2 border-pink-400 text-pink-700 text-sm font-semibold rounded hover:bg-pink-200 transition-colors"
              >
                訂正
              </button>
              
              {/* 変更/更新情報 */}
              <div className="text-sm">
                <div className="text-red-800 font-semibold">Cbango 324</div>
                <div className="text-red-800">更新日時:2005/08/28 2:33:42</div>
              </div>
              
              {/* ポイントー括送信ボタン */}
              {isAdminMode && (
                <button
                  onClick={() => setIsBulkPointModalOpen(true)}
                  className="px-3 py-1.5 bg-green-100 border-2 border-green-500 text-green-800 text-sm font-semibold rounded hover:bg-green-200 transition-colors whitespace-nowrap flex items-center gap-1"
                >
                  <Gift className="w-4 h-4" />
                  ポイント一括付与
                </button>
              )}

              {/* 操作履歴ボタン */}
              <button
                onClick={() => setIsOperationLogModalOpen(true)}
                className="px-3 py-1.5 bg-slate-100 border-2 border-slate-400 text-slate-700 text-sm font-semibold rounded hover:bg-slate-200 transition-colors whitespace-nowrap flex items-center gap-1"
              >
                <History className="w-4 h-4" />
                操作履歴
              </button>

              {/* 管理者ログイン/ログアウト */}
              {isAdminMode ? (
                <div className="flex items-center gap-2 ml-2 border border-blue-300 rounded px-2 py-1 bg-blue-50">
                  <Shield className="w-4 h-4 text-blue-600" />
                  <span className="text-xs font-semibold text-blue-700 whitespace-nowrap">管理者モード</span>
                  <button
                    type="button"
                    onClick={handleAdminLogout}
                    className="flex items-center gap-1 text-xs text-red-600 hover:text-red-800 font-semibold whitespace-nowrap"
                  >
                    <LogOut className="w-3 h-3" />
                    ログアウト
                  </button>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => setIsAdminLoginModalOpen(true)}
                  className="flex items-center gap-1 px-3 py-1.5 bg-gray-100 border-2 border-gray-400 text-gray-700 text-sm font-semibold rounded hover:bg-gray-200 transition-colors whitespace-nowrap"
                >
                  <LogIn className="w-4 h-4" />
                  管理者モード
                </button>
              )}
              
              {/* 訂正ボタン2 */}
              <button
                onClick={() => {
                  // 訂正の処理をここに追加
                }}
                className="px-3 py-1.5 bg-pink-100 border-2 border-pink-400 text-pink-700 text-sm font-semibold rounded hover:bg-pink-200 transition-colors"
              >
                訂正
              </button>
            </div>
            
            {/* 編集アイコン（右端） */}
            <button
              onClick={() => {
                // 編集の処理をここに追加
              }}
              className="w-8 h-8 border-2 border-gray-300 rounded flex items-center justify-center hover:bg-gray-100 transition-colors"
            >
              <Pen className="w-4 h-4 text-blue-600" />
            </button>
          </div>
        </div>
      </div>

      {/* 顧客情報ヘッダー */}
      <div className="bg-white p-1 mb-0">
        <div>
          {/* 第1行 */}
          <div className="flex items-center h-7 gap-1">
            {/* 顧客番号 */}
            <span className="text-xs">顧客番号</span>
            <div className="w-6 h-6 bg-yellow-100 border border-gray-400"></div>
            <input
              value="324"
              className="w-16 px-1 text-sm border border-gray-400 bg-white outline-none h-6"
              onChange={() => {}}
            />

            {/* 会員番号 */}
            <span className="text-xs ml-2 font-semibold text-blue-700">会員番号</span>
            <input
              value="M-2024-00324"
              className="w-28 px-1 text-sm border-2 border-blue-400 bg-blue-50 outline-none h-6 font-bold text-blue-800"
              onChange={() => {}}
            />

            {/* 名前 */}
            <span className="text-xs ml-2">名前</span>
            <div className="w-20 h-6 bg-white border border-gray-400"></div>
            <input
              value="ミヤタ"
              className="w-20 px-1 text-sm font-bold border border-gray-400 bg-white outline-none h-6"
              onChange={() => {}}
            />
            {/* キャストNG表示 - 名前の横に配置して視認性向上 */}
            <span className="ml-1 px-2 py-0.5 bg-red-600 text-white text-xs font-bold rounded animate-pulse">
              NG 3件
            </span>
            {/* 本日利用回数バッジ */}
            <span className="ml-2 px-2 py-0.5 bg-blue-100 text-blue-800 text-xs font-bold rounded-full">
              本日 {todayVisitCount}回目
            </span>

            {/* 氏名ふりがな */}
            <span className="text-xs ml-2">氏名ふりがな</span>
            <input
              value="みやた"
              className="w-20 px-1 text-sm border border-gray-400 bg-white outline-none h-6"
              onChange={() => {}}
            />

            {/* 1 */}
            <span className="text-xs border border-gray-400 px-2 h-6 flex items-center bg-white">1</span>

            {/* 京都ホテル俱楽部 */}
            <span className="text-xs ml-2">京都ホテル俱楽部</span>

            {/* L */}
            <div className="w-8 h-8 bg-purple-600 text-white text-sm font-bold flex items-center justify-center border border-purple-800 rounded">L</div>

            {/* 空白フィールド */}
            <div className="w-48 border border-gray-400 bg-white h-6"></div>

            {/* 小さいブロック */}
            <div className="w-16 border border-gray-400 bg-white h-6"></div>

            {/* Web登録チェックボックス */}
            <div className="flex items-center gap-1 text-xs border border-gray-400 px-2 h-6 bg-white">
              <input type="checkbox" className="w-3 h-3" />
              <span>Web登録</span>
            </div>
          </div>

          {/* 第2行 */}
          <div className="flex items-center h-7 gap-1 mt-1">
            {/* 旧顧客番号 */}
            <span className="text-xs">旧顧客番号</span>
            <div className="w-16 h-6 px-1 text-sm flex items-center border border-gray-400 bg-white">324</div>

            {/* 参照メディア */}
            <span className="text-xs ml-2">参照メディア</span>
            <div className="w-6 h-6 px-1 text-sm flex items-center justify-center border border-gray-400 bg-white">2</div>

            {/* ヘブンネット */}
            <div className="w-28 h-6 px-1 text-xs flex items-center border border-gray-400 bg-white">ヘブンネット</div>


            {/* 空白フィールド（長い） */}
            <div className="w-32 h-6 border border-gray-400 bg-white"></div>

            {/* 記帳者 */}
            <span className="text-xs ml-2">記帳者</span>
            <div className="w-10 h-6 px-1 text-sm flex items-center justify-center border border-gray-400 bg-white">328</div>

            {/* 岸本 礼人 */}
            <div className="w-20 h-6 px-1 text-xs flex items-center border border-gray-400 bg-white">岸本 礼人</div>

            {/* 統合済 */}
            <div className="h-6 px-2 text-xs flex items-center bg-blue-600 text-white">統合済</div>

            {/* 空白 */}
            <div className="w-8 h-6 border border-gray-400 bg-white"></div>
          </div>
        </div>
      </div>

      {/* メインコンテンツエリア - タブ構造 */}
      <div className="bg-white">
        <div>
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            {/* カスタムタブヘッダー */}
            <TabsList className="h-auto p-0 bg-transparent grid grid-cols-3 w-full">
              <TabsTrigger
                value="customer-list"
                className="bg-pink-100 border border-gray-400 px-3 py-1 text-xs font-medium text-gray-800 data-[state=active]:bg-white data-[state=active]:border-b-white relative z-10 rounded-none justify-start"
              >
                <Users className="w-3 h-3 mr-1" />
                顧客一覧
              </TabsTrigger>
              <TabsTrigger
                value="basic-info"
                className="bg-pink-100 border border-gray-400 border-l-0 px-3 py-1 text-xs font-medium text-gray-800 data-[state=active]:bg-white data-[state=active]:border-b-white relative z-10 rounded-none justify-start"
              >
                <FileText className="w-3 h-3 mr-1" />
                基本情報
              </TabsTrigger>
              <TabsTrigger
                value="profile"
                className="bg-pink-100 border border-gray-400 border-l-0 px-3 py-1 text-xs font-medium text-gray-800 data-[state=active]:bg-white data-[state=active]:border-b-white relative z-10 rounded-none justify-start"
              >
                <User2 className="w-3 h-3 mr-1" />
                プロフィール
              </TabsTrigger>
            </TabsList>

            {/* 顧客一覧タブ */}
            <TabsContent value="customer-list" className="mt-0 border border-gray-400 border-t-0 bg-pink-50">
              {/* フィルターバー */}
              <div className="px-3 py-2 bg-white border-b border-gray-200 space-y-2">
                {/* テキスト検索 */}
                <div className="flex items-center gap-2 flex-wrap">
                  <div className="flex items-center gap-1 flex-1 min-w-[200px]">
                    <Search className="w-3 h-3 text-gray-400 flex-shrink-0" />
                    <input
                      type="text"
                      value={customerSearchText}
                      onChange={(e) => setCustomerSearchText(e.target.value)}
                      placeholder="会員番号・電話番号・氏名・フリガナで検索"
                      className="flex-1 h-7 text-xs px-2 border border-gray-300 rounded outline-none focus:border-blue-400 bg-white"
                    />
                  </div>
                  {/* イベントフィルター */}
                  <div className="flex items-center gap-1">
                    <span className="text-xs text-gray-600 whitespace-nowrap">イベント:</span>
                    <Select value={customerEventFilter} onValueChange={setCustomerEventFilter}>
                      <SelectTrigger className="h-7 text-xs w-40 border-gray-300">
                        <SelectValue placeholder="すべて" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">すべて</SelectItem>
                        {eventOptions.map(ev => (
                          <SelectItem key={ev} value={ev}>{ev}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                {/* 来店期間フィルター */}
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-xs text-gray-600 whitespace-nowrap">来店期間:</span>
                  <input
                    type="date"
                    value={customerVisitDateFrom}
                    onChange={(e) => setCustomerVisitDateFrom(e.target.value)}
                    className="h-7 text-xs px-2 border border-gray-300 rounded outline-none focus:border-blue-400 bg-white"
                  />
                  <span className="text-xs text-gray-500">〜</span>
                  <input
                    type="date"
                    value={customerVisitDateTo}
                    onChange={(e) => setCustomerVisitDateTo(e.target.value)}
                    className="h-7 text-xs px-2 border border-gray-300 rounded outline-none focus:border-blue-400 bg-white"
                  />
                  {(customerSearchText || customerEventFilter !== 'all' || customerVisitDateFrom || customerVisitDateTo) && (
                    <button
                      onClick={() => {
                        setCustomerSearchText('');
                        setCustomerEventFilter('all');
                        setCustomerVisitDateFrom('');
                        setCustomerVisitDateTo('');
                      }}
                      className="flex items-center gap-1 text-xs text-gray-500 hover:text-red-500 border border-gray-300 rounded px-2 py-0.5"
                    >
                      <X className="w-3 h-3" />
                      クリア
                    </button>
                  )}
                  <span className="text-xs text-gray-500 ml-auto">{filteredCustomers.length}件</span>
                </div>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-xs border-collapse">
                  <thead>
                    <tr className="bg-pink-100 border-b border-gray-400">
                      {isAdminMode && (
                        <th className="w-8 px-2 py-2 text-center border-r border-gray-300">
                          <input
                            type="checkbox"
                            className="w-3 h-3"
                            checked={selectedCustomerIds.length === filteredCustomers.length && filteredCustomers.length > 0}
                            onChange={handleSelectAll}
                          />
                        </th>
                      )}
                      <th className="px-3 py-2 text-left border-r border-gray-300 font-semibold text-gray-700">会員番号</th>
                      <th className="px-3 py-2 text-left border-r border-gray-300 font-semibold text-gray-700">氏名</th>
                      <th className="px-3 py-2 text-left border-r border-gray-300 font-semibold text-gray-700">フリガナ</th>
                      <th className="px-3 py-2 text-left border-r border-gray-300 font-semibold text-gray-700">電話番号</th>
                      <th className="px-3 py-2 text-left border-r border-gray-300 font-semibold text-gray-700">最終来店日</th>
                      <th className="px-3 py-2 text-left border-r border-gray-300 font-semibold text-gray-700">利用イベント</th>
                      <th className="px-3 py-2 text-right font-semibold text-gray-700">現在ポイント</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredCustomers.length === 0 ? (
                      <tr>
                        <td colSpan={isAdminMode ? 8 : 7} className="px-4 py-6 text-center text-xs text-gray-400">
                          条件に一致する顧客が見つかりません
                        </td>
                      </tr>
                    ) : filteredCustomers.map((customer, idx) => (
                      <tr
                        key={customer.id}
                        className={`border-b border-gray-200 cursor-pointer hover:bg-blue-50 ${
                          selectedCustomer.id === customer.id ? 'bg-blue-100' : idx % 2 === 0 ? 'bg-white' : 'bg-gray-50'
                        }`}
                        onClick={() => {
                          setSelectedCustomer(customer);
                          setActiveTab('basic-info');
                        }}
                      >
                        {isAdminMode && (
                          <td
                            className="w-8 px-2 py-1.5 text-center border-r border-gray-200"
                            onClick={(e) => { e.stopPropagation(); handleToggleCustomer(customer.id); }}
                          >
                            <input
                              type="checkbox"
                              className="w-3 h-3"
                              checked={selectedCustomerIds.includes(customer.id)}
                              onChange={() => handleToggleCustomer(customer.id)}
                            />
                          </td>
                        )}
                        <td className="px-3 py-1.5 border-r border-gray-200 font-mono text-blue-700">{customer.customerNumber}</td>
                        <td className="px-3 py-1.5 border-r border-gray-200 font-semibold">{customer.name}</td>
                        <td className="px-3 py-1.5 border-r border-gray-200 text-gray-600">{customer.nameKana}</td>
                        <td className="px-3 py-1.5 border-r border-gray-200">{customer.phoneNumber}</td>
                        <td className="px-3 py-1.5 border-r border-gray-200 text-gray-600">{customer.lastVisitDate ?? '—'}</td>
                        <td className="px-3 py-1.5 border-r border-gray-200">
                          {customer.lastUsedEvent ? (
                            <span className="px-1.5 py-0.5 bg-purple-100 text-purple-700 rounded text-xs">{customer.lastUsedEvent}</span>
                          ) : '—'}
                        </td>
                        <td className="px-3 py-1.5 text-right font-semibold text-green-700">
                          {(customerPointsMap[customer.id] ?? 0).toLocaleString()}
                          <span className="text-gray-500 font-normal ml-1">pt</span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              {isAdminMode && selectedCustomerIds.length > 0 && (
                <div className="flex items-center gap-3 px-4 py-2 bg-green-50 border-t border-green-200">
                  <span className="text-sm text-green-800 font-semibold">{selectedCustomerIds.length}件選択中</span>
                  <button
                    onClick={() => setIsBulkPointModalOpen(true)}
                    className="px-4 py-1.5 bg-green-500 text-white text-sm font-semibold rounded hover:bg-green-600 transition-colors flex items-center gap-1"
                  >
                    <Gift className="w-4 h-4" />
                    ポイント一括付与
                  </button>
                </div>
              )}
            </TabsContent>

            {/* 基本情報タブ */}
            <TabsContent value="basic-info" className="mt-0 p-1 border border-gray-400 border-t-0 text-xs bg-pink-50">
              <div className="grid grid-cols-1 lg:grid-cols-[0.8fr_1.2fr_1.2fr] gap-1">
                
                {/* 左カラム - 基本情報入力エリア */}
                <div className="space-y-0 bg-white rounded p-1 border border-gray-300">

                  {/* 電話番号（複数欄） */}
                  <div className="p-1 space-y-1">
                    <div className="flex items-center gap-2">
                      <Label className="text-xs font-semibold whitespace-nowrap w-16">電話番号</Label>
                      <Input
                        placeholder="080-1234-5678"
                        className="w-36 h-7 text-xs border-gray-500 bg-white"
                      />
                      <Button variant="outline" size="sm" className="h-7 text-xs whitespace-nowrap">
                        同一電話番号登録G1
                      </Button>
                      <span className="text-xs">0件</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-16"></div>
                      <Input
                        placeholder="050-1234-5678"
                        className="w-36 h-7 text-xs border-gray-500 bg-white"
                      />
                      <Button variant="outline" size="sm" className="h-7 text-xs whitespace-nowrap">
                        同一電話番号登録G2
                      </Button>
                      <span className="text-xs">0件</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-16"></div>
                      <Input
                        placeholder="050-1234-5678"
                        className="w-36 h-7 text-xs border-gray-500 bg-white"
                      />
                      <span className="text-green-600 text-xs cursor-pointer">🔄 同一電話番号</span>
                      <span className="text-xs">0件</span>
                    </div>
                  </div>

                  {/* メールアドレス */}
                  <div className="p-1 space-y-1">
                    <div className="flex items-center gap-2">
                      <Label className="text-xs font-semibold w-16">Webmail</Label>
                      <Input className="w-36 h-7 text-xs border-gray-500 bg-white" type="email" placeholder="" />
                      <label className="flex items-center gap-1 text-xs whitespace-nowrap">
                        <input type="checkbox" className="w-3 h-3" />
                        Web登録
                      </label>
                    </div>
                    <div className="flex items-center gap-2">
                      <Label className="text-xs font-semibold w-16">携帯メール</Label>
                      <Input className="w-36 h-7 text-xs border-gray-500 bg-white" type="email" placeholder="" />
                    </div>
                    <div className="flex items-center gap-2">
                      <Label className="text-xs font-semibold w-16">PCメール</Label>
                      <Input className="w-36 h-7 text-xs border-gray-500 bg-white" type="email" placeholder="" />
                    </div>
                  </div>

                  {/* 連絡方法・メルマガ */}
                  <div className="p-1 space-y-1">
                    <div className="flex items-center gap-4">
                      <span className="text-xs font-semibold">連絡方法</span>
                      <label className="flex items-center gap-1 text-xs">
                        <Checkbox id="contact-phone" className="w-3 h-3" />
                        電話
                      </label>
                      <label className="flex items-center gap-1 text-xs">
                        <Checkbox id="contact-email" className="w-3 h-3" />
                        メール
                      </label>
                      <label className="flex items-center gap-1 text-xs">
                        <Checkbox id="contact-none" className="w-3 h-3" />
                        なし
                      </label>
                      <label className="flex items-center gap-1 text-xs ml-4">
                        <Checkbox id="newsletter" className="w-3 h-3" />
                        メルマガ有
                      </label>
                    </div>
                  </div>

                  {/* 住所 */}
                  <div className="p-1 space-y-1">
                    {/* 住所フリガナ */}
                    <div className="flex items-center gap-2">
                      <Label className="text-xs font-semibold w-20">住所フリガナ</Label>
                      <Input className="w-56 h-6 text-xs border-gray-400 bg-yellow-50" placeholder="例: トウキョウトシンジュクク" />
                    </div>
                    {/* 郵便番号 */}
                    <div className="flex items-center gap-2">
                      <Label className="text-xs font-semibold w-20">郵便番号</Label>
                      <Input className="w-28 h-6 text-xs border-gray-500 bg-white" placeholder="000-0000" />
                      <Button variant="outline" size="sm" className="h-6 text-xs px-2">
                        住所検索
                      </Button>
                    </div>
                    {/* 住所構造化入力 - 2カラムグリッド */}
                    <div className="grid grid-cols-2 gap-x-3 gap-y-1">
                      {/* 都道府県 */}
                      <div className="flex flex-col gap-0.5">
                        <Label className="text-xs font-semibold">都道府県</Label>
                        <select className="h-6 text-xs border border-gray-500 bg-white rounded px-1 outline-none focus:border-blue-400">
                          <option value="">選択してください</option>
                          <option value="北海道">北海道</option>
                          <option value="青森県">青森県</option>
                          <option value="岩手県">岩手県</option>
                          <option value="宮城県">宮城県</option>
                          <option value="秋田県">秋田県</option>
                          <option value="山形県">山形県</option>
                          <option value="福島県">福島県</option>
                          <option value="茨城県">茨城県</option>
                          <option value="栃木県">栃木県</option>
                          <option value="群馬県">群馬県</option>
                          <option value="埼玉県">埼玉県</option>
                          <option value="千葉県">千葉県</option>
                          <option value="東京都">東京都</option>
                          <option value="神奈川県">神奈川県</option>
                          <option value="新潟県">新潟県</option>
                          <option value="富山県">富山県</option>
                          <option value="石川県">石川県</option>
                          <option value="福井県">福井県</option>
                          <option value="山梨県">山梨県</option>
                          <option value="長野県">長野県</option>
                          <option value="岐阜県">岐阜県</option>
                          <option value="静岡県">静岡県</option>
                          <option value="愛知県">愛知県</option>
                          <option value="三重県">三重県</option>
                          <option value="滋賀県">滋賀県</option>
                          <option value="京都府">京都府</option>
                          <option value="大阪府">大阪府</option>
                          <option value="兵庫県">兵庫県</option>
                          <option value="奈良県">奈良県</option>
                          <option value="和歌山県">和歌山県</option>
                          <option value="鳥取県">鳥取県</option>
                          <option value="島根県">島根県</option>
                          <option value="岡山県">岡山県</option>
                          <option value="広島県">広島県</option>
                          <option value="山口県">山口県</option>
                          <option value="徳島県">徳島県</option>
                          <option value="香川県">香川県</option>
                          <option value="愛媛県">愛媛県</option>
                          <option value="高知県">高知県</option>
                          <option value="福岡県">福岡県</option>
                          <option value="佐賀県">佐賀県</option>
                          <option value="長崎県">長崎県</option>
                          <option value="熊本県">熊本県</option>
                          <option value="大分県">大分県</option>
                          <option value="宮崎県">宮崎県</option>
                          <option value="鹿児島県">鹿児島県</option>
                          <option value="沖縄県">沖縄県</option>
                        </select>
                      </div>
                      {/* 市区町村 */}
                      <div className="flex flex-col gap-0.5">
                        <Label className="text-xs font-semibold">市区町村</Label>
                        <Input className="h-6 text-xs border-gray-500 bg-white" placeholder="" />
                      </div>
                      {/* 丁目・番地・号 */}
                      <div className="flex flex-col gap-0.5">
                        <Label className="text-xs font-semibold leading-tight">
                          丁目・番地・号
                          <span className="text-[9px] font-normal text-gray-500 ml-1">（半角数字）</span>
                        </Label>
                        <Input className="h-6 text-xs border-gray-500 bg-white" placeholder="半角数字で入力" />
                      </div>
                      {/* 建物名・部屋番号 */}
                      <div className="flex flex-col gap-0.5">
                        <Label className="text-xs font-semibold">建物名・部屋番号</Label>
                        <Input className="h-6 text-xs border-gray-500 bg-white" placeholder="" />
                      </div>
                    </div>
                    {/* 京都市内住所 */}
                    <div className="flex items-center gap-2">
                      <Label className="text-xs font-semibold w-20">京都市内住所</Label>
                      <Input className="w-28 h-6 text-xs border-gray-500 bg-white" placeholder="" />
                    </div>
                    {/* 住所備考 */}
                    <div className="flex items-center gap-2">
                      <Label className="text-xs font-semibold w-20">住所備考</Label>
                    </div>
                    <Textarea
                      className="min-h-[48px] text-xs border-gray-500 bg-white"
                      placeholder=""
                    />
                  </div>

                  {/* 地区区分 */}
                  <div className="p-1 space-y-1">
                    <div className="flex items-center gap-2">
                      <Label className="text-xs font-semibold w-16">地域区分</Label>
                      <Input className="w-16 h-7 text-xs border-gray-500 bg-white" placeholder="滋賀" />
                      <Input className="w-12 h-7 text-xs border-gray-500 bg-white" placeholder="21" />
                      <Input className="w-16 h-7 text-xs border-gray-500 bg-white" placeholder="栗東" />
                    </div>
                  </div>

                  {/* 新規住所・住所+連携履歴ボタン */}
                  <div className="p-1 flex gap-1">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="h-7 text-xs bg-blue-100 border-blue-400 text-blue-800"
                    >
                      新規住所
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="h-7 text-xs bg-blue-100 border-blue-400 text-blue-800"
                    >
                      住所+連携履歴
                    </Button>
                  </div>

                  {/* 交通費・利用場所 */}
                  <div className="p-1 space-y-1">
                    <div className="flex items-center gap-2">
                      <Label className="text-xs font-semibold w-16">交通費</Label>
                      <Input className="w-20 h-7 text-xs border-gray-500 bg-white" type="number" placeholder="0" />
                      <Label className="text-xs font-semibold">利用場所</Label>
                      <Input className="w-24 h-7 text-xs border-gray-500 bg-white" placeholder="シティホテル" />
                    </div>
                    <div className="flex items-center gap-2">
                      <Label className="text-xs font-semibold w-16">北緯</Label>
                      <Input className="w-24 h-7 text-xs border-gray-500 bg-white" type="number" step="0.0001" placeholder="" />
                      <Label className="text-xs font-semibold">東経</Label>
                      <Input className="w-24 h-7 text-xs border-gray-500 bg-white" type="number" step="0.0001" placeholder="" />
                    </div>
                    <div className="flex items-center gap-2">
                      <Label className="text-xs font-semibold w-16">ホテル備考</Label>
                    </div>
                    <Textarea
                      className="min-h-[60px] text-xs border-gray-500 bg-white"
                      placeholder=""
                    />
                  </div>

                  {/* 車両情報 */}
                  <div className="p-1 space-y-1">
                    {/* ヘッダー行 */}
                    <div className="flex items-center text-xs justify-end pr-4">
                      <span className="w-32 text-center">車種</span>
                      <span className="w-24 text-center">車色</span>
                      <span className="w-12 text-center">地域</span>
                      <span className="w-12 text-center">分類</span>
                      <span className="w-14 text-center">平仮名</span>
                      <span className="w-16 text-center">ナンバー</span>
                    </div>
                    
                    <div className="flex gap-2">
                      {/* 左側：車ラベルと車取消ボタン */}
                      <div className="flex flex-col gap-1">
                        <div className="flex items-center gap-1 h-6">
                          <span className="text-xs font-semibold">車</span>
                          <div className="w-5 h-5 border border-gray-600 bg-gray-100 flex items-center justify-center">
                            <span className="text-black text-sm">●</span>
                          </div>
                        </div>
                        <button className="text-xs bg-pink-200 border border-pink-400 px-2 py-1 text-pink-900 rounded-sm">
                          車取消
                        </button>
                      </div>
                      
                      {/* 右側：車両リストボックス */}
                      <div className="flex-1 border border-gray-500 flex">
                        <div className="flex-1 flex flex-col">
                          {/* 1行目：シアン背景 */}
                          <div className="flex-1 bg-cyan-200 border-b border-gray-400">
                            <input type="text" className="w-full h-6 bg-transparent border-0 text-xs px-1 outline-none" />
                          </div>
                          {/* 2行目：黄色背景 */}
                          <div className="flex-1 bg-yellow-100 border-b border-gray-400">
                            <input type="text" className="w-full h-6 bg-transparent border-0 text-xs px-1 outline-none" />
                          </div>
                          {/* 3行目：白背景 */}
                          <div className="flex-1 bg-white border-b border-gray-400">
                            <input type="text" className="w-full h-6 bg-transparent border-0 text-xs px-1 outline-none" />
                          </div>
                          {/* 4行目：シアン背景 */}
                          <div className="flex-1 bg-cyan-100">
                            <input type="text" className="w-full h-6 bg-transparent border-0 text-xs px-1 outline-none" />
                          </div>
                        </div>
                        {/* 右端：ゴミ箱とスクロールバー */}
                        <div className="w-8 border-l border-gray-400 flex flex-col">
                          <div className="flex-1 flex items-start justify-center pt-1 border-b border-gray-400">
                            <span className="text-sm cursor-pointer">🗑</span>
                          </div>
                          <div className="h-4 flex items-center justify-center text-xs bg-gray-200">▲</div>
                          <div className="flex-1 bg-gray-100"></div>
                          <div className="h-4 flex items-center justify-center text-xs bg-gray-200">▼</div>
                        </div>
                      </div>
                    </div>
                    
                    {/* 本日の車 */}
                    <div className="flex items-center gap-1 mt-2">
                      <span className="text-xs font-semibold whitespace-nowrap">本日の車</span>
                      <div className="flex-1 bg-cyan-400">
                        <input type="text" className="w-full h-7 bg-transparent border-0 text-xs px-1 outline-none" />
                      </div>
                    </div>
                  </div>

                  {/* クレジットカード */}
                  <div className="p-1 space-y-1">
                    <div className="flex items-center gap-1">
                      <span className="text-xs font-semibold">クレジットカード</span>
                      <span className="w-4 h-4 bg-black rounded-full flex items-center justify-center text-white text-xs">●</span>
                    </div>
                    <div className="border border-gray-600 overflow-hidden">
                      {/* 1行目 */}
                      <div className="flex items-stretch border-b border-gray-400">
                        <div className="flex-1 bg-white">
                          <input type="text" className="w-full h-6 bg-transparent border-0 text-xs px-1 outline-none" />
                        </div>
                        <div className="w-6 flex items-center justify-center bg-white border-l border-gray-400">
                          <span className="text-xs cursor-pointer">🗑</span>
                        </div>
                      </div>
                      {/* 2行目 */}
                      <div className="flex items-stretch border-b border-gray-400">
                        <div className="flex-1 bg-white">
                          <input type="text" className="w-full h-6 bg-transparent border-0 text-xs px-1 outline-none" />
                        </div>
                        <div className="w-6 bg-white border-l border-gray-400"></div>
                      </div>
                      {/* 3行目 */}
                      <div className="flex items-stretch">
                        <div className="flex-1 bg-white">
                          <input type="text" className="w-full h-6 bg-transparent border-0 text-xs px-1 outline-none" />
                        </div>
                        <div className="w-6 bg-white border-l border-gray-400"></div>
                      </div>
                    </div>
                  </div>

                </div>

                {/* 中央カラム - 好み情報 */}
                <div className="space-y-0 bg-white rounded p-1 border border-gray-300">

                  {/* お客様メモ履歴（お客様との歴史） - 中央上部に配置 */}
                  <div className="p-1 mb-1">
                    <div className="border-2 border-orange-400 rounded bg-orange-50">
                      <div className="bg-orange-400 text-white px-2 py-1 text-xs font-bold flex items-center justify-between">
                        <span>📝 お客様メモ履歴（お客様との歴史）</span>
                        <span className="text-orange-100">全{customerMemoHistory.length}件</span>
                      </div>
                      {/* メモ入力エリア */}
                      <div className="p-2 border-b border-orange-300 bg-white">
                        <div className="flex gap-2">
                          <Textarea
                            className="flex-1 min-h-[50px] text-xs border-orange-300 bg-white"
                            placeholder="新しいメモを入力..."
                            value={newMemo}
                            onChange={e => setNewMemo(e.target.value)}
                          />
                          <Button
                            size="sm"
                            className="h-12 px-4 text-xs bg-orange-500 hover:bg-orange-600 text-white"
                            onClick={addMemo}
                          >
                            追加
                          </Button>
                        </div>
                      </div>
                      {/* メモ履歴一覧 */}
                      <div className="max-h-[120px] overflow-y-auto">
                        {customerMemoHistory.map((memo, idx) => (
                          <div key={memo.id} className={`p-2 border-b border-orange-200 ${idx % 2 === 0 ? 'bg-white' : 'bg-orange-50'}`}>
                            <div className="flex items-center justify-between text-[10px] text-gray-500 mb-1">
                              <span className="font-semibold text-orange-700">{memo.date}</span>
                              <span className="bg-orange-200 px-1.5 rounded text-orange-800">記入者: {memo.author}</span>
                            </div>
                            <div className="text-xs text-gray-800">{memo.content}</div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* ペット */}
                  <div className="p-1 space-y-1">
                    <div className="flex items-center gap-4">
                      <span className="text-xs font-semibold">ペット</span>
                      {petOptions.map(option => (
                        <label key={option.key} className="flex items-center gap-1 text-xs">
                          <Checkbox
                            checked={petSelections[option.key]}
                            onCheckedChange={() => togglePetSelection(option.key)}
                            className="w-3 h-3"
                          />
                          <span>{option.label}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* 顧客の統計ボタン */}
                  <div className="p-1 relative w-fit" ref={statsCardRef}>
                    <Button
                      size="sm"
                      variant="outline"
                      className="h-7 text-xs bg-white"
                      onClick={() => setShowCustomerStats(!showCustomerStats)}
                    >
                      顧客の統計
                    </Button>

                    {/* 顧客の統計カード */}
                    {showCustomerStats && (
                      <div className="absolute top-0 left-full ml-0.5 z-50 bg-gray-100 border border-gray-300 rounded shadow-lg p-4 min-w-[220px]">
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between items-center">
                            <span className="text-gray-700 font-medium">初回</span>
                            <span className="text-gray-900">{customerStats.firstVisit}</span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-gray-700 font-medium">履歴回数</span>
                            <span className="text-gray-900">{customerStats.historyCount}回</span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-gray-700 font-medium">継続日数</span>
                            <span className="text-gray-900">{customerStats.continuousDays.toLocaleString()}日</span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-gray-700 font-medium">指名本数</span>
                            <div className="flex items-center gap-2">
                              <span className="text-gray-900">{customerStats.nominationCount}回</span>
                              <span className="text-gray-900">{customerStats.nominationRate}%</span>
                            </div>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-gray-700 font-medium">延長本数</span>
                            <span className="text-gray-900">{customerStats.extensionCount != null ? `${customerStats.extensionCount}回` : '0回'}</span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-gray-700 font-medium">平均時間</span>
                            <span className="text-gray-900">{customerStats.averageTime}分</span>
                          </div>
                          <div className="flex justify-between items-center border-t border-gray-200 pt-1">
                            <span className="text-gray-700 font-medium">累計利用金額</span>
                            <span className="text-gray-900 font-semibold">¥{customerStats.totalAmount.toLocaleString()}</span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-gray-700 font-medium">平均利用金額</span>
                            <span className="text-gray-900">¥{customerStats.averageAmount.toLocaleString()}</span>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* 好みタイプ・話し方・嫌いタイプ */}
                  <div className="p-1 space-y-1">
                    <div className="flex items-center gap-4">
                      <Label className="text-xs font-semibold">好みタイプ</Label>
                      <Input
                        className="flex-1 h-7 text-xs border-gray-500 bg-white"
                        value={preferenceForm.favoriteType}
                        onChange={e => handlePreferenceChange('favoriteType', e.target.value)}
                        placeholder="巨乳"
                      />
                    </div>
                    <div className="flex items-center gap-4">
                      <Label className="text-xs font-semibold">話し方</Label>
                      <Input
                        className="w-20 h-7 text-xs border-gray-500 bg-white"
                        value={preferenceForm.speakingStyle}
                        onChange={e => handlePreferenceChange('speakingStyle', e.target.value)}
                        placeholder="常連"
                      />
                      <Label className="text-xs font-semibold">嫌いタイプ</Label>
                      <Input
                        className="flex-1 h-7 text-xs border-gray-500 bg-white"
                        value={preferenceForm.dislikedType}
                        onChange={e => handlePreferenceChange('dislikedType', e.target.value)}
                        placeholder=""
                      />
                    </div>
                  </div>

                  {/* 履歴対象ボタン - 接客履歴の上に配置 */}
                  <div className="p-1 space-y-1 mb-2">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-xs font-semibold">履歴対象:</span>
                      <span className="text-xs">京都デリヘル俱楽部</span>
                      <div className="flex gap-1 ml-auto">
                        <Button size="sm" variant="outline" className="h-7 text-xs bg-blue-100 border-blue-400 text-blue-800 hover:bg-blue-200">
                          全履歴表示
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          className="h-7 text-xs bg-green-100 border-green-400 text-green-800 hover:bg-green-200"
                          onClick={openPointHistoryWindow}
                        >
                          ポイント履歴
                        </Button>
                        <Button size="sm" variant="outline" className="h-7 text-xs bg-purple-100 border-purple-400 text-purple-800 hover:bg-purple-200">
                          初期ポイント入力
                        </Button>
                      </div>
                    </div>
                  </div>

                  {/* 接客履歴テーブル - 大きく表示 */}
                  <div className="p-1 mb-1">
                    <div className="text-sm font-semibold text-blue-700 mb-2 flex items-center gap-2">
                      <span>📅 接客履歴（接客日一覧）</span>
                      <span className="text-xs font-normal text-gray-500">全{filteredHistory.length}件</span>
                    </div>
                    <div className="border-2 border-blue-400 rounded overflow-hidden">
                      {/* テーブルヘッダー */}
                      <div className="bg-blue-500 text-white grid grid-cols-7 text-xs border-b border-blue-400 font-semibold">
                        <div className="px-3 py-2 border-r border-blue-400">接客日</div>
                        <div className="px-3 py-2 border-r border-blue-400">ホステス名</div>
                        <div className="px-3 py-2 border-r border-blue-400">コース名</div>
                        <div className="px-3 py-2 border-r border-blue-400">時間</div>
                        <div className="px-3 py-2 border-r border-blue-400">延長</div>
                        <div className="px-3 py-2 border-r border-blue-400">料金</div>
                        <div className="px-3 py-2">派遣場所</div>
                      </div>
                      {/* テーブルボディ - 大きく表示 */}
                      <div className="max-h-[200px] overflow-y-auto bg-white">
                        {filteredHistory.map((history, idx) => (
                          <div key={history.id} className={`grid grid-cols-7 text-sm border-b border-gray-200 hover:bg-blue-50 ${idx % 2 === 0 ? 'bg-white' : 'bg-gray-50'}`}>
                            <div className="px-3 py-2 border-r border-gray-200 font-medium">{history.date}</div>
                            <div className="px-3 py-2 border-r border-gray-200">{history.staffName}</div>
                            <div className="px-3 py-2 border-r border-gray-200">{history.category}</div>
                            <div className="px-3 py-2 border-r border-gray-200">{history.startTime}</div>
                            <div className="px-3 py-2 border-r border-gray-200">{history.endTime || '-'}</div>
                            <div className="px-3 py-2 border-r border-gray-200 text-right font-medium">
                              {history.amount > 0 ? `¥${history.amount.toLocaleString()}` : '-'}
                            </div>
                            <div className="px-3 py-2">{history.storeName}</div>
                          </div>
                        ))}
                      </div>
                      {/* 合計行 */}
                      <div className="bg-blue-50 border-t-2 border-blue-400 grid grid-cols-7 text-sm font-semibold">
                        <div className="px-3 py-1.5 border-r border-gray-200 text-blue-700 col-span-5">合計（{filteredHistory.filter(h => h.amount > 0).length}件）</div>
                        <div className="px-3 py-1.5 border-r border-gray-200 text-right text-blue-700">
                          ¥{filteredHistory.reduce((sum, h) => sum + h.amount, 0).toLocaleString()}
                        </div>
                        <div className="px-3 py-1.5"></div>
                      </div>
                    </div>
                  </div>

                  {/* プロフィール・移行 と 領収証 を横並び */}
                  <div className="p-1">
                    <div className="flex gap-4">
                      {/* 左側: プロフィール・移行 */}
                      <div className="w-56 space-y-3">
                        {/* プロフィール・移行 */}
                        <div>
                          <div className="flex items-center">
                            <span className="text-xs font-semibold">プロフィール</span>
                            <span className="text-xs font-semibold ml-auto">移行</span>
                            <Input
                              className="w-12 h-6 text-xs border-gray-500 bg-white ml-1"
                              placeholder=""
                            />
                          </div>
                          <Textarea
                            className="w-full min-h-[100px] text-xs border-gray-500 mt-1 bg-white"
                            defaultValue="マ、ブ、50代、？、？、優しい、なし、巨乳・攻め○、なし、ローション"
                          />
                        </div>

                        {/* 領収証宛先 */}
                        <div>
                          <Label className="text-xs font-semibold">領収証宛先</Label>
                          <Input
                            className="h-7 text-xs border-gray-500 mt-1 bg-white"
                            value={receiptForm.recipient}
                            onChange={e => handleReceiptChange('recipient', e.target.value)}
                            placeholder=""
                          />
                        </div>

                        {/* 領収証但書 */}
                        <div>
                          <Label className="text-xs font-semibold">領収証但書</Label>
                          <Input
                            className="h-7 text-xs border-gray-500 mt-1 bg-white"
                            value={receiptForm.note}
                            onChange={e => handleReceiptChange('note', e.target.value)}
                            placeholder=""
                          />
                        </div>

                        {/* 地元出張 */}
                        <div className="flex items-center gap-2">
                          <Label className="text-xs font-semibold">地元出張</Label>
                          <label className="flex items-center gap-1 text-xs">
                            <input
                              type="radio"
                              name="work-area"
                              value="local"
                              checked={workArea === 'local'}
                              onChange={() => setWorkArea('local')}
                              className="w-3 h-3"
                            />
                            地元
                          </label>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Firstドライバ名・店NG */}
                  <div className="p-1 space-y-1">
                    <div className="flex items-center gap-2">
                      <Label className="text-xs font-semibold w-24">Firstドライバ名</Label>
                      <Input className="flex-1 h-7 text-xs border-gray-500" placeholder="" />
                    </div>
                    <div className="flex items-center gap-2">
                      <Label className="text-xs font-semibold w-24">店NG</Label>
                      <Input className="flex-1 h-7 text-xs border-gray-500" placeholder="" />
                    </div>
                  </div>

                  {/* メディア名 */}
                  <div className="p-1">
                    <div className="flex items-center gap-2">
                      <Label className="text-xs font-semibold">メディア名</Label>
                      <Input className="flex-1 h-7 text-xs border-gray-500" placeholder="" />
                    </div>
                  </div>
                </div>

                {/* 右カラム - ホステス選択エリア */}
                <div className="space-y-0">
                  {/* 再表示・出勤予定日 */}
                  <div className="p-1 space-y-1">
                    <div className="flex items-center gap-2">
                      <Button size="sm" variant="outline" className="h-7 text-xs bg-pink-100 border-pink-400">
                        再表示
                      </Button>
                      <Label className="text-xs font-semibold">出勤予定日:</Label>
                      <Input className="flex-1 h-7 text-xs border-gray-500" placeholder="2025年08月27日" />
                    </div>
                  </div>

                  {/* ホステス選択ボタン */}
                  <div className="p-1 flex justify-end">
                    <Button size="sm" className="h-8 text-xs bg-red-600 text-white hover:bg-red-700">
                      ホステス選択
                    </Button>
                  </div>

                  {/* 五十音フィルター */}
                  <div className="p-1 space-y-1">
                    <RadioGroup 
                      value={kanaFilter} 
                      onValueChange={setKanaFilter}
                      className="space-y-1"
                    >
                      {/* 五十音表グリッド */}
                      <div className="grid grid-cols-11 gap-0 text-xs border border-gray-400 p-1">
                        {/* ヘッダー行 */}
                        <div className="flex items-center justify-center p-1">●</div>
                        <div className="flex items-center justify-center p-1">ア</div>
                        <div className="flex items-center justify-center p-1">カ</div>
                        <div className="flex items-center justify-center p-1">サ</div>
                        <div className="flex items-center justify-center p-1">タ</div>
                        <div className="flex items-center justify-center p-1">ナ</div>
                        <div className="flex items-center justify-center p-1">ハ</div>
                        <div className="flex items-center justify-center p-1">マ</div>
                        <div className="flex items-center justify-center p-1">ヤ</div>
                        <div className="flex items-center justify-center p-1">ラ</div>
                        <div className="flex items-center justify-center p-1">ワ</div>
                        <div className="flex items-center justify-center p-1">すべて</div>
                        {/* 各段 */}
                        {kanaGridRows.map((row, rowIndex) => (
                          <React.Fragment key={`row-${rowIndex}`}>
                            {row.map((kana, colIndex) => (
                              <div key={`kana-${rowIndex}-${colIndex}`} className="flex items-center justify-center p-0.5">
                                {kana ? (
                                  <label className="cursor-pointer">
                                    <input
                                      type="radio"
                                      name="kana-filter"
                                      value={kana}
                                      checked={kanaFilter === kana}
                                      onChange={() => setKanaFilter(kana)}
                                      className="sr-only"
                                    />
                                    <span className={`${kanaFilter === kana ? 'text-blue-600 font-bold' : ''}`}>
                                      {kana}
                                    </span>
                                  </label>
                                ) : (
                                  <span></span>
                                )}
                              </div>
                            ))}
                          </React.Fragment>
                        ))}
                      </div>
                    </RadioGroup>
                    <div className="flex justify-end">
                      <Button 
                        size="sm" 
                        variant="outline" 
                        className="h-6 text-xs"
                        onClick={() => setKanaFilter('all')}
                      >
                        クリア
                      </Button>
                    </div>
                  </div>

                  {/* ホステス一覧 */}
                  <div className="p-1">
                    <div className="border border-gray-500 max-h-[180px] overflow-y-auto">
                      {/* サンプルホステスデータ */}
                      {[
                        { id: '1184', area: '京都', name: 'あみ', type: 'レディ', status: '終了', time1: '20:00', time2: '24:00', time3: '2:00' },
                        { id: '----', area: '京都', name: '彩羽ー', type: 'ガールズ', status: '終了', time1: '16:00', time2: '17:30', time3: '19:00', highlight: 'blue' },
                        { id: '1184', area: '京都', name: 'あいめ', type: 'レディ', status: '当日欠', time1: '16:00', time2: '24:00', time3: '2:00', highlight: 'red' },
                        { id: '9191', area: '京都', name: 'あかり', type: 'ガールズ', status: '当日欠', time1: '16:00', time2: '23:00', time3: '24:30', highlight: 'yellow' },
                        { id: '1194', area: '京都', name: 'あんず', type: 'ガールズ', status: '当日欠', time1: '9:00', time2: '15:00', time3: '17:00', highlight: 'yellow' },
                        { id: '1030', area: '京都', name: 'あいみ', type: 'ガールズ', status: '', time1: '', time2: '', time3: '' },
                        { id: '1071', area: '京都', name: 'かきな', type: 'レディ', status: '', time1: '', time2: '', time3: '' },
                        { id: '1118', area: '京都', name: 'さち', type: 'レディ', status: '', time1: '', time2: '', time3: '' },
                        { id: '1074', area: '京都', name: 'たすか', type: 'ガールズ', status: '', time1: '', time2: '', time3: '' },
                        { id: '1119', area: '京都', name: 'なまね', type: 'ガールズ', status: '', time1: '', time2: '', time3: '' },
                        { id: '1110', area: '京都', name: 'はりさ', type: 'レディ', status: '', time1: '', time2: '', time3: '' },
                        { id: '1117', area: '京都', name: 'まんじゅ', type: 'ガールズ', status: '', time1: '', time2: '', time3: '' },
                        { id: '1038', area: '京都', name: 'やんな', type: 'レディ', status: '', time1: '', time2: '', time3: '' },
                      ].filter((hostess) => {
                        if (kanaFilter === 'all') return true;
                        // ひらがなの最初の文字でフィルタリング
                        const firstChar = hostess.name.charAt(0);
                        return firstChar === kanaFilter;
                      }).map((hostess, index) => (
                        <div
                          key={index}
                          className={`grid grid-cols-8 text-xs border-b border-gray-300 ${
                            hostess.highlight === 'blue' ? 'bg-blue-100' :
                            hostess.highlight === 'red' ? 'bg-red-200 line-through' :
                            hostess.highlight === 'yellow' ? 'bg-yellow-200 line-through' :
                            'hover:bg-gray-50'
                          }`}
                        >
                          <div className="px-1 py-0.5 border-r border-gray-300">{hostess.id}</div>
                          <div className="px-1 py-0.5 border-r border-gray-300">{hostess.area}</div>
                          <div className="px-1 py-0.5 border-r border-gray-300">{hostess.name}</div>
                          <div className="px-1 py-0.5 border-r border-gray-300">{hostess.type}</div>
                          <div className="px-1 py-0.5 border-r border-gray-300">{hostess.status}</div>
                          <div className="px-1 py-0.5 border-r border-gray-300">{hostess.time1}</div>
                          <div className="px-1 py-0.5 border-r border-gray-300">{hostess.time2}</div>
                          <div className="px-1 py-0.5">{hostess.time3}</div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* ホステス→顧客NG / 顧客→ホステスNG / アドレス交換 - ホステス一覧の下に配置 */}
                  <div className="p-1 mt-2">
                    <div className="grid grid-cols-3 gap-2">
                      {/* 左側：ホステス→顧客NG */}
                      <div className="border-2 border-pink-400 rounded overflow-hidden">
                        <div className="bg-pink-500 text-white text-xs font-bold text-center py-1">
                          🚫 ホステス→顧客NG
                        </div>
                        <div className="max-h-[120px] overflow-y-auto bg-white">
                          {[
                            { name: 'あみ', reason: '接客態度の問題', date: '2025/01/20' },
                            { name: '彩羽', reason: '時間厳守できず', date: '2025/01/15' },
                            { name: 'さち', reason: '顧客クレーム', date: '2025/01/10' },
                          ].map((ng, idx) => (
                            <div key={idx} className={`p-1 border-b border-pink-200 ${idx % 2 === 0 ? 'bg-white' : 'bg-pink-50'}`}>
                              <div className="flex items-center justify-between">
                                <span className="text-xs font-semibold text-pink-700">{ng.name}</span>
                                <span className="text-[10px] text-gray-500">{ng.date}</span>
                              </div>
                              <div className="text-[10px] text-gray-600">{ng.reason}</div>
                            </div>
                          ))}
                        </div>
                        <div className="bg-pink-100 p-1 text-center">
                          <Button size="sm" variant="outline" className="h-5 text-[10px] border-pink-400 text-pink-700">
                            + NG追加
                          </Button>
                        </div>
                      </div>

                      {/* 中央：顧客→ホステスNG */}
                      <div className="border-2 border-yellow-400 rounded overflow-hidden">
                        <div className="bg-yellow-500 text-white text-xs font-bold text-center py-1 flex items-center justify-center gap-1">
                          <span>⚠️ 顧客→ホステスNG</span>
                          <span className="text-[10px] bg-yellow-600 px-1 rounded">非表示</span>
                        </div>
                        <div className="max-h-[120px] overflow-y-auto bg-white">
                          {[
                            { name: 'あいめ', reason: '指名拒否希望', date: '2025/01/22' },
                            { name: 'かきな', reason: '相性が合わない', date: '2025/01/18' },
                          ].map((ng, idx) => (
                            <div key={idx} className={`p-1 border-b border-yellow-200 ${idx % 2 === 0 ? 'bg-white' : 'bg-yellow-50'}`}>
                              <div className="flex items-center justify-between">
                                <span className="text-xs font-semibold text-yellow-700">{ng.name}</span>
                                <span className="text-[10px] text-gray-500">{ng.date}</span>
                              </div>
                              <div className="text-[10px] text-gray-600">{ng.reason}</div>
                            </div>
                          ))}
                        </div>
                        <div className="bg-yellow-100 p-1 text-center">
                          <Button size="sm" variant="outline" className="h-5 text-[10px] border-yellow-400 text-yellow-700">
                            + NG追加
                          </Button>
                        </div>
                      </div>

                      {/* 右側：アドレス交換 + 旧備考 */}
                      <div className="flex flex-col">
                        <div className="border-2 border-cyan-400 rounded overflow-hidden">
                          <div className="bg-cyan-500 text-white text-xs font-bold text-center py-1">
                            📧 アドレス交換
                          </div>
                          <div className="p-1 bg-cyan-50 border-b border-cyan-200">
                            <Input className="h-5 text-[10px] bg-white border-cyan-300" placeholder="検索..." />
                          </div>
                          <div className="max-h-[80px] overflow-y-auto bg-white">
                            {[
                              { name: 'あみ', exchangeDate: '2025/01/25' },
                              { name: '彩羽', exchangeDate: '2025/01/20' },
                            ].map((addr, idx) => (
                              <div key={idx} className={`p-1 border-b border-cyan-200 ${idx % 2 === 0 ? 'bg-white' : 'bg-cyan-50'}`}>
                                <div className="flex items-center justify-between">
                                  <span className="text-xs font-medium">{addr.name}</span>
                                  <span className="text-[10px] text-gray-500">{addr.exchangeDate}</span>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                        {/* 旧備考（アドレス交換の下） */}
                        <div className="mt-1 p-1 bg-red-50 border-2 border-red-300 rounded">
                          <Label className="text-[10px] font-semibold text-red-700">旧備考</Label>
                          <div className="text-[10px] text-red-600">
                            巨乳好きの50分だが利用頻度は○。なんせ乳が無い千は×。
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                </div>

              </div>
            </TabsContent>
            
            {/* プロフィールタブ */}
            <TabsContent value="profile" className="mt-0 p-6 border border-gray-400 border-t-0">
              <div className="text-center text-gray-500 py-12">
                <User2 className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                <h2 className="text-xl font-semibold mb-2">プロフィール</h2>
                <p>このタブの内容は準備中です</p>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>

      {/* 一括ポイント付与モーダル */}
      {isBulkPointModalOpen && isAdminMode && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center">
          <div className="bg-white rounded-lg shadow-2xl w-[520px] overflow-hidden">
            <div className="bg-green-600 text-white px-4 py-3 flex items-center gap-2">
              <Gift className="w-5 h-5" />
              <span className="font-bold">ポイント一括付与</span>
            </div>
            <div className="p-5 space-y-4">
              {/* 対象顧客 */}
              <div>
                <Label className="text-sm font-semibold mb-1 block">対象顧客（選択済み）</Label>
                {selectedCustomerIds.length > 0 ? (
                  <div className="flex flex-wrap gap-1.5 mb-2">
                    {selectedCustomerIds.map(id => {
                      const c = extendedCustomers.find(x => x.id === id);
                      return c ? (
                        <span key={id} className="px-2 py-0.5 bg-green-100 text-green-800 text-xs rounded-full border border-green-300">
                          {c.name}
                        </span>
                      ) : null;
                    })}
                  </div>
                ) : (
                  <p className="text-xs text-gray-400 mb-2">一覧タブで顧客を選択するか、以下に会員番号を入力してください</p>
                )}
                <Label className="text-xs text-gray-600 mb-1 block">会員番号をまとめて追加（カンマ/改行区切り）</Label>
                <Textarea
                  value={bulkManualIds}
                  onChange={(e) => setBulkManualIds(e.target.value)}
                  className="h-16 text-xs border-gray-400 resize-none"
                  placeholder="C-00001, C-00002&#10;C-00003"
                />
              </div>

              {/* プラス/マイナス切替 */}
              <div>
                <Label className="text-sm font-semibold mb-2 block">種別</Label>
                <div className="flex rounded overflow-hidden border border-gray-300 w-40">
                  <button
                    type="button"
                    onClick={() => setBulkPointSign('plus')}
                    className={`flex-1 py-2 text-sm font-bold transition-colors ${
                      bulkPointSign === 'plus' ? 'bg-green-500 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    ＋ 付与
                  </button>
                  <button
                    type="button"
                    onClick={() => setBulkPointSign('minus')}
                    className={`flex-1 py-2 text-sm font-bold transition-colors ${
                      bulkPointSign === 'minus' ? 'bg-red-500 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    ー 減算
                  </button>
                </div>
              </div>

              {/* ポイント数 */}
              <div>
                <Label className="text-sm font-semibold mb-1 block">ポイント数</Label>
                <Input
                  type="number"
                  min="1"
                  value={bulkPointAmount}
                  onChange={(e) => setBulkPointAmount(e.target.value)}
                  className={`w-40 h-9 font-semibold ${bulkPointSign === 'plus' ? 'text-green-700' : 'text-red-700'}`}
                  placeholder="例: 100"
                />
              </div>

              {/* 理由/備考 */}
              <div>
                <Label className="text-sm font-semibold mb-1 block">理由・備考（任意）</Label>
                <Textarea
                  value={bulkPointRemarks}
                  onChange={(e) => setBulkPointRemarks(e.target.value)}
                  className="h-16 text-sm border-gray-400 resize-none"
                  placeholder="付与理由を入力..."
                />
              </div>
            </div>
            <div className="px-5 py-3 bg-gray-50 border-t flex justify-end gap-2">
              <Button variant="outline" onClick={() => setIsBulkPointModalOpen(false)}>
                キャンセル
              </Button>
              <Button
                onClick={handleBulkPointSave}
                className="bg-green-600 hover:bg-green-700 text-white"
              >
                <List className="w-4 h-4 mr-1" />
                一括保存
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* 管理者ログインモーダル */}
      {isAdminLoginModalOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center">
          <div className="bg-white rounded-lg shadow-2xl w-[400px] overflow-hidden">
            <div className="bg-blue-600 text-white px-4 py-3 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Shield className="w-5 h-5" />
                <span className="font-bold">管理者モードを有効化</span>
              </div>
              <button
                onClick={() => { setIsAdminLoginModalOpen(false); setAdminCodeInput(''); setAdminCodeError(''); }}
                className="text-white/80 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-5 space-y-4">
              <p className="text-sm text-gray-600">管理者コードを入力してください。</p>
              <div>
                <Label className="text-sm font-semibold mb-1 block">管理者コード</Label>
                <Input
                  type="password"
                  value={adminCodeInput}
                  onChange={(e) => { setAdminCodeInput(e.target.value); setAdminCodeError(''); }}
                  onKeyDown={(e) => { if (e.key === 'Enter') handleAdminLogin(); }}
                  className="h-10 font-mono"
                  placeholder="コードを入力"
                  autoFocus
                />
                {adminCodeError && (
                  <p className="text-xs text-red-600 mt-1">{adminCodeError}</p>
                )}
              </div>
              <p className="text-xs text-gray-400">※ バックエンド認証API連携前のUI骨組みです</p>
            </div>
            <div className="px-5 py-3 bg-gray-50 border-t flex justify-end gap-2">
              <Button variant="outline" onClick={() => { setIsAdminLoginModalOpen(false); setAdminCodeInput(''); setAdminCodeError(''); }}>
                キャンセル
              </Button>
              <Button onClick={handleAdminLogin} className="bg-blue-600 hover:bg-blue-700 text-white">
                <LogIn className="w-4 h-4 mr-1" />
                ログイン
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* 操作ログモーダル */}
      {isOperationLogModalOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-2xl w-full max-w-3xl overflow-hidden flex flex-col max-h-[90vh]">
            <div className="bg-slate-700 text-white px-4 py-3 flex items-center justify-between flex-shrink-0">
              <div className="flex items-center gap-2">
                <History className="w-5 h-5" />
                <span className="font-bold">操作履歴</span>
              </div>
              <button onClick={() => setIsOperationLogModalOpen(false)} className="text-white/80 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>
            {/* フィルター */}
            <div className="px-4 py-3 bg-slate-50 border-b flex items-center gap-3 flex-wrap flex-shrink-0">
              <div className="flex items-center gap-1">
                <span className="text-xs text-gray-600 whitespace-nowrap">操作者:</span>
                <input
                  type="text"
                  value={logFilterOperator}
                  onChange={(e) => setLogFilterOperator(e.target.value)}
                  placeholder="操作者名"
                  className="h-7 text-xs px-2 border border-gray-300 rounded outline-none focus:border-blue-400 bg-white w-28"
                />
              </div>
              <div className="flex items-center gap-1">
                <span className="text-xs text-gray-600 whitespace-nowrap">期間:</span>
                <input
                  type="date"
                  value={logFilterDateFrom}
                  onChange={(e) => setLogFilterDateFrom(e.target.value)}
                  className="h-7 text-xs px-2 border border-gray-300 rounded outline-none focus:border-blue-400 bg-white"
                />
                <span className="text-xs text-gray-500">〜</span>
                <input
                  type="date"
                  value={logFilterDateTo}
                  onChange={(e) => setLogFilterDateTo(e.target.value)}
                  className="h-7 text-xs px-2 border border-gray-300 rounded outline-none focus:border-blue-400 bg-white"
                />
              </div>
              {(logFilterOperator || logFilterDateFrom || logFilterDateTo) && (
                <button
                  onClick={() => { setLogFilterOperator(''); setLogFilterDateFrom(''); setLogFilterDateTo(''); }}
                  className="flex items-center gap-1 text-xs text-gray-500 hover:text-red-500 border border-gray-300 rounded px-2 py-0.5"
                >
                  <X className="w-3 h-3" />
                  クリア
                </button>
              )}
              <span className="text-xs text-gray-500 ml-auto">{filteredOperationLogs.length}件</span>
            </div>
            {/* ログ一覧 */}
            <div className="overflow-auto flex-1">
              <table className="w-full text-xs border-collapse">
                <thead className="sticky top-0 bg-gray-100 z-10">
                  <tr className="border-b border-gray-300">
                    <th className="px-3 py-2 text-left border-r border-gray-200 font-semibold text-gray-700 whitespace-nowrap">日時</th>
                    <th className="px-3 py-2 text-left border-r border-gray-200 font-semibold text-gray-700 whitespace-nowrap">操作者</th>
                    <th className="px-3 py-2 text-left border-r border-gray-200 font-semibold text-gray-700 whitespace-nowrap">対象顧客</th>
                    <th className="px-3 py-2 text-center border-r border-gray-200 font-semibold text-gray-700 whitespace-nowrap">種別</th>
                    <th className="px-3 py-2 text-right border-r border-gray-200 font-semibold text-gray-700 whitespace-nowrap">ポイント数</th>
                    <th className="px-3 py-2 text-left font-semibold text-gray-700">備考</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredOperationLogs.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="px-4 py-6 text-center text-xs text-gray-400">
                        条件に一致する操作履歴が見つかりません
                      </td>
                    </tr>
                  ) : filteredOperationLogs.map((log, idx) => (
                    <tr key={log.id} className={`border-b border-gray-100 ${idx % 2 === 0 ? 'bg-white' : 'bg-gray-50'}`}>
                      <td className="px-3 py-1.5 border-r border-gray-100 text-gray-600 whitespace-nowrap">
                        {log.date.replace('T', ' ').slice(0, 16)}
                      </td>
                      <td className="px-3 py-1.5 border-r border-gray-100 whitespace-nowrap">{log.operatorName}</td>
                      <td className="px-3 py-1.5 border-r border-gray-100 whitespace-nowrap font-semibold">{log.targetCustomerName}</td>
                      <td className="px-3 py-1.5 border-r border-gray-100 text-center">
                        {log.type === 'plus' ? (
                          <span className="px-1.5 py-0.5 bg-green-100 text-green-700 rounded text-xs font-bold">＋付与</span>
                        ) : log.type === 'minus' ? (
                          <span className="px-1.5 py-0.5 bg-red-100 text-red-700 rounded text-xs font-bold">－減算</span>
                        ) : (
                          <span className="px-1.5 py-0.5 bg-yellow-100 text-yellow-700 rounded text-xs font-bold">調整</span>
                        )}
                      </td>
                      <td className="px-3 py-1.5 border-r border-gray-100 text-right font-semibold">
                        <span className={log.type === 'minus' ? 'text-red-600' : 'text-green-700'}>
                          {log.type === 'minus' ? '-' : '+'}{log.points.toLocaleString()}
                        </span>
                        <span className="text-gray-400 font-normal ml-0.5">pt</span>
                      </td>
                      <td className="px-3 py-1.5 text-gray-500">{log.remarks ?? '—'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="px-4 py-3 bg-gray-50 border-t flex justify-between items-center flex-shrink-0">
              <p className="text-xs text-gray-400">※ バックエンド連携前のモックデータです</p>
              <Button variant="outline" onClick={() => setIsOperationLogModalOpen(false)}>
                閉じる
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* 新規顧客ダイアログ */}
      {showNewCustomerDialog && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center">
          <div className="bg-white rounded-lg shadow-2xl w-[480px] overflow-hidden">
            <div className="bg-orange-500 text-white px-4 py-3 flex items-center gap-2">
              <UserPlus className="w-5 h-5" />
              <span className="font-bold">新規顧客登録</span>
            </div>
            <div className="p-4 space-y-4">
              {/* 電話番号（自動入力済み） */}
              <div>
                <Label className="text-sm font-semibold flex items-center gap-1 mb-1">
                  <Phone className="w-4 h-4 text-green-600" />
                  電話番号（着信番号から自動入力）
                </Label>
                <Input
                  value={newCustomerPhone}
                  onChange={(e) => setNewCustomerPhone(e.target.value)}
                  className="h-10 text-lg font-mono bg-green-50 border-green-300"
                  placeholder="電話番号"
                />
                <p className="text-xs text-gray-500 mt-1">着信時の発信者番号が自動で入力されます</p>
              </div>

              {/* 顧客名 */}
              <div>
                <Label className="text-sm font-semibold mb-1">顧客名</Label>
                <Input
                  value={newCustomerName}
                  onChange={(e) => setNewCustomerName(e.target.value)}
                  className="h-9"
                  placeholder="顧客名を入力"
                />
              </div>

              {/* フリガナ */}
              <div>
                <Label className="text-sm font-semibold mb-1">フリガナ</Label>
                <Input
                  value={newCustomerNameKana}
                  onChange={(e) => setNewCustomerNameKana(e.target.value)}
                  className="h-9"
                  placeholder="フリガナを入力"
                />
              </div>
            </div>
            <div className="px-4 py-3 bg-gray-50 border-t flex justify-end gap-2">
              <Button variant="outline" onClick={() => setShowNewCustomerDialog(false)}>
                キャンセル
              </Button>
              <Button
                onClick={handleSaveNewCustomer}
                className="bg-orange-500 hover:bg-orange-600 text-white"
              >
                登録して開く
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
