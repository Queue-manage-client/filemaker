'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { ArrowLeft, CalendarIcon, ChevronLeft, ChevronRight } from "lucide-react";
import { format } from "date-fns";
import { ja } from "date-fns/locale";

// 売上リストのサンプルデータ（写真に基づく）
const salesListData = [
  {
    id: 0,
    label: 'A',
    storeName: 'DCP',
    storeCashSales: 0,
    storeCardSales: 402405,
    storeCardCount: 0,
    storeTotalSales: 402405,
    cardBilling: 96983,
    cardAddFee: 335,
    otherSales: 0,
    cashRevenue: -96548,
    receiptCount: 0,
    discountTicketCount: 0,
    uncollectedAmount: 0,
    deposit: 0,
    withdrawal: 0,
    reportedAmount: -96548,
    payrollDaily: 0,
    dispatchDaily: 0,
    nominationDaily: 0,
    hfNominationDaily: 0,
    oldCashRevenue: -96548,
    oldReportedAmount: -96548,
  },
  {
    id: 1,
    label: 'A',
    storeName: '京都デリヘル倶楽部',
    storeCashSales: 164000,
    storeCardSales: 13040,
    storeCardCount: 1,
    storeTotalSales: 177040,
    cardBilling: 30240,
    cardAddFee: 3240,
    otherSales: 0,
    cashRevenue: 146800,
    receiptCount: 0,
    discountTicketCount: 0,
    uncollectedAmount: 0,
    deposit: 0,
    withdrawal: 17200,
    reportedAmount: 129600,
    payrollDaily: 396200,
    dispatchDaily: 22,
    nominationDaily: 13,
    hfNominationDaily: 8,
    oldCashRevenue: 146800,
    oldReportedAmount: 129600,
  },
  {
    id: 2,
    label: '',
    storeName: 'LADY',
    storeCashSales: 0,
    storeCardSales: 0,
    storeCardCount: 0,
    storeTotalSales: 0,
    cardBilling: 0,
    cardAddFee: 0,
    otherSales: 0,
    cashRevenue: 0,
    receiptCount: 0,
    discountTicketCount: 0,
    uncollectedAmount: 0,
    deposit: 0,
    withdrawal: 0,
    reportedAmount: 0,
    payrollDaily: 0,
    dispatchDaily: 0,
    nominationDaily: 0,
    hfNominationDaily: 0,
    oldCashRevenue: 0,
    oldReportedAmount: 0,
  },
  {
    id: 3,
    label: 'A',
    storeName: '京都人妻デリヘル倶楽部',
    storeCashSales: 300760,
    storeCardSales: 0,
    storeCardCount: 0,
    storeTotalSales: 300760,
    cardBilling: 0,
    cardAddFee: 0,
    otherSales: 0,
    cashRevenue: 200760,
    receiptCount: 0,
    discountTicketCount: 0,
    uncollectedAmount: 0,
    deposit: 0,
    withdrawal: 0,
    reportedAmount: 200760,
    payrollDaily: 40340,
    dispatchDaily: 26,
    nominationDaily: 12,
    hfNominationDaily: 3,
    oldCashRevenue: 200760,
    oldReportedAmount: 200760,
  },
  {
    id: 4,
    label: 'A',
    storeName: 'FIRST',
    storeCashSales: 104800,
    storeCardSales: 0,
    storeCardCount: 0,
    storeTotalSales: 104800,
    cardBilling: 0,
    cardAddFee: 0,
    otherSales: 0,
    cashRevenue: 104800,
    receiptCount: 0,
    discountTicketCount: 0,
    uncollectedAmount: 0,
    deposit: 0,
    withdrawal: 0,
    reportedAmount: 104800,
    payrollDaily: 0,
    dispatchDaily: 20,
    nominationDaily: 0,
    hfNominationDaily: 12,
    oldCashRevenue: 104800,
    oldReportedAmount: 104800,
  },
  {
    id: 5,
    label: 'A',
    storeName: '京都ホテヘル倶楽部',
    storeCashSales: 422510,
    storeCardSales: 4480,
    storeCardCount: 1,
    storeTotalSales: 426990,
    cardBilling: 19040,
    cardAddFee: 2040,
    otherSales: 0,
    cashRevenue: 407560,
    receiptCount: 0,
    discountTicketCount: 0,
    uncollectedAmount: 0,
    deposit: 14550,
    withdrawal: 0,
    reportedAmount: 407560,
    payrollDaily: 1137040,
    dispatchDaily: 62,
    nominationDaily: 0,
    hfNominationDaily: 23,
    oldCashRevenue: 393410,
    oldReportedAmount: 393410,
  },
  {
    id: 6,
    label: 'A',
    storeName: 'シークレット',
    storeCashSales: 0,
    storeCardSales: 0,
    storeCardCount: 0,
    storeTotalSales: 0,
    cardBilling: 0,
    cardAddFee: 0,
    otherSales: 0,
    cashRevenue: 0,
    receiptCount: 0,
    discountTicketCount: 0,
    uncollectedAmount: 0,
    deposit: 0,
    withdrawal: 0,
    reportedAmount: 0,
    payrollDaily: 0,
    dispatchDaily: 0,
    nominationDaily: 0,
    hfNominationDaily: 0,
    oldCashRevenue: 0,
    oldReportedAmount: 0,
  },
];

