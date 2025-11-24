'use client';

import React from 'react';

import { useRouter } from 'next/navigation';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Map, Building2, Heart, Building } from "lucide-react";
import { areaDivisionSampleData } from '@/data/areaDivisionSampleData';
import type { AreaDivision } from '@/types/area-division';

export default function AreaDivision() {
  const router = useRouter();

  React.useEffect(() => {
    document.title = '地域区分管理 - Dispatch Harmony Hub';
  }, []);

  const formatNumber = (num: number) => num.toLocaleString();

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
      <Card className="mb-6">
        <CardHeader>
          <div className="flex items-center gap-3">
            <Map className="w-6 h-6" />
            <div>
              <CardTitle className="text-2xl">地域区分管理</CardTitle>
              <p className="text-muted-foreground mt-1">
                地域ごとのホテル情報を管理します
              </p>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* 統計情報 */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Building2 className="w-5 h-5 text-blue-600" />
              <div>
                <p className="text-sm font-medium text-muted-foreground">総ホテル数</p>
                <p className="text-2xl font-bold">
                  {formatNumber(areaDivisionSampleData.reduce((sum, item) => sum + item.totalHotels, 0))}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Heart className="w-5 h-5 text-pink-600" />
              <div>
                <p className="text-sm font-medium text-muted-foreground">ラブホテル数</p>
                <p className="text-2xl font-bold">
                  {formatNumber(areaDivisionSampleData.reduce((sum, item) => sum + item.loveHotels, 0))}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Building className="w-5 h-5 text-green-600" />
              <div>
                <p className="text-sm font-medium text-muted-foreground">シティホテル数</p>
                <p className="text-2xl font-bold">
                  {formatNumber(areaDivisionSampleData.reduce((sum, item) => sum + item.cityHotels, 0))}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Map className="w-5 h-5 text-purple-600" />
              <div>
                <p className="text-sm font-medium text-muted-foreground">地域数</p>
                <p className="text-2xl font-bold">
                  {areaDivisionSampleData.length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* データテーブル */}
      <Card>
        <CardHeader>
          <CardTitle>地域区分一覧</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-16">No</TableHead>
                  <TableHead>広域区分</TableHead>
                  <TableHead>ひらがな読み</TableHead>
                  <TableHead>ローマ字読み</TableHead>
                  <TableHead>地域区分</TableHead>
                  <TableHead>行政区分</TableHead>
                  <TableHead>住所市区</TableHead>
                  <TableHead>通称（基本住所表示マーカー）</TableHead>
                  <TableHead className="text-center">総数</TableHead>
                  <TableHead className="text-center">ラブ</TableHead>
                  <TableHead className="text-center">シティ</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {areaDivisionSampleData.map((item: AreaDivision) => (
                  <TableRow key={item.no}>
                    <TableCell className="font-medium">{item.no}</TableCell>
                    <TableCell>{item.wideArea}</TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {item.hiraganaReading}
                    </TableCell>
                    <TableCell className="text-sm font-mono">
                      {item.romanReading}
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">{item.areaCategory}</Badge>
                    </TableCell>
                    <TableCell>{item.administrativeDivision}</TableCell>
                    <TableCell>{item.addressCity}</TableCell>
                    <TableCell>
                      <div className="flex flex-wrap gap-2">
                        {(item.addressNicknames ?? []).slice(0, 2).map((nickname, idx) => (
                          <Badge key={`${item.no}-nickname-${idx}`} variant="outline">
                            {nickname}
                          </Badge>
                        ))}
                      </div>
                    </TableCell>
                    <TableCell className="text-center">
                      <Badge variant="secondary">
                        {formatNumber(item.totalHotels)}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-center">
                      <Badge variant="destructive">
                        {formatNumber(item.loveHotels)}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-center">
                      <Badge variant="default">
                        {formatNumber(item.cityHotels)}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
