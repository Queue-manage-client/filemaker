'use client';

// 店舗台帳データ管理用カスタムフック
// サンプルデータを使用（API不要）

import { useState, useMemo } from 'react';
import { CourseFee, StoreLedgerTab } from '@/types';
import { calculateCourseFeeShares } from '@/lib/utils';
import { BasicTag } from '@/types/basic-tag';
import {
  storeBasicInfoSampleData,
  gmDivisionSampleData,
  courseFeeSampleData,
  staffCompositionSampleData,
  salesDataSampleData,
} from '@/data/storeLedgerSampleData';
import { basicTagSampleData } from '@/data/basicTagSampleData';

// 店舗一覧取得フック（サンプルデータから取得）
export function useStoreBasicInfo() {
  return {
    data: storeBasicInfoSampleData,
    isLoading: false,
    error: null,
  };
}

// 選択された店舗の基本情報取得フック
export function useStoreBasicInfoByName(storeName: string) {
  const storeInfo = useMemo(() => {
    return storeBasicInfoSampleData.find(s => s.storeName === storeName) || null;
  }, [storeName]);

  return {
    data: storeInfo,
    isLoading: false,
    error: null,
  };
}

// 基本タグ取得フック（サンプルデータから取得）
export function useBasicTags() {
  return {
    data: basicTagSampleData,
    isLoading: false,
    error: null,
  };
}

// 選択された店舗の基本タグ取得フック
export function useBasicTagByStoreName(storeName: string) {
  const basicTag = useMemo(() => {
    return basicTagSampleData.find(t => t.storeName === storeName) || null;
  }, [storeName]);

  return {
    data: basicTag,
    isLoading: false,
    error: null,
  };
}

// 店舗台帳メイン管理フック
export function useStoreLedger(initialStore?: string) {
  const [selectedStore, setSelectedStore] = useState<string>(initialStore || '');
  const [activeTab, setActiveTab] = useState<StoreLedgerTab>('basic');
  const [editingCourseId, setEditingCourseId] = useState<string | null>(null);
  const [editForms, setEditForms] = useState<Record<string, CourseFee>>({});
  const [courseFees, setCourseFees] = useState<CourseFee[]>(courseFeeSampleData);

  // 選択された店舗の情報取得
  const selectedStoreInfo = useMemo(() => {
    return storeBasicInfoSampleData.find(s => s.storeName === selectedStore) || null;
  }, [selectedStore]);

  const selectedStoreId = useMemo(() => selectedStoreInfo?.id || '', [selectedStoreInfo]);

  // 基本タグ取得
  const basicTag = useMemo(() => {
    return basicTagSampleData.find(t => t.storeName === selectedStore) || null;
  }, [selectedStore]);

  // コース料金操作ハンドラー
  const handleDeleteCourseFee = async (id: string) => {
    setCourseFees(prev => prev.filter(c => c.id !== id));
  };

  const handleAddCourseFee = async () => {
    if (!selectedStoreId) return;

    const newCourseFee: CourseFee = {
      id: `new-${Date.now()}`,
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

    setCourseFees(prev => [...prev, newCourseFee]);
  };

  const handleEditCourseFee = (id: string) => {
    const courseToEdit = courseFees.find(course => course.id === id);
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

    setCourseFees(prev => prev.map(c => c.id === courseToSave.id ? courseToSave : c));

    setEditForms(prev => {
      const newForms = { ...prev };
      delete newForms[updatedCourse.id];
      return newForms;
    });
    setEditingCourseId(null);
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

    // データ（サンプルデータ）
    basicTag,
    gmDivisions: gmDivisionSampleData,
    courseFees,
    staffCompositions: staffCompositionSampleData,
    salesData: salesDataSampleData,

    // ローディング状態（常にfalse）
    isLoading: {
      basicTag: false,
      gmDivisions: false,
      courseFees: false,
      staffCompositions: false,
      salesData: false,
    },

    // エラー状態（常にnull）
    errors: {
      basicTag: null,
      gmDivisions: null,
      courseFees: null,
      staffCompositions: null,
      salesData: null,
    },

    // ミューテーション状態（常にfalse）
    isMutating: {
      creating: false,
      updating: false,
      deleting: false,
    },

    // 操作ハンドラー
    handleDeleteCourseFee,
    handleAddCourseFee,
    handleEditCourseFee,
    handleSaveCourseFee,
    handleCancelEdit,
  };
}
