'use client';

import React, { useState, useMemo } from 'react';

import { useRouter } from 'next/navigation';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ArrowLeft, Calendar, Search, Download } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useHostessManagers } from '@/hooks/use-hostess';
import { HostessManagerListItem } from '@/types/hostess';

export default function HostessManagerList() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');

  React.useEffect(() => {
    document.title = 'ホステスマネージャリスト - Dispatch Harmony Hub';
  }, []);
  
  // React Queryを使用してデータ取得
  const { data: managers = [], isLoading, error } = useHostessManagers();

  // データをHostessManagerListItem形式に変換
  const managerListItems: HostessManagerListItem[] = useMemo(() => {
    return managers.map((manager, index) => ({
      no: index + 1,
      name: manager.name,
      standardHours: 0, // 基準時間は別途計算が必要
      peopleCount: manager.totalManagedHostesses,
    }));
  }, [managers]);

  // 検索フィルタリング
  const filteredManagers = useMemo(() => {
    if (!searchQuery) return managerListItems;
    const q = searchQuery.toLowerCase();
    return managerListItems.filter(manager =>
      manager.name.toLowerCase().includes(q)
    );
  }, [managerListItems, searchQuery]);

  const exportToCSV = () => {
    const headers = ['No', '氏名', '基準時間', '人数'];
    const csvData = filteredManagers.map(manager => [
      manager.no,
      manager.name,
      manager.standardHours,
      manager.peopleCount,
    ]);

    const csvContent = [headers, ...csvData]
      .map(row => row.map(field => `"${field}"`).join(','))
      .join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `hostess_manager_list_${new Date().toISOString().split('T')[0]}.csv`);
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
              <Calendar className="w-6 h-6" />
              <h1 className="text-2xl font-bold">ホステスマネージャリスト</h1>
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
                  placeholder="氏名で検索"
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

      {/* メインコンテンツ */}
      <Card>
        <CardContent className="p-4">
          {isLoading ? (
            <div className="text-center py-8 text-gray-500">
              読み込み中...
            </div>
          ) : error ? (
            <div className="text-center py-8 text-red-500">
              データの取得に失敗しました
            </div>
          ) : filteredManagers.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              データが見つかりません
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-20">No</TableHead>
                    <TableHead>氏名</TableHead>
                    <TableHead className="w-32">基準時間</TableHead>
                    <TableHead className="w-24">人数</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredManagers.map((row) => (
                    <TableRow key={row.no}>
                      <TableCell>{row.no}</TableCell>
                      <TableCell>{row.name}</TableCell>
                      <TableCell>{row.standardHours}</TableCell>
                      <TableCell>{row.peopleCount}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

