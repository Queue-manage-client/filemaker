'use client';

import React from 'react';

const reservationData = [
  { time: '19:00', customer: 'タケダ', duration: '90分', type: '本指', course: '2時間', store: 'マイドリームス店' },
  { time: '20:00', customer: 'スズキ', duration: '2H', type: 'LADY', course: '2H', store: 'ファインガーデン' },
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
        <div className="h-full border-r border-gray-400 w-[461px] bg-white flex flex-col">
          <div className="border-b border-gray-400 px-2 bg-gray-100">
            <span className="border border-gray-600 px-2 py-0.5 text-sm">所属事務所:</span>
          </div>
          <div className="flex-1 overflow-auto">
            <div className="flex items-center border-b border-gray-300 text-[12px] bg-white">
              <div className="w-5 text-center border-r border-gray-300 bg-lime-400 font-bold">1</div>
              <div className="w-20 border-r border-gray-300">南 和食6</div>
              <div className="w-10 text-center border-r border-gray-300">17:00</div>
              <div className="flex-1 border-r border-gray-300">京都駅八条口</div>
              <div className="w-10 text-center border-r border-gray-300">22:00</div>
              <div className="w-10 text-center border-r border-gray-300"></div>
              <div className="w-20 border-r border-gray-300">鳥丸今出川</div>
              <div className="w-10 text-center">南</div>
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
        <div className="h-full border-r border-gray-400 flex-1 flex flex-col">
          <div className="flex h-[56%]">
            {/* ポジションブロック - 写真通りの完全な内容 */}
            <div className="flex-[226] h-full border-r border-gray-400 bg-white flex flex-col text-[12px]">
              <div className="text-center text-blue-600 font-bold border-b border-gray-400 py-1">ポジション</div>
              <div className="text-center border-b border-gray-400 py-0.5">
                <span className="text-pink-500">（配車3区目は責任者）</span>
                <span className="ml-2">後半</span>
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
                  <div className="text-center border-b border-gray-400 bg-gray-100 py-0.5">会計</div>
                  <div className="flex-1 flex flex-col px-1 py-1">
                    <div className="border border-gray-800 mb-2 mt-6">
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

            {/* 予約情報（ピンク） */}
            <div className="flex-[263] h-full border-r border-gray-400 bg-white flex flex-col">
              <div className="bg-fuchsia-400 text-black text-center py-1 text-xs font-bold">
                本日予約一覧
              </div>
              <div className="flex-1 overflow-auto">
                <table className="w-full text-xs">
                  <thead className="bg-fuchsia-200">
                    <tr>
                      <th className="py-1 border-b border-gray-400 border-r border-gray-400">時間</th>
                      <th className="py-1 border-b border-gray-400 border-r border-gray-400">顧客</th>
                      <th className="py-1 border-b border-gray-400 border-r border-gray-400">時間</th>
                      <th className="py-1 border-b border-gray-400">種別</th>
                    </tr>
                  </thead>
                  <tbody>
                    {reservationData.map((res, index) => (
                      <tr key={index} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-100'}>
                        <td className="py-1 text-center border-b border-gray-400 border-r border-gray-400">{res.time}</td>
                        <td className="py-1 text-center border-b border-gray-400 border-r border-gray-400">{res.customer}</td>
                        <td className="py-1 text-center border-b border-gray-400 border-r border-gray-400">{res.duration}</td>
                        <td className="py-1 text-center border-b border-gray-400">
                          <span className="bg-fuchsia-400 text-black px-1">{res.type}</span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* メモ・特記事項（黄色） */}
            <div className="flex-[262] h-full bg-yellow-100 flex flex-col">
              <div className="bg-yellow-400 text-black text-center py-1 text-xs font-bold">
                連絡事項/メモ
              </div>
              <div className="flex-1 p-2 overflow-auto">
                <div className="bg-white border border-gray-400 p-2 mb-2 text-xs">
                  <div className="font-bold text-black mb-1">本日の注意事項</div>
                  <p>・20時以降は混雑が予想されます</p>
                  <p>・新人研修中のスタッフ2名</p>
                </div>
                <div className="bg-white border border-gray-400 p-2 text-xs">
                  <div className="font-bold text-black mb-1">システム連絡</div>
                  <p>・システム定期メンテナンス予定</p>
                  <p>・明日AM2:00〜AM4:00</p>
                </div>
              </div>
            </div>
          </div>

          {/* 下部44% */}
          <div className="flex h-[44%] border-t border-gray-400">
            {/* 左86%エリア */}
            <div className="w-[86%] h-full flex flex-col">
              {/* 上部34%: 直近予定 */}
              <div className="h-[34%] border-b border-gray-400 bg-white">
                <div className="bg-lime-400 text-black text-center py-1 text-xs font-bold">
                  直近予定
                </div>
                <div className="p-2 text-xs">
                  <div className="flex gap-4">
                    <div className="flex-1">
                      <span className="font-bold text-lime-600">19:30</span>
                      <span className="ml-2">田中様 来店予定</span>
                    </div>
                    <div className="flex-1">
                      <span className="font-bold text-blue-600">20:00</span>
                      <span className="ml-2">鈴木様 予約確認</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* 下部66%: 2列 */}
              <div className="flex h-[66%]">
                {/* 左50%: 予約詳細 */}
                <div className="w-[50%] h-full border-r border-gray-400 bg-white flex flex-col">
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
                            <td className="py-1 text-center border-b border-gray-400 border-r border-gray-400">{res.time}</td>
                            <td className="py-1 text-center border-b border-gray-400 border-r border-gray-400">{res.customer}</td>
                            <td className="py-1 text-center border-b border-gray-400 border-r border-gray-400">{res.course}</td>
                            <td className="py-1 text-center border-b border-gray-400 text-xs">{res.store}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* 右50%: ポイント管理 */}
                <div className="w-[50%] h-full bg-white flex flex-col">
                  <div className="bg-fuchsia-400 text-black text-center py-1 text-xs font-bold">
                    ポイント管理
                  </div>
                  <div className="flex-1 p-2 overflow-auto text-xs">
                    <div className="border border-gray-400 p-2 mb-2 bg-fuchsia-50">
                      <div className="flex justify-between mb-1">
                        <span className="font-bold">田中様</span>
                        <span className="text-fuchsia-600 font-bold">1,250pt</span>
                      </div>
                      <div className="text-gray-600">前回来店: 2024/01/10</div>
                    </div>
                    <div className="border border-gray-400 p-2 bg-fuchsia-50">
                      <div className="flex justify-between mb-1">
                        <span className="font-bold">鈴木様</span>
                        <span className="text-fuchsia-600 font-bold">3,500pt</span>
                      </div>
                      <div className="text-gray-600">前回来店: 2024/01/12</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* 右14%: サイドメニュー */}
            <div className="w-[14%] h-full bg-gray-200 flex flex-col border-l border-gray-400">
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
          </div>
        </div>
      </div>
    </div>
  );
}
