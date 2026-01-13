'use client';

// 店舗台帳データ管理用カスタムフック
// React Queryを使用してデータの状態管理を行う

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useState, useMemo } from 'react';
import { storeLedgerService } from '@/services/store-ledger-service';
import { CourseFee, StoreLedgerTab } from '@/types';
import { calculateCourseFeeShares } from '@/lib/utils';
import { useShopList } from './use-shop';
import { Shop } from '@/types/shop';
import { BasicTag } from '@/types/basic-tag';

// クエリキー定数
const QUERY_KEYS = {
  STORE_BASIC_INFO: 'store-basic-info',
  BASIC_TAGS: 'basic-tags',
  GM_DIVISIONS: 'gm-divisions',
  COURSE_FEES: 'course-fees',
  STAFF_COMPOSITIONS: 'staff-compositions',
  SALES_DATA: 'sales-data',
} as const;

// shopデータをBasicTag形式に変換する関数
function convertShopToBasicTag(shop: Shop): BasicTag {
  return {
    spid: shop.spid || 0,
    dailyReportDisplay: true, // shopテーブルにないためデフォルト値
    departmentNo: shop.department_no?.toString() || '',
    accountingCategory: (shop.accounting_category as 'A' | 'B' | 'C' | 'D' | 'E') || 'A',
    nonSameDayWorkGroup: '', // shopテーブルにないため空文字
    storeName: shop.store_name || '',
    storeNameKana: shop.store_name_furigana || '',
    storeNameAbbr: shop.store_name_short || '',
    phoneNumber: shop.phone_number || '',
    url: shop.url || '',
    email: shop.mail || '',
    webLinkage: shop.is_web || false,
    webSendMode: '本', // shopテーブルにないためデフォルト値
    webManageId: shop.web_management_id || '',
    webManagePassword: '', // セキュリティのため空文字
    webManageUrl: shop.web_management_url || '',
    hostessPageUrl: shop.hostess_page_url || '',
    webHostessListUrl: shop.hostess_list_url || '',
    hostessAttendanceManageUrl: shop.hostess_attendance_management_url || '',
    hostessManageUrl: shop.hostess_management_url || '',
    webSendUrls: {
      hsprofile: shop.send_hsprofile || '',
      hsattend: shop.send_hsattend || '',
      hsjob: shop.send_hsjob || '',
      ctpoint: shop.send_ctpoint || '',
      hstattendweek: '', // shopテーブルにないため空文字
      hsstart: shop.send_hsstart || '',
      hsranking: shop.send_hsranking || '',
    },
    webSendUrlsTemp: {
      hsprofile: '',
      hsattend: '',
      hsjob: '',
      ctpoint: '',
      hstattendweek: '',
      hsstart: '',
      hsranking: '',
    },
    coursePricingMethod: shop.course_fee_style ? '定額制' : '割合制',
    nominationMethod: shop.nomination_fee_style ? '店舗一律' : 'ホステス別',
    gmDivision: shop.gm_category ? '有' : '無',
    nominationFee: shop.nomination_fee || 0,
    extensionFee: shop.extension_fee || 0,
    extensionUnit: shop.extension_per_minutes || 0,
    basicTransportationFee: shop.standard_transportation_expenses || 0,
    cancellationFee: shop.cancel_fee || 0,
    memberCardIssuance: shop.is_membership_card ? '有' : '無',
    customerPointInitialValueFirstHalf: shop.customer_point_initial_former || 0,
    customerPointInitialValueSecondHalf: shop.customer_point_initial_latter || 0,
    nominationPlusBackSystem: shop.is_nomination_plusback ? '有' : '無',
    changeFee: shop.change_fee || 0,
    cardCommissionRate: shop.card_commission || 0,
    basicHostessReceivingRate: shop.standard_hostess_recieve_rate?.toString() || '',
    extensionMethod: shop.extension_style === 'fixed_rate' ? '固定割合制' : 'ホステス別',
    extensionHostessReceivingRate: shop.extension_hostess_recieve_rate?.toString() || '',
    panelNominationFee: shop.panel_nomination_fee || 0,
    starUnitPrice: shop.star_price?.toString() || '',
    starFeeExcludeFrNR: '無', // shopテーブルにないためデフォルト値
    businessType: shop.business_style === 'delivery_health' ? 'デリヘル' : 'ホテヘル',
    memberNumberIssuanceManagement: shop.membership_number_management ? '店舗' : 'グループ',
    storeSpecificMemberNumberIssuance: '', // shopテーブルにないため空文字
    groupNo: shop.group_no?.toString() || '',
    groupCommonMemberNumberIssuance: '', // shopテーブルにないため空文字
    firstHalfStartTime: shop.former_start || '',
    firstHalfEndTime: shop.former_end || '',
    secondHalfStartTime: shop.latter_start || '',
    secondHalfEndTime: shop.latter_end || '',
  };
}