// 入金サンプルデータ
const depositData = [
  { category: '事務所DCP', name: '前日繰越現金', amount: 233 },
  { category: '精田', name: '武 売上回収金', amount: 0 },
  { category: '山岡', name: '金村 売上回収金', amount: 0 },
  { category: '伊坂', name: '4 伏見 売上回収金', amount: 38280 },
  { category: '大谷', name: '大輔 売上回収金', amount: 0 },
  { category: '顧客', name: '売掛回収金', amount: 0 },
  { category: '中尾', name: '5 消費税 売上回収金', amount: 33180 },
  { category: '西川', name: '駿宏 売上回収金', amount: 0 },
  { category: '稗平', name: '翼 売上田収金', amount: 0 },
  { category: '森', name: '侑雅 売上田収金', amount: 10000 },
  { category: '売場', name: '隆 売上回収金', amount: 0 },
  { category: '事務所', name: '3 油路 売上回収金', amount: 5000 },
  { category: '離波', name: '寛吾 売上田収金', amount: 5373 },
  { category: '事務所DCP', name: '売上回収金', amount: 0 },
  { category: '大宮', name: '派 アルバイト給', amount: 10871 },
  { category: '車両', name: '7 山科', amount: 9490 },
  { category: '大宮', name: '出 前借', amount: 20732 },
];

// 出金サンプルデータ
const withdrawalData = [
  { category: '◆クレジット前払', name: 'さなか', amount: 17200 },
  { category: '梅1', name: '梅川沢太町 ひ', amount: 0 },
  { category: '堀川丸太町', name: 'な', amount: 0 },
  { category: '堀川沢太町', name: 'な', amount: 5600 },
  { category: '阪急西院', name: 'ら', amount: 4200 },
  { category: '事務所', name: '', amount: 490 },
  { category: '東軽DCP', name: '再軽事務再', amount: 0 },
  { category: '大宮', name: '派 アルバイト給', amount: 14350 },
  { category: '事務所', name: 'ガソリン代', amount: 5000 },
  { category: '麻糸', name: '草 上田収金', amount: 9240 },
  { category: '川原', name: '4 伏見 アメリカ', amount: 0 },
  { category: '大谷', name: '大輔 アメリカ', amount: 5373 },
  { category: '事務所', name: '5 南 前払', amount: 0 },
  { category: '事務所OCP', name: '帰宅タクの (3F)', amount: 0 },
  { category: '帰宅ホス', name: '', amount: 200230 },
];

// クレジットカードサンプルデータ
const creditCardData = [
  { store: '京都', course: '80分PK6', hostessName: 'るか', billAmount: 30040 },
  { store: '南ホテ', course: '100分PK6', hostessName: 'あやね', billAmount: 19040 },
];

// スタッフサンプルデータ（写真に基づく）
// settlementStatus: 'unsettled'=未精算, 'unsent'=未送信, 'completed'=精算・送信完了
const staffData = [
  { id: 1, type: '社員', name: '吉田 琢雅10', status: '出勤', salary: 0, collection: 0, deposit: 0, refund: 0, express: 0, adjust: 0, net: 0, bath1: 0, bath2: 3, bath3: 3, equip: 3, discountCard: 3, managerCheck: 0, settlementStatus: 'unsettled' },
  { id: 2, type: '社員', name: '松平 篤', status: '退社', statusNum: 11, salary: 0, collection: 0, deposit: 0, refund: 0, express: 0, adjust: 0, net: 0, bath1: 0, bath2: 0, bath3: 0, equip: 0, discountCard: 0, managerCheck: 0, settlementStatus: 'completed' },
  { id: 3, type: '社員', name: '汐崎 哲也9', status: '出勤', salary: 38070, collection: 61930, deposit: 26960, refund: 0, express: 0, adjust: 0, net: 73040, bath1: 0, bath2: 1, bath3: 1, equip: 3, discountCard: 4, managerCheck: 4, settlementStatus: 'unsent' },
  { id: 4, type: '社員', name: '南 和貴6', status: '退社', statusNum: 11, salary: 10000, collection: 27000, deposit: 25970, refund: 0, express: 0, adjust: 0, net: 11030, bath1: 7, bath2: 0, bath3: 0, equip: 7, discountCard: 5, managerCheck: 1, settlementStatus: 'completed' },
  { id: 5, type: '社員', name: '耕平 中尾11', status: '出勤', salary: 0, collection: 0, deposit: 1880, refund: 0, express: 0, adjust: 0, net: -1880, bath1: 3, bath2: 0, bath3: 0, equip: 3, discountCard: 3, managerCheck: 0, settlementStatus: 'unsettled' },
  { id: 6, type: '社員', name: '村上 竜5', status: '退社', statusNum: 11, salary: 99670, collection: 215330, deposit: 238450, refund: 0, express: 0, adjust: 0, net: 76550, bath1: 1, bath2: 1, bath3: 0, equip: 8, discountCard: 0, managerCheck: 0, settlementStatus: 'completed' },
  { id: 7, type: '社員', name: '南部 吉郎11', status: '退社', statusNum: 11, salary: 74700, collection: 121300, deposit: 85710, refund: 0, express: 0, adjust: 0, net: 110290, bath1: 3, bath2: 1, bath3: 0, equip: 2, discountCard: 3, managerCheck: 7, settlementStatus: 'completed' },
  { id: 8, type: '社員', name: '森下 光哉1', status: '出勤', salary: 68000, collection: 153000, deposit: 207630, refund: 0, express: 0, adjust: 0, net: 13370, bath1: 0, bath2: 2, bath3: 2, equip: 0, discountCard: 0, managerCheck: 2, settlementStatus: 'unsent' },
];

