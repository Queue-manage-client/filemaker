'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { FileText, User2, ArrowLeft, Pen } from "lucide-react";
import type { UsageHistory } from '@/types/customer-ledger';

export default function CustomerLedger() {
  const router = useRouter();

  React.useEffect(() => {
    document.title = '顧客台帳 - Dispatch Harmony Hub';
  }, []);

  const [usageHistory] = useState<UsageHistory[]>([
    {
      id: '1',
      receptionNumber: 'R-2025-001',
      date: '2025-01-26',
      storeName: '本店',
      staffName: 'あみ',
      category: 'レディ',
      rank: 'A',
      startTime: '20:00',
      endTime: '24:00',
      amount: 45000,
      status: 'completed'
    },
    {
      id: '2',
      receptionNumber: 'R-2025-002',
      date: '2025-01-25',
      storeName: '銀座支店',
      staffName: 'あい',
      category: 'ガールズ',
      rank: 'A',
      startTime: '16:00',
      endTime: '17:30',
      amount: 68000,
      status: 'completed'
    },
    {
      id: '3',
      receptionNumber: 'R-2025-003',
      date: '2025-01-24',
      storeName: '本店',
      staffName: 'あいみ',
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
      staffName: 'あきな',
      category: 'ガールズ',
      rank: 'A',
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
      staffName: 'あすか',
      category: 'ガールズ',
      rank: 'A',
      startTime: '20:30',
      endTime: '02:15',
      amount: 95000,
      status: 'completed'
    },
    {
      id: '6',
      receptionNumber: 'R-2025-006',
      date: '2025-01-21',
      storeName: '本店',
      staffName: 'あすな',
      category: 'ガールズ',
      rank: 'A',
      startTime: '19:00',
      endTime: '23:00',
      amount: 40000,
      status: 'completed'
    },
    {
      id: '7',
      receptionNumber: 'R-2025-007',
      date: '2025-01-20',
      storeName: '本店',
      staffName: 'あまね',
      category: 'ガールズ',
      rank: 'A',
      startTime: '18:00',
      endTime: '22:00',
      amount: 35000,
      status: 'completed'
    },
    {
      id: '8',
      receptionNumber: 'R-2025-008',
      date: '2025-01-19',
      storeName: '本店',
      staffName: 'あんじゅ',
      category: 'ガールズ',
      rank: 'A',
      startTime: '20:00',
      endTime: '01:00',
      amount: 50000,
      status: 'completed'
    }
  ]);

  // フィルタリングされた履歴
  const filteredHistory = usageHistory;

  return (
    <div className="min-h-screen bg-gray-100 p-4 [&_input]:border-black [&_textarea]:border-black">
      {/* ヘッダー */}
      <Card className="mb-4">
        <CardContent className="p-4">
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
        </CardContent>
      </Card>

      {/* 顧客情報ヘッダー */}
      <Card className="mb-6">
        <CardContent className="p-2">
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
        </CardContent>
      </Card>

      {/* メインコンテンツエリア - タブ構造 */}
      <Card>
        <CardContent className="p-0">
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
            <TabsContent value="basic-info" className="mt-0 border border-black border-t-0 text-xs">
              {/* 上部ヘッダー行 */}
              <div className="flex border-b border-black">
                {/* 左セクション - 電話番号 */}
                <div className="flex items-center border-r border-black">
                  <span className="bg-purple-200 px-2 py-1 text-xs border-r border-black">電話番号</span>
                  <Input className="w-32 h-7 text-xs rounded-none border-0" defaultValue="000-1486-0491" />
                  <Button variant="outline" size="sm" className="h-7 text-xs rounded-none border-l border-black">同一電話番号登録</Button>
                </div>
                {/* 中央セクション - ランク・好み */}
                <div className="flex items-center border-r border-black">
                  <span className="bg-purple-200 px-2 py-1 text-xs border-r border-black">ランク</span>
                  <Input className="w-8 h-7 text-xs rounded-none border-0" defaultValue="A" />
                  <span className="bg-purple-200 px-2 py-1 text-xs border-l border-r border-black">好みタイプ</span>
                  <Input className="w-24 h-7 text-xs rounded-none border-0" />
                  <span className="bg-purple-200 px-2 py-1 text-xs border-l border-r border-black">巨乳</span>
                  <input type="checkbox" className="mx-2" />
                </div>
                {/* 右セクション - 出勤予定日 */}
                <div className="flex items-center flex-1 justify-end">
                  <span className="bg-purple-200 px-2 py-1 text-xs border-l border-r border-black">出勤予定日:</span>
                  <span className="px-2 py-1 text-xs">2025年08月27日</span>
                  <Button variant="outline" size="sm" className="h-7 text-xs rounded-none">再表示</Button>
                </div>
              </div>

              {/* 2行目 */}
              <div className="flex border-b border-black">
                <div className="flex items-center border-r border-black">
                  <Input className="w-32 h-7 text-xs rounded-none border-0" />
                  <Button variant="outline" size="sm" className="h-7 text-xs rounded-none border-l border-black">同一電話番号登録</Button>
                </div>
                <div className="flex items-center border-r border-black">
                  <span className="bg-purple-200 px-2 py-1 text-xs border-r border-black">ペット</span>
                  <label className="flex items-center px-2 text-xs"><input type="checkbox" className="mr-1" />犬</label>
                  <label className="flex items-center px-2 text-xs"><input type="checkbox" className="mr-1" />なし</label>
                  <span className="bg-purple-200 px-2 py-1 text-xs border-l border-r border-black">話し方</span>
                  <Input className="w-16 h-7 text-xs rounded-none border-0" />
                  <span className="bg-purple-200 px-2 py-1 text-xs border-l border-r border-black">嫌いタイプ</span>
                  <Input className="w-16 h-7 text-xs rounded-none border-0" />
                </div>
                <div className="flex-1 flex items-center justify-end">
                  <span className="text-red-600 text-xs px-2">※2017年以降の履歴になります。</span>
                </div>
              </div>

              {/* 3行目 */}
              <div className="flex border-b border-black">
                <div className="flex items-center border-r border-black">
                  <span className="bg-purple-200 px-2 py-1 text-xs border-r border-black">Webmail</span>
                  <Input className="w-32 h-7 text-xs rounded-none border-0" />
                  <label className="flex items-center px-2 text-xs"><input type="checkbox" className="mr-1" />Web登録</label>
                </div>
                <div className="flex items-center border-r border-black">
                  <label className="flex items-center px-2 text-xs"><input type="checkbox" className="mr-1" />焼</label>
                  <label className="flex items-center px-2 text-xs"><input type="checkbox" className="mr-1" />塩</label>
                  <label className="flex items-center px-2 text-xs"><input type="checkbox" className="mr-1" />巨乳</label>
                  <label className="flex items-center px-2 text-xs"><input type="checkbox" className="mr-1" />やらかい</label>
                  <span className="bg-purple-200 px-2 py-1 text-xs border-l border-r border-black">ロション</span>
                  <Input className="w-16 h-7 text-xs rounded-none border-0" />
                </div>
                <div className="flex items-center border-r border-black px-2">
                  <span className="text-xs">□塩度対象：京都デリヘル俱楽部</span>
                </div>
                <div className="flex items-center flex-1">
                  <Button variant="outline" size="sm" className="h-7 text-xs rounded-none mx-1">全履歴表示</Button>
                  <Button variant="outline" size="sm" className="h-7 text-xs rounded-none mx-1">ポイント履歴</Button>
                  <Button variant="outline" size="sm" className="h-7 text-xs rounded-none mx-1">初期ポイント入力</Button>
                </div>
              </div>

              {/* メイン3カラム */}
              <div className="flex">
                {/* 左カラム */}
                <div className="w-1/4 border-r border-black">
                  {/* 携帯メール */}
                  <div className="flex items-center border-b border-black">
                    <span className="bg-purple-200 px-2 py-1 text-xs w-20 border-r border-black">携帯メール</span>
                    <Input className="flex-1 h-7 text-xs rounded-none border-0" />
                  </div>
                  {/* PCメール */}
                  <div className="flex items-center border-b border-black">
                    <span className="bg-purple-200 px-2 py-1 text-xs w-20 border-r border-black">PCメール</span>
                    <Input className="flex-1 h-7 text-xs rounded-none border-0" />
                  </div>
                  {/* 連絡方法 */}
                  <div className="flex items-center border-b border-black">
                    <span className="bg-purple-200 px-2 py-1 text-xs w-20 border-r border-black">連絡方法</span>
                    <div className="flex items-center flex-1 px-1">
                      <label className="flex items-center text-xs mr-2"><input type="checkbox" className="mr-1" />電話</label>
                      <label className="flex items-center text-xs mr-2"><input type="checkbox" className="mr-1" />メール</label>
                      <label className="flex items-center text-xs mr-2"><input type="checkbox" className="mr-1" />なし</label>
                      <label className="flex items-center text-xs mr-2"><input type="checkbox" className="mr-1" />メルマガ</label>
                      <label className="flex items-center text-xs"><input type="checkbox" className="mr-1" />有</label>
                    </div>
                  </div>
                  {/* 郵便番号 */}
                  <div className="flex items-center border-b border-black">
                    <span className="bg-purple-200 px-2 py-1 text-xs w-20 border-r border-black">郵便番号</span>
                    <Input className="w-24 h-7 text-xs rounded-none border-0" />
                    <Button variant="outline" size="sm" className="h-7 text-xs rounded-none border-l border-black">住所ルーペ</Button>
                  </div>
                  {/* 市区町村 */}
                  <div className="flex items-center border-b border-black">
                    <span className="bg-green-200 px-2 py-1 text-xs w-20 border-r border-black">市区町村</span>
                    <Input className="flex-1 h-7 text-xs rounded-none border-0" />
                  </div>
                  {/* 町丁番地 */}
                  <div className="flex items-center border-b border-black">
                    <span className="bg-pink-200 px-2 py-1 text-xs w-20 border-r border-black">町丁番地</span>
                    <Input className="flex-1 h-7 text-xs rounded-none border-0" defaultValue="寺戸" />
                  </div>
                  {/* 番地 */}
                  <div className="flex items-center border-b border-black">
                    <span className="bg-yellow-200 px-2 py-1 text-xs w-20 border-r border-black">番地</span>
                    <Input className="flex-1 h-7 text-xs rounded-none border-0" />
                  </div>
                  {/* 建物名称 */}
                  <div className="flex items-center border-b border-black">
                    <span className="bg-purple-200 px-2 py-1 text-xs w-20 border-r border-black">建物名称</span>
                    <Input className="flex-1 h-7 text-xs rounded-none border-0" defaultValue="寺室" />
                  </div>
                  {/* 京都市外住所 */}
                  <div className="flex items-center border-b border-black">
                    <span className="bg-purple-200 px-2 py-1 text-xs w-20 border-r border-black">京都市外住所</span>
                    <Input className="flex-1 h-7 text-xs rounded-none border-0" />
                  </div>
                  {/* 住所ふりがな */}
                  <div className="flex items-center border-b border-black">
                    <span className="bg-purple-200 px-2 py-1 text-xs w-20 border-r border-black">住所ふりがな</span>
                    <Input className="flex-1 h-7 text-xs rounded-none border-0" />
                  </div>
                  {/* 町ふりがな */}
                  <div className="flex items-center border-b border-black">
                    <span className="bg-purple-200 px-2 py-1 text-xs w-20 border-r border-black">町ふりがな</span>
                    <Input className="flex-1 h-7 text-xs rounded-none border-0" />
                  </div>
                  {/* 住所備考 */}
                  <div className="flex items-center border-b border-black">
                    <span className="bg-purple-200 px-2 py-1 text-xs w-20 border-r border-black">住所備考</span>
                    <Input className="flex-1 h-7 text-xs rounded-none border-0" />
                  </div>
                  {/* 地域区分 */}
                  <div className="flex items-center border-b border-black">
                    <span className="bg-purple-200 px-2 py-1 text-xs border-r border-black">地域区分</span>
                    <Input className="w-12 h-7 text-xs rounded-none border-0" defaultValue="滋賀" />
                    <Input className="w-8 h-7 text-xs rounded-none border-l border-black" defaultValue="21" />
                    <Input className="flex-1 h-7 text-xs rounded-none border-l border-black" defaultValue="東側" />
                  </div>
                  {/* 青いボタン群 */}
                  <div className="flex border-b border-black">
                    <Button className="flex-1 h-7 text-xs rounded-none bg-blue-500 text-white">交通費</Button>
                    <Button className="flex-1 h-7 text-xs rounded-none bg-green-500 text-white border-l border-black">派遣場所</Button>
                  </div>
                  {/* 交通費・利用場所 */}
                  <div className="flex items-center border-b border-black">
                    <span className="bg-purple-200 px-2 py-1 text-xs border-r border-black">交通費</span>
                    <Input className="w-16 h-7 text-xs rounded-none border-0" />
                    <span className="bg-purple-200 px-2 py-1 text-xs border-l border-r border-black">主な利用場所</span>
                    <Input className="w-20 h-7 text-xs rounded-none border-0" />
                    <span className="bg-purple-200 px-2 py-1 text-xs border-l border-r border-black">シティホテル</span>
                    <Input className="flex-1 h-7 text-xs rounded-none border-0" />
                  </div>
                  {/* 北緯・東経 */}
                  <div className="flex items-center border-b border-black">
                    <span className="bg-purple-200 px-2 py-1 text-xs border-r border-black">北緯</span>
                    <Input className="w-20 h-7 text-xs rounded-none border-0" />
                    <span className="bg-purple-200 px-2 py-1 text-xs border-l border-r border-black">東経</span>
                    <Input className="flex-1 h-7 text-xs rounded-none border-0" />
                  </div>
                  {/* ホテル備考 */}
                  <div className="border-b border-black">
                    <span className="bg-purple-200 px-2 py-1 text-xs block border-b border-black">ホテル備考</span>
                    <Textarea className="w-full h-20 text-xs rounded-none border-0 bg-yellow-100" />
                  </div>
                  {/* 車両情報 */}
                  <div className="flex items-center border-b border-black text-xs">
                    <span className="bg-purple-200 px-1 py-1 border-r border-black">車種</span>
                    <Input className="w-16 h-7 text-xs rounded-none border-0" />
                    <span className="bg-purple-200 px-1 py-1 border-l border-r border-black">車色</span>
                    <Input className="w-12 h-7 text-xs rounded-none border-0" />
                    <span className="bg-purple-200 px-1 py-1 border-l border-r border-black">地域</span>
                    <Input className="w-10 h-7 text-xs rounded-none border-0" />
                    <span className="bg-purple-200 px-1 py-1 border-l border-r border-black">分類</span>
                    <Input className="w-8 h-7 text-xs rounded-none border-0" />
                    <span className="bg-purple-200 px-1 py-1 border-l border-r border-black">平仮名</span>
                    <Input className="w-8 h-7 text-xs rounded-none border-0" />
                    <span className="bg-purple-200 px-1 py-1 border-l border-r border-black">ナンバー</span>
                    <Input className="flex-1 h-7 text-xs rounded-none border-0" />
                  </div>
                  {/* 本日の車 */}
                  <div className="flex items-center border-b border-black">
                    <span className="bg-pink-300 px-2 py-1 text-xs w-20 border-r border-black">本日の車</span>
                    <Input className="flex-1 h-7 text-xs rounded-none border-0" />
                  </div>
                  {/* クレジットカード・メディア */}
                  <div className="flex items-center">
                    <span className="bg-purple-200 px-2 py-1 text-xs border-r border-black">クレジットカード</span>
                    <Input className="w-8 h-7 text-xs rounded-none border-0" />
                    <span className="bg-purple-200 px-2 py-1 text-xs border-l border-r border-black">メディア</span>
                    <Input className="flex-1 h-7 text-xs rounded-none border-0" />
                  </div>
                </div>

                {/* 中央カラム */}
                <div className="w-1/4 border-r border-black">
                  {/* 備考の統計 */}
                  <div className="border-b border-black">
                    <span className="bg-purple-200 px-2 py-1 text-xs block border-b border-black">備考の統計</span>
                    <Textarea className="w-full h-32 text-xs rounded-none border-0" />
                  </div>
                  {/* 緑色のエリア */}
                  <div className="border-b border-black bg-green-100 h-16"></div>
                  {/* 編の信発先 */}
                  <div className="flex items-center border-b border-black">
                    <span className="bg-purple-200 px-2 py-1 text-xs w-20 border-r border-black">編の信発先</span>
                    <Input className="flex-1 h-7 text-xs rounded-none border-0" />
                  </div>
                  {/* 編の信住番 */}
                  <div className="flex items-center border-b border-black">
                    <span className="bg-purple-200 px-2 py-1 text-xs w-20 border-r border-black">編の信住番</span>
                    <Input className="flex-1 h-7 text-xs rounded-none border-0" />
                  </div>
                  {/* 地元出張 */}
                  <div className="flex items-center border-b border-black">
                    <span className="bg-purple-200 px-2 py-1 text-xs w-20 border-r border-black">地元出張</span>
                    <label className="flex items-center px-2 text-xs">
                      <input type="radio" name="local-trip" className="mr-1" defaultChecked />地元
                    </label>
                  </div>
                  {/* Firstドライバ名 */}
                  <div className="border-b border-black">
                    <span className="bg-purple-200 px-2 py-1 text-xs block border-b border-black">Firstドライバ名</span>
                    <Textarea className="w-full h-12 text-xs rounded-none border-0" />
                  </div>
                  {/* 店NG */}
                  <div className="border-b border-black">
                    <span className="bg-purple-200 px-2 py-1 text-xs block border-b border-black">店NG</span>
                    <Textarea className="w-full h-12 text-xs rounded-none border-0" />
                  </div>
                  {/* ホステス→顧客NG / 顧客→ホステスNG */}
                  <div className="flex border-b border-black">
                    <div className="flex-1 border-r border-black">
                      <span className="bg-yellow-200 px-2 py-1 text-xs block border-b border-black">ホステス→顧客NG</span>
                      <Textarea className="w-full h-12 text-xs rounded-none border-0" />
                    </div>
                    <div className="flex-1 border-r border-black">
                      <span className="bg-yellow-200 px-2 py-1 text-xs block border-b border-black">顧客→ホステスNG</span>
                      <Textarea className="w-full h-12 text-xs rounded-none border-0" />
                    </div>
                    <div className="flex-1">
                      <span className="bg-yellow-200 px-2 py-1 text-xs block border-b border-black">アドレス交換</span>
                      <Textarea className="w-full h-12 text-xs rounded-none border-0" />
                    </div>
                  </div>
                  {/* 旧備考 */}
                  <div>
                    <span className="bg-purple-200 px-2 py-1 text-xs block border-b border-black">旧備考</span>
                    <Textarea className="w-full h-20 text-xs rounded-none border-0 bg-yellow-100" />
                    <div className="text-blue-600 text-xs p-1">巨乳好きの50分だが1時間精算おロ。なんせ礼儀が無いオバメ。 Bランク</div>
                  </div>
                </div>

                {/* 右カラム */}
                <div className="flex-1">
                  {/* 履歴ヘッダー */}
                  <div className="flex items-center border-b border-black bg-gray-100 text-xs">
                    <span className="px-2 py-1 border-r border-black">日付</span>
                    <span className="px-2 py-1 border-r border-black">ホステス名</span>
                    <span className="px-2 py-1 border-r border-black">コース</span>
                    <span className="px-2 py-1 border-r border-black">場合</span>
                    <span className="px-2 py-1 border-r border-black">延長</span>
                    <span className="px-2 py-1 border-r border-black">時間</span>
                    <span className="px-2 py-1 flex-1">派遣場所/氏名</span>
                  </div>
                  {/* 五十音グリッド */}
                  <div className="flex border-b border-black">
                    <div className="flex-1 p-1">
                      <div className="grid grid-cols-10 gap-0 text-xs">
                        {['あ','い','う','え','お','か','き','く','け','こ','さ','し','す','せ','そ','た','ち','つ','て','と','な','に','ぬ','ね','の','は','ひ','ふ','へ','ほ','ま','み','む','め','も','や','','ゆ','','よ','ら','り','る','れ','ろ','わ','','を','','ん'].map((kana, i) => (
                          kana ? (
                            <button key={i} className="w-5 h-5 text-center hover:bg-gray-200 border border-gray-300">{kana}</button>
                          ) : (
                            <div key={i} className="w-5 h-5"></div>
                          )
                        ))}
                      </div>
                    </div>
                    <Button variant="outline" size="sm" className="h-7 text-xs rounded-none m-1">クリア</Button>
                  </div>
                  {/* 履歴テーブル */}
                  <div className="overflow-y-auto" style={{ maxHeight: '400px' }}>
                    {filteredHistory.map((history, index) => (
                      <div
                        key={history.id}
                        className={`flex items-center border-b border-black text-xs ${
                          history.status === 'absent' ? 'bg-red-400' :
                          index % 2 === 0 ? 'bg-white' : 'bg-pink-100'
                        }`}
                      >
                        <span className="px-2 py-1 border-r border-black w-16">{history.staffName}</span>
                        <span className="px-2 py-1 border-r border-black w-12">{history.category}</span>
                        <span className="px-2 py-1 border-r border-black w-8">{history.rank}</span>
                        <span className="px-2 py-1 border-r border-black w-12">終了</span>
                        <span className="px-2 py-1 flex-1">{history.startTime} {history.endTime}</span>
                      </div>
                    ))}
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
        </CardContent>
      </Card>
    </div>
  );
}
