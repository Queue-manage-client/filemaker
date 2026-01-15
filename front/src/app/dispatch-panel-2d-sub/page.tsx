'use client';

import { Download, Package } from 'lucide-react';
import { scheduledHostessSampleData } from '@/data/newRt2SampleData';
import { sendHostessSampleData } from '@/data/sendHostessSampleData';
import { ScheduledHostess } from '@/types/new-rt2';
import { SendHostess } from '@/types/send-hostess';

// 中央ブロック用ドライバーカードデータ
interface DispatchRow {
  type: string;
  prefix?: string;
  name: string;
  time: string;
  location: string;
  locationMark?: string;
  bgColor: 'yellow' | 'lightblue' | 'white';
}

interface DriverCard {
  id: number;
  driverName: string;
  startTime: string;
  endTime: string;
  areaNumber: number;
  areaName: string;
  price: number;
  hasDownload: boolean;
  dispatches: DispatchRow[];
}

const driverCardData: DriverCard = {
  id: 1,
  driverName: '汐崎 哲也9',
  startTime: '18:00',
  endTime: '5:00',
  areaNumber: 7,
  areaName: '山科',
  price: 73040,
  hasDownload: true,
  dispatches: [
    { type: '送', name: '南真麻-', time: '24:30', location: '上京', locationMark: '■', bgColor: 'yellow' },
    { type: '送', prefix: 'L', name: 'ひとみ', time: '24:30', location: '堀川今', bgColor: 'lightblue' },
    { type: 'OU', name: '南りの', time: '1:37', location: '祇園', bgColor: 'white' },
  ],
};

// DriverCardコンポーネント
function DriverCardBlock({ card }: { card: DriverCard }) {
  return (
    <div className="border border-zinc-400 flex flex-col" style={{ minHeight: '140px', backgroundColor: '#e8e8e8' }}>
      {/* ヘッダー行: 名前 | 時間 | 時間 */}
      <div className="flex border-b border-zinc-400">
        <div
          className="flex-1 text-black text-[11px] font-bold px-1 py-0.5 text-center border-r border-zinc-500"
          style={{ backgroundColor: '#ffffcc' }}
        >
          {card.driverName}
        </div>
        <div className="w-[40px] text-[11px] text-center py-0.5 border-r border-zinc-400" style={{ backgroundColor: '#ffffcc' }}>
          {card.startTime}
        </div>
        <div className="w-[36px] text-[11px] text-center py-0.5" style={{ backgroundColor: '#ffffcc' }}>
          {card.endTime}
        </div>
      </div>

      {/* 2行目: エリア番号 | エリア名 | アップロードアイコン | 金額 */}
      <div className="flex items-center border-b border-zinc-400 h-[22px]" style={{ backgroundColor: '#ffffcc' }}>
        <div className="text-[14px] font-bold px-2 w-[28px]" style={{ color: '#cc0000' }}>
          {card.areaNumber}
        </div>
        <div className="text-[14px] font-bold flex-1" style={{ color: '#0066cc' }}>
          {card.areaName}
        </div>
        {card.hasDownload && (
          <div className="w-[20px] h-[18px] flex items-center justify-center mx-1" style={{ backgroundColor: '#339933' }}>
            <Download size={14} color="white" strokeWidth={3} />
          </div>
        )}
        <div className="text-[12px] font-bold pr-1 text-black">
          ¥{card.price.toLocaleString()}
        </div>
      </div>

      {/* 配車リスト */}
      <div className="flex-1">
        {card.dispatches.map((dispatch, idx) => (
          <div
            key={idx}
            className="grid items-center h-[20px] border-b border-zinc-300 bg-white"
            style={{ gridTemplateColumns: '18px 12px 50px 32px 1fr 36px' }}
          >
            {/* 送 */}
            <div
              className="text-[11px] px-0.5 text-black h-full flex items-center"
              style={{
                backgroundColor: dispatch.bgColor === 'yellow' ? '#ffff99' :
                  dispatch.bgColor === 'lightblue' ? '#ccffff' : '#ffffff'
              }}
            >
              {dispatch.type}
            </div>
            {/* prefix */}
            <div
              className="text-[11px] h-full flex items-center"
              style={{
                backgroundColor: dispatch.bgColor === 'yellow' ? '#ffff99' :
                  dispatch.bgColor === 'lightblue' ? '#ccffff' : '#ffffff',
                color: '#cc0000'
              }}
            >
              {dispatch.prefix || ''}
            </div>
            {/* 名前 */}
            <div
              className="text-[11px] truncate text-black h-full flex items-center overflow-hidden"
              style={{
                backgroundColor: dispatch.bgColor === 'yellow' ? '#ffff99' :
                  dispatch.bgColor === 'lightblue' ? '#ccffff' : '#ffffff'
              }}
            >
              {dispatch.name}
            </div>
            {/* 時刻 */}
            <div className="text-[11px] text-center text-black">{dispatch.time}</div>
            {/* 場所 */}
            <div className="text-[11px] truncate text-black overflow-hidden">
              {dispatch.locationMark && <span>{dispatch.locationMark}</span>}
              {dispatch.location}
            </div>
            {/* アイコン */}
            <div className="flex items-center gap-0.5 justify-end pr-0.5">
              <div
                className="w-[16px] h-[16px] flex items-center justify-center"
                style={{ backgroundColor: '#daa520' }}
              >
                <span className="text-[8px] text-black">▼</span>
              </div>
              <div
                className="w-[16px] h-[16px] flex items-center justify-center"
                style={{ backgroundColor: '#d4a017' }}
              >
                <span className="text-[8px] text-black">⇔</span>
              </div>
            </div>
          </div>
        ))}
        {/* 空行（6行分確保） */}
        {Array.from({ length: Math.max(0, 6 - card.dispatches.length) }).map((_, idx) => (
          <div key={`empty-${idx}`} className="h-[20px] border-b border-zinc-300" style={{ backgroundColor: '#e8e8e8' }} />
        ))}
      </div>
    </div>
  );
}

