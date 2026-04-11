'use client';

import React, { useMemo, useState } from 'react';
import Link from 'next/link';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft, Hotel, Heart, Building, Camera, CameraOff, MapPin, Plus, Star, ExternalLink } from "lucide-react";
import { hotelDivisionSampleData } from '@/data/hotelDivisionSampleData';
import type { HotelDivision, HotelPricing } from '@/types/hotel-division';

// 編集フォームの型
interface HotelEditForm {
  // 基本情報
  type: 'ラブホテル' | 'シティホテル';
  abbreviatedName: string;
  nameReading: string;
  hotelName: string;
  officialName: string;
  // 連絡先
  phoneNumber: string;
  subPhoneNumber: string;
  url: string;
  // 住所
  postalCode: string;
  prefecture: string;
  city: string;
  addressDetail: string;
  // 設備・条件
  mark: string;
  singleRoomEntry: '不可' | '可能';
  hasParking: 'あり' | 'なし';
  hotelImage: 'あり' | 'なし';
  dispatchCondition: 'possible' | 'impossible' | 'conditional';
  conditionNote: string;
  // その他
  cautions: string;
  notes: string;
  isFirstGuidance: boolean;
  areaCategory: string;
  // 料金
  pricing: HotelPricing;
}

const createInitialForm = (hotel?: HotelDivision): HotelEditForm => ({
  type: hotel?.type ?? 'ラブホテル',
  abbreviatedName: hotel?.abbreviatedName ?? '',
  nameReading: hotel?.nameReading ?? '',
  hotelName: hotel?.hotelName ?? '',
  officialName: hotel?.officialName ?? '',
  phoneNumber: hotel?.phoneNumber ?? '',
  subPhoneNumber: hotel?.subPhoneNumber ?? '',
  url: hotel?.url ?? '',
  postalCode: hotel?.postalCode ?? '',
  prefecture: hotel?.prefecture ?? '',
  city: hotel?.city ?? '',
  addressDetail: hotel?.addressDetail ?? '',
  mark: hotel?.mark ?? '',
  singleRoomEntry: hotel?.singleRoomEntry ?? '可能',
  hasParking: hotel?.hasParking ?? 'なし',
  hotelImage: hotel?.hotelImage ?? 'なし',
  dispatchCondition: hotel?.dispatchCondition ?? 'possible',
  conditionNote: hotel?.conditionNote ?? '',
  cautions: hotel?.cautions ?? '',
  notes: hotel?.notes ?? '',
  isFirstGuidance: hotel?.isFirstGuidance ?? false,
  areaCategory: hotel?.areaCategory ?? '',
  pricing: {
    restFee: hotel?.pricing?.restFee ?? hotel?.restFee,
    restTime: hotel?.pricing?.restTime ?? '',
    stayFee: hotel?.pricing?.stayFee ?? hotel?.stayFee,
    stayCheckIn: hotel?.pricing?.stayCheckIn ?? '',
    stayCheckOut: hotel?.pricing?.stayCheckOut ?? '',
    freeTimeFee: hotel?.pricing?.freeTimeFee ?? hotel?.freeTimeFee,
    freeTimeStart: hotel?.pricing?.freeTimeStart ?? '',
    freeTimeEnd: hotel?.pricing?.freeTimeEnd ?? '',
    freeTimeDuration: hotel?.pricing?.freeTimeDuration ?? '',
    shortTimeFee: hotel?.pricing?.shortTimeFee,
    shortTimeDuration: hotel?.pricing?.shortTimeDuration ?? '',
    extensionFee: hotel?.pricing?.extensionFee,
    extensionUnit: hotel?.pricing?.extensionUnit ?? '',
    lateNightSurcharge: hotel?.pricing?.lateNightSurcharge,
    lateNightStart: hotel?.pricing?.lateNightStart ?? '',
    nominationFee: hotel?.pricing?.nominationFee,
    serviceFee: hotel?.pricing?.serviceFee,
    serviceRate: hotel?.pricing?.serviceRate,
  },
});

