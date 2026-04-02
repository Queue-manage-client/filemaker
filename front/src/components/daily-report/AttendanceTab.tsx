import React, { useState } from 'react';
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { EMPLOYMENT_TYPE_LABELS } from '@/types/attendance';
import type { AttendingStaffItemProps, AttendingHostessItemProps, AttendanceTabProps } from '@/types/attendance-tab';

/**
 * 出勤スタッフの1行分のコンポーネント
 */
function AttendingStaffItem({ data }: AttendingStaffItemProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case '出勤':
        return 'bg-green-100 text-green-800';
      case '退社':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <tr className="hover:bg-gray-50 border-b border-gray-200">
      {/* 雇用形態 */}
      <td className="px-2 py-2 text-center">
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
          data.employmentType === 'employee' 
            ? 'bg-blue-100 text-blue-800' 
            : 'bg-green-100 text-green-800'
        }`}>
          {EMPLOYMENT_TYPE_LABELS[data.employmentType]}
        </span>
      </td>
      
      {/* スタッフ名 */}
      <td className="px-2 py-2 font-medium text-gray-900">{data.staffName}</td>
      
      {/* ステータス */}
      <td className="px-2 py-2 text-center">
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(data.status)}`}>
          {data.status}
        </span>
      </td>
      
      {/* 数字1 */}
      <td className="px-2 py-2 text-center font-mono text-gray-600">{data.number1}</td>
      
      {/* 給与 */}
      <td className="px-2 py-2 text-right font-mono text-gray-700">
        ¥{data.salary.toLocaleString()}
      </td>
      
      {/* 回収額 */}
      <td className="px-2 py-2 text-right font-mono text-gray-700">
        ¥{data.collectionAmount.toLocaleString()}
      </td>
      
      {/* 預り金 */}
      <td className="px-2 py-2 text-right font-mono text-gray-700">
        ¥{data.depositAmount.toLocaleString()}
      </td>
      
      {/* 返金 */}
      <td className="px-2 py-2 text-right font-mono text-gray-700">
        ¥{data.refundAmount.toLocaleString()}
      </td>
      
      {/* 高速等 */}
      <td className="px-2 py-2 text-right font-mono text-gray-700">
        ¥{data.expressway.toLocaleString()}
      </td>
      
      {/* 調整額 */}
      <td className={`px-2 py-2 text-right font-mono ${data.adjustmentAmount >= 0 ? 'text-blue-600' : 'text-red-600'}`}>
        {data.adjustmentAmount >= 0 ? '+' : ''}¥{data.adjustmentAmount.toLocaleString()}
      </td>
      
      {/* 差引精算額 */}
      <td className="px-2 py-2 text-right font-mono font-bold text-gray-900">
        ¥{data.netSettlementAmount.toLocaleString()}
      </td>
      
      {/* 数字2 */}
      <td className="px-2 py-2 text-center font-mono text-gray-600">{data.number2}</td>
      
      {/* 備品(青・赤・黒) */}
      <td className="px-2 py-2 text-center">
        <div className="flex justify-center gap-1">
          <span className="text-blue-600 font-mono text-xs">{data.equipment.blue}</span>
          <span className="text-red-600 font-mono text-xs">{data.equipment.red}</span>
          <span className="text-gray-800 font-mono text-xs">{data.equipment.black}</span>
        </div>
      </td>
      
      {/* 数字3 */}
      <td className="px-2 py-2 text-center font-mono text-gray-600">{data.number3}</td>
      
      {/* 数字4 */}
      <td className="px-2 py-2 text-center font-mono text-gray-600">{data.number4}</td>
      
      {/* 数字5 */}
      <td className="px-2 py-2 text-center font-mono text-gray-600">{data.number5}</td>
      
      {/* 管理者承認 */}
      <td className="px-2 py-2 text-center">
        <input
          type="checkbox"
          checked={data.managerApproval}
          onChange={() => {}}
          className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 focus:ring-1"
        />
      </td>
    </tr>
  );
}

/**
 * 出勤ホステスの1行分のコンポーネント
 * Item 71: 未精算で赤色・未送信で白色・精算と送信完了で灰色
 */
