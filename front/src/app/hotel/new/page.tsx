'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

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
  const [amount, setAmount] = useState<number | ''>('');
  const [postalCode, setPostalCode] = useState<string>('');
  const [address, setAddress] = useState<string>('');
  const [hotelImage, setHotelImage] = useState<'あり' | 'なし'>('あり');

  const handleSave = () => {
    try {
      // 入力値の確認（保存処理は未実装）
      // TODO: API 作成時に DTO + zod バリデーションを実装
      alert('保存処理は未実装です。入力内容はこのウィンドウ専用です。');
    } catch (_) {
      // UI_002: 保存処理に失敗（未実装）
    }
  };

  const handleCancel = () => {
    try {
      window.close();
    } catch (_) {
      // UI_003: ウィンドウを閉じられませんでした
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <Card className="max-w-3xl mx-auto">
        <CardHeader>
          <CardTitle>ホテル項目の新規追加</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
              <label className="block text-sm font-medium mb-1">頭2文字</label>
              <Input value={firstTwoChars} onChange={(e) => setFirstTwoChars(e.target.value)} />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium mb-1">ホテル名</label>
              <Input value={hotelName} onChange={(e) => setHotelName(e.target.value)} />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">地域区分</label>
              <Input value={areaCategory} onChange={(e) => setAreaCategory(e.target.value)} />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">電話番号</label>
              <Input value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)} />
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
              <label className="block text-sm font-medium mb-1">金額（円）</label>
              <Input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value === '' ? '' : Number(e.target.value))}
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">郵便番号</label>
              <Input value={postalCode} onChange={(e) => setPostalCode(e.target.value)} />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium mb-1">住所</label>
              <Input value={address} onChange={(e) => setAddress(e.target.value)} />
            </div>

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


