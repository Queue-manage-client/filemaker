'use client';

import React from 'react';

const contactData = [
  { id: 1, content: '本日の予約確認をお願いします' },
  { id: 2, content: '明日のシフト変更について連絡' },
  { id: 3, content: 'お客様からの伝言あり' },
  { id: 4, content: '新規指名のお客様情報' },
  { id: 5, content: '来週の出勤希望を提出してください' },
  { id: 6, content: '衣装の確認をお願いします' },
  { id: 7, content: 'イベント参加の確認' },
  { id: 8, content: '写真撮影の日程調整' },
  { id: 9, content: 'お客様アンケート結果' },
  { id: 10, content: '研修の案内' },
  { id: 11, content: '給与明細の確認' },
  { id: 12, content: '健康診断の日程' },
  { id: 13, content: '新メニューの説明会' },
  { id: 14, content: '年末年始のシフト確認' },
  { id: 15, content: 'キャンペーン情報の共有' },
];

export default function FromFrontTab() {
  return (
    <div className="h-full flex flex-col text-[11px]">
      {/* 上部 */}
      <div className="flex items-center mb-1 gap-2">
        <input
          type="text"
          className="w-24 h-6 border border-gray-400 px-1 bg-pink-200"
        />
        <span>-</span>
        <input
          type="text"
          className="w-24 h-6 border border-gray-400 px-1 bg-pink-200"
        />
        <button
          type="button"
          className="px-3 py-1 bg-gray-200 border border-gray-400 hover:bg-gray-300"
        >
          リスト印刷へ
        </button>
      </div>

      {/* 連絡履歴ラベル */}
      <div className="text-right mb-1">連絡履歴</div>

      {/* データ */}
      <div className="flex-1 overflow-y-auto border border-gray-400">
        {contactData.map((row) => (
          <div key={row.id} className="flex border-b border-gray-400 bg-white h-[72px] items-center">
            <div className="flex-1 px-1">{row.content}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
