'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowLeft, Map, Building2, Heart, Building, Search } from "lucide-react";
import { areaDivisionSampleData } from '@/data/areaDivisionSampleData';
import type { AreaDivision } from '@/types/area-division';

interface TransportFee {
  areaName: string;
  baseFee: number;
  lateNightSurcharge: number;
  notes: string;
}

const buildTransportFeeData = (): TransportFee[] =>
  areaDivisionSampleData.map((item) => ({
    areaName: item.wideArea,
    baseFee: item.defaultTransportFee ?? 500 + item.no * 100,
    lateNightSurcharge: 200 + item.no * 50,
    notes: item.areaCategory !== item.wideArea ? `${item.areaCategory}エリア` : '',
  }));

const transportFeeData: TransportFee[] = buildTransportFeeData();

// ---- 交通費設定タブ（住所検索 + 自動入力） ----

interface TransportFeeFormState {
  addressQuery: string;
  selectedAreaName: string;
  baseFee: string;
  lateNightSurcharge: string;
  notes: string;
}

const emptyForm: TransportFeeFormState = {
  addressQuery: '',
  selectedAreaName: '',
  baseFee: '',
  lateNightSurcharge: '',
  notes: '',
};

function TransportFeeTab() {
  const [form, setForm] = useState<TransportFeeFormState>(emptyForm);
  const [showSuggestions, setShowSuggestions] = useState(false);

  const suggestions = useMemo<AreaDivision[]>(() => {
    const query = form.addressQuery.trim();
    if (query.length === 0) return [];
    const lower = query.toLowerCase();
    return areaDivisionSampleData.filter(
      (item) =>
        item.wideArea.includes(query) ||
        item.areaCategory.includes(query) ||
        item.addressCity.includes(query) ||
        (item.baseAddress ?? '').includes(query) ||
        item.hiraganaReading.includes(query) ||
        item.romanReading.toLowerCase().includes(lower) ||
        (item.addressNicknames ?? []).some((n) => n.includes(query))
    );
  }, [form.addressQuery]);

  const handleAddressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm((prev) => ({
      ...prev,
      addressQuery: e.target.value,
      selectedAreaName: '',
      baseFee: '',
      lateNightSurcharge: '',
      notes: '',
    }));
    setShowSuggestions(true);
  };

  const handleSelectArea = (area: AreaDivision) => {
    const matched = transportFeeData.find((t) => t.areaName === area.wideArea);
    setForm({
      addressQuery: area.baseAddress ?? area.wideArea,
      selectedAreaName: area.wideArea,
      baseFee: String(matched?.baseFee ?? area.defaultTransportFee ?? ''),
      lateNightSurcharge: String(matched?.lateNightSurcharge ?? ''),
      notes: matched?.notes ?? '',
    });
    setShowSuggestions(false);
  };

  const handleReset = () => {
    setForm(emptyForm);
    setShowSuggestions(false);
  };

  const formatNumber = (num: number) => num.toLocaleString();

  return (
    <div className="space-y-6">
      {/* 住所から検索 */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <Search className="w-4 h-4" />
            住所から検索
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="relative max-w-md">
              <Label htmlFor="address-search" className="mb-1 block text-sm">
                住所・地域名を入力してください
              </Label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
                <Input
                  id="address-search"
                  type="text"
                  placeholder="例: 梅田、大阪市北区、minamii..."
                  value={form.addressQuery}
                  onChange={handleAddressChange}
                  onFocus={() => setShowSuggestions(true)}
                  onBlur={() => setTimeout(() => setShowSuggestions(false), 150)}
                  className="pl-9"
                  autoComplete="off"
                />
              </div>
              {showSuggestions && suggestions.length > 0 && (
                <ul className="absolute z-10 mt-1 w-full rounded-md border bg-popover shadow-lg max-h-60 overflow-auto">
                  {suggestions.map((area) => (
                    <li key={area.no}>
                      <button
                        type="button"
                        className="w-full px-4 py-2 text-left text-sm hover:bg-accent hover:text-accent-foreground flex flex-col gap-0.5"
                        onMouseDown={() => handleSelectArea(area)}
                      >
                        <span className="font-medium">{area.wideArea}</span>
                        <span className="text-xs text-muted-foreground">
                          {[area.administrativeDivision, area.addressCity, area.baseAddress]
                            .filter(Boolean)
                            .join(' ')}
                        </span>
                      </button>
                    </li>
                  ))}
                </ul>
              )}
              {showSuggestions && form.addressQuery.trim().length > 0 && suggestions.length === 0 && (
                <div className="absolute z-10 mt-1 w-full rounded-md border bg-popover shadow-lg px-4 py-3 text-sm text-muted-foreground">
                  該当する地域が見つかりません
                </div>
              )}
            </div>

            {/* 自動入力された交通費情報 */}
            {form.selectedAreaName !== '' && (
              <div className="rounded-md border bg-muted/40 p-4 max-w-md space-y-3">
                <p className="text-sm font-medium">
                  選択中の地域：<span className="text-foreground">{form.selectedAreaName}</span>
                </p>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <Label className="text-xs text-muted-foreground">基本交通費（円）</Label>
                    <p className="text-lg font-bold font-mono">
                      {form.baseFee !== '' ? formatNumber(Number(form.baseFee)) : '—'}
                    </p>
                  </div>
                  <div>
                    <Label className="text-xs text-muted-foreground">深夜割増（円）</Label>
                    <p className="text-lg font-bold font-mono">
                      {form.lateNightSurcharge !== '' ? formatNumber(Number(form.lateNightSurcharge)) : '—'}
                    </p>
                  </div>
                </div>
                {form.notes !== '' && (
                  <p className="text-xs text-muted-foreground">備考: {form.notes}</p>
                )}
                <Button type="button" variant="outline" size="sm" onClick={handleReset}>
                  クリア
                </Button>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* 交通費一覧テーブル */}
      <Card>
        <CardHeader>
          <CardTitle>派遣地区別交通費設定</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-16">No</TableHead>
                  <TableHead>地域名</TableHead>
                  <TableHead className="text-right">基本交通費（円）</TableHead>
                  <TableHead className="text-right">深夜割増（円）</TableHead>
                  <TableHead>備考</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {transportFeeData.map((item, index) => (
                  <TableRow
                    key={`transport-${index}`}
                    className={item.areaName === form.selectedAreaName ? 'bg-accent/50' : undefined}
                  >
                    <TableCell className="font-medium">{index + 1}</TableCell>
                    <TableCell>{item.areaName}</TableCell>
                    <TableCell className="text-right font-mono">
                      {formatNumber(item.baseFee)}
                    </TableCell>
                    <TableCell className="text-right font-mono">
                      {formatNumber(item.lateNightSurcharge)}
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {item.notes}
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

// ---- メインページ ----

export default function AreaDivision() {
  React.useEffect(() => {
    document.title = '地域区分・交通費設定 - Dispatch Harmony Hub';
  }, []);

  const formatNumber = (num: number) => num.toLocaleString();

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
      <Card className="mb-6">
        <CardHeader>
          <div className="flex items-center gap-3">
            <Map className="w-6 h-6" />
            <div>
              <CardTitle className="text-2xl">地域区分・交通費設定</CardTitle>
              <p className="text-muted-foreground mt-1">
                地域ごとのホテル情報および交通費を管理します
              </p>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* タブ */}
      <Tabs defaultValue="area-division">
        <TabsList className="mb-4">
          <TabsTrigger value="area-division">地域区分</TabsTrigger>
          <TabsTrigger value="transport-fee">交通費設定</TabsTrigger>
        </TabsList>

        {/* 地域区分タブ */}
        <TabsContent value="area-division">
          {/* 統計情報 */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-2">
                  <Building2 className="w-5 h-5 text-blue-600" />
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">総ホテル数</p>
                    <p className="text-2xl font-bold">
                      {formatNumber(areaDivisionSampleData.reduce((sum, item) => sum + item.totalHotels, 0))}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-2">
                  <Heart className="w-5 h-5 text-pink-600" />
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">ラブホテル数</p>
                    <p className="text-2xl font-bold">
                      {formatNumber(areaDivisionSampleData.reduce((sum, item) => sum + item.loveHotels, 0))}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-2">
                  <Building className="w-5 h-5 text-green-600" />
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">シティホテル数</p>
                    <p className="text-2xl font-bold">
                      {formatNumber(areaDivisionSampleData.reduce((sum, item) => sum + item.cityHotels, 0))}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-2">
                  <Map className="w-5 h-5 text-purple-600" />
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">地域数</p>
                    <p className="text-2xl font-bold">
                      {areaDivisionSampleData.length}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* データテーブル */}
          <Card>
            <CardHeader>
              <CardTitle>地域区分一覧</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-16">No</TableHead>
                      <TableHead>広域区分</TableHead>
                      <TableHead>ひらがな読み</TableHead>
                      <TableHead>ローマ字読み</TableHead>
                      <TableHead>地域区分</TableHead>
                      <TableHead>行政区分</TableHead>
                      <TableHead>住所市区</TableHead>
                      <TableHead>通称（基本住所表示マーカー）</TableHead>
                      <TableHead>基本住所</TableHead>
                      <TableHead>マーカー色</TableHead>
                      <TableHead className="text-center">総数</TableHead>
                      <TableHead className="text-center">ラブ</TableHead>
                      <TableHead className="text-center">シティ</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {areaDivisionSampleData.map((item: AreaDivision) => (
                      <TableRow key={item.no}>
                        <TableCell className="font-medium">{item.no}</TableCell>
                        <TableCell>{item.wideArea}</TableCell>
                        <TableCell className="text-sm text-muted-foreground">
                          {item.hiraganaReading}
                        </TableCell>
                        <TableCell className="text-sm font-mono">
                          {item.romanReading}
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline">{item.areaCategory}</Badge>
                        </TableCell>
                        <TableCell>{item.administrativeDivision}</TableCell>
                        <TableCell>{item.addressCity}</TableCell>
                        <TableCell>
                          <div className="flex flex-wrap gap-2">
                            {(item.addressNicknames ?? []).slice(0, 2).map((nickname, idx) => (
                              <Badge key={`${item.no}-nickname-${idx}`} variant="outline">
                                {nickname}
                              </Badge>
                            ))}
                          </div>
                        </TableCell>
                        <TableCell className="text-sm text-muted-foreground whitespace-nowrap">
                          {item.baseAddress ?? '—'}
                        </TableCell>
                        <TableCell>
                          {item.markerColor != null ? (
                            <div className="flex items-center gap-2">
                              <span
                                className="inline-block w-4 h-4 rounded-full border border-border flex-shrink-0"
                                style={{ backgroundColor: item.markerColor }}
                                title={item.markerColor}
                              />
                              <span className="text-xs font-mono text-muted-foreground">
                                {item.markerColor}
                              </span>
                            </div>
                          ) : (
                            <span className="text-muted-foreground">—</span>
                          )}
                        </TableCell>
                        <TableCell className="text-center">
                          <Badge variant="secondary">
                            {formatNumber(item.totalHotels)}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-center">
                          <Badge variant="destructive">
                            {formatNumber(item.loveHotels)}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-center">
                          <Badge variant="default">
                            {formatNumber(item.cityHotels)}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* 交通費設定タブ */}
        <TabsContent value="transport-fee">
          <TransportFeeTab />
        </TabsContent>
      </Tabs>
    </div>
  );
}
