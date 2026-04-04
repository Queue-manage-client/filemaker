'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ArrowLeft, Search, Plus, Download } from "lucide-react";
import {
  JOB_TYPE_LABELS,
  ROLE_LABELS,
  STAFF_EMPLOYMENT_STATUS_LABELS,
  ACCESS_TYPE_LABELS,
  ACCESS_STATUS_LABELS
} from '@/types';
import { EMPLOYMENT_TYPE_LABELS, type EmploymentType } from '@/types/staff-attendance';
import { useStaffLedger } from '@/hooks/use-staff';

type EmploymentStatusFilter = 'all' | 'active' | 'retired';
type EmployeeTypeFilter = 'all' | 'employee' | 'part_time';

const KANA_ROWS: Record<string, string[]> = {
  'あ': ['あ','い','う','え','お'],
  'か': ['か','き','く','け','こ','が','ぎ','ぐ','げ','ご'],
  'さ': ['さ','し','す','せ','そ','ざ','じ','ず','ぜ','ぞ'],
  'た': ['た','ち','つ','て','と','だ','ぢ','づ','で','ど'],
  'な': ['な','に','ぬ','ね','の'],
  'は': ['は','ひ','ふ','へ','ほ','ば','び','ぶ','べ','ぼ','ぱ','ぴ','ぷ','ぺ','ぽ'],
  'ま': ['ま','み','む','め','も'],
  'や': ['や','ゆ','よ'],
  'ら': ['ら','り','る','れ','ろ'],
  'わ': ['わ','を','ん'],
};

