'use client';

import React from 'react';
import Link from 'next/link';
import { Button } from "@/components/ui/button";
import { ArrowLeft } from 'lucide-react';

// 出勤希望アルバイトデータ
const attendanceData = [
  { id: 1, lastName: '松尾', firstName: '久御', status: '希望', startTime: '9:00', endTime: '23:00', type: 'ドライバ', selected: false },
  { id: 2, lastName: '土居4', firstName: '近江', status: '希望', startTime: '9:00', endTime: '4:00', type: 'ドライバ', selected: false },
  { id: 3, lastName: '運村', firstName: '4 堺', status: '希望', startTime: '9:00', endTime: '4:00', type: 'ドライバ', selected: true },
  { id: 4, lastName: '中蔵', firstName: '5 回阪', status: '希望', startTime: '12:00', endTime: '20:00', type: 'ドライバ', selected: false },
  { id: 5, lastName: '八塚', firstName: '4佐根', status: '希望', startTime: '18:00', endTime: '4:00', type: 'ドライバ', selected: true },
  { id: 6, lastName: '伊垣', firstName: '4 伏', status: '希望', startTime: '10:00', endTime: '20:00', type: 'ドライバ', selected: false },
  { id: 7, lastName: '須賀', firstName: '5上', status: '希望', startTime: '18:00', endTime: '4:00', type: 'ドライバ', selected: true },
  { id: 8, lastName: '水畑', firstName: '7 山', status: '希望', startTime: '18:00', endTime: '23:00', type: 'ドライバ', selected: false },
  { id: 9, lastName: '大芦', firstName: '翔太', status: '希望', startTime: '11:00', endTime: '20:00', type: '内勤', selected: false },
  { id: 10, lastName: '大谷', firstName: '大翔', status: '出勤', startTime: '12:00', endTime: '17:30', type: '内勤', selected: false },
  { id: 11, lastName: '岸本', firstName: '礼人', status: '', startTime: '', endTime: '', type: 'スタッフ', selected: false },
  { id: 12, lastName: '横田', firstName: '武', status: '希望', startTime: '8:00', endTime: '16:00', type: 'スタッフ', selected: false },
  { id: 13, lastName: '田中', firstName: '健太', status: '希望', startTime: '10:00', endTime: '18:00', type: 'ドライバ', selected: false },
  { id: 14, lastName: '佐藤', firstName: '裕二', status: '出勤', startTime: '13:00', endTime: '21:00', type: 'ドライバ', selected: false },
  { id: 15, lastName: '鈴木', firstName: '慎吾', status: '希望', startTime: '9:00', endTime: '17:00', type: '内勤', selected: true },
  { id: 16, lastName: '高橋', firstName: '誠', status: '希望', startTime: '14:00', endTime: '22:00', type: 'ドライバ', selected: false },
  { id: 17, lastName: '渡辺', firstName: '勇気', status: '希望', startTime: '18:00', endTime: '2:00', type: 'ドライバ', selected: false },
  { id: 18, lastName: '伊藤', firstName: '大介', status: '出勤', startTime: '11:00', endTime: '19:00', type: 'スタッフ', selected: true },
];

