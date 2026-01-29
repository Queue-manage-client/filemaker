'use client';

import React from 'react';

export default function CourseFixedTab() {
  return (
    <div className="bg-pink-200 p-2 text-[11px] h-full flex flex-col">
      {/* 上部セクション */}
      <div className="flex items-start justify-between mb-1">
        {/* 左側 */}
        <div className="flex flex-col gap-1">
          <button type="button" className="px-3 py-1 text-[11px] bg-gray-100 border border-gray-400 hover:bg-gray-200">標準セット取り込み</button>
          <span className="text-red-500 whitespace-nowrap">上のボタンで取り込み後、黄色の塗りつぶし箇所を入力</span>
        </div>

        {/* 右側 - 延長設定 */}
        <div className="flex items-center gap-1">
          <span className="whitespace-nowrap">延長</span>
          <input type="text" className="w-[30px] h-[18px] text-[11px] px-1 bg-white border border-gray-400 text-center" defaultValue="30" />
          <span className="whitespace-nowrap">分毎</span>
          <input type="text" className="w-[60px] h-[18px] text-[11px] px-1 bg-white border border-gray-400" />
          <span className="whitespace-nowrap">円</span>
        </div>
      </div>

      {/* テーブルヘッダー */}
      <div className="flex items-center text-[11px] mb-0.5">
        <span className="w-[80px] whitespace-nowrap">コース種類</span>
        <span className="w-[120px] whitespace-nowrap">コース名</span>
        <span className="w-[60px] whitespace-nowrap text-center">時間</span>
        <span className="w-[60px] whitespace-nowrap text-center">料金</span>
        <span className="w-[60px] whitespace-nowrap text-center">店取分</span>
        <span className="flex-1 whitespace-nowrap">ホステス取分プラス金額</span>
      </div>

      {/* テーブル */}
      <div className="flex-1 overflow-auto border border-gray-400 bg-white">
        <div className="flex flex-col">
          {Array.from({ length: 14 }).map((_, index) => (
            <div
              key={index}
              className={`flex items-center h-[22px] border-b border-gray-300 ${
                index % 2 === 0 ? 'bg-pink-100' : 'bg-white'
              }`}
            >
              <div className="w-[80px] px-1"></div>
              <div className="w-[120px] px-1"></div>
              <div className="w-[60px] px-1 text-center"></div>
              <div className="w-[60px] px-1 text-center"></div>
              <div className="w-[60px] px-1 text-center"></div>
              <div className="flex-1 px-1"></div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
