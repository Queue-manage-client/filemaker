'use client';

import React from 'react';

// 予約データ
const reservationData = [
  {
    id: 1,
    area: '京都',
    customerId: '新49',
    customerName: 'タカハシ',
    reservationType: '前日予約',
    startTime: '19:25',
    courseType: 'S',
    duration: '60分',
    endTime: '20:25',
    location: '梅津',
    address: '自:京都市右京区西院西貝川町',
    colorType: 'pink',
  },
  {
    id: 2,
    area: '南ホテ',
    customerId: '新60038',
    customerName: 'タナカ',
    reservationType: '前日予約',
    startTime: '21:19',
    courseType: 'S',
    duration: '80分',
    endTime: '22:39',
    location: '南IC',
    address: 'プリオ(DOP)声掛けあり(イベント',
    colorType: 'cyan',
  },
  {
    id: 3,
    area: '京都',
    customerId: '新656',
    customerName: 'フナカワ',
    reservationType: '前日予約',
    startTime: '23:00',
    courseType: 'S',
    duration: '100分',
    endTime: '0:40',
    location: '南IC',
    address: '仮面舞踏会(声掛けあり)',
    colorType: 'pink',
  },
  {
    id: 4,
    area: '南ホテ',
    customerId: '新44957',
    customerName: 'スギモト',
    reservationType: '前日予約',
    startTime: '20:00',
    courseType: 'S',
    duration: '90分',
    endTime: '21:30',
    location: '南IC',
    address: '自:大阪市中央区難波',
    colorType: 'cyan',
  },
  {
    id: 5,
    area: '京都',
    customerId: '新123',
    customerName: 'ヤマダ',
    reservationType: '当日予約',
    startTime: '18:00',
    courseType: 'S',
    duration: '60分',
    endTime: '19:00',
    location: '梅津',
    address: '自:京都市下京区四条通',
    colorType: 'pink',
  },
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

      {/* 予約カード一覧 */}
      <div className="flex-1 overflow-y-auto space-y-1">
        {reservationData.map((row) => (
          <div
            key={row.id}
            className={`border border-gray-400 ${
              row.colorType === 'cyan' ? 'bg-cyan-200' : 'bg-pink-200'
            }`}
          >
            {/* 1行目: エリア、顧客ID、顧客名、予約タイプ */}
            <div className="flex items-center px-1 py-0.5 border-b border-gray-300">
              <span className="font-bold">{row.area}</span>
              <span className="ml-4">{row.customerId}</span>
              <span className="ml-2 font-bold">{row.customerName}</span>
              <span className="ml-auto bg-yellow-100 border border-yellow-400 px-2 text-[10px]">
                {row.reservationType}
              </span>
            </div>

            {/* 2行目: 時間、コース、所要時間、終了時間、詳細ボタン */}
            <div className="flex items-center px-1 py-0.5 border-b border-gray-300">
              <span className="font-bold text-[13px]">{row.startTime}</span>
              <span className="ml-2 bg-white border border-gray-400 px-1">{row.courseType}</span>
              <span className="ml-2">{row.duration}</span>
              <span className="ml-2">→</span>
              <span className="ml-2 font-bold text-[13px]">{row.endTime}</span>
              <button
                type="button"
                className="ml-auto bg-gray-100 border border-gray-400 px-2 py-0.5 hover:bg-gray-200"
              >
                詳細
              </button>
            </div>

            {/* 3行目: 場所、住所/備考 */}
            <div className="flex items-center px-1 py-0.5">
              <span className="font-bold">{row.location}</span>
              <span className="ml-4 text-[10px]">{row.address}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