// 予約データ
const reservationData = [
  { 
    id: '63691', 
    name1: 'ダテ', 
    name2: 'うるる', 
    startTime: '1:10', 
    type1: 'RH', 
    type2: 'GIRL', 
    endTime: '2:30', 
    location: '南心', 
    store: 'マイスクラブ(芸川',
    color: 'pink'
  },
  { 
    id: '28139', 
    name1: 'タナカ', 
    name2: 'ミノア', 
    startTime: '1:30', 
    type1: 'S', 
    type2: 'LADY', 
    endTime: '3:30', 
    location: '南心', 
    store: 'ファインガーデン',
    color: 'pink'
  },
  { 
    id: '61610', 
    name1: 'ナガイ', 
    name2: '知里', 
    startTime: '2:00', 
    type1: '確S', 
    type2: 'Stand', 
    endTime: '4:00', 
    location: '南心', 
    store: '',
    color: 'blue'
  },
  { 
    id: '45237', 
    name1: 'ヤマダ', 
    name2: 'さくら', 
    startTime: '19:00', 
    type1: 'S', 
    type2: 'GIRL', 
    endTime: '21:00', 
    location: '京都', 
    store: 'クラブエレガンス',
    color: 'pink'
  },
  { 
    id: '72851', 
    name1: 'サイトウ', 
    name2: '美咲', 
    startTime: '20:30', 
    type1: 'RH', 
    type2: 'LADY', 
    endTime: '22:30', 
    location: '南心', 
    store: 'ラウンジ桜',
    color: 'blue'
  },
  { 
    id: '89214', 
    name1: 'イトウ', 
    name2: 'あやの', 
    startTime: '22:00', 
    type1: '確S', 
    type2: 'Stand', 
    endTime: '0:00', 
    location: '京都', 
    store: 'ナイトクラブMIX',
    color: 'pink'
  },
];

// 所属事務所変更データ
const officeChangeData = [
  { id: 1, checkboxes: [false, false, false, false], number: 46, area: '京都', type: 'G', name: 'かりん', count: 2, status: '終了' },
  { id: 2, checkboxes: [false, false, false, false], number: 23, area: '大阪', type: 'L', name: 'みゆき', count: 1, status: '待機' },
  { id: 3, checkboxes: [false, false, false, false], number: 38, area: '南心', type: 'G', name: 'あかり', count: 3, status: '移動中' },
  { id: 4, checkboxes: [false, false, false, false], number: 15, area: '京都', type: 'L', name: 'さくら', count: 1, status: '終了' },
];

// 所属事務所データ
const officeAssignmentData = [
  { id: 1, driverArea: '南 和食6', startTime: '17:00', departure: '京都駅八条口', endTime: '22:00', returnTime: '23:30', destination: '鳥丸今出川', staff: '南' },
  { id: 2, driverArea: '北 洋食3', startTime: '18:30', departure: '四条河原町', endTime: '23:00', returnTime: '0:30', destination: '烏丸御池', staff: '北村' },
  { id: 3, driverArea: '東 和食2', startTime: '19:00', departure: '祇園四条', endTime: '1:00', returnTime: '2:00', destination: '三条京阪', staff: '東山' },
];

// 出勤管理データ
const attendanceManagementData = [
  { id: 1, status: '出勤', type: '社員', name: '吉田 峯雅10', startTime: '17:00', endTime: '4:00', statusLabel: '出勤', checkboxes: [true, true], icons: ['✉', '✕', '👤', ''] },
  { id: 2, status: '希望', type: 'アルバイト', name: '田中 一郎', startTime: '18:00', endTime: '2:00', statusLabel: '希望', checkboxes: [true, false], icons: ['✉', '', '👤', '✕'] },
  { id: 3, status: '出勤', type: '社員', name: '佐藤 次郎', startTime: '19:00', endTime: '3:00', statusLabel: '出勤', checkboxes: [true, true], icons: ['✉', '✕', '', ''] },
];

// ポジションデータ（前半）
const positionFirstHalfData = [
  { id: 1, position: '配車', members: [{ name: '?63 山岡 嘉和?', hasAction: true }, { name: '', hasAction: true }] },
  { id: 2, position: '京都フロント', members: [{ name: '', hasAction: true }] },
  { id: 3, position: '人妻フロント', members: [{ name: '?15 森川 隆登', hasAction: true }, { name: '', hasAction: true }] },
  { id: 4, position: 'FIRSTフロント', members: [{ name: '?77 植田 武', hasAction: true }, { name: '', hasAction: true }] },
  { id: 5, position: '南ICフロント', members: [{ name: '?54 片山 竜次', hasAction: true }, { name: '', hasAction: true }] },
];

