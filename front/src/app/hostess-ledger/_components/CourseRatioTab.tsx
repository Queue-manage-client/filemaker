'use client';

import React, { useState } from 'react';

export default function CourseRatioTab() {
  const [base, setBase] = useState(10000);
  const [classBonus, setClassBonus] = useState(2000);
  const [hostessRate, setHostessRate] = useState(60);
  const [extensionMin, setExtensionMin] = useState(30);
  const [extensionUnit, setExtensionUnit] = useState(3000);

  const total = base + classBonus;
  const hostessShare = Math.round(total * (hostessRate / 100));
  const storeShare = total - hostessShare;
  const extHostess = Math.round(extensionUnit * (hostessRate / 100));
  const extStore = extensionUnit - extHostess;

  return (
    <div className="bg-gray-100 p-2 text-[11px] h-full flex flex-col">
      {/* 自動連動プレビュー */}
      <div className="flex items-end gap-4 mb-2 flex-wrap">
        <span className="text-red-500 whitespace-nowrap">入力すると下部プレビューに取分が自動連動します</span>

        <div className="flex items-center gap-1">
          <span className="whitespace-nowrap">延長</span>
          <input
            type="number"
            value={extensionMin}
            onChange={(e) => setExtensionMin(Number(e.target.value) || 0)}
            className="w-[40px] h-[18px] text-[11px] px-1 bg-white border border-gray-400 text-center"
          />
          <span className="whitespace-nowrap">分毎</span>
          <input
            type="number"
            value={extensionUnit}
            onChange={(e) => setExtensionUnit(Number(e.target.value) || 0)}
            className="w-[60px] h-[18px] text-[11px] px-1 bg-white border border-gray-400"
          />
          <span>円</span>
        </div>

        <div className="flex items-end gap-1">
          <span className="text-[10px]">基本</span>
          <input
            type="number"
            value={base}
            onChange={(e) => setBase(Number(e.target.value) || 0)}
            className="w-[60px] h-[18px] text-[11px] px-1 bg-white border border-gray-400"
          />
          <span className="text-[10px]">+クラス加算</span>
          <input
            type="number"
            value={classBonus}
            onChange={(e) => setClassBonus(Number(e.target.value) || 0)}
            className="w-[60px] h-[18px] text-[11px] px-1 bg-white border border-gray-400"
          />
          <span>=</span>
          <span className="font-bold text-blue-700">{total.toLocaleString()}円</span>
        </div>

        <div className="flex items-center gap-1">
          <span>取分率</span>
          <input
            type="number"
            value={hostessRate}
            onChange={(e) => setHostessRate(Number(e.target.value) || 0)}
            className="w-[40px] h-[18px] text-[11px] px-1 bg-yellow-100 border border-gray-400"
          />
          <span>%</span>
        </div>
      </div>

      {/* 自動計算結果 */}
      <div className="grid grid-cols-4 gap-2 mb-2 p-2 bg-emerald-50 border border-emerald-300 rounded">
        <div className="text-center">
          <div className="text-[10px] text-zinc-600">ホステス取分</div>
          <div className="font-bold text-pink-700">{hostessShare.toLocaleString()}円</div>
        </div>
        <div className="text-center">
          <div className="text-[10px] text-zinc-600">店舗取分</div>
          <div className="font-bold text-cyan-700">{storeShare.toLocaleString()}円</div>
        </div>
        <div className="text-center">
          <div className="text-[10px] text-zinc-600">延長ホステス取分</div>
          <div className="font-bold text-pink-700">{extHostess.toLocaleString()}円</div>
        </div>
        <div className="text-center">
          <div className="text-[10px] text-zinc-600">延長店舗取分</div>
          <div className="font-bold text-cyan-700">{extStore.toLocaleString()}円</div>
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
