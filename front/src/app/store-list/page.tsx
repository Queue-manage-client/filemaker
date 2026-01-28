'use client';

import React, { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ArrowLeft, Edit3, Search, Plus, Download } from "lucide-react";
import { useStoreList } from '@/hooks/use-store';

export default function StoreList() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');

  React.useEffect(() => {
    document.title = '各店リスト - Dispatch Harmony Hub';
  }, []);
  
  // React Queryを使用してデータ取得
  const { data: stores = [], isLoading, error } = useStoreList();

  // 検索フィルタリング
  const filteredStores = useMemo(() => {
    if (!searchQuery) return stores;
    
    const q = searchQuery.toLowerCase();
    return stores.filter(store =>
      store.storeName.toLowerCase().includes(q) ||
      store.id.toLowerCase().includes(q) ||
      (store.address && store.address.toLowerCase().includes(q))
    );
  }, [stores, searchQuery]);

  const _formatDate = (dateString?: string) => {
    if (!dateString) return '-';
    const date = new Date(dateString);
    return date.toLocaleDateString('ja-JP');
  };

  const exportToCSV = () => {
    const headers = ['店舗ID', '店舗名', '住所', '電話番号'];
    const csvData = filteredStores.map(store => [
      store.id,
      store.storeName,
      store.address || '',
      store.phoneNumber || '',
    ]);

    const csvContent = [headers, ...csvData]
      .map(row => row.map(field => `"${field}"`).join(','))
      .join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `store_list_${new Date().toISOString().split('T')[0]}.csv`);
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
              <Edit3 className="w-6 h-6" />
              <h1 className="text-2xl font-bold">各店リスト</h1>
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
                  placeholder="店舗名・ID・住所で検索"
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
          ) : filteredStores.length === 0 ? (
            <div className="p-8 text-center text-gray-500">
              <Edit3 className="w-16 h-16 mx-auto mb-4 text-gray-300" />
              <h2 className="text-xl font-semibold mb-2">店舗が見つかりません</h2>
              <p>検索条件を変更してください</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm border-collapse">
                <thead>
                  <tr className="bg-gray-200">
                    <th className="border border-gray-300 px-4 py-3 text-left">店舗ID</th>
                    <th className="border border-gray-300 px-4 py-3 text-left">店舗名</th>
                    <th className="border border-gray-300 px-4 py-3 text-left">住所</th>
                    <th className="border border-gray-300 px-4 py-3 text-left">電話番号</th>
                    <th className="border border-gray-300 px-4 py-3 text-left">操作</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredStores.map((store) => (
                    <tr key={store.id} className="hover:bg-gray-50">
                      <td className="border border-gray-300 px-4 py-3 font-mono">{store.id}</td>
                      <td className="border border-gray-300 px-4 py-3 font-semibold">
                        {store.storeName}
                      </td>
                      <td className="border border-gray-300 px-4 py-3">{store.address || '-'}</td>
                      <td className="border border-gray-300 px-4 py-3">{store.phoneNumber || '-'}</td>
                      <td className="border border-gray-300 px-4 py-3">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => router.push(`/store-ledger?store=${store.storeName}`)}
                        >
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
              {filteredStores.length}件
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