// 出勤ホステスサンプルデータ
const hostessDisplayData = staffData.map((s, i) => ({
  ...s,
  rowNum: i + 1,
  // 追加項目
  sendLocation: i % 3 === 0 ? '京都駅' : i % 3 === 1 ? '四条烏丸' : '河原町',
  transportFee: Math.floor(Math.random() * 3000),
  miscFee: Math.floor(Math.random() * 500),
  hostessDeposit: Math.floor(Math.random() * 5000),
  paymentAmount: Math.floor(Math.random() * 50000),
  isPaid: i % 2 === 0,
  approval: i % 3 === 0,
}));

export default function DailyReport() {
  const router = useRouter();
  const [currentDate, setCurrentDate] = useState<Date>(new Date());
  const [calendarOpen, setCalendarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'staff' | 'hostess'>('staff');

  useEffect(() => {
    document.title = '日報 - Dispatch Harmony Hub';
  }, []);

  // 日付を前後に移動
  const goToPreviousDay = () => {
    const newDate = new Date(currentDate);
    newDate.setDate(newDate.getDate() - 1);
    setCurrentDate(newDate);
  };

  const goToNextDay = () => {
    const newDate = new Date(currentDate);
    newDate.setDate(newDate.getDate() + 1);
    setCurrentDate(newDate);
  };

  // 数値のフォーマット関数
  const formatNumber = (num: number | string) => {
    if (typeof num === 'string') return num;
    if (num === 0) return '';
    return num.toLocaleString();
  };

  return (
    <div className="w-[1920px] h-[1080px] relative bg-white font-['Inter'] flex flex-col text-xs">
      {/* ヘッダー - dispatch-panel-2dと同じスタイル */}
      <div className="w-full h-[50px] bg-white">
        <div className="flex items-center h-full px-2">
          {/* ダッシュボードに戻る - 左端 */}
          <Button
            variant="outline"
            onClick={() => router.push('/dashboard')}
            className="h-8 px-3 text-xs flex items-center gap-2 border-[#323232]"
          >
            <ArrowLeft className="w-4 h-4" />
            ダッシュボードに戻る
          </Button>

          {/* 中央配置のボタン群 */}
          <div className="flex-1 flex items-center justify-center gap-2">
            {/* 日報タイトル */}
            <h1 className="text-lg font-bold mr-2">日報</h1>

            {/* 日付移動ボタン（前日） */}
            <Button
              variant="outline"
              size="sm"
              className="h-8 w-8 p-0 border-[#323232]"
              onClick={goToPreviousDay}
            >
              <ChevronLeft className="w-4 h-4" />
            </Button>

            {/* カレンダーから日付選択 */}
            <Popover open={calendarOpen} onOpenChange={setCalendarOpen}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className="h-8 px-3 text-xs border-[#323232] flex items-center gap-2"
                >
                  <CalendarIcon className="w-4 h-4" />
                  {format(currentDate, 'yyyy年MM月dd日(E)', { locale: ja })}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="center">
                <Calendar
                  mode="single"
                  selected={currentDate}
                  onSelect={(date) => {
                    if (date) {
                      setCurrentDate(date);
                      setCalendarOpen(false);
                    }
                  }}
                  locale={ja}
                />
              </PopoverContent>
            </Popover>

            {/* 日付移動ボタン（翌日） */}
            <Button
              variant="outline"
              size="sm"
              className="h-8 w-8 p-0 border-[#323232] mr-2"
              onClick={goToNextDay}
            >
              <ChevronRight className="w-4 h-4" />
            </Button>

            {/* 印刷 */}
            <Button
              className="h-8 px-4 text-xs bg-lime-400 hover:bg-lime-500 text-black border border-[#323232]"
              onClick={() => {}}
            >
              印刷
            </Button>

            {/* 売上確定 */}
            <Button
              className="h-8 px-4 text-xs bg-cyan-300 hover:bg-cyan-400 text-black border border-[#323232]"
              onClick={() => {}}
            >
              売上確定
            </Button>

            {/* 日報承認 */}
            <Button
              className="h-8 px-4 text-xs bg-purple-400 hover:bg-purple-500 text-black border border-[#323232]"
              onClick={() => {}}
            >
              日報承認
            </Button>

            {/* Menu */}
            <Button
              variant="outline"
              className="h-8 px-4 text-xs border-[#323232]"
              onClick={() => {}}
            >
              Menu
            </Button>
          </div>
        </div>
      </div>

      {/* メインコンテンツ - グリッドレイアウト */}
      <div className="flex-1 grid mt-1 overflow-hidden" style={{ gridTemplateColumns: '25% 27% 48%', gridTemplateRows: '1fr' }}>
        {/* 左側セクション - 売上リスト */}
        <div className="h-full overflow-y-scroll border-r border-[#323232] bg-white scrollbar-visible" style={{ scrollbarWidth: 'thin', scrollbarColor: '#888 #e5e5e5' }}>
        {salesListData.map((store, index) => (
          <div key={store.id} className="border-b border-[#323232]">
            {/* 店舗ヘッダー */}
            <div className={`bg-cyan-200 h-5 flex items-center px-0.5 border-b border-[#323232] ${index === 0 ? 'border-t' : ''}`}>
              <span className="text-xs font-bold text-black">{store.id} {store.label} 売上リスト</span>
              <span className="text-xs font-bold ml-0.5 text-black">{store.storeName}</span>
            </div>
            {/* 売上詳細 - 3列レイアウト */}
            <div className="text-xs bg-white">
              {/* 行1: 店売上現金計 / (空白) / 給料日計 */}
              <div className="flex h-5 border-b border-[#323232]">
                <div className="flex-1 px-1 py-0.5 flex items-center">店売上現金計</div>
                <div className="flex-1 text-right px-1 py-0.5 flex items-center justify-end">{formatNumber(store.storeCashSales)}</div>
                <div className="flex-1 px-1 py-0.5 flex items-center"></div>
                <div className="flex-1 px-1 py-0.5 flex items-center">給料日計</div>
                <div className="flex-1 text-right px-1 py-0.5 flex items-center justify-end">{formatNumber(store.payrollDaily)}</div>
              </div>
              {/* 行2: 店売上カード計 / 領収証発行 / 派遣回数日計 */}
              <div className="flex h-5 border-b border-[#323232]">
                <div className="flex-1 px-1 py-0.5 flex items-center">店売上カード計</div>
                <div className="flex-1 text-right px-1 py-0.5 flex items-center justify-end">{formatNumber(store.storeCardSales)} {store.storeCardCount > 0 ? `${store.storeCardCount}件` : ''}</div>
                <div className="flex-1 px-1 py-0.5 flex items-center">領収証発行</div>
                <div className="w-8 text-right px-1 py-0.5 flex items-center justify-end">{store.receiptCount}件</div>
                <div className="flex-1 px-1 py-0.5 flex items-center">派遣回数日計</div>
                <div className="w-8 text-right px-1 py-0.5 flex items-center justify-end">{formatNumber(store.dispatchDaily)}</div>
              </div>
              {/* 行3: 店売上計 / 割引チケット利用 / 指名回数日計 */}
              <div className="flex h-5 border-b border-[#323232]">
                <div className="flex-1 px-1 py-0.5 flex items-center">店売上計</div>
                <div className="flex-1 text-right px-1 py-0.5 flex items-center justify-end">{formatNumber(store.storeTotalSales)}</div>
                <div className="flex-1 px-1 py-0.5 flex items-center">割引チケット</div>
                <div className="w-8 text-right px-1 py-0.5 flex items-center justify-end">{store.discountTicketCount}件</div>
                <div className="flex-1 px-1 py-0.5 flex items-center">指名回数日計</div>
                <div className="w-8 text-right px-1 py-0.5 flex items-center justify-end">{formatNumber(store.nominationDaily)}</div>
              </div>
              {/* 行4: カード請求計 / 未回収売掛金額計 / HF指名回数日計 */}
              <div className="flex h-5 border-b border-[#323232]">
                <div className="flex-1 px-1 py-0.5 flex items-center">カード請求計</div>
                <div className="flex-1 text-right px-1 py-0.5 flex items-center justify-end">{formatNumber(store.cardBilling)}</div>
                <div className="flex-1 px-1 py-0.5 flex items-center">未回収売掛</div>
                <div className="w-8 text-right px-1 py-0.5 flex items-center justify-end">{formatNumber(store.uncollectedAmount)}</div>
                <div className="flex-1 px-1 py-0.5 flex items-center">HF指名日計</div>
                <div className="w-8 text-right px-1 py-0.5 flex items-center justify-end">{formatNumber(store.hfNominationDaily)}</div>
              </div>
              {/* 行5: カード加算金額計 / (空白) / (空白) */}
              <div className="flex h-5 border-b border-[#323232]">
                <div className="flex-1 px-1 py-0.5 flex items-center">カード加算金額計</div>
                <div className="flex-1 text-right px-1 py-0.5 flex items-center justify-end">{formatNumber(store.cardAddFee)}</div>
                <div className="flex-1 px-1 py-0.5 flex items-center"></div>
                <div className="flex-1 px-1 py-0.5 flex items-center"></div>
              </div>
              {/* 行6: その他売上計 / 入金計 / 出金計 */}
              <div className="flex h-5 border-b border-[#323232]">
                <div className="flex-1 min-w-[90px] px-1 py-0.5 flex items-center">その他売上計</div>
                <div className="flex-1 text-right px-1 py-0.5 flex items-center justify-end">{formatNumber(store.otherSales)}</div>
                <div className="flex-1 px-1 py-0.5 flex items-center">入金計</div>
                <div className="flex-1 text-right px-1 py-0.5 flex items-center justify-end">{formatNumber(store.deposit)}</div>
                <div className="flex-1 px-1 py-0.5 flex items-center">出金計</div>
                <div className="flex-1 text-right px-1 py-0.5 flex items-center justify-end">{formatNumber(store.withdrawal)}</div>
              </div>
              {/* 行7: 現金収入計 / 報告金額 / 旧現金収入計 */}
              <div className="flex h-5 border-b border-[#323232]">
                <div className="flex-1 px-1 py-0.5 flex items-center">現金収入計</div>
                <div className="flex-1 text-right px-1 py-0.5 flex items-center justify-end">{formatNumber(store.cashRevenue)}</div>
                <div className="flex-1 px-1 py-0.5 flex items-center font-bold">報告金額</div>
                <div className="flex-1 text-right px-1 py-0.5 flex items-center justify-end font-bold">{formatNumber(store.reportedAmount)}</div>
                <div className="flex-1 min-w-[90px] px-1 py-0.5 flex items-center">旧現金収入計</div>
                <div className="flex-1 text-right px-1 py-0.5 flex items-center justify-end">{formatNumber(store.oldCashRevenue)}</div>
              </div>
              {/* 行8: (空白) / (空白) / 旧報告金額 */}
              <div className="flex h-5 bg-cyan-50">
                <div className="flex-[2] px-1 py-0.5 flex items-center"></div>
                <div className="flex-1 px-1 py-0.5 flex items-center"></div>
                <div className="flex-1 px-1 py-0.5 flex items-center">旧報告金額</div>
                <div className="flex-1 text-right px-1 py-0.5 flex items-center justify-end">{formatNumber(store.oldReportedAmount)}</div>
              </div>
            </div>
          </div>
        ))}
        </div>

        {/* 中央左セクション - 集計結果 + 入出金 + クレジット */}
        <div className="h-full border-r border-[#323232] overflow-y-auto">
          {/* 集計結果 */}
        <div className="text-xs">
          <div className="flex h-5 border-t border-b border-[#323232]">
            <div className="flex-1 p-0.5 bg-zinc-200 border-r border-[#323232] flex items-center">現金収入計</div>
            <div className="w-20 text-right px-px py-0.5 border-r border-[#323232] flex items-center justify-end font-bold">860,655</div>
            <div className="flex-1 p-0.5 bg-zinc-200 border-r border-[#323232] flex items-center">ドライバ回収額計</div>
            <div className="w-20 text-right px-px py-0.5 flex items-center justify-end font-bold">865,670</div>
          </div>
          <div className="flex h-5 border-b border-[#323232]">
            <div className="flex-1 p-0.5 bg-zinc-100 border-r border-[#323232] flex items-center">店舗売上計カード</div>
            <div className="w-20 text-right px-px py-0.5 border-r border-[#323232] flex items-center justify-end">49,280</div>
            <div className="flex-1 p-0.5 bg-zinc-100 border-r border-[#323232] flex items-center">ホステス支払計</div>
            <div className="w-20 text-right px-px py-0.5 flex items-center justify-end">1,724,940</div>
          </div>
          <div className="flex h-5 border-b border-[#323232]">
            <div className="flex-1 p-0.5 bg-zinc-100 border-r border-[#323232] flex items-center">売上計</div>
            <div className="w-20 text-right px-px py-0.5 border-r border-[#323232] flex items-center justify-end">909,600</div>
            <div className="flex-1 p-0.5 bg-zinc-100 border-r border-[#323232] flex items-center">入金計</div>
            <div className="w-20 text-right px-px py-0.5 flex items-center justify-end">402,455</div>
          </div>
          <div className="flex h-5 border-b border-[#323232]">
            <div className="flex-1 p-0.5 bg-zinc-100 border-r border-[#323232] flex items-center">店舗売上計現金</div>
            <div className="w-20 text-right px-px py-0.5 border-r border-[#323232] flex items-center justify-end">892,070</div>
            <div className="flex-1 p-0.5 bg-zinc-100 border-r border-[#323232] flex items-center">出金計</div>
            <div className="w-20 text-right px-px py-0.5 flex items-center justify-end">128,733</div>
          </div>
          <div className="flex h-5 border-b border-[#323232]">
            <div className="flex-1 p-0.5 bg-zinc-100 border-r border-[#323232] flex items-center"></div>
            <div className="w-20 text-right px-px py-0.5 border-r border-[#323232] flex items-center justify-end"></div>
            <div className="flex-1 p-0.5 bg-zinc-100 border-r border-[#323232] flex items-center">収支計</div>
            <div className="w-20 text-right px-px py-0.5 flex items-center justify-end">273,722</div>
          </div>
          <div className="flex h-5 border-b border-[#323232] bg-yellow-100">
            <div className="flex-1 px-px py-0.5 border-r border-[#323232] flex items-center"></div>
            <div className="w-20 text-right px-px py-0.5 border-r border-[#323232] flex items-center justify-end"></div>
            <div className="flex-1 px-px py-0.5 border-r border-[#323232] flex items-center font-bold">現金残高</div>
            <div className="w-20 text-right px-px py-0.5 flex items-center justify-end font-bold">16,664,454</div>
          </div>
        </div>

        {/* 入金・出金エリア */}
        <div className="flex border-b border-[#323232] h-[500px]">
          {/* 入金 */}
          <div className="w-1/2 border-r border-[#323232]">
            <div className="bg-red-300 h-5 flex items-center justify-center border-b border-[#323232]">
              <span className="text-xs font-bold">入金</span>
            </div>
            <div className="overflow-y-auto h-[456px]">
              {depositData.map((item, idx) => (
                <div key={idx} className="flex text-xs border-b border-[#323232] h-5">
                  <div className="flex-1 px-1 py-0.5 border-r border-[#323232] flex items-center truncate">{`${item.category} ${item.name}`}</div>
                  <div className="w-16 flex-shrink-0 text-right px-1 py-0.5 flex items-end justify-end">{item.amount > 0 ? formatNumber(item.amount) : ''}</div>
                </div>
              ))}
            </div>
            <div className="flex text-xs bg-zinc-200 border-t border-[#323232] h-5">
              <div className="flex-1 px-1 font-bold flex items-center">入金計</div>
              <div className="w-16 flex-shrink-0 text-right px-1 py-0.5 flex items-end justify-end font-bold">402,455</div>
            </div>
          </div>

          {/* 出金 */}
          <div className="w-1/2">
            <div className="bg-blue-300 h-5 flex items-center justify-center border-b border-[#323232]">
              <span className="text-xs font-bold">出金</span>
            </div>
            <div className="overflow-y-auto h-[456px]">
              {withdrawalData.map((item, idx) => (
                <div key={idx} className="flex text-xs border-b border-[#323232] h-5">
                  <div className="flex-1 px-1 py-0.5 border-r border-[#323232] flex items-center truncate">{`${item.category} ${item.name}`}</div>
                  <div className="w-16 flex-shrink-0 text-right px-1 py-0.5 flex items-end justify-end">{item.amount > 0 ? formatNumber(item.amount) : ''}</div>
                </div>
              ))}
            </div>
            <div className="flex text-xs bg-zinc-200 border-t border-[#323232] h-5">
              <div className="flex-1 px-1 font-bold flex items-center">出金計</div>
              <div className="w-16 flex-shrink-0 text-right px-1 py-0.5 flex items-end justify-end font-bold">128,733</div>
            </div>
          </div>
        </div>

        {/* クレジットカード */}
          <div className="border-b border-[#323232]">
            <div className="bg-purple-300 h-5 flex items-center p-0.5 border-b border-[#323232]">
              <span className="text-xs font-bold">クレジットカード 店舗</span>
            </div>
            {/* ヘッダー */}
            <div className="flex text-xs bg-zinc-100 border-b border-[#323232] h-5">
              <div className="flex-1 px-px py-0.5 border-r border-[#323232] flex items-center justify-center">店舗</div>
              <div className="flex-1 px-px py-0.5 border-r border-[#323232] flex items-center justify-center">コース</div>
              <div className="flex-1 px-px py-0.5 border-r border-[#323232] flex items-center justify-center">ホステス名</div>
              <div className="flex-1 px-px py-0.5 border-r border-[#323232] flex items-center justify-center">請求金額</div>
              <div className="w-10 px-px py-0.5 flex items-center justify-center"></div>
            </div>
            {creditCardData.map((card, idx) => (
              <div key={idx} className="flex text-xs border-b border-[#323232] h-5 cursor-pointer hover:bg-purple-50">
                <div className="flex-1 px-px py-0.5 border-r border-[#323232] flex items-center truncate">{card.store}</div>
                <div className="flex-1 px-px py-0.5 border-r border-[#323232] flex items-center truncate">{card.course}</div>
                <div className="flex-1 px-px py-0.5 border-r border-[#323232] flex items-center truncate">{card.hostessName}</div>
                <div className="flex-1 px-px py-0.5 border-r border-[#323232] flex items-center justify-end">{formatNumber(card.billAmount)}</div>
                <div className="w-10 px-px py-0.5 flex items-center justify-center"></div>
              </div>
            ))}
            {/* 空の行を追加 */}
            {[...Array(5)].map((_, idx) => (
              <div key={`empty-${idx}`} className="flex text-xs border-b border-[#323232] h-5">
                <div className="flex-1 px-px py-0.5 border-r border-[#323232] flex items-center"></div>
                <div className="flex-1 px-px py-0.5 border-r border-[#323232] flex items-center"></div>
                <div className="flex-1 px-px py-0.5 border-r border-[#323232] flex items-center"></div>
                <div className="flex-1 px-px py-0.5 border-r border-[#323232] flex items-center"></div>
                <div className="w-10 px-px py-0.5 flex items-center"></div>
              </div>
            ))}
          </div>
        </div>

        {/* 右側セクション - 出勤スタッフ/出勤ホステス（タブ切り替え） */}
        <div className="h-full overflow-y-scroll flex flex-col scrollbar-visible" style={{ scrollbarWidth: 'thin', scrollbarColor: '#888 #e5e5e5' }}>
          {/* タブヘッダー */}
          <div className="flex border-t border-b border-[#323232]">
            <button
              onClick={() => setActiveTab('staff')}
              className={`flex-1 h-5 flex items-center justify-center text-xs font-bold border-r border-[#323232] ${
                activeTab === 'staff' ? 'bg-purple-400 text-white' : 'bg-purple-200 text-black'
              }`}
            >
              出勤スタッフ
            </button>
            <button
              onClick={() => setActiveTab('hostess')}
              className={`flex-1 h-5 flex items-center justify-center text-xs font-bold ${
                activeTab === 'hostess' ? 'bg-cyan-400 text-white' : 'bg-cyan-200 text-black'
              }`}
            >
              出勤ホステス
            </button>
          </div>

          {/* 出勤スタッフタブの内容 */}
          {activeTab === 'staff' && (
            <>
              {/* スタッフヘッダー - 画像に基づく列構成 */}
              <div className="flex text-xs bg-zinc-100 border-b border-[#323232] h-5">
                <div className="w-7 px-px py-0.5 border-r border-[#323232] flex items-center justify-center"></div>
                <div className="w-14 px-px py-0.5 border-r border-[#323232] flex items-center justify-center"></div>
                <div className="flex-[2] px-px py-0.5 border-r border-[#323232] flex items-center justify-center"></div>
                <div className="flex-1 px-px py-0.5 border-r border-[#323232] flex items-center justify-center text-[10px]">給与</div>
                <div className="flex-1 px-px py-0.5 border-r border-[#323232] flex items-center justify-center text-[10px]">回収額</div>
                <div className="flex-[1.3] px-px py-0.5 border-r border-[#323232] flex items-center justify-center text-[10px]">ホステス預</div>
                <div className="flex-[1.3] px-px py-0.5 border-r border-[#323232] flex items-center justify-center text-[10px]">ホステス返金</div>
                <div className="flex-1 px-px py-0.5 border-r border-[#323232] flex items-center justify-center text-[10px]">高速等</div>
                <div className="flex-1 px-px py-0.5 border-r border-[#323232] flex items-center justify-center text-[10px]">調整額</div>
                <div className="flex-1 px-px py-0.5 border-r border-[#323232] flex items-center justify-center text-[10px]">差引清算額</div>
                <div className="w-20 px-px py-0.5 border-r border-[#323232] flex items-center justify-center bg-cyan-100 text-[10px]">バスタオル</div>
                <div className="w-12 px-px py-0.5 border-r border-[#323232] flex items-center justify-center bg-green-100 text-[10px]">備品</div>
                <div className="w-14 px-px py-0.5 border-r border-[#323232] flex items-center justify-center text-[10px]">割引利用カード</div>
                <div className="w-16 px-px py-0.5 border-r border-[#323232] flex items-center justify-center text-[10px]">管理者確認</div>
                <div className="w-8 px-px py-0.5 flex items-center justify-center"></div>
              </div>
              {/* スタッフリスト */}
              <div className="overflow-y-auto flex-1">
                {staffData.map((staff) => {
                  // 行の背景色を決定
                  let rowBgClass = staff.type === '社員' ? 'bg-blue-50' : 'bg-pink-50';
                  if (staff.settlementStatus === 'completed') {
                    rowBgClass = 'bg-gray-200';
                  }

                  // 差引清算額の表示（マイナスは赤で▲表示）
                  const netDisplay = staff.net < 0
                    ? <span className="text-red-600">▲{Math.abs(staff.net).toLocaleString()}</span>
                    : formatNumber(staff.net);

                  return (
                    <div
                      key={staff.id}
                      className={`flex text-xs border-b border-[#323232] h-5 ${rowBgClass}`}
                    >
                      <div className="w-7 px-px py-0.5 border-r border-[#323232] flex items-center justify-center bg-yellow-100">{staff.id}</div>
                      <div className={`w-14 px-px py-0.5 border-r border-[#323232] flex items-center justify-center ${staff.type === '社員' ? 'bg-blue-200' : 'bg-pink-200'}`}>
                        {staff.type}
                      </div>
                      <div className="flex-[2] px-px py-0.5 border-r border-[#323232] flex items-center truncate">
                        {staff.name} {staff.status}{staff.statusNum ? ` ${staff.statusNum}` : ''}
                      </div>
                      <div className="flex-1 px-px py-0.5 border-r border-[#323232] flex items-center justify-end">{formatNumber(staff.salary)}</div>
                      <div className="flex-1 px-px py-0.5 border-r border-[#323232] flex items-center justify-end">{formatNumber(staff.collection)}</div>
                      <div className="flex-[1.3] px-px py-0.5 border-r border-[#323232] flex items-center justify-end">{formatNumber(staff.deposit)}</div>
                      <div className="flex-[1.3] px-px py-0.5 border-r border-[#323232] flex items-center justify-end">{formatNumber(staff.refund)}</div>
                      <div className="flex-1 px-px py-0.5 border-r border-[#323232] flex items-center justify-end">{formatNumber(staff.express)}</div>
                      <div className="flex-1 px-px py-0.5 border-r border-[#323232] flex items-center justify-end">{formatNumber(staff.adjust)}</div>
                      <div className="flex-1 px-px py-0.5 border-r border-[#323232] flex items-center justify-end">{netDisplay}</div>
                      {/* バスタオル 3列 */}
                      <div className="w-20 flex border-r border-[#323232] bg-cyan-50">
                        <div className="flex-1 px-px py-0.5 border-r border-[#323232] flex items-center justify-center">{staff.bath1 || ''}</div>
                        <div className="flex-1 px-px py-0.5 border-r border-[#323232] flex items-center justify-center">{staff.bath2 || ''}</div>
                        <div className="flex-1 px-px py-0.5 flex items-center justify-center">{staff.bath3 || ''}</div>
                      </div>
                      <div className="w-12 px-px py-0.5 border-r border-[#323232] flex items-center justify-center bg-green-50">{staff.equip || ''}</div>
                      <div className="w-14 px-px py-0.5 border-r border-[#323232] flex items-center justify-center">{staff.discountCard || ''}</div>
                      <div className="w-16 px-px py-0.5 border-r border-[#323232] flex items-center justify-center">{staff.managerCheck || ''}</div>
                      <div className="w-8 px-px py-0.5 flex items-center justify-center">
                        {staff.settlementStatus === 'completed' ? '済' : ''}
                      </div>
                    </div>
                  );
                })}
              </div>
            </>
          )}

          {/* 出勤ホステスタブの内容 */}
          {activeTab === 'hostess' && (
            <>
              {/* ホステスヘッダー */}
              <div className="flex text-xs bg-zinc-100 border-b border-[#323232] h-6">
                <div className="w-5 px-px py-0.5 border-r border-[#323232] flex items-center justify-center">番</div>
                <div className="w-16 px-px py-0.5 border-r border-[#323232] flex items-center justify-center">送り場所</div>
                <div className="w-14 px-px py-0.5 border-r border-[#323232] flex items-center justify-center">交通費</div>
                <div className="w-12 px-px py-0.5 border-r border-[#323232] flex items-center justify-center">雑費</div>
                <div className="w-14 px-px py-0.5 border-r border-[#323232] flex items-center justify-center">預り</div>
                <div className="w-16 px-px py-0.5 border-r border-[#323232] flex items-center justify-center">支払額</div>
                <div className="w-10 px-px py-0.5 border-r border-[#323232] flex items-center justify-center text-center leading-tight">支払<br/>済</div>
                <div className="flex-1 px-px py-0.5 border-r border-[#323232] flex items-center justify-center">回収額</div>
                <div className="flex-1 px-px py-0.5 border-r border-[#323232] flex items-center justify-center text-center leading-tight">ホステス<br/>報酬</div>
                <div className="flex-1 px-px py-0.5 border-r border-[#323232] flex items-center justify-center">調整</div>
                <div className="w-10 px-px py-0.5 flex items-center justify-center text-center leading-tight">確認</div>
              </div>
              {/* ホステスリスト */}
              <div className="overflow-y-auto flex-1">
                {hostessDisplayData.map((staff) => {
                  // 色分け: 未精算=赤, 未送信=白, 完了=灰
                  let rowBgClass = 'bg-white'; // 未送信（デフォルト）
                  if (staff.settlementStatus === 'unsettled') {
                    rowBgClass = 'bg-red-200'; // 未精算
                  } else if (staff.settlementStatus === 'completed') {
                    rowBgClass = 'bg-gray-300'; // 精算・送信完了
                  }

                  return (
                    <div
                      key={staff.id}
                      className={`flex text-xs border-b border-[#323232] h-5 ${rowBgClass} cursor-pointer hover:brightness-95`}
                    >
                      <div className="w-5 px-px py-0.5 border-r border-[#323232] flex items-center justify-center bg-blue-100">{staff.rowNum}</div>
                      <div className="w-16 px-px py-0.5 border-r border-[#323232] flex items-center truncate">{staff.sendLocation}</div>
                      <div className="w-14 px-px py-0.5 border-r border-[#323232] flex items-center justify-end">{formatNumber(staff.transportFee)}</div>
                      <div className="w-12 px-px py-0.5 border-r border-[#323232] flex items-center justify-end">{formatNumber(staff.miscFee)}</div>
                      <div className="w-14 px-px py-0.5 border-r border-[#323232] flex items-center justify-end">{formatNumber(staff.hostessDeposit)}</div>
                      <div className="w-16 px-px py-0.5 border-r border-[#323232] flex items-center justify-end">{formatNumber(staff.paymentAmount)}</div>
                      <div className="w-10 px-px py-0.5 border-r border-[#323232] flex items-center justify-center">
                        <input type="checkbox" className="w-3 h-3" checked={staff.isPaid} readOnly />
                      </div>
                      <div className="flex-1 px-px py-0.5 border-r border-[#323232] flex items-center justify-end">{formatNumber(staff.collection)}</div>
                      <div className="flex-1 px-px py-0.5 border-r border-[#323232] flex items-center justify-end">{formatNumber(staff.salary)}</div>
                      <div className="flex-1 px-px py-0.5 border-r border-[#323232] flex items-center justify-end">{formatNumber(staff.adjust)}</div>
                      <div className="w-10 px-px py-0.5 flex items-center justify-center">
                        <input type="checkbox" className="w-3 h-3" checked={staff.approval} readOnly />
                      </div>
                    </div>
                  );
                })}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
