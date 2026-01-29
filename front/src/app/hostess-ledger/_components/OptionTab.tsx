'use client';

import React from 'react';

export default function OptionTab() {
  return (
    <div className="p-2 text-[11px] h-full flex flex-col">
      {/* 上部セクション */}
      <div className="mb-2">
        <button type="button" className="px-3 py-1 text-[11px] bg-gray-100 border border-gray-400 hover:bg-gray-200">標準セット取り込み</button>
      </div>

      {/* テーブルエリア */}
      <div className="flex-1 flex gap-2">
        {/* 左側テーブル */}
        <div className="flex-1 flex flex-col">
          {/* ヘッダー */}
          <div className="flex items-center text-[11px] mb-0.5">
            <span className="w-[140px]">可否(無理な内容に印)</span>
            <span className="w-[100px]">オプション名</span>
            <span className="w-[50px] text-center">金額</span>
            <span className="w-[50px] text-center">店舗分</span>
            <span className="w-[60px] text-center">ホステス分</span>
            <span className="w-[50px] text-center">表示順</span>
          </div>
          {/* テーブル本体 */}
          <div className="flex-1 border border-gray-400 overflow-auto bg-white">
            {Array.from({ length: 18 }).map((_, index) => (
              <div
                key={index}
                className={`flex items-center h-[20px] border-b border-gray-400 ${
                  index % 2 === 0 ? 'bg-cyan-100' : 'bg-white'
                }`}
              >
                <div className="w-[140px] px-1"></div>
                <div className="w-[100px] px-1"></div>
                <div className="w-[50px] px-1 text-center"></div>
                <div className="w-[50px] px-1 text-center"></div>
                <div className="w-[60px] px-1 text-center"></div>
                <div className="w-[50px] px-1 text-center"></div>
              </div>
            ))}
          </div>
        </div>

        {/* 右側テーブル */}
        <div className="flex-1 flex flex-col">
          {/* ヘッダー */}
          <div className="flex items-center text-[11px] mb-0.5">
            <span className="w-[40px]">可否</span>
            <span className="w-[120px]">オプション名</span>
            <span className="w-[50px] text-center">金額</span>
            <span className="w-[50px] text-center">店舗分</span>
            <span className="w-[60px] text-center">ホステス分</span>
            <span className="w-[50px] text-center">表示順</span>
          </div>
          {/* テーブル本体 */}
          <div className="flex-1 border border-gray-400 overflow-auto bg-white">
            {Array.from({ length: 18 }).map((_, index) => (
              <div
                key={index}
                className={`flex items-center h-[20px] border-b border-gray-400 ${
                  index % 2 === 0 ? 'bg-cyan-100' : 'bg-white'
                }`}
              >
                <div className="w-[40px] px-1"></div>
                <div className="w-[120px] px-1"></div>
                <div className="w-[50px] px-1 text-center"></div>
                <div className="w-[50px] px-1 text-center"></div>
                <div className="w-[60px] px-1 text-center"></div>
                <div className="w-[50px] px-1 text-center"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
