'use client';

import React, { useState, useMemo } from 'react';

// 店舗情報付きの実績データ
const performanceData = [
  { id: 1, date: '2026-01-05', store: 'FIRST', courseName: 'スタンダード', duration: 60, basic: 45000, nomination: 12000, extension: 8000, back: 32500, panel: 5000, isNomination: true, nominationType: '本指名' },
  { id: 2, date: '2026-01-06', store: 'FIRST', courseName: 'プレミアム', duration: 90, basic: 38000, nomination: 9000, extension: 6000, back: 26500, panel: 4000, isNomination: true, nominationType: 'HP指名' },
  { id: 3, date: '2026-01-08', store: 'SECOND', courseName: 'スタンダード', duration: 60, basic: 52000, nomination: 15000, extension: 10000, back: 38500, panel: 6000, isNomination: true, nominationType: '本指名' },
  { id: 4, date: '2026-01-10', store: 'FIRST', courseName: 'ライト', duration: 45, basic: 41000, nomination: 8000, extension: 4000, back: 26500, panel: 3500, isNomination: false, nominationType: 'フリー' },
  { id: 5, date: '2026-01-12', store: 'SECOND', courseName: 'プレミアム', duration: 90, basic: 48000, nomination: 11000, extension: 7000, back: 33000, panel: 5500, isNomination: true, nominationType: 'HP指名' },
  { id: 6, date: '2026-01-13', store: 'FIRST', courseName: 'スタンダード', duration: 60, basic: 35000, nomination: 6000, extension: 3000, back: 22000, panel: 3000, isNomination: false, nominationType: 'フリー' },
  { id: 7, date: '2026-01-15', store: 'THIRD', courseName: 'VIP', duration: 120, basic: 55000, nomination: 18000, extension: 12000, back: 42500, panel: 7000, isNomination: true, nominationType: '本指名' },
  { id: 8, date: '2026-01-17', store: 'FIRST', courseName: 'スタンダード', duration: 60, basic: 42000, nomination: 10000, extension: 5000, back: 28500, panel: 4500, isNomination: true, nominationType: 'HP指名' },
  { id: 9, date: '2026-01-19', store: 'SECOND', courseName: 'ライト', duration: 45, basic: 39000, nomination: 7000, extension: 4000, back: 25000, panel: 3500, isNomination: false, nominationType: 'フリー' },
  { id: 10, date: '2026-01-20', store: 'THIRD', courseName: 'プレミアム', duration: 90, basic: 46000, nomination: 13000, extension: 9000, back: 34000, panel: 5500, isNomination: true, nominationType: '本指名' },
  { id: 11, date: '2026-01-22', store: 'FIRST', courseName: 'VIP', duration: 120, basic: 50000, nomination: 14000, extension: 8000, back: 36000, panel: 6000, isNomination: true, nominationType: '本指名' },
  { id: 12, date: '2026-01-24', store: 'SECOND', courseName: 'スタンダード', duration: 60, basic: 37000, nomination: 5000, extension: 2000, back: 22000, panel: 3000, isNomination: false, nominationType: 'フリー' },
  { id: 13, date: '2026-01-25', store: 'FIRST', courseName: 'プレミアム', duration: 90, basic: 44000, nomination: 9000, extension: 6000, back: 29500, panel: 4500, isNomination: true, nominationType: 'HP指名' },
  { id: 14, date: '2026-01-27', store: 'THIRD', courseName: 'VIP', duration: 120, basic: 58000, nomination: 20000, extension: 15000, back: 46500, panel: 8000, isNomination: true, nominationType: '本指名' },
  { id: 15, date: '2026-01-28', store: 'FIRST', courseName: 'スタンダード', duration: 60, basic: 40000, nomination: 8000, extension: 5000, back: 26500, panel: 4000, isNomination: false, nominationType: 'フリー' },
];

// 前月の実績データ（比較用）
const previousMonthData = {
  totalSales: 580000,
  totalCases: 12,
  honShimeiCount: 4,
  hpShimeiCount: 3,
  nominationRate: 58.3,
  averageUnitPrice: 48333,
  attendanceCount: 18,
  totalBack: 320000,
};

