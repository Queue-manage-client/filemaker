'use client';

import React from 'react';

export default function TodayReservationNGHistoryTab() {
  return (
    <div className="h-full flex flex-col text-[11px] overflow-auto gap-2">
      {/* 1段目: 本日の予約 + 日付 | New + ホステス→顧客NG */}
      <div className="flex">
        <div className="flex items-center gap-2">
          <span className="border-b border-black">本日の予約</span>
          <input
            type="text"
            defaultValue="2026年01月23日"
            className="border border-gray-400 px-1 py-0.5 w-28"
          />
        </div>
        <div className="flex items-center gap-1 ml-auto">
          <span className="bg-red-500 text-white px-1">New</span>
          <span className="bg-red-500 text-white px-1">ホステス→顧客NG</span>
        </div>
      </div>

      {/* 2段目: ピンク予約リスト | 白リスト */}
      <div className="flex gap-2">
        {/* 左: ピンク予約リスト（大きめ） */}
        <div className="w-3/5 border border-gray-400">
          {[1,2,3,4,5,6,7].map((i) => (
            <div key={i} className={`h-5 border-b border-gray-400 ${i % 2 === 1 ? 'bg-pink-200' : 'bg-white'}`}></div>
          ))}
        </div>
        {/* 右: 白リスト（小さめ、縦長） */}
        <div className="w-2/5 border border-gray-400">
          {[1,2,3,4,5,6,7,8,9,10].map((i) => (
            <div key={i} className="h-6 border-b border-gray-400 bg-white"></div>
          ))}
        </div>
      </div>

      {/* 3段目: ホステス→顧客NG + 顧客→ホステスNG（横並び）| New + 顧客→ホステスNG + 白リスト */}
      <div className="flex gap-2">
        {/* 左側: 2つのテーブル横並び（幅広め） */}
        <div className="w-3/5 flex gap-1">
          {/* ホステス→顧客NG */}
          <div className="flex-1">
            <div className="bg-red-500 text-white px-1 inline-block mb-1 text-[10px]">ホステス→顧客NG</div>
            <div className="border border-gray-400">
              <div className="flex bg-gray-100 border-b border-gray-400 text-[9px]">
                <div className="w-12 text-center border-r border-gray-400 py-px">顧客番号</div>
                <div className="w-10 text-center border-r border-gray-400 py-px text-red-500">旧番号</div>
                <div className="flex-1 text-center py-px">理由</div>
              </div>
              {[1,2,3,4].map((i) => (
                <div key={i} className="flex h-5 border-b border-gray-400 bg-white">
                  <div className="w-12 border-r border-gray-400 px-1"></div>
                  <div className="w-10 border-r border-gray-400 px-1"></div>
                  <div className="flex-1 px-1">{i <= 2 ? '<非' : ''}</div>
                </div>
              ))}
            </div>
          </div>
          {/* 顧客→ホステスNG */}
          <div className="flex-1">
            <div className="bg-red-500 text-white px-1 inline-block mb-1 text-[10px]">顧客→ホステスNG</div>
            <div className="border border-gray-400">
              <div className="flex bg-gray-100 border-b border-gray-400 text-[9px]">
                <div className="w-12 text-center border-r border-gray-400 py-px">顧客番号</div>
                <div className="w-10 text-center border-r border-gray-400 py-px text-red-500">旧番号</div>
                <div className="flex-1 text-center py-px">理由</div>
              </div>
              {[1,2,3,4].map((i) => (
                <div key={i} className="flex h-5 border-b border-gray-400 bg-white">
                  <div className="w-12 border-r border-gray-400 px-1"></div>
                  <div className="w-10 border-r border-gray-400 px-1 text-blue-600">{i === 1 ? '1311' : ''}</div>
                  <div className="flex-1 px-1"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
        {/* 右側: New + 顧客→ホステスNG + 白リスト（幅狭め、縦短め） */}
        <div className="w-2/5">
          <div className="flex items-center gap-1 mb-1">
            <span className="bg-red-500 text-white px-1">New</span>
            <span className="bg-red-500 text-white px-1">顧客→ホステスNG</span>
          </div>
          <div className="border border-gray-400">
            {[1,2,3,4].map((i) => (
              <div key={i} className="h-5 border-b border-gray-400 bg-white"></div>
            ))}
          </div>
        </div>
      </div>

      {/* 4段目: NGとする場所 + 自宅付近 */}
      <div>
        <div className="bg-red-500 text-white px-1 inline-block">NGとする場所</div>
        <div className="mt-1">
          <span>自宅付近　</span>
          <span className="border-b border-black">京都府京都市右京区西院松井町</span>
        </div>
      </div>

      {/* 5段目: アドレス交換顧客 | 場所区分+ホテル名 | New（3列） */}
      <div className="flex gap-2">
        {/* 左: アドレス交換顧客（小さめ 1/4） */}
        <div className="w-1/4">
          <div>アドレス交換顧客</div>
          <div className="text-[9px]">顧客番号 1=京都2=人妻旧番号</div>
          <div className="border border-gray-400 mt-1">
            {[
              { customerNo: '936', type: '2', oldNo: '524', name: 'タナカ', selected: true },
              { customerNo: '842', type: '1', oldNo: '312', name: 'ヤマダ', selected: false },
              { customerNo: '715', type: '2', oldNo: '208', name: 'サトウ', selected: false },
              { customerNo: '623', type: '1', oldNo: '445', name: 'スズキ', selected: false },
              { customerNo: '589', type: '2', oldNo: '167', name: 'タカハシ', selected: false },
              { customerNo: '', type: '', oldNo: '', name: '', selected: false },
              { customerNo: '', type: '', oldNo: '', name: '', selected: false },
              { customerNo: '', type: '', oldNo: '', name: '', selected: false },
            ].map((row, i) => (
              <div key={i} className={`flex h-5 border-b border-gray-400 ${row.selected ? 'bg-blue-300' : 'bg-white'}`}>
                <div className="w-7 border-r border-gray-400 px-0.5 text-[9px]">{row.customerNo}</div>
                <div className="w-5 border-r border-gray-400 px-0.5 text-blue-600 text-[9px]">{row.type}</div>
                <div className="w-8 border-r border-gray-400 px-0.5 text-[9px]">{row.oldNo}</div>
                <div className="flex-1 px-0.5 text-[9px]">{row.name}</div>
              </div>
            ))}
          </div>
          <div className="border border-gray-400 mt-1">
            <div className="flex h-5 border-b border-gray-400 bg-white items-center px-1">
              <span className="bg-red-500 text-white px-1">New</span>
            </div>
            {[
              { customerNo: '421', type: '1', oldNo: '289', name: 'ナカムラ', selected: true },
              { customerNo: '358', type: '2', oldNo: '176', name: 'イトウ', selected: false },
              { customerNo: '294', type: '1', oldNo: '423', name: 'ワタナベ', selected: false },
              { customerNo: '', type: '', oldNo: '', name: '', selected: false },
              { customerNo: '', type: '', oldNo: '', name: '', selected: false },
            ].map((row, i) => (
              <div key={i} className={`flex h-5 border-b border-gray-400 ${row.selected ? 'bg-blue-300' : 'bg-white'}`}>
                <div className="w-7 border-r border-gray-400 px-0.5 text-[9px]">{row.customerNo}</div>
                <div className="w-5 border-r border-gray-400 px-0.5 text-blue-600 text-[9px]">{row.type}</div>
                <div className="w-8 border-r border-gray-400 px-0.5 text-[9px]">{row.oldNo}</div>
                <div className="flex-1 px-0.5 text-[9px]">{row.name}</div>
              </div>
            ))}
          </div>
        </div>

        {/* 中央: 場所区分 + ホテル名（1つのテーブル、幅広め） */}
        <div className="flex-1">
          <div className="flex">
            <div className="w-1/2">場所区分</div>
            <div className="w-1/2">ホテル名</div>
          </div>
          <div className="border border-gray-400 mt-1">
            {[
              { type: '特定の地域', area: '', hasBox: true, hotel: '' },
              { type: '地域', area: '円町', hasBox: false, hotel: '' },
              { type: '', area: '', hasBox: false, hotel: '' },
              { type: '地域', area: '阪急桂　東口', hasBox: false, hotel: '' },
              { type: '特定の地域', area: '', hasBox: true, hotel: '' },
              { type: '地域', area: '堀川丸太町', hasBox: false, hotel: '' },
              { type: '地域', area: '', hasBox: false, hotel: '' },
              { type: '', area: '', hasBox: false, hotel: '' },
              { type: '', area: '', hasBox: false, hotel: '' },
              { type: '', area: '', hasBox: false, hotel: '' },
              { type: '', area: '', hasBox: false, hotel: '' },
              { type: '', area: '', hasBox: false, hotel: '' },
            ].map((row, i) => (
              <div key={i} className="flex h-5 border-b border-gray-400 bg-white">
                <div className="w-16 px-1 text-red-500 border-r border-gray-400">{row.type}</div>
                <div className="w-20 px-1 text-red-500 border-r border-gray-400">{row.area}</div>
                <div className="w-4 border-r border-gray-400">{row.hasBox && <div className="w-3 h-3 bg-gray-300 m-0.5"></div>}</div>
                <div className="flex-1 px-1">{row.hotel}</div>
              </div>
            ))}
          </div>
        </div>

        {/* 右: New（小さめ） */}
        <div className="w-1/6">
          <div className="bg-red-500 text-white px-1 inline-block">New</div>
          <div className="border border-gray-400 mt-1">
            {[1,2,3,4,5,6,7,8,9,10,11,12].map((i) => (
              <div key={i} className="h-5 border-b border-gray-400 bg-white"></div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
