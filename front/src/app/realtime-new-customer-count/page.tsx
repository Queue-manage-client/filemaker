'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { ArrowLeft, Users, TrendingUp, Clock } from "lucide-react";

type NewCustomerEntry = {
  id: number;
  timeSlot: string;
  storeName: string;
  count: number;
  trend: 'up' | 'down' | 'flat';
};

const initialData: NewCustomerEntry[] = [
  { id: 1, timeSlot: '18:00-19:00', storeName: '京都デリヘル倶楽部', count: 3, trend: 'up' },
  { id: 2, timeSlot: '18:00-19:00', storeName: '京都ホテヘル倶楽部', count: 1, trend: 'flat' },
  { id: 3, timeSlot: '18:00-19:00', storeName: '滋賀DCP', count: 0, trend: 'down' },
  { id: 4, timeSlot: '19:00-20:00', storeName: '京都デリヘル倶楽部', count: 5, trend: 'up' },
  { id: 5, timeSlot: '19:00-20:00', storeName: '京都ホテヘル倶楽部', count: 2, trend: 'up' },
  { id: 6, timeSlot: '19:00-20:00', storeName: '滋賀DCP', count: 1, trend: 'up' },
  { id: 7, timeSlot: '20:00-21:00', storeName: '京都デリヘル倶楽部', count: 7, trend: 'up' },
  { id: 8, timeSlot: '20:00-21:00', storeName: '京都ホテヘル倶楽部', count: 3, trend: 'up' },
  { id: 9, timeSlot: '20:00-21:00', storeName: '滋賀DCP', count: 2, trend: 'up' },
  { id: 10, timeSlot: '21:00-22:00', storeName: '京都デリヘル倶楽部', count: 9, trend: 'up' },
  { id: 11, timeSlot: '21:00-22:00', storeName: '京都ホテヘル倶楽部', count: 4, trend: 'flat' },
  { id: 12, timeSlot: '21:00-22:00', storeName: '滋賀DCP', count: 3, trend: 'up' },
];

export default function RealtimeNewCustomerCountPage() {
  const [data, setData] = useState<NewCustomerEntry[]>(initialData);
  const [now, setNow] = useState(new Date());

  useEffect(() => {
    document.title = 'リアルタイム新規入客件数 - Dispatch Harmony Hub';
    const timer = setInterval(() => setNow(new Date()), 30000);
    return () => clearInterval(timer);
  }, []);

  const totalCount = data.reduce((s, e) => s + e.count, 0);
  const stores = Array.from(new Set(data.map((e) => e.storeName)));
  const timeSlots = Array.from(new Set(data.map((e) => e.timeSlot)));
  const storeTotals = stores.map((store) => ({
    name: store,
    total: data.filter((e) => e.storeName === store).reduce((s, e) => s + e.count, 0),
  }));

  const maxCount = Math.max(...data.map((e) => e.count), 1);
  const heatColor = (count: number) => {
    if (count === 0) return 'bg-zinc-100 text-zinc-400';
    const ratio = count / maxCount;
    if (ratio >= 0.75) return 'bg-rose-200 text-rose-900 font-bold';
    if (ratio >= 0.5) return 'bg-amber-200 text-amber-900 font-bold';
    if (ratio >= 0.25) return 'bg-yellow-100 text-yellow-800';
    return 'bg-emerald-50 text-emerald-700';
  };

  const trendIcon = (t: NewCustomerEntry['trend']) => {
    if (t === 'up') return <span className="text-rose-500">▲</span>;
    if (t === 'down') return <span className="text-blue-500">▼</span>;
    return <span className="text-zinc-400">─</span>;
  };

  const handleAdd = (storeName: string, timeSlot: string) => {
    setData((prev) => {
      const idx = prev.findIndex((e) => e.storeName === storeName && e.timeSlot === timeSlot);
      if (idx >= 0) {
        return prev.map((e, i) => (i === idx ? { ...e, count: e.count + 1, trend: 'up' as const } : e));
      }
      return [...prev, { id: prev.length + 1, storeName, timeSlot, count: 1, trend: 'up' }];
    });
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <div className="mb-4 flex items-center gap-2">
        <Link href="/dashboard">
          <Button variant="outline" className="flex items-center gap-2">
            <ArrowLeft className="w-4 h-4" />
            ダッシュボードに戻る
          </Button>
        </Link>
        <span className="text-xs text-zinc-500 ml-2">
          最終更新: {now.toLocaleTimeString('ja-JP')}
        </span>
      </div>

      <Card className="mb-4">
        <CardHeader>
          <div className="flex items-center gap-3">
            <Users className="w-6 h-6 text-blue-600" />
            <h1 className="text-2xl font-bold">リアルタイム新規入客件数</h1>
          </div>
        </CardHeader>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-3 mb-4">
        <Card>
          <CardContent className="p-4">
            <div className="text-xs text-zinc-500">本日の総新規入客数</div>
            <div className="text-3xl font-bold text-blue-600 flex items-center gap-1">
              <TrendingUp className="w-6 h-6" />
              {totalCount} 件
            </div>
          </CardContent>
        </Card>
        {storeTotals.map((s) => (
          <Card key={s.name}>
            <CardContent className="p-4">
              <div className="text-xs text-zinc-500 truncate">{s.name}</div>
              <div className="text-3xl font-bold">{s.total} 件</div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardContent className="p-4">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-lg font-bold flex items-center gap-2">
              <Clock className="w-5 h-5 text-zinc-500" />
              時間帯×店舗別ヒートマップ
            </h2>
            <div className="text-xs text-zinc-500">
              色: 緑(少ない) → 黄 → 橙 → 赤(多い)
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-zinc-100 border-y border-zinc-300">
                  <th className="px-3 py-2 text-left font-bold">時間帯</th>
                  {stores.map((s) => (
                    <th key={s} className="px-3 py-2 font-bold">{s}</th>
                  ))}
                  <th className="px-3 py-2 font-bold">合計</th>
                </tr>
              </thead>
              <tbody>
                {timeSlots.map((slot) => {
                  const rowTotal = data
                    .filter((e) => e.timeSlot === slot)
                    .reduce((s, e) => s + e.count, 0);
                  return (
                    <tr key={slot} className="border-b border-zinc-200">
                      <td className="px-3 py-2 font-medium">{slot}</td>
                      {stores.map((store) => {
                        const entry = data.find(
                          (e) => e.storeName === store && e.timeSlot === slot
                        );
                        const count = entry?.count ?? 0;
                        return (
                          <td key={store} className="px-1 py-1">
                            <button
                              type="button"
                              onClick={() => handleAdd(store, slot)}
                              className={`w-full px-3 py-2 rounded text-center transition ${heatColor(count)} hover:ring-2 hover:ring-blue-400`}
                              title="クリックで+1"
                            >
                              <div className="text-lg">{count}</div>
                              <div className="text-[10px]">{entry ? trendIcon(entry.trend) : ''}</div>
                            </button>
                          </td>
                        );
                      })}
                      <td className="px-3 py-2 text-center font-bold bg-zinc-50">{rowTotal}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          <p className="text-xs text-zinc-500 mt-3">
            ※ セルをクリックで件数を+1できます (デモ動作)。30秒間隔で更新時刻を表示。
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
