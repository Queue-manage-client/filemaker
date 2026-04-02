'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowLeft, Search, Plus, Download, Calendar, BarChart3, List, AlignJustify } from "lucide-react";
import type { InterviewRecord } from '@/types';
import { INTERVIEW_TYPE_LABELS, INTERVIEW_RESULT_LABELS, EMPLOYMENT_STATUS_LABELS, INTERVIEW_PROGRESS_LABELS } from '@/types';
import { interviewSampleData, mediaList } from '@/data/interviewSampleData';

// 集計データの型定義
interface AggregatedData {
  key: string;
  total: number;
  hired: number;
  pending: number;
  rejected: number;
  cancelled: number;
  declined: number;
  dekasegi: number;
}

export default function InterviewList() {
  const [interviews] = useState<InterviewRecord[]>(interviewSampleData);
  const [searchQuery, setSearchQuery] = useState('');

  // フィルター状態
  const [filterMedia, setFilterMedia] = useState<string>('all');
  const [filterStore, setFilterStore] = useState<string>('all');
  const [filterYear, setFilterYear] = useState<string>('all');
  const [filterMonth, setFilterMonth] = useState<string>('all');

  // 期間設定
  const [startDate, setStartDate] = useState<string>('');
  const [endDate, setEndDate] = useState<string>('');

  // 表示モード（一覧 or 集計）
  const [viewMode, setViewMode] = useState<'list' | 'aggregate'>('list');
  const [aggregateBy, setAggregateBy] = useState<'media' | 'month' | 'year' | 'store'>('media');

  // 表示密度（詳細 or 簡易）
  const [displayMode, setDisplayMode] = useState<'detail' | 'compact'>('detail');

  React.useEffect(() => {
    document.title = '面接リスト - Dispatch Harmony Hub';
  }, []);

  // フィルターオプションを動的に生成
  const filterOptions = useMemo(() => {
    const stores = new Set<string>();
    const years = new Set<string>();
    const months = new Set<string>();

    interviews.forEach(interview => {
      if (interview.assignedStore) stores.add(interview.assignedStore);
      const date = new Date(interview.date);
      years.add(String(date.getFullYear()));
      months.add(String(date.getMonth() + 1).padStart(2, '0'));
    });

    return {
      stores: Array.from(stores).sort(),
      years: Array.from(years).sort().reverse(),
      months: Array.from(months).sort(),
    };
  }, [interviews]);

  // フィルタリング
  const filteredInterviews = useMemo(() => {
    return interviews.filter(interview => {
      // テキスト検索
      const searchMatch =
        interview.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        interview.interviewer.toLowerCase().includes(searchQuery.toLowerCase()) ||
        interview.assignedStaff.toLowerCase().includes(searchQuery.toLowerCase()) ||
        interview.media.toLowerCase().includes(searchQuery.toLowerCase()) ||
        interview.storeName.toLowerCase().includes(searchQuery.toLowerCase());

      if (!searchMatch) return false;

      // 媒体フィルター
      if (filterMedia !== 'all' && interview.media !== filterMedia) return false;

      // 店舗フィルター
      if (filterStore !== 'all' && interview.assignedStore !== filterStore) return false;

      // 年フィルター
      const interviewDate = new Date(interview.date);
      if (filterYear !== 'all' && String(interviewDate.getFullYear()) !== filterYear) return false;

      // 月フィルター
      if (filterMonth !== 'all' && String(interviewDate.getMonth() + 1).padStart(2, '0') !== filterMonth) return false;

      // 期間フィルター
      if (startDate && interview.date < startDate) return false;
      if (endDate && interview.date > endDate) return false;

      return true;
    });
  }, [interviews, searchQuery, filterMedia, filterStore, filterYear, filterMonth, startDate, endDate]);

  // 集計データを計算
  const aggregatedData = useMemo((): AggregatedData[] => {
    const dataMap = new Map<string, AggregatedData>();

    filteredInterviews.forEach(interview => {
      let key: string;
      const date = new Date(interview.date);

      switch (aggregateBy) {
        case 'media':
          key = interview.media || '不明';
          break;
        case 'month':
          key = `${date.getFullYear()}年${String(date.getMonth() + 1).padStart(2, '0')}月`;
          break;
        case 'year':
          key = `${date.getFullYear()}年`;
          break;
        case 'store':
          key = interview.assignedStore || '未定';
          break;
        default:
          key = '不明';
      }

      if (!dataMap.has(key)) {
        dataMap.set(key, {
          key,
          total: 0,
          hired: 0,
          pending: 0,
          rejected: 0,
          cancelled: 0,
          declined: 0,
          dekasegi: 0
        });
      }

      const data = dataMap.get(key)!;
      data.total++;
      if (interview.result === 'hired') data.hired++;
      if (interview.result === 'pending') data.pending++;
      if (interview.result === 'rejected') data.rejected++;
      if (interview.result === 'cancelled') data.cancelled++;
      if (interview.result === 'declined') data.declined++;
      if (interview.isRemoteWork) data.dekasegi++;
    });

    return Array.from(dataMap.values()).sort((a, b) => b.total - a.total);
  }, [filteredInterviews, aggregateBy]);

  // 統計情報を計算
  const statistics = useMemo(() => {
    return {
      total: filteredInterviews.length,
      hired: filteredInterviews.filter(i => i.result === 'hired').length,
      pending: filteredInterviews.filter(i => i.result === 'pending').length,
      rejected: filteredInterviews.filter(i => i.result === 'rejected').length,
      cancelled: filteredInterviews.filter(i => i.result === 'cancelled').length,
      declined: filteredInterviews.filter(i => i.result === 'declined').length,
      dekasegi: filteredInterviews.filter(i => i.isRemoteWork).length,
    };
  }, [filteredInterviews]);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}/${month}/${day}`;
  };

  // フィルターをリセット
  const resetFilters = () => {
    setFilterMedia('all');
    setFilterStore('all');
    setFilterYear('all');
    setFilterMonth('all');
    setStartDate('');
    setEndDate('');
    setSearchQuery('');
  };

  const exportToCSV = () => {
    const headers = [
      'No', '日付', '開始時刻', '面接種類', '出稼ぎ', '氏名', '年齢', '媒体',
      '面接者', '結果', '所属店舗', '店内名', '在職', '担当者', '電話番号', 'メールアドレス', '場所', '備考'
    ];

    const csvData = filteredInterviews.map((interview, index) => [
      index + 1,
      formatDate(interview.date),
      interview.startTime,
      INTERVIEW_TYPE_LABELS[interview.interviewType],
      interview.isRemoteWork ? '○' : '',
      interview.name,
      interview.age,
      interview.media,
      interview.interviewer,
      INTERVIEW_RESULT_LABELS[interview.result],
      interview.assignedStore,
      interview.storeName,
      EMPLOYMENT_STATUS_LABELS[interview.employmentStatus],
      interview.assignedStaff,
      interview.phoneNumber || '',
      interview.email || '',
      interview.location || '',
      interview.notes || ''
    ]);

    const csvContent = [headers, ...csvData]
      .map(row => row.map(field => `"${field}"`).join(','))
      .join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `interview_list_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
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
              <h1 className="text-xl font-bold">面接リスト</h1>

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
                    placeholder="氏名・面接者・担当者・媒体で検索"
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

            {/* フィルター＆期間設定 */}
            <div className="flex flex-wrap items-center gap-3 mt-3 pt-3 border-t">
              {/* 期間設定 */}
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-gray-500" />
                <span className="text-xs font-medium">期間:</span>
                <Input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="w-32 h-7 text-xs"
                />
                <span className="text-xs">〜</span>
                <Input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="w-32 h-7 text-xs"
                />
              </div>

              {/* 年フィルター */}
              <Select value={filterYear} onValueChange={setFilterYear}>
                <SelectTrigger className="w-20 h-7 text-xs">
                  <SelectValue placeholder="年" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">全年</SelectItem>
                  {filterOptions.years.map(y => (
                    <SelectItem key={y} value={y}>{y}年</SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {/* 月フィルター */}
              <Select value={filterMonth} onValueChange={setFilterMonth}>
                <SelectTrigger className="w-20 h-7 text-xs">
                  <SelectValue placeholder="月" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">全月</SelectItem>
                  {filterOptions.months.map(m => (
                    <SelectItem key={m} value={m}>{parseInt(m)}月</SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {/* 媒体フィルター */}
              <Select value={filterMedia} onValueChange={setFilterMedia}>
                <SelectTrigger className="w-28 h-7 text-xs">
                  <SelectValue placeholder="媒体" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">全媒体</SelectItem>
                  {mediaList.map(m => (
                    <SelectItem key={m} value={m}>{m}</SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {/* 店舗フィルター */}
              <Select value={filterStore} onValueChange={setFilterStore}>
                <SelectTrigger className="w-28 h-7 text-xs">
                  <SelectValue placeholder="店舗" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">全店舗</SelectItem>
                  {filterOptions.stores.map(s => (
                    <SelectItem key={s} value={s}>{s}</SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {/* リセットボタン */}
              <Button variant="outline" size="sm" onClick={resetFilters} className="h-7 text-xs">
                リセット
              </Button>

              {/* 表示切替 */}
              <div className="flex items-center gap-1 ml-auto">
                <Button
                  variant={viewMode === 'list' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setViewMode('list')}
                  className="h-7 text-xs"
                >
                  <List className="w-3 h-3 mr-1" />
                  一覧
                </Button>
                <Button
                  variant={viewMode === 'aggregate' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setViewMode('aggregate')}
                  className="h-7 text-xs"
                >
                  <BarChart3 className="w-3 h-3 mr-1" />
                  集計
                </Button>
                {viewMode === 'aggregate' && (
                  <Select value={aggregateBy} onValueChange={(v) => setAggregateBy(v as typeof aggregateBy)}>
                    <SelectTrigger className="w-24 h-7 text-xs">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="media">媒体別</SelectItem>
                      <SelectItem value="month">月別</SelectItem>
                      <SelectItem value="year">年別</SelectItem>
                      <SelectItem value="store">店舗別</SelectItem>
                    </SelectContent>
                  </Select>
                )}

                {/* 詳細/簡易 切替（一覧モード時のみ） */}
                {viewMode === 'list' && (
                  <>
                    <span className="mx-1 text-gray-300">|</span>
                    <Button
                      variant={displayMode === 'detail' ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setDisplayMode('detail')}
                      className="h-7 text-xs"
                    >
                      詳細表示
                    </Button>
                    <Button
                      variant={displayMode === 'compact' ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setDisplayMode('compact')}
                      className="h-7 text-xs"
                    >
                      <AlignJustify className="w-3 h-3 mr-1" />
                      簡易表示
                    </Button>
                  </>
                )}
              </div>
            </div>
          </CardHeader>
        </Card>
      </div>

      {/* メインコンテンツ */}
      <div className="px-4">
        <Card>
          <CardContent className="p-0">
            {viewMode === 'list' ? (
              displayMode === 'compact' ? (
                /* 簡易表示（配車パネル向け） */
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse" style={{ fontSize: '11px' }}>
                    <thead>
                      <tr className="bg-gray-200">
                        <th className="border border-gray-300 px-1 py-1 w-8 text-center">No</th>
                        <th className="border border-gray-300 px-1 py-1 w-16 text-center">面接日</th>
                        <th className="border border-gray-300 px-1 py-1 w-20">氏名</th>
                        <th className="border border-gray-300 px-1 py-1 w-24">電話番号</th>
                        <th className="border border-gray-300 px-1 py-1 w-16 text-center">進捗</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredInterviews.map((interview, index) => (
                        <tr key={interview.id} className="hover:bg-gray-50">
                          <td className="border border-gray-300 px-1 py-0.5 text-center text-gray-500">
                            {index + 1}
                          </td>
                          <td className="border border-gray-300 px-1 py-0.5 text-center">
                            {formatDate(interview.date)}
                          </td>
                          <td className="border border-gray-300 px-1 py-0.5 font-semibold">
                            {interview.name}
                          </td>
                          <td className="border border-gray-300 px-1 py-0.5">
                            {interview.phoneNumber || '—'}
                          </td>
                          <td className="border border-gray-300 px-1 py-0.5 text-center">
                            {interview.progress ? (
                              <span className={`px-1 py-0.5 rounded ${
                                interview.progress === 'uncontacted' ? 'bg-gray-100 text-gray-700' :
                                interview.progress === 'contacted' ? 'bg-blue-100 text-blue-800' :
                                interview.progress === 'scheduled' ? 'bg-purple-100 text-purple-800' :
                                interview.progress === 'completed' ? 'bg-teal-100 text-teal-800' :
                                interview.progress === 'hired' ? 'bg-green-100 text-green-800' :
                                interview.progress === 'rejected' ? 'bg-gray-200 text-gray-700' :
                                'bg-red-100 text-red-800'
                              }`}>
                                {INTERVIEW_PROGRESS_LABELS[interview.progress]}
                              </span>
                            ) : '—'}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-xs border-collapse">
                  <thead>
                    <tr className="bg-gray-200">
                      <th className="border border-gray-300 px-2 py-2 w-10">No</th>
                      <th className="border border-gray-300 px-2 py-2 w-20">日付</th>
                      <th className="border border-gray-300 px-2 py-2 w-16">開始時刻</th>
                      <th className="border border-gray-300 px-2 py-2 w-16 whitespace-nowrap">面接種類</th>
                      <th className="border border-gray-300 px-2 py-2 w-12">出稼ぎ</th>
                      <th className="border border-gray-300 px-2 py-2 w-20">氏名</th>
                      <th className="border border-gray-300 px-2 py-2 w-12">年齢</th>
                      <th className="border border-gray-300 px-2 py-2 w-20">媒体</th>
                      <th className="border border-gray-300 px-2 py-2 w-20">面接者</th>
                      <th className="border border-gray-300 px-2 py-2 w-16">結果</th>
                      <th className="border border-gray-300 px-2 py-2 w-20">進捗</th>
                      <th className="border border-gray-300 px-2 py-2 w-20">所属店舗</th>
                      <th className="border border-gray-300 px-2 py-2 w-20">店内名</th>
                      <th className="border border-gray-300 px-2 py-2 w-12">在職</th>
                      <th className="border border-gray-300 px-2 py-2 w-20">担当者</th>
                      <th className="border border-gray-300 px-2 py-2 w-28">電話番号</th>
                      <th className="border border-gray-300 px-2 py-2 w-40">メールアドレス</th>
                      <th className="border border-gray-300 px-2 py-2 w-28">場所</th>
                      <th className="border border-gray-300 px-2 py-2 w-32">備考</th>
                      <th className="border border-gray-300 px-2 py-2 min-w-[150px]">アンケート</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredInterviews.map((interview, index) => (
                      <tr key={interview.id} className="hover:bg-gray-50">
                        <td className="border border-gray-300 px-2 py-2 text-center font-semibold">
                          {index + 1}
                        </td>
                        <td className="border border-gray-300 px-2 py-2 text-center">
                          {formatDate(interview.date)}
                        </td>
                        <td className="border border-gray-300 px-2 py-2 text-center">
                          {interview.startTime}
                        </td>
                        <td className="border border-gray-300 px-2 py-2 text-center whitespace-nowrap">
                          <span className={`px-2 py-1 rounded text-xs ${
                            interview.interviewType === 'driver' ? 'bg-blue-100 text-blue-800' :
                            interview.interviewType === 'staff' ? 'bg-green-100 text-green-800' :
                            'bg-pink-100 text-pink-800'
                          }`}>
                            {INTERVIEW_TYPE_LABELS[interview.interviewType]}
                          </span>
                        </td>
                        <td className="border border-gray-300 px-2 py-2 text-center">
                          <Checkbox
                            checked={interview.isRemoteWork}
                            className="w-4 h-4"
                            disabled
                          />
                        </td>
                        <td className="border border-gray-300 px-2 py-2 font-semibold">
                          {interview.name}
                        </td>
                        <td className="border border-gray-300 px-2 py-2 text-center">
                          {interview.age}
                        </td>
                        <td className="border border-gray-300 px-2 py-2">
                          {interview.media}
                        </td>
                        <td className="border border-gray-300 px-2 py-2">
                          {interview.interviewer}
                        </td>
                        <td className="border border-gray-300 px-2 py-2 text-center">
                          <span className={`px-2 py-1 rounded text-xs ${
                            interview.result === 'hired' ? 'bg-green-100 text-green-800' :
                            interview.result === 'cancelled' ? 'bg-red-100 text-red-800' :
                            interview.result === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                            interview.result === 'declined' ? 'bg-purple-100 text-purple-800' :
                            'bg-gray-100 text-gray-800'
                          }`}>
                            {INTERVIEW_RESULT_LABELS[interview.result]}
                          </span>
                        </td>
                        <td className="border border-gray-300 px-2 py-2 text-center">
                          {interview.progress && (
                            <span className={`px-2 py-1 rounded text-xs ${
                              interview.progress === 'uncontacted' ? 'bg-gray-100 text-gray-700' :
                              interview.progress === 'contacted' ? 'bg-blue-100 text-blue-800' :
                              interview.progress === 'scheduled' ? 'bg-purple-100 text-purple-800' :
                              interview.progress === 'completed' ? 'bg-teal-100 text-teal-800' :
                              interview.progress === 'hired' ? 'bg-green-100 text-green-800' :
                              interview.progress === 'rejected' ? 'bg-gray-200 text-gray-700' :
                              'bg-red-100 text-red-800'
                            }`}>
                              {INTERVIEW_PROGRESS_LABELS[interview.progress]}
                            </span>
                          )}
                        </td>
                        <td className="border border-gray-300 px-2 py-2">
                          {interview.assignedStore}
                        </td>
                        <td className="border border-gray-300 px-2 py-2">
                          {interview.storeName}
                        </td>
                        <td className="border border-gray-300 px-2 py-2 text-center">
                          {interview.employmentStatus === 'retired' && (
                            <span className="px-2 py-1 rounded text-xs bg-red-100 text-red-800">
                              退職
                            </span>
                          )}
                        </td>
                        <td className="border border-gray-300 px-2 py-2">
                          {interview.assignedStaff}
                        </td>
                        <td className="border border-gray-300 px-2 py-2">
                          {interview.phoneNumber || ''}
                        </td>
                        <td className="border border-gray-300 px-2 py-2">
                          {interview.email || ''}
                        </td>
                        <td className="border border-gray-300 px-2 py-2">
                          {interview.location || ''}
                        </td>
                        <td className="border border-gray-300 px-2 py-2 max-w-32 truncate" title={interview.notes}>
                          {interview.notes}
                        </td>
                        <td className="border border-gray-300 px-2 py-2 min-w-[150px]">
                          {interview.surveyContent || '-'}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              )
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-xs border-collapse">
                  <thead>
                    <tr className="bg-gray-200">
                      <th className="border border-gray-300 px-2 py-2 text-left">
                        {aggregateBy === 'media' && '媒体'}
                        {aggregateBy === 'month' && '月'}
                        {aggregateBy === 'year' && '年'}
                        {aggregateBy === 'store' && '店舗'}
                      </th>
                      <th className="border border-gray-300 px-2 py-2 text-center w-16">総件数</th>
                      <th className="border border-gray-300 px-2 py-2 text-center w-16">出稼ぎ</th>
                      <th className="border border-gray-300 px-2 py-2 text-center w-16">入店</th>
                      <th className="border border-gray-300 px-2 py-2 text-center w-16">保留</th>
                      <th className="border border-gray-300 px-2 py-2 text-center w-16">不採用</th>
                      <th className="border border-gray-300 px-2 py-2 text-center w-16">取消</th>
                      <th className="border border-gray-300 px-2 py-2 text-center w-16">辞退</th>
                      <th className="border border-gray-300 px-2 py-2 text-center w-16">入店率</th>
                    </tr>
                  </thead>
                  <tbody>
                    {aggregatedData.map((data) => (
                      <tr key={data.key} className="hover:bg-gray-50">
                        <td className="border border-gray-300 px-2 py-2 font-semibold">
                          {data.key}
                        </td>
                        <td className="border border-gray-300 px-2 py-2 text-center">
                          <span className="bg-blue-100 text-blue-800 px-2 py-0.5 rounded">
                            {data.total}
                          </span>
                        </td>
                        <td className="border border-gray-300 px-2 py-2 text-center">
                          <span className="bg-purple-100 text-purple-800 px-2 py-0.5 rounded">
                            {data.dekasegi}
                          </span>
                        </td>
                        <td className="border border-gray-300 px-2 py-2 text-center">
                          <span className="bg-green-100 text-green-800 px-2 py-0.5 rounded">
                            {data.hired}
                          </span>
                        </td>
                        <td className="border border-gray-300 px-2 py-2 text-center">
                          <span className="bg-yellow-100 text-yellow-800 px-2 py-0.5 rounded">
                            {data.pending}
                          </span>
                        </td>
                        <td className="border border-gray-300 px-2 py-2 text-center">
                          <span className="bg-gray-100 text-gray-800 px-2 py-0.5 rounded">
                            {data.rejected}
                          </span>
                        </td>
                        <td className="border border-gray-300 px-2 py-2 text-center">
                          <span className="bg-red-100 text-red-800 px-2 py-0.5 rounded">
                            {data.cancelled}
                          </span>
                        </td>
                        <td className="border border-gray-300 px-2 py-2 text-center">
                          <span className="bg-purple-100 text-purple-800 px-2 py-0.5 rounded">
                            {data.declined}
                          </span>
                        </td>
                        <td className="border border-gray-300 px-2 py-2 text-center font-semibold">
                          {data.total > 0 ? `${Math.round((data.hired / data.total) * 100)}%` : '-'}
                        </td>
                      </tr>
                    ))}
                    {/* 合計行 */}
                    <tr className="bg-gray-100 font-bold">
                      <td className="border border-gray-300 px-2 py-2">合計</td>
                      <td className="border border-gray-300 px-2 py-2 text-center">
                        <span className="bg-blue-200 text-blue-900 px-2 py-0.5 rounded">
                          {statistics.total}
                        </span>
                      </td>
                      <td className="border border-gray-300 px-2 py-2 text-center">
                        <span className="bg-purple-200 text-purple-900 px-2 py-0.5 rounded">
                          {statistics.dekasegi}
                        </span>
                      </td>
                      <td className="border border-gray-300 px-2 py-2 text-center">
                        <span className="bg-green-200 text-green-900 px-2 py-0.5 rounded">
                          {statistics.hired}
                        </span>
                      </td>
                      <td className="border border-gray-300 px-2 py-2 text-center">
                        <span className="bg-yellow-200 text-yellow-900 px-2 py-0.5 rounded">
                          {statistics.pending}
                        </span>
                      </td>
                      <td className="border border-gray-300 px-2 py-2 text-center">
                        <span className="bg-gray-200 text-gray-900 px-2 py-0.5 rounded">
                          {statistics.rejected}
                        </span>
                      </td>
                      <td className="border border-gray-300 px-2 py-2 text-center">
                        <span className="bg-red-200 text-red-900 px-2 py-0.5 rounded">
                          {statistics.cancelled}
                        </span>
                      </td>
                      <td className="border border-gray-300 px-2 py-2 text-center">
                        <span className="bg-purple-200 text-purple-900 px-2 py-0.5 rounded">
                          {statistics.declined}
                        </span>
                      </td>
                      <td className="border border-gray-300 px-2 py-2 text-center">
                        {statistics.total > 0 ? `${Math.round((statistics.hired / statistics.total) * 100)}%` : '-'}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* フッター - 統計情報 */}
      <div className="p-4 mt-4">
        <div className="flex flex-wrap items-center gap-6 text-xs text-gray-600">
          <div className="flex items-center gap-2">
            <span className="font-semibold">総件数:</span>
            <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded">
              {statistics.total}件
            </span>
          </div>

          <div className="flex items-center gap-2">
            <span className="font-semibold">出稼ぎ:</span>
            <span className="bg-purple-100 text-purple-800 px-2 py-1 rounded">
              {statistics.dekasegi}件
            </span>
          </div>

          <div className="flex items-center gap-2">
            <span className="font-semibold">入店:</span>
            <span className="bg-green-100 text-green-800 px-2 py-1 rounded">
              {statistics.hired}件
            </span>
          </div>

          <div className="flex items-center gap-2">
            <span className="font-semibold">保留:</span>
            <span className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded">
              {statistics.pending}件
            </span>
          </div>

          <div className="flex items-center gap-2">
            <span className="font-semibold">不採用:</span>
            <span className="bg-gray-100 text-gray-800 px-2 py-1 rounded">
              {statistics.rejected}件
            </span>
          </div>

          <div className="flex items-center gap-2">
            <span className="font-semibold">取消:</span>
            <span className="bg-red-100 text-red-800 px-2 py-1 rounded">
              {statistics.cancelled}件
            </span>
          </div>

          <div className="flex items-center gap-2">
            <span className="font-semibold">辞退:</span>
            <span className="bg-purple-100 text-purple-800 px-2 py-1 rounded">
              {statistics.declined}件
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
