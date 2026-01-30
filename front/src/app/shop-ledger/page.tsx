'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ArrowLeft, Search, Plus, Download, Building } from "lucide-react";
import { useShopList } from '@/hooks/use-shop';

export default function ShopLedger() {
  const [searchQuery, setSearchQuery] = useState('');

  React.useEffect(() => {
    document.title = '店舗台帳 - Dispatch Harmony Hub';
  }, []);
  
  // React Queryを使用してデータ取得
  const { data: shops = [], isLoading, error } = useShopList();

  // 検索フィルタリング
  const filteredShops = useMemo(() => {
    if (!searchQuery) return shops;
    
    const q = searchQuery.toLowerCase();
    return shops.filter(shop => {
      const storeName = shop.store_name?.toLowerCase() || '';
      const storeNameFurigana = shop.store_name_furigana?.toLowerCase() || '';
      const storeNameShort = shop.store_name_short?.toLowerCase() || '';
      const spid = shop.spid?.toString() || '';
      return (
        storeName.includes(q) ||
        storeNameFurigana.includes(q) ||
        storeNameShort.includes(q) ||
        spid.includes(q)
      );
    });
  }, [shops, searchQuery]);

  const formatDateTime = (dateTimeString: string | null) => {
    if (!dateTimeString) return '';
    // ISO形式の場合（2024-01-10T09:00:00+09:00）
    if (dateTimeString.includes('T')) {
      const [datePart, timePart] = dateTimeString.split('T');
      const timeOnly = timePart ? timePart.split(/[+\-Z]/)[0] : '';
      return `${datePart.replace(/-/g, '/')} ${timeOnly}`;
    }
    // すでに 'YYYY-MM-DD HH:MM:SS' 形式の場合
    const [datePart, timePart] = dateTimeString.split(' ');
    if (datePart && timePart) {
      return `${datePart.replace(/-/g, '/')} ${timePart}`;
    }
    // 日付のみの場合
    return dateTimeString.replace(/-/g, '/');
  };

  const formatBusinessStyle = (style: string | null) => {
    if (!style) return '-';
    switch (style) {
      case 'delivery_health':
        return 'デリヘル';
      case 'hotel_health':
        return 'ホテヘル';
      default:
        return style;
    }
  };

  const _formatExtensionStyle = (style: string | null) => {
    if (!style) return '-';
    switch (style) {
      case 'fixed_rate':
        return '固定割合制';
      case 'hostess_specific':
        return 'ホステス別';
      default:
        return style;
    }
  };

  const formatBoolean = (value: boolean | null) => {
    if (value === null) return '-';
    return value ? '○' : '-';
  };

  const exportToCSV = () => {
    // CSVエクスポート機能
    const headers = [
      'No', 'SPID', '店舗名', '店舗名（省略）', '部門No', '会計区分',
      '事業形態', 'web連携', 'GM区分', '会員カード', '作成日時', '更新日時'
    ];

    const csvData = filteredShops.map((shop, index) => [
      index + 1,
      shop.spid || '',
      shop.store_name || '',
      shop.store_name_short || '',
      shop.department_no || '',
      shop.accounting_category || '',
      formatBusinessStyle(shop.business_style),
      formatBoolean(shop.is_web),
      formatBoolean(shop.gm_category),
      formatBoolean(shop.is_membership_card),
      formatDateTime(shop.created_at),
      formatDateTime(shop.updated_at)
    ]);

    const csvContent = [headers, ...csvData]
      .map(row => row.map(field => `"${field}"`).join(','))
      .join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `shop_ledger_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const openShopDetailWindow = (id: string) => {
    try {
      const url = `/shop-ledger/${id}`;
      const features = 'noopener,noreferrer,width=1280,height=900,scrollbars=yes,resizable=yes';
      window.open(url, `shopDetail_${id}`, features);
    } catch {
      // UI_001: failed to open shop detail window
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* 戻るボタン */}
      <div className="p-4">
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
      <div className="px-4 mb-4">
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Building className="w-6 h-6" />
                <h1 className="text-xl font-bold">店舗台帳</h1>
              </div>
              {error && (
                <span className="text-red-600 text-sm">データ取得に失敗しました</span>
              )}
              {isLoading && (
                <span className="text-gray-600 text-sm">読み込み中...</span>
              )}

              <div className="flex items-center gap-4">
                {/* 新規追加ボタン */}
                <Button variant="outline" size="sm" className="bg-green-100">
                  <Plus className="w-4 h-4 mr-1" />
                  新規追加
                </Button>

                {/* CSVエクスポート */}
                <Button variant="outline" size="sm" onClick={exportToCSV}>
                  <Download className="w-4 h-4 mr-1" />
                  CSV出力
                </Button>

                {/* 検索 */}
                <div className="flex items-center gap-2">
                  <Input
                    placeholder="店舗名・SPIDで検索"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-64"
                  />
                  <Button variant="outline" size="sm">
                    <Search className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>
          </CardHeader>
        </Card>
      </div>

      {/* メインコンテンツ */}
      <div className="px-4">
        <Card>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full text-xs border-collapse">
                <thead>
                  <tr className="bg-gray-200">
                    <th className="border border-gray-300 px-1 py-2 w-8">No</th>
                    <th className="border border-gray-300 px-2 py-2 w-20">SPID</th>
                    <th className="border border-gray-300 px-2 py-2 w-32">店舗名</th>
                    <th className="border border-gray-300 px-2 py-2 w-24">店舗名（省略）</th>
                    <th className="border border-gray-300 px-2 py-2 w-16">部門No</th>
                    <th className="border border-gray-300 px-2 py-2 w-20">会計区分</th>
                    <th className="border border-gray-300 px-2 py-2 w-20">事業形態</th>
                    <th className="border border-gray-300 px-2 py-2 w-16">web連携</th>
                    <th className="border border-gray-300 px-2 py-2 w-16">GM区分</th>
                    <th className="border border-gray-300 px-2 py-2 w-20">会員カード</th>
                    <th className="border border-gray-300 px-2 py-2 w-24">電話番号</th>
                    <th className="border border-gray-300 px-2 py-2 w-32">作成日時</th>
                    <th className="border border-gray-300 px-2 py-2 w-32">更新日時</th>
                    <th className="border border-gray-300 px-2 py-2 w-20">操作</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredShops.length === 0 && !isLoading && (
                    <tr>
                      <td colSpan={14} className="border border-gray-300 px-2 py-8 text-center text-gray-500">
                        データがありません
                      </td>
                    </tr>
                  )}
                  {filteredShops.map((shop, index) => (
                    <tr key={shop.id} className="hover:bg-gray-50">
                      <td className="border border-gray-300 px-1 py-2 text-center font-semibold">
                        {index + 1}
                      </td>
                      <td className="border border-gray-300 px-2 py-2 text-center font-mono">
                        {shop.spid || '-'}
                      </td>
                      <td className="border border-gray-300 px-2 py-2 font-semibold">
                        {shop.store_name || '-'}
                      </td>
                      <td className="border border-gray-300 px-2 py-2">
                        {shop.store_name_short || '-'}
                      </td>
                      <td className="border border-gray-300 px-2 py-2 text-center">
                        {shop.department_no || '-'}
                      </td>
                      <td className="border border-gray-300 px-2 py-2 text-center">
                        {shop.accounting_category || '-'}
                      </td>
                      <td className="border border-gray-300 px-2 py-2 text-center">
                        <span className={`px-2 py-1 rounded text-xs ${
                          shop.business_style === 'delivery_health'
                            ? 'bg-blue-100 text-blue-800'
                            : shop.business_style === 'hotel_health'
                            ? 'bg-purple-100 text-purple-800'
                            : 'bg-gray-100 text-gray-800'
                        }`}>
                          {formatBusinessStyle(shop.business_style)}
                        </span>
                      </td>
                      <td className="border border-gray-300 px-2 py-2 text-center">
                        {formatBoolean(shop.is_web)}
                      </td>
                      <td className="border border-gray-300 px-2 py-2 text-center">
                        {formatBoolean(shop.gm_category)}
                      </td>
                      <td className="border border-gray-300 px-2 py-2 text-center">
                        {formatBoolean(shop.is_membership_card)}
                      </td>
                      <td className="border border-gray-300 px-2 py-2 text-center font-mono text-xs">
                        {shop.phone_number || '-'}
                      </td>
                      <td className="border border-gray-300 px-2 py-2 text-center font-mono text-xs">
                        {formatDateTime(shop.created_at)}
                      </td>
                      <td className="border border-gray-300 px-2 py-2 text-center font-mono text-xs">
                        {formatDateTime(shop.updated_at)}
                      </td>
                      <td className="border border-gray-300 px-2 py-2 text-center">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => openShopDetailWindow(shop.id)}
                        >
                          編集
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* フッター - 統計情報 */}
      <div className="p-4 mt-4">
        <div className="flex flex-wrap items-center gap-6 text-xs text-gray-600">
          <div className="flex items-center gap-2">
            <span className="font-semibold">総件数:</span>
            <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded">
              {filteredShops.length}件
            </span>
          </div>

          <div className="flex items-center gap-2">
            <span className="font-semibold">デリヘル:</span>
            <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded">
              {filteredShops.filter(s => s.business_style === 'delivery_health').length}件
            </span>
          </div>

          <div className="flex items-center gap-2">
            <span className="font-semibold">ホテヘル:</span>
            <span className="bg-purple-100 text-purple-800 px-2 py-1 rounded">
              {filteredShops.filter(s => s.business_style === 'hotel_health').length}件
            </span>
          </div>

          <div className="flex items-center gap-2">
            <span className="font-semibold">web連携:</span>
            <span className="bg-green-100 text-green-800 px-2 py-1 rounded">
              {filteredShops.filter(s => s.is_web === true).length}件
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

