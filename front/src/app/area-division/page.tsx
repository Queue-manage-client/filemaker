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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Checkbox } from "@/components/ui/checkbox";
import { ArrowLeft, Map, Building2, Heart, Building, Search, Edit2, Plus, AlertTriangle, User, Clock } from "lucide-react";
import { areaDivisionSampleData, dispatchStaffList, exceptionApproverList } from '@/data/areaDivisionSampleData';
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

  // データ状態管理
  const [areaData, setAreaData] = useState<AreaDivision[]>(areaDivisionSampleData);

  // 編集モーダル
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<AreaDivision | null>(null);
  const [editDispatchStaff, setEditDispatchStaff] = useState('');

  // 特例マーカー追加モーダル
  const [exceptionModalOpen, setExceptionModalOpen] = useState(false);
  const [exceptionItem, setExceptionItem] = useState<AreaDivision | null>(null);
  const [newNickname, setNewNickname] = useState('');
  const [selectedApprover, setSelectedApprover] = useState('');
  const [hasApproverPermission, setHasApproverPermission] = useState(false);

  // 現在のログインユーザー（サンプル）
  const currentUser = '山田 太郎';
  const isApprover = exceptionApproverList.includes(currentUser);

  const handleOpenEditModal = (item: AreaDivision) => {
    setEditingItem(item);
    setEditDispatchStaff(item.dispatchStaff ?? '');
    setEditModalOpen(true);
  };

  const handleSaveDispatchStaff = () => {
    if (!editingItem) return;
    const now = new Date().toLocaleString('ja-JP', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    }).replace(/\//g, '-');

    setAreaData((prev) =>
      prev.map((item) =>
        item.no === editingItem.no
          ? {
              ...item,
              dispatchStaff: editDispatchStaff,
              updatedBy: currentUser,
              updatedAt: now,
            }
          : item
      )
    );
    setEditModalOpen(false);
    setEditingItem(null);
  };

  const handleOpenExceptionModal = (item: AreaDivision) => {
    setExceptionItem(item);
    setNewNickname('');
    setSelectedApprover(isApprover ? currentUser : '');
    setHasApproverPermission(isApprover);
    setExceptionModalOpen(true);
  };

  const handleAddExceptionNickname = () => {
    if (!exceptionItem || !newNickname.trim() || !selectedApprover) return;

    const now = new Date().toLocaleString('ja-JP', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    }).replace(/\//g, '-');

    setAreaData((prev) =>
      prev.map((item) =>
        item.no === exceptionItem.no
          ? {
              ...item,
              addressNicknames: [...(item.addressNicknames ?? []), newNickname.trim()],
              isException: true,
              exceptionApprovedBy: selectedApprover,
              updatedBy: currentUser,
              updatedAt: now,
            }
          : item
      )
    );
    setExceptionModalOpen(false);
    setExceptionItem(null);
    setNewNickname('');
    setSelectedApprover('');
  };

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
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Map className="w-6 h-6" />
              <div>
                <CardTitle className="text-2xl">地域区分・交通費設定</CardTitle>
                <p className="text-muted-foreground mt-1">
                  地域ごとのホテル情報および交通費を管理します
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <User className="w-4 h-4" />
              <span>ログイン: {currentUser}</span>
              {isApprover && (
                <Badge variant="secondary" className="ml-2">特例承認権限あり</Badge>
              )}
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
                      {formatNumber(areaData.reduce((sum, item) => sum + item.totalHotels, 0))}
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
                      {formatNumber(areaData.reduce((sum, item) => sum + item.loveHotels, 0))}
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
                      {formatNumber(areaData.reduce((sum, item) => sum + item.cityHotels, 0))}
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
                      {areaData.length}
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
                      <TableHead>地域区分</TableHead>
                      <TableHead>住所市区</TableHead>
                      <TableHead>通称（マーカー）</TableHead>
                      <TableHead>基本住所</TableHead>
                      <TableHead>マーカー色</TableHead>
                      <TableHead>配車担当</TableHead>
                      <TableHead className="text-center">総数</TableHead>
                      <TableHead>登録者 / 更新者</TableHead>
                      <TableHead>操作</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {areaData.map((item: AreaDivision) => (
                      <TableRow key={item.no}>
                        <TableCell className="font-medium">{item.no}</TableCell>
                        <TableCell>{item.wideArea}</TableCell>
                        <TableCell>
                          <Badge variant="outline">{item.areaCategory}</Badge>
                        </TableCell>
                        <TableCell>{item.addressCity || '—'}</TableCell>
                        <TableCell>
                          <div className="flex flex-wrap gap-1 items-center">
                            {(item.addressNicknames ?? []).slice(0, 2).map((nickname, idx) => (
                              <Badge key={`${item.no}-nickname-${idx}`} variant="outline">
                                {nickname}
                              </Badge>
                            ))}
                            {(item.addressNicknames ?? []).length > 2 && (
                              <>
                                {(item.addressNicknames ?? []).slice(2).map((nickname, idx) => (
                                  <Badge
                                    key={`${item.no}-nickname-extra-${idx}`}
                                    variant="secondary"
                                    className="border-orange-400 bg-orange-50"
                                  >
                                    {nickname}
                                  </Badge>
                                ))}
                                <Badge variant="outline" className="text-orange-600 border-orange-400">
                                  <AlertTriangle className="w-3 h-3 mr-1" />
                                  特例
                                </Badge>
                              </>
                            )}
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-6 w-6 p-0 ml-1"
                              onClick={() => handleOpenExceptionModal(item)}
                              title="マーカーを追加（特例承認が必要）"
                            >
                              <Plus className="w-3 h-3" />
                            </Button>
                          </div>
                        </TableCell>
                        <TableCell className="text-sm text-muted-foreground whitespace-nowrap max-w-[200px] truncate" title={item.baseAddress ?? ''}>
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
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <span className="text-sm">{item.dispatchStaff ?? '—'}</span>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-6 w-6 p-0"
                              onClick={() => handleOpenEditModal(item)}
                              title="配車担当を編集"
                            >
                              <Edit2 className="w-3 h-3" />
                            </Button>
                          </div>
                        </TableCell>
                        <TableCell className="text-center">
                          <Badge variant="secondary">
                            {formatNumber(item.totalHotels)}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="text-xs space-y-1">
                            <div className="flex items-center gap-1 text-muted-foreground">
                              <User className="w-3 h-3" />
                              <span>{item.createdBy ?? '—'}</span>
                              <Clock className="w-3 h-3 ml-2" />
                              <span>{item.createdAt ?? '—'}</span>
                            </div>
                            {item.updatedBy && item.updatedBy !== item.createdBy && (
                              <div className="flex items-center gap-1 text-blue-600">
                                <Edit2 className="w-3 h-3" />
                                <span>{item.updatedBy}</span>
                                <Clock className="w-3 h-3 ml-2" />
                                <span>{item.updatedAt}</span>
                              </div>
                            )}
                            {item.isException && item.exceptionApprovedBy && (
                              <div className="flex items-center gap-1 text-orange-600">
                                <AlertTriangle className="w-3 h-3" />
                                <span>特例承認: {item.exceptionApprovedBy}</span>
                              </div>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleOpenEditModal(item)}
                          >
                            編集
                          </Button>
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

      {/* 配車担当編集モーダル */}
      <Dialog open={editModalOpen} onOpenChange={setEditModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>配車担当を設定</DialogTitle>
            <DialogDescription>
              {editingItem?.wideArea} の配車担当者を選択してください
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>配車担当</Label>
              <Select value={editDispatchStaff} onValueChange={setEditDispatchStaff}>
                <SelectTrigger>
                  <SelectValue placeholder="配車担当を選択" />
                </SelectTrigger>
                <SelectContent>
                  {dispatchStaffList.map((staff) => (
                    <SelectItem key={staff} value={staff}>
                      {staff}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="text-sm text-muted-foreground">
              <p>更新者: {currentUser}</p>
              <p>更新日時: {new Date().toLocaleString('ja-JP')}</p>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditModalOpen(false)}>
              キャンセル
            </Button>
            <Button onClick={handleSaveDispatchStaff}>
              保存
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* 特例マーカー追加モーダル */}
      <Dialog open={exceptionModalOpen} onOpenChange={setExceptionModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-orange-500" />
              特例マーカーを追加
            </DialogTitle>
            <DialogDescription>
              {exceptionItem?.wideArea} に3つ目以降のマーカー（通称）を追加します。
              この操作には特例承認権限が必要です。
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="bg-orange-50 border border-orange-200 rounded-md p-3 text-sm">
              <p className="font-medium text-orange-800">注意</p>
              <p className="text-orange-700">
                通常、マーカーは市区ごとに2つまでです。
                3つ目以降を追加する場合は特例承認が必要となります。
              </p>
            </div>

            <div className="space-y-2">
              <Label>現在のマーカー</Label>
              <div className="flex flex-wrap gap-1">
                {(exceptionItem?.addressNicknames ?? []).map((nickname, idx) => (
                  <Badge
                    key={idx}
                    variant={idx < 2 ? 'outline' : 'secondary'}
                    className={idx >= 2 ? 'border-orange-400 bg-orange-50' : ''}
                  >
                    {nickname}
                  </Badge>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="new-nickname">追加するマーカー（通称）</Label>
              <Input
                id="new-nickname"
                placeholder="例: 新エリア名"
                value={newNickname}
                onChange={(e) => setNewNickname(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label>特例承認者</Label>
              {isApprover ? (
                <div className="flex items-center gap-2">
                  <Checkbox
                    id="self-approve"
                    checked={hasApproverPermission}
                    onCheckedChange={(checked) => {
                      setHasApproverPermission(Boolean(checked));
                      if (checked) {
                        setSelectedApprover(currentUser);
                      } else {
                        setSelectedApprover('');
                      }
                    }}
                  />
                  <Label htmlFor="self-approve" className="text-sm">
                    自分で承認する（{currentUser}）
                  </Label>
                </div>
              ) : (
                <div>
                  <Select value={selectedApprover} onValueChange={setSelectedApprover}>
                    <SelectTrigger>
                      <SelectValue placeholder="承認者を選択" />
                    </SelectTrigger>
                    <SelectContent>
                      {exceptionApproverList.map((approver) => (
                        <SelectItem key={approver} value={approver}>
                          {approver}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <p className="text-xs text-muted-foreground mt-1">
                    ※ 承認権限を持つユーザーに承認を依頼してください
                  </p>
                </div>
              )}
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setExceptionModalOpen(false)}>
              キャンセル
            </Button>
            <Button
              onClick={handleAddExceptionNickname}
              disabled={!newNickname.trim() || !selectedApprover}
              className="bg-orange-600 hover:bg-orange-700"
            >
              特例として追加
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
