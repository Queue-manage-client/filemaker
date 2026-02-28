'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  User,
  Calendar,
  Clock,
  MapPin,
  Wallet,
  Bell,
  Star,
  TrendingUp,
  CheckCircle2,
  AlertCircle,
  Phone
} from "lucide-react";

// サンプルデータ
const castData = {
  id: '1184',
  name: 'あみ',
  rank: 'レディ',
  area: '京都',
  photo: null,
};

const todaySchedule = [
  {
    id: 1,
    time: '14:00',
    type: '予約',
    customer: 'M様',
    location: 'シティホテル京都',
    course: '90分',
    status: 'confirmed'
  },
  {
    id: 2,
    time: '17:30',
    type: '予約',
    customer: 'T様',
    location: '烏丸四条エリア',
    course: '120分',
    status: 'confirmed'
  },
  {
    id: 3,
    time: '21:00',
    type: 'フリー待機',
    customer: '-',
    location: '-',
    course: '-',
    status: 'waiting'
  },
];

const thisMonthStats = {
  dispatchCount: 45,
  nominationCount: 28,
  nominationRate: 62,
  totalSales: 1850000,
  ranking: 3,
};

const recentHistory = [
  { date: '2025/01/26', customer: 'M様', course: '90分', location: 'シティホテル', nomination: true },
  { date: '2025/01/25', customer: 'K様', course: '120分', location: '河原町エリア', nomination: true },
  { date: '2025/01/24', customer: 'S様', course: '60分', location: '京都駅前', nomination: false },
  { date: '2025/01/23', customer: 'T様', course: '90分', location: '烏丸エリア', nomination: true },
  { date: '2025/01/22', customer: 'A様', course: '120分', location: 'ホテル四条', nomination: false },
];

const notifications = [
  { id: 1, type: 'info', message: '明日14:00にT様の予約が入りました', time: '10分前', read: false },
  { id: 2, type: 'success', message: '今月の指名ランキング3位おめでとうございます！', time: '2時間前', read: false },
  { id: 3, type: 'info', message: '給与明細が更新されました', time: '1日前', read: true },
];

const weeklySchedule = [
  { day: '月', date: '1/27', shift: '16:00-24:00', status: 'confirmed' },
  { day: '火', date: '1/28', shift: '休み', status: 'off' },
  { day: '水', date: '1/29', shift: '18:00-翌2:00', status: 'confirmed' },
  { day: '木', date: '1/30', shift: '16:00-24:00', status: 'confirmed' },
  { day: '金', date: '1/31', shift: '20:00-翌4:00', status: 'confirmed' },
  { day: '土', date: '2/1', shift: '16:00-翌2:00', status: 'pending' },
  { day: '日', date: '2/2', shift: '休み', status: 'off' },
];

