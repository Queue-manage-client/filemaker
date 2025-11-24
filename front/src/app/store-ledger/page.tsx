'use client';

import React from 'react';
import { useRouter } from 'next/navigation';

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowLeft, Building, Plus, Settings, Users, FileText, DollarSign, 
         Calendar, MessageSquare, TrendingUp, Award, Minus, Gift, 
         Percent, Eye, Camera, Cog, Edit, Save, X } from "lucide-react";

import { 
  storeLedgerTabs, 
  StoreLedgerTab,
  CourseFee
  // Discount,
  // StoreOptions
} from '@/types';

import { useStoreLedger, useStoreBasicInfo } from '@/hooks/use-store-ledger';
import { calculateCourseFeeShares } from '@/lib/utils';
import { discountSampleData, storeOptionsSampleData } from '@/data/storeLedgerSampleData';
import { useShopList } from '@/hooks/use-shop';

// 各タブのアイコンマッピング
const tabIcons: Record<StoreLedgerTab, React.ComponentType<{ className?: string }>> = {
  'basic': FileText,
  'gm-division': Users,
  'course-prices': DollarSign,
  'special-prices': Plus,
  'staff-composition': Users,
  'class-prices': Award,
  'bonus-criteria': Gift,
  'nominations': Award,
  'attendance': Calendar,
  'communications': MessageSquare,
  'sales-data': TrendingUp,
  'other-points': Plus,
  'minus-points': Minus,
  'customer-points': Gift,
  'discounts': Percent,
  'display-settings': Eye,
  'media': Camera,
  'options': Cog
};

