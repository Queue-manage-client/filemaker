'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ArrowLeft, TrendingUp, BarChart3, ExternalLink } from "lucide-react";

// データ型定義（分離）
interface LocationData {
  id: number;
  storeName: string;
  year: number;
  month: number;
  storeSales: number;
  cardSales: number;
  salesCount: number;
  homeCount: number;
  loveHotelCount: number;
  cityHotelCount: number;
  localCount: number;
  southICCount: number;
  yamashinaCount: number;
  gionCount: number;
  kyotoStationCount: number;
  cityCenterCount: number;
  otherCount: number;
  shigaCount: number;
  no: number;
}

// サンプルデータ
const locationSampleData: LocationData[] = [
  {
    id: 1,
    storeName: "店舗A",
    year: 2024,
    month: 1,
    storeSales: 150000,
    cardSales: 120000,
    salesCount: 45,
    homeCount: 10,
    loveHotelCount: 5,
    cityHotelCount: 8,
    localCount: 15,
    southICCount: 3,
    yamashinaCount: 2,
    gionCount: 1,
    kyotoStationCount: 4,
    cityCenterCount: 6,
    otherCount: 2,
    shigaCount: 1,
    no: 1
  },
  {
    id: 2,
    storeName: "店舗B",
    year: 2024,
    month: 1,
    storeSales: 200000,
    cardSales: 180000,
    salesCount: 62,
    homeCount: 12,
    loveHotelCount: 8,
    cityHotelCount: 10,
    localCount: 20,
    southICCount: 5,
    yamashinaCount: 3,
    gionCount: 2,
    kyotoStationCount: 6,
    cityCenterCount: 8,
    otherCount: 3,
    shigaCount: 2,
    no: 2
  },
  {
    id: 3,
    storeName: "店舗C",
    year: 2024,
    month: 2,
    storeSales: 175000,
    cardSales: 160000,
    salesCount: 53,
    homeCount: 8,
    loveHotelCount: 6,
    cityHotelCount: 9,
    localCount: 18,
    southICCount: 4,
    yamashinaCount: 2,
    gionCount: 1,
    kyotoStationCount: 5,
    cityCenterCount: 7,
    otherCount: 2,
    shigaCount: 1,
    no: 3
  }
];

