'use client';

import React, { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ArrowLeft, Users, Search, Plus, Download } from "lucide-react";
import { useHostessLedger } from '@/hooks/use-hostess';
import { HostessLedger, WORK_STYLE_LABELS, WorkStyleType } from '@/types/hostess';

export default function HostessLedgerPage() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');

  React.useEffect(() => {
    document.title = 'ホステス台帳 - Dispatch Harmony Hub';
  }, []);
  
  // React Queryを使用してデータ取得
  const { data: hostesses = [], isLoading, error } = useHostessLedger();

  // 検索フィルタリング
  const filteredHostesses = useMemo(() => {
    if (!searchQuery) return hostesses;
    
    const q = searchQuery.toLowerCase();
    return hostesses.filter(hostess =>
      hostess.name.toLowerCase().includes(q) ||
      hostess.nameKana.toLowerCase().includes(q) ||
      hostess.hostessNumber.toLowerCase().includes(q) ||
      hostess.stageName.toLowerCase().includes(q) ||
      hostess.phoneNumber.toLowerCase().includes(q)
    );
  }, [hostesses, searchQuery]);

  const formatDate = (dateString?: string) => {
    if (!dateString) return '-';
    const date = new Date(dateString);
    return date.toLocaleDateString('ja-JP');
  };

  const getStatusLabel = (status: HostessLedger['status']) => {
    const labels = {
      active: '在籍',
      inactive: '休業',
      suspended: '停止',
      retired: '退職',
    };
    return labels[status];
  };

  const getStatusColor = (status: HostessLedger['status']) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'inactive':
        return 'bg-yellow-100 text-yellow-800';
      case 'suspended':
        return 'bg-red-100 text-red-800';
      case 'retired':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const exportToCSV = () => {
    const headers = ['ホステス番号', '氏名', '源氏名', 'カテゴリー', 'ステータス', '登録日', '最終勤務日', '総勤務日数', '総収入'];
    const csvData = filteredHostesses.map(hostess => [
      hostess.hostessNumber,
      hostess.name,
      hostess.stageName,
      hostess.category,
      getStatusLabel(hostess.status),
      formatDate(hostess.registrationDate),
      formatDate(hostess.lastWorkDate),
      hostess.totalWorkDays,
      hostess.totalEarnings,
    ]);

    const csvContent = [headers, ...csvData]
      .map(row => row.map(field => `"${field}"`).join(','))
      .join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `hostess_ledger_${new Date().toISOString().split('T')[0]}.csv`);
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
              <Users className="w-6 h-6" />
              <h1 className="text-2xl font-bold">ホステス台帳</h1>
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
                新規追加
              </Button>
              <Button variant="outline" size="sm" onClick={exportToCSV}>
                <Download className="w-4 h-4 mr-1" />
                CSV出力
              </Button>
              <div className="flex items-center gap-2">
                <Input
                  placeholder="ホステス番号・氏名・源氏名・電話番号で検索"
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
        <CardContent className="p-0">
          {isLoading ? (
            <div className="p-8 text-center text-gray-500">
              <p>読み込み中...</p>
            </div>
          ) : error ? (
            <div className="p-8 text-center text-red-500">
              <p>データの取得に失敗しました</p>
            </div>
          ) : filteredHostesses.length === 0 ? (
            <div className="p-8 text-center text-gray-500">
              <Users className="w-16 h-16 mx-auto mb-4 text-gray-300" />
              <h2 className="text-xl font-semibold mb-2">ホステスが見つかりません</h2>
              <p>検索条件を変更してください</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm border-collapse">
                <thead>
                  <tr className="bg-gray-200">
                    <th className="border border-gray-300 px-3 py-2 text-left text-xs">ホステス番号</th>
                    <th className="border border-gray-300 px-3 py-2 text-left text-xs">氏名</th>
                    <th className="border border-gray-300 px-3 py-2 text-left text-xs">源氏名</th>
                    <th className="border border-gray-300 px-3 py-2 text-left text-xs">カテゴリー</th>
                    <th className="border border-gray-300 px-3 py-2 text-left text-xs">勤務形態</th>
                    <th className="border border-gray-300 px-3 py-2 text-center text-xs">出稼ぎ</th>
                    <th className="border border-gray-300 px-3 py-2 text-left text-xs">ステータス</th>
                    <th className="border border-gray-300 px-3 py-2 text-left text-xs">登録日</th>
                    <th className="border border-gray-300 px-3 py-2 text-left text-xs">最終勤務日</th>
                    <th className="border border-gray-300 px-3 py-2 text-right text-xs">総勤務日数</th>
                    <th className="border border-gray-300 px-3 py-2 text-right text-xs">総収入</th>
                    <th className="border border-gray-300 px-3 py-2 text-left text-xs">操作</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredHostesses.map((hostess) => (
                    <tr key={hostess.id} className="hover:bg-gray-50">
                      <td className="border border-gray-300 px-3 py-2 font-mono text-xs">{hostess.hostessNumber}</td>
                      <td className="border border-gray-300 px-3 py-2 font-semibold text-xs">{hostess.name}</td>
                      <td className="border border-gray-300 px-3 py-2 text-xs">{hostess.stageName}</td>
                      <td className="border border-gray-300 px-3 py-2 text-xs">{hostess.category}</td>
                      <td className="border border-gray-300 px-3 py-2 text-xs">
                        {hostess.workStyle && (
                          <span className={`px-2 py-0.5 rounded text-xs ${
                            hostess.workStyle === 'regular' ? 'bg-blue-100 text-blue-800' :
                            hostess.workStyle === 'semi-regular' ? 'bg-cyan-100 text-cyan-800' :
                            hostess.workStyle === 'last-minute' ? 'bg-orange-100 text-orange-800' :
                            hostess.workStyle === 'newbie' ? 'bg-green-100 text-green-800' :
                            hostess.workStyle === 'emergency' ? 'bg-red-100 text-red-800' :
                            hostess.workStyle === 'irregular' ? 'bg-purple-100 text-purple-800' :
                            'bg-gray-100 text-gray-800'
                          }`}>
                            {WORK_STYLE_LABELS[hostess.workStyle]}
                          </span>
                        )}
                      </td>
                      <td className="border border-gray-300 px-3 py-2 text-center text-xs">
                        {hostess.isOutsideWork && (
                          <span className="px-2 py-0.5 rounded text-xs bg-yellow-100 text-yellow-800" title={
                            hostess.outsideWorkInfo
                              ? `交通費: ¥${hostess.outsideWorkInfo.transportationAllowance?.toLocaleString() || '-'}, 寮費: ¥${hostess.outsideWorkInfo.dormitoryFee?.toLocaleString() || '-'}`
                              : ''
                          }>
                            出稼
                          </span>
                        )}
                      </td>
                      <td className="border border-gray-300 px-3 py-2">
                        <span className={`px-2 py-0.5 rounded text-xs ${getStatusColor(hostess.status)}`}>
                          {getStatusLabel(hostess.status)}
                        </span>
                      </td>
                      <td className="border border-gray-300 px-3 py-2 text-xs">{formatDate(hostess.registrationDate)}</td>
                      <td className="border border-gray-300 px-3 py-2 text-xs">{formatDate(hostess.lastWorkDate)}</td>
                      <td className="border border-gray-300 px-3 py-2 text-right text-xs">{hostess.totalWorkDays}日</td>
                      <td className="border border-gray-300 px-3 py-2 text-right font-semibold text-xs">
                        ¥{hostess.totalEarnings.toLocaleString()}
                      </td>
                      <td className="border border-gray-300 px-3 py-2">
                        <Button variant="outline" size="sm" className="h-6 text-xs">
                          詳細
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* フッター - 統計情報 */}
      <div className="mt-4 text-sm text-gray-600">
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2">
            <span className="font-semibold">総件数:</span>
            <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded">
              {filteredHostesses.length}件
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span className="font-semibold">在籍:</span>
            <span className="bg-green-100 text-green-800 px-2 py-1 rounded">
              {filteredHostesses.filter(h => h.status === 'active').length}件
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
