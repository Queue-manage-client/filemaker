'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import {
  ProfileTab,
  HPDataTab,
  ManagementTab,
  CourseRatioTab,
  CourseFixedTab,
  CourseCombinedTab,
  ClassTab,
  OptionTab,
  TodayAttendanceTab,
  SameStoreHostessTab,
  PerformanceDetailTab,
  AttendanceRightTab,
  FromFrontTab,
  TodayReservationNGHistoryTab,
  ReservationTab,
  GoalTab,
} from './_components';

export default function HostessLedgerPage() {
  const [employmentStatus, setEmploymentStatus] = useState<'active' | 'retired'>('retired');
  const [displayStatus, setDisplayStatus] = useState<'ok' | 'ng'>('ok');
  const [activeRightTab, setActiveRightTab] = useState<string>('当日出勤ホステス');
  const [activeMiddleTab, setActiveMiddleTab] = useState<string>('プロフィール');
  const [activeBottomTab, setActiveBottomTab] = useState<string>('シフト予定');

  React.useEffect(() => {
    document.title = 'ホステス台帳 - Dispatch Harmony Hub';
  }, []);

  return (
    <div className="h-screen flex flex-col bg-gray-100">
      {/* ヘッダー */}
      <div className="h-12 bg-white border-b border-zinc-300 flex items-center px-4 shrink-0">
        <Link href="/dashboard">
          <Button
            variant="outline"
            className="h-8 px-3 text-[13px] flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            ダッシュボードに戻る
          </Button>
        </Link>
        <h1 className="text-lg font-bold ml-4">ホステス台帳</h1>
      </div>

      {/* メインコンテンツ - 左右6:4 */}
      <div className="flex-1 flex p-4 gap-4 overflow-hidden">
        {/* 左ブロック (6) */}
        <div className="w-[60%] flex flex-col gap-4">
          {/* 上ブロック (2) - ホステス基本情報フォーム */}
          <div className="h-[20%] border border-black bg-gray-100 p-1 text-[11px] flex">
            {/* 左側フォーム部分 */}
            <div className="flex-1 leading-tight">
              {/* 1行目 */}
              <div className="flex items-center mb-px">
                <span className="font-bold w-[58px]">HSNo</span>
                <input type="text" className="w-[36px] h-[18px] text-[11px] px-0.5 bg-white border border-gray-400" defaultValue="305" />
                <span className="font-bold ml-1">在職</span>
                <label className="flex items-center ml-1">
                  <input type="radio" name="status" checked={employmentStatus === 'active'} onChange={() => setEmploymentStatus('active')} className="w-3 h-3" />
                  <span className="ml-px">在職</span>
                </label>
                <label className="flex items-center ml-1">
                  <input type="radio" name="status" checked={employmentStatus === 'retired'} onChange={() => setEmploymentStatus('retired')} className="w-3 h-3" />
                  <span className="ml-px">退職</span>
                </label>
                <label className="flex items-center ml-3">
                  <input type="checkbox" className="w-3 h-3" />
                  <span className="ml-px">併用</span>
                </label>
                <div className="w-px h-4 bg-gray-400 mx-2" />
                <span className="font-bold">星数</span>
                <input type="text" className="w-[24px] h-[18px] text-[11px] px-0.5 bg-yellow-200 border border-gray-400 ml-1" defaultValue="2" />
                <div className="w-px h-4 bg-gray-400 mx-2" />
                <div className="flex flex-col leading-tight">
                  <div className="flex items-center">
                    <span>入店日</span>
                    <input type="text" className="w-[70px] h-[18px] text-[11px] px-0.5 bg-white border border-gray-400 ml-1" />
                  </div>
                  <div className="flex items-center">
                    <span>退職日</span>
                    <input type="text" className="w-[70px] h-[18px] text-[11px] px-0.5 bg-white border border-gray-400 ml-1" />
                  </div>
                </div>
                <span className="font-bold ml-2">退職訂正</span>
                <div className="flex flex-col ml-2 gap-px">
                  <button type="button" className="h-[18px] px-1.5 text-[10px] bg-gray-200 hover:bg-gray-300 text-black border border-gray-400">Web管理確認</button>
                  <button type="button" className="h-[18px] px-1.5 text-[10px] bg-gray-200 hover:bg-gray-300 text-black border border-gray-400">Webページ</button>
                </div>
              </div>

              {/* 2行目 */}
              <div className="flex items-start mb-px">
                <span className="font-bold w-[58px]">在籍店舗</span>
                <input type="text" className="w-[24px] h-[18px] text-[11px] px-0.5 bg-white border border-gray-400" defaultValue="8" />
                <input type="text" className="w-[50px] h-[18px] text-[11px] px-0.5 bg-white border border-gray-400 ml-px" defaultValue="FIRST" />
                {/* 連絡方法ブロック（2行構成） */}
                <div className="flex flex-col ml-[148px] leading-tight">
                  <span>連絡方法</span>
                  <span>出確なしの場合</span>
                </div>
                <label className="flex items-center ml-3">
                  <input type="checkbox" className="w-3 h-3 border-gray-400" />
                </label>
                <span className="text-purple-600 font-bold">:</span>
              </div>

              {/* 3行目 */}
              <div className="flex items-center mb-px">
                <span className="font-bold w-[58px]">ふりがな</span>
                <input type="text" className="w-[80px] h-[18px] text-[11px] px-0.5 bg-white border border-gray-400" defaultValue="めぐる" />
                <label className="flex items-center ml-3 bg-yellow-200 px-1 border border-yellow-400">
                  <input type="checkbox" className="w-3 h-3" />
                  <span className="ml-px text-red-600 font-bold">帰宅厳守</span>
                </label>
                <label className="flex items-center ml-[62px] bg-pink-200 px-1 border border-pink-300">
                  <input type="checkbox" className="w-3 h-3" />
                  <span className="ml-px">電話</span>
                </label>
                <label className="flex items-center ml-px bg-pink-200 px-1 border border-pink-300">
                  <input type="checkbox" className="w-3 h-3" />
                  <span className="ml-px">ライン</span>
                </label>
                <label className="flex items-center ml-px bg-pink-200 px-1 border border-pink-300">
                  <input type="checkbox" className="w-3 h-3" />
                  <span className="ml-px">メール</span>
                </label>
                <span className="ml-3">手配配車</span>
                <label className="flex items-center ml-1">
                  <input type="checkbox" className="w-3 h-3" />
                  <span className="ml-px">非表示</span>
                </label>
              </div>

              {/* 4行目 */}
              <div className="flex items-center mb-px">
                <span className="font-bold w-[58px]">店内名</span>
                <input type="text" className="w-[80px] h-[18px] text-[11px] px-0.5 bg-white border border-gray-400" />
                <label className="flex items-center ml-2 border border-gray-400 px-1 bg-white">
                  <input type="checkbox" className="w-3 h-3" />
                  <span className="ml-px">主</span>
                </label>
                <span className="ml-1">主HSNo</span>
                <input type="text" className="w-[50px] h-[18px] text-[11px] px-0.5 bg-white border border-gray-400 ml-1" />
                <div className="flex flex-col leading-tight">
                  <span>上記以外の場合</span>
                  <div className="flex">
                    <label className="flex items-center bg-pink-200 px-1 border border-pink-300">
                      <input type="checkbox" className="w-3 h-3" />
                      <span className="ml-px">電話</span>
                    </label>
                    <label className="flex items-center ml-px bg-pink-200 px-1 border border-pink-300">
                      <input type="checkbox" className="w-3 h-3" />
                      <span className="ml-px">ライン</span>
                    </label>
                    <label className="flex items-center ml-px bg-pink-200 px-1 border border-pink-300">
                      <input type="checkbox" className="w-3 h-3" />
                      <span className="ml-px">メール</span>
                    </label>
                  </div>
                </div>
                <span className="ml-2">安井掛け持ち</span>
                <label className="flex items-center ml-1">
                  <input type="checkbox" className="w-3 h-3" />
                  <span className="ml-px">有</span>
                </label>
              </div>

              {/* 5行目 */}
              <div className="flex items-center mb-px">
                <span className="font-bold w-[58px]">旧店内名</span>
                <input type="text" className="w-[80px] h-[18px] text-[11px] px-0.5 bg-white border border-gray-400" />
                <label className="flex items-center ml-2 border border-gray-400 px-1 bg-white">
                  <input type="checkbox" className="w-3 h-3" />
                  <span className="ml-px">副</span>
                </label>
              </div>

              {/* 6行目 */}
              <div className="flex items-center">
                <span className="font-bold w-[58px]">所属事務所</span>
                <input type="text" className="w-[80px] h-[18px] text-[11px] px-0.5 bg-white border border-gray-400" />
                <span className="ml-2 text-orange-500 font-bold">GM区分</span>
                <input type="text" className="w-[40px] h-[18px] text-[11px] px-0.5 bg-yellow-200 border border-gray-400" defaultValue="ミセス" />
                <span className="text-orange-500 font-bold">コース種</span>
                <input type="text" className="w-[60px] h-[18px] text-[11px] px-0.5 bg-yellow-200 border border-gray-400" defaultValue="Standard" />
                <span className="text-orange-500 font-bold">種別</span>
                <input type="text" className="w-[30px] h-[18px] text-[11px] px-0.5 bg-yellow-200 border border-gray-400" />
                <span className="font-bold ml-1">Web:</span>
                <span className="ml-2">メンエス掛け持ち</span>
                <label className="flex items-center ml-1">
                  <input type="checkbox" className="w-3 h-3" />
                  <span className="ml-px">有</span>
                </label>
                <span className="ml-2">特別表示</span>
                <label className="flex items-center ml-1">
                  <input type="checkbox" className="w-3 h-3" />
                  <span className="ml-px">有</span>
                </label>
              </div>
            </div>

            {/* 右側 - 表示OK/写真NG と 写真エリア */}
            <div className="flex flex-col ml-2 shrink-0">
              <div className="flex flex-col text-[11px] mb-1">
                <label className="flex items-center">
                  <input type="radio" name="display" checked={displayStatus === 'ok'} onChange={() => setDisplayStatus('ok')} className="w-3 h-3" />
                  <span className="ml-px text-red-600">表示OK</span>
                </label>
                <label className="flex items-center">
                  <input type="radio" name="display" checked={displayStatus === 'ng'} onChange={() => setDisplayStatus('ng')} className="w-3 h-3" />
                  <span className="ml-px text-red-600">写真NG</span>
                </label>
              </div>
              <div className="flex gap-1">
                {/* 写真エリア */}
                <div className="w-[60px] h-[75px] border border-gray-400 bg-white flex items-center justify-center relative">
                  <div className="w-[45px] h-[60px] border border-pink-400 flex flex-col overflow-hidden relative">
                    <div className="flex-1 bg-yellow-100" />
                    <div className="h-[16px] bg-pink-300" />
                    {/* 三角マーク（左上の折り返し） */}
                    <div className="absolute top-0 right-0 w-0 h-0 border-r-[10px] border-r-gray-400 border-b-[10px] border-b-transparent" />
                  </div>
                </div>
                <div className="flex flex-col gap-0.5">
                  <button type="button" className="w-[22px] h-[22px] p-0 text-[10px] bg-gray-200 hover:bg-gray-300 text-black border border-gray-400 flex items-center justify-center">L</button>
                  <button type="button" className="w-[22px] h-[22px] p-0 text-[10px] bg-gray-200 hover:bg-gray-300 text-black border border-gray-400 flex items-center justify-center">×</button>
                </div>
                <div className="flex items-end ml-1">
                  <span className="text-[16px] font-bold">8</span>
                </div>
              </div>
            </div>
          </div>

          {/* 中ブロック (4.5) */}
          <div className="h-[45%] flex flex-col bg-white">
            {/* 上部ピンクボーダー */}
            <div className="h-[3px] bg-fuchsia-500 shrink-0" />

            {/* タブヘッダー */}
            <div className="bg-white border-x border-gray-400 flex items-end shrink-0">
              {[
                { id: 'プロフィール', label: 'プロフィール' },
                { id: 'HPデータ', label: 'HPデータ' },
                { id: '管理専用', label: '管理専用' },
                { id: 'コース料金割合制', label: 'コース料金割合制' },
                { id: 'コース料金定額制', label: 'コース料金定額制' },
                { id: 'コース料金同一併用', label: 'コース料金同一併用' },
                { id: 'クラス', label: 'クラス' },
                { id: 'オプション', label: 'オプション' },
              ].map((tab, index, arr) => (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveMiddleTab(tab.id)}
                  className={`h-[22px] px-2 text-[11px] bg-white hover:bg-gray-50 ${
                    activeMiddleTab === tab.id
                      ? ''
                      : 'border-b border-gray-400'
                  } ${index < arr.length - 1 ? 'border-r border-gray-400' : ''}`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* タブコンテンツ */}
            <div className="flex-1 border border-gray-400 border-t-0 p-2 overflow-auto">
              {activeMiddleTab === 'プロフィール' && <ProfileTab />}
              {activeMiddleTab === 'HPデータ' && <HPDataTab />}
              {activeMiddleTab === '管理専用' && <ManagementTab />}
              {activeMiddleTab === 'コース料金割合制' && <CourseRatioTab />}
              {activeMiddleTab === 'コース料金定額制' && <CourseFixedTab />}
              {activeMiddleTab === 'コース料金同一併用' && <CourseCombinedTab />}
              {activeMiddleTab === 'クラス' && <ClassTab />}
              {activeMiddleTab === 'オプション' && <OptionTab />}
            </div>
          </div>

          {/* 下ブロック (3.5) - シフト予定 */}
          <div className="h-[35%] bg-pink-100 flex flex-col overflow-hidden border border-gray-400">
            {/* 上部ピンクボーダー */}
            <div className="h-[3px] bg-fuchsia-500 shrink-0" />

            {/* タブ */}
            <div className="bg-pink-100 flex items-end shrink-0">
              {[
                { id: 'シフト予定', label: 'シフト予定' },
                { id: '基本シフト', label: '基本シフト' },
              ].map((tab, index, arr) => (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveBottomTab(tab.id)}
                  className={`h-[22px] px-3 text-[11px] bg-pink-100 hover:bg-pink-200 ${
                    activeBottomTab === tab.id
                      ? ''
                      : 'border-b border-gray-400'
                  } ${index < arr.length - 1 ? 'border-r border-gray-400' : ''}`}
                >
                  {tab.label}
                </button>
              ))}
              {/* 残りのスペースにボーダー */}
              <div className="flex-1 border-b border-gray-400 h-[22px]" />
            </div>

            {/* ナビゲーション行 */}
            <div className="flex items-center px-2 py-1 text-[11px]">
              {/* 週ナビゲーション */}
              <div className="flex items-center gap-3">
                <button type="button" className="flex items-center gap-0.5">
                  <span className="w-[14px] h-[14px] rounded-full bg-purple-500 text-white flex items-center justify-center text-[9px] font-bold">↓</span>
                  <span className="text-purple-600">今週</span>
                </button>
                <button type="button" className="flex items-center gap-0.5">
                  <span className="w-[14px] h-[14px] rounded-full bg-purple-500 text-white flex items-center justify-center text-[9px] font-bold">←</span>
                  <span className="text-purple-600">前週</span>
                </button>
                <button type="button" className="flex items-center gap-0.5">
                  <span className="w-[14px] h-[14px] rounded-full bg-purple-500 text-white flex items-center justify-center text-[9px] font-bold">→</span>
                  <span className="text-purple-600">翌週</span>
                </button>
              </div>

              <div className="flex-1" />

              {/* 右側ボタン */}
              <div className="flex gap-1">
                <button type="button" className="px-2 py-0.5 text-[10px] bg-pink-200 border border-gray-400 hover:bg-pink-300">週間出勤表</button>
                <button type="button" className="px-2 py-0.5 text-[10px] bg-pink-200 border border-gray-400 hover:bg-pink-300">出勤データ</button>
                <button type="button" className="px-2 py-0.5 text-[10px] bg-lime-300 border border-gray-400 hover:bg-lime-400">週間予定</button>
              </div>
            </div>

            {/* 日付ヘッダー + メインコンテンツ */}
            <div className="flex-1 flex px-1 pb-1 gap-[2px] overflow-hidden">
              {/* 左端スクロールボタン */}
              <div className="w-3 flex flex-col justify-center">
                <button type="button" className="text-gray-500 text-[10px]">◀</button>
              </div>

              {/* 7日分のカラム */}
              {['1/19(月)', '1/20(火)', '1/21(水)', '1/22(木)', '1/23(金)', '1/24(土)', '1/25(日)'].map((date, dayIndex) => (
                <div key={dayIndex} className="flex-1 flex flex-col min-w-0">
                  {/* 日付ヘッダー */}
                  <div className={`text-center text-[11px] mb-0.5 ${dayIndex === 6 ? 'text-red-600' : ''}`}>
                    {date}
                  </div>

                  {/* 作成ボタン */}
                  <button type="button" className="h-[18px] bg-green-600 text-white text-[10px] font-bold hover:bg-green-700 border border-green-700">
                    作成
                  </button>

                  {/* グレーエリア */}
                  <div className="h-[50px] bg-gray-300 border border-gray-400 mt-[2px]" />

                  {/* 撮影チェックボックス */}
                  <div className="flex items-center py-0.5">
                    <label className="flex items-center text-[10px]">
                      <input type="checkbox" className="w-3 h-3 border-gray-400" />
                      <span className="ml-0.5">撮影</span>
                    </label>
                  </div>

                  {/* カラフルセル行 */}
                  <div className="flex items-center h-[18px] gap-[1px]">
                    {/* シアンセル */}
                    <div className="w-[14px] h-[14px] bg-cyan-300 border border-purple-400" />
                    {/* ピンク ▶ セル */}
                    <div className="w-[12px] h-[14px] bg-pink-300 border border-purple-400 flex items-center justify-center">
                      <span className="text-[7px] text-black">▶</span>
                    </div>
                    {/* 黄色セル */}
                    <div className="w-[14px] h-[14px] bg-yellow-200 border border-purple-400" />
                    {/* コロン */}
                    <div className="w-[8px] h-[14px] flex items-center justify-center text-[10px] text-purple-600 font-bold">:</div>
                    {/* 緑セル */}
                    <div className="w-[14px] h-[14px] bg-green-200 border border-purple-400" />
                    {/* コロン */}
                    <div className="w-[8px] h-[14px] flex items-center justify-center text-[10px] text-purple-600 font-bold">:</div>
                    {/* ピンク/ベージュセル */}
                    <div className="w-[14px] h-[14px] bg-orange-100 border border-purple-400" />
                  </div>

                  {/* 下部テーブル行 */}
                  <div className="flex-1 flex flex-col mt-[2px] overflow-hidden border border-pink-400">
                    {[0, 1, 2, 3, 4, 5, 6].map((rowIndex) => (
                      <div key={rowIndex} className="flex h-[15px] border-b border-pink-300 last:border-b-0">
                        <div className="flex-1 bg-white" />
                        <div className="w-[16px] bg-yellow-100 border-l border-pink-300" />
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* 右ブロック (4) */}
        <div className="w-[40%] flex flex-col bg-white">
          {/* タブヘッダー */}
          <div className="h-[22px] bg-[#e8e4d9] border border-gray-400 flex items-center shrink-0">
            {[
              { id: '当日出勤ホステス', label: '当日出勤ホステス', color: 'text-black' },
              { id: '同店舗ホステス', label: '同店舗ホステス', color: 'text-black' },
              { id: '実績詳細', label: '実績詳細', color: 'text-black' },
              { id: '出勤', label: '出勤', color: 'text-black' },
              { id: 'フロントから', label: 'フロントから', color: 'text-green-600' },
              { id: '本日予約・NG履歴', label: '本日予約・NG履歴', color: 'text-black' },
              { id: '予約', label: '予約', color: 'text-black' },
              { id: '目標', label: '目標', color: 'text-black' },
            ].map((tab, index, arr) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveRightTab(tab.id)}
                className={`h-full px-2 text-[11px] ${tab.color} ${
                  activeRightTab === tab.id
                    ? 'bg-white font-bold border-b-2 border-b-white -mb-px'
                    : 'bg-[#e8e4d9] hover:bg-[#d8d4c9]'
                } ${index < arr.length - 1 ? 'border-r border-gray-400' : ''}`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* タブコンテンツ */}
          <div className="flex-1 border border-t-0 border-gray-400 p-2 overflow-auto">
            {activeRightTab === '当日出勤ホステス' && <TodayAttendanceTab />}
            {activeRightTab === '同店舗ホステス' && <SameStoreHostessTab />}
            {activeRightTab === '実績詳細' && <PerformanceDetailTab />}
            {activeRightTab === '出勤' && <AttendanceRightTab />}
            {activeRightTab === 'フロントから' && <FromFrontTab />}
            {activeRightTab === '本日予約・NG履歴' && <TodayReservationNGHistoryTab />}
            {activeRightTab === '予約' && <ReservationTab />}
            {activeRightTab === '目標' && <GoalTab />}
          </div>
        </div>
      </div>
    </div>
  );
}