// 場所別の表コンポーネント
const LocationTable = () => {
  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-16">通し番号</TableHead>
            <TableHead>店舗名</TableHead>
            <TableHead className="w-20">西暦</TableHead>
            <TableHead className="w-16">月</TableHead>
            <TableHead className="w-24">店舗売上確定</TableHead>
            <TableHead className="w-24">カード売上確定</TableHead>
            <TableHead className="w-24">売上件数確定</TableHead>
            <TableHead className="w-16">自宅数</TableHead>
            <TableHead className="w-20">ラブホテル数</TableHead>
            <TableHead className="w-20">シティホテル数</TableHead>
            <TableHead className="w-16">地元数</TableHead>
            <TableHead className="w-16">南IC数</TableHead>
            <TableHead className="w-16">山科数</TableHead>
            <TableHead className="w-16">祇園数</TableHead>
            <TableHead className="w-20">京都駅数</TableHead>
            <TableHead className="w-20">市内中心部</TableHead>
            <TableHead className="w-16">その他</TableHead>
            <TableHead className="w-16">滋賀</TableHead>
            <TableHead className="w-16">No</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {locationSampleData.map((item) => (
            <TableRow key={item.id}>
              <TableCell>
                <Button
                  size="sm"
                  className="bg-blue-500 hover:bg-blue-600 text-white"
                  onClick={() => window.open(`/location-detail/${item.id}`, 'locationDetailWindow', 'width=800,height=600,scrollbars=yes,resizable=yes')}
                >
                  <ExternalLink className="w-3 h-3 mr-1" />
                  {item.id}
                </Button>
              </TableCell>
              <TableCell className="font-medium">{item.storeName}</TableCell>
              <TableCell>{item.year}</TableCell>
              <TableCell>{item.month}</TableCell>
              <TableCell className="text-right">¥{item.storeSales.toLocaleString()}</TableCell>
              <TableCell className="text-right">¥{item.cardSales.toLocaleString()}</TableCell>
              <TableCell className="text-right">{item.salesCount}</TableCell>
              <TableCell className="text-center">{item.homeCount}</TableCell>
              <TableCell className="text-center">{item.loveHotelCount}</TableCell>
              <TableCell className="text-center">{item.cityHotelCount}</TableCell>
              <TableCell className="text-center">{item.localCount}</TableCell>
              <TableCell className="text-center">{item.southICCount}</TableCell>
              <TableCell className="text-center">{item.yamashinaCount}</TableCell>
              <TableCell className="text-center">{item.gionCount}</TableCell>
              <TableCell className="text-center">{item.kyotoStationCount}</TableCell>
              <TableCell className="text-center">{item.cityCenterCount}</TableCell>
              <TableCell className="text-center">{item.otherCount}</TableCell>
              <TableCell className="text-center">{item.shigaCount}</TableCell>
              <TableCell className="text-center">{item.no}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default function SummaryGraph() {
  React.useEffect(() => {
    document.title = '集計・グラフ - Dispatch Harmony Hub';
  }, []);
  const [selectedTable, setSelectedTable] = useState('場所');

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      {/* 戻るボタン */}
      <div className="mb-4">
        <Link href="/dashboard">
          <Button
            variant="outline"
            className="flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            ダッシュボードに戻る
          </Button>
        </Link>
      </div>

      {/* ヘッダー */}
      <Card className="mb-4">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <TrendingUp className="w-6 h-6" />
              <h1 className="text-2xl font-bold">集計・グラフ</h1>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => window.open('/graph-summary', 'graphWindow', 'width=1200,height=800,scrollbars=yes,resizable=yes')}
              className="flex items-center gap-2"
            >
              <BarChart3 className="w-4 h-4" />
              グラフ表示
            </Button>
          </div>
        </CardHeader>
      </Card>

      {/* メインコンテンツ */}
      <Card>
        <CardContent className="p-8">
          <div className="space-y-6">
            {/* 表の種類選択ボタングループ */}
            <div className="flex flex-wrap gap-2 justify-center">
              <Button
                size="default"
                variant={selectedTable === '場所' ? 'default' : 'outline'}
                className={`flex items-center gap-2 px-3 py-2 ${selectedTable === '場所' ? 'bg-primary text-primary-foreground' : ''}`}
                onClick={() => setSelectedTable('場所')}
              >
                <span className="text-sm font-semibold">場所</span>
              </Button>

              <Button
                size="default"
                variant={selectedTable === '割引' ? 'default' : 'outline'}
                className={`flex items-center gap-2 px-3 py-2 ${selectedTable === '割引' ? 'bg-primary text-primary-foreground' : ''}`}
                onClick={() => setSelectedTable('割引')}
              >
                <span className="text-sm font-semibold">割引</span>
              </Button>

              <Button
                size="default"
                variant={selectedTable === 'コース' ? 'default' : 'outline'}
                className={`flex items-center gap-2 px-3 py-2 ${selectedTable === 'コース' ? 'bg-primary text-primary-foreground' : ''}`}
                onClick={() => setSelectedTable('コース')}
              >
                <span className="text-sm font-semibold">コース</span>
              </Button>

              <Button
                size="default"
                variant={selectedTable === '時刻' ? 'default' : 'outline'}
                className={`flex items-center gap-2 px-3 py-2 ${selectedTable === '時刻' ? 'bg-primary text-primary-foreground' : ''}`}
                onClick={() => setSelectedTable('時刻')}
              >
                <span className="text-sm font-semibold">時刻</span>
              </Button>

              <Button
                size="default"
                variant={selectedTable === '曜日' ? 'default' : 'outline'}
                className={`flex items-center gap-2 px-3 py-2 ${selectedTable === '曜日' ? 'bg-primary text-primary-foreground' : ''}`}
                onClick={() => setSelectedTable('曜日')}
              >
                <span className="text-sm font-semibold">曜日</span>
              </Button>
            </div>

            {/* 現在選択中の表示 */}
            <div className="text-center py-4">
              <p className="text-lg font-medium text-gray-700">
                現在選択中: <span className="text-primary font-bold">{selectedTable}</span>
              </p>
            </div>

            {/* 表の表示エリア */}
            <div className="bg-white rounded-lg shadow-sm">
              {selectedTable === '場所' && <LocationTable />}

              {selectedTable === '割引' && (
                <div className="text-center text-gray-500 py-8">
                  <p>割引別の表が表示されます（実装予定）</p>
                </div>
              )}

              {selectedTable === 'コース' && (
                <div className="text-center text-gray-500 py-8">
                  <p>コース別の表が表示されます（実装予定）</p>
                </div>
              )}

              {selectedTable === '時刻' && (
                <div className="text-center text-gray-500 py-8">
                  <p>時刻別の表が表示されます（実装予定）</p>
                </div>
              )}

              {selectedTable === '曜日' && (
                <div className="text-center text-gray-500 py-8">
                  <p>曜日別の表が表示されます（実装予定）</p>
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
