'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ArrowLeft, DollarSign, Download, Plus, Search } from "lucide-react";
import { useSalesSlips } from '@/hooks/use-accounting';
import { SalesSlip } from '@/types/accounting';

export default function SalesSlipPage() {
  const [startDate, setStartDate] = useState<string>('');
  const [endDate, setEndDate] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState('');

  React.useEffect(() => {
    document.title = '売上伝票 - Dispatch Harmony Hub';
  }, []);
  
  // React Queryを使用してデータ取得
  const { data: salesSlips = [], isLoading, error } = useSalesSlips(
    startDate || undefined,
    endDate || undefined
  );

  // 検索フィルタリング
  const filteredSlips = useMemo(() => {
    if (!searchQuery) return salesSlips;
    const q = searchQuery.toLowerCase();
    return salesSlips.filter(slip =>
      slip.customerName.toLowerCase().includes(q) ||
      (slip.hostessName && slip.hostessName.toLowerCase().includes(q)) ||
      slip.driverName.toLowerCase().includes(q) ||
      slip.serviceType.toLowerCase().includes(q)
    );
  }, [salesSlips, searchQuery]);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('ja-JP', {
      style: 'currency',
      currency: 'JPY',
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('ja-JP');
  };

  const getServiceTypeLabel = (type: SalesSlip['serviceType']) => {
    const labels = {
      pickup: '迎え',
      delivery: '送り',
      escort: '同伴',
      waiting: '待機',
      other: 'その他',
    };
    return labels[type];
  };

  const exportToCSV = () => {
    const headers = ['日付', '顧客名', 'ホステス名', 'ドライバー名', 'サービス種別', '時間', '距離', '総額', '支払い方法'];
    const csvData = filteredSlips.map(slip => [
      formatDate(slip.date),
      slip.customerName,
      slip.hostessName || '',
      slip.driverName,
      getServiceTypeLabel(slip.serviceType),
      slip.duration,
      slip.distance || '',
      slip.totalAmount,
      slip.paymentMethod,
    ]);

    const csvContent = [headers, ...csvData]
      .map(row => row.map(field => `"${field}"`).join(','))
      .join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `sales_slip_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
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
      <Card className="mb-4">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <DollarSign className="w-6 h-6" />
              <h1 className="text-2xl font-bold">売上伝票</h1>
            </div>
            <div className="flex items-center gap-4">
              {error && (
                <span className="text-red-600 text-sm">データ取得に失敗しました</span>
              )}
              {isLoading && (
                <span className="text-gray-600 text-sm">読み込み中...</span>
              )}
              <Button variant="outline" size="sm" className="bg-green-100">
                <Plus className="w-4 h-4 mr-1" />
                新規作成
              </Button>
              <Button variant="outline" size="sm" onClick={exportToCSV}>
                <Download className="w-4 h-4 mr-1" />
                CSV出力
              </Button>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* フィルター */}
      <Card className="mb-4">
        <CardContent className="p-4">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <label className="text-sm font-medium">開始日:</label>
              <Input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-40"
              />
            </div>
            <div className="flex items-center gap-2">
              <label className="text-sm font-medium">終了日:</label>
              <Input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="w-40"
              />
            </div>
            <div className="flex items-center gap-2">
              <Input
                placeholder="顧客名・ホステス名・ドライバー名で検索"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-64"
              />
              <Button variant="outline" size="sm">
                <Search className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* メインコンテンツ */}
      <Card>
        <CardContent className="p-0">
          {isLoading ? (
            <div className="p-8 text-center text-gray-500">
              <p>読み込み中...</p>
            </div>
          ) : error ? (
            <div className="p-8 text-center text-red-500">
              <p>データの取得に失敗しました</p>
            </div>
          ) : filteredSlips.length === 0 ? (
            <div className="p-8 text-center text-gray-500">
              <DollarSign className="w-16 h-16 mx-auto mb-4 text-gray-300" />
              <h2 className="text-xl font-semibold mb-2">データが見つかりません</h2>
              <p>期間や検索条件を変更してください</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm border-collapse">
                <thead>
                  <tr className="bg-gray-200">
                    <th className="border border-gray-300 px-4 py-3 text-left">日付</th>
                    <th className="border border-gray-300 px-4 py-3 text-left">顧客名</th>
                    <th className="border border-gray-300 px-4 py-3 text-left">ホステス名</th>
                    <th className="border border-gray-300 px-4 py-3 text-left">ドライバー名</th>
                    <th className="border border-gray-300 px-4 py-3 text-left">サービス種別</th>
                    <th className="border border-gray-300 px-4 py-3 text-right">時間（分）</th>
                    <th className="border border-gray-300 px-4 py-3 text-right">距離（km）</th>
                    <th className="border border-gray-300 px-4 py-3 text-right">基本料金</th>
                    <th className="border border-gray-300 px-4 py-3 text-right">時間料金</th>
                    <th className="border border-gray-300 px-4 py-3 text-right">距離料金</th>
                    <th className="border border-gray-300 px-4 py-3 text-right">通行料</th>
                    <th className="border border-gray-300 px-4 py-3 text-right">その他</th>
                    <th className="border border-gray-300 px-4 py-3 text-right">総額</th>
                    <th className="border border-gray-300 px-4 py-3 text-left">支払い方法</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredSlips.map((slip) => {
                    const paymentMethodLabels = {
                      cash: '現金',
                      card: 'カード',
                      transfer: '振込',
                      other: 'その他',
                    };
                    return (
                      <tr key={slip.id} className="hover:bg-gray-50">
                        <td className="border border-gray-300 px-4 py-3">{formatDate(slip.date)}</td>
                        <td className="border border-gray-300 px-4 py-3 font-semibold">{slip.customerName}</td>
                        <td className="border border-gray-300 px-4 py-3">{slip.hostessName || '-'}</td>
                        <td className="border border-gray-300 px-4 py-3">{slip.driverName}</td>
                        <td className="border border-gray-300 px-4 py-3">{getServiceTypeLabel(slip.serviceType)}</td>
                        <td className="border border-gray-300 px-4 py-3 text-right">{slip.duration}</td>
                        <td className="border border-gray-300 px-4 py-3 text-right">{slip.distance || '-'}</td>
                        <td className="border border-gray-300 px-4 py-3 text-right">{formatCurrency(slip.baseAmount)}</td>
                        <td className="border border-gray-300 px-4 py-3 text-right">{formatCurrency(slip.timeCharge)}</td>
                        <td className="border border-gray-300 px-4 py-3 text-right">{formatCurrency(slip.distanceCharge)}</td>
                        <td className="border border-gray-300 px-4 py-3 text-right">{formatCurrency(slip.tollFee)}</td>
                        <td className="border border-gray-300 px-4 py-3 text-right">{formatCurrency(slip.otherFees)}</td>
                        <td className="border border-gray-300 px-4 py-3 text-right font-semibold text-green-600">
                          {formatCurrency(slip.totalAmount)}
                        </td>
                        <td className="border border-gray-300 px-4 py-3">{paymentMethodLabels[slip.paymentMethod]}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* フッター - 統計情報 */}
      {filteredSlips.length > 0 && (
        <div className="mt-4 text-sm text-gray-600">
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
              <span className="font-semibold">総件数:</span>
              <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded">
                {filteredSlips.length}件
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className="font-semibold">総売上:</span>
              <span className="bg-green-100 text-green-800 px-2 py-1 rounded font-semibold">
                {formatCurrency(filteredSlips.reduce((sum, slip) => sum + slip.totalAmount, 0))}
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
