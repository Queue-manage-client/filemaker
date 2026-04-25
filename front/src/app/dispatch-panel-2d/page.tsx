'use client';

import React from 'react';
import Link from 'next/link';
import { Button } from "@/components/ui/button";
import { Pen, Package, ArrowLeft, Phone, AlertTriangle, X, Bell, BellOff, Clock, Settings2 } from 'lucide-react';
import {
  scheduledHostessSampleData,
  undecidedDriverReservationSampleData,
  hostessTransportSampleData,
  returningHostessSampleData,
  scheduleItemSampleData,
  driverDispatchPanelSampleData,
  staffScheduleSampleData,
  outDriverUndecidedSampleData,
  completedListSampleData,
  officeWaitingSampleData,
  shootingSampleData,
  memoItemSampleData,
  walkingDispatchSampleData,
} from '@/data/newRt2SampleData';
import {
  ScheduledHostess,
  UndecidedDriverReservation,
  HostessTransport,
  ReturningHostess,
  ScheduleItem,
  DriverDispatchPanel,
  StaffSchedule,
  OutDriverUndecided,
  CompletedList,
  Shooting,
  MemoItem,
  WalkingDispatch,
} from '@/types/new-rt2';

// 待機キャスト全データ（サンプル） - 閾値で動的フィルタ
const allWaitingHostesses = [
  { name: 'かんな', store: '南IC事務所', waitingSince: '17:30', waitingMinutes: 150 },
  { name: 'スイレン', store: '南IC事務所', waitingSince: '18:00', waitingMinutes: 120 },
  { name: 'まりあ', store: '南IC事務所', waitingSince: '19:00', waitingMinutes: 90 },
  { name: 'ゆき', store: '南IC事務所', waitingSince: '19:30', waitingMinutes: 60 },
];

// 送りドライバー未着（サンプル）- status追加で除外条件対応
// status: 'waiting'=事務所待機, 'serving'=接客中, 'shooting'=撮影中, 'returning'=帰宅中
const allOverdueTransports = [
  { hostessName: 'ミイ', scheduledTime: '21:00', destination: '河原町三条', minutesOverdue: 8, status: 'waiting' as const },
  { hostessName: 'あず', scheduledTime: '21:15', destination: '四条大宮', minutesOverdue: 5, status: 'waiting' as const },
  { hostessName: 'りさ', scheduledTime: '20:45', destination: '烏丸御池', minutesOverdue: 12, status: 'serving' as const },
  { hostessName: 'ゆな', scheduledTime: '21:00', destination: '西院', minutesOverdue: 7, status: 'shooting' as const },
];

// 待機ドライバーの待機経過時間を計算（分単位）- サンプル表示用に上限設定
function calcWaitingMinutes(since: string): number {
  const now = new Date();
  const [h, m] = since.split(':').map(Number);
  const sinceDate = new Date(now.getFullYear(), now.getMonth(), now.getDate(), h, m, 0);
  // 未来の時刻なら当日まだ来ていないとみなし0分
  if (sinceDate > now) {
    return 0;
  }
  const diff = Math.floor((now.getTime() - sinceDate.getTime()) / 60000);
  // 12時間（720分）以上ならサンプルデータの日付ずれとみなし表示上限
  return Math.min(diff, 720);
}

// モバイル用コンポーネント
function MobileScheduledHostessList() {
  return (
    <div className="bg-white">
      <div className="sticky top-0 z-10 bg-cyan-200 border-b border-zinc-400 px-3 py-2">
        <span className="font-bold text-[14px]">出勤予定ホステス</span>
      </div>
      {scheduledHostessSampleData.map((hostess: ScheduledHostess) => (
        <div key={hostess.id} className="border-b border-zinc-300 p-3">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <div className="w-2 h-6 bg-rose-300/60 rounded" />
              <div className="bg-yellow-200 px-2 py-1 rounded">
                <span className="text-black text-[14px] font-medium">{hostess.area} {hostess.hostessName}</span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {hostess.isConfirmed && <span className="bg-green-300 px-2 py-0.5 rounded text-[12px]">確認済</span>}
              <div className="bg-zinc-400 px-2 py-1 rounded">
                <span className="text-white text-[14px] font-bold">{hostess.count}</span>
              </div>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-2 text-[13px]">
            <div><span className="text-zinc-500">迎えドラ:</span> <span className="text-black">{hostess.driverName}</span></div>
            <div><span className="text-zinc-500">出勤:</span> <span className="text-lime-600 font-medium">{hostess.arrivalTime}</span></div>
            <div><span className="text-zinc-500">地域:</span> <span className="text-black">{hostess.location}</span></div>
            <div><span className="text-zinc-500">終了:</span> <span className="text-black">{hostess.startTime}</span></div>
            <div><span className="text-zinc-500">帰宅:</span> <span className="text-black">{hostess.endTime}</span></div>
          </div>
        </div>
      ))}
    </div>
  );
}

function MobileDriverList() {
  return (
    <div className="bg-white">
      {/* INドラ未定予約 */}
      <div className="sticky top-0 z-10 bg-lime-200 border-b border-zinc-400 px-3 py-2">
        <span className="font-bold text-[14px]">INドラ未定予約リスト</span>
      </div>
      {undecidedDriverReservationSampleData.slice(0, 10).map((reservation: UndecidedDriverReservation) => (
        <div key={reservation.id} className="border-b border-zinc-300 p-3">
          <div className="flex items-center justify-between mb-1">
            <span className="bg-purple-300 px-2 py-0.5 rounded text-[14px] font-medium">{reservation.departureTime}</span>
            <span className="bg-yellow-200 px-2 py-0.5 rounded text-[14px]">{reservation.area} {reservation.hostessName}</span>
          </div>
          <div className="text-[13px] text-zinc-600">
            迎え: {reservation.pickupLocation} / 時間計: {reservation.timeTotal}分
          </div>
        </div>
      ))}

      {/* OUTドラ未定・接客中 */}
      <div className="sticky top-0 z-10 bg-lime-200 border-b border-zinc-400 px-3 py-2 mt-4">
        <span className="font-bold text-[14px]">OUTドラ未定・接客中リスト</span>
      </div>
      {outDriverUndecidedSampleData.slice(0, 10).map((item: OutDriverUndecided) => (
        <div key={item.id} className="border-b border-zinc-300 p-3">
          <div className="flex items-center justify-between mb-1">
            <span className="bg-yellow-200 px-2 py-0.5 rounded text-[14px]">{item.hostessName}</span>
            <span className="text-[13px]">{item.pickupTime} - {item.arrivalTime}</span>
          </div>
          <div className="text-[13px] text-zinc-600">{item.destination}</div>
        </div>
      ))}

      {/* 待機ドライバー */}
      <div className="sticky top-0 z-10 bg-yellow-200 border-b border-zinc-400 px-3 py-2 mt-4">
        <span className="font-bold text-[14px]">南IC待機ドライバー</span>
      </div>
      {[
        { name: '吉田', since: '18:30' },
        { name: '松尾', since: '19:15' },
        { name: '山岡', since: '19:45' },
        { name: '川口', since: '20:00' },
      ].map((driver) => {
        const waitingMins = calcWaitingMinutes(driver.since);
        return (
          <div key={driver.name} className="border-b border-zinc-300 p-3 flex justify-between items-center">
            <span className="text-[14px]">{driver.name}</span>
            <div className="flex items-center gap-3">
              <span className="text-blue-600 text-[13px]">{driver.since}</span>
              <span className={`font-bold text-[13px] ${waitingMins >= 60 ? 'text-red-600' : 'text-orange-600'}`}>{waitingMins}分</span>
            </div>
          </div>
        );
      })}
    </div>
  );
}

function MobileTransportList() {
  return (
    <div className="bg-white">
      {/* ホステス送り・帰宅 */}
      <div className="sticky top-0 z-10 bg-yellow-200 border-b border-zinc-400 px-3 py-2">
        <span className="font-bold text-[14px]">ホステス送り・帰宅</span>
      </div>
      {hostessTransportSampleData.map((item: HostessTransport) => (
        <div key={item.id} className="border-b border-zinc-300 p-3">
          <div className="flex items-center justify-between mb-1">
            <div className="flex items-center gap-2">
              {item.luggageDetails && <Package className="w-4 h-4 text-orange-500" />}
              <span className="text-[14px] font-medium">{item.hostessName}</span>
            </div>
            <span className="text-[13px]">{item.count}件</span>
          </div>
          <div className="grid grid-cols-2 gap-2 text-[13px]">
            <div><span className="text-zinc-500">終了:</span> <span>{item.departureTime}</span></div>
            <div><span className="text-zinc-500">帰宅:</span> <span className="text-pink-500">{item.returnTime}</span></div>
            <div className="col-span-2"><span className="text-zinc-500">送り場所:</span> <span>{item.destination}</span></div>
          </div>
        </div>
      ))}

      {/* 帰宅ホステス */}
      <div className="sticky top-0 z-10 bg-cyan-100 border-b border-zinc-400 px-3 py-2 mt-4">
        <span className="font-bold text-[14px]">帰宅ホステス / 自宅or寮待機</span>
      </div>
      {returningHostessSampleData.map((item: ReturningHostess) => (
        <div key={item.id} className="border-b border-zinc-300 p-3">
          <span className="text-[14px]">{item.hostessName} - {item.returnTime} - {item.location}</span>
        </div>
      ))}
    </div>
  );
}

