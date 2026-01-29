'use client';

import React, { useState } from 'react';

const performanceData = [
  { id: 1, basic: 45000, nomination: 12000, extension: 8000, back: 32500, panel: 5000 },
  { id: 2, basic: 38000, nomination: 9000, extension: 6000, back: 26500, panel: 4000 },
  { id: 3, basic: 52000, nomination: 15000, extension: 10000, back: 38500, panel: 6000 },
  { id: 4, basic: 41000, nomination: 8000, extension: 4000, back: 26500, panel: 3500 },
  { id: 5, basic: 48000, nomination: 11000, extension: 7000, back: 33000, panel: 5500 },
  { id: 6, basic: 35000, nomination: 6000, extension: 3000, back: 22000, panel: 3000 },
  { id: 7, basic: 55000, nomination: 18000, extension: 12000, back: 42500, panel: 7000 },
  { id: 8, basic: 42000, nomination: 10000, extension: 5000, back: 28500, panel: 4500 },
  { id: 9, basic: 39000, nomination: 7000, extension: 4000, back: 25000, panel: 3500 },
  { id: 10, basic: 46000, nomination: 13000, extension: 9000, back: 34000, panel: 5500 },
  { id: 11, basic: 50000, nomination: 14000, extension: 8000, back: 36000, panel: 6000 },
  { id: 12, basic: 37000, nomination: 5000, extension: 2000, back: 22000, panel: 3000 },
  { id: 13, basic: 44000, nomination: 9000, extension: 6000, back: 29500, panel: 4500 },
  { id: 14, basic: 58000, nomination: 20000, extension: 15000, back: 46500, panel: 8000 },
  { id: 15, basic: 40000, nomination: 8000, extension: 5000, back: 26500, panel: 4000 },
];

export default function PerformanceDetailTab() {
  const [year, setYear] = useState(2026);
  const [month, setMonth] = useState(1);

  // サマリー計算
  const totalBasicExtension = performanceData.reduce((sum, row) => sum + row.basic + row.extension, 0);
  const monthlyCount = performanceData.length;
  const mainNominationCount = performanceData.filter(row => row.nomination > 10000).length;
  const hpNominationCount = performanceData.filter(row => row.nomination > 5000).length;
  const averageUnitPrice = Math.round(totalBasicExtension / monthlyCount);

  return (
    <div className="h-full flex flex-col text-[11px]">
      {/* 年月選択 */}
      <div className="flex items-center mb-1 gap-2">
        <button
          type="button"
          className="px-2 py-0.5 bg-gray-200 border border-gray-400 hover:bg-gray-300"
        >
          当月
        </button>
        <div className="flex items-center">
          <input
            type="number"
            value={year}
            onChange={(e) => setYear(Number(e.target.value))}
            className="w-14 text-center border border-gray-400 py-0.5"
          />
          <span className="mx-1">年</span>
          <input
            type="number"
            value={month}
            onChange={(e) => setMonth(Number(e.target.value))}
            className="w-8 text-center border border-gray-400 py-0.5"
            min={1}
            max={12}
          />
          <span className="ml-1">月</span>
        </div>
      </div>

      {/* ヘッダー */}
      <div className="flex border border-gray-400 bg-gray-200">
        <div className="w-14 text-center border-r border-gray-400 py-px">基本</div>
        <div className="w-14 text-center border-r border-gray-400 py-px">指名</div>
        <div className="w-14 text-center border-r border-gray-400 py-px">延長</div>
        <div className="w-24 text-center border-r border-gray-400 py-px">基本+延長+指名</div>
        <div className="w-14 text-center border-r border-gray-400 py-px">バック</div>
        <div className="w-14 text-center border-r border-gray-400 py-px">パネル</div>
        <div className="flex-1 text-center py-px">手取計</div>
      </div>

      {/* データ */}
      <div className="flex-1 overflow-y-auto border-x border-b border-gray-400">
        {performanceData.map((row) => {
          const total = row.basic + row.extension + row.nomination;
          const handTotal = row.back + row.panel;
          return (
            <div key={row.id} className="flex border-b border-gray-400 bg-purple-200">
              <div className="w-14 text-right border-r border-gray-400 py-px pr-1">{row.basic.toLocaleString()}</div>
              <div className="w-14 text-right border-r border-gray-400 py-px pr-1">{row.nomination.toLocaleString()}</div>
              <div className="w-14 text-right border-r border-gray-400 py-px pr-1">{row.extension.toLocaleString()}</div>
              <div className="w-24 text-right border-r border-gray-400 py-px pr-1">{total.toLocaleString()}</div>
              <div className="w-14 text-right border-r border-gray-400 py-px pr-1">{row.back.toLocaleString()}</div>
              <div className="w-14 text-right border-r border-gray-400 py-px pr-1">{row.panel.toLocaleString()}</div>
              <div className="flex-1 text-right py-px pr-1">{handTotal.toLocaleString()}</div>
            </div>
          );
        })}
      </div>

      {/* 下部サマリー */}
      <div className="mt-2 flex">
        <div className="flex flex-col">
          <div>月間件数</div>
          <div>本指名件数</div>
          <div>HP指名件数</div>
        </div>
        <div className="flex flex-col ml-2">
          <div>{monthlyCount}</div>
          <div>{mainNominationCount}</div>
          <div>{hpNominationCount}</div>
        </div>
        <div className="ml-8">
          <div>基本+延長計</div>
          <div className="font-bold">{totalBasicExtension.toLocaleString()}</div>
        </div>
      </div>
      <div className="mt-2">
        <div>売上平均単価月間</div>
        <div className="font-bold">{averageUnitPrice.toLocaleString()}</div>
      </div>
    </div>
  );
}
