'use client';

import React, { useState, useEffect } from 'react';

import { useRouter } from 'next/navigation';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { ArrowLeft, BarChart3 } from "lucide-react";
import DailyReportHeader from "@/components/daily-report/DailyReportHeader";
import SalesReport from "@/components/daily-report/SalesReport";
import { salesReportSampleDataList } from "@/data/salesReportSampleData";
import MoneyInout from "@/components/daily-report/MoneyInout";
import { moneyInoutSampleList } from "@/data/moneyInoutSampleData";
import CreditCard from "@/components/daily-report/CreditCard";
import { creditCardSampleList } from "@/data/creditCardSampleData";
import StaffList from "@/components/daily-report/StaffList";
import { staffSampleList } from "@/data/staffSampleData";
import AttendanceTab from "@/components/daily-report/AttendanceTab";
import { attendingStaffSampleList, attendingHostessSampleList } from "@/data/attendanceSampleData";

export default function DailyReport() {
  const router = useRouter();
  const [currentDate, setCurrentDate] = useState(new Date());

  useEffect(() => {
    document.title = '日報 - Dispatch Harmony Hub';
  }, []);

  const handleMenuClick = () => {
    // メニュー機能の実装予定
  };

  const handleListClick = () => {
    // リスト機能の実装予定
  };

  const handleCreditCheckClick = () => {
    // クレジット確認機能の実装予定
  };

  const handleStoreCardSummaryClick = () => {
    // 店別カード集計機能の実装予定
  };

  const handleAClick = () => {
    // A機能の実装予定
  };

  const handleBClick = () => {
    // B機能の実装予定
  };

  // 日付ナビゲーション関数
  const handleWeekBackClick = () => {
    const newDate = new Date(currentDate);
    newDate.setDate(newDate.getDate() - 7);
    setCurrentDate(newDate);
  };

  const handlePreviousDayClick = () => {
    const newDate = new Date(currentDate);
    newDate.setDate(newDate.getDate() - 1);
    setCurrentDate(newDate);
  };

  const handleNextDayClick = () => {
    const newDate = new Date(currentDate);
    newDate.setDate(newDate.getDate() + 1);
    setCurrentDate(newDate);
  };

  const handleWeekForwardClick = () => {
    const newDate = new Date(currentDate);
    newDate.setDate(newDate.getDate() + 7);
    setCurrentDate(newDate);
  };

  // CRUD・オーナーボタンハンドラー
  const handleNewClick = () => {
    // 新規作成機能の実装予定
  };

  const handleDeleteClick = () => {
    // 削除機能の実装予定
  };

  const handleSearchClick = () => {
    // 検索機能の実装予定
  };

  const handleOwnerClick = () => {
    // オーナー機能の実装予定
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* 戻るボタン */}
      <div className="p-4 pb-0">
        <Button 
          variant="outline" 
          onClick={() => router.push('/dashboard')}
          className="flex items-center gap-2"
        >
          <ArrowLeft className="w-4 h-4" />
          ダッシュボードに戻る
        </Button>
      </div>

      {/* 日報ヘッダー */}
      <div className="mt-6">
        <DailyReportHeader
          currentDate={currentDate}
          closingDateTime={new Date(Date.now() + 8 * 60 * 60 * 1000)} // 8時間後
          manager="田中太郎"
          serialNumber="DRP-20250917-001"
          createdAt={new Date(Date.now() - 3 * 60 * 60 * 1000)} // 3時間前
          updatedAt={new Date(Date.now() - 30 * 60 * 1000)} // 30分前
          onMenuClick={handleMenuClick}
          onListClick={handleListClick}
          onCreditCheckClick={handleCreditCheckClick}
          onStoreCardSummaryClick={handleStoreCardSummaryClick}
          onAClick={handleAClick}
          onBClick={handleBClick}
          onWeekBackClick={handleWeekBackClick}
          onPreviousDayClick={handlePreviousDayClick}
          onNextDayClick={handleNextDayClick}
          onWeekForwardClick={handleWeekForwardClick}
          onNewClick={handleNewClick}
          onDeleteClick={handleDeleteClick}
          onSearchClick={handleSearchClick}
          onOwnerClick={handleOwnerClick}
        />
      </div>

      {/* メインコンテンツ */}
      <div className="p-4">
        <div className="flex gap-6">
          {/* 左側: 売上レポート一覧とスタッフリスト */}
          <div className="flex-shrink-0 space-y-6">
            {/* 売上レポート一覧 */}
            <Card>
              <CardHeader>
                <h3 className="text-lg font-semibold flex items-center gap-2">
                  <BarChart3 className="w-4 h-4" />
                  売上レポート一覧
                </h3>
              </CardHeader>
              <CardContent className="p-4">
                <div className="h-[600px] w-[782px] overflow-y-auto border border-gray-200 rounded-lg bg-gray-50 p-4">
                  <div className="space-y-1">
                    {salesReportSampleDataList.map((data, index) => (
                      <div key={index} className="flex justify-start">
                        <SalesReport data={data} />
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* スタッフリスト */}
            <Card>
              <CardHeader className="bg-teal-50">
                <h4 className="text-md font-semibold text-teal-700">スタッフ一覧</h4>
              </CardHeader>
              <CardContent className="p-4">
                {/* スクロール可能なデータ領域 */}
                <div className="h-[350px] w-[782px] overflow-y-auto">
                  <StaffList staffList={staffSampleList} />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* 右側: 集計結果とリスト */}
          <div className="flex-1 space-y-6">
            {/* 集計結果カード */}
            <Card>
              <CardHeader>
                <h3 className="text-lg font-semibold">集計結果</h3>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4">
                  {/* 左列 */}
                  <div className="space-y-2">
                    <div className="bg-blue-50 px-3 py-2 rounded-lg border flex justify-between items-center">
                      <span className="text-sm text-gray-600">現金収入計</span>
                      <span className="text-lg font-bold text-blue-700 font-mono">¥0</span>
                    </div>
                    <div className="bg-green-50 px-3 py-2 rounded-lg border flex justify-between items-center">
                      <span className="text-sm text-gray-600">店舗売上計カード</span>
                      <span className="text-lg font-bold text-green-700 font-mono">¥0</span>
                    </div>
                    <div className="bg-purple-50 px-3 py-2 rounded-lg border flex justify-between items-center">
                      <span className="text-sm text-gray-600">売上計</span>
                      <span className="text-lg font-bold text-purple-700 font-mono">¥0</span>
                    </div>
                    <div className="bg-indigo-50 px-3 py-2 rounded-lg border flex justify-between items-center">
                      <span className="text-sm text-gray-600">店舗売上計現金</span>
                      <span className="text-lg font-bold text-indigo-700 font-mono">¥0</span>
                    </div>
                  </div>

                  {/* 右列 */}
                  <div className="space-y-2">
                    <div className="bg-orange-50 px-3 py-2 rounded-lg border flex justify-between items-center">
                      <span className="text-sm text-gray-600">ドライバ回収額計</span>
                      <span className="text-lg font-bold text-orange-700 font-mono">¥0</span>
                    </div>
                    <div className="bg-pink-50 px-3 py-2 rounded-lg border flex justify-between items-center">
                      <span className="text-sm text-gray-600">ホステス支払計</span>
                      <span className="text-lg font-bold text-pink-700 font-mono">¥0</span>
                    </div>
                    <div className="bg-cyan-50 px-3 py-2 rounded-lg border flex justify-between items-center">
                      <span className="text-sm text-gray-600">入金計</span>
                      <span className="text-lg font-bold text-cyan-700 font-mono">¥0</span>
                    </div>
                    <div className="bg-red-50 px-3 py-2 rounded-lg border flex justify-between items-center">
                      <span className="text-sm text-gray-600">出金計</span>
                      <span className="text-lg font-bold text-red-700 font-mono">¥0</span>
                    </div>
                    <div className="bg-yellow-50 px-3 py-2 rounded-lg border flex justify-between items-center">
                      <span className="text-sm text-gray-600">収支計</span>
                      <span className="text-lg font-bold text-yellow-700 font-mono">¥0</span>
                    </div>
                    <div className="bg-gray-50 px-3 py-2 rounded-lg border flex justify-between items-center">
                      <span className="text-sm text-gray-600">現金残高</span>
                      <span className="text-lg font-bold text-gray-700 font-mono">¥0</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* 入金・出金リスト */}
            <div className="grid grid-cols-2 gap-4">
              {/* 入金リスト（赤） */}
              <Card>
                <CardHeader className="bg-red-50">
                  <h4 className="text-md font-semibold text-red-700">入金一覧</h4>
                </CardHeader>
                <CardContent className="p-4">
                <div className="space-y-1">
                  {moneyInoutSampleList.map((data, index) => (
                    <div key={index} className="flex justify-start">
                      <MoneyInout data={data} />
                    </div>
                  ))}
                </div>
            </CardContent>
              </Card>

              {/* 出金リスト（青） */}
              <Card>
                <CardHeader className="bg-blue-50">
                  <h4 className="text-md font-semibold text-blue-700">出金一覧</h4>
                </CardHeader>
                <CardContent className="p-4">
                <div className="space-y-1">
                  {moneyInoutSampleList.map((data, index) => (
                    <div key={index} className="flex justify-start">
                      <MoneyInout data={data} />
                    </div>
                  ))}
                </div>
            </CardContent>
              </Card>
            </div>

            {/* クレジットカードリスト */}
            <Card>
              <CardHeader className="bg-purple-50">
                <h4 className="text-md font-semibold text-purple-700">クレジットカード一覧</h4>
              </CardHeader>
              <CardContent className="p-4">
                {/* ヘッダー行 */}
                <div className="grid grid-cols-9 gap-2 text-sm font-semibold text-gray-700 pb-2 border-b-2 border-gray-300 mb-2">
                  <div className="text-center">店舗</div>
                  <div className="text-center">コース</div>
                  <div className="text-center">ホステス名</div>
                  <div className="text-right">延長料金</div>
                  <div className="text-right">請求金額</div>
                  <div className="text-right">店舗取分</div>
                  <div className="text-right">ホステス取分</div>
                  <div className="text-right">ホステス預り金</div>
                  <div className="text-center">OUTドライバ名</div>
                </div>
                
                {/* スクロール可能なデータ領域 */}
                <div className="h-[500px] overflow-y-auto">
                  <div className="space-y-1">
                    {creditCardSampleList.map((data, index) => (
                      <div key={index}>
                        <CreditCard data={data} />
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* 下段: 出勤管理タブ */}
        <div className="mt-6">
          <AttendanceTab 
            staffList={attendingStaffSampleList} 
            hostessList={attendingHostessSampleList} 
          />
        </div>
      </div>
    </div>
  );
}
