'use client';

import React, { useMemo, useState } from 'react';
import Link from 'next/link';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { ArrowLeft, DollarSign, Plus } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";
import { useExpenseSlips } from '@/hooks/use-accounting';
import type { ExpenseSlip } from '@/types/accounting';

export default function ExpenseSlip() {
  const [startDate, setStartDate] = useState<string>('');
  const [endDate, setEndDate] = useState<string>('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');

  React.useEffect(() => {
    document.title = '出金伝票 - Dispatch Harmony Hub';
  }, []);
  
  // React Queryを使用してデータ取得
  const { data: expenseSlips = [], isLoading, error } = useExpenseSlips(
    startDate || undefined,
    endDate || undefined
  );

  // フィルタリング
  const filteredSlips = useMemo(() => {
    let filtered = expenseSlips;
    if (categoryFilter !== 'all') {
      filtered = filtered.filter(slip => slip.category === categoryFilter);
    }
    return filtered;
  }, [expenseSlips, categoryFilter]);

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
        <CardHeader className="bg-blue-50">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <DollarSign className="w-6 h-6 text-blue-600" />
              <h1 className="text-2xl font-bold text-blue-700">出金伝票</h1>
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
              <label className="text-sm font-medium">カテゴリー:</label>
              <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                <SelectTrigger className="w-40">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">全て</SelectItem>
                  <SelectItem value="fuel">燃料費</SelectItem>
                  <SelectItem value="maintenance">車両維持費</SelectItem>
                  <SelectItem value="insurance">保険料</SelectItem>
                  <SelectItem value="salary">給与</SelectItem>
                  <SelectItem value="toll">通行料</SelectItem>
                  <SelectItem value="other">その他</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* メインコンテンツ（左右2カラム） */}
      <Card>
        <CardContent className="p-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* 左カラム：入力エリア（出金版） */}
            <div className="space-y-4">
              <div className="rounded-md border bg-white p-4">
                <div className="grid grid-cols-12 gap-3 items-center">
                  {/* 右上：記帳/会計確認/会計区分 */}
                  <div className="col-span-12">
                    <div className="flex flex-wrap md:flex-nowrap justify-end gap-2 gap-y-1">
                      <div className="flex items-center gap-1 text-sm">
                        <span className="text-muted-foreground whitespace-nowrap">記帳</span>
                        <Input className="w-24" />
                        <Input className="w-32" />
                      </div>
                      <div className="flex items-center gap-1 text-sm">
                        <span className="text-muted-foreground whitespace-nowrap">会計確認</span>
                        <Input className="w-20" />
                      </div>
                      <div className="flex items-center gap-1 text-sm">
                        <span className="text-muted-foreground whitespace-nowrap">会計区分</span>
                        <Input className="w-16" />
                      </div>
                    </div>
                  </div>

                  {/* SPID */}
                  <div className="col-span-3 text-sm text-muted-foreground">SPID</div>
                  <div className="col-span-3"><Input placeholder="番号" /></div>
                  <div className="col-span-6"><Input placeholder="コード" /></div>

                  {/* 伝票日付 */}
                  <div className="col-span-3 text-sm text-muted-foreground">伝票日付</div>
                  <div className="col-span-9"><Input type="date" /></div>

                  {/* 科目 + 金額 */}
                  <div className="col-span-3 text-sm text-muted-foreground">科目</div>
                  <div className="col-span-6">
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="選択" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="cash">支出／現金</SelectItem>
                        <SelectItem value="card">支出／カード</SelectItem>
                        <SelectItem value="other">その他支出</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="col-span-3">
                    <Input inputMode="decimal" placeholder="金額" className="text-right" />
                  </div>

                  {/* 出金者 */}
                  <div className="col-span-3 text-sm text-muted-foreground">出金者</div>
                  <div className="col-span-9"><Input /></div>

                  {/* 出金ホステス */}
                  <div className="col-span-3 text-sm text-muted-foreground">出金ホステス</div>
                  <div className="col-span-9"><Input /></div>

                  {/* 出金元 */}
                  <div className="col-span-3 text-sm text-muted-foreground">出金元</div>
                  <div className="col-span-9"><Input /></div>

                  {/* ふりがな */}
                  <div className="col-span-3 text-sm text-muted-foreground">ふりがな</div>
                  <div className="col-span-9"><Input /></div>

                  {/* 電話 */}
                  <div className="col-span-3 text-sm text-muted-foreground">電話</div>
                  <div className="col-span-9"><Input /></div>

                  {/* 内容 */}
                  <div className="col-span-3 text-sm text-muted-foreground">内容</div>
                  <div className="col-span-9"><Textarea rows={2} /></div>

                  {/* 備考 */}
                  <div className="col-span-3 text-sm text-muted-foreground">備考</div>
                  <div className="col-span-9"><Textarea rows={2} /></div>

                  {/* アクション */}
                  <div className="col-span-12 flex items-center justify-between pt-2">
                    <Button size="sm" className="bg-blue-600 text-white hover:bg-blue-600/90">出金</Button>
                    <Button size="sm" variant="destructive" className="w-24">転記</Button>
                  </div>
                </div>
              </div>
            </div>

            {/* 右カラム：明細（出金版） */}
            <div className="space-y-4">
              <div className="rounded-md border bg-white p-4">
                <div className="grid grid-cols-1 md:grid-cols-5 gap-4 items-center">
                  {/* 日付 */}
                  <div className="md:col-span-2">
                    <Input type="date" />
                  </div>
                  {/* 支出区分 */}
                  <div className="md:col-span-3">
                    <Select defaultValue="cash">
                      <SelectTrigger>
                        <SelectValue placeholder="支出区分を選択" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="cash">現金支出</SelectItem>
                        <SelectItem value="card">カード支出</SelectItem>
                        <SelectItem value="other">その他</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="mt-4">
                  <Table>
                    <TableHeader className="bg-blue-50">
                      <TableRow>
                        <TableHead className="w-[140px]">科目</TableHead>
                        <TableHead>取引相手</TableHead>
                        <TableHead>内容</TableHead>
                        <TableHead className="text-right w-[140px]">金額</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {isLoading ? (
                        <TableRow>
                          <TableCell colSpan={4} className="text-center py-8 text-gray-500">
                            読み込み中...
                          </TableCell>
                        </TableRow>
                      ) : error ? (
                        <TableRow>
                          <TableCell colSpan={4} className="text-center py-8 text-red-500">
                            データの取得に失敗しました
                          </TableCell>
                        </TableRow>
                      ) : filteredSlips.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={4} className="text-center py-8 text-gray-500">
                            データが見つかりません
                          </TableCell>
                        </TableRow>
                      ) : (
                        filteredSlips.map((slip) => {
                          const paymentMethodLabels = {
                            cash: '現金',
                            card: 'カード',
                            transfer: '振込',
                            other: 'その他',
                          };
                          const _categoryLabels = {
                            fuel: '燃料費',
                            maintenance: '車両維持費',
                            insurance: '保険料',
                            salary: '給与',
                            toll: '通行料',
                            other: 'その他',
                          };
                          return (
                            <TableRow key={slip.id}>
                              <TableCell>{paymentMethodLabels[slip.paymentMethod]}</TableCell>
                              <TableCell>{slip.vendorName}</TableCell>
                              <TableCell>{slip.description}</TableCell>
                              <TableCell className="text-right font-semibold text-red-600">
                                ¥{slip.amount.toLocaleString()}
                              </TableCell>
                            </TableRow>
                          );
                        })
                      )}
                    </TableBody>
                  </Table>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 下部カード：借方金額／貸方金額（入金伝票と同様仕様） */}
      <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* 借方金額 */}
        <Card>
          <CardHeader className="bg-blue-50">
            <h3 className="text-lg font-semibold">借方金額</h3>
          </CardHeader>
          <CardContent className="p-4">
            <Table className="w-full text-sm">
              <TableHeader className="bg-blue-50">
                <TableRow>
                  <TableHead>伝票No</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow>
                  <TableCell>-</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>-</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* 貸方金額 */}
        <Card>
          <CardHeader className="bg-blue-50">
            <h3 className="text-lg font-semibold">貸方金額</h3>
          </CardHeader>
          <CardContent className="p-4">
            <Table className="w-full text-sm">
              <TableHeader className="bg-blue-50">
                <TableRow>
                  <TableHead>伝票No</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow>
                  <TableCell>-</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>-</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