// shopデータをStoreBasicInfo形式に変換する関数
function convertShopToStoreBasicInfo(shop: Shop) {
  return {
    id: shop.id,
    storeName: shop.store_name || '',
    storeCode: shop.spid?.toString() || '',
    address: '', // shopテーブルにないため空文字
    phoneNumber: shop.phone_number || '',
    email: shop.mail || undefined,
    businessHours: {
      open: shop.former_start || '',
      close: shop.latter_end || '',
    },
    capacity: 0, // shopテーブルにないためデフォルト値
    isActive: true, // shopテーブルにないためデフォルト値
    notes: undefined,
  };
}

// 店舗一覧取得フック（shopテーブルから取得）
export function useStoreBasicInfo() {
  const { data: shops = [], isLoading, error } = useShopList();
  
  const storeBasicInfoList = useMemo(() => {
    return shops.map(convertShopToStoreBasicInfo);
  }, [shops]);

  return {
    data: storeBasicInfoList,
    isLoading,
    error,
  };
}

// 選択された店舗の基本情報取得フック
export function useStoreBasicInfoByName(storeName: string) {
  const { data: shops = [], isLoading, error } = useShopList();
  
  const storeInfo = useMemo(() => {
    const shop = shops.find(s => s.store_name === storeName);
    return shop ? convertShopToStoreBasicInfo(shop) : null;
  }, [shops, storeName]);

  return {
    data: storeInfo,
    isLoading,
    error,
  };
}

// 基本タグ取得フック（shopテーブルから取得）
export function useBasicTags() {
  const { data: shops = [], isLoading, error } = useShopList();
  
  const basicTags = useMemo(() => {
    return shops.map(convertShopToBasicTag);
  }, [shops]);

  return {
    data: basicTags,
    isLoading,
    error,
  };
}

// 選択された店舗の基本タグ取得フック
export function useBasicTagByStoreName(storeName: string) {
  const { data: shops = [], isLoading, error } = useShopList();
  
  const basicTag = useMemo(() => {
    const shop = shops.find(s => s.store_name === storeName);
    return shop ? convertShopToBasicTag(shop) : null;
  }, [shops, storeName]);

  return {
    data: basicTag,
    isLoading,
    error,
  };
}

// GM区分取得フック
export function useGMDivisionsByStoreId(storeId: string) {
  return useQuery({
    queryKey: [QUERY_KEYS.GM_DIVISIONS, 'by-store', storeId],
    queryFn: () => storeLedgerService.getGMDivisionsByStoreId(storeId),
    enabled: !!storeId,
    staleTime: 5 * 60 * 1000,
  });
}

// コース料金取得フック
export function useCourseFeesByStoreId(storeId: string) {
  return useQuery({
    queryKey: [QUERY_KEYS.COURSE_FEES, 'by-store', storeId],
    queryFn: () => storeLedgerService.getCourseFeesByStoreId(storeId),
    enabled: !!storeId,
    staleTime: 5 * 60 * 1000,
  });
}

// 人事構成取得フック
export function useStaffCompositionsByStoreId(storeId: string) {
  return useQuery({
    queryKey: [QUERY_KEYS.STAFF_COMPOSITIONS, 'by-store', storeId],
    queryFn: () => storeLedgerService.getStaffCompositionsByStoreId(storeId),
    enabled: !!storeId,
    staleTime: 5 * 60 * 1000,
  });
}

// 売上データ取得フック
export function useSalesDataByStoreId(storeId: string) {
  return useQuery({
    queryKey: [QUERY_KEYS.SALES_DATA, 'by-store', storeId],
    queryFn: () => storeLedgerService.getSalesDataByStoreId(storeId),
    enabled: !!storeId,
    staleTime: 5 * 60 * 1000,
  });
}

// コース料金作成ミューテーション
export function useCreateCourseFee() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (courseFee: Omit<CourseFee, 'id'>) => 
      storeLedgerService.createCourseFee(courseFee),
    onSuccess: () => {
      // コース料金のキャッシュを無効化
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.COURSE_FEES]
      });
    },
  });
}

// コース料金更新ミューテーション
export function useUpdateCourseFee() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, updates }: { id: string; updates: Partial<CourseFee> }) =>
      storeLedgerService.updateCourseFee(id, updates),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.COURSE_FEES]
      });
    },
  });
}

// コース料金削除ミューテーション
export function useDeleteCourseFee() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => storeLedgerService.deleteCourseFee(id),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.COURSE_FEES]
      });
    },
  });
}

