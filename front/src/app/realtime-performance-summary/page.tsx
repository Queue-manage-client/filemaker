'use client';
import React from "react";
import { useRouter } from 'next/navigation';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowLeft } from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend,
} from "recharts";

// ダミーデータ（本来はAPIから取得）- 30分単位で9:00から翌4:00まで
const timeSlots = [
  { time: "09:00", sales: 260470, startSales: 240000, targetSales: 178256, rate: 73.5, count: 37, startCount: 35, targetCount: 163, receptionTimePlan: 464.5, receptionTimeActual: 460.0, attendancePlan: 74, attendanceActual: 72 },
  { time: "09:30", sales: 285000, startSales: 265000, targetSales: 200000, rate: 70.2, count: 40, startCount: 38, targetCount: 160, receptionTimePlan: 460.0, receptionTimeActual: 455.0, attendancePlan: 73, attendanceActual: 70 },
  { time: "10:00", sales: 303570, startSales: 280000, targetSales: 236400, rate: 73.5, count: 42, startCount: 40, targetCount: 159, receptionTimePlan: 452.0, receptionTimeActual: 448.0, attendancePlan: 72, attendanceActual: 68 },
  { time: "10:30", sales: 320000, avgSales: 220000, diff: 100000, rate: 68.8, count: 45, avgCount: 158, targetDiff: -113, mainTime: 448.0, staffPlan: 71, staffActual: 25 },
  { time: "11:00", sales: 330770, avgSales: 194310, diff: 76460, rate: 67.4, count: 48, avgCount: 153, targetDiff: -105, mainTime: 439.5, staffPlan: 70, staffActual: 30 },
  { time: "11:30", sales: 345000, avgSales: 210000, diff: 135000, rate: 62.1, count: 51, avgCount: 152, targetDiff: -101, mainTime: 435.0, staffPlan: 69, staffActual: 32 },
  { time: "12:00", sales: 380000, avgSales: 225000, diff: 155000, rate: 59.3, count: 55, avgCount: 150, targetDiff: -95, mainTime: 430.0, staffPlan: 68, staffActual: 35 },
  { time: "12:30", sales: 395000, avgSales: 230000, diff: 165000, rate: 58.2, count: 58, avgCount: 149, targetDiff: -91, mainTime: 425.0, staffPlan: 67, staffActual: 38 },
  { time: "13:00", sales: 420000, avgSales: 240000, diff: 180000, rate: 57.1, count: 62, avgCount: 148, targetDiff: -86, mainTime: 420.0, staffPlan: 66, staffActual: 40 },
  { time: "13:30", sales: 435000, avgSales: 245000, diff: 190000, rate: 56.3, count: 65, avgCount: 147, targetDiff: -82, mainTime: 415.0, staffPlan: 65, staffActual: 42 },
  { time: "14:00", sales: 450000, avgSales: 250000, diff: 200000, rate: 55.6, count: 68, avgCount: 146, targetDiff: -78, mainTime: 410.0, staffPlan: 64, staffActual: 45 },
  { time: "14:30", sales: 465000, avgSales: 255000, diff: 210000, rate: 54.9, count: 71, avgCount: 145, targetDiff: -74, mainTime: 405.0, staffPlan: 63, staffActual: 48 },
  { time: "15:00", sales: 480000, avgSales: 260000, diff: 220000, rate: 54.3, count: 74, avgCount: 144, targetDiff: -70, mainTime: 400.0, staffPlan: 62, staffActual: 50 },
  { time: "15:30", sales: 495000, avgSales: 265000, diff: 230000, rate: 53.7, count: 77, avgCount: 143, targetDiff: -66, mainTime: 395.0, staffPlan: 61, staffActual: 52 },
  { time: "16:00", sales: 510000, avgSales: 270000, diff: 240000, rate: 53.1, count: 80, avgCount: 142, targetDiff: -62, mainTime: 390.0, staffPlan: 60, staffActual: 55 },
  { time: "16:30", sales: 525000, avgSales: 275000, diff: 250000, rate: 52.6, count: 83, avgCount: 141, targetDiff: -58, mainTime: 385.0, staffPlan: 59, staffActual: 58 },
  { time: "17:00", sales: 540000, avgSales: 280000, diff: 260000, rate: 52.1, count: 86, avgCount: 140, targetDiff: -54, mainTime: 380.0, staffPlan: 58, staffActual: 60 },
  { time: "17:30", sales: 555000, avgSales: 285000, diff: 270000, rate: 51.6, count: 89, avgCount: 139, targetDiff: -50, mainTime: 375.0, staffPlan: 57, staffActual: 62 },
  { time: "18:00", sales: 570000, avgSales: 290000, diff: 280000, rate: 51.2, count: 92, avgCount: 138, targetDiff: -46, mainTime: 370.0, staffPlan: 56, staffActual: 65 },
  { time: "18:30", sales: 585000, avgSales: 295000, diff: 290000, rate: 50.8, count: 95, avgCount: 137, targetDiff: -42, mainTime: 365.0, staffPlan: 55, staffActual: 68 },
  { time: "19:00", sales: 600000, avgSales: 300000, diff: 300000, rate: 50.0, count: 98, avgCount: 136, targetDiff: -38, mainTime: 360.0, staffPlan: 54, staffActual: 70 },
  { time: "19:30", sales: 615000, avgSales: 305000, diff: 310000, rate: 49.6, count: 101, avgCount: 135, targetDiff: -34, mainTime: 355.0, staffPlan: 53, staffActual: 72 },
  { time: "20:00", sales: 630000, avgSales: 310000, diff: 320000, rate: 49.2, count: 104, avgCount: 134, targetDiff: -30, mainTime: 350.0, staffPlan: 52, staffActual: 75 },
  { time: "20:30", sales: 645000, avgSales: 315000, diff: 330000, rate: 48.8, count: 107, avgCount: 133, targetDiff: -26, mainTime: 345.0, staffPlan: 51, staffActual: 78 },
  { time: "21:00", sales: 660000, avgSales: 320000, diff: 340000, rate: 48.5, count: 110, avgCount: 132, targetDiff: -22, mainTime: 340.0, staffPlan: 50, staffActual: 80 },
  { time: "21:30", sales: 675000, avgSales: 325000, diff: 350000, rate: 48.1, count: 113, avgCount: 131, targetDiff: -18, mainTime: 335.0, staffPlan: 49, staffActual: 82 },
  { time: "22:00", sales: 690000, avgSales: 330000, diff: 360000, rate: 47.8, count: 116, avgCount: 130, targetDiff: -14, mainTime: 330.0, staffPlan: 48, staffActual: 85 },
  { time: "22:30", sales: 705000, avgSales: 335000, diff: 370000, rate: 47.5, count: 119, avgCount: 129, targetDiff: -10, mainTime: 325.0, staffPlan: 47, staffActual: 88 },
  { time: "23:00", sales: 720000, avgSales: 340000, diff: 380000, rate: 47.2, count: 122, avgCount: 128, targetDiff: -6, mainTime: 320.0, staffPlan: 46, staffActual: 90 },
  { time: "23:30", sales: 735000, avgSales: 345000, diff: 390000, rate: 46.9, count: 125, avgCount: 127, targetDiff: -2, mainTime: 315.0, staffPlan: 45, staffActual: 92 },
  { time: "00:00", sales: 750000, avgSales: 350000, diff: 400000, rate: 46.7, count: 128, avgCount: 126, targetDiff: 2, mainTime: 310.0, staffPlan: 44, staffActual: 95 },
  { time: "00:30", sales: 765000, avgSales: 355000, diff: 410000, rate: 46.4, count: 131, avgCount: 125, targetDiff: 6, mainTime: 305.0, staffPlan: 43, staffActual: 98 },
  { time: "01:00", sales: 780000, avgSales: 360000, diff: 420000, rate: 46.2, count: 134, avgCount: 124, targetDiff: 10, mainTime: 300.0, staffPlan: 42, staffActual: 100 },
  { time: "01:30", sales: 795000, avgSales: 365000, diff: 430000, rate: 45.9, count: 137, avgCount: 123, targetDiff: 14, mainTime: 295.0, staffPlan: 41, staffActual: 102 },
  { time: "02:00", sales: 810000, avgSales: 370000, diff: 440000, rate: 45.7, count: 140, avgCount: 122, targetDiff: 18, mainTime: 290.0, staffPlan: 40, staffActual: 105 },
  { time: "02:30", sales: 825000, avgSales: 375000, diff: 450000, rate: 45.5, count: 143, avgCount: 121, targetDiff: 22, mainTime: 285.0, staffPlan: 39, staffActual: 108 },
  { time: "03:00", sales: 840000, avgSales: 380000, diff: 460000, rate: 45.2, count: 146, avgCount: 120, targetDiff: 26, mainTime: 280.0, staffPlan: 38, staffActual: 110 },
  { time: "03:30", sales: 855000, avgSales: 385000, diff: 470000, rate: 45.0, count: 149, avgCount: 119, targetDiff: 30, mainTime: 275.0, staffPlan: 37, staffActual: 112 },
  { time: "04:00", sales: 870000, avgSales: 390000, diff: 480000, rate: 44.8, count: 152, avgCount: 118, targetDiff: 34, mainTime: 270.0, staffPlan: 36, staffActual: 115 },
];

