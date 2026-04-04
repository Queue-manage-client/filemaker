'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Star } from 'lucide-react';

export default function HotelNewPage() {
  React.useEffect(() => {
    document.title = 'ホテル項目の新規追加 - Dispatch Harmony Hub';
  }, []);

  const [type, setType] = useState<'ラブホテル' | 'シティホテル'>('ラブホテル');
  const [firstTwoChars, setFirstTwoChars] = useState<string>('');
  const [hotelName, setHotelName] = useState<string>('');
  const [areaCategory, setAreaCategory] = useState<string>('');
  const [phoneNumber, setPhoneNumber] = useState<string>('');
  const [singleRoomEntry, setSingleRoomEntry] = useState<'不可' | '可能'>('可能');
  const [restFee, setRestFee] = useState<number | ''>('');
  const [stayFee, setStayFee] = useState<number | ''>('');
  const [freeTimeFee, setFreeTimeFee] = useState<number | ''>('');
  const [postalCode, setPostalCode] = useState<string>('');
  const [address, setAddress] = useState<string>('');
  const [hotelImage, setHotelImage] = useState<'あり' | 'なし'>('あり');
  const [hasParking, setHasParking] = useState<'あり' | 'なし'>('なし');
  const [notes, setNotes] = useState<string>('');
  const [dispatchCondition, setDispatchCondition] = useState<'可能' | '不可' | '条件付き'>('可能');
  const [dispatchConditionNote, setDispatchConditionNote] = useState<string>('');
  const [isFirstGuidance, setIsFirstGuidance] = useState<boolean>(false);

  const handleSave = () => {
    try {
      // 入力値の確認（保存処理は未実装）
      // TODO: API 作成時に DTO + zod バリデーションを実装
      alert('保存処理は未実装です。入力内容はこのウィンドウ専用です。');
    } catch {
      // UI_002: 保存処理に失敗（未実装）
    }
  };

  const handleCancel = () => {
    try {
      window.close();
    } catch {
      // UI_003: ウィンドウを閉じられませんでした
    }
  };

  const parseFee = (value: string): number | '' => {
    return value === '' ? '' : Number(value);
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <Card className="max-w-3xl mx-auto">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>ホテル項目の新規追加</CardTitle>
            {isFirstGuidance && (
              <Badge className="bg-yellow-100 text-yellow-800 border border-yellow-300 flex items-center gap-1">
                <Star className="w-3 h-3" />
                初案内
              </Badge>
            )}
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

            {/* 基本情報 */}
            <div>
              <label className="block text-sm font-medium mb-1">区分</label>
              <select
                className="w-full border rounded-md px-3 py-2 bg-white"
                value={type}
                onChange={(e) => setType(e.target.value as 'ラブホテル' | 'シティホテル')}
              >
                <option value="ラブホテル">ラブホテル</option>
                <option value="シティホテル">シティホテル</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">頭2文字（ひらがな）</label>
              <Input
                placeholder="例: ろー"
                value={firstTwoChars}
                onChange={(e) => setFirstTwoChars(e.target.value)}
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium mb-1">ホテル名</label>
              <Input
                placeholder="例: ロータスゴージャスジャパン"
                value={hotelName}
                onChange={(e) => setHotelName(e.target.value)}
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">地域区分</label>
              <Input
                placeholder="例: 南IC"
                value={areaCategory}
                onChange={(e) => setAreaCategory(e.target.value)}
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">電話番号</label>
              <Input
                placeholder="例: 075-123-4567"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">独り入室</label>
              <select
                className="w-full border rounded-md px-3 py-2 bg-white"
                value={singleRoomEntry}
                onChange={(e) => setSingleRoomEntry(e.target.value as '不可' | '可能')}
              >
                <option value="可能">可能</option>
                <option value="不可">不可</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">駐車場有無</label>
              <select
                className="w-full border rounded-md px-3 py-2 bg-white"
                value={hasParking}
                onChange={(e) => setHasParking(e.target.value as 'あり' | 'なし')}
              >
                <option value="あり">あり</option>
                <option value="なし">なし</option>
              </select>
            </div>

            {/* 料金 */}
            <div>
              <label className="block text-sm font-medium mb-1">休憩料金（円）</label>
              <Input
                type="number"
                placeholder="例: 3000"
                value={restFee}
                onChange={(e) => setRestFee(parseFee(e.target.value))}
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">宿泊料金（円）</label>
              <Input
                type="number"
                placeholder="例: 8000"
                value={stayFee}
                onChange={(e) => setStayFee(parseFee(e.target.value))}
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">フリータイム料金（円）</label>
              <Input
                type="number"
                placeholder="例: 5000"
                value={freeTimeFee}
                onChange={(e) => setFreeTimeFee(parseFee(e.target.value))}
              />
            </div>

            {/* 住所 */}
            <div>
              <label className="block text-sm font-medium mb-1">郵便番号（ハイフン無し）</label>
              <Input
                placeholder="例: 6018003"
                value={postalCode}
                onChange={(e) => setPostalCode(e.target.value)}
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium mb-1">住所</label>
              <Input
                placeholder="例: 京都府京都市南区東九条西山王町12"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
              />
            </div>

            {/* 派遣条件 */}
            <div>
              <label className="block text-sm font-medium mb-1">派遣条件</label>
              <select
                className="w-full border rounded-md px-3 py-2 bg-white"
                value={dispatchCondition}
                onChange={(e) => setDispatchCondition(e.target.value as '可能' | '不可' | '条件付き')}
              >
                <option value="可能">可能</option>
                <option value="不可">不可</option>
                <option value="条件付き">条件付き</option>
              </select>
            </div>

            {dispatchCondition !== '可能' && (
              <div>
                <label className="block text-sm font-medium mb-1">
                  {dispatchCondition === '不可' ? '不可理由' : '条件の詳細'}
                </label>
                <Input
                  placeholder={dispatchCondition === '不可' ? '例: 独り入室不可・女性スタッフ入室に制限あり' : '例: 事前に部屋番号の確認が必要'}
                  value={dispatchConditionNote}
                  onChange={(e) => setDispatchConditionNote(e.target.value)}
                />
              </div>
            )}

            {/* その他 */}
            <div>
              <label className="block text-sm font-medium mb-1">画像</label>
              <select
                className="w-full border rounded-md px-3 py-2 bg-white"
                value={hotelImage}
                onChange={(e) => setHotelImage(e.target.value as 'あり' | 'なし')}
              >
                <option value="あり">あり</option>
                <option value="なし">なし</option>
              </select>
            </div>

            <div className="flex items-center gap-3 pt-6">
              <input
                type="checkbox"
                id="isFirstGuidance"
                checked={isFirstGuidance}
                onChange={(e) => setIsFirstGuidance(e.target.checked)}
                className="w-4 h-4 rounded border-gray-300"
              />
              <label htmlFor="isFirstGuidance" className="text-sm font-medium cursor-pointer select-none">
                初案内ホテル
              </label>
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium mb-1">備考</label>
              <Input
                placeholder="備考を入力"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
              />
            </div>
          </div>

          <div className="flex justify-end gap-2 mt-6">
            <Button variant="outline" onClick={handleCancel}>キャンセル</Button>
            <Button onClick={handleSave}>保存</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
