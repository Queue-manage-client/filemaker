'use client';

import React, { useMemo, useState } from 'react';
import Link from 'next/link';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Hotel, Heart, Building, Camera, CameraOff, MapPin, Plus, Star } from "lucide-react";
import { hotelDivisionSampleData } from '@/data/hotelDivisionSampleData';
import type { HotelDivision } from '@/types/hotel-division';

export default function HotelPage() {
  React.useEffect(() => {
    document.title = 'ホテル区分管理 - Dispatch Harmony Hub';
  }, []);

  const formatPostalCode = (code: string) => {
    return code.replace(/(\d{3})(\d{4})/, '$1-$2');
  };

  const loveHotelCount = hotelDivisionSampleData.filter(item => item.type === 'ラブホテル').length;
  const cityHotelCount = hotelDivisionSampleData.filter(item => item.type === 'シティホテル').length;
  const withImageCount = hotelDivisionSampleData.filter(item => item.hotelImage === 'あり').length;
  const firstGuidanceCount = hotelDivisionSampleData.filter(item => item.isFirstGuidance === true).length;

  // 絞り込み用の状態
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [typeFilter, setTypeFilter] = useState<'すべて' | 'ラブホテル' | 'シティホテル'>('すべて');
  const [areaFilter, setAreaFilter] = useState<string>('すべて');

  // 選択肢（サンプルデータから抽出）
  const areaOptions = useMemo(() => {
    const areas = new Set<string>();
    hotelDivisionSampleData.forEach(h => areas.add(h.areaCategory));
    return ['すべて', ...Array.from(areas).sort()];
  }, []);

  // フィルター済みデータ（50音順）
  const filteredHotels = useMemo(() => {
    const collator = new Intl.Collator('ja', { sensitivity: 'base' });
    const result = hotelDivisionSampleData.filter((item) => {
      if (typeFilter !== 'すべて' && item.type !== typeFilter) return false;
      if (areaFilter !== 'すべて' && item.areaCategory !== areaFilter) return false;

      if (searchQuery.trim() !== '') {
        const q = searchQuery.trim().toLowerCase();
        const haystack = `${item.hotelName} ${item.areaCategory} ${item.firstTwoChars}`.toLowerCase();
        if (!haystack.includes(q)) return false;
      }
      return true;
    });

    // 50音順（ひらがな頭2文字）でソート
    return result.sort((a, b) => collator.compare(a.firstTwoChars, b.firstTwoChars));
  }, [typeFilter, areaFilter, searchQuery]);

  const clearFilters = () => {
    setSearchQuery('');
    setTypeFilter('すべて');
    setAreaFilter('すべて');
  };

  const formatFee = (value: number | undefined): string => {
    if (typeof value !== 'number') return '-';
    return `¥${value.toLocaleString()}`;
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      {/* 戻るボタン */}
      <div className="mb-4">
        <Link href="/dashboard">
          <Button variant="outline" className="flex items-center gap-2">
            <ArrowLeft className="w-4 h-4" />
            ダッシュボードに戻る
          </Button>
        </Link>
      </div>

      {/* ヘッダー */}
      <Card className="mb-6">
        <CardHeader>
          <div className="flex items-center gap-3">
            <Hotel className="w-6 h-6" />
            <div>
              <CardTitle className="text-2xl">ホテル区分管理</CardTitle>
              <p className="text-muted-foreground mt-1">
                ホテルの詳細情報を管理します
              </p>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* 統計情報 */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Heart className="w-5 h-5 text-pink-600" />
              <div>
                <p className="text-sm font-medium text-muted-foreground">ラブホテル</p>
                <p className="text-2xl font-bold">{loveHotelCount}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Building className="w-5 h-5 text-blue-600" />
              <div>
                <p className="text-sm font-medium text-muted-foreground">シティホテル</p>
                <p className="text-2xl font-bold">{cityHotelCount}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Camera className="w-5 h-5 text-green-600" />
              <div>
                <p className="text-sm font-medium text-muted-foreground">画像あり</p>
                <p className="text-2xl font-bold">{withImageCount}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Star className="w-5 h-5 text-yellow-500" />
              <div>
                <p className="text-sm font-medium text-muted-foreground">初案内ホテル</p>
                <p className="text-2xl font-bold">{firstGuidanceCount}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* データテーブル */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>ホテル区分一覧</CardTitle>
            <Button
              onClick={() => {
                try {
                  window.open('/hotel/new', 'hotel-new', 'width=900,height=800,noopener,noreferrer');
                } catch {
                  // UI_001: 新規ウィンドウを開けませんでした
                }
              }}
              className="flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              項目の追加
            </Button>
          </div>

          {/* 検索・絞り込み */}
          <div className="mt-4 grid grid-cols-1 md:grid-cols-4 gap-3">
            <div className="md:col-span-2">
              <Input
                placeholder="ホテル名・地域で検索"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div>
              <select
                className="w-full border rounded-md px-3 py-2 bg-white"
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value as 'すべて' | 'ラブホテル' | 'シティホテル')}
              >
                <option value="すべて">区分: すべて</option>
                <option value="ラブホテル">ラブホテル</option>
                <option value="シティホテル">シティホテル</option>
              </select>
            </div>
            <div>
              <select
                className="w-full border rounded-md px-3 py-2 bg-white"
                value={areaFilter}
                onChange={(e) => setAreaFilter(e.target.value)}
              >
                {areaOptions.map(opt => (
                  <option key={opt} value={opt}>{opt === 'すべて' ? '地域: すべて' : opt}</option>
                ))}
              </select>
            </div>
            <div className="md:col-span-4 flex justify-end">
              <Button variant="outline" onClick={clearFilters}>条件クリア</Button>
            </div>
          </div>
        </CardHeader>

        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>初案内</TableHead>
                  <TableHead>区分</TableHead>
                  <TableHead>頭2文字</TableHead>
                  <TableHead>ホテル名</TableHead>
                  <TableHead>地域区分</TableHead>
                  <TableHead>電話番号</TableHead>
                  <TableHead>独り入室</TableHead>
                  <TableHead>休憩料金</TableHead>
                  <TableHead>宿泊料金</TableHead>
                  <TableHead>フリータイム</TableHead>
                  <TableHead>駐車場</TableHead>
                  <TableHead>派遣条件</TableHead>
                  <TableHead>郵便番号</TableHead>
                  <TableHead>住所</TableHead>
                  <TableHead>画像</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredHotels.map((item: HotelDivision) => (
                  <TableRow key={item.no}>
                    <TableCell>
                      {item.isFirstGuidance === true && (
                        <Badge className="bg-yellow-100 text-yellow-800 border border-yellow-300 flex items-center gap-1 whitespace-nowrap">
                          <Star className="w-3 h-3" />
                          初案内
                        </Badge>
                      )}
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={item.type === 'ラブホテル' ? 'destructive' : 'default'}
                        className="flex items-center gap-1 whitespace-nowrap"
                      >
                        {item.type === 'ラブホテル' ? (
                          <Heart className="w-3 h-3" />
                        ) : (
                          <Building className="w-3 h-3" />
                        )}
                        {item.type}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-sm font-mono text-muted-foreground">
                      {item.firstTwoChars}
                    </TableCell>
                    <TableCell className="font-medium whitespace-nowrap">{item.hotelName}</TableCell>
                    <TableCell>
                      <Badge variant="outline">{item.areaCategory}</Badge>
                    </TableCell>
                    <TableCell className="text-sm font-mono whitespace-nowrap">
                      {item.phoneNumber}
                    </TableCell>
                    <TableCell>
                      <Badge variant={item.singleRoomEntry === '可能' ? 'secondary' : 'outline'}>
                        {item.singleRoomEntry}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right font-mono whitespace-nowrap">
                      {formatFee(item.restFee)}
                    </TableCell>
                    <TableCell className="text-right font-mono whitespace-nowrap">
                      {formatFee(item.stayFee)}
                    </TableCell>
                    <TableCell className="text-right font-mono whitespace-nowrap">
                      {formatFee(item.freeTimeFee)}
                    </TableCell>
                    <TableCell>
                      {item.hasParking !== undefined ? (
                        <Badge variant={item.hasParking === 'あり' ? 'secondary' : 'outline'}>
                          {item.hasParking}
                        </Badge>
                      ) : (
                        <span className="text-muted-foreground">-</span>
                      )}
                    </TableCell>
                    <TableCell>
                      {item.dispatchCondition === 'possible' && (
                        <Badge className="bg-green-100 text-green-800 border border-green-300 whitespace-nowrap">
                          可能
                        </Badge>
                      )}
                      {item.dispatchCondition === 'impossible' && (
                        <div className="flex flex-col gap-1">
                          <Badge className="bg-red-100 text-red-800 border border-red-300 whitespace-nowrap">
                            不可
                          </Badge>
                          {item.conditionNote && (
                            <span className="text-xs text-red-600">{item.conditionNote}</span>
                          )}
                        </div>
                      )}
                      {item.dispatchCondition === 'conditional' && (
                        <div className="flex flex-col gap-1">
                          <Badge className="bg-yellow-100 text-yellow-800 border border-yellow-300 whitespace-nowrap">
                            条件付き
                          </Badge>
                          {item.conditionNote && (
                            <span className="text-xs text-yellow-700">{item.conditionNote}</span>
                          )}
                        </div>
                      )}
                      {item.dispatchCondition === undefined && (
                        <span className="text-muted-foreground">-</span>
                      )}
                    </TableCell>
                    <TableCell className="flex items-center gap-1 whitespace-nowrap">
                      <MapPin className="w-3 h-3 text-muted-foreground" />
                      <span className="text-sm font-mono">
                        {formatPostalCode(item.postalCode)}
                      </span>
                    </TableCell>
                    <TableCell className="max-w-xs truncate" title={item.address}>
                      {item.address}
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={item.hotelImage === 'あり' ? 'default' : 'outline'}
                        className="flex items-center gap-1"
                      >
                        {item.hotelImage === 'あり' ? (
                          <Camera className="w-3 h-3" />
                        ) : (
                          <CameraOff className="w-3 h-3" />
                        )}
                        {item.hotelImage}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