// ポジションデータ（後半）
const positionSecondHalfData = [
  { id: 1, position: '会計', members: [{ name: '?25 松平 篤', hasAction: true }] },
  { id: 2, position: '配車', members: [{ name: '?77 坪平 中尾11', hasAction: true }, { name: '', hasAction: true }] },
  { id: 3, position: '京都フロント', members: [{ name: '?08 杉本 淳', hasAction: true }, { name: '', hasAction: true }] },
  { id: 4, position: '人妻フロント', members: [{ name: '678 中村 南斗', hasAction: true }, { name: '', hasAction: true }] },
  { id: 5, position: 'FIRSTフロント', members: [{ name: '', hasAction: true }] },
  { id: 6, position: '南ICフロント', members: [{ name: '? 汐崎 哲也3', hasAction: true }, { name: '', hasAction: true }] },
];

// スタッフ予定リストデータ
const staffScheduleData = [
  '古田→ラビット話す(割引等)ドメイン変更比、☆前月推迁 南店話す',
  '(次回営業→投入金シメセット→セット)',
  '南☆ よく回る、スタッフの人数出す、空、応時間で手緒列案、シメ確認作不',
  '(南店長、副座05月 2000迄;5決時)',
  '6月度日程発教み',
  'システムの方が会計予定',
  '南→石古遠室不に対象達室大名>前',
  'ドライバ一早畑打ちし半館下さい♪次時',
  '出罰-訓時05H 17:00迄二次時',
  '中林-訓時05H 17:00止前ぷ次時',
];

// 面接予定データ
const interviewScheduleData = [
  { id: 1, time: '15:30', type: '入店', location: 'セブンイレブン新町一条店', position: 'ホステス', staff: '南 和宣6' },
  { id: 2, time: '17:00', type: '面接', location: '京都駅八条口', position: 'ドライバ', staff: '北村 太郎' },
];

