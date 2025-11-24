'use client';

import React from 'react';

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { ArrowLeft, Users } from "lucide-react";

export default function StoreHostessSummary() {
  React.useEffect(() => {
    document.title = '店舗別詳細ホステス - Dispatch Harmony Hub';
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      {/* 戻るボタン */}
      <div className="mb-4">
        <Button
          variant="outline"
          onClick={() => window.close()}
          className="flex items-center gap-2"
        >
          <ArrowLeft className="w-4 h-4" />
          ウィンドウを閉じる
        </Button>
      </div>

      {/* ヘッダー */}
      <Card className="mb-4">
        <CardHeader>
          <div className="flex items-center gap-3">
            <Users className="w-6 h-6" />
            <h1 className="text-2xl font-bold">店舗別詳細ホステス</h1>
          </div>
        </CardHeader>
      </Card>

      {/* メインコンテンツ */}
      <Card>
        <CardContent className="p-8">
          <div className="text-center text-gray-500">
            <Users className="w-16 h-16 mx-auto mb-4 text-gray-300" />
            <h2 className="text-xl font-semibold mb-2">店舗別詳細ホステス</h2>
            <p>このページは準備中です</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
