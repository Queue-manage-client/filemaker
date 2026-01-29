'use client';

import React from 'react';

export default function CourseCombinedTab() {
  return (
    <div className="bg-gray-100 p-2 text-[11px] h-full flex flex-col">
      {/* 上部セクション */}
      <div className="flex items-center justify-between mb-2">
        {/* 左側 - 同一併用店舗 */}
        <div className="flex items-center gap-1">
          <span className="whitespace-nowrap">同一併用店舗</span>
          <input type="text" className="w-[150px] h-[18px] text-[11px] px-1 bg-white border border-gray-400" />
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
        <span className="flex-1 whitespace-nowrap">店取分フホステス取分フリープラス金額</span>
      </div>

      {/* テーブル */}
      <div className="flex-1 overflow-auto border border-gray-400 bg-white">
        <div className="flex flex-col">
          {Array.from({ length: 12 }).map((_, index) => (
            <div
              key={index}
              className={`flex items-center h-[22px] border-b border-gray-300 ${
                index % 2 === 1 ? 'bg-yellow-100' : 'bg-white'
              }`}
            >
              <div className="w-[80px] px-1"></div>
              <div className="w-[120px] px-1"></div>
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
