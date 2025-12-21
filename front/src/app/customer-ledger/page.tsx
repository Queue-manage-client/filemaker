'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Textarea } from "@/components/ui/textarea";
import { FileText, User2, ArrowLeft, Pen } from "lucide-react";
import { Customer, STORE_MAPPING } from '@/types';
import type { Vehicle, UsageHistory, PreferenceForm, ReceiptForm, PetOption, WorkAreaOption } from '@/types/customer-ledger';
import { sampleCustomers } from '@/data/customerSampleData';

// 型は分離済み

export default function CustomerLedger() {
  const router = useRouter();

  React.useEffect(() => {
    document.title = '顧客台帳 - Dispatch Harmony Hub';
  }, []);

  const [selectedCustomer, setSelectedCustomer] = useState<Customer>(sampleCustomers[0]);
  const [vehicles, setVehicles] = useState<Vehicle[]>([
    { id: '1', type: 'BMW 7シリーズ', color: 'ブラック', number: '品川300あ1234' }
  ]);
  
  const [kanaFilter, setKanaFilter] = useState<string>('all');
  const [preferenceForm, setPreferenceForm] = useState<PreferenceForm>({
    rank: 'A',
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
  
  const [usageHistory] = useState<UsageHistory[]>([
    {
      id: '1',
      receptionNumber: 'R-2025-001',
      date: '2025-01-26',
      storeName: '本店',
      staffName: '佐藤美智子',
      category: 'ガールズ',
      rank: 'VIP',
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
      rank: 'S',
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
      rank: 'A',
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
      rank: 'B',
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
      rank: 'VIP',
      startTime: '20:30',
      endTime: '02:15',
      amount: 95000,
      status: 'completed'
    }
  ]);

  const handleCustomerChange = (updatedFields: Partial<Customer>) => {
    setSelectedCustomer(prev => ({
      ...prev,
      ...updatedFields
    }));
  };

  const addVehicle = () => {
    const newVehicle: Vehicle = {
      id: Date.now().toString(),
      type: '',
      color: '',
      number: ''
    };
    setVehicles(prev => [...prev, newVehicle]);
  };

  const removeVehicle = (id: string) => {
    setVehicles(prev => prev.filter(v => v.id !== id));
  };

  const updateVehicle = (id: string, field: keyof Omit<Vehicle, 'id'>, value: string) => {
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
    <div className="min-h-screen bg-gray-100 p-2">
      {/* ヘッダー */}
      <div className="bg-white p-2 mb-0">
        <div>
          <div className="flex items-center justify-between">
            {/* 左側：ダッシュボードに戻るボタンとナビゲーションボタン */}
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                onClick={() => router.push('/dashboard')}
                className="flex items-center gap-2"
              >
                <ArrowLeft className="w-4 h-4" />
                ダッシュボードに戻る
              </Button>
              <button
                onClick={() => router.push('/customer-ledger')}
                className="px-4 py-2 bg-blue-500 border-2 border-blue-700 text-white text-sm font-semibold rounded hover:bg-blue-600 transition-colors"
              >
                顧客検索
              </button>
              <button
                onClick={() => router.push('/dispatch-panel-2d')}
                className="px-4 py-2 bg-amber-200 border-2 border-amber-700 text-amber-900 text-sm font-semibold rounded hover:bg-amber-300 transition-colors"
              >
                配車パネル
              </button>
              <button
                onClick={() => router.push('/rt2-panel')}
                className="px-4 py-2 bg-pink-300 border-2 border-pink-700 text-pink-900 text-sm font-semibold rounded hover:bg-pink-400 transition-colors"
              >
                RTⅡパネル
              </button>
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
              <button
                onClick={() => {
                  // ポイント一括送信の処理をここに追加
                }}
                className="px-3 py-1.5 bg-pink-100 border-2 border-pink-400 text-pink-700 text-sm font-semibold rounded hover:bg-pink-200 transition-colors whitespace-nowrap"
              >
                ポイントー括送信
              </button>
              
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
      <div className="bg-white p-2 mb-0">
        <div>
          {/* 第1行 */}
          <div className="flex items-stretch gap-0 mb-1">
            {/* 顧客番号 */}
            <div className="flex items-stretch">
              <div className="bg-purple-300 px-2 py-1 text-xs font-semibold flex items-center border border-gray-400">
                顧客番号
              </div>
              <Input
                value="324"
                className="h-auto w-16 text-sm border border-gray-400 rounded-none"
                onChange={() => {}}
              />
            </div>

            {/* 名前 */}
            <div className="flex items-stretch">
              <div className="bg-purple-300 px-2 py-1 text-xs font-semibold flex items-center border border-gray-400 border-l-0">
                名前
              </div>
              <Input
                value="ミヤタ"
                className="h-auto w-20 text-sm border border-gray-400 border-l-0 rounded-none"
                onChange={() => {}}
              />
            </div>

            {/* 氏名ふりがな */}
            <div className="flex items-stretch">
              <div className="bg-purple-300 px-2 py-1 text-xs font-semibold flex items-center border border-gray-400 border-l-0">
                氏名ふりがな
              </div>
              <Input
                value="みやた"
                className="h-auto w-16 text-sm border border-gray-400 border-l-0 rounded-none"
                onChange={() => {}}
              />
            </div>

            {/* 1 */}
            <div className="flex items-stretch">
              <div className="px-2 py-1 text-xs flex items-center border border-gray-400 border-l-0 bg-white">
                1
              </div>
            </div>

            {/* 京都ホテル俱楽部 */}
            <div className="flex items-stretch">
              <div className="bg-blue-600 text-white px-2 py-1 text-xs font-semibold flex items-center border border-gray-400 border-l-0">
                京都ホテル俱楽部
              </div>
            </div>

            {/* L */}
            <div className="flex items-stretch">
              <div className="bg-black text-white px-2 py-1 text-xs font-bold flex items-center border border-gray-400 border-l-0">
                L
              </div>
            </div>

            {/* 空白フィールド */}
            <div className="flex items-stretch flex-1">
              <div className="flex-1 border border-gray-400 border-l-0 bg-white"></div>
            </div>

            {/* Web登録チェックボックス */}
            <div className="flex items-stretch">
              <div className="px-2 py-1 text-xs flex items-center border border-gray-400 border-l-0 bg-white">
                <label className="flex items-center gap-1">
                  <input type="checkbox" className="w-3 h-3" />
                  Web登録
                </label>
              </div>
            </div>

            {/* 3 */}
            <div className="flex items-stretch">
              <div className="px-2 py-1 text-xs flex items-center border border-gray-400 border-l-0 bg-white">
                3
              </div>
            </div>
          </div>

          {/* 第2行 */}
          <div className="flex items-stretch gap-0">
            {/* 基本情報ボタン */}
            <button className="bg-gray-300 border border-gray-600 px-3 py-1 text-xs font-semibold hover:bg-gray-400 transition-colors">
              基本情報
            </button>

            {/* プロフィールボタン */}
            <button className="bg-gray-300 border border-gray-600 border-l-0 px-3 py-1 text-xs font-semibold hover:bg-gray-400 transition-colors">
              プロフィール
            </button>

            {/* 旧顧客番号 */}
            <div className="flex items-stretch">
              <div className="bg-purple-300 px-2 py-1 text-xs font-semibold flex items-center border border-gray-400 border-l-0">
                旧顧客番号
              </div>
              <Input
                value="324"
                className="h-auto w-16 text-sm border border-gray-400 border-l-0 rounded-none"
                onChange={() => {}}
              />
            </div>

            {/* 参照メディア */}
            <div className="flex items-stretch">
              <div className="bg-purple-300 px-2 py-1 text-xs font-semibold flex items-center border border-gray-400 border-l-0">
                参照メディア
              </div>
              <Input
                value="2"
                className="h-auto w-8 text-sm border border-gray-400 border-l-0 rounded-none text-center"
                onChange={() => {}}
              />
            </div>

            {/* ヘブンネット */}
            <div className="flex items-stretch">
              <div className="px-2 py-1 text-xs flex items-center border border-gray-400 border-l-0 bg-white">
                ヘブンネット
              </div>
            </div>

            {/* 空白フィールド */}
            <div className="flex items-stretch flex-1">
              <div className="flex-1 border border-gray-400 border-l-0 bg-white"></div>
            </div>

            {/* VIP/Gold/Platinumチェックボックス */}
            <div className="flex items-stretch">
              <div className="px-2 py-1 text-xs flex items-center gap-2 border border-gray-400 border-l-0 bg-white">
                <label className="flex items-center gap-1">
                  <input type="checkbox" className="w-3 h-3" />
                  VIP
                </label>
                <label className="flex items-center gap-1">
                  <input type="checkbox" className="w-3 h-3" />
                  Gold
                </label>
                <label className="flex items-center gap-1">
                  <input type="checkbox" className="w-3 h-3" />
                  Platinum
                </label>
              </div>
            </div>

            {/* 記録番号 */}
            <div className="flex items-stretch">
              <div className="bg-purple-300 px-2 py-1 text-xs font-semibold flex items-center border border-gray-400 border-l-0">
                記録番号
              </div>
              <Input
                value="328"
                className="h-auto w-12 text-sm border border-gray-400 border-l-0 rounded-none text-center"
                onChange={() => {}}
              />
            </div>

            {/* 岸本 礼人 */}
            <div className="flex items-stretch">
              <div className="px-2 py-1 text-xs flex items-center border border-gray-400 border-l-0 bg-white">
                岸本 礼人
              </div>
            </div>

            {/* 統合済 */}
            <div className="flex items-stretch">
              <div className="px-2 py-1 text-xs flex items-center border border-gray-400 border-l-0 bg-white text-blue-600">
                統合済
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* メインコンテンツエリア - タブ構造 */}
      <div className="bg-white">
        <div>
          <Tabs defaultValue="basic-info" className="w-full">
            {/* カスタムタブヘッダー */}
            <TabsList className="h-auto p-0 bg-transparent grid grid-cols-2 w-full">
              <TabsTrigger 
                value="basic-info" 
                className="bg-pink-100 border border-gray-400 px-4 py-2 text-sm font-medium text-gray-800 data-[state=active]:bg-white data-[state=active]:border-b-white relative z-10 rounded-none justify-start"
              >
                <FileText className="w-4 h-4 mr-2" />
                基本情報
              </TabsTrigger>
              <TabsTrigger 
                value="profile" 
                className="bg-pink-100 border border-gray-400 border-l-0 px-4 py-2 text-sm font-medium text-gray-800 data-[state=active]:bg-white data-[state=active]:border-b-white relative z-10 rounded-none justify-start"
              >
                <User2 className="w-4 h-4 mr-2" />
                プロフィール
              </TabsTrigger>
            </TabsList>
            
            {/* 基本情報タブ */}
            <TabsContent value="basic-info" className="mt-0 p-4 border border-gray-400 border-t-0 text-sm">
              <div className="grid grid-cols-1 lg:grid-cols-[0.9fr_1.3fr_1fr] gap-0">
                
                {/* 左カラム - 基本情報入力エリア */}
                <div className="space-y-0">
                  
                  {/* 電話番号（複数欄） */}
                  <div className="p-3 space-y-2">
                    <div className="flex items-center gap-2">
                      <Label className="text-xs font-semibold whitespace-nowrap">電話番号</Label>
                      <Input 
                        placeholder="080-1234-5678" 
                        className="flex-1 h-7 text-xs border-gray-500"
                      />
                      <Button variant="outline" size="sm" className="h-7 text-xs whitespace-nowrap">
                        同一電話番号登録G1
                      </Button>
                      <span className="text-xs">0件</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-12"></div>
                      <Input 
                        placeholder="050-1234-5678" 
                        className="flex-1 h-7 text-xs border-gray-500"
                      />
                      <Button variant="outline" size="sm" className="h-7 text-xs whitespace-nowrap">
                        同一電話番号登録G2
                      </Button>
                      <span className="text-xs">0件</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-12"></div>
                      <Input 
                        placeholder="050-1234-5678" 
                        className="flex-1 h-7 text-xs border-gray-500"
                      />
                      <span className="text-green-600 text-xs cursor-pointer">🔄 同一電話番号</span>
                      <span className="text-xs">0件</span>
                    </div>
                  </div>

                  {/* メールアドレス */}
                  <div className="p-3 space-y-2">
                    <div className="flex items-center gap-2">
                      <Label className="text-xs font-semibold w-16">Webmail</Label>
                      <Input className="flex-1 h-7 text-xs border-gray-500" type="email" placeholder="" />
                      <label className="flex items-center gap-1 text-xs whitespace-nowrap">
                        <input type="checkbox" className="w-3 h-3" />
                        Web登録
                      </label>
                    </div>
                    <div className="flex items-center gap-2">
                      <Label className="text-xs font-semibold w-16">携帯メール</Label>
                      <Input className="flex-1 h-7 text-xs border-gray-500" type="email" placeholder="" />
                    </div>
                    <div className="flex items-center gap-2">
                      <Label className="text-xs font-semibold w-16">PCメール</Label>
                      <Input className="flex-1 h-7 text-xs border-gray-500" type="email" placeholder="" />
                    </div>
                  </div>

                  {/* 連絡方法・メルマガ */}
                  <div className="p-3 space-y-2">
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
                  <div className="p-3 space-y-2">
                    <div className="flex items-center gap-2">
                      <Label className="text-xs font-semibold w-16">郵便番号</Label>
                      <Input className="w-24 h-7 text-xs border-gray-500" placeholder="" />
                      <Button variant="outline" size="sm" className="h-7 text-xs">
                        住所検索
                      </Button>
                    </div>
                    <div className="flex items-center gap-2">
                      <Label className="text-xs font-semibold w-16">市区町村</Label>
                      <Input className="flex-1 h-7 text-xs border-gray-500" placeholder="" />
                    </div>
                    <div className="flex items-center gap-2">
                      <Label className="text-xs font-semibold w-16">町丁番地</Label>
                      <Input className="flex-1 h-7 text-xs border-gray-500" placeholder="" />
                    </div>
                    <div className="flex items-center gap-2">
                      <Label className="text-xs font-semibold w-16">番地</Label>
                      <Input className="flex-1 h-7 text-xs border-gray-500" placeholder="" />
                    </div>
                    <div className="flex items-center gap-2">
                      <Label className="text-xs font-semibold w-16">建物名他</Label>
                      <Input className="flex-1 h-7 text-xs border-gray-500" placeholder="" />
                      <Label className="text-xs font-semibold">号室</Label>
                      <Input className="w-16 h-7 text-xs border-gray-500" placeholder="" />
                    </div>
                    <div className="flex items-center gap-2">
                      <Label className="text-xs font-semibold w-16">京都市内住所</Label>
                      <Input className="flex-1 h-7 text-xs border-gray-500" placeholder="" />
                    </div>
                    <div className="flex items-center gap-2">
                      <Label className="text-xs font-semibold w-16">住所ふりがな</Label>
                      <Input className="flex-1 h-7 text-xs border-gray-500" placeholder="" />
                    </div>
                    <div className="flex items-center gap-2">
                      <Label className="text-xs font-semibold w-16">町ふりがな</Label>
                      <Input className="flex-1 h-7 text-xs border-gray-500" placeholder="" />
                    </div>
                    <div className="flex items-center gap-2">
                      <Label className="text-xs font-semibold w-16">住所備考</Label>
                    </div>
                    <Textarea 
                      className="min-h-[60px] text-xs border-gray-500"
                      placeholder=""
                    />
                  </div>

                  {/* 地区区分 */}
                  <div className="p-3 space-y-2">
                    <div className="flex items-center gap-2">
                      <Label className="text-xs font-semibold">地域区分</Label>
                      <Input className="w-16 h-7 text-xs border-gray-500" placeholder="滋賀" />
                      <Input className="w-12 h-7 text-xs border-gray-500" placeholder="21" />
                      <Input className="w-16 h-7 text-xs border-gray-500" placeholder="栗東" />
                    </div>
                  </div>

                  {/* 新規住所・住所+連携履歴ボタン */}
                  <div className="p-3 flex gap-2">
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
                  <div className="p-3 space-y-2">
                    <div className="flex items-center gap-2">
                      <Label className="text-xs font-semibold w-20">交通費</Label>
                      <Input className="w-20 h-7 text-xs border-gray-500" type="number" placeholder="0" />
                      <Label className="text-xs font-semibold">主な利用場所</Label>
                      <Input className="flex-1 h-7 text-xs border-gray-500" placeholder="シティホテル" />
                    </div>
                    <div className="flex items-center gap-2">
                      <Label className="text-xs font-semibold w-20">北緯</Label>
                      <Input className="w-24 h-7 text-xs border-gray-500" type="number" step="0.0001" placeholder="" />
                      <Label className="text-xs font-semibold">東経</Label>
                      <Input className="w-24 h-7 text-xs border-gray-500" type="number" step="0.0001" placeholder="" />
                    </div>
                    <div className="flex items-center gap-2">
                      <Label className="text-xs font-semibold w-20">ホテル備考</Label>
                    </div>
                    <Textarea 
                      className="min-h-[60px] text-xs border-gray-500"
                      placeholder=""
                    />
                  </div>

                  {/* 車両情報 */}
                  <div className="p-3 space-y-1">
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
                  <div className="p-3 space-y-1">
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
                <div className="space-y-0">
                  {/* ペット */}
                  <div className="p-3 space-y-2">
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
                  <div className="p-3">
                    <Button size="sm" variant="outline" className="h-7 text-xs">顧客の統計</Button>
                  </div>

                  {/* 履歴対象 */}
                  <div className="p-3 space-y-2">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-semibold">履歴対象:</span>
                      <span className="text-xs">京都デリヘル俱楽部</span>
                      <Button size="sm" variant="outline" className="h-6 text-xs ml-auto">全履歴表示</Button>
                      <Button size="sm" variant="outline" className="h-6 text-xs">ポイント履歴</Button>
                      <Button size="sm" variant="outline" className="h-6 text-xs">初期ポイント入力</Button>
                    </div>
                  </div>

                  {/* ランク・好みタイプ・話し方・嫌いタイプ */}
                  <div className="p-3 space-y-2">
                    <div className="flex items-center gap-4">
                      <Label className="text-xs font-semibold">ランク</Label>
                      <Input className="w-12 h-7 text-xs border-gray-500 text-center" value={preferenceForm.rank} onChange={() => {}} />
                      <Label className="text-xs font-semibold">好みタイプ</Label>
                      <Input 
                        className="flex-1 h-7 text-xs border-gray-500" 
                        value={preferenceForm.favoriteType}
                        onChange={e => handlePreferenceChange('favoriteType', e.target.value)}
                        placeholder="巨乳"
                      />
                    </div>
                    <div className="flex items-center gap-4">
                      <Label className="text-xs font-semibold">話し方</Label>
                      <Input 
                        className="w-20 h-7 text-xs border-gray-500" 
                        value={preferenceForm.speakingStyle}
                        onChange={e => handlePreferenceChange('speakingStyle', e.target.value)}
                        placeholder="常連"
                      />
                      <Label className="text-xs font-semibold">嫌いタイプ</Label>
                      <Input 
                        className="flex-1 h-7 text-xs border-gray-500" 
                        value={preferenceForm.dislikedType}
                        onChange={e => handlePreferenceChange('dislikedType', e.target.value)}
                        placeholder=""
                      />
                    </div>
                  </div>
                  
                  {/* プロフィール・移行 と 履歴テーブル を横並び */}
                  <div className="p-3">
                    <div className="flex gap-4">
                      {/* 左側: プロフィール・移行・領収証・地元出張 */}
                      <div className="w-56 space-y-3">
                        {/* プロフィール・移行 */}
                        <div>
                          <div className="flex items-center">
                            <span className="text-xs font-semibold">プロフィール</span>
                            <span className="text-xs font-semibold ml-auto">移行</span>
                            <Input 
                              className="w-12 h-6 text-xs border-gray-500 ml-1"
                              placeholder=""
                            />
                          </div>
                          <Textarea 
                            className="w-full min-h-[150px] text-xs border-gray-500 mt-1"
                            defaultValue="マ、ブ、50代、？、？、優しい、なし、巨乳・攻め○、なし、ローション"
                          />
                        </div>
                        
                        {/* 領収証宛先 */}
                        <div>
                          <Label className="text-xs font-semibold">領収証宛先</Label>
                          <Input 
                            className="h-7 text-xs border-gray-500 mt-1"
                            value={receiptForm.recipient}
                            onChange={e => handleReceiptChange('recipient', e.target.value)}
                            placeholder=""
                          />
                        </div>
                        
                        {/* 領収証但書 */}
                        <div>
                          <Label className="text-xs font-semibold">領収証但書</Label>
                          <Input 
                            className="h-7 text-xs border-gray-500 mt-1"
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
                      
                      {/* 右側: 履歴テーブル */}
                      <div className="flex-1">
                        <div className="border border-gray-500">
                          {/* テーブルヘッダー */}
                          <div className="bg-gray-100 grid grid-cols-7 text-xs border-b border-gray-500">
                            <div className="px-2 py-1 border-r border-gray-400">日付</div>
                            <div className="px-2 py-1 border-r border-gray-400">ホステス名</div>
                            <div className="px-2 py-1 border-r border-gray-400">コース名</div>
                            <div className="px-2 py-1 border-r border-gray-400">指名</div>
                            <div className="px-2 py-1 border-r border-gray-400">時間</div>
                            <div className="px-2 py-1 border-r border-gray-400">延長</div>
                            <div className="px-2 py-1">派遣場所表示</div>
                          </div>
                          {/* テーブルボディ */}
                          <div className="max-h-[300px] overflow-y-auto">
                            {filteredHistory.map((history) => (
                              <div key={history.id} className="grid grid-cols-7 text-xs border-b border-gray-300 hover:bg-gray-50">
                                <div className="px-2 py-1 border-r border-gray-300">{history.date}</div>
                                <div className="px-2 py-1 border-r border-gray-300">{history.staffName}</div>
                                <div className="px-2 py-1 border-r border-gray-300">{history.category}</div>
                                <div className="px-2 py-1 border-r border-gray-300">{history.rank}</div>
                                <div className="px-2 py-1 border-r border-gray-300">{history.startTime}</div>
                                <div className="px-2 py-1 border-r border-gray-300">{history.endTime}</div>
                                <div className="px-2 py-1">{history.storeName}</div>
                              </div>
                            ))}
                          </div>
                        </div>
                        <div className="text-red-600 text-xs font-semibold mt-1">
                          ※ 2017年以降の履歴になります。
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Firstドライバ名・店NG */}
                  <div className="p-3 space-y-2">
                    <div className="flex items-center gap-2">
                      <Label className="text-xs font-semibold w-24">Firstドライバ名</Label>
                      <Input className="flex-1 h-7 text-xs border-gray-500" placeholder="" />
                    </div>
                    <div className="flex items-center gap-2">
                      <Label className="text-xs font-semibold w-24">店NG</Label>
                      <Input className="flex-1 h-7 text-xs border-gray-500" placeholder="" />
                    </div>
                  </div>

                  {/* ホステス→顧客NG / 顧客→ホステスNG / アドレス交換 */}
                  <div className="p-3">
                    <div className="flex gap-2">
                      {/* 左側：ホステス→顧客NG */}
                      <div className="flex-1">
                        <div className="text-xs font-semibold text-center mb-1 border-b border-gray-400 pb-1">ホステス→顧客NG</div>
                        <div className="flex border border-gray-400">
                          <div className="flex-1 flex flex-col">
                            {/* 白とピンクの交互行 */}
                            <div className="h-6 bg-white border-b border-gray-300"></div>
                            <div className="h-6 bg-pink-200 border-b border-gray-300"></div>
                            <div className="h-6 bg-white border-b border-gray-300"></div>
                            <div className="h-6 bg-pink-200 border-b border-gray-300"></div>
                            <div className="h-6 bg-white border-b border-gray-300"></div>
                            <div className="h-6 bg-yellow-100"></div>
                          </div>
                          {/* スクロールバー */}
                          <div className="w-4 border-l border-gray-300 flex flex-col bg-gray-100">
                            <div className="h-4 flex items-center justify-center text-xs bg-gray-200 border-b border-gray-300">▲</div>
                            <div className="flex-1"></div>
                            <div className="h-4 flex items-center justify-center text-xs bg-gray-200 border-t border-gray-300">▼</div>
                          </div>
                        </div>
                      </div>
                      
                      {/* 中央：顧客→ホステスNG */}
                      <div className="flex-1">
                        <div className="flex items-center justify-center mb-1 border-b border-gray-400 pb-1">
                          <span className="text-xs font-semibold flex-1 text-center">顧客→ホステスNG</span>
                          <span className="text-xs">く非</span>
                        </div>
                        <div className="flex border border-gray-400">
                          <div className="flex-1 flex flex-col">
                            {/* 白と黄色の交互行 */}
                            <div className="h-6 bg-white border-b border-gray-300"></div>
                            <div className="h-6 bg-yellow-100 border-b border-gray-300"></div>
                            <div className="h-6 bg-white border-b border-gray-300"></div>
                            <div className="h-6 bg-yellow-100 border-b border-gray-300"></div>
                            <div className="h-6 bg-white border-b border-gray-300"></div>
                            <div className="h-6 bg-yellow-100"></div>
                          </div>
                          {/* スクロールバー */}
                          <div className="w-4 border-l border-gray-300 flex flex-col bg-gray-100">
                            <div className="h-4 flex items-center justify-center text-xs bg-gray-200 border-b border-gray-300">▲</div>
                            <div className="flex-1"></div>
                            <div className="h-4 flex items-center justify-center text-xs bg-gray-200 border-t border-gray-300">▼</div>
                          </div>
                        </div>
                      </div>
                      
                      {/* 右側：アドレス交換 */}
                      <div className="w-40">
                        <div className="text-xs font-semibold mb-1">アドレス交換</div>
                        <div className="flex items-center gap-1 mb-1">
                          <div className="w-16 h-6 bg-cyan-200 border border-gray-400"></div>
                          <span className="text-xs">&lt;</span>
                        </div>
                        <div className="flex border border-gray-400">
                          <div className="flex-1 flex flex-col">
                            <div className="h-6 bg-white border-b border-gray-300"></div>
                            <div className="h-6 bg-white border-b border-gray-300"></div>
                            <div className="h-6 bg-white border-b border-gray-300"></div>
                            <div className="h-6 bg-white border-b border-gray-300"></div>
                            <div className="h-6 bg-white border-b border-gray-300"></div>
                            <div className="h-6 bg-white"></div>
                          </div>
                          {/* スクロールバー */}
                          <div className="w-4 border-l border-gray-300 flex flex-col bg-gray-100">
                            <div className="h-4 flex items-center justify-center text-xs bg-gray-200 border-b border-gray-300">▲</div>
                            <div className="flex-1"></div>
                            <div className="h-4 flex items-center justify-center text-xs bg-gray-200 border-t border-gray-300">▼</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* メディア名・旧備考 */}
                  <div className="p-3 space-y-2">
                    <div className="flex items-center gap-2">
                      <Label className="text-xs font-semibold">メディア名</Label>
                      <Input className="flex-1 h-7 text-xs border-gray-500" placeholder="" />
                    </div>
                    <div className="flex items-start gap-2">
                      <Label className="text-xs font-semibold">旧備考</Label>
                      <div className="flex-1 text-xs text-red-600 min-h-[40px]">
                        巨乳好きの50分だが利用頻度は○。なんせ乳が無い千は×。 Bランク
                      </div>
                    </div>
                  </div>
                </div>

                {/* 右カラム - ホステス選択エリア */}
                <div className="space-y-0">
                  {/* 再表示・出勤予定日 */}
                  <div className="p-3 space-y-2">
                    <div className="flex items-center gap-2">
                      <Button size="sm" variant="outline" className="h-7 text-xs bg-pink-100 border-pink-400">
                        再表示
                      </Button>
                      <Label className="text-xs font-semibold">出勤予定日:</Label>
                      <Input className="flex-1 h-7 text-xs border-gray-500" placeholder="2025年08月27日" />
                    </div>
                    <div className="text-red-600 text-xs font-semibold">
                      ※ 2017年以降の履歴になります。
                    </div>
                    <div className="flex items-center gap-2">
                      <Button size="sm" variant="outline" className="h-7 text-xs bg-green-100 border-green-400">
                        裏店舗出勤
                      </Button>
                    </div>
                  </div>

                  {/* ホステス選択ボタン */}
                  <div className="p-3 flex justify-end">
                    <Button size="sm" className="h-8 text-xs bg-red-600 text-white hover:bg-red-700">
                      ホステス選択
                    </Button>
                  </div>

                  {/* 五十音フィルター */}
                  <div className="p-3 space-y-2">
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
                  <div className="p-3">
                    <div className="border border-gray-500 max-h-[300px] overflow-y-auto">
                      {/* サンプルホステスデータ */}
                      {[
                        { id: '1184', area: '京都', name: 'あみ', type: 'レディ', rank: 'A', status: '終了', time1: '20:00', time2: '24:00', time3: '2:00' },
                        { id: '----', area: '京都', name: '彩羽ー', type: 'ガールズ', rank: 'A', status: '終了', time1: '16:00', time2: '17:30', time3: '19:00', highlight: 'blue' },
                        { id: '1184', area: '京都', name: 'あいめ', type: 'レディ', rank: 'A', status: '当日欠', time1: '16:00', time2: '24:00', time3: '2:00', highlight: 'red' },
                        { id: '9191', area: '京都', name: 'あかり', type: 'ガールズ', rank: 'A', status: '当日欠', time1: '16:00', time2: '23:00', time3: '24:30', highlight: 'yellow' },
                        { id: '1194', area: '京都', name: 'あんず', type: 'ガールズ', rank: 'A', status: '当日欠', time1: '9:00', time2: '15:00', time3: '17:00', highlight: 'yellow' },
                        { id: '1030', area: '京都', name: 'あいみ', type: 'ガールズ', rank: 'A', status: '', time1: '', time2: '', time3: '' },
                        { id: '1071', area: '京都', name: 'かきな', type: 'レディ', rank: 'A', status: '', time1: '', time2: '', time3: '' },
                        { id: '1118', area: '京都', name: 'さち', type: 'レディ', rank: 'A', status: '', time1: '', time2: '', time3: '' },
                        { id: '1074', area: '京都', name: 'たすか', type: 'ガールズ', rank: 'A', status: '', time1: '', time2: '', time3: '' },
                        { id: '1119', area: '京都', name: 'なまね', type: 'ガールズ', rank: 'A', status: '', time1: '', time2: '', time3: '' },
                        { id: '1110', area: '京都', name: 'はりさ', type: 'レディ', rank: 'A', status: '', time1: '', time2: '', time3: '' },
                        { id: '1117', area: '京都', name: 'まんじゅ', type: 'ガールズ', rank: 'A', status: '', time1: '', time2: '', time3: '' },
                        { id: '1038', area: '京都', name: 'やんな', type: 'レディ', rank: 'A', status: '', time1: '', time2: '', time3: '' },
                      ].filter((hostess) => {
                        if (kanaFilter === 'all') return true;
                        // ひらがなの最初の文字でフィルタリング
                        const firstChar = hostess.name.charAt(0);
                        return firstChar === kanaFilter;
                      }).map((hostess, index) => (
                        <div 
                          key={index} 
                          className={`grid grid-cols-9 text-xs border-b border-gray-300 ${
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
                          <div className="px-1 py-0.5 border-r border-gray-300">{hostess.rank}</div>
                          <div className="px-1 py-0.5 border-r border-gray-300">{hostess.status}</div>
                          <div className="px-1 py-0.5 border-r border-gray-300">{hostess.time1}</div>
                          <div className="px-1 py-0.5 border-r border-gray-300">{hostess.time2}</div>
                          <div className="px-1 py-0.5">{hostess.time3}</div>
                        </div>
                      ))}
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
    </div>
  );
}
