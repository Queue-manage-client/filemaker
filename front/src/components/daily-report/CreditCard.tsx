import React, { useState } from 'react';
import { CreditCardProps } from '@/types/credit-card';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';

const CreditCard: React.FC<CreditCardProps> = ({ data: creditCardData }) => {
  const [showDetail, setShowDetail] = useState(false);

  const formatNumber = (num: number | string): string => {
    if (typeof num !== 'number') return String(num);
    return new Intl.NumberFormat('ja-JP').format(num);
  };

  return (
    <>
      <div
        className="border-b border-gray-200 py-1 cursor-pointer hover:bg-gray-50 transition-colors"
        onClick={() => setShowDetail(true)}
        title="クリックで詳細表示"
      >
        <div className="grid grid-cols-4 gap-2 text-xs">
          {/* 店舗 */}
          <div className="text-gray-700 truncate">
            {creditCardData.store}
          </div>

          {/* コース */}
          <div className="text-gray-700 truncate">
            {creditCardData.course}
          </div>

          {/* ホステス名 */}
          <div className="text-gray-700 truncate">
            {creditCardData.hostessName}
          </div>

          {/* 請求金額 */}
          <div className="text-gray-700 text-right font-mono font-semibold">
            ¥{formatNumber(creditCardData.billAmount)}
          </div>
        </div>
      </div>

      {/* 詳細ダイアログ */}
      <Dialog open={showDetail} onOpenChange={setShowDetail}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>クレジットカード詳細</DialogTitle>
          </DialogHeader>
          <div className="space-y-3 text-sm">
            <div className="grid grid-cols-2 gap-2">
              <span className="text-gray-500">店舗:</span>
              <span className="font-medium">{creditCardData.store}</span>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <span className="text-gray-500">コース:</span>
              <span className="font-medium">{creditCardData.course}</span>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <span className="text-gray-500">ホステス名:</span>
              <span className="font-medium">{creditCardData.hostessName}</span>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <span className="text-gray-500">延長料金:</span>
              <span className="font-mono">¥{formatNumber(creditCardData.extensionFee)}</span>
            </div>
            <div className="grid grid-cols-2 gap-2 bg-blue-50 p-2 rounded">
              <span className="text-gray-500">請求金額:</span>
              <span className="font-mono font-bold text-blue-700">¥{formatNumber(creditCardData.billAmount)}</span>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <span className="text-gray-500">店舗取分:</span>
              <span className="font-mono text-blue-600">¥{formatNumber(creditCardData.storeShare)}</span>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <span className="text-gray-500">ホステス取分:</span>
              <span className="font-mono text-green-600">¥{formatNumber(creditCardData.hostessShare)}</span>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <span className="text-gray-500">ホステス預り金:</span>
              <span className="font-mono text-orange-600">¥{formatNumber(creditCardData.hostessDeposit)}</span>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <span className="text-gray-500">OUTドライバ名:</span>
              <span className="font-medium">{creditCardData.outDriverName}</span>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default CreditCard;
