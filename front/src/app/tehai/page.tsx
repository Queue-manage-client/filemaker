'use client';

import React from 'react';

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
];

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
];

export default function TehaiPage() {
  React.useEffect(() => {
    document.title = '手配表 - Dispatch Harmony Hub';
  }, []);

  return (
    <div className="w-[2000px] h-[1080px] relative bg-white flex flex-col text-xs">
      {/* ヘッダー部分 */}
      <div className="w-full h-[100px] bg-gray-200 border-b border-gray-400 flex items-center">
        <div className="flex gap-1 px-2">
          <button className="px-3 py-1 bg-lime-400 text-black text-sm font-bold border border-gray-600">所属/稼働/状況</button>
          <button className="px-3 py-1 bg-gray-300 text-black text-sm border border-gray-600">外部業者/状況</button>
          <button className="px-3 py-1 bg-fuchsia-400 text-black text-sm font-bold border border-gray-600">配車確認（様相関係/担当）</button>
        </div>
        <div className="ml-auto flex gap-2 px-4">
          <span className="text-sm font-bold">2024/01/15 (月)</span>
          <span className="text-sm font-bold text-blue-600">19:30:45</span>
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
            <div className="flex items-center border-b border-gray-300 text-[12px] bg-white">
              <div className="w-4 text-center border-r border-gray-300"><input type="checkbox" className="w-3 h-3" /></div>
              <div className="w-4 text-center border-r border-gray-300"><input type="checkbox" className="w-3 h-3" /></div>
              <div className="w-4 text-center border-r border-gray-300"><input type="checkbox" className="w-3 h-3" /></div>
              <div className="w-4 text-center border-r border-gray-300"><input type="checkbox" className="w-3 h-3" /></div>
              <div className="w-6 text-center border-r border-gray-300">46</div>
              <div className="w-10 text-center border-r border-gray-300">京都</div>
              <div className="w-8 text-center border-r border-gray-300 bg-white">G</div>
              <div className="flex-1 border-r border-gray-300 text-blue-600">かりん</div>
              <div className="w-4 text-center border-r border-gray-300 font-bold">2</div>
              <div className="w-8 text-center border-r border-gray-300 bg-gray-200">終了</div>
              <div className="w-4 text-center"></div>
            </div>
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
            <div className="flex items-center border-b border-gray-300 text-[12px] bg-white">
              <div className="w-5 text-center border-r border-gray-300 bg-lime-400 font-bold">1</div>
              <div className="w-16 border-r border-gray-300 px-1">南 和食6</div>
              <div className="w-10 text-center border-r border-gray-300">17:00</div>
              <div className="flex-1 border-r border-gray-300 px-1">京都駅八条口</div>
              <div className="w-10 text-center border-r border-gray-300">22:00</div>
              <div className="w-10 text-center border-r border-gray-300">23:30</div>
              <div className="border-r border-gray-300 px-1">鳥丸今出川</div>
              <div className="text-center px-1">南</div>
            </div>
          </div>
        </div>

        {/* 左3列目: 出勤管理テーブル */}
        <div className="h-full border-r border-gray-400 w-[446px] bg-white flex flex-col">
          <div className="flex-1 overflow-auto">
            <div className="flex items-center border-b border-gray-300 text-[12px] bg-white">
              <div className="w-4 text-center border-r border-gray-300 bg-blue-600 text-white font-bold">1</div>
              <div className="w-10 text-center border-r border-gray-300 bg-lime-400">出勤</div>
              <div className="w-10 text-center border-r border-gray-300 bg-lime-400">社員</div>
              <div className="w-24 border-r border-gray-300">吉田 峯雅10</div>
              <div className="w-12 text-center border-r border-gray-300 text-blue-600 font-bold">17:00</div>
              <div className="w-12 text-center border-r border-gray-300">4:00</div>
              <div className="w-6 text-center border-r border-gray-300 bg-lime-400 text-[9px]">出勤</div>
              <div className="w-12 flex items-center justify-center gap-1 border-r border-gray-300">
                <input type="checkbox" className="w-3 h-3" defaultChecked />
                <input type="checkbox" className="w-3 h-3" defaultChecked />
              </div>
              <div className="w-24 flex items-center gap-0.5">
                <div className="w-5 h-5 bg-lime-400 flex items-center justify-center text-[9px]">✉</div>
                <div className="w-5 h-5 bg-gray-200 flex items-center justify-center text-[9px]">✕</div>
                <div className="w-5 h-5 bg-pink-300 flex items-center justify-center text-[9px]">👤</div>
                <div className="w-5 h-5 border border-gray-400 bg-white"></div>
              </div>
              <div className="w-3 border-l border-gray-300"></div>
            </div>
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
                    <div className="text-center font-bold mb-1">配車</div>
                    <div className="border border-gray-800 mb-2">
                      <div className="flex items-center justify-between h-5 bg-white border-b border-gray-300 px-0.5">
                        <span>?63 山岡 嘉和?</span>
                        <div className="w-4 h-4 rounded-full bg-pink-500 flex items-center justify-center">
                          <span className="text-white text-[10px] leading-none">×</span>
                        </div>
                      </div>
                      <div className="flex items-center justify-end h-5 bg-gray-200 px-0.5">
                        <div className="w-4 h-4 rounded-full bg-pink-500 flex items-center justify-center">
                          <span className="text-white text-[10px] leading-none">×</span>
                        </div>
                      </div>
                    </div>
                    <div className="text-center mb-1">京都フロント</div>
                    <div className="border border-gray-800 mb-2">
                      <div className="flex items-center justify-end h-5 bg-gray-200 px-0.5">
                        <div className="w-4 h-4 rounded-full bg-pink-500 flex items-center justify-center">
                          <span className="text-white text-[10px] leading-none">×</span>
                        </div>
                      </div>
                    </div>
                    <div className="text-center mb-1">人妻フロント</div>
                    <div className="border border-gray-800 mb-2">
                      <div className="flex items-center justify-between h-5 bg-white border-b border-gray-300 px-0.5">
                        <span>?15 森川 隆登</span>
                        <div className="w-4 h-4 rounded-full bg-pink-500 flex items-center justify-center">
                          <span className="text-white text-[10px] leading-none">×</span>
                        </div>
                      </div>
                      <div className="flex items-center justify-end h-5 bg-gray-200 px-0.5">
                        <div className="w-4 h-4 rounded-full bg-pink-500 flex items-center justify-center">
                          <span className="text-white text-[10px] leading-none">×</span>
                        </div>
                      </div>
                    </div>
                    <div className="text-center mb-1">FIRSTフロント</div>
                    <div className="border border-gray-800 mb-2">
                      <div className="flex items-center justify-between h-5 bg-white border-b border-gray-300 px-0.5">
                        <span>?77 植田 武</span>
                        <div className="w-4 h-4 rounded-full bg-pink-500 flex items-center justify-center">
                          <span className="text-white text-[10px] leading-none">×</span>
                        </div>
                      </div>
                      <div className="flex items-center justify-end h-5 bg-gray-200 px-0.5">
                        <div className="w-4 h-4 rounded-full bg-pink-500 flex items-center justify-center">
                          <span className="text-white text-[10px] leading-none">×</span>
                        </div>
                      </div>
                    </div>
                    <div className="text-center mb-1">南ICフロント</div>
                    <div className="border border-gray-800 mb-2">
                      <div className="flex items-center justify-between h-5 bg-white border-b border-gray-300 px-0.5">
                        <span>?54 片山 竜次</span>
                        <div className="w-4 h-4 rounded-full bg-pink-500 flex items-center justify-center">
                          <span className="text-white text-[10px] leading-none">×</span>
                        </div>
                      </div>
                      <div className="flex items-center justify-end h-5 bg-gray-200 px-0.5">
                        <div className="w-4 h-4 rounded-full bg-pink-500 flex items-center justify-center">
                          <span className="text-white text-[10px] leading-none">×</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                {/* 後半列 */}
                <div className="w-1/2 flex flex-col">
                  <div className="text-center border-b border-gray-400 bg-gray-100 py-0.5">後半</div>
                  <div className="flex-1 flex flex-col px-1 py-1">
                    <div className="text-center font-bold mb-1">会計</div>
                    <div className="border border-gray-800 mb-2">
                      <div className="flex items-center justify-between h-5 bg-white px-0.5">
                        <span>?25 松平 篤</span>
                        <div className="w-4 h-4 rounded-full bg-pink-500 flex items-center justify-center">
                          <span className="text-white text-[10px] leading-none">×</span>
                        </div>
                      </div>
                    </div>
                    <div className="text-center font-bold mb-1">配車</div>
                    <div className="border border-gray-800 mb-2">
                      <div className="flex items-center justify-between h-5 bg-white border-b border-gray-300 px-0.5">
                        <span>?77 坪平 中尾11</span>
                        <div className="w-4 h-4 rounded-full bg-pink-500 flex items-center justify-center">
                          <span className="text-white text-[10px] leading-none">×</span>
                        </div>
                      </div>
                      <div className="flex items-center justify-end h-5 bg-gray-200 px-0.5">
                        <div className="w-4 h-4 rounded-full bg-pink-500 flex items-center justify-center">
                          <span className="text-white text-[10px] leading-none">×</span>
                        </div>
                      </div>
                    </div>
                    <div className="text-center mb-1">京都フロント</div>
                    <div className="border border-gray-800 mb-2">
                      <div className="flex items-center justify-between h-5 bg-white border-b border-gray-300 px-0.5">
                        <span>?08 杉本 淳</span>
                        <div className="w-4 h-4 rounded-full bg-pink-500 flex items-center justify-center">
                          <span className="text-white text-[10px] leading-none">×</span>
                        </div>
                      </div>
                      <div className="flex items-center justify-end h-5 bg-gray-200 px-0.5">
                        <div className="w-4 h-4 rounded-full bg-pink-500 flex items-center justify-center">
                          <span className="text-white text-[10px] leading-none">×</span>
                        </div>
                      </div>
                    </div>
                    <div className="text-center mb-1">人妻フロント</div>
                    <div className="border border-gray-800 mb-2">
                      <div className="flex items-center justify-between h-5 bg-white border-b border-gray-300 px-0.5">
                        <span>678 中村 南斗</span>
                        <div className="w-4 h-4 rounded-full bg-pink-500 flex items-center justify-center">
                          <span className="text-white text-[10px] leading-none">×</span>
                        </div>
                      </div>
                      <div className="flex items-center justify-end h-5 bg-gray-200 px-0.5">
                        <div className="w-4 h-4 rounded-full bg-pink-500 flex items-center justify-center">
                          <span className="text-white text-[10px] leading-none">×</span>
                        </div>
                      </div>
                    </div>
                    <div className="text-center mb-1">FIRSTフロント</div>
                    <div className="border border-gray-800 mb-2">
                      <div className="flex items-center justify-end h-5 bg-gray-200 px-0.5">
                        <div className="w-4 h-4 rounded-full bg-pink-500 flex items-center justify-center">
                          <span className="text-white text-[10px] leading-none">×</span>
                        </div>
                      </div>
                    </div>
                    <div className="text-center mb-1">南ICフロント</div>
                    <div className="border border-gray-800 mb-2">
                      <div className="flex items-center justify-between h-5 bg-white border-b border-gray-300 px-0.5">
                        <span>? 汐崎 哲也3</span>
                        <div className="w-4 h-4 rounded-full bg-pink-500 flex items-center justify-center">
                          <span className="text-white text-[10px] leading-none">×</span>
                        </div>
                      </div>
                      <div className="flex items-center justify-end h-5 bg-gray-200 px-0.5">
                        <div className="w-4 h-4 rounded-full bg-pink-500 flex items-center justify-center">
                          <span className="text-white text-[10px] leading-none">×</span>
                        </div>
                      </div>
                    </div>
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
                <div className="px-2 overflow-hidden whitespace-nowrap" style={{ height: '12px' }}>古田→ラビット話す(割引等)ドメイン変更比、☆前月推迁 南店話す</div>
                <div className="px-2 overflow-hidden whitespace-nowrap" style={{ height: '12px' }}>(次回営業→投入金シメセット→セット)</div>
                <div className="px-2 overflow-hidden whitespace-nowrap" style={{ height: '12px' }}>南☆ よく回る、スタッフの人数出す、空、応時間で手緒列案、シメ確認作不</div>
                <div className="px-2 overflow-hidden whitespace-nowrap" style={{ height: '12px' }}>(南店長、副座05月 2000迄;5決時)</div>
                <div className="px-2 overflow-hidden whitespace-nowrap" style={{ height: '12px' }}>6月度日程発教み</div>
                <div className="px-2 overflow-hidden whitespace-nowrap" style={{ height: '12px' }}>システムの方が会計予定</div>
                <div className="px-2 overflow-hidden whitespace-nowrap" style={{ height: '12px' }}>南→石古遠室不に対象達室大名&gt;前</div>
                <div className="px-2 overflow-hidden whitespace-nowrap" style={{ height: '12px' }}>ドライバ一早畑打ちし半館下さい♪次時</div>
                <div className="px-2 overflow-hidden whitespace-nowrap" style={{ height: '12px' }}>出罰-訓時05H 17:00迄二次時</div>
                <div className="px-2 overflow-hidden whitespace-nowrap" style={{ height: '12px' }}>中林-訓時05H 17:00止前ぷ次時</div>
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
              <div className="bg-white px-3 py-2 border-b border-gray-300">
                <div className="text-xs flex items-center gap-2">
                  <span className="font-bold text-sm">15:30</span>
                  <span className="font-semibold">入店</span>
                  <span>セブンイレブン新町一条店</span>
                  <span className="font-semibold">ホステス</span>
                  <span className="ml-auto font-semibold">南 和宣6</span>
                </div>
              </div>
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
