'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { ArrowLeft, ChevronLeft, ArrowUpDown, Check, Star } from "lucide-react";
import type { TodayCastData } from '@/types';
import { sampleCastData } from '@/data/castSampleData';
import { formatDate } from 'date-fns';

type SortKey = 'endTime' | 'category' | 'ranking' | 'startTime' | 'name';
type SortOrder = 'asc' | 'desc';

export default function RT2Panel() {
  const router = useRouter();
  const [currentTime, setCurrentTime] = useState(new Date());
  const [sortKey, setSortKey] = useState<SortKey>('endTime');
  const [sortOrder, setSortOrder] = useState<SortOrder>('asc');

  // フィルター状態 (Item 23)
  const [filterManager, setFilterManager] = useState<string>('all');
  const [filterWorkStyle, setFilterWorkStyle] = useState<string>('all');
  const [filterStore, setFilterStore] = useState<string>('all');
  const [selectedCast, setSelectedCast] = useState<TodayCastData | null>(null);

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
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // 時間を分に変換する関数
  const timeToMinutes = (time: string): number => {
    if (!time) return 0;
    const [hours, minutes] = time.split(':').map(Number);
    // 深夜帯（0-6時）は24時間を加算して比較
    const adjustedHours = hours < 7 ? hours + 24 : hours;
    return adjustedHours * 60 + (minutes || 0);
  };

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
    // まずフィルターを適用
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

    // ソートを適用
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
  }, [sortKey, sortOrder, filterManager, filterWorkStyle, filterStore]);


  const formatTime = (date: Date) => {
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');
    
    return `${hours}:${minutes}:${seconds}`;
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* ヘッダー */}
      <div className="h-[50px] bg-white border-b border-zinc-300">
        <div className="flex items-center h-full px-2">
          {/* ダッシュボードに戻る - 左端 */}
          <Button
            variant="outline"
            onClick={() => router.push('/dashboard')}
            className="h-8 px-3 text-xs flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            ダッシュボードに戻る
          </Button>

          {/* 中央配置のボタン群 */}
          <div className="flex-1 flex items-center justify-center gap-2">
            {/* RT Ⅱ パネルタイトル */}
            <h1 className="text-lg font-bold mr-2">RT Ⅱ パネル</h1>

            {/* 日付表示 */}
            <div className="text-sm font-mono bg-gray-500 text-white px-2 py-1 rounded">
              {formatDate(currentTime, 'yyyy/MM/dd(EEE)')}
            </div>

            {/* 時刻表示 */}
            <div className="text-sm font-mono bg-gray-500 text-white px-2 py-1 rounded">
              {formatTime(currentTime)}
            </div>

            {/* 新顧客検索 */}
            <Button
              variant="outline"
              className="h-8 px-4 text-xs border-black"
              onClick={() => router.push('/customer-ledger')}
            >
              新顧客検索
            </Button>

            {/* 配車パネル */}
            <Button
              className="h-8 px-4 text-xs bg-amber-200 hover:bg-amber-300 text-black border border-black"
              onClick={() => router.push('/dispatch-panel-2d')}
            >
              配車パネル
            </Button>

            {/* 手配表 */}
            <Button
              className="h-8 px-4 text-xs bg-purple-400 hover:bg-purple-500 text-black border border-black"
              onClick={() => router.push('/tehai')}
            >
              手配表
            </Button>

            {/* Menu */}
            <Button
              variant="outline"
              className="h-8 px-4 text-xs border-black"
              onClick={() => router.push('/dashboard')}
            >
              Menu
            </Button>

            {/* ソート選択 */}
            <div className="flex items-center gap-2 ml-4">
              <span className="text-xs text-gray-600">並び順:</span>
              <Select value={sortKey} onValueChange={(v) => setSortKey(v as SortKey)}>
                <SelectTrigger className="h-8 w-[140px] text-xs">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="endTime">受付終了時間</SelectItem>
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
                <ArrowUpDown className="w-4 h-4" />
                <span className="ml-1 text-xs">{sortOrder === 'asc' ? '昇順' : '降順'}</span>
              </Button>
            </div>

            {/* フィルター選択 (Item 23) */}
            <div className="flex items-center gap-2 ml-4">
              <span className="text-xs text-gray-600">担当者:</span>
              <Select value={filterManager} onValueChange={setFilterManager}>
                <SelectTrigger className="h-8 w-[100px] text-xs">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">全て</SelectItem>
                  {filterOptions.managers.map(m => (
                    <SelectItem key={m} value={m}>{m}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <span className="text-xs text-gray-600">勤務形態:</span>
              <Select value={filterWorkStyle} onValueChange={setFilterWorkStyle}>
                <SelectTrigger className="h-8 w-[120px] text-xs">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">全て</SelectItem>
                  {filterOptions.workStyles.map(w => (
                    <SelectItem key={w} value={w}>{w}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <span className="text-xs text-gray-600">店舗:</span>
              <Select value={filterStore} onValueChange={setFilterStore}>
                <SelectTrigger className="h-8 w-[120px] text-xs">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">全て</SelectItem>
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
      <div className="p-4">

      {/* メインテーブル */}
      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-xs table-fixed">
              <colgroup>
                <col style={{width: '20px'}} />
                <col style={{width: '30px'}} />
                <col style={{width: '45px'}} />
                <col style={{width: '120px'}} />
                <col style={{width: '25px'}} />
                <col style={{width: '25px'}} />
                <col style={{width: '50px'}} />
                <col style={{width: '70px'}} />
                <col style={{width: '50px'}} />
                <col style={{width: '40px'}} />
                <col style={{width: '40px'}} />
                <col style={{width: '70px'}} />
                <col style={{width: '30px'}} />
                <col style={{width: '20px'}} />
                <col style={{width: '140px'}} />
                <col style={{width: '20px'}} />
                <col style={{width: '140px'}} />
                <col style={{width: '20px'}} />
                <col style={{width: '140px'}} />
                <col style={{width: '20px'}} />
                <col style={{width: '140px'}} />
                <col style={{width: '20px'}} />
                <col style={{width: '140px'}} />
                <col style={{width: '20px'}} />
                <col style={{width: '140px'}} />
                <col style={{width: '20px'}} />
                <col style={{width: '140px'}} />
                <col style={{width: '20px'}} />
                <col style={{width: '140px'}} />
                <col style={{width: '20px'}} />
                <col style={{width: '70px'}} />
                <col style={{width: '70px'}} />
                <col style={{width: '130px'}} />
                <col style={{width: '60px'}} />
                <col style={{width: '60px'}} />
                <col style={{width: '40px'}} />
                <col style={{width: '120px'}} />
                <col style={{width: '30px'}} />
              </colgroup>
              <thead>
                <tr className="bg-white">
                  <th className="border border-gray-300 px-0.5 py-0.5 text-center"></th>
                  <th className="border border-gray-300 px-1 py-0.5 text-center text-[10px]">確認</th>
                  <th className="border border-gray-300 px-1 py-0.5 text-center text-[10px]">出勤</th>
                  <th className="border border-gray-300 px-1 py-0.5 text-center">名前 / Girls</th>
                  <th className="border border-gray-300 px-0.5 py-0.5 text-center"></th>
                  <th className="border border-gray-300 px-0.5 py-0.5 text-center"></th>
                  <th className="border-t border-b border-gray-300 px-1 py-0.5 text-center">併用</th>
                  <th className="border-t border-b border-gray-300 px-1 py-0.5 text-center">迎場所</th>
                  <th className="border-t border-b border-gray-300 px-1 py-0.5 text-center">受付</th>
                  <th className="border-t border-b border-gray-300 px-1 py-0.5 text-center">終了</th>
                  <th className="border-t border-b border-gray-300 px-1 py-0.5 text-center">帰宅</th>
                  <th className="border-t border-b border-gray-300 px-1 py-0.5 text-center">送場所</th>
                  <th className="border-t border-b border-gray-300 px-1 py-0.5 text-center">実績</th>
                  <th className="border border-gray-300 px-0.5 py-0.5 text-center"></th>
                  <th className="border border-gray-300 px-1 py-0.5 text-center">最終接客</th>
                  <th className="border border-gray-300 px-0.5 py-0.5 text-center"></th>
                  <th className="border border-gray-300 px-1 py-0.5 text-center">接客中</th>
                  <th className="border border-gray-300 px-0.5 py-0.5 text-center"></th>
                  <th className="border border-gray-300 px-1 py-0.5 text-center">INドライバー稼働中</th>
                  <th className="border border-gray-300 px-0.5 py-0.5 text-center"></th>
                  <th className="border border-gray-300 px-1 py-0.5 text-center">予約1</th>
                  <th className="border border-gray-300 px-0.5 py-0.5 text-center"></th>
                  <th className="border border-gray-300 px-1 py-0.5 text-center">予約2</th>
                  <th className="border border-gray-300 px-0.5 py-0.5 text-center"></th>
                  <th className="border border-gray-300 px-1 py-0.5 text-center">予約3</th>
                  <th className="border border-gray-300 px-0.5 py-0.5 text-center"></th>
                  <th className="border border-gray-300 px-1 py-0.5 text-center">予約4</th>
                  <th className="border border-gray-300 px-0.5 py-0.5 text-center"></th>
                  <th className="border border-gray-300 px-1 py-0.5 text-center">予約5以降</th>
                  <th className="border border-gray-300 px-0.5 py-0.5 text-center"></th>
                  <th className="border border-gray-300 px-1 py-0.5 text-center">出勤値客</th>
                  <th className="border border-gray-300 px-1 py-0.5 text-center">特記事項</th>
                  <th className="border border-gray-300 px-1 py-0.5 text-center">ホステスNG場所</th>
                  <th className="border border-gray-300 px-1 py-0.5 text-center">待ち時間</th>
                  <th className="border border-gray-300 px-1 py-0.5 text-center">web状態</th>
                  <th className="border border-gray-300 px-1 py-0.5 text-center">mode</th>
                  <th className="border border-gray-300 px-0.5 py-0.5 text-center"></th>
                  <th className="border border-gray-300 px-1 py-0.5 text-center">順位</th>
                </tr>
              </thead>
              <tbody>
                {sortedData.map((cast) => (
                  <tr
                    key={cast.id}
                    className="hover:opacity-80 cursor-pointer"
                    style={{ backgroundColor: cast.storeColor || '#fef3c7' }}
                    onClick={() => setSelectedCast(cast)}
                  >
                    {/* チェックボックス */}
                    <td className="border border-gray-300 p-0 text-center" onClick={(e) => e.stopPropagation()}>
                      <div className="flex items-center justify-center h-full">
                        <input
                          type="checkbox"
                          className="w-3 h-3 accent-red-600 cursor-pointer"
                        />
                      </div>
                    </td>
                    {/* 出勤確認インジケーター */}
                    <td className="border border-gray-300 p-0 text-center">
                      <div className={`flex items-center justify-center h-full ${cast.isAttendanceConfirmed ? 'bg-green-100' : 'bg-red-100'}`}>
                        {cast.isAttendanceConfirmed ? (
                          <Check className="w-4 h-4 text-green-600" />
                        ) : (
                          <span className="text-red-600 text-[10px]">未</span>
                        )}
                      </div>
                    </td>
                    {/* 出勤ラベル */}
                    <td className="border border-gray-300 px-1 py-0.5 text-center">
                      <div className="text-black text-[10px]">出勤</div>
                    </td>
                    {/* 名前 / Girls (Item 19: 店舗背景色, Item 24: 新人マーク) */}
                    <td className="border border-gray-300 px-1 py-0.5 text-center">
                      <div className="flex flex-col items-center justify-center">
                        <div className="text-black font-bold flex items-center gap-1">
                          {cast.isNewbie && (
                            <Star className="w-3 h-3 text-yellow-500 fill-yellow-500" />
                          )}
                          {cast.name}
                        </div>
                        <div className="flex items-center justify-center gap-1 text-[10px]">
                          <span className="text-black">{cast.remark}</span>
                          {cast.achieve && (
                            <span className="text-red-600">{cast.achieve}</span>
                          )}
                        </div>
                      </div>
                    </td>
                    {/* ￥ボタン */}
                    <td className="border border-gray-300 p-0 text-center bg-blue-600">
                      <button className="w-full h-full bg-transparent hover:bg-blue-700 text-white text-xs border-0 flex items-center justify-center rounded-none">
                        ￥
                      </button>
                    </td>
                    {/* Hボタン */}
                    <td className="border border-gray-300 p-0 text-center bg-pink-200">
                      <button className="w-full h-full bg-transparent hover:bg-pink-300 text-black text-xs border-0 flex items-center justify-center rounded-none font-bold">
                        H
                      </button>
                    </td>
                    {/* 併用 */}
                    <td className="border-t border-b border-gray-300 px-1 py-0.5 text-center">
                      <div className="text-black text-[10px]">{cast.concurrent || ''}</div>
                    </td>
                    {/* 迎場所 */}
                    <td className="border-t border-b border-gray-300 px-1 py-0.5 text-center">
                      <div className="text-black text-[10px]">{cast.deliverPlace}</div>
                    </td>
                    {/* 受付 */}
                    <td className="border-t border-b border-gray-300 px-1 py-0.5 text-center">
                      <div className="text-black">{cast.startTime}</div>
                    </td>
                    {/* 終了 */}
                    <td className="border-t border-b border-gray-300 px-1 py-0.5 text-center">
                      <div className="text-black">{cast.endTime}</div>
                    </td>
                    {/* 帰宅 */}
                    <td className="border-t border-b border-gray-300 px-1 py-0.5 text-center">
                      <div className="text-black">{cast.homeTime}</div>
                    </td>
                    {/* 送場所 */}
                    <td className="border-t border-b border-gray-300 px-1 py-0.5 text-center">
                      <div className="text-black text-[10px]">{cast.deliverPlace}</div>
                    </td>
                    {/* 実績 */}
                    <td className="border-t border-b border-gray-300 px-1 py-0.5 text-center">
                      <div className="text-black">{cast.deliverCount || ''}</div>
                    </td>
                    {/* 実績ボタン */}
                    <td className="border border-gray-300 p-0 text-center bg-pink-200">
                      <button className="w-full h-full bg-transparent hover:bg-pink-300 text-black text-xs border-0 flex items-center justify-center rounded-none">
                        ✱
                      </button>
                    </td>
                    {/* 最終接客 */}
                    <td className="border border-gray-300 px-1 py-0.5 text-center">
                      <div className="flex items-center justify-center gap-2">
                        <div className="text-black">{cast.finalCustomer}</div>
                        <div className="text-red-600">{cast.homeTime}</div>
                      </div>
                    </td>
                    {/* 最終接客ボタン */}
                    <td className={`border border-gray-300 p-0 text-center ${cast.finalCustomer ? 'bg-green-700' : ''}`}>
                      {cast.finalCustomer && (
                        <button className="w-full h-full bg-transparent hover:bg-green-800 text-white text-xs border-0 flex items-center justify-center rounded-none">
                          <ChevronLeft className="w-3 h-3" strokeWidth={3} />
                        </button>
                      )}
                    </td>
                    {/* 接客中 */}
                    <td className="border border-gray-300 px-1 py-0.5 text-center">
                      <div className="flex items-center justify-center gap-2">
                        <div className="text-black">{cast.nowCustomer || "待機中"}</div>
                        <div className="text-red-600">{cast.homeTime}</div>
                      </div>
                    </td>
                    {/* 接客中ボタン */}
                    <td className={`border border-gray-300 p-0 text-center ${cast.nowCustomer ? 'bg-green-700' : ''}`}>
                      {cast.nowCustomer && (
                        <button className="w-full h-full bg-transparent hover:bg-green-800 text-white text-xs border-0 flex items-center justify-center rounded-none">
                          <ChevronLeft className="w-3 h-3" strokeWidth={3} />
                        </button>
                      )}
                    </td>
                    {/* INドライバー稼働中 */}
                    <td className="border border-gray-300 px-1 py-0.5 text-center">
                      <div className="flex items-center justify-center gap-2">
                        <div className="text-black">{cast.nowCustomer || cast.deliverPlace}</div>
                        {cast.inDriverMoving && (
                          <div className="text-red-600">{cast.inDriverMoving}</div>
                        )}
                      </div>
                    </td>
                    {/* INドライバー稼働中ボタン */}
                    <td className={`border border-gray-300 p-0 text-center ${(cast.nowCustomer || cast.deliverPlace) ? 'bg-green-700' : ''}`}>
                      {(cast.nowCustomer || cast.deliverPlace) && (
                        <button className="w-full h-full bg-transparent hover:bg-green-800 text-white text-xs border-0 flex items-center justify-center rounded-none">
                          <ChevronLeft className="w-3 h-3" strokeWidth={3} />
                        </button>
                      )}
                    </td>
                    {/* 予約1 */}
                    <td className="border border-gray-300 px-1 py-0.5 text-center">
                      {cast.next1 && (
                        <div className="flex items-center justify-center gap-2">
                          <div className="text-black">{cast.next1.split(' ')[1] || cast.next1}</div>
                          <div className="text-red-600">{cast.next1.split(' ')[0] || ''}</div>
                        </div>
                      )}
                    </td>
                    {/* 予約1ボタン */}
                    <td className={`border border-gray-300 p-0 text-center ${cast.next1 ? 'bg-green-700' : ''}`}>
                      {cast.next1 && (
                        <button className="w-full h-full bg-transparent hover:bg-green-800 text-white text-xs border-0 flex items-center justify-center rounded-none">
                          <ChevronLeft className="w-3 h-3" strokeWidth={3} />
                        </button>
                      )}
                    </td>
                    {/* 予約2 */}
                    <td className="border border-gray-300 px-1 py-0.5 text-center">
                      {cast.next2 && (
                        <div className="flex items-center justify-center gap-2">
                          <div className="text-black">{cast.next2.split(' ')[1] || cast.next2}</div>
                          <div className="text-red-600">{cast.next2.split(' ')[0] || ''}</div>
                        </div>
                      )}
                    </td>
                    {/* 予約2ボタン */}
                    <td className={`border border-gray-300 p-0 text-center ${cast.next2 ? 'bg-green-700' : ''}`}>
                      {cast.next2 && (
                        <button className="w-full h-full bg-transparent hover:bg-green-800 text-white text-xs border-0 flex items-center justify-center rounded-none">
                          <ChevronLeft className="w-3 h-3" strokeWidth={3} />
                        </button>
                      )}
                    </td>
                    {/* 予約3 */}
                    <td className="border border-gray-300 px-1 py-0.5 text-center">
                      {cast.next3 && (
                        <div className="flex items-center justify-center gap-2">
                          <div className="text-black">{cast.next3.split(' ')[1] || cast.next3}</div>
                          <div className="text-red-600">{cast.next3.split(' ')[0] || ''}</div>
                        </div>
                      )}
                    </td>
                    {/* 予約3ボタン */}
                    <td className={`border border-gray-300 p-0 text-center ${cast.next3 ? 'bg-green-700' : ''}`}>
                      {cast.next3 && (
                        <button className="w-full h-full bg-transparent hover:bg-green-800 text-white text-xs border-0 flex items-center justify-center rounded-none">
                          <ChevronLeft className="w-3 h-3" strokeWidth={3} />
                        </button>
                      )}
                    </td>
                    {/* 予約4 */}
                    <td className="border border-gray-300 px-1 py-0.5 text-center">
                      {cast.next4 && (
                        <div className="flex items-center justify-center gap-2">
                          <div className="text-black">{cast.next4.split(' ')[1] || cast.next4}</div>
                          <div className="text-red-600">{cast.next4.split(' ')[0] || ''}</div>
                        </div>
                      )}
                    </td>
                    {/* 予約4ボタン */}
                    <td className={`border border-gray-300 p-0 text-center ${cast.next4 ? 'bg-green-700' : ''}`}>
                      {cast.next4 && (
                        <button className="w-full h-full bg-transparent hover:bg-green-800 text-white text-xs border-0 flex items-center justify-center rounded-none">
                          <ChevronLeft className="w-3 h-3" strokeWidth={3} />
                        </button>
                      )}
                    </td>
                    {/* 予約5 */}
                    <td className="border border-gray-300 px-1 py-0.5 text-center">
                      {cast.next5 && (
                        <div className="flex items-center justify-center gap-2">
                          <div className="text-black">{cast.next5.split(' ')[1] || cast.next5}</div>
                          <div className="text-red-600">{cast.next5.split(' ')[0] || ''}</div>
                        </div>
                      )}
                    </td>
                    {/* 予約5ボタン */}
                    <td className={`border border-gray-300 p-0 text-center ${cast.next5 ? 'bg-green-700' : ''}`}>
                      {cast.next5 && (
                        <button className="w-full h-full bg-transparent hover:bg-green-800 text-white text-xs border-0 flex items-center justify-center rounded-none">
                          <ChevronLeft className="w-3 h-3" strokeWidth={3} />
                        </button>
                      )}
                    </td>
                    {/* 出勤値客 */}
                    <td className="border border-gray-300 px-1 py-0.5 text-center">
                      <div className="text-black">{cast.special}</div>
                    </td>
                    {/* 特記事項 */}
                    <td className="border border-gray-300 px-1 py-0.5 text-center">
                      <div className="text-black">{cast.remark}</div>
                    </td>
                    {/* ホステスNG場所 */}
                    <td className="border border-gray-300 px-1 py-0.5 text-center">
                      <div className="text-red-600">{cast.ngPlace}</div>
                    </td>
                    {/* 待ち時間 */}
                    <td className="border border-gray-300 px-1 py-0.5 text-center">
                      <div className="text-black">{cast.waitTime}</div>
                    </td>
                    {/* web状態 */}
                    <td className="border border-gray-300 px-1 py-0.5 text-center">
                      <div className={cast.webStatus === "オンライン" ? "text-green-600" : "text-red-600"}>{cast.webStatus}</div>
                    </td>
                    {/* mode */}
                    <td className="border border-gray-300 px-1 py-0.5 text-center">
                      <div className={cast.mode === "自動" ? "text-blue-600" : "text-orange-600"}>{cast.mode}</div>
                    </td>
                    {/* 登録ボタン */}
                    <td className="border border-gray-300 p-0 text-center">
                      <button className="w-full h-full bg-gray-100 hover:bg-gray-200 text-black text-[10px] border-0 flex items-center justify-center rounded-none px-1 py-0.5">
                        上記の時間を登録
                      </button>
                    </td>
                    {/* 順位 */}
                    <td className="border border-gray-300 px-1 py-0.5 text-center">
                      <div className="text-black font-bold">{cast.ranking}</div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
      </div>

      {/* キャスト詳細ポップアップ (Item 22) */}
      <Dialog open={!!selectedCast} onOpenChange={(open) => !open && setSelectedCast(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              {selectedCast?.isNewbie && (
                <Star className="w-5 h-5 text-yellow-500 fill-yellow-500" />
              )}
              {selectedCast?.name}
              <span className="text-sm font-normal text-gray-500">
                ({selectedCast?.store})
              </span>
            </DialogTitle>
          </DialogHeader>
          {selectedCast && (
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="space-y-2">
                <div className="flex justify-between border-b pb-1">
                  <span className="text-gray-600">勤務形態:</span>
                  <span className="font-medium">{selectedCast.workStyle || '-'}</span>
                </div>
                <div className="flex justify-between border-b pb-1">
                  <span className="text-gray-600">担当者:</span>
                  <span className="font-medium">{selectedCast.manager || '-'}</span>
                </div>
                <div className="flex justify-between border-b pb-1">
                  <span className="text-gray-600">カテゴリー:</span>
                  <span className="font-medium">{selectedCast.remark}</span>
                </div>
                <div className="flex justify-between border-b pb-1">
                  <span className="text-gray-600">順位:</span>
                  <span className="font-medium">{selectedCast.ranking}</span>
                </div>
                <div className="flex justify-between border-b pb-1">
                  <span className="text-gray-600">出勤時間:</span>
                  <span className="font-medium">{selectedCast.startTime}</span>
                </div>
                <div className="flex justify-between border-b pb-1">
                  <span className="text-gray-600">終了時間:</span>
                  <span className="font-medium">{selectedCast.endTime}</span>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between border-b pb-1">
                  <span className="text-gray-600">帰宅時間:</span>
                  <span className="font-medium">{selectedCast.homeTime}</span>
                </div>
                <div className="flex justify-between border-b pb-1">
                  <span className="text-gray-600">待ち時間:</span>
                  <span className="font-medium">{selectedCast.waitTime}</span>
                </div>
                <div className="flex justify-between border-b pb-1">
                  <span className="text-gray-600">web状態:</span>
                  <span className={`font-medium ${selectedCast.webStatus === 'オンライン' ? 'text-green-600' : 'text-red-600'}`}>
                    {selectedCast.webStatus}
                  </span>
                </div>
                <div className="flex justify-between border-b pb-1">
                  <span className="text-gray-600">モード:</span>
                  <span className={`font-medium ${selectedCast.mode === '自動' ? 'text-blue-600' : 'text-orange-600'}`}>
                    {selectedCast.mode}
                  </span>
                </div>
                <div className="flex justify-between border-b pb-1">
                  <span className="text-gray-600">実績:</span>
                  <span className="font-medium">{selectedCast.achieve}</span>
                </div>
                <div className="flex justify-between border-b pb-1">
                  <span className="text-gray-600">NG場所:</span>
                  <span className="font-medium text-red-600">{selectedCast.ngPlace || '-'}</span>
                </div>
              </div>
              {/* 週間備考 (Item 21) */}
              {selectedCast.weeklyRemarks && (
                <div className="col-span-2 mt-2">
                  <div className="text-gray-600 mb-1">週間備考:</div>
                  <div className="bg-yellow-50 border border-yellow-200 rounded p-2 text-sm">
                    {selectedCast.weeklyRemarks}
                  </div>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