export default function DispatchPanel2DSubPage() {
  return (
    <div className="flex h-screen w-full">
      {/* 左ブロック 20% */}
      <div className="w-[20%] h-full bg-white overflow-y-auto">
        {/* ヘッダー + リスト（gridで列揃え） */}
        <div className="w-full outline outline-1 outline-zinc-300">
          {/* ヘッダー */}
          <div className="grid text-black text-[10px] py-0.5 border-b border-zinc-400 bg-zinc-100 whitespace-nowrap" style={{ gridTemplateColumns: '24px 1fr 56px 32px 40px 1fr 40px 40px' }}>
            <div className="border-r border-zinc-300"></div>
            <div className="pl-1 overflow-hidden border-r border-zinc-300">ホステス名</div>
            <div className="text-center overflow-hidden border-r border-zinc-300">迎えドラ</div>
            <div className="text-center overflow-hidden border-r border-zinc-300">決定</div>
            <div className="text-center overflow-hidden border-r border-zinc-300">出勤</div>
            <div className="text-center overflow-hidden border-r border-zinc-300">迎え場所</div>
            <div className="text-center overflow-hidden border-r border-zinc-300">終了</div>
            <div className="text-center overflow-hidden">帰宅</div>
          </div>

          {/* リスト */}
          {scheduledHostessSampleData.map((hostess: ScheduledHostess) => (
            <div key={hostess.id} className="grid h-[22px] whitespace-nowrap border-b border-zinc-300" style={{ gridTemplateColumns: '24px 1fr 56px 32px 40px 1fr 40px 40px' }}>
              {/* 左のカラーバー */}
              <div className="h-full flex items-center justify-center bg-zinc-300 border-r border-zinc-400">
                <div className="w-1.5 h-3 bg-rose-300/60" />
              </div>
              {/* ホステス名 */}
              <div className="h-full bg-yellow-200 flex items-center overflow-hidden border-r border-zinc-400">
                <span className="text-black text-[13px] pl-1">{hostess.area}</span>
                <span className="text-black text-[13px] pl-1 truncate">{hostess.hostessName}</span>
              </div>
              {/* 迎えドラ */}
              <div className="h-full bg-zinc-300 flex items-center justify-center overflow-hidden border-r border-zinc-400">
                <span className="text-black text-[13px] truncate">{hostess.driverName}</span>
              </div>
              {/* 決定 */}
              <div className="h-full bg-zinc-400 flex items-center justify-center border-r border-zinc-500">
                <span className="text-white text-[13px]">{hostess.count}</span>
              </div>
              {/* 出勤 */}
              <div className="h-full bg-zinc-300 flex items-center justify-center border-r border-zinc-400">
                <span className="text-lime-500 text-[13px]">{hostess.arrivalTime}</span>
              </div>
              {/* 迎え場所 */}
              <div className="h-full bg-zinc-300 flex items-center justify-center overflow-hidden border-r border-zinc-400">
                <span className="text-black text-[13px] truncate">{hostess.location}</span>
              </div>
              {/* 終了 */}
              <div className="h-full bg-zinc-300 flex items-center justify-center border-r border-zinc-400">
                <span className="text-orange-500 text-[13px]">{hostess.startTime}</span>
              </div>
              {/* 帰宅 */}
              <div className="h-full bg-zinc-300 flex items-center justify-center">
                <span className="text-pink-500 text-[13px]">{hostess.endTime}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 中央ブロック 60% */}
      <div className="w-[60%] h-full bg-white border-l border-zinc-300 overflow-auto p-1">
        {/* 7列×4行のグリッド */}
        <div className="grid grid-cols-7 gap-0.5">
          {Array.from({ length: 28 }).map((_, index) => (
            <DriverCardBlock key={index} card={{ ...driverCardData, id: index + 1 }} />
          ))}
        </div>

        {/* 下部セクション - 7列 */}
        <div className="mt-0.5 grid grid-cols-7 gap-0.5">
          {/* 1列目 - FGCスタジオ撮影中、自宅or寮 待機、帰宅ホステス、終アリスト */}
          <div className="flex flex-col gap-0.5">
            <div className="border border-zinc-400">
              <div className="h-6 flex items-center justify-center" style={{ backgroundColor: '#ffffcc' }}>
                <span className="text-black text-[12px]">FGCスタジオ撮影中</span>
              </div>
              <div className="h-[80px] bg-white overflow-y-auto">
                {Array.from({ length: 4 }).map((_, idx) => (
                  <div key={idx} className="h-[20px] border-b border-zinc-200" />
                ))}
              </div>
            </div>
            <div className="border border-zinc-400">
              <div className="h-6 flex items-center justify-center" style={{ backgroundColor: '#ffddaa' }}>
                <span className="text-black text-[12px]">自宅or寮　待機</span>
              </div>
              <div className="h-[80px] overflow-y-auto" style={{ backgroundColor: '#ffffcc' }}>
                {Array.from({ length: 4 }).map((_, idx) => (
                  <div key={idx} className="h-[20px] border-b border-zinc-300" />
                ))}
              </div>
            </div>
            <div className="border border-zinc-400 h-[60px] flex items-center justify-center" style={{ backgroundColor: '#ccffcc' }}>
              <span className="text-black text-[14px]">帰宅ホステス</span>
            </div>
            <div className="border border-zinc-400 h-[40px] flex items-center justify-center" style={{ backgroundColor: '#ffcccc' }}>
              <span className="text-black text-[14px]">終アリスト</span>
            </div>
          </div>

          {/* 2列目 - 南IC事務所 待機 */}
          <div className="flex flex-col gap-0.5">
            <div className="border border-zinc-400">
              <div className="h-6 flex items-center justify-center" style={{ backgroundColor: '#ccffff' }}>
                <span className="text-black text-[14px]">南IC事務所　待機</span>
              </div>
              <div className="h-[258px] bg-zinc-200 overflow-y-auto">
                {/* サンプル行 */}
                <div className="flex items-center h-[28px] border-b border-zinc-400 whitespace-nowrap bg-white">
                  <div className="flex-1 text-black text-[13px] pl-1 overflow-hidden h-full flex items-center" style={{ backgroundColor: '#ffe0e6' }}>南 祈-inori-</div>
                  <div className="text-black text-[13px] w-[44px] text-center flex-shrink-0">19:07</div>
                  <div className="w-[20px] h-[18px] flex items-center justify-center" style={{ backgroundColor: '#339933' }}>
                    <span className="text-white text-[10px]">→</span>
                  </div>
                  <div className="w-[20px] h-[18px] flex items-center justify-center" style={{ backgroundColor: '#336633' }}>
                    <span className="text-white text-[9px]">▼</span>
                  </div>
                  <div className="w-[20px] h-[18px] flex items-center justify-center" style={{ backgroundColor: '#daa520' }}>
                    <span className="text-black text-[9px]">⇔</span>
                  </div>
                </div>
                <div className="flex items-center h-[28px] border-b border-zinc-400 whitespace-nowrap bg-white">
                  <div className="flex-1 text-black text-[13px] pl-1 overflow-hidden h-full flex items-center" style={{ backgroundColor: '#ffe0e6' }}>南 芽依-</div>
                  <div className="text-black text-[13px] w-[44px] text-center flex-shrink-0">21:51</div>
                  <div className="w-[20px] h-[18px] flex items-center justify-center" style={{ backgroundColor: '#339933' }}>
                    <span className="text-white text-[10px]">→</span>
                  </div>
                  <div className="w-[20px] h-[18px] flex items-center justify-center" style={{ backgroundColor: '#336633' }}>
                    <span className="text-white text-[9px]">▼</span>
                  </div>
                  <div className="w-[20px] h-[18px] flex items-center justify-center" style={{ backgroundColor: '#daa520' }}>
                    <span className="text-black text-[9px]">⇔</span>
                  </div>
                </div>
                <div className="flex items-center h-[28px] border-b border-zinc-400 whitespace-nowrap bg-white">
                  <div className="flex-1 text-black text-[13px] pl-1 overflow-hidden h-full flex items-center" style={{ backgroundColor: '#d4f5d4' }}>G ゆりか</div>
                  <div className="text-black text-[13px] w-[44px] text-center flex-shrink-0">23:08</div>
                  <div className="w-[20px] h-[18px] flex items-center justify-center" style={{ backgroundColor: '#339933' }}>
                    <span className="text-white text-[10px]">→</span>
                  </div>
                  <div className="w-[20px] h-[18px] flex items-center justify-center" style={{ backgroundColor: '#336633' }}>
                    <span className="text-white text-[9px]">▼</span>
                  </div>
                  <div className="w-[20px] h-[18px] flex items-center justify-center" style={{ backgroundColor: '#daa520' }}>
                    <span className="text-black text-[9px]">⇔</span>
                  </div>
                </div>
                {/* 空行 */}
                {Array.from({ length: 6 }).map((_, idx) => (
                  <div key={idx} className="h-[28px] border-b border-zinc-300 bg-white" />
                ))}
              </div>
            </div>
          </div>

          {/* 3列目 - 南IC徒歩派遣or借置き */}
          <div className="flex flex-col gap-0.5">
            <div className="border border-zinc-400">
              <div className="h-6 flex items-center justify-center" style={{ backgroundColor: '#ccffff' }}>
                <span className="text-black text-[14px]">南IC徒歩派遣or借置き</span>
              </div>
              <div className="h-[258px] bg-zinc-200 overflow-y-auto">
                {/* サンプル行 */}
                <div className="flex items-center h-[28px] border-b border-zinc-400 whitespace-nowrap bg-white">
                  <div className="flex-1 text-black text-[13px] pl-1 overflow-hidden h-full flex items-center" style={{ backgroundColor: '#ffe0e6' }}>南 祈-inori-</div>
                  <div className="text-black text-[13px] w-[44px] text-center flex-shrink-0">19:07</div>
                  <div className="w-[20px] h-[18px] flex items-center justify-center" style={{ backgroundColor: '#339933' }}>
                    <span className="text-white text-[10px]">→</span>
                  </div>
                  <div className="w-[20px] h-[18px] flex items-center justify-center" style={{ backgroundColor: '#336633' }}>
                    <span className="text-white text-[9px]">▼</span>
                  </div>
                  <div className="w-[20px] h-[18px] flex items-center justify-center" style={{ backgroundColor: '#daa520' }}>
                    <span className="text-black text-[9px]">⇔</span>
                  </div>
                </div>
                <div className="flex items-center h-[28px] border-b border-zinc-400 whitespace-nowrap bg-white">
                  <div className="flex-1 text-black text-[13px] pl-1 overflow-hidden h-full flex items-center" style={{ backgroundColor: '#ffe0e6' }}>南 芽依-</div>
                  <div className="text-black text-[13px] w-[44px] text-center flex-shrink-0">21:51</div>
                  <div className="w-[20px] h-[18px] flex items-center justify-center" style={{ backgroundColor: '#339933' }}>
                    <span className="text-white text-[10px]">→</span>
                  </div>
                  <div className="w-[20px] h-[18px] flex items-center justify-center" style={{ backgroundColor: '#336633' }}>
                    <span className="text-white text-[9px]">▼</span>
                  </div>
                  <div className="w-[20px] h-[18px] flex items-center justify-center" style={{ backgroundColor: '#daa520' }}>
                    <span className="text-black text-[9px]">⇔</span>
                  </div>
                </div>
                <div className="flex items-center h-[28px] border-b border-zinc-400 whitespace-nowrap bg-white">
                  <div className="flex-1 text-black text-[13px] pl-1 overflow-hidden h-full flex items-center" style={{ backgroundColor: '#d4f5d4' }}>G ゆりか</div>
                  <div className="text-black text-[13px] w-[44px] text-center flex-shrink-0">23:08</div>
                  <div className="w-[20px] h-[18px] flex items-center justify-center" style={{ backgroundColor: '#339933' }}>
                    <span className="text-white text-[10px]">→</span>
                  </div>
                  <div className="w-[20px] h-[18px] flex items-center justify-center" style={{ backgroundColor: '#336633' }}>
                    <span className="text-white text-[9px]">▼</span>
                  </div>
                  <div className="w-[20px] h-[18px] flex items-center justify-center" style={{ backgroundColor: '#daa520' }}>
                    <span className="text-black text-[9px]">⇔</span>
                  </div>
                </div>
                {/* 空行 */}
                {Array.from({ length: 6 }).map((_, idx) => (
                  <div key={idx} className="h-[28px] border-b border-zinc-300 bg-white" />
                ))}
              </div>
            </div>
          </div>

          {/* 4列目 - 南IC待機 ドライバー / 南ICバック中 */}
          <div className="flex flex-col gap-0.5">
            {/* 南IC待機 ドライバー */}
            <div className="border border-zinc-400">
              <div className="h-6 flex items-center justify-center border-b border-zinc-400" style={{ backgroundColor: '#ffffcc' }}>
                <span className="text-black text-[13px]">南IC待機　ドライバー</span>
              </div>
              <div className="h-[120px] bg-zinc-200 overflow-y-auto">
                <div className="flex items-center h-[24px] border-b border-zinc-400 whitespace-nowrap bg-white">
                  <div className="flex-1 text-black text-[13px] pl-1 overflow-hidden">吉田 琴雅10</div>
                  <div className="w-[20px] h-[18px] flex items-center justify-center mr-0.5" style={{ backgroundColor: '#3366cc' }}>
                    <span className="text-white text-[9px]">▼</span>
                  </div>
                </div>
                <div className="flex items-center h-[24px] border-b border-zinc-400 whitespace-nowrap bg-white">
                  <div className="flex-1 text-[13px] pl-1 overflow-hidden">
                    <span className="text-black">八塚 4</span>
                    <span className="text-red-600">嵯峨野</span>
                  </div>
                  <div className="w-[20px] h-[18px] flex items-center justify-center mr-0.5" style={{ backgroundColor: '#3366cc' }}>
                    <span className="text-white text-[9px]">▼</span>
                  </div>
                </div>
                {/* 空行 */}
                {Array.from({ length: 4 }).map((_, idx) => (
                  <div key={idx} className="h-[24px] border-b border-zinc-300 bg-white" />
                ))}
              </div>
            </div>
            {/* 南ICバック中 */}
            <div className="border border-zinc-400">
              <div className="h-6 flex items-center justify-center border-b border-zinc-400" style={{ backgroundColor: '#ffffcc' }}>
                <span className="text-black text-[13px]">南ICバック中</span>
              </div>
              <div className="h-[120px] bg-zinc-200 overflow-y-auto">
                <div className="flex items-center h-[24px] border-b border-zinc-400 whitespace-nowrap bg-white">
                  <div className="flex-1 text-black text-[13px] pl-1 overflow-hidden">南部 吉輝11</div>
                  <div className="w-[20px] h-[18px] flex items-center justify-center mr-0.5" style={{ backgroundColor: '#3366cc' }}>
                    <span className="text-white text-[9px]">▲</span>
                  </div>
                </div>
                <div className="flex items-center h-[24px] border-b border-zinc-400 whitespace-nowrap bg-white">
                  <div className="flex-1 text-black text-[13px] pl-1 overflow-hidden">森下 光我1</div>
                  <div className="w-[20px] h-[18px] flex items-center justify-center mr-0.5" style={{ backgroundColor: '#3366cc' }}>
                    <span className="text-white text-[9px]">▲</span>
                  </div>
                </div>
                <div className="flex items-center h-[24px] border-b border-zinc-400 whitespace-nowrap bg-white">
                  <div className="flex-1 text-[13px] pl-1 overflow-hidden">
                    <span className="text-black">津村 4 </span>
                    <span className="text-blue-600">堀川丸</span>
                  </div>
                  <div className="w-[20px] h-[18px] flex items-center justify-center mr-0.5" style={{ backgroundColor: '#3366cc' }}>
                    <span className="text-white text-[9px]">▲</span>
                  </div>
                </div>
                <div className="flex items-center h-[24px] border-b border-zinc-400 whitespace-nowrap bg-white">
                  <div className="flex-1 text-[13px] pl-1 overflow-hidden">
                    <span className="text-black">須賀 5 </span>
                    <span className="text-red-600">上京区</span>
                  </div>
                  <div className="w-[20px] h-[18px] flex items-center justify-center mr-0.5" style={{ backgroundColor: '#3366cc' }}>
                    <span className="text-white text-[9px]">▲</span>
                  </div>
                </div>
                {/* 空行 */}
                {Array.from({ length: 2 }).map((_, idx) => (
                  <div key={idx} className="h-[24px] border-b border-zinc-300 bg-white" />
                ))}
              </div>
            </div>
          </div>

          {/* 5列目 - 精算告知済 ドライバー */}
          <div className="flex flex-col gap-0.5">
            <div className="border border-zinc-400">
              <div className="h-6 flex items-center justify-center border-b border-zinc-400" style={{ backgroundColor: '#ffffcc' }}>
                <span className="text-black text-[13px]">精算告知済　ドライバー</span>
              </div>
              <div className="h-[264px] bg-zinc-100 overflow-y-auto">
                {/* 空行 */}
                {Array.from({ length: 10 }).map((_, idx) => (
                  <div key={idx} className="h-[24px] border-b border-zinc-300 bg-white" />
                ))}
              </div>
            </div>
          </div>

          {/* 6列目 - ドライバーカード */}
          <div className="flex flex-col gap-0.5">
            <DriverCardBlock card={{ ...driverCardData, id: 29 }} />
          </div>

          {/* 7列目 - ドライバーカード */}
          <div className="flex flex-col gap-0.5">
            <DriverCardBlock card={{ ...driverCardData, id: 30 }} />
          </div>
        </div>
      </div>

      {/* 右ブロック 20% */}
      <div className="w-[20%] h-full bg-white border-l border-zinc-300 overflow-y-auto">
        {/* ヘッダー + リスト（gridで列揃え） */}
        <div className="w-full outline outline-1 outline-zinc-300">
          {/* ヘッダー */}
          <div className="grid text-black text-[10px] py-0.5 border-b border-zinc-400 bg-zinc-100 whitespace-nowrap" style={{ gridTemplateColumns: '28px 1fr 1fr 40px 40px 1fr 32px' }}>
            <div className="text-center overflow-hidden border-r border-zinc-300">荷物</div>
            <div className="pl-1 overflow-hidden border-r border-zinc-300">ホステス</div>
            <div className="text-center overflow-hidden border-r border-zinc-300">送りドラ</div>
            <div className="text-center overflow-hidden border-r border-zinc-300">終了</div>
            <div className="text-center overflow-hidden border-r border-zinc-300">帰宅</div>
            <div className="text-center overflow-hidden border-r border-zinc-300">送り場所</div>
            <div className="text-center overflow-hidden">件数</div>
          </div>

          {/* リスト */}
          {sendHostessSampleData.map((hostess: SendHostess) => (
            <div key={hostess.id} className="grid h-[22px] whitespace-nowrap border-b border-zinc-300" style={{ gridTemplateColumns: '28px 1fr 1fr 40px 40px 1fr 32px' }}>
              {/* 荷物アイコン */}
              <div className="h-full bg-zinc-300 flex items-center justify-center border-r border-zinc-400">
                {hostess.hasPackage && <Package size={14} className="text-zinc-500" />}
              </div>
              {/* ホステス名 */}
              <div className="h-full flex items-center overflow-hidden border-r border-zinc-400" style={{ backgroundColor: '#f0e6f6' }}>
                <span className="text-red-600 text-[13px] pl-1">{hostess.area}</span>
                <span className="text-black text-[13px] underline truncate pl-1">{hostess.hostessName}</span>
              </div>
              {/* 送りドラ */}
              <div className="h-full bg-yellow-200 flex items-center justify-center overflow-hidden border-r border-zinc-400">
                <span className="text-black text-[13px] truncate">{hostess.driverName}</span>
              </div>
              {/* 終了 */}
              <div className="h-full bg-zinc-300 flex items-center justify-center border-r border-zinc-400">
                <span className="text-black text-[13px]">{hostess.endTime}</span>
              </div>
              {/* 帰宅 */}
              <div className="h-full bg-zinc-300 flex items-center justify-center border-r border-zinc-400">
                <span className="text-black text-[13px]">{hostess.returnTime}</span>
              </div>
              {/* 送り場所 */}
              <div className="h-full bg-zinc-300 flex items-center overflow-hidden border-r border-zinc-400">
                <span className="text-black text-[13px] pl-1 truncate">
                  {hostess.destinationMark && <span>{hostess.destinationMark}</span>}
                  {hostess.destination}
                </span>
              </div>
              {/* 件数 */}
              <div className="h-full bg-zinc-300 flex items-center justify-center">
                <span className="text-black text-[13px]">{hostess.count > 0 ? hostess.count : ''}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
