'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowLeft, ChevronLeft } from "lucide-react";
// import type { TodayCastData } from '@/types'; // 将来の実装で使用予定
import { sampleCastData } from '@/data/castSampleData';
import { formatDate } from 'date-fns';




export default function RT2Panel() {
  const router = useRouter();
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    document.title = 'RT Ⅱ パネル - Dispatch Harmony Hub';
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);


  const formatTime = (date: Date) => {
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');
    
    return `${hours}:${minutes}:${seconds}`;
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* ヘッダー */}
      <div className="h-[50px] bg-white border-b border-zinc-300">
        <div className="flex items-center h-full px-2">
          {/* ダッシュボードに戻る - 左端 */}
          <Button
            variant="outline"
            onClick={() => router.push('/dashboard')}
            className="h-8 px-3 text-xs flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            ダッシュボードに戻る
          </Button>

          {/* 中央配置のボタン群 */}
          <div className="flex-1 flex items-center justify-center gap-2">
            {/* RT Ⅱ パネルタイトル */}
            <h1 className="text-lg font-bold mr-2">RT Ⅱ パネル</h1>

            {/* 日付表示 */}
            <div className="text-sm font-mono bg-gray-500 text-white px-2 py-1 rounded">
              {formatDate(currentTime, 'yyyy/MM/dd(EEE)')}
            </div>

            {/* 時刻表示 */}
            <div className="text-sm font-mono bg-gray-500 text-white px-2 py-1 rounded">
              {formatTime(currentTime)}
            </div>

            {/* 新顧客検索 */}
            <Button
              variant="outline"
              className="h-8 px-4 text-xs border-black"
              onClick={() => router.push('/customer-ledger')}
            >
              新顧客検索
            </Button>

            {/* 配車パネル */}
            <Button
              className="h-8 px-4 text-xs bg-amber-200 hover:bg-amber-300 text-black border border-black"
              onClick={() => router.push('/dispatch-panel-2d')}
            >
              配車パネル
            </Button>

            {/* 手配表 */}
            <Button
              className="h-8 px-4 text-xs bg-purple-400 hover:bg-purple-500 text-black border border-black"
              onClick={() => router.push('/tehai')}
            >
              手配表
            </Button>

            {/* Menu */}
            <Button
              variant="outline"
              className="h-8 px-4 text-xs border-black"
              onClick={() => router.push('/dashboard')}
            >
              Menu
            </Button>
          </div>
        </div>
      </div>

      {/* メインコンテンツ */}
      <div className="p-4">

      {/* メインテーブル */}
      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-xs table-fixed">
              <colgroup>
                <col style={{width: '20px'}} />
                <col style={{width: '45px'}} />
                <col style={{width: '120px'}} />
                <col style={{width: '25px'}} />
                <col style={{width: '25px'}} />
                <col style={{width: '50px'}} />
                <col style={{width: '70px'}} />
                <col style={{width: '50px'}} />
                <col style={{width: '40px'}} />
                <col style={{width: '40px'}} />
                <col style={{width: '70px'}} />
                <col style={{width: '30px'}} />
                <col style={{width: '20px'}} />
                <col style={{width: '140px'}} />
                <col style={{width: '20px'}} />
                <col style={{width: '140px'}} />
                <col style={{width: '20px'}} />
                <col style={{width: '140px'}} />
                <col style={{width: '20px'}} />
                <col style={{width: '140px'}} />
                <col style={{width: '20px'}} />
                <col style={{width: '140px'}} />
                <col style={{width: '20px'}} />
                <col style={{width: '140px'}} />
                <col style={{width: '20px'}} />
                <col style={{width: '140px'}} />
                <col style={{width: '20px'}} />
                <col style={{width: '140px'}} />
                <col style={{width: '20px'}} />
                <col style={{width: '70px'}} />
                <col style={{width: '70px'}} />
                <col style={{width: '130px'}} />
                <col style={{width: '60px'}} />
                <col style={{width: '60px'}} />
                <col style={{width: '40px'}} />
                <col style={{width: '120px'}} />
                <col style={{width: '30px'}} />
              </colgroup>
              <thead>
                <tr className="bg-white">
                  <th className="border border-gray-300 px-0.5 py-0.5 text-center"></th>
                  <th className="border border-gray-300 px-1 py-0.5 text-center text-[10px]">出勤</th>
                  <th className="border border-gray-300 px-1 py-0.5 text-center">名前 / Girls</th>
                  <th className="border border-gray-300 px-0.5 py-0.5 text-center"></th>
                  <th className="border border-gray-300 px-0.5 py-0.5 text-center"></th>
                  <th className="border-t border-b border-gray-300 px-1 py-0.5 text-center">併用</th>
                  <th className="border-t border-b border-gray-300 px-1 py-0.5 text-center">迎場所</th>
                  <th className="border-t border-b border-gray-300 px-1 py-0.5 text-center">受付</th>
                  <th className="border-t border-b border-gray-300 px-1 py-0.5 text-center">終了</th>
                  <th className="border-t border-b border-gray-300 px-1 py-0.5 text-center">帰宅</th>
                  <th className="border-t border-b border-gray-300 px-1 py-0.5 text-center">送場所</th>
                  <th className="border-t border-b border-gray-300 px-1 py-0.5 text-center">実績</th>
                  <th className="border border-gray-300 px-0.5 py-0.5 text-center"></th>
                  <th className="border border-gray-300 px-1 py-0.5 text-center">最終接客</th>
                  <th className="border border-gray-300 px-0.5 py-0.5 text-center"></th>
                  <th className="border border-gray-300 px-1 py-0.5 text-center">接客中</th>
                  <th className="border border-gray-300 px-0.5 py-0.5 text-center"></th>
                  <th className="border border-gray-300 px-1 py-0.5 text-center">INドライバー稼働中</th>
                  <th className="border border-gray-300 px-0.5 py-0.5 text-center"></th>
                  <th className="border border-gray-300 px-1 py-0.5 text-center">予約1</th>
                  <th className="border border-gray-300 px-0.5 py-0.5 text-center"></th>
                  <th className="border border-gray-300 px-1 py-0.5 text-center">予約2</th>
                  <th className="border border-gray-300 px-0.5 py-0.5 text-center"></th>
                  <th className="border border-gray-300 px-1 py-0.5 text-center">予約3</th>
                  <th className="border border-gray-300 px-0.5 py-0.5 text-center"></th>
                  <th className="border border-gray-300 px-1 py-0.5 text-center">予約4</th>
                  <th className="border border-gray-300 px-0.5 py-0.5 text-center"></th>
                  <th className="border border-gray-300 px-1 py-0.5 text-center">予約5以降</th>
                  <th className="border border-gray-300 px-0.5 py-0.5 text-center"></th>
                  <th className="border border-gray-300 px-1 py-0.5 text-center">出勤値客</th>
                  <th className="border border-gray-300 px-1 py-0.5 text-center">特記事項</th>
                  <th className="border border-gray-300 px-1 py-0.5 text-center">ホステスNG場所</th>
                  <th className="border border-gray-300 px-1 py-0.5 text-center">待ち時間</th>
                  <th className="border border-gray-300 px-1 py-0.5 text-center">web状態</th>
                  <th className="border border-gray-300 px-1 py-0.5 text-center">mode</th>
                  <th className="border border-gray-300 px-0.5 py-0.5 text-center"></th>
                  <th className="border border-gray-300 px-1 py-0.5 text-center">順位</th>
                </tr>
              </thead>
              <tbody>
                {sampleCastData.map((cast) => (
                  <tr key={cast.id} className="bg-yellow-50 hover:bg-yellow-100/70">
                    {/* チェックボックス */}
                    <td className="border border-gray-300 p-0 text-center">
                      <div className="flex items-center justify-center h-full">
                        <input 
                          type="checkbox" 
                          className="w-3 h-3 accent-red-600 cursor-pointer"
                        />
                      </div>
                    </td>
                    {/* 出勤ラベル */}
                    <td className="border border-gray-300 px-1 py-0.5 text-center">
                      <div className="text-black text-[10px]">出勤</div>
                    </td>
                    {/* 名前 / Girls */}
                    <td className="border border-gray-300 px-1 py-0.5 text-center">
                      <div className="flex flex-col items-center justify-center">
                        <div className="text-black font-bold">{cast.name}</div>
                        <div className="flex items-center justify-center gap-1 text-[10px]">
                          <span className="text-black">{cast.remark}</span>
                          {cast.achieve && (
                            <span className="text-red-600">{cast.achieve}</span>
                          )}
                        </div>
                      </div>
                    </td>
                    {/* ￥ボタン */}
                    <td className="border border-gray-300 p-0 text-center bg-blue-600">
                      <button className="w-full h-full bg-transparent hover:bg-blue-700 text-white text-xs border-0 flex items-center justify-center rounded-none">
                        ￥
                      </button>
                    </td>
                    {/* Hボタン */}
                    <td className="border border-gray-300 p-0 text-center bg-pink-200">
                      <button className="w-full h-full bg-transparent hover:bg-pink-300 text-black text-xs border-0 flex items-center justify-center rounded-none font-bold">
                        H
                      </button>
                    </td>
                    {/* 併用 */}
                    <td className="border-t border-b border-gray-300 px-1 py-0.5 text-center">
                      <div className="text-black text-[10px]">{cast.concurrent || ''}</div>
                    </td>
                    {/* 迎場所 */}
                    <td className="border-t border-b border-gray-300 px-1 py-0.5 text-center">
                      <div className="text-black text-[10px]">{cast.deliverPlace}</div>
                    </td>
                    {/* 受付 */}
                    <td className="border-t border-b border-gray-300 px-1 py-0.5 text-center">
                      <div className="text-black">{cast.startTime}</div>
                    </td>
                    {/* 終了 */}
                    <td className="border-t border-b border-gray-300 px-1 py-0.5 text-center">
                      <div className="text-black">{cast.endTime}</div>
                    </td>
                    {/* 帰宅 */}
                    <td className="border-t border-b border-gray-300 px-1 py-0.5 text-center">
                      <div className="text-black">{cast.homeTime}</div>
                    </td>
                    {/* 送場所 */}
                    <td className="border-t border-b border-gray-300 px-1 py-0.5 text-center">
                      <div className="text-black text-[10px]">{cast.deliverPlace}</div>
                    </td>
                    {/* 実績 */}
                    <td className="border-t border-b border-gray-300 px-1 py-0.5 text-center">
                      <div className="text-black">{cast.deliverCount || ''}</div>
                    </td>
                    {/* 実績ボタン */}
                    <td className="border border-gray-300 p-0 text-center bg-pink-200">
                      <button className="w-full h-full bg-transparent hover:bg-pink-300 text-black text-xs border-0 flex items-center justify-center rounded-none">
                        ✱
                      </button>
                    </td>
                    {/* 最終接客 */}
                    <td className="border border-gray-300 px-1 py-0.5 text-center">
                      <div className="flex items-center justify-center gap-2">
                        <div className="text-black">{cast.finalCustomer}</div>
                        <div className="text-red-600">{cast.homeTime}</div>
                      </div>
                    </td>
                    {/* 最終接客ボタン */}
                    <td className={`border border-gray-300 p-0 text-center ${cast.finalCustomer ? 'bg-green-700' : ''}`}>
                      {cast.finalCustomer && (
                        <button className="w-full h-full bg-transparent hover:bg-green-800 text-white text-xs border-0 flex items-center justify-center rounded-none">
                          <ChevronLeft className="w-3 h-3" strokeWidth={3} />
                        </button>
                      )}
                    </td>
                    {/* 接客中 */}
                    <td className="border border-gray-300 px-1 py-0.5 text-center">
                      <div className="flex items-center justify-center gap-2">
                        <div className="text-black">{cast.nowCustomer || "待機中"}</div>
                        <div className="text-red-600">{cast.homeTime}</div>
                      </div>
                    </td>
                    {/* 接客中ボタン */}
                    <td className={`border border-gray-300 p-0 text-center ${cast.nowCustomer ? 'bg-green-700' : ''}`}>
                      {cast.nowCustomer && (
                        <button className="w-full h-full bg-transparent hover:bg-green-800 text-white text-xs border-0 flex items-center justify-center rounded-none">
                          <ChevronLeft className="w-3 h-3" strokeWidth={3} />
                        </button>
                      )}
                    </td>
                    {/* INドライバー稼働中 */}
                    <td className="border border-gray-300 px-1 py-0.5 text-center">
                      <div className="flex items-center justify-center gap-2">
                        <div className="text-black">{cast.nowCustomer || cast.deliverPlace}</div>
                        {cast.inDriverMoving && (
                          <div className="text-red-600">{cast.inDriverMoving}</div>
                        )}
                      </div>
                    </td>
                    {/* INドライバー稼働中ボタン */}
                    <td className={`border border-gray-300 p-0 text-center ${(cast.nowCustomer || cast.deliverPlace) ? 'bg-green-700' : ''}`}>
                      {(cast.nowCustomer || cast.deliverPlace) && (
                        <button className="w-full h-full bg-transparent hover:bg-green-800 text-white text-xs border-0 flex items-center justify-center rounded-none">
                          <ChevronLeft className="w-3 h-3" strokeWidth={3} />
                        </button>
                      )}
                    </td>
                    {/* 予約1 */}
                    <td className="border border-gray-300 px-1 py-0.5 text-center">
                      {cast.next1 && (
                        <div className="flex items-center justify-center gap-2">
                          <div className="text-black">{cast.next1.split(' ')[1] || cast.next1}</div>
                          <div className="text-red-600">{cast.next1.split(' ')[0] || ''}</div>
                        </div>
                      )}
                    </td>
                    {/* 予約1ボタン */}
                    <td className={`border border-gray-300 p-0 text-center ${cast.next1 ? 'bg-green-700' : ''}`}>
                      {cast.next1 && (
                        <button className="w-full h-full bg-transparent hover:bg-green-800 text-white text-xs border-0 flex items-center justify-center rounded-none">
                          <ChevronLeft className="w-3 h-3" strokeWidth={3} />
                        </button>
                      )}
                    </td>
                    {/* 予約2 */}
                    <td className="border border-gray-300 px-1 py-0.5 text-center">
                      {cast.next2 && (
                        <div className="flex items-center justify-center gap-2">
                          <div className="text-black">{cast.next2.split(' ')[1] || cast.next2}</div>
                          <div className="text-red-600">{cast.next2.split(' ')[0] || ''}</div>
                        </div>
                      )}
                    </td>
                    {/* 予約2ボタン */}
                    <td className={`border border-gray-300 p-0 text-center ${cast.next2 ? 'bg-green-700' : ''}`}>
                      {cast.next2 && (
                        <button className="w-full h-full bg-transparent hover:bg-green-800 text-white text-xs border-0 flex items-center justify-center rounded-none">
                          <ChevronLeft className="w-3 h-3" strokeWidth={3} />
                        </button>
                      )}
                    </td>
                    {/* 予約3 */}
                    <td className="border border-gray-300 px-1 py-0.5 text-center">
                      {cast.next3 && (
                        <div className="flex items-center justify-center gap-2">
                          <div className="text-black">{cast.next3.split(' ')[1] || cast.next3}</div>
                          <div className="text-red-600">{cast.next3.split(' ')[0] || ''}</div>
                        </div>
                      )}
                    </td>
                    {/* 予約3ボタン */}
                    <td className={`border border-gray-300 p-0 text-center ${cast.next3 ? 'bg-green-700' : ''}`}>
                      {cast.next3 && (
                        <button className="w-full h-full bg-transparent hover:bg-green-800 text-white text-xs border-0 flex items-center justify-center rounded-none">
                          <ChevronLeft className="w-3 h-3" strokeWidth={3} />
                        </button>
                      )}
                    </td>
                    {/* 予約4 */}
                    <td className="border border-gray-300 px-1 py-0.5 text-center">
                      {cast.next4 && (
                        <div className="flex items-center justify-center gap-2">
                          <div className="text-black">{cast.next4.split(' ')[1] || cast.next4}</div>
                          <div className="text-red-600">{cast.next4.split(' ')[0] || ''}</div>
                        </div>
                      )}
                    </td>
                    {/* 予約4ボタン */}
                    <td className={`border border-gray-300 p-0 text-center ${cast.next4 ? 'bg-green-700' : ''}`}>
                      {cast.next4 && (
                        <button className="w-full h-full bg-transparent hover:bg-green-800 text-white text-xs border-0 flex items-center justify-center rounded-none">
                          <ChevronLeft className="w-3 h-3" strokeWidth={3} />
                        </button>
                      )}
                    </td>
                    {/* 予約5 */}
                    <td className="border border-gray-300 px-1 py-0.5 text-center">
                      {cast.next5 && (
                        <div className="flex items-center justify-center gap-2">
                          <div className="text-black">{cast.next5.split(' ')[1] || cast.next5}</div>
                          <div className="text-red-600">{cast.next5.split(' ')[0] || ''}</div>
                        </div>
                      )}
                    </td>
                    {/* 予約5ボタン */}
                    <td className={`border border-gray-300 p-0 text-center ${cast.next5 ? 'bg-green-700' : ''}`}>
                      {cast.next5 && (
                        <button className="w-full h-full bg-transparent hover:bg-green-800 text-white text-xs border-0 flex items-center justify-center rounded-none">
                          <ChevronLeft className="w-3 h-3" strokeWidth={3} />
                        </button>
                      )}
                    </td>
                    {/* 出勤値客 */}
                    <td className="border border-gray-300 px-1 py-0.5 text-center">
                      <div className="text-black">{cast.special}</div>
                    </td>
                    {/* 特記事項 */}
                    <td className="border border-gray-300 px-1 py-0.5 text-center">
                      <div className="text-black">{cast.remark}</div>
                    </td>
                    {/* ホステスNG場所 */}
                    <td className="border border-gray-300 px-1 py-0.5 text-center">
                      <div className="text-red-600">{cast.ngPlace}</div>
                    </td>
                    {/* 待ち時間 */}
                    <td className="border border-gray-300 px-1 py-0.5 text-center">
                      <div className="text-black">{cast.waitTime}</div>
                    </td>
                    {/* web状態 */}
                    <td className="border border-gray-300 px-1 py-0.5 text-center">
                      <div className={cast.webStatus === "オンライン" ? "text-green-600" : "text-red-600"}>{cast.webStatus}</div>
                    </td>
                    {/* mode */}
                    <td className="border border-gray-300 px-1 py-0.5 text-center">
                      <div className={cast.mode === "自動" ? "text-blue-600" : "text-orange-600"}>{cast.mode}</div>
                    </td>
                    {/* 登録ボタン */}
                    <td className="border border-gray-300 p-0 text-center">
                      <button className="w-full h-full bg-gray-100 hover:bg-gray-200 text-black text-[10px] border-0 flex items-center justify-center rounded-none px-1 py-0.5">
                        上記の時間を登録
                      </button>
                    </td>
                    {/* 順位 */}
                    <td className="border border-gray-300 px-1 py-0.5 text-center">
                      <div className="text-black font-bold">{cast.ranking}</div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
      </div>
    </div>
  );
}
