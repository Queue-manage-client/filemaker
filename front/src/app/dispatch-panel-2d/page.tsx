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
    <div className="w-[1920px] h-[1080px] relative overflow-hidden">
      {/* ヘッダー */}
      <div className="absolute left-0 top-0 right-0 z-10 h-[50px] bg-white border-b border-zinc-300">
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
            {/* 配車パネル2Dタイトル */}
            <h1 className="text-lg font-bold mr-2">配車パネル2D</h1>

            {/* 日付移動 */}
            <Button
              variant="outline"
              className="h-8 px-3 text-xs border-black"
              onClick={() => {}}
            >
              日付移動
            </Button>

            {/* ドライバ精算 */}
            <Button
              className="h-8 px-4 text-xs bg-lime-400 hover:bg-lime-500 text-black border border-black"
              onClick={() => {}}
            >
              ドライバ精算
            </Button>

            {/* 新顧客検索 */}
            <Button
              variant="outline"
              className="h-8 px-4 text-xs border-black"
              onClick={() => {}}
            >
              新顧客検索
            </Button>

            {/* RT IIパネル */}
            <Button
              className="h-8 px-4 text-xs bg-purple-400 hover:bg-purple-500 text-black border border-black"
              onClick={() => {}}
            >
              RT IIパネル
            </Button>

            {/* RTパネル */}
            <Button
              className="h-8 px-4 text-xs bg-orange-400 hover:bg-orange-500 text-black border border-black"
              onClick={() => {}}
            >
              RTパネル
            </Button>

            {/* 手配表 */}
            <Button
              variant="outline"
              className="h-8 px-4 text-xs border-black"
              onClick={() => {}}
            >
              手配表
            </Button>

            {/* Menu */}
            <Button
              variant="outline"
              className="h-8 px-4 text-xs border-black"
              onClick={() => {}}
            >
              Menu
            </Button>

            {/* チャット表示 */}
            <Button
              className="h-8 px-4 text-xs bg-cyan-300 hover:bg-cyan-400 text-black border border-black"
              onClick={() => {}}
            >
              チャット表示
            </Button>
          </div>
        </div>
      </div>
  
    {/* スタッフ予定リスト */}
    <div className="w-[344px] h-5 left-[4px] top-[708px] absolute bg-lime-200" />
    <div className="w-[344px] left-[4px] top-[710px] absolute text-center justify-end text-black text-xs font-normal font-['Inter']">スタッフ予定リスト</div>
    <div className="w-[344px] h-96 left-[4px] top-[728px] absolute outline outline-1 outline-offset-[-1px] outline-zinc-300 overflow-y-auto relative">
      {staffScheduleSampleData.map((schedule: StaffSchedule, index: number) => {
        const topPosition = index * 36;
        return (
          <div key={schedule.id} className="w-[344px] h-8 left-0 absolute" style={{ top: `${topPosition}px` }}>
            <div className={`w-[344px] h-8 left-0 top-0 absolute ${schedule.isHighlighted ? 'bg-lime-200' : 'bg-white'}`} />
            <div className="w-[344px] h-8 left-0 top-0 absolute justify-center text-black text-xs font-normal font-['Inter']">
              {schedule.driverName}→{schedule.destination}<br />{schedule.note}
            </div>
          </div>
        );
      })}
  </div>

  {/* INドラ未定予約リスト */}
  <div className="w-10 h-4 left-[696px] top-[78px] absolute text-center justify-center text-black text-[8px] font-normal font-['Inter'] rotate-90">オプション</div>
  <div className="w-10 h-4 left-[680px] top-[85px] absolute text-center justify-center text-black text-[8px] font-normal font-['Inter'] rotate-90">カード</div>
  <div className="w-10 h-4 left-[664px] top-[85px] absolute text-center justify-center text-black text-[8px] font-normal font-['Inter'] rotate-90">着TEL</div>
  <div className="w-10 h-4 left-[648px] top-[85px] absolute text-center justify-center text-black text-[8px] font-normal font-['Inter'] rotate-90">待合せ</div>
  <div className="w-10 h-4 left-[632px] top-[85px] absolute text-center justify-center text-black text-[8px] font-normal font-['Inter'] rotate-90">領収書</div>
  <div className="w-10 left-[606px] top-[95px] absolute text-center justify-end text-black text-[8px] font-normal font-['Inter']">時間計</div>
  <div className="w-8 left-[425px] top-[95px] absolute text-center justify-end text-black text-[8px] font-normal font-['Inter']">迎え場所</div>
  <div className="w-[42px] left-[348px] top-[95px] absolute text-center justify-end text-black text-[8px] font-normal font-['Inter']">出勤</div>
  <div className="w-[70px] left-[488px] top-[95px] absolute text-center justify-end text-black text-[8px] font-normal font-['Inter']">ホステス名</div>
  <div className="w-32 h-5 left-[499px] top-[75px] absolute bg-lime-200" />
  <div className="w-32 left-[502px] top-[77px] absolute text-center justify-end text-black text-xs font-normal font-['Inter']">INドラ未定予約リスト</div>
  <div className="w-[378px] h-[600px] left-[348px] top-[108px] absolute outline outline-1 outline-offset-[-1px] outline-zinc-300 overflow-y-auto">
    {undecidedDriverReservationSampleData.map((reservation: UndecidedDriverReservation, index: number) => {
      const topPosition = index * 22;
      return (
        <div key={reservation.id} className="w-[378px] h-5 left-0 absolute" style={{ top: `${topPosition}px` }}>
          {reservation.hasOption5 && (
            <div className="w-4 h-5 left-[362px] top-0 absolute border border-rose-300/60" />
          )}
          {reservation.hasOption4 && (
            <div className="w-4 h-5 left-[346px] top-0 absolute border border-indigo-200/60" />
          )}
          {reservation.hasOption3 && (
            <div className="w-4 h-5 left-[330px] top-0 absolute border border-rose-300/60" />
          )}
          {reservation.hasOption2 && (
            <div className="w-4 h-5 left-[314px] top-0 absolute border border-indigo-200/60" />
          )}
          {reservation.hasOption1 && (
            <div className="w-4 h-5 left-[298px] top-0 absolute border border-rose-300/60" />
          )}
          <div className="w-10 h-5 left-[258px] top-0 absolute border border-indigo-200/60" />
          <div className="w-3 left-[284px] top-[2px] absolute text-center justify-end text-black text-xs font-normal font-['Inter']">分</div>
          <div className="w-5 left-[262px] top-[2px] absolute text-right justify-end text-black text-xs font-normal font-['Inter']">{reservation.timeTotal}</div>
          <div className="w-12 h-5 left-[210px] top-0 absolute border border-neutral-300" />
          <div className="w-10 left-[214px] top-[2px] absolute text-center justify-end text-black text-xs font-normal font-['Inter']">{reservation.sColumn}</div>
          {reservation.isConfirmed && (
            <>
              <div className="w-[20px] h-5 left-[40px] top-0 absolute bg-purple-300 border border-neutral-300" />
              <div className="w-3 left-[44px] top-[2px] absolute text-center justify-end text-black text-xs font-normal font-['Inter']">確</div>
            </>
          )}
          <div className="w-[70px] h-5 left-[140px] top-0 absolute bg-yellow-200 border border-rose-300/60" />
          <div className="w-[66px] left-[142px] top-[2px] absolute justify-end text-black text-xs font-normal font-['Inter']">{reservation.area} {reservation.hostessName}</div>
          <div className="w-16 h-5 left-[60px] top-0 absolute border border-indigo-200/60" />
          <div className="w-14 left-[63px] top-[2px] absolute justify-end text-black text-xs font-normal font-['Inter']">{reservation.pickupLocation}</div>
          <div className="w-4 h-[20px] left-[124px] top-0 absolute bg-purple-300 border border-neutral-300"/>
          <div className="w-10 h-5 left-0 top-0 absolute bg-purple-300" />
          <div className="w-9 left-[3px] top-[2px] absolute text-center justify-end text-black text-xs font-normal font-['Inter']">{reservation.departureTime}</div>
        </div>
      );
    })}
  </div>
  {/* メモ・引継事項　ドラ休憩 */}
  <div className="w-[378px] h-5 left-[348px] top-[708px] absolute bg-fuchsia-300" />
  <div className="w-[378px] left-[350px] top-[711px] absolute text-center justify-end text-black text-xs font-normal font-['Inter']">メモ・引継事項　ドラ休憩</div>
  <div className="w-[378px] h-[338px] left-[348px] top-[728px] absolute outline outline-1 outline-offset-[-1px] outline-zinc-300 overflow-y-auto">
    {memoItemSampleData.map((memo: MemoItem, index: number) => {
      const topPosition = index * 34;
      return (
        <div key={memo.id} className="w-[378px] h-8 left-0 absolute" style={{ top: `${topPosition}px` }}>
          
          <div className="w-[378px] h-8 left-0 top-0 absolute bg-zinc-300" />
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
          <div className="w-[378px] h-8 left-0 top-0 absolute justify-center text-black text-xs font-normal font-['Inter']">
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
  <div className="w-[344px] h-5 left-[4px] top-[75px] absolute bg-cyan-200" />
  <div className="w-[344px] left-[4px] top-[77px] absolute text-center justify-end text-black text-xs font-normal font-['Inter']">出勤予定ホステス</div>
  <div className="w-4 left-[308px] top-[95px] absolute text-center justify-end text-black text-[8px] font-normal font-['Inter']">帰宅</div>
  <div className="w-4 left-[266px] top-[95px] absolute text-center justify-end text-black text-[8px] font-normal font-['Inter']">終了</div>
  <div className="w-8 left-[204px] top-[95px] absolute text-center justify-end text-black text-[8px] font-normal font-['Inter']">迎え場所</div>
  <div className="w-4 left-[158px] top-[95px] absolute text-center justify-end text-black text-[8px] font-normal font-['Inter']">出勤</div>
  <div className="w-4 left-[136px] top-[95px] absolute text-center justify-end text-black text-[8px] font-normal font-['Inter']">決定</div>
  <div className="w-9 left-[96px] top-[95px] absolute text-center justify-end text-black text-[8px] font-normal font-['Inter']">迎えドラ</div>
  <div className="w-12 left-[40px] top-[95px] absolute justify-end text-black text-[8px] font-normal font-['Inter']">ホステス名</div>
  <div className="w-[344px] h-[600px] left-[4px] top-[108px] absolute outline outline-1 outline-offset-[-1px] outline-zinc-300 overflow-y-auto">
    {scheduledHostessSampleData.map((hostess: ScheduledHostess, index: number) => {
      const topPosition = index * 22;
      return (
        <div key={hostess.id} className="w-[333px] h-5 left-[1px] absolute" style={{ top: `${topPosition}px` }}>
          
          <div className="w-[194px] h-5 left-[148px] top-0 absolute bg-zinc-300" />
          <div className="w-4 h-5 left-[132px] top-0 absolute bg-zinc-400" />
          <div className="w-[70px] h-5 left-[20px] top-0 absolute bg-yellow-200" />
          <div className="w-5 h-5 left-0 top-0 absolute bg-zinc-300" />
          <div className="w-9 left-[303px] top-[2px] absolute text-center justify-end text-pink-500 text-xs font-normal font-['Inter']">{hostess.endTime}</div>
          <div className="w-9 left-[261px] top-[2px] absolute text-center justify-end text-orange-500 text-xs font-normal font-['Inter']">{hostess.startTime}</div>
          <div className="w-20 left-[195px] top-[2px] absolute justify-end text-black text-xs font-normal font-['Inter']">{hostess.location}</div>
          <div className="w-9 left-[153px] top-[2px] absolute text-center justify-end text-lime-500 text-xs font-normal font-['Inter']">{hostess.arrivalTime}</div>
          <div className="w-3 left-[135px] top-[2px] absolute text-center justify-end text-white text-xs font-normal font-['Inter']">{hostess.count}</div>
          <div className="w-9 left-[93px] top-[2px] absolute justify-end text-black text-xs font-normal font-['Inter']">{hostess.driverName}</div>
          <div className="w-12 left-[39px] top-[2px] absolute justify-end text-black text-xs font-normal font-['Inter']">{hostess.hostessName}</div>
          <div className="left-[22px] top-[2px] absolute text-center justify-end text-black text-xs font-normal font-['Inter']">{hostess.area}</div>
          <div className="w-3.5 h-1.5 left-[8px] top-[4px] absolute origin-top-left rotate-90 bg-rose-300/60" />
        </div>
      );
    })}
    <div className="w-[334px] h-5 left-[1px] top-[80px] absolute">
      
    </div>
  </div>

  {/* OUTドラ未定予約リスト */}
  <div className="w-40 h-5 left-[958px] top-[75px] absolute bg-lime-200" />
  <div className="w-40 left-[961px] top-[77px] absolute text-center justify-end text-black text-xs font-normal font-['Inter']">OUTドラ未定・接客中リスト</div>

  {/* ヘッダー行 */}
  <div className="w-10 left-[726px] top-[95px] absolute text-center justify-end text-black text-[8px] font-normal font-['Inter']">開始</div>
  <div className="w-[26px] left-[766px] top-[95px] absolute text-center justify-end text-black text-[8px] font-normal font-['Inter']">HP</div>
  <div className="w-[70px] left-[792px] top-[95px] absolute text-center justify-end text-black text-[8px] font-normal font-['Inter']">ホステス名</div>
  <div className="w-10 left-[862px] top-[95px] absolute text-center justify-end text-black text-[8px] font-normal font-['Inter']">時間計</div>
  <div className="w-10 left-[902px] top-[95px] absolute text-center justify-end text-black text-[8px] font-normal font-['Inter']">開始</div>
  <div className="w-10 left-[942px] top-[95px] absolute text-center justify-end text-black text-[8px] font-normal font-['Inter']">終了</div>
  <div className="w-28 left-[982px] top-[95px] absolute text-center justify-end text-black text-[8px] font-normal font-['Inter']">場所</div>
  <div className="w-14 left-[1094px] top-[95px] absolute text-center justify-end text-black text-[8px] font-normal font-['Inter']">駅</div>
  <div className="w-5 left-[1094px] top-[95px] absolute text-center justify-end text-black text-[8px] font-normal font-['Inter']">確</div>
  <div className="w-10 left-[1170px] top-[95px] absolute text-center justify-end text-black text-[8px] font-normal font-['Inter']">INドラ</div>
  <div className="w-10 left-[1210px] top-[95px] absolute text-center justify-end text-black text-[8px] font-normal font-['Inter']">OUTドラ</div>
  <div className="w-10 h-4 left-[1300px] top-[78px] absolute text-center justify-center text-black text-[8px] font-normal font-['Inter'] rotate-90">オプション</div>
  <div className="w-10 h-4 left-[1284px] top-[85px] absolute text-center justify-center text-black text-[8px] font-normal font-['Inter'] rotate-90">カード</div>
  <div className="w-10 h-4 left-[1270px] top-[85px] absolute text-center justify-center text-black text-[8px] font-normal font-['Inter'] rotate-90">着TEL</div>
  <div className="w-10 h-4 left-[1252px] top-[85px] absolute text-center justify-center text-black text-[8px] font-normal font-['Inter'] rotate-90">待合せ</div>
  <div className="w-10 h-4 left-[1236px] top-[85px] absolute text-center justify-center text-black text-[8px] font-normal font-['Inter'] rotate-90">領収書</div>
  <div className="w-[604px] h-[880px] left-[726px] top-[108px] absolute outline outline-1 outline-offset-[-1px] outline-zinc-300 overflow-y-auto">
    {outDriverUndecidedSampleData.map((item: OutDriverUndecided, index: number) => (
      <div key={item.id} className="w-[604px] h-5 left-0 absolute" style={{ top: `${index * 22}px` }}>
      <Button
        className="w-10 h-5 px-[3px] pt-0.5 pb-[3px] left-0 top-0 absolute bg-cyan-100 hover:bg-cyan-200 text-black text-xs font-normal font-['Inter'] p-0"
        onClick={() => {}}
      >
        開始
      </Button>
      <Button
        className="w-[26px] h-5 left-[40px] top-0 absolute bg-rose-100 hover:bg-rose-200 text-black text-xs font-normal font-['Inter'] p-0"
        onClick={() => {}}
      >
        HP
      </Button>
      <div className="w-[70px] h-5 left-[66px] top-0 absolute bg-yellow-200 border border-rose-300/60" />
      <div className="w-[66px] left-[70px] top-[2px] absolute justify-end text-black text-xs font-normal font-['Inter']">{item.hostessName}</div>
      <div className="w-28 h-5 left-[256px] top-0 absolute border border-rose-300/60" />
      <div className="w-28 left-[258px] top-[2px] absolute justify-end text-black text-xs font-normal font-['Inter']">{item.destination}</div>
      <div className="w-14 h-5 left-[388px] top-0 absolute border border-rose-300/60" />
      <div className="w-12 h-3.5 left-[392px] top-[2px] absolute justify-end text-black text-xs font-normal font-['Inter']">{item.station}</div>
      {item.in_driver && (
        <div className="w-10 h-5 left-[444px] top-0 absolute bg-yellow-200 border border-rose-300/60" />
      )}
      {item.in_driver && (
        <div className="w-9 left-[446px] top-[2px] absolute justify-end text-black text-xs font-normal font-['Inter']">{item.in_driver}</div>
      )}
      {item.out_driver && (
        <div className="w-10 h-5 left-[484px] top-0 absolute bg-yellow-200 border border-indigo-200/60" />
      )}
      {item.out_driver && (
        <div className="w-9 left-[486px] top-[2px] absolute justify-end text-black text-xs font-normal font-['Inter']">{item.out_driver}</div>
      )}
      <div className="w-10 h-5 left-[216px] top-0 absolute border border-indigo-200/60" />
      <div className="w-9 left-[218px] top-[2px] absolute text-center justify-end text-red-800 text-xs font-normal font-['Inter']">{item.arrivalTime}</div>
      <div className="w-10 h-5 left-[176px] top-0 absolute border border-rose-300/60" />
      <div className="w-9 left-[178px] top-[2px] absolute text-center justify-end text-black text-xs font-normal font-['Inter']">{item.pickupTime}</div>
      <div className="w-10 h-5 left-[136px] top-0 absolute border border-indigo-200/60" />
      <div className="w-3 left-[162px] top-[2px] absolute text-center justify-end text-black text-xs font-normal font-['Inter']">分</div>
      <div className="w-5 left-[140px] top-[2px] absolute text-right justify-end text-black text-xs font-normal font-['Inter']">{item.timeTotal}</div>
      {item.hasOption5 && (
        <div className="w-4 h-5 left-[588px] top-0 absolute border border-rose-300/60" />
      )}
      {item.hasOption4 && (
        <div className="w-4 h-5 left-[572px] top-0 absolute border border-indigo-200/60" />
      )}
      {item.hasOption3 && (
        <div className="w-4 h-5 left-[556px] top-0 absolute border border-rose-300/60" />
      )}
      {item.hasOption2 && (
        <div className="w-4 h-5 left-[540px] top-0 absolute border border-indigo-200/60" />
      )}
      {item.hasOption1 && (
        <div className="w-4 h-5 left-[524px] top-0 absolute border border-rose-300/60" />
      )}
      <div className="size-5 absolute bg-purple-300" style={{ left: '368px', top: '0px' }} />
      </div>
    ))}
  </div>

  {/* 終了リスト */}
  <div className="w-[332px] h-5 left-[1330px] top-[75px] absolute bg-fuchsia-300" />
  <div className="w-[332px] left-[1330px] top-[77px] absolute text-center justify-end text-black text-xs font-normal font-['Inter']">終了リスト</div>
  <div className="w-[332px] h-[65px] left-[1330px] top-[108px] absolute outline outline-1 outline-offset-[-1px] outline-zinc-300 overflow-y-auto">
    {completedListSampleData.map((item: CompletedList, index: number) => {
    const topPosition = index * 22;
    return (
      <React.Fragment key={item.id}>
        {item.option1 && (
          <>
            <div className="w-[54px] h-5 absolute bg-yellow-200 border border-indigo-200/60" style={{ left: 278, top: topPosition }} />
            <div className="w-12 absolute justify-end text-black text-xs font-normal font-['Inter']" style={{ left: 280, top: topPosition + 2 }}>{item.option1}</div>
          </>
        )}
        <div className="w-[86px] h-5 absolute bg-yellow-200 border border-rose-300/60" style={{ left: 0, top: topPosition }} />
        <div className="w-[82px] absolute justify-end text-black text-xs font-normal font-['Inter']" style={{ left: 2, top: topPosition + 2 }}>{item.hostessName}</div>
        <div className="w-10 h-5 absolute border border-indigo-200/60" style={{ left: 126, top: topPosition }} />
        <div className="w-9 absolute text-center justify-end text-black text-xs font-normal font-['Inter']" style={{ left: 128, top: topPosition + 2 }}>{item.arrivalTime}</div>
        <div className="w-10 h-5 absolute border border-rose-300/60" style={{ left: 86, top: topPosition }} />
        <div className="w-9 absolute text-center justify-end text-black text-xs font-normal font-['Inter']" style={{ left: 88, top: topPosition + 2 }}>{item.pickupTime}</div>
        <div className="w-28 h-5 absolute border border-rose-300/60" style={{ left: 166, top: topPosition }} />
        <div className="w-28 absolute justify-end text-black text-xs font-normal font-['Inter']" style={{ left: 169, top: topPosition + 2 }}>{item.destination}</div>
      </React.Fragment>
    );
    })}
  </div>
  
  <div className="w-[166px] h-5 left-[1496px] top-[517px] absolute bg-yellow-200" />
  <div className="w-[166px] left-[1496px] top-[519px] absolute text-center justify-end text-black text-xs font-normal font-['Inter']">精算告知済　ドライバー</div>
  <div className="w-[166px] h-[176px] left-[1496px] top-[537px] absolute outline outline-1 outline-offset-[-1px] outline-rose-300/60 overflow-y-auto">
    <div className="w-[166px] h-5 left-0 top-0 absolute bg-zinc-300" />
    <div className="w-[166px] h-5 left-0 top-[20px] absolute bg-zinc-300" />
    <div className="w-[166px] h-5 left-0 top-[40px] absolute bg-zinc-300" />
    <div className="w-[166px] h-5 left-0 top-[60px] absolute bg-zinc-300" />
    <div className="w-[166px] h-5 left-0 top-[80px] absolute bg-zinc-300" />
  </div>


  <div className="w-[166px] h-5 left-[1330px] top-[713px] absolute bg-yellow-200" />
  <div className="w-[166px] left-[1330px] top-[715px] absolute text-center justify-end text-black text-xs font-normal font-['Inter']">南IC待機　ドライバー</div>
  <div className="w-[166px] h-44 left-[1330px] top-[733px] absolute outline outline-1 outline-offset-[-1px] outline-rose-300/60 overflow-y-auto">
    <div className="w-[166px] h-5 left-0 top-0 absolute bg-zinc-300" />
    <div className="w-[166px] h-5 left-0 top-[20px] absolute bg-zinc-300" />
    <div className="w-[166px] h-5 left-0 top-[40px] absolute bg-zinc-300" />
    <div className="w-[166px] h-5 left-0 top-[60px] absolute bg-zinc-300" />
    <div className="w-[166px] h-5 left-0 top-[80px] absolute bg-zinc-300" />
  </div>
  


  


  {/* 南IC事務所　待機 */}
  <div className="w-[166px] h-5 left-[1330px] top-[173px] absolute bg-cyan-100" />
  <div className="w-[166px] left-[1330px] top-[175px] absolute text-center justify-end text-black text-xs font-normal font-['Inter']">南IC事務所　待機</div>
  <div className="w-[166px] h-[520px] left-[1330px] top-[193px] absolute outline outline-1 outline-offset-[-1px] outline-zinc-300 overflow-y-auto">
    {officeWaitingSampleData.map((item: OfficeWaiting, index: number) => {
      const topPosition = index * 22;
      return (
        <React.Fragment key={item.id}>
          <div className="w-[18px] h-5 left-[148px] absolute border border-rose-300/60" style={{ top: `${topPosition}px` }} />
          <div className="w-[18px] h-5 left-[130px] absolute border border-rose-300/60" style={{ top: `${topPosition}px` }} />
          <div className="w-[18px] h-5 left-[112px] absolute border border-rose-300/60" style={{ top: `${topPosition}px` }} />
          <div className="w-[70px] h-5 left-0 absolute bg-yellow-200 border border-rose-300/60" style={{ top: `${topPosition}px` }} />
          <div className="w-16 left-[3px] absolute justify-end text-black text-xs font-normal font-['Inter']" style={{ top: `${topPosition + 2}px` }}>{item.hostessName}</div>
          <div className="w-[42px] h-5 left-[70px] absolute border border-rose-300/60" style={{ top: `${topPosition}px` }} />
          <div className="w-9 left-[73px] absolute text-center justify-end text-black text-xs font-normal font-['Inter']" style={{ top: `${topPosition + 2}px` }}>{item.departureTime}</div>
        </React.Fragment>
      );
    })}
  </div>
  
  {/* FGCS　他撮影中 */}
  <div className="w-[166px] h-5 left-[1496px] top-[173px] absolute bg-fuchsia-300" />
  <div className="w-[166px] left-[1496px] top-[175px] absolute text-center justify-end text-black text-xs font-normal font-['Inter']">FGCS　他撮影中</div>
  <div className="w-[166px] h-[64px] left-[1496px] top-[193px] absolute outline outline-1 outline-offset-[-1px] outline-zinc-300 overflow-y-auto">
    {shootingSampleData.map((item: Shooting, index: number) => {
      const topPosition = index * 22;
      return (
        <React.Fragment key={item.id}>
          <div className="w-[18px] h-5 left-[148px] absolute border border-rose-300/60" style={{ top: `${topPosition}px` }} />
          <div className="w-[18px] h-5 left-[130px] absolute border border-rose-300/60" style={{ top: `${topPosition}px` }} />
          <div className="w-[18px] h-5 left-[112px] absolute border border-rose-300/60" style={{ top: `${topPosition}px` }} />
          <div className="w-[70px] h-5 left-0 absolute bg-yellow-200 border border-rose-300/60" style={{ top: `${topPosition}px` }} />
          <div className="w-16 left-[3px] absolute justify-end text-black text-xs font-normal font-['Inter']" style={{ top: `${topPosition + 2}px` }}>{item.hostessName}</div>
          <div className="w-[42px] h-5 left-[70px] absolute border border-rose-300/60" style={{ top: `${topPosition}px` }} />
          <div className="w-9 left-[73px] absolute text-center justify-end text-black text-xs font-normal font-['Inter']" style={{ top: `${topPosition + 2}px` }}>{item.departureTime}</div>
        </React.Fragment>
      );
    })}
  </div>

  {/* 南IC徒歩派遣or仮置き */}
  <div className="w-[166px] h-5 left-[1496px] top-[257px] absolute bg-cyan-100" />
  <div className="w-[166px] h-5 left-[1496px] top-[259px] absolute text-center justify-end text-black text-xs font-normal font-['Inter']">南IC徒歩派遣or仮置き</div>
  <div className="w-[166px] h-60 left-[1496px] top-[277px] absolute outline outline-1 outline-offset-[-1px] outline-zinc-300 overflow-y-auto">
    {walkingDispatchSampleData.map((item: WalkingDispatch, index: number) => {
      const topPosition = index * 22;
      return (
        <React.Fragment key={item.id}>
          <div className="w-[70px] h-5 left-0 absolute bg-yellow-200 border border-rose-300/60" style={{ top: `${topPosition}px` }} />
          <div className="w-16 left-[3px] absolute justify-end text-black text-xs font-normal font-['Inter']" style={{ top: `${topPosition + 2}px` }}>{item.hostessName}</div>
          <div className="w-[42px] h-5 left-[70px] absolute border border-rose-300/60" style={{ top: `${topPosition}px` }} />
          <div className="w-9 left-[73px] absolute text-center justify-end text-black text-xs font-normal font-['Inter']" style={{ top: `${topPosition + 2}px` }}>{item.departureTime}</div>
          <div className="w-[18px] h-5 left-[112px] absolute border border-rose-300/60" style={{ top: `${topPosition}px` }} />
          <div className="w-[18px] h-5 left-[130px] absolute border border-rose-300/60" style={{ top: `${topPosition}px` }} />
          <div className="w-[18px] h-5 left-[148px] absolute border border-rose-300/60" style={{ top: `${topPosition}px` }} />
        </React.Fragment>
      );
    })}
  </div>


  
  


  {/* 帰宅ホステス */}
  
  <div className="w-[234px] h-5 left-[1662px] top-[568px] absolute bg-cyan-100" />
  <div className="w-[234px] left-[1662px] top-[570px] absolute text-center justify-end text-black text-xs font-normal font-['Inter']">帰宅ホステス</div>
  <div className="w-[234px] h-5 left-[1662px] top-[588px] absolute bg-yellow-200" />
  <div className="w-[234px] left-[1662px] top-[590px] absolute text-center justify-end text-black text-xs font-normal font-['Inter']">自宅or寮　待機</div>
  <div className="w-[234px] h-[105px] left-[1662px] top-[608px] absolute outline outline-1 outline-offset-[-1px] outline-rose-300/60 overflow-y-auto">
    {returningHostessSampleData.map((item: ReturningHostess, index: number) => {
      const topPosition = index * 22;
      return (
        <div key={item.id} className="w-[243px] h-5 left-0 absolute bg-zinc-300" style={{ top: `${topPosition}px` }}>
          <div className="w-60 h-5 left-0 top-0 absolute justify-center text-black text-xs font-normal font-['Inter']">
            {item.hostessName} - {item.returnTime} - {item.location}
          </div>
        </div>
      );
    })}
  </div>

  {/* ホステス送り・帰宅 */}
  <div className="w-[243px] h-5 left-[1662px] top-[75px] absolute bg-yellow-200" />
  <div className="w-[243px] left-[1662px] top-[77px] absolute text-center justify-end text-black text-xs font-normal font-['Inter']">ホステス送り・帰宅</div>
  <div className="w-5 left-[1662px] top-[96px] absolute text-center justify-end text-black text-[8px] font-normal font-['Inter']">荷物</div>
  <div className="w-[42px] left-[1736px] top-[96px] absolute text-center justify-end text-black text-[8px] font-normal font-['Inter']">終了</div>
  <div className="w-[42px] left-[1778px] top-[96px] absolute text-center justify-end text-black text-[8px] font-normal font-['Inter']">帰宅</div>
  <div className="w-[19px] left-[1886px] top-[96px] absolute text-center justify-end text-black text-[8px] font-normal font-['Inter']">件数</div>
  <div className="w-[54px] left-[1678px] top-[96px] absolute justify-end text-black text-center text-[8px] font-normal font-['Inter']">ホステス名</div>
  <div className="w-[66px] left-[1818px] top-[96px] absolute justify-end text-black text-[8px] text-center font-normal font-['Inter']">送り場所</div>
  <div className="w-[243px] h-[460px] left-[1662px] top-[108px] absolute outline outline-1 outline-offset-[-1px] outline-zinc-300 overflow-y-auto overflow-y-hidden">
    {hostessTransportSampleData.map((item: HostessTransport, index: number) => {
      const topPosition = index * 22;
      return (
        <React.Fragment key={item.id}>
          <div className="w-[42px] h-5 left-[116px] absolute bg-zinc-300 border border-indigo-200/60" style={{ top: `${topPosition}px` }} />
          <div className="w-9 left-[119px] absolute text-center justify-end text-pink-500 text-xs font-normal font-['Inter']" style={{ top: `${topPosition + 2}px` }}>{item.returnTime}</div>
          <div className="w-[42px] h-5 left-[74px] absolute bg-zinc-300 border border-rose-300/60" style={{ top: `${topPosition}px` }} />
          <div className="w-9 left-[77px] absolute text-center justify-end text-orange-500 text-xs font-normal font-['Inter']" style={{ top: `${topPosition + 2}px` }}>{item.departureTime}</div>
          <div className="w-[66px] h-5 left-[158px] absolute bg-zinc-300 border border-rose-300/60" style={{ top: `${topPosition}px` }} />
          <div className="w-[69px] left-[161px] absolute justify-end text-black text-xs font-normal font-['Inter']" style={{ top: `${topPosition + 2}px` }}>{item.destination}</div>
          <div className="w-[19px] h-5 left-[224px] absolute bg-zinc-300 border border-indigo-200/60" style={{ top: `${topPosition}px` }} />
          <div className="w-3 h-3.5 left-[227px] absolute text-center justify-end text-black text-xs font-normal font-['Inter']" style={{ top: `${topPosition + 2}px` }}>{item.count}</div>
          <div className="w-[54px] h-5 left-[20px] absolute bg-zinc-300 border border-indigo-200/60" style={{ top: `${topPosition}px` }} />
          <div className="w-12 left-[23px] absolute justify-end text-black text-xs font-normal font-['Inter']" style={{ top: `${topPosition + 2}px` }}>{item.hostessName.split(' ')[1] || item.hostessName}</div>
          <div className="size-5 left-0 absolute flex items-center justify-center bg-rose-100" style={{ top: `${topPosition}px` }}>
            <Package className={`size-4 ${(item.count ?? 0) === 0 ? 'text-stone-500' : 'text-red-500'}`} />
          </div>
        </React.Fragment>
      );
    })}
  </div>
  
  
  {/* 予定(打ち合わせ・撮影など) */}
  <div className="w-[400px] h-5 left-[1496px] top-[713px] absolute bg-purple-300" />
  <div className="w-[400px] left-[1496px] top-[715px] absolute text-center justify-end text-black text-xs font-normal font-['Inter']">予定(打ち合わせ・撮影など)</div>
  <div className="w-[400px] h-[100px] left-[1496px] top-[733px] absolute outline outline-1 outline-offset-[-1px] outline-zinc-300 overflow-y-auto">
    {scheduleItemSampleData.map((item: ScheduleItem, index: number) => {
      const topPosition = index * 34;
      return (
        <div key={item.id} className="w-[400px] h-8 left-0 absolute" style={{ top: `${topPosition}px` }}>
          <div className="w-[400px] h-8 left-0 top-0 absolute bg-zinc-300" />
          <div className="w-[400px] h-8 left-0 top-0 absolute justify-center text-black text-xs font-normal font-['Inter']">
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
    className="w-[166px] h-20 left-[1330px] top-[833px] absolute bg-rose-300/60 hover:bg-rose-400/60 text-black text-xs font-normal font-['Inter']"
    onClick={() => {}}
  >
    ドライバ配車パネル
  </Button>


  {/* 面接予定 */}
  <div className="w-[400px] h-5 left-[1496px] top-[833px] absolute bg-rose-300/60" />
  <div className="w-[400px] left-[1496px] top-[835px] absolute text-center justify-end text-black text-xs font-normal font-['Inter']">面接予定</div>
  <div className="w-[400px] h-[130px] left-[1496px] top-[853px] absolute outline outline-1 outline-offset-[-1px] outline-zinc-300 overflow-y-auto">
    {driverDispatchPanelSampleData.map((item: DriverDispatchPanel, index: number) => {
      const topPosition = index * 22;
      return (
        <React.Fragment key={item.id}>
          <div className="w-[18px] h-5 left-[78px] absolute bg-purple-300 border border-neutral-300" style={{ top: `${topPosition}px` }} />
          <div className="w-9 h-5 left-0 absolute bg-purple-300 border border-neutral-300" style={{ top: `${topPosition}px` }} />
          <div className="w-3 left-[81px] absolute text-center justify-end text-black text-xs font-normal font-['Inter']" style={{ top: `${topPosition + 2}px` }}>{item.status === 'completed' ? '済' : ''}</div>
          <div className="w-6 left-[6px] absolute text-center justify-end text-black text-xs font-normal font-['Inter']" style={{ top: `${topPosition + 2}px` }}>{item.type === 'entry' ? '入店' : ''}</div>
          <div className="w-[42px] h-5 left-[36px] absolute border border-rose-300/60" style={{ top: `${topPosition}px` }} />
          <div className="w-9 left-[39px] absolute text-center justify-end text-black text-xs font-normal font-['Inter']" style={{ top: `${topPosition + 2}px` }}>{item.time}</div>
          <div className="w-48 h-5 left-[96px] absolute bg-purple-300 border border-neutral-300" style={{ top: `${topPosition}px` }} />
          <div className="w-44 left-[99px] absolute justify-end text-black text-xs font-normal font-['Inter']" style={{ top: `${topPosition + 2}px` }}>{item.location}</div>
          {item.hostessName1 && (
            <>
              <div className="w-14 h-5 left-[288px] absolute bg-yellow-200 border border-indigo-200/60" style={{ top: `${topPosition}px` }} />
              <div className="w-12 left-[291px] absolute justify-end text-black text-xs font-normal font-['Inter']" style={{ top: `${topPosition + 2}px` }}>{item.hostessName1}</div>
            </>
          )}
          {item.hostessName2 && (
            <>
              <div className="w-14 h-5 left-[344px] absolute bg-yellow-200 border border-indigo-200/60" style={{ top: `${topPosition}px` }} />
              <div className="w-12 left-[347px] absolute justify-end text-black text-xs font-normal font-['Inter']" style={{ top: `${topPosition + 2}px` }}>{item.hostessName2}</div>
            </>
          )}
        </React.Fragment>
      );
    })}
  </div>
</div>
  );
}