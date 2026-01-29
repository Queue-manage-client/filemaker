'use client';

import React from 'react';

const reservationData = [
  { id: 1, content: '15:00 山田様 指名予約' },
  { id: 2, content: '16:30 田中様 新規予約' },
  { id: 3, content: '18:00 佐藤様 指名予約' },
  { id: 4, content: '19:00 鈴木様 フリー予約' },
  { id: 5, content: '20:00 高橋様 指名予約' },
  { id: 6, content: '21:00 伊藤様 新規予約' },
  { id: 7, content: '22:00 渡辺様 指名予約' },
  { id: 8, content: '23:00 中村様 フリー予約' },
  { id: 9, content: '23:30 小林様 指名予約' },
  { id: 10, content: '24:00 加藤様 新規予約' },
  { id: 11, content: '24:30 吉田様 指名予約' },
  { id: 12, content: '25:00 山本様 フリー予約' },
  { id: 13, content: '25:30 松本様 指名予約' },
  { id: 14, content: '26:00 井上様 新規予約' },
  { id: 15, content: '26:30 木村様 指名予約' },
];

export default function ReservationTab() {
  return (
    <div className="h-full flex flex-col text-[11px]">
      {/* 上部 */}
      <div className="flex items-center mb-1 gap-2">
        <input
          type="text"
          defaultValue="2026年01月23日"
          className="w-24 h-6 border border-gray-400 px-1 bg-pink-200"
        />
        <button
          type="button"
          className="px-3 py-1 bg-gray-200 border border-gray-400 hover:bg-gray-300 ml-auto"
        >
          この日で新規予約
        </button>
      </div>

      {/* データ */}
      <div className="flex-1 overflow-y-auto border border-gray-400">
        {reservationData.map((row) => (
          <div key={row.id} className="flex border-b border-gray-400 bg-white h-[72px] items-center">
            <div className="flex-1 px-1">{row.content}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
