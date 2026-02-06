'use client';

import React, { useState } from 'react';

// 店舗情報付きの実績データ
const performanceData = [
  { id: 1, store: 'FIRST', basic: 45000, nomination: 12000, extension: 8000, back: 32500, panel: 5000, isNomination: true },
  { id: 2, store: 'FIRST', basic: 38000, nomination: 9000, extension: 6000, back: 26500, panel: 4000, isNomination: true },
  { id: 3, store: 'SECOND', basic: 52000, nomination: 15000, extension: 10000, back: 38500, panel: 6000, isNomination: true },
  { id: 4, store: 'FIRST', basic: 41000, nomination: 8000, extension: 4000, back: 26500, panel: 3500, isNomination: false },
  { id: 5, store: 'SECOND', basic: 48000, nomination: 11000, extension: 7000, back: 33000, panel: 5500, isNomination: true },
  { id: 6, store: 'FIRST', basic: 35000, nomination: 6000, extension: 3000, back: 22000, panel: 3000, isNomination: false },
  { id: 7, store: 'THIRD', basic: 55000, nomination: 18000, extension: 12000, back: 42500, panel: 7000, isNomination: true },
  { id: 8, store: 'FIRST', basic: 42000, nomination: 10000, extension: 5000, back: 28500, panel: 4500, isNomination: true },
  { id: 9, store: 'SECOND', basic: 39000, nomination: 7000, extension: 4000, back: 25000, panel: 3500, isNomination: false },
  { id: 10, store: 'THIRD', basic: 46000, nomination: 13000, extension: 9000, back: 34000, panel: 5500, isNomination: true },
  { id: 11, store: 'FIRST', basic: 50000, nomination: 14000, extension: 8000, back: 36000, panel: 6000, isNomination: true },
  { id: 12, store: 'SECOND', basic: 37000, nomination: 5000, extension: 2000, back: 22000, panel: 3000, isNomination: false },
  { id: 13, store: 'FIRST', basic: 44000, nomination: 9000, extension: 6000, back: 29500, panel: 4500, isNomination: true },
  { id: 14, store: 'THIRD', basic: 58000, nomination: 20000, extension: 15000, back: 46500, panel: 8000, isNomination: true },
  { id: 15, store: 'FIRST', basic: 40000, nomination: 8000, extension: 5000, back: 26500, panel: 4000, isNomination: false },
];

// 店舗リスト
const stores = ['FIRST', 'SECOND', 'THIRD'];

