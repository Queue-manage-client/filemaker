'use client';

import React from 'react';

const goalData = [
  { id: 1, month: '2026年1月目標', receptionTime: '120', days: '22', hostessShare: '450,000', sales: '1,200,000', nominationCount: '35', nominationRate: '45%' },
  { id: 2, month: '2026年2月目標', receptionTime: '110', days: '20', hostessShare: '420,000', sales: '1,100,000', nominationCount: '32', nominationRate: '42%' },
  { id: 3, month: '2026年3月目標', receptionTime: '125', days: '23', hostessShare: '480,000', sales: '1,300,000', nominationCount: '38', nominationRate: '48%' },
  { id: 4, month: '2026年4月目標', receptionTime: '115', days: '21', hostessShare: '440,000', sales: '1,150,000', nominationCount: '33', nominationRate: '43%' },
  { id: 5, month: '2026年5月目標', receptionTime: '130', days: '24', hostessShare: '500,000', sales: '1,400,000', nominationCount: '40', nominationRate: '50%' },
  { id: 6, month: '2026年6月目標', receptionTime: '120', days: '22', hostessShare: '460,000', sales: '1,250,000', nominationCount: '36', nominationRate: '46%' },
  { id: 7, month: '2026年7月目標', receptionTime: '135', days: '25', hostessShare: '520,000', sales: '1,450,000', nominationCount: '42', nominationRate: '52%' },
  { id: 8, month: '2026年8月目標', receptionTime: '140', days: '26', hostessShare: '550,000', sales: '1,500,000', nominationCount: '45', nominationRate: '55%' },
  { id: 9, month: '2026年9月目標', receptionTime: '125', days: '23', hostessShare: '470,000', sales: '1,280,000', nominationCount: '37', nominationRate: '47%' },
  { id: 10, month: '2026年10月目標', receptionTime: '130', days: '24', hostessShare: '490,000', sales: '1,350,000', nominationCount: '39', nominationRate: '49%' },
  { id: 11, month: '2026年11月目標', receptionTime: '120', days: '22', hostessShare: '450,000', sales: '1,200,000', nominationCount: '35', nominationRate: '45%' },
  { id: 12, month: '2026年12月目標', receptionTime: '145', days: '27', hostessShare: '580,000', sales: '1,600,000', nominationCount: '48', nominationRate: '58%' },
];

export default function GoalTab() {
  return (
    <div className="h-full flex flex-col text-[11px]">
      {/* ヘッダー */}
      <div className="flex border border-gray-400 bg-gray-200">
        <div className="w-24 text-center border-r border-gray-400 py-px"></div>
        <div className="w-16 text-center border-r border-gray-400 py-px">受付時間</div>
        <div className="w-10 text-center border-r border-gray-400 py-px">日数</div>
        <div className="w-20 text-center border-r border-gray-400 py-px">ホステス取分</div>
        <div className="w-20 text-center border-r border-gray-400 py-px">売上高</div>
        <div className="w-14 text-center border-r border-gray-400 py-px">指名数</div>
        <div className="flex-1 text-center py-px">指名率</div>
      </div>

      {/* データ */}
      <div className="flex-1 overflow-y-auto border-x border-b border-gray-400">
        {goalData.map((row) => (
          <div key={row.id} className="flex border-b border-gray-400 bg-white">
            <div className="w-24 border-r border-gray-400 py-px px-1">{row.month}</div>
            <div className="w-16 text-right border-r border-gray-400 py-px pr-1">{row.receptionTime}</div>
            <div className="w-10 text-right border-r border-gray-400 py-px pr-1">{row.days}</div>
            <div className="w-20 text-right border-r border-gray-400 py-px pr-1">{row.hostessShare}</div>
            <div className="w-20 text-right border-r border-gray-400 py-px pr-1">{row.sales}</div>
            <div className="w-14 text-right border-r border-gray-400 py-px pr-1">{row.nominationCount}</div>
            <div className="flex-1 text-right py-px pr-1">{row.nominationRate}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