export default function CastMypage() {
  const [activeTab, setActiveTab] = useState('today');

  React.useEffect(() => {
    document.title = 'マイページ - Dispatch Harmony Hub';
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-pink-50 to-white max-w-md mx-auto">
      {/* ヘッダー - スマホ向けシンプルデザイン */}
      <div className="bg-gradient-to-r from-pink-500 to-rose-400 text-white p-4 rounded-b-3xl shadow-lg">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-lg font-bold">マイページ</h1>
          <div className="relative">
            <Bell className="w-6 h-6" />
            <span className="absolute -top-1 -right-1 w-4 h-4 bg-yellow-400 rounded-full text-[10px] flex items-center justify-center text-black font-bold">
              {notifications.filter(n => !n.read).length}
            </span>
          </div>
        </div>

        {/* プロフィールカード */}
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center">
            <User className="w-10 h-10 text-white/80" />
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <span className="text-xl font-bold">{castData.name}</span>
              <Badge className="bg-white/20 text-white text-xs">{castData.rank}</Badge>
            </div>
            <div className="text-white/80 text-sm">
              ID: {castData.id} / {castData.area}
            </div>
          </div>
        </div>

        {/* 今月の実績サマリー */}
        <div className="mt-4 grid grid-cols-3 gap-2 bg-white/10 rounded-xl p-3">
          <div className="text-center">
            <div className="text-2xl font-bold">{thisMonthStats.dispatchCount}</div>
            <div className="text-xs text-white/70">派遣数</div>
          </div>
          <div className="text-center border-x border-white/20">
            <div className="text-2xl font-bold">{thisMonthStats.nominationRate}%</div>
            <div className="text-xs text-white/70">指名率</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold flex items-center justify-center gap-1">
              <Star className="w-4 h-4 text-yellow-300" />
              {thisMonthStats.ranking}位
            </div>
            <div className="text-xs text-white/70">ランキング</div>
          </div>
        </div>
      </div>

      {/* メインコンテンツ */}
      <div className="p-4 space-y-4">
        {/* タブナビゲーション */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid grid-cols-4 w-full bg-gray-100 rounded-xl p-1">
            <TabsTrigger value="today" className="text-xs rounded-lg data-[state=active]:bg-white">
              本日
            </TabsTrigger>
            <TabsTrigger value="schedule" className="text-xs rounded-lg data-[state=active]:bg-white">
              シフト
            </TabsTrigger>
            <TabsTrigger value="history" className="text-xs rounded-lg data-[state=active]:bg-white">
              履歴
            </TabsTrigger>
            <TabsTrigger value="earnings" className="text-xs rounded-lg data-[state=active]:bg-white">
              売上
            </TabsTrigger>
          </TabsList>

          {/* 本日タブ */}
          <TabsContent value="today" className="mt-4 space-y-4">
            {/* お知らせ */}
            {notifications.filter(n => !n.read).length > 0 && (
              <Card className="border-l-4 border-l-pink-500">
                <CardContent className="p-3">
                  <div className="text-xs font-semibold text-pink-600 mb-2">新着お知らせ</div>
                  {notifications.filter(n => !n.read).map(notification => (
                    <div key={notification.id} className="flex items-start gap-2 py-1">
                      {notification.type === 'success' ? (
                        <CheckCircle2 className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" />
                      ) : (
                        <AlertCircle className="w-4 h-4 text-blue-500 flex-shrink-0 mt-0.5" />
                      )}
                      <div className="flex-1">
                        <div className="text-sm">{notification.message}</div>
                        <div className="text-xs text-gray-400">{notification.time}</div>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            )}

            {/* 本日の予定 */}
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-pink-500" />
                  本日の予定
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {todaySchedule.map(schedule => (
                  <div
                    key={schedule.id}
                    className={`p-3 rounded-xl ${
                      schedule.status === 'confirmed'
                        ? 'bg-pink-50 border border-pink-200'
                        : 'bg-gray-50 border border-gray-200'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4 text-gray-500" />
                        <span className="font-bold">{schedule.time}</span>
                      </div>
                      <Badge variant={schedule.status === 'confirmed' ? 'default' : 'secondary'} className="text-xs">
                        {schedule.type}
                      </Badge>
                    </div>
                    {schedule.status === 'confirmed' && (
                      <>
                        <div className="text-sm font-semibold">{schedule.customer}</div>
                        <div className="flex items-center gap-4 text-xs text-gray-600 mt-1">
                          <span className="flex items-center gap-1">
                            <MapPin className="w-3 h-3" />
                            {schedule.location}
                          </span>
                          <span>{schedule.course}</span>
                        </div>
                      </>
                    )}
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* クイックアクション */}
            <div className="grid grid-cols-2 gap-3">
              <Button variant="outline" className="h-14 flex-col gap-1 rounded-xl">
                <Phone className="w-5 h-5 text-pink-500" />
                <span className="text-xs">店舗に連絡</span>
              </Button>
              <Button variant="outline" className="h-14 flex-col gap-1 rounded-xl">
                <MapPin className="w-5 h-5 text-pink-500" />
                <span className="text-xs">現在地を共有</span>
              </Button>
            </div>
          </TabsContent>

          {/* シフトタブ */}
          <TabsContent value="schedule" className="mt-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-pink-500" />
                  今週のシフト
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {weeklySchedule.map((day, idx) => (
                    <div
                      key={idx}
                      className={`flex items-center justify-between p-3 rounded-lg ${
                        day.status === 'off'
                          ? 'bg-gray-100'
                          : day.status === 'pending'
                          ? 'bg-yellow-50 border border-yellow-200'
                          : 'bg-pink-50 border border-pink-200'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 text-center">
                          <div className="text-xs text-gray-500">{day.day}</div>
                          <div className="font-bold text-sm">{day.date}</div>
                        </div>
                        <div className={`text-sm ${day.status === 'off' ? 'text-gray-400' : ''}`}>
                          {day.shift}
                        </div>
                      </div>
                      {day.status === 'pending' && (
                        <Badge variant="outline" className="text-xs text-yellow-600 border-yellow-400">
                          未確定
                        </Badge>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* 履歴タブ */}
          <TabsContent value="history" className="mt-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base flex items-center gap-2">
                  <Clock className="w-5 h-5 text-pink-500" />
                  最近の接客履歴
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {recentHistory.map((item, idx) => (
                    <div key={idx} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-semibold">{item.customer}</span>
                          {item.nomination && (
                            <Badge className="bg-pink-500 text-white text-[10px] px-1.5">指名</Badge>
                          )}
                        </div>
                        <div className="text-xs text-gray-500 mt-1">
                          {item.date} / {item.course} / {item.location}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* 売上タブ */}
          <TabsContent value="earnings" className="mt-4 space-y-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base flex items-center gap-2">
                  <Wallet className="w-5 h-5 text-pink-500" />
                  今月の売上
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-4">
                  <div className="text-3xl font-bold text-pink-600">
                    ¥{thisMonthStats.totalSales.toLocaleString()}
                  </div>
                  <div className="text-xs text-gray-500 mt-1">2025年1月</div>
                </div>

                <div className="grid grid-cols-2 gap-3 mt-4">
                  <div className="bg-pink-50 rounded-xl p-3 text-center">
                    <div className="text-xl font-bold">{thisMonthStats.dispatchCount}</div>
                    <div className="text-xs text-gray-600">派遣回数</div>
                  </div>
                  <div className="bg-pink-50 rounded-xl p-3 text-center">
                    <div className="text-xl font-bold">{thisMonthStats.nominationCount}</div>
                    <div className="text-xs text-gray-600">指名回数</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-pink-500" />
                  ランキング推移
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-center gap-6 py-4">
                  <div className="text-center">
                    <div className="text-sm text-gray-500">先月</div>
                    <div className="text-xl font-bold">5位</div>
                  </div>
                  <div className="text-2xl text-gray-300">→</div>
                  <div className="text-center">
                    <div className="text-sm text-pink-500">今月</div>
                    <div className="text-3xl font-bold text-pink-600 flex items-center gap-1">
                      <Star className="w-5 h-5 text-yellow-400" />
                      3位
                    </div>
                  </div>
                </div>
                <div className="text-center text-xs text-green-600 font-semibold">
                  ↑ 2ランクアップ！
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      {/* フッターナビゲーション - スマホ向け */}
      <div className="fixed bottom-0 left-0 right-0 max-w-md mx-auto bg-white border-t shadow-lg">
        <div className="grid grid-cols-4 py-2">
          <button className="flex flex-col items-center gap-1 py-2 text-pink-500">
            <Calendar className="w-5 h-5" />
            <span className="text-[10px]">予定</span>
          </button>
          <button className="flex flex-col items-center gap-1 py-2 text-gray-400">
            <Clock className="w-5 h-5" />
            <span className="text-[10px]">シフト</span>
          </button>
          <button className="flex flex-col items-center gap-1 py-2 text-gray-400">
            <Wallet className="w-5 h-5" />
            <span className="text-[10px]">売上</span>
          </button>
          <button className="flex flex-col items-center gap-1 py-2 text-gray-400">
            <User className="w-5 h-5" />
            <span className="text-[10px]">設定</span>
          </button>
        </div>
      </div>

      {/* フッター分のスペーサー */}
      <div className="h-20" />
    </div>
  );
}
