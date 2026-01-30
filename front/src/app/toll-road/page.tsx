'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowLeft, MapPin, Plus, Edit, Trash2 } from "lucide-react";

// データとタイプのインポート
import { tollRoadSampleData } from '@/data/tollRoadSampleData';
import {
  expressways,
  tollOperators,
  getOperatorName,
  getInterchangesByExpressway
} from '@/data/interchangeSampleData';
// import { TollRoad } from '@/types/toll-road'; // 将来の実装で使用予定

export default function TollRoadPage() {
  const [activeTab, setActiveTab] = useState<string>('list');

  React.useEffect(() => {
    document.title = '有料道路料金管理 - Dispatch Harmony Hub';
  }, []);

  // 高速道路名を取得
  const getExpresswayName = (expresswayId: string) => {
    return expressways.find(exp => exp.id === expresswayId)?.name || expresswayId;
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
      <Card className="mb-6">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <MapPin className="w-6 h-6" />
              <h1 className="text-2xl font-bold">有料道路料金管理</h1>
            </div>
            <Button className="flex items-center gap-2">
              <Plus className="w-4 h-4" />
              新規追加
            </Button>
          </div>
        </CardHeader>
      </Card>

      {/* タブ */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="list">料金一覧</TabsTrigger>
          <TabsTrigger value="management">管理</TabsTrigger>
        </TabsList>

        {/* 料金一覧タブ */}
        <TabsContent value="list" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>有料道路料金一覧</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>No</TableHead>
                      <TableHead>高速道路</TableHead>
                      <TableHead>出発IC</TableHead>
                      <TableHead>到着IC</TableHead>
                      <TableHead>通常料金</TableHead>
                      <TableHead>ETC料金</TableHead>
                      <TableHead>運営会社</TableHead>
                      <TableHead>操作</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {tollRoadSampleData.map((road) => (
                      <TableRow key={road.no}>
                        <TableCell>{road.no}</TableCell>
                        <TableCell>{getExpresswayName(road.expresswayId)}</TableCell>
                        <TableCell>{road.ic1}</TableCell>
                        <TableCell>{road.ic2}</TableCell>
                        <TableCell>
                          <div className="text-sm">
                            普通車: ¥{road.regularToll.regular.toLocaleString()} / 軽自動車: ¥{road.lightToll.regular.toLocaleString()}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="text-sm">
                            普通車: ¥{road.regularToll.etc.toLocaleString()} / 軽自動車: ¥{road.lightToll.etc.toLocaleString()}
                          </div>
                        </TableCell>
                        <TableCell>{getOperatorName(road.operatorId)}</TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            <Button variant="outline" size="sm">
                              <Edit className="w-3 h-3" />
                            </Button>
                            <Button variant="outline" size="sm">
                              <Trash2 className="w-3 h-3" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* 管理タブ */}
        <TabsContent value="management" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* 高速道路一覧 */}
            <Card>
              <CardHeader>
                <CardTitle>高速道路一覧</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {expressways.map((exp) => (
                    <div key={exp.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <div className="font-medium">{exp.name}</div>
                        <div className="text-sm text-gray-600">
                          運営: {getOperatorName(exp.operatorId)}
                        </div>
                      </div>
                      <Badge variant="secondary">
                        {getInterchangesByExpressway(exp.id).length}IC
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* 運営会社一覧 */}
            <Card>
              <CardHeader>
                <CardTitle>運営会社一覧</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {tollOperators.map((operator) => (
                    <div key={operator.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="font-medium">{operator.name}</div>
                      <Badge variant="secondary">
                        {expressways.filter(exp => exp.operatorId === operator.id).length}路線
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