const salesData = timeSlots.map((t) => ({
  time: t.time,
  actualSales: t.sales,
  targetSales: t.avgSales,
}));

export default function RealtimePerformanceSummary() {
  const router = useRouter();

  React.useEffect(() => {
    document.title = 'リアルタイム実績集計 - Dispatch Harmony Hub';
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 p-4">
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

      {/* メインコンテンツ */}
      <Card>
        <CardContent className="p-0">
          <div className="w-full h-screen flex flex-col bg-gray-50">
            {/* 元のヘッダー部分を調整 */}
            <header className="flex items-center justify-between p-4 bg-gray-800 text-white">
              <div className="text-lg font-bold">×</div>
              <div className="text-lg font-semibold">2025年08月27日(水)</div>
              <Button
                size="sm"
                className="bg-blue-600 hover:bg-blue-500"
              >
                月間売上目標達成集計
              </Button>
            </header>

      {/* メインコンテンツ */}
      <main className="flex flex-1 p-4 gap-4">
        {/* 左：サマリー */}
        <div className="w-1/4 bg-white rounded-xl shadow flex flex-col">
          {/* 上段：当日・達成目標を横4列に配置（達成目標は幅2倍） */}
          <div className="flex-1 grid grid-cols-4 gap-4 p-4">
            {/* 左列：タイトルなしの見出し */}
            <section>
              <h2 className="font-bold text-green-700 text-center">　</h2>
              <p className="text-right">売上金額計</p>
              <p className="text-right">売上件数計</p>
            </section>

            {/* 中央列：当日の内容 */}
            <section>
            <h2 className="font-bold text-green-700 text-center">当日</h2>
              <p className="text-right p-2 bg-gray-50 rounded">917,350</p>
              <p className="text-right p-2 bg-gray-50 rounded">131</p>
            </section>

            {/* 右列：達成目標（幅2倍） */}
            <section className="col-span-2">
              <h2 className="font-bold text-blue-700 text-center">達成目標</h2>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-right p-2 bg-gray-50 rounded">1,041,233</p>
                </div>
                <div>
                  <p className="text-red-600 text-right p-2 bg-red-50 rounded">-123,883</p>
                  <p className="text-red-600 text-right p-2 bg-red-50 rounded">-11.9%</p>
                  <p className="text-red-600 text-right p-2 bg-red-50 rounded">-13</p>
                </div>
              </div>
            </section>
          </div>

          {/* 下段：主担当データ */}
          <section className="p-4 pt-0">
            <div className="bg-yellow-50 p-4 rounded-lg">
              <h2 className="font-bold text-yellow-700 mb-2">主副受付時間</h2>
              <p className="mb-3">受付時間: 410.5 / 410.5 (達成率: 1.0061)</p>
              <h2 className="font-bold text-yellow-700 mb-2">主副出動人数</h2>
              <p>出動人数: 68 / 68</p>
              <h2 className="font-bold text-green-700 text-center">当日</h2>
              <p className="text-right p-2 bg-gray-50 rounded">917,350</p>
              <p className="text-right p-2 bg-gray-50 rounded">131</p>
            </div>
          </section>
        </div>

        {/* 中央：比較 */}
        <div className="w-1/4 bg-white p-4 rounded-xl shadow space-y-4">
          <section>
            <h2 className="font-bold text-purple-700">同曜日比較</h2>
            <p>前年同月平均: 1,034,920円</p>
            <p>件数: 143.3 → 139.0</p>
          </section>

          <section>
            <h2 className="font-bold text-pink-700">直近3か月平均</h2>
            <ul className="list-disc list-inside">
              <li>2025/05: 956,300円 (134.0件)</li>
              <li>2025/06: 1,051,960円 (145.0件)</li>
              <li>2025/07: 969,922円 (136.8件)</li>
            </ul>
            <p>件数: 379.0 → 408.0</p>
          </section>
        </div>

        {/* 右：時間帯別テーブル */}
        <div className="w-2/4 bg-white p-4 rounded-xl shadow overflow-y-auto">
          <h2 className="font-bold mb-2">当日の推移</h2>
          <table className="w-full text-sm border">
            <thead className="bg-gray-100">
              <tr>
                <th className="border px-2">時間</th>
                <th className="border px-2">売上金額<br/>(予約+実績)</th>
                <th className="border px-2">売上金額開始<br/>(開始+実績)</th>
                <th className="border px-2">目標金額</th>
                <th className="border px-2">達成率</th>
                <th className="border px-2">売上件数<br/>(予約+実績)</th>
                <th className="border px-2">売上件数<br/>(開始+実績)</th>
                <th className="border px-2">目標件数</th>
                <th className="border px-2">達成率</th>
                <th className="border px-2">主副受付時間<br/>(予定)</th>
                <th className="border px-2">実績</th>
                <th className="border px-2">主副出勤件数<br/>(予定)</th>
                <th className="border px-2">実績</th>
              </tr>
            </thead>
            <tbody>
              {timeSlots.map((t) => (
                <tr key={t.time} className="text-center">
                  <td className="border px-2">{t.time}</td>
                  <td className="border px-2">{t.sales?.toLocaleString() || '0'}</td>
                  <td className="border px-2">{t.startSales?.toLocaleString() || '0'}</td>
                  <td className="border px-2">{t.targetSales?.toLocaleString() || t.avgSales?.toLocaleString() || '0'}</td>
                  <td className={`border px-2 ${t.rate < 100 ? "text-red-600" : "text-green-600"}`}>
                    {t.rate}%
                  </td>
                  <td className="border px-2">{t.count || 0}</td>
                  <td className="border px-2">{t.startCount || 0}</td>
                  <td className="border px-2">{t.targetCount || t.avgCount || 0}</td>
                  <td className={`border px-2 ${t.rate < 100 ? "text-red-600" : "text-green-600"}`}>
                    {t.rate}%
                  </td>
                  <td className="border px-2">{t.receptionTimePlan || t.mainTime || 0}</td>
                  <td className="border px-2">{t.receptionTimeActual || 0}</td>
                  <td className="border px-2">{t.attendancePlan || t.staffPlan || 0}</td>
                  <td className="border px-2">{t.attendanceActual || t.staffActual || 0}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>

      {/* 下部グラフ */}
      <footer className="p-4 bg-white rounded-xl shadow m-4">
        <h2 className="font-bold mb-2">売上推移</h2>
        <LineChart width={1200} height={300} data={salesData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis
            dataKey="time"
            tick={{ fontSize: 12 }}
            interval="preserveStartEnd"
            ticks={[
              "09:00", "11:00", "13:00", "15:00", "17:00",
              "19:00", "21:00", "23:00", "01:00", "03:00"
            ]}
          />
          <YAxis tick={{ fontSize: 12 }} />
          <Tooltip
            labelFormatter={(value) => `${value}`}
            formatter={(value, name) => [
              typeof value === 'number' ? value.toLocaleString() : value,
              name === 'actualSales' ? '実績売上' : '目標売上'
            ]}
          />
          <Legend />
          <Line
            type="monotone"
            dataKey="actualSales"
            stroke="#1f77b4"
            strokeWidth={2}
            dot={{ r: 3 }}
          />
          <Line
            type="monotone"
            dataKey="targetSales"
            stroke="#ff7f0e"
            strokeWidth={2}
            dot={{ r: 3 }}
          />
        </LineChart>
        </footer>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
