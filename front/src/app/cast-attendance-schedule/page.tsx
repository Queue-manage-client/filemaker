'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowLeft, ChevronLeft, ChevronRight, Phone, CheckCircle, Clock, PhoneCall, X } from "lucide-react";

// キャスト出勤予定票の型定義
interface CastDaySchedule {
  date: string;
  dayOfWeek: string;
  status: 'work' | 'off' | 'undecided' | 'confirmed';
  startTime?: string;
  endTime?: string;
  store?: string;
  confirmCall?: {
    time: string;
    completed: boolean;
  };
  notes?: string;
}

interface CastAttendanceData {
  id: string;
  name: string;
  category: string;
  mainStore: string;
  storeColor: string;
  phone: string;
  workType: string;
  weeklySchedule: CastDaySchedule[];
}

// 店舗一覧
const stores = [
  { id: 'all', name: '全店舗' },
  { id: 'store1', name: '京都FIRST', color: '#fce7f3' },
  { id: 'store2', name: '京都Girls', color: '#dbeafe' },
  { id: 'store3', name: '京都Lady', color: '#fef3c7' },
  { id: 'store4', name: '大阪店', color: '#dcfce7' },
];

// 週の開始日（月曜日）を取得
const getWeekStart = (date: Date): Date => {
  const d = new Date(date);
  const day = d.getDay();
  const diff = day === 0 ? -6 : 1 - day;
  d.setDate(d.getDate() + diff);
  return d;
};

const formatDate = (date: Date): string => {
  return `${date.getMonth() + 1}/${date.getDate()}`;
};

const DAY_NAMES = ['月', '火', '水', '木', '金', '土', '日'];

// サンプルデータ生成
const generateSampleData = (weekStart: Date): CastAttendanceData[] => {
  const castNames = [
    { name: 'すみれ', category: 'レディ', store: '京都FIRST', color: '#fce7f3', phone: '090-1234-5678', workType: 'レギュラー' },
    { name: '瑠璃', category: 'ガール', store: '京都Girls', color: '#dbeafe', phone: '090-2345-6789', workType: 'レギュラー' },
    { name: 'かんな', category: 'レディ', store: '京都Lady', color: '#fef3c7', phone: '090-3456-7890', workType: '準レギュラー' },
    { name: 'スイレン', category: 'ガール', store: '京都FIRST', color: '#fce7f3', phone: '090-4567-8901', workType: '直前' },
    { name: '妃-kisaki-', category: 'レディ', store: '京都Girls', color: '#dbeafe', phone: '090-5678-9012', workType: 'レギュラー' },
    { name: 'ミイ', category: 'ガール', store: '大阪店', color: '#dcfce7', phone: '090-6789-0123', workType: '新人' },
    { name: 'かなの', category: 'レディ', store: '京都Lady', color: '#fef3c7', phone: '090-7890-1234', workType: '準レギュラー' },
    { name: 'あみ', category: 'ガール', store: '京都FIRST', color: '#fce7f3', phone: '090-8901-2345', workType: '不定期' },
    { name: '雪-yuki-', category: 'レディ', store: '大阪店', color: '#dcfce7', phone: '090-9012-3456', workType: 'レギュラー' },
    { name: 'りあん', category: 'ガール', store: '京都Girls', color: '#dbeafe', phone: '090-0123-4567', workType: 'レギュラー' },
    { name: 'あず', category: 'レディ', store: '京都Lady', color: '#fef3c7', phone: '090-1111-2222', workType: '直前' },
    { name: 'まい', category: 'ガール', store: '京都FIRST', color: '#fce7f3', phone: '090-3333-4444', workType: '新人' },
  ];

  return castNames.map((cast, idx) => {
    const schedule: CastDaySchedule[] = [];
    for (let d = 0; d < 7; d++) {
      const date = new Date(weekStart);
      date.setDate(date.getDate() + d);
      const dateStr = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;

      const isOff = (idx + d) % 4 === 0;
      const isUndecided = (idx + d) % 7 === 3;
      const isConfirmed = !isOff && !isUndecided && (idx + d) % 3 !== 2;
      const hasConfirmCall = isConfirmed && (idx + d) % 2 === 0;

      const startHour = 18 + (idx % 4);
      const endHour = startHour + 4 + (d % 3);

      schedule.push({
        date: dateStr,
        dayOfWeek: DAY_NAMES[d],
        status: isOff ? 'off' : isUndecided ? 'undecided' : isConfirmed ? 'confirmed' : 'work',
        startTime: isOff ? undefined : `${startHour}:00`,
        endTime: isOff ? undefined : `${endHour > 24 ? endHour - 24 : endHour}:00`,
        store: isOff ? undefined : cast.store,
        confirmCall: hasConfirmCall ? {
          time: `${startHour - 2}:30`,
          completed: d % 2 === 0,
        } : undefined,
        notes: d === 2 && idx % 3 === 0 ? '写真撮影あり' : undefined,
      });
    }

    return {
      id: `cast-${idx + 1}`,
      name: cast.name,
      category: cast.category,
      mainStore: cast.store,
      storeColor: cast.color,
      phone: cast.phone,
      workType: cast.workType,
      weeklySchedule: schedule,
    };
  });
};

