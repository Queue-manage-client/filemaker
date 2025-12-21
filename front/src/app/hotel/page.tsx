'use client';

import React, { useMemo, useState } from 'react';

import { useRouter } from 'next/navigation';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Hotel, Heart, Building, Camera, CameraOff, Phone, MapPin, Plus, ArrowUpDown } from "lucide-react";
import { hotelDivisionSampleData } from '@/data/hotelDivisionSampleData';
import type { HotelDivision } from '@/types/hotel-division';

export default function HotelPage() {
  const router = useRouter();

  React.useEffect(() => {
    document.title = 'ホテル区分管理 - Dispatch Harmony Hub';
  }, []);

  const formatPhoneNumber = (phone: string) => {
    // 電話番号をハイフン区切りで表示
    return phone.replace(/(\d{3})(\d{3,4})(\d{4})/, '$1-$2-$3');
  };

  const formatPostalCode = (code: string) => {
    // 郵便番号をハイフン区切りで表示
    return code.replace(/(\d{3})(\d{4})/, '$1-$2');
  };

  const loveHotelCount = hotelDivisionSampleData.filter(item => item.type === 'ラブホテル').length;
  const cityHotelCount = hotelDivisionSampleData.filter(item => item.type === 'シティホテル').length;
  const withImageCount = hotelDivisionSampleData.filter(item => item.hotelImage === 'あり').length;
  const singleRoomAvailableCount = hotelDivisionSampleData.filter(item => item.singleRoomEntry === '可能').length;

  // 絞り込み用の状態
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [typeFilter, setTypeFilter] = useState<'すべて' | 'ラブホテル' | 'シティホテル'>('すべて');
  const [areaFilter, setAreaFilter] = useState<string>('すべて');
  const [singleFilter, setSingleFilter] = useState<'すべて' | '可能' | '不可'>('すべて');
  const [imageFilter, setImageFilter] = useState<'すべて' | 'あり' | 'なし'>('すべて');
  const [minAmount, setMinAmount] = useState<string>('');
  const [maxAmount, setMaxAmount] = useState<string>('');
  const [sortKey, setSortKey] = useState<'name' | 'kana'>('name');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');

  // 選択肢（サンプルデータから抽出）
  const areaOptions = useMemo(() => {
    const set = new Set<string>();
    hotelDivisionSampleData.forEach(h => set.add(h.areaCategory));
    return ['すべて', ...Array.from(set)];
  }, []);

  // フィルター済みデータ
  const filteredHotels = useMemo(() => {
    const collator = new Intl.Collator('ja', { numeric: true, sensitivity: 'base' });
    const result = hotelDivisionSampleData.filter((item) => {
      if (typeFilter !== 'すべて' && item.type !== typeFilter) return false;
      if (areaFilter !== 'すべて' && item.areaCategory !== areaFilter) return false;
      if (singleFilter !== 'すべて' && item.singleRoomEntry !== singleFilter) return false;
      if (imageFilter !== 'すべて' && item.hotelImage !== imageFilter) return false;

      const min = minAmount === '' ? undefined : Number(minAmount);
      const max = maxAmount === '' ? undefined : Number(maxAmount);
      if (min !== undefined && !(typeof item.amount === 'number' && item.amount >= min)) return false;
      if (max !== undefined && !(typeof item.amount === 'number' && item.amount <= max)) return false;

      if (searchQuery.trim() !== '') {
        const q = searchQuery.trim().toLowerCase();
        const haystack = `${item.hotelName} ${item.address} ${item.areaCategory} ${item.firstTwoChars}`.toLowerCase();
        if (!haystack.includes(q)) return false;
      }
      return true;
    });
    return result.sort((a, b) => {
      const aKey = sortKey === 'name' ? a.hotelName : a.firstTwoChars;
      const bKey = sortKey === 'name' ? b.hotelName : b.firstTwoChars;
      return sortOrder === 'asc'
        ? collator.compare(aKey, bKey)
        : collator.compare(bKey, aKey);
    });
  }, [typeFilter, areaFilter, singleFilter, imageFilter, minAmount, maxAmount, searchQuery, sortKey, sortOrder]);

  const clearFilters = () => {
    setSearchQuery('');
    setTypeFilter('すべて');
    setAreaFilter('すべて');
    setSingleFilter('すべて');
    setImageFilter('すべて');
    setMinAmount('');
    setMaxAmount('');
  };

  const toggleNameSort = () => {
    if (sortKey === 'name') {
      setSortOrder(prev => (prev === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortKey('name');
      setSortOrder('asc');
    }
  };
  const toggleKanaSort = () => {
    if (sortKey === 'kana') {
      setSortOrder(prev => (prev === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortKey('kana');
      setSortOrder('asc');
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      {/* 戻るボタン */}
      <div className="mb-4">
        <Button
          variant="outline"
          onClick={() => router.push('/dashboard')}
          className="flex items-center gap-2"
        >
          <ArrowLeft className="w-4 h-4" />
          ダッシュボードに戻る
        </Button>
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
              <Hotel className="w-5 h-5 text-purple-600" />
              <div>
                <p className="text-sm font-medium text-muted-foreground">独り入室可</p>
                <p className="text-2xl font-bold">{singleRoomAvailableCount}</p>
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
                  window.open('/hotel/new', 'hotel-new', 'width=900,height=700,noopener,noreferrer');
                } catch (_) {
                  // UI_001: 新規ウィンドウを開けませんでした
                }
              }}
              className="flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              項目の追加
            </Button>
          </div>
          <div className="mt-4 grid grid-cols-1 md:grid-cols-6 gap-3">
            <div className="md:col-span-2">
              <Input
                placeholder="ホテル名・住所・地域で検索"
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
                  <option key={opt} value={opt}>{`地域: ${opt}`}</option>
                ))}
              </select>
            </div>
            <div>
              <select
                className="w-full border rounded-md px-3 py-2 bg-white"
                value={singleFilter}
                onChange={(e) => setSingleFilter(e.target.value as 'すべて' | '可能' | '不可')}
              >
                <option value="すべて">独り入室: すべて</option>
                <option value="可能">可能</option>
                <option value="不可">不可</option>
              </select>
            </div>
            <div>
              <select
                className="w-full border rounded-md px-3 py-2 bg-white"
                value={imageFilter}
                onChange={(e) => setImageFilter(e.target.value as 'すべて' | 'あり' | 'なし')}
              >
                <option value="すべて">画像: すべて</option>
                <option value="あり">あり</option>
                <option value="なし">なし</option>
              </select>
            </div>
            <div className="flex items-center gap-2">
              <Input
                type="number"
                placeholder="金額(最小)"
                value={minAmount}
                onChange={(e) => setMinAmount(e.target.value)}
              />
              <span className="text-muted-foreground">〜</span>
              <Input
                type="number"
                placeholder="金額(最大)"
                value={maxAmount}
                onChange={(e) => setMaxAmount(e.target.value)}
              />
            </div>
            <div className="md:col-span-6 flex justify-end">
              <Button variant="outline" onClick={clearFilters}>条件クリア</Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>区分</TableHead>
                  <TableHead>
                    <Button
                      variant="ghost"
                      className="h-8 px-2 -ml-2 flex items-center gap-1"
                      onClick={toggleKanaSort}
                    >
                      頭2文字
                      <ArrowUpDown className="w-4 h-4" />
                      {sortKey === 'kana' && (
                        <span className="text-xs text-muted-foreground">{sortOrder === 'asc' ? 'A→Z' : 'Z→A'}</span>
                      )}
                    </Button>
                  </TableHead>
                  <TableHead>
                    <Button
                      variant="ghost"
                      className="h-8 px-2 -ml-2 flex items-center gap-1"
                      onClick={toggleNameSort}
                    >
                      ホテル名
                      <ArrowUpDown className="w-4 h-4" />
                      {sortKey === 'name' && (
                        <span className="text-xs text-muted-foreground">{sortOrder === 'asc' ? 'A→Z' : 'Z→A'}</span>
                      )}
                    </Button>
                  </TableHead>
                  <TableHead>地域区分</TableHead>
                  <TableHead>電話番号</TableHead>
                  <TableHead>独り入室</TableHead>
                  <TableHead>金額</TableHead>
                  <TableHead>駅コード</TableHead>
                  <TableHead>交通費</TableHead>
                  <TableHead>郵便番号</TableHead>
                  <TableHead>住所</TableHead>
                  <TableHead>画像</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredHotels.map((item: HotelDivision) => (
                  <TableRow key={item.no}>
                    <TableCell>
                      <Badge 
                        variant={item.type === 'ラブホテル' ? 'destructive' : 'default'}
                        className="flex items-center gap-1"
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
                    <TableCell className="font-medium">{item.hotelName}</TableCell>
                    <TableCell>
                      <Badge variant="outline">{item.areaCategory}</Badge>
                    </TableCell>
                    <TableCell className="flex items-center gap-1">
                      <Phone className="w-3 h-3 text-muted-foreground" />
                      <span className="text-sm font-mono">
                        {formatPhoneNumber(item.phoneNumber)}
                      </span>
                    </TableCell>
                    <TableCell>
                      <Badge 
                        variant={item.singleRoomEntry === '可能' ? 'secondary' : 'outline'}
                      >
                        {item.singleRoomEntry}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right font-mono">
                      {typeof item.amount === 'number' ? `¥${item.amount.toLocaleString()}` : '-'}
                    </TableCell>
                    <TableCell className="text-sm font-mono text-center">
                      {item.stationCode || '-'}
                    </TableCell>
                    <TableCell className="text-right font-mono">
                      {typeof item.transportationFee === 'number' ? `¥${item.transportationFee.toLocaleString()}` : '-'}
                    </TableCell>
                    <TableCell className="flex items-center gap-1">
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