function AttendingHostessItem({ data }: AttendingHostessItemProps) {
  // Item 71: ステータスに応じた行の背景色
  const getRowBgColor = () => {
    if (data.isSettled && data.isSent) {
      return 'bg-gray-200'; // 精算と送信完了で灰色
    }
    if (!data.isSettled) {
      return 'bg-red-100'; // 未精算で赤色
    }
    return 'bg-white'; // 未送信で白色
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case '出勤中':
        return 'bg-green-100 text-green-800';
      case '休憩中':
        return 'bg-yellow-100 text-yellow-800';
      case '退勤':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className={`gap-1 text-xs py-1 border-b border-gray-200 hover:brightness-95 ${getRowBgColor()}`} style={{ display: 'grid', gridTemplateColumns: 'repeat(13, minmax(0, 1fr))' }}>
      {/* ホステス名 */}
      <div className="font-medium text-gray-900 truncate">{data.hostessName}</div>

      {/* 出勤時刻 */}
      <div className="text-center font-mono">{data.startTime}</div>

      {/* 退勤予定時刻 */}
      <div className="text-center font-mono">{data.endTime || '-'}</div>

      {/* ステータス */}
      <div className="text-center">
        <span className={`px-1 py-0.5 rounded text-xs font-medium ${getStatusColor(data.status)}`}>
          {data.status}
        </span>
      </div>

      {/* 勤務店舗 */}
      <div className="text-center text-gray-700 truncate">{data.store}</div>

      {/* 送り場所 (Item 72) */}
      <div className="text-gray-700 truncate">{data.sendLocation || '-'}</div>

      {/* 交通費 (Item 72) */}
      <div className="text-right font-mono text-gray-700">
        {data.transportationFee ? `¥${data.transportationFee.toLocaleString()}` : '-'}
      </div>

      {/* 雑費 (Item 72) */}
      <div className="text-right font-mono text-gray-700">
        {data.miscExpenses ? `¥${data.miscExpenses.toLocaleString()}` : '-'}
      </div>

      {/* 預り (Item 72) */}
      <div className="text-right font-mono text-gray-700">
        {data.hostessDeposit ? `¥${data.hostessDeposit.toLocaleString()}` : '-'}
      </div>

      {/* 支払額 (Item 72) */}
      <div className="text-right font-mono font-semibold text-gray-900">
        {data.paymentAmount ? `¥${data.paymentAmount.toLocaleString()}` : '-'}
      </div>

      {/* 支払済み☑ (Item 72) */}
      <div className="text-center">
        <input
          type="checkbox"
          checked={data.isPaid || false}
          onChange={() => {}}
          className="w-3 h-3 text-blue-600 bg-gray-100 border-gray-300 rounded"
        />
      </div>

      {/* 預り荷物 */}
      <div className={`text-left truncate ${data.luggageDetails ? 'text-orange-600 font-medium' : 'text-gray-500'}`}>
        {data.luggageDetails || '-'}
      </div>

      {/* 備考 */}
      <div className="text-gray-500 truncate">{data.notes || '-'}</div>
    </div>
  );
}

/**
 * タブ切り替え可能な出勤管理コンポーネント
 */