// ステータスに応じた色
const getStatusStyle = (status: CastDaySchedule['status']): string => {
  switch (status) {
    case 'confirmed':
      return 'bg-green-100 text-green-800';
    case 'work':
      return 'bg-blue-100 text-blue-800';
    case 'undecided':
      return 'bg-yellow-100 text-yellow-800';
    case 'off':
      return 'bg-gray-100 text-gray-500';
    default:
      return 'bg-gray-50';
  }
};

const getStatusLabel = (status: CastDaySchedule['status']): string => {
  switch (status) {
    case 'confirmed': return '確定';
    case 'work': return '出勤';
    case 'undecided': return '未定';
    case 'off': return '休み';
    default: return '';
  }
};

export default function CastAttendanceSchedule() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedStore, setSelectedStore] = useState('all');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [showAutoDialPanel, setShowAutoDialPanel] = useState(false);

  const weekStart = useMemo(() => getWeekStart(currentDate), [currentDate]);

  const weekDates = useMemo(() => {
    return Array.from({ length: 7 }, (_, i) => {
      const d = new Date(weekStart);
      d.setDate(d.getDate() + i);
      return d;
    });
  }, [weekStart]);

  const castData = useMemo(() => generateSampleData(weekStart), [weekStart]);

  // 今日の確認電話未実施リスト
  const todayIndex = useMemo(() => {
    const today = new Date();
    return weekDates.findIndex(d => d.toDateString() === today.toDateString());
  }, [weekDates]);

  const unconfirmedToday = useMemo(() => {
    if (todayIndex === -1) return [];
    return castData
      .filter(cast => {
        const todaySchedule = cast.weeklySchedule[todayIndex];
        return todaySchedule && todaySchedule.status !== 'off' && !todaySchedule.confirmCall;
      })
      .map(cast => ({
        ...cast,
        todaySchedule: cast.weeklySchedule[todayIndex],
      }));
  }, [castData, todayIndex]);

  const filteredData = useMemo(() => {
    return castData.filter(cast => {
      if (selectedStore !== 'all' && cast.mainStore !== stores.find(s => s.id === selectedStore)?.name) {
        return false;
      }
      if (selectedCategory !== 'all' && cast.category !== selectedCategory) {
        return false;
      }
      return true;
    });
  }, [castData, selectedStore, selectedCategory]);

  const prevWeek = () => {
    const d = new Date(currentDate);
    d.setDate(d.getDate() - 7);
    setCurrentDate(d);
  };

  const nextWeek = () => {
    const d = new Date(currentDate);
    d.setDate(d.getDate() + 7);
    setCurrentDate(d);
  };

  const thisWeek = () => {
    setCurrentDate(new Date());
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* ヘッダー */}
      <div className="sticky top-0 z-20 bg-white border-b border-gray-200 shadow-sm">
        <div className="flex items-center justify-between px-4 py-2">
          <div className="flex items-center gap-3">
            <Link href="/dashboard">
              <Button variant="outline" size="sm" className="gap-1">
                <ArrowLeft className="w-4 h-4" />
                戻る
              </Button>
            </Link>
            <h1 className="text-lg font-bold text-gray-900">キャスト出勤予定票</h1>
          </div>

          <div className="flex items-center gap-3">
            {/* 店舗フィルター */}
            <Select value={selectedStore} onValueChange={setSelectedStore}>
              <SelectTrigger className="w-[140px] h-8 text-sm">
                <SelectValue placeholder="店舗" />
              </SelectTrigger>
              <SelectContent>
                {stores.map(store => (
                  <SelectItem key={store.id} value={store.id}>{store.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* カテゴリーフィルター */}
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="w-[120px] h-8 text-sm">
                <SelectValue placeholder="カテゴリー" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">全カテゴリー</SelectItem>
                <SelectItem value="レディ">レディ</SelectItem>
                <SelectItem value="ガール">ガール</SelectItem>
              </SelectContent>
            </Select>

            {/* 自動ダイヤル */}
            <Button
              variant={unconfirmedToday.length > 0 ? 'default' : 'outline'}
              size="sm"
              className={`gap-1 ${unconfirmedToday.length > 0 ? 'bg-red-500 hover:bg-red-600 animate-pulse' : ''}`}
              onClick={() => setShowAutoDialPanel(!showAutoDialPanel)}
            >
              <PhoneCall className="w-4 h-4" />
              未確認 {unconfirmedToday.length}件
            </Button>

            {/* 週移動 */}
            <div className="flex items-center gap-1">
              <Button variant="outline" size="sm" onClick={prevWeek}>
                <ChevronLeft className="w-4 h-4" />
              </Button>
              <Button variant="outline" size="sm" onClick={thisWeek} className="text-xs px-2">
                今週
              </Button>
              <Button variant="outline" size="sm" onClick={nextWeek}>
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* テーブル */}
      <div className="overflow-x-auto">
        <table className="w-full min-w-[1200px] border-collapse">
          <thead>
            <tr className="bg-gray-100">
              <th className="sticky left-0 z-10 bg-gray-100 border border-gray-300 px-2 py-2 text-xs font-semibold text-gray-700 w-[60px]">No</th>
              <th className="sticky left-[60px] z-10 bg-gray-100 border border-gray-300 px-2 py-2 text-xs font-semibold text-gray-700 w-[100px]">キャスト名</th>
              <th className="border border-gray-300 px-2 py-2 text-xs font-semibold text-gray-700 w-[70px]">カテゴリー</th>
              <th className="border border-gray-300 px-2 py-2 text-xs font-semibold text-gray-700 w-[80px]">勤務形態</th>
              <th className="border border-gray-300 px-2 py-2 text-xs font-semibold text-gray-700 w-[90px]">所属店舗</th>
              {weekDates.map((date, i) => {
                const isToday = date.toDateString() === new Date().toDateString();
                const isSat = i === 5;
                const isSun = i === 6;
                return (
                  <th
                    key={i}
                    className={`border border-gray-300 px-1 py-2 text-xs font-semibold min-w-[120px] ${
                      isToday ? 'bg-blue-100 text-blue-900' :
                      isSun ? 'bg-red-50 text-red-700' :
                      isSat ? 'bg-blue-50 text-blue-700' :
                      'text-gray-700'
                    }`}
                  >
                    <div>{formatDate(date)}</div>
                    <div className="text-[10px]">({DAY_NAMES[i]})</div>
                  </th>
                );
              })}
            </tr>
          </thead>
          <tbody>
            {filteredData.map((cast, idx) => (
              <tr key={cast.id} className="hover:bg-gray-50">
                <td className="sticky left-0 z-10 bg-white border border-gray-300 px-2 py-1 text-xs text-center text-gray-500">
                  {idx + 1}
                </td>
                <td
                  className="sticky left-[60px] z-10 border border-gray-300 px-2 py-1 text-sm font-medium"
                  style={{ backgroundColor: cast.storeColor }}
                >
                  {cast.name}
                </td>
                <td className="border border-gray-300 px-2 py-1 text-xs text-center text-gray-700">
                  {cast.category}
                </td>
                <td className="border border-gray-300 px-2 py-1 text-xs text-center">
                  <span className={`px-1.5 py-0.5 rounded text-xs ${
                    cast.workType === '新人' ? 'bg-green-100 text-green-700' :
                    cast.workType === 'レギュラー' ? 'bg-blue-100 text-blue-700' :
                    cast.workType === '準レギュラー' ? 'bg-purple-100 text-purple-700' :
                    'bg-gray-100 text-gray-700'
                  }`}>
                    {cast.workType}
                  </span>
                </td>
                <td className="border border-gray-300 px-2 py-1 text-xs text-center text-gray-700">
                  {cast.mainStore}
                </td>
                {cast.weeklySchedule.map((day, dayIdx) => (
                  <td
                    key={dayIdx}
                    className={`border border-gray-300 px-1 py-1 text-xs ${
                      weekDates[dayIdx]?.toDateString() === new Date().toDateString() ? 'bg-blue-50' : ''
                    }`}
                  >
                    <div className={`rounded px-1 py-0.5 ${getStatusStyle(day.status)}`}>
                      <div className="flex items-center justify-between">
                        <span className="font-medium">{getStatusLabel(day.status)}</span>
                        {day.confirmCall && (
                          <span title={`確認TEL ${day.confirmCall.time} ${day.confirmCall.completed ? '(完了)' : '(未完了)'}`}>
                            {day.confirmCall.completed ? (
                              <CheckCircle className="w-3 h-3 text-green-600" />
                            ) : (
                              <Phone className="w-3 h-3 text-yellow-600" />
                            )}
                          </span>
                        )}
                      </div>
                      {day.startTime && (
                        <div className="text-[10px] mt-0.5 flex items-center gap-0.5">
                          <Clock className="w-2.5 h-2.5" />
                          {day.startTime}〜{day.endTime}
                        </div>
                      )}
                      {day.notes && (
                        <div className="text-[10px] text-orange-600 mt-0.5 truncate">{day.notes}</div>
                      )}
                    </div>
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* 凡例 */}
      <div className="px-4 py-3 bg-white border-t border-gray-200 flex gap-4 text-xs text-gray-600">
        <span className="flex items-center gap-1"><span className="w-3 h-3 bg-green-100 rounded border border-green-300" /> 確定</span>
        <span className="flex items-center gap-1"><span className="w-3 h-3 bg-blue-100 rounded border border-blue-300" /> 出勤</span>
        <span className="flex items-center gap-1"><span className="w-3 h-3 bg-yellow-100 rounded border border-yellow-300" /> 未定</span>
        <span className="flex items-center gap-1"><span className="w-3 h-3 bg-gray-100 rounded border border-gray-300" /> 休み</span>
        <span className="flex items-center gap-1 ml-4"><CheckCircle className="w-3 h-3 text-green-600" /> 確認TEL完了</span>
        <span className="flex items-center gap-1"><Phone className="w-3 h-3 text-yellow-600" /> 確認TEL済(未完了)</span>
      </div>

      {/* 自動ダイヤルパネル */}
      {showAutoDialPanel && (
        <div className="fixed right-4 top-16 z-50 w-[320px] bg-white rounded-lg shadow-2xl border border-gray-200 overflow-hidden">
          <div className="bg-red-500 text-white px-4 py-2 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <PhoneCall className="w-4 h-4" />
              <span className="text-sm font-bold">確認電話未実施リスト</span>
            </div>
            <button type="button" onClick={() => setShowAutoDialPanel(false)}>
              <X className="w-4 h-4" />
            </button>
          </div>
          <div className="max-h-[400px] overflow-y-auto">
            {unconfirmedToday.length === 0 ? (
              <div className="px-4 py-8 text-center text-gray-500 text-sm">
                <CheckCircle className="w-8 h-8 mx-auto mb-2 text-green-400" />
                全員確認電話済みです
              </div>
            ) : (
              unconfirmedToday.map((cast, idx) => (
                <div key={cast.id} className="px-3 py-2 border-b border-gray-100 flex items-center justify-between hover:bg-gray-50">
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-gray-400">{idx + 1}.</span>
                      <span
                        className="text-sm font-medium px-1.5 py-0.5 rounded"
                        style={{ backgroundColor: cast.storeColor }}
                      >
                        {cast.name}
                      </span>
                    </div>
                    <div className="text-xs text-gray-500 mt-0.5">
                      {cast.mainStore} / {cast.todaySchedule.startTime}〜{cast.todaySchedule.endTime}
                    </div>
                  </div>
                  <a
                    href={`tel:${cast.phone.replace(/-/g, '')}`}
                    className="flex items-center gap-1 px-3 py-1.5 bg-green-500 hover:bg-green-600 text-white rounded-md text-xs font-medium transition-colors"
                  >
                    <Phone className="w-3 h-3" />
                    発信
                  </a>
                </div>
              ))
            )}
          </div>
          {unconfirmedToday.length > 0 && (
            <div className="px-4 py-2 bg-gray-50 border-t">
              <div className="text-xs text-gray-500 text-center">
                タップで電話アプリから発信します
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
