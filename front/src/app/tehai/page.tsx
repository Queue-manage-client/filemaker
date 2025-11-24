'use client';

import React from 'react';

import { useRouter } from 'next/navigation';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, FileText, Eye, Mail, User } from "lucide-react";
import { tehaiSampleData } from "@/data/tehaiSampleData";
import { TEHAI_STATUS_LABELS, TEHAI_STATUS_VARIANTS } from "@/types/tehai";
import { staffAttendanceSampleData } from "@/data/staffAttendanceSampleData";
import { WORK_TYPE_LABELS, EMPLOYMENT_TYPE_LABELS, ATTENDANCE_STATUS_LABELS, ATTENDANCE_STATUS_VARIANTS } from "@/types/staff-attendance";
import { rosterPeriods } from "@/types/department-roster";
import { partTimeAttendanceSampleData } from "@/data/partTimeAttendanceSampleData";
//import { PART_TIME_MIN_ROWS } from "@/data/partTimeAttendanceSampleData";
import { PART_TIME_REQUEST_TYPE_LABELS, PART_TIME_JOB_TYPE_LABELS, PART_TIME_REQUEST_TYPE_VARIANTS, PART_TIME_JOB_TYPE_VARIANTS } from "@/types/part-time-attendance";
import { leaveAndDeductionSampleData } from "@/data/leaveAndDeductionSampleData";
//import { LEAVE_DEDUCTION_MAX_ROWS } from "@/data/leaveAndDeductionSampleData";
//import { LEAVE_DEDUCTION_TYPE_LABELS, LEAVE_DEDUCTION_TYPE_VARIANTS } from "@/types/leave-and-deduction";
import { reservationSampleData } from "@/data/reservationSampleData";
import { COURSE_COLORS } from "@/types/reservation";