// 目標データ
const goalData = {
  totalSales: 800000,
  totalCases: 20,
  honShimeiCount: 8,
  nominationRate: 70,
  attendanceCount: 22,
};

// 店舗リスト
const stores = ['FIRST', 'SECOND', 'THIRD'];

export default function PerformanceDetailTab() {
  const [year, setYear] = useState(2026);
  const [month, setMonth] = useState(1);
  const [selectedStore, setSelectedStore] = useState<string>('all');
  const [showDetail, setShowDetail] = useState(true);

  // フィルタリングされたデータ
  const filteredData = useMemo(() => {
    if (selectedStore === 'all') return performanceData;
    return performanceData.filter(row => row.store === selectedStore);
  }, [selectedStore]);

  // 基本計算
  const calculations = useMemo(() => {
    const totalBasic = filteredData.reduce((sum, row) => sum + row.basic, 0);
    const totalNomination = filteredData.reduce((sum, row) => sum + row.nomination, 0);
    const totalExtension = filteredData.reduce((sum, row) => sum + row.extension, 0);
    const totalSales = totalBasic + totalNomination + totalExtension;
    const totalBack = filteredData.reduce((sum, row) => sum + row.back, 0);
    const totalPanel = filteredData.reduce((sum, row) => sum + row.panel, 0);
    const totalHandTotal = totalBack + totalPanel;
    const monthlyCount = filteredData.length;
    const totalDuration = filteredData.reduce((sum, row) => sum + row.duration, 0);

    // 指名タイプ別カウント
    const honShimeiCount = filteredData.filter(row => row.nominationType === '本指名').length;
    const hpShimeiCount = filteredData.filter(row => row.nominationType === 'HP指名').length;
    const freeCount = filteredData.filter(row => row.nominationType === 'フリー').length;

    // 指名率計算
    const nominationCount = filteredData.filter(row => row.isNomination).length;
    const nominationRate = monthlyCount > 0 ? (nominationCount / monthlyCount) * 100 : 0;

    // 平均計算
    const averageUnitPrice = monthlyCount > 0 ? Math.round(totalSales / monthlyCount) : 0;
    const averageBackPerCase = monthlyCount > 0 ? Math.round(totalHandTotal / monthlyCount) : 0;
    const averageDuration = monthlyCount > 0 ? Math.round(totalDuration / monthlyCount) : 0;

    // コース別統計
    const courseStats = ['スタンダード', 'プレミアム', 'VIP', 'ライト'].map(courseName => {
      const courseData = filteredData.filter(row => row.courseName === courseName);
      const count = courseData.length;
      return {
        courseName,
        count,
        totalSales: courseData.reduce((sum, row) => sum + row.basic + row.nomination + row.extension, 0),
        percentage: monthlyCount > 0 ? ((count / monthlyCount) * 100).toFixed(1) : '0.0',
      };
    }).filter(stat => stat.count > 0);

    return {
      totalBasic,
      totalNomination,
      totalExtension,
      totalSales,
      totalBack,
      totalPanel,
      totalHandTotal,
      monthlyCount,
      totalDuration,
      honShimeiCount,
      hpShimeiCount,
      freeCount,
      nominationCount,
      nominationRate,
      averageUnitPrice,
      averageBackPerCase,
      averageDuration,
      courseStats,
    };
  }, [filteredData]);

  // 前月比計算
  const monthOverMonth = useMemo(() => ({
    salesChange: calculations.totalSales - previousMonthData.totalSales,
    salesChangePercent: previousMonthData.totalSales > 0
      ? ((calculations.totalSales - previousMonthData.totalSales) / previousMonthData.totalSales * 100).toFixed(1)
      : '0.0',
    casesChange: calculations.monthlyCount - previousMonthData.totalCases,
    nominationRateChange: (calculations.nominationRate - previousMonthData.nominationRate).toFixed(1),
  }), [calculations]);

  // 目標達成率
  const goalAchievement = useMemo(() => ({
    salesPercent: goalData.totalSales > 0 ? (calculations.totalSales / goalData.totalSales * 100).toFixed(1) : '0.0',
    casesPercent: goalData.totalCases > 0 ? (calculations.monthlyCount / goalData.totalCases * 100).toFixed(1) : '0.0',
    honShimeiPercent: goalData.honShimeiCount > 0 ? (calculations.honShimeiCount / goalData.honShimeiCount * 100).toFixed(1) : '0.0',
  }), [calculations]);

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
    const honCount = storeData.filter(row => row.nominationType === '本指名').length;
    return {
      store,
      basic: storeData.reduce((sum, row) => sum + row.basic, 0),
      nomination: storeData.reduce((sum, row) => sum + row.nomination, 0),
      extension: storeData.reduce((sum, row) => sum + row.extension, 0),
      back: storeData.reduce((sum, row) => sum + row.back, 0),
      panel: storeData.reduce((sum, row) => sum + row.panel, 0),
      count,
      honCount,
      nominationRate: count > 0 ? ((nominatedCount / count) * 100).toFixed(1) : '0.0',
    };
  });

  // 増減の表示ヘルパー
  const formatChange = (value: number | string, suffix = '') => {
    const numValue = typeof value === 'string' ? parseFloat(value) : value;
    if (numValue > 0) return <span className="text-green-600">+{value}{suffix}</span>;
    if (numValue < 0) return <span className="text-red-600">{value}{suffix}</span>;
    return <span className="text-gray-500">±0{suffix}</span>;
  };

  return (
    <div className="h-full flex flex-col text-[11px] overflow-hidden">
      {/* コントロールエリア */}
      <div className="flex items-center mb-1 gap-2 shrink-0 flex-wrap">
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
        <select
          value={selectedStore}
          onChange={(e) => setSelectedStore(e.target.value)}
          className="border border-gray-400 py-0.5 px-1"
        >
          <option value="all">全店舗</option>
          {stores.map(store => (
            <option key={store} value={store}>{store}</option>
          ))}
        </select>
        <label className="flex items-center gap-1 ml-2">
          <input
            type="checkbox"
            checked={showDetail}
            onChange={(e) => setShowDetail(e.target.checked)}
            className="w-3 h-3"
          />
          <span>詳細表示</span>
        </label>
      </div>

      {/* KPIサマリーカード */}
      <div className="grid grid-cols-4 gap-1 mb-1 shrink-0">
        {/* 売上合計 */}
        <div className="border border-blue-400 bg-blue-50 p-1 rounded">
          <div className="text-[9px] text-blue-600">売上合計</div>
          <div className="text-sm font-bold text-blue-800">¥{calculations.totalSales.toLocaleString()}</div>
          <div className="text-[9px] flex items-center gap-1">
            前月比: {formatChange(monthOverMonth.salesChangePercent, '%')}
          </div>
          <div className="text-[9px] text-gray-500">目標達成: {goalAchievement.salesPercent}%</div>
        </div>
        {/* 件数 */}
        <div className="border border-green-400 bg-green-50 p-1 rounded">
          <div className="text-[9px] text-green-600">接客件数</div>
          <div className="text-sm font-bold text-green-800">{calculations.monthlyCount}件</div>
          <div className="text-[9px] flex items-center gap-1">
            前月比: {formatChange(monthOverMonth.casesChange, '件')}
          </div>
          <div className="text-[9px] text-gray-500">目標達成: {goalAchievement.casesPercent}%</div>
        </div>
        {/* 指名率 */}
        <div className="border border-orange-400 bg-orange-50 p-1 rounded">
          <div className="text-[9px] text-orange-600">指名率</div>
          <div className="text-sm font-bold text-orange-800">{calculations.nominationRate.toFixed(1)}%</div>
          <div className="text-[9px] flex items-center gap-1">
            前月比: {formatChange(monthOverMonth.nominationRateChange, '%')}
          </div>
          <div className="text-[9px] text-gray-500">本指名: {calculations.honShimeiCount} / HP: {calculations.hpShimeiCount}</div>
        </div>
        {/* 手取り */}
        <div className="border border-purple-400 bg-purple-50 p-1 rounded">
          <div className="text-[9px] text-purple-600">手取合計</div>
          <div className="text-sm font-bold text-purple-800">¥{calculations.totalHandTotal.toLocaleString()}</div>
          <div className="text-[9px] text-gray-500">平均/件: ¥{calculations.averageBackPerCase.toLocaleString()}</div>
          <div className="text-[9px] text-gray-500">バック: ¥{calculations.totalBack.toLocaleString()}</div>
        </div>
      </div>

      {/* 指名タイプ別 & コース別 */}
      <div className="grid grid-cols-2 gap-1 mb-1 shrink-0">
        {/* 指名タイプ別 */}
        <div className="border border-gray-300 p-1 rounded bg-white">
          <div className="text-[9px] font-bold text-gray-700 mb-1">指名タイプ別</div>
          <div className="flex gap-2 text-[10px]">
            <div className="flex items-center gap-1">
              <div className="w-2 h-2 bg-red-500 rounded-full"></div>
              <span>本指名: {calculations.honShimeiCount}</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              <span>HP: {calculations.hpShimeiCount}</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
              <span>フリー: {calculations.freeCount}</span>
            </div>
          </div>
          <div className="flex gap-1 mt-1 h-2">
            {calculations.honShimeiCount > 0 && (
              <div
                className="bg-red-500 rounded"
                style={{ width: `${(calculations.honShimeiCount / calculations.monthlyCount) * 100}%` }}
              />
            )}
            {calculations.hpShimeiCount > 0 && (
              <div
                className="bg-blue-500 rounded"
                style={{ width: `${(calculations.hpShimeiCount / calculations.monthlyCount) * 100}%` }}
              />
            )}
            {calculations.freeCount > 0 && (
              <div
                className="bg-gray-400 rounded"
                style={{ width: `${(calculations.freeCount / calculations.monthlyCount) * 100}%` }}
              />
            )}
          </div>
        </div>
        {/* コース別 */}
        <div className="border border-gray-300 p-1 rounded bg-white">
          <div className="text-[9px] font-bold text-gray-700 mb-1">コース別売上</div>
          <div className="space-y-0.5">
            {calculations.courseStats.map(stat => (
              <div key={stat.courseName} className="flex items-center text-[10px]">
                <div className="w-16 truncate">{stat.courseName}</div>
                <div className="flex-1 bg-gray-200 rounded h-2 mx-1">
                  <div
                    className="bg-indigo-500 h-2 rounded"
                    style={{ width: `${stat.percentage}%` }}
                  />
                </div>
                <div className="w-10 text-right">{stat.count}件</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* データテーブル（詳細表示時のみ） */}
      {showDetail && (
        <>
          {/* ヘッダー */}
          <div className="flex border border-gray-400 bg-gray-200 shrink-0">
            <div className="w-16 text-center border-r border-gray-400 py-px">日付</div>
            <div className="w-12 text-center border-r border-gray-400 py-px">店舗</div>
            <div className="w-14 text-center border-r border-gray-400 py-px">基本</div>
            <div className="w-14 text-center border-r border-gray-400 py-px">指名</div>
            <div className="w-12 text-center border-r border-gray-400 py-px">延長</div>
            <div className="w-16 text-center border-r border-gray-400 py-px">合計</div>
            <div className="w-14 text-center border-r border-gray-400 py-px">バック</div>
            <div className="w-12 text-center border-r border-gray-400 py-px">タイプ</div>
            <div className="flex-1 text-center py-px">手取計</div>
          </div>

          {/* データ */}
          <div className="flex-1 overflow-y-auto border-x border-b border-gray-400 min-h-0">
            {filteredData.map((row) => {
              const total = row.basic + row.extension + row.nomination;
              const handTotal = row.back + row.panel;
              const bgColor = row.nominationType === '本指名' ? 'bg-red-100' :
                              row.nominationType === 'HP指名' ? 'bg-blue-100' :
                              'bg-gray-100';
              return (
                <div key={row.id} className={`flex border-b border-gray-400 ${bgColor}`}>
                  <div className="w-16 text-center border-r border-gray-400 py-px text-[10px]">{row.date.slice(5)}</div>
                  <div className="w-12 text-center border-r border-gray-400 py-px text-[10px]">{row.store}</div>
                  <div className="w-14 text-right border-r border-gray-400 py-px pr-1">{row.basic.toLocaleString()}</div>
                  <div className="w-14 text-right border-r border-gray-400 py-px pr-1">{row.nomination.toLocaleString()}</div>
                  <div className="w-12 text-right border-r border-gray-400 py-px pr-1">{row.extension.toLocaleString()}</div>
                  <div className="w-16 text-right border-r border-gray-400 py-px pr-1 font-medium">{total.toLocaleString()}</div>
                  <div className="w-14 text-right border-r border-gray-400 py-px pr-1">{row.back.toLocaleString()}</div>
                  <div className="w-12 text-center border-r border-gray-400 py-px text-[9px]">
                    <span className={row.nominationType === '本指名' ? 'text-red-600 font-bold' :
                                    row.nominationType === 'HP指名' ? 'text-blue-600' : 'text-gray-500'}>
                      {row.nominationType}
                    </span>
                  </div>
                  <div className="flex-1 text-right py-px pr-1 font-medium">{handTotal.toLocaleString()}</div>
                </div>
              );
            })}
          </div>
        </>
      )}

      {/* サマリーエリア */}
      <div className="shrink-0 overflow-y-auto max-h-[35%] mt-1">
        {/* 併用店舗合算 */}
        <div className="border border-blue-400 bg-blue-50 p-1">
          <div className="font-bold text-blue-700 mb-1">併用店舗合算</div>
          <div className="flex gap-4 text-[10px] flex-wrap">
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
            <div>
              <span className="text-gray-600">手取:</span>
              <span className="font-bold ml-1 text-purple-700">
                {(combinedStoreTotal.back + combinedStoreTotal.panel).toLocaleString()}
              </span>
            </div>
          </div>
        </div>

        {/* 各店舗の合算 */}
        <div className="mt-1 border border-green-400 bg-green-50 p-1">
          <div className="font-bold text-green-700 mb-1">各店舗の合算</div>
          <div className="space-y-1">
            {storeStats.map(stat => (
              <div key={stat.store} className="flex gap-2 text-[10px] border-b border-green-200 pb-1 flex-wrap">
                <div className="w-14 font-bold">{stat.store}</div>
                <div>
                  <span className="text-gray-600">件数:</span>
                  <span className="ml-1">{stat.count}</span>
                </div>
                <div>
                  <span className="text-gray-600">本指名:</span>
                  <span className="ml-1 text-red-600 font-bold">{stat.honCount}</span>
                </div>
                <div>
                  <span className="text-gray-600">合計:</span>
                  <span className="ml-1 font-bold">
                    {(stat.basic + stat.nomination + stat.extension).toLocaleString()}
                  </span>
                </div>
                <div>
                  <span className="text-gray-600">手取:</span>
                  <span className="ml-1 text-purple-600">
                    {(stat.back + stat.panel).toLocaleString()}
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

        {/* 実績サマリー */}
        <div className="mt-1 border border-gray-300 bg-gray-50 p-1">
          <div className="font-bold text-gray-700 mb-1">月間実績サマリー</div>
          <div className="grid grid-cols-3 gap-2 text-[10px]">
            <div>
              <div className="text-gray-500">平均単価</div>
              <div className="font-bold">¥{calculations.averageUnitPrice.toLocaleString()}</div>
            </div>
            <div>
              <div className="text-gray-500">平均時間</div>
              <div className="font-bold">{calculations.averageDuration}分</div>
            </div>
            <div>
              <div className="text-gray-500">総接客時間</div>
              <div className="font-bold">{Math.floor(calculations.totalDuration / 60)}時間{calculations.totalDuration % 60}分</div>
            </div>
            <div>
              <div className="text-gray-500">基本+延長計</div>
              <div className="font-bold">¥{(calculations.totalBasic + calculations.totalExtension).toLocaleString()}</div>
            </div>
            <div>
              <div className="text-gray-500">指名料計</div>
              <div className="font-bold text-orange-600">¥{calculations.totalNomination.toLocaleString()}</div>
            </div>
            <div>
              <div className="text-gray-500">パネル料計</div>
              <div className="font-bold">¥{calculations.totalPanel.toLocaleString()}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
