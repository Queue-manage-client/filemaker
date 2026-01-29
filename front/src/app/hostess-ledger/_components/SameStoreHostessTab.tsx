'use client';

import React, { useState } from 'react';

const hostessData = [
  { id: 1, name: 'あい', age: 32, employment: 'active' },
  { id: 2, name: 'あいか', age: 36, employment: 'active' },
  { id: 3, name: 'あおい', age: 36, employment: 'active' },
  { id: 4, name: 'かな', age: 29, employment: 'active' },
  { id: 5, name: 'さき', age: 34, employment: 'active' },
  { id: 6, name: 'さやか', age: 31, employment: 'active' },
  { id: 7, name: 'しずく', age: 28, employment: 'active' },
  { id: 8, name: 'なな', age: 33, employment: 'retired' },
  { id: 9, name: 'ひかり', age: 30, employment: 'active' },
  { id: 10, name: 'まりあ', age: 35, employment: 'active' },
  { id: 11, name: 'みく', age: 27, employment: 'active' },
  { id: 12, name: 'ゆう', age: 32, employment: 'active' },
  { id: 13, name: 'ゆな', age: 29, employment: 'retired' },
  { id: 14, name: 'れいな', age: 34, employment: 'active' },
  { id: 15, name: 'るな', age: 26, employment: 'active' },
];

export default function SameStoreHostessTab() {
  const [filter, setFilter] = useState<'active' | 'retired'>('active');

  const filteredData = hostessData.filter((row) => row.employment === filter);

  return (
    <div className="h-full flex flex-col text-[11px]">
      {/* 店舗情報とフィルター */}
      <div className="flex items-center mb-1">
        <span>店舗: <span className="font-bold">2</span> 京都人妻デリヘル倶楽部</span>
        <div className="ml-4 flex items-center gap-2">
          <label className="flex items-center">
            <input
              type="radio"
              name="employment-filter"
              checked={filter === 'active'}
              onChange={() => setFilter('active')}
              className="w-3 h-3"
            />
            <span className="ml-0.5">在職</span>
          </label>
          <label className="flex items-center">
            <input
              type="radio"
              name="employment-filter"
              checked={filter === 'retired'}
              onChange={() => setFilter('retired')}
              className="w-3 h-3"
            />
            <span className="ml-0.5">退職</span>
          </label>
        </div>
      </div>

      {/* データ */}
      <div className="flex-1 overflow-y-auto border border-gray-400">
        {filteredData.map((row) => (
          <div key={row.id} className="flex border-b border-gray-400 bg-white items-center">
            <div className="w-6 text-center border-r border-gray-400 py-px bg-gray-300">&lt;</div>
            <div className="w-16 border-r border-gray-400 py-px px-1">{row.name}</div>
            <div className="w-8 text-right border-r border-gray-400 py-px pr-1">{row.age}</div>
            <div className="w-6 text-center border-r border-gray-400 py-px">歳</div>
            <div className="flex-1 py-px px-1"></div>
          </div>
        ))}
      </div>
    </div>
  );
}
