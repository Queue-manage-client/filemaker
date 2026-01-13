'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

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
const staffData = [
  { id: 1, type: '社員', name: '吉田 琢雅10', status: '出勤', num: '', salary: 0, collection: 0, deposit: 0, refund: 0, express: 0, adjust: 0, net: 0, bath: [0,0,0], equip: [0,0,0], approval: false },
  { id: 2, type: '社員', name: '松平', status: '退社', num: 11, salary: 0, collection: 0, deposit: 0, refund: 0, express: 0, adjust: 0, net: 0, bath: [0,0,0], equip: [0,0,0], approval: false },
  { id: 3, type: '社員', name: '沙崎 哲也9', status: '出勤', num: '', salary: 38070, collection: 61930, deposit: 26960, refund: 0, express: 78040, adjust: 0, net: 7, bath: [0,3,0], equip: [7,5,6], approval: false },
  { id: 4, type: '社員', name: '南部', status: '退社', num: 11, salary: 10000, collection: 27000, deposit: 25970, refund: 0, express: 11030, adjust: 7, net: 0, bath: [0,3,0], equip: [7,5,6], approval: false },
  { id: 5, type: '社員', name: '南部 吉郎11', status: '退社', num: '', salary: 74700, collection: 121000, deposit: 97510, refund: 0, express: 110290, adjust: 5, net: 110290, bath: [0,2,3], equip: [5,5,5], approval: true },
  { id: 6, type: '社員', name: '森下 光哉1', status: '退社', num: '', salary: 68000, collection: 153000, deposit: 207630, refund: 0, express: 13370, adjust: 0, net: 2, bath: [3,2,3], equip: [5,5,5], approval: true },
  { id: 7, type: '社員', name: '耕平 中尾11', status: '出勤', num: '', salary: 0, collection: 1880, deposit: 0, refund: 0, express: 0, adjust: 0, net: 0, bath: [0,0,0], equip: [0,0,0], approval: false },
  { id: 8, type: '社員', name: '村上 竜5', status: '退社', num: '', salary: 99670, collection: 215330, deposit: 288450, refund: 0, express: 76550, adjust: 1, net: 1, bath: [1,8,0], equip: [5,5,5], approval: true },
  { id: 9, type: '社員', name: '山岡 義弘7', status: '退社', num: 9.5, salary: 0, collection: 0, deposit: 207630, refund: 0, express: 0, adjust: 0, net: 0, bath: [0,0,0], equip: [0,0,0], approval: false },
  { id: 10, type: '社員', name: '西川 陵登', status: '退社', num: '', salary: 0, collection: 0, deposit: 0, refund: 0, express: 0, adjust: 2, net: 5, bath: [0,0,0], equip: [0,0,0], approval: true },
  { id: 11, type: '社員', name: '片山 宏次', status: '退社', num: '', salary: 0, collection: 0, deposit: 0, refund: 0, express: 0, adjust: 0, net: 0, bath: [0,0,0], equip: [0,0,0], approval: false },
  { id: 12, type: '社員', name: '中村 南斗', status: '10.5', num: '', salary: 0, collection: 0, deposit: 0, refund: 0, express: 0, adjust: 0, net: 0, bath: [0,0,0], equip: [0,0,0], approval: false },
  { id: 13, type: '社員', name: '杉本 淳', status: '退社', num: 11, salary: 0, collection: 0, deposit: 0, refund: 0, express: 0, adjust: 0, net: 0, bath: [0,0,0], equip: [0,0,0], approval: false },
  { id: 14, type: '社員', name: '田淀 貫拓', status: '退社', num: 11, salary: 0, collection: 0, deposit: 0, refund: 0, express: 0, adjust: 0, net: 0, bath: [0,0,0], equip: [0,0,0], approval: false },
  { id: 15, type: 'アルバイト', name: '槙田 武', status: '', num: '', salary: 8, collection: 9360, deposit: 0, refund: 112, express: 9248, adjust: 0, net: 0, bath: [0,0,0], equip: [0,0,0], approval: false },
  { id: 16, type: 'アルバイト', name: '大宮 翔太', status: '', num: '', salary: 9, collection: 10809, deposit: 0, refund: 129, express: 10671, adjust: 0, net: 0, bath: [0,0,0], equip: [0,0,0], approval: false },
  { id: 17, type: 'アルバイト', name: '大谷 大輔', status: '退社', num: 5.5, salary: 6050, collection: 0, deposit: 0, refund: 74, express: 5978, adjust: 0, net: 0, bath: [0,0,0], equip: [0,0,0], approval: true },
  { id: 18, type: '社員', name: '事務所DCP', status: '退社', num: 24, salary: 0, collection: 0, deposit: 0, refund: 20, express: 0, adjust: 0, net: 20, bath: [0,0,0], equip: [0,0,0], approval: false },
  { id: 19, type: '社員', name: 'ホテヘル', status: '', num: '', salary: 200230, collection: 591770, deposit: 213440, refund: 0, express: 578560, adjust: 0, net: 0, bath: [0,30,34], equip: [0,0,0], approval: false },
  { id: 20, type: '社員', name: 'スタジオ(3F)', status: '出勤', num: '', salary: 0, collection: 0, deposit: 0, refund: 0, express: 0, adjust: 0, net: 0, bath: [0,0,0], equip: [0,0,0], approval: false },
  { id: 21, type: '社員', name: 'FGC', status: '出勤', num: '', salary: 0, collection: 0, deposit: 0, refund: 0, express: 0, adjust: 0, net: 0, bath: [0,0,0], equip: [0,0,0], approval: false },
  { id: 22, type: 'アルバイト', name: '松尾 久亮山', status: '退社', num: 14, salary: 18376, collection: 41820, deposit: 146180, refund: 142280, express: 220, adjust: 27564, net: 3, bath: [3,5,7], equip: [5,0,0], approval: true },
  { id: 23, type: 'アルバイト', name: '土居4', status: '', num: 16, salary: 21024, collection: 45790, deposit: 111210, refund: 106930, express: 790, adjust: 252, net: 28508, bath: [5,3,5], equip: [7,5,0], approval: true },
  { id: 24, type: 'アルバイト', name: '津村4 堀川', status: '出勤', num: '', salary: 64400, collection: 188600, deposit: 227280, refund: 1280, express: 0, adjust: 24440, net: 0, bath: [4,5,5], equip: [5,13,0], approval: false },
  { id: 25, type: 'アルバイト', name: '中薗 5 南泰', status: '退社', num: 7.5, salary: 9579, collection: 53180, deposit: 111820, refund: 166620, express: 114, adjust: 11085, net: 5, bath: [1,0,6], equip: [0,0,0], approval: false },
  { id: 26, type: 'アルバイト', name: '八塚 4吐田野', status: '出勤', num: '', salary: 58740, collection: 123260, deposit: 76340, refund: 0, express: 0, adjust: 105660, net: 5, bath: [1,5,7], equip: [5,0,0], approval: false },
  { id: 27, type: 'アルバイト', name: '伊坂 4 伏見', status: '退社', num: 7, salary: 8464, collection: 36260, deposit: 77740, refund: 70570, express: 101, adjust: 35067, net: 5, bath: [1,5,5], equip: [5,5,0], approval: true },
  { id: 28, type: 'アルバイト', name: '須賀 5 上寮', status: '出勤', num: '', salary: 34110, collection: 72890, deposit: 91460, refund: 0, express: 0, adjust: 15540, net: 5, bath: [4,2,3], equip: [5,5,0], approval: false },
  { id: 29, type: 'アルバイト', name: '水次郎 7 山科', status: '退社', num: 5.5, salary: 6568, collection: 40700, deposit: 76300, refund: 43410, express: 78, adjust: 67100, net: 1, bath: [0,0,1], equip: [0,0,0], approval: false },
];