// 店舗台帳メイン管理フック
export function useStoreLedger(initialStore?: string) {
  const [selectedStore, setSelectedStore] = useState<string>(initialStore || '');
  const [activeTab, setActiveTab] = useState<StoreLedgerTab>('basic');
  const [editingCourseId, setEditingCourseId] = useState<string | null>(null);
  const [editForms, setEditForms] = useState<Record<string, CourseFee>>({});

  // 選択された店舗の情報取得
  const { data: selectedStoreInfo } = useStoreBasicInfoByName(selectedStore);
  // selectedStoreIdをuseMemoでメモ化して不要な再計算を防ぐ
  const selectedStoreId = useMemo(() => selectedStoreInfo?.id || '', [selectedStoreInfo]);

  // 各種データ取得
  const basicTagQuery = useBasicTagByStoreName(selectedStore);
  const gmDivisionsQuery = useGMDivisionsByStoreId(selectedStoreId);
  const courseFeesQuery = useCourseFeesByStoreId(selectedStoreId);
  const staffCompositionsQuery = useStaffCompositionsByStoreId(selectedStoreId);
  const salesDataQuery = useSalesDataByStoreId(selectedStoreId);

  // ミューテーション
  const createCourseFee = useCreateCourseFee();
  const updateCourseFee = useUpdateCourseFee();
  const deleteCourseFee = useDeleteCourseFee();

  // コース料金操作ハンドラー
  const handleDeleteCourseFee = async (id: string) => {
    try {
      await deleteCourseFee.mutateAsync(id);
    } catch {
      // エラーハンドリング：削除失敗時の処理
      // TODO: ユーザーにエラーメッセージを表示
    }
  };

  const handleAddCourseFee = async () => {
    if (!selectedStoreId) return;

    const newCourseFee: Omit<CourseFee, 'id'> = {
      storeId: selectedStoreId,
      courseName: '新規コース',
      gmDivision: 'ガールズ',
      courseType: 'Standard',
      type: 'A',
      duration: 60,
      price: 15000,
      hostessShare: {
        free: { percentage: 40, amount: 6000 },
        panel: { percentage: 45, amount: 6750 },
        nomination: { percentage: 50, amount: 7500 }
      },
      storeShare: {
        free: { amount: 9000 },
        panel: { amount: 8250 },
        nomination: { amount: 7500 }
      },
      isActive: true
    };

    try {
      await createCourseFee.mutateAsync(newCourseFee);
    } catch {
      // エラーハンドリング：追加失敗時の処理
      // TODO: ユーザーにエラーメッセージを表示
    }
  };

  const handleEditCourseFee = (id: string) => {
    const courseToEdit = courseFeesQuery.data?.find(course => course.id === id);
    if (courseToEdit) {
      setEditForms(prev => ({ ...prev, [id]: courseToEdit }));
      setEditingCourseId(id);
    }
  };

  const handleSaveCourseFee = async (updatedCourse: CourseFee) => {
    // 取分を再計算
    const calculatedShares = calculateCourseFeeShares(
      updatedCourse.price,
      updatedCourse.hostessShare.free.percentage,
      updatedCourse.hostessShare.panel.percentage,
      updatedCourse.hostessShare.nomination.percentage
    );

    const courseToSave = {
      ...updatedCourse,
      hostessShare: calculatedShares.hostessShare,
      storeShare: calculatedShares.storeShare
    };

    try {
      await updateCourseFee.mutateAsync({
        id: updatedCourse.id,
        updates: courseToSave
      });
      
      setEditForms(prev => {
        const newForms = { ...prev };
        delete newForms[updatedCourse.id];
        return newForms;
      });
      setEditingCourseId(null);
    } catch {
      // エラーハンドリング：保存失敗時の処理
      // TODO: ユーザーにエラーメッセージを表示
    }
  };

  const handleCancelEdit = () => {
    if (editingCourseId) {
      setEditForms(prev => {
        const newForms = { ...prev };
        delete newForms[editingCourseId];
        return newForms;
      });
    }
    setEditingCourseId(null);
  };

  return {
    // 状態
    selectedStore,
    setSelectedStore,
    activeTab,
    setActiveTab,
    selectedStoreInfo,
    selectedStoreId,
    editingCourseId,
    editForms,
    setEditForms,

    // データ
    basicTag: basicTagQuery.data,
    gmDivisions: gmDivisionsQuery.data || [],
    courseFees: courseFeesQuery.data || [],
    staffCompositions: staffCompositionsQuery.data || [],
    salesData: salesDataQuery.data || [],

    // ローディング状態
    isLoading: {
      basicTag: basicTagQuery.isLoading,
      gmDivisions: gmDivisionsQuery.isLoading,
      courseFees: courseFeesQuery.isLoading,
      staffCompositions: staffCompositionsQuery.isLoading,
      salesData: salesDataQuery.isLoading,
    },

    // エラー状態
    errors: {
      basicTag: basicTagQuery.error,
      gmDivisions: gmDivisionsQuery.error,
      courseFees: courseFeesQuery.error,
      staffCompositions: staffCompositionsQuery.error,
      salesData: salesDataQuery.error,
    },

    // ミューテーション状態
    isMutating: {
      creating: createCourseFee.isPending,
      updating: updateCourseFee.isPending,
      deleting: deleteCourseFee.isPending,
    },

    // 操作ハンドラー
    handleDeleteCourseFee,
    handleAddCourseFee,
    handleEditCourseFee,
    handleSaveCourseFee,
    handleCancelEdit,
  };
}