export default function AttendanceTab({ staffList, hostessList }: AttendanceTabProps) {
  const [activeTab, setActiveTab] = useState<'staff' | 'hostess'>('staff');

  return (
    <Card>
      <CardHeader className="bg-indigo-50">
        <div className="flex items-center justify-between">
          <h4 className="text-md font-semibold text-indigo-700">出勤管理</h4>
          <div className="flex gap-2">
            <Button
              variant={activeTab === 'staff' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setActiveTab('staff')}
              className={activeTab === 'staff' ? 'bg-indigo-600 hover:bg-indigo-700' : ''}
            >
              出勤スタッフ ({staffList.filter(s => s.status === '出勤').length})
            </Button>
            <Button
              variant={activeTab === 'hostess' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setActiveTab('hostess')}
              className={activeTab === 'hostess' ? 'bg-indigo-600 hover:bg-indigo-700' : ''}
            >
              出勤ホステス ({hostessList.filter(h => h.status === '出勤中').length})
            </Button>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="p-4">
        {activeTab === 'staff' ? (
          <div className="space-y-2">
            {/* スクロール可能なテーブル領域 */}
            <div className="h-[500px] overflow-y-scroll border border-gray-200 rounded-lg">
              <table className="min-w-full table-fixed">
                <thead className="bg-gray-50 sticky top-0">
                  <tr>
                    <th className="w-20 px-2 py-3 text-xs font-semibold text-gray-700 text-center border-b">雇用形態</th>
                    <th className="w-24 px-2 py-3 text-xs font-semibold text-gray-700 text-left border-b">スタッフ名</th>
                    <th className="w-16 px-2 py-3 text-xs font-semibold text-gray-700 text-center border-b">ステータス</th>
                    <th className="w-12 px-2 py-3 text-xs font-semibold text-gray-700 text-center border-b">数字</th>
                    <th className="w-20 px-2 py-3 text-xs font-semibold text-gray-700 text-right border-b">給与</th>
                    <th className="w-20 px-2 py-3 text-xs font-semibold text-gray-700 text-right border-b">回収額</th>
                    <th className="w-18 px-2 py-3 text-xs font-semibold text-gray-700 text-right border-b">預り金</th>
                    <th className="w-16 px-2 py-3 text-xs font-semibold text-gray-700 text-right border-b">返金</th>
                    <th className="w-16 px-2 py-3 text-xs font-semibold text-gray-700 text-right border-b">高速等</th>
                    <th className="w-18 px-2 py-3 text-xs font-semibold text-gray-700 text-right border-b">調整額</th>
                    <th className="w-20 px-2 py-3 text-xs font-semibold text-gray-700 text-right border-b">差引精算額</th>
                    <th className="w-12 px-2 py-3 text-xs font-semibold text-gray-700 text-center border-b">数字</th>
                    <th className="w-20 px-2 py-3 text-xs font-semibold text-gray-700 text-center border-b">備品<br/><span className="text-xs text-gray-500">(青/赤/黒)</span></th>
                    <th className="w-12 px-2 py-3 text-xs font-semibold text-gray-700 text-center border-b">数字</th>
                    <th className="w-12 px-2 py-3 text-xs font-semibold text-gray-700 text-center border-b">数字</th>
                    <th className="w-12 px-2 py-3 text-xs font-semibold text-gray-700 text-center border-b">数字</th>
                    <th className="w-16 px-2 py-3 text-xs font-semibold text-gray-700 text-center border-b">管理者承認</th>
                  </tr>
                </thead>
                <tbody className="bg-white text-xs">
                  {staffList.map((staff) => (
                    <AttendingStaffItem key={staff.id} data={staff} />
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          <div className="space-y-1">
            {/* ホステス用ヘッダー行 (Item 72: 新項目追加) */}
            <div className="grid grid-cols-13 gap-1 text-xs font-semibold text-gray-700 pb-1 border-b-2 border-gray-300" style={{ gridTemplateColumns: 'repeat(13, minmax(0, 1fr))' }}>
              <div className="text-left">ホステス名</div>
              <div className="text-center">出勤</div>
              <div className="text-center">退勤予定</div>
              <div className="text-center">ステータス</div>
              <div className="text-center">店舗</div>
              <div className="text-left">送り場所</div>
              <div className="text-right">交通費</div>
              <div className="text-right">雑費</div>
              <div className="text-right">預り</div>
              <div className="text-right">支払額</div>
              <div className="text-center">済</div>
              <div className="text-left">預り荷物</div>
              <div className="text-center">備考</div>
            </div>
            {/* 凡例 (Item 71) */}
            <div className="flex gap-4 text-xs text-gray-500 pb-1">
              <span className="flex items-center gap-1"><span className="w-3 h-3 bg-red-100 rounded"></span>未精算</span>
              <span className="flex items-center gap-1"><span className="w-3 h-3 bg-white border rounded"></span>未送信</span>
              <span className="flex items-center gap-1"><span className="w-3 h-3 bg-gray-200 rounded"></span>完了</span>
            </div>

            {/* スクロール可能なデータ領域 */}
            <div className="h-[400px] overflow-y-scroll">
              <div className="space-y-0">
                {hostessList.map((hostess) => (
                  <AttendingHostessItem key={hostess.id} data={hostess} />
                ))}
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
