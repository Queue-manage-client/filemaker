'use client';

import React, { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ArrowLeft, BarChart3, Download, TrendingUp, TrendingDown } from "lucide-react";
import { useAccountingSummary } from '@/hooks/use-accounting';
import { AccountingSummary } from '@/types/accounting';

export default function AccountingSummaryPage() {
  const router = useRouter();
  const [startDate, setStartDate] = useState<string>('');
  const [endDate, setEndDate] = useState<string>('');

  
  React.useEffect(() => {
    document.title = '会計集計 - Dispatch Harmony Hub';
  }, []);
  
  // React Queryを使用してデータ取得
  const { data: summaries = [], isLoading, error } = useAccountingSummary(
    startDate || undefined,
    endDate || undefined
  );

  // 集計データの計算
  const totals = useMemo(() => {
    return summaries.reduce(
      (acc, summary) => ({
        totalRevenue: acc.totalRevenue + summary.totalRevenue,
        totalExpense: acc.totalExpense + summary.totalExpense,
        profit: acc.profit + summary.profit,
        taxAmount: acc.taxAmount + summary.taxAmount,
        cashFlow: acc.cashFlow + summary.cashFlow,
      }),
      {
        totalRevenue: 0,
        totalExpense: 0,
        profit: 0,
        taxAmount: 0,
        cashFlow: 0,
      }
    );
  }, [summaries]);

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

  const exportToCSV = () => {
    const headers = ['日付', '総売上', '総支出', '利益', '税額', 'キャッシュフロー'];
    const csvData = summaries.map(summary => [
      formatDate(summary.date),
      summary.totalRevenue,
      summary.totalExpense,
      summary.profit,
      summary.taxAmount,
      summary.cashFlow,
    ]);

    const csvContent = [headers, ...csvData]
      .map(row => row.map(field => `"${field}"`).join(','))
      .join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `accounting_summary_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
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
      <Card className="mb-4">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <BarChart3 className="w-6 h-6" />
              <h1 className="text-2xl font-bold">会計集計</h1>
            </div>
            <div className="flex items-center gap-4">
              {error && (
                <span className="text-red-600 text-sm">データ取得に失敗しました</span>
              )}
              {isLoading && (
                <span className="text-gray-600 text-sm">読み込み中...</span>
              )}
              <Button variant="outline" size="sm" onClick={exportToCSV}>
                <Download className="w-4 h-4 mr-1" />
                CSV出力
              </Button>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* 期間フィルター */}
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
          </div>
        </CardContent>
      </Card>

      {/* 集計サマリー */}
      {summaries.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">総売上</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">
                {formatCurrency(totals.totalRevenue)}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">総支出</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">
                {formatCurrency(totals.totalExpense)}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">利益</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">
                {formatCurrency(totals.profit)}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">税額</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-600">
                {formatCurrency(totals.taxAmount)}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">キャッシュフロー</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-purple-600">
                {formatCurrency(totals.cashFlow)}
              </div>
            </CardContent>
          </Card>
        </div>
      )}

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
          ) : summaries.length === 0 ? (
            <div className="p-8 text-center text-gray-500">
              <BarChart3 className="w-16 h-16 mx-auto mb-4 text-gray-300" />
              <h2 className="text-xl font-semibold mb-2">データが見つかりません</h2>
              <p>期間を変更してください</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm border-collapse">
                <thead>
                  <tr className="bg-gray-200">
                    <th className="border border-gray-300 px-4 py-3 text-left">日付</th>
                    <th className="border border-gray-300 px-4 py-3 text-right">総売上</th>
                    <th className="border border-gray-300 px-4 py-3 text-right">総支出</th>
                    <th className="border border-gray-300 px-4 py-3 text-right">利益</th>
                    <th className="border border-gray-300 px-4 py-3 text-right">税額</th>
                    <th className="border border-gray-300 px-4 py-3 text-right">キャッシュフロー</th>
                  </tr>
                </thead>
                <tbody>
                  {summaries.map((summary) => (
                    <tr key={summary.id} className="hover:bg-gray-50">
                      <td className="border border-gray-300 px-4 py-3">
                        {formatDate(summary.date)}
                      </td>
                      <td className="border border-gray-300 px-4 py-3 text-right font-semibold text-green-600">
                        {formatCurrency(summary.totalRevenue)}
                      </td>
                      <td className="border border-gray-300 px-4 py-3 text-right font-semibold text-red-600">
                        {formatCurrency(summary.totalExpense)}
                      </td>
                      <td className="border border-gray-300 px-4 py-3 text-right font-semibold text-blue-600">
                        {formatCurrency(summary.profit)}
                      </td>
                      <td className="border border-gray-300 px-4 py-3 text-right">
                        {formatCurrency(summary.taxAmount)}
                      </td>
                      <td className="border border-gray-300 px-4 py-3 text-right font-semibold text-purple-600">
                        {formatCurrency(summary.cashFlow)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
