'use client';

import React from 'react';

export default function ManagementTab() {
  return (
    <div className="bg-gray-100 p-2 text-[11px] h-full flex gap-12">
      {/* 左側セクション */}
      <div className="flex flex-col gap-0.5 shrink-0">
        {/* 受取率 */}
        <div className="flex items-center gap-1">
          <span className="w-[70px] text-right whitespace-nowrap">受取率</span>
          <input type="text" className="w-[50px] h-[18px] text-[11px] px-1 bg-white border border-gray-400" />
        </div>
        {/* 交通費 */}
        <div className="flex items-center gap-1">
          <span className="w-[70px] text-right whitespace-nowrap">交通費</span>
          <input type="text" className="w-[50px] h-[18px] text-[11px] px-1 bg-white border border-gray-400" defaultValue="300" />
          <span className="text-[11px]">/日</span>
        </div>
        {/* 交通費迎え */}
        <div className="flex items-center gap-1">
          <span className="w-[70px] text-right whitespace-nowrap">交通費迎え</span>
          <input type="text" className="w-[50px] h-[18px] text-[11px] px-1 bg-white border border-gray-400" defaultValue="150" />
        </div>
        {/* 交通費送り */}
        <div className="flex items-center gap-1">
          <span className="w-[70px] text-right whitespace-nowrap">交通費送り</span>
          <input type="text" className="w-[50px] h-[18px] text-[11px] px-1 bg-white border border-gray-400" defaultValue="150" />
        </div>

        {/* 空白スペース */}
        <div className="h-6"></div>

        {/* S:・新規S追加 と バック率・雑費率 と 基準時間バック 横並び */}
        <div className="flex gap-4">
          {/* S: と 新規S追加 */}
          <div className="flex flex-col gap-0.5">
            <div className="flex items-center gap-1">
              <span className="text-[11px] text-blue-600 underline cursor-pointer">S:</span>
              <input type="text" className="w-[50px] h-[18px] text-[11px] px-1 bg-white border border-gray-400" />
            </div>
            <button type="button" className="w-[70px] h-[18px] text-[10px] bg-gray-200 border border-gray-400 hover:bg-gray-300">新規S追加</button>
          </div>

          {/* バック率・雑費率 */}
          <div className="flex flex-col gap-0.5">
            <div className="flex items-center gap-1">
              <span className="whitespace-nowrap">バック率</span>
              <input type="text" className="w-[50px] h-[18px] text-[11px] px-1 bg-white border border-gray-400" />
            </div>
            <div className="flex items-center gap-1">
              <span className="whitespace-nowrap">雑費率</span>
              <input type="text" className="w-[50px] h-[18px] text-[11px] px-1 bg-white border border-gray-400" defaultValue="0.05" />
            </div>
          </div>

          {/* 基準時間バック */}
          <div className="flex flex-col gap-0.5">
            <span className="whitespace-nowrap">基準時間バック</span>
            <div className="flex items-center gap-1">
              <input type="text" className="w-[50px] h-[18px] text-[11px] px-1 bg-white border border-gray-400" />
              <span className="text-[11px]">時間</span>
              <input type="text" className="w-[50px] h-[18px] text-[11px] px-1 bg-white border border-gray-400" />
            </div>
            <div className="flex items-center gap-1">
              <input type="text" className="w-[50px] h-[18px] text-[11px] px-1 bg-white border border-gray-400" />
              <span className="text-[11px]">時間</span>
              <input type="text" className="w-[50px] h-[18px] text-[11px] px-1 bg-white border border-gray-400" />
            </div>
          </div>
        </div>
      </div>

      {/* 右側セクション */}
      <div className="flex flex-col gap-0.5 shrink-0">
        {/* 氏名 */}
        <div className="flex items-center gap-1">
          <span className="w-[80px] text-right whitespace-nowrap">氏名</span>
          <input type="text" className="w-[180px] h-[18px] text-[11px] px-1 bg-yellow-100 border border-gray-400" />
        </div>
        {/* 氏名ふりがな */}
        <div className="flex items-center gap-1">
          <span className="w-[80px] text-right whitespace-nowrap">氏名ふりがな</span>
          <input type="text" className="w-[180px] h-[18px] text-[11px] px-1 bg-yellow-100 border border-gray-400" />
        </div>
        {/* 生年月日・実年齢 */}
        <div className="flex items-center gap-1">
          <span className="w-[80px] text-right whitespace-nowrap">生年月日</span>
          <input type="text" className="w-[100px] h-[18px] text-[11px] px-1 bg-yellow-100 border border-gray-400" />
          <span className="whitespace-nowrap ml-2">実年齢</span>
          <input type="text" className="w-[50px] h-[18px] text-[11px] px-1 bg-white border border-gray-400" />
        </div>
        {/* 空行 */}
        <div className="h-2"></div>
        {/* 携帯電話 */}
        <div className="flex items-center gap-1">
          <span className="w-[80px] text-right whitespace-nowrap">携帯電話</span>
          <input type="text" className="w-[180px] h-[18px] text-[11px] px-1 bg-yellow-100 border border-gray-400" />
        </div>
        {/* 携帯メール */}
        <div className="flex items-center gap-1">
          <span className="w-[80px] text-right whitespace-nowrap">携帯メール</span>
          <input type="text" className="w-[180px] h-[18px] text-[11px] px-1 bg-yellow-100 border border-gray-400" />
        </div>
        {/* 緊急連絡先 */}
        <div className="flex items-center gap-1">
          <span className="w-[80px] text-right whitespace-nowrap">緊急連絡先</span>
          <input type="text" className="w-[180px] h-[18px] text-[11px] px-1 bg-yellow-100 border border-gray-400" />
        </div>
        {/* 空行 */}
        <div className="h-2"></div>
        {/* 続柄 */}
        <div className="flex items-center gap-1">
          <span className="w-[80px] text-right whitespace-nowrap">続柄</span>
          <input type="text" className="w-[80px] h-[18px] text-[11px] px-1 bg-white border border-gray-400" defaultValue="姉妹" />
        </div>
        {/* 名前 */}
        <div className="flex items-center gap-1">
          <span className="w-[80px] text-right whitespace-nowrap">名前</span>
          <input type="text" className="w-[180px] h-[18px] text-[11px] px-1 bg-yellow-100 border border-gray-400" />
        </div>

        {/* 郵便番号 */}
        <div className="flex items-center gap-1 mt-3">
          <span className="w-[80px] text-right whitespace-nowrap">郵便番号</span>
          <input type="text" className="w-[80px] h-[18px] text-[11px] px-1 bg-white border border-gray-400" defaultValue="6150013" />
          <span className="text-[10px] whitespace-nowrap">◀郵便番号を入れると住所が入ります。例: 607-8354</span>
        </div>

        {/* 住所ヘッダー */}
        <div className="flex items-center gap-0 mt-0.5">
          <span className="w-[82px]"></span>
          <span className="w-[60px] text-[10px]">都道府県</span>
          <span className="w-[100px] text-[10px]">市区町村</span>
          <span className="w-[100px] text-[10px]">丁町名</span>
          <span className="w-[80px] text-[10px]">番地</span>
        </div>

        {/* 住所入力 */}
        <div className="flex items-center gap-0">
          <span className="w-[82px]"></span>
          <input type="text" className="w-[60px] h-[18px] text-[11px] px-1 bg-white border border-gray-400" defaultValue="京都府" />
          <input type="text" className="w-[100px] h-[18px] text-[11px] px-1 bg-white border border-gray-400" defaultValue="京都市右京区" />
          <input type="text" className="w-[100px] h-[18px] text-[11px] px-1 bg-white border border-gray-400" defaultValue="西院松井町" />
          <input type="text" className="w-[80px] h-[18px] text-[11px] px-1 bg-white border border-gray-400" />
        </div>

        {/* 建物等 */}
        <div className="flex items-center gap-0">
          <span className="w-[82px] text-right pr-1 text-[10px]">建物等</span>
          <input type="text" className="w-[340px] h-[18px] text-[11px] px-1 bg-yellow-100 border border-gray-400" />
        </div>
      </div>
    </div>
  );
}
