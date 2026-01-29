'use client';

import React from 'react';

export default function ClassTab() {
  return (
    <div className="bg-white p-2 text-[11px] h-full flex flex-col">
      {/* 上部セクション */}
      <div className="flex items-center gap-4 mb-2">
        <span>N,R,FRでは、クラス加算金額は0、クラス延長加算は、あり。</span>
        <div className="flex items-center gap-1">
          <span className="whitespace-nowrap">フリー派遣</span>
          <div className="flex items-center gap-0.5 bg-pink-100 px-1 border border-pink-300">
            <input type="checkbox" className="w-3 h-3" />
            <span>不可</span>
          </div>
        </div>
        <div className="flex items-center gap-1">
          <span className="whitespace-nowrap">クラス送信用</span>
          <span>0</span>
        </div>
        <span className="whitespace-nowrap">旧クラス名</span>
      </div>

      {/* メインコンテンツ */}
      <div className="flex-1 flex gap-4">
        {/* 左側 - リスト */}
        <div className="flex flex-col">
          <div className="w-[180px] h-full border border-gray-400 overflow-auto bg-white">
            {Array.from({ length: 12 }).map((_, index) => (
              <div
                key={index}
                className="h-[20px] border-b border-gray-300 px-1"
              />
            ))}
          </div>
        </div>

        {/* 中央 - クリックして選択とフォーム */}
        <div className="flex flex-col gap-2">
          {/* クリアボタン */}
          <div className="flex items-center">
            <button type="button" className="px-3 py-0.5 text-[11px] bg-gray-200 border border-gray-400 hover:bg-gray-300">クリア</button>
          </div>

          {/* クリックして選択 → */}
          <div className="flex flex-col">
            <span className="text-blue-600 whitespace-nowrap">クリックして選択</span>
            <span className="text-blue-600">→</span>
          </div>

          {/* ホステスクラス加算金 */}
          <div className="flex items-center">
            <span>ホステスクラス加算金</span>
          </div>

          {/* ホステスクラス特別加算金 */}
          <div className="flex items-center gap-2">
            <span>ホステスクラス特別加算金</span>
            <input type="text" className="w-[80px] h-[18px] text-[11px] px-1 bg-white border border-gray-400" />
          </div>

          {/* 区切り線 */}
          <div className="w-[300px] border-t border-gray-400"></div>

          {/* ホステスクラス加算金計 */}
          <div className="flex items-center">
            <span>ホステスクラス加算金計</span>
          </div>

          {/* スペース */}
          <div className="h-4"></div>

          {/* クラスweb番号 */}
          <div className="flex items-center">
            <span>クラスweb番号</span>
          </div>

          {/* スペース */}
          <div className="h-4"></div>

          {/* クラスWEBコード */}
          <div className="flex items-center">
            <span>クラスWEBコード</span>
          </div>
        </div>

        {/* 右側ブロック - クラス名グループとクラス加算金グループ */}
        <div className="flex flex-col gap-4 ml-16">
          {/* グループ1: クラス名 延長クラス加算金 ホステス取り分 店舗取り分 */}
          <div className="flex items-center gap-4">
            <span>クラス名</span>
            <span>延長クラス加算金</span>
            <span>ホステス取り分</span>
            <span>店舗取り分</span>
          </div>

          {/* スペース */}
          <div className="h-[80px]"></div>

          {/* グループ2: クラス加算金 開発者用メモ クラス加算金額現状 クラスデフォルト金額 */}
          <div className="flex flex-col gap-1">
            <span>クラス加算金</span>
            <div className="h-2"></div>
            <span>開発者用メモ</span>
            <div className="flex items-center gap-4">
              <span>クラス加算金額現状</span>
              <span>クラスデフォルト金額</span>
            </div>
            <div className="flex items-center gap-4">
              <span className="w-[100px] text-right">-</span>
              <span className="w-[110px] text-right">=</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