export default function PerformanceDetailTab() {
  const [year, setYear] = useState(2026);
  const [month, setMonth] = useState(1);

  // サマリー計算
  const totalBasicExtension = performanceData.reduce((sum, row) => sum + row.basic + row.extension, 0);
  const monthlyCount = performanceData.length;
  const mainNominationCount = performanceData.filter(row => row.nomination > 10000).length;
  const hpNominationCount = performanceData.filter(row => row.nomination > 5000).length;
  const averageUnitPrice = Math.round(totalBasicExtension / monthlyCount);

  // 指名率計算
  const nominationCount = performanceData.filter(row => row.isNomination).length;
  const nominationRate = monthlyCount > 0 ? ((nominationCount / monthlyCount) * 100).toFixed(1) : '0.0';

  // 併用店舗合算（全店舗合算）
  const combinedStoreTotal = performanceData.reduce((sum, row) => ({
    basic: sum.basic + row.basic,
    nomination: sum.nomination + row.nomination,
    extension: sum.extension + row.extension,
    back: sum.back + row.back,
    panel: sum.panel + row.panel,
    count: sum.count + 1,
    nominationCount: sum.nominationCount + (row.isNomination ? 1 : 0),
  }), { basic: 0, nomination: 0, extension: 0, back: 0, panel: 0, count: 0, nominationCount: 0 });

  // 各店舗ごとの合算
  const storeStats = stores.map(store => {
    const storeData = performanceData.filter(row => row.store === store);
    const count = storeData.length;
    const nominatedCount = storeData.filter(row => row.isNomination).length;
    return {
      store,
      basic: storeData.reduce((sum, row) => sum + row.basic, 0),
      nomination: storeData.reduce((sum, row) => sum + row.nomination, 0),
      extension: storeData.reduce((sum, row) => sum + row.extension, 0),
      back: storeData.reduce((sum, row) => sum + row.back, 0),
      panel: storeData.reduce((sum, row) => sum + row.panel, 0),
      count,
      nominationRate: count > 0 ? ((nominatedCount / count) * 100).toFixed(1) : '0.0',
    };
  });

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
        <div className="w-16 text-center border-r border-gray-400 py-px">店舗</div>
        <div className="w-14 text-center border-r border-gray-400 py-px">基本</div>
        <div className="w-14 text-center border-r border-gray-400 py-px">指名</div>
        <div className="w-14 text-center border-r border-gray-400 py-px">延長</div>
        <div className="w-20 text-center border-r border-gray-400 py-px">合計</div>
        <div className="w-14 text-center border-r border-gray-400 py-px">バック</div>
        <div className="w-14 text-center border-r border-gray-400 py-px">パネル</div>
        <div className="flex-1 text-center py-px">手取計</div>
      </div>

      {/* データ */}
      <div className="flex-1 overflow-y-auto border-x border-b border-gray-400 min-h-0">
        {performanceData.map((row) => {
          const total = row.basic + row.extension + row.nomination;
          const handTotal = row.back + row.panel;
          return (
            <div key={row.id} className={`flex border-b border-gray-400 ${row.isNomination ? 'bg-purple-200' : 'bg-purple-100'}`}>
              <div className="w-16 text-center border-r border-gray-400 py-px text-[10px]">{row.store}</div>
              <div className="w-14 text-right border-r border-gray-400 py-px pr-1">{row.basic.toLocaleString()}</div>
              <div className="w-14 text-right border-r border-gray-400 py-px pr-1">{row.nomination.toLocaleString()}</div>
              <div className="w-14 text-right border-r border-gray-400 py-px pr-1">{row.extension.toLocaleString()}</div>
              <div className="w-20 text-right border-r border-gray-400 py-px pr-1">{total.toLocaleString()}</div>
              <div className="w-14 text-right border-r border-gray-400 py-px pr-1">{row.back.toLocaleString()}</div>
              <div className="w-14 text-right border-r border-gray-400 py-px pr-1">{row.panel.toLocaleString()}</div>
              <div className="flex-1 text-right py-px pr-1">{handTotal.toLocaleString()}</div>
            </div>
          );
        })}
      </div>

      {/* サマリーエリア（スクロール可能） */}
      <div className="shrink-0 overflow-y-auto max-h-[45%] mt-1">
        {/* 併用店舗合算 */}
        <div className="border border-blue-400 bg-blue-50 p-1">
          <div className="font-bold text-blue-700 mb-1">併用店舗合算</div>
          <div className="flex gap-4 text-[10px]">
            <div>
              <span className="text-gray-600">件数:</span>
              <span className="font-bold ml-1">{combinedStoreTotal.count}</span>
            </div>
            <div>
              <span className="text-gray-600">基本:</span>
              <span className="font-bold ml-1">{combinedStoreTotal.basic.toLocaleString()}</span>
            </div>
            <div>
              <span className="text-gray-600">指名:</span>
              <span className="font-bold ml-1">{combinedStoreTotal.nomination.toLocaleString()}</span>
            </div>
            <div>
              <span className="text-gray-600">延長:</span>
              <span className="font-bold ml-1">{combinedStoreTotal.extension.toLocaleString()}</span>
            </div>
            <div>
              <span className="text-gray-600">合計:</span>
              <span className="font-bold ml-1 text-blue-700">
                {(combinedStoreTotal.basic + combinedStoreTotal.nomination + combinedStoreTotal.extension).toLocaleString()}
              </span>
            </div>
          </div>
        </div>

        {/* 各店舗の合算 */}
        <div className="mt-1 border border-green-400 bg-green-50 p-1">
          <div className="font-bold text-green-700 mb-1">各店舗の合算</div>
          <div className="space-y-1">
            {storeStats.map(stat => (
              <div key={stat.store} className="flex gap-3 text-[10px] border-b border-green-200 pb-1">
                <div className="w-14 font-bold">{stat.store}</div>
                <div>
                  <span className="text-gray-600">件数:</span>
                  <span className="ml-1">{stat.count}</span>
                </div>
                <div>
                  <span className="text-gray-600">基本:</span>
                  <span className="ml-1">{stat.basic.toLocaleString()}</span>
                </div>
                <div>
                  <span className="text-gray-600">指名:</span>
                  <span className="ml-1">{stat.nomination.toLocaleString()}</span>
                </div>
                <div>
                  <span className="text-gray-600">合計:</span>
                  <span className="ml-1 font-bold">
                    {(stat.basic + stat.nomination + stat.extension).toLocaleString()}
                  </span>
                </div>
                <div>
                  <span className="text-gray-600">指名率:</span>
                  <span className="ml-1 text-orange-600 font-bold">{stat.nominationRate}%</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 下部サマリー */}
        <div className="mt-1 flex flex-wrap gap-4">
          <div className="flex gap-2">
            <div className="flex flex-col">
              <div>月間件数</div>
              <div>本指名件数</div>
              <div>HP指名件数</div>
            </div>
            <div className="flex flex-col">
              <div>{monthlyCount}</div>
              <div>{mainNominationCount}</div>
              <div>{hpNominationCount}</div>
            </div>
          </div>
          <div>
            <div>基本+延長計</div>
            <div className="font-bold">{totalBasicExtension.toLocaleString()}</div>
          </div>
          <div>
            <div>売上平均単価月間</div>
            <div className="font-bold">{averageUnitPrice.toLocaleString()}</div>
          </div>
          {/* 指名率 */}
          <div className="border border-orange-400 bg-orange-50 px-3 py-1">
            <div className="text-orange-700">全体指名率</div>
            <div className="font-bold text-xl text-orange-600">{nominationRate}%</div>
            <div className="text-[10px] text-gray-500">({nominationCount}/{monthlyCount}件)</div>
          </div>
        </div>
      </div>
    </div>
  );
}