export default function StaffLedger() {
  const [searchQuery, setSearchQuery] = useState('');
  const [employmentStatusFilter, setEmploymentStatusFilter] = useState<EmploymentStatusFilter>('all');
  const [employeeTypeFilter, setEmployeeTypeFilter] = useState<EmployeeTypeFilter>('all');
  const [kanaFilter, setKanaFilter] = useState<string>('all');

  React.useEffect(() => {
    document.title = 'スタッフ台帳 - Dispatch Harmony Hub';
  }, []);
  
  // React Queryを使用してデータ取得
  const { data: staffs = [], isLoading, error } = useStaffLedger();

  // 検索・フィルタリング
  const filteredStaffs = useMemo(() => {
    return staffs.filter(staff => {
      if (employmentStatusFilter === 'active' && staff.employmentStatus !== 'active') return false;
      if (employmentStatusFilter === 'retired' && staff.employmentStatus !== '') return false;

      if (employeeTypeFilter === 'employee' && staff.employmentType !== 'employee') return false;
      if (employeeTypeFilter === 'part_time' && staff.employmentType !== 'part_time') return false;

      if (kanaFilter !== 'all') {
        const fullNameKana = `${staff.lastNameKana ?? ''}${staff.firstNameKana ?? ''}`.toLowerCase();
        const fullName = `${staff.lastName}${staff.firstName}`;
        const reading = fullNameKana || fullName;
        const allowedKana = KANA_ROWS[kanaFilter] ?? [];
        if (!allowedKana.some(k => reading.startsWith(k))) return false;
      }

      if (!searchQuery) return true;
      const q = searchQuery.toLowerCase();
      const fullName = `${staff.lastName}${staff.firstName}`;
      const fullNameKana = `${staff.lastNameKana ?? ''}${staff.firstNameKana ?? ''}`;
      return (
        fullName.toLowerCase().includes(q) ||
        fullNameKana.toLowerCase().includes(q) ||
        staff.sfid.toLowerCase().includes(q) ||
        staff.accountName.toLowerCase().includes(q) ||
        ROLE_LABELS[staff.role].toLowerCase().includes(q)
      );
    });
  }, [staffs, searchQuery, employmentStatusFilter, employeeTypeFilter, kanaFilter]);


  const formatDateTime = (dateTimeString: string) => {
    // 'YYYY-MM-DD HH:MM:SS' or ISO → 'YYYY/MM/DD HH:MM:SS'
    if (!dateTimeString) return '';
    // ISO形式の場合（2024-01-10T09:00:00+09:00）
    if (dateTimeString.includes('T')) {
      const [datePart, timePart] = dateTimeString.split('T');
      const timeOnly = timePart ? timePart.split(/[+\-Z]/)[0] : '';
      return `${datePart.replace(/-/g, '/')} ${timeOnly}`;
    }
    // すでに 'YYYY-MM-DD HH:MM:SS' 形式の場合
    const [datePart, timePart] = dateTimeString.split(' ');
    if (datePart && timePart) {
      return `${datePart.replace(/-/g, '/')} ${timePart}`;
    }
    // 日付のみの場合
    return dateTimeString.replace(/-/g, '/');
  };

  const exportToCSV = () => {
    // CSVエクスポート機能（実装例）
    const headers = [
      'No', 'SFID', '氏名', '雇用区分', '職務', '役割', '在職', '調整率',
      'アカウント名', 'アクセス権', 'アクセス権ステータス', '登録日時', '更新日時'
    ];

    const csvData = filteredStaffs.map((staff, index) => [
      index + 1,
      staff.sfid,
      `${staff.lastName}${staff.firstName}`,
      EMPLOYMENT_TYPE_LABELS[staff.employmentType as EmploymentType],
      staff.jobTypes.map(jobType => JOB_TYPE_LABELS[jobType]).join('・'),
      ROLE_LABELS[staff.role],
      STAFF_EMPLOYMENT_STATUS_LABELS[staff.employmentStatus],
      staff.adjustmentRate,
      staff.accountName,
      ACCESS_TYPE_LABELS[staff.accessType],
      ACCESS_STATUS_LABELS[staff.accessStatus],
      formatDateTime(staff.createdAt),
      formatDateTime(staff.updatedAt)
    ]);

    const csvContent = [headers, ...csvData]
      .map(row => row.map(field => `"${field}"`).join(','))
      .join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `staff_ledger_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const openStaffDetailWindow = (id: string) => {
    try {
      const url = `/staff-ledger/${id}`;
      const features = 'noopener,noreferrer,width=1280,height=900,scrollbars=yes,resizable=yes';
      window.open(url, `staffDetail_${id}`, features);
    } catch {
      // UI_001: 新規ウィンドウオープン失敗（個人情報非出力）
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* 戻るボタン */}
      <div className="p-4">
        <Link href="/dashboard">
          <Button
            variant="outline"
            className="flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            ダッシュボードに戻る
          </Button>
        </Link>
      </div>

      {/* ヘッダー */}
      <div className="px-4 mb-4">
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <h1 className="text-xl font-bold">スタッフ台帳</h1>
              {error && (
                <span className="text-red-600 text-sm">データ取得に失敗しました</span>
              )}
              {isLoading && (
                <span className="text-gray-600 text-sm">読み込み中...</span>
              )}

              <div className="flex items-center gap-4">
                {/* 新規追加ボタン */}
                <Button variant="outline" size="sm" className="bg-green-100">
                  <Plus className="w-4 h-4 mr-1" />
                  新規追加
                </Button>

                {/* CSVエクスポート */}
                <Button variant="outline" size="sm" onClick={exportToCSV}>
                  <Download className="w-4 h-4 mr-1" />
                  CSV出力
                </Button>

                {/* 検索 */}
                <div className="flex items-center gap-2">
                  <Input
                    placeholder="氏名・SFID・アカウント名・役職で検索"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-64"
                  />
                  <Button variant="outline" size="sm">
                    <Search className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>

            {/* フィルター */}
            <div className="flex flex-col gap-3 mt-3">
              {/* あかさたな順フィルター */}
              <div className="flex items-center gap-1">
                <span className="text-xs text-gray-500 mr-1 whitespace-nowrap">かな:</span>
                <div className="flex flex-wrap gap-1">
                  {['全て','あ','か','さ','た','な','は','ま','や','ら','わ'].map(kana => (
                    <button
                      key={kana}
                      type="button"
                      onClick={() => setKanaFilter(kana === '全て' ? 'all' : kana)}
                      className={`h-7 px-2 text-xs rounded border transition-colors ${
                        kanaFilter === (kana === '全て' ? 'all' : kana)
                          ? 'bg-blue-600 text-white border-blue-600'
                          : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                      }`}
                    >
                      {kana}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex items-center gap-6">
              {/* 在職ステータスフィルター */}
              <div className="flex items-center gap-1">
                <span className="text-xs text-gray-500 mr-1">在職:</span>
                {(['all', 'active', 'retired'] as const).map((value) => {
                  const label = value === 'all' ? '全て' : value === 'active' ? '現職' : '退職';
                  return (
                    <button
                      key={value}
                      type="button"
                      onClick={() => setEmploymentStatusFilter(value)}
                      className={`px-3 py-1 text-xs rounded border transition-colors ${
                        employmentStatusFilter === value
                          ? 'bg-blue-600 text-white border-blue-600'
                          : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                      }`}
                    >
                      {label}
                    </button>
                  );
                })}
              </div>

              {/* 雇用区分フィルター */}
              <div className="flex items-center gap-1">
                <span className="text-xs text-gray-500 mr-1">雇用区分:</span>
                {(['all', 'employee', 'part_time'] as const).map((value) => {
                  const label = value === 'all' ? '全て' : value === 'employee' ? '社員' : 'アルバイト';
                  return (
                    <button
                      key={value}
                      type="button"
                      onClick={() => setEmployeeTypeFilter(value)}
                      className={`px-3 py-1 text-xs rounded border transition-colors ${
                        employeeTypeFilter === value
                          ? 'bg-blue-600 text-white border-blue-600'
                          : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                      }`}
                    >
                      {label}
                    </button>
                  );
                })}
              </div>
              </div>
            </div>
          </CardHeader>
        </Card>
      </div>

      {/* メインコンテンツ */}
      <div className="px-4">
        <Card>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full text-xs border-collapse">
                <thead>
                  <tr className="bg-gray-200">
                    <th className="border border-gray-300 px-1 py-2 w-8">No</th>
                    <th className="border border-gray-300 px-2 py-2 w-20">SFID</th>
                    <th className="border border-gray-300 px-2 py-2 w-24">氏名</th>
                    <th className="border border-gray-300 px-2 py-2 w-16">雇用区分</th>
                    <th className="border border-gray-300 px-2 py-2 w-20">職務</th>
                    <th className="border border-gray-300 px-2 py-2 w-20">役割</th>
                    <th className="border border-gray-300 px-2 py-2 w-12">在職</th>
                    <th className="border border-gray-300 px-2 py-2 w-16">調整率</th>
                    <th className="border border-gray-300 px-2 py-2 w-24">アカウント名</th>
                    <th className="border border-gray-300 px-2 py-2 w-20">アクセス権</th>
                    <th className="border border-gray-300 px-2 py-2 w-16">ステータス</th>
                    <th className="border border-gray-300 px-2 py-2 w-32">担当キャスト</th>
                    <th className="border border-gray-300 px-2 py-2 w-32">登録日時</th>
                    <th className="border border-gray-300 px-2 py-2 w-32">更新日時</th>
                    <th className="border border-gray-300 px-2 py-2 w-20">操作</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredStaffs.map((staff, index) => (
                    <tr key={staff.id} className="hover:bg-gray-50">
                      <td className="border border-gray-300 px-1 py-2 text-center font-semibold">
                        {index + 1}
                      </td>
                      <td className="border border-gray-300 px-2 py-2 text-center font-mono">
                        {staff.sfid}
                      </td>
                      <td className="border border-gray-300 px-2 py-2 font-semibold">
                        <Link
                          href={`/staff-ledger/${staff.id}`}
                          className="text-blue-700 hover:underline"
                        >
                          {staff.lastName}{staff.firstName}
                        </Link>
                      </td>
                      <td className="border border-gray-300 px-2 py-2 text-center">
                        <span className={`px-2 py-1 rounded text-xs ${
                          staff.employmentType === 'employee'
                            ? 'bg-blue-100 text-blue-800'
                            : 'bg-green-100 text-green-800'
                        }`}>
                          {EMPLOYMENT_TYPE_LABELS[staff.employmentType as EmploymentType]}
                        </span>
                      </td>
                      <td className="border border-gray-300 px-2 py-2 text-center">
                        <div className="flex flex-wrap gap-0.5 justify-center">
                          {staff.jobTypes.map(jobType => (
                            <span key={jobType} className={`px-1.5 py-0.5 rounded text-[10px] inline-block whitespace-nowrap ${
                              jobType === 'driver'
                                ? 'bg-orange-100 text-orange-800'
                                : 'bg-purple-100 text-purple-800'
                            }`}>
                              {JOB_TYPE_LABELS[jobType]}
                            </span>
                          ))}
                        </div>
                      </td>
                      <td className="border border-gray-300 px-2 py-2">
                        <span className={`px-2 py-1 rounded text-xs ${
                          staff.role === 'chairman' || staff.role === 'president'
                            ? 'bg-red-100 text-red-800'
                            : staff.role.includes('manager')
                            ? 'bg-blue-100 text-blue-800'
                            : 'bg-gray-100 text-gray-800'
                        }`}>
                          {ROLE_LABELS[staff.role]}
                        </span>
                      </td>
                      <td className="border border-gray-300 px-2 py-2 text-center">
                        {staff.employmentStatus === 'active' && (
                          <span className="px-2 py-1 rounded text-xs bg-green-100 text-green-800">
                            在職
                          </span>
                        )}
                      </td>
                      <td className="border border-gray-300 px-2 py-2 text-center">
                        {staff.adjustmentRate.toFixed(2)}
                      </td>
                      <td className="border border-gray-300 px-2 py-2 font-mono text-sm">
                        {staff.accountName}
                      </td>
                      <td className="border border-gray-300 px-2 py-2 text-center">
                        <span className={`px-2 py-1 rounded text-xs ${
                          staff.accessType === 'admin'
                            ? 'bg-red-100 text-red-800'
                            : staff.accessType === 'manager'
                            ? 'bg-blue-100 text-blue-800'
                            : staff.accessType === 'accounting_manager'
                            ? 'bg-green-100 text-green-800'
                            : 'bg-gray-100 text-gray-800'
                        }`}>
                          {ACCESS_TYPE_LABELS[staff.accessType]}
                        </span>
                      </td>
                      <td className="border border-gray-300 px-2 py-2 text-center">
                        <span className={`px-2 py-1 rounded text-xs ${
                          staff.accessStatus === 'active'
                            ? 'bg-green-100 text-green-800'
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {ACCESS_STATUS_LABELS[staff.accessStatus]}
                        </span>
                      </td>
                      <td className="border border-gray-300 px-2 py-2 max-w-[128px] overflow-hidden">
                        {staff.assignedCasts && staff.assignedCasts.length > 0 ? (
                          <div className="flex flex-wrap gap-0.5">
                            {staff.assignedCasts.slice(0, 3).map(cast => (
                              <Link
                                key={cast.id}
                                href={`/hostess-ledger?id=${cast.id}`}
                                className="text-blue-600 underline cursor-pointer hover:text-blue-800 text-[10px] whitespace-nowrap"
                              >
                                {cast.name}
                              </Link>
                            ))}
                            {staff.assignedCasts.length > 3 && (
                              <span className="text-gray-500 text-[10px]" title={staff.assignedCasts.map(c => c.name).join(', ')}>
                                +{staff.assignedCasts.length - 3}名
                              </span>
                            )}
                          </div>
                        ) : (
                          <span className="text-gray-400 text-xs">-</span>
                        )}
                      </td>
                      <td className="border border-gray-300 px-2 py-2 text-center font-mono text-xs">
                        {formatDateTime(staff.createdAt)}
                      </td>
                      <td className="border border-gray-300 px-2 py-2 text-center font-mono text-xs">
                        {formatDateTime(staff.updatedAt)}
                      </td>
                      <td className="border border-gray-300 px-2 py-2 text-center">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => openStaffDetailWindow(staff.id)}
                        >
                          編集
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* フッター - 統計情報 */}
      <div className="p-4 mt-4">
        <div className="flex flex-wrap items-center gap-6 text-xs text-gray-600">
          <div className="flex items-center gap-2">
            <span className="font-semibold">総件数:</span>
            <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded">
              {filteredStaffs.length}件
            </span>
          </div>

          <div className="flex items-center gap-2">
            <span className="font-semibold">社員:</span>
            <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded">
              {filteredStaffs.filter(s => s.employmentType === 'employee').length}件
            </span>
          </div>

          <div className="flex items-center gap-2">
            <span className="font-semibold">アルバイト:</span>
            <span className="bg-green-100 text-green-800 px-2 py-1 rounded">
              {filteredStaffs.filter(s => s.employmentType === 'part_time').length}件
            </span>
          </div>

          <div className="flex items-center gap-2">
            <span className="font-semibold">在職者:</span>
            <span className="bg-green-100 text-green-800 px-2 py-1 rounded">
              {filteredStaffs.filter(s => s.employmentStatus === 'active').length}件
            </span>
          </div>

          <div className="flex items-center gap-2">
            <span className="font-semibold">アクセス権有効:</span>
            <span className="bg-green-100 text-green-800 px-2 py-1 rounded">
              {filteredStaffs.filter(s => s.accessStatus === 'active').length}件
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}