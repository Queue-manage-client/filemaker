import React from 'react';
import { EMPLOYMENT_TYPE_LABELS } from '@/types/staff';
import type { StaffListItemProps, StaffListProps } from '@/types/staff-list';

/**
 * スタッフリストの1行分のコンポーネント
 */
function StaffListItem({ data }: StaffListItemProps) {
  return (
    <div className="grid grid-cols-7 gap-2 text-sm py-2 border-b border-gray-200 hover:bg-gray-50">
      {/* 雇用形態 */}
      <div className="text-center">
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
          data.employmentType === 'employee' 
            ? 'bg-blue-100 text-blue-800' 
            : 'bg-green-100 text-green-800'
        }`}>
          {EMPLOYMENT_TYPE_LABELS[data.employmentType]}
        </span>
      </div>
      
      {/* スタッフ名 */}
      <div className="font-medium text-gray-900">{data.staffName}</div>
      
      {/* ステータス */}
      <div className="text-center">
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
          data.status === '出勤' 
            ? 'bg-emerald-100 text-emerald-800' 
            : 'bg-yellow-100 text-yellow-800'
        }`}>
          {data.status}
        </span>
      </div>
      
      {/* 数値 */}
      <div className="text-right font-mono text-gray-700">{data.numericValue}</div>
      
      {/* 金額1 */}
      <div className="text-right font-mono text-gray-700">
        ¥{data.amount1.toLocaleString()}
      </div>
      
      {/* 金額2 */}
      <div className="text-right font-mono text-gray-700">
        ¥{data.amount2.toLocaleString()}
      </div>
      
      {/* 金額3 */}
      <div className="text-right font-mono text-gray-700">
        ¥{data.amount3.toLocaleString()}
      </div>
    </div>
  );
}

// Props 型は分離済み

/**
 * スタッフリストコンポーネント
 */
export default function StaffList({ staffList }: StaffListProps) {
  return (
    <div className="space-y-2">
      {/* ヘッダー行 */}
      <div className="grid grid-cols-7 gap-2 text-sm font-semibold text-gray-700 pb-2 border-b-2 border-gray-300">
        <div className="text-center">雇用形態</div>
        <div className="text-left">スタッフ名</div>
        <div className="text-center">ステータス</div>
        <div className="text-right">数値</div>
        <div className="text-right">金額1</div>
        <div className="text-right">金額2</div>
        <div className="text-right">金額3</div>
      </div>
      
      {/* データ行 */}
      <div className="space-y-0">
        {staffList.map((staff, index) => (
          <StaffListItem key={index} data={staff} />
        ))}
      </div>
    </div>
  );
}
