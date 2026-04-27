'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ArrowLeft, Fuel, Leaf, TrendingDown } from "lucide-react";

type EcoEntry = {
  id: number;
  driverName: string;
  vehicleNumber: string;
  date: string;
  distance: number;
  fuelLiters: number;
  ecoScore: number;
};

const initialEntries: EcoEntry[] = [
  { id: 1, driverName: '松尾', vehicleNumber: '京都 500 あ 12-34', date: '2026-04-25', distance: 142, fuelLiters: 11.2, ecoScore: 88 },
  { id: 2, driverName: '山田', vehicleNumber: '京都 500 あ 56-78', date: '2026-04-25', distance: 98, fuelLiters: 8.7, ecoScore: 75 },
  { id: 3, driverName: '田中', vehicleNumber: '京都 500 あ 90-12', date: '2026-04-25', distance: 167, fuelLiters: 13.4, ecoScore: 92 },
  { id: 4, driverName: '佐藤', vehicleNumber: '京都 500 あ 34-56', date: '2026-04-25', distance: 121, fuelLiters: 10.5, ecoScore: 68 },
  { id: 5, driverName: '高橋', vehicleNumber: '京都 500 あ 78-90', date: '2026-04-24', distance: 154, fuelLiters: 12.1, ecoScore: 81 },
];

export default function FuelEcoManagement() {
  const [entries] = useState<EcoEntry[]>(initialEntries);
  const [filter, setFilter] = useState('');

  React.useEffect(() => {
    document.title = '燃料・エコ手当管理 - Dispatch Harmony Hub';
  }, []);

  const filtered = entries.filter(
    (e) => !filter || e.driverName.includes(filter) || e.vehicleNumber.includes(filter)
  );

  const totalDistance = filtered.reduce((s, e) => s + e.distance, 0);
  const totalFuel = filtered.reduce((s, e) => s + e.fuelLiters, 0);
  const avgEco = filtered.length
    ? Math.round(filtered.reduce((s, e) => s + e.ecoScore, 0) / filtered.length)
    : 0;
  const avgKmPerL = totalFuel ? (totalDistance / totalFuel).toFixed(2) : '0';

  const getEcoColor = (score: number) => {
    if (score >= 85) return 'text-emerald-600 bg-emerald-50 border-emerald-300';
    if (score >= 70) return 'text-amber-600 bg-amber-50 border-amber-300';
    return 'text-rose-600 bg-rose-50 border-rose-300';
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <div className="mb-4">
        <Link href="/dashboard">
          <Button variant="outline" className="flex items-center gap-2">
            <ArrowLeft className="w-4 h-4" />
            ダッシュボードに戻る
          </Button>
        </Link>
      </div>

      <Card className="mb-4">
        <CardHeader>
          <div className="flex items-center gap-3">
            <Fuel className="w-6 h-6 text-emerald-600" />
            <h1 className="text-2xl font-bold">燃料・エコ手当管理</h1>
          </div>
        </CardHeader>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-3 mb-4">
        <Card>
          <CardContent className="p-4">
            <div className="text-xs text-zinc-500">走行距離合計</div>
            <div className="text-2xl font-bold">{totalDistance} km</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-xs text-zinc-500">給油量合計</div>
            <div className="text-2xl font-bold">{totalFuel.toFixed(1)} L</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-xs text-zinc-500">平均燃費</div>
            <div className="text-2xl font-bold flex items-center gap-1">
              <TrendingDown className="w-5 h-5 text-emerald-600" />
              {avgKmPerL} km/L
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-xs text-zinc-500">平均エコスコア</div>
            <div className="text-2xl font-bold flex items-center gap-1">
              <Leaf className="w-5 h-5 text-emerald-600" />
              {avgEco}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardContent className="p-4">
          <div className="flex items-center gap-2 mb-3">
            <Input
              placeholder="ドライバー名 / 車両番号で絞り込み"
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="max-w-md"
            />
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-zinc-100 border-y border-zinc-300">
                <tr className="text-left">
                  <th className="px-3 py-2 font-bold">日付</th>
                  <th className="px-3 py-2 font-bold">ドライバー</th>
                  <th className="px-3 py-2 font-bold">車両番号</th>
                  <th className="px-3 py-2 font-bold text-right">走行距離(km)</th>
                  <th className="px-3 py-2 font-bold text-right">給油量(L)</th>
                  <th className="px-3 py-2 font-bold text-right">燃費(km/L)</th>
                  <th className="px-3 py-2 font-bold text-center">エコスコア</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((e) => (
                  <tr key={e.id} className="border-b border-zinc-200 hover:bg-zinc-50">
                    <td className="px-3 py-2">{e.date}</td>
                    <td className="px-3 py-2 font-medium">{e.driverName}</td>
                    <td className="px-3 py-2 text-zinc-600">{e.vehicleNumber}</td>
                    <td className="px-3 py-2 text-right">{e.distance}</td>
                    <td className="px-3 py-2 text-right">{e.fuelLiters.toFixed(1)}</td>
                    <td className="px-3 py-2 text-right font-medium">
                      {(e.distance / e.fuelLiters).toFixed(2)}
                    </td>
                    <td className="px-3 py-2 text-center">
                      <span
                        className={`inline-block px-2 py-0.5 rounded border text-xs font-bold ${getEcoColor(e.ecoScore)}`}
                      >
                        {e.ecoScore}
                      </span>
                    </td>
                  </tr>
                ))}
                {filtered.length === 0 && (
                  <tr>
                    <td colSpan={7} className="px-3 py-8 text-center text-zinc-400">
                      該当データなし
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
