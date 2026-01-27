'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { Button } from "@/components/ui/button";
import { Card, CardHeader } from "@/components/ui/card";
import { Pen, Package, ArrowLeft } from 'lucide-react';
import {
  scheduledHostessSampleData,
  undecidedDriverReservationSampleData,
  hostessTransportSampleData,
  returningHostessSampleData,
  scheduleItemSampleData,
  interviewScheduleSampleData,
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
  InterviewSchedule,
  DriverDispatchPanel,
  StaffSchedule,
  OutDriverUndecided,
  CompletedList,
  OfficeWaiting,
  Shooting,
  MemoItem,
  WalkingDispatch,
} from '@/types/new-rt2';

export default function Original() {
  const router = useRouter();

  React.useEffect(() => {
    document.title = '配車パネル2D - Dispatch Harmony Hub';
  }, []);

  return (
    <div className="w-full h-[1080px] overflow-x-auto overflow-y-hidden">
      <div className="w-[1989px] h-[1080px] relative overflow-hidden">
      {/* ヘッダー */}
      <div className="absolute left-0 top-0 right-0 z-10 h-[50px] bg-white border-b border-zinc-300">
        <div className="flex items-center h-full px-2">
          {/* ダッシュボードに戻る - 左端 */}
          <Button
            variant="outline"
            onClick={() => router.push('/dashboard')}
            className="h-8 px-3 text-[13px] flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            ダッシュボードに戻る
          </Button>

          {/* 中央配置のボタン群 */}
          <div className="flex-1 flex items-center justify-center gap-2">
            {/* 配車パネル2Dタイトル */}
            <h1 className="text-[19px] font-bold mr-2">配車パネル2D</h1>

            {/* 日付移動 */}
            <Button
              variant="outline"
              className="h-8 px-3 text-[13px] border-black"
              onClick={() => {}}
            >
              日付移動
            </Button>

            {/* ドライバ精算 */}
            <Button
              className="h-8 px-4 text-[13px] bg-lime-400 hover:bg-lime-500 text-black border border-black"
              onClick={() => {}}
            >
              ドライバ精算
            </Button>

            {/* 新顧客検索 */}
            <Button
              variant="outline"
              className="h-8 px-4 text-[13px] border-black"
              onClick={() => {}}
            >
              新顧客検索
            </Button>

            {/* RT IIパネル */}
            <Button
              className="h-8 px-4 text-[13px] bg-purple-400 hover:bg-purple-500 text-black border border-black"
              onClick={() => {}}
            >
              RT IIパネル
            </Button>

            {/* RTパネル */}
            <Button
              className="h-8 px-4 text-[13px] bg-orange-400 hover:bg-orange-500 text-black border border-black"
              onClick={() => {}}
            >
              RTパネル
            </Button>

            {/* 手配表 */}
            <Button
              variant="outline"
              className="h-8 px-4 text-[13px] border-black"
              onClick={() => {}}
            >
              手配表
            </Button>

            {/* Menu */}
            <Button
              variant="outline"
              className="h-8 px-4 text-[13px] border-black"
              onClick={() => {}}
            >
              Menu
            </Button>

            {/* チャット表示 */}
            <Button
              className="h-8 px-4 text-[13px] bg-cyan-300 hover:bg-cyan-400 text-black border border-black"
              onClick={() => {}}
            >
              チャット表示
            </Button>
          </div>
        </div>
      </div>
  
    {/* スタッフ予定リスト */}
    <div className="w-[357px] h-5 left-[4px] top-[708px] absolute bg-lime-200" />
    <div className="w-[357px] left-[4px] top-[710px] absolute text-center justify-end text-black text-[13px] font-normal font-['Inter']">スタッフ予定リスト</div>
    <div className="w-[357px] h-96 left-[4px] top-[728px] absolute outline outline-1 outline-offset-[-1px] outline-zinc-300 overflow-y-auto relative">
      {staffScheduleSampleData.map((schedule: StaffSchedule, index: number) => {
        const topPosition = index * 36;
        return (
          <div key={schedule.id} className="w-[357px] h-8 left-0 absolute" style={{ top: `${topPosition}px` }}>
            <div className={`w-[357px] h-8 left-0 top-0 absolute ${schedule.isHighlighted ? 'bg-lime-200' : 'bg-white'}`} />
            <div className="w-[357px] h-8 left-0 top-0 absolute justify-center text-black text-[13px] font-normal font-['Inter']">
              {schedule.driverName}→{schedule.destination}<br />{schedule.note}
            </div>
          </div>
        );
      })}
  </div>

  {/* INドラ未定予約リスト */}
  <div className="w-10 h-4 left-[693px] top-[78px] absolute text-center justify-center text-black text-[8px] font-normal font-['Inter'] rotate-90">オプション</div>
  <div className="w-10 h-4 left-[677px] top-[85px] absolute text-center justify-center text-black text-[8px] font-normal font-['Inter'] rotate-90">カード</div>
  <div className="w-10 h-4 left-[661px] top-[85px] absolute text-center justify-center text-black text-[8px] font-normal font-['Inter'] rotate-90">着TEL</div>
  <div className="w-10 h-4 left-[645px] top-[85px] absolute text-center justify-center text-black text-[8px] font-normal font-['Inter'] rotate-90">待合せ</div>
  <div className="w-10 h-4 left-[629px] top-[85px] absolute text-center justify-center text-black text-[8px] font-normal font-['Inter'] rotate-90">領収書</div>
  <div className="w-10 left-[603px] top-[95px] absolute text-center justify-end text-black text-[8px] font-normal font-['Inter']">時間計</div>
  <div className="w-8 left-[441px] top-[95px] absolute text-center justify-end text-black text-[8px] font-normal font-['Inter']">迎え場所</div>
  <div className="w-[42px] left-[361px] top-[95px] absolute text-center justify-end text-black text-[8px] font-normal font-['Inter']">出勤</div>
  <div className="w-[70px] left-[504px] top-[95px] absolute text-center justify-end text-black text-[8px] font-normal font-['Inter']">ホステス名</div>
  <div className="w-[150px] h-5 left-[466px] top-[75px] absolute bg-lime-200" />
  <div className="w-[150px] h-5 left-[466px] top-[77px] absolute flex items-center justify-center text-black text-[13px] font-normal font-['Inter'] whitespace-nowrap">INドラ未定予約リスト</div>
  <div className="w-[368px] h-[600px] left-[361px] top-[108px] absolute outline outline-1 outline-offset-[-1px] outline-zinc-300 overflow-y-auto">
    {undecidedDriverReservationSampleData.map((reservation: UndecidedDriverReservation, index: number) => {
      const topPosition = index * 22;
      return (
        <div key={reservation.id} className={`w-[362px] h-5 left-0 absolute ${index % 2 === 1 ? 'bg-zinc-200' : 'bg-white'} ${index === 0 ? 'border-t border-zinc-400' : ''}`} style={{ top: `${topPosition}px` }}>
          <div className="w-4 h-5 left-[346px] top-0 absolute border-r border-b border-zinc-400" />
          <div className="w-4 h-5 left-[330px] top-0 absolute border-r border-b border-zinc-400" />
          <div className="w-4 h-5 left-[314px] top-0 absolute border-r border-b border-zinc-400" />
          <div className="w-4 h-5 left-[298px] top-0 absolute border-r border-b border-zinc-400" />
          <div className="w-4 h-5 left-[282px] top-0 absolute border-r border-b border-zinc-400" />
          <div className="w-10 h-5 left-[242px] top-0 absolute border-r border-b border-zinc-400" />
          <div className="w-3 left-[268px] top-[2px] absolute text-center justify-end text-black text-[13px] font-normal font-['Inter']">分</div>
          <div className="w-5 left-[246px] top-[2px] absolute text-right justify-end text-black text-[13px] font-normal font-['Inter']">{reservation.timeTotal}</div>
          <div className="w-8 h-5 left-[210px] top-0 absolute border-r border-b border-zinc-400" />
          <div className="w-6 left-[212px] top-[2px] absolute text-center justify-end text-black text-[13px] font-normal font-['Inter']">{reservation.sColumn}</div>
          <div className={`w-[20px] h-5 left-[40px] top-0 absolute border-r border-b border-zinc-400 ${reservation.isConfirmed ? 'bg-purple-300' : ''}`} />
          {reservation.isConfirmed && (
            <div className="w-3 left-[44px] top-[2px] absolute text-center justify-end text-black text-[13px] font-normal font-['Inter']">D</div>
          )}
          <div className="w-[70px] h-5 left-[140px] top-0 absolute bg-yellow-200 border-r border-b border-zinc-400" />
          <div className="w-[66px] left-[142px] top-[2px] absolute justify-end text-black text-[13px] font-normal font-['Inter']">{reservation.area} {reservation.hostessName}</div>
          <div className="w-16 h-5 left-[60px] top-0 absolute border-r border-b border-zinc-400" />
          <div className="w-14 left-[63px] top-[2px] absolute justify-end text-black text-[13px] font-normal font-['Inter']">{reservation.pickupLocation}</div>
          <div className="w-4 h-[20px] left-[124px] top-0 absolute bg-purple-300 border-r border-b border-zinc-400"/>
          <div className="w-10 h-5 left-0 top-0 absolute bg-purple-300 border-r border-b border-zinc-400" />
          <div className="w-9 left-[3px] top-[2px] absolute text-center justify-end text-black text-[13px] font-normal font-['Inter']">{reservation.departureTime}</div>
        </div>
      );
    })}
  </div>
  {/* メモ・引継事項　ドラ休憩 */}
  <div className="w-[368px] h-5 left-[361px] top-[708px] absolute bg-fuchsia-300" />
  <div className="w-[368px] left-[363px] top-[711px] absolute text-center justify-end text-black text-[13px] font-normal font-['Inter']">メモ・引継事項　ドラ休憩</div>
  <div className="w-[368px] h-[338px] left-[361px] top-[728px] absolute outline outline-1 outline-offset-[-1px] outline-zinc-300 overflow-y-auto">
    {memoItemSampleData.map((memo: MemoItem, index: number) => {
      const topPosition = index * 34;
      return (
        <div key={memo.id} className="w-[362px] h-8 left-0 absolute" style={{ top: `${topPosition}px` }}>
          
          <div className="w-[362px] h-8 left-0 top-0 absolute bg-zinc-300" />
          <button
            type="button"
            onClick={() => {
              // TODO: 編集機能を実装
            }}
            className="size-6 p-1 left-[350.5px] top-[3.5px] absolute bg-white rounded-[3px] inline-flex flex-col justify-center items-center gap-2.5 overflow-hidden hover:bg-gray-100 cursor-pointer transition-colors"
            aria-label="編集"
          >
            <Pen className="w-4 h-4 text-black" />
          </button>
          <div className="w-[362px] h-8 left-0 top-0 absolute justify-center text-black text-[13px] font-normal font-['Inter']">
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
  {/* 出勤予定ホステス */}
  <div className="w-[357px] h-5 left-[4px] top-[75px] absolute bg-cyan-200" />
  <div className="w-[357px] left-[4px] top-[77px] absolute text-center justify-end text-black text-[13px] font-normal font-['Inter']">出勤予定ホステス</div>
  <div className="w-4 left-[311px] top-[95px] absolute text-center justify-end text-black text-[8px] font-normal font-['Inter']">帰宅</div>
  <div className="w-4 left-[269px] top-[95px] absolute text-center justify-end text-black text-[8px] font-normal font-['Inter']">終了</div>
  <div className="w-8 left-[207px] top-[95px] absolute text-center justify-end text-black text-[8px] font-normal font-['Inter']">迎え場所</div>
  <div className="w-4 left-[161px] top-[95px] absolute text-center justify-end text-black text-[8px] font-normal font-['Inter']">出勤</div>
  <div className="w-4 left-[139px] top-[95px] absolute text-center justify-end text-black text-[8px] font-normal font-['Inter']">決定</div>
  <div className="w-9 left-[99px] top-[95px] absolute text-center justify-end text-black text-[8px] font-normal font-['Inter']">迎えドラ</div>
  <div className="w-12 left-[43px] top-[95px] absolute justify-end text-black text-[8px] font-normal font-['Inter']">ホステス名</div>
  <div className="w-[357px] h-[600px] left-[4px] top-[108px] absolute outline outline-1 outline-offset-[-1px] outline-zinc-300 overflow-y-auto">
    {scheduledHostessSampleData.map((hostess: ScheduledHostess, index: number) => {
      const topPosition = index * 22;
      return (
        <div key={hostess.id} className="w-[336px] h-5 left-[1px] absolute" style={{ top: `${topPosition}px` }}>

          <div className="w-[197px] h-5 left-[151px] top-0 absolute bg-zinc-300" />
          <div className="w-4 h-5 left-[135px] top-0 absolute bg-zinc-400" />
          <div className="w-[70px] h-5 left-[23px] top-0 absolute bg-yellow-200" />
          <div className="w-5 h-5 left-0 top-0 absolute bg-zinc-300" />
          <div className="w-9 left-[306px] top-[2px] absolute text-center justify-end text-pink-500 text-[13px] font-normal font-['Inter']">{hostess.endTime}</div>
          <div className="w-9 left-[264px] top-[2px] absolute text-center justify-end text-orange-500 text-[13px] font-normal font-['Inter']">{hostess.startTime}</div>
          <div className="w-20 left-[198px] top-[2px] absolute justify-end text-black text-[13px] font-normal font-['Inter']">{hostess.location}</div>
          <div className="w-9 left-[156px] top-[2px] absolute text-center justify-end text-lime-500 text-[13px] font-normal font-['Inter']">{hostess.arrivalTime}</div>
          <div className="w-3 left-[138px] top-[2px] absolute text-center justify-end text-white text-[13px] font-normal font-['Inter']">{hostess.count}</div>
          <div className="w-9 left-[96px] top-[2px] absolute justify-end text-black text-[13px] font-normal font-['Inter']">{hostess.driverName}</div>
          <div className="w-12 left-[42px] top-[2px] absolute justify-end text-black text-[13px] font-normal font-['Inter']">{hostess.hostessName}</div>
          <div className="left-[25px] top-[2px] absolute text-center justify-end text-black text-[13px] font-normal font-['Inter']">{hostess.area}</div>
          <div className="w-3.5 h-1.5 left-[11px] top-[4px] absolute origin-top-left rotate-90 bg-rose-300/60" />
        </div>
      );
    })}
    <div className="w-[336px] h-5 left-[1px] top-[80px] absolute">

    </div>
  </div>

  {/* OUTドラ未定予約リスト */}
  <div className="w-[176px] h-5 left-[961px] top-[75px] absolute bg-lime-200" />
  <div className="w-[176px] h-5 left-[961px] top-[77px] absolute flex items-center justify-center text-black text-[13px] font-normal font-['Inter'] whitespace-nowrap">OUTドラ未定・接客中リスト</div>

  {/* ヘッダー行 */}
  <div className="w-10 left-[729px] top-[95px] absolute text-center justify-end text-black text-[8px] font-normal font-['Inter']">開始</div>
  <div className="w-[70px] left-[769px] top-[95px] absolute text-center justify-end text-black text-[8px] font-normal font-['Inter']">ホステス名</div>
  <div className="w-10 left-[883px] top-[95px] absolute text-center justify-end text-black text-[8px] font-normal font-['Inter']">時間計</div>
  <div className="w-12 left-[923px] top-[95px] absolute text-center justify-end text-black text-[8px] font-normal font-['Inter']">開始</div>
  <div className="w-12 left-[971px] top-[95px] absolute text-center justify-end text-black text-[8px] font-normal font-['Inter']">終了</div>
  <div className="w-32 left-[1019px] top-[95px] absolute text-center justify-end text-black text-[8px] font-normal font-['Inter']">場所</div>
  <div className="w-16 left-[1147px] top-[95px] absolute text-center justify-end text-black text-[8px] font-normal font-['Inter']">地域</div>
  <div className="w-10 left-[1211px] top-[95px] absolute text-center justify-end text-black text-[8px] font-normal font-['Inter']">INドラ</div>
  <div className="w-10 left-[1251px] top-[95px] absolute text-center justify-end text-black text-[8px] font-normal font-['Inter']">OUTドラ</div>
  <div className="w-10 h-4 left-[1355px] top-[78px] absolute text-center justify-center text-black text-[8px] font-normal font-['Inter'] rotate-90">オプション</div>
  <div className="w-10 h-4 left-[1336px] top-[85px] absolute text-center justify-center text-black text-[8px] font-normal font-['Inter'] rotate-90">カード</div>
  <div className="w-10 h-4 left-[1317px] top-[85px] absolute text-center justify-center text-black text-[8px] font-normal font-['Inter'] rotate-90">着TEL</div>
  <div className="w-10 h-4 left-[1298px] top-[85px] absolute text-center justify-center text-black text-[8px] font-normal font-['Inter'] rotate-90">待合せ</div>
  <div className="w-10 h-4 left-[1279px] top-[85px] absolute text-center justify-center text-black text-[8px] font-normal font-['Inter'] rotate-90">領収書</div>
  <div className="w-[663px] h-[880px] left-[729px] top-[108px] absolute outline outline-1 outline-offset-[-1px] outline-zinc-300 overflow-y-auto">
    {outDriverUndecidedSampleData.map((item: OutDriverUndecided, index: number) => (
      <div key={item.id} className={`w-[657px] h-6 left-0 absolute ${index % 2 === 1 ? 'bg-zinc-200' : 'bg-white'} ${index === 0 ? 'border-t border-zinc-400' : ''}`} style={{ top: `${index * 24}px` }}>
      <Button
        className="w-10 h-6 px-0.5 py-[1px] left-0 top-0 absolute rounded-[2px] bg-gradient-to-b from-white via-cyan-100 to-cyan-300 hover:from-white hover:via-cyan-200 hover:to-cyan-400 active:from-cyan-400 active:via-cyan-300 active:to-cyan-200 text-black text-[13px] font-normal font-['Inter'] border-2 border-t-white border-l-white border-r-zinc-600 border-b-zinc-600 shadow-[3px_3px_5px_rgba(0,0,0,0.35),inset_0_1px_0_rgba(255,255,255,0.9)] active:shadow-none active:border-t-zinc-600 active:border-l-zinc-600 active:border-r-zinc-300 active:border-b-zinc-300 active:translate-x-[2px] active:translate-y-[2px] transition-transform duration-75"
        onClick={() => {}}
      >
        開始
      </Button>
      <div className="w-[70px] h-6 left-[40px] top-0 absolute bg-yellow-200 border-r border-b border-zinc-400" />
      <div className="w-[66px] left-[44px] top-[3px] absolute justify-end text-black text-[13px] font-normal font-['Inter']">{item.hostessName}</div>
      <div className="w-[44px] h-6 left-[110px] top-0 absolute border-r border-b border-zinc-400" />
      <div className="w-[40px] left-[112px] top-[3px] absolute text-center justify-end text-black text-[13px] font-normal font-['Inter']">{item.shopCode || ''}</div>
      <div className="w-32 h-6 left-[290px] top-0 absolute border-r border-b border-zinc-400" />
      <div className="w-32 left-[292px] top-[3px] absolute justify-end text-black text-[13px] font-normal font-['Inter']">{item.destination}</div>
      <div className="w-16 h-6 left-[418px] top-0 absolute border-r border-b border-zinc-400" />
      <div className="w-14 h-3.5 left-[422px] top-[3px] absolute justify-end text-black text-[13px] font-normal font-['Inter']">{item.station}</div>
      <div className={`w-10 h-6 left-[482px] top-0 absolute border-r border-b border-zinc-400 ${item.in_driver ? 'bg-yellow-200' : ''}`} />
      {item.in_driver && (
        <div className="w-9 left-[484px] top-[3px] absolute justify-end text-black text-[13px] font-normal font-['Inter']">{item.in_driver}</div>
      )}
      <div className={`w-10 h-6 left-[522px] top-0 absolute border-r border-b border-zinc-400 ${item.out_driver ? 'bg-yellow-200' : ''}`} />
      {item.out_driver && (
        <div className="w-9 left-[524px] top-[3px] absolute justify-end text-black text-[13px] font-normal font-['Inter']">{item.out_driver}</div>
      )}
      <div className="w-12 h-6 left-[242px] top-0 absolute border-r border-b border-zinc-400" />
      <div className="w-11 left-[244px] top-[3px] absolute text-center justify-end text-red-800 text-[13px] font-normal font-['Inter']">{item.arrivalTime}</div>
      <div className="w-12 h-6 left-[194px] top-0 absolute border-r border-b border-zinc-400" />
      <div className="w-11 left-[196px] top-[3px] absolute text-center justify-end text-black text-[13px] font-normal font-['Inter']">{item.pickupTime}</div>
      <div className="w-10 h-6 left-[154px] top-0 absolute border-r border-b border-zinc-400" />
      <div className="w-3 left-[180px] top-[3px] absolute text-center justify-end text-black text-[13px] font-normal font-['Inter']">分</div>
      <div className="w-5 left-[158px] top-[3px] absolute text-right justify-end text-black text-[13px] font-normal font-['Inter']">{item.timeTotal}</div>
      <div className="w-[19px] h-6 left-[638px] top-0 absolute border-r border-b border-zinc-400" />
      <div className="w-[19px] h-6 left-[619px] top-0 absolute border-r border-b border-zinc-400" />
      <div className="w-[19px] h-6 left-[600px] top-0 absolute border-r border-b border-zinc-400" />
      <div className="w-[19px] h-6 left-[581px] top-0 absolute border-r border-b border-zinc-400" />
      <div className="w-[19px] h-6 left-[562px] top-0 absolute border-r border-b border-zinc-400" />
      </div>
    ))}
  </div>

  {/* 終了リスト */}
  <div className="w-[338px] h-5 left-[1392px] top-[75px] absolute bg-fuchsia-300" />
  <div className="w-[338px] left-[1392px] top-[77px] absolute text-center justify-end text-black text-[13px] font-normal font-['Inter']">終了リスト</div>
  <div className="w-[338px] h-[65px] left-[1392px] top-[108px] absolute outline outline-1 outline-offset-[-1px] outline-zinc-300 overflow-y-auto">
    {completedListSampleData.map((item: CompletedList, index: number) => {
    const topPosition = index * 22;
    return (
      <div key={item.id} className={`w-[338px] h-5 absolute ${index % 2 === 1 ? 'bg-zinc-200' : 'bg-white'} ${index === 0 ? 'border-t border-zinc-400' : ''}`} style={{ left: 0, top: topPosition }}>
        {item.option1 && (
          <>
            <div className="w-[54px] h-5 absolute bg-yellow-200 border-r border-b border-zinc-400" style={{ left: 278, top: 0 }} />
            <div className="w-12 absolute justify-end text-black text-[13px] font-normal font-['Inter']" style={{ left: 280, top: 2 }}>{item.option1}</div>
          </>
        )}
        <div className="w-[86px] h-5 absolute bg-yellow-200 border-r border-b border-zinc-400" style={{ left: 0, top: 0 }} />
        <div className="w-[82px] absolute justify-end text-black text-[13px] font-normal font-['Inter']" style={{ left: 2, top: 2 }}>{item.hostessName}</div>
        <div className="w-10 h-5 absolute border-r border-b border-zinc-400" style={{ left: 126, top: 0 }} />
        <div className="w-9 absolute text-center justify-end text-black text-[13px] font-normal font-['Inter']" style={{ left: 128, top: 2 }}>{item.arrivalTime}</div>
        <div className="w-10 h-5 absolute border-r border-b border-zinc-400" style={{ left: 86, top: 0 }} />
        <div className="w-9 absolute text-center justify-end text-black text-[13px] font-normal font-['Inter']" style={{ left: 88, top: 2 }}>{item.pickupTime}</div>
        <div className="w-28 h-5 absolute border-r border-b border-zinc-400" style={{ left: 166, top: 0 }} />
        <div className="w-28 absolute justify-end text-black text-[13px] font-normal font-['Inter']" style={{ left: 169, top: 2 }}>{item.destination}</div>
      </div>
    );
    })}
  </div>
  
  <div className="w-[172px] h-5 left-[1564px] top-[517px] absolute bg-yellow-200" />
  <div className="w-[172px] left-[1564px] top-[519px] absolute text-center justify-end text-black text-[13px] font-normal font-['Inter']">精算告知済　ドライバー</div>
  <div className="w-[172px] h-[176px] left-[1564px] top-[537px] absolute outline outline-1 outline-offset-[-1px] outline-rose-300/60 overflow-y-auto">
    <div className="w-[172px] h-5 left-0 top-0 absolute bg-zinc-300" />
    <div className="w-[172px] h-5 left-0 top-[20px] absolute bg-zinc-300" />
    <div className="w-[172px] h-5 left-0 top-[40px] absolute bg-zinc-300" />
    <div className="w-[172px] h-5 left-0 top-[60px] absolute bg-zinc-300" />
    <div className="w-[172px] h-5 left-0 top-[80px] absolute bg-zinc-300" />
  </div>


  <div className="w-[172px] h-5 left-[1392px] top-[713px] absolute bg-yellow-200" />
  <div className="w-[172px] left-[1392px] top-[715px] absolute text-center justify-end text-black text-[13px] font-normal font-['Inter']">南IC待機　ドライバー</div>
  <div className="w-[172px] h-44 left-[1392px] top-[733px] absolute outline outline-1 outline-offset-[-1px] outline-rose-300/60 overflow-y-auto">
    <div className="w-[172px] h-5 left-0 top-0 absolute bg-zinc-300" />
    <div className="w-[172px] h-5 left-0 top-[20px] absolute bg-zinc-300" />
    <div className="w-[172px] h-5 left-0 top-[40px] absolute bg-zinc-300" />
    <div className="w-[172px] h-5 left-0 top-[60px] absolute bg-zinc-300" />
    <div className="w-[172px] h-5 left-0 top-[80px] absolute bg-zinc-300" />
  </div>
  


  


  {/* 南IC事務所　待機 */}
  <div className="w-[172px] h-5 left-[1392px] top-[173px] absolute bg-cyan-100" />
  <div className="w-[172px] left-[1392px] top-[175px] absolute text-center justify-end text-black text-[13px] font-normal font-['Inter']">南IC事務所　待機</div>
  <div className="w-[172px] h-[520px] left-[1392px] top-[193px] absolute outline outline-1 outline-offset-[-1px] outline-zinc-300 overflow-y-auto">
    {officeWaitingSampleData.map((item: OfficeWaiting, index: number) => {
      const topPosition = index * 22;
      return (
        <div key={item.id} className={`w-[172px] h-5 left-0 absolute ${index % 2 === 1 ? 'bg-zinc-200' : 'bg-white'} ${index === 0 ? 'border-t border-zinc-400' : ''}`} style={{ top: `${topPosition}px` }}>
          <div className="w-[18px] h-5 left-[148px] absolute border-r border-b border-zinc-400" style={{ top: 0 }} />
          <div className="w-[18px] h-5 left-[130px] absolute border-r border-b border-zinc-400" style={{ top: 0 }} />
          <div className="w-[18px] h-5 left-[112px] absolute border-r border-b border-zinc-400" style={{ top: 0 }} />
          <div className="w-[70px] h-5 left-0 absolute bg-yellow-200 border-r border-b border-zinc-400" style={{ top: 0 }} />
          <div className="w-16 left-[3px] absolute justify-end text-black text-[13px] font-normal font-['Inter']" style={{ top: 2 }}>{item.hostessName}</div>
          <div className="w-[42px] h-5 left-[70px] absolute border-r border-b border-zinc-400" style={{ top: 0 }} />
          <div className="w-9 left-[73px] absolute text-center justify-end text-black text-[13px] font-normal font-['Inter']" style={{ top: 2 }}>{item.departureTime}</div>
        </div>
      );
    })}
  </div>
  
  {/* FGCS　他撮影中 */}
  <div className="w-[172px] h-5 left-[1564px] top-[173px] absolute bg-fuchsia-300" />
  <div className="w-[172px] left-[1564px] top-[175px] absolute text-center justify-end text-black text-[13px] font-normal font-['Inter']">FGCS　他撮影中</div>
  <div className="w-[172px] h-[64px] left-[1564px] top-[193px] absolute outline outline-1 outline-offset-[-1px] outline-zinc-300 overflow-y-auto">
    {shootingSampleData.map((item: Shooting, index: number) => {
      const topPosition = index * 22;
      return (
        <React.Fragment key={item.id}>
          <div className="w-[18px] h-5 left-[148px] absolute border border-rose-300/60" style={{ top: `${topPosition}px` }} />
          <div className="w-[18px] h-5 left-[130px] absolute border border-rose-300/60" style={{ top: `${topPosition}px` }} />
          <div className="w-[18px] h-5 left-[112px] absolute border border-rose-300/60" style={{ top: `${topPosition}px` }} />
          <div className="w-[70px] h-5 left-0 absolute bg-yellow-200 border border-rose-300/60" style={{ top: `${topPosition}px` }} />
          <div className="w-16 left-[3px] absolute justify-end text-black text-[13px] font-normal font-['Inter']" style={{ top: `${topPosition + 2}px` }}>{item.hostessName}</div>
          <div className="w-[42px] h-5 left-[70px] absolute border border-rose-300/60" style={{ top: `${topPosition}px` }} />
          <div className="w-9 left-[73px] absolute text-center justify-end text-black text-[13px] font-normal font-['Inter']" style={{ top: `${topPosition + 2}px` }}>{item.departureTime}</div>
        </React.Fragment>
      );
    })}
  </div>

  {/* 南IC徒歩派遣or仮置き */}
  <div className="w-[172px] h-5 left-[1564px] top-[257px] absolute bg-cyan-100" />
  <div className="w-[172px] h-5 left-[1564px] top-[259px] absolute text-center justify-end text-black text-[13px] font-normal font-['Inter']">南IC徒歩派遣or仮置き</div>
  <div className="w-[172px] h-60 left-[1564px] top-[277px] absolute outline outline-1 outline-offset-[-1px] outline-zinc-300 overflow-y-auto">
    {walkingDispatchSampleData.map((item: WalkingDispatch, index: number) => {
      const topPosition = index * 22;
      return (
        <React.Fragment key={item.id}>
          <div className="w-[70px] h-5 left-0 absolute bg-yellow-200 border border-rose-300/60" style={{ top: `${topPosition}px` }} />
          <div className="w-16 left-[3px] absolute justify-end text-black text-[13px] font-normal font-['Inter']" style={{ top: `${topPosition + 2}px` }}>{item.hostessName}</div>
          <div className="w-[42px] h-5 left-[70px] absolute border border-rose-300/60" style={{ top: `${topPosition}px` }} />
          <div className="w-9 left-[73px] absolute text-center justify-end text-black text-[13px] font-normal font-['Inter']" style={{ top: `${topPosition + 2}px` }}>{item.departureTime}</div>
          <div className="w-[18px] h-5 left-[112px] absolute border border-rose-300/60" style={{ top: `${topPosition}px` }} />
          <div className="w-[18px] h-5 left-[130px] absolute border border-rose-300/60" style={{ top: `${topPosition}px` }} />
          <div className="w-[18px] h-5 left-[148px] absolute border border-rose-300/60" style={{ top: `${topPosition}px` }} />
        </React.Fragment>
      );
    })}
  </div>


  
  


  {/* 帰宅ホステス */}

  <div className="w-[240px] h-5 left-[1736px] top-[568px] absolute bg-cyan-100" />
  <div className="w-[240px] left-[1736px] top-[570px] absolute text-center justify-end text-black text-[13px] font-normal font-['Inter']">帰宅ホステス</div>
  <div className="w-[240px] h-5 left-[1736px] top-[588px] absolute bg-yellow-200" />
  <div className="w-[240px] left-[1736px] top-[590px] absolute text-center justify-end text-black text-[13px] font-normal font-['Inter']">自宅or寮　待機</div>
  <div className="w-[240px] h-[105px] left-[1736px] top-[608px] absolute outline outline-1 outline-offset-[-1px] outline-rose-300/60 overflow-y-auto">
    {returningHostessSampleData.map((item: ReturningHostess, index: number) => {
      const topPosition = index * 22;
      return (
        <div key={item.id} className="w-[243px] h-5 left-0 absolute bg-zinc-300" style={{ top: `${topPosition}px` }}>
          <div className="w-60 h-5 left-0 top-0 absolute justify-center text-black text-[13px] font-normal font-['Inter']">
            {item.hostessName} - {item.returnTime} - {item.location}
          </div>
        </div>
      );
    })}
  </div>

  {/* ホステス送り・帰宅 */}
  <div className="w-[249px] h-5 left-[1736px] top-[75px] absolute bg-yellow-200" />
  <div className="w-[249px] left-[1736px] top-[77px] absolute text-center justify-end text-black text-[13px] font-normal font-['Inter']">ホステス送り・帰宅</div>
  <div className="w-5 left-[1736px] top-[96px] absolute text-center justify-end text-black text-[8px] font-normal font-['Inter']">荷物</div>
  <div className="w-[42px] left-[1797px] top-[96px] absolute text-center justify-end text-black text-[8px] font-normal font-['Inter']">終了</div>
  <div className="w-[42px] left-[1839px] top-[96px] absolute text-center justify-end text-black text-[8px] font-normal font-['Inter']">帰宅</div>
  <div className="w-[19px] left-[1947px] top-[96px] absolute text-center justify-end text-black text-[8px] font-normal font-['Inter']">件数</div>
  <div className="w-[54px] left-[1739px] top-[96px] absolute justify-end text-black text-center text-[8px] font-normal font-['Inter']">ホステス名</div>
  <div className="w-[66px] left-[1879px] top-[96px] absolute justify-end text-black text-[8px] text-center font-normal font-['Inter']">送り場所</div>
  <div className="w-[249px] h-[460px] left-[1736px] top-[108px] absolute outline outline-1 outline-offset-[-1px] outline-zinc-300 overflow-y-auto overflow-y-hidden">
    {hostessTransportSampleData.map((item: HostessTransport, index: number) => {
      const topPosition = index * 22;
      return (
        <React.Fragment key={item.id}>
          <div className="w-[42px] h-5 left-[116px] absolute bg-zinc-300 border border-indigo-200/60" style={{ top: `${topPosition}px` }} />
          <div className="w-9 left-[119px] absolute text-center justify-end text-pink-500 text-[13px] font-normal font-['Inter']" style={{ top: `${topPosition + 2}px` }}>{item.returnTime}</div>
          <div className="w-[42px] h-5 left-[74px] absolute bg-zinc-300 border border-rose-300/60" style={{ top: `${topPosition}px` }} />
          <div className="w-9 left-[77px] absolute text-center justify-end text-orange-500 text-[13px] font-normal font-['Inter']" style={{ top: `${topPosition + 2}px` }}>{item.departureTime}</div>
          <div className="w-[66px] h-5 left-[158px] absolute bg-zinc-300 border border-rose-300/60" style={{ top: `${topPosition}px` }} />
          <div className="w-[69px] left-[161px] absolute justify-end text-black text-[13px] font-normal font-['Inter']" style={{ top: `${topPosition + 2}px` }}>{item.destination}</div>
          <div className="w-[19px] h-5 left-[224px] absolute bg-zinc-300 border border-indigo-200/60" style={{ top: `${topPosition}px` }} />
          <div className="w-3 h-3.5 left-[227px] absolute text-center justify-end text-black text-[13px] font-normal font-['Inter']" style={{ top: `${topPosition + 2}px` }}>{item.count}</div>
          <div className="w-[54px] h-5 left-[20px] absolute bg-zinc-300 border border-indigo-200/60" style={{ top: `${topPosition}px` }} />
          <div className="w-12 left-[23px] absolute justify-end text-black text-[13px] font-normal font-['Inter']" style={{ top: `${topPosition + 2}px` }}>{item.hostessName.split(' ')[1] || item.hostessName}</div>
          <div className="size-5 left-0 absolute flex items-center justify-center bg-rose-100" style={{ top: `${topPosition}px` }}>
            <Package className={`size-4 ${(item.count ?? 0) === 0 ? 'text-stone-500' : 'text-red-500'}`} />
          </div>
        </React.Fragment>
      );
    })}
  </div>
  
  
  {/* 予定(打ち合わせ・撮影など) */}
  <div className="w-[406px] h-5 left-[1564px] top-[713px] absolute bg-purple-300" />
  <div className="w-[406px] left-[1564px] top-[715px] absolute text-center justify-end text-black text-[13px] font-normal font-['Inter']">予定(打ち合わせ・撮影など)</div>
  <div className="w-[406px] h-[100px] left-[1564px] top-[733px] absolute outline outline-1 outline-offset-[-1px] outline-zinc-300 overflow-y-auto">
    {scheduleItemSampleData.map((item: ScheduleItem, index: number) => {
      const topPosition = index * 34;
      return (
        <div key={item.id} className="w-[406px] h-8 left-0 absolute" style={{ top: `${topPosition}px` }}>
          <div className="w-[406px] h-8 left-0 top-0 absolute bg-zinc-300" />
          <div className="w-[406px] h-8 left-0 top-0 absolute justify-center text-black text-[13px] font-normal font-['Inter']">
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
    className="w-[172px] h-20 left-[1392px] top-[833px] absolute bg-rose-300/60 hover:bg-rose-400/60 text-black text-[13px] font-normal font-['Inter']"
    onClick={() => {
      window.open('/dispatch-panel-2d-sub', 'driverDispatchPanel', 'width=1920,height=1080,menubar=no,toolbar=no,location=no,status=no');
    }}
  >
    ドライバ配車パネル
  </Button>


  {/* 面接予定 */}
  <div className="w-[406px] h-5 left-[1564px] top-[833px] absolute bg-rose-300/60" />
  <div className="w-[406px] left-[1564px] top-[835px] absolute text-center justify-end text-black text-[13px] font-normal font-['Inter']">面接予定</div>
  <div className="w-[406px] h-[130px] left-[1564px] top-[853px] absolute outline outline-1 outline-offset-[-1px] outline-zinc-300 overflow-y-auto">
    {driverDispatchPanelSampleData.map((item: DriverDispatchPanel, index: number) => {
      const topPosition = index * 22;
      return (
        <React.Fragment key={item.id}>
          <div className="w-[18px] h-5 left-[78px] absolute bg-purple-300 border border-neutral-300" style={{ top: `${topPosition}px` }} />
          <div className="w-9 h-5 left-0 absolute bg-purple-300 border border-neutral-300" style={{ top: `${topPosition}px` }} />
          <div className="w-3 left-[81px] absolute text-center justify-end text-black text-[13px] font-normal font-['Inter']" style={{ top: `${topPosition + 2}px` }}>{item.status === 'completed' ? '済' : ''}</div>
          <div className="w-6 left-[6px] absolute text-center justify-end text-black text-[13px] font-normal font-['Inter']" style={{ top: `${topPosition + 2}px` }}>{item.type === 'entry' ? '入店' : ''}</div>
          <div className="w-[42px] h-5 left-[36px] absolute border border-rose-300/60" style={{ top: `${topPosition}px` }} />
          <div className="w-9 left-[39px] absolute text-center justify-end text-black text-[13px] font-normal font-['Inter']" style={{ top: `${topPosition + 2}px` }}>{item.time}</div>
          <div className="w-48 h-5 left-[96px] absolute bg-purple-300 border border-neutral-300" style={{ top: `${topPosition}px` }} />
          <div className="w-44 left-[99px] absolute justify-end text-black text-[13px] font-normal font-['Inter']" style={{ top: `${topPosition + 2}px` }}>{item.location}</div>
          {item.hostessName1 && (
            <>
              <div className="w-14 h-5 left-[288px] absolute bg-yellow-200 border border-indigo-200/60" style={{ top: `${topPosition}px` }} />
              <div className="w-12 left-[291px] absolute justify-end text-black text-[13px] font-normal font-['Inter']" style={{ top: `${topPosition + 2}px` }}>{item.hostessName1}</div>
            </>
          )}
          {item.hostessName2 && (
            <>
              <div className="w-14 h-5 left-[344px] absolute bg-yellow-200 border border-indigo-200/60" style={{ top: `${topPosition}px` }} />
              <div className="w-12 left-[347px] absolute justify-end text-black text-[13px] font-normal font-['Inter']" style={{ top: `${topPosition + 2}px` }}>{item.hostessName2}</div>
            </>
          )}
        </React.Fragment>
      );
    })}
  </div>
      </div>
    </div>
  );
}