export default function Tehai() {
  const router = useRouter();

  React.useEffect(() => {
    document.title = '手配表 - Dispatch Harmony Hub';
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 p-2 max-w-none">
      {/* 戻るボタン */}
      <div className="mb-4">
        <Button 
          variant="outline" 
          onClick={() => router.push('/dashboard')}
          className="flex items-center gap-2"
        >
          <ArrowLeft className="w-4 h-4" />
          ダッシュボードに戻る
        </Button>
      </div>

      {/* ヘッダー */}
      <Card className="mb-4">
        <CardHeader>
          <div className="flex items-center gap-3">
            <FileText className="w-6 h-6" />
            <h1 className="text-2xl font-bold">手配表</h1>
          </div>
        </CardHeader>
      </Card>

      {/* メインコンテンツ - フレックスレイアウト */}
      <div className="flex flex-row gap-6 h-[calc(100vh-180px)] overflow-x-auto">
        {/* 統合エリア（手配表一覧） */}
        <Card className="h-full flex-shrink-0">
          <CardHeader className="pb-3">
            <h2 className="text-lg font-semibold">手配表一覧</h2>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-auto h-[calc(100%-80px)]">
              <Table className="text-xs">
                <TableHeader>
                  <TableRow className="h-10">
                    <TableHead className="w-[80px] p-2 text-xs">デ ホ 併 温</TableHead>
                    <TableHead className="w-[15px] p-2 text-xs"></TableHead>
                    <TableHead className="w-[35px] p-2 text-xs"></TableHead>
                    <TableHead className="w-[45px] p-2 text-xs"></TableHead>
                    <TableHead className="w-[70px] p-2 text-xs"></TableHead>
                    <TableHead className="w-[60px] p-2 text-xs"></TableHead>
                    <TableHead className="w-[30px] p-2 text-xs">理由</TableHead>
                    <TableHead className="w-[90px] p-2 text-xs">迎えドライバ</TableHead>
                    <TableHead className="w-[15px] p-2 text-xs"></TableHead>
                    <TableHead className="w-[55px] p-2 text-xs">場所</TableHead>
                    <TableHead className="w-[20px] p-2 text-xs">終了</TableHead>
                    <TableHead className="w-[20px] p-2 text-xs">帰宅</TableHead>
                    <TableHead className="w-[100px] p-2 text-xs">送り場所</TableHead>
                    <TableHead className="w-[60px] p-2 text-xs">担当者</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {tehaiSampleData.map((data) => (
                    <TableRow key={data.id} className="h-9">
                      <TableCell className="p-2">
                        <div className="flex gap-1">
                          <Checkbox className="w-3 h-3" />
                          <Checkbox className="w-3 h-3" />
                          <Checkbox className="w-3 h-3" />
                          <Checkbox className="w-3 h-3" />
                        </div>
                      </TableCell>
                      <TableCell className="text-xs p-2">{data.no}</TableCell>
                      <TableCell className="text-xs p-2">{data.storeName}</TableCell>
                      <TableCell className="text-xs p-2">{data.icName}</TableCell>
                      <TableCell className="text-xs p-2">{data.hostessName}</TableCell>
                      <TableCell className="p-2">
                        <Badge 
                          variant={TEHAI_STATUS_VARIANTS[data.status]} 
                          className={`text-xs px-2 py-1 h-6 ${data.status === 'finished' ? 'bg-green-500' : ''}`}
                        >
                          {TEHAI_STATUS_LABELS[data.status]}
                        </Badge>
                      </TableCell>
                      <TableCell className="p-2">
                        <Button variant="ghost" size="sm" className="p-1 h-6 w-6">
                          <Eye className="w-3 h-3" />
                        </Button>
                      </TableCell>
                      <TableCell className="text-xs p-2">{data.pickupDriver}</TableCell>
                      <TableCell className="text-xs p-2">{data.pickupTime}</TableCell>
                      <TableCell className="text-xs p-2">{data.pickupLocation}</TableCell>
                      <TableCell className="text-xs p-2">{data.arrivalTime}</TableCell>
                      <TableCell className="text-xs p-2">{data.finishTime}</TableCell>
                      <TableCell className="text-xs p-2">{data.dropoffLocation}</TableCell>
                      <TableCell className="text-xs p-2">{data.manager}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>

        {/* エリア3 - スタッフ出勤管理 */}
        <Card className="h-full flex-shrink-0">
          <CardHeader className="pb-3">
            <h2 className="text-lg font-semibold">スタッフ出勤管理</h2>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-auto h-[calc(100%-80px)]">
              <Table className="text-xs">
                <TableHeader>
                  <TableRow className="h-10">
                    <TableHead className="w-[15px] p-2 text-xs"></TableHead>
                    <TableHead className="w-[30x] p-2 text-xs">出/休</TableHead>
                    <TableHead className="w-[95px] p-2 text-xs">区分</TableHead>
                    <TableHead className="w-[90px] p-2 text-xs">氏名</TableHead>
                    <TableHead className="w-[15px] p-2 text-xs"></TableHead>
                    <TableHead className="w-[20px] p-2 text-xs">出勤</TableHead>
                    <TableHead className="w-[20px] p-2 text-xs">退社</TableHead>
                    <TableHead className="w-[60px] p-2 text-xs">状態</TableHead>
                    <TableHead className="w-[40px] p-2 text-xs">検温</TableHead>
                    <TableHead className="w-[40px] p-2 text-xs">連絡</TableHead>
                    <TableHead className="w-[35px] p-2 text-xs"></TableHead>
                    <TableHead className="w-[35px] p-2 text-xs"></TableHead>
                    <TableHead className="w-[20px] p-2 text-xs"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {staffAttendanceSampleData.map((data) => (
                    <TableRow key={data.id} className="h-9">
                      <TableCell className="text-xs p-2">{data.serialNumber}</TableCell>
                      <TableCell className="p-2">
                        <Badge 
                          variant={data.workType === 'work' ? 'default' : 'outline'} 
                          className="text-xs px-2 py-1 h-6"
                        >
                          {WORK_TYPE_LABELS[data.workType]}
                        </Badge>
                      </TableCell>
                      <TableCell className="p-2">
                        <Badge 
                          variant={data.employmentType === 'employee' ? 'secondary' : 'outline'} 
                          className="text-xs px-2 py-1 h-6"
                        >
                          {EMPLOYMENT_TYPE_LABELS[data.employmentType]}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-xs p-2">{data.name}</TableCell>
                      <TableCell className="text-xs p-2">{data.number}</TableCell>
                      <TableCell className="text-xs p-2">{data.startTime}</TableCell>
                      <TableCell className="text-xs p-2">{data.endTime}</TableCell>
                      <TableCell className="p-2">
                        {data.currentStatus && (
                          <Badge 
                            variant={ATTENDANCE_STATUS_VARIANTS[data.currentStatus]} 
                            className="text-xs px-2 py-1 h-6"
                          >
                            {ATTENDANCE_STATUS_LABELS[data.currentStatus]}
                          </Badge>
                        )}
                      </TableCell>
                      <TableCell className="p-2">
                        <Checkbox 
                          className="w-3 h-3" 
                          checked={data.temperatureCheck}
                        />
                      </TableCell>
                      <TableCell className="p-2">
                        <Checkbox 
                          className="w-3 h-3" 
                          checked={data.contactCheck}
                        />
                      </TableCell>
                      <TableCell className="p-2">
                        <Button variant="ghost" size="sm" className="p-1 h-6 w-6">
                          <Mail className="w-3 h-3" />
                        </Button>
                      </TableCell>
                      <TableCell className="p-2">
                        <Button variant="ghost" size="sm" className="p-1 h-6 w-6">
                          <User className="w-3 h-3" />
                        </Button>
                      </TableCell>
                      <TableCell className="p-2">
                        <Checkbox 
                          className="w-3 h-3" 
                          checked={data.catchStart}
                        />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>

        {/* 右エリア - 前半・後半・出勤希望アルバイト */}
        <div className="flex flex-row gap-4 justify-start flex-shrink-0">
          {/* 前半エリア（前半カード + 有給使用者及び給料引き者カード） */}
          <div className="flex flex-col gap-4 h-[1100px] w-[220px]">
            {/* 前半カード */}
            <Card className="flex-1 h-[960px]">
              <CardHeader className="pb-3">
                <h2 className="text-lg font-semibold">前半</h2>
              </CardHeader>
              <CardContent className="p-0">
                <div className="overflow-auto h-[calc(100%-80px)]">
                  {rosterPeriods[0].departments.map((department) => (
                    <div key={department.id} className="mb-4 last:mb-0">
                      <div className="bg-gray-100 px-3 py-2">
                        <h3 className="text-sm font-semibold text-center">
                          {department.name}
                        </h3>
                      </div>
                      <Table className="text-xs">
                        <TableBody>
                          {Array.from({ length: department.capacity }, (_, index) => (
                            <TableRow 
                              key={`${department.id}-${index}`} 
                              className={`h-8 ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}`}
                            >
                              <TableCell className="w-[30px] p-2 text-xs text-gray-400">
                                {index + 1}
                              </TableCell>
                              <TableCell className="p-2">
                                <input
                                  type="text"
                                  className="w-full text-xs border-0 bg-transparent focus:outline-none focus:ring-0"
                                  placeholder="名前を入力..."
                                />
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* 有給使用者及び給料引き者カード */}
            <Card className="h-[200px]">
              <CardHeader className="pb-3">
                <h2 className="text-sm font-semibold">有給使用者及び給料引き者</h2>
              </CardHeader>
              <CardContent className="p-0">
                <div className="overflow-auto h-[calc(100%-60px)]">
                  <Table className="text-xs">
                    <TableBody>
                      {leaveAndDeductionSampleData.map((data, index) => (
                        <TableRow 
                          key={data.id}
                          className={`h-8 ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}`}
                        >
                          <TableCell className="w-[30px] p-2 text-xs text-gray-400">
                            {index + 1}
                          </TableCell>
                          <TableCell className="p-2 text-xs">
                            {data.name}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* 後半カード */}
          <Card className="w-[220px] h-[1020px]">
            <CardHeader className="pb-3">
              <h2 className="text-lg font-semibold">後半</h2>
            </CardHeader>
            <CardContent className="p-0">
              <div className="overflow-auto h-[calc(100%-80px)]">
                {rosterPeriods[1].departments.map((department) => (
                  <div key={department.id} className="mb-4 last:mb-0">
                    <div className="bg-gray-100 px-3 py-2">
                      <h3 className="text-sm font-semibold text-center">
                        {department.name}
                      </h3>
                    </div>
                    <Table className="text-xs">
                      <TableBody>
                        {Array.from({ length: department.capacity }, (_, index) => (
                          <TableRow 
                            key={`${department.id}-${index}`} 
                            className={`h-8 ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}`}
                          >
                            <TableCell className="w-[30px] p-2 text-xs text-gray-400">
                              {index + 1}
                            </TableCell>
                            <TableCell className="p-2">
                              <input
                                type="text"
                                className="w-full text-xs border-0 bg-transparent focus:outline-none focus:ring-0"
                                placeholder="名前を入力..."
                              />
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
          
          {/* 出勤希望アルバイト + 予約エリア */}
          <div className="flex flex-col gap-4 flex-shrink-0 items-start">
            {/* 出勤希望アルバイトカード */}
            <Card className="h-[780px] self-start">
              <CardHeader className="pb-3">
                <h2 className="text-lg font-semibold">出勤希望アルバイト</h2>
              </CardHeader>
              <CardContent className="p-0">
                <div className="overflow-auto h-[700px]">
                  <Table className="text-xs">
                    <TableHeader className="sticky top-0 bg-white z-10">
                      <TableRow className="h-10">
                        <TableHead className="w-[15px] p-2 text-xs"></TableHead>
                        <TableHead className="w-[90px] p-2 text-xs">名前</TableHead>
                        <TableHead className="w-[60px] p-2 text-xs">区分</TableHead>
                        <TableHead className="w-[20px] p-2 text-xs">出勤</TableHead>
                        <TableHead className="w-[20px] p-2 text-xs">退社</TableHead>
                        <TableHead className="w-[90px] p-2 text-xs">職務</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {partTimeAttendanceSampleData.map((data, index) => (
                        <TableRow 
                          key={data.id}
                          className={`h-9 ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}`}
                        >
                          <TableCell className="text-xs p-2">
                            {data.serialNumber}
                          </TableCell>
                          <TableCell className="text-xs p-2">
                            {data.name}
                          </TableCell>
                          <TableCell className="p-2">
                            <Badge 
                              variant={PART_TIME_REQUEST_TYPE_VARIANTS[data.requestType]} 
                              className="text-xs px-2 py-1 h-6"
                            >
                              {PART_TIME_REQUEST_TYPE_LABELS[data.requestType]}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-xs p-2">
                            {data.startTime}
                          </TableCell>
                          <TableCell className="text-xs p-2">
                            {data.endTime}
                          </TableCell>
                          <TableCell className="p-2">
                            <Badge 
                              variant={PART_TIME_JOB_TYPE_VARIANTS[data.jobType]} 
                              className="text-xs px-2 py-1 h-6"
                            >
                              {PART_TIME_JOB_TYPE_LABELS[data.jobType]}
                            </Badge>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>

            {/* 予約カード */}
            <Card className="h-[420px] w-[600px] self-start">
              <CardHeader className="pb-3">
                <h2 className="text-lg font-semibold">予約</h2>
              </CardHeader>
              <CardContent className="p-0">
                <div className="overflow-auto h-[calc(100%-60px)]">
                  <Table className="text-xs">
                    <TableHeader className="sticky top-0 bg-white z-10">
                      <TableRow className="h-10">
                        <TableHead className="w-[60px] p-2 text-xs">予約番号</TableHead>
                        <TableHead className="w-[90px] p-2 text-xs">顧客名</TableHead>
                        <TableHead className="w-[90px] p-2 text-xs">ホステス名</TableHead>
                        <TableHead className="w-[45px] p-2 text-xs">開始</TableHead>
                        <TableHead className="w-[45px] p-2 text-xs">コース</TableHead>
                        <TableHead className="w-[45px] p-2 text-xs">終了</TableHead>
                        <TableHead className="w-[60px] p-2 text-xs">場所</TableHead>
                        <TableHead className="w-[100px] p-2 text-xs">ホテル名</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {reservationSampleData.map((data, index) => (
                        <TableRow
                          key={data.id}
                          className={`h-9 ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}`}
                        >
                          <TableCell className="text-xs p-2 font-mono">
                            {data.reservationNumber}
                          </TableCell>
                          <TableCell className="text-xs p-2">
                            {data.customerName}
                          </TableCell>
                          <TableCell className="text-xs p-2">
                            {data.hostessName}
                          </TableCell>
                          <TableCell className="text-xs p-2">
                            {data.startTime}
                          </TableCell>
                          <TableCell className="p-2">
                            <span className={`inline-flex items-center px-2 py-1 text-[10px] font-semibold rounded ${COURSE_COLORS[data.courseCode] ?? 'bg-gray-200 text-gray-700'}`}>
                              {data.courseCode}
                            </span>
                          </TableCell>
                          <TableCell className="text-xs p-2">
                            {data.endTime}
                          </TableCell>
                          <TableCell className="text-xs p-2">
                            {data.location}
                          </TableCell>
                          <TableCell className="text-xs p-2">
                            {data.hotelName}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* スタッフ予定リストカード */}
          <Card className="h-[780px] w-[220px] flex-shrink-0">
            <CardHeader className="pb-3">
              <h2 className="text-lg font-semibold">スタッフ予定リスト</h2>
            </CardHeader>
            <CardContent className="p-0">
              <div className="overflow-auto h-[700px]">
                <Table className="text-xs">
                  <TableBody>
                    {Array.from({ length: 12 }, (_, index) => (
                      <TableRow
                        key={index}
                        className={`h-8 ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}`}
                      >
                        <TableCell className="p-2">
                          <input
                            type="text"
                            className="w-full text-xs border-0 bg-transparent focus:outline-none focus:ring-0"
                          />
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
          </div>
        </CardContent>
      </Card>
        </div>
      </div>
    </div>
  );
}
