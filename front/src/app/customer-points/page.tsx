'use client';

import React, { useMemo, useState } from 'react';

import { useRouter } from 'next/navigation';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { ArrowLeft, Award, Download, Search } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { useCustomerPoints } from '@/hooks/use-customer-points';
import { useCustomers } from '@/hooks/use-customer';

type RowData = {
  id: string;
  customerNumber: string;
  indexNo: number;
  nameKana: string;
  name: string;
  pointBalance: number;
  pointBalanceTemp: number;
  diff: number;
  phoneNumber: string;
  memo?: string;
  ctid?: string;
};

export default function CustomerPoints() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');

  React.useEffect(() => {
    document.title = '顧客ポイント - Dispatch Harmony Hub';
  }, []);
  
  // React Queryを使用してデータ取得
  const { data: customerPoints = [], isLoading: isLoadingPoints, error: errorPoints } = useCustomerPoints();
  const { data: customers = [], isLoading: isLoadingCustomers } = useCustomers();

  const rows: RowData[] = useMemo(() => {
    const customerById = new Map(customers.map(c => [c.id, c]));
    return customerPoints.map((p, idx) => {
      const customer = customerById.get(p.customerId);
      const pointBalance = p.currentPoints ?? 0;
      const pointBalanceTemp = pointBalance; // 仮: 現状は同値
      const diff = pointBalanceTemp - pointBalance;
      return {
        id: p.id,
        customerNumber: customer?.customerNumber ?? '-',
        indexNo: idx + 1,
        nameKana: customer?.nameKana ?? p.customerName ?? '-',
        name: customer?.name ?? p.customerName ?? '-',
        pointBalance,
        pointBalanceTemp,
        diff,
        phoneNumber: customer?.phoneNumber ?? '-',
        memo: customer?.notes ?? '',
        ctid: undefined,
      };
    });
  }, [customerPoints, customers]);

  // 検索フィルタリング
  const filteredRows = useMemo(() => {
    if (!searchQuery) return rows;
    const q = searchQuery.toLowerCase();
    return rows.filter(row =>
      row.customerNumber.toLowerCase().includes(q) ||
      row.nameKana.toLowerCase().includes(q) ||
      row.name.toLowerCase().includes(q) ||
      row.phoneNumber.toLowerCase().includes(q)
    );
  }, [rows, searchQuery]);

  const exportToCSV = () => {
    const headers = ['顧客番号', 'No', '氏名ふりがな', '氏名', 'ポイント残高', 'ポイント残高temp', '差額', '電話番号', 'メモ'];
    const csvData = filteredRows.map(row => [
      row.customerNumber,
      row.indexNo,
      row.nameKana,
      row.name,
      row.pointBalance,
      row.pointBalanceTemp,
      row.diff,
      row.phoneNumber,
      row.memo || '',
    ]);

    const csvContent = [headers, ...csvData]
      .map(row => row.map(field => `"${field}"`).join(','))
      .join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `customer_points_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const isLoading = isLoadingPoints || isLoadingCustomers;
  const error = errorPoints;

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
              <Award className="w-6 h-6" />
              <h1 className="text-2xl font-bold">顧客ポイント</h1>
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
              <div className="flex items-center gap-2">
                <Input
                  placeholder="顧客番号・氏名・電話番号で検索"
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

      {/* メイン：横スクロール可能なポイントリスト */}
      <Card>
        <CardContent className="p-4">
          <div className="overflow-x-auto">
            <Table className="min-w-[1400px] table-fixed text-xs whitespace-nowrap">
              <TableHeader>
                <TableRow className="h-10">
                  <TableHead className="w-[110px] px-2 text-center">操作</TableHead>
                  <TableHead className="w-[140px] px-2">顧客番号</TableHead>
                  <TableHead className="w-[60px] px-2 text-center">No</TableHead>
                  <TableHead className="w-[160px] px-2">氏名ふりがな</TableHead>
                  <TableHead className="w-[140px] px-2">氏名</TableHead>
                  <TableHead className="w-[130px] px-2 text-right">ポイント残高</TableHead>
                  <TableHead className="w-[150px] px-2 text-right">ポイント残高temp</TableHead>
                  <TableHead className="w-[100px] px-2 text-right">差額</TableHead>
                  <TableHead className="w-[150px] px-2">電話番号</TableHead>
                  <TableHead className="w-[220px] px-2">メモ</TableHead>
                  <TableHead className="w-[120px] px-2">CTID</TableHead>
                  <TableHead className="w-[60px] px-2"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  <TableRow>
                    <TableCell colSpan={12} className="text-center py-8 text-gray-500">
                      読み込み中...
                    </TableCell>
                  </TableRow>
                ) : error ? (
                  <TableRow>
                    <TableCell colSpan={12} className="text-center py-8 text-red-500">
                      データの取得に失敗しました
                    </TableCell>
                  </TableRow>
                ) : filteredRows.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={12} className="text-center py-8 text-gray-500">
                      データが見つかりません
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredRows.map((row) => (
                  <TableRow key={row.id} className="h-9">
                    <TableCell className="px-2">
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline" className="h-7 px-3">C</Button>
                        <Button size="sm" variant="outline" className="h-7 px-3">P</Button>
                        <Button size="sm" variant="outline" className="h-7 px-3">売</Button>
                      </div>
                    </TableCell>
                    <TableCell className="px-2 font-mono">{row.customerNumber}</TableCell>
                    <TableCell className="px-2 text-center">{row.indexNo}</TableCell>
                    <TableCell className="px-2">{row.nameKana}</TableCell>
                    <TableCell className="px-2">{row.name}</TableCell>
                    <TableCell className="px-2 text-right font-mono">{row.pointBalance.toLocaleString()}</TableCell>
                    <TableCell className="px-2 text-right font-mono">{row.pointBalanceTemp.toLocaleString()}</TableCell>
                    <TableCell className="px-2 text-right font-mono">{row.diff.toLocaleString()}</TableCell>
                    <TableCell className="px-2">{row.phoneNumber}</TableCell>
                    <TableCell className="px-2 truncate max-w-[220px]" title={row.memo || ''}>{row.memo}</TableCell>
                    <TableCell className="px-2 font-mono">{row.ctid ?? ''}</TableCell>
                    <TableCell className="px-2"></TableCell>
                  </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
