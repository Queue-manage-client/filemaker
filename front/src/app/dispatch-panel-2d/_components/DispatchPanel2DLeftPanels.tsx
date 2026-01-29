"use client";

import React from "react";
import {
  scheduledHostessSampleData,
  staffScheduleSampleData,
} from "@/data/newRt2SampleData";
import { ScheduledHostess, StaffSchedule } from "@/types/new-rt2";

export function DispatchPanel2DLeftPanels() {
  return (
    <>
      {/* 出勤予定ホステス */}
      <div className="w-[344px] h-5 left-[4px] top-[75px] absolute bg-cyan-200" />
      <div className="w-[344px] left-[4px] top-[77px] absolute text-center justify-end text-black text-xs font-normal font-['Inter']">
        出勤予定ホステス
      </div>
      <div className="w-4 left-[308px] top-[95px] absolute text-center justify-end text-black text-[8px] font-normal font-['Inter']">
        帰宅
      </div>
      <div className="w-4 left-[266px] top-[95px] absolute text-center justify-end text-black text-[8px] font-normal font-['Inter']">
        終了
      </div>
      <div className="w-8 left-[204px] top-[95px] absolute text-center justify-end text-black text-[8px] font-normal font-['Inter']">
        迎え場所
      </div>
      <div className="w-4 left-[158px] top-[95px] absolute text-center justify-end text-black text-[8px] font-normal font-['Inter']">
        出勤
      </div>
      <div className="w-4 left-[136px] top-[95px] absolute text-center justify-end text-black text-[8px] font-normal font-['Inter']">
        決定
      </div>
      <div className="w-9 left-[96px] top-[95px] absolute text-center justify-end text-black text-[8px] font-normal font-['Inter']">
        迎えドラ
      </div>
      <div className="w-12 left-[40px] top-[95px] absolute justify-end text-black text-[8px] font-normal font-['Inter']">
        ホステス名
      </div>
      <div className="w-[344px] h-[600px] left-[4px] top-[108px] absolute outline outline-1 outline-offset-[-1px] outline-zinc-300 overflow-y-auto">
        {scheduledHostessSampleData.map((hostess: ScheduledHostess, index: number) => {
          const topPosition = index * 22;
          return (
            <div
              key={hostess.id}
              className="w-[333px] h-5 left-[1px] absolute"
              style={{ top: `${topPosition}px` }}
            >
              <div className="w-[194px] h-5 left-[148px] top-0 absolute bg-zinc-300" />
              <div className="w-4 h-5 left-[132px] top-0 absolute bg-zinc-400" />
              <div className="w-[70px] h-5 left-[20px] top-0 absolute bg-yellow-200" />
              <div className="w-5 h-5 left-0 top-0 absolute bg-zinc-300" />
              <div className="w-9 left-[303px] top-[2px] absolute text-center justify-end text-pink-500 text-xs font-normal font-['Inter']">
                {hostess.endTime}
              </div>
              <div className="w-9 left-[261px] top-[2px] absolute text-center justify-end text-orange-500 text-xs font-normal font-['Inter']">
                {hostess.startTime}
              </div>
              <div className="w-20 left-[195px] top-[2px] absolute justify-end text-black text-xs font-normal font-['Inter']">
                {hostess.location}
              </div>
              <div className="w-9 left-[153px] top-[2px] absolute text-center justify-end text-lime-500 text-xs font-normal font-['Inter']">
                {hostess.arrivalTime}
              </div>
              <div className="w-3 left-[135px] top-[2px] absolute text-center justify-end text-white text-xs font-normal font-['Inter']">
                {hostess.count}
              </div>
              <div className="w-9 left-[93px] top-[2px] absolute justify-end text-black text-xs font-normal font-['Inter']">
                {hostess.driverName}
              </div>
              <div className="w-12 left-[39px] top-[2px] absolute justify-end text-black text-xs font-normal font-['Inter']">
                {hostess.hostessName}
              </div>
              <div className="left-[22px] top-[2px] absolute text-center justify-end text-black text-xs font-normal font-['Inter']">
                {hostess.area}
              </div>
              <div className="w-3.5 h-1.5 left-[8px] top-[4px] absolute origin-top-left rotate-90 bg-rose-300/60" />
            </div>
          );
        })}
        <div className="w-[334px] h-5 left-[1px] top-[80px] absolute" />
      </div>

      {/* スタッフ予定リスト */}
      <div className="w-[344px] h-5 left-[4px] top-[708px] absolute bg-lime-200 flex items-center justify-center">
        <span className="text-black text-xs font-normal font-['Inter']">スタッフ予定リスト</span>
      </div>
      <div className="w-[344px] h-96 left-[4px] top-[728px] absolute outline outline-1 outline-offset-[-1px] outline-zinc-300 overflow-y-auto">
        {staffScheduleSampleData.map((schedule: StaffSchedule, index: number) => (
          <div
            key={schedule.id}
            className={`w-full h-8 flex items-center px-1 text-black text-xs font-normal font-['Inter'] ${schedule.isHighlighted ? "bg-lime-200" : "bg-white"}`}
          >
            <div>
              {schedule.driverName}→{schedule.destination}
              <br />
              {schedule.note}
            </div>
          </div>
        ))}
      </div>
    </>
  );
}


