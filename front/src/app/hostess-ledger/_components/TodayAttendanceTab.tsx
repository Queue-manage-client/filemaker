'use client';

import React from 'react';

const hostessData = [
  { id: 1, status: '終了', name: 'サナ', attendance: '9:00', end: '16:00', home: '17:30' },
  { id: 2, status: '終了', name: 'ほのり', attendance: '9:30', end: '15:30', home: '17:00' },
  { id: 3, status: '終了', name: 'みく', attendance: '10:00', end: '17:00', home: '18:30' },
  { id: 4, status: '終了', name: 'あい', attendance: '10:00', end: '16:30', home: '18:00' },
  { id: 5, status: '終了', name: 'ゆう', attendance: '10:30', end: '17:30', home: '19:00' },
  { id: 6, status: '接客中', name: 'まりあ', attendance: '11:00', end: '18:00', home: '19:30' },
  { id: 7, status: '接客中', name: 'れいな', attendance: '11:00', end: '17:30', home: '19:00' },
  { id: 8, status: '接客中', name: 'かな', attendance: '11:30', end: '18:30', home: '20:00' },
  { id: 9, status: '待機中', name: 'ひかり', attendance: '12:00', end: '19:00', home: '20:30' },
  { id: 10, status: '待機中', name: 'あおい', attendance: '12:00', end: '18:30', home: '20:00' },
  { id: 11, status: '待機中', name: 'るな', attendance: '12:30', end: '19:30', home: '21:00' },
  { id: 12, status: '待機中', name: 'なな', attendance: '13:00', end: '20:00', home: '21:30' },
  { id: 13, status: '出勤前', name: 'もえ', attendance: '14:00', end: '21:00', home: '22:30' },
  { id: 14, status: '出勤前', name: 'ゆな', attendance: '14:30', end: '21:30', home: '23:00' },
  { id: 15, status: '出勤前', name: 'さき', attendance: '15:00', end: '22:00', home: '23:30' },
];

export default function TodayAttendanceTab() {
  return (
    <div className="h-full flex flex-col text-[11px]">
      {/* 日付 */}
      <div className="text-center mb-1">2025年12月26日</div>

      {/* ヘッダー */}
      <div className="flex border border-gray-400 bg-gray-200">
        <div className="w-16 text-center border-r border-gray-400 py-px">出勤状況</div>
        <div className="w-16 text-center border-r border-gray-400 py-px"></div>
        <div className="w-16 text-center border-r border-gray-400 py-px">出勤</div>
        <div className="w-16 text-center border-r border-gray-400 py-px">終了</div>
        <div className="flex-1 text-center py-px">帰宅</div>
      </div>

      {/* データ */}
      <div className="flex-1 overflow-y-auto border-x border-b border-gray-400">
        {hostessData.map((row) => (
          <div key={row.id} className="flex border-b border-gray-400 bg-purple-300">
            <div className="w-16 text-center border-r border-gray-400 py-px">{row.status}</div>
            <div className="w-16 text-center border-r border-gray-400 py-px">{row.name}</div>
            <div className="w-16 text-center border-r border-gray-400 py-px">{row.attendance}</div>
            <div className="w-16 text-center border-r border-gray-400 py-px">{row.end}</div>
            <div className="flex-1 text-center py-px">{row.home}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
