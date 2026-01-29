'use client';

import React, { useState } from 'react';

const attendanceData = [
  { id: 1, date: '1/1', status: '出勤', actualTime: '8:00', attendance: '9:00', schedule1: '18:00', schedule2: '' },
  { id: 2, date: '1/2', status: '出勤', actualTime: '7:30', attendance: '9:30', schedule1: '18:00', schedule2: '' },
  { id: 3, date: '1/3', status: '休み', actualTime: '', attendance: '', schedule1: '', schedule2: '' },
  { id: 4, date: '1/4', status: '出勤', actualTime: '8:00', attendance: '10:00', schedule1: '19:00', schedule2: '' },
  { id: 5, date: '1/5', status: '出勤', actualTime: '7:00', attendance: '9:00', schedule1: '17:00', schedule2: '' },
  { id: 6, date: '1/6', status: '出勤', actualTime: '8:30', attendance: '10:00', schedule1: '18:30', schedule2: '' },
  { id: 7, date: '1/7', status: '休み', actualTime: '', attendance: '', schedule1: '', schedule2: '' },
  { id: 8, date: '1/8', status: '出勤', actualTime: '7:00', attendance: '9:00', schedule1: '17:00', schedule2: '' },
  { id: 9, date: '1/9', status: '出勤', actualTime: '8:00', attendance: '9:30', schedule1: '18:00', schedule2: '' },
  { id: 10, date: '1/10', status: '出勤', actualTime: '7:30', attendance: '10:00', schedule1: '18:30', schedule2: '' },
  { id: 11, date: '1/11', status: '出勤', actualTime: '8:00', attendance: '9:00', schedule1: '17:30', schedule2: '' },
  { id: 12, date: '1/12', status: '休み', actualTime: '', attendance: '', schedule1: '', schedule2: '' },
  { id: 13, date: '1/13', status: '出勤', actualTime: '7:00', attendance: '9:00', schedule1: '17:00', schedule2: '' },
  { id: 14, date: '1/14', status: '出勤', actualTime: '8:30', attendance: '10:00', schedule1: '19:00', schedule2: '' },
  { id: 15, date: '1/15', status: '出勤', actualTime: '7:30', attendance: '9:30', schedule1: '18:00', schedule2: '' },
];

export default function AttendanceRightTab() {
  const [year, setYear] = useState(2026);
  const [month, setMonth] = useState(1);

  return (
    <div className="h-full flex flex-col text-[11px]">
      {/* 年月選択 */}
      <div className="flex items-center mb-1">
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

      {/* ヘッダー */}
      <div className="flex border border-gray-400 bg-gray-200">
        <div className="w-12 text-center border-r border-gray-400 py-px">日付</div>
        <div className="w-16 text-center border-r border-gray-400 py-px">出勤状況</div>
        <div className="w-20 text-center border-r border-gray-400 py-px">受付実績時間</div>
        <div className="w-12 text-center border-r border-gray-400 py-px">出勤</div>
        <div className="w-12 text-center border-r border-gray-400 py-px">予定</div>
        <div className="flex-1 text-center py-px">予定</div>
      </div>

      {/* データ */}
      <div className="flex-1 overflow-y-auto border-x border-b border-gray-400">
        {attendanceData.map((row, index) => (
          <div key={row.id} className={`flex border-b border-gray-400 ${index % 2 === 0 ? 'bg-pink-100' : 'bg-purple-300'}`}>
            <div className="w-12 text-center border-r border-gray-400 py-px">{row.date}</div>
            <div className="w-16 text-center border-r border-gray-400 py-px">{row.status}</div>
            <div className="w-20 text-center border-r border-gray-400 py-px">{row.actualTime}</div>
            <div className="w-12 text-center border-r border-gray-400 py-px">{row.attendance}</div>
            <div className="w-12 text-center border-r border-gray-400 py-px">{row.schedule1}</div>
            <div className="flex-1 text-center py-px">{row.schedule2}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