// 出勤ホステスサンプルデータ
const hostessDisplayData = staffData.map((s, i) => ({
  ...s,
  rowNum: i + 1,
}));

export default function DailyReport() {
  const router = useRouter();
  const [currentDate] = useState(new Date());

  useEffect(() => {
    document.title = '日報 - Dispatch Harmony Hub';
  }, []);

  // 数値のフォーマット関数
  const formatNumber = (num: number | string) => {
    if (typeof num === 'string') return num;
    if (num === 0) return '';
    return num.toLocaleString();
  };

  return (
    <div className="w-[2000px] h-[1080px] relative bg-white font-['Inter'] flex flex-col text-sm">
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

            {/* 日付表示 */}
            <span className="text-sm font-medium mr-4">{currentDate.toLocaleDateString('ja-JP')}</span>

            {/* 日付移動 */}
            <Button
              variant="outline"
              className="h-8 px-3 text-xs border-[#323232]"
              onClick={() => {}}
            >
              日付移動
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
      <div className="flex-1 grid mt-2" style={{ gridTemplateColumns: '19% 20% 15% 20% 26%' }}>
        {/* 左側セクション - 売上リスト */}
        <div className="h-full overflow-y-auto border-r border-[#323232] bg-white">
        {salesListData.map((store) => (
          <div key={store.id} className="border-b border-[#323232]">
            {/* 店舗ヘッダー */}
            <div className="bg-cyan-200 h-5 flex items-center px-0.5 border-b border-[#323232]">
              <span className="text-xs font-bold text-black">{store.id} {store.label} 売上リスト</span>
              <span className="text-xs font-bold ml-0.5 text-black">{store.storeName}</span>
            </div>
            {/* 売上詳細 - 3列レイアウト */}
            <div className="text-xs bg-white">
              {/* 行1: 店売上現金計 / (空白) / 給料日計 */}
              <div className="flex h-5 border-b border-[#323232]">
                <div className="flex-1 p-0.5 flex items-center">店売上現金計</div>
                <div className="flex-1 text-right p-0.5 flex items-center justify-end">{formatNumber(store.storeCashSales)}</div>
                <div className="flex-1 p-0.5 flex items-center"></div>
                <div className="flex-1 p-0.5 flex items-center">給料日計</div>
                <div className="flex-1 text-right p-0.5 flex items-center justify-end">{formatNumber(store.payrollDaily)}</div>
              </div>
              {/* 行2: 店売上カード計 / 領収証発行 / 派遣回数日計 */}
              <div className="flex h-5 border-b border-[#323232]">
                <div className="flex-1 p-0.5 flex items-center">店売上カード計</div>
                <div className="flex-1 text-right p-0.5 flex items-center justify-end">{formatNumber(store.storeCardSales)} {store.storeCardCount > 0 ? `${store.storeCardCount}件` : ''}</div>
                <div className="flex-1 p-0.5 flex items-center">領収証発行</div>
                <div className="w-8 text-right p-0.5 flex items-center justify-end">{store.receiptCount}件</div>
                <div className="flex-1 p-0.5 flex items-center">派遣回数日計</div>
                <div className="w-8 text-right p-0.5 flex items-center justify-end">{formatNumber(store.dispatchDaily)}</div>
              </div>
              {/* 行3: 店売上計 / 割引チケット利用 / 指名回数日計 */}
              <div className="flex h-5 border-b border-[#323232]">
                <div className="flex-1 p-0.5 flex items-center">店売上計</div>
                <div className="flex-1 text-right p-0.5 flex items-center justify-end">{formatNumber(store.storeTotalSales)}</div>
                <div className="flex-1 p-0.5 flex items-center">割引チケット</div>
                <div className="w-8 text-right p-0.5 flex items-center justify-end">{store.discountTicketCount}件</div>
                <div className="flex-1 p-0.5 flex items-center">指名回数日計</div>
                <div className="w-8 text-right p-0.5 flex items-center justify-end">{formatNumber(store.nominationDaily)}</div>
              </div>
              {/* 行4: カード請求計 / 未回収売掛金額計 / HF指名回数日計 */}
              <div className="flex h-5 border-b border-[#323232]">
                <div className="flex-1 p-0.5 flex items-center">カード請求計</div>
                <div className="flex-1 text-right p-0.5 flex items-center justify-end">{formatNumber(store.cardBilling)}</div>
                <div className="flex-1 p-0.5 flex items-center">未回収売掛</div>
                <div className="w-8 text-right p-0.5 flex items-center justify-end">{formatNumber(store.uncollectedAmount)}</div>
                <div className="flex-1 p-0.5 flex items-center">HF指名日計</div>
                <div className="w-8 text-right p-0.5 flex items-center justify-end">{formatNumber(store.hfNominationDaily)}</div>
              </div>
              {/* 行5: カード加算金額計 / (空白) / (空白) */}
              <div className="flex h-5 border-b border-[#323232]">
                <div className="flex-1 p-0.5 flex items-center">カード加算金額計</div>
                <div className="flex-1 text-right p-0.5 flex items-center justify-end">{formatNumber(store.cardAddFee)}</div>
                <div className="flex-1 p-0.5 flex items-center"></div>
                <div className="flex-1 p-0.5 flex items-center"></div>
              </div>
              {/* 行6: その他売上計 / 入金計 / 出金計 */}
              <div className="flex h-5 border-b border-[#323232]">
                <div className="flex-1 p-0.5 flex items-center">その他売上計</div>
                <div className="flex-1 text-right p-0.5 flex items-center justify-end">{formatNumber(store.otherSales)}</div>
                <div className="flex-1 p-0.5 flex items-center">入金計</div>
                <div className="flex-1 text-right p-0.5 flex items-center justify-end">{formatNumber(store.deposit)}</div>
                <div className="flex-1 p-0.5 flex items-center">出金計</div>
                <div className="flex-1 text-right p-0.5 flex items-center justify-end">{formatNumber(store.withdrawal)}</div>
              </div>
              {/* 行7: 現金収入計 / 報告金額 / 旧現金収入計 */}
              <div className="flex h-5 border-b border-[#323232]">
                <div className="flex-1 p-0.5 flex items-center">現金収入計</div>
                <div className="flex-1 text-right p-0.5 flex items-center justify-end">{formatNumber(store.cashRevenue)}</div>
                <div className="flex-1 p-0.5 flex items-center font-bold">報告金額</div>
                <div className="flex-1 text-right p-0.5 flex items-center justify-end font-bold">{formatNumber(store.reportedAmount)}</div>
                <div className="flex-1 p-0.5 flex items-center">旧現金収入計</div>
                <div className="flex-1 text-right p-0.5 flex items-center justify-end">{formatNumber(store.oldCashRevenue)}</div>
              </div>
              {/* 行8: (空白) / (空白) / 旧報告金額 */}
              <div className="flex h-5 bg-cyan-50">
                <div className="flex-[2] p-0.5 flex items-center"></div>
                <div className="flex-1 p-0.5 flex items-center"></div>
                <div className="flex-1 p-0.5 flex items-center">旧報告金額</div>
                <div className="flex-1 text-right p-0.5 flex items-center justify-end">{formatNumber(store.oldReportedAmount)}</div>
              </div>
            </div>
          </div>
        ))}
        </div>

        {/* 中央左セクション - 集計結果 + 入出金 + クレジット */}
        <div className="h-full border-r border-[#323232] overflow-y-auto">
          {/* 集計結果 */}
        <div className="text-xs">
          <div className="flex h-5 border-b border-[#323232]">
            <div className="flex-1 p-0.5 bg-zinc-200 border-r border-[#323232] flex items-center">現金収入計</div>
            <div className="flex-1 text-right p-0.5 border-r border-[#323232] flex items-center justify-end font-bold">860,655</div>
            <div className="flex-1 p-0.5 bg-zinc-200 border-r border-[#323232] flex items-center">ドライバ回収額計</div>
            <div className="flex-1 text-right p-0.5 flex items-center justify-end font-bold">865,670</div>
          </div>
          <div className="flex h-5 border-b border-[#323232]">
            <div className="flex-1 p-0.5 bg-zinc-100 border-r border-[#323232] flex items-center">店舗売上計カード</div>
            <div className="flex-1 text-right p-0.5 border-r border-[#323232] flex items-center justify-end">49,280</div>
            <div className="flex-1 p-0.5 bg-zinc-100 border-r border-[#323232] flex items-center">ホステス支払計</div>
            <div className="flex-1 text-right p-0.5 flex items-center justify-end">1,724,940</div>
          </div>
          <div className="flex h-5 border-b border-[#323232]">
            <div className="flex-1 p-0.5 bg-zinc-100 border-r border-[#323232] flex items-center">売上計</div>
            <div className="flex-1 text-right p-0.5 border-r border-[#323232] flex items-center justify-end">909,600</div>
            <div className="flex-1 p-0.5 bg-zinc-100 border-r border-[#323232] flex items-center">入金計</div>
            <div className="flex-1 text-right p-0.5 flex items-center justify-end">402,455</div>
          </div>
          <div className="flex h-5 border-b border-[#323232]">
            <div className="flex-1 p-0.5 bg-zinc-100 border-r border-[#323232] flex items-center">店舗売上計現金</div>
            <div className="flex-1 text-right p-0.5 border-r border-[#323232] flex items-center justify-end">892,070</div>
            <div className="flex-1 p-0.5 bg-zinc-100 border-r border-[#323232] flex items-center">出金計</div>
            <div className="flex-1 text-right p-0.5 flex items-center justify-end">128,733</div>
          </div>
          <div className="flex h-5 border-b border-[#323232]">
            <div className="flex-1 p-0.5 bg-zinc-100 border-r border-[#323232] flex items-center"></div>
            <div className="flex-1 text-right p-0.5 border-r border-[#323232] flex items-center justify-end"></div>
            <div className="flex-1 p-0.5 bg-zinc-100 border-r border-[#323232] flex items-center">収支計</div>
            <div className="flex-1 text-right p-0.5 flex items-center justify-end">273,722</div>
          </div>
          <div className="flex h-5 border-b border-[#323232] bg-yellow-100">
            <div className="flex-1 p-0.5 border-r border-[#323232] flex items-center"></div>
            <div className="flex-1 text-right p-0.5 border-r border-[#323232] flex items-center justify-end"></div>
            <div className="flex-1 p-0.5 border-r border-[#323232] flex items-center font-bold">現金残高</div>
            <div className="flex-1 text-right p-0.5 flex items-center justify-end font-bold">16,664,454</div>
          </div>
        </div>

        {/* 入金・出金エリア */}
        <div className="flex border-b border-[#323232] h-[400px]">
          {/* 入金 */}
          <div className="w-1/2 border-r border-[#323232]">
            <div className="bg-red-300 h-5 flex items-center justify-center border-b border-[#323232]">
              <span className="text-xs font-bold">入金</span>
            </div>
            <div className="overflow-y-auto h-[356px]">
              {depositData.map((item, idx) => (
                <div key={idx} className="flex text-xs border-b border-[#323232] h-5">
                  <div className="flex-1 p-0.5 border-r border-[#323232] flex items-center truncate">{item.category}</div>
                  <div className="flex-1 p-0.5 border-r border-[#323232] flex items-center truncate">{item.name}</div>
                  <div className="flex-1 text-right p-0.5 flex items-center justify-end">{item.amount > 0 ? formatNumber(item.amount) : ''}</div>
                </div>
              ))}
            </div>
            <div className="flex text-xs bg-zinc-200 border-t border-[#323232] h-5">
              <div className="flex-1 p-0.5 font-bold flex items-center">入金計</div>
              <div className="flex-1 text-right p-0.5 font-bold flex items-center justify-end">402,455</div>
            </div>
          </div>

          {/* 出金 */}
          <div className="w-1/2">
            <div className="bg-blue-300 h-5 flex items-center justify-center border-b border-[#323232]">
              <span className="text-xs font-bold">出金</span>
            </div>
            <div className="overflow-y-auto h-[356px]">
              {withdrawalData.map((item, idx) => (
                <div key={idx} className="flex text-xs border-b border-[#323232] h-5">
                  <div className="flex-1 p-0.5 border-r border-[#323232] flex items-center truncate">{item.category}</div>
                  <div className="flex-1 p-0.5 border-r border-[#323232] flex items-center truncate">{item.name}</div>
                  <div className="flex-1 text-right p-0.5 flex items-center justify-end">{item.amount > 0 ? formatNumber(item.amount) : ''}</div>
                </div>
              ))}
            </div>
            <div className="flex text-xs bg-zinc-200 border-t border-[#323232] h-5">
              <div className="flex-1 p-0.5 font-bold flex items-center">出金計</div>
              <div className="flex-1 text-right p-0.5 font-bold flex items-center justify-end">128,733</div>
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
              <div className="flex-1 p-0.5 border-r border-[#323232] flex items-center justify-center">店舗</div>
              <div className="flex-1 p-0.5 border-r border-[#323232] flex items-center justify-center">コース</div>
              <div className="flex-1 p-0.5 border-r border-[#323232] flex items-center justify-center">ホステス名</div>
              <div className="flex-1 p-0.5 flex items-center justify-center">請求金額</div>
            </div>
            {creditCardData.map((card, idx) => (
              <div key={idx} className="flex text-xs border-b border-[#323232] h-5 cursor-pointer hover:bg-purple-50">
                <div className="flex-1 p-0.5 border-r border-[#323232] flex items-center truncate">{card.store}</div>
                <div className="flex-1 p-0.5 border-r border-[#323232] flex items-center truncate">{card.course}</div>
                <div className="flex-1 p-0.5 border-r border-[#323232] flex items-center truncate">{card.hostessName}</div>
                <div className="flex-1 p-0.5 flex items-center justify-end">{formatNumber(card.billAmount)}</div>
              </div>
            ))}
          </div>
        </div>

        {/* 中央右セクション - スタッフ */}
        <div className="h-full border-r border-[#323232] flex flex-col">
          <div className="bg-lime-200 h-5 flex items-center p-0.5 border-b border-[#323232]">
            <span className="text-xs font-bold">スタッフ</span>
          </div>
          {/* スタッフヘッダー */}
          <div className="flex text-xs bg-zinc-100 border-b border-[#323232] h-5">
            <div className="w-5 p-0.5 border-r border-[#323232] flex items-center justify-center"></div>
            <div className="flex-1 p-0.5 border-r border-[#323232] flex items-center justify-center">種別</div>
            <div className="flex-[2] p-0.5 border-r border-[#323232] flex items-center justify-center">名前</div>
            <div className="flex-1 p-0.5 border-r border-[#323232] flex items-center justify-center">状態</div>
            <div className="w-6 p-0.5 flex items-center justify-center">N</div>
          </div>
          {/* スタッフリスト */}
          <div className="overflow-y-auto flex-1">
            {staffData.map((staff) => (
              <div 
                key={staff.id} 
                className={`flex text-xs border-b border-[#323232] h-5 ${staff.type === '社員' ? 'bg-blue-50' : 'bg-orange-50'}`}
              >
                <div className="w-5 p-0.5 border-r border-[#323232] flex items-center justify-center bg-blue-100">{staff.id}</div>
                <div className={`flex-1 p-0.5 border-r border-[#323232] flex items-center justify-center ${staff.type === '社員' ? 'bg-blue-200' : 'bg-orange-200'}`}>
                  {staff.type}
                </div>
                <div className="flex-[2] p-0.5 border-r border-[#323232] flex items-center truncate">{staff.name}</div>
                <div className="flex-1 p-0.5 border-r border-[#323232] flex items-center justify-center">{staff.status}</div>
                <div className="w-6 p-0.5 flex items-center justify-end">{staff.num || ''}</div>
              </div>
            ))}
          </div>
        </div>

        {/* 出勤スタッフセクション */}
        <div className="h-full border-r border-[#323232] flex flex-col">
          <div className="bg-cyan-200 h-5 flex items-center p-0.5 border-b border-[#323232]">
            <span className="text-xs font-bold">出勤スタッフ</span>
          </div>
          {/* スタッフヘッダー */}
          <div className="flex text-xs bg-zinc-100 border-b border-[#323232] h-5">
            <div className="w-5 p-0.5 border-r border-[#323232] flex items-center justify-center">番</div>
            <div className="flex-1 p-0.5 border-r border-[#323232] flex items-center justify-center">回収額</div>
            <div className="flex-1 p-0.5 border-r border-[#323232] flex items-center justify-center">ホステス</div>
            <div className="flex-1 p-0.5 border-r border-[#323232] flex items-center justify-center">高速費</div>
            <div className="flex-1 p-0.5 flex items-center justify-center">調整額</div>
          </div>
          {/* スタッフリスト */}
          <div className="overflow-y-auto flex-1">
            {staffData.map((staff) => (
              <div 
                key={staff.id} 
                className={`flex text-xs border-b border-[#323232] h-5 ${staff.type === '社員' ? 'bg-blue-50' : 'bg-orange-50'}`}
              >
                <div className="w-5 p-0.5 border-r border-[#323232] flex items-center justify-center bg-blue-100">{staff.id}</div>
                <div className="flex-1 p-0.5 border-r border-[#323232] flex items-center justify-end">{formatNumber(staff.collection)}</div>
                <div className="flex-1 p-0.5 border-r border-[#323232] flex items-center justify-end">{formatNumber(staff.deposit)}</div>
                <div className="flex-1 p-0.5 border-r border-[#323232] flex items-center justify-end">{formatNumber(staff.express)}</div>
                <div className="flex-1 p-0.5 flex items-center justify-end">{formatNumber(staff.adjust)}</div>
              </div>
            ))}
          </div>
        </div>

        {/* 右側セクション - 出勤ホステス */}
        <div className="h-full overflow-hidden flex flex-col">
          <div className="bg-pink-200 h-5 flex items-center p-0.5 border-b border-[#323232]">
            <span className="text-xs font-bold">出勤ホステス</span>
          </div>
          {/* ホステスヘッダー */}
          <div className="flex text-xs bg-zinc-100 border-b border-[#323232] h-6">
            <div className="w-5 p-0.5 border-r border-[#323232] flex items-center justify-center">番</div>
            <div className="flex-1 p-0.5 border-r border-[#323232] flex items-center justify-center">回収額</div>
            <div className="flex-1 p-0.5 border-r border-[#323232] flex items-center justify-center text-center leading-tight">ホステス<br/>報酬</div>
            <div className="flex-1 p-0.5 border-r border-[#323232] flex items-center justify-center text-center leading-tight">ホステス<br/>送金</div>
            <div className="flex-1 p-0.5 border-r border-[#323232] flex items-center justify-center">遅刻</div>
            <div className="flex-1 p-0.5 border-r border-[#323232] flex items-center justify-center text-center leading-tight">消引減給<br/>管理費</div>
            <div className="flex-1 p-0.5 border-r border-[#323232] flex items-center justify-center">調整</div>
            <div className="flex-1 p-0.5 border-r border-[#323232] flex items-center justify-center">バスタオル</div>
            <div className="flex-1 p-0.5 border-r border-[#323232] flex items-center justify-center">備品</div>
            <div className="flex-1 p-0.5 border-r border-[#323232] flex items-center justify-center text-center leading-tight">割売取税<br/>カード</div>
            <div className="w-10 p-0.5 flex items-center justify-center text-center leading-tight">管理者<br/>確認</div>
          </div>
          {/* ホステスリスト */}
          <div className="overflow-y-auto flex-1">
            {hostessDisplayData.map((staff) => (
              <div 
                key={staff.id} 
                className={`flex text-xs border-b border-[#323232] h-5 ${staff.rowNum % 2 === 0 ? 'bg-zinc-50' : 'bg-white'}`}
              >
                <div className="w-5 p-0.5 border-r border-[#323232] flex items-center justify-center bg-blue-100">{staff.rowNum}</div>
                <div className="flex-1 p-0.5 border-r border-[#323232] flex items-center justify-end">{formatNumber(staff.salary)}</div>
                <div className="flex-1 p-0.5 border-r border-[#323232] flex items-center justify-end">{formatNumber(staff.collection)}</div>
                <div className="flex-1 p-0.5 border-r border-[#323232] flex items-center justify-end">{formatNumber(staff.deposit)}</div>
                <div className="flex-1 p-0.5 border-r border-[#323232] flex items-center justify-end">{formatNumber(staff.refund)}</div>
                <div className="flex-1 p-0.5 border-r border-[#323232] flex items-center justify-end">{formatNumber(staff.express)}</div>
                <div className="flex-1 p-0.5 border-r border-[#323232] flex items-center justify-end">{formatNumber(staff.adjust)}</div>
                {/* バスタオル (3つの小セル) */}
                <div className="flex-1 flex border-r border-[#323232]">
                  <div className="flex-1 flex items-center justify-center border-r border-[#323232] bg-blue-200">{staff.bath[0] || ''}</div>
                  <div className="flex-1 flex items-center justify-center border-r border-[#323232] bg-red-200">{staff.bath[1] || ''}</div>
                  <div className="flex-1 flex items-center justify-center">{staff.bath[2] || ''}</div>
                </div>
                {/* 備品 */}
                <div className="flex-1 flex border-r border-[#323232]">
                  <div className="flex-1 flex items-center justify-center border-r border-[#323232] bg-blue-200">{staff.equip[0] || ''}</div>
                  <div className="flex-1 flex items-center justify-center border-r border-[#323232] bg-red-200">{staff.equip[1] || ''}</div>
                  <div className="flex-1 flex items-center justify-center">{staff.equip[2] || ''}</div>
                </div>
                <div className="flex-1 p-0.5 border-r border-[#323232] flex items-center justify-end">{formatNumber(staff.net)}</div>
                <div className="w-10 p-0.5 flex items-center justify-center">
                  <input type="checkbox" className="w-3 h-3" checked={staff.approval} readOnly />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
