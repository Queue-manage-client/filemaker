"use client";

import React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

export function DispatchPanel2DHeader() {
  return (
    <div className="absolute left-0 top-0 right-0 z-10 h-[50px] bg-white border-b border-zinc-300">
      <div className="flex items-center h-full px-2">
        {/* ダッシュボードに戻る - 左端 */}
        <Link href="/dashboard">
          <Button
            variant="outline"
            className="h-8 px-3 text-xs flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            ダッシュボードに戻る
          </Button>
        </Link>

        {/* 中央配置のボタン群 */}
        <div className="flex-1 flex items-center justify-center gap-2">
          {/* 配車パネル2Dタイトル */}
          <h1 className="text-lg font-bold mr-2">配車パネル2D</h1>

          {/* 日付移動 */}
          <Button
            variant="outline"
            className="h-8 px-3 text-xs border-black"
            onClick={() => {}}
          >
            日付移動
          </Button>

          {/* ドライバ精算 */}
          <Button
            className="h-8 px-4 text-xs bg-lime-400 hover:bg-lime-500 text-black border border-black"
            onClick={() => {}}
          >
            ドライバ精算
          </Button>

          {/* 新顧客検索 */}
          <Button
            variant="outline"
            className="h-8 px-4 text-xs border-black"
            onClick={() => {}}
          >
            新顧客検索
          </Button>

          {/* RT IIパネル */}
          <Button
            className="h-8 px-4 text-xs bg-purple-400 hover:bg-purple-500 text-black border border-black"
            onClick={() => {}}
          >
            RT IIパネル
          </Button>

          {/* RTパネル */}
          <Button
            className="h-8 px-4 text-xs bg-orange-400 hover:bg-orange-500 text-black border border-black"
            onClick={() => {}}
          >
            RTパネル
          </Button>

          {/* 手配表 */}
          <Button
            variant="outline"
            className="h-8 px-4 text-xs border-black"
            onClick={() => {}}
          >
            手配表
          </Button>

          {/* Menu */}
          <Button
            variant="outline"
            className="h-8 px-4 text-xs border-black"
            onClick={() => {}}
          >
            Menu
          </Button>

          {/* チャット表示 */}
          <Button
            className="h-8 px-4 text-xs bg-cyan-300 hover:bg-cyan-400 text-black border border-black"
            onClick={() => {}}
          >
            チャット表示
          </Button>
        </div>
      </div>
    </div>
  );
}