export default function HotelPage() {
  React.useEffect(() => {
    document.title = 'ホテル区分管理 - Dispatch Harmony Hub';
  }, []);

  const formatPostalCode = (code: string) => {
    return code.replace(/(\d{3})(\d{4})/, '$1-$2');
  };

  // データ状態管理
  const [hotelData, setHotelData] = useState<HotelDivision[]>(hotelDivisionSampleData);

  const loveHotelCount = hotelData.filter(item => item.type === 'ラブホテル').length;
  const cityHotelCount = hotelData.filter(item => item.type === 'シティホテル').length;
  const withImageCount = hotelData.filter(item => item.hotelImage === 'あり').length;
  const firstGuidanceCount = hotelData.filter(item => item.isFirstGuidance === true).length;

  // 絞り込み用の状態
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [typeFilter, setTypeFilter] = useState<'すべて' | 'ラブホテル' | 'シティホテル'>('すべて');
  const [areaFilter, setAreaFilter] = useState<string>('すべて');

  // 編集モーダル
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editingHotel, setEditingHotel] = useState<HotelDivision | null>(null);
  const [editForm, setEditForm] = useState<HotelEditForm>(createInitialForm());
  const [isNewHotel, setIsNewHotel] = useState(false);

  // 行クリックで編集モーダルを開く
  const handleRowClick = (hotel: HotelDivision) => {
    setEditingHotel(hotel);
    setEditForm(createInitialForm(hotel));
    setIsNewHotel(false);
    setEditModalOpen(true);
  };

  // 新規追加モーダルを開く
  const handleOpenAddModal = () => {
    setEditingHotel(null);
    setEditForm(createInitialForm());
    setIsNewHotel(true);
    setEditModalOpen(true);
  };

  // フォーム変更ハンドラ
  const handleFormChange = <K extends keyof HotelEditForm>(
    field: K,
    value: HotelEditForm[K]
  ) => {
    setEditForm((prev) => ({ ...prev, [field]: value }));
  };

  // 料金フォーム変更ハンドラ
  const handlePricingChange = <K extends keyof HotelPricing>(
    field: K,
    value: HotelPricing[K]
  ) => {
    setEditForm((prev) => ({
      ...prev,
      pricing: { ...prev.pricing, [field]: value },
    }));
  };

  const parseFee = (value: string): number | undefined => {
    return value === '' ? undefined : Number(value);
  };

  // 保存処理
  const handleSave = () => {
    const fullAddress = `${editForm.prefecture}${editForm.city}${editForm.addressDetail}`;

    if (isNewHotel) {
      const newHotel: HotelDivision = {
        no: Math.max(...hotelData.map(h => h.no)) + 1,
        type: editForm.type,
        abbreviatedName: editForm.abbreviatedName,
        nameReading: editForm.nameReading,
        firstTwoChars: editForm.nameReading.slice(0, 2) || '',
        hotelName: editForm.hotelName,
        officialName: editForm.officialName,
        phoneNumber: editForm.phoneNumber,
        subPhoneNumber: editForm.subPhoneNumber,
        url: editForm.url,
        postalCode: editForm.postalCode,
        prefecture: editForm.prefecture,
        city: editForm.city,
        addressDetail: editForm.addressDetail,
        address: fullAddress,
        mark: editForm.mark,
        singleRoomEntry: editForm.singleRoomEntry,
        hasParking: editForm.hasParking,
        hotelImage: editForm.hotelImage,
        dispatchCondition: editForm.dispatchCondition,
        conditionNote: editForm.conditionNote,
        cautions: editForm.cautions,
        notes: editForm.notes,
        isFirstGuidance: editForm.isFirstGuidance,
        areaCategory: editForm.areaCategory,
        restFee: editForm.pricing.restFee,
        stayFee: editForm.pricing.stayFee,
        freeTimeFee: editForm.pricing.freeTimeFee,
        pricing: editForm.pricing,
      };
      setHotelData((prev) => [...prev, newHotel]);
    } else if (editingHotel) {
      setHotelData((prev) =>
        prev.map((h) =>
          h.no === editingHotel.no
            ? {
                ...h,
                type: editForm.type,
                abbreviatedName: editForm.abbreviatedName,
                nameReading: editForm.nameReading,
                firstTwoChars: editForm.nameReading.slice(0, 2) || h.firstTwoChars,
                hotelName: editForm.hotelName,
                officialName: editForm.officialName,
                phoneNumber: editForm.phoneNumber,
                subPhoneNumber: editForm.subPhoneNumber,
                url: editForm.url,
                postalCode: editForm.postalCode,
                prefecture: editForm.prefecture,
                city: editForm.city,
                addressDetail: editForm.addressDetail,
                address: fullAddress,
                mark: editForm.mark,
                singleRoomEntry: editForm.singleRoomEntry,
                hasParking: editForm.hasParking,
                hotelImage: editForm.hotelImage,
                dispatchCondition: editForm.dispatchCondition,
                conditionNote: editForm.conditionNote,
                cautions: editForm.cautions,
                notes: editForm.notes,
                isFirstGuidance: editForm.isFirstGuidance,
                areaCategory: editForm.areaCategory,
                restFee: editForm.pricing.restFee,
                stayFee: editForm.pricing.stayFee,
                freeTimeFee: editForm.pricing.freeTimeFee,
                pricing: editForm.pricing,
              }
            : h
        )
      );
    }
    setEditModalOpen(false);
  };

  // 選択肢（サンプルデータから抽出）
  const areaOptions = useMemo(() => {
    const areas = new Set<string>();
    hotelData.forEach(h => areas.add(h.areaCategory));
    return ['すべて', ...Array.from(areas).sort()];
  }, [hotelData]);

  // フィルター済みデータ（50音順）
  const filteredHotels = useMemo(() => {
    const collator = new Intl.Collator('ja', { sensitivity: 'base' });
    const result = hotelData.filter((item) => {
      if (typeFilter !== 'すべて' && item.type !== typeFilter) return false;
      if (areaFilter !== 'すべて' && item.areaCategory !== areaFilter) return false;

      if (searchQuery.trim() !== '') {
        const q = searchQuery.trim().toLowerCase();
        const haystack = `${item.hotelName} ${item.areaCategory} ${item.firstTwoChars} ${item.abbreviatedName ?? ''}`.toLowerCase();
        if (!haystack.includes(q)) return false;
      }
      return true;
    });

    return result.sort((a, b) => collator.compare(a.firstTwoChars, b.firstTwoChars));
  }, [hotelData, typeFilter, areaFilter, searchQuery]);

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
                ホテルの詳細情報を管理します（行をクリックで編集）
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
            <Button onClick={handleOpenAddModal} className="flex items-center gap-2">
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
                  <TableHead>省略名</TableHead>
                  <TableHead>ホテル名</TableHead>
                  <TableHead>地域区分</TableHead>
                  <TableHead>電話番号</TableHead>
                  <TableHead>派遣条件</TableHead>
                  <TableHead>郵便番号</TableHead>
                  <TableHead>住所</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredHotels.map((item: HotelDivision) => (
                  <TableRow
                    key={item.no}
                    className="cursor-pointer hover:bg-muted/50"
                    onClick={() => handleRowClick(item)}
                  >
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
                    <TableCell className="text-sm text-muted-foreground whitespace-nowrap">
                      {item.abbreviatedName ?? '-'}
                    </TableCell>
                    <TableCell className="font-medium whitespace-nowrap">{item.hotelName}</TableCell>
                    <TableCell>
                      <Badge variant="outline">{item.areaCategory}</Badge>
                    </TableCell>
                    <TableCell className="text-sm font-mono whitespace-nowrap">
                      {item.phoneNumber}
                    </TableCell>
                    <TableCell>
                      {item.dispatchCondition === 'possible' && (
                        <Badge className="bg-green-100 text-green-800 border border-green-300 whitespace-nowrap">
                          可能
                        </Badge>
                      )}
                      {item.dispatchCondition === 'impossible' && (
                        <Badge className="bg-red-100 text-red-800 border border-red-300 whitespace-nowrap">
                          不可
                        </Badge>
                      )}
                      {item.dispatchCondition === 'conditional' && (
                        <Badge className="bg-yellow-100 text-yellow-800 border border-yellow-300 whitespace-nowrap">
                          条件付き
                        </Badge>
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
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* 編集モーダル */}
      <Dialog open={editModalOpen} onOpenChange={setEditModalOpen}>
        <DialogContent className="max-w-4xl max-h-[95vh]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Hotel className="w-5 h-5" />
              {isNewHotel ? 'ホテル項目の新規追加' : 'ホテル情報の編集'}
              {editForm.isFirstGuidance && (
                <Badge className="bg-yellow-100 text-yellow-800 border border-yellow-300 flex items-center gap-1 ml-2">
                  <Star className="w-3 h-3" />
                  初案内
                </Badge>
              )}
            </DialogTitle>
          </DialogHeader>

          <Tabs defaultValue="basic" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="basic">基本情報</TabsTrigger>
              <TabsTrigger value="address">住所・連絡先</TabsTrigger>
              <TabsTrigger value="pricing">金額設定</TabsTrigger>
            </TabsList>

            <ScrollArea className="h-[60vh] mt-4">
              {/* 基本情報タブ */}
              <TabsContent value="basic" className="space-y-4 pr-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>区分 *</Label>
                    <Select
                      value={editForm.type}
                      onValueChange={(v) => handleFormChange('type', v as 'ラブホテル' | 'シティホテル')}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="ラブホテル">ラブホテル</SelectItem>
                        <SelectItem value="シティホテル">シティホテル</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>名称省略</Label>
                    <Input
                      placeholder="例: ロータス"
                      value={editForm.abbreviatedName}
                      onChange={(e) => handleFormChange('abbreviatedName', e.target.value)}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>名所ふりがな *</Label>
                    <Input
                      placeholder="例: ろーたすごーじゃすじゃぱん"
                      value={editForm.nameReading}
                      onChange={(e) => handleFormChange('nameReading', e.target.value)}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>マーク</Label>
                    <Input
                      placeholder="例: A, S, ★"
                      value={editForm.mark}
                      onChange={(e) => handleFormChange('mark', e.target.value)}
                    />
                  </div>

                  <div className="col-span-2 space-y-2">
                    <Label>正式名称 *</Label>
                    <Input
                      placeholder="例: ロータスゴージャスジャパン"
                      value={editForm.hotelName}
                      onChange={(e) => handleFormChange('hotelName', e.target.value)}
                    />
                  </div>

                  <div className="col-span-2 space-y-2">
                    <Label>正式名称（法人名など）</Label>
                    <Input
                      placeholder="例: 株式会社ロータス ゴージャスジャパン京都店"
                      value={editForm.officialName}
                      onChange={(e) => handleFormChange('officialName', e.target.value)}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>地域区分</Label>
                    <Input
                      placeholder="例: 南IC"
                      value={editForm.areaCategory}
                      onChange={(e) => handleFormChange('areaCategory', e.target.value)}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>画像</Label>
                    <Select
                      value={editForm.hotelImage}
                      onValueChange={(v) => handleFormChange('hotelImage', v as 'あり' | 'なし')}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="あり">あり</SelectItem>
                        <SelectItem value="なし">なし</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <Separator />

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>派遣</Label>
                    <Select
                      value={editForm.dispatchCondition}
                      onValueChange={(v) => handleFormChange('dispatchCondition', v as 'possible' | 'impossible' | 'conditional')}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="possible">可能</SelectItem>
                        <SelectItem value="impossible">不可</SelectItem>
                        <SelectItem value="conditional">条件付き</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {editForm.dispatchCondition !== 'possible' && (
                    <div className="space-y-2">
                      <Label>{editForm.dispatchCondition === 'impossible' ? '不可理由' : '条件詳細'}</Label>
                      <Input
                        placeholder={editForm.dispatchCondition === 'impossible' ? '例: 独り入室不可' : '例: 事前に部屋番号確認が必要'}
                        value={editForm.conditionNote}
                        onChange={(e) => handleFormChange('conditionNote', e.target.value)}
                      />
                    </div>
                  )}

                  <div className="space-y-2">
                    <Label>独り入室</Label>
                    <Select
                      value={editForm.singleRoomEntry}
                      onValueChange={(v) => handleFormChange('singleRoomEntry', v as '不可' | '可能')}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="可能">可能</SelectItem>
                        <SelectItem value="不可">不可</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>駐車場</Label>
                    <Select
                      value={editForm.hasParking}
                      onValueChange={(v) => handleFormChange('hasParking', v as 'あり' | 'なし')}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="あり">あり</SelectItem>
                        <SelectItem value="なし">なし</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="flex items-center gap-3 pt-4">
                    <Checkbox
                      id="isFirstGuidance"
                      checked={editForm.isFirstGuidance}
                      onCheckedChange={(checked) => handleFormChange('isFirstGuidance', Boolean(checked))}
                    />
                    <Label htmlFor="isFirstGuidance" className="cursor-pointer">
                      初案内ホテル
                    </Label>
                  </div>
                </div>

                <Separator />

                <div className="space-y-2">
                  <Label>注意事項</Label>
                  <Textarea
                    placeholder="ホテル利用時の注意事項を入力"
                    value={editForm.cautions}
                    onChange={(e) => handleFormChange('cautions', e.target.value)}
                    rows={3}
                  />
                </div>

                <div className="space-y-2">
                  <Label>備考欄</Label>
                  <Textarea
                    placeholder="その他の備考を入力"
                    value={editForm.notes}
                    onChange={(e) => handleFormChange('notes', e.target.value)}
                    rows={3}
                  />
                </div>
              </TabsContent>

              {/* 住所・連絡先タブ */}
              <TabsContent value="address" className="space-y-4 pr-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>電話番号 *</Label>
                    <Input
                      placeholder="例: 075-123-4567"
                      value={editForm.phoneNumber}
                      onChange={(e) => handleFormChange('phoneNumber', e.target.value)}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>サブ電話番号</Label>
                    <Input
                      placeholder="例: 075-123-4568"
                      value={editForm.subPhoneNumber}
                      onChange={(e) => handleFormChange('subPhoneNumber', e.target.value)}
                    />
                  </div>

                  <div className="col-span-2 space-y-2">
                    <Label>URL</Label>
                    <div className="flex gap-2">
                      <Input
                        placeholder="例: https://example.com/hotel"
                        value={editForm.url}
                        onChange={(e) => handleFormChange('url', e.target.value)}
                      />
                      {editForm.url && (
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => window.open(editForm.url, '_blank')}
                        >
                          <ExternalLink className="w-4 h-4" />
                        </Button>
                      )}
                    </div>
                  </div>
                </div>

                <Separator />

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>郵便番号（ハイフン無し7桁）</Label>
                    <Input
                      placeholder="例: 6018003"
                      value={editForm.postalCode}
                      onChange={(e) => handleFormChange('postalCode', e.target.value.replace(/[^0-9]/g, '').slice(0, 7))}
                      maxLength={7}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>都道府県</Label>
                    <Input
                      placeholder="例: 京都府"
                      value={editForm.prefecture}
                      onChange={(e) => handleFormChange('prefecture', e.target.value)}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>市区町村</Label>
                    <Input
                      placeholder="例: 京都市南区"
                      value={editForm.city}
                      onChange={(e) => handleFormChange('city', e.target.value)}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>丁目、番地、号（半角数字）</Label>
                    <Input
                      placeholder="例: 東九条西山王町12"
                      value={editForm.addressDetail}
                      onChange={(e) => {
                        // 全角数字を半角に変換
                        const converted = e.target.value.replace(/[０-９]/g, (s) =>
                          String.fromCharCode(s.charCodeAt(0) - 0xFEE0)
                        );
                        handleFormChange('addressDetail', converted);
                      }}
                    />
                  </div>
                </div>

                <div className="p-3 bg-muted rounded-md">
                  <Label className="text-sm text-muted-foreground">完全住所プレビュー</Label>
                  <p className="mt-1 font-medium">
                    {editForm.prefecture}{editForm.city}{editForm.addressDetail || '（未入力）'}
                  </p>
                </div>
              </TabsContent>

              {/* 金額設定タブ */}
              <TabsContent value="pricing" className="space-y-4 pr-4">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base">休憩料金</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>休憩料金（円）</Label>
                        <Input
                          type="number"
                          placeholder="例: 3000"
                          value={editForm.pricing.restFee ?? ''}
                          onChange={(e) => handlePricingChange('restFee', parseFee(e.target.value))}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>休憩時間</Label>
                        <Input
                          placeholder="例: 90分"
                          value={editForm.pricing.restTime ?? ''}
                          onChange={(e) => handlePricingChange('restTime', e.target.value)}
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base">宿泊料金</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-3 gap-4">
                      <div className="space-y-2">
                        <Label>宿泊料金（円）</Label>
                        <Input
                          type="number"
                          placeholder="例: 8000"
                          value={editForm.pricing.stayFee ?? ''}
                          onChange={(e) => handlePricingChange('stayFee', parseFee(e.target.value))}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>チェックイン</Label>
                        <Input
                          type="time"
                          value={editForm.pricing.stayCheckIn ?? ''}
                          onChange={(e) => handlePricingChange('stayCheckIn', e.target.value)}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>チェックアウト</Label>
                        <Input
                          type="time"
                          value={editForm.pricing.stayCheckOut ?? ''}
                          onChange={(e) => handlePricingChange('stayCheckOut', e.target.value)}
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base">フリータイム料金</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>フリータイム料金（円）</Label>
                        <Input
                          type="number"
                          placeholder="例: 5000"
                          value={editForm.pricing.freeTimeFee ?? ''}
                          onChange={(e) => handlePricingChange('freeTimeFee', parseFee(e.target.value))}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>利用時間</Label>
                        <Input
                          placeholder="例: 最大12時間"
                          value={editForm.pricing.freeTimeDuration ?? ''}
                          onChange={(e) => handlePricingChange('freeTimeDuration', e.target.value)}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>開始時間</Label>
                        <Input
                          type="time"
                          value={editForm.pricing.freeTimeStart ?? ''}
                          onChange={(e) => handlePricingChange('freeTimeStart', e.target.value)}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>終了時間</Label>
                        <Input
                          type="time"
                          value={editForm.pricing.freeTimeEnd ?? ''}
                          onChange={(e) => handlePricingChange('freeTimeEnd', e.target.value)}
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base">ショートタイム・延長料金</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>ショートタイム料金（円）</Label>
                        <Input
                          type="number"
                          placeholder="例: 2000"
                          value={editForm.pricing.shortTimeFee ?? ''}
                          onChange={(e) => handlePricingChange('shortTimeFee', parseFee(e.target.value))}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>ショートタイム時間</Label>
                        <Input
                          placeholder="例: 60分"
                          value={editForm.pricing.shortTimeDuration ?? ''}
                          onChange={(e) => handlePricingChange('shortTimeDuration', e.target.value)}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>延長料金（円）</Label>
                        <Input
                          type="number"
                          placeholder="例: 1000"
                          value={editForm.pricing.extensionFee ?? ''}
                          onChange={(e) => handlePricingChange('extensionFee', parseFee(e.target.value))}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>延長単位</Label>
                        <Input
                          placeholder="例: 30分"
                          value={editForm.pricing.extensionUnit ?? ''}
                          onChange={(e) => handlePricingChange('extensionUnit', e.target.value)}
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base">その他料金</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>深夜割増（円）</Label>
                        <Input
                          type="number"
                          placeholder="例: 500"
                          value={editForm.pricing.lateNightSurcharge ?? ''}
                          onChange={(e) => handlePricingChange('lateNightSurcharge', parseFee(e.target.value))}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>深夜割増開始</Label>
                        <Input
                          placeholder="例: 24:00"
                          value={editForm.pricing.lateNightStart ?? ''}
                          onChange={(e) => handlePricingChange('lateNightStart', e.target.value)}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>指名料（円）</Label>
                        <Input
                          type="number"
                          placeholder="例: 2000"
                          value={editForm.pricing.nominationFee ?? ''}
                          onChange={(e) => handlePricingChange('nominationFee', parseFee(e.target.value))}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>サービス料（円）</Label>
                        <Input
                          type="number"
                          placeholder="例: 1000"
                          value={editForm.pricing.serviceFee ?? ''}
                          onChange={(e) => handlePricingChange('serviceFee', parseFee(e.target.value))}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>サービス率（%）</Label>
                        <Input
                          type="number"
                          placeholder="例: 10"
                          value={editForm.pricing.serviceRate ?? ''}
                          onChange={(e) => handlePricingChange('serviceRate', parseFee(e.target.value))}
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </ScrollArea>
          </Tabs>

          <DialogFooter className="mt-4">
            <Button variant="outline" onClick={() => setEditModalOpen(false)}>
              キャンセル
            </Button>
            <Button onClick={handleSave}>
              保存
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