function MobileScheduleList() {
  return (
    <div className="bg-white">
      {/* スタッフ予定 */}
      <div className="sticky top-0 z-10 bg-lime-200 border-b border-zinc-400 px-3 py-2">
        <span className="font-bold text-[14px]">スタッフ予定リスト</span>
      </div>
      {staffScheduleSampleData.map((schedule: StaffSchedule) => (
        <div key={schedule.id} className={`border-b border-zinc-300 p-3 ${schedule.isHighlighted ? 'bg-lime-100' : ''}`}>
          <span className="text-[14px]">{schedule.driverName}→{schedule.destination} {schedule.note}</span>
        </div>
      ))}

      {/* メモ・引継事項 */}
      <div className="sticky top-0 z-10 bg-fuchsia-300 border-b border-zinc-400 px-3 py-2 mt-4">
        <span className="font-bold text-[14px]">メモ・引継事項</span>
      </div>
      {memoItemSampleData.map((memo: MemoItem) => (
        <div key={memo.id} className="border-b border-zinc-300 p-3">
          <p className="text-[14px] whitespace-pre-wrap">{memo.content}</p>
        </div>
      ))}

      {/* 予定 */}
      <div className="sticky top-0 z-10 bg-purple-300 border-b border-zinc-400 px-3 py-2 mt-4">
        <span className="font-bold text-[14px]">予定(打ち合わせ・撮影など)</span>
      </div>
      {scheduleItemSampleData.map((item: ScheduleItem) => (
        <div key={item.id} className="border-b border-zinc-300 p-3">
          <div className="text-[14px] font-medium">{item.title}</div>
          <div className="text-[13px] text-zinc-600">{item.description}</div>
        </div>
      ))}

      {/* 面接予定 */}
      <div className="sticky top-0 z-10 bg-rose-300/60 border-b border-zinc-400 px-3 py-2 mt-4">
        <span className="font-bold text-[14px]">面接予定</span>
      </div>
      {driverDispatchPanelSampleData.map((item: DriverDispatchPanel) => (
        <div key={item.id} className="border-b border-zinc-300 p-3">
          <div className="flex items-center gap-2 mb-1">
            {item.type === 'entry' && <span className="bg-purple-300 px-2 py-0.5 rounded text-[12px]">入店</span>}
            <span className="text-[14px]">{item.time}</span>
            {item.status === 'completed' && <span className="bg-green-300 px-2 py-0.5 rounded text-[12px]">済</span>}
          </div>
          <div className="text-[13px]">{item.location}</div>
          {(item.hostessName1 || item.hostessName2) && (
            <div className="flex gap-2 mt-1">
              {item.hostessName1 && <span className="bg-yellow-200 px-2 py-0.5 rounded text-[12px]">{item.hostessName1}</span>}
              {item.hostessName2 && <span className="bg-yellow-200 px-2 py-0.5 rounded text-[12px]">{item.hostessName2}</span>}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

const DESIGN_WIDTH = 1970;
const DESIGN_HEIGHT = 1080;

export default function Original() {
  const [isMobileView, setIsMobileView] = React.useState(false);
  const [contentScale, setContentScale] = React.useState(1);
  const [mobileTab, setMobileTab] = React.useState<'hostess' | 'driver' | 'transport' | 'schedule'>('hostess');
  const [showWaitingAlert, setShowWaitingAlert] = React.useState(true);
  const [dismissedAlerts, setDismissedAlerts] = React.useState<string[]>([]);
  const [showOverdueAlert, setShowOverdueAlert] = React.useState(true);
  const [dismissedOverdue, setDismissedOverdue] = React.useState<string[]>([]);
  const [showLuggageConfirm, setShowLuggageConfirm] = React.useState<string | null>(null);
  // 待機アラート オン/オフ & 閾値設定
  const [waitingAlertEnabled, setWaitingAlertEnabled] = React.useState(true);
  const [waitingThresholdMinutes, setWaitingThresholdMinutes] = React.useState(120);
  const [showWaitingSettings, setShowWaitingSettings] = React.useState(false);

  // 閾値でフィルタした待機超過キャスト
  const longWaitingHostesses = React.useMemo(
    () => allWaitingHostesses.filter(h => h.waitingMinutes >= waitingThresholdMinutes),
    [waitingThresholdMinutes]
  );

  // 除外条件適用済みの送りドライバー未着（事務所待機のみ表示）
  const overdueTransports = React.useMemo(
    () => allOverdueTransports.filter(t => t.status === 'waiting'),
    []
  );

  React.useEffect(() => {
    document.title = '配車パネル2D - Dispatch Harmony Hub';

    const checkMobile = () => {
      const w = window.innerWidth;
      setIsMobileView(w < 1024);
      if (w >= 1024) {
        setContentScale(w / DESIGN_WIDTH);
      }
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // モバイル表示
  if (isMobileView) {
    return (
      <div className="flex flex-col h-screen w-full bg-zinc-100">
        {/* モバイルヘッダー */}
        <div className="h-[48px] flex items-center justify-between px-3 flex-shrink-0 bg-white border-b border-zinc-300">
          <Link href="/dashboard">
            <Button variant="outline" className="h-8 px-2 text-[12px]">
              <ArrowLeft className="w-4 h-4" />
            </Button>
          </Link>
          <h1 className="text-[16px] font-bold">配車パネル2D</h1>
          <Button variant="outline" className="h-8 px-2 text-[12px]">
            Menu
          </Button>
        </div>

        {/* タブ切り替え */}
        <div className="flex border-b border-zinc-300 bg-white flex-shrink-0">
          <button
            onClick={() => setMobileTab('hostess')}
            className={`flex-1 py-3 text-[13px] font-medium transition-colors ${
              mobileTab === 'hostess' ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50' : 'text-zinc-600'
            }`}
          >
            ホステス
          </button>
          <button
            onClick={() => setMobileTab('driver')}
            className={`flex-1 py-3 text-[13px] font-medium transition-colors ${
              mobileTab === 'driver' ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50' : 'text-zinc-600'
            }`}
          >
            ドライバー
          </button>
          <button
            onClick={() => setMobileTab('transport')}
            className={`flex-1 py-3 text-[13px] font-medium transition-colors ${
              mobileTab === 'transport' ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50' : 'text-zinc-600'
            }`}
          >
            送り
          </button>
          <button
            onClick={() => setMobileTab('schedule')}
            className={`flex-1 py-3 text-[13px] font-medium transition-colors ${
              mobileTab === 'schedule' ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50' : 'text-zinc-600'
            }`}
          >
            予定
          </button>
        </div>

        {/* コンテンツエリア */}
        <div className="flex-1 overflow-y-auto">
          {mobileTab === 'hostess' && <MobileScheduledHostessList />}
          {mobileTab === 'driver' && <MobileDriverList />}
          {mobileTab === 'transport' && <MobileTransportList />}
          {mobileTab === 'schedule' && <MobileScheduleList />}
        </div>

        {/* アラート */}
        {waitingAlertEnabled && showWaitingAlert && longWaitingHostesses.filter(h => !dismissedAlerts.includes(h.name)).length > 0 && (
          <div className="fixed bottom-4 right-4 z-50 w-[280px] bg-red-50 border-2 border-red-400 rounded-lg shadow-xl">
            <div className="bg-red-500 text-white px-3 py-1.5 flex items-center justify-between rounded-t-lg">
              <div className="flex items-center gap-1.5">
                <AlertTriangle className="w-4 h-4" />
                <span className="text-sm font-bold">待機{waitingThresholdMinutes}分超過</span>
              </div>
              <button type="button" onClick={() => setShowWaitingAlert(false)} className="hover:bg-red-600 rounded p-0.5">
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="p-2 space-y-1">
              {longWaitingHostesses.filter(h => !dismissedAlerts.includes(h.name)).map((hostess) => (
                <div key={hostess.name} className="flex items-center justify-between bg-white rounded px-2 py-1.5 border border-red-200">
                  <div>
                    <div className="text-sm font-bold text-red-800">{hostess.name}</div>
                    <div className="text-xs text-gray-600">{hostess.store}</div>
                  </div>
                  <button
                    type="button"
                    onClick={() => setDismissedAlerts(prev => [...prev, hostess.name])}
                    className="text-xs px-2 py-1 bg-gray-100 rounded"
                  >
                    確認
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  }

  // デスクトップ表示（元のコード）
  return (
    <div
      className="w-full overflow-hidden bg-zinc-50"
      style={{ height: `${Math.ceil(DESIGN_HEIGHT * contentScale)}px` }}
    >
    <div
      className="relative"
      style={{ width: `${DESIGN_WIDTH}px`, height: `${DESIGN_HEIGHT}px`, zoom: contentScale } as React.CSSProperties}
    >
      {/* 待機超過キャスト アラート - 右下 */}
      {waitingAlertEnabled && showWaitingAlert && longWaitingHostesses.filter(h => !dismissedAlerts.includes(h.name)).length > 0 && (
        <div className="fixed bottom-4 right-4 z-50 w-[300px] bg-red-50 border-2 border-red-400 rounded-lg shadow-2xl overflow-hidden">
          <div className="bg-red-500 text-white px-3 py-1.5 flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <AlertTriangle className="w-4 h-4" />
              <span className="text-sm font-bold">待機{waitingThresholdMinutes}分超過</span>
            </div>
            <button type="button" onClick={() => setShowWaitingAlert(false)} className="hover:bg-red-600 rounded p-0.5">
              <X className="w-4 h-4" />
            </button>
          </div>
          <div className="p-2 space-y-1">
            {longWaitingHostesses.filter(h => !dismissedAlerts.includes(h.name)).map((hostess) => (
              <div key={hostess.name} className="flex items-center justify-between bg-white rounded px-2 py-1.5 border border-red-200">
                <div>
                  <div className="text-sm font-bold text-red-800">{hostess.name}</div>
                  <div className="text-xs text-gray-600">{hostess.store} / {hostess.waitingSince}〜 ({hostess.waitingMinutes}分)</div>
                </div>
                <button
                  type="button"
                  onClick={() => setDismissedAlerts(prev => [...prev, hostess.name])}
                  className="text-xs px-2 py-1 bg-green-100 hover:bg-green-200 rounded text-green-700 font-medium border border-green-300"
                >
                  確認
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 送り5分超過 ドライバー未着アラート - 右上 */}
      {showOverdueAlert && overdueTransports.filter(t => !dismissedOverdue.includes(t.hostessName)).length > 0 && (
        <div className="fixed top-14 right-4 z-50 w-[300px] bg-orange-50 border-2 border-orange-400 rounded-lg shadow-2xl overflow-hidden">
          <div className="bg-orange-500 text-white px-3 py-1.5 flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <AlertTriangle className="w-4 h-4" />
              <span className="text-sm font-bold">送りドライバー未着</span>
              <span className="text-xs font-normal ml-1 opacity-80">({overdueTransports.length}/{allOverdueTransports.length}件)</span>
            </div>
            <button type="button" onClick={() => setShowOverdueAlert(false)} className="hover:bg-orange-600 rounded p-0.5">
              <X className="w-4 h-4" />
            </button>
          </div>
          {allOverdueTransports.filter(t => t.status !== 'waiting').length > 0 && (
            <div className="px-3 py-1 bg-orange-100 text-xs text-orange-700">
              接客中・撮影中 {allOverdueTransports.filter(t => t.status !== 'waiting').length}名は除外
            </div>
          )}
          <div className="p-2 space-y-1">
            {overdueTransports.filter(t => !dismissedOverdue.includes(t.hostessName)).map((transport) => (
              <div key={transport.hostessName} className="flex items-center justify-between bg-white rounded px-2 py-1.5 border border-orange-200">
                <div>
                  <div className="text-sm font-bold text-orange-800">{transport.hostessName}</div>
                  <div className="text-xs text-gray-600">
                    {transport.destination} / 予定{transport.scheduledTime}
                    <span className="text-red-600 font-bold ml-1">+{transport.minutesOverdue}分超過</span>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setDismissedOverdue(prev => [...prev, transport.hostessName])}
                  className="text-xs px-2 py-1 bg-green-100 hover:bg-green-200 rounded text-green-700 font-medium border border-green-300"
                >
                  確認
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 荷物確認ポップアップ（二段階確認） */}
      {showLuggageConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white rounded-xl shadow-2xl border-2 border-orange-400 p-6 w-[340px] max-w-[90vw]">
            <div className="flex items-center gap-2 mb-3">
              <Package className="w-6 h-6 text-orange-500" />
              <span className="text-base font-bold text-orange-700">荷物の確認</span>
            </div>
            <div className="mb-5 text-sm text-gray-800 leading-relaxed">
              ⚠ <span className="font-bold">{showLuggageConfirm}</span> さんは預り荷物があります。<br />
              渡し忘れはありませんか？
            </div>
            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => setShowLuggageConfirm(null)}
                className="flex-1 py-2 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm font-medium transition-colors"
              >
                キャンセル
              </button>
              <button
                type="button"
                onClick={() => setShowLuggageConfirm(null)}
                className="flex-1 py-2 rounded-lg bg-orange-500 hover:bg-orange-600 text-white text-sm font-bold transition-colors"
              >
                確認済み
              </button>
            </div>
          </div>
        </div>
      )}

      <div
        className="w-[1989px] h-[1080px] relative"
      >
      {/* ヘッダー（固定） */}
      <div className="sticky left-0 top-0 w-full z-20 h-[50px] bg-white border-b border-zinc-300">
        <div className="flex items-center h-full px-2">
          {/* ダッシュボードに戻る - 左端 */}
          <Link href="/dashboard">
            <Button
              variant="outline"
              className="h-8 px-3 text-[14px] flex items-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              ダッシュボードに戻る
            </Button>
          </Link>

          {/* 中央配置のボタン群 */}
          <div className="flex-1 flex items-center justify-center gap-2">
            {/* 配車パネル2Dタイトル */}
            <h1 className="text-[19px] font-bold mr-2">配車パネル2D</h1>

            {/* 日付移動 */}
            <Button
              variant="outline"
              className="h-8 px-3 text-[14px] border-black"
              onClick={() => {}}
            >
              日付移動
            </Button>

            {/* ドライバ精算 */}
            <Button
              className="h-8 px-4 text-[14px] bg-lime-400 hover:bg-lime-500 text-black border border-black"
              onClick={() => {}}
            >
              ドライバ精算
            </Button>

            {/* 新顧客検索 */}
            <Button
              variant="outline"
              className="h-8 px-4 text-[14px] border-black"
              onClick={() => {}}
            >
              新顧客検索
            </Button>

            {/* RT IIパネル */}
            <Button
              className="h-8 px-4 text-[14px] bg-purple-400 hover:bg-purple-500 text-black border border-black"
              onClick={() => {}}
            >
              RT IIパネル
            </Button>

            {/* RTパネル */}
            <Button
              className="h-8 px-4 text-[14px] bg-orange-400 hover:bg-orange-500 text-black border border-black"
              onClick={() => {}}
            >
              RTパネル
            </Button>

            {/* 手配表 */}
            <Button
              variant="outline"
              className="h-8 px-4 text-[14px] border-black"
              onClick={() => {}}
            >
              手配表
            </Button>

            {/* Menu */}
            <Button
              variant="outline"
              className="h-8 px-4 text-[14px] border-black"
              onClick={() => {}}
            >
              Menu
            </Button>

            {/* チャット表示 */}
            <Button
              className="h-8 px-4 text-[14px] bg-cyan-300 hover:bg-cyan-400 text-black border border-black"
              onClick={() => {}}
            >
              チャット表示
            </Button>

            {/* 待機アラート オン/オフ + 設定 */}
            <div className="relative flex items-center gap-1 ml-1">
              <Button
                className={`h-8 px-3 text-[13px] border border-black flex items-center gap-1.5 ${
                  waitingAlertEnabled
                    ? 'bg-red-400 hover:bg-red-500 text-white'
                    : 'bg-gray-200 hover:bg-gray-300 text-gray-600'
                }`}
                onClick={() => setWaitingAlertEnabled(prev => !prev)}
              >
                {waitingAlertEnabled ? <Bell className="w-3.5 h-3.5" /> : <BellOff className="w-3.5 h-3.5" />}
                待機超過
              </Button>
              <Button
                variant="outline"
                className="h-8 w-8 px-0 border-black"
                onClick={() => setShowWaitingSettings(prev => !prev)}
              >
                <Settings2 className="w-3.5 h-3.5" />
              </Button>
              {showWaitingSettings && (
                <div className="absolute top-full right-0 mt-1 z-50 bg-white border border-zinc-300 rounded-lg shadow-xl p-3 w-[220px]">
                  <div className="text-sm font-bold mb-2 flex items-center gap-1.5">
                    <Clock className="w-4 h-4" />
                    待機超過アラート設定
                  </div>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-sm text-gray-600 whitespace-nowrap">閾値:</span>
                    <input
                      type="number"
                      min={30}
                      max={480}
                      step={30}
                      value={waitingThresholdMinutes}
                      onChange={(e) => setWaitingThresholdMinutes(Number(e.target.value) || 120)}
                      className="w-20 border rounded px-2 py-1 text-sm text-center"
                    />
                    <span className="text-sm text-gray-600">分</span>
                  </div>
                  <div className="flex gap-1 flex-wrap">
                    {[60, 90, 120, 180].map(m => (
                      <button
                        key={m}
                        type="button"
                        onClick={() => setWaitingThresholdMinutes(m)}
                        className={`px-2 py-1 text-xs rounded border ${
                          waitingThresholdMinutes === m ? 'bg-red-100 border-red-400 text-red-700 font-bold' : 'bg-gray-50 border-gray-300 text-gray-600'
                        }`}
                      >
                        {m}分
                      </button>
                    ))}
                  </div>
                  <div className="mt-2 text-xs text-gray-500">
                    現在 {longWaitingHostesses.length}名が超過中
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

    {/* スタッフ予定リスト */}
    <div className="w-[357px] h-5 left-[4px] top-[708px] absolute bg-lime-200 flex items-center justify-center">
      <span className="text-black text-[14px] font-normal font-['Inter']">スタッフ予定リスト</span>
    </div>
    <div className="w-[357px] h-[340px] left-[4px] top-[728px] absolute outline outline-1 outline-offset-[-1px] outline-zinc-300 overflow-x-hidden overflow-y-auto">
      {staffScheduleSampleData.map((schedule: StaffSchedule, _index: number) => (
        <div
          key={schedule.id}
          className={`w-full h-8 flex items-center px-1 overflow-hidden text-black text-[12px] font-normal font-['Inter'] ${schedule.isHighlighted ? 'bg-lime-200' : 'bg-white'}`}
        >
          <div className="overflow-hidden whitespace-nowrap w-full">
            {schedule.driverName}→{schedule.destination} {schedule.note}
          </div>
        </div>
      ))}
    </div>

  {/* INドラ未定予約リスト - 縦書きラベル: 列ヘッダー行(top-95-108)を侵食しないよう底辺をtop-95に揃える */}
  <div className="w-4 left-[707px] top-[55px] absolute text-center text-black text-[8px] leading-none font-normal font-['Inter']" style={{ writingMode: 'vertical-rl' }}>オプション</div>
  <div className="w-4 left-[691px] top-[71px] absolute text-center text-black text-[8px] leading-none font-normal font-['Inter']" style={{ writingMode: 'vertical-rl' }}>カード</div>
  <div className="w-4 left-[675px] top-[63px] absolute text-center text-black text-[8px] leading-none font-normal font-['Inter']" style={{ writingMode: 'vertical-rl' }}>着TEL</div>
  <div className="w-4 left-[659px] top-[71px] absolute text-center text-black text-[8px] leading-none font-normal font-['Inter']" style={{ writingMode: 'vertical-rl' }}>待合せ</div>
  <div className="w-4 left-[643px] top-[71px] absolute text-center text-black text-[8px] leading-none font-normal font-['Inter']" style={{ writingMode: 'vertical-rl' }}>領収書</div>
  <div className="left-[605px] top-[95px] absolute text-center text-black text-[10px] font-normal font-['Inter'] whitespace-nowrap">時間計</div>
  <div className="left-[441px] top-[95px] absolute text-center text-black text-[10px] font-normal font-['Inter'] whitespace-nowrap">迎え場所</div>
  <div className="left-[365px] top-[95px] absolute text-center text-blue-600 text-[10px] font-normal font-['Inter'] whitespace-nowrap">案内時間</div>
  <div className="left-[516px] top-[95px] absolute text-center text-black text-[10px] font-normal font-['Inter'] whitespace-nowrap">ホステス名</div>
  <div className="w-[150px] h-5 left-[466px] top-[75px] absolute bg-lime-200" />
  <div className="w-[150px] h-5 left-[466px] top-[77px] absolute flex items-center justify-center text-black text-[14px] font-normal font-['Inter'] whitespace-nowrap">INドラ未定予約リスト</div>
  <div className="w-[368px] h-[600px] left-[361px] top-[108px] absolute outline outline-1 outline-offset-[-1px] outline-zinc-300 overflow-x-hidden overflow-y-auto">
    {undecidedDriverReservationSampleData.map((reservation: UndecidedDriverReservation, index: number) => {
      const topPosition = index * 22;
      return (
        <div key={reservation.id} className={`w-[362px] h-5 left-0 absolute overflow-hidden ${index % 2 === 1 ? 'bg-zinc-200' : 'bg-white'} ${index === 0 ? 'border-t border-zinc-300' : ''}`} style={{ top: `${topPosition}px` }}>
          <div className="w-4 h-5 left-[346px] top-0 absolute border-r border-b border-zinc-300" />
          <div className="w-4 h-5 left-[330px] top-0 absolute border-r border-b border-zinc-300" />
          <div className="w-4 h-5 left-[314px] top-0 absolute border-r border-b border-zinc-300" />
          <div className="w-4 h-5 left-[298px] top-0 absolute border-r border-b border-zinc-300" />
          <div className="w-4 h-5 left-[282px] top-0 absolute border-r border-b border-zinc-300" />
          <div className="w-10 h-5 left-[242px] top-0 absolute border-r border-b border-zinc-300" />
          <div className="w-3 left-[268px] top-[2px] absolute text-center text-black text-[12px] font-normal font-['Inter'] overflow-hidden">分</div>
          <div className="w-5 left-[246px] top-[2px] absolute text-right text-black text-[12px] font-normal font-['Inter'] overflow-hidden">{reservation.timeTotal}</div>
          <div className="w-6 h-5 left-[218px] top-0 absolute border-r border-b border-zinc-300" />
          <div className="w-4 left-[220px] top-[2px] absolute text-center text-black text-[12px] font-normal font-['Inter'] overflow-hidden">{reservation.sColumn}</div>
          <div className={`w-[20px] h-5 left-[48px] top-0 absolute border-r border-b border-zinc-300 ${reservation.isConfirmed ? 'bg-blue-200' : ''}`} />
          {reservation.isConfirmed && (
            <div className="w-3 left-[52px] top-[2px] absolute text-center text-black text-[12px] font-normal font-['Inter'] overflow-hidden">確</div>
          )}
          <div className="w-[70px] h-5 left-[148px] top-0 absolute bg-yellow-200 border-r border-b border-zinc-300" />
          <div className="w-[66px] left-[150px] top-[2px] absolute text-black text-[12px] font-normal font-['Inter'] overflow-hidden">{reservation.area} {reservation.hostessName}</div>
          <div className="w-16 h-5 left-[68px] top-0 absolute border-r border-b border-zinc-300" />
          <div className="w-14 left-[71px] top-[2px] absolute text-black text-[12px] font-normal font-['Inter'] overflow-hidden">{reservation.pickupLocation}</div>
          <div className="w-4 h-[20px] left-[132px] top-0 absolute bg-blue-200 border-r border-b border-zinc-300"/>
          <div className="w-3 left-[134px] top-[2px] absolute text-center text-black text-[12px] font-normal font-['Inter'] overflow-hidden">D</div>
          <div className="w-12 h-5 left-0 top-0 absolute rounded-[2px] bg-gradient-to-b from-blue-100 via-blue-200 to-blue-300 border-2 border-t-blue-50 border-l-blue-50 border-r-blue-400 border-b-blue-400 shadow-[2px_2px_3px_rgba(0,0,0,0.25),inset_0_1px_0_rgba(255,255,255,0.5)]" />
          <div className="w-11 left-[3px] top-[2px] absolute text-center text-blue-600 text-[12px] font-normal font-['Inter'] overflow-hidden">{reservation.departureTime}</div>
        </div>
      );
    })}
  </div>
  {/* メモ・引継事項　ドラ休憩 */}
  <div className="w-[368px] h-5 left-[361px] top-[708px] absolute bg-fuchsia-300" />
  <div className="w-[368px] left-[363px] top-[711px] absolute text-center text-black text-[12px] font-normal font-['Inter'] overflow-hidden">メモ・引継事項　ドラ休憩</div>
  <div className="w-[368px] h-[338px] left-[361px] top-[728px] absolute outline outline-1 outline-offset-[-1px] outline-zinc-300 overflow-x-hidden overflow-y-auto">
    {memoItemSampleData.map((memo: MemoItem, index: number) => {
      const topPosition = index * 34;
      return (
        <div key={memo.id} className="w-[362px] h-8 left-0 absolute overflow-hidden" style={{ top: `${topPosition}px` }}>

          <div className="w-[362px] h-8 left-0 top-0 absolute bg-white border-b border-black" />
          <button
            type="button"
            onClick={() => {
              // TODO: 編集機能を実装
            }}
            className="size-6 p-1 left-[330px] top-[3.5px] absolute bg-white rounded-[3px] inline-flex flex-col justify-center items-center gap-2.5 overflow-hidden hover:bg-gray-100 cursor-pointer transition-colors"
            aria-label="編集"
          >
            <Pen className="w-4 h-4 text-black" />
          </button>
          <div className="w-[326px] h-8 left-0 top-0 absolute overflow-hidden text-black text-[12px] font-normal font-['Inter'] leading-tight">
            {memo.content.split('\n').map((line, i) => (
              <React.Fragment key={i}>
                {line}
                {i < memo.content.split('\n').length - 1 && <br />}
              </React.Fragment>
            ))}
          </div>
        </div>
      );
    })}
  </div>
  {/* 出勤予定ホステス - Grid Table Layout */}
  <div className="w-[357px] h-5 left-[4px] top-[75px] absolute bg-cyan-200" />
  <div className="w-[357px] left-[4px] top-[77px] absolute text-center text-black text-[12px] font-normal font-['Inter'] overflow-hidden">出勤予定ホステス</div>

  {/* ヘッダー行 - Grid */}
  <div
    className="w-[357px] h-[18px] left-[4px] top-[95px] absolute grid bg-zinc-100 border-y border-zinc-400 text-[10px] text-black text-center font-['Inter'] divide-x divide-zinc-400"
    style={{ gridTemplateColumns: '20px 50px 48px 20px 42px 17px 36px 28px 36px 36px 24px' }}
  >
    <div className="flex items-center justify-center"></div>
    <div className="flex items-center justify-center">店舗</div>
    <div className="flex items-center justify-center">名前</div>
    <div className="flex items-center justify-center">確</div>
    <div className="flex items-center justify-center">迎えドラ</div>
    <div className="flex items-center justify-center text-[8px]">決</div>
    <div className="flex items-center justify-center">出勤</div>
    <div className="flex items-center justify-center">地域</div>
    <div className="flex items-center justify-center">終了</div>
    <div className="flex items-center justify-center">帰宅</div>
    <div className="flex items-center justify-center text-[8px] leading-none whitespace-nowrap">確TEL</div>
  </div>

  {/* データ行 - Grid */}
  <div className="w-[357px] h-[600px] left-[4px] top-[113px] absolute outline outline-1 outline-offset-[-1px] outline-zinc-400 overflow-x-hidden overflow-y-auto bg-white">
    {scheduledHostessSampleData.map((hostess: ScheduledHostess, index: number) => (
      <div
        key={hostess.id}
        className={`grid h-5 text-[11px] font-['Inter'] divide-x divide-zinc-300 border-b border-zinc-300 ${
          index % 2 === 0 ? 'bg-white' : 'bg-zinc-50'
        }`}
        style={{ gridTemplateColumns: '20px 50px 48px 20px 42px 17px 36px 28px 36px 36px 24px' }}
      >
        {/* 出勤確認 */}
        <div
          className={`flex items-center justify-center group/att relative ${
            hostess.isAttendanceConfirmed ? 'bg-green-400 text-white' : 'bg-zinc-300'
          }`}
        >
          {hostess.isAttendanceConfirmed && <span className="text-[11px] font-bold">✓</span>}
          <div className="hidden group-hover/att:block absolute left-0 bottom-full mb-1 z-50 bg-black text-white text-[11px] px-2 py-1 rounded whitespace-nowrap shadow-lg">
            {hostess.isAttendanceConfirmed ? 'マイページ出勤確認済み' : '出勤未確認'}
          </div>
        </div>

        {/* 店舗 */}
        <div className="flex items-center justify-center bg-yellow-200 overflow-hidden whitespace-nowrap px-0.5">
          {hostess.store?.slice(0, 5) ?? hostess.area}
        </div>

        {/* ホステス名 */}
        <div
          className="flex items-center justify-center overflow-hidden whitespace-nowrap px-0.5"
          style={hostess.storeColor ? { backgroundColor: hostess.storeColor, color: '#000' } : { color: '#000' }}
        >
          {hostess.hostessName}
        </div>

        {/* 確 */}
        <div className={`flex items-center justify-center ${hostess.isConfirmed ? 'bg-green-300' : ''}`}>
          {hostess.isConfirmed && <span className="text-[12px]">確</span>}
        </div>

        {/* 迎えドラ */}
        <div className="flex items-center justify-start overflow-hidden whitespace-nowrap pl-1">
          {hostess.driverName}
        </div>

        {/* 決(count) */}
        <div className="flex items-center justify-center bg-zinc-400 text-white text-[11px]">
          {hostess.count}
        </div>

        {/* 出勤 */}
        <div className="flex items-center justify-center text-[11px] tabular-nums">
          {hostess.arrivalTime}
        </div>

        {/* 地域 */}
        <div className="flex items-center justify-center overflow-hidden whitespace-nowrap" title={hostess.location}>
          {hostess.area}
        </div>

        {/* 終了 */}
        <div className="flex items-center justify-center text-[11px] tabular-nums">
          {hostess.startTime}
        </div>

        {/* 帰宅 */}
        <div className="flex items-center justify-center text-[11px] tabular-nums">
          {hostess.endTime}
        </div>

        {/* 確認電話 */}
        <div
          className={`flex items-center justify-center group/call relative ${
            hostess.confirmCallTime
              ? hostess.isConfirmCallCompleted
                ? 'bg-green-400 text-white'
                : 'bg-yellow-300'
              : ''
          }`}
        >
          {hostess.confirmCallTime && (
            <>
              <span className="text-[11px] font-bold">✓</span>
              <div className="hidden group-hover/call:block absolute right-0 bottom-full mb-1 z-50 bg-black text-white text-[13px] px-2 py-1 rounded whitespace-nowrap shadow-lg">
                確認TEL {hostess.confirmCallTime} {hostess.isConfirmCallCompleted ? '(完了)' : '(未完了)'}
              </div>
            </>
          )}
        </div>
      </div>
    ))}
  </div>

  {/* OUTドラ未定予約リスト */}
  <div className="w-[176px] h-5 left-[961px] top-[75px] absolute bg-lime-200" />
  <div className="w-[176px] h-5 left-[961px] top-[77px] absolute flex items-center justify-center text-black text-[14px] font-normal font-['Inter'] whitespace-nowrap">OUTドラ未定・接客中リスト</div>

  {/* ヘッダー行 */}
  <div className="w-10 left-[729px] top-[95px] absolute text-center justify-end text-black text-[11px] font-normal font-['Inter'] whitespace-nowrap">開始</div>
  <div className="w-[70px] left-[769px] top-[95px] absolute text-center justify-end text-black text-[11px] font-normal font-['Inter'] whitespace-nowrap">ホステス名</div>
  <div className="w-10 left-[867px] top-[95px] absolute text-center justify-end text-black text-[11px] font-normal font-['Inter'] whitespace-nowrap">時間計</div>
  <div className="w-12 left-[907px] top-[95px] absolute text-center justify-end text-black text-[11px] font-normal font-['Inter'] whitespace-nowrap">開始</div>
  <div className="w-12 left-[955px] top-[95px] absolute text-center justify-end text-black text-[11px] font-normal font-['Inter'] whitespace-nowrap">終了</div>
  <div className="w-32 left-[1003px] top-[95px] absolute text-center justify-end text-black text-[11px] font-normal font-['Inter'] whitespace-nowrap">場所</div>
  <div className="w-4 left-[1131px] top-[95px] absolute text-center justify-end text-black text-[11px] font-normal font-['Inter'] whitespace-nowrap">D</div>
  <div className="w-16 left-[1147px] top-[95px] absolute text-center justify-end text-black text-[11px] font-normal font-['Inter'] whitespace-nowrap">地域</div>
  <div className="w-10 left-[1211px] top-[95px] absolute text-center justify-end text-black text-[10px] font-normal font-['Inter'] whitespace-nowrap overflow-hidden">INド</div>
  <div className="w-10 left-[1251px] top-[95px] absolute text-center justify-end text-black text-[10px] font-normal font-['Inter'] whitespace-nowrap overflow-hidden">OUTド</div>
  <div className="w-4 left-[1367px] top-[55px] absolute text-center text-black text-[8px] leading-none font-normal font-['Inter']" style={{ writingMode: 'vertical-rl' }}>オプション</div>
  <div className="w-4 left-[1348px] top-[71px] absolute text-center text-black text-[8px] leading-none font-normal font-['Inter']" style={{ writingMode: 'vertical-rl' }}>カード</div>
  <div className="w-4 left-[1329px] top-[63px] absolute text-center text-black text-[8px] leading-none font-normal font-['Inter']" style={{ writingMode: 'vertical-rl' }}>着TEL</div>
  <div className="w-4 left-[1310px] top-[71px] absolute text-center text-black text-[8px] leading-none font-normal font-['Inter']" style={{ writingMode: 'vertical-rl' }}>待合せ</div>
  <div className="w-4 left-[1291px] top-[71px] absolute text-center text-black text-[8px] leading-none font-normal font-['Inter']" style={{ writingMode: 'vertical-rl' }}>領収書</div>
  <div className="w-[663px] h-[960px] left-[729px] top-[108px] absolute outline outline-1 outline-offset-[-1px] outline-zinc-300 overflow-x-hidden overflow-y-auto">
    {outDriverUndecidedSampleData.map((item: OutDriverUndecided, index: number) => (
      <div key={item.id} className={`w-[657px] h-6 left-0 absolute overflow-hidden ${index % 2 === 1 ? 'bg-zinc-200' : 'bg-white'} ${index === 0 ? 'border-t border-zinc-300' : ''}`} style={{ top: `${index * 24}px` }}>
      <Button
        className="w-10 h-6 px-0.5 py-[1px] left-0 top-0 absolute rounded-[2px] bg-gradient-to-b from-white via-cyan-100 to-cyan-300 hover:from-white hover:via-cyan-200 hover:to-cyan-400 active:from-cyan-400 active:via-cyan-300 active:to-cyan-200 text-black text-[14px] font-normal font-['Inter'] border-2 border-t-white border-l-white border-r-zinc-600 border-b-zinc-600 shadow-[3px_3px_5px_rgba(0,0,0,0.35),inset_0_1px_0_rgba(255,255,255,0.9)] active:shadow-none active:border-t-zinc-600 active:border-l-zinc-600 active:border-r-zinc-300 active:border-b-zinc-300 active:translate-x-[2px] active:translate-y-[2px] transition-transform duration-75"
        onClick={() => {}}
      >
        開始
      </Button>
      <div className="w-[70px] h-6 left-[40px] top-0 absolute bg-yellow-200 border-r border-b border-zinc-300" />
      <div className="w-[66px] h-6 left-[44px] top-[3px] absolute text-black text-[12px] font-normal font-['Inter'] overflow-hidden whitespace-nowrap">{item.hostessName}</div>
      <div className="w-[28px] h-6 left-[110px] top-0 absolute border-r border-b border-zinc-300" />
      <div className="w-[24px] h-6 left-[112px] top-[3px] absolute text-center text-black text-[12px] font-normal font-['Inter'] overflow-hidden">{item.shopCode || ''}</div>
      <div className="w-32 h-6 left-[274px] top-0 absolute border-r border-b border-zinc-300" />
      <div className="w-32 h-6 left-[276px] top-[3px] absolute text-black text-[12px] font-normal font-['Inter'] overflow-hidden whitespace-nowrap" title={item.destination}>{item.destination}</div>
      <div className="w-4 h-6 left-[402px] top-0 absolute bg-blue-200 border-r border-b border-zinc-300" />
      <div className="w-3 h-6 left-[404px] top-[3px] absolute text-center text-black text-[12px] font-normal font-['Inter']">D</div>
      <div className="w-16 h-6 left-[418px] top-0 absolute border-r border-b border-zinc-300" />
      <div className="w-14 h-6 left-[422px] top-[3px] absolute text-black text-[12px] font-normal font-['Inter'] overflow-hidden whitespace-nowrap">{item.station}</div>
      <div className={`w-10 h-6 left-[482px] top-0 absolute border-r border-b border-zinc-300 ${item.in_driver ? 'bg-yellow-200' : ''}`} />
      {item.in_driver && (
        <div className="w-9 h-6 left-[484px] top-[3px] absolute text-black text-[12px] font-normal font-['Inter'] overflow-hidden whitespace-nowrap">{item.in_driver}</div>
      )}
      <div className={`w-10 h-6 left-[522px] top-0 absolute border-r border-b border-zinc-300 ${item.out_driver ? 'bg-yellow-200' : ''}`} />
      {item.out_driver && (
        <div className="w-9 h-6 left-[524px] top-[3px] absolute text-black text-[12px] font-normal font-['Inter'] overflow-hidden whitespace-nowrap">{item.out_driver}</div>
      )}
      <div className="w-12 h-6 left-[226px] top-0 absolute border-r border-b border-zinc-300" />
      <div className="w-11 h-6 left-[228px] top-[3px] absolute text-center text-red-800 text-[12px] font-bold font-['Inter'] overflow-hidden">{item.arrivalTime}</div>
      <div className="w-12 h-6 left-[178px] top-0 absolute border-r border-b border-zinc-300" />
      <div className="w-11 h-6 left-[180px] top-[3px] absolute text-center text-black text-[12px] font-normal font-['Inter'] overflow-hidden">{item.pickupTime}</div>
      <div className="w-10 h-6 left-[138px] top-0 absolute border-r border-b border-zinc-300" />
      <div className="w-3 h-6 left-[164px] top-[3px] absolute text-center text-black text-[12px] font-normal font-['Inter']">分</div>
      <div className="w-5 h-6 left-[142px] top-[3px] absolute text-right text-black text-[12px] font-normal font-['Inter'] overflow-hidden">{item.timeTotal}</div>
      <div className="w-[19px] h-6 left-[638px] top-0 absolute border-r border-b border-zinc-300" />
      <div className="w-[19px] h-6 left-[619px] top-0 absolute border-r border-b border-zinc-300" />
      <div className="w-[19px] h-6 left-[600px] top-0 absolute border-r border-b border-zinc-300" />
      <div className="w-[19px] h-6 left-[581px] top-0 absolute border-r border-b border-zinc-300" />
      <div className="w-[19px] h-6 left-[562px] top-0 absolute border-r border-b border-zinc-300" />
      </div>
    ))}
  </div>

  {/* 終了リスト */}
  <div className="w-[338px] h-5 left-[1392px] top-[75px] absolute bg-fuchsia-300" />
  <div className="w-[338px] left-[1392px] top-[77px] absolute text-center text-black text-[12px] font-normal font-['Inter'] overflow-hidden">終了リスト</div>
  {/* コラムヘッダー */}
  <div className="w-[86px] left-[1392px] top-[95px] absolute text-center text-black text-[11px] font-normal font-['Inter'] whitespace-nowrap">ホステス名</div>
  <div className="w-10 left-[1518px] top-[95px] absolute text-center text-black text-[11px] font-normal font-['Inter']">終了</div>
  <div className="w-28 left-[1558px] top-[95px] absolute text-center text-black text-[11px] font-normal font-['Inter']">場所</div>
  <div className="w-[54px] left-[1670px] top-[95px] absolute text-center text-black text-[10px] font-normal font-['Inter'] whitespace-nowrap overflow-hidden">OUTド</div>
  <div className="w-[338px] h-[65px] left-[1392px] top-[108px] absolute outline outline-1 outline-offset-[-1px] outline-zinc-300 overflow-x-hidden overflow-y-auto">
    {completedListSampleData.map((item: CompletedList, index: number) => {
    const topPosition = index * 22;
    return (
      <div key={item.id} className={`w-[338px] h-5 absolute overflow-hidden ${index % 2 === 1 ? 'bg-zinc-200' : 'bg-white'} ${index === 0 ? 'border-t border-zinc-400' : ''}`} style={{ left: 0, top: topPosition }}>
        {item.option1 && (
          <>
            <div className="w-[54px] h-5 absolute bg-yellow-200 border-r border-b border-zinc-400" style={{ left: 278, top: 0 }} />
            <div className="w-12 absolute text-black text-[12px] font-normal font-['Inter'] overflow-hidden" style={{ left: 280, top: 2 }}>{item.option1}</div>
          </>
        )}
        <div className="w-[86px] h-5 absolute bg-yellow-200 border-r border-b border-zinc-400" style={{ left: 0, top: 0 }} />
        <div className="w-[82px] h-5 absolute text-black text-[12px] font-normal font-['Inter'] overflow-hidden whitespace-nowrap" style={{ left: 2, top: 2 }}>{item.hostessName}</div>
        <div className="w-10 h-5 absolute border-r border-b border-zinc-400" style={{ left: 126, top: 0 }} />
        <div className="w-9 h-5 absolute text-center text-black text-[12px] font-normal font-['Inter'] overflow-hidden" style={{ left: 128, top: 2 }}>{item.arrivalTime}</div>
        <div className="w-10 h-5 absolute border-r border-b border-zinc-400" style={{ left: 86, top: 0 }} />
        <div className="w-9 h-5 absolute text-center text-black text-[12px] font-normal font-['Inter'] overflow-hidden" style={{ left: 88, top: 2 }}>{item.pickupTime}</div>
        <div className="w-28 h-5 absolute border-r border-b border-zinc-400" style={{ left: 166, top: 0 }} />
        <div className="w-28 h-5 absolute text-black text-[12px] font-normal font-['Inter'] overflow-hidden whitespace-nowrap" style={{ left: 169, top: 2 }} title={item.destination}>{item.destination}</div>
      </div>
    );
    })}
  </div>
  
  <div className="w-[172px] h-5 left-[1564px] top-[593px] absolute bg-yellow-200" />
  <div className="w-[172px] left-[1564px] top-[595px] absolute text-center text-black text-[12px] font-normal font-['Inter'] overflow-hidden">精算告知済　ドライバー</div>
  {/* ヘッダー：名前 / 待機開始 / 経過 */}
  <div className="w-[172px] left-[1564px] top-[613px] absolute flex text-[11px] text-gray-500 font-['Inter'] border-b border-zinc-400 bg-gray-50">
    <div className="w-[72px] px-1">ドライバー名</div>
    <div className="w-[46px] text-center">待機開始</div>
    <div className="w-[54px] text-center text-orange-600 font-bold">経過</div>
  </div>
  <div className="w-[172px] h-[100px] left-[1564px] top-[628px] absolute outline outline-1 outline-offset-[-1px] outline-zinc-300 overflow-x-hidden overflow-y-auto bg-white">
    {[
      { name: '田中', since: '20:30' },
      { name: '佐藤', since: '21:00' },
    ].map((driver, index) => {
      const waitingMins = calcWaitingMinutes(driver.since);
      const isLong = waitingMins >= 60;
      return (
        <div key={driver.name} className="w-[172px] h-6 left-0 absolute overflow-hidden bg-white border-b border-zinc-300 flex items-center" style={{ top: `${index * 24}px` }}>
          <div className="w-[72px] px-1 text-black text-[13px] font-normal font-['Inter'] truncate">{driver.name}</div>
          <div className="w-[46px] text-center text-blue-600 text-[12px] font-mono font-['Inter']">{driver.since}</div>
          <div className={`w-[54px] text-center text-[12px] font-bold font-mono font-['Inter'] ${isLong ? 'text-red-600' : 'text-orange-600'}`}>
            {waitingMins}分
          </div>
        </div>
      );
    })}
    {Array.from({ length: 1 }).map((_, index) => (
      <div key={`empty-${index}`} className="w-[172px] h-6 left-0 absolute bg-white border-b border-zinc-300" style={{ top: `${(index + 2) * 24}px` }} />
    ))}
  </div>


  <div className="w-[172px] h-5 left-[1392px] top-[713px] absolute bg-yellow-200" />
  <div className="w-[172px] left-[1392px] top-[715px] absolute text-center text-black text-[12px] font-normal font-['Inter'] overflow-hidden">南IC待機　ドライバー</div>
  {/* ヘッダー：名前 / 待機開始 / 経過 */}
  <div className="w-[172px] left-[1392px] top-[733px] absolute flex text-[11px] text-gray-500 font-['Inter'] border-b border-zinc-400 bg-gray-50">
    <div className="w-[72px] px-1">ドライバー名</div>
    <div className="w-[46px] text-center">待機開始</div>
    <div className="w-[54px] text-center text-orange-600 font-bold">経過</div>
  </div>
  <div className="w-[172px] h-[232px] left-[1392px] top-[748px] absolute outline outline-1 outline-offset-[-1px] outline-zinc-300 overflow-x-hidden overflow-y-auto bg-white">
    {[
      { name: '吉田', since: '18:30' },
      { name: '松尾', since: '19:15' },
      { name: '山岡', since: '19:45' },
      { name: '川口', since: '20:00' },
    ].map((driver, index) => {
      const waitingMins = calcWaitingMinutes(driver.since);
      const isLong = waitingMins >= 60;
      return (
        <div key={driver.name} className="w-[172px] h-6 left-0 absolute overflow-hidden bg-white border-b border-zinc-300 flex items-center" style={{ top: `${index * 24}px` }}>
          <div className="w-[72px] px-1 text-black text-[13px] font-normal font-['Inter'] truncate">{driver.name}</div>
          <div className="w-[46px] text-center text-blue-600 text-[12px] font-mono font-['Inter']">{driver.since}</div>
          <div className={`w-[54px] text-center text-[12px] font-bold font-mono font-['Inter'] ${isLong ? 'text-red-600' : 'text-orange-600'}`}>
            {waitingMins}分
          </div>
        </div>
      );
    })}
    {Array.from({ length: 6 }).map((_, index) => (
      <div key={`empty-${index}`} className="w-[172px] h-6 left-0 absolute bg-white border-b border-zinc-300" style={{ top: `${(index + 4) * 24}px` }} />
    ))}
  </div>
  


  


  {/* 南IC事務所　待機 */}
  <div className="w-[172px] h-5 left-[1392px] top-[173px] absolute bg-cyan-100" />
  <div className="w-[172px] left-[1392px] top-[175px] absolute text-center text-black text-[12px] font-normal font-['Inter'] overflow-hidden">南IC事務所　待機</div>
  <div className="w-[172px] h-[520px] left-[1392px] top-[193px] absolute outline outline-1 outline-offset-[-1px] outline-zinc-300 overflow-x-hidden overflow-y-auto bg-white">
    {Array.from({ length: 24 }).map((_, index) => {
      const topPosition = index * 22;
      const item = officeWaitingSampleData[index];
      return (
        <div key={index} className="w-[172px] h-5 left-0 absolute overflow-hidden bg-white" style={{ top: `${topPosition}px` }}>
          <div className="w-[18px] h-5 left-[148px] top-0 absolute border-r border-b border-zinc-300" />
          <div className="w-[18px] h-5 left-[130px] top-0 absolute border-r border-b border-zinc-300" />
          <div className="w-[18px] h-5 left-[112px] top-0 absolute border-r border-b border-zinc-300" />
          <div className="w-[70px] h-5 left-0 top-0 absolute bg-yellow-200 border-r border-b border-zinc-300" />
          {item && <div className="w-16 h-5 left-[3px] top-[2px] absolute text-black text-[12px] font-normal font-['Inter'] overflow-hidden whitespace-nowrap">{item.hostessName}</div>}
          <div className="w-[42px] h-5 left-[70px] top-0 absolute border-r border-b border-zinc-300" />
          {item && <div className="w-9 h-5 left-[73px] top-[2px] absolute text-center text-black text-[12px] font-normal font-['Inter'] overflow-hidden whitespace-nowrap">{item.departureTime}</div>}
        </div>
      );
    })}
  </div>
  
  {/* FGCS　他撮影中 */}
  <div className="w-[172px] h-5 left-[1564px] top-[173px] absolute bg-fuchsia-300" />
  <div className="w-[172px] left-[1564px] top-[175px] absolute text-center text-black text-[12px] font-normal font-['Inter'] overflow-hidden">FGCS　他撮影中</div>
  <div className="w-[172px] h-[64px] left-[1564px] top-[193px] absolute outline outline-1 outline-offset-[-1px] outline-zinc-300 overflow-x-hidden overflow-y-auto">
    {shootingSampleData.map((item: Shooting, index: number) => {
      const topPosition = index * 22;
      return (
        <div key={item.id} className="w-[172px] h-5 left-0 absolute overflow-hidden" style={{ top: `${topPosition}px` }}>
          <div className="w-[18px] h-5 left-[148px] absolute border border-rose-300/60" />
          <div className="w-[18px] h-5 left-[130px] absolute border border-rose-300/60" />
          <div className="w-[18px] h-5 left-[112px] absolute border border-rose-300/60" />
          <div className="w-[70px] h-5 left-0 absolute bg-yellow-200 border border-rose-300/60" />
          <div className="w-16 h-5 left-[3px] top-[2px] absolute text-black text-[12px] font-normal font-['Inter'] overflow-hidden whitespace-nowrap">{item.hostessName}</div>
          <div className="w-[42px] h-5 left-[70px] absolute border border-rose-300/60" />
          <div className="w-9 h-5 left-[73px] top-[2px] absolute text-center text-black text-[12px] font-normal font-['Inter'] overflow-hidden whitespace-nowrap">{item.departureTime}</div>
        </div>
      );
    })}
  </div>

  {/* 南IC徒歩派遣or仮置き */}
  <div className="w-[172px] h-5 left-[1564px] top-[257px] absolute bg-cyan-100" />
  <div className="w-[172px] h-5 left-[1564px] top-[259px] absolute text-center text-black text-[12px] font-normal font-['Inter'] overflow-hidden">南IC徒歩派遣or仮置き</div>
  <div className="w-[172px] h-[316px] left-[1564px] top-[277px] absolute outline outline-1 outline-offset-[-1px] outline-zinc-300 overflow-x-hidden overflow-y-auto">
    {walkingDispatchSampleData.map((item: WalkingDispatch, index: number) => {
      const topPosition = index * 22;
      return (
        <div key={item.id} className="w-[172px] h-5 left-0 absolute overflow-hidden" style={{ top: `${topPosition}px` }}>
          <div className="w-[70px] h-5 left-0 absolute bg-yellow-200 border border-rose-300/60" />
          <div className="w-16 h-5 left-[3px] top-[2px] absolute text-black text-[12px] font-normal font-['Inter'] overflow-hidden whitespace-nowrap">{item.hostessName}</div>
          <div className="w-[42px] h-5 left-[70px] absolute border border-rose-300/60" />
          <div className="w-9 h-5 left-[73px] top-[2px] absolute text-center text-black text-[12px] font-normal font-['Inter'] overflow-hidden whitespace-nowrap">{item.departureTime}</div>
          <div className="w-[18px] h-5 left-[112px] absolute border border-rose-300/60" />
          <div className="w-[18px] h-5 left-[130px] absolute border border-rose-300/60" />
          <div className="w-[18px] h-5 left-[148px] absolute border border-rose-300/60" />
        </div>
      );
    })}
  </div>


  
  


  {/* 帰宅ホステス */}

  <div className="w-[240px] h-5 left-[1736px] top-[568px] absolute bg-cyan-100" />
  <div className="w-[240px] left-[1736px] top-[570px] absolute text-center text-black text-[12px] font-normal font-['Inter'] overflow-hidden">帰宅ホステス</div>
  <div className="w-[240px] h-5 left-[1736px] top-[588px] absolute bg-yellow-200" />
  <div className="w-[240px] left-[1736px] top-[590px] absolute text-center text-black text-[12px] font-normal font-['Inter'] overflow-hidden">自宅or寮　待機</div>
  <div className="w-[240px] h-[105px] left-[1736px] top-[608px] absolute outline outline-1 outline-offset-[-1px] outline-zinc-300 overflow-x-hidden overflow-y-auto bg-white">
    {returningHostessSampleData.map((item: ReturningHostess, index: number) => {
      const topPosition = index * 22;
      return (
        <div key={item.id} className="w-[240px] h-5 left-0 absolute overflow-hidden bg-white border-b border-zinc-300" style={{ top: `${topPosition}px` }}>
          <div className="w-[236px] h-5 left-[2px] top-0 absolute text-black text-[12px] font-normal font-['Inter'] overflow-hidden whitespace-nowrap">
            {item.hostessName} - {item.returnTime} - {item.location}
          </div>
        </div>
      );
    })}
  </div>

  {/* ホステス送り・帰宅 */}
  <div className="w-[249px] h-5 left-[1736px] top-[75px] absolute bg-yellow-200" />
  <div className="w-[249px] left-[1736px] top-[77px] absolute text-center text-black text-[12px] font-normal font-['Inter'] overflow-hidden">ホステス送り・帰宅</div>
  <div className="w-5 left-[1736px] top-[96px] absolute text-center text-black text-[10px] font-normal font-['Inter'] whitespace-nowrap overflow-hidden">荷物</div>
  <div className="w-[54px] left-[1756px] top-[96px] absolute text-center text-black text-[10px] font-normal font-['Inter'] whitespace-nowrap overflow-hidden">ホステス名</div>
  <div className="w-[42px] left-[1810px] top-[96px] absolute text-center text-black text-[10px] font-normal font-['Inter'] whitespace-nowrap overflow-hidden">終了</div>
  <div className="w-[42px] left-[1852px] top-[96px] absolute text-center text-black text-[10px] font-normal font-['Inter'] whitespace-nowrap overflow-hidden">帰宅</div>
  <div className="w-[66px] left-[1894px] top-[96px] absolute text-center text-black text-[10px] font-normal font-['Inter'] whitespace-nowrap overflow-hidden">送り場所</div>
  <div className="w-[19px] left-[1960px] top-[96px] absolute text-center text-black text-[10px] font-normal font-['Inter'] whitespace-nowrap overflow-hidden">件数</div>
  <div className="w-[249px] h-[460px] left-[1736px] top-[108px] absolute outline outline-1 outline-offset-[-1px] outline-zinc-300 overflow-hidden">
    {hostessTransportSampleData.map((item: HostessTransport, index: number) => {
      const topPosition = index * 22;
      return (
        <div key={item.id} className="w-[249px] h-5 left-0 absolute overflow-hidden" style={{ top: `${topPosition}px` }}>
          <div className="w-[42px] h-5 left-[116px] absolute bg-white border border-indigo-200/60" />
          <div className="w-9 h-5 left-[119px] top-[2px] absolute text-center text-pink-500 text-[12px] font-normal font-['Inter'] overflow-hidden whitespace-nowrap">{item.returnTime}</div>
          <div className="w-[42px] h-5 left-[74px] absolute bg-white border border-rose-300/60" />
          <div className="w-9 h-5 left-[77px] top-[2px] absolute text-center text-black text-[12px] font-normal font-['Inter'] overflow-hidden whitespace-nowrap">{item.departureTime}</div>
          <div className="w-[66px] h-5 left-[158px] absolute bg-white border border-rose-300/60" />
          <div className="w-[62px] h-5 left-[161px] top-[2px] absolute text-black text-[12px] font-normal font-['Inter'] overflow-hidden whitespace-nowrap" title={item.destination}>{item.destination}</div>
          <div className="w-[19px] h-5 left-[224px] absolute bg-white border border-indigo-200/60" />
          <div className="w-3 h-5 left-[227px] top-[2px] absolute text-center text-black text-[12px] font-normal font-['Inter'] overflow-hidden">{item.count}</div>
          <div className="w-[54px] h-5 left-[20px] absolute bg-white border border-indigo-200/60" />
          <div className="w-12 h-5 left-[23px] top-[2px] absolute text-black text-[12px] font-normal font-['Inter'] overflow-hidden whitespace-nowrap">{item.hostessName.split(' ')[1] || item.hostessName}</div>
          <div className="size-5 left-0 top-0 absolute flex items-center justify-center group">
            <button
              type="button"
              onClick={() => item.luggageDetails ? setShowLuggageConfirm(item.hostessName) : undefined}
              className={`flex items-center justify-center size-5 ${item.luggageDetails ? 'cursor-pointer' : 'cursor-default'}`}
              aria-label={item.luggageDetails ? `${item.hostessName}の荷物確認` : undefined}
            >
              <Package className={`size-4 ${item.luggageDetails ? 'text-orange-500' : 'text-zinc-400'}`} />
            </button>
            {item.luggageDetails && (
              <div className="hidden group-hover:block absolute left-0 bottom-full mb-1 z-50 bg-black text-white text-[12px] px-2 py-1 rounded whitespace-nowrap shadow-lg">
                {item.luggageDetails}
              </div>
            )}
          </div>
        </div>
      );
    })}
  </div>
  
  
  {/* 予定(打ち合わせ・撮影など) */}
  <div className="w-[406px] h-5 left-[1564px] top-[713px] absolute bg-purple-300" />
  <div className="w-[406px] left-[1564px] top-[715px] absolute text-center text-black text-[12px] font-normal font-['Inter'] overflow-hidden">予定(打ち合わせ・撮影など)</div>
  <div className="w-[406px] h-[100px] left-[1564px] top-[733px] absolute outline outline-1 outline-offset-[-1px] outline-zinc-300 overflow-x-hidden overflow-y-auto bg-white">
    {scheduleItemSampleData.map((item: ScheduleItem, index: number) => {
      const topPosition = index * 34;
      return (
        <div key={item.id} className="w-[406px] h-8 left-0 absolute overflow-hidden" style={{ top: `${topPosition}px` }}>
          <div className="w-[406px] h-8 left-0 top-0 absolute bg-white border-b border-zinc-300" />
          <div className="w-[366px] h-8 left-0 top-0 absolute overflow-hidden text-black text-[12px] font-normal font-['Inter'] leading-tight">
            {item.title}<br/>{item.description}
          </div>
          <button
            type="button"
            onClick={() => {
              // TODO: 編集機能を実装
            }}
            className="size-6 p-1 left-[370px] top-[3.5px] absolute z-10 bg-white rounded-[3px] inline-flex flex-col justify-center items-center gap-2.5 overflow-hidden hover:bg-gray-100 cursor-pointer transition-colors"
            aria-label="編集"
          >
            <Pen className="w-4 h-4 text-black" />
          </button>
        </div>
      );
    })}
  </div>

  {/* ドライバ配車パネル */}
  <Button
    className="w-[172px] h-20 left-[1392px] top-[980px] absolute bg-rose-300/60 hover:bg-rose-400/60 text-black text-[14px] font-normal font-['Inter']"
    onClick={() => {
      window.open('/dispatch-panel-2d-sub', 'driverDispatchPanel', 'width=1920,height=1080,menubar=no,toolbar=no,location=no,status=no');
    }}
  >
    ドライバ配車パネル
  </Button>


  {/* 面接予定 */}
  <div className="w-[406px] h-5 left-[1564px] top-[833px] absolute bg-rose-300/60" />
  <div className="w-[406px] left-[1564px] top-[835px] absolute text-center text-black text-[12px] font-normal font-['Inter'] overflow-hidden">面接予定</div>
  <div className="w-[406px] h-[227px] left-[1564px] top-[853px] absolute outline outline-1 outline-offset-[-1px] outline-zinc-300 overflow-x-hidden overflow-y-auto bg-white">
    {driverDispatchPanelSampleData.map((item: DriverDispatchPanel, index: number) => {
      const topPosition = index * 22;
      return (
        <div key={item.id} className="w-[406px] h-5 left-0 absolute overflow-hidden" style={{ top: `${topPosition}px` }}>
          <div className="w-[18px] h-5 left-[78px] absolute bg-rose-200 border border-neutral-300" />
          <div className="w-9 h-5 left-0 absolute bg-rose-200 border border-neutral-300" />
          <div className="w-3 h-5 left-[81px] top-[2px] absolute text-center text-black text-[12px] font-normal font-['Inter'] overflow-hidden">{item.status === 'completed' ? '済' : ''}</div>
          <div className="w-6 h-5 left-[6px] top-[2px] absolute text-center text-black text-[12px] font-normal font-['Inter'] overflow-hidden">{item.type === 'entry' ? '入店' : ''}</div>
          <div className="w-[42px] h-5 left-[36px] absolute border border-rose-200" />
          <div className="w-9 h-5 left-[39px] top-[2px] absolute text-center text-black text-[12px] font-normal font-['Inter'] overflow-hidden whitespace-nowrap">{item.time}</div>
          <div className="w-48 h-5 left-[96px] absolute bg-rose-200 border border-neutral-300" />
          <div className="w-44 h-5 left-[99px] top-[2px] absolute text-black text-[12px] font-normal font-['Inter'] overflow-hidden whitespace-nowrap">{item.location}</div>
          {item.hostessName1 && (
            <>
              <div className="w-14 h-5 left-[288px] absolute bg-yellow-200 border border-indigo-200/60" />
              <div className="w-12 h-5 left-[291px] top-[2px] absolute text-black text-[12px] font-normal font-['Inter'] overflow-hidden whitespace-nowrap">{item.hostessName1}</div>
            </>
          )}
          {item.hostessName2 && (
            <>
              <div className="w-14 h-5 left-[344px] absolute bg-yellow-200 border border-indigo-200/60" />
              <div className="w-12 h-5 left-[347px] top-[2px] absolute text-black text-[12px] font-normal font-['Inter'] overflow-hidden whitespace-nowrap">{item.hostessName2}</div>
            </>
          )}
        </div>
      );
    })}
  </div>
      </div>
    </div>
    </div>
  );
}