export default function TehaiPage() {
  React.useEffect(() => {
    document.title = '手配表 - Dispatch Harmony Hub';
  }, []);

  return (
    <div className="w-[1920px] h-[1080px] relative bg-white flex flex-col text-xs">
      {/* ヘッダー - 配車パネルと同じスタイル */}
      <div className="w-full h-[50px] bg-white border-b border-zinc-300">
        <div className="flex items-center h-full px-2">
          {/* ダッシュボードに戻る - 左端 */}
          <Link href="/dashboard">
            <Button
              variant="outline"
              className="h-8 px-3 text-xs flex items-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              ダッシュボードに戻る
            </Button>
          </Link>

          {/* 中央配置のボタン群 */}
          <div className="flex-1 flex items-center justify-center gap-2">
            {/* 手配表タイトル */}
            <h1 className="text-lg font-bold mr-2">手配表</h1>

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
            <Link href="/customer-ledger">
              <Button
                variant="outline"
                className="h-8 px-4 text-xs border-black"
              >
                新顧客検索
              </Button>
            </Link>

            {/* RT IIパネル */}
            <Link href="/rt2-panel">
              <Button
                className="h-8 px-4 text-xs bg-purple-400 hover:bg-purple-500 text-black border border-black"
              >
                RT IIパネル
              </Button>
            </Link>

            {/* RTパネル */}
            <Button
              className="h-8 px-4 text-xs bg-orange-400 hover:bg-orange-500 text-black border border-black"
              onClick={() => {}}
            >
              RTパネル
            </Button>

            {/* 配車パネル */}
            <Link href="/dispatch-panel-2d">
              <Button
                className="h-8 px-4 text-xs bg-amber-200 hover:bg-amber-300 text-black border border-black"
              >
                配車パネル
              </Button>
            </Link>

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

      {/* メインコンテンツ */}
      <div className="flex flex-1">
        {/* 左1列目: 所属事務所変更 */}
        <div className="h-full border-r border-gray-400 w-[280px] bg-white flex flex-col">
          <div className="border-b border-gray-400 py-1 px-2">
            <a href="#" className="text-blue-600 underline font-bold text-sm">所属事務所変更</a>
          </div>
          <div className="flex-1 overflow-auto">
            {officeChangeData.map((data) => (
              <div key={data.id} className="flex items-center border-b border-gray-300 text-[12px] bg-white">
                {data.checkboxes.map((checked, idx) => (
                  <div key={idx} className="w-4 text-center border-r border-gray-300">
                    <input type="checkbox" className="w-3 h-3" defaultChecked={checked} />
                  </div>
                ))}
                <div className="w-6 text-center border-r border-gray-300">{data.number}</div>
                <div className="w-10 text-center border-r border-gray-300">{data.area}</div>
                <div className="w-8 text-center border-r border-gray-300 bg-white">{data.type}</div>
                <div className="flex-1 border-r border-gray-300 text-blue-600">{data.name}</div>
                <div className="w-4 text-center border-r border-gray-300 font-bold">{data.count}</div>
                <div className="w-8 text-center border-r border-gray-300 bg-gray-200">{data.status}</div>
                <div className="w-4 text-center"></div>
              </div>
            ))}
          </div>
        </div>

        {/* 左2列目: 所属事務所 */}
        <div className="h-full border-r border-gray-400 w-[380px] bg-white flex flex-col">
          <div className="border-b border-gray-400 px-2 bg-gray-100">
            <span className="border border-gray-600 px-2 py-0.5 text-sm">所属事務所:</span>
          </div>
          {/* ヘッダー行 */}
          <div className="flex items-center border-b border-gray-400 text-[11px] bg-gray-100 font-bold">
            <div className="w-5 text-center border-r border-gray-300"></div>
            <div className="w-16 text-center border-r border-gray-300 px-1">現地 迎えドライバ</div>
            <div className="w-10 text-center border-r border-gray-300"></div>
            <div className="flex-1 text-center border-r border-gray-300 px-1">出発支場所</div>
            <div className="w-10 text-center border-r border-gray-300">終了</div>
            <div className="w-10 text-center border-r border-gray-300">帰宅</div>
            <div className="text-center border-r border-gray-300 px-1">送り場所</div>
            <div className="text-center px-1">担当者</div>
          </div>
          <div className="flex-1 overflow-auto">
            {officeAssignmentData.map((data) => (
              <div key={data.id} className="flex items-center border-b border-gray-300 text-[12px] bg-white">
                <div className="w-5 text-center border-r border-gray-300 bg-lime-400 font-bold">{data.id}</div>
                <div className="w-16 border-r border-gray-300 px-1">{data.driverArea}</div>
                <div className="w-10 text-center border-r border-gray-300">{data.startTime}</div>
                <div className="flex-1 border-r border-gray-300 px-1">{data.departure}</div>
                <div className="w-10 text-center border-r border-gray-300">{data.endTime}</div>
                <div className="w-10 text-center border-r border-gray-300">{data.returnTime}</div>
                <div className="border-r border-gray-300 px-1">{data.destination}</div>
                <div className="text-center px-1">{data.staff}</div>
              </div>
            ))}
          </div>
        </div>

        {/* 左3列目: 出勤管理テーブル */}
        <div className="h-full border-r border-gray-400 w-[446px] bg-white flex flex-col">
          <div className="flex-1 overflow-auto">
            {attendanceManagementData.map((data) => (
              <div key={data.id} className="flex items-center border-b border-gray-300 text-[12px] bg-white">
                <div className="w-4 text-center border-r border-gray-300 bg-blue-600 text-white font-bold">{data.id}</div>
                <div className="w-10 text-center border-r border-gray-300 bg-lime-400">{data.status}</div>
                <div className="w-10 text-center border-r border-gray-300 bg-lime-400">{data.type}</div>
                <div className="w-24 border-r border-gray-300">{data.name}</div>
                <div className="w-12 text-center border-r border-gray-300 text-blue-600 font-bold">{data.startTime}</div>
                <div className="w-12 text-center border-r border-gray-300">{data.endTime}</div>
                <div className="w-6 text-center border-r border-gray-300 bg-lime-400 text-[9px]">{data.statusLabel}</div>
                <div className="w-12 flex items-center justify-center gap-1 border-r border-gray-300">
                  {data.checkboxes.map((checked, idx) => (
                    <input key={idx} type="checkbox" className="w-3 h-3" defaultChecked={checked} />
                  ))}
                </div>
                <div className="w-24 flex items-center gap-0.5">
                  {data.icons.map((icon, idx) => (
                    <div key={idx} className={`w-5 h-5 flex items-center justify-center text-[9px] ${
                      icon === '✉' ? 'bg-lime-400' : 
                      icon === '✕' ? 'bg-gray-200' : 
                      icon === '👤' ? 'bg-pink-300' : 
                      'border border-gray-400 bg-white'
                    }`}>
                      {icon}
                    </div>
                  ))}
                </div>
                <div className="w-3 border-l border-gray-300"></div>
              </div>
            ))}
          </div>
        </div>

        {/* 右コラム */}
        <div className="h-full border-r border-gray-400 flex-1 grid grid-rows-[55%_23%_22%]" style={{ gridTemplateColumns: '33.33% 33.33% calc(33.33% - 160px) 160px' }}>
            {/* ポジションブロック - 写真通りの完全な内容 */}
            <div className="row-span-2 border-r border-gray-400 bg-white flex flex-col text-[12px]">
              <div className="text-center text-blue-600 font-bold border-b border-gray-400 py-1">ポジション</div>
              <div className="text-center border-b border-gray-400 py-0.5">
                <span className="text-pink-500">（配車3区目は責任者）</span>
              </div>
              <div className="flex flex-1">
                {/* 前半列 */}
                <div className="w-1/2 flex flex-col border-r border-gray-400">
                  <div className="text-center border-b border-gray-400 bg-gray-100 py-0.5">前半</div>
                  <div className="flex-1 flex flex-col px-1 py-1">
                    {positionFirstHalfData.map((position) => (
                      <div key={position.id} className="mb-2">
                        <div className={`text-center mb-1 ${position.position === '配車' ? 'font-bold' : ''}`}>
                          {position.position}
                        </div>
                        <div className="border border-gray-800">
                          {position.members.map((member, idx) => (
                            <div 
                              key={idx} 
                              className={`flex items-center justify-between h-5 px-0.5 ${
                                member.name ? 'bg-white' : 'bg-gray-200'
                              } ${idx < position.members.length - 1 ? 'border-b border-gray-300' : ''}`}
                            >
                              {member.name && <span>{member.name}</span>}
                              {member.hasAction && (
                                <div className="w-4 h-4 rounded-full bg-pink-500 flex items-center justify-center ml-auto">
                                  <span className="text-white text-[10px] leading-none">×</span>
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                {/* 後半列 */}
                <div className="w-1/2 flex flex-col">
                  <div className="text-center border-b border-gray-400 bg-gray-100 py-0.5">後半</div>
                  <div className="flex-1 flex flex-col px-1 py-1">
                    {positionSecondHalfData.map((position) => (
                      <div key={position.id} className="mb-2">
                        <div className={`text-center mb-1 ${position.position === '会計' || position.position === '配車' ? 'font-bold' : ''}`}>
                          {position.position}
                        </div>
                        <div className="border border-gray-800">
                          {position.members.map((member, idx) => (
                            <div 
                              key={idx} 
                              className={`flex items-center justify-between h-5 px-0.5 ${
                                member.name ? 'bg-white' : 'bg-gray-200'
                              } ${idx < position.members.length - 1 ? 'border-b border-gray-300' : ''}`}
                            >
                              {member.name && <span>{member.name}</span>}
                              {member.hasAction && (
                                <div className="w-4 h-4 rounded-full bg-pink-500 flex items-center justify-center ml-auto">
                                  <span className="text-white text-[10px] leading-none">×</span>
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              {/* 下部セクション */}
              <div className="border-t border-gray-400">
                <div className="flex">
                  <div className="w-1/2 border-r border-gray-400 px-1 py-1">
                    <div className="text-center text-[10px] mb-1">有給使用者及び給引き者</div>
                    <div className="border border-gray-800">
                      <div className="flex items-center justify-end h-5 bg-gray-200 px-0.5">
                        <div className="w-4 h-4 rounded-full bg-pink-500 flex items-center justify-center">
                          <span className="text-white text-[10px] leading-none">×</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="w-1/2 px-1 py-1">
                    <div className="text-center text-[10px] mb-1">南IC会計</div>
                    <div className="border border-gray-800">
                      <div className="flex items-center justify-end h-5 bg-gray-200 px-0.5">
                        <div className="w-4 h-4 rounded-full bg-pink-500 flex items-center justify-center">
                          <span className="text-white text-[10px] leading-none">×</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* 出勤希望アルバイト（シアン） */}
            <div className="border-r border-gray-400 bg-cyan-300 flex flex-col">
              <div className="flex gap-2 justify-center items-center py-1 border-b border-gray-400">
                <button className="px-4 py-1 bg-blue-100 border border-gray-800 text-black text-xs font-bold">
                  ⬇ 一括戻す ⬇
                </button>
                <button className="px-4 py-1 bg-blue-100 border border-gray-800 text-black text-xs font-bold">
                  ⬇ 一括移動 ⬇
                </button>
              </div>
              <div className="flex items-center justify-between bg-cyan-300 text-black py-1 text-xs border-b border-gray-800">
                <div className="flex-1 text-center font-normal">出勤希望アルバイト</div>
                <div className="flex gap-6 pr-3">
                  <span className="font-normal">出勤</span>
                  <span className="font-normal">退社</span>
                  <span className="font-normal">配務</span>
                </div>
              </div>
              <div className="flex-1 overflow-auto bg-cyan-300">
                <table className="w-full text-xs border-collapse">
                  <tbody className="text-[10px]">
                    {attendanceData.map((data) => (
                      <tr key={data.id} className={data.selected ? 'bg-blue-400' : 'bg-white'}>
                        <td className="text-center border-b border-r border-gray-400">{data.id}</td>
                        <td className="border-b border-r border-gray-400">{data.lastName}</td>
                        <td className="border-b border-r border-gray-400">{data.firstName}</td>
                        <td className="text-center border-b border-r border-gray-400">{data.status}</td>
                        <td className="text-center border-b border-r border-gray-400">{data.startTime}</td>
                        <td className="text-center border-b border-r border-gray-400">{data.endTime}</td>
                        <td className="border-b border-gray-400">{data.type}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* スタッフ予定リスト（黄色） */}
            <div className="col-span-2 bg-white flex flex-col">
              <div className="bg-yellow-300 text-black text-center py-1 text-xs font-bold">
                ▲スタッフ予定リスト
              </div>
              <div className="flex-1 overflow-auto text-[11px] relative" style={{
                background: 'repeating-linear-gradient(to bottom, #d4f1d4 0px, #d4f1d4 24px, white 24px, white 48px)',
                lineHeight: '12px'
              }}>
                {staffScheduleData.map((text, idx) => (
                  <div key={idx} className="px-2 overflow-hidden whitespace-nowrap" style={{ height: '12px' }}>
                    {text}
                  </div>
                ))}
                <div style={{ height: '120px' }}></div>
              </div>
            </div>
          {/* 2行目 - 2列目: 予約 */}
          <div className="col-span-2 border-t border-gray-400 border-r border-gray-400 bg-white flex flex-col">
            <div className="bg-gray-300 text-black text-center py-0.5 text-xs border-b border-gray-400">
              予約
            </div>
            <div className="flex-1 overflow-auto">
              {reservationData.map((res, index) => (
                <div 
                  key={index} 
                  className={`flex items-center text-xs border-b border-gray-300 ${
                    res.color === 'pink' ? 'bg-pink-200' : 'bg-blue-200'
                  }`}
                  style={{ height: '24px' }}
                >
                  <div className="w-[38px] text-center">{res.id}</div>
                  <div className="w-[42px] text-left">{res.name1}</div>
                  <div className="w-[42px] text-left">{res.name2}</div>
                  <div className="w-[28px] text-center">{res.startTime}</div>
                  <div className="w-[28px] text-center">{res.type1}</div>
                  <div className="w-[38px] text-center">{res.type2}</div>
                  <div className="w-[28px] text-center">{res.endTime}</div>
                  <div className="w-[32px] text-center">{res.location}</div>
                  <div className="flex-1 text-left pl-1">{res.store}</div>
                </div>
              ))}
            </div>
          </div>

          {/* 2行目 - 3列目: クイックメニュー（2行分） */}
          <div className="row-span-2 border-t border-gray-400 bg-gray-200 flex flex-col">
            <div className="bg-gray-400 text-black text-center py-1 text-xs font-bold">
              クイック
            </div>
            <div className="flex-1 p-1 overflow-auto">
              <button className="w-full mb-1 px-1 py-2 bg-red-400 text-black text-xs border border-gray-600">緊急連絡</button>
              <button className="w-full mb-1 px-1 py-2 bg-cyan-300 text-black text-xs border border-gray-600">レポート</button>
              <button className="w-full mb-1 px-1 py-2 bg-lime-400 text-black text-xs border border-gray-600">集計</button>
              <button className="w-full mb-1 px-1 py-2 bg-gray-300 text-black text-xs border border-gray-600">設定</button>
            </div>
          </div>

          {/* 3行目 - 未定ブロックと予約詳細のコンテナ（均等配分） */}
          <div className="col-span-3 border-t border-gray-400 flex">
            {/* 面接予定ブロック */}
            <div className="w-1/2 border-r border-gray-400 bg-white flex flex-col">
              <div className="bg-gradient-to-b from-blue-400 to-blue-500 text-white text-center py-2 text-base font-bold border-b-2 border-blue-600 shadow-md">
                面接予定
              </div>
              {/* 面接情報 */}
              {interviewScheduleData.map((interview) => (
                <div key={interview.id} className="bg-white px-3 py-2 border-b border-gray-300">
                  <div className="text-xs flex items-center gap-2">
                    <span className="font-bold text-sm">{interview.time}</span>
                    <span className="font-semibold">{interview.type}</span>
                    <span>{interview.location}</span>
                    <span className="font-semibold">{interview.position}</span>
                    <span className="ml-auto font-semibold">{interview.staff}</span>
                  </div>
                </div>
              ))}
              {/* ピンクブロック1 */}
              <div className="bg-pink-200 mx-2 mt-3 mb-2" style={{ height: '100px' }}>
              </div>
              {/* ピンクブロック2 */}
              <div className="bg-pink-200 mx-2 mb-3" style={{ height: '100px' }}>
              </div>
            </div>

            {/* 予約詳細 */}
            <div className="w-1/2 border-r border-gray-400 bg-white flex flex-col">
              <div className="bg-cyan-400 text-black text-center py-1 text-xs font-bold">
                予約詳細
              </div>
              <div className="flex-1 p-2 overflow-auto text-xs">
                <table className="w-full border border-gray-400">
                  <thead className="bg-cyan-200">
                    <tr>
                      <th className="py-1 border-b border-gray-400 border-r border-gray-400">時間</th>
                      <th className="py-1 border-b border-gray-400 border-r border-gray-400">顧客</th>
                      <th className="py-1 border-b border-gray-400 border-r border-gray-400">コース</th>
                      <th className="py-1 border-b border-gray-400">店舗</th>
                    </tr>
                  </thead>
                  <tbody>
                    {reservationData.map((res, index) => (
                      <tr key={index} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-100'}>
                        <td className="py-1 text-center border-b border-gray-400 border-r border-gray-400">{res.startTime}</td>
                        <td className="py-1 text-center border-b border-gray-400 border-r border-gray-400">{res.name1}</td>
                        <td className="py-1 text-center border-b border-gray-400 border-r border-gray-400">{res.type2}</td>
                        <td className="py-1 text-center border-b border-gray-400 text-xs">{res.store}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