export default function StoreLedger() {
  const router = useRouter();
  
  // shopテーブルから店舗一覧を取得
  const { data: shops = [] } = useShopList();
  const storeList = shops.map(shop => shop.store_name || '').filter(Boolean);
  const initialStore = storeList[0] || '';

  // カスタムフックを使用してデータと操作を管理
  const {
    selectedStore,
    setSelectedStore,
    activeTab,
    setActiveTab,
    selectedStoreInfo,
    selectedStoreId,
    editingCourseId,
    editForms,
    setEditForms,
    basicTag,
    gmDivisions,
    courseFees,
    staffCompositions,
    salesData,
    // isLoading,
    // errors,
    // isMutating,
    handleDeleteCourseFee,
    handleAddCourseFee,
    handleEditCourseFee,
    handleSaveCourseFee,
    handleCancelEdit,
  } = useStoreLedger(initialStore);

  // 店舗一覧取得
  const { data: storeBasicInfoList } = useStoreBasicInfo();


  const renderTabContent = (tabId: StoreLedgerTab) => {

    switch (tabId) {
      case 'basic':
        if (!basicTag) {
          return <div className="text-center text-gray-500 py-8">読み込み中...</div>;
        }
        const basicTagData = basicTag;
        
        return (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold mb-4">基本タグ</h3>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* 左半分：基本情報 */}
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">SPID(通し番号)</label>
                    <div className="p-2 bg-gray-50 rounded border">{basicTagData.spid}</div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">日報表示</label>
                    <div className="p-2 bg-gray-50 rounded border">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        basicTagData.dailyReportDisplay 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {basicTagData.dailyReportDisplay ? '表示' : '非表示'}
                      </span>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">部門No</label>
                    <div className="p-2 bg-gray-50 rounded border">{basicTagData.departmentNo}</div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">会計区分</label>
                    <div className="p-2 bg-gray-50 rounded border">
                      <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
                        {basicTagData.accountingCategory}
                      </span>
                    </div>
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">非同日出勤グループ</label>
                    <div className="p-2 bg-gray-50 rounded border">{basicTagData.nonSameDayWorkGroup || '未設定'}</div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">店舗名</label>
                    <div className="p-2 bg-gray-50 rounded border">{basicTagData.storeName}</div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">店舗名ふりがな</label>
                    <div className="p-2 bg-gray-50 rounded border">{basicTagData.storeNameKana}</div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">省略店舗名</label>
                    <div className="p-2 bg-gray-50 rounded border">{basicTagData.storeNameAbbr}</div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">電話番号</label>
                    <div className="p-2 bg-gray-50 rounded border">{basicTagData.phoneNumber}</div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">URL</label>
                    <div className="p-2 bg-gray-50 rounded border">{basicTagData.url}</div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Mail</label>
                    <div className="p-2 bg-gray-50 rounded border">{basicTagData.email}</div>
                  </div>
                </div>

                {/* 追加設定項目 */}
                <div className="space-y-4">
                  <h4 className="text-lg font-semibold text-gray-800 border-b border-gray-300 pb-2">詳細設定</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">コース料金方式</label>
                      <div className="p-2 bg-gray-50 rounded border">
                        <div className="flex gap-4">
                          <label className="flex items-center">
                            <input 
                              type="radio" 
                              name="coursePricingMethod" 
                              value="定額制" 
                              checked={basicTagData.coursePricingMethod === '定額制'} 
                              readOnly
                              className="mr-2"
                            />
                            定額制
                          </label>
                          <label className="flex items-center">
                            <input 
                              type="radio" 
                              name="coursePricingMethod" 
                              value="割合制" 
                              checked={basicTagData.coursePricingMethod === '割合制'} 
                              readOnly
                              className="mr-2"
                            />
                            割合制
                          </label>
                        </div>
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">指名方式</label>
                      <div className="p-2 bg-gray-50 rounded border">
                        <div className="flex gap-4">
                          <label className="flex items-center">
                            <input 
                              type="radio" 
                              name="nominationMethod" 
                              value="店舗一律" 
                              checked={basicTagData.nominationMethod === '店舗一律'} 
                              readOnly
                              className="mr-2"
                            />
                            店舗一律
                          </label>
                          <label className="flex items-center">
                            <input 
                              type="radio" 
                              name="nominationMethod" 
                              value="ホステス別" 
                              checked={basicTagData.nominationMethod === 'ホステス別'} 
                              readOnly
                              className="mr-2"
                            />
                            ホステス別
                          </label>
                        </div>
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">GM区分</label>
                      <div className="p-2 bg-gray-50 rounded border">
                        <div className="flex gap-4">
                          <label className="flex items-center">
                            <input 
                              type="radio" 
                              name="gmDivision" 
                              value="有" 
                              checked={basicTagData.gmDivision === '有'} 
                              readOnly
                              className="mr-2"
                            />
                            有
                          </label>
                          <label className="flex items-center">
                            <input 
                              type="radio" 
                              name="gmDivision" 
                              value="無" 
                              checked={basicTagData.gmDivision === '無'} 
                              readOnly
                              className="mr-2"
                            />
                            無
                          </label>
                        </div>
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">指名料</label>
                      <div className="p-2 bg-gray-50 rounded border">¥{basicTagData.nominationFee.toLocaleString()}</div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">延長料金／延長単位</label>
                      <div className="p-2 bg-gray-50 rounded border">
                        ¥{basicTagData.extensionFee.toLocaleString()}／{basicTagData.extensionUnit}分
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">基本交通費</label>
                      <div className="p-2 bg-gray-50 rounded border">¥{basicTagData.basicTransportationFee.toLocaleString()}</div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">キャンセル料</label>
                      <div className="p-2 bg-gray-50 rounded border">¥{basicTagData.cancellationFee.toLocaleString()}</div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">会員カード発行</label>
                      <div className="p-2 bg-gray-50 rounded border">
                        <div className="flex gap-4">
                          <label className="flex items-center">
                            <input 
                              type="radio" 
                              name="memberCardIssuance" 
                              value="有" 
                              checked={basicTagData.memberCardIssuance === '有'} 
                              readOnly
                              className="mr-2"
                            />
                            有
                          </label>
                          <label className="flex items-center">
                            <input 
                              type="radio" 
                              name="memberCardIssuance" 
                              value="無" 
                              checked={basicTagData.memberCardIssuance === '無'} 
                              readOnly
                              className="mr-2"
                            />
                            無
                          </label>
                        </div>
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">顧客ポイント初期値前半</label>
                      <div className="p-2 bg-gray-50 rounded border">{basicTagData.customerPointInitialValueFirstHalf}</div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">顧客ポイント初期値後半(%)</label>
                      <div className="p-2 bg-gray-50 rounded border">{basicTagData.customerPointInitialValueSecondHalf}%</div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">指名プラスバック制</label>
                      <div className="p-2 bg-gray-50 rounded border">
                        <div className="flex gap-4">
                          <label className="flex items-center">
                            <input 
                              type="radio" 
                              name="nominationPlusBackSystem" 
                              value="有" 
                              checked={basicTagData.nominationPlusBackSystem === '有'} 
                              readOnly
                              className="mr-2"
                            />
                            有
                          </label>
                          <label className="flex items-center">
                            <input 
                              type="radio" 
                              name="nominationPlusBackSystem" 
                              value="無" 
                              checked={basicTagData.nominationPlusBackSystem === '無'} 
                              readOnly
                              className="mr-2"
                            />
                            無
                          </label>
                        </div>
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">チェンジ料</label>
                      <div className="p-2 bg-gray-50 rounded border">¥{basicTagData.changeFee.toLocaleString()}</div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">カード手数料率</label>
                      <div className="p-2 bg-gray-50 rounded border">{basicTagData.cardCommissionRate}%</div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">基本ホステス受取率</label>
                      <div className="p-2 bg-gray-50 rounded border">{basicTagData.basicHostessReceivingRate || '未設定'}</div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">延長方式</label>
                      <div className="p-2 bg-gray-50 rounded border">
                        <div className="flex gap-4">
                          <label className="flex items-center">
                            <input 
                              type="radio" 
                              name="extensionMethod" 
                              value="固定割合制" 
                              checked={basicTagData.extensionMethod === '固定割合制'} 
                              readOnly
                              className="mr-2"
                            />
                            固定割合制
                          </label>
                          <label className="flex items-center">
                            <input 
                              type="radio" 
                              name="extensionMethod" 
                              value="ホステス別" 
                              checked={basicTagData.extensionMethod === 'ホステス別'} 
                              readOnly
                              className="mr-2"
                            />
                            ホステス別
                          </label>
                        </div>
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">延長ホステス受取率</label>
                      <div className="p-2 bg-gray-50 rounded border">{basicTagData.extensionHostessReceivingRate || '未設定'}</div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">パネル指名料</label>
                      <div className="p-2 bg-gray-50 rounded border">¥{basicTagData.panelNominationFee.toLocaleString()}</div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">星単価</label>
                      <div className="p-2 bg-gray-50 rounded border">{basicTagData.starUnitPrice || '未設定'}</div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">星料FR_N_Rは除く</label>
                      <div className="p-2 bg-gray-50 rounded border">
                        <div className="flex gap-4">
                          <label className="flex items-center">
                            <input 
                              type="radio" 
                              name="starFeeExcludeFrNR" 
                              value="有" 
                              checked={basicTagData.starFeeExcludeFrNR === '有'} 
                              readOnly
                              className="mr-2"
                            />
                            有
                          </label>
                          <label className="flex items-center">
                            <input 
                              type="radio" 
                              name="starFeeExcludeFrNR" 
                              value="無" 
                              checked={basicTagData.starFeeExcludeFrNR === '無'} 
                              readOnly
                              className="mr-2"
                            />
                            無
                          </label>
                        </div>
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">営業形態</label>
                      <div className="p-2 bg-gray-50 rounded border">
                        <div className="flex gap-4">
                          <label className="flex items-center">
                            <input 
                              type="radio" 
                              name="businessType" 
                              value="デリヘル" 
                              checked={basicTagData.businessType === 'デリヘル'} 
                              readOnly
                              className="mr-2"
                            />
                            デリヘル
                          </label>
                          <label className="flex items-center">
                            <input 
                              type="radio" 
                              name="businessType" 
                              value="ホテヘル" 
                              checked={basicTagData.businessType === 'ホテヘル'} 
                              readOnly
                              className="mr-2"
                            />
                            ホテヘル
                          </label>
                        </div>
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">会員番号発行管理</label>
                      <div className="p-2 bg-gray-50 rounded border">
                        <div className="flex gap-4">
                          <label className="flex items-center">
                            <input 
                              type="radio" 
                              name="memberNumberIssuanceManagement" 
                              value="店舗" 
                              checked={basicTagData.memberNumberIssuanceManagement === '店舗'} 
                              readOnly
                              className="mr-2"
                            />
                            店舗
                          </label>
                          <label className="flex items-center">
                            <input 
                              type="radio" 
                              name="memberNumberIssuanceManagement" 
                              value="グループ" 
                              checked={basicTagData.memberNumberIssuanceManagement === 'グループ'} 
                              readOnly
                              className="mr-2"
                            />
                            グループ
                          </label>
                        </div>
                      </div>
                    </div>
                    {basicTagData.memberNumberIssuanceManagement === '店舗' && (
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">店舗別会員番号発番</label>
                        <div className="p-2 bg-gray-50 rounded border">{basicTagData.storeSpecificMemberNumberIssuance}</div>
                      </div>
                    )}
                    {basicTagData.memberNumberIssuanceManagement === 'グループ' && (
                      <>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">グループNo</label>
                          <div className="p-2 bg-gray-50 rounded border">{basicTagData.groupNo || '未設定'}</div>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">グループ共通会員番号発番</label>
                          <div className="p-2 bg-gray-50 rounded border">{basicTagData.groupCommonMemberNumberIssuance || '未設定'}</div>
                        </div>
                      </>
                    )}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">前半時間帯</label>
                      <div className="p-2 bg-gray-50 rounded border">
                        {basicTagData.firstHalfStartTime}以降{basicTagData.firstHalfEndTime}未満
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">後半時間帯</label>
                      <div className="p-2 bg-gray-50 rounded border">
                        {basicTagData.secondHalfStartTime}以降{basicTagData.secondHalfEndTime}未満
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* 右半分：URL表示エリア */}
              <div className="space-y-4">
                {/* web連携関連項目 */}
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">web連携</label>
                    <div className="p-2 bg-gray-50 rounded border">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        basicTagData.webLinkage 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {basicTagData.webLinkage ? '有効' : '無効'}
                      </span>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">web送信本仮切替sw</label>
                    <div className="p-2 bg-gray-50 rounded border">
                      <div className="flex gap-4">
                        <label className="flex items-center">
                          <input 
                            type="radio" 
                            name="webSendMode" 
                            value="本" 
                            checked={basicTagData.webSendMode === '本'} 
                            readOnly
                            className="mr-2"
                          />
                          本
                        </label>
                        <label className="flex items-center">
                          <input 
                            type="radio" 
                            name="webSendMode" 
                            value="仮" 
                            checked={basicTagData.webSendMode === '仮'} 
                            readOnly
                            className="mr-2"
                          />
                          仮
                        </label>
                      </div>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">web管理用ID</label>
                    <div className="p-2 bg-gray-50 rounded border">{basicTagData.webManageId}</div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">web管理用パス</label>
                    <div className="p-2 bg-gray-50 rounded border">{basicTagData.webManagePassword}</div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">web管理用URL</label>
                    <div className="p-2 bg-gray-50 rounded border">{basicTagData.url + basicTagData.webManageUrl}</div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">ホステスページURL</label>
                    <div className="p-2 bg-gray-50 rounded border">{basicTagData.url + basicTagData.hostessPageUrl}</div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">webホステス一覧URL</label>
                    <div className="p-2 bg-gray-50 rounded border">{basicTagData.url + basicTagData.webHostessListUrl}</div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">ホステス出勤管理ページURL</label>
                    <div className="p-2 bg-gray-50 rounded border">{basicTagData.url + basicTagData.hostessAttendanceManageUrl}</div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">ホステス管理ページURL</label>
                    <div className="p-2 bg-gray-50 rounded border">{basicTagData.url + basicTagData.hostessManageUrl}</div>
                  </div>
                </div>

                {/* 青枠：web送信用URL */}
                <div className="border-2 border-blue-500 rounded-lg p-4 bg-blue-50">
                  <h4 className="text-lg font-semibold text-blue-800 mb-4">web送信用URL</h4>
                  <div className="space-y-3">
                    <div>
                      <label className="block text-sm font-medium text-blue-700 mb-1">hsprofile</label>
                      <div className="p-2 bg-white rounded border border-blue-200 text-sm font-mono">
                        {basicTagData.url}{basicTagData.webSendUrls.hsprofile}
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-blue-700 mb-1">hsattend</label>
                      <div className="p-2 bg-white rounded border border-blue-200 text-sm font-mono">
                        {basicTagData.url}{basicTagData.webSendUrls.hsattend}
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-blue-700 mb-1">hsjob</label>
                      <div className="p-2 bg-white rounded border border-blue-200 text-sm font-mono">
                        {basicTagData.url}{basicTagData.webSendUrls.hsjob}
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-blue-700 mb-1">ctpoint</label>
                      <div className="p-2 bg-white rounded border border-blue-200 text-sm font-mono">
                        {basicTagData.url}{basicTagData.webSendUrls.ctpoint}
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-blue-700 mb-1">hstattendweek</label>
                      <div className="p-2 bg-white rounded border border-blue-200 text-sm font-mono">
                        {basicTagData.url}{basicTagData.webSendUrls.hstattendweek}
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-blue-700 mb-1">web送信用URL_hsstart</label>
                      <div className="p-2 bg-white rounded border border-blue-200 text-sm font-mono">
                        {basicTagData.url}{basicTagData.webSendUrls.hsstart}
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-blue-700 mb-1">web送信用URL_hsranking</label>
                      <div className="p-2 bg-white rounded border border-blue-200 text-sm font-mono">
                        {basicTagData.url}{basicTagData.webSendUrls.hsranking}
                      </div>
                    </div>
                  </div>
                </div>

                {/* 黄枠：web送信用URL 仮 */}
                <div className="border-2 border-yellow-500 rounded-lg p-4 bg-yellow-50">
                  <h4 className="text-lg font-semibold text-yellow-800 mb-4">web送信用URL　仮</h4>
                  <div className="space-y-3">
                    <div>
                      <label className="block text-sm font-medium text-yellow-700 mb-1">hsprofile</label>
                      <div className="p-2 bg-white rounded border border-yellow-200 text-sm font-mono">
                        {basicTagData.url}{basicTagData.webSendUrlsTemp.hsprofile}
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-yellow-700 mb-1">hsattend</label>
                      <div className="p-2 bg-white rounded border border-yellow-200 text-sm font-mono">
                        {basicTagData.url}{basicTagData.webSendUrlsTemp.hsattend}
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-yellow-700 mb-1">hsjob</label>
                      <div className="p-2 bg-white rounded border border-yellow-200 text-sm font-mono">
                        {basicTagData.url}{basicTagData.webSendUrlsTemp.hsjob}
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-yellow-700 mb-1">ctpoint</label>
                      <div className="p-2 bg-white rounded border border-yellow-200 text-sm font-mono">
                        {basicTagData.url}{basicTagData.webSendUrlsTemp.ctpoint}
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-yellow-700 mb-1">hstattendweek</label>
                      <div className="p-2 bg-white rounded border border-yellow-200 text-sm font-mono">
                        {basicTagData.url}{basicTagData.webSendUrlsTemp.hstattendweek}
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-yellow-700 mb-1">web送信用URL_hsstart　仮</label>
                      <div className="p-2 bg-white rounded border border-yellow-200 text-sm font-mono">
                        {basicTagData.url}{basicTagData.webSendUrlsTemp.hsstart}
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-yellow-700 mb-1">web送信用URL_hsranking　仮</label>
                      <div className="p-2 bg-white rounded border border-yellow-200 text-sm font-mono">
                        {basicTagData.url}{basicTagData.webSendUrlsTemp.hsranking}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      case 'gm-division':
        const gmData = gmDivisions;
        return (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold">GM区分</h3>
              <Button size="sm" className="flex items-center gap-2">
                <Plus className="w-4 h-4" />
                追加
              </Button>
            </div>
            <div className="bg-white rounded-lg border">
              <div className="overflow-x-auto">
                <table className="min-w-full">
                  <thead className="bg-gray-50 border-b">
                    <tr>
                      <th className="px-3 py-2 text-left text-xs font-medium text-gray-700 whitespace-nowrap">GM区分</th>
                      <th className="px-3 py-2 text-left text-xs font-medium text-gray-700 whitespace-nowrap">種別</th>
                      <th className="px-3 py-2 text-left text-xs font-medium text-gray-700 whitespace-nowrap">Web名</th>
                      <th className="px-3 py-2 text-center text-xs font-medium text-gray-700 whitespace-nowrap">HP番号</th>
                      <th className="px-3 py-2 text-center text-xs font-medium text-gray-700 whitespace-nowrap">順序</th>
                      <th className="px-3 py-2 text-center text-xs font-medium text-gray-700 whitespace-nowrap">操作</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {gmData.sort((a, b) => a.sortOrder - b.sortOrder).map((gm) => (
                      <tr key={gm.id} className="hover:bg-gray-50">
                        <td className="px-3 py-2 text-xs font-medium whitespace-nowrap">{gm.gmDivisionName}</td>
                        <td className="px-3 py-2 text-xs">
                          <div className="flex gap-2">
                            <label className="flex items-center">
                              <input 
                                type="radio" 
                                name={`hostessType_${gm.id}`} 
                                value="A" 
                                checked={gm.hostessType === 'A'} 
                                readOnly
                                className="mr-1 scale-75"
                              />
                              <span className="text-xs">A</span>
                            </label>
                            <label className="flex items-center">
                              <input 
                                type="radio" 
                                name={`hostessType_${gm.id}`} 
                                value="B" 
                                checked={gm.hostessType === 'B'} 
                                readOnly
                                className="mr-1 scale-75"
                              />
                              <span className="text-xs">B</span>
                            </label>
                          </div>
                        </td>
                        <td className="px-3 py-2 text-xs font-mono whitespace-nowrap">{gm.webName}</td>
                        <td className="px-3 py-2 text-xs text-center">
                          <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-blue-100 text-blue-800 text-xs font-medium">
                            {gm.hpNumber}
                          </span>
                        </td>
                        <td className="px-3 py-2 text-xs text-center">
                          <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-gray-100 text-gray-800 text-xs font-medium">
                            {gm.sortOrder}
                          </span>
                        </td>
                        <td className="px-3 py-2 text-xs text-center">
                          <Button 
                            variant="destructive" 
                            size="sm" 
                            className="h-6 px-2 text-xs"
                          >
                            <Minus className="w-3 h-3" />
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        );

      case 'course-prices':
        const courseFeeData = courseFees;

        return (
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold">コース料金</h3>
              <Button 
                size="sm" 
                className="flex items-center gap-2"
                onClick={handleAddCourseFee}
              >
                <Plus className="w-4 h-4" />
                追加
              </Button>
            </div>

            {/* 編集モーダル */}
            {editingCourseId && (
              <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                <div className="bg-white rounded-lg p-6 max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto">
                  <div className="flex justify-between items-center mb-4">
                    <h4 className="text-lg font-semibold">コース編集</h4>
                    <Button variant="outline" size="sm" onClick={handleCancelEdit}>
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                  
                  {(() => {
                    const editForm = editForms[editingCourseId];
                    if (!editForm) return null;

                    const updateEditForm = (updates: Partial<CourseFee>) => {
                      setEditForms(prev => ({
                        ...prev,
                        [editingCourseId]: { ...editForm, ...updates }
                      }));
                    };

                    const calculatedShares = calculateCourseFeeShares(
                      editForm.price,
                      editForm.hostessShare.free.percentage,
                      editForm.hostessShare.panel.percentage,
                      editForm.hostessShare.nomination.percentage
                    );

                    return (
                      <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">コース名</label>
                            <Input
                              value={editForm.courseName}
                              onChange={(e) => updateEditForm({ courseName: e.target.value })}
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">GM区分</label>
                            <Select 
                              value={editForm.gmDivision} 
                              onValueChange={(value) => updateEditForm({ gmDivision: value })}
                            >
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="ガールズ">ガールズ</SelectItem>
                                <SelectItem value="レディ">レディ</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">コース種類</label>
                            <Select 
                              value={editForm.courseType} 
                              onValueChange={(value: 'Standard' | 'Gold' | 'Premium') => updateEditForm({ courseType: value })}
                            >
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="Standard">Standard</SelectItem>
                                <SelectItem value="Gold">Gold</SelectItem>
                                <SelectItem value="Premium">Premium</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">種別</label>
                            <Select 
                              value={editForm.type} 
                              onValueChange={(value: 'A' | 'B') => updateEditForm({ type: value })}
                            >
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="A">A</SelectItem>
                                <SelectItem value="B">B</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">時間（分）</label>
                            <Input
                              type="number"
                              value={editForm.duration}
                              onChange={(e) => updateEditForm({ duration: parseInt(e.target.value) || 0 })}
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">料金</label>
                            <Input
                              type="number"
                              value={editForm.price}
                              onChange={(e) => updateEditForm({ price: parseInt(e.target.value) || 0 })}
                            />
                          </div>
                        </div>

                        <div className="border rounded-lg p-4 bg-red-50">
                          <h5 className="font-semibold text-red-800 mb-3">ホステス取分割合</h5>
                          <div className="grid grid-cols-3 gap-3">
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">フリー（%）</label>
                              <Input
                                type="number"
                                value={editForm.hostessShare.free.percentage}
                                onChange={(e) => updateEditForm({
                                  hostessShare: {
                                    ...editForm.hostessShare,
                                    free: { ...editForm.hostessShare.free, percentage: parseInt(e.target.value) || 0 }
                                  }
                                })}
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">パネル（%）</label>
                              <Input
                                type="number"
                                value={editForm.hostessShare.panel.percentage}
                                onChange={(e) => updateEditForm({
                                  hostessShare: {
                                    ...editForm.hostessShare,
                                    panel: { ...editForm.hostessShare.panel, percentage: parseInt(e.target.value) || 0 }
                                  }
                                })}
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">指名（%）</label>
                              <Input
                                type="number"
                                value={editForm.hostessShare.nomination.percentage}
                                onChange={(e) => updateEditForm({
                                  hostessShare: {
                                    ...editForm.hostessShare,
                                    nomination: { ...editForm.hostessShare.nomination, percentage: parseInt(e.target.value) || 0 }
                                  }
                                })}
                              />
                            </div>
                          </div>
                        </div>

                        <div className="border rounded-lg p-4 bg-blue-50">
                          <h5 className="font-semibold text-blue-800 mb-3">計算プレビュー</h5>
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <h6 className="text-sm font-semibold text-red-700 mb-2">ホステス取分</h6>
                              <div className="grid grid-cols-3 gap-2 text-xs">
                                <div className="bg-white rounded p-2 border">
                                  <div className="text-gray-600">フリー</div>
                                  <div className="font-semibold text-red-700">¥{calculatedShares.hostessShare.free.amount.toLocaleString()}</div>
                                </div>
                                <div className="bg-white rounded p-2 border">
                                  <div className="text-gray-600">パネル</div>
                                  <div className="font-semibold text-red-700">¥{calculatedShares.hostessShare.panel.amount.toLocaleString()}</div>
                                </div>
                                <div className="bg-white rounded p-2 border">
                                  <div className="text-gray-600">指名</div>
                                  <div className="font-semibold text-red-700">¥{calculatedShares.hostessShare.nomination.amount.toLocaleString()}</div>
                                </div>
                              </div>
                            </div>
                            <div>
                              <h6 className="text-sm font-semibold text-blue-700 mb-2">店舗取分</h6>
                              <div className="grid grid-cols-3 gap-2 text-xs">
                                <div className="bg-white rounded p-2 border">
                                  <div className="text-gray-600">フリー</div>
                                  <div className="font-semibold text-blue-700">¥{calculatedShares.storeShare.free.amount.toLocaleString()}</div>
                                </div>
                                <div className="bg-white rounded p-2 border">
                                  <div className="text-gray-600">パネル</div>
                                  <div className="font-semibold text-blue-700">¥{calculatedShares.storeShare.panel.amount.toLocaleString()}</div>
                                </div>
                                <div className="bg-white rounded p-2 border">
                                  <div className="text-gray-600">指名</div>
                                  <div className="font-semibold text-blue-700">¥{calculatedShares.storeShare.nomination.amount.toLocaleString()}</div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>

                        <div className="flex justify-end gap-2">
                          <Button variant="outline" size="sm" onClick={handleCancelEdit}>
                            キャンセル
                          </Button>
                          <Button size="sm" onClick={() => handleSaveCourseFee(editForm)}>
                            <Save className="w-4 h-4 mr-1" />
                            保存
                          </Button>
                        </div>
                      </div>
                    );
                  })()}
                </div>
              </div>
            )}

            {/* A種別とB種別で分けたテーブル */}
            <div className="space-y-6">
              {/* A種別テーブル */}
              <div>
                <h4 className="text-md font-semibold mb-3 text-gray-800 border-b border-gray-300 pb-2 flex items-center gap-2">
                  <span className="inline-flex px-2 py-1 text-xs font-semibold rounded bg-green-100 text-green-800">A</span>
                  A種別
                </h4>
                <div className="bg-white rounded-lg border">
                  <div className="overflow-x-auto">
                    <table className="w-full text-xs">
                      <thead className="bg-gray-50 border-b">
                        <tr>
                          <th className="px-2 py-2 text-left font-medium text-gray-700">コース名</th>
                          <th className="px-2 py-2 text-left font-medium text-gray-700">GM区分</th>
                          <th className="px-2 py-2 text-left font-medium text-gray-700">種類</th>
                          <th className="px-2 py-2 text-right font-medium text-gray-700">時間</th>
                          <th className="px-2 py-2 text-right font-medium text-gray-700">料金</th>
                          <th className="px-2 py-2 text-center font-medium text-gray-700 bg-red-50">ホステス取分</th>
                          <th className="px-2 py-2 text-center font-medium text-gray-700 bg-blue-50">店舗取分</th>
                          <th className="px-2 py-2 text-center font-medium text-gray-700">操作</th>
                        </tr>
                        <tr className="bg-gray-50 border-b">
                          <th></th>
                          <th></th>
                          <th></th>
                          <th></th>
                          <th></th>
                          <th className="px-1 py-1 text-center text-xs">
                            <div className="grid grid-cols-3 gap-1">
                              <div className="text-red-700">フリー</div>
                              <div className="text-red-700">パネル</div>
                              <div className="text-red-700">指名</div>
                            </div>
                          </th>
                          <th className="px-1 py-1 text-center text-xs">
                            <div className="grid grid-cols-3 gap-1">
                              <div className="text-blue-700">フリー</div>
                              <div className="text-blue-700">パネル</div>
                              <div className="text-blue-700">指名</div>
                            </div>
                          </th>
                          <th></th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200">
                        {courseFeeData.filter(course => course.type === 'A').map((course) => {
                          const calculatedShares = calculateCourseFeeShares(
                            course.price,
                            course.hostessShare.free.percentage,
                            course.hostessShare.panel.percentage,
                            course.hostessShare.nomination.percentage
                          );

                          return (
                            <tr key={course.id} className="hover:bg-gray-50">
                              <td className="px-2 py-2 font-medium">{course.courseName}</td>
                              <td className="px-2 py-2">{course.gmDivision}</td>
                              <td className="px-2 py-2">
                                <span className={`inline-flex px-2 py-1 text-xs rounded ${
                                  course.courseType === 'Standard' ? 'bg-gray-100 text-gray-800' :
                                  course.courseType === 'Gold' ? 'bg-yellow-100 text-yellow-800' : 
                                  'bg-purple-100 text-purple-800'
                                }`}>
                                  {course.courseType}
                                </span>
                              </td>
                              <td className="px-2 py-2 text-right">{course.duration}分</td>
                              <td className="px-2 py-2 text-right font-medium">¥{course.price.toLocaleString()}</td>
                              <td className="px-1 py-2 bg-red-50">
                                <div className="grid grid-cols-3 gap-1 text-xs">
                                  <div className="text-center">
                                    <div className="text-red-700">{course.hostessShare.free.percentage}%</div>
                                    <div className="font-medium">¥{calculatedShares.hostessShare.free.amount.toLocaleString()}</div>
                                  </div>
                                  <div className="text-center">
                                    <div className="text-red-700">{course.hostessShare.panel.percentage}%</div>
                                    <div className="font-medium">¥{calculatedShares.hostessShare.panel.amount.toLocaleString()}</div>
                                  </div>
                                  <div className="text-center">
                                    <div className="text-red-700">{course.hostessShare.nomination.percentage}%</div>
                                    <div className="font-medium">¥{calculatedShares.hostessShare.nomination.amount.toLocaleString()}</div>
                                  </div>
                                </div>
                              </td>
                              <td className="px-1 py-2 bg-blue-50">
                                <div className="grid grid-cols-3 gap-1 text-xs">
                                  <div className="text-center">
                                    <div className="font-medium text-blue-700">¥{calculatedShares.storeShare.free.amount.toLocaleString()}</div>
                                  </div>
                                  <div className="text-center">
                                    <div className="font-medium text-blue-700">¥{calculatedShares.storeShare.panel.amount.toLocaleString()}</div>
                                  </div>
                                  <div className="text-center">
                                    <div className="font-medium text-blue-700">¥{calculatedShares.storeShare.nomination.amount.toLocaleString()}</div>
                                  </div>
                                </div>
                              </td>
                              <td className="px-2 py-2 text-center">
                                <div className="flex gap-1 justify-center">
                                  <Button 
                                    variant="outline" 
                                    size="sm"
                                    className="h-6 px-2 text-xs"
                                    onClick={() => handleEditCourseFee(course.id)}
                                  >
                                    <Edit className="w-3 h-3" />
                                  </Button>
                                  <Button 
                                    variant="destructive" 
                                    size="sm"
                                    className="h-6 px-2 text-xs"
                                    onClick={() => {
                                      if (window.confirm(`${course.courseName}を削除しますか？`)) {
                                        handleDeleteCourseFee(course.id);
                                      }
                                    }}
                                  >
                                    <Minus className="w-3 h-3" />
                                  </Button>
                                </div>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                  
                  {courseFeeData.filter(course => course.type === 'A').length === 0 && (
                    <div className="text-center text-gray-500 py-8">
                      <div className="text-sm">A種別のコースが登録されていません</div>
                    </div>
                  )}
                </div>
              </div>

              {/* B種別テーブル */}
              <div>
                <h4 className="text-md font-semibold mb-3 text-gray-800 border-b border-gray-300 pb-2 flex items-center gap-2">
                  <span className="inline-flex px-2 py-1 text-xs font-semibold rounded bg-orange-100 text-orange-800">B</span>
                  B種別
                </h4>
                <div className="bg-white rounded-lg border">
                  <div className="overflow-x-auto">
                    <table className="w-full text-xs">
                      <thead className="bg-gray-50 border-b">
                        <tr>
                          <th className="px-2 py-2 text-left font-medium text-gray-700">コース名</th>
                          <th className="px-2 py-2 text-left font-medium text-gray-700">GM区分</th>
                          <th className="px-2 py-2 text-left font-medium text-gray-700">種類</th>
                          <th className="px-2 py-2 text-right font-medium text-gray-700">時間</th>
                          <th className="px-2 py-2 text-right font-medium text-gray-700">料金</th>
                          <th className="px-2 py-2 text-center font-medium text-gray-700 bg-red-50">ホステス取分</th>
                          <th className="px-2 py-2 text-center font-medium text-gray-700 bg-blue-50">店舗取分</th>
                          <th className="px-2 py-2 text-center font-medium text-gray-700">操作</th>
                        </tr>
                        <tr className="bg-gray-50 border-b">
                          <th></th>
                          <th></th>
                          <th></th>
                          <th></th>
                          <th></th>
                          <th className="px-1 py-1 text-center text-xs">
                            <div className="grid grid-cols-3 gap-1">
                              <div className="text-red-700">フリー</div>
                              <div className="text-red-700">パネル</div>
                              <div className="text-red-700">指名</div>
                            </div>
                          </th>
                          <th className="px-1 py-1 text-center text-xs">
                            <div className="grid grid-cols-3 gap-1">
                              <div className="text-blue-700">フリー</div>
                              <div className="text-blue-700">パネル</div>
                              <div className="text-blue-700">指名</div>
                            </div>
                          </th>
                          <th></th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200">
                        {courseFeeData.filter(course => course.type === 'B').map((course) => {
                          const calculatedShares = calculateCourseFeeShares(
                            course.price,
                            course.hostessShare.free.percentage,
                            course.hostessShare.panel.percentage,
                            course.hostessShare.nomination.percentage
                          );

                          return (
                            <tr key={course.id} className="hover:bg-gray-50">
                              <td className="px-2 py-2 font-medium">{course.courseName}</td>
                              <td className="px-2 py-2">{course.gmDivision}</td>
                              <td className="px-2 py-2">
                                <span className={`inline-flex px-2 py-1 text-xs rounded ${
                                  course.courseType === 'Standard' ? 'bg-gray-100 text-gray-800' :
                                  course.courseType === 'Gold' ? 'bg-yellow-100 text-yellow-800' : 
                                  'bg-purple-100 text-purple-800'
                                }`}>
                                  {course.courseType}
                                </span>
                              </td>
                              <td className="px-2 py-2 text-right">{course.duration}分</td>
                              <td className="px-2 py-2 text-right font-medium">¥{course.price.toLocaleString()}</td>
                              <td className="px-1 py-2 bg-red-50">
                                <div className="grid grid-cols-3 gap-1 text-xs">
                                  <div className="text-center">
                                    <div className="text-red-700">{course.hostessShare.free.percentage}%</div>
                                    <div className="font-medium">¥{calculatedShares.hostessShare.free.amount.toLocaleString()}</div>
                                  </div>
                                  <div className="text-center">
                                    <div className="text-red-700">{course.hostessShare.panel.percentage}%</div>
                                    <div className="font-medium">¥{calculatedShares.hostessShare.panel.amount.toLocaleString()}</div>
                                  </div>
                                  <div className="text-center">
                                    <div className="text-red-700">{course.hostessShare.nomination.percentage}%</div>
                                    <div className="font-medium">¥{calculatedShares.hostessShare.nomination.amount.toLocaleString()}</div>
                                  </div>
                                </div>
                              </td>
                              <td className="px-1 py-2 bg-blue-50">
                                <div className="grid grid-cols-3 gap-1 text-xs">
                                  <div className="text-center">
                                    <div className="font-medium text-blue-700">¥{calculatedShares.storeShare.free.amount.toLocaleString()}</div>
                                  </div>
                                  <div className="text-center">
                                    <div className="font-medium text-blue-700">¥{calculatedShares.storeShare.panel.amount.toLocaleString()}</div>
                                  </div>
                                  <div className="text-center">
                                    <div className="font-medium text-blue-700">¥{calculatedShares.storeShare.nomination.amount.toLocaleString()}</div>
                                  </div>
                                </div>
                              </td>
                              <td className="px-2 py-2 text-center">
                                <div className="flex gap-1 justify-center">
                                  <Button 
                                    variant="outline" 
                                    size="sm"
                                    className="h-6 px-2 text-xs"
                                    onClick={() => handleEditCourseFee(course.id)}
                                  >
                                    <Edit className="w-3 h-3" />
                                  </Button>
                                  <Button 
                                    variant="destructive" 
                                    size="sm"
                                    className="h-6 px-2 text-xs"
                                    onClick={() => {
                                      if (window.confirm(`${course.courseName}を削除しますか？`)) {
                                        handleDeleteCourseFee(course.id);
                                      }
                                    }}
                                  >
                                    <Minus className="w-3 h-3" />
                                  </Button>
                                </div>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                  
                  {courseFeeData.filter(course => course.type === 'B').length === 0 && (
                    <div className="text-center text-gray-500 py-8">
                      <div className="text-sm">B種別のコースが登録されていません</div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        );

      case 'staff-composition':
        const staffData = staffCompositions;
        return (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold">人事構成</h3>
              <Button size="sm" className="flex items-center gap-2">
                <Plus className="w-4 h-4" />
                追加
              </Button>
            </div>
            <div className="bg-white rounded-lg border">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b">
                    <tr>
                      <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">従業員ID</th>
                      <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">氏名</th>
                      <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">役職</th>
                      <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">部署</th>
                      <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">開始日</th>
                      <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">ステータス</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {staffData.map((staff) => (
                      <tr key={staff.id} className="hover:bg-gray-50">
                        <td className="px-4 py-3 text-sm font-mono">{staff.staffId}</td>
                        <td className="px-4 py-3 text-sm font-medium">{staff.staffName}</td>
                        <td className="px-4 py-3 text-sm">{staff.position}</td>
                        <td className="px-4 py-3 text-sm">{staff.department}</td>
                        <td className="px-4 py-3 text-sm">{staff.startDate}</td>
                        <td className="px-4 py-3 text-sm">
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                            staff.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                          }`}>
                            {staff.isActive ? '在職' : '退職'}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        );

      case 'sales-data':
        const salesDataForStore = salesData;
        return (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold">売上/単価/ロング</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              {salesDataForStore.slice(0, 1).map((data) => (
                <React.Fragment key={data.id}>
                  <Card>
                    <CardContent className="p-4">
                      <div className="text-center">
                        <div className="text-2xl font-bold text-green-600">¥{data.totalSales.toLocaleString()}</div>
                        <div className="text-sm text-gray-500">売上合計</div>
                      </div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="p-4">
                      <div className="text-center">
                        <div className="text-2xl font-bold text-blue-600">¥{data.averageSpend.toLocaleString()}</div>
                        <div className="text-sm text-gray-500">平均単価</div>
                      </div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="p-4">
                      <div className="text-center">
                        <div className="text-2xl font-bold text-purple-600">{data.longSessionCount}</div>
                        <div className="text-sm text-gray-500">ロング件数</div>
                      </div>
                    </CardContent>
                  </Card>
                </React.Fragment>
              ))}
            </div>
            <div className="bg-white rounded-lg border">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b">
                    <tr>
                      <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">日付</th>
                      <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">売上</th>
                      <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">客数</th>
                      <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">平均単価</th>
                      <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">ロング件数</th>
                      <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">平均時間</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {salesDataForStore.map((sales) => (
                      <tr key={sales.id} className="hover:bg-gray-50">
                        <td className="px-4 py-3 text-sm">{sales.date}</td>
                        <td className="px-4 py-3 text-sm font-medium">¥{sales.totalSales.toLocaleString()}</td>
                        <td className="px-4 py-3 text-sm">{sales.customerCount}名</td>
                        <td className="px-4 py-3 text-sm">¥{sales.averageSpend.toLocaleString()}</td>
                        <td className="px-4 py-3 text-sm">{sales.longSessionCount}件</td>
                        <td className="px-4 py-3 text-sm">{sales.averageSessionDuration}分</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        );

      case 'discounts':
        const discountData = discountSampleData.filter(discount => discount.storeId === selectedStoreId);
        
        return (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold">割引</h3>
              <Button size="sm" className="flex items-center gap-2">
                <Plus className="w-4 h-4" />
                追加
              </Button>
            </div>
            
            <div className="bg-white rounded-lg border">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b">
                    <tr>
                      <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">割引名</th>
                      <th className="px-4 py-3 text-right text-sm font-medium text-gray-700">金額</th>
                      <th className="px-4 py-3 text-center text-sm font-medium text-gray-700">現状</th>
                      <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">備考</th>
                      <th className="px-4 py-3 text-center text-sm font-medium text-gray-700">ソート順</th>
                      <th className="px-4 py-3 text-center text-sm font-medium text-gray-700">操作</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {discountData
                      .sort((a, b) => {
                        // ソート順がある場合は優先、ない場合は後ろに配置
                        if (a.sortOrder && b.sortOrder) return a.sortOrder - b.sortOrder;
                        if (a.sortOrder && !b.sortOrder) return -1;
                        if (!a.sortOrder && b.sortOrder) return 1;
                        return 0;
                      })
                      .map((discount) => (
                        <tr key={discount.id} className="hover:bg-gray-50">
                          <td className="px-4 py-3 text-sm font-medium">{discount.discountName}</td>
                          <td className="px-4 py-3 text-sm text-right font-medium">¥{discount.amount.toLocaleString()}</td>
                          <td className="px-4 py-3 text-sm text-center">
                            <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                              discount.status === '使用中' 
                                ? 'bg-green-100 text-green-800' 
                                : discount.status === '中止'
                                ? 'bg-yellow-100 text-yellow-800'
                                : 'bg-red-100 text-red-800'
                            }`}>
                              {discount.status}
                            </span>
                          </td>
                          <td className="px-4 py-3 text-sm text-gray-600">{discount.notes || '-'}</td>
                          <td className="px-4 py-3 text-sm text-center">
                            {discount.sortOrder ? (
                              <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-blue-100 text-blue-800 text-xs font-medium">
                                {discount.sortOrder}
                              </span>
                            ) : (
                              '-'
                            )}
                          </td>
                          <td className="px-4 py-3 text-sm text-center">
                            <div className="flex gap-1 justify-center">
                              <Button 
                                variant="outline" 
                                size="sm"
                                className="h-6 px-2 text-xs"
                              >
                                <Edit className="w-3 h-3" />
                              </Button>
                              <Button 
                                variant="destructive" 
                                size="sm"
                                className="h-6 px-2 text-xs"
                                onClick={() => {
                                  if (window.confirm(`${discount.discountName}を削除しますか？`)) {
                                    // 削除処理（将来実装）
                                    // TODO: 削除API呼び出しを実装
                                  }
                                }}
                              >
                                <Minus className="w-3 h-3" />
                              </Button>
                            </div>
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
              
              {discountData.length === 0 && (
                <div className="text-center text-gray-500 py-8">
                  <div className="text-sm">割引が登録されていません</div>
                </div>
              )}
            </div>
          </div>
        );

      case 'options':
        const optionData = storeOptionsSampleData.filter(option => option.storeId === selectedStoreId);
        
        return (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold">オプション</h3>
              <Button size="sm" className="flex items-center gap-2">
                <Plus className="w-4 h-4" />
                追加
              </Button>
            </div>

            {/* A種別とB種別で分けたテーブル */}
            <div className="space-y-6">
              {/* A種別テーブル */}
              <div>
                <h4 className="text-md font-semibold mb-3 text-gray-800 border-b border-gray-300 pb-2 flex items-center gap-2">
                  <span className="inline-flex px-2 py-1 text-xs font-semibold rounded bg-green-100 text-green-800">A</span>
                  A種別
                </h4>
                <div className="bg-white rounded-lg border">
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead className="bg-gray-50 border-b">
                        <tr>
                          <th className="px-3 py-2 text-left font-medium text-gray-700">オプション名</th>
                          <th className="px-3 py-2 text-right font-medium text-gray-700">金額</th>
                          <th className="px-3 py-2 text-right font-medium text-gray-700">店舗取分</th>
                          <th className="px-3 py-2 text-right font-medium text-gray-700">ホステス取分</th>
                          <th className="px-3 py-2 text-center font-medium text-gray-700">Webコード</th>
                          <th className="px-3 py-2 text-center font-medium text-gray-700">表示順</th>
                          <th className="px-3 py-2 text-center font-medium text-gray-700">操作</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200">
                        {optionData
                          .filter(option => option.type === 'A')
                          .sort((a, b) => {
                            // 表示順がある場合は優先、ない場合は後ろに配置
                            if (a.displayOrder && b.displayOrder) return a.displayOrder - b.displayOrder;
                            if (a.displayOrder && !b.displayOrder) return -1;
                            if (!a.displayOrder && b.displayOrder) return 1;
                            return 0;
                          })
                          .map((option) => (
                            <tr key={option.id} className="hover:bg-gray-50">
                              <td className="px-3 py-2 font-medium">{option.optionName}</td>
                              <td className="px-3 py-2 text-right font-medium">¥{option.amount.toLocaleString()}</td>
                              <td className="px-3 py-2 text-right font-medium text-blue-700">¥{option.storeShare.toLocaleString()}</td>
                              <td className="px-3 py-2 text-right font-medium text-red-700">¥{option.hostessShare.toLocaleString()}</td>
                              <td className="px-3 py-2 text-center">
                                <span className="inline-flex px-2 py-1 text-xs font-mono bg-gray-100 text-gray-800 rounded">
                                  {option.webCode}
                                </span>
                              </td>
                              <td className="px-3 py-2 text-center">
                                {option.displayOrder ? (
                                  <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-blue-100 text-blue-800 text-xs font-medium">
                                    {option.displayOrder}
                                  </span>
                                ) : (
                                  '-'
                                )}
                              </td>
                              <td className="px-3 py-2 text-center">
                                <div className="flex gap-1 justify-center">
                                  <Button 
                                    variant="outline" 
                                    size="sm"
                                    className="h-6 px-2 text-xs"
                                  >
                                    <Edit className="w-3 h-3" />
                                  </Button>
                                  <Button 
                                    variant="destructive" 
                                    size="sm"
                                    className="h-6 px-2 text-xs"
                                    onClick={() => {
                                      if (window.confirm(`${option.optionName}を削除しますか？`)) {
                                        // 削除処理（将来実装）
                                        // TODO: 削除API呼び出しを実装
                                      }
                                    }}
                                  >
                                    <Minus className="w-3 h-3" />
                                  </Button>
                                </div>
                              </td>
                            </tr>
                          ))}
                      </tbody>
                    </table>
                  </div>
                  
                  {optionData.filter(option => option.type === 'A').length === 0 && (
                    <div className="text-center text-gray-500 py-8">
                      <div className="text-sm">A種別のオプションが登録されていません</div>
                    </div>
                  )}
                </div>
              </div>

              {/* B種別テーブル */}
              <div>
                <h4 className="text-md font-semibold mb-3 text-gray-800 border-b border-gray-300 pb-2 flex items-center gap-2">
                  <span className="inline-flex px-2 py-1 text-xs font-semibold rounded bg-orange-100 text-orange-800">B</span>
                  B種別
                </h4>
                <div className="bg-white rounded-lg border">
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead className="bg-gray-50 border-b">
                        <tr>
                          <th className="px-3 py-2 text-left font-medium text-gray-700">オプション名</th>
                          <th className="px-3 py-2 text-right font-medium text-gray-700">金額</th>
                          <th className="px-3 py-2 text-right font-medium text-gray-700">店舗取分</th>
                          <th className="px-3 py-2 text-right font-medium text-gray-700">ホステス取分</th>
                          <th className="px-3 py-2 text-center font-medium text-gray-700">Webコード</th>
                          <th className="px-3 py-2 text-center font-medium text-gray-700">表示順</th>
                          <th className="px-3 py-2 text-center font-medium text-gray-700">操作</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200">
                        {optionData
                          .filter(option => option.type === 'B')
                          .sort((a, b) => {
                            // 表示順がある場合は優先、ない場合は後ろに配置
                            if (a.displayOrder && b.displayOrder) return a.displayOrder - b.displayOrder;
                            if (a.displayOrder && !b.displayOrder) return -1;
                            if (!a.displayOrder && b.displayOrder) return 1;
                            return 0;
                          })
                          .map((option) => (
                            <tr key={option.id} className="hover:bg-gray-50">
                              <td className="px-3 py-2 font-medium">{option.optionName}</td>
                              <td className="px-3 py-2 text-right font-medium">¥{option.amount.toLocaleString()}</td>
                              <td className="px-3 py-2 text-right font-medium text-blue-700">¥{option.storeShare.toLocaleString()}</td>
                              <td className="px-3 py-2 text-right font-medium text-red-700">¥{option.hostessShare.toLocaleString()}</td>
                              <td className="px-3 py-2 text-center">
                                <span className="inline-flex px-2 py-1 text-xs font-mono bg-gray-100 text-gray-800 rounded">
                                  {option.webCode}
                                </span>
                              </td>
                              <td className="px-3 py-2 text-center">
                                {option.displayOrder ? (
                                  <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-blue-100 text-blue-800 text-xs font-medium">
                                    {option.displayOrder}
                                  </span>
                                ) : (
                                  '-'
                                )}
                              </td>
                              <td className="px-3 py-2 text-center">
                                <div className="flex gap-1 justify-center">
                                  <Button 
                                    variant="outline" 
                                    size="sm"
                                    className="h-6 px-2 text-xs"
                                  >
                                    <Edit className="w-3 h-3" />
                                  </Button>
                                  <Button 
                                    variant="destructive" 
                                    size="sm"
                                    className="h-6 px-2 text-xs"
                                    onClick={() => {
                                      if (window.confirm(`${option.optionName}を削除しますか？`)) {
                                        // 削除処理（将来実装）
                                        // TODO: 削除API呼び出しを実装
                                      }
                                    }}
                                  >
                                    <Minus className="w-3 h-3" />
                                  </Button>
                                </div>
                              </td>
                            </tr>
                          ))}
                      </tbody>
                    </table>
                  </div>
                  
                  {optionData.filter(option => option.type === 'B').length === 0 && (
                    <div className="text-center text-gray-500 py-8">
                      <div className="text-sm">B種別のオプションが登録されていません</div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        );
      
      default:
        return (
          <div className="text-center text-gray-500 py-8">
            <Settings className="w-12 h-12 mx-auto mb-4 text-gray-300" />
            <h3 className="text-lg font-semibold mb-2">{storeLedgerTabs.find(tab => tab.id === tabId)?.label}</h3>
            <p>このタブは準備中です</p>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="flex h-screen">
        {/* 左側：店舗一覧 */}
        <div className="w-[300px] bg-white border-r border-gray-200 flex flex-col">
          {/* ヘッダー */}
          <div className="p-4 border-b border-gray-200">
            <div className="flex items-center gap-3 mb-4">
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => router.push('/dashboard')}
                className="flex items-center gap-2"
              >
                <ArrowLeft className="w-4 h-4" />
                戻る
              </Button>
            </div>
            <div className="flex items-center gap-3">
              <Building className="w-6 h-6" />
              <h1 className="text-xl font-bold">店舗台帳</h1>
            </div>
          </div>

          {/* 店舗一覧 */}
          <div className="flex-1 flex flex-col overflow-hidden">
            <div className="p-4 pb-2">
              <h2 className="text-sm font-semibold text-gray-700">店舗一覧</h2>
            </div>
            <div className="flex-1 px-4 pb-4">
              <ScrollArea className="h-full">
                <div className="space-y-2 pr-2">
                  {storeList.length === 0 ? (
                    <div className="text-center text-gray-500 py-4">店舗データがありません</div>
                  ) : (
                    storeList.map((storeName) => (
                      <button
                        key={storeName}
                        onClick={() => setSelectedStore(storeName)}
                        className={`w-full text-left p-3 rounded-lg transition-colors ${
                          selectedStore === storeName
                            ? 'bg-blue-50 border border-blue-200 text-blue-700'
                            : 'hover:bg-gray-50 border border-transparent'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <Building className="w-4 h-4" />
                          <div>
                            <div className="font-medium">{storeName}</div>
                            <div className="text-xs text-gray-500">
                              {storeBasicInfoList?.find(s => s.storeName === storeName)?.storeCode || ''}
                            </div>
                          </div>
                        </div>
                      </button>
                    ))
                  )}
                </div>
              </ScrollArea>
            </div>
          </div>
        </div>

        {/* 右側：タブコンテンツ */}
        <div className="flex-1 flex flex-col">
          {/* 選択店舗情報ヘッダー */}
          <div className="bg-white border-b border-gray-200 p-4">
            <div className="flex items-center gap-3">
              <Building className="w-5 h-5 text-blue-600" />
              <h2 className="text-lg font-semibold">{selectedStore}</h2>
              {selectedStoreInfo && (
                <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                  selectedStoreInfo.isActive 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-red-100 text-red-800'
                }`}>
                  {selectedStoreInfo.isActive ? '営業中' : '休業中'}
                </span>
              )}
            </div>
          </div>

          {/* タブコンテンツ */}
          <div className="flex-1 bg-gray-50">
            <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as StoreLedgerTab)} className="h-full flex flex-col">
              {/* タブリスト */}
              <div className="bg-white border-b border-gray-200">
                <ScrollArea className="w-full">
                  <TabsList className="flex w-full justify-start h-auto p-1 bg-transparent">
                    {storeLedgerTabs.map((tab) => {
                      const IconComponent = tabIcons[tab.id];
                      return (
                        <TabsTrigger
                          key={tab.id}
                          value={tab.id}
                          className="flex items-center gap-2 px-4 py-3 text-sm font-medium whitespace-nowrap data-[state=active]:bg-blue-50 data-[state=active]:text-blue-700 data-[state=active]:border-b-2 data-[state=active]:border-blue-600"
                        >
                          <IconComponent className="w-4 h-4" />
                          {tab.label}
                        </TabsTrigger>
                      );
                    })}
                  </TabsList>
                </ScrollArea>
              </div>

              {/* タブコンテンツエリア */}
              <div className="flex-1 overflow-hidden">
                {storeLedgerTabs.map((tab) => (
                  <TabsContent key={tab.id} value={tab.id} className="h-full m-0">
                    <ScrollArea className="h-full">
                      <div className="p-6">
                        {renderTabContent(tab.id)}
                      </div>
                    </ScrollArea>
                  </TabsContent>
                ))}
              </div>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  );
}

