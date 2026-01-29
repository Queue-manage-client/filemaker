'use client';

import React from 'react';

export default function HPDataTab() {
  return (
    <div className="bg-pink-200 p-2 text-[11px] h-full flex flex-col gap-2">
      {/* 上部セクション */}
      <div className="flex gap-4">
        {/* 左側セクション - 基本情報 */}
        <div className="flex flex-col gap-0.5 shrink-0">
          <div className="flex items-center gap-2">
            <span className="w-[80px] text-right whitespace-nowrap">チャームポイント</span>
            <input type="text" className="w-[180px] h-[20px] text-[11px] px-1 bg-white border border-gray-400" defaultValue="瞳" />
          </div>
          <div className="flex items-center gap-2">
            <span className="w-[80px] text-right whitespace-nowrap">性格</span>
            <input type="text" className="w-[180px] h-[20px] text-[11px] px-1 bg-white border border-gray-400" defaultValue="穏やか" />
          </div>
          <div className="flex items-center gap-2">
            <span className="w-[80px] text-right whitespace-nowrap">前職現職</span>
            <input type="text" className="w-[180px] h-[20px] text-[11px] px-1 bg-white border border-gray-400" defaultValue="人妻" />
          </div>
          <div className="flex items-center gap-2">
            <span className="w-[80px] text-right whitespace-nowrap">たばこ</span>
            <input type="text" className="w-[180px] h-[20px] text-[11px] px-1 bg-white border border-gray-400" defaultValue="吸いません。" />
          </div>
          <div className="flex items-center gap-2">
            <span className="w-[80px] text-right whitespace-nowrap">お酒</span>
            <input type="text" className="w-[180px] h-[20px] text-[11px] px-1 bg-white border border-gray-400" defaultValue="好きです" />
          </div>
          <div className="flex items-center gap-2">
            <span className="w-[80px] text-right whitespace-nowrap">好きなタイプ</span>
            <input type="text" className="w-[180px] h-[20px] text-[11px] px-1 bg-white border border-gray-400" defaultValue="優しい人" />
          </div>
          <div className="flex items-center gap-2">
            <span className="w-[80px] text-right whitespace-nowrap">得意プレイ</span>
            <input type="text" className="w-[180px] h-[20px] text-[11px] px-1 bg-white border border-gray-400" defaultValue="フェラ" />
          </div>
          <div className="flex items-center gap-2">
            <span className="w-[80px] text-right whitespace-nowrap">性感帯</span>
            <input type="text" className="w-[180px] h-[20px] text-[11px] px-1 bg-white border border-gray-400" defaultValue="おっぱい・あそこ" />
          </div>
        </div>

        {/* 中央セクション - 自信度 */}
        <div className="flex flex-col shrink-0">
          {/* タイトル */}
          <div className="bg-fuchsia-300 text-center py-0.5 text-[11px] w-[220px]">自信度</div>
          {/* テーブル */}
          <div className="flex flex-col">
            <div className="flex items-center border-b border-pink-300 py-0.5">
              <span className="w-[65px] text-right whitespace-nowrap pr-1">Dキス</span>
              <span className="w-[28px] h-[18px] border border-gray-400 bg-white text-center flex items-center justify-center">○</span>
              <span className="w-[75px] text-right whitespace-nowrap pr-1">フェラ</span>
              <span className="w-[28px] h-[18px] border border-gray-400 bg-white text-center flex items-center justify-center">◎</span>
            </div>
            <div className="flex items-center border-b border-pink-300 py-0.5">
              <span className="w-[65px] text-right whitespace-nowrap pr-1">全身リップ</span>
              <span className="w-[28px] h-[18px] border border-gray-400 bg-white text-center flex items-center justify-center">×</span>
              <span className="w-[75px] text-right whitespace-nowrap pr-1">素股</span>
              <span className="w-[28px] h-[18px] border border-gray-400 bg-white text-center flex items-center justify-center">○</span>
            </div>
            <div className="flex items-center border-b border-pink-300 py-0.5">
              <span className="w-[65px] text-right whitespace-nowrap pr-1">パイズリ</span>
              <span className="w-[28px] h-[18px] border border-gray-400 bg-white text-center flex items-center justify-center">○</span>
              <span className="w-[75px] text-right whitespace-nowrap pr-1">ローション</span>
              <span className="w-[28px] h-[18px] border border-gray-400 bg-white text-center flex items-center justify-center">◎</span>
            </div>
            <div className="flex items-center border-b border-pink-300 py-0.5">
              <span className="w-[65px] text-right whitespace-nowrap pr-1">玉舐め</span>
              <span className="w-[28px] h-[18px] border border-gray-400 bg-white text-center flex items-center justify-center">○</span>
              <span className="w-[75px] text-right whitespace-nowrap pr-1">アナル舐め</span>
              <span className="w-[28px] h-[18px] border border-gray-400 bg-white text-center flex items-center justify-center">○</span>
            </div>
            <div className="flex items-center border-b border-pink-300 py-0.5">
              <span className="w-[65px] text-right whitespace-nowrap pr-1">責め</span>
              <span className="w-[28px] h-[18px] border border-gray-400 bg-white text-center flex items-center justify-center">△</span>
              <span className="w-[75px] text-right whitespace-nowrap pr-1">受身</span>
              <span className="w-[28px] h-[18px] border border-gray-400 bg-white text-center flex items-center justify-center">○</span>
            </div>
            <div className="flex items-center border-b border-pink-300 py-0.5">
              <span className="w-[65px] text-right whitespace-nowrap pr-1">ローター</span>
              <span className="w-[28px] h-[18px] border border-gray-400 bg-white text-center flex items-center justify-center">○</span>
              <span className="w-[75px] text-right whitespace-nowrap pr-1">バイブ</span>
              <span className="w-[28px] h-[18px] border border-gray-400 bg-white text-center flex items-center justify-center">×</span>
            </div>
            <div className="flex items-center py-0.5">
              <span className="w-[65px] text-right whitespace-nowrap pr-1">電マ</span>
              <span className="w-[28px] h-[18px] border border-gray-400 bg-white text-center flex items-center justify-center">△</span>
              <span className="w-[75px] text-right whitespace-nowrap pr-1">オナニー披露</span>
              <span className="w-[28px] h-[18px] border border-gray-400 bg-white text-center flex items-center justify-center">△</span>
            </div>
          </div>
        </div>

        {/* 右側セクション - グラフ */}
        <div className="flex flex-col shrink-0">
          {/* タイトル */}
          <div className="bg-fuchsia-300 text-center py-0.5 text-[11px] w-[160px]">グラフ</div>
          {/* 入力フィールド */}
          <div className="flex flex-col gap-1 mt-1">
            <div className="flex items-center gap-1">
              <span className="w-[50px] text-right whitespace-nowrap">スタイル</span>
              <input type="text" className="w-[80px] h-[20px] text-[11px] px-1 bg-white border border-gray-400" />
            </div>
            <div className="flex items-center gap-1">
              <span className="w-[50px] text-right whitespace-nowrap">清楚感</span>
              <input type="text" className="w-[80px] h-[20px] text-[11px] px-1 bg-white border border-gray-400" />
            </div>
            <div className="flex items-center gap-1">
              <span className="w-[50px] text-right whitespace-nowrap">愛嬌</span>
              <input type="text" className="w-[80px] h-[20px] text-[11px] px-1 bg-white border border-gray-400" />
            </div>
            <div className="flex items-center gap-1">
              <span className="w-[50px] text-right whitespace-nowrap">恋人感</span>
              <input type="text" className="w-[80px] h-[20px] text-[11px] px-1 bg-white border border-gray-400" />
            </div>
            <div className="flex items-center gap-1">
              <span className="w-[50px] text-right whitespace-nowrap">素人感</span>
              <input type="text" className="w-[80px] h-[20px] text-[11px] px-1 bg-white border border-gray-400" />
            </div>
            <div className="flex items-center gap-1">
              <span className="w-[50px] text-right whitespace-nowrap">S度</span>
              <input type="text" className="w-[80px] h-[20px] text-[11px] px-1 bg-white border border-gray-400" />
            </div>
            <div className="flex items-center gap-1">
              <span className="w-[50px] text-right whitespace-nowrap">M度</span>
              <input type="text" className="w-[80px] h-[20px] text-[11px] px-1 bg-white border border-gray-400" />
            </div>
            <div className="flex items-center gap-1">
              <span className="w-[50px] text-right whitespace-nowrap">エロ度</span>
              <input type="text" className="w-[80px] h-[20px] text-[11px] px-1 bg-white border border-gray-400" />
            </div>
          </div>
        </div>
      </div>

      {/* 下部セクション */}
      <div className="flex flex-col gap-1 mt-1">
        {/* お客様へのメッセージ */}
        <div className="flex items-start gap-1">
          <span className="w-[120px] text-right whitespace-nowrap shrink-0">お客様へのメッセージ</span>
          <textarea
            className="w-[500px] h-[36px] text-[11px] px-1 bg-white border border-gray-400 resize-none"
            defaultValue="まだまだ恥ずかしがり屋な面のある私ですが、色々教えて下さいね！一緒に楽しく癒しの時間が過ごせたら…と思います。"
          />
        </div>
        {/* 店からのコメント */}
        <div className="flex items-start gap-1">
          <span className="w-[120px] text-right whitespace-nowrap shrink-0">店からのコメント</span>
          <textarea
            className="w-[500px] h-[60px] text-[11px] px-1 bg-yellow-100 border border-gray-400 resize-none"
            defaultValue="男性からの優しい愛撫で感度の良い美肌に魅せられ、至福の時間は刻々と過ぎて行く事でしょう。恥じらいながらの献身的なサービスは、ついつい時間を忘れてしまう程です。性格も優しく丁寧に尽くしてくれるでしょう。出勤が少ないですので会うチャンスを逃がさないで下さいね！"
          />
        </div>
      </div>
    </div>
  );
}
