'use client';

import React from 'react';

export default function CourseRatioTab() {
  return (
    <div className="bg-gray-100 p-2 text-[11px] h-full flex flex-col">
      {/* 上部セクション */}
      <div className="flex items-end gap-4 mb-2">
        {/* 左側テキスト */}
        <span className="text-red-500 whitespace-nowrap">上のボタンで取り込み後、黄色の塗りつぶし箇所を入力</span>

        {/* 延長設定 */}
        <div className="flex items-center gap-1">
          <span className="whitespace-nowrap">延長</span>
          <input type="text" className="w-[30px] h-[18px] text-[11px] px-1 bg-white border border-gray-400 text-center" defaultValue="30" />
          <span className="whitespace-nowrap">分毎</span>
        </div>

        {/* 基本・クラス加算 */}
        <div className="flex items-end gap-1">
          <div className="flex flex-col items-center">
            <span className="text-[10px] whitespace-nowrap">基本</span>
            <span className="whitespace-nowrap">円+</span>
          </div>
          <input type="text" className="w-[50px] h-[18px] text-[11px] px-1 bg-white border border-gray-400" />
          <div className="flex flex-col items-center">
            <span className="text-[10px] whitespace-nowrap">クラス加算</span>
            <span>=</span>
          </div>
          <input type="text" className="w-[50px] h-[18px] text-[11px] px-1 bg-white border border-gray-400" />
        </div>

        {/* 延長ホステス取分額 */}
        <div className="flex items-center gap-1">
          <span className="whitespace-nowrap">延長ホステス取分額</span>
          <input type="text" className="w-[60px] h-[18px] text-[11px] px-1 bg-yellow-100 border border-gray-400" />
        </div>

        {/* 延長店舗取分額 */}
        <div className="flex items-center gap-1">
          <span className="whitespace-nowrap">延長店舗取分額</span>
          <input type="text" className="w-[60px] h-[18px] text-[11px] px-1 bg-white border border-gray-400" />
        </div>
      </div>

      {/* テーブル */}
      <div className="flex-1 overflow-auto border border-gray-400">
        <table className="w-full border-collapse text-[11px]">
          <thead>
            {/* ヘッダー1行目 */}
            <tr className="bg-gray-200">
              <th rowSpan={2} className="border border-gray-400 px-1 py-0.5 w-[60px]">Web掲載</th>
              <th rowSpan={2} className="border border-gray-400 px-1 py-0.5 w-[70px]">コース種類</th>
              <th rowSpan={2} className="border border-gray-400 px-1 py-0.5 w-[60px]">GM区分</th>
              <th rowSpan={2} className="border border-gray-400 px-1 py-0.5">コース名</th>
              <th rowSpan={2} className="border border-gray-400 px-1 py-0.5 w-[50px]">時間</th>
              <th rowSpan={2} className="border border-gray-400 px-1 py-0.5 w-[50px]">料金</th>
              <th colSpan={3} className="border border-gray-400 px-1 py-0.5 bg-pink-300 text-center">ホステス取分</th>
              <th colSpan={3} className="border border-gray-400 px-1 py-0.5 bg-cyan-300 text-center">店舗取分</th>
              <th rowSpan={2} className="border border-gray-400 px-1 py-0.5 w-[50px]">種別</th>
            </tr>
            {/* ヘッダー2行目 */}
            <tr className="bg-gray-200">
              <th className="border border-gray-400 px-1 py-0.5 w-[60px] bg-pink-200">フリー</th>
              <th className="border border-gray-400 px-1 py-0.5 w-[60px] bg-pink-200">パネルS</th>
              <th className="border border-gray-400 px-1 py-0.5 w-[60px] bg-pink-200">指名</th>
              <th className="border border-gray-400 px-1 py-0.5 w-[60px] bg-cyan-200">フリー</th>
              <th className="border border-gray-400 px-1 py-0.5 w-[60px] bg-cyan-200">パネルS</th>
              <th className="border border-gray-400 px-1 py-0.5 w-[60px] bg-cyan-200">指名</th>
            </tr>
          </thead>
          <tbody>
            {/* データ行 */}
            {Array.from({ length: 12 }).map((_, index) => (
              <tr key={index} className="bg-white">
                <td className="border border-gray-400 px-1 py-0.5 text-center">
                  <input type="checkbox" className="w-3 h-3" />
                </td>
                <td className="border border-gray-400 px-1 py-0.5"></td>
                <td className="border border-gray-400 px-1 py-0.5"></td>
                <td className="border border-gray-400 px-1 py-0.5"></td>
                <td className="border border-gray-400 px-1 py-0.5"></td>
                <td className="border border-gray-400 px-1 py-0.5"></td>
                <td className="border border-gray-400 px-1 py-0.5 bg-yellow-100"></td>
                <td className="border border-gray-400 px-1 py-0.5 bg-yellow-100"></td>
                <td className="border border-gray-400 px-1 py-0.5"></td>
                <td className="border border-gray-400 px-1 py-0.5"></td>
                <td className="border border-gray-400 px-1 py-0.5"></td>
                <td className="border border-gray-400 px-1 py-0.5"></td>
                <td className="border border-gray-400 px-1 py-0.5"></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* 下部セクション */}
      <div className="flex items-center justify-between mt-2">
        <span className="text-gray-600">Webページには枠が最大8つで、最終行に延長を入れますので、7つしか表示できません。Web掲載を不要にして調整してください。</span>
        <div className="flex gap-2">
          <button type="button" className="px-3 py-1 text-[11px] bg-gray-300 border border-gray-400 hover:bg-gray-400">標準セット取り込み</button>
          <button type="button" className="px-3 py-1 text-[11px] bg-gray-200 border border-gray-400 hover:bg-gray-300 text-gray-500">このホステス番号登録のコースを全表示</button>
        </div>
      </div>
    </div>
  );
}
