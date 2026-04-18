'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { X, Plus, Pencil, Trash2, Calendar, Clock, Infinity, ExternalLink, Gift } from "lucide-react";

export default function PointHistoryWindow() {
  React.useEffect(() => {
    document.title = 'フクダ様 ポイント履歴';
  }, []);

  // モーダル状態
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // ※ポイント倍率設定は店舗台帳の顧客ポイントタブで管理
  // ここでは参照用として本日の倍率を表示（実際はAPIから取得）
  const todayRate = 1.0; // 通常倍率（店舗台帳から取得）

  // フォーム状態
  const [formData, setFormData] = useState({
    date: '2023/11/27',
    spid: '1',
    storeName: '京都デリヘル俱楽部',
    ctNo: '39',
    customerName: 'フクダ',
    salesNo: '624359',
    hostessName: 'みらい',
    points: '680',
    sign: 'plus' as 'plus' | 'minus',
    remarks: '',
    expirationOption: '1year' as 'unlimited' | '3months' | '6months' | '1year' | 'custom',
    expirationDate: ''
  });

  // ポイント履歴データ（有効期限付き）
  // date = ポイント取得日、validityPeriod = 有効期間（1年、6ヶ月、無期限など）、expiration = ポイント有効期限
  // used（利用）の場合はvalidityPeriod = null, expiration = null
  const pointHistory = [
    { id: '1', date: '2023/10/13', acquired: 180, used: null, balance: 40710, storeName: '京都デリヘル俱楽部', hostessName: 'あやか', validityPeriod: '1年', expiration: '2024/10/13' },
    { id: '2', date: '2023/10/18', acquired: 570, used: null, balance: 41280, storeName: '京都デリヘル俱楽部', hostessName: '二葉ー', validityPeriod: '1年', expiration: '2024/10/18' },
    { id: '3', date: '2023/11/21', acquired: 600, used: null, balance: 41880, storeName: '京都デリヘル俱楽部', hostessName: '二葉ー', validityPeriod: '1年', expiration: '2024/11/21' },
    { id: '4', date: '2023/12/05', acquired: 450, used: null, balance: 42330, storeName: '京都デリヘル俱楽部', hostessName: 'みさき', validityPeriod: '1年', expiration: '2024/12/05' },
    { id: '5', date: '2023/12/15', acquired: null, used: 1000, balance: 41330, storeName: '京都デリヘル俱楽部', hostessName: 'あやか', validityPeriod: null, expiration: null },
    { id: '6', date: '2024/01/08', acquired: 720, used: null, balance: 42050, storeName: '京都デリヘル俱楽部', hostessName: 'さくら', validityPeriod: '1年', expiration: '2025/01/08' },
    { id: '7', date: '2024/01/22', acquired: 380, used: null, balance: 42430, storeName: '京都デリヘル俱楽部', hostessName: 'りな', validityPeriod: '6ヶ月', expiration: '2024/07/22' },
    { id: '8', date: '2024/02/14', acquired: 850, used: null, balance: 43280, storeName: '京都デリヘル俱楽部', hostessName: 'あやか', validityPeriod: '1年', expiration: '2025/02/14' },
    { id: '9', date: '2024/02/28', acquired: null, used: 2000, balance: 41280, storeName: '京都デリヘル俱楽部', hostessName: 'みさき', validityPeriod: null, expiration: null },
    { id: '10', date: '2024/03/10', acquired: 620, used: null, balance: 41900, storeName: '京都デリヘル俱楽部', hostessName: '二葉ー', validityPeriod: '1年', expiration: '2025/03/10' },
    { id: '11', date: '2024/03/25', acquired: 490, used: null, balance: 42390, storeName: '京都デリヘル俱楽部', hostessName: 'ゆき', validityPeriod: '無期限', expiration: null },
    { id: '12', date: '2024/04/05', acquired: 750, used: null, balance: 43140, storeName: '京都デリヘル俱楽部', hostessName: 'あやか', validityPeriod: '1年', expiration: '2025/04/05' },
    { id: '13', date: '2024/04/20', acquired: null, used: 500, balance: 42640, storeName: '京都デリヘル俱楽部', hostessName: 'りな', validityPeriod: null, expiration: null },
    { id: '14', date: '2024/05/08', acquired: 680, used: null, balance: 43320, storeName: '京都デリヘル俱楽部', hostessName: 'さくら', validityPeriod: '1年', expiration: '2025/05/08' },
    { id: '15', date: '2024/05/22', acquired: 920, used: null, balance: 44240, storeName: '京都デリヘル俱楽部', hostessName: 'みさき', validityPeriod: '2年', expiration: '2026/05/22' },
    { id: '16', date: '2024/06/10', acquired: 550, used: null, balance: 44790, storeName: '京都デリヘル俱楽部', hostessName: 'あやか', validityPeriod: '1年', expiration: '2025/06/10' },
    { id: '17', date: '2024/06/28', acquired: null, used: 3000, balance: 41790, storeName: '京都デリヘル俱楽部', hostessName: '二葉ー', validityPeriod: null, expiration: null },
    { id: '18', date: '2024/07/15', acquired: 800, used: null, balance: 42590, storeName: '京都デリヘル俱楽部', hostessName: 'ゆき', validityPeriod: '1年', expiration: '2025/07/15' },
    { id: '19', date: '2024/08/03', acquired: 430, used: null, balance: 43020, storeName: '京都デリヘル俱楽部', hostessName: 'りな', validityPeriod: '6ヶ月', expiration: '2025/02/03' },
    { id: '20', date: '2024/08/20', acquired: 670, used: null, balance: 43690, storeName: '京都デリヘル俱楽部', hostessName: 'あやか', validityPeriod: '1年', expiration: '2025/08/20' },
    { id: '21', date: '2024/09/05', acquired: null, used: 1500, balance: 42190, storeName: '京都デリヘル俱楽部', hostessName: 'さくら', validityPeriod: null, expiration: null },
    { id: '22', date: '2024/09/18', acquired: 580, used: null, balance: 42770, storeName: '京都デリヘル俱楽部', hostessName: 'みさき', validityPeriod: '1年', expiration: '2025/09/18' },
    { id: '23', date: '2024/10/02', acquired: 890, used: null, balance: 43660, storeName: '京都デリヘル俱楽部', hostessName: '二葉ー', validityPeriod: '1年', expiration: '2025/10/02' },
    { id: '24', date: '2024/10/20', acquired: 340, used: null, balance: 44000, storeName: '京都デリヘル俱楽部', hostessName: 'あやか', validityPeriod: '無期限', expiration: null },
    { id: '25', date: '2024/11/08', acquired: null, used: 2500, balance: 41500, storeName: '京都デリヘル俱楽部', hostessName: 'ゆき', validityPeriod: null, expiration: null },
    { id: '26', date: '2024/11/25', acquired: 760, used: null, balance: 42260, storeName: '京都デリヘル俱楽部', hostessName: 'りな', validityPeriod: '1年', expiration: '2025/11/25' },
    { id: '27', date: '2024/12/10', acquired: 510, used: null, balance: 42770, storeName: '京都デリヘル俱楽部', hostessName: 'さくら', validityPeriod: '1年', expiration: '2025/12/10' },
    { id: '28', date: '2024/12/28', acquired: 640, used: null, balance: 43410, storeName: '京都デリヘル俱楽部', hostessName: 'あやか', validityPeriod: '1年', expiration: '2025/12/28' },
    { id: '29', date: '2025/01/12', acquired: 820, used: null, balance: 44230, storeName: '京都デリヘル俱楽部', hostessName: 'みさき', validityPeriod: '1年', expiration: '2026/01/12' },
    { id: '30', date: '2025/01/26', acquired: null, used: 5000, balance: 39230, storeName: '京都デリヘル俱楽部', hostessName: '二葉ー', validityPeriod: null, expiration: null },
  ];

  // 有効期限が近いかどうかを判定（30日以内）
  const isExpirationNear = (expiration: string | null): boolean => {
    if (!expiration) return false;
    const expDate = new Date(expiration.replace(/\//g, '-'));
    const today = new Date();
    const diffDays = Math.ceil((expDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
    return diffDays > 0 && diffDays <= 30;
  };

  // 有効期限切れかどうかを判定
  const isExpired = (expiration: string | null): boolean => {
    if (!expiration) return false;
    const expDate = new Date(expiration.replace(/\//g, '-'));
    const today = new Date();
    return expDate < today;
  };

  // 現在の残高を計算
  const currentBalance = pointHistory.length > 0 ? pointHistory[pointHistory.length - 1].balance : 0;

  const handleClose = () => {
    window.close();
  };

  const handleFormChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleAddModalOpen = () => {
    // 新規追加用にフォームをリセット
    const today = new Date();
    const dateStr = `${today.getFullYear()}/${String(today.getMonth() + 1).padStart(2, '0')}/${String(today.getDate()).padStart(2, '0')}`;
    setFormData({
      date: dateStr,
      spid: '1',
      storeName: '京都デリヘル俱楽部',
      ctNo: '39',
      customerName: 'フクダ',
      salesNo: '',
      hostessName: '',
      points: '',
      sign: 'plus',
      remarks: '',
      expirationOption: '1year',
      expirationDate: ''
    });
    setIsAddModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-gray-200">
      {/* タイトルバー */}
      <div className="flex items-center gap-2 px-3 py-2 bg-gradient-to-b from-gray-100 to-gray-300 border-b border-gray-400">
        <div className="w-4 h-4 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center">
          <span className="text-white text-xs">◉</span>
        </div>
        <span className="text-gray-800 text-sm">フクダ様　ポイント履歴</span>
      </div>

      {/* ダークヘッダー部分 */}
      <div className="bg-gray-900 text-white">
        {/* コントロール行 */}
        <div className="flex items-center justify-between px-2 py-2">
          <button
            onClick={handleClose}
            className="w-10 h-10 bg-gray-700 border-2 border-gray-500 rounded flex items-center justify-center hover:bg-gray-600 transition-colors"
          >
            <X className="w-6 h-6 text-white" />
          </button>

          <div className="flex items-center gap-8">
            <div className="flex items-center gap-2">
              <span className="text-gray-400 text-sm">残高</span>
              <span className="text-white text-xl font-semibold">{currentBalance.toLocaleString()}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-gray-400 text-sm">CTNo</span>
              <span className="text-white text-lg">39</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-gray-400 text-sm">顧客名</span>
              <span className="text-white text-lg">フクダ</span>
            </div>
            {/* ポイント倍率表示 */}
            {todayRate > 1.0 && (
              <div className="flex items-center gap-2 bg-gradient-to-r from-yellow-500 to-orange-500 px-3 py-1 rounded-lg">
                <Gift className="w-4 h-4 text-white" />
                <span className="text-white font-bold">本日 {todayRate}倍</span>
              </div>
            )}
          </div>

          <div className="flex items-center gap-2">
            {/* 店舗台帳への案内リンク */}
            <Link
              href="/store-ledger"
              className="h-8 px-3 bg-purple-600 border border-purple-400 rounded flex items-center gap-1.5 hover:bg-purple-500 transition-colors text-white text-xs"
              title="ポイント倍率は店舗台帳で設定"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              倍率設定
            </Link>
            <button
              onClick={handleAddModalOpen}
              className="w-10 h-10 bg-gray-700 border-2 border-gray-500 rounded flex items-center justify-center hover:bg-gray-600 transition-colors"
            >
              <Plus className="w-6 h-6 text-white" />
            </button>
          </div>
        </div>

        {/* テーブルヘッダー */}
        <div className="grid grid-cols-[100px_80px_80px_100px_1fr_100px_80px_100px_60px] bg-gray-700 border-t border-gray-600 text-sm">
          <div className="px-3 py-2 text-gray-300 border-r border-gray-600">日付</div>
          <div className="px-3 py-2 text-gray-300 border-r border-gray-600">取得</div>
          <div className="px-3 py-2 text-gray-300 border-r border-gray-600">利用</div>
          <div className="px-3 py-2 text-gray-300 border-r border-gray-600">残高</div>
          <div className="px-3 py-2 text-gray-300 border-r border-gray-600">売上店舗</div>
          <div className="px-3 py-2 text-gray-300 border-r border-gray-600">ホステス名</div>
          <div className="px-3 py-2 text-gray-300 border-r border-gray-600">有効期間</div>
          <div className="px-3 py-2 text-gray-300 border-r border-gray-600 flex items-center gap-1">
            <Clock className="w-3 h-3" />
            有効期限
          </div>
          <div className="px-3 py-2 text-gray-300"></div>
        </div>
      </div>

      {/* テーブルボディ */}
      <div className="overflow-y-auto bg-gray-100" style={{ maxHeight: 'calc(100vh - 140px)' }}>
        {pointHistory.map((item, index) => (
          <div
            key={item.id}
            className={`grid grid-cols-[100px_80px_80px_100px_1fr_100px_80px_100px_60px] text-sm border-b border-gray-300 ${
              index % 2 === 0 ? 'bg-white' : 'bg-gray-50'
            } hover:bg-blue-50`}
          >
            <div className="px-3 py-2 border-r border-gray-200">{item.date}</div>
            <div className="px-3 py-2 border-r border-gray-200 text-right">
              {item.acquired !== null ? item.acquired.toLocaleString() : ''}
            </div>
            <div className="px-3 py-2 border-r border-gray-200 text-right text-red-600">
              {item.used !== null ? item.used.toLocaleString() : ''}
            </div>
            <div className="px-3 py-2 border-r border-gray-200 text-right font-semibold">
              {item.balance.toLocaleString()}
            </div>
            <div className="px-3 py-2 border-r border-gray-200">{item.storeName}</div>
            <div className="px-3 py-2 border-r border-gray-200">{item.hostessName}</div>
            <div className="px-3 py-2 border-r border-gray-200 text-xs text-center">
              {item.validityPeriod ? (
                <span className={`px-1.5 py-0.5 rounded ${
                  item.validityPeriod === '無期限' ? 'bg-green-100 text-green-700' :
                  item.validityPeriod === '6ヶ月' ? 'bg-yellow-100 text-yellow-700' :
                  item.validityPeriod === '2年' ? 'bg-blue-100 text-blue-700' :
                  'bg-gray-100 text-gray-700'
                }`}>
                  {item.validityPeriod}
                </span>
              ) : (
                <span className="text-gray-400">-</span>
              )}
            </div>
            <div className={`px-3 py-2 border-r border-gray-200 text-xs flex items-center gap-1 ${
              isExpired(item.expiration) ? 'text-red-600 bg-red-50' :
              isExpirationNear(item.expiration) ? 'text-orange-600 bg-orange-50' : ''
            }`}>
              {item.expiration ? (
                <>
                  {isExpired(item.expiration) && <span className="text-red-500">期限切</span>}
                  {isExpirationNear(item.expiration) && !isExpired(item.expiration) && <span className="text-orange-500">まもなく</span>}
                  {!isExpired(item.expiration) && !isExpirationNear(item.expiration) && item.expiration}
                </>
              ) : (
                <span className="flex items-center gap-1 text-green-600">
                  <Infinity className="w-3 h-3" />
                  無期限
                </span>
              )}
            </div>
            <div className="px-2 py-1 flex items-center gap-1">
              <button className="w-7 h-7 bg-gray-200 border border-gray-400 rounded flex items-center justify-center hover:bg-gray-300">
                <Pencil className="w-3.5 h-3.5 text-gray-600" />
              </button>
              <button className="w-7 h-7 bg-gray-200 border border-gray-400 rounded flex items-center justify-center hover:bg-red-100 hover:border-red-300">
                <Trash2 className="w-3.5 h-3.5 text-gray-600" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* ポイント追加モーダル */}
      {isAddModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-gray-600 rounded-lg shadow-2xl w-[420px] overflow-hidden">
            {/* モーダルヘッダー（ダークバー） */}
            <div className="bg-gray-800 px-3 py-2 flex items-center">
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="w-6 h-6 bg-gray-600 rounded-full flex items-center justify-center hover:bg-gray-500 transition-colors"
              >
                <X className="w-4 h-4 text-gray-300" />
              </button>
            </div>

            {/* モーダルボディ */}
            <div className="bg-gray-500 p-6 space-y-4">
              {/* 日付 */}
              <div className="flex items-center gap-3">
                <label className="w-24 text-right text-gray-800 text-sm font-medium">日付</label>
                <div className="flex-1 flex items-center gap-1">
                  <input
                    type="text"
                    value={formData.date}
                    onChange={(e) => handleFormChange('date', e.target.value)}
                    className="flex-1 h-8 px-2 text-sm border border-gray-400 bg-white"
                  />
                  <button className="w-8 h-8 bg-gray-300 border border-gray-400 flex items-center justify-center hover:bg-gray-200">
                    <Calendar className="w-4 h-4 text-gray-600" />
                  </button>
                </div>
              </div>

              {/* SPID */}
              <div className="flex items-center gap-3">
                <label className="w-24 text-right text-gray-800 text-sm font-medium">SPID</label>
                <div className="flex-1 flex items-center gap-2">
                  <input
                    type="text"
                    value={formData.spid}
                    onChange={(e) => handleFormChange('spid', e.target.value)}
                    className="w-12 h-8 px-2 text-sm border border-gray-400 bg-white text-center"
                  />
                  <input
                    type="text"
                    value={formData.storeName}
                    onChange={(e) => handleFormChange('storeName', e.target.value)}
                    className="flex-1 h-8 px-2 text-sm border border-gray-400 bg-white"
                  />
                </div>
              </div>

              {/* CTNo */}
              <div className="flex items-center gap-3">
                <label className="w-24 text-right text-gray-800 text-sm font-medium">CTNo</label>
                <div className="flex-1 flex items-center gap-2">
                  <input
                    type="text"
                    value={formData.ctNo}
                    onChange={(e) => handleFormChange('ctNo', e.target.value)}
                    className="w-16 h-8 px-2 text-sm border border-gray-400 bg-white text-center"
                  />
                  <input
                    type="text"
                    value={formData.customerName}
                    onChange={(e) => handleFormChange('customerName', e.target.value)}
                    className="flex-1 h-8 px-2 text-sm border border-gray-400 bg-white"
                  />
                </div>
              </div>

              {/* 売上No */}
              <div className="flex items-center gap-3">
                <label className="w-24 text-right text-gray-800 text-sm font-medium">売上No</label>
                <div className="flex-1 flex items-center gap-2">
                  <input
                    type="text"
                    value={formData.salesNo}
                    onChange={(e) => handleFormChange('salesNo', e.target.value)}
                    className="w-24 h-8 px-2 text-sm border border-gray-400 bg-white"
                  />
                  <input
                    type="text"
                    value={formData.hostessName}
                    onChange={(e) => handleFormChange('hostessName', e.target.value)}
                    className="flex-1 h-8 px-2 text-sm border border-gray-400 bg-white"
                    placeholder="ホステス名"
                  />
                </div>
              </div>

              {/* ポイント（プラス/マイナス統合） */}
              <div className="flex items-center gap-3">
                <label className="w-24 text-right text-gray-800 text-sm font-medium">ポイント</label>
                <div className="flex items-center gap-2 flex-1">
                  {/* プラス/マイナストグル */}
                  <div className="flex rounded overflow-hidden border border-gray-400">
                    <button
                      type="button"
                      onClick={() => handleFormChange('sign', 'plus')}
                      className={`px-3 h-8 text-sm font-bold transition-colors ${
                        formData.sign === 'plus'
                          ? 'bg-green-500 text-white'
                          : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
                      }`}
                    >
                      ＋
                    </button>
                    <button
                      type="button"
                      onClick={() => handleFormChange('sign', 'minus')}
                      className={`px-3 h-8 text-sm font-bold transition-colors ${
                        formData.sign === 'minus'
                          ? 'bg-red-500 text-white'
                          : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
                      }`}
                    >
                      ー
                    </button>
                  </div>
                  <input
                    type="number"
                    min="0"
                    value={formData.points}
                    onChange={(e) => handleFormChange('points', e.target.value)}
                    className={`flex-1 h-8 px-2 text-sm border border-gray-400 bg-white font-semibold ${
                      formData.sign === 'plus' ? 'text-green-700' : 'text-red-700'
                    }`}
                    placeholder="ポイント数"
                  />
                </div>
              </div>

              {/* 有効期限 */}
              <div className="flex items-start gap-3">
                <label className="w-24 text-right text-gray-800 text-sm font-medium pt-1">有効期限</label>
                <div className="flex-1 space-y-2">
                  <div className="flex flex-wrap gap-2">
                    <label className="flex items-center gap-1 text-sm">
                      <input
                        type="radio"
                        name="expiration"
                        value="unlimited"
                        checked={formData.expirationOption === 'unlimited'}
                        onChange={() => handleFormChange('expirationOption', 'unlimited')}
                        className="w-4 h-4"
                      />
                      <span className="flex items-center gap-1 text-green-700">
                        <Infinity className="w-3 h-3" />
                        無期限
                      </span>
                    </label>
                    <label className="flex items-center gap-1 text-sm">
                      <input
                        type="radio"
                        name="expiration"
                        value="3months"
                        checked={formData.expirationOption === '3months'}
                        onChange={() => handleFormChange('expirationOption', '3months')}
                        className="w-4 h-4"
                      />
                      3ヶ月
                    </label>
                    <label className="flex items-center gap-1 text-sm">
                      <input
                        type="radio"
                        name="expiration"
                        value="6months"
                        checked={formData.expirationOption === '6months'}
                        onChange={() => handleFormChange('expirationOption', '6months')}
                        className="w-4 h-4"
                      />
                      6ヶ月
                    </label>
                    <label className="flex items-center gap-1 text-sm">
                      <input
                        type="radio"
                        name="expiration"
                        value="1year"
                        checked={formData.expirationOption === '1year'}
                        onChange={() => handleFormChange('expirationOption', '1year')}
                        className="w-4 h-4"
                      />
                      1年
                    </label>
                    <label className="flex items-center gap-1 text-sm">
                      <input
                        type="radio"
                        name="expiration"
                        value="custom"
                        checked={formData.expirationOption === 'custom'}
                        onChange={() => handleFormChange('expirationOption', 'custom')}
                        className="w-4 h-4"
                      />
                      日付指定
                    </label>
                  </div>
                  {formData.expirationOption === 'custom' && (
                    <div className="flex items-center gap-1">
                      <input
                        type="text"
                        value={formData.expirationDate}
                        onChange={(e) => handleFormChange('expirationDate', e.target.value)}
                        placeholder="YYYY/MM/DD"
                        className="w-32 h-8 px-2 text-sm border border-gray-400 bg-white"
                      />
                      <button className="w-8 h-8 bg-gray-300 border border-gray-400 flex items-center justify-center hover:bg-gray-200">
                        <Calendar className="w-4 h-4 text-gray-600" />
                      </button>
                    </div>
                  )}
                </div>
              </div>

              {/* 備考 */}
              <div className="flex items-start gap-3">
                <label className="w-24 text-right text-gray-800 text-sm font-medium pt-1">備考</label>
                <textarea
                  value={formData.remarks}
                  onChange={(e) => handleFormChange('remarks', e.target.value)}
                  className="flex-1 h-24 px-2 py-1 text-sm border border-gray-400 bg-white resize-none"
                />
              </div>
            </div>

            {/* モーダルフッター */}
            <div className="bg-gray-500 px-6 pb-6 flex items-center justify-center gap-4">
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="px-12 py-2 bg-gray-400 hover:bg-gray-300 text-gray-800 text-sm font-medium rounded border border-gray-500 transition-colors"
              >
                OK
              </button>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="w-12 h-10 bg-gray-400 hover:bg-red-200 rounded border border-gray-500 flex items-center justify-center transition-colors"
              >
                <Trash2 className="w-5 h-5 text-gray-700" